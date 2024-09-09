
//////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById("Square");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var squares = [];
var players = [];
var bonuses = [];
var isPlaying = false;
var squareSize = 50;
var xborder = (canvas.width-(squareSize*(Math.floor(canvas.width/squareSize))))/2;
var yborder = (canvas.height-(squareSize*(Math.floor(canvas.height/squareSize))))/2;
var maxScore = 16;
var squareCount = 250;
var bonusCount = 4;
var isInstructions = false;

var player1 = new Player(xborder, "rgba(255,0,0,0.8)");
var player2 = new Player(xborder + squareSize*Math.floor(canvas.width/squareSize-1), "rgba(0,0,255,0.8)");
player1.init();
player2.init();

var instructions = [
	'this is a two player game',
	'player 1 ( red box ) can move using W,A,S and D keys',
	'player 2 ( blue box ) can move using the \"arrow\" keys',
	'both players starts at (0) points',
	'a player wins if the he gets (16) or more points',
	'(+3) points if the player could get at the other side of the map',
	'(+1) point if a player gets a bonus item ( smiley :) )',
	'there are also moving obstacles in the map... like a moving maze...',
	'the player should not occupy the same block with an obstacle',
	'or else (-1) will be added to his score, and his position will reset',
	'both players should also have fun... :)',
	'...',
]

//////////////////////////////////////////////////////////////////////////////

setInterval(drawWorld, 20);

generateSquare(squareCount);
generateBonuses(bonusCount);

//////////////////////////////////////////////////////////////////////////////

function generateSquare(count) {
	for (var i = 0; i < count; i++) {
		squares.push(new Square());
	};
}

function generateBonuses(count) {
	for (var i = 0; i < count; i++) {
		bonuses.push(new Bonus());
	};
}

//////////////////////////////////////////////////////////////////////////////

function drawWorld() {
	clearCanvas();
	drawGrid();
	if (!isPlaying) {
		drawSquareLogo();
	};
	checkWin();
	if (isPlaying) {
		player1.update().draw();
		player2.update().draw();
		for (var i = 0; i < squares.length; i++) {
			squares[i].update().draw();
		}
		for (var i = 0; i < bonuses.length; i++) {
			bonuses[i].update().draw();
		}
	};
}

//////////////////////////////////////////////////////////////////////////////

function checkWin() {
	if (player1.score >= maxScore) {
		alert("Player 1 wins!");
		player1.score = player2.score = 0;
		bonus.reset();
	}
	else if (player2.score >= maxScore) {
		alert("Player 2 wins!");
		player1.score = player2.score = 0;
		bonus.reset();
	}
}

function drawSquareLogo() {
	var x = canvas.width/2;
	var y = canvas.height/2 - squareSize/2;

	context.beginPath();

	// SQUARE
	context.moveTo(x-100-10, y+10);
	context.lineTo(x-150+10, y+10);
	context.lineTo(x-150+10, y+25);
	context.lineTo(x-100-10, y+25);
	context.lineTo(x-100-10, y+40);
	context.lineTo(x-150+10, y+40);

	context.moveTo(x-100, y);
	context.lineTo(x-50, y);
	context.lineTo(x-50, y+50);
	context.lineTo(x-100, y+50);
	context.lineTo(x-100, y);
	context.moveTo(x-100+35, y+40);
	context.lineTo(x-100+35, y+60);

	context.moveTo(x-50+10, y+10);
	context.lineTo(x-50+10, y+40);
	context.lineTo(x-50+40, y+40);
	context.lineTo(x-50+40, y+10);

	context.moveTo(x+10, y+10);
	context.lineTo(x+40, y+10);
	context.lineTo(x+40, y+40);
	context.lineTo(x+10, y+40);
	context.lineTo(x+10, y+25);
	context.lineTo(x+40, y+25);

	context.moveTo(x+50+10, y+40);
	context.lineTo(x+50+10, y+10);
	context.lineTo(x+50+40, y+10);

	context.moveTo(x+100+40, y+40);
	context.lineTo(x+100+10, y+40);
	context.lineTo(x+100+10, y+10);
	context.lineTo(x+100+40, y+10);
	context.lineTo(x+100+40, y+25);
	context.lineTo(x+100+10, y+25);

	context.strokeStyle = "#333";
	context.lineWidth = 5;
	context.lineCap = "round";
	context.stroke();

	context.lineWidth = 1;
}

