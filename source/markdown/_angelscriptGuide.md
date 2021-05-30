# Starting with AngelScript
<p class = "article-date">2020/09/12</p>

AngelScript is not a particularly novel programming language. I do not mean that as a complaint, just that it does not feature anything you won't find in more popular languages. However, it is quite unique in having next to no online resources to use. I can't even imagine how hard it could be to learn as a first programming language.

## What is AngelScript

AngelScript is a strongly typed, multi paradigm, compiled scripting language which was designed to be easy to embedd into other games and work well with C/C++. It follows much of the syntax of C++, but Java and C# programmers should feel quite familiar with it as well.

### Strongly Typed

AngelScript gives types to variables. This is in contrast to more popular scripting languages such as Python or JavaScript which give types to values, and let variables hold any type (known as dynamic typing). There are some advantages to dynamic typing, namely that it can often be easier to get started if you don't have to 'think' about types. However, types mainly exist to aide the human, not the CPU. It wouldn't be a massive exageration to say the CPU only cares how many bits are in a number. Strong typing allows you to carefully define what can be done with values you return from functions and methods to avoid ever trying to do something with a value which doesn't support that.

### Compiled

AngelScript is compiled rather than interpreted. This distinction means you have two classes of errors that can occur in your program: Compile errors when you get the syntax wrong or misuse types, in which case you find out immediately before you even try to run the code, and Runtime errors when you messup the logic of something once its running. Runtime errors are generally much harder to debug, so moving errors into compile time via strong typing can help with maintenance.

### Multi Paradigm

AngelScript supports many different styles of programming. It has classes and single inheritance, so you can create relatively complex inheritance trees where some type C is a type B which is itself a type of A. AngelScript also has interfaces, so you can define that your functions or methods take or return something which follows some kind of behaviour, regardless of what type it actually is. AngelScript also has mixins, allowing common behaviour to be definied once and applied to many different types.

This guide is primarily written with Star Ruler 2 in mind. Star Ruler 2 uses many different paradigms of AngelScript in different parts of its codebase. The hooks and status system that drives much of the game mechanics is based off inheritance trees. The AI code is split into a number of components which all implement the same interface, and a parent that calls them via that interface in turn. The game also makes good use of mixins, defining things like what being able to move means in one mixin component that is then applied to a wide range of different types of things such as Ships or Planets.

## AngelScript Syntax

AngelScript is very similar to C and all of C's children in terms of syntax.

### Variables

Primitive types like numbers are defined as `TYPE identifier`. Assignments are made with `=`, and many of the common syntax things like `+=` and `++` do the same as in C/C++/Java/etc

```as
uint i = 0;
int j = 1;
i += 1;
j++;
j = i + j;
```

### Statements

Control flow statements are very similar.
```as
for (uint i = 0; i < total; ++i) {
	if (/* condition */) {
		continue;
	}
	// do something
}

while (/* condition */) {
	if (/* other condition */) {
		// do something
	} else {
		break; // breaks out of the while loop
	}
}

return value; // returns from the function
```
They are not expressions, so you cannot avoid boilerplate with syntax like in rust
```rust
let x = if (/* condition */) {
	value1
} else {
	value2
};
```

### Classes

Classes can be defined with the `class` keyword, with syntax very similar to C++ and Java.
Class fields are defined like variables are, and classes may use the `this` keyword to access fields that are shadowed by the name of a local variable. However, `this` is not neccessary to access them, they can be accessed by name alone as long as nothing is shadowing the variable name.
Constructor functions use the name of the class with a special syntax that lets you instantiate the class to get an object.

```as
class Counter {
	uint i = 0;

	Counter(uint i) {
		this.i = i;
	}
}
```

### Functions

Functions are defined with `RETURN_TYPE identifier(<ARGUMENTS>)`. If the function does not return anything, the return type is `void`. If the function does not take any arguments the brackets are left empty.

Functions can have default named arguments such as
```as
void foo(bool bar = true) {
	if (bar) {
		...
	} else {
		...
	}
}
```

### Methods

Methods are functions which are called on a particular object. These are definied on classes or mixins.

```as
class Counter {
	uint i = 0;

	Counter(uint i) {
		this.i = i;
	}

	void increment() {
		i += 1;
		return i;
	}

	uint get() {
		return i;
	}

	void set(uint i) {
		this.i = i;
	}
}
```

### Objects and Handles

When you instantiate a class you get an object.

```as
Counter counter = Counter();
counter.set(4);
counter.increment();
counter.increment();
print(counter.get()); // -> prints 6
```

It is common to build classes out of other classes, and to do this AngelScript has handles.

```as
class MutliCounter {
	Counter@ counter1;
	Counter@ counter2;

	MultiCounter(Counter@ counter1, Counter@ two) {
		@this.counter1 = counter1;
		@counter2 = two;
		counter1.set(0);
		counter2.set(10);
	}
}
```

