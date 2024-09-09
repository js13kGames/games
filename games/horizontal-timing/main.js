let {abs, floor, random} = Math;

var lvls = [
	[
		[[0, 0], [0, 0], [2, 2]],
		[[1, 1], [0, 1], [1, 1]],
		[[3, 3], [0, 0], [0, 0]]
	],
	[
		[[0, 0], [0, 0], [2, 2]],
		[[0, 1], [1, 0], [0, 1]],
		[[3, 3], [0, 0], [0, 0]]
	],
	[
		[[0, 0, 0], [0, 0, 0], [2, 2, 2]],
		[[1, 1, 1], [0, 1, 1], [1, 1, 1]],
		[[3, 3, 3], [0, 0, 0], [0, 0, 0]]
	]
]


var SCALE = 320;
var size = 128;
var frameCellSize = 32;

var tableDOM;
var canvasDOM;
var bodyDOM;
var listDOM;
var menuDOM;
var framesDOM;
var progressBarDOM;
var coolDownDOM;
var ctx;
var res;

var mainMenuSplash, gameOverSplash, nextLevelSplash, endGameSplash;

var i, j, k, n, m, o, ratio;

var time = 0;
var speed = 1000;

var grid = [];
var list;
var pos;
var source;
var goal;
var currLvl = 0;

var timer;

var aus;


var newLevel = function () {
	currLvl++;
	window.clearInterval(timer);
	coolDownDOM.innerHTML = 3;
	document.getElementById ('got').innerHTML = 'Game Over! level reached: ';
	mainMenuSplash.style.display = 'none';
	gameOverSplash.style.display = 'none';
	nextLevelSplash.style.display = 'none';
	endGameSplash.style.display = 'none';

	tableDOM.style.visibility = 'visible';
	tableDOM.style.display = 'flex';

	list= [];
	clear();

	var valid = [];

	while (valid.length < 2) {
		try {
			createLevel ();
			valid = pathfinding();
		}
		catch (e) {
			valid = [];
		}
	}

	time = 0;

	drawLevelFrames ();

	time = floor(((m * 0.5) * (n * 0.5) * (o * 0.7) * (valid.length * 0.5)));

	getInputs ();
}

var createLevel = function () {
	n = 3;
	m = 4;
	o = 2;

	ratio = 0.5;

	c.width = size * m;
	c.height = size * n;

	randomLevel ();
}

var randomLevel = function () {
	for (i = 0; i < n; i++) {
		grid [i] = new Array();

		for (j = 0; j < m; j++) {
			grid [i][j] = new Array ();

			for (k = 0; k < o; k++)
				grid [i][j][k] = floor(random () + ratio);
		}
	}

	i = floor(random()*n);
	j = floor(random()*m);
	for (k in grid[0][0])
		grid[i][j][k] = 2;
	goal = [i, j];

	i = floor(random()*n);
	j = floor(random()*m);
	for (k in grid[0][0])
		grid[i][j][k] = 3;
	source = [i, j];
	pos = [i, j, 0];
}

var drawLevel = function (t, c, s) {
	if (t === undefined)
		t = time;
	if (c == undefined)
		c = ctx;
	if (s === undefined)
		s = size;

	c.clearRect(0, 0, 800, 600);

	for (i in grid)
		for (j in grid [i])
			c.drawImage (res, SCALE * grid [i][j][t%o], 0, SCALE, SCALE, j * s, i * s, s, s);
}

var drawLevelFrames = function () {
	for (k in grid[0][0]) {
		aus = document.createElement('canvas');
		aus.width = frameCellSize * m;
		aus.height = frameCellSize * n;

		drawLevel (parseInt(k), aus.getContext('2d'), frameCellSize);
		framesDOM.appendChild (aus);
	}
}

var getInputs = function () {
	progressBarDOM.max = time;
	progressBarDOM.style.transition += time + 's width linear';

	bodyDOM.onkeydown = keyListener;
	bodyDOM.onkeyup = function () {bodyDOM.onkeydown = keyListener;};

	progressBarDOM.style.width = '0%';
	timer = setTimeout (function () {	
		loop ();
	}, time * 1000);

}

var loop = function () {
	bodyDOM.onkeydown = undefined;
	bodyDOM.onkeyup = undefined;
	window.clearInterval (timer);
	time = 0;
	drawLevel ();
	ctx.drawImage (res, 0, 640, SCALE, SCALE, pos[1] * size, pos [0] * size, size, size);
	timer = setInterval (function () {
		if (list.length > 0) {
			time++;
			pos[0] += list[0].offset[0];
			pos[1] += list[0].offset[1];

			if (pos[0] < 0)
				pos[0] = 0;
			if (pos[0] == n)
				pos[0]--;

			if (pos[1] < 0)
				pos[1] = 0;
			if (pos[1] == m)
				pos[1]--;

			list.shift().style.opacity = 0.5;

			drawLevel ();
			ctx.drawImage (res, 0, 640, SCALE, SCALE, pos[1] * size, pos [0] * size, size, size);

			switch (grid [pos[0]][pos[1]][time%o]) {
				case 1: gameOver (); break;
				case 2: nextLevel ();
			}
		}
		else
			gameOver ();
	}, speed);
}

