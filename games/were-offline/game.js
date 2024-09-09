var canvasBg = document.getElementById("canvasBg"),
	ctxBg = canvasBg.getContext("2d"),
	cvs = document.getElementById("challenge"),
	ctxCvs = cvs.getContext("2d"),
	canvas = document.getElementById("canvasStory");
	ctx = canvas.getContext("2d");
	
	canvasWidth = canvasBg.width,
	canvasHeight = canvasBg.height,
	isPlaying = false,
	FRAME_RATE = 40,
	intervalTime = 1000 / FRAME_RATE,
	timeout = 0,
	px = 250,
	py = 50,
	xBoundaryLeft1 = 159,
	xBoundaryRight1 = 310,
	yBoundaryTop1 = 30,
	yBoundaryBottom1 = 79,
	xBoundaryLeft2 = 40,
	xBoundaryLeft3 = 11,
	yBoundaryTop2 = 10,
	yBoundaryBottom2 = 180,
	yBoundaryBottom3 = 110,
	xDoorBoundary1 = 60;
	xDoorBoundary2 = 110,
	keyPressList = [];
	
window.addEventListener('load', init, false);

function init() {
	
	begin();
}

function begin() {
	isPlaying = true;
	loop();
	
	document.onkeydown = function(e) {
		e = e ? e : window.event;
		console.log(e.keyCode);
		keyPressList[e.keyCode] = true;
	}
	
	document.onkeyup = function(e) {
		e = e ? e : window.event;
		keyPressList[e.keyCode] = false;
	}
	
}

function loop() {
	drawBackground();
	
	if (timeout) {
		clearTimeout(timeout);
		timeout = null;
	}
	timeout = window.setTimeout(loop, intervalTime);
	
	player();
	storyboard();
}

function drawBackground() {
	// property perimeter
	ctxBg.fillStyle = "#333";
	ctxBg.fillRect(0, 0, 320, 190);
	
	drawBedroomOne();
//	drawBedroomOneDoorClosed();
}

function drawBedroomOne() {
	// first room
	ctxBg.strokeStyle = "#999";
	ctxBg.beginPath();
	ctxBg.lineWidth = 1;
	ctxBg.moveTo(10, 180);
	ctxBg.lineTo(10, 10);
	ctxBg.lineTo(60, 10);
	ctxBg.moveTo(60, 180);
	ctxBg.lineTo(10, 180);
	ctxBg.moveTo(110, 180);
	ctxBg.lineTo(310, 180);
	ctxBg.lineTo(310, 10);
	ctxBg.lineTo(260, 10);
	ctxBg.stroke();
	ctxBg.closePath();
	ctxBg.font = "15px Arial";
	ctxBg.fillStyle = "#AAA";
	ctxBg.fillText("Bedroom 1", 60, 100);
	// Cupboard 
	ctxBg.fillStyle = "#9AB";
	ctxBg.fillRect(11, 11, 29, 100);
	// Bed 
	ctxBg.fillStyle = "#9AB";
	ctxBg.fillRect(160, 79, 149, 100);
	// Work table 
	ctxBg.fillStyle = "#9AB";
	ctxBg.fillRect(159, 11, 150, 20);
	
	drawBedroomOneWindow();
//	drawBedroomOneDoorClosed();
//	drawBedroomOneDoorOpen();
}

function drawBedroomOneWindow() {
	// first room window
	ctxBg.strokeStyle = "#ABC";
	ctxBg.beginPath();
	ctxBg.lineWidth = 3;
	ctxBg.moveTo(60, 10);
	ctxBg.lineTo(70, 10);
	ctxBg.moveTo(100, 10);
	ctxBg.lineTo(110, 10);
	ctxBg.moveTo(140, 10);
	ctxBg.lineTo(150, 10);
	ctxBg.moveTo(180, 10);
	ctxBg.lineTo(190, 10);
	ctxBg.moveTo(220, 10);
	ctxBg.lineTo(230, 10);
	ctxBg.stroke();
	ctxBg.closePath();
	// first room window panes
	ctxBg.strokeStyle = "#999";
	ctxBg.beginPath();
	ctxBg.lineWidth = 1;
	ctxBg.moveTo(70, 10);
	ctxBg.lineTo(100, 10);
	ctxBg.moveTo(110, 10);
	ctxBg.lineTo(140, 10);
	ctxBg.moveTo(150, 10);
	ctxBg.lineTo(180, 10);
	ctxBg.moveTo(190, 10);
	ctxBg.lineTo(220, 10);
	ctxBg.moveTo(230, 10);
	ctxBg.lineTo(260, 10);
	ctxBg.stroke();
	ctxBg.closePath();
}

