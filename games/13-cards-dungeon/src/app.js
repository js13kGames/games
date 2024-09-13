import CardManager from "./engine/cardManager.js";
import Game from "./engine/gameManager.js";
import LevelManager from "./engine/levelManager.js";

const App = () => {
  const cardsManager = new CardManager();
  const levels = [
    { 0: "start", 3: "key", 6: "door" },
    { 7: "start", 5: "key", 6: "door" },
    { 0: "start", 4: "key", 11: "door", 3: "enemy" },
    { 0: "start", 17: "door", 11: "key", 10: "enemy" },
    { 14: "start", 1: "door", 5: "key", 4: "enemy" },
    { 7: "start", 6: "door", 12: "key", 11: "enemy", 19: "enemy" },
    { 20: "start", 7: "door", 6: "key", 13: "enemy", 12: "enemy" },
    { 10: "start", 20: "door", 0: "key", 1: "enemy", 12: "enemy" },
    {
      6: "start",
      14: "door",
      0: "key",
      5: "enemy",
      13: "enemy",
      12: "enemy",
      7: "enemy",
    },
    {
      0: "start",
      20: "door",
      10: "key",
      3: "enemy",
      9: "enemy",
      11: "enemy",
      17: "enemy",
      19: "enemy",
      13: "enemy",
    },
    {
      7: "start",
      14: "door",
      6: "key",
      3: "enemy",
      4: "enemy",
      11: "enemy",
      12: "enemy",
      18: "enemy",
      19: "enemy",
    },
    {
      0: "start",
      17: "door",
      20: "key",
      16: "enemy",
      9: "enemy",
      10: "enemy",
      11: "enemy",
      18: "enemy",
      19: "enemy",
      13: "enemy",
    },
    {
      17: "start",
      0: "door",
      6: "key",
      16: "enemy",
      9: "enemy",
      10: "enemy",
      11: "enemy",
      18: "enemy",
      19: "enemy",
      13: "enemy",
      1: "enemy",
      7: "enemy",
      8: "enemy",
    },
  ];
  const levelManager = new LevelManager(21, 0, levels);

  const game = new Game(cardsManager, levelManager);

  game.buildStart();
};

App();
