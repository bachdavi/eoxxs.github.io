@def title = "Reading Source Code"
@def hascode = true

# Reading Source Code

One of the things I like about the [Zig](https://ziglang.org/)
programming language is how readable it is. This applies not only to
projects written in it, but also to the standard library, compiler,
and build system themselves. Whenever I need to look up how to use
something in `std`, I open the Zig source code in my editor and search
for it.

The language design makes this quite easy and enjoyable. Files are
structs, which are namespaces that contain definitions such as
functions, types, or literals. There are no generated functions, no
macros, and no inheritance. If I see a function, I can easily find it.

Over time, reading source code compounds. I am exposed to a lot of
high-quality code from maintainers and creators of the language. I
develop a mental map of it. It starts to fit into my head.

Let's take an example from a recent project I was working on. It
required working with columnar data for a certain schema. I thought
about using `std.MultiArrayList` for this. It is much more efficient
to store records column-wise rather than row-wise; see [AoS and
SoA](https://en.wikipedia.org/wiki/AoS_and_SoA).

Searching for this term leads me to the implementation in the standard
library, under `multi_array_list.zig`, as shown below:

```zig
pub fn MultiArrayList(comptime T: type) type {
    return struct {
        /// ... comment ...
        bytes: [*]u8 = undefined,
        len: usize = 0,
        capacity: usize = 0,
        /// ... implementation ...
}
```

A `MultiArrayList` is a generic type in Zig. It takes a struct or
union, here the `comptime T: type` argument, and returns a data
structure specialized to my element type. Internally, it stores the
arrays as a single, contiguous block of memory. An `ArrayList` would
instead store my elements directly as a `[]T`.

This representation is more memory efficient because no padding is
needed, and it is more cache- and SIMD-friendly without losing
ergonomics.

`MultiArrayList` has the usual array API: `get`, `set`, and `append`,
which operate on the element type, `T: type` above. I can also access
the arrays directly via `.slice()`, which computes and caches start
pointers for each field. `.items(.<field>)` on that gives me the array
for a single field. Under the hood, that does a
`@ptrCast(@alignCast(byte_ptr))` on the bytes and returns a slice of
the original field. The compiler guarantees that both the field name
and slice type are valid.

These days, with Claude Code and friends, reading how `MultiArrayList`
is implemented is likely not what most people would do. That Zig
naturally leads me to it is refreshing and, in my opinion, one of the
great features of Zig.
