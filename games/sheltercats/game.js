(function() {  
 var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(b){ window.setTimeout(b, 1E3/30)};   
   window.requestAnimationFrame = requestAnimationFrame; })();
(function(ex){
 ex.spool = [];
 ex.scount = 0;
 ex.MAX_SOUNDS = 8;
 ex.sToLoad = 4;
  ex.showN = {
     t: 0,
    dr: function(){
      var o = {};
        o.x = ex.ssprt.x + ex.ssprt.w/2;
        o.y = ex.ssprt.y + ex.ssprt.h/2;
        o.r = ex.ssprt.w*1.4;
        o.c = "rgba(200,180,20,"+ex.showN.t+")";
      ex.drawCircle(ex.ctx, o);
       ex.text(
         ex.v.sc, ex.ssprt.x+ ex.ssprt.w/2,
         ex.ssprt.y+ex.ssprt.h/2,
         "medium", "center", "red" );
    },
  };
  ex.row = function( a , n ){
     return Math.floor ( a / n );
   };
  ex.column = function( a , n ){
     return a % n ;
   };
  ex.drawCircle = function (c,o){
     c.strokeStyle= "rgb(0,0,0)";
     c.fillStyle= o.c; 
     c.lineWidth = 1; 
     c.beginPath();
     c.arc(o.x,o.y,o.r,0,Math.PI*2,true);
     c.fill(); 
     c.stroke();}
ex.gradientFill= function(c,x,y,color1,color2){
var bgfade = c.createLinearGradient(0,0,x,y);
 bgfade.addColorStop(0.0,color1);
 bgfade.addColorStop(1.0,color2);
 c.fillStyle = bgfade;
 c.fillRect(0,0,x,y);};
ex.text = function(s,x,y,size,align,c){
  var o = ex.ctx;
  o.fillStyle = c || "white";
  o.strokeStyle = "black";
  o.textAlign = align;
  o.texBaseline="middle";
  switch (size){
    case "small": 
   o.font = "normal bold 20px sans-serif";
	              break;
	case "medium":
   o.font = "normal bold 50px sans-serif";
	              break;
	case "large":
   o.font = "normal bold 80px sans-serif";
	              break;
	}
    o.fillText(s,x,y);
  o.strokeText(s,x,y);
};
ex.spr = function( im, x, y, w, h, color){
  var sprt = Object.create( ex.spritemodel );
  sprt.x = x;
  sprt.y = y;
  sprt.h = h;
  sprt.w = w; 
  sprt.r = w/2;
  sprt.image = im;
  sprt.color = color; 
  return sprt;
};
  ex.spritemodel = {
    x: 0,
    g: 0.8,
    f: 0.08,
    y: 0,
    vx: 4,
    vy: -8,
    h: 0,
    w: 0,
    r: 0,
image: null, 
color: "gold",
goLeft: function(){
    this.x += this.vx;
  },
 draw: function(){
      if (this.image){
        ex.ctx.drawImage( this.image, this.x,  this.y, this.w, this.h );
     }
   },
 checkWallColision: function(){
      if ( this.y < 0) {
      this.vy = - this.vy;
      return true;
      }//if 
      if ( this.x >= _.width-this.w  || this.x <=0) {
      this.vx = - this.vx;
      this.f = -this.f;
      return true;
      }
     if ( this.y>=_.height ){return false;}
  },
 colisionWith: function(a){
  var cseg = (this.w/2 + a.w/2)*(this.w/2 + a.w/2) ;
  var dy = this.y-a.y;
  var dx = this.x -a.x;
  var d = dx*dx+dy*dy;
  if (  d <=  cseg ){
   this.vy = -this.vy/4;
   this.y += this.h;
   this.x>0 && this.x<ex.width && (this.vx = -this.vx);
   return true;
   }
  else {return false}
  },
  clicked: function(){
     var dy = this.y+this.r - ex.ty;
     var dx = this.x+this.r - ex.tx;
     var d = dx*dx+dy*dy;
     var r2 = this.r*this.r;
     if (d<=r2){
       _.tx = null;
       _.ty = null;
      return true;
     }
     return false;
  },
  };
 ex.loaded = function(e) {
   ex.scount++;
  if (ex.scount >= ex.sToLoad) {
   ex.sound.removeEventListener("canplaythrough",ex.loaded, false);
   ex.cat.removeEventListener("load",ex.loaded, false);
   ex.shltr.removeEventListener("load",ex.loaded, false);
   ex.fw.removeEventListener("load",ex.loaded, false);
   ex.ob.removeEventListener("load",ex.loaded, false);
   ex.spool.push({name: "snd.wav", element: ex.sound, played:false});
   ex.v.state = "start";
}
};
ex.playsound = function(sound,volume) {
  var soundFound = false;
  var soundIndex = 0;
  var tempSound;
    if (ex.spool.length> 0) {
     while (!soundFound && soundIndex < ex.spool.length) {
       var tSound = ex.spool[soundIndex];
         if ((tSound.element.ended || !tSound.played) && tSound.name == sound) {
          soundFound = true;
          tSound.played = true;
          } //if 
          else {
             soundIndex++;
          }
       }
    }
  if (soundFound) {
       tempSound = ex.spool[soundIndex].element;
       tempSound.volume = volume;
        tempSound.play();
  }//if
  else if (ex.spool.length < ex.MAX_SOUNDS){
    tempSound = document.createElement("audio");
    tempSound.setAttribute("src", sound);
    tempSound.volume = volume;
    tempSound.play();
  ex.spool.push({name:sound, element:tempSound, type:audioType, played:true});
}
}
  ex.v = {
  	state: "initapp",
    hS:      1, 
    score:      0,
     };
ex.animate   = function(frame){
    var running, lastFrame = +new Date;
    var loop = function(now){
      var deltaT ;
      if ( running !== false ){
        requestAnimationFrame( loop );
        now = now && now > 1E4 ? now : +new Date;
        deltaT = now - lastFrame;
        if ( deltaT < 160 ){
          running = frame( deltaT );
        }
        lastFrame = now;
       }
     };
     loop( lastFrame );
};
ex.canvas = null;
ex.sTS = function(a) {
 localStorage.clear();
  var t = JSON.stringify(a);
     localStorage.setItem("_", t );
}
ex.gS = function() {
var k = localStorage.getItem("_");
var g={};
 if (k){ g = JSON.parse(k);
   _.v.hS = g.hS;
   _.v.sc = 0;
 }
 else {
   _.v.hS = 1;
   _.v.sc = 0;
 }
}
})(this._ = {});
_.init = function(){_.setCVS = function(cvs){  _.cs = window.getComputedStyle(document.body);  _.w = parseInt(_.cs.getPropertyValue("width"),10);  _.h = parseInt(_.cs.getPropertyValue("height"),10); _.dpr = window.devicePixelRatio; cvs.setAttribute("width",_.w*_.dpr); cvs.setAttribute("height",_.h*_.dpr); cvs.style.width = _.w; cvs.style.height = _.h;
 cvs.style.background = "rgba(0,0,0,0)"; }; _.initfs = function(){
 var fs = [ 'requestFullscreen', 'requestFullScreen','webkitRequestFullscreen',  'webkitRequestFullScreen', 'msRequestFullscreen', 'msRequestFullScreen',  'mozRequestFullScreen', 'mozRequestFullscreen'  ];
 var element = document.createElement('div');
 var rfs;  for (var i = 0; i < fs.length; i++){
 if (element[fs[i]]){  rfs = fs[i];   break; } } return rfs;  };    _.Crcvs = function(){   var cvs;  cvs = document.createElement("canvas");  _.setCVS(cvs);  return document.body.appendChild(cvs);
        };  _.createFullScreenTarget = function () {    var fsTarget = document.createElement('div');        fsTarget.style.margin = '0';   fsTarget.style.padding = '0';   fsTarget.style.background = 'rgba(0,0,0,0)';   return fsTarget;    };_.canvas = _.Crcvs();
  _.ctx = _.canvas.getContext("2d");  _.parent =  _.canvas.parentNode; _.canvasBg = _.Crcvs();
  _.canvasBg.setAttribute("class","canvasBg");  _.bgctx = _.canvasBg.getContext("2d");
  _.width = _.w;  _.height = _.h; _.fs = _.initfs();  _.fsTarget = _.createFullScreenTarget();  _.parent.insertBefore(_.fsTarget, _.canvasBg);  _.parent.insertBefore(_.fsTarget, _.canvas);  _.fsTarget.appendChild(_.canvasBg);
  _.fsTarget.appendChild(_.canvas);};
