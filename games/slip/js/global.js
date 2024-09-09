
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var	scene = null;
var isFirstTime = true;
var playerSpeed = {x:0,y:0};
var playerDirection = 0;
var playerAngle = 0.3;
var playerPower = 0;
var playerMaxPower = 0;
var enemyArr = [];
var playerPosArr = [];
var player = null;
var score = 0;
var enemyPassed = 0;
var bestScore = localStorage.getItem("com.harsanalif.slip.bestScore");
if(bestScore == null) bestScore = 0;
var playerState = 'direction'; //direction, charge, move, gameover
var enemySpawnLimit = 0;
var effectArr = [];

var playerLimitAlpha = 0;
var playerLimitAlphaClose = 0;
var backgroundColor = {r:5, g:5, b:5, a:1, isReset:function(){ return this.r == 5 && this.g == 5 && this.b == 5; }};


// create a new Web Audio API context
var ac = new AudioContext();
var tempo = 120;
var sequence = new TinyMusic.Sequence( ac, tempo, [
  'C3 w',
  'D3 e',
  'E3 e',
  'F3 e',
  'G3 q',
  'E3 e',
  'C3 h',
  'C4 q',
  'E4 e',
  'D4 e',
  'C4 e',
  'G3 h'
]);
sequence.gain.gain.value = 0.1;
sequence.loop = true;