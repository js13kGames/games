# **Night Dealer**

*Arcane duel on a 3×3 grid — ATK · HEX · WARD · ECLIPSE  
Tiny board game (JS), black-cat ritual vibe. Lightweight, mobile-friendly.*

## Synopsis

On full-moon midnights, a black-furred card-monger — Ankidu, the Night Dealer — weighs the fate of cats.  
On a 3×3 board, play your arcana to flip adjacent tiles and steal back time.  
Win rounds to claim the 9 lives offered by Ankidu.

## Rules (V1.2)

### Goal
A match is played in up to **3 rounds**.  
Each round is won by the player controlling the **most tiles** at the end of Turn 3.  
- If tied → the round is a draw.  
- The first to win **2 rounds** wins the match.  
- If both have 1 round after 2 rounds → a **3rd round decides**.  

### Board
- 3×3 grid.  
- Orthogonal adjacency only (N/E/S/W).

### Wheels
- Each player has 5 wheels with faces **ATK / HEX / WARD**.  
- **ECLIPSE**: may appear as a wheel face, max once per player per round.  
  After it’s used, later rolls exclude it.  

### Turns (per round: 3 turns/player)

- **Turn 1**: initial spin mandatory (uses 1 reroll slot), then play 1 or 2 adjacent tiles.  
- **Turn 2**: 0–1 reroll optional, then play 1 or 2 adjacent tiles.  
- **Turn 3**: 0–1 reroll optional, cap at 1 tile.  

Playing a tile consumes its wheel (can’t be spun again).

**RPS triangle**:  
ATK > HEX > WARD > ATK (ties do nothing).

### Tiles

- **ATK (Claw)** → beats HEX, loses to WARD.  
- **HEX (Curse/Trap, choose one on placement)**:  
  - *Curse*: mark 1 adjacent enemy → after their next turn, flip attempt (blocked by shield).  
  - *Trap*: place token on 1 adjacent empty cell → if foe plays there, cancel on-place effect and attempt immediate flip (blocked by shield). Max 1 trap per player (new replaces old).  
- **WARD (Talisman)** → on place: +1 shield on self + 1 adjacent ally (max 1 each). Beats ATK, loses to HEX.  
- **ECLIPSE (Joker)** → on place, choose an affinity (ATK/HEX/WARD). 1×/round per player.  

### Omen (second-player balance)
- At the **start of their turn**, P2 may cancel **one flip** that occurred in the previous turn.  
- One use per round.

### Reveal & resolve order (on “Validate”)

1. Trap tag (cancel on-place effect if trapped).  
2. On-place effects (WARD shield, HEX choice, etc).  
3. Trap triggers (immediate flip, shield may block, then trap consumed).  
4. Simultaneous RPS conversions (orthogonal).  
5. Delayed effects (curses).  
6. Omen (if triggered).  

## Look & feel

- Retro pixel art, orthogonal isometric board.  
- Visual feedback: player-owned tiles outlined (blue P1 / red P2).  
- Ankidu appears in dialogue bubble (avatar + text).  
- Color accents:  
  - Night `#0B0E12`  
  - Shadow `#2A2F36`  
  - Moon `#E2C044`  
  - Arcane `#6F5AFF`  
  - Hex `#D14D4D`  
  - Ward `#3BA7A9`

Icons: ATK (claw), HEX (eye), WARD (seal), ECLIPSE (crescent), plus shield/trap.

## Controls

Mouse / touch:  
- Pick wheels to reroll (max 1 on T2/T3).  
- Select a wheel, tap valid squares (1–2 adjacent on T1–T2, 1 on T3).  
- Validate to resolve.  

## License
MIT (TBD)
