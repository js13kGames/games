//var dolphinImage = "0000003000000000000000333000000030003333333333003333333333331333300004444433440000000000003";
//var dolphinImage = "000030000000000003333333003033333333330333333333313330044444334400000000030000";
//var dolphinImage = "00005000000000002222222002022222222220222222222212220033333223300000000020000";
var dolphinImage = "000000003300000000000000000000000033300000000000000000000000333333333333330000000000033333333333333333003000033333333333333333333033003333333333333333333330333333333333333333331133333333333333333333333311333333444444444444443333444440300000444444444433334444000000000000000000330000000000000000000000003300000000";
var sharkImage = "00000000300000000000000000000000003300000000000000003000000033333333300000000030000003344444443333330000330003334444444444444333003333334444444444441144433033333444444444444411444443333344444444444444444444433333333444444444444444333030000033333333333333330000";
var otherSeaDolphinImage = "00000000330000000000000000000000003330000000000000000000000333333333333330000030000333333333333333333000330033333333333333333333303333333333333333333311333333333333333333333333113333334444444444444433334444403000004444444444334444400000000000000000003000000000";
var player = {
	x: 0,
	y: 100 + ~~(canvas.height / 2),
	dx: 10,
	dy: 0
}
var firstRound = true;
var foam = [];
var ices = [];
var geysers = [];
var mines = [];
var booms = [];
/*var hints = [
	[window.innerWidth, "Hello"],
	[window.innerWidth + 1000, "Welcome to the Cool Dolphin"],
	[window.innerWidth + 2000, "Press UP and DOWN to move dolphin"],
	[window.innerWidth + 3000, "Press SPACE to use dash"]];*/
/*var hints = [
	[window.innerWidth, "Press UP and DOWN to swing dolphin"],
	[window.innerWidth + 1000, "Press SPACE to use dash"],
	[window.innerWidth + 2000, "You bounce from ice planes"],
	[window.innerWidth + 3000, "You rise by geysers"],
	[window.innerWidth + 4000, "You die when touch mountains or mines"]];*/
var hints = [
	[window.innerWidth, "Press UP and DOWN to swing the dolphin"],
	[window.innerWidth + 1000, "Press Spacebar to use the dash"],
	[window.innerWidth + 2000, "You bounce off the ice sheets"],
	[window.innerWidth + 3000, "You rise in geysers"],
	[window.innerWidth + 4000, "You die if you touch mountains or mines"]];
