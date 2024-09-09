var grid = document.querySelector('.grid');
var scoreDisplay = document.querySelector('.score');
var times = document.querySelector('.time');

var ballDiameter = 20;
var boardWidth = 560;
var boardHeight = 560;
var blockWidth = 100;
var blockHeight = 20;
var directionX = 4;
var directionY = 4;
var score = 0;
var time = 0;

var ballP = [290, 40];
var ballCurrentPosition = ballP;

var userP = [250, 10];
var userCurrentPosition = userP;

class Block {
    constructor(x, y) {
        this.main = [x,y];
        this.both = [x + blockWidth, y + blockHeight];
    }
}

var blocks = [
    new Block (10, 530),
    new Block (120, 530),
    new Block (230, 530),
    new Block (340, 530),
    new Block (450, 530),

    new Block (10, 500),
    new Block (120, 500),
    new Block (230, 500),
    new Block (340, 500),
    new Block (450, 500),

    new Block (10, 470),
    new Block (120, 470),
    new Block (230, 470),
    new Block (340, 470),
    new Block (450, 470),
]

for (var i = 0; i < blocks.length; i++) {
    var square = document.createElement('div');
    square.classList.add('square');
   square.style.left = blocks[i].main[0] + 'px';
   square.style.bottom = blocks[i].main[1] + 'px';
    grid.appendChild(square);
}

var user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

function drawUser() {
    user.style.left = userCurrentPosition[0] + 'px';
    user.style.bottom = userCurrentPosition[1] + 'px';
   
}

var ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
    
}

function moveUser(e) {
    switch(e.key) {
        case'ArrowRight':
        if (userCurrentPosition[0] < boardWidth - blockWidth){
            userCurrentPosition[0] += 10;
            drawUser();
        }
        break;
       
        case'ArrowLeft':
        if (userCurrentPosition[0] > 0 ) {
            userCurrentPosition[0] -= 10;
            drawUser();
        }
        break;

      
       
    }
}

function moveBall() {
ballCurrentPosition[0] += directionX;
ballCurrentPosition[1] += directionY;
checkForCollisions();
drawBall();

}
function timer(){
    time++;
times.innerHTML = time;
}
 var timeI = setInterval(timer, 1000);
function checkForCollisions() {
    if (ballCurrentPosition[0] + ballDiameter >= boardWidth ||
        ballCurrentPosition[1] + ballDiameter >= boardHeight ||
        ballCurrentPosition[0] <= 0 ) {
            changeDirection();
        }
        if (ballCurrentPosition[0] + ballDiameter > userCurrentPosition[0] && ballCurrentPosition[0] < userCurrentPosition[0] + blockWidth &&
            ballCurrentPosition[1] + ballDiameter > userCurrentPosition[1] && ballCurrentPosition[1]  < userCurrentPosition[1] + blockHeight){
                changeDirection();
            }

            for (i = 0; i < blocks.length; i++) {
                var allBlocks = document.querySelectorAll('.square');
                if (ballCurrentPosition[0] + ballDiameter > blocks[i].main[0] && ballCurrentPosition[0] < blocks[i].both[0] &&
                    ballCurrentPosition[1] + ballDiameter > blocks[i].main[1] && ballCurrentPosition[1] < blocks[i].both[1]) {
                        changeDirection();
                        allBlocks[i].classList.remove('square');
                        blocks.splice(i, 1);
                        score++;
                        scoreDisplay.innerHTML = score;
                    }
            }

            if (blocks.length === 0) {
                clearAll();
            }
            if (ballCurrentPosition[1] === 0) {
                clearAll();
            }
}


function clearAll(){
    clearInterval(timeI);
    clearInterval(ballInterval);
    document.removeEventListener('keydown', moveUser);
    scoreDisplay.innerHTML = 'GameOver, Your Score is: ' + score;
}
 
function changeDirection() {
    if(directionX === 4 && directionY === 4) {
        directionY = -4;
        return;
    }
    if(directionX === 4 && directionY === -4) {
        directionX = -4;
        return;
    }
    if(directionX === -4 && directionY === -4) {
        directionY = 4;
        return;
    }
    if(directionX === -4 && directionY === 4) {
        directionX = 4;
        return;
    }
}


var ballInterval = setInterval(moveBall, 30);

var userMove = document.addEventListener('keydown', moveUser);