function clearCanvas() {
	context.fillStyle = "#fff";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function drawGrid() {

	if (!isPlaying) {
		context.strokeStyle = '#333';
		context.lineWidth = 5;
		context.lineCap = "round";
		context.strokeRect(xborder+10, yborder+10, squareSize-20, squareSize-20);

		context.fillStyle = '#333';
		context.font = '17px Arial';
		text = 'INSTRUCTIONS';
		context.fillText(text, xborder*2 + squareSize, yborder + 30);

		if (isInstructions) {
			context.strokeStyle = '#aaa';
			for (var i = 0; i < instructions.length; i++) {
				context.strokeRect(xborder+10+50, yborder+10 + 50*(i+1), squareSize-20, squareSize-20);
				context.font = '15px Arial';
				context.fillText(instructions[i], xborder*2 + squareSize*2, yborder + 30 + 50*(i+1));
			}
		} else {
			context.fillStyle = '#333';
			context.font = '15px Arial';
			text = '[   Click to Play   ]';
			context.fillText(text, canvas.width/2 - context.measureText(text).width/2, canvas.height - 30);
		}
	}

	context.lineWidth = 1;
	context.strokeStyle = "rgba(0,0,0,0.2)";

	context.moveTo(xborder,yborder);
	context.lineTo(canvas.width-xborder,yborder);
	context.lineTo(canvas.width-xborder,canvas.height-yborder);
	context.lineTo(xborder,canvas.height-yborder);
	context.lineTo(xborder,yborder);
	context.stroke();

	for (var i = xborder+squareSize; i < canvas.width-xborder; i+=squareSize) {
		context.beginPath();
		context.moveTo(i,yborder);
		context.lineTo(i,canvas.height-yborder);
		context.stroke();
	}

	for (var i = yborder+squareSize; i < canvas.height-yborder; i+=squareSize) {
		context.beginPath();
		context.moveTo(xborder,i);
		context.lineTo(canvas.width-xborder,i);
		context.stroke();
	}
}

//////////////////////////////////////////////////////////////////////////////

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

//////////////////////////////////////////////////////////////////////////////

function Square() {
	this.x = squareSize*randomBetween(0+1,(Math.floor(canvas.width/squareSize)-1))+xborder;
	this.y = squareSize*randomBetween(0,Math.floor(canvas.height/squareSize))+yborder;
	this.dimention = squareSize-10;
	this.isMoving = false;
	this.UP;this.DOWN;this.LEFT;this.RIGHT;
	this.UP = this.DOWN = this.LEFT = this.RIGHT = false;

	this.tri = function (a,b,c) {
		var tri = randomBetween(0,3);
		if (tri == 0) {
			return a;
		}
		else if (tri == 1) {
			return b;
		}
		else {
			return c;
		}
	}

	this.update = function() {

		if ((this.x - xborder)%squareSize == 0 &&
			(this.y - yborder)%squareSize == 0) {
			this.isMoving = false;
			this.UP = this.DOWN = this.LEFT = this.RIGHT = false;
		}

		if (!this.isMoving) {
			var decide = randomBetween(0,4);

			if (this.y-5-squareSize < 0) {
				decide = this.tri(1,2,3);
				if (this.x-5-squareSize < xborder 
					|| this.x-5+squareSize*2 >= canvas.width-xborder-squareSize) {
					decide = 1;
				}
			}
			else if (this.y-5+squareSize*2 >= canvas.height-yborder) {
				decide = this.tri(0,2,3);
				if (this.x-5-squareSize < xborder 
					|| this.x-5+squareSize*2 >= canvas.width-xborder-squareSize) {
					decide = 0;
				}
			}
			else if (this.x-5-squareSize < xborder) {
				decide = this.tri(0,1,3);
			}
			else if (this.x-5+squareSize*2 >= canvas.width-xborder-squareSize) {
				decide = this.tri(0,1,2);
			}

			if (decide == 0) {
				this.UP = true;
			}
			else if (decide == 1) {
				this.DOWN = true;
			}
			else if (decide == 2) {
				this.LEFT = true;
			}
			else if (decide == 3) {
				this.RIGHT = true;
			}
			if (randomBetween(1,100)==1) {
			this.isMoving = true;}
		}

		if (this.isMoving) {
			if (this.UP) {
				this.y--;
			}
			else if (this.DOWN) {
				this.y++;
			}
			else if (this.LEFT) {
				this.x--;
			}
			else if (this.RIGHT) {
				this.x++;
			}
		}

		return this;
	}

	this.draw = function() {
		context.fillStyle = "rgba(0,0,0,0.8)";
		// context.fillStyle = "rgba(255,255,255,0.8)";
		context.fillRect(this.x+5,this.y+5,this.dimention,this.dimention);
	}
}

function Player(x,col) {
	this.x = x;
	this.y = squareSize*Math.floor((canvas.height/squareSize)/2)+yborder;
	this.initX = this.x;
	this.initY = this.y;
	this.dimention = squareSize-10;
	this.speed = 25;
	this.color = col;
	this.UP = false;
	this.DOWN = false;
	this.LEFT = false;
	this.RIGHT = false;
	this.enemy;
	this.score = 0;

	this.init = function() {
		if (player1 == this) {this.enemy = player2;}
		else {this.enemy = player1;}
	}

	this.moveUP = function() {
		if ((this.y-yborder)%squareSize == 0 && (this.x-xborder)%squareSize == 0
				&& this.y-yborder > 0) {
			this.UP = true;this.DOWN = false;this.LEFT = false;this.RIGHT = false;
			if ((this.enemy).y == this.y-squareSize
				&& (this.enemy).x == this.x) {this.UP=false;}
		}
	}
	this.moveDOWN = function() {
		if ((this.y-yborder)%squareSize == 0 && (this.x-xborder)%squareSize == 0
				&& this.y+yborder+squareSize < canvas.height) {
			this.UP = false;this.DOWN = true;this.LEFT = false;this.RIGHT = false;
			if ((this.enemy).y == this.y+squareSize
				&& (this.enemy).x == this.x) {this.DOWN=false;}
		}
	}
	this.moveLEFT = function() {
		if ((this.y-yborder)%squareSize == 0 && (this.x-xborder)%squareSize == 0
				&& this.x-xborder > 0) {
			this.UP = false;this.DOWN = false;this.LEFT = true;this.RIGHT = false;
			if ((this.enemy).x == this.x-squareSize
				&& (this.enemy).y == this.y) {this.LEFT=false;}
		}
	}
	this.moveRIGHT = function() {
		if ((this.y-yborder)%squareSize == 0 && (this.x-xborder)%squareSize == 0
				&& this.x+xborder+squareSize < canvas.width) {
			this.UP = false;this.DOWN = false;this.LEFT = false;this.RIGHT = true;
			if ((this.enemy).x == this.x+squareSize
				&& (this.enemy).y == this.y) {this.RIGHT=false;}
		}
	}
	this.move = function() {
		if (this.UP) {
			this.y-=this.speed;
			if ((this.y-yborder)%squareSize == 0) {
				this.UP = false;
			}
		}
		else if (this.DOWN) {
			this.y+=this.speed;
			if ((this.y-yborder)%squareSize == 0) {
				this.DOWN = false;
			}
		}
		else if (this.LEFT) {
			this.x-=this.speed;
			if ((this.x-xborder)%squareSize == 0) {
				this.LEFT = false;
			}
		}
		else if (this.RIGHT) {
			this.x+=this.speed;
			if ((this.x-xborder)%squareSize == 0) {
				this.RIGHT = false;
			}
		}
	}

	this.reset = function() {
		this.x = this.initX;
		this.y = this.initY;
	}

	this.checkIfHit = function() {
		for (var i = 0; i < squares.length; i++) {
			if (this.x == squares[i].x && this.y == squares[i].y) {
				this.reset();
				if (this.score > 0) {this.score--;}
			}
		}
	}

	this.checkIfPoint = function() {
		if (this.x == (this.enemy).initX) {
			for (var i = 0; i < bonuses.length; i++) {
				bonuses[i].reposition();
			}
			this.reset();
			this.score+=3;
			if (this.score == maxScore) {
				isPlaying = false;
			}
		}
		for (var i = 0; i < bonuses.length; i++) {
			if (this.x == bonuses[i].x && this.y == bonuses[i].y) {
				bonuses[i].reposition();
				this.score++;
				if (this.score == maxScore) {
					isPlaying = false;
			}
		}
		}
		if (!isPlaying) {this.reset();}
	}

	this.drawScore = function() {
		context.font = "18px Arial";
		context.fillStyle = "#fff";
		context.fillText(this.score, this.x+20, this.y+32);
	}

	this.update = function() {
		if (this.UP || this.DOWN || this.LEFT || this.RIGHT) {
			this.move();
		}
		this.checkIfHit();
		this.checkIfPoint();
		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.fillStyle = this.color;
		context.fillRect(this.x+5,this.y+5,this.dimention,this.dimention);
		context.fill();
		this.drawScore();
	}
}

function Bonus() {
	// this.x = squareSize*((Math.floor((canvas.width/squareSize)-1)/2))+xborder; // center
	// this.y = squareSize*(Math.floor((canvas.height/squareSize)/2))+yborder;
	this.x = squareSize*randomBetween(0+3,(Math.floor(canvas.width/squareSize)-3))+xborder;
	this.y = squareSize*randomBetween(0,Math.floor(canvas.height/squareSize))+yborder;
	this.dimention = squareSize-10;

	this.reset = function(){
		this.x = squareSize*((Math.floor((canvas.width/squareSize)-1)/2))+xborder;
		this.y = squareSize*(Math.floor((canvas.height/squareSize)/2))+yborder;
	}

	this.reposition = function() {
		this.x = squareSize*randomBetween(0+1,(Math.floor(canvas.width/squareSize)-1))+xborder;
		this.y = squareSize*randomBetween(0,Math.floor(canvas.height/squareSize))+yborder;
	}

	this.update = function() {

		return this;
	}

	this.draw = function() {
		context.fillStyle = "rgba(255,255,255,0)";
		context.fillRect(this.x+5,this.y+5,this.dimention,this.dimention);
		context.font = "18px Arial";
		context.fillStyle = "#000";
		context.fillText(":)", this.x+20, this.y+32);
	}
}

//////////////////////////////////////////////////////////////////////////////

canvas.addEventListener("click", function(e) {
	var x = e.pageX, y = e.pageY;
    if (!isPlaying) {
    	if (x >= xborder+10 && x <= xborder + 200 
    		&& y >= yborder+10 && y <= yborder+10 + squareSize-20) {
    		isInstructions = !isInstructions;
    	}else {
    		if (isInstructions) {
    			isInstructions = false;
    		} else {
    			isInstructions = false;
    			isPlaying = true;
    		}
    	}
    }
});

window.addEventListener("keypress", function(e) {
	if (isPlaying) {
		if (e.keyCode == 119) {
			player1.moveUP();
		}
		if (e.keyCode == 97) {
			player1.moveLEFT();
		}
		if (e.keyCode == 115) {
			player1.moveDOWN();
		}
		if (e.keyCode == 100) {
			player1.moveRIGHT();
		}
	};
});

document.onkeydown = function(e) {
    if (isPlaying) {
    	e = e || window.event;
	    if (e.keyCode == '38') {
	        player2.moveUP();
	    }
	    else if (e.keyCode == '40') {
	        player2.moveDOWN();
	    }
	    else if (e.keyCode == '37') {
	       	player2.moveLEFT();
	    }
	    else if (e.keyCode == '39') {
	      	player2.moveRIGHT();
	    }
    }
};