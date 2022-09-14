(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const GameStateMachine = require('./game_state_machine');

function Game () {
	var animFrame = window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
    	        window.mozRequestAnimationFrame    ||
        	    window.oRequestAnimationFrame      ||
            	window.msRequestAnimationFrame     ||
				null ,
		gameStateMachine = GameStateMachine(),
		update = () => {
			gameStateMachine.update();
			gameStateMachine.draw();
		},
		setup = () => {
			gameStateMachine.setState(gameStateMachine.SPLASH_STATE);

			if ( animFrame !== null ) {
				var recursiveAnim = function() {
					update();
					animFrame( recursiveAnim );
				};
				animFrame( recursiveAnim );
			} else {
				animFrame = window.setInterval(update, 20);
			}
		};

	setup();
};

module.exports = Game;
},{"./game_state_machine":2}],2:[function(require,module,exports){
const SplashState = require('./gamestates/splashscreen');
const GameLevelState = require('./gamestates/level');
const GameOverState = require('./gamestates/gameover');
const GameCompleteState = require('./gamestates/gamecomplete');

const GameView = require('./gameeng/view');

var GameStateMachine = (gameConf) => {

	this.SPLASH_STATE = 'splash_state';
	this.GAME_LEVEL_STATE = 'game_level_state';
	this.GAME_OVER_STATE = 'game_over_state';
	this.GAME_COMPLETE_STATE = 'game_complete_state';

	var gameState = null;

	this.gameSize = {width:3200, height:600};
	this.viewSize = {width:800, height:600};
	
	this.levelNumber = 0;
	this.lives = 3;

	this.view = new GameView(this.gameSize);
	this.view.init('game_canvas');
	this.view.size(this.viewSize.width, this.viewSize.height);

	this.update = function()
	{
		if(gameState != null) gameState.update();	
	}

	this.draw = function()
	{
		if(gameState != null) gameState.draw();
	}

	this.destroy = function()
	{
		if(gameState != null) gameState.destroy();
	}

	this.getState = function()
	{
		var res = "no_state_set";
		if(gameState != null) res = gameState.getState();
		return res;
	}

	this.setState = function(newState)
	{
		if(gameState != null) this.destroy();

		switch (newState){
		
			case this.SPLASH_STATE:
				gameState = SplashState(this);
				break;
			case this.GAME_LEVEL_STATE:
				gameState = GameLevelState(this);
				break;
			case this.GAME_OVER_STATE:
				gameState = GameOverState(this);
				break;
			case this.GAME_COMPLETE_STATE:
				gameState = GameCompleteState(this);
				break;
			default :
				break;
		}
	}

	return this;
}

module.exports = GameStateMachine;
},{"./gameeng/view":14,"./gamestates/gamecomplete":21,"./gamestates/gameover":22,"./gamestates/level":23,"./gamestates/splashscreen":24}],3:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');

var frames = [[
    //left
    "***********m*"+
    "**********mm*"+
    "*********mmc*"+
    "**mmm****mmc*"+
    "**mwm***mmc**"+
    "*ommm***mm***"+
    "ooommmmmm**mm"+
    "o****mmmmmmm*"+
    "*****mcccmc**"+
    "*******occo**"+
    "******oo*oo**"+
    "******o**o***",
],[
    //right
    "*m***********"+
    "*mm**********"+
    "*cmm*********"+
    "*cmm****mmm**"+
    "**cmm***mwm**"+
    "***mm***mmmo*"+
    "mm**mmmmmmooo"+
    "*mmmmmmm****o"+
    "**cmcccm*****"+
    "**occo*******"+
    "**oo*oo******"+
    "***o**o******",
]];

function Eagle () {
    let drawable = {};

    // sprites [ "left frames" , "right frames" ]
    drawable.sprites = frames;

    drawable.linesAmount = 12;
    drawable.linesLength = 13;
    
    drawable.pixelSize = new PhysicVector(5,5);
    drawable.animSpeed = 200;
    drawable.framecounter = 0;
    drawable.lastFrameUpdate = new Date();

    drawable.size = new PhysicVector(40,40);
    drawable.pixelSize.x = drawable.size.x/drawable.linesLength;
    drawable.pixelSize.y = drawable.size.y/drawable.linesAmount;

    drawable.colors = {
        w: "rgba(255, 255, 255, 1)",
        m: "rgba(157, 70, 0, 1)",
        c: "rgba(222, 101, 4, 1)",
        o: "rgba(223, 156, 0, 1)"
    };

    drawable.update = () => {

    };

    return drawable;
};

module.exports = Eagle;
},{"../gameeng/physicvector":12}],4:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');

var frames = [[
    //left
    "o*o*******o"+
    "ooo******oo"+
    "ror******oo"+
    "ooo*****o**"+
    "*o*ooooo***"+
    "***ooooo***"+
    "***ooooooo*"+
    "**oo****oo*"+
    "**o******o*",

    "o*o******o*"+
    "ooo******oo"+
    "ror******oo"+
    "ooo*****o**"+
    "*o*ooooo***"+
    "***ooooo***"+
    "***ooooooo*"+
    "*oo*****oo*"+
    "*o********o",
],[
    //right
    "o*******o*o"+
    "oo******ooo"+
    "oo******ror"+
    "**o*****ooo"+
    "***ooooo*o*"+
    "***ooooo***"+
    "*ooooooo***"+
    "*oo****oo**"+
    "*o******o**",

    "*o******o*o"+
    "oo******ooo"+
    "oo******ror"+
    "**o*****ooo"+
    "***ooooo*o*"+
    "***ooooo***"+
    "*ooooooo***"+
    "*oo*****oo*"+
    "o********o*",
]];

