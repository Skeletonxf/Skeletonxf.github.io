# Multiple Inheritance in Lua
<p class = "article-date">2018/04/04</p>

First I will go over why one of the reasons why Java doesn't have multiple inheritance and then how this informs multiple inheritance in Lua (where one can do classes and objects however one likes because "[objects are not primitive](https://www.lua.org/pil/16.3.html)").

## Problems with multiple inheritance

A crucial problem with multiple inheritance is ambiguity when multiple subclasses have the same method or field. If this were legal java the following snippet shows the issue.

```java
public class Entity {
  private Vector location;
  private Vector velocity;
  public void update() {
    location.update(velocity);
  }
  // Constructors, getters, setters and so on
}

public class Pathfinder {
  private Path path;
  private Vector start;
  private Vector end;
  private World world;
  private AStar astar;
  public void update() {
    path = astar.navigate(world, start, end);
  }
  // Constructors, getters, setters and so on
}

public class PathfindingEntity extends Entity, Pathfinder {
  // Constructors, getters, setters and so on

  public static void main(String[] args) {
    new PathfindingEntity().update(); // which update method should be called?
  }
}
```

This can be addressed via [composition](https://en.wikipedia.org/wiki/Object_composition)

```java
public class PathfindingEntity {
  private Pathfinder pathfinder;
  private Entity entity;
  public void update() {
    // we want to call both update methods
    entity.update();
    pathfinder.update();
  }
}
```

However in Java this is still not ideal, because if we have a list of entities then we can't add a PathfindingEntity to it because PathfindingEntity is a subclass of Entity.

```java
List<Entity> list = new ArrayList<>();
list.add(new Entity())
list.add(new PathfindingEntity()) // error, not an Entity!
```

Java can deal with this problem via interfaces, but in Lua you can ducktype composition quite easily.

```lua
local list = {}
-- ie List = { add = function(self, element) self[#self+1] = element end }
setmetatable(list, List)
list.add(entity.new())
list.add(pathfindingEntity.new())
for k, v in ipairs(list) do
  v.update() -- both types have an update function, perfectly legal
end
```

For any method in multiple subclasses, you need to resolve which method to call from the class inheriting all of them.

## Implementations

The scenario I had was somewhat similar to the simplified examples in Java above. I had an object which was a box2d body/shape/fixture, and I wanted to give it other methods for handling AI logic. The library I was using had already given my object a metatable for box2d updates and I want to also call my logic on it.

```lua
-- 'class' table
local Pathfinder = {
  -- methods of the class to be called on instances
  update = function(self)
    self.path = self.astar.navigate(self.world, self.start, self.end)
  end
  -- ect
}
-- make lua look in this table if trying to call
-- fields not in the original table
Pathfinder.__index = Pathfinder

local entity = somelib.new()
local Entity = getmetatable(entity)
print(Entity) --> a table with the entity methods
```

You could set the Pathfinder metatable onto the object, but then you lose the Entity metatable and it won't work with the library when you give it back to process.

```lua
local entity = somelib.new()
setmetatable(entity, { __index = function(object, key)
  for _, class in {Entity, Pathfinder} do
    if class[key] then
      -- access the index of the first class in the defined list
      -- that has this method when calling the key on the object
      return class[key]
    end
  end
end })
```

[PIL](https://www.lua.org/pil/16.3.html) goes through a function to generate a class from multiple classes. However this approach can be extended even further if we want to do additional logic for some methods such as call both in some order.

```lua
local PathfindingEntity = {
  __index = function(object, key)
    if key == "update" then
      -- this function can be memoized to avoid creating it every
      -- time entity.update() is called
      return function(...)
        -- call entity first
        Entity[key](...)
        Pathfinder[key](...)
      end
    else
      -- this won't actually do anything in this example
      -- because there are no other methods
      -- but is here for completeness
      for _, class in {Entity, Pathfinder} do
        if class[key] then
          -- access the index of the first class in the defined list
          -- that has this method when calling the key on the object
          return class[key]
        end
      end
    end
  end
}
```

[Full code snippet](/code-snippets/pathfindingEntity.lua)

Each ambiguity is handled by explicit logic in the `__index` function, with non ambiguous methods simply called as normal. When composition works instead though, it is probably a better solution in most cases. I couldn't use composition here because I needed to hand my object to the library that expects its methods at the top level and gives me the object back - at which point I need my methods on that level too.