function drawBedroomOneDoorOpen() {
	// first room - opened door
	ctxBg.strokeStyle = "#ABC";
	ctxBg.beginPath();
	ctxBg.lineWidth = 3;
	ctxBg.moveTo(60, 180);
	ctxBg.lineTo(110, 140);
	ctxBg.stroke();
	ctxBg.closePath();
	ctxBg.strokeStyle = "#333";
	ctxBg.beginPath();
	ctxBg.lineWidth = 5;
	ctxBg.moveTo(60, 180);
	ctxBg.lineTo(110, 180);
	ctxBg.stroke();
	ctxBg.closePath();
}

function drawBedroomOneDoorClosed() {
	// first room - closed door
	ctxBg.strokeStyle = "#ABC";
	ctxBg.beginPath();
	ctxBg.lineWidth = 5;
	ctxBg.moveTo(60, 180);
	ctxBg.lineTo(110, 180);
	ctxBg.stroke();
	ctxBg.closePath();
}

function player() {
	drawBedroomOneDoorClosed();
	ctxBg.save();		// save current state in stack 
	ctxBg.fillStyle = "#FFF";
	ctxBg.strokeStyle = "#FFF";
	ctxBg.lineWidth = 1;
	ctxBg.beginPath();
	// head
	ctxBg.arc(px, py, 5, 0, Math.PI * 2, false);
	ctxBg.stroke();
	// body 
	ctxBg.moveTo(px, py+5);
	ctxBg.lineTo(px, py+20);
	// arms
	ctxBg.moveTo(px, py+10);
	ctxBg.lineTo(px-5, py+15);
	ctxBg.moveTo(px, py+10);
	ctxBg.lineTo(px+5, py+15);
	// legs/dress 
	ctxBg.moveTo(px, py+20);
	ctxBg.lineTo(px-5, py+25);
	ctxBg.lineTo(px+5, py+25);
	ctxBg.lineTo(px, py+20);
	ctxBg.stroke();
	ctxBg.fill();
	ctxBg.closePath();
	// eyes
	ctxBg.fillStyle = "#000";
	ctxBg.beginPath();
	ctxBg.arc(px-2, py-1, 1, 0, Math.PI * 2, false);
	ctxBg.arc(px+2, py-1, 1, 0, Math.PI * 2, false);
	ctxBg.fill();
	ctxBg.closePath();
	// nose/mouth
	ctxBg.strokeStyle = "#000";
	ctxBg.beginPath();
	ctxBg.moveTo(px, py);
	ctxBg.lineTo(px, py+3);
	ctxBg.stroke();
	ctxBg.closePath();
	
	ctxBg.restore();		// pop old state on to screen 
	
	// check keys
	if (keyPressList[38] == true) {
		console.log("Up");
		py -= 1;
	}
	if (keyPressList[40] == true) {
		console.log("Down");
		py += 1;
	}
	if (keyPressList[37] == true) {
		console.log("Left");
		px -= 1;
	}
	if (keyPressList[39] == true) {
		console.log("Right");
		px += 1;
	}
	
	if (px+10 > xBoundaryRight1 && px > xBoundaryLeft1) {
		px = xBoundaryRight1-10;
	}
	if (py+25 > yBoundaryBottom1 && px > xBoundaryLeft1) {
		py = yBoundaryBottom1-25;ctx.strokeStyle = "#999";
	}
	if (py-10 < yBoundaryTop1 && px > xBoundaryLeft1) {
		py = yBoundaryTop1+10;
	}
	
	if (py-10 < yBoundaryTop2 && px < xBoundaryLeft1 && px > xBoundaryLeft2) {
		py = yBoundaryTop2+10;
	}
	if (py+30 > yBoundaryBottom2 && px < xBoundaryLeft1 && px > xBoundaryLeft2) {
		py = yBoundaryBottom2-30;
	}
	if (px+10 > xBoundaryLeft1 && py > yBoundaryBottom1) {
		px = xBoundaryLeft1-10;
	}
	if (px-10 < xBoundaryLeft2 && py < yBoundaryBottom3) {
		px = xBoundaryLeft2+10;
	}
	
	if (px-10 < xBoundaryLeft3) {
		px = xBoundaryLeft3+10;
	}
	if (py+30 > yBoundaryBottom2 && px < xBoundaryLeft2 && px > xBoundaryLeft3) {
		py = yBoundaryBottom2-30;
	}
	if (py-10 < yBoundaryBottom3 && px < xBoundaryLeft2 && px > xBoundaryLeft3) {
		py = yBoundaryBottom3+10;
	}
	
	if (px+10 > xDoorBoundary1 && px-10 < xDoorBoundary2 && py-20 < yBoundaryBottom2 && py > (yBoundaryBottom2-35)) {
		window.clearTimeout(timeout);
		solveChallengeOne();
	}
}


