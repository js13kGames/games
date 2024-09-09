var GAME = {};








var GS = [];
var SU = {};


SU.cat = function(strs) {
 var buf = "", i;
 for(i = 0; i < strs.length; i++) {
  buf += strs[i];
 }
 return buf;
}


GS[0] = "COMMANDER CRASH";
GS[1] = "0.1.1";
GS[2] = "64MEGA";
GS[3] = "JS13K 2016";
GS[4] = "WWW.64MEGA.SPACE";
GS[5] = "CLOSE WINDOW";


GS[100] = "PLANET";
GS[101] = "SYSTEM";
GS[102] = "SPACE";

GS[1000] = SU.cat([GS[0], " ", GS[1], "~~MADE FOR ", GS[3], "~~BY ", GS[2], "~~(", GS[4], ")"]);







var CANVAS = {};

CANVAS.init = function(width, height) {
 var canvas = document.createElement("canvas");
 var context = null;
 canvas.width = width;
 canvas.height = height;

 context = canvas.getContext("2d");

 document.body.appendChild(canvas);

 context.scale(2,2);

 context.mozImageSmoothingEnabled = false;
 context.msImageSmoothingEnabled = false;

 return {"canvas": canvas, "context": context};
};







var IMAGES = {};
IMAGES.images = {};

IMAGES.set_image_ready = function(img) {
 img.ready = true;
};

IMAGES.get = function(i_alias) {
 var retimg = IMAGES.images[i_alias];
 return IMAGES.images[i_alias];
};

IMAGES.load = function(i_alias, i_path) {
 var newImage = new Image();
 newImage.src = i_path;
 newImage.ready = false;
 newImage.onload = IMAGES.set_image_ready(newImage);

 IMAGES.images[i_alias] = newImage;
};

IMAGES.load_images = function() {

 IMAGES.load("font","img/font2-sheet.png");
 IMAGES.load("shipscreen","img/shipscreen2.png");
 IMAGES.load("reticle", "img/reticle.png");
};
TEXT = {
 draw : function(x, y, str) {
  var img = IMAGES && IMAGES.get("font");
  var ctx = GAME && GAME.canvas && GAME.canvas.context;
  var idex = 0;
  var nx = x, ny = y;
  var char = 0, sx = 0, sy = 0;
  if(!img) { return; }
  if(!ctx) { return; }
  for(idex = 0; idex < str.length; idex++) {
   char = str.charCodeAt(idex) - 32;
   if(char < 0) { continue; }
   if(str[idex] === '~') {
    nx = x;
    ny += 8;
    continue;
   }
   sx = char % 32;
   sy = Math.floor(char / 32);
   ctx.drawImage(img, sx*8, sy*8, 8, 8, nx, ny, 8, 8);
   nx+=8;
  }
 }
};





var BUTTON = {
 mbLeft : false,

 create : function(pos_x, pos_y, width, height, label) {

  var x = pos_x || 0;
  var y = pos_y || 0;
  var w = width || 20;
  var h = height || 20;
  var txt = label || "X";

  var that = Object.create(Object);

  var mouseover = false;
  var clicked = 0;
  var tip = "";
  var actions = [];

  that.drawButton = function(mode) {
   var ctx = GAME.getctx();
   ctx.fillStyle = "rgb(0,0,0)";
   if(mode === "normal") {
    ctx.fillStyle = "rgb(34,32,52)";
    ctx.fillRect(x,y,w,h);
   }
   if(mode === "hover") {
    ctx.fillStyle = "rgb(141,133,216)";
    ctx.fillRect(x,y,w,h);
   }
   if(mode === "press") {
    ctx.fillStyle = "rgb(15,9,13)";
    ctx.fillRect(x,y,w,h);
   }


   ctx.strokeStyle = "rgb(4,12,32)";
   ctx.strokeRect(x,y,w,h);
  }

  that.draw = function() {
   var mode = mouseover ? "hover" : "normal";
   if(clicked > 0) { mode = "press"; }


   that.drawButton(mode);
   hcx = (x+w/2)-((txt.length * 8) / 2);
   if(TEXT) {
    TEXT.draw(hcx,y+2,txt);
   }
  };

  that.update = function() {
   mx = GAME.mouse.x;
   my = GAME.mouse.y;

   if(GAME.mouse.clicked === false) { clicked = 0; BUTTON.mbLeft = false; }

   mouseover = !(mx < x || mx > x+w || my < y || my > y+h);

   if(mouseover && GAME.mouse.clicked) { clicked += 1; }

   if(clicked === 1 && actions.length > 0 && BUTTON.mbLeft === false) {
    var i;
    for(i = 0; i < actions.length; i+=1) {
     if(actions[i]) { actions[i](); }
    }
    BUTTON.mbLeft = true;
   }

   if(tip.length > 0 && mouseover) {
    GAME.status_tip = tip;
   }
  };

  that.setTip = function(atip) {
   tip = atip;
  };

  that.setAction = function(func) {
   actions.length = 0;
   actions.push(func);
  };

  that.setActions = function() {
   var i;
   for(i = 0; i < arguments.length; i+=1) {
    actions.push(arguments[i]);
   }
  }

  return that;
 }
};
var star_t = function(ax, ay, az, spd) {
 var x = ax;
 var y = ay;
 var z = az;
 var size = 1;
 var movspeed = 0.075;

 var that = Object.create(Object);

 that.draw = function() {
  var ctx = GAME && GAME.canvas && GAME.canvas.context;
  if(!ctx) { return; }
  var tx = ((x*400)/ +z) + 200;
  var ty = ((y*225)/ +z) + 60;
  var hs = 4 - ((4/320)*z);
  ctx.fillStyle = "white";
  ctx.fillRect(tx-hs,ty-hs,hs,hs);
 };

 that.update = function(delta) {
  z -= (movspeed + GAME.warpspeed*0.25) * delta;

  if(z <= 0) {
   x = (Math.random()*400)-200;
   y = (Math.random()*225)-112;
   z = Math.floor(Math.random()*320);
   movspeed = 0.075 + (Math.random()*0.075);
  }
 };

 return that;
};

