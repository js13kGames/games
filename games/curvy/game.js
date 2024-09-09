var canvas = document.createElement('canvas');
canvas.setAttribute("id", "canvas");

var width = 1024;
var height = 576;
var pointx = width/3;
var gap = height/12;
var ctx = canvas.getContext('2d');
var hspeed = 100;
var hacc = 5;
var vspeed = 0;
var vacc = 8;
var curr_score = 0;
var lineWidth = width/200;
var lineColor = "#009688";
var obstacleColor = "#424242"
var obstacles_n = 3;
var points = [new Point(0,height/2), new Point(pointx, height/2)];
var obstacles = [];
for(var i=0; i<obstacles_n; i++) {
    obstacles.push(new Obstacle(width*(1+i/obstacles_n)));
}
var backgrounds = [ "#f44336", "#e91e63", "#9c27b0", "#673ab7",
                    "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
                    "#4caf50", "#8bc34a", "#cddc39", "#ff5722",
                    "#ffeb3b", "#ffc107", "#ff9800", "#607d8b",
                    "#795548", "#9e9e9e"
                  ];

function random(arr) {
    return arr[Math.round(Math.random()*(arr.length))];
}

function setCanvas() {
	canvas.width = width;
	canvas.height = height;
}

setInterval(function() {
    document.body.style.background = random(backgrounds);
}, 5000);

function Point(a, b){
	this.x = a;
	this.y = b;
}

function Obstacle(a, b, col) {
    this.x = a || width;
	this.y = b || Math.random()*(height-(gap))+gap/2;
	this.c = col || obstacleColor;
    this.pass = false;
	return this;
}

function drawLine(p1, p2, c) {
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.strokeStyle = c;
	ctx.stroke();
}

function drawObstacle(x, y, c) {
	drawLine(new Point(x, 0), new Point(x, y-gap/2), c);
	drawLine(new Point(x,height), new Point(x, y+gap/2), c);
}

function drawObstacles(t) {
	for(var i=0; i < obstacles.length; i++) {
		drawObstacle(obstacles[i].x, obstacles[i].y, obstacles[i].c);
	}
}

function updateObstacles(t) {
	for(var i=0; i < obstacles.length; i++) {
		obstacles[i].x -= hspeed*t;
		if(obstacles[i].x < 0) {
			obstacles.shift();
			obstacles.push(new Obstacle());
		}
	}
}

function drawPoints(t) {
	for(var i=1; i < points.length; i++) {
		drawLine(points[i-1], points[i], lineColor);
	}
}

function updatePoints(t) {
	var i;
	for(i=0; i < points.length; i++) {
		if(points[i].x > 0) break;
	}
	if (i > 1) points.splice(0, i-2);
	for(i=0; i < points.length; i++) {
		points[i].x -= hspeed*t;
	}
	var lastPoint = points[i-1];
    vspeed = vspeed + vacc*t;
	points.push(new Point(pointx, lastPoint.y + vspeed));
}

function drawScore() {
    ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + curr_score, width-150, 32);
}

function detectCollision() {
	p = points[points.length-2];
	q = points[points.length-1];
	if(q.y - lineWidth/2 <= 0 || q.y + lineWidth/2 >= height) {
		window.location = window.location;
	}
	for(var i=0; i<obstacles.length; i++) {
		if(obstacles[i].x > p.x && obstacles[i].x - lineWidth/2 <= q.x) {
            if(!obstacles[i].pass) {
                curr_score++;
                if(curr_score%5) hspeed += hacc;
                obstacles[i].pass = true;
            }
			if(q.y - lineWidth/2 < obstacles[i].y - gap/2 || q.y + lineWidth/2 > obstacles[i].y + gap/2) {
				window.location = window.location;
			}
		}
	}
}

function update(t) {
	updatePoints(t);
	updateObstacles(t);
	detectCollision();
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawObstacles();
	drawPoints();
    drawScore();
}

function bindEvents() {
    this.up = function() {
        vacc = -Math.abs(vacc);
    }

    this.down = function() {
        vacc = Math.abs(vacc);
    }

    addEventListener("keydown", this.up);
    addEventListener("keyup", this.down);

    canvas.addEventListener("mousedown", this.up);
    canvas.addEventListener("mouseup", this.down);

    canvas.addEventListener("touchstart", this.up);
    canvas.addEventListener("touchend", this.down);
}

function main() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	requestAnimationFrame(main);
};

bindEvents();
setCanvas();

document.body.appendChild(canvas);

var then = Date.now();
main();