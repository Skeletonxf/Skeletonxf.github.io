## Gotchas: C+ classes

**Or writing in C using C++**

I was recentely introduced to C++ in my Internet of Things module where we were writing some firmware for our micro controller.

While we **were** using C++, the libraries we were using used lots of `char *`s, nothing from `std` at their interface level, and most of the time when they did define classes it was for a singleton instance only. So it was more like coding in C with a few classes for scoping than anything object orientated. We were also not taught any C or C++ so it was very easy to fall back on the  familiar control structures of imperative programming from other languages and hope for the best. Unfortunately embedded systems don't seem so good at telling you when you're messing up your memory. This post will hopefully be the crash course in not reading garbled strings that I never had, and perhaps a reference going forward in my IoT module.

There was one place where objects came up a lot and that was Arduino's `String` class.

The default 'Sketch' template in Arduino's IDE is

```c++
void setup() {
  // put your setup code here, to run once:

}

void loop() {
  // put your main code here, to run repeatedly:
}
```

You might notice that if you're creating things in the setup() function and want them in the loop() function you're going to have to make sure they're still alive, and in scope. Arduino's `String` class, much like you might expect of a C++ object if you learnt C++ and then started writing programs, owns its characters.

## The const keyword

This will fail to compile.

```c++
int BAUD_RATE = 115200;
char *hello;

void setup() {
  Serial.begin(BAUD_RATE);
  // put your setup code here, to run once:
  hello = String(random(10)).c_str(); // const char *
}

void loop() {
  // put your main code here, to run repeatedly:
  String(random(10));
  delay(1000);
  Serial.println(hello);
}
```

Unlike every other programming language I've used `const` in C and C++ is part of the type, not a restriction on a variable.

## My String went out of scope and I held a reference to it

```c++
int BAUD_RATE = 115200;
const char *hello;

void setup() {
  Serial.begin(BAUD_RATE);
  // put your setup code here, to run once:
  hello = String(random(10)).c_str();
}

void loop() {
  // put your main code here, to run repeatedly:
  String(random(10));
  delay(1000);
  Serial.println(hello);
}
```

This compiles, but if you read the documentation for [`c_str()`](https://www.arduino.cc/reference/en/language/variables/data-types/string/functions/c_str/) this is a terrible idea. On my micro controller rather than generating a random number **once** and then printing it repeatedly we get a random number every loop!

In the setup function `hello` does indeed point to the `char *` that `c_str()` gives us, but the `String` object goes out of scope by the time we reach the loop and in fact points to the new `String` object we create just before in the loop every time. [There is also no reason `hello` **should** be pointing to the `String` in the loop function :)](https://en.wikipedia.org/wiki/Undefined_behavior)

## My struct's struct is gone

```c++
int BAUD_RATE = 115200;

struct Foo {
  int bar;
};

struct FooBar {
  Foo *bar;
};

FooBar fooBar;

void setup() {
  Serial.begin(BAUD_RATE);
  // put your setup code here, to run once:
  Foo foo;
  foo.bar = 1;
  fooBar.bar = &foo;
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(1000);
  Serial.println(fooBar.bar->bar);
}
```

What does this print? 0. `foo` went out of scope.

## I allocated my struct's struct on the heap so it didn't die

```c++
int BAUD_RATE = 115200;

struct Foo {
  int bar;
};

struct FooBar {
  Foo *bar;
};

FooBar fooBar;

void setup() {
  Serial.begin(BAUD_RATE);
  // put your setup code here, to run once:
  Foo *foo = new Foo();
  foo->bar = 1;
  fooBar.bar = foo;
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(1000);
  Serial.println(fooBar.bar->bar);
}
```

What does this print? 1. And now there will be a memory leak if you forget to delete `foo` when you're done with `fooBar`. Memory leaks on embedded systems with very scare memory will cause problems for you :)

At this point I know enough to point you to [RAII](https://stackoverflow.com/questions/2321511/what-is-meant-by-resource-acquisition-is-initialization-raii) but not enough to explain it.
