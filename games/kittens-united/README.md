## Story
Step into the paws of Amara 🐈‍⬛ — a devoted mom on a mission to reunite with her three playful kittens.

- 💚 Ivy, the energetic climber who’s always circling the tree.
- 🔷 Splashy, a water-loving rascal (much to your dismay).
- 🟡 Moony, who seems forever attracted by the moon’s mysterious pull.

Can you bring them back together before the moon sets and darkness falls? 🌙

## Controls
- On-screen buttons or keyboard
- Advanced keyboard shortcuts will be displayed once you press the first key

## Challenges
Here I have collected some level setups that I found interesting. You can load them via the 📂 button, once you finished the tutorial.

1. `🟣04🔵03🟢43🟡30🌙00🌳32💧34`
2. `🟣24🔵43🟢03🟡40🌙00🌳21💧20`
3. `🟣02🔵31🟢32🟡33🌙00🌳12💧13`
4. `🟣30🔵02🟢11🟡41🌙00🌳23💧24`
5. `🟣30🔵03🟢41🟡33🌙00🌳13💧21`
6. `🟣22🔵23🟢33🟡14🌙00🌳32💧21`
7. `🟣21🔵20🟢24🟡03🌙00🌳22💧31`
8. `🟣03🔵34🟢04🟡21🌙01🌳11💧22`
9. `🟣22🔵20🟢31🟡11🌙02🌳32💧14`
10. `🟣14🔵22🟢04🟡44🌙02🌳13💧24` - "Trap"
11. `🟣22🔵24🟢11🟡42🌙03🌳21💧23` - Short
12. `🟣21🔵24🟢13🟡02🌙32🌳12💧22` - Upside down short
13. `🟣12🔵32🟢23🟡21🌙40🌳22💧04` - Upside down long

## If you are interested
### About the level generation and difficulty
- All levels are randomly generated
- Each level is solvable within the move limit (once there is a move limit). Exception: If you see a `?` for the move limit, it means no valid level was found after 13 tries — this should be very rare.
- The displayed difficulty is based on the number of solutions (how many paths lead to victory)
- The full version of the game uses a more advanced difficulty system that slowly scales with your XP 🧶, but I had to simplify this to save some bytes
- Speaking of 🧶, it's a simple XP system:
    - Win: `+10 🧶`
    - Difficulty bonus: `+0 / +1 / +3`
    - Extra moves left: `+ leftover moves`
    - Retries: `- retries`
- You can "buy" a hint with 5 🧶
    - This will highlight the best possible next move or show a retry button if no move can lead to victory