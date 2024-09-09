
import { init, initKeys, Text } from './mini-kontra.bundle.js'
import { GameState } from './gameState.js'
import { Player } from './player.js'
import { Enemy } from './enemy.js'
init();
initKeys();


export const createNewPlayer = () => new Player(
  150,
  50,
  'blue',
  'green',
  3,
  5,
  2,
  100
)

export const createEnemy = (x, y, width, height, target) => new Enemy(
  x,
  y,
  'orange',
  'green',
  width,
  height,
  Math.floor(Math.random() * 10) + 5,
  width / 3,
  target,
  Math.random()
)

export const getText = (text) => new Text({
  text,
  font: '14px Helvetica',
  color: 'black',
  x: 100,
  y: 30,
  anchor: {x: 0.5, y: 0.5},
  textAlign: 'center'
})

export const gameState = new GameState()
gameState.startGame()

