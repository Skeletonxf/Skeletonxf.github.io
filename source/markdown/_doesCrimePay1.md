# Does crime pay?
<p class = "article-date">2023/11/25</p>

Before you recoil in horror I'm going to be looking not at real crime but the crime downtime activity in the Xanathar's Guide to Everything sourcebook for Dungeons & Dragons. Unlike real crime, the only victims are fictional.

## Stats and classes

For reasons that will be obvious later I'll only be looking at the chances a rogue has to earn money via this system.

*****

*Notation*

I'll be using the 3 character versions of the ability score names to refer to the corresponding modifiers, so a dexterity score of 15 is +3 DEX, and likewise PROF refers to the proficiency bonus and EXP to the expertise bonus.

I'll be using other standard notation like DC for difficulty class (here, the number you need to roll or higher to pass the checks), gp for gold pieces, and d20 for a 20 sided die roll.

*****

The crime downtime activity has you make three ability checks

- Stealth (DEX)
- Thieves' tools (DEX)
- One of Investigation (INT), Perception (WIS) or Deception (CHA)

Since none of the third checks use your dexterity modifier for the rest of this article I'll just assume without loss of generality that the character/player chooses Perception. Stealth, using thieves' tools and perceiving stuff are all typical rogue things anyway, so building a character that is good at crime shouldn't hurt your actual playing in non downtime.

Using point buy to choose 15 in dexterity and 15 in wisdom and +2 in DEX and +1 in WIS from the character's race, a level 1 rogue could have expertise in two of stealth, thieves' tools and perception, proficiency in the other, with a dexterity score of 17 for a +3 DEX to these d20 dice rolls and a wisdom of 16 for also +3.

This gives a few options for the initial bonuses to these checks such as

- *Stealth*: 1d20 + 3 (DEX) + 2 (PROF) + 2 (EXP)
- *Thieves' tools*: 1d20 + 3 (DEX) + 2 (PROF) + 2 (EXP)
- *Perception*: 1d20 + 3 (WIS) + 2 (PROF)

Again, assuming DEX and WIS are the same, there's no loss of generality to just pick this option and calculate from there. If WIS was only +2 then not having expertise in perception might make it more difficult to pass that third ability check, and it might be worthwhile to move the one of the expertise choices over to it.

## The difficulty

This is where it gets interesting, there's a very non linear set of choices for who to try robbing.

- DC 10 can pay out 50 gp
- DC 15 can pay out 100 gp
- DC 20 can pay out 200 gp
- DC 25 can pay out 1000 gp

Regardless of success or not, first the character must spend at least 25 gp. Then if exactly 3 checks are successful they earn the payout, so can end up with profits of the above list minus the 25 gp. If exactly 2 checks are successful they earn half the payout, which interestingly means no profit for the DC 10 choice. If exactly 1 check is successful the character earns nothing but doesn't get caught, netting them a loss of the initial spending. If exactly 0 checks are successful the character is caught and fined the profit they would have made.

This results in zero mechanical reason to spend more than 25 - you'll decrease the fine you might have to pay but only by eating into your profit by the same amount if you're not fined. Hence I'll assume the character is only spending the minimum 25 gp.

This gives us some expected profits

<div class="table-container">
    <table>
        <tr>
            <th><p>DC</p></th>
            <th><p>3 successes</p></th>
            <th><p>2 successes</p></th>
            <th><p>1 success</p></th>
            <th><p>0 successes</p></th>
        </tr>
        <tr>
            <td><p>10</p></td><td><p>25</p></td><td><p>0</p></td><td><p>-25</p></td><td><p>-50</p></td>
        </tr>
        <tr>
            <td><p>15</p></td><td><p>75</p></td><td><p>25</p></td><td><p>-25</p></td><td><p>-100</p></td>
        </tr>
        <tr>
            <td><p>20</p></td><td><p>175</p></td><td><p>75</p></td><td><p>-25</p></td><td><p>-200</p></td>
        </tr>
        <tr>
            <td><p>25</p></td><td><p>975</p></td><td><p>475</p></td><td><p>-25</p></td><td><p>-1000</p></td>
        </tr>
    </table>
</div>

Our level 1 point buy rogue is already able to roll a minimum of 8, 8 and 6 which is getting close to always passing the DC 10 check. They theoretically could pass the DC 25 check too and net 975 gp in profit, but the odds are pretty bad since they'll have to roll at least 18, 18 and 20.

Rather than just looking at odds, it's useful to look at expected value. If you kept doing the downtime activity (complications and getting jailed never giving the character any pause) what would you earn on average? If that's negative then the crime downtime will, eventually, be most likely to *lose* you money. Conversely, if those DC 20 or DC 25 checks can be reliably passed then crime could reliably pay out pretty well on average.
