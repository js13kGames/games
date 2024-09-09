var game = {
    interval:1000/60, //denominator is target fps for requestAnimationFrame
    lastTime:0,
    planetCount:2
};
setup();

function setup(){
    document.getElementById("canvasContainer").innerHTML = "";
    game.canvas = document.createElement('canvas');
    game.canvas.id = "canvas";
    game.canvas.width = 1200;
    game.canvas.height = 800;
    document.getElementById("canvasContainer").appendChild(game.canvas);
    game.ctx = game.canvas.getContext("2d");
    document.getElementById('canvas').onmousedown = function(e){ mousedown(e); };
    document.getElementById('canvas').onmouseup = function(e){ mouseup(e); };
    document.getElementById('canvas').onmousemove = function(e){ mousemove(e); };
    game.ctx.strokeStyle = "white";

    initialiseData();

    clear();
    gameLoop();
}

function clear(){
    game.ctx.fillStyle = "black";
    game.ctx.fillRect(0,0,game.canvas.width,game.canvas.height);
}

function initialiseData() {
    game.planets = [];
    game.planets.push(randomPlanet(true));
    for (var i=0; i< game.planetCount; i++){
        game.planets.push(randomPlanet());
    }
    game.ball = randomBall();

    game.charging = false;
    game.mag = 1/50;
    game.strokes = 0;
}

function Ball(x,y,dX,dY,radius,drawRadius){
    this.x = x;
    this.y = y;
    this.dX = dX;
    this.dY = dY;
    this.radius = radius;
    this.drawRadius = drawRadius;
    this.mass = 1;
    this.grounded = false;

    this.move = function() {
        var collision = checkCollisions(this);
        if (collision){
            var normalVector = {
                x:this.x - collision.x,
                y:this.y - collision.y
            };
            var normalVectorAsUnit = unitVector(normalVector);
            var dot = dotProduct({x:this.dX,y:this.dY},normalVectorAsUnit);

            this.dX -= (1 + collision.elasticity) * dot * normalVectorAsUnit.x;
            this.dY -= (1 + collision.elasticity) * dot * normalVectorAsUnit.y;
            this.dX *= collision.elasticity;
            this.dY *= collision.elasticity;
            var collSpeed = getMagnitude({ x: this.dX, y: this.dY });
            if (collSpeed < 0.5 && collSpeed >= 0.2){
                this.dX *= 0.5;
                this.dY *= 0.5;
            } else if (collSpeed < 0.2){
                this.dX = 0;
                this.dY = 0;
                this.grounded = true;
            }

            if (this.grounded){
                var incidence = unitVector({
                    x:this.x - collision.x,
                    y:this.y - collision.y
                });
                this.x = collision.x + (incidence.x * (collision.radius + 6));
                this.y = collision.y + (incidence.y * (collision.radius + 6));
            }

            if (collision.hole && this === game.ball){
                var hit = Math.atan2(this.y - collision.y, this.x - collision.x);
                if (hit <= collision.hole.position + collision.hole.radius && hit >= collision.hole.position - collision.hole.radius){
                    alert("You win! Strokes: " + game.strokes);
                    game.planetCount++;
                    setup();
                }
            }
        }
        this.x += this.dX;
        this.y += this.dY;
    };
    this.draw = function(){

        if (this.grounded){
            game.ctx.strokeStyle = 'yellow';
        } else {
            game.ctx.strokeStyle = 'white';
        }
        game.ctx.beginPath();
        game.ctx.arc(this.x,this.y,this.drawRadius,0,Math.PI * 2);
        game.ctx.stroke();
        game.ctx.strokeStyle = 'white';
    }
}
function randomBall(){
    var ball = new Ball(Math.random() * game.canvas.width, Math.random() * game.canvas.height, Math.random() * 2 - 1, Math.random() * 2 - 1, 5, 5);

    if (checkCollisions(ball)){
        return randomBall();
    } else {
        return ball;
    }
}


