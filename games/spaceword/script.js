const canvasWidth = document.getElementsByTagName('canvas')[0].clientWidth;
const canvasHeight = document.getElementsByTagName('canvas')[0].clientHeight;

const restitution = 0.90;
let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let gameObjects;
let mouseX
let mouseY
let words = []
let word = ""
let elapsedTime = 0;
let timerInterval;
let startTime
let isDead = false
let lastTime = 0
let invencibilityTime = 2000
let isGameBegins = false
let reverse = false
let pintinhaColor1 = "white"
let pintinhaColor = "black"


//AUDIO
let audioCtx
let freqs = [261.63, 311.13, 261.63, 100, 200, 500, 415.30, 293.66];
function play(frequency){
    setTimeout(()=> {
        var oscillator = audioCtx.createOscillator()
        var gain = audioCtx.createGain()
        oscillator.connect(gain)
        gain.gain.value = 1/freqs.length;
        oscillator.frequency.value = freqs[frequency]
        oscillator.start(1)
        gain.connect(audioCtx.destination)
        gain.gain.exponentialRampToValueAtTime(
            0.00001, audioCtx.currentTime + 6.0
        )
    }, 20)
}

function initAudio() {
    audioCtx = new AudioContext()//({sampleRate: 8000})
}
//AUDIO

window.onload = init;

class GameObject {
    constructor (context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColliding = false;
    }
}

class MainCharacter extends GameObject {
    constructor(context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
        this.lives = 3;
        this.width = 50;
        this.height = 0;
        this.radius = 30;

        canvas.addEventListener("mousemove", this.setMousePosition, false);
    }
    draw() {
        this.context.fillStyle = this.isColliding?'#2C2C2C':'#C0C0C0';
        this.context.beginPath();
        this.context.arc(mouseX, mouseY, this.radius, 0, 2 * Math.PI, false);
        this.context.fill()

        //Pintinha central
        this.context.beginPath();
        context.fillStyle = "white";
        this.context.arc(this.x, this.y, 7, 0, 2 * Math.PI, false);
        this.context.lineWidth = 1;
        this.context.fill();

        //Circulo de pintinhas


        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x + 23, this.y, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x - 23, this.y, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x, this.y - 23, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor;
        this.context.arc(this.x, this.y + 23, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x + 15, this.y + 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x - 15, this.y - 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x + 15, this.y - 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();

        this.context.beginPath();
        context.fillStyle = pintinhaColor1;
        this.context.arc(this.x - 15, this.y + 15, 5, 0, 2 * Math.PI, false);
        this.context.fill();
    }
    update() {
        //TODO - precisa calcular velocidade com o mouse
        this.x = mouseX;
        this.y = mouseY;
        if(this.lives >= 0) {
            let liveShow = "<h1>"
            for (let i = 0; i < this.lives && this.lives > 0; i++) {
                liveShow = liveShow + "🚀"
            }
            liveShow = liveShow + "</h1>"
            document.querySelector('.lifebar').innerHTML = liveShow
        }
        if (this.lives === 0) {
            isDead = true
            play(3)
            play(4)
            play(5)
        }
        if (this.isColliding) {
            //TODO - Tornar visual o processo de invencibilidade
            if(lastTime + invencibilityTime >  Date.now()) {
                return
            }
            --this.lives
            lastTime = Date.now()
        }
    }
    setMousePosition(e) {
        let canvasPos = getPosition(canvas)
        mouseX = e.clientX - canvasPos.x;
        mouseY = e.clientY - canvasPos.y;
    }
}

function getPosition(el) {
    let xPosition = 0;
    let yPosition = 0;

    while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }
    return {
            x: xPosition,
            y: yPosition
    };
}

