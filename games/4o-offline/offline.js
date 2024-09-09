// Learn More here -> https://straker.github.io/kontra/getting-started
var c = document.getElementById("c1");
var c2 = document.getElementById("c2");
var ctx2 = c2.getContext("2d");
var sprites = [];
kontra.init();

let champion = kontra.sprite({
	x: 100,
	y: 100,
	px: 100,
	py: 100,
	dx: 2,
	dy: 0,
	width: 6,
	rotation: 0,
	render() {
		this.context.save();
		this.context.translate(this.x, this.y);
		this.context.rotate(degreesToRadians(this.rotation));

		this.context.fillStyle = "white";
		this.context.beginPath();
		this.context.moveTo(-5, -7);
		this.context.lineTo(12, 0);
		this.context.lineTo(-5, 7);
		this.context.closePath();
		this.context.fill();
		this.context.restore();

		ctx2.strokeStyle = "skyblue";
		ctx2.lineWidth = 2;
		ctx2.beginPath();
		ctx2.moveTo(this.px, this.py);
		ctx2.lineTo(this.x, this.y);
		ctx2.closePath();
		ctx2.stroke();

		this.px = this.x;
		this.py = this.y;
	},
	update() {
		if (kontra.keys.pressed("left")) {
			if (this.y % 100 == 0) {
				this.rotation = 180;
				this.dx = -2;
				this.dy = 0;
			}
		}
		if (kontra.keys.pressed("right")) {
			if (this.y % 100 == 0) {
				this.rotation = 0;
				this.dx = 2;
				this.dy = 0;
			}
		}
		if (kontra.keys.pressed("up")) {
			if (this.x % 100 == 0) {
				this.rotation = 270;
				this.dx = 0;
				this.dy = -2;
			}
		}
		if (kontra.keys.pressed("down")) {
			if (this.x % 100 == 0) {
				this.rotation = 90;
				this.dx = 0;
				this.dy = 2;
			}
		}
		if (kontra.keys.pressed("space")) {
			if (this.dx > 0) {
				this.x = this.x - this.x % 5 + 5;
				this.dx = 5;
			}
			if (this.dx < 0) {
				this.x = this.x - this.x % 5;
				this.dx = -5;
			}
			if (this.dy > 0) {
				this.y = this.y - this.y % 5 + 5;
				this.dy = 5;
			}
			if (this.dy < 0) {
				this.y = this.y - this.y % 5;
				this.dy = -5;
			}
		}

		this.advance();
	}
});

function createEnemy(x, y, speed) {
	let enemy = kontra.sprite({
		x: x,
		y: y,
		speed: speed,
		dx: 4,
		dy: 0,
		render() {
			this.context.fillStyle = "red";
			this.context.beginPath();
			this.context.arc(this.x, this.y, 7, 0, Math.PI * 2);
			this.context.fill();
		},
		update() {
			if (this.y % 100 == 0 && this.x % 100 == 0) {
				if (Math.abs(sprites[0].x - this.x) > Math.abs(sprites[0].y - this.y)) {
					if (sprites[0].x - this.x > 0) {
						this.dx = speed;
						this.dy = 0;
					} else {
						this.dx = -speed;
						this.dy = 0;
					}
				} else {
					if (sprites[0].y - this.y > 0) {
						this.dx = 0;
						this.dy = speed;
					} else {
						this.dx = 0;
						this.dy = -speed;
					}
				}
			}
			this.advance();
		}
	});
	sprites.push(enemy);
}

var loop = kontra.gameLoop({
	update() {
		checkDoneLine();

		sprites.map(enemy => {
			enemy.update();
			// check the edges
			if (enemy.x <= 0) {
				enemy.dx = 0;
				enemy.x = 0;
			} else if (enemy.x >= kontra.canvas.width) {
				enemy.dx = 0;
				enemy.x = 800;
			}
			if (enemy.y <= 0) {
				enemy.dy = 0;
				enemy.y = 0;
			} else if (enemy.y >= kontra.canvas.height) {
				enemy.dy = 0;
				enemy.y = 600;
			}
		});

		//collisions

		for (let c = 1; c < sprites.length; ++c) {
			let dx = Math.abs(sprites[0].x - sprites[c].x);
			let dy = Math.abs(sprites[0].y - sprites[c].y);
			if (dx < 10 && dy < 10) {
				game.collision = true;
			}
		}
	},

	render() {
		drawGrid(100);
		sprites.map(enemy => {
			enemy.render();
		});
		if (game.winner == true) {
			loop.stop();
			endGame();
		}
		if (game.collision == true) {
			loop.stop();
			pauseGame();
		}
	}
});

function startGame() {
	document.getElementById("overlay").style.display = "none";
	loop.start();
}
function resize() {
	c.style.height = window.innerHeight + "px";
	c2.style.height = window.innerHeight + "px";
}
function degreesToRadians(degrees) {
	return degrees * Math.PI / 180;
}