_.initapp = { started: false,  start: function(){_.gS();_.sound = document.createElement("audio");document.body.appendChild(_.sound);_.sound.setAttribute("src", "snd.wav");_.sound.addEventListener("canplaythrough",_.loaded,false);
 _.cat = new Image();
 _.cat.src = "cat.svg"; 
 _.cat.addEventListener( "load", _.loaded, false);
 _.shltr = new Image();
 _.shltr.src = "shltr.svg"; 
 _.shltr.addEventListener( "load", _.loaded, false);
 _.ob = new Image();
 _.ob.src = "ob.svg"; 
 _.ob.addEventListener( "load", _.loaded, false);
 _.fw = new Image();
 _.fw.src = "fw.svg"; 
 _.fw.addEventListener( "load", _.loaded, false);
  },};
_.start = {
  started: false,
  start: function(){
    _.init();
    _.sfX = _.width/12;
    _.sfY = _.height/12;
    _.obsYmin  = 3*_.sfY;
    _.obsYmax  = 8*_.sfY;
    _.midX = _.width/2;
    _.midY = _.height/2;
    _.btnD = _.width/4;
    _.csprt = _.spr( _.cat, _.width/2, _.height-5.5*_.sfX,_.sfX,  _.sfX, null);
    _.ssprt = _.spr( _.shltr,_.width/2,_.sfX*3,_.sfX*1.8,_.sfX*1.8, null);
    _.obsprt = _.spr( _.ob,_.width/2,_.sfX*3,_.sfX*1.5,_.sfX*1.5, null);
    _.fwsprt =  _.spr( _.fw,(_.width-_.btnD)/2,_.height-2.5*_.btnD, _.btnD, _.btnD, null);
    _.ssprt.vx = 1;
    _.ssprt.vy = 1;
    _.obsprt.vx = 1;
    _.obsprt.vy = 1;
    _.fwsprt.draw();
  },
  update: function(){
       _.ctx.clearRect(0,0,_.width,_.height);
       _.gradientFill(_.bgctx,_.width,_.height,"rgba(100,150,100,1)","rgba(200,15,150,1)");
       _.ctx.drawImage(_.cat,_.width*0.25, _.height*0.25,_.width/2,_.width/2);
       _.text("SHELTER",_.width*0.1,_.sfX*2,"medium","leftt");
       _.text("cats",_.width*0.1,_.sfX*3.5,"medium","left");
       _.text("smartcatprojects",_.width*0.1,_.sfX*4.2,"small","left");
       _.fwsprt.draw();
  },
  event: function(){
     if (_.fwsprt.clicked()){
        _.fsTarget[_.fs]();
        _.v.state = "help";
      }},
};
_.help = {
  started: false,
  start: function(){
    _.setCVS(_.canvas);
    _.ctx = _.canvas.getContext("2d");
    _.setCVS(_.canvasBg);
    _.bgctx = _.canvasBg.getContext("2d");
   },
        update: function(){
       _.ctx.clearRect(0,0,_.width,_.height);
       _.gradientFill(_.bgctx,_.width,_.height,"rgba(100,150,100,1)","rgba(200,15,150,1)");
       _.text("HELP US",_.midX,_.sfY*1.5,"medium","center");
       _.text("To take as many cats as",_.midX,_.sfY*2.5,"small","center");
       _.text("possible to the shelter",_.midX,_.sfY*3,"small","center");
       _.text("before it is completely",_.midX,_.sfY*3.5,"small","center"); 
       _.text("LOST",_.midX,_.sfY*5,"large","center"); 
       _.fwsprt.draw();
      _.fwsprt.clicked() && ( _.v.state = "gon");
  },
};
_.end = {
  started: false,
  start: function(){
    _.end.started = true;
    _.gon.started = false;
    _.ssprt.x=_.width/2;
    _.ssprt.y=_.sfX*3;
    _.ctx.clearRect(0,0,_.width,_.height);
    _.sTS(_.v);
},
   update: function(){
       _.ctx.clearRect(0,0,_.width,_.height);
       _.text("CATS SAVED",_.width/2,_.sfX*3,"medium","center");
       _.text(_.v.sc,_.width/2,_.sfX*5.5,"large","center");
       _.text("HIGHSCORE",_.width/2,_.sfX*9,"medium","center");
       _.text(_.v.hS,_.width/2,_.sfX*14.5,"large","center"); _.fwsprt.draw(); _.fwsprt.clicked() && ( _.v.state = "gon"); },};
