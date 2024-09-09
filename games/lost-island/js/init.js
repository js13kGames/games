var canvas = document.getElementById('game');
var topCanvas = document.getElementById('top');
var hpBar = document.getElementById('hp');
var pubSub = new PubSub();
var keyboard = new Keyboard({ element: document.body });
var sprites = new Sprites();
var worldMap = new WorldMap(1000, 800);
var player = new Player();
var playerRenderer = new PlayerRenderer({ player, canvas, sprites, worldMap });
var worldMapRenderer = new WorldMapRenderer({ worldMap, sprites, canvas, topCanvas, player });
var playerUpdater = new PlayerUpdater({ player, keyboard, worldMap, hpBar, pubSub });
var loop = new GameLoop({
  updatePipeline: [
    playerUpdater
  ],
  renderPipeline: [
    worldMapRenderer,
    playerRenderer
  ]
});
var firstLand;

sprites.generate();
worldMap.generateMountains();
worldMap.erode(2);
worldMap.generateVegetation();
worldMap.placeEquipments();
firstLand = worldMap.tiles.findIndex(function (tile) { return tile.height > 1; });
player.x = (firstLand % worldMap.width) * worldMap.tileSize + worldMap.tileSize / 2;
player.y = Math.floor(firstLand / worldMap.width) * worldMap.tileSize + worldMap.tileSize / 2;
worldMapRenderer.render();

this.pubSub.subscribe('gameOver', gameOver);
this.pubSub.subscribe('endGame', endGame);

function startGame () {
  document.getElementById('home').classList.add('hidden');
  document.getElementById('play').classList.remove('hidden');
  loop.start();
  document.body.removeEventListener('keypress', startGame);
}

function endGame () {
  loop.stop();
  document.getElementById('play').classList.add('hidden');
  document.getElementById('endGame').classList.remove('hidden');
}

function gameOver () {
  loop.stop();
  document.getElementById('play').classList.add('hidden');
  document.getElementById('gameOver').classList.remove('hidden');
}

document.body.addEventListener('keypress', startGame);
