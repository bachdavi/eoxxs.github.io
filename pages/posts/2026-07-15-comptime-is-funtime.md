@def title = "Comptime is Funtime"
@def hascode = true

# Comptime is funtime

In my free time I have been following Casey Muratori's excellent
[Performance-Aware Programming
Series](https://www.computerenhance.com/p/table-of-contents). In Part
2: Basic Profiling the task is to build a simple profiler. While doing
so I discovered a neat feature of Zigs comptime and generics.

The profiler is supposed to be easy to use, accurate, and crucially has
low overhead.

Profiling has three global variables depicted below. These are not
thread-safe as we intentionally only want to profile single threaded
programs:
- A buffer of spans with a fixed capacity holding the timings for each profiling block.
- The current index.
- The current parent index

The fixed size means we can only have up to that number of unique
spans. That is fine because we are instrumenting our code and it is
unlikely we want to time more than `4096` **unique** functions or
blocks.

```zig
pub const Span = struct {
    name: []const u8,
    elapsed: u64,
    elapsed_children: u64,
    hit_count: u64,
};

const SpanIndex = enum(usize) {
    reserved = 0,
    _,
};

var spans: [4096]Span = undefined;
var current_index: SpanIndex = .reserved;
var current_parent_index: ?SpanIndex = null;
```

Each span is uniquely identified by its `name` and it tracks how much
time has elapsed, how much time its children took, and how many times
it has been called.

When we instrument our code, spans will be written into the `spans`
buffer in the order of invocation. If a function that we profile is
called twice we don't add another span we increment the existing spans
values.

The API has two functions `beginBlock` and `endBlock` and can be used
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

When `endBlock(block)` runs we store the elapsed time for
this span in the `spans` buffer.

The question is: How do we compute the index of a particular span in
the `spans` buffer **without** maintaining a `HashMap` between block
name and index?

In the course Casey uses `__COUNTER__` from C++ that _"gives an
increasing non-negative integral value each time it is used."_. At
each callsite the `beginBlock` function would get an unique index. We
don't have this in Zig, actually we could have done this a while ago
but since [#19414](https://github.com/ziglang/zig/pull/19414) global mutable
comptime state is no longer allowed.

In Zig containers are namespaces which can contain top-level mutable
declarations. `spans`, `current_index`, and `current_parent_index` are
all three mutable top-level declarations of the `profile.zig`
container. In Zig generics are done via `comptime`. We write a function
that returns a `type`. If we combine the two we get the following:

```zig
fn SpanSlot(comptime name: []const u8) type {
    return struct {
        const span_name = name;
        // This is a mutable top-level declaration in this specialized
        // struct storing the index of the span will have in the
        // `spans` buffer.
        var index: ?SpanIndex = null;
    };
}
```

Each time we call `beginBlock` we will call `SpanSlot` to get the
unique container for the given name. Then we lookup the `index`
variable in the container, and if it does not exist we increment the
index counter and store it.

```zig
pub fn beginBlock(comptime name: []const u8) SpanBlock {
    const Slot = SpanSlot(name);

    const span_index: SpanIndex = Slot.index orelse blk: {
        // This is the first time we see a block with this
        // `name`. Increment the index and store it in the container.
        const next: SpanIndex = @enumFromInt(@intFromEnum(current_index) + 1);

        Slot.index = next;

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

When we do `const Slot = SpanSlot(name)` we get back a `type`, not a
local instance of this `type`. This gives us global mutable state
**per** span without needing to explicitly track all possible spans we
have, at the expense of compile time. 

Our solution is not entirely identical to using `__COUNTER__`. We
still increment the index and store it at runtime. But at least this
way we don't need to keep a hash map around. 

## Bonus 1

What are the effects on compile time when we have a non-trivial number
of spans? To simulate this I wrote an `inline for` loop that creates a
bunch of nested spans:

```zig
@setEvalBranchQuota(4096);
inline for (0..64) |idx1| {
    inline for (0..63) |idx2| {
        const block = profile.beginBlock(&.{ idx1, idx2 });
        profile.endBlock(block);
    }
}
```

Without this snippet compiling my Zig program takes 1500ms on my machine and with
4032 spans it takes 3330 ms. About twice as long.

## Bonus 2

If you are wondering how we are tracking time we are doing something
fun I think (In the course Casey uses the `rdtsc` instruction which
measures something like CPU cycles (invariant cycles in modern
CPUs)). I'm on a Mac with the M chip series and ARM does not have the
`rdtsc` instruction. But there is another counter we can use for our
purposes:

```zig
pub fn readCounter() u64 {
    var val: u64 = undefined;

    asm volatile ("mrs %[val], cntpct_el0"
        : [val] "=r" (val),
    );

    return val;
}
```

`mrs` means that we want to read a system register, in our case
`cntpct_el0`, which is a performance counter
[(documentation)](https://developer.arm.com/documentation/ddi0601/2021-12/AArch64-Registers/CNTPCT-EL0--Counter-timer-Physical-Count-register).

And if we want to know how much time has elapsed we can use the
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

`readCounterFreq` returns 24 MHz on my Macbook. To get elapsed
milliseconds we do:

```zig
fn msFromElapsed(elapsed: u64) u64 {
    return elapsed * 1000 / readCounterFreq();
}
```
