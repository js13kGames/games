---
# See github.com/js13kGames/games for supported frontmatter
---
A game about collecting numbers, creating good hands, handling basic math operators, shop for upgrades and get big combos while avoiding the number 13. "It's like math but somehow even more boring"  (actual quote from my beta testing kids).

### Controls
Mouse to steer your square.
Left click to activate the shield, left clicking again while it's active will deactivate the shield. The shield recharges when not in use. Colliding with a number while the shield is active will remove that number from the board, effectively allowing you to discard that number and hope that a better one appears in it's place.

Your number of lives are indicated by the blue circles in the corner of your square. Four dots means four lives, three dots means three lives and so on. 0 lives means game over.

### Playing the game
Each hand consists of collecting four number. How those numbers are treated depends on the randomised mission of the level. Beware though! If at any point you add up to 13 you will loose a life. For this mission it could be to pick up the actual number 13 or if A+B or A+B+C equals 13. Different missions have slightly different ways to reach 13 so be aware.

The mission AB > CD combines the numbers in a slightly different way. If A is 12 and B is 4 AB is 124.

After a hand is completed a score is generated and a new mission is generated.

### Score
If you complete a mission you will be scored on the base numbers involved. Exactly how depends on the mission.  If you have the mission A `+` B `+` C `+` D your base score is simple A+B+C+D. Your base score can then be multiplied through a few factors like time, numbers have same colour and the poker quality of the hand (pair, straight, three of a kind etc)

### Shop 
Every third completed hand the shop will activate. Here you can alter the base rules of the game, increase score multipliers for certain hands, change likelihood for colours and number and increase your life (at a cost) etc.