var StarField = function (num_stars) {
 var nx, ny, nz, movspeed;
 var idex;
 var stars = [];

 for(idex = 0; idex < num_stars; idex++) {
  nx = (Math.random()*400)-200;
  ny = (Math.random()*225)-112;
  nz = Math.floor(Math.random() * 320);
  movspeed = 0.075 + (Math.random() * 0.075);
  stars.push(star_t(nx, ny, nz, movspeed));
 }

 return stars;
};





var GameScreen = function() {
 var that = Object.create(Object);

 that.propagate = false;
 that.dead = false;

 that.update = function(delta) {

 };

 that.draw = function() {

 };

 that.kill = function() {
  that.dead = true;
 };

 return that;
};

GAME.screens = [];

GAME.push_screen= function(screen) {
 GAME.screens.push(screen);
};

GAME.update_screens = function(delta) {
 var idex;
 for(idex = GAME.screens.length-1; idex >= 0; idex--) {
  if(GAME.screens[idex] === undefined ||
     GAME.screens[idex].dead) {
   GAME.screens.splice(idex,1);
   continue;
  }
  GAME.screens[idex].update(delta);

  if(!GAME.screens[idex].propagate) {
   break;
  }
 }
};

GAME.draw_screens = function() {
 var idex;
 for(idex = 0; idex < GAME.screens.length; idex++) {
  GAME.screens[idex].draw();
 }
};





var ScreenMessage = function(t, msg) {
  var that = Object.create(GameScreen());
  var title = t;
  var message = msg;
  var x = 50;
  var y = 50;
  var w = 300;
  var h = 125;
  var btn_close = BUTTON.create(x+w-12,y,12,12, "X");

  btn_close.setTip(GS[5]);
  btn_close.setAction(that.kill);

  that.update = function(delta) {
   btn_close.update();
  };

  that.draw = function() {
   ctx = GAME.canvas.context;
   if(!ctx) { return; }
   ctx.fillStyle = "rgb(34,32,52)";
   ctx.fillRect(50,50,300,125);

   ctx.strokeStyle = "white";
   ctx.strokeRect(50,50,300,125);

   btn_close.draw();

   TEXT.draw(x,y+2,title)

   ctx.beginPath();

   ctx.moveTo(x,y+12);
   ctx.lineTo(x+w,y+12);
   ctx.strokeStyle = "white";
   ctx.stroke();
   ctx.closePath();

   TEXT.draw(x,y+13,message);
  };

  return that;
};






