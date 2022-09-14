var myObstacles = [];
var myScore;

function startGame() {
    myGameArea.start();
    gpRight = new component(40, 65, "red", 200, 650);
    gpLeft = new component(40, 65, "blue", 160, 650);
    myScore = new component("30px", "Consolas", "green", 10, 780, "text");
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.update = function () {
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function (otherobj) {
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

var keyPressed = {}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 400;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.a = 1;
        this.count = 0;
        this.acc = setInterval(checkScore, 10);
        this.interval = setInterval(updateGameArea, 10);
        window.addEventListener('keydown', function (e) {
            keyPressed[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            keyPressed[e.keyCode] = false;
        })
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((Math.floor(myGameArea.frameNo) / n) % 1 == 0) { return true; }
    return false;
}


function checkScore(){
    for (i = 0; i < myObstacles.length; i += 1) {
        if(myObstacles[i].y > 715){
            myGameArea.count = i+1;
        }
    }
    return myGameArea.count;
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (gpLeft.crashWith(myObstacles[i]) || gpRight.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();    

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(250)) {
        if (Math.random() > 0.5) {
            x = 75;
            y = -65;
            myObstacles.push(new component(250, 65, "yellow", x, y));
        }
        else {
            x = Math.random() > 0.5 ? 0 : 150;
            y = -65;
            myObstacles.push(new component(250, 65, "yellow", x, y));
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myGameArea.a += 0.0001;
        myObstacles[i].speedY = myGameArea.a;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    gpLeft.speedX = 0;
    gpRight.speedX = 0;
    if (keyPressed["39"] && keyPressed["37"]) {
        gpLeft.speedX = -4;
        gpRight.speedX = 4;
        if (gpLeft.x == 0) {
            gpLeft.speedX = 0;
        }
        if (gpRight.x == 360) {
            gpRight.speedX = 0;
        }
    }
    else if (keyPressed["39"]) {
        gpLeft.speedX = 4;
        gpRight.speedX = 4;
        if (gpRight.x == 360 || gpLeft.x == 0) {
            gpLeft.speedX = 0;
            gpRight.speedX = 0;
        }
    } else if (keyPressed["37"]) {
        gpLeft.speedX = -4;
        gpRight.speedX = -4;
        if (gpLeft.x == 0 || gpRight.x == 360) {
            gpLeft.speedX = 0;
            gpRight.speedX = 0;
        }
    } else {
        gpLeft.x = 160;
        gpRight.x = 200;
    }
    myScore.text = "SCORE: "+ checkScore();
    myScore.update();
    gpLeft.newPos();
    gpLeft.update();
    gpRight.newPos();
    gpRight.update();
}
