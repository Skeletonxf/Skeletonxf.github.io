# Preamble

## Risky Business [Forum Game]

This is no longer a forum game, has slight tweaks and nothing to do with Business. Therefore this shall be known as:

## Risky Battles 1.1

This game is mostly an automation of the aforementioned forum game ran by Devour on Stickpage forums. The game ran there never finished, but it was both very simple and had lots of strategy so it seemed like a good target to code up. Perhaps on a rerun I might come further than 4th.

# Tutorial

There are 6 players positioned equally on a hexagonal map. In the centre is a territory with 50 neutral units that must be defeated to take. When a player takes control of it they gain 2000 gold immediately, and still 600 gold each turn after. The game ends when one player has become unstoppable, probably by permanent control of the centre. Detecting this automatically is left as an excerise to the reader.

Each player commits their actions for the turn. When player 6 ends their turn the next phase is started and all player's actions take place at once.

## Units

Territories are fought over with units which are bought on castles. Castles are indicated by a black dot, and player control by the territory colour. There are 4 types of units, the neutral starting ones and Archers, Calvary and Infantry. Neutral units trade 1 for 1 in battle before dying. A battle of 11 against 10 will leave the former winning with 1 unit left. Each of the otheres are strong against or weak against the other in a rock-paper-scissors system. 1 Archer is worth 2 Infantry, 1 Calvary is worth 2 Archers and 1 Infantry is worth 2 Calvary. Units can also be upgraded which doubles their strength for each level. 1 level 4 Archer is worth 8 neutral units, 4 calvary or 16 infantry. All units start at level 1, and neutral units cannot be purchased or upgraded.

> "But Devour, what if my country has 25 archers and 25 cavalry verse 50 infantry?" I hear you ask. Well my man, when you have multiple different units on a territory, they have to take their turns. Think of it like having some units in the front while others wait in the back line. People will have to tell me if they want their Archers in Line 1 and their Cavalry on Line 2. Infantry on Line 3 if they have that too. In this setup, the Cavalry won't fight until all the Archers are dead. I know it's kind of gimmicky but hey, it's the price we pay for simplicity.

Unit upgrades do not apply to the units you already have, you have to spawn new ones.

## Gold

Each unit costs 20 gold. This spawns one new unit on a Castle after all battles take place, if you retain control of that territory. All failed purchases like this refund in full.

### Mines

Mine costs and levels are listed above this article. Mines produce extra gold from a territory. The extra gold per turn diminishes sharply with further levels. Mines are indicated by 0-6 gold dots.

### Territory Gold

Water territories give no gold. Normal territories give 150 gold per turn. The centre gives 2000 gold on taking and 600 gold after. Each player's starting territory is a Capital which gives 400 gold per turn. Capitals cannot be created, but can be taken from other players.

### Walls

A wall costs 1500 gold to build, and is built after all battles. On all future battles the defending units inside gain 1 level of strength. Walls are indicated by grey outlines.

<!-- Battering Rams -->

### Castles.

A castle costs 2000 gold to build, and is build after all battles. Castles under your control are the only territory you can spawn units on. No castles, no new units! Castles are indicated by black dots.

<!-- Razing territories down -->

<!-- Aggressive/Defensive/Scientific -->
