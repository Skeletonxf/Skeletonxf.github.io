## Problems with multiple inheritance

To quote from the Programming in Lua book "[objects are not primitive in Lua](https://www.lua.org/pil/16.3.html)".

That page of the book covers multiple inheritance, showing a general function to create a class from many at runtime.

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
list.add(entity.new())
list.add(pathfindingEntity.new())
for k, v in ipairs(list) do
  v.update() -- both types have an update function, perfectly legal
end
```

For any method in multiple subclasses, you need to resolve which method to call from the class inheriting all of them.

## Implementations

The scenario I had was somewhat similar to the simplified examples in Java above. I had an object which was a box2d body/shape/fixture, and I wanted to give it other methods for handling AI logic. In this scenario, the library you are  using has given your object a metatable for box2d updates, and you want to also be able to call your logic code on it.

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

PIL goes through a more generalised version of this. However this approach can be extended even further, if we want to call both methods of the same name, in some order.

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

[Full code snippet](https://github.com/Skeletonxf/Skeletonxf.github.io/tree/code/source/code-snippets/pathfindingEntity.lua)

Each ambiguity is handled by explicit logic in the `__index` function, with non ambiguous methods simply called as normal. If composition works instead though, that's probably better.
