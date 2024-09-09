const GAME = {};

function run()
{ GAME.cnv = document.getElementById("canvas");
  var d = Math.max(screen.availWidth, screen.availHeight);
  GAME.cnv.width = d;
  GAME.cnv.height = d;
  GAME.g2 = GAME.cnv.getContext("2d");
  GAME.COLUMNS = [];
  GAME.HISTORY = [];
  GAME.mouse = null;
  GAME.uiPaused = false;
  var g = 127, h = 32, a = GAME.g2.getImageData(0, 0, d, d);
  for (var i = 0; i < d * d * 4; i += 4)
  { a.data[i] = 0;
    a.data[i + 1] = (g + h * Math.random()) & 0xff;
    a.data[i + 2] = 0;
    a.data[i + 3] = 255;
  }
  GAME.cloth = a;
  GAME.game = new Spider();
  GAME.game.deal();
  GAME.game.draw();
}

function getMousePoint(event)
{ return { x: event.clientX + document.body.scrollLeft + 
  document.documentElement.scrollLeft - GAME.cnv.offsetLeft,
y: event.clientY + document.body.scrollTop  + 
  document.documentElement.scrollTop  - GAME.cnv.offsetTop };
}