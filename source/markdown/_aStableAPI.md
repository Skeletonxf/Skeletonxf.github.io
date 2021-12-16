# Committing to a Stable API

As a software developer that uses a lot of libraries in my day job I often wondered how Google could make so many changes to a library that the Firebase bill of materials would reach version 29.0.0 - that's almost as many major versions as Android has SDK versions!
In the Rust world cargo and crates.io enforces semver for libraries so breaking changes are supposed to only occur with a major version bump, and many crates are still 'unstable' on 0.x.y versions. Around a year ago I was working on a Rust project that used tokio and looking through all the application's transitive dependencies to debug something. There were some libraries depending on tokio 0.2 and others on 0.3 and then tokio 1.0 was released. For a dependency like tokio which you build an application around having 3 different mostly incompatible versions used by the ecosystem was not fun, and lead to some difficult decisions about reimplementing functionality which was already available in libraries simply to build the functionality against tokio 1.0.

For these kinds of reasons I wanted the library I published to crates.io to commit to a stable API from the start, so other developers would be able to build on top of a stable foundation. As I write this, the Machine Learning ecosystem in Rust is still in its infancy, and many of the major libraries which do exist are still on 0.x.y versions. A snapshot of [lib.rs's machine learning libraries](./images/librs-machine-learning-top-22.png) lists my [easy-ml](https://lib.rs/crates/easy-ml) at the 22nd position. Many of the libraries above it do far more, and are developed by more people, however only [autograd](https://lib.rs/crates/autograd) and [neat-gru](https://lib.rs/crates/neat-gru) have also made at least one stable release.

For a language which reached a stable version 6 years ago, its Machine Learning ecosystem still has a lot of growing to do.

Nonetheless I've already started to build up decisions which I would like to change, and can't yet because they would require breaking changes. I don't plan to avoid an Easy ML version 2.0 forever, but I would like to wait till the breaking changes are important enough to be worthwhile updating any code which depends on the library.

## Releasing version 1.0.0

Easy-ML was actually the second attempt at a matrix library that I wrote. I had tried to develop one before that I never got to a releasable state, but having tried at a matrix library before I knew the general API I wanted without needing to do much experimentation. The only unknown was abstracting over all numerical types. I had looked at [`num-traits`](https://crates.io/crates/num-traits) but I could barely understand it at the time so using it as a dependency was ruled out.

## Referenced numbers

The first decision I locked into version 1.x.y of easy-ml forever was committing the number type traits to also work on references. For primitives like f64 this adds very little value since they are Copy and smaller than a reference. However, it opens up the possibility to do machine learning with greater precision types such as a hypothetical f128 that numpy cannot offer. I discovered [Rust cannot yet define such a trait elegantly](https://stackoverflow.com/questions/59520619/how-do-i-specify-a-generic-trait-for-operations-on-references-to-types), but the workarounds are not much of an issue.

```rust
impl <T: Numeric> Add for Matrix<T>
where for<'a> &'a T: NumericRef<T> { /* ... */ }
```

I'm still not sure I would undo this choice, but now I'm maintaining four times as many mathematical operations as I could have been.

## Adding u8

One less intentional interface I locked in without even realising was including [`Neg`](https://doc.rust-lang.org/std/ops/trait.Neg.html) in the numerical traits. It's not as though I expected unsigned integers to implement Neg, but I was still surprised to realise I couldn't add two `Matrix<u8>` together because the Add implementation required their data to be Numeric and they were not. I could have not required a type to implement every operation from Numeric to just add two matrices, but I'd just created some traits to specify math for referenced types! - I did not want to strike out potential `f128` uses after just introducing support for them. Fortunately the standard library already had `Wrapping<u8>` which does implement `Neg` but the first papercut was born without me realising till after easy-ml 1.0 was released.

## Matrix traits

I deliberately did not introduce any traits to define a Matrix for a long time because the discoverability of trait methods on their implementing types was poor; at the time I think doc sections like `Methods from Deref<Target = [T]>` did not exist. I was also very wary to introduce a trait that I might need to add additional non default methods to later.

## Slicing

After a few versions of using matrices for simple linear algebra tasks I found it was going to be useful to slice into a matrix. Iterator methods for matrices were useful in many cases where python would have had me slicing, but they lost the dimensionality information. I built an API for removing specific rows/columns of a Matrix using enums and methods on a Matrix, and this seemed sufficient for quite a while. When I switched the internal representation of a Matrix from two nested Vecs to a flattened Vec the slicing APIs still made sense even though their implementations were no longer O(1).

## Matrix views

Eventually cutting a matrix up became inadequate. An algorithm to reduce a matrix to tridiagonal form (0s everywhere but the main and off diagonals) can be expressed very nicely if you can split a matrix into four quadrants and mutate them as if they were separate - but with Rust's borrow checking rules this was going to require building a concept of a manipulatable view into a Matrix, not just defining indexes to delete that had worked for slicing.

To keep the discoverability of methods for matrix views good, I built a *low* level API with traits that defined just reading and writing values to matrices, and then created a MatrixView type which would mirror the higher level Matrix API. If I was starting from scratch, I would reconsider where to put this boundary between the traits and structs. One unexpected downside of having Matrix and MatrixView APIs be essentially the same but not implement a common trait or be subtypes of each other is it becomes difficult to write code that works with both. A Matrix is a MatrixRef, but a MatrixView owns a MatrixRef. Thus, to take either as an argument in a function you must instead take a MatrixRef, and then you're back to the low level API of a 2d buffer that I was trying to abstract away. The function can then construct a MatrixView from the MatrixRef to get back to high level matrix APIs, but this means to pass a MatrixView to a function we are extracting the MatrixRef out of a MatrixView and then creating a new MatrixView! I hope abstracting over a Matrix and a MatrixView is mainly a concern of the shared implementations I needed to write for Easy ML, rather than something that comes up in application code.

## Interior mutability

What I realised after releasing 1.7 was that even with the fundamentals of read and write access to a matrix defined, there wasn't much you could do with that access if the matrix you were reading or writing from could change while you were using it. I had specified just enough restrictions on MatrixRef so that combining unsafe accessors with a type that had interior mutability would require bounds checking, but this didn't eliminate the possibility of a matrix being resized whilst iterating through it - only that such a resize wouldn't risk undefined behaviour. Multiplying two matrices requires checking that their sizes line up and then iterating through both - if one shrinks while you are iterating then suddenly an innocent `*` could lead to a panic.

This had never been a concern when I was just writing multiplication operations for two Matrix types, since I knew neither type could be resized by unrelated code because a Matrix doesn't have interior mutability. However, by not ruling interior mutability out entirely, I couldn't rely on MatrixRef for the same operations that had been straightforward with just a Matrix. Since MatrixRef was already public API, I couldn't edit the required behaviour without a major version bump, even though it wasn't actually captured in the type system.

Finding a way out wasn't that much of a problem in the end. I introduced a new trait, NoInteriorMutability, which ruled interior mutability out entirely, as perhaps MatrixRef should have done. Any type which was `MatrixRef<T> + NoInteriorMutability` was then nearly as usable as a `&Matrix`, and similarly `MatrixMut<T> + NoInteriorMutability` could mirror `&mut Matrix`. Implementing mutable iterators and numerical operations on the low level matrix view traits allowed for lots of code reuse between MatrixView and Matrix. Still, 3 traits and a wrapper struct just to express views wasn't quite as simple of an API as I had intended to build, and I won't be able to simplify it back to 2 traits until version 2.0.

## Slicing

I've still got those slicing APIs which fill a similar role to some of the view APIs, but the two are entirely separate. If I'd built the slicing enums to be a little more restrictive instead of supporting arbitrary boolean logic combinations it wouldn't be too hard to create functions which take a slice and a matrix to return a view, but now I'm going to have to think very carefully to get the slice API I've already built integrated with the view system.

## Onwards to Tensors

Since I've not released any public tensor APIs yet, I can apply lessons I've learned from matrices to the tensor APIs in a 1.x.y version. `TensorRef<T>` will be `TensorRef<T>: NoInteriorMutability`, which should interop well with matrix views but rule out tensors with interior mutability from the start. I'll build more basic functionality as wrapper structs over a TensorRef/TensorMut instead of creating bespoke implementations on a Tensor type, which should make code reuse between Tensor and TensorView emerge more easily. Having flattened the internal Vec of the Matrix type many versions ago, I can generalise the 2d indexing to n dimensions, so I won't try to first build Tensors with build a non flat buffer.

## Iterators

Perhaps because iterators use a very simple trait, and it's already been battle tested in the standard library, the iterator APIs of Easy ML have grown and matured very well. I started out writing iterators for a `&Matrix` which clone each element before returning, and later I was able to also build iterators that return references to each element. After the matrix view APIs, `ColumnMajorIterator<'a', T: Clone>` became `ColumnMajorIterator<'a, T: Clone, S: MatrixRef<T> = Matrix<T>>` with no breaking changes, and could support matrix views as well. I was even able to write iterators which yield mutable references and make the iterators elide bounds checks on each `next()` call.

However, even the iterator APIs which have grown well from version 1.0 to 1.8 are going to end up with a paper cut. I created a `WithIndex` type that generalises the `enumerate()` in the standard library to provide row and column major iterators that include their row/column index. Just as `matrices::views::NoInteriorMutability` is likely to end up reused from `tensors::views::TensorRef`, `matrices::iterators::WithIndex` is going to also be useful in `tensors::iterators::*`. I could re-export the wrapper struct from `tensors::iterators::WithIndex` so it has the 'right' namespace, but even then, eventually, then there's probably going to be someone who clicks on the matrix iterators doc page, clicks through to an iterator which can wrap itself in `WithIndex`, hovers over the 'notable traits' section, and is confused to see many implementations of an iterator for `TensorRef` types with associated `Item` types that are quite different from `((Row, Column), T)`.

Could I have guessed I would end up with useful wrapper structs when writing iterators for matrices and had the foresight to put iterators at the top level of the namespace instead of within `matrices`? Probably not.