function Fox () {
    let drawable = {};

    // sprites [ "left frames" , "right frames" ]
    drawable.sprites = frames;

    drawable.linesAmount = 9;
    drawable.linesLength = 11;
    
    drawable.pixelSize = new PhysicVector(5,5);
    drawable.animSpeed = 200;
    drawable.framecounter = 0;
    drawable.lastFrameUpdate = new Date();

    drawable.size = new PhysicVector(60,50);
    drawable.pixelSize.x = drawable.size.x/drawable.linesLength;
    drawable.pixelSize.y = drawable.size.y/drawable.linesAmount;

    drawable.colors = {
        o: "rgba(223, 156, 0, 1)",
        r: "rgba(255, 0, 0, 1)"
    };

    drawable.update = () => {

    };

    return drawable;
};

module.exports = Fox;
},{"../gameeng/physicvector":12}],5:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');

var whiteChicken = [[
    //left
    "*www*******"+
    "ywbw*******"+
    "*www*******"+
    "***w*****ww"+
    "***wwwwww**"+
    "***wwwwww**"+
    "***wwwww***"+
    "***wwwww***"+
    "****y*y****"+
    "****y*y****"+
    "****y*y****",

    "*www*******"+
    "ywbw*******"+
    "*www*******"+
    "***w*****ww"+
    "***wwwwww**"+
    "***wwwwww**"+
    "***wwwww***"+
    "***wwwww***"+
    "****y*y****"+
    "***y***y***"+
    "**y*****y**"
],[
    //right
    "*******www*"+
    "*******wbwy"+
    "*******www*"+
    "ww*****w***"+
    "**wwwwww***"+
    "**wwwwww***"+
    "***wwwww***"+
    "***wwwww***"+
    "****y*y****"+
    "****y*y****"+
    "****y*y****",

    "*******www*"+
    "*******wbwy"+
    "*******www*"+
    "ww*****w***"+
    "**wwwwww***"+
    "**wwwwww***"+
    "***wwwww***"+
    "***wwwww***"+
    "****y*y****"+
    "***y***y***"+
    "**y*****y**"
]];

var brownChicken = [[
    //left
    "*gwg*******"+
    "ywbm*******"+
    "*mwg*******"+
    "***m*****ww"+
    "***gwgmgm**"+
    "***mmwgmw**"+
    "***gwmwg***"+
    "***wgmgw***"+
    "****y*y****"+
    "****y*y****"+
    "****y*y****",

    "*gwg*******"+
    "ywbm*******"+
    "*mwg*******"+
    "***m*****ww"+
    "***gwgmgm**"+
    "***mmwgmw**"+
    "***gwmwg***"+
    "***wgmgw***"+
    "****y*y****"+
    "***y***y***"+
    "**y*****y**"
],[
    //right
    "*******gwg*"+
    "*******wbmy"+
    "*******mwg*"+
    "ww*****m***"+
    "**mgmgwg***"+
    "**wmgwmm***"+
    "***gwmwg***"+
    "***wgmgw***"+
    "****y*y****"+
    "****y*y****"+
    "****y*y****",

    "*******gwg*"+
    "*******wbmy"+
    "*******mwg*"+
    "ww*****m***"+
    "**mgmgwg***"+
    "**wmgwmm***"+
    "***gwmwg***"+
    "***wgmgw***"+
    "****y*y****"+
    "***y***y***"+
    "**y*****y**"
]];

var blackChicken = [[
    //left
    "rr*********"+
    "*rr********"+
    "*bbb*******"+
    "ybwb*******"+
    "*bbb*******"+
    "*r*b*****bb"+
    "***bbbbbb**"+
    "***bbbbbb**"+
    "***bbbbb***"+
    "***bbbbb***"+
    "****y*y****"+
    "****y*y****"+
    "****y*y****",

    "rr*********"+
    "*rr********"+
    "*bbb*******"+
    "ybwb*******"+
    "*bbb*******"+
    "*r*b*****bb"+
    "***bbbbbb**"+
    "***bbbbbb**"+
    "***bbbbb***"+
    "***bbbbb***"+
    "****y*y****"+
    "***y***y***"+
    "**y*****y**"
],[
    //right
    "*********rr"+
    "********rr*"+
    "*******bbb*"+
    "*******bwby"+
    "*******bbb*"+
    "bb*****b*r*"+
    "**bbbbbb***"+
    "**bbbbbb***"+
    "***bbbbb***"+
    "***bbbbb***"+
    "****y*y****"+
    "****y*y****"+
    "****y*y****",

    "*********rr"+
    "********rr*"+
    "*******bbb*"+
    "*******bwby"+
    "*******bbb*"+
    "bb*****b*r*"+
    "**bbbbbb***"+
    "**bbbbbb***"+
    "***bbbbb***"+
    "***bbbbb***"+
    "****y*y****"+
    "***y***y***"+
    "**y*****y**"
]];

function getHero() {

    let hero = {};

    // sprites [ "left frames" , "right frames" ]
    hero.sprites = blackChicken;

    hero.linesAmount = 13;
	hero.linesLength = 11;
    hero.pixelSize = new PhysicVector(5,5);
    hero.animSpeed = 200;
    hero.framecounter = 0;
    hero.lastFrameUpdate = new Date();

    hero.size = new PhysicVector(44,40);
    hero.pixelSize.x = hero.size.x/hero.linesLength;
    hero.pixelSize.y = hero.size.y/hero.linesAmount;

    hero.colors = {
        w: "rgba(255, 255, 255, 1)",
        b: "rgba(0, 0, 0, 1)",
        r: "rgba(255, 0, 0, 1)",
        y: "rgba(255, 192, 0, 1)",
        g: "rgba(155, 155, 155, 1)",
        m: "rgba(143, 73, 0, 1)"
    };

    return hero;
};

module.exports = getHero;
},{"../gameeng/physicvector":12}],6:[function(require,module,exports){
var levels = [{
	blocks : [
		{x: 0, y: 550, width: 500, height: 50, color: "#57B033"},
		{x: 700, y: 550, width: 300, height: 50, color: "#57B033"},
		{x: 1000, y: 450, width: 300, height: 50, color: "#57B033"},
		{x: 1300, y: 350, width: 300, height: 50, color: "#57B033"},
		{x: 1800, y: 550, width: 400, height: 50, color: "#57B033"},
		{x: 2500, y: 550, width: 700, height: 50, color: "#57B033"}
	],

	enemies : [
		{x: 200, y: 510, type:"rabbit"},
		{x: 1400, y: 310, type:"rabbit"},
		{x: 2500, y: 510, type:"rabbit"}
	],

	levelStuff : [],

	levelExit : {x: 3150, y: 450, width: 50, height: 100, color: "hsla(322, 0%, 0%, 1)"}
},{
	blocks : [
		{x: 400, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 800, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 1200, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 1600, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 2000, y: 350, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 2400, y: 350, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		
		{x: 0, y: 550, width: 900, height: 50, color: "#57B033"},
		{x: 1600, y: 550, width: 600, height: 50, color: "#57B033"},
		{x: 3000, y: 350, width: 200, height: 50, color: "#57B033"}
	],

	enemies : [
		{x: 200, y: 510, type:"rabbit"},
		{x: 1400, y: 310, type:"eagle"}
	],

	levelStuff : [],

	levelExit : {x: 3150, y: 250, width: 50, height: 100, color: "hsla(322, 0%, 0%, 1)"}
},{
	blocks : [
		{x: 200, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 600, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 1000, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 1600, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 2200, y: 450, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		{x: 2600, y: 350, width: 200, height: 30, color: "hsla(213, 100%, 90%, .4)"},
		
		{x: 0, y: 550, width: 200, height: 50, color: "#57B033"},
		{x: 800, y: 550, width: 1800, height: 50, color: "#57B033"}
	],

	enemies : [
		{x: 800, y: 500, type:"fox"},
		{x: 1000, y: 510, type:"skunk"},
		{x: 1200, y: 500, type:"fox"},
		{x: 1400, y: 510, type:"skunk"},
		{x: 1600, y: 500, type:"fox"},
		{x: 1800, y: 510, type:"skunk"},
		{x: 2000, y: 500, type:"fox"}
	],

	levelStuff : [],

	levelExit : {x: 3150, y: 450, width: 50, height: 100, color: "hsla(322, 0%, 0%, 1)"}
}];

function getLevel(index){
	return levels[index];
}

module.exports = getLevel;
},{}],7:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');

var frames = [[
    //left
    "bb**bb"+
    "*b***b"+
    "bbbbbb"+
    "brbrbb"+
    "bbbbbb"+
    "brbrbb"+
    "rbrbrb"+
    "bbbbbb"+
    "**bbb*"+
    "**bbb*"+
    "**bbb*"+
    "*b**b*"+
    "bb*bb*",

    "bb**bb"+
    "*b***b"+
    "bbbbbb"+
    "brbrbb"+
    "bbbbbb"+
    "brbrbb"+
    "rbrbrb"+
    "bbbbbb"+
    "**bbb*"+
    "**bbb*"+
    "**bbb*"+
    "**b**b"+
    "*bb*bb"
],[
    //right
    "bb**bb"+
    "b***b*"+
    "bbbbbb"+
    "bbrbrb"+
    "bbbbbb"+
    "bbrbrb"+
    "brbrbr"+
    "bbbbbb"+
    "*bbb**"+
    "*bbb**"+
    "*bbb**"+
    "b**b**"+
    "bb*bb*",

    "bb**bb"+
    "b***b*"+
    "bbbbbb"+
    "bbrbrb"+
    "bbbbbb"+
    "bbrbrb"+
    "brbrbr"+
    "bbbbbb"+
    "*bbb**"+
    "*bbb**"+
    "*bbb**"+
    "*b**b*"+
    "*bb*bb"
]];

function Rabbit () {
    let drawable = {};

    // sprites [ "left frames" , "right frames" ]
    drawable.sprites = frames;

    drawable.linesAmount = 13;
    drawable.linesLength = 6;
    
    drawable.pixelSize = new PhysicVector(5,5);
    drawable.animSpeed = 200;
    drawable.framecounter = 0;
    drawable.lastFrameUpdate = new Date();

    drawable.size = new PhysicVector(32,40);
    drawable.pixelSize.x = drawable.size.x/drawable.linesLength;
    drawable.pixelSize.y = drawable.size.y/drawable.linesAmount;

    drawable.colors = {
        b: "rgba(0, 0, 0, 1)",
        r: "rgba(255, 0, 0, 1)"
    };

    drawable.update = () => {

    };

    return drawable;
};

module.exports = Rabbit;
},{"../gameeng/physicvector":12}],8:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');

var frames = [[
    //left
    "b**b*******b"+
    "*b*b******bb"+
    "*bbb******bw"+
    "bwbwb****bw*"+
    "*bbb**bb*b**"+
    "**b*bbbbb***"+
    "****bbbbb***"+
    "*****bwb****"+
    "****b***b***"+
    "****b***b***",

    "*b**b******b"+
    "**b*b*****bb"+
    "**bbb*****bw"+
    "*bwbwb***bw*"+
    "**bbb*bb*b**"+
    "***bbbbbb***"+
    "****bbbbb***"+
    "*****bwb****"+
    "****b***b***"+
    "*****b*b****",
],[
    //right
    "b*******b**b"+
    "bb******b*b*"+
    "wb******bbb*"+
    "*wb****bwbwb"+
    "**b*bb**bbb*"+
    "***bbbbb*b**"+
    "***bbbbb****"+
    "****bwb*****"+
    "***b***b****"+
    "***b***b****",

    "b******b**b*"+
    "bb*****b*b**"+
    "wb*****bbb**"+
    "*wb***bwbwb*"+
    "**b*bb*bbb**"+
    "***bbbbbb***"+
    "***bbbbb****"+
    "****bwb*****"+
    "***b***b****"+
    "****b*b*****",
]];