class Circle extends GameObject {
    constructor(context, x, y, vx, vy) {
        super(context, x, y, vx, vy);
        this.width = 50;
        this.height = 0;
        this.radius = 30
    }
    draw() {
        this.context.fillStyle = this.isColliding?'#F3F3F3':'#F3F3F3';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke()

        //Pintinha
        this.context.beginPath();
        context.fillStyle = "black";
        this.context.arc(this.x + 9, this.y - 8, 2, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke()

        //Pintinha
        this.context.beginPath();
        context.fillStyle = "black";
        this.context.arc(this.x + 7, this.y + 10, 4, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke()

        //Pintinha
        this.context.beginPath();
        context.fillStyle = "black";
        this.context.arc(this.x - 15, this.y, 7, 0, 2 * Math.PI, false);
        this.context.fill();
    }
    update(secondsPassed) {
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

function init() {
    initAudio()

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    createWorld();
    word = words[0]
    document.addEventListener('keydown', (event) => {
        if (event.key === word[0]) {
            word = word.split(''); // or newStr = [...str];
            word.shift();
            word = word.join('');
            if(word.length == 0) {
                words.splice(0,1)
                word = words[0]
                gameObjects.splice(1, 1)
                play(1)
                play(2)
                play(3)
            }
        }
    }, false);
    window.requestAnimationFrame(gameLoop);
}

function createWorld() {
    setInterval(function () {
        if(reverse) {
            reverse = false
            pintinhaColor = "white"
            pintinhaColor1 = "black"
        } else {
            reverse = true
            pintinhaColor1 = "white"
            pintinhaColor = "black"
        }

    }, 3000)
    gameObjects = [
        new MainCharacter(context, mouseX, mouseY, 50, -50),
    ];
    startTime = Date.now() - elapsedTime;
    const interval = setInterval(function() {
        if(!isDead) {
            createAnEnemy()
        } else {
            clearInterval(interval)
        }
    }, 3000);
}

const characters ='abcdefghijklmnopqrstuvwxyz';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function createAnEnemy() {
    words.push(generateString(getRandomInt(4, 7)))
    gameObjects.push(new Circle(context, getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight), getRandomInt(0, 100), getRandomInt(0, 100)))
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function detectCollisions() {
    let obj1;
    let obj2;

    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    for (let i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j];
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height) || circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){
                obj1.isColliding = true;
                obj2.isColliding = true;

                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
                if (speed < 0){
                    break;
                }
                obj1.vx -= (speed * vCollisionNorm.x);
                obj1.vy -= (speed * vCollisionNorm.y);
                obj2.vx += (speed * vCollisionNorm.x);
                obj2.vy += (speed * vCollisionNorm.y);

            }
        }
    }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

//TODO - Isso precisará mesclar entre circulo e retangulo
function circleIntersect(x1, y1, r1, x2, y2, r2) {
    let squareDistance = (x1-x2) * (x1-x2) + (y1-y2) * (y1-y2);
    return squareDistance <= ((r1 + r2) * (r1 + r2))
}

//TODO - Manipular aqui para inserir nossos menus
function detectEdgeCollisions() {
    let obj;
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj = gameObjects[i];
        if (obj.x < obj.radius){
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = obj.radius;
        }else if (obj.x > canvasWidth - obj.radius){
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasWidth - obj.radius;
        }
        if (obj.y < obj.radius){
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.y = obj.radius;
        } else if (obj.y > canvasHeight - obj.radius){
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasHeight - obj.radius;
        }
    }
}

function gameLoop(timeStamp) {
    if(isGameBegins) {
        document.getElementsByTagName('nav')[0].style.visibility = "hidden"
        document.getElementsByTagName('canvas')[0].style.cursor = 'none'
        if (!isDead) {
            secondsPassed = (timeStamp - oldTimeStamp) / 1000;
            oldTimeStamp = timeStamp;
            for (let i = 0; i < gameObjects.length; i++) {
                gameObjects[i].update(secondsPassed);
            }
            detectCollisions();
            detectEdgeCollisions()
            clearCanvas();

            for (let i = 0; i < gameObjects.length; i++) {
                if (words.length === 0) {
                    createAnEnemy()
                    word = words[0]
                }
                html = "<h1>" + word + "</h1>"

                timerInterval = setInterval(function printTime() {
                    if (!isDead) {
                        elapsedTime = Date.now() - startTime;
                    }
                }, 10);
                timer = "<h1>" + timeToString(elapsedTime) + "</h1>"
                document.querySelector('.text').innerHTML = html
                document.querySelector('.cronometer').innerHTML = timer
                gameObjects[i].draw();
            }
            window.requestAnimationFrame(gameLoop)
        } else {
            clearCanvas();
            document.getElementsByClassName('text')[0].innerHTML = ""
            document.getElementsByClassName('cronometer')[0].innerHTML = ""
            document.getElementById('retry').style.visibility = "visible"
            document.getElementsByTagName('canvas')[0].style.cursor = 'default'
            document.querySelector('.timefinish').innerHTML = timer

        }
    }
}

function beginGame() {
    document.getElementById('retry').style.visibility = "hidden"
    isGameBegins = true
    isDead = false
    elapsedTime = 0
    //TODO - melhor não usaro  init, e sim reiniciar o estado inicial do jogo.
    init()
}

function timeToString(time) {
    //TODO - Entendi nada não mas tamo ai - https://tinloof.com/blog/how-to-build-a-stopwatch-with-html-css-js-react-part-2/
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function sike() {
    alert("do you really think that i'll let you go easy? PLAY THE GAME!")
}

function restartStateGame() {
    secondsPassed = 0;
    oldTimeStamp = 0;
    gameObjects;
    words = []
    word = ""
    elapsedTime = 0;
    timerInterval;
    startTime
    lastTime = 0
    invencibilityTime = 2000
}