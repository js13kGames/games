Fed up with your lack of contributions around the house, your owner has sent you off to work. Just your luck!

## Gameplay

**Pick up fishes** as they pass on the conveyor belt, **calculate** how much they are worth, then input, print, and **stick labels** onto them. As soon as they are **back on the belt**, your guesses will be verified: **correct prices will net you points, wrong ones won't**. The job is simple, but it's sure to keep your paws busy.

<img loading=lazy alt='How to play' src=https://fedetibaldo.com/uploads/kuro-neko-market-how-to-play.gif>

## Controls

Click. Click. Click. Just the **left mouse button**.

Some less obvious interactions that I should mention are:
  - in game, you can click on the binder notebook to flip through the pages;
  - when setting up the custom level, clicking on a fish will toggle it.

## Levels

Each of the **three main levels** offers a distinct spawn frequency, generation strategy, and fish pool. **Every run will feature a random set of modifiers**, so memorization is not a long-term strategy. Instead, quick wits and fast execution are the key to achieve 100% completion.

**The last level in the list can be customized** to fit your needs, be it for a practice run, to avoid a fish you don't like (yuck!), or to **try a even higher difficulty**.

## Trivia (optional, go play already!)

Although they look pixelated, graphics are vector art. The game is rendered on a small offscreen canvas and then upscaled without interpolation.

The glyphs for the numbers are SVG paths traced starting from the Fredoka font. I figured this was an efficient way to do custom text.

This year I discovered `context.createPattern` and have used it in several key areas, such as: to paint the fish scales, the menus backgrounds, and even the wood texture.

The collision boxes are not axis oriented. They instead match the rotation of the object. Yes, it was as painful as it sounds.