function Skunk () {
    let drawable = {};

    // sprites [ "left frames" , "right frames" ]
    drawable.sprites = frames;

    drawable.linesAmount = 10;
    drawable.linesLength = 12;
    
    drawable.pixelSize = new PhysicVector(5,5);
    drawable.animSpeed = 200;
    drawable.framecounter = 0;
    drawable.lastFrameUpdate = new Date();

    drawable.size = new PhysicVector(50,40);
    drawable.pixelSize.x = drawable.size.x/drawable.linesLength;
    drawable.pixelSize.y = drawable.size.y/drawable.linesAmount;

    drawable.colors = {
        b: "rgba(0, 0, 0, 1)",
        w: "rgba(255, 255, 255, 1)"
    };

    drawable.update = () => {

    };

    return drawable;
};

module.exports = Skunk;
},{"../gameeng/physicvector":12}],9:[function(require,module,exports){
function CollisionDetection () {

	// ellipse X rectangle collision

	this.ellipseRectCollision = function (el, rect){
		var result = false;

		if( ball.y + ball.radius > rect.pos.y &&
			ball.y - ball.radius < rect.pos.y + rect.size.y &&
			ball.x + ball.radius > rect.pos.x &&
			ball.x - ball.radius < rect.pos.x + rect.size.x ){

			result = true;
		}

		return result;
	}

	// rectangle X rectangle collision

	this.rectCollision = function (r1, r2) {
		var result = false;
	
		if ( (r1.pos.x < r2.pos.x + r2.size.x && r1.pos.x + r1.size.y > r2.pos.x) && 
			 (r1.pos.y + r1.size.y > r2.pos.y && r1.pos.y < r2.pos.y + r2.size.y) ){
			result = true;
		}

		return result;
	}
}


module.exports = CollisionDetection;
},{}],10:[function(require,module,exports){
//basic event system
event = {};
event.subs = [];
event.subsIndex = [];
event.published = {};

event.sub = function(to,cb){

    var ci = event.subsIndex.indexOf(to);

    if (ci == -1){
        event.subsIndex.push(to);
        event.subs.push([]);
        ci = event.subsIndex.length-1;
    }

    event.subs[ci].push({'to':to,'cb':cb});
}

event.clear = function(to){
    var triggerIndex = event.subsIndex.indexOf(to);
    if (triggerIndex == -1) return null;

    for (var i=0, len = event.subs[triggerIndex].length; i < len; i++)
    {
        event.subs[triggerIndex].splice(i, 1);
    }
}

event.pub = function(to,param){
    var triggerIndex = event.subsIndex.indexOf(to);

    event.published[to] = param || true;
    
    if (triggerIndex == -1) return null;

    for (var i=0, len = event.subs[triggerIndex].length; i < len; i++)
    {
        event.subs[triggerIndex][i].cb(param);
    }
}

event.executeAfter = function(to,cb){
	
	if (event.published[to]){
		cb(event.published[to]);
	}
	else{
		event.sub(to,cb);	
	}
}

module.exports = event;
},{}],11:[function(require,module,exports){
function ImageElement(image){
	var imgElem = document.createElement("img");
	imgElem.src = image;

	return imgElem;
}

module.exports = ImageElement;
},{}],12:[function(require,module,exports){
function PhysicVector(x, y){

    this.x = x;
    this.y = y;

    this.add = function(vec){
        this.x += vec.x;
        this.y += vec.y;
    };

    this.sub = function(vec){
        this.x -= vec.x;
        this.y -= vec.y;
    };

    this.mult = function(num){
        this.x *= num;
        this.y *= num;
    };

    this.div = function(num){
        this.x = this.x/num;
        this.y = this.y/num;
    };

    this.getVec = function(){
        return new PhysicVector(this.x, this.y);
    };

    this.mag = function(){
        return Math.sqrt( (this.x * this.x) + (this.y * this.y) );
    }

    this.limit = function(value){
        if (this.mag() > value){
            
            this.div(this.mag());
            this.mult(value);
        }
    }
}

module.exports = PhysicVector;
},{}],13:[function(require,module,exports){
function Pixel(pixelData) {

	this.sprites = pixelData.sprites;
    this.linesAmount = pixelData.linesAmount;
	this.linesLength = pixelData.linesLength;
	this.size = pixelData.size;
    this.pixelSize = pixelData.pixelSize;
	this.animSpeed = pixelData.animSpeed;
    this.framecounter = pixelData.framecounter;
    this.lastFrameUpdate = pixelData.lastFrameUpdate;
    this.colors = pixelData.colors;

    this.img = this.sprites[1][0];

    this.update = (dir) => {
        if (dir < 0) {
			if (new Date() - this.lastFrameUpdate > this.animSpeed) {
				this.lastFrameUpdate = new Date();
				this.framecounter = (this.framecounter + 1)%this.sprites[0].length;
				this.img = this.sprites[0][this.framecounter];
			}
		} else if (dir > 0) {
			if (new Date() - this.lastFrameUpdate > this.animSpeed) {
				this.lastFrameUpdate = new Date();
				this.framecounter = (this.framecounter + 1)%this.sprites[1].length;
				this.img = this.sprites[1][this.framecounter];
			}
		}
    };
};

module.exports = Pixel;
},{}],14:[function(require,module,exports){
const PhysicVector = require('./physicvector');
const ImageElement = require('./imageelement');

function GameView(gameSize){
	this.pos = new PhysicVector(0, 0);
	this.cameraSize = new PhysicVector(800, 600);
	this.gameSize = gameSize;

	var _bgColor = "rgba(0, 224, 255, 1)";

	var canvas;
	var ctx;

 	this.init = function(id){
 		canvas = document.getElementById(id);
 		ctx = canvas.getContext("2d");
 		ctx.canvas.width  = this.cameraSize.x;
 		ctx.canvas.height = this.cameraSize.y;
 	}
 	
 	this.clear = function(){
		ctx.fillStyle = _bgColor;
		ctx.fillRect(0, 0, _width, _height);
	}

	this.clean = function(){
		ctx.fillRect(0, 0, _width, _height);
		ctx.clearRect(0, 0, _width, _height);
	}

	this.draw = function(object){
		switch (object.shape)
		{
			case "rectangle":
				ctx.fillStyle = object.color;
				ctx.fillRect(
					this.pos.x + object.pos.x, 
					this.pos.y + object.pos.y, 
					object.size.x, 
					object.size.y
				);
				ctx.fillStyle = "hsla(0, 0%, 0%, .3)";
				ctx.fillRect(
					this.pos.x + object.pos.x, 
					this.pos.y + object.pos.y + object.size.y - 2,
					object.size.x, 
					2
				);
				ctx.fillRect(
					this.pos.x + object.pos.x,
					this.pos.y + object.pos.y,
					2,
					object.size.y - 2
				);
				break;
			case "score":
				ctx.fillStyle = "rgba(0, 0, 0, 1)";
				ctx.fillRect(0,0,800,50);
				ctx.fillStyle = object.color;
				ctx.font = "bold 32pt sans-serif"
				ctx.fillText("sven",10,40);
				if (object.level) { ctx.fillText("level " + (object.level || 0),200,40); }
				ctx.fillText("lives "+(object.lives || 0),_width-200,40);
				break;
			case "image":
				ctx.drawImage(
					object.img, 
					this.pos.x + object.pos.x, 
					this.pos.y + object.pos.y, 
					object.size.x, 
					object.size.y
				);
				break;
			case "drawable":
				var totalAmount = object.drawable.linesLength * object.drawable.linesAmount;
				for(let i = 0; i < totalAmount; i++) {
					if (object.drawable.colors[object.drawable.img[i]]) {
						let posX = i % object.drawable.linesLength;
						let posY = Math.floor(i/object.drawable.linesLength);
						ctx.fillStyle = object.drawable.colors[object.drawable.img[i]];
						ctx.fillRect(
							this.pos.x + object.pos.x + object.drawable.pixelSize.x * posX,
							this.pos.y + object.pos.y + object.drawable.pixelSize.y * posY,
							object.drawable.pixelSize.x,
							object.drawable.pixelSize.y
						);
					}
				}
				break;
			default:
				break;
		}	
	}
	
	this.drawText = function(o){
		var context = ctx;
		context.fillStyle="rgba(255, 192, 0, 1)";
		context.font=o.font;
		context.shadowOffsetX=4;
		context.shadowOffsetY=4;
		context.shadowBlur=3;
		context.fillText(
			o.text, 
			this.pos.x + o.x, 
			this.pos.y + o.y
		);
	}

	this.centerOnElement = function(elemPos) {
		var elemX = elemPos.x | 0;
		var elemY = elemPos.y | 0;

		this.moveCamera({
			x: this.cameraSize.x/2 - elemX,
			y: this.cameraSize.y/2 - elemY
		})
	}

	this.moveCamera = function(diff) {
		var diffX = diff.x | 0;
		var diffY = diff.y | 0;

		this.pos.x = diffX;
		this.pos.y = diffY;

		if (this.pos.x > 0) {
			this.pos.x = 0;
		} else if(this.pos.x < this.cameraSize.x - this.gameSize.width ) {
			this.pos.x = this.cameraSize.x - this.gameSize.width;
		}
		
		if (this.pos.y > 0) {
			this.pos.y = 0;
		} else if(this.pos.y < this.cameraSize.y - this.gameSize.height) {
			this.pos.y = this.cameraSize.y - this.gameSize.height;
		}

		return this.pos;
	}

	this.bgColor = function(value){
		_bgColor = value;
	}

	this.size = function(width, height){
		_width = width;
		_height = height;

		ctx.canvas.width  = _width;
 		ctx.canvas.height = _height;
	}
}

module.exports = GameView;
},{"./imageelement":11,"./physicvector":12}],15:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');