function Planet(x,y,mass,radius,hole){
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.radius = radius;
    this.elasticity = 0.75;
    this.hole = hole;

    this.draw = function(){
        game.ctx.strokeStyle = 'white';
        game.ctx.beginPath();
        game.ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        game.ctx.stroke();
        if (this.hole){
            game.ctx.strokeStyle = 'red';
            game.ctx.beginPath();
            game.ctx.arc(this.x, this.y, this.radius, this.hole.position - this.hole.radius, this.hole.position + this.hole.radius);
            game.ctx.stroke();
        }
    }
}
function randomPlanet(hasHole){
    var mass = Math.random() * 500 + Math.random() * 500 + Math.random() * 500;
    var radius = mass / 15;
    var x = (Math.random() + Math.random())/2 * (game.canvas.width - radius*2) + radius;
    var y = (Math.random() + Math.random())/2 * (game.canvas.height - radius*2) + radius;
    var hole = false;
    if (hasHole){
        var hole = {
            position:(Math.random() * 2 - 1) * Math.PI,
            radius:5/radius
        }
    }

    var pColl = new Planet(x,y,mass,radius + 12,hole);
    if (checkCollisions(pColl)){
        return randomPlanet(hasHole);
    } else {
        return new Planet(x,y,mass,radius,hole);
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    var currentTime = (new Date()).getTime();
    var delta = currentTime - game.lastTime;
    if (delta > game.interval) {

        //do loop here
        clear();

        if (!game.ball.grounded){
            gravityPull(game.ball);
            game.ball.move();
        }
        game.ball.draw();

        for (var planet in game.planets){
            game.planets[planet].draw();
        }

        if (game.charging){
            drawPath(game.ball);
        }

        if (game.showingGrid) displayGrid();

        game.lastTime = currentTime - (delta % game.interval);


    }
}

function gravityPull(obj){
    var sumdX = 0;
    var sumdY = 0;
    for (var planet in game.planets){
        var s = game.planets[planet];
        var d = getDist(obj,s);
        var f = (obj.mass * s.mass) / Math.pow(d,2);
        sumdX -= Math.sin((obj.x - s.x)/d) * f;
        sumdY -= Math.sin((obj.y - s.y)/d) * f;
    }
    obj.dX += sumdX;
    obj.dY += sumdY;
}
function checkCollisions(obj){
    for (var planet in game.planets) {
        var s = game.planets[planet];
        var d = getDist(obj,s);
        if (d < s.radius + obj.radius) return s;
    }
    return false;
}

function drawPath(obj){
    var path = new Ball(obj.x,obj.y,obj.dX,obj.dY,5,1);
    var v = unitVector({
        x: game.charging.x - game.ball.x,
        y: game.charging.y - game.ball.y
    });
    var magnitude = getDist(game.charging, game.ball);
    path.dX += v.x * magnitude * game.mag;
    path.dY += v.y * magnitude * game.mag;
    path.grounded = false;
    for (var i=0; i<400; i++){
        gravityPull(path);
        path.move();
        if (path.grounded) break;
        if (i % 4 === 0){
            path.draw();
        }
    }
}

function displayGrid(){
    for (var i = 0, j = game.canvas.height/10; i <= j; i++){
        for (var k = 0, l = game.canvas.width/10; k <= l; k++){
            var obj = {x: k * 10, y: i * 10, dX: 0, dY: 0, mass:1, radius:1};

            if (!checkCollisions(obj)){
                gravityPull(obj);
                var x = obj.x + obj.dX * 200;
                var y = obj.y + obj.dY * 200;

                game.ctx.beginPath();
                game.ctx.moveTo(x, y);
                game.ctx.lineTo(x+1, y+1);
                game.ctx.stroke();
            }
        }
    }
}

function mousedown(e){
    if (game.ball.grounded){
        game.charging = {
            x: e.offsetX,
            y: e.offsetY
        };
    }
}
function mouseup(e){
    if (game.ball.grounded){
        var x = e.offsetX;
        var y = e.offsetY;

        var v = unitVector({
            x: x - game.ball.x,
            y: y - game.ball.y
        });

        var magnitude = getDist(game.charging, game.ball);

        game.ball.dX += v.x * magnitude * game.mag;
        game.ball.dY += v.y * magnitude * game.mag;
        game.ball.grounded = false;

        game.charging = false;
        game.strokes++;
    }
}
function mousemove(e){
    if (game.charging){
        game.charging = {
            x: e.offsetX,
            y: e.offsetY
        };
    }
}

//Maths

function getDist(obj1, obj2){
    return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}
function getMagnitude(vector){
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}
function unitVector(vector){
    return {
        x: vector.x / getMagnitude(vector),
        y: vector.y / getMagnitude(vector)
    }
}
function dotProduct(vector1, vector2){
    return vector1.x * vector2.x + vector1.y * vector2.y;
}