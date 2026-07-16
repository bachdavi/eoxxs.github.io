@def title = "Comptime is funtime: Per-Span State Without a Hash Map"
@def hascode = true

# Comptime is funtime: Per-Span State Without a Hash Map

In my free time, I have been following Casey Muratori's excellent
[Performance-Aware Programming
Series](https://www.computerenhance.com/p/table-of-contents). In Part
2: Basic Profiling, the task is to build a simple profiler. While doing
so, I discovered a neat feature of Zig's comptime and generics.

The profiler is supposed to be easy to use, accurate, and, crucially,
have low overhead. It has the three global variables shown
below. These are not thread-safe, as we intentionally only want to
profile single-threaded programs:
- A buffer of spans with a fixed capacity holding the timings for each profiling block.
- The current index.
- The current parent index.

The fixed size means we can only have up to that number of unique
spans. That is fine because we are instrumenting our code and it is
unlikely we want to time more than `4096` **unique** functions or
blocks.

```zig
var spans: [4096]Span = undefined;
var current_index: SpanIndex = .reserved;
var current_parent_index: ?SpanIndex = null;

pub const Span = struct {
    name: []const u8,
    elapsed: u64,
    elapsed_children: u64,
    hit_count: u64,
};

const SpanIndex = enum(u32) {
    reserved = 0,
    _,
};
```

Each span is identified by its `name`, and it tracks how much time has
elapsed, how much time its children took, and how many times it has
been called. When we instrument our code, spans will be written into
the `spans` buffer in the order of invocation. If a function that we
profile is called twice, we don't add another span, we increment the
existing span's values.


The API has two functions, `beginBlock` and `endBlock`, and can be used
in the following way:

```zig 
pub fn beginBlock(comptime name: []const u8) SpanBlock {}

pub fn endBlock(block: SpanBlock) void {}

fn readFile() !void {
    const block = profile.beginBlock("readFile");
    defer profile.endBlock(block);

    // ... implementation ...
}
```

Note: We could use `@src()` instead but I opted for the string variant
for now. 

When `endBlock(block)` runs, we store the elapsed time for
this span in the `spans` buffer.

The question is: How do we compute the index of a particular span in
the `spans` buffer **without** maintaining a `HashMap` between block
name and index?

In the course, Casey uses `__COUNTER__` from C++, which _"gives an
increasing non-negative integral value each time it is used."_ At each
call site, the `beginBlock` function would get a unique index for it
span **at compile time**. We don't have this in Zig. Actually, we could
have done this a while ago, but since
[#19414](https://github.com/ziglang/zig/pull/19414), global mutable
comptime state is no longer allowed.

In Zig, containers are namespaces that can contain top-level mutable
declarations. `spans`, `current_index`, and `current_parent_index` are
the three mutable top-level declarations of the `profile.zig`
container (files are structs themselves). In Zig, generics are
implemented via `comptime`: we write a function that returns a
`type`. If we combine the two, we get the following:

```zig
fn SpanSlot(comptime name: []const u8) type {
    return struct {
        const span_name = name;
        // This is a mutable top-level declaration in this specialized
        // struct, storing the index the span will have in the
        // `spans` buffer.
        var index: ?SpanIndex = null;
    };
}
```

Each time we call `beginBlock`, we call `SpanSlot` to get the
unique container for the given name. Then we look up the `index`
variable in the container, and if it does not exist, we increment the
index counter and store it.

```zig
pub fn beginBlock(comptime name: []const u8) SpanBlock {
    const Slot = SpanSlot(name);

    const span_index: SpanIndex = Slot.index orelse blk: {
        // This is the first time we see a block with this
        // `name`. Increment the index and store it in the container.
        const next: SpanIndex = @enumFromInt(@intFromEnum(current_index) + 1);

        Slot.index = next;

        current_index = next;

        // Initialize the span.
        var span_ptr = &spans[@intFromEnum(next)];
        span_ptr.name = name;
        span_ptr.hit_count = 0;
        span_ptr.elapsed = 0;
        span_ptr.elapsed_children = 0;

        break :blk next;
    };

    /// ...
}
```

When we do `const Slot = SpanSlot(name)`, we get back a `type`, not a
local instance of this `type`. This gives us global mutable state
**per** span without needing to explicitly track all possible spans we
have, at the expense of compilation time.

Our solution is not entirely identical to using `__COUNTER__`. We
still increment the index and store it at runtime. But at least this
way we don't need to keep a hash map around. 

## Bonus 1

What are the effects on compilation time when we have a non-trivial
number of spans? To simulate this I generate a Zig program that
contains increasing number of functions that are timed with unique
names and compiled it using `ReleaseFast`:

- 0 spans : 5 secs
- 100 spans: 5.2 secs
- 1000 spans: 6.8 secs
- 4032 spans: 13.3 secs

To further compare this I edited the 4032 spans version and used the
same span name: 
- 4032 spans (identical): 7.3 secs

Profiling lots of functions does have an effect on compilation time
but gets only really noticeable from 1000 spans onward.

## Bonus 2

If you are wondering how we are tracking time, we are doing something
fun. In the course, Casey uses the `rdtsc` instruction, which measures
something like CPU cycles (invariant cycles in modern CPUs). I'm on a
Mac with an M-series chip, and ARM does not have the `rdtsc`
instruction. But there is another counter we can use for our purposes:

```zig
pub fn readCounter() u64 {
    var val: u64 = undefined;

    asm volatile ("mrs %[val], cntpct_el0"
        : [val] "=r" (val),
    );

    return val;
}
```

`mrs` means that we want to read a system register, in our case,
`cntpct_el0`, which is a hardware counter
[(documentation)](https://developer.arm.com/documentation/ddi0601/2021-12/AArch64-Registers/CNTPCT-EL0--Counter-timer-Physical-Count-register).

If we want to know how much time has elapsed, we can use the
frequency of this counter:

```zig
pub fn readCounterFreq() u64 {
    var val: u64 = undefined;

    asm volatile ("mrs %[val], cntfrq_el0"
        : [val] "=r" (val),
    );

    return val;
}
```

`readCounterFreq` returns 24 MHz on my MacBook. To get the elapsed
time in milliseconds, we do:

```zig
fn msFromElapsed(elapsed: u64) u64 {
    return elapsed * 1000 / readCounterFreq();
}
```

### Bonus 3

Where does Zig store the mutable declarations of structs? I had a look
at the debug executable using `lldb` on my Mac. I'm omitting some
steps, and I had some help from GPT-5.6. First, I looked for symbols
matching one profiling block's `.index` usage. This showed
up:

```text
(lldb)  image lookup -s 'profiler.SpanSlot("readFile"[0..9]).index'
1 symbols match 'profiler.SpanSlot("readFile"[0..9]).index' in ...:
        Address: pap[0x00000001001e8dd8] (pap.__DATA.__bss + 24)
        Summary: pap`profiler.SpanSlot("readFile"[0..9]).index

```

`pap` is the name of the executable. There is already a first
hint. The address `0x00000001001e8dd8` is in the `__DATA,__bss`
section of the macOS executable. That is where global mutable state is
usually stored. Then I set up a watchpoint around that address,
stepping through the program until it is triggered:

```text
(lldb) continue
Process 61200 resuming

Watchpoint 1 hit:
old value: 0
new value: -6148915419949301757
Process 61200 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = watchpoint 1
    frame #0: 0x00000001001140c4 pap`profiler.beginBlock__anon_27318 at profiler.zig:53:9
   50
   51           Slot.index = next;
   52
-> 53           current_index = next;
   54
   55           var span_ptr = &spans[@intFromEnum(next)];
   56           span_ptr.name = name;
Target 0: (pap) stopped.
```

Now we are in the function that I showed above, `beginBlock`, after we
set `Slot.index = next;`. At this time the index should be stored at
that address. So, we inspect it:

```text
(lldb)  memory read --format x --size 8 --count 1 0x00000001001e8dd8
0x1001e8dd8: 0xaaaaaa0100000003
```

And as you can see, the low 32 bits is the value `3`, which I expect
because it is the third block I time in the program.  The following `01`
is the tag indicating that the `?SpanIndex` is non-null, and the
remaining `aa` bytes are padding filled by the debug build.

To summarize: Zig emits `Slot.index` as mutable static storage for
each specialized `SpanSlot` type. That is exactly what we wanted to
achieve and allows us to avoid a runtime hash map.