var winnerLines = [
	{
		x1: 500,
		y1: 300,
		x2: 700,
		y2: 300
	},
	{
		x1: 500,
		y1: 300,
		x2: 500,
		y2: 500
	},
	{
		x1: 500,
		y1: 500,
		x2: 700,
		y2: 500
	},
	{
		x1: 700,
		y1: 300,
		x2: 700,
		y2: 500
	},
	{
		x1: 100, //
		y1: 400,
		x2: 500,
		y2: 400
	},
	{
		x1: 100,
		y1: 100,
		x2: 100,
		y2: 400
	}
];
//var winnerLines = [winnerLines01];
var game = {
	winner: false,
	collision: false
};
function checkDoneLine() {
	let data = new Object();
	game.winner = true;
	for (k = 0; k < winnerLines.length; ++k) {
		if (winnerLines[k].x1 - winnerLines[k].x2 != 0) {
			//line is horizontal
			data = ctx2.getImageData(
				winnerLines[k].x1,
				winnerLines[k].y1,
				winnerLines[k].x2 - winnerLines[k].x1,
				1
			).data;

			for (let g = 0; g < winnerLines[k].x2 - winnerLines[k].x1; ++g) {
				if (data[g * 4] == 0) {
					game.winner = false;
				}
			} //for
		} else {
			//if
			//line is vertical
			data = ctx2.getImageData(
				winnerLines[k].x1,
				winnerLines[k].y1,
				1,
				winnerLines[k].y2 - winnerLines[k].y1
			).data;

			for (let g = 0; g < winnerLines[k].y2 - winnerLines[k].y1; ++g) {
				if (data[g * 4] == 0) {
					game.winner = false;
				}
			}
		}
	} //for
	
}

var serverSquares = [
	{
		x1: 500,
		y1: 300,
		x2: 200,
		y2: 200
	}
];
function drawGrid(wid) {
	kontra.context.strokeStyle = "#337";
	for (let i = 0; i <= 800; i += wid) {
		kontra.context.beginPath();
		kontra.context.moveTo(i, 0);
		kontra.context.lineTo(i, 600);
		kontra.context.closePath();
		kontra.context.stroke();
	}
	for (let i = 0; i < 800; i += wid) {
		kontra.context.beginPath();
		kontra.context.moveTo(0, i);
		kontra.context.lineTo(800, i);
		kontra.context.closePath();
		kontra.context.stroke();
	}
	kontra.context.fillStyle = "#225";
	kontra.context.fillRect(
		serverSquares[0].x1,
		serverSquares[0].y1,
		serverSquares[0].x2,
		serverSquares[0].y2
	);
	kontra.context.fillRect(0, 0, 98, 98);
	ctx2.font = "20px Consolas";
	ctx2.fillStyle = "red";
	ctx2.fillText("Offline", serverSquares[0].x1 + 20, serverSquares[0].y1 + 40);

	kontra.context.strokeStyle = "#373";
	for (let k = 0; k < winnerLines.length; ++k) {
		kontra.context.beginPath();
		kontra.context.moveTo(winnerLines[k].x1, winnerLines[k].y1);
		kontra.context.lineTo(winnerLines[k].x2, winnerLines[k].y2);
		kontra.context.closePath();
		kontra.context.stroke();
	}

	kontra.context.font = "50px Consolas";
	kontra.context.fillStyle = "skyblue";
	kontra.context.fillText("-4º", 10, 65);
	ctx2.fillStyle = "skyblue";
	ctx2.font = "10px Consolas";
	ctx2.fillText("Here I Sit", 105, 15);
	ctx2.fillText("Lonely Hearted", 105, 30);
	ctx2.fillText("With No Internet", 105, 45);
	ctx2.fillText("I Only Farted", 105, 60);
}
function endGame() {
	console.log("in end");
	eraseCanvas(1.0);
	ctx2.clearRect(0, 0, 800, 600);
	kontra.context.font = "25px Courier";
	kontra.context.fillStyle = "Aquamarine";
	kontra.context.textAlign = "center";
	kontra.context.fillText(
		"Y o u  D i d  I T !  S e r v e r I s  O n l i n e .",
		400,
		300
	);
}
function pauseGame() {
	eraseCanvas(1.0);
	ctx2.clearRect(0, 0, 800, 600);
	kontra.context.font = "25px Courier";
	kontra.context.fillStyle = "Aquamarine";
	kontra.context.textAlign = "center";
	kontra.context.fillText(
		"I  C a n ' t  P o o p  W i t h o u t  T w i t t e r",
		400,
		300
	);
	setTimeout(function() {
		game.collision = false;
		//document.getElementById("c2").style.display = "block";
		setGame();
		loop.start();
	}, 2000);
}
function eraseCanvas(opacity) {
	console.log("in erase");
	kontra.context.beginPath();
	kontra.context.rect(200, 200, 400, 200);
	kontra.context.fillStyle = "rgba(0, 0, 60, " + opacity + ")";
	kontra.context.fill();

	//document.getElementById("c2").style.display = "none";
}
function setGame() {
	sprites = [];
	champion.x = 100;
	champion.y = 100;
	champion.px = 100;
	champion.py = 100;
	champion.rotation = 0;
	champion.dx = 2;
	champion.dy = 0;
	sprites.push(champion);
	createEnemy(800, 100, 1);
	createEnemy(800, 400, 2);
	createEnemy(0, 600, 3);
	createEnemy(700, 600, 4);
}
setGame();
resize();
//loop.start();
