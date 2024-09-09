/// CLIENT VARIABLES

const momentumMenu = 10; // time until buttons are active
const connectionTimeout = 10000; // in milliseconds
const c = document.getElementById("c");
c.width = c.height = width;
const ctx = c.getContext("2d");

const introFrame= {x:30,y:430,w:540,h:140};
const messageFrame= {x:30,y:200,w:540,h:200};
const highscoreFrame= {x:30,y:30,w:540,h:540};

var frames = [];
var txts = {stroke:[],fill:[]};


var backgroundColor = "#000";
var lineColor = "#fff";

var player;
var keys={};
var local;
var highscore, highscoreMulti, oldKills,highscoreID,newKills,leaderBoard;
var currentFps;

var loop;
var menuId;

var menus = [
	{txt:"SOLO GAME",fn:()=>{startGame(true)}},
	{txt:"MULTIPLAYER GAME",fn:()=>{startGame(false)}},
	{txt:"STATISTICS",fn:()=>{startStats()}},
	{txt:"INTRO",fn:()=>{setIntro()}}
];

var colors = [["#fff","#000"],["#5f5d72","#ffcac6"],["#124133","#61dab7"],["#202052","#BFED91"],["#3b3a45","#fff"],["#724f4c","#fcb0aa"],["#000","#fff"]]
var menuCoil = {txt:"CHANGE COLORS",fn:()=>{
	backgroundColor = colors[0][0];
	lineColor = colors[0][1];
	colors.push(colors.shift());
}}


var socket;
var shipId;
var errorMsg;
var errorTimeStart;
var name="CAPTN";


/// WRITING STUFF

const LEFT = 1; // text justify consts
const RIGHT = 2;
const CENTER = 3;
const letterSpacing = 1/6;
const spaceSpacing = 1/2;

var alphabet = {
	"A":"3148dfba673",
	"B":"3089df3",
	"C":"c4127fea9dc"/*"c4127fe65dc"*/,
	"D":"308deb3",
	"E":"0cd59a6ef30",
	"F":"0cd59a6730",
	"G":"dc413fd96a",
	"H":"04598cfba6730",
	"I":"0c9af3650",
	"J":"27fc8a6512"/*"8a6523fc8"*/,
	"K":"376bfe9c85403",
	"L":"046af30",
	"M":"fc413756a9bf",
	"N":"573049a8cfb6",
	"O":"314ceb3",
	"P":"30cda673",
	"Q":"6bfaec026",
	"R":"30cdafb673",
	"S":"59c412a63bed9",
	"T":"7510cd9b7",
	"U":"03fc8a640",
	"V":"027bec8a640",
	"W":"64027bec8a95",
	"X":"32efb8cd10473",
	"Y":"6104598ceb7a6",
	"Z":"aef3510ca",

	"a":"15625",
	"b":"0261",
	"c":"5126",
	"d":"4625",
	"e":"62512",
	"f":"21415",
	"g":"52632",
	"h":"02156",
	"i":"12",
	"j":"572",
	"k":"021516",
	"l":"02",
	"m":"2165a",
	"n":"2165",
	"o":"12651",
	"p":"3162",
	"q":"75126",
	"r":"215",
	"s":"5162",
	"t":"62015",
	"u":"1265",
	"v":"125",
	"w":"12569",
	"x":"5216",
	"y":"126573",
	"z":"1526",

	"1":"057b80",
	"2":"6ef31950ce",
	"3":"950cf32a65",
	"4":"02abfc89540",
	"5":"59c02a23fd9",
	"6":"3fd58413",
	"7":"0cd732510",
	"8":"c4513baec"/*"4ceab3154"*/,
	"9":"7bec02a7",
	"0":"148deb721",

	"!":"a548b67b",
	"?":"b67ba595adc05",
	":":"57b6a5",
	"(":"84127b658",
	")":"049a73650",
	'"':"4104584",
	".":"67b6",
	",":"7367",
	"…":"723fab67",
	"'":"2152",

	">":"8deb7a21948",
	"/":"53"
}

