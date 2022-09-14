var player1;
var myRintangan = [];
var myRintangan2 = [];
var penghalangArea;
var penghalangArea2;
var penghalangArea3;
var penghalangArea4;
var myScore;
var myLevel;
var myTarget;




function startGame() {
	myGameArea.start();
	player1 = new component(30, 30, "navy", 50, 120);
	penghalangArea = new component(10, 350, "brown", 630, 0);
	penghalangArea2 = new component(10, 350, "brown", 0, 0);
	penghalangArea3 = new component(640, 10, "brown", 0, 0);
	penghalangArea4 = new component(640, 10, "brown", 0, 350);
	myScore = new component("30px", "Times New Roman", "black", 20, 40, "text");
	myLevel = new component("30px", "Times New Roman", "black", 250, 40, "text");
	myTarget = new component("30px", "Times New Roman", "black", 390, 40, "text");
}

var myGameArea =  {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 640;
		this.canvas.height = 360;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.frameScore = 0
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function(e) {
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		})
		window.addEventListener('keyup', function(e) {
			myGameArea.keys[e.keyCode] = (e.type == "keydown");
		})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
		clearInterval(this.interval);
		alert("Try Again");
		window.location = "index.html";
	}
}

function everyinterval(n) {
	if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
	return false;
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.gamearea = myGameArea;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
			(mytop > otherbottom) ||
			(myright < otherleft) ||
			(myleft > otherright)) {
			crash = false;
		}
		return crash;
	}
}

function updateGameArea() {
	if (player1.crashWith(penghalangArea)) {
		myGameArea.stop();
	} else if (player1.crashWith(penghalangArea2)) {
		myGameArea.stop();
	} else if (player1.crashWith(penghalangArea3)) {
		myGameArea.stop();
	} else if (player1.crashWith(penghalangArea4)) {
		myGameArea.stop();
	} else {

		if (typeof(Storage) !== "undefined") {
			if (localStorage.level) {
				localStorage.level = localStorage.level;
			} else {
				localStorage.level = 0;
			}
		}
		if (typeof(Storage) !== "undefined") {
			if (localStorage.targetNum) {
				localStorage.targetNum = localStorage.targetNum;
			} else {
				localStorage.targetNum = 100;
			}
		}
		var munculRintangan = 3;
		var speedPlayer = 5;
		var speedRintangan = -5;

		var x, y;
		for (i = 0; i < myRintangan.length; i += 1) {
			if (player1.crashWith(myRintangan[i])) {
				myGameArea.stop();
			}
		}
		for (i = 0; i < myRintangan2.length; i += 1) {
			if (player1.crashWith(myRintangan2[i])) {
				myGameArea.stop();
			}
		}

		myGameArea.clear();
		myGameArea.frameNo += munculRintangan;
		myGameArea.frameScore += 0.2;
		if (myGameArea.frameNo == 1 || everyinterval(150)) {
			x = myGameArea.canvas.width;
			y = myGameArea.canvas.width;
			minwidth = 20;
			maxwidth = 200;
			minHeight = 20;
			maxHeight = 200;
			height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
			width = Math.floor(Math.random()*(maxwidth-minwidth+1)+minwidth);
			// width = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
			minGap = 100;
			maxGap = 400;
			// minGap = 50;
			// maxGap = 200;
			gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
			// gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
			myRintangan.push(new component(width, 10, "green", 0, y));
			myRintangan.push(new component(y - width - gap, 10, "green", width + gap, y));
			myRintangan2.push(new component(10, height, "red", x, 0));
			myRintangan2.push(new component(10, x - height - gap, "red", x, height + gap));
		}
		for (i = 0; i < myRintangan.length; i += 1) {
			myRintangan[i].y += speedRintangan;
			myRintangan[i].update();
		}
		for (i = 0; i < myRintangan2.length; i += 1) {
			myRintangan2[i].x += speedRintangan;
			myRintangan2[i].update();
		}

		player1.speedX = 0;
		player1.speedY = 0;
		if (myGameArea.keys && myGameArea.keys[65]) {player1.speedX = -speedPlayer; }
		if (myGameArea.keys && myGameArea.keys[68]) {player1.speedX = speedPlayer; }
		if (myGameArea.keys && myGameArea.keys[87]) {player1.speedY = -speedPlayer; }
		if (myGameArea.keys && myGameArea.keys[83]) {player1.speedY = speedPlayer; }
		player1.newPos();
		player1.update();
		penghalangArea.update();
		penghalangArea2.update();
		penghalangArea3.update();
		penghalangArea4.update();
		

		myScore.text="SCORE: " + myGameArea.frameScore.toFixed(0);
		myScore.update();
		myLevel.text="Level: " + localStorage.level;
		myLevel.update();
		myTarget.text="Score Target: " + localStorage.targetNum;
		myTarget.update();


		if (myGameArea.frameScore >= localStorage.targetNum) {
			localStorage.level = Number(localStorage.level)+1;
			localStorage.targetNum = Number(localStorage.targetNum)+20;
			window.location = 'index.html';
		}
	}	
}