# Working with immature libraries in Rust
<p class = "article-date">2021/07/14</p>

Having worked with Rust both on hobby projects and on commercial endeavors I've had to work with a number of libraries that are pre version 1.0, sometimes poorly documented, and sometimes lacking functionality that would have been easy to add but was likely missed. However, even an immature Rust library is generally quite workable if you can spend some time with it since the type system can provide valuable documentation on its own and it's *very* easy to look under the hood with all those `src` links in Rust's documentation to check implementation details to verify behaviour is as you expect.

This is a listicle that goes through some of the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/about.html) from the perspective of using a crate rather than writing it, and what you can do if a crate *doesn't* follow the guidelines.

## Naming

If a type or trait is named in a way that causes issues for your tooling, comprehension or consistency, you can rename when you bring it into scope using [`as`](https://doc.rust-lang.org/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html#providing-new-names-with-the-as-keyword).

```rust
// external library definition
pub struct I_Should_Be_Camel_Case {
    foo: bool,
}

// consuming code
use path_to::I_Should_Be_Camel_Case as IShouldBeCamelCase;
```

## Interoperability and missing trait impls

You can't implement traits you didn't define on types you didn't define, however in my experience it is not uncommon to discover that a crate's type does not implement one of the common traits from the standard libray I would like it to. The general approach to this is define a wrapper type that implements the traits you want.

### Debug

If you just want your type to be `Debug` rather than needing to debug a third party type it contains you can fall back to a manual `Debug` implementation on the type wrapping it, and continue using `#[derive(Debug)]` on any of your types that contain the wrapper.

```rust
// external library definition
pub struct Opaque;

// consuming code
struct MyType {
    opaque: Opaque,
    // other fields
}

impl Debug for MyType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("MyType")
         .field("opaque", &"Opaque")
          // other fields
         .finish()
    }
}
```

### Eq, PartialEq, Ord, PartialOrd, and Hash

You can wrap an external type that does not implement these in a struct and manually implement them if the type exposes enough information for you to do the checks.

```rust
// external library definition
pub struct Foo {
    pub bar: i32,
}

// consuming code
struct FooWrapper {
    foo: Foo,
}
impl PartialEq for FooWrapper {
    fn eq(&self, other: &Self) -> bool {
        self.foo.bar == other.foo.bar
    }
}
```

### Default

You can still implement `Default` on a wrapper for an external type if you can call one of its constructors and set the relevant fields to what you want even if you don't have public access to all the fields for initialisation.

```rust
// external library definition
pub struct NotAllPublicFields {
    pub foo: bool,
    bar: (),
}
impl NotAllPublicFields {
    pub fn new() -> Self {
        NotAllPublicFields {
            foo: true,
            bar: (),
        }
    }
}

// consuming code that wants a default with foo set to false
struct Wrapper(NotAllPublicFields);

impl Default for Wrapper {
    fn default() -> Self {
        let mut data = NotAllPublicFields::new();
        data.foo = false;
        Wrapper(data)
    }
}
```

### Copy

`Copy` can't be implemented by wrapping something that isn't `Copy`. If you can't make do with `Clone` you will need to fork the library and add the `Copy` implementation.


### Clone
`Clone` is also quite tricky if the type you're wrapping doesn't have suitable constructors and/or access to set all the fields on the clone. If the type you're wrapping can live exclusvely behind shared references, you can put it behind an `Arc` or an `Rc` (or even just `&` if you don't need ownership) to get something `Clone`able.

If forking the library is not desirable, one final extremly unsafe option is to define a struct which does derive `Clone` and has exactly the same size and fields. You can call [`std::mem::transmute`](https://doc.rust-lang.org/std/mem/fn.transmute.html) on the offending type to reinterpret the bits as your type which you can then clone since you have access to every field. However not only can this cause all kinds of undefined behaviour, you add a dependency on the exact definition of the library type and you must ensure it remains in sync with your version, even though the library could change it in a non API breaking patch update.

### Serialize and Deserialize (Serde)

Refer to serde's [custom serialization](https://serde.rs/custom-serialization.html) docs if you need to serialize an external library type which exposes all its data but doesn't already have serde integration. Often libraries will have an optional dependecy for serde integration, so check for that first since it may not be enabled by default.

### Send and Sync

Occasionally you need to use crates which contain types with dynamic trait objects as members that don't contain `Send` and `Sync` bounds, or types which are genuinely never thread safe. You can always put a non `Send` and non `Sync` type onto a dedicated thread and 'wrap' it into a `Send` and `Sync` handle that acts like it owns the type via message passing to that dedicated thread.

```rust
// external library definition
pub struct SomethingNotThreadSafe {
    _marker: std::marker::PhantomData<*const ()>,
}

// consuming code using tokio that wants a Send and Sync handle
use tokio;
use tokio::sync::mpsc;

enum CommandType {}
enum ResponseType {}

struct SomethingNotThreadSafeHandle {
    command: mpsc::Sender<CommandType>,
    response: mpsc::Receiver<ResponseType>,
}

impl SomethingNotThreadSafeHandle {
    fn new(x: SomethingNotThreadSafe) -> Self {
        let (command_tx, mut command_rx) = mpsc::channel(100);
        let (response_tx, response_rx) = mpsc::channel(100);
        tokio::task::spawn_blocking(move || {
            loop {
                let command = command_rx.blocking_recv();
                // do something
                let response = unimplemented!();
                response_tx.blocking_send(response);
            }
        });
        SomethingNotThreadSafeHandle {
            command: command_tx,
            response: response_rx,
        }
    }

    async fn do_something(&mut self) {
        self.command.send(unimplemented!()).await;
        let response = self.response.recv().await;
    }
}
```

## Other issues

### Non object safe traits

[Option 2](https://www.possiblerust.com/pattern/3-things-to-try-when-you-can-t-make-a-trait-object) of *3 Things to Try When You Can't Make a Trait Object* explains how to make something object safe.