//convert alphabet
for (el in alphabet) {
	var hex = alphabet[el];
	var bits,x,y;
	var pts = [];
	var spacing = (/[0-9]/).test(el)?3:0;
	for (var i=0;i<hex.length;i++) {
		bits = parseInt(hex[i],16).toString(2);
		while(bits.length<4) bits = "0"+bits;
		x = parseInt(bits.slice(0,2),2);
		y = parseInt(bits.slice(-2),2)+((/[a-z,]/).test(el)?1:0); // case
		if(x>spacing) spacing = x;
		pts.push({x:x,y:y});
	}
	alphabet[el] = {pts:pts,spacing:spacing};
}

alphabet[" "] = {pts:[],spacing:spaceSpacing}

function writeLine(line,w,x,y,justify,fill) {
	// var wTot = ll*w+(ll-1)*w/3; //leters + spaces
	line = line+"";
	var wTot = getWidthText(line, w);
	var txt;
	y-=w;
	
	// console.log("writeLine", line);
	if(justify == CENTER) x -= wTot/2;
	if (justify == RIGHT) x -= wTot;

	for(var i=0;i<line.length;i++) {
		if (alphabet[line[i]]) {
			txt = {x:x,y:y,pts:createLetter(line[i],w)}
			txts[fill?"fill":"stroke"].push(txt);
			x += alphabet[line[i]].spacing*w/3;
		}
		x += w*letterSpacing;
	}
}

function getWidthText(line,w) {
	var widthTot=0;

	for (var i=0;i<line.length;i++) {
		if(alphabet[line[i]]) widthTot += alphabet[line[i]].spacing*w/3;
	}

	return widthTot +(line.length-1)*w*letterSpacing; // adding spaces
}

function createLetter(l,w) {
	var pts = [];
	w = w/3;
	alphabet[l].pts.forEach((pt)=>{
		pts.push({x:pt.x*w,y:pt.y*w})
	})

	return pts;
}


/// UTILITIES

var fps = {	startTime : 0,
	frameNumber : 0, 
	getFPS : function(){
		this.frameNumber++;	
		var d = new Date().getTime(),
		currentTime = ( d - this.startTime ) / 1000,
		result = Math.floor( ( this.frameNumber / currentTime ) );
		if( currentTime > 1 ){
 			this.startTime = new Date().getTime();
		this.frameNumber = 0;		}
		return result;	}
	};

	function noGame() {
		asts = [];
		ships = [];
		esth = [];
		bulls =[];
		esth = {stroke:[],fill:[]};
	}


/// DRAW PART

function draw() {
	ctx.fillStyle=backgroundColor;
	ctx.fillRect(0,0,width,width);

	ctx.strokeStyle=lineColor;
	ctx.fillStyle=lineColor;

	ctx.beginPath();
	asts.forEach(a=>{
		drawThing(a);
	});
	ctx.stroke();
	// ctx.strokeText(currentFps||fps.getFPS(),10,10);
	// ctx.strokeText(JSON.stringify(keys),10,20);

	ships.forEach(s=>{
		if (!s.alive)return;
		// ctx.strokeStyle=ctx.fillStyle=s.c;
		ctx.beginPath();
		drawThing(s);
		if(s==player) {
			ctx.globalAlpha = 0.2;
			ctx.fill();
			ctx.globalAlpha = 1;

			if(s.counts.teleport>0) {
				var start = getPoint(s.dir,rShip*2.5);
				ctx.moveTo(s.x + start.x, s.y + start.y);
				ctx.arc(s.x, s.y, rShip*2.5,s.dir, s.dir+s.counts.teleport/momentumTeleport*Math.PI*2);
			}
		}
		ctx.stroke();

		/*ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.arc(s.x,s.y,rShip,0,Math.PI*2);
		// if(s==player) ctx.fill();
		ctx.stroke();*/
	})

	ctx.beginPath();
	bulls.forEach((b)=>{
		ctx.moveTo(b.x,b.y);
		ctx.arc(b.x, b.y, rBullet,0, Math.PI*2);
	});
	ctx.fill();

	// esthetique things;
	ctx.beginPath();
	esth.fill.forEach(a=>{
		drawThing(a);
	});
	ctx.fill();

	ctx.beginPath();
	esth.stroke.forEach(a=>{
		drawThing(a);
	});
	ctx.stroke();

	ctx.fillStyle=backgroundColor;
	frames.forEach(f=>{
		ctx.fillRect(f.x,f.y,f.w,f.h);
		ctx.strokeRect(f.x,f.y,f.w,f.h);
	})

	ctx.beginPath();
	txts.stroke.forEach(a=>{
		drawThing(a);
	});
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	txts.fill.forEach(a=>{
		drawThing(a);
	});
	ctx.fill();
	ctx.fillStyle=lineColor;
	ctx.globalAlpha = 0.2;
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.stroke();
}

function drawThing(thing,sX,sY) {
	if(thing.pts.length>1) {
		sX = thing.x + thing.pts[0].x;
		sY = thing.y + thing.pts[0].y;
		ctx.moveTo(sX, sY);
		thing.pts.forEach((e)=>ctx.lineTo(thing.x+e.x,thing.y+e.y));
		// ctx.lineTo(sX,sY);
	}
}

function drawError() {
	var t = Math.floor((connectionTimeout-  Date.now()+errorTimeStart)/1000);
	if(t<0) setTitle();
	else {
		frames.push(messageFrame);
		writeLine("CONNECTION ERROR",25,300,250,CENTER);
		writeLine(errorMsg,30,300,320,CENTER);
		writeLine("you will be disconnected in "+t,20,300,390,CENTER);
	}
}

function drawLeaderBoard(scores,offset,kill) {
	offset = offset || 0;

	const fontSize = 16;
	const xNum = 78;
	const xName = 92;
	const xKills = 550;
	const xHigh = (kill)? 450 : xKills;
	const lineHeight = 32;
	const yTab = 225;
	const yTitle = 165;


	writeLine("NAME",fontSize,xName,yTitle);
	writeLine("HIGHSCORE",fontSize,xHigh,yTitle,RIGHT);
	if(kill) writeLine("KILLS",fontSize,xKills,yTitle,RIGHT);

	scores.forEach((s,id)=>{
		if(id<9) {
			var isP = s.isP || s.highscoreID == highscoreID;
			writeLine(id+offset+1,fontSize,xNum,yTab+id*lineHeight,RIGHT,(isP)? true : false);
			writeLine(s.name,fontSize,xName,yTab+id*lineHeight,LEFT,(isP)? true : false);
			writeLine(s.score,fontSize,xHigh,yTab+id*lineHeight,RIGHT,(isP)? true : false);
			if(kill) writeLine(s.kills,fontSize,xKills,yTab+id*lineHeight,RIGHT,(isP)? true : false);
			if(s==player && player.newHighscore) {
				writeLine("NEW HIGHSCORE !",10,xName+100,yTab+id*lineHeight,LEFT,true);
			}
		}
	});
}


/// LOOPS 

