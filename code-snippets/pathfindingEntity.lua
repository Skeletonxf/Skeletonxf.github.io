-- All code on this website is licensed under the MIT license
-- Additionally this snippet is licensed under the Unlicense license
--
-- This is free and unencumbered software released into the public domain.
--
-- Anyone is free to copy, modify, publish, use, compile, sell, or
-- distribute this software, either in source code form or as a compiled
-- binary, for any purpose, commercial or non-commercial, and by any
-- means.
--
-- In jurisdictions that recognize copyright laws, the author or authors
-- of this software dedicate any and all copyright interest in the
-- software to the public domain. We make this dedication for the benefit
-- of the public at large and to the detriment of our heirs and
-- successors. We intend this dedication to be an overt act of
-- relinquishment in perpetuity of all present and future rights to this
-- software under copyright law.
--
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
-- EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
-- MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
-- IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
-- OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
-- ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
-- OTHER DEALINGS IN THE SOFTWARE.
--
-- For more information, please refer to <http://unlicense.org/>

local Entity = {
  update = function(foo)
    print('updated entity ' .. tostring(foo))
  end
}
Entity.__index = Entity

local entity = {}
setmetatable(entity, Entity)
entity.update(1) --> updated entity 1

local Pathfinder = {
  update = function(bar)
    print('updated pathfinder ' .. tostring(bar))
  end,
}
Pathfinder.__index = Pathfinder

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

setmetatable(entity, PathfindingEntity)
entity.update(2) --> updated entity 2; updated pathfinder 2