var ScreenHelp = function() {
 var that = Object.create(GameScreen());
 var btns = [];
 btns[0] = BUTTON.create(0,213,400,12,GS[5]);



 btns[0].setAction(that.kill);

 that.update = function(delta) {
  btns[0].update();


 };

 that.draw = function(delta) {
  ctx = GAME.getctx();
  ctx.fillRect(0,0,400,225);

  TEXT.draw(4,12,"COMMANDER CRASH: BASIC HELP~---------------------------~~Reach the BLUE HOLE and fix the SYSTEM GLITCH.~Each warp will lead to a decision that must be~made in order to continue.~Choose wisely, some choices will hurt you.~~TERMINOLOGY:~HP: Pilot's Health~HULL: Ship's Health~VIRUS: Viral infection level (100 is bad)~HUNGER: Hunger level (100 is bad)~CYCLES: Your fuel. Each warp == -1 cycle~RAM: Your food.~STORE: Currency~PATCHES: Repairs ship and other things~HOTFIX: Heals HP~ANTIVIRUS: Heals Viral Infection~~The game is semi-randomized, so it may be a bit~unfair at times.~Good luck and enjoy!");

  btns[0].draw();


 };

 return that;
}
var WORLD = {};
WORLD.root = [];

WORLD.sector = function(name, locs) {
 return {
  "name": name,
  "locs": locs
 };
};

WORLD.place = function(type, name, isVisible) {
 return {
  "name": name,
  "type": type,
  "visible": isVisible || true
 };
};

WORLD.populate = function() {
 rt = WORLD.root;
 rt[0] = WORLD.sector("MEM",[
   WORLD.place(0,"START"),
   WORLD.place(3,"PAGE"),
   WORLD.place(3,"BUFFER"),
   WORLD.place(4,"STACK")
  ]);
};





var ScreenSystem = function() {
 var that = Object.create(GameScreen());
 var btn_close = BUTTON.create(0,12,400,12,GS[5]);
 btn_close.setAction(that.kill);

 var btn_choices = [];

 var ev = DIRECTOR.pop();

 (function(){
  if(!ev) { return; }
  var i, sy = 213;
  var btn_tmp;
  for(i = 0; i < ev.choice.length; i += 1) {
   btn_tmp = BUTTON.create(0,sy,400,12,ev.choice[i].label);
   btn_tmp.setActions(ev.choice[i].action, that.kill);
   btn_choices.push(btn_tmp);
   sy -= 13;
  }
 })();

 that.update = function(delta) {
  var i;
  btn_close.update();
  for(i = 0; i < btn_choices.length; i += 1) {
   btn_choices[i].update();
  }
 };

 that.draw = function() {
  var i;
  var ctx = GAME.getctx();
  ctx.fillRect(0,0,400,225);
  ctx.fillRect(10,30,380,185);


  if(ev) {
   TEXT.draw(12,24,ev.message);
  }

  btn_close.draw();
  for(i = 0; i < btn_choices.length; i += 1) {
   btn_choices[i].draw();
  }

 };

 return that;
};






var STATS = [];
GAME.init_stats = function() {
 STATS[0] = 10;
 STATS[2] = 5;
 STATS[3] = 2;
 STATS[4] = 3;
 STATS[5] = 1;
 STATS[6] = 0;
 STATS[7] = 0;
 STATS[9] = 0;
 STATS[8] = 0;
 STATS[1] = 100;
};

GAME.stat_reduce = function(stat_id, amount) {
 STATS[stat_id] -= amount;
};

GAME.stat_increase = function(stat_id, amount) {
 STATS[stat_id] += amount;
};







var EVENTS = {};

EVENTS.base_id = 0;

EVENTS.START = null;
EVENTS.EASY = [];
EVENTS.MID = [];
EVENTS.HARD = [];
EVENTS.FINAL = null;
EVENTS.create = function(message, choices) {
 var id = EVENTS.base_id;
 EVENTS.base_id += 1;
 return {
  "id": id,
  "message": message,
  "choice": choices
 };
};


EVENTS.chance = function(perc, a, b) {
 var v = Math.round(Math.random()*100);
 v < perc ? a() : b();
};