var mountains = [];
var dashCharge = 1;
var lastDashUse = 0;
var alive = true;
var dashD;
//var clouds = [[[[-193,69],[-176,32],[-161,-6],[-146,-47],[-101,-40],[-62,-41],[-23,-55],[-2,-18],[13,13],[22,48]], window.innerWidth / 2, 100]];
var clouds = [[[[-1378,-162],[-1302,-153],[-1348,-105],[-1352,-50],[-1402,-11],[-1102,-158],[-1159,-137],[-1172,-90],[-1128,-54],[-1108,-6],[-1148,27],[-1213,29],[-949,-117],[-894,-154],[-881,-95],[-879,-39],[-892,18],[-732,-148],[-700,-174],[-637,-180],[-613,-128],[-622,-72],[-719,-50],[-655,-50],[-644,-18],[-642,32],[-731,68],[-676,61],[-894,72],[-455,-170],[-456,-129],[-459,-88],[-458,-45],[-461,0],[-473,50],[-407,-91],[-353,-137],[-311,-173],[-406,-55],[-362,-26],[-333,12],[-316,50]], window.innerWidth, window.innerHeight / 4, 1]];
var frame = 0;
var pressed = {};
function update() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	alive && (player.dx = Math.min(frame / 500, 20) + 10);
	path.innerHTML = Math.floor(player.x / 50000 * 100 * 10) / 10 + "%";

	// bg
	ctx.fillStyle = colors[6];
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// moon
	ctx.fillStyle = colors[5];
	drawCircle(canvas.width * 3/4, canvas.height / 4, 50, 10);

	// clouds
	ctx.fillStyle = colors[7];
	if (Math.random() < 0.0001 * player.dx) {
		var newCloud = [];
		for (var i = 0; i < 5; i++) {
			newCloud.push([Math.random() * 100, Math.random() * 50]);
		}
		clouds.push([newCloud, canvas.width + 50, Math.random() * canvas.height / 2 - 75, Math.random() + 0.5]);
	}
	for (var i = clouds.length - 1; i >= 0; i--) {
		for (var j = 0; j < clouds[i][0].length; j++) {
			drawCircle(clouds[i][0][j][0] + clouds[i][1], clouds[i][0][j][1] + clouds[i][2], 50, 5, 1.5);
		}
		clouds[i][1] -= 0.5 * clouds[i][3];
		if (clouds[i][1] < -150) {
			clouds.splice(i, 1);
		}
	}

	// bg
	ctx.fillStyle = colors[1];
	ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

	//drawCircle(0, 0, 30, 5);
	//drawCircle(30, 20, 30, 5);
	//drawCircle(-30, 10, 30, 5);
	//drawCircle(-50, 40, 30, 5);
	ctx.resetTransform();

	// foam particles
	ctx.fillStyle = colors[8];
	//if (Math.random() < 0.01 * player.dx) {
	if (!(frame % 10)) {
		foam.push([canvas.width, Math.random() * canvas.height / 2 + canvas.height / 2]);
	}
	for (var i = foam.length - 1; i >= 0; i--) {
		foam[i][0] -= player.dx;
		ctx.fillRect(foam[i][0], foam[i][1], 10, 10);
		if (foam[i][0] < 0) {
			foam.splice(i, 1);
		}
	}

	// ice planes
	ctx.fillStyle = colors[5];
	if (Math.random() < 0.0005 * player.dx) {
		ices.push([canvas.width, false]);
	}
	for (var i = ices.length - 1; i >= 0; i--) {
		ices[i][0] -= player.dx;
		ctx.fillRect(ices[i][0], canvas.height / 2 - 5, 100, 10);
		if (ices[i][0] < 130 && ices[i][0] > -90 && !ices[i][1] && player.y > canvas.height / 2 - 30 && player.dy > 0 && player.y < canvas.height / 2) {
			ices[i][1] = true;
			player.dy *= -1;
		}
		if (ices[i][0] < -100) {
			ices.splice(i, 1);
		}
	}

	// mines
	if (Math.random() < 0.0005 * player.dx && (player.x > 13000 || !firstRound)) {
		mines.push([canvas.width + 50]);
	}
	for (var i = mines.length - 1; i >= 0; i--) {
		mines[i] -= player.dx;
		//ctx.fillRect(mines[i][0], canvas.height / 2 - 5, 100, 10);
		ctx.fillStyle = colors[8];
		drawCircle(mines[i], canvas.height / 2, 50, 5)
		ctx.fillStyle = colors[7];
		frame % 50 < 10 && drawCircle(mines[i], canvas.height / 2, 10, 5);
		if (mines[i] < 105 && mines[i] > -45 && player.y > canvas.height / 2 - 50 && player.y < canvas.height / 2 + 50) {
			//player.dy *= -1;
			player.dx = 0;
			alive = false;
			dialogH1.innerHTML = "Press [E] to restart";
			firstRound = false;
			mines.splice(i, 1);
		}
		if (mines[i] < -50) {
			mines.splice(i, 1);
		}
	}

	// mountains
	if (Math.random() < 0.0005 * player.dx && (player.x > 13000 || !firstRound)) {
		mountains.push([canvas.width + 50]);
	}
	for (var i = mountains.length - 1; i >= 0; i--) {
		mountains[i] -= player.dx;
		//ctx.fillRect(mountains[i][0], canvas.height / 2 - 5, 100, 10);
		ctx.fillStyle = colors[8];
		//ctx.rotate(Math.PI / 2);
		//drawCircle(mountains[i], canvas.height / 2, 50, 5)
		drawCircle(mountains[i], canvas.height, ~~(canvas.height / 3), 10, 0.2);
		// ctx.fillStyle = colors[7];
		// drawCircle(mountains[i], canvas.height * 0.9, ~~(canvas.height / 10), 10, 0.2);
		if (mountains[i] < 105 && mountains[i] > -45 && player.y > canvas.height * 2/3) {
			//player.dy *= -1;
			player.dx = 0;
			alive = false;
			dialogH1.innerHTML = "Press [E] to restart";
			firstRound = false;
			// mountains.splice(i, 1);
		}
		if (mountains[i] < -50) {
			mountains.splice(i, 1);
		}
	}

	// geysers
	ctx.fillStyle = colors[5];
	if (Math.random() < 0.0005 * player.dx) {
		geysers.push([canvas.width, []]);
	}
	for (var i = geysers.length - 1; i >= 0; i--) {
		geysers[i][0] -= player.dx;

		if (!(frame % 10)) {
			geysers[i][1].push([Math.random() * 100, canvas.height]);
		}
		for (var j = 0; j < geysers[i][1].length; j++) {
			geysers[i][1][j][1] -= 10;
			ctx.fillRect(geysers[i][1][j][0] + geysers[i][0], geysers[i][1][j][1], 10, 10);
			if (geysers[i][1][j][1] < canvas.height / 2) {
				geysers[i][1].splice(j, 1);
			}
		}

		if (geysers[i][0] < 130 && geysers[i][0] > -90 && player.y > canvas.height / 2) {
			player.dy -= 0.5;
		}
		if (geysers[i][0] < -100) {
			geysers.splice(i, 1);
		}
	}

	// hints
	ctx.font = "50px sans-serif";
	ctx.fillStyle = "black";
	for (var i = hints.length - 1; i >= 0; i--) {
		hints[i][0] -= player.dx / 2;
		ctx.fillText(hints[i][1], hints[i][0], canvas.height / 2 - 100);
		if (hints[i][0] < -1000) {
			hints.splice(i, 1);
		}
	}

	// direction
	var addToDy = 0;
	if (pressed.ArrowUp) {
		addToDy = -7/60;
	}
	if (pressed.ArrowDown) {
		addToDy = 7/60;
	}
	player.y > canvas.height / 2 && (addToDy *= 3);
	player.dy += addToDy;

	// gravity
	if (player.y < canvas.height / 2) {
		player.dy += 9.81 / 30;
	} else {
		player.dy -= (player.y - canvas.height / 2) / canvas.height * 3;
	}
	player.dy *= 0.99;

	// dash
	if (pressed[" "] && dashCharge > 0) {
		player.dy = dashD;
		dashCharge -= 0.01;
		lastDashUse = frame;
	} else {
		dashD = player.dy;
	}
	frame - lastDashUse > 50 && (dashCharge += 0.002);
	dashCharge = Math.max(Math.min(dashCharge, 1), 0);

	// physics
	player.dy = Math.max(Math.min(player.dy, 14), -14);
	alive && (player.y += player.dy);
	player.y = Math.min(player.y, canvas.height - 60);
	player.x += player.dx;

	// player draw
	translate(75, player.y, 5, 5);
	ctx.rotate(Math.atan(player.dy / player.dx));
	if (alive) {
		if (pressed[" "] && dashCharge > 0) {
			ctx.fillStyle = colors[5];
			ctx.globalAlpha = dashCharge;
			drawCircle(0, 0, 15, 1, 2, 1);
		}
		ctx.globalAlpha = 1;
		drawImage(dolphinImage, 26);
	}
	ctx.resetTransform();

	// dash volume draw
	ctx.fillStyle = colors[8];
	ctx.fillRect(10, 10, 200, 50);
	ctx.fillStyle = colors[6];
	ctx.fillRect(15, 15, 190, 40);
	ctx.fillStyle = colors[5];
	ctx.fillRect(15, 15, 190 * dashCharge, 40);

	// check 100%
	if (player.x > 50000) {
		pastHistoryUpdate();
		path.innerHTML = "";
		// dialog = ["Tell me please, what number is between twelve and fourteen? [Press E]", "Twelve plus one, of course!", "This is place of my dream!", "You dolphinished!", "DON'T PRESS MORE", "?", "You won. Why are you pressing?", "error 13312. don't press more. bip bup.", "", "", "WHY ARE YOU PRESSING"];
		dialog = ["Can you tell me, what's the number between twelve and fourteen? [Press E]", "Twelve plus one, of course!", "This is the place of my dreams!", "You dolphinished!", "DON'T PRESS ANY MORE", "?", "You have already won. Why are you pressing?", "Error 13312. Don't press any more. Beep boop.", "", "", "WHY ARE YOU PRESSING"];
		left = [0, 2, 0];
		for (var i = 0; i < 9; i++) {
			left.push(1);
		}
		currentPhrase = 0;
		document.onkeydown({ key: "", keyCode: 69 });
		return;
	}

	frame++;
	requestAnimationFrame(update);
}
var historyFrame = 0;
var pastHistoryFrame = 0;
//var clicked = false;
function pastHistoryUpdate() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// bg
	ctx.fillStyle = colors[6];
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// moon
	ctx.fillStyle = colors[5];
	drawCircle(canvas.width * 3/4, canvas.height / 4, 50, 10);
	
	// clouds
	ctx.fillStyle = colors[7];
	if (Math.random() < 0.0001 * player.dx) {
		var newCloud = [];
		for (var i = 0; i < 5; i++) {
			newCloud.push([Math.random() * 100, Math.random() * 50]);
		}
		clouds.push([newCloud, canvas.width + 50, Math.random() * canvas.height / 2 - 75, Math.random() + 0.5]);
	}
	for (var i = clouds.length - 1; i >= 0; i--) {
		for (var j = 0; j < clouds[i][0].length; j++) {
			drawCircle(clouds[i][0][j][0] + clouds[i][1], clouds[i][0][j][1] + clouds[i][2], 50, 5, 1.5);
		}
		clouds[i][1] -= 0.1 * clouds[i][3];
		if (clouds[i][1] < -150) {
			clouds.splice(i, 1);
		}
	}

	// booms
	ctx.fillStyle = colors[5];
	if (Math.random() < 0.1) {
		var newBoom = [];
		for (var i = 0; i < 10; i++) {
			newBoom.push([Math.random() * Math.PI * 2, Math.random() * 0.5 + 0.5]);
		}
		booms.push([newBoom, Math.random() * canvas.width, Math.random() * canvas.height / 2, 0]);
	}
	for (var i = booms.length - 1; i >= 0; i--) {
		for (var j = 0; j < booms[i][0].length; j++) {
			ctx.globalAlpha = 1 - booms[i][3];
			//console.log(booms[i][3]);
			var x = Math.cos(booms[i][0][j][0]) * booms[i][0][j][1] * booms[i][3] * 100;
			var y = Math.sin(booms[i][0][j][0]) * booms[i][0][j][1] * booms[i][3] * 100;
			ctx.fillRect(booms[i][1] + x, booms[i][2] + y, 10, 10);
		}
		booms[i][3] += 0.01;
		if (booms[i][3] >= 1) {
			booms.splice(i, 1);
		}
	}
	ctx.globalAlpha = 1;

	// move "You Dolphinished"!
	dialogH1.style.top = currentPhrase == 4 ? 50 + Math.sin(pastHistoryFrame / 10) + "%" : "50%";

	// bg
	ctx.fillStyle = colors[1];
	ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

	ctx.translate(canvas.width - 100, 100 + ~~(canvas.height / 2));
	ctx.scale(-5, 5);
	drawImage(otherSeaDolphinImage, 26);
	ctx.resetTransform();
	ctx.translate(75, 100 + ~~(canvas.height / 2));
	ctx.scale(5, 5);
	drawImage(dolphinImage, 26);
	ctx.resetTransform();
	pastHistoryFrame++;
	// console.log(clicked, currentPhrase, dialog.length);
	requestAnimationFrame(pastHistoryUpdate);
}
function historyUpdate() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// bg
	ctx.fillStyle = colors[6];
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = colors[1];
	ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

	// moon
	ctx.fillStyle = colors[5];
	drawCircle(canvas.width * 3/4, canvas.height / 4, 50, 10);
	
	// clouds
	ctx.fillStyle = colors[7];
	if (Math.random() < 0.0001 * player.dx) {
		var newCloud = [];
		for (var i = 0; i < 5; i++) {
			newCloud.push([Math.random() * 100, Math.random() * 50]);
		}
		clouds.push([newCloud, canvas.width + 50, Math.random() * canvas.height / 2 - 75, Math.random() + 0.5]);
	}
	for (var i = clouds.length - 1; i >= 0; i--) {
		for (var j = 0; j < clouds[i][0].length; j++) {
			drawCircle(clouds[i][0][j][0] + clouds[i][1], clouds[i][0][j][1] + clouds[i][2], 50, 5, 1.5);
		}
		clouds[i][1] -= 0.1 * clouds[i][3];
		//console.log(clouds[i][3]);
		if (clouds[i][1] < -150) {
			clouds.splice(i, 1);
		}
	}
	if (currentPhrase > 6) {
		ctx.strokeStyle = "white";
		ctx.lineWidth = 5;
		ctx.translate(canvas.width / 2, 100 + ~~(canvas.height / 2));
		draw13(Math.max(Math.min(historyFrame / 250, 1 + 0.2), 0.2) - 0.2);
		ctx.resetTransform();
	}
	//ctx.translate(canvas.width - 1550 + Math.max(historyFrame * 5, 1450), 100 + ~~(canvas.height / 2));
	ctx.translate(canvas.width - 100, 100 + ~~(canvas.height / 2));
	ctx.scale(-5, 5);
	drawImage(sharkImage, 26);
	ctx.resetTransform();

	ctx.translate(75, 100 + ~~(canvas.height / 2));
	ctx.scale(5, 5);
	drawImage(dolphinImage, 26);
	ctx.resetTransform();
	currentPhrase > 6 && historyFrame++;
	// console.log(clicked, currentPhrase, dialog.length);
	if (currentPhrase <= dialog.length) {
		requestAnimationFrame(historyUpdate);
	} else {
		player.y = 100 + ~~(canvas.height / 2);
		update();
		playMusic();
		setInterval(playMusic, 27648 / 128 * 1000);
	}
	//console.log(clicked);
}
//document.onclick = () => (clicked = true);
//update();
historyUpdate();

document.onkeyup = function(e) {
	pressed[e.key] = false;
}
