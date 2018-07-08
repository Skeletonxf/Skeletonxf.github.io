# Preamble

## Risky Business [Forum Game]

This is no longer a forum game, has slight tweaks and nothing to do with Business. Therefore this shall be known as:

## Risky Conquest 1.1

This game is mostly an automation of the aforementioned forum game ran by Devour on Stickpage forums. The game ran there never finished, but it was both very simple and had lots of strategy so it seemed like a good target to code up. Perhaps on a rerun I might come further than 4th.

# Tutorial

There are 6 players positioned equally on a hexagonal map. In the centre is a territory with 50 neutral units that must be defeated to take. When a player takes control of it they gain 2000 gold immediately, and still 600 gold each turn after. The game ends when one player has become unstoppable, probably by permanent control of the centre. Detecting this automatically is left as an excerise to the reader.

Each player commits their actions for the turn. When player 6 ends their turn the next phase is started and all player's actions take place at once.

## Starts

There are 3 starts you can choose on your first turn. If you do not choose you will get Defensive.

- Defensive: At the end of turn 3 walls are built on every territory you own. You can get 4 walls from this which is worth 6000 Gold.
- Aggressive: You get 20 extra starting units which helps you expand further and faster than the other players. Starting units will always be a turn ahead of everything else and each territory you'll take gives 150 gold per turn. You also get 1000 gold at the end of turn 3 (you may want to buy a Castle with this).
- Scientific: You start with level 2 archers (worth 1500 Gold). At the end of turn 3 you get 1 level 5 neutral unit on every territory you own. This gives you up to 5 of the strongest units in the game. Each of these is worth 16 normal units so in trades you can save up to 1600 Gold in units.

## Units

Territories are fought over with units which are bought on castles. Castles are indicated by a black dot, and player control by the territory colour. There are 4* types of units, the neutral starting ones and Archers, Calvary and Infantry. Neutral units trade 1 for 1 in battle before dying. A battle of 11 against 10 will leave the former winning with 1 unit left. Each of the otheres are strong against or weak against the other in a rock-paper-scissors system. 1 Archer is worth 2 Infantry, 1 Calvary is worth 2 Archers and 1 Infantry is worth 2 Calvary. Units can also be upgraded which doubles their strength for each level. 1 level 4 Archer is worth 8 neutral units, 4 calvary or 16 infantry. All units start at level 1, and neutral units cannot be purchased or upgraded.

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

### * Battering Rams
A Battering Ram is a special unit that does not fight. Each unit costs 1500 gold. 1 Battering Ram negates wall defensive bonuses and multiple destroy the attacked wall entirely, in both cases being consumed upon use. Battering Rams can be intercepted or attacked so should always be deployed behind a protective army to keep them alive on their journey to seige the opponent.

### Castles.

A castle costs 2000 gold to build, and is build after all battles. Castles under your control are the only territory you can spawn units on. No castles, no new units! Castles are indicated by black dots.

<!-- Razing territories down -->

<!-- Aggressive/Defensive/Scientific -->

# Number of players

## I have no friends
Play with the bots instead ☺️  
Good luck! (And no they do not cheat)

## I have some friends
2+ players: toggle off the [bots](#bot-controls) below before starting

- 2 players: Form 2 teams each
  - p1,p2,p3 vs p4,p5,p6
  - p1,p3,p5 vs p2,p4,p6 (probably more interesting)
- 3 players: Form 2 teams each
  - p1,p2 vs p3,p4 vs p5,p6
  - p1, p4 vs p2,p5 vs p3,p6 (probably more interesting)
- 4 players: rotate control of two opposite non player players (so everyone has 1 as a neighbour)
  - p2 vs p3 vs p5 vs p6 vs p1[rotating control through p2,p3,p5,p6] vs p4[rotating p5,p6,p2,p3]
- 5 players: rotate control of last non player player
    - p1 vs p2 vs p3 vs p4 vs p5 vs p6[rotating p5,p1,p2,p3,p4]
- 6 players: ☺️ Full game

You could also toggle the bots on for the otherwise rotating players above but the bots are unlikely to seem fair mixed with humans. They will frequently attack only one of their neighbours when they have an arbitary choice.

# Notes

Player colours chosen using [I want hue](http://tools.medialab.sciences-po.fr/iwanthue/) for optimally distinct colors considering colourblindness.

The original [forum game](http://forums.stickpage.com/showthread.php?100762-Risky-Business-Forum-Game)

## Differences to original

- Battering Rams can destroy walls when multiple are present.
- Units can only be upgraded at most one level per turn.
- Water territories are 800 Neutral units instead of 2000.
- Multiple army battles may not be the same algorithm as in the original. The original never had a scenario when 3+ armies fought at once.
- You cannot order your units without deploying them to another territory (this is not intended to stay)
- The order of resolving battles/purchases/upgrades may be different to the original. It was never explicitly stated.
- Agressive start gets Gold worth half a Castle instead of a discounted Castle.
- Scientific is buffed to also gain up to 5 level 5 neutral units which still leaves it gaining half in Gold of Defensive and less expansion power than Aggressive. The unit upgrade was mostly arbitary so is fixed to Archers. Scientific now has significant attacking power to make up for the advantages of the other two.
- Terminology changes: province -> territory, turn -> phase, messaging actions to Devour -> turn.

## Single Player Challenges
- Win with Defensive
- Win with Scientific
- Win with Aggressive
- Win without buying Infantry
- Skip your first two turns (except start choice) and still win