EVENTS.init = function() {
 EVENTS.EASY.push(

  EVENTS.create("YOU ENCOUNTER A DRIFTING CARGO CONTAINER IN~OPEN SPACE.",
  [
   {
    label: "RETRIEVE CARGO",
    action: function() { EVENTS.chance(50, function() {
     GAME.stat_reduce(1, 20);
     GAME.push_screen(ScreenMessage("RETRIEVED CARGO","You retrieve the cargo container.~Within you discover a special PATCH.~~+20 HP"));
    },
    function() {
     GAME.stat_increase(2, 2);
     GAME.push_screen(ScreenMessage("RETRIEVED CARGO","You retrieve the cargo container.~Within you discover some CYCLES.~~+2 CYCLES"));
    })}
   },
   {
    label: "DESTROY CARGO",
    action: function() {
     EVENTS.chance(50, function() {
      GAME.push_screen(ScreenMessage("DESTROYED CARGO","A piece of debris clips the wing of~your ship, damaging it slightly.~~-1 HULL"));
     }, function() {
      GAME.push_screen(ScreenMessage("DESTROYED CARGO","You destroy the cargo container~and move on."));
     });
    }
   },
   {
    label: "IGNORE AND CONTINUE",
    action: function() {
     GAME.push_screen(ScreenMessage("IGNORED CARGO","Deciding you're low on time, you~ignore the cargo container and~continue onward."));
    }
   }
  ]),

  EVENTS.create("YOU WARP INTO OPEN SPACE.~YOUR SCANNERS CANNOT DETECT ANY~OTHER VESSELS.~~THIS MAY BE A GOOD OPPORTUNITY~TO REST UP BEFORE RESUMING YOUR JOURNEY.",
  [
   {
    label: "REST UP (-1 RAM, GAIN 10 HP)",
    action: function() {
     GAME.stat_increase(1, 10);
     GAME.stat_increase(9, 5);
    }
   },
   {
    label: "CONTINUE WITHOUT RESTING",
    action: function() {

    }
   }
  ]),

  EVENTS.create("YOU ENCOUNTER A DRIFTING CARGO CONTAINER IN~OPEN SPACE.",
  [
   {
    label: "RETRIEVE CARGO",
    action: function() { EVENTS.chance(50, function() {
     GAME.stat_reduce(1, 20);
     GAME.push_screen(ScreenMessage("RETRIEVED CARGO","You retrieve the cargo container.~Inside is a Moonbear cub~~Your face got mauled~-30 HP"));
    },
    function() {
     GAME.stat_increase(2, 2);
     GAME.push_screen(ScreenMessage("RETRIEVED CARGO","You retrieve the cargo container.~Some kind of strange gas is released~from within.~~+25 VIRAL INFECTION"));
    })}
   },
   {
    label: "DESTROY CARGO",
    action: function() {
     EVENTS.chance(50, function() {
      GAME.push_screen(ScreenMessage("DESTROYED CARGO","A piece of debris clips the wing of~your ship, damaging it slightly.~~-1 HULL"));
     }, function() {
      GAME.push_screen(ScreenMessage("DESTROYED CARGO","You destroy the cargo container~and move on."));
     });
    }
   },
   {
    label: "IGNORE AND CONTINUE",
    action: function() {
     GAME.push_screen(ScreenMessage("IGNORED CARGO","Deciding you're low on time, you~ignore the cargo container and~continue onward."));
    }
   }
  ])

 );
};












var array_shuffle = function(ar) {

 var i, j, temp;
 for(i = ar.length - 1; i > 0; i--) {
  j = Math.floor(Math.random() * (i + 1));
  temp = ar[i];
  ar[i] = ar[j];
  ar[j] = temp;
 }
}

var DIRECTOR = {};

DIRECTOR.queue = [];


DIRECTOR.init = function() {
 DIRECTOR.queue.length = 0;
 var ids_e = [], ids_m = [], ids_h = [];
 var i;
 for(i = 0; i < EVENTS.EASY.length; i += 1) { ids_e.push(i); }
 for(i = 0; i < EVENTS.MID.length; i += 1) { ids_m.push(i); }
 for(i = 0; i < EVENTS.HARD.length; i += 1) { ids_h.push(i); }
 array_shuffle(ids_e);
 array_shuffle(ids_m);
 array_shuffle(ids_h);

 for(i = 0; i < ids_e.length; i += 1) {
  DIRECTOR.queue.push(EVENTS.EASY[ids_e[i]]);
 }
 for(i = 0; i < ids_m.length; i += 1) {
  DIRECTOR.queue.push(EVENTS.MID[ids_m[i]]);
 }
 for(i = 0; i < ids_h.length; i += 1) {
  DIRECTOR.queue.push(EVENTS.HARD[ids_h[i]]);
 }
};


DIRECTOR.pop = function() {
 var item = DIRECTOR.queue[0];
 DIRECTOR.queue.splice(0,1);
 console.dir(item);
 return item;
}

GAME.canvas = null;
GAME.timing = {};
GAME.timing.then = Date.now();


GAME.width = 800;
GAME.height = 450;
GAME.innerwidth = 400;
GAME.innerheight = 225;
GAME.nativewidth = 400;
GAME.nativeheight = 225;