function Brick(){

	this.pos = new PhysicVector(0, 0),
	this.size = new PhysicVector(100, 20),
	this.color = "#AAAAAA";
	this.shape = "rectangle";

	this.setColor = function(_c){
		this.color = _c;
	}

	this.setSize = function(_w, _h){
		this.size.x = _w;
		this.size.y = _h;
	}

	this.init = function(_x, _y){
		this.pos.x = _x;
		this.pos.y = _y;
	}

	this.draw = function(view){
		view.draw(this);
	}

	this.update = function(){
		
	}

	this.destroy = function(){
		
	}
}

module.exports = Brick;
},{"../gameeng/physicvector":12}],16:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');
const Pixel = require('../gameeng/pixel');

const Rabbit = require("../gamedata/rabbit");
const Fox = require("../gamedata/fox");
const Skunk = require("../gamedata/skunk");
const Eagle = require("../gamedata/eagle");

const Brick = require('./brick');

function Enemy() {
    this.shape = 'drawable';
    this.pos = new PhysicVector(0,0);
    this.initPos = new PhysicVector(0,0);
    this.dir = 1;
    this.update = () => {};

    var setup = (type) => {
        
        switch (type) {
            case "rabbit":
                this.drawable = new Pixel(Rabbit());
                break;
            case "fox":
                this.drawable = new Pixel(Fox());
                break;
            case "skunk":
                this.drawable = new Pixel(Skunk());
                break;
            case "eagle":
                this.drawable = new Pixel(Eagle());
                break;
            default:
                break;
        }

        this.speed = 2;
        this.dist = 200;
        this.pos.x = this.initPos.x;
        this.pos.y = this.initPos.y;
        this.update = () => {
            if ( this.pos.x < this.initPos.x || 
                this.pos.x > (this.initPos.x + this.dist)
            ) {
                this.dir = this.dir * -1;
            }
            this.pos.x = this.pos.x + this.dir * this.speed;
            this.drawable.update(this.dir);
        }
        this.size = this.drawable.size;
    };

    this.init = (posX, posY, type) => {
        this.initPos.x = posX;
        this.initPos.y = posY;
        setup(type);
    };
};