function introLoop() {
	noGame();

	if(menuId<Intro.length && !keys.c) {
		var txt = Intro[menuId];
		frames.push(introFrame);


		if((/^[#>]/).test(txt)) {
			var pers = (txt[0]=="#")? Robot : Human;
			txts.fill = pers.fill.slice();
			txts.stroke = pers.stroke.slice();
		} else {
			player = createShip();
			placeShip(player);
			player.x =300;
			player.y= 200;
			ships.push(player);
		}

		txt.replace(/[#>]/,"").split("/").forEach((t,id)=>{writeLine(t, 27, 50,470+id*42)});

		writeLine("x to continue / c to skip", 15, 570,587,RIGHT)

	} else setTitle();

	if(keys.x) {
		menuId++;
	}

	keys.x = keys.c = false;
}

function titleLoop() {
	logicLoop();

	writeLine("ACKSTEROI",40,300,180,CENTER);
	writeLine("B",50,35,180);
	writeLine("D",50,565,180,RIGHT);

	// COIL TEST
	if(document.monetization && document.monetization.state === 'started' && menuCoil) {
		menus.push(menuCoil);
		menuCoil = false;
	}

	// writeLine("0123",40,300,250,CENTER);

	if(counts.menu<0) {
		if (keys.ArrowUp) menuId = menuId-1+menus.length;
		if (keys.ArrowDown) menuId = menuId+1;
		menuId %= menus.length;
		if(keys.x) {
			menus[menuId].fn();
		}
		keys.ArrowUp = keys.ArrowDown = keys.x = false;
	}

	menus.forEach((el,id)=>{
		writeLine(el.txt,20,70,300+35*id,LEFT,id==menuId);
		if(id == menuId) writeLine(">",20,60,300+35*id, RIGHT,true);
	})

	if(!menuCoil) {
		writeLine("(COIL)",12,364,257+35*menus.length, LEFT, true);
	}
}

function gameLoop() {
	if(player){
		var change = (player.left != keys.ArrowLeft || player.right != keys.ArrowRight || player.fire != keys.x || player.teleport != keys.c);
		player.left = keys.ArrowLeft;
		player.right = keys.ArrowRight;
		player.fire = keys.x;
		player.teleport = keys.c;
		keys.c = keys.x = false;

		if(!local && change) socket.emit("ship",player);

	}

	if(local) logicLoop();


	writeLine(calcScore(player),30,590,40,RIGHT);

	if(errorMsg) {
		drawError()
	} else if(counts.revive>0) {
		counts.revive--; // we don't run logicLoop 
		writeLine("JOIN IN",30,300,260,CENTER);
		writeLine(Math.ceil(counts.revive/momentumRevive*3),50,300,330,CENTER);	
		if(counts.revive==0 ) socket.emit("revive");
	} else if (counts.revive ==0) {
		// we wait until player revive is ok
		if(player.alive) counts.revive--; 
	} else if (player && !player.alive) setEnd();

}

function localEndLoop() {
	logicLoop();

	writeLine("GAME OVER",57,300,150,CENTER);
	writeLine("YOUR SCORE",30,35,315);
	writeLine(player.score,30,565,315,RIGHT);
	if (player.score > highscore) {
		highscore = player.score;
		// player.newHighscore = true;
		localStorage.setItem("highscore",highscore);
	}
	if(player.newHighscore===true) writeLine("HIGH SCORE !",14,565,350,RIGHT,true);

	writeLine("X to restart / C to title screen",20,300,580,CENTER);

	if(counts.menu<0) {
		if(keys.c) setTitle();
		if(keys.x) startGame(true);
	}
}

function multiEndLoop() {
	counts.menu--;
	if(errorMsg) {
		drawError()
	} else {
		writeLine("GAME OVER",53,300,100,CENTER);

		if (player.score > highscoreMulti) {
			highscoreMulti = player.score;
			// player.newHighscore = true;
			localStorage.setItem("highscoreMulti",highscoreMulti);
		}
		if(newKills<player.kills+oldKills){
			newKills = player.kills+oldKills;
			localStorage.setItem("kills",newKills);
		}

		frames.push(highscoreFrame);
		var scores = ships.map((el)=>{
			return {score:Math.max(el.highscore,calcScore(el)),name:el.name,kills:el.kills,isP:el==player};
		}).sort((s1,s2)=>{
			return s2.score - s1.score;
		});;
		drawLeaderBoard(scores);

		writeLine("X to restart / C to title screen",20,300,560,CENTER);

		if(counts.menu<0) {
			if(keys.c) setTitle();
			if(keys.x) {
				counts.revive = momentumRevive;
				loop = gameLoop;
			}
		}
	}
}

function nameLoop() {
	const letterWidth = 40;

	noGame();

	writeLine("CHOOSE YOUR NAME",30,300,100,CENTER);

	for (var i=0;i<name.length;i++) {
		writeLine(name[i],letterWidth,50+(i+letterSpacing*i)*letterWidth,300,LEFT,(i==menuId)?true:false);
	}

	writeLine("OK",letterWidth,540,300,RIGHT,(name.length==menuId)?true:false);

	if (keys.ArrowLeft) menuId = menuId-1+name.length+1;
	if (keys.ArrowRight) menuId++;
	menuId %= name.length+1;

	if (menuId != name.length && (keys.ArrowUp || keys.ArrowDown)) {
		var letters = Object.keys(alphabet).join("").replace(/[a-z \/,…']/g,"");
		var id = letters.indexOf(name[menuId]);

		console.log("id",id)
		console.log((id-keys.ArrowDown+keys.ArrowUp+letters.length)%letters.length);

		name = name.slice(0,menuId)+letters[(id+keys.ArrowDown-keys.ArrowUp+letters.length)%letters.length]+name.slice(menuId+1);
	}

	if(keys.x && name.length==menuId) {
		socket.emit("start",{name:name,highscoreID:highscoreID});
		loop = gameLoop;
	}


	keys.ArrowLeft = keys.ArrowRight = keys.ArrowUp = keys.ArrowDown = keys.x = false;

}

function statLoop() {
	noGame();
	frames.push(highscoreFrame);

	if(menuId && leaderBoard) {
		// multiplayer leaderBoard
		var offset = 10*(menuId-1);
		writeLine("LEADER BOARD",39,300,100,CENTER);
		drawLeaderBoard(leaderBoard.slice(offset,offset+10),offset);
	} else {
		writeLine("YOUR SCORE",47,300,100,CENTER);
		writeLine("SOLO  HIGHSCORE",18,50,250); writeLine(highscore,25,550,250, RIGHT);
		writeLine("MULTI  HIGHSCORE",18,50,300); writeLine(highscoreMulti,25,550,300, RIGHT);
		writeLine("MULTI  KILLS",18,50,350); writeLine(newKills,25,550,350, RIGHT);
	}

	if(keys.x) {
		menuId = (menuId+1)%(leaderBoard?1+Math.ceil(leaderBoard.length/10):1);
	}
	if(keys.c) {
		setTitle();
	}

	writeLine("X to change page / C to title screen",20,300,560,CENTER);

	keys.x = keys.c = false;
}


/// TRANSITIONS

function setIntro() {
	loop= introLoop;
	menuId = 0;
}

function setTitle() {
	if(socket) {
		socket.close();
		socket = null;
	}
	errorMsg = null;
	player = null;
	noGame();

	menuId =0;
	loop = titleLoop;
	counts.menu = momentumMenu;
}

function startGame(startAsLocal) {
	local = startAsLocal||false;
	if(local) {
		noGame();
		player = createShip();
		placeShip(player);
		player.x = player.y = width/2;
		player.alive = true;
		ships.push(player);
		keys.x = false;
		loop = gameLoop;
	} else {
		if(!socket) {
			socket = io();
			startServerEvents();
			// loop = multiGameLoop;
			menuId = 0;
			loop = nameLoop;
		}
	}
}

function startStats() {
	loop= statLoop;
	leaderBoard = null;
	menuId = 0;

	var req = new Request('leaderBoard');

	fetch(req)
	  .then(function(response) { return response.json(); })
	  .then(function(data) {
	  	console.log("leaderBoard",data);
	    leaderBoard = data;
	  });
}

function setEnd() {
	loop = local? localEndLoop : multiEndLoop;
	counts.menu = momentumMenu;
}



/// KEY HANDLING

function keyDown(e) {
	keys[e.key] = true;
}

function keyUp(e) {
	keys[e.key] = false;
}


/// SERVER EVENTS

function startServerEvents() {
	socket.on("connect", () => {
        console.log("connected");
    });
    socket.on("id",(id)=>{
    	shipId=id;
    });
    socket.on("ready",()=>{
    	counts.revive = momentumRevive;
    });
    socket.on("error", (e) => {
        setError(e);
    });
    socket.on("loop", (data) => {
    	currentFps = fps.getFPS();

    	if (errorMsg) errorMsg = null; // we get data, error end ?
        // console.log("loop",data);
        for(var key in data) {
        	window[key] = data[key];
        }
        player = getShip(shipId);
        // draw();
    });
    socket.on("highscoreID", (id) => {
    	console.log("new highscoreID",id);
    	highscoreID = id;
        localStorage.setItem('highscoreID',id);
    });
}

function setError(msg) {
	errorMsg = msg;
	errorTimeStart = Date.now();
}



/// START

document.body.onload = function() {
	document.addEventListener("keydown",keyDown);
	document.addEventListener("keyup",keyUp);

	// local = true;
	// setTitle();
	setIntro();
	highscore = parseInt(localStorage.getItem('highscore')) || 0;
	highscoreMulti = parseInt(localStorage.getItem('highscoreMulti')) || 0;
	newKills = oldKills = parseInt(localStorage.getItem('kills')) || 0;
	highscoreID = localStorage.getItem('highscoreID') || "";
	
	setInterval(function(){
		txts = {fill:[],stroke:[]};
		frames = [];
		loop();
		draw();
	},frameRate);
}