function storyboard() {
	ctx.strokeStyle = "#999";
	ctx.fillStyle = "#000";
	ctx.lineWidth = 3;
	ctx.strokeRect(10, 10, 430, 180);
	ctx.fillRect(11, 11, 428, 178);
	
	screenOne();
	
	function screenOne() {
		ctx.font = "14px Arial";
		ctx.fillStyle = "#999";
		ctx.textBaseline = "top";
		ctx.fillText("You are in your room, playing your favourite game.", 20, 20);
		ctx.fillText("The lights go out, everything is dark.", 20, 40);
		ctx.fillText("You reach for your phone on the bedside stand. You want to start ", 20, 60);
		ctx.fillText("the Torch app. Something is wrong, the phone is also off.", 20, 80);
		ctx.fillText("You try to reach for the window, see if there is any light outside.", 20, 100);
		ctx.fillText("An early experimenter who demonstrated that there were definitely ", 20, 120);
		ctx.fillText("two different types of changes wrought by rubbing certain pairs ", 20, 140);
		ctx.fillText("of objects together.", 20, 160);
	}
}

function solveChallengeOne() {
	var letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
		lettersToGuess = [ 'c', 'h', 'a', 'r', 'l', 'e', 's', 'd', 'u', 'f', 'y' ],
		lettersGuessed = [],
		gameOver = false;
	
	window.addEventListener("keydown", eventKeyPressed, true);
	
	ctxCvs.strokeStyle = "#99A";
	ctxCvs.strokeRect(0, 0, 300, 100);
	ctxCvs.fillStyle = "#AAF";
	ctxCvs.fillRect(1, 1, 298, 98);
	
	ctxCvs.strokeStyle = "#333";
	ctxCvs.beginPath();
	ctxCvs.moveTo(20, 40);
	ctxCvs.lineTo(40, 40);
	ctxCvs.moveTo(50, 40);
	ctxCvs.lineTo(70, 40);
	ctxCvs.moveTo(80, 40);
	ctxCvs.lineTo(100, 40);
	ctxCvs.moveTo(110, 40);
	ctxCvs.lineTo(130, 40);
	ctxCvs.moveTo(140, 40);
	ctxCvs.lineTo(160, 40);
	ctxCvs.moveTo(170, 40);
	ctxCvs.lineTo(190, 40);
	ctxCvs.moveTo(200, 40);
	ctxCvs.lineTo(220, 40);
	
	ctxCvs.moveTo(100, 80);
	ctxCvs.lineTo(120, 80);
	ctxCvs.moveTo(130, 80);
	ctxCvs.lineTo(150, 80);
	ctxCvs.moveTo(160, 80);
	ctxCvs.lineTo(180, 80);
	ctxCvs.moveTo(190, 80);
	ctxCvs.lineTo(210, 80);
	ctxCvs.moveTo(220, 80);
	ctxCvs.lineTo(240, 80);
	ctxCvs.stroke();
	ctxCvs.closePath();
	
	
	function eventKeyPressed(e) {
		if (!gameOver) {
			var letterPressed = String.fromCharCode(e.keyCode);
			lettersGuessed.push(letterPressed);
			console.log(lettersGuessed.length);
			
			if (letterPressed == letters[2].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[2].toUpperCase(), 23, 35);
			} else if (letterPressed == letters[7].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[7].toUpperCase(), 53, 35);
			} else if (letterPressed == letters[0].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[0].toUpperCase(), 83, 35);
				ctxCvs.fillText(letters[0].toUpperCase(), 193, 75);
			} else if (letterPressed == letters[17].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[17].toUpperCase(), 113, 35);
			} else if (letterPressed == letters[11].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[11].toUpperCase(), 143, 35);
			} else if (letterPressed == letters[4].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[4].toUpperCase(), 173, 35);
			} else if (letterPressed == letters[18].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[18].toUpperCase(), 203, 35);
			} else if (letterPressed == letters[3].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[3].toUpperCase(), 103, 75);
			} else if (letterPressed == letters[20].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[20].toUpperCase(), 133, 75);
			} else if (letterPressed == letters[5].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[5].toUpperCase(), 163, 75);
			} else if (letterPressed == letters[24].toUpperCase()) {
				ctxCvs.fillStyle = "#333";
				ctxCvs.font = "20px Sans-Serif";
				ctxCvs.fillText(letters[24].toUpperCase(), 223, 75);
			}
		}
	}
}