# Rust as a high level programming language
<p class = "article-date">2021/05/02</p>

Rust is often described as a systems programming language, but I think it is useful to keep in mind that it can scale well to higher level progamming tasks that are traditionally the domain of garbage collected languages. If you look at the most popular categories on crates.io you see many things you would expect for a language that can match the performance and low resource constraints of C and C++ code like embedded development, cryptography, and command line tools. However there are also other very popular categories such as web programming that hint at Rust finding usage in domains typical of very high level languages.

High and low level are also relative terms. In comparison to writing assembly code, C is a high level language that abstracts over the differences between different hardware. Yet compared to C, Java is much higher level, it abstracts over memory managament, provides much more ability to abstract over types and interfaces in a program, and provides far greater 'write once, run anywhere' support than C. Java does much of this by sacrificing some runtime performance and removing control over the low level details from the programmer.

TODO: Summarise

## Abstracting over memory

Java doesn't let you accidentally read beyond the length of an array, and it doesn't let you control when memory is deallocated, but in doing so it also frees you from having to care about memory allocations and deallocations like you would in C. However the abstraction is still leaky, since garbage collection cycles can cause unavoidable latencies that make Java unsuited to some domains. C++ abstracts memory management further than C with smart pointers, but Rust goes even further with its compile time lifetime analysis and largely declarative memory management. Although Rust doesn't let you ignore memory management quite as much as Java, it does abstract away many memory related concerns such as manual deallocation, and avoiding memory leaks. Comparing C, Java and Rust on heap allocating memory, Rust looks a lot closer to Java than C.

```c
// C
struct foo {
	int x;
}
struct foo* foo_new(int x) {
	// don't get the size of the memory allocation wrong or bad things will happen
	struct foo *f = malloc(sizeof(struct foo));
	foo->x = x;
	// don't forget to free this when you're done with it,
	// and definitely don't try to free this twice
	return foo;
}
```

```java
// Java
class Foo {
	int x;
	// implict memory allocation of the correct amount of bits,
	// deallocation will happen at some point after we drop all
	// our references to Foo during garbage collection
	Foo(int x) {
		this.x. = x;
	}
}
```

```rust
// Rust
struct Foo {
	x: i32,
}
impl Foo {
	fn new(x: i32) {
		// implict memory allocation of the correct amount of bits,
		// deallocation will happen after we drop all our references
		// to Foo
		Foo { x, }
	}
}
```

## Abstracting over types

C also largely lacks the ability to abstract over different types. You can type erase pointers to pass data of varying types around, but more ergonomic generics requires something akin to C++'s templating, or Java and Rust's generics.

```java
// Java
interface EventListener {
	void onFoo(Foo foo);
	void onBar(Bar bar);
	void onBaz(Baz baz);
}

...

class Emitter {
	private List<EventListener> listeners;
	...
}
```

```rust
// Rust
trait EventListener {
	fn onFoo(&self, foo: Foo);
	fn onBar(&self, bar: Bar);
	fn onBaz(&self, baz: Baz);
}

...

struct Emitter {
	listeners: Vec<Box<dyn EventListener>>,
	...
}
```

The main difference here is that Rust is explicit about the heap allocation and type erasure. In Rust you have to explicitly type erase the types implementing EventListener (`dyn`), and since the different types may take up a different size in memory, you need to explicitly store something with a fixed size that references them in the list. Heap allocation with a `Box` is the easy way which closely matches the Java example, but Rust doesn't restrict you to this method. You could alternatively store a list of borrowed data.

```rust
struct Emitter {
	listeners: Vec<&dyn EventListener>
}
```

But now the compiler will make you ensure the event listeners outlive the Emitter.

If you have to work with a lot of borrowed data, Rust probably doesn't feel as high level as a garbage collected language, since memory lifetimes start to matter. However, if you use `Box` to own references, and `Arc`s to share owned memory, Rust can feel a lot closer to a high level language. In the domains where you could be using a high level language, making these performance tradeoffs in Rust are likely acceptable, since you'd be making them implicitly with many high level langauges anyway.

Even if you're writing a Linux kernel however, I think it is clear that Rust can let you write code with a stronger level of abstractions than C. Just compare [the Rust examples to the C examples (for rust in the linux kernel)](https://security.googleblog.com/2021/04/rust-in-linux-kernel.html?m=1) and count the footguns that are compile errors in Rust but not in C.

## Abstracting over platforms

Library support is not neccessarily a property of a programming language but more the languages' ecosystem. However, part of what makes Python, JavaScript and Ruby so useful is their vast open source libraries and package managers that let you write code agnostic of operating system details, by easily depending on libraries that unify platform specific functionality into single APIs that behave the same everywhere.

Rust not only has a similarly excellent package manager and library registry, but it has one additional advantage that may in time make it even better at this than even Python, JavaScript and Ruby. Since Rust is suitable for writing for many low level libraries too, every time someone rewrites a C library into Rust, the Rust ecosystem can use the Rust library without its package manager needing to link against or build a program written in a different language.

Whereas a Python library may establish high level Python bindings to something written in C, C++ or even Rust, a similar high level Rust library can build APIs on top of a lower level Rust library without issues related to FFI, cross compilation or dynamic linking, since the low and high level library code can be statically compiled together in the same language.