var gameOver = function () {
	window.clearInterval (timer);
	document.getElementById ('got').innerHTML += currLvl;
	currLvl = 0;
	window.setTimeout(function () {
		gameOverSplash.style.display = 'flex';
	}, 1000);
}

var nextLevel = function () {
	nextLevelSplash.style.display = 'flex';
	window.clearInterval (timer);

	timer = setInterval (function () {
		aus =  parseInt (coolDownDOM.innerHTML) - 1;

		if (aus == 0)
			newLevel ();
		else
			coolDownDOM.textContent = aus;
	}, 1000);
}

var pathfinding = function () {
	time = 0;

	var closedSet = [];
	var openSet = [pos];
	var cameFrom = {};
	var gScore = JSON.parse(JSON.stringify(grid));
	var fScore = JSON.parse(JSON.stringify(grid));
	var neighbor;
	var tentative_gScore;

	for (i in grid)
		for (j in grid[i])
			for (k in grid[i][j]) {
				gScore [i][j][k] = i == pos [1] && j == pos[0] && k == 0 ? 0 : Infinity;
				fScore [i][j][k] = i == pos [1] && j == pos[0] && k == 0 ?
					h(source, goal) : Infinity;
			}

	while (openSet.length > 0) {
		openSet.sort (function (a, b) {
			return fScore[openSet.indexOf(a)] - fScore[openSet.indexOf(a)];
		});

		aus = openSet.shift ();
		time = aus[2];
		if (cmpPair(aus, goal))
			return calcDistance (cameFrom, aus);

		closedSet.push (aus);

		for (k = 0; k < 5; k++) {
			try { 
				var x, y;

				switch (k) {
					case 0: x = 0; y = 0; break;
					case 1: x = 1; y = 0; break;
					case 2: x = -1; y = 0; break;
					case 3: x = 0; y = 1; break;
					case 4: x = 0; y = -1; break;
				}
				if (grid [aus[0] + x][aus[1] + y][(time + 1) % o] == 1)
					continue;

				neighbor = [aus[0] + x, aus[1] + y, (time + 1) % o];
				if (containsPair (closedSet, neighbor))
					continue;
				tentative_gScore = containsPair (gScore, aus) + h (aus, neighbor);

				if (!containsPair(openSet, neighbor))
					openSet.push(neighbor);
				else if (tentative_gScore >= containsPair(gScore, neighbor))
					continue;

				cameFrom [neighbor] = aus;
				gScore [neighbor] = tentative_gScore;
				fScore [neighbor] = gScore [neighbor] + h (neighbor, goal);
			}
			catch (e) {}
		}
	}

	return [];
}

var clear = function () {
	while (framesDOM.firstChild)
		framesDOM.removeChild(framesDOM.firstChild);

	while (listDOM.firstChild)
		listDOM.removeChild(listDOM.firstChild);


	progressBarDOM.style.transition = '';
	progressBarDOM.style.width = '80%';
}

var keyListener = function (e) {
	bodyDOM.onkeydown = undefined;

	switch (e.keyCode) {
		case 87:
			list.push ([-1, 0]);
			break;
		case 83:
			list.push ([1, 0]);
			break;
		case 65:
			list.push ([0, -1]);
			break;
		case 68:
			list.push ([0, 1]);
			break;
		case 32:
			list.push ([0, 0]);
			break;
		case 13:
			progressBarDOM.style.transition = '';
			progressBarDOM.style.width = "0px";
			loop ();
			return;
		default:
			return;
	}

	k = list.length - 1;
	aus = list[k];

	list[k] = document.createElement('canvas');
	list[k].offset = aus;
	list[k].width = size;
	list[k].height = size;

	switch (aus[1]) {
		case -1:
			i = 3;
			break;
		case 1:
		 i = 1;
		 break;
		case 0:
			i = aus[0] == 1 ? 2 : aus[0] == 0 ? 4 : 0;
	}
	list[k].getContext('2d').drawImage (res, SCALE * i, SCALE, SCALE, SCALE, 0, 0, size, size);
	listDOM.appendChild (list[k]);
}

var cmpPair = function (a, b) {
	if (b[2] === undefined)
		return a[0] == b[0] && a[1] == b[1];
	else
		return a[0] == b[0] && a[1] == b[1] && a[2] == b[2];
}

var containsPair = function (a, p) {
	if (p[2] === undefined) {
		for (i in a)
			if (a[i][0] == p[0] && a[i][1] == p[1])
				return a[i];
	}
	else {
		for (i in a)
			if (a[i][0] == p[0] && a[i][1] == p[1] && a[i][2] == p[2])
				return a[i];
	}

	return false;
}

var h = function (a, b) {
	return abs (source[1] - goal[1]) + abs (source[0] - goal[0]);
}

var calcDistance = function (cameFrom, aus) {
	var ret = [];

	while (cameFrom[aus] != undefined) {
		ret.push(aus);
		aus = cameFrom[aus];
	}

	return ret;
}