GAME.status_text = "Location Unknown";
GAME.status_tip = "";


GAME.buttons = [];


GAME.init_buttons = function() {
 var btn_warp = BUTTON.create(74, 149, 252, 12, "WARP TO NEXT WAYPOINT");
 var btn_status = BUTTON.create(74, 162, 252, 12, "SHIP & PLAYER STATUS");

 var btn_help = BUTTON.create(74,210,252,12,"HELP");
 btn_warp.setAction(function() {
  GAME.push_screen(ScreenSystem());
 });



 btn_help.setAction(function() {
  GAME.push_screen(ScreenHelp());
 });
 btn_status.setAction(function() {
  GAME.push_screen(ScreenMessage("GAME","Not yet implemented."));
 })

 GAME.buttons.push(btn_warp, btn_status, btn_help);
};

GAME.init = function() {
 GAME.init_buttons();
 GAME.init_stats();
 EVENTS.init();
 DIRECTOR.init();
 GAME.starfield = StarField(140);

 GAME.warpspeed = 0.1;
};

GAME.getctx = function() {
 return GAME.canvas.context;
}


var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var dbgswitch = false;

GAME.game_loop = function() {
 var now = Date.now();
 var delta = now - GAME.timing.then;
 var ctx = GAME.canvas.context;

 var BG = IMAGES.get("shipscreen");
 var RET = IMAGES.get("reticle");

 var idex = 0;

 ctx.fillStyle = "black";
 ctx.imageSmoothingEnabled = false;
 ctx.globalAlpha = 1.0 - GAME.warpspeed;
 ctx.fillRect(0,0,400,225);
 ctx.globalAlpha = 1.0;

 if(GAME.starfield) {
  for(idex = 0; idex < GAME.starfield.length; idex++) {
   GAME.starfield[idex].update(delta);
   GAME.starfield[idex].draw();
  }
 }

 if(BG && BG.ready) {
  ctx.drawImage(BG, 0, 0);
 }
 if(RET && RET.ready) {
  ctx.drawImage(RET, 141, 65);
 }

 ctx.fillStyle = "black";
 ctx.fillRect(0,0,400,8);

 for(idex = 0; idex < GAME.buttons.length && GAME.screens.length === 0; idex++) {
  if(GAME.buttons[idex]) {
   GAME.buttons[idex].update();
   GAME.buttons[idex].draw();
  }
 }

 if(GAME.screens.length > 0) {
  GAME.update_screens(delta);
  GAME.draw_screens();
 }

 if(GAME.status_tip.length > 0) {
  hcx = (GAME.status_tip.length * 8) / 2;
  TEXT.draw(200-hcx,0,GAME.status_tip);
 } else
 if(GAME.status_text.length > 0) {
  hcx = (GAME.status_text.length * 8) / 2;
  TEXT.draw(200-hcx,0,GAME.status_text);
 }

 GAME.status_tip = "";

 GAME.timing.then = now;

 requestAnimationFrame(GAME.game_loop);
};

GAME.main = function() {
 console.log("Game starting!");
 GAME.canvas = CANVAS.init(GAME.width, GAME.height);
 GAME.canvas.context.fillStyle = "black";
 GAME.canvas.context.fillRect(0,0,400,225);

 var cnvl = GAME.canvas.canvas.addEventListener;
 cnvl('mousemove', GAME.mouse.updateXY, false);
 cnvl('mousedown', GAME.mouse.mouseDown, false);
 cnvl('mouseup', GAME.mouse.mouseUp, false);
 cnvl('contextmenu', GAME.mouse.updateRClick, false);

 IMAGES.load_images();

 GAME.timing.then = Date.now();
 GAME.init();
 GAME.game_loop();
};

GAME.mouse = {
 x: 0,
 y: 0,
 clicked: false
};
GAME.mouse.updateXY = function(evt) {
 var rect = GAME.canvas.canvas.getBoundingClientRect();
 GAME.mouse.x = Math.floor((evt.clientX - rect.left)/2);
 GAME.mouse.y = Math.floor((evt.clientY - rect.top)/2);
};

GAME.mouse.mouseDown = function(evt) {
 GAME.mouse.clicked = true;
};

GAME.mouse.mouseUp = function(evt) {
 GAME.mouse.clicked = false;
};

GAME.mouse.updateRClick = function(evt) {
 evt.preventDefault();
 evt.stopPropagation();
};

GAME.main();
