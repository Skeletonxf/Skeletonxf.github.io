# Committing to a Stable API

As a software developer that uses a lot of libraries in my day job I often wondered how Google could make so many changes to a library that the Firebase bill of materials would reach version 29.0.0 - that's almost as many major versions as Android has SDK versions!
In the Rust world cargo and crates.io enforces semver for libraries so breaking changes are supposed to only occur with a major version bump, and many crates are still 'unstable' on 0.x.y versions. Around a year ago I was working on a Rust project that used tokio and looking through all the application's transitive dependencies to debug something. There were some libraries depending on tokio 0.2 and others on 0.3 and then tokio 1.0 was released. For a dependency like tokio which you build an application around having 3 different mostly incompatible versions used by the ecosystem was not fun, and lead to some difficult decisions about reimplementing functionality which was already available in libraries simply to build the functionality against tokio 1.0.

For these kinds of reasons I wanted the library I published to crates.io to commit to a stable API from the start, so other developers would be able to build on top of a stable foundation. As I write this, the Machine Learning ecosystem in Rust is still in its infancy, and many of the major libraries which do exist are still on 0.x.y versions. A snapshot of [lib.rs's machine learning libraries](./images/librs-machine-learning-top-22.png) lists my [easy-ml](https://lib.rs/crates/easy-ml) at the 22nd position. Many of the libraries above it do far more, and are developed by more people, however only [autograd](https://lib.rs/crates/autograd) and [neat-gru](https://lib.rs/crates/neat-gru) have also made at least one stable release.

For a language which reached a stable version 6 years ago, its Machine Learning ecosystem still has a lot of growing to do.

Nonetheless I've already started to build up decisions which I would like to change, and can't yet because they would require breaking changes. I don't plan to avoid an easy-ml version 2.0 forever, but I would like to wait till the breaking changes are important enough to be worthwhile updating any code which depends on the library.

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

One less intentional interface I locked in without even realising was including [`Neg`](https://doc.rust-lang.org/std/ops/trait.Neg.html) in the numerical traits. It's not as though I expected unsigned integers to implement Neg, but I was still surprised to realise I couldn't add two `Matrix<u8>` together because the Add implementation required their data to be Numeric and they were not. I could have not required a type to implement every operation from Numeric to just add two matrices, but I'd just created some traits to specify math for referenced types! Fortunately the standard library already had `Wrapping<u8>` which does implement `Neg` but the first papercut was born without me realising till after easy-ml 1.0 was released.

## Matrix traits

I deliberately did not introduce any traits to define a Matrix for a long time because the discoverability of trait methods on their implementing types was poor, at the time I think doc sections like `Methods from Deref<Target = [T]>` did not exist. I was also very wary to introduce a trait that I might need to add additional non default methods to later.

TODO

- slicing API for matrices written without using any matrix traits
- eventually needed way to abstract over a view of a matrix
- MatrixRef/MatrixMut/MatrixView were born
- literally next chunk of code written after releasing 1.7 realised needed to ban interior mutability for a lot of code using MatrixRef implementations.
- NoInteriorMutability was born and now to implement a useful mutable Matrix view type you need three trait implementations
- Tensors still wip, but some types like WithIndex could be reused by them, except the types are already namespaced to crate::matrices::iterators - typealis to the rescue?