Handles in AngelScript are reference counting pointers. They automatically hold onto an object while it is being referenced anywhere in the program, and let the object be deleted only when all references to it have been ended. A type which is a handle has the special `@` syntax after the type name. For the most part you can ignore that syntax, except when assigning to a variable which is a handle type. To assign to a handle you need to edit the value the pointer is pointing to, not the value, and you must prefix `@` onto the start of the statement. The `@` is not neccessary to access fields or call methods on a handle type, but it is part of the type and must be included when defining functions and methods that take or return such types.

[Further info](https://www.angelcode.com/angelscript/sdk/docs/manual/doc_script_handle.html)

### References

If an object is only needed inside the scope of the function or method that recieves it then passing a reference to an object instad of a handle may be more appropriate.

```as
void incrementBoth(MultiCounter& counters) {
	counters.counter1.increment();
	counters.counter2.increment();
	// don't need counters anymore
}
```

References can't be null, which can be helpful to reduce otherwise needed boilerplate error checking.

## Files and imports

AngelScript files use the `.as` file extension, which clashes with the file extension of ActionScript. AngelScript can import functions and classes from other files in a number of ways.

```as
//counter.as
class Counter {
	// as prior examples
}
```

The straightforward way to import something is to use the `import` keyword, which will import everything from a file and bring them all into scope.

```as
// main.as
import counter;
// Counter is now in scope, as is all its methods, and any
// other classes or functions definied in counter.as
```

However AngelScript does not permit cyclic imports, and it has other more limited ways to import things to deal with this limitation.

```as
// main.as
import counter;
// Counter is now in scope, as is all its methods, and any
// other classes or functions definied in counter.as

uint foo(int bar) {
	return uint(bar);
}
```

You can dynamically import specific functions from another module via `import FUNCTION_DECLARATION from "MODULE"`

```as
// other.as
import uint foo(int bar) from "main";
// foo is now in scope, but nothing else from main has been imported
```

Sometimes you may need to import things from files which have multiple definitions of something with the same name. For this you can use imports that import specific classes or functions.

```as
// A snippet from my mod
from ai.buildings import Buildings, BuildingAI, BuildingUse;
from ai.resources import AIResources, ResourceAI;

// It is very important we don't just import the entire resources definition
// because it defines a Resource class which conflicts with the Resources
// class for the AI Resources component
from resources import ResourceType;
import empire_ai.dragon.bookkeeping.resource_flows;
from empire_ai.dragon.bookkeeping.resource_value import RaceResourceValuation, ResourceValuator;
```

You may be wondering how to export things. There is an export keyword, however anything you define as public (the default) can be imported into other files.

## Interfaces

An interface definition looks similar to a class defintion, except methods in it may have no body and it cannot have fields.

```as
interface Counter {
	uint get();
	void increment();
}
```

Interfaces can be used to define what sort of behaviour you need a thing to have to use it, and also act as a convenient way to avoid cyclic imports. You could define an interface in one file, then have a number of types in different files import that interface and definie classes which implement it, then the file defining the interface can use the interface type without needing to know the underlying implementations, or import those files providing the implementation.

## Implementing interfaces and inheritance

Classes can implement any number of interfaces, all they need to do is provide definitions for the functions required, and use a special syntax on their first line.

```as
class Expansion : AIComponent, Buildings, ConsiderFilter, AIResources, IDevelopment, IColonization {
	// fields and functions ommitted
}
```

In the above example, `AIComponent` is a class that `Expansion` inherits from. The other types in the list are interfaces it implements. For inheriting classes, you do not need to and cannot redefine the fields of the parent class. If `Foo` has a field `bar`, then `FooBar: Foo` already has the field `bar` and does not restate the field in its definition, though it may still need to assign to and read from that field.

## Arrays

In the version of AngelScript in Star Ruler 2, arrays are the only type which is allowed to be generic. Array syntax in general sticks out like a sore thumb in my opinion. There is no need to define anything on the right hand side before you can start using an array, and they will automatically grow as neeed when using `insert*` staements, but you must manually set the length or ensure they are large enough before indexing to set or get values.

```as
array<int> numbers;
numbers.length = 3;
numbers[0] = 1;
numbers[1] = -4;
numbers[2] = 3;
numbers.insertLast(5); // numbers is now [3, 1, -4, 3, 5]
numbers.insertAt(0, -7); // numbers is now [-7, 3, 1, -4, 3, 5]
numbers.sortAsc(); // numbers is now [-7, -4, 1, 3, 3, 5]

```

Arrays can be cleared by setting their length back to 0.
```as
numbers.length = 0;
```

Arrays are always passed by reference, and you may often want to pass them around as handles.

TODO: Const

TODO: get_* and set_* syntax magic

TODO: Bit ops

TODO: Mixins