Enemy.prototype = new Brick();

module.exports = Enemy;
},{"../gamedata/eagle":3,"../gamedata/fox":4,"../gamedata/rabbit":7,"../gamedata/skunk":8,"../gameeng/physicvector":12,"../gameeng/pixel":13,"./brick":15}],17:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');
const Brick = require('./brick');

function Explosion(){

	this.color = "rgba(250, 250, 250, 1)";
	this.parts = [];

	var opacity = 1;

	this.setColor = function(_c, _o){
		_c = _c.substring(_c.indexOf('('), _c.lastIndexOf(','))
		this.color = "hsla" + _c + ", " + _o + ")";
	}

	this.init = function(_x, _y, _width, _heigth){
		var _l = 5;
		var centerX = _x + _width/2;
		var centerY = _y + _heigth/2;
		var xAmount = Math.floor(_width/5);
		var yAmount = Math.floor(_heigth/5);

		for(var i = 0; i < xAmount; i++)
		{
			for(var t = 0; t < yAmount; t++)
			{
				var part = new Part();
				var partX = _x + (_l * i);
				var partY =  _y + (_l * t);
				part.speed = {x:(partX - centerX)/5, y:(partY - centerY)/5};
				part.init( partX, partY, _l);
				this.parts.push(part);
			}
		}
	}

	this.update = function(){
		var isOver;

		if(opacity > 0) 
		{
			opacity -= .02;
		
			this.setColor(this.color, opacity);

			for(var i = 0; i < this.parts.length; i++)
			{
				this.parts[i].update();
				this.parts[i].setColor(this.color);
			}
			
			isOver = false;
		}else{
			isOver = true;
		}

		return isOver;
	}

	this.destroy = function(){
		
		for(var i = 0; i < this.parts.length; i++)
		{
			this.parts[i] = null;
		}
	}
}

function Part(){
	this.shape = "rectangle";
	this.size = new PhysicVector(100, 20);
	this.pos = new PhysicVector(0, 0);
	this.speed = new PhysicVector(0, 0);
	this.color = "rgba(250, 250, 250, 1)";
	var gravity = .5;

	this.update = function(){
		this.speed.y += gravity;

		this.pos.x += this.speed.x;
		this.pos.y += this.speed.y;
	}

	this.setColor = function(_c){
		this.color = _c;
	}

	this.init = function(_x, _y, _l){
		this.pos.x = _x;
		this.pos.y = _y;
		this.size.x = this.size.y = _l;
	}
}

Part.prototype = new Brick();

module.exports = Explosion;
},{"../gameeng/physicvector":12,"./brick":15}],18:[function(require,module,exports){
const PhysicVector = require('../gameeng/physicvector');
const Pixel = require('../gameeng/pixel');

const getHero = require('../gamedata/hero');

const Brick = require('./brick');

function Hero(){
	
	var isLeft = false,
		isRight = false,
		isJump = false,
		hitGround = false,
		isGrounded = false,
		ground = 0;
		dir = 0,
		accel = new PhysicVector(0, 0),
		vel = new PhysicVector(0, 0),
		GRAVITY = .5,
		maxSpeed = 30,
		atr = .1;
	
	this.shape = 'drawable';
	this.drawable = new Pixel(getHero());
	this.size = this.drawable.size;
	
	//GET USER INPUT
	
	var getKeyDownInput = function(event) {
	    if(event.keyCode == 37 || event.keyCode == 65) {
	        isLeft = true;
	    } else if(event.keyCode == 39 || event.keyCode == 68) {
	        isRight = true;
	    } else if (event.keyCode == 38 || event.keyCode == 87){
	    	if (hitGround) {
	    		hitGround = false;
	    		isJump = true;
	    	}
	    }
	}

	var getKeyUpInput = function(event) {
		if (event.keyCode == 37 || event.keyCode == 65) {
	        isLeft = false;
	    } else if (event.keyCode == 39 || event.keyCode == 68) {
        	isRight = false;
	    }
	}

	var addListeners = function(){
		document.addEventListener('keydown', getKeyDownInput);
		document.addEventListener('keyup', getKeyUpInput);	
	}

	var removeListeners = function(){
		document.removeEventListener('keydown', getKeyDownInput);
		document.removeEventListener('keyup', getKeyUpInput);
	}

	var getDir = function(){
		var result = 0;
		
		if(isRight) ++result;
		if(isLeft) --result;

		return result;
	}

	var addForce = function(force) {
		vel.add(force);
	}

	//PUBLIC FUNCTIONS

	this.init = function(_gameSize){
		this.pos.x = this.pos.y = 0;
		addListeners();
	}

	this.update = function(){

		var dir = getDir();

		accel.add(new PhysicVector(dir + (-vel.x * atr), GRAVITY));

		vel.add(accel);
		vel.limit(maxSpeed);

		if(Math.abs(vel.x) > 8) vel.x = 8 * (vel.x/Math.abs(vel.x));
		if(Math.abs(vel.x) < 1) vel.x = 0;

		if (isGrounded && hitGround) {
			vel.y = 0;
			this.pos.y = ground;
			if(isJump) {
				isJump = false;
				addForce(new PhysicVector(0, -10));
			};
		}

		isGrounded = false;

		this.pos.add(vel);
		accel.mult(0);

		this.drawable.update(dir);
	}

	this.hitWall = function(wallx){
		
	}

	this.hasHittenGround = function(rect) {
		hitGround = true;
		isGrounded = true;
		ground = rect.pos.y - this.size.y;
	}

	this.destroy = function(){
		removeListeners();
	}
};

Hero.prototype = new Brick();

module.exports = Hero;
},{"../gamedata/hero":5,"../gameeng/physicvector":12,"../gameeng/pixel":13,"./brick":15}],19:[function(require,module,exports){
const Brick = require('./brick');
const Enemy = require('./enemy');
const Explosion = require('./explosion');

function Level(){
	
	var bricksToRemove = [],
		explosions = [],
		gameSize;
		
	this.elements = [];
	this.enemies = [];
	this.levelExit = null;

	//PUBLIC FUNCTIONS

	this.init = function(_gameSize, intLvl){
		var blocks = intLvl.blocks;
		var levelStuff = intLvl.levelStuff;
		var enemies = intLvl.enemies;

		gameSize = _gameSize;
		
		blocks.forEach( elem => {
			var brick = new Brick();
			brick.brickType = 'ground';
			brick.init(elem.x, elem.y);
			brick.setSize(elem.width, elem.height);
			brick.setColor(elem.color);
			this.elements.push(brick);
		});

		levelStuff.forEach(elem => {
			var brick = new Brick();
			brick.brickType = 'thing';
			brick.init(elem.x,elem.y);
			brick.setSize(elem.width, elem.height);
			brick.setColor(elem.color);
			this.elements.push(brick);
		});

		enemies.forEach( elem => {
			var enemy = new Enemy();
			enemy.brickType = 'enemy';
			enemy.init(elem.x,elem.y,elem.type);
			this.enemies.push(enemy);
		});

		if (intLvl.levelExit) {
			this.levelExit = intLvl.levelExit;
			var brick = new Brick();
			brick.init(this.levelExit.x,this.levelExit.y);
			brick.setSize(this.levelExit.width, this.levelExit.height);
			brick.setColor(this.levelExit.color);
			this.levelExit = brick;
		}
		explosions = [];
	}

	this.update = function(){

		for(var i = bricksToRemove.length; i > 0; i--)
		{
			this.elements.splice(bricksToRemove[i - 1], 1);
			bricksToRemove.pop();
		}

		for(var w = explosions.length; w > 0; w--)
		{
			
			if(explosions[w-1].update())
			{
				explosions[w - 1].destroy();
				explosions.splice(w - 1, 1);
			}
		}

		this.enemies.forEach( elem => {
			elem.update();
		});
	}

	this.addExplosion = function(elem)
	{
		var expl = new Explosion();
		expl.init(elem.pos.x, elem.pos.y, elem.size.x, elem.size.y);
		expl.setColor(elem.color, 1);
		if(explosions == undefined)
		{
			explosions = [expl];
		}else{
			explosions.push(expl);
		}
	}

	this.draw = function(view){
		for(var i=0; i < this.elements.length; i++)
		{	
			view.draw(this.elements[i]);
		}

		this.enemies.forEach( elem => {
			view.draw(elem);
		});
		
		view.draw(this.levelExit);
		for(var w = explosions.length; w > 0; w--)
		{
			for(var t = 0; t < explosions[w - 1].parts.length; t++)
			{
				view.draw(explosions[w - 1].parts[t], true);
			}
		}
	}

	// PRIVATE FUNCTIONS

	this.removeBrick = function(index){
		this.addExplosion(this.elements[index]);
		bricksToRemove.push(index);
	}
}

module.exports = Level;
},{"./brick":15,"./enemy":16,"./explosion":17}],20:[function(require,module,exports){
function Score(){

	this.points = 0;
	this.lives = 3;
	var view;

	this.addPoint = function(){
		this.points++;
		if(view != null) this.draw(view);
	}

	this.setView = function(_view){
		view = _view;
		this.draw(view);
	}

	this.draw = function(numLives, level){
		view.draw({shape:'score', color:"#35C115", lives:numLives, level: level + 1, points:this.points} );
	}
}

module.exports = Score;
},{}],21:[function(require,module,exports){
function GameCompleteState(_stateMachine)
{	
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var init = function(){
		
		stateMachine.view.draw({shape:'rectangle',color:'rgba(255,255,255,0.8)',pos:{
			x:stateMachine.view.pos.x,
			y:stateMachine.view.pos.x
		},size:{x:gameSize.width,y:gameSize.width}});
		stateMachine.view.drawText({
			text:'SVEN IS HOME',font:"bold 48pt sans-serif",
			x:Math.abs(stateMachine.view.pos.x) + 150,
			y:stateMachine.view.pos.y + 300
		});

		addEventHandlers();
	}

	this.update = function(){

	}

	this.draw = function(){
		
	}

	this.destroy = function(){
		removeEventHandlers();
		stateMachine.view.clean();
	}

	this.getState = function(){
		return 'game_over_state';
	}

	var addEventHandlers = function(){
		document.addEventListener('keydown', onKeyDown);
	}

	var removeEventHandlers = function(){
		document.removeEventListener('keydown', onKeyDown);
	}

	function onKeyDown(e){
			
		switch (e.keyCode){
		
		case 13:
			stateMachine.levelNumber = 0;
			stateMachine.lives = 3;
			stateMachine.view.clear();
			stateMachine.setState(stateMachine.GAME_LEVEL_STATE);
			break;
		}	
	}

	init();

	return this;
}

module.exports = GameCompleteState;
},{}],22:[function(require,module,exports){
const Score = require('../gameobjects/score');

function GameOverState(_stateMachine)
{	
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var init = function(){
		
		stateMachine.view.draw({shape:'rectangle',color:'rgba(255,255,255,0.8)',pos:{
			x:stateMachine.view.pos.x,
			y:stateMachine.view.pos.x
		},size:{x:gameSize.width,y:gameSize.width}});
		stateMachine.view.drawText({
			text:'game over',font:"bold 98pt sans-serif",
			x:Math.abs(stateMachine.view.pos.x) + 70,
			y:stateMachine.view.pos.y + 300
		});

		addEventHandlers();
	}

	this.update = function(){

	}

	this.draw = function(){
		
	}

	this.destroy = function(){
		removeEventHandlers();
		stateMachine.view.clean();
	}

	this.getState = function(){
		return 'game_over_state';
	}

	var addEventHandlers = function(){
		document.addEventListener('keydown', onKeyDown);
	}

	var removeEventHandlers = function(){
		document.removeEventListener('keydown', onKeyDown);
	}

	function onKeyDown(e){
			
		switch (e.keyCode){
		
		case 13:
			stateMachine.levelNumber = 0;
			stateMachine.lives = 3;
			stateMachine.view.clear();
			stateMachine.setState(stateMachine.GAME_LEVEL_STATE);
			break;
		}	
	}

	init();

	return this;
}

module.exports =GameOverState;
},{"../gameobjects/score":20}],23:[function(require,module,exports){
const CollisionDetection = require('../gameeng/collisiondetection');
const event = require('../gameeng/event');

const Score = require('../gameobjects/score');
const Hero = require('../gameobjects/hero');
const Level = require('../gameobjects/level');

const getLevel = require('../gamedata/levels');

function GameLevelState(_stateMachine) {
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var hero = new Hero();
	var gameLevel = new Level();
	var score = new Score();
	var colCheck = new CollisionDetection();
	
	var init = function(){
		hero.init(gameSize);
		gameLevel.init(gameSize, getLevel(stateMachine.levelNumber));

		score.setView(stateMachine.view);

		registerEvents();
	}

	this.update = function(){
		
		for(var i=0; i < gameLevel.elements.length; i++)
		{
			if (gameLevel.elements[i].brickType &&
				typeof gameLevel.elements[i].brickType !== 'undefined' &&
				colCheck.rectCollision(hero, gameLevel.elements[i]))
			{
				switch (gameLevel.elements[i].brickType) {
					case 'thing':
						gameLevel.removeBrick(i);
						break;
					case 'ground':
						if (hero.y + (hero.height * .4) > gameLevel.elements[i].pos.y && 
							hero.y < gameLevel.elements[i].pos.y + gameLevel.elements[i].size.y) {
							
						} else {
							hero.hasHittenGround(gameLevel.elements[i]);
						}
						break;
					default:
						break;
				}
			}
		}

		gameLevel.enemies.forEach(enem => {
			if (colCheck.rectCollision(hero, enem)) {
				event.pub("chickendie");
			};
		});

		hero.update();
		gameLevel.update();

		if (hero.pos.x < 0) { hero.pos.x = 0; }
		if (hero.pos.x > gameSize.width) { hero.pos.x = gameSize.width; }
		if(	hero.pos.y < 0 || hero.pos.y > gameSize.height) { event.pub("chickendie"); }
		
		if(colCheck.rectCollision(hero, gameLevel.levelExit) ){
			event.pub("nextLevel");
		}
	}

	this.draw = function(){
		stateMachine.view.clear();
		stateMachine.view.centerOnElement(hero.pos);
		stateMachine.view.draw(hero);
		gameLevel.draw(stateMachine.view);
		score.draw(stateMachine.lives, stateMachine.levelNumber);
	}

	this.destroy = function(){
		deregisterEvents();
	}

	this.getState = function(){
		return 'game_level_state';
	}

	var registerEvents = function(){
		
		event.sub("chickendie",function(){
			if (stateMachine.lives > 0) {
				stateMachine.lives -= 1;
				stateMachine.setState(stateMachine.GAME_LEVEL_STATE);
			} else  {
				event.pub("gameover");
			}
		})

		event.sub("gameover",function(){
			stateMachine.setState(stateMachine.GAME_OVER_STATE);
		})

		event.sub("nextLevel",function(){
			if (stateMachine.levelNumber < 2) {
				stateMachine.levelNumber += 1;
				stateMachine.setState(stateMachine.GAME_LEVEL_STATE);
			} else {
				stateMachine.setState(stateMachine.GAME_COMPLETE_STATE);
			}
		})
		
		event.sub("brickhit",function(){
			score.addPoint();
		})
	}

	var deregisterEvents = function(){
		event.clear("chickendie");
		event.clear("gameover");
		event.clear("nextLevel");
		event.clear("brickhit");
	}

	init();

	return this;
}

module.exports = GameLevelState;
},{"../gamedata/levels":6,"../gameeng/collisiondetection":9,"../gameeng/event":10,"../gameobjects/hero":18,"../gameobjects/level":19,"../gameobjects/score":20}],24:[function(require,module,exports){
const Score = require('../gameobjects/score');

function SplashState(_stateMachine)
{	
	var stateMachine = _stateMachine;
	var gameSize = stateMachine.gameSize;

	var i = 0;
	var timerStamp;
	var score = new Score();

	var init = function(){
		timerStamp = new Date().getTime();
		addEventHandlers();

		//scoreView.init('score');
		score.setView(stateMachine.view);
	}

	this.update = function(){
		if(new Date().getTime() > timerStamp + 500)
		{
			timerStamp = new Date().getTime();
			i++;
		}
	}

	this.draw = function(){
		if (i % 2){
			stateMachine.view.clear();
		}
		else{
			stateMachine.view.drawText({text:"Press enter to start",font:"bold 48pt sans-serif",x:100,y:500});
		}

		stateMachine.view.drawText({text:"this is sven the chicken",font:"20pt sans-serif",x:150,y:200});
		stateMachine.view.drawText({text:"use arrow keys and take sven home",font:"20pt sans-serif",x:150,y:250});

		score.draw(stateMachine.lives);
	}

	this.destroy = function(){
		removeEventHandlers();
		stateMachine.view.clean();
	}

	this.getState = function(){
		return 'splash_state';
	}

	var addEventHandlers = function(){
		document.addEventListener('keydown', onKeyDown);
	}

	var removeEventHandlers = function(){
		document.removeEventListener('keydown', onKeyDown);
	}

	function onKeyDown(e){
			
		switch (e.keyCode){
		
		case 13:
			stateMachine.view.clear();
			stateMachine.setState(stateMachine.GAME_LEVEL_STATE);
			break;
		}	
	}

	init();

	return this;
}

module.exports = SplashState;
},{"../gameobjects/score":20}],25:[function(require,module,exports){
const Game = require('./game');

Game();
},{"./game":1}]},{},[25]);