_.gon = {
	started: false,
	 rPos: function(){  	  
    	 var x,y,n;
         var t=[];
           while(t.length<8){
            n = Math.floor(Math.random()*100);
            if (t.indexOf(n)===-1 && n<40){t.push(n)}
           }//while
           return t;
    	},//rPos
    obsList: [],
    start: function(){
       var createStars = function() {
          var bp = {
                    x: 0,
                    y: 0,
                    r: 0,
                    c: "red",
                   };
          var i,t, bs = [];
          var cls =["blue","orange","deepink","red","lime","yellow","purple","magenta","white","olive"];
      for (i = 0;i<50;i++){
        t = Object.create(bp);
        t.r = _.width*0.01;
        t.x = Math.floor(_.width*Math.random());
        t.y = Math.floor(_.height*Math.random());
        t.c = cls[Math.floor(Math.random()*10)];
        _.drawCircle(_.bgctx,t);
      }};  var createObs = function(){ var i,n,p,r,c; p = _.gon.rPos();
        for (i=0;i<8;i++){
            r = _.row(p[i],8);
            c = _.column(p[i],8);
            n = Object.create(_.obsprt); 
            n.x = c*_.obsprt.w; 
            n.y = _.obsYmin+r*_.obsprt.h; 
            _.gon.obsList.push(n);
        } };
     createStars();createObs();_.gon.obsList.length && createObs();
 _.ssprt.x=_.width/2; _.ssprt.y=_.sfX*3;
 _.csprt.x=_.width/2;_.csprt.y=_.height-5.5*_.sfX;_.v.sc = 0;
 _.ctx.clearRect(0,0,_.width,_.height);_.csprt.draw(); _.ssprt.draw();_.csprt.jump = false;
  }, update: function () {
       var uC = function(){
         var hit = _.csprt.colisionWith(_.ssprt);
             if (hit){
              _.v.sc++;
              _.v.sc > _.v.hS && (_.v.hS = _.v.sc);
              _.sTS(_.v);
              _.showN.t = 1;
           }
           if (hit || (_.csprt.y+_.csprt.h) > _.height && _.csprt.jump){
             _.csprt.y = _.height-5.5*_.sfX;
             _.csprt.x = _.width/2;
             _.csprt.jump = false;
             updObs(); 
             }
           for (i=0;i<8;i++){
                _.csprt.colisionWith(_.gon.obsList[i]);
            }
       if ( _.csprt.jump ){
         _.csprt.checkWallColision();
         _.csprt.vy += _.csprt.g;
         _.csprt.y += _.csprt.vy;
         if ((_.csprt.x+ _.csprt.vx)>=0  ||
             (_.csprt.x+_.csprt.vx)<=_.width)
             { _.csprt.x += _.csprt.vx;
               _.csprt.vx -= _.csprt.f;
              }}  };
       var updObs = function(){
        var i,n,p,r,c;
         p = _.gon.rPos();
        for (i=0;i<8;i++){
            r = _.row(p[i],8);
            c = _.column(p[i],8);
            _.gon.obsList[i].x = c*_.obsprt.w; 
            _.gon.obsList[i].y = _.obsYmin+r*_.obsprt.h; 
        } };
      var drawObs = function(){
        var i;
          for (i=0;i<8;i++){
            _.gon.obsList[i].checkWallColision();
            _.gon.obsList[i].goLeft();
            _.gon.obsList[i].draw();       
            }  };
_.ctx.clearRect(0,0,_.width,_.height);
        _.ctx.fillstyle = "rgba(25,10,10,0.6)";
        _.ctx.fillRect(0,0,_.width,_.sfY/2);
        _.text(_.v.hS,0,_.sfY/2,"small","left");
        _.text(_.v.sc,_.width,_.sfY/2,"small","right");  
         drawObs(); uC();
       if ((_.ssprt.y+_.ssprt.h)<=0){_.v.state="end"}
      	_.ssprt.goLeft();
        _.csprt.draw();  
        _.ssprt.checkWallColision() && (_.ssprt.y -= 6);
        _.ssprt.draw();
         if(_.showN.t>0){  _.showN.dr(); _.showN.t -= 0.01;
        }  }, event: function(e){
       _.csprt.jump = true;  _.csprt.vy = -8;
    if (_.tx > (_.csprt.x+_.csprt.r) && _.csprt.x+2<=_.width ){_.csprt.vx = 2;_.csprt.f>=0&&(_.csprt.f*=-1)  }
    else if (_.tx < (_.csprt.x -_.csprt.r) && _.csprt.x-2>=0 ){_.csprt.vx = -2;_.csprt.f>=0&&(_.csprt.f*=-1) }
  },};

window.onload = function(){
var events = function(e){
   var h = e.target.getAttribute("href");
    e.preventDefault();
    e.stopPropagation();
    _.playsound("snd.wav",0.8);
    if (typeof e.touches !== "undefined") {
      _.tx = e.touches[0].pageX;
      _.ty = e.touches[0].pageY;
     }
    else {
     _.tx = e.pageX;
     _.ty = e.pageY;
    }
    if (h){
           _[_.v.state].started = false; 
           _.v.state = h;
    }
    else if ("event" in _[_.v.state]){_[_.v.state].event(e);}
  };
_.animate( function(){
 if ( "start" in _[_.v.state] && !_[_.v.state].started){
    _[_.v.state].start();
    _[ _.v.state ].started = true; 
}
 else if ("update" in _[_.v.state]){
  _[_.v.state].update();
}
 });
document.body.addEventListener("touchstart",events, false);
document.body.addEventListener("click", events, false);
};







