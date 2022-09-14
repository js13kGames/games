// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

'use strict';let zzfx,zzfxV,zzfxX
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 ~ 884 bytes minified
zzfxV=.4    // volume
zzfx=       // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0)=>{let
M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g=0,H=0,a=0,n=1,I=0
,J=0,f=0,x,h;e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+
r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1)
,-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:
-1)*M.abs(f)**D*p*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/
2+(c>a?0:(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin(a)
+1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.createBuffer(1,h,R);p.
getChannelData(0).set(k);b=zzfxX.createBufferSource();b.buffer=p;b.connect(zzfxX.destination
);b.start();return b};zzfxX=new (window.AudioContext||webkitAudioContext) // audio context

// Death
// MIT License - Copyright 2022 Antoine Dricot
// A dumb game.

/** Get a random integer between a and b*/
function getRandomIntegerBetween(a, b) {
    return Math.round(a + Math.random() * (b - a));
}

/** Draw a line */
function drawLine(context, ax, ay, bx, by, color, width) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = width;
    context.moveTo(ax, ay);
    context.lineTo(bx, by);
    context.stroke();
    context.closePath();
}

/** Draw a box */
function drawBox(context, x, y, width, height, fillStyle = null, strokeStyle = null, strokeWidth = 0) {
    context.beginPath();

    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;

    context.rect(x, y, width, height);
    if (strokeStyle) { context.stroke(); }
    if (fillStyle) { context.fill(); }
    context.closePath();
}
/** Draw a circle */
function drawCircle(context = null, x = 0, y = 0, radius = 0, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (strokeStyle != null) { context.stroke(); }
    if (fillStyle != null) { context.fill(); }
    context.closePath();
}
/** Draw a bottom of a circle */
function drawBottomCircle(context = null, x = 0, y = 0, radius = 0, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = strokeWidth;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI, false);
    if (strokeStyle != null) { context.stroke(); }
    if (fillStyle != null) { context.fill(); }
    context.closePath();
}

const REFERENCE_SIZE = 100;

// --- PALETTE
const COLOR_NOIR = "#1a2639";
const COLOR_SOMBRE = "#3e4a61";
const COLOR_CLAIR = "#d9dad7";
const COLOR_SAILLANT = "#c24d2c";
const COLOR_WHITE = "white";

const COLOR_BACKGROUND = COLOR_CLAIR;
const COLOR_WALLS = COLOR_SOMBRE;
const COLOR_INSTRUCTIONS = COLOR_NOIR;

const SOUND_TARGET = [.5,,1634,.01,.07,.13,,1.69,2.2,4.5,,,.03,.1,2.8,,,.43,.05];
const SOUND_POP = [5.25,,378,,.02,.02,3,2.6,,,-338,,,,120,,,.78,.01,.05];
const SOUND_NOPE = [.5,,37,,.05,.08,3,.92,,.1,,-0.01,.08,,-1,,.24,.97,.05]; // Shoot 199 - Mutation 2
const SOUND_HELL = [1.95,,164,,.03,.18,,.35,,,-182,.08,,,4.6,,,.51,,.16]; // Pickup 322;
const SOUND_IMMORTAL = [,1,642,.01,.07,.16,,1.96,-8.1,-4.1,,,,,,,,.92,.05]; // Jump 220
const SOUND_BAM = [1.01,1,492,.07,.13,.26,1,1.66,3.7,,-6,.1,.15,,15,.1,,.91,.23]; // Powerup 235

class GameObject {
    constructor(context, x, y, width, height) {
        this.uid = String(Math.random()).substring(2); // unique identifier
        console.debug("New GameObject with pseudo-unique identifier " + this.uid)
        this.context = context;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.bounceCount = null;
    }
    draw() {
        drawBox(
            this.context,
            this.x, this.y,
            this.width, this.height,
            null, "magenta", 1); // Debug method
    }
    getLeft() { return this.x; }
    getRight() { return this.x + this.width; }
    getTop() { return this.y; }
    getBottom() { return this.y + this.height; }
    getCenter() { return this.x + this.width / 2; }
    getMiddle() { return this.y + this.height / 2; }
    centerIsAlignedTo(anotherGameObject) {
        return this.getCenter() > anotherGameObject.getLeft() && this.getCenter() < anotherGameObject.getRight();
    }
    middleIsAlignedTo(anotherGameObject) {
        return this.getMiddle() > anotherGameObject.getTop() && this.getMiddle() < anotherGameObject.getBottom();
    }
    isAlignedto(anotherGameObject) {
        return this.centerIsAlignedTo(anotherGameObject) && this.middleIsAlignedTo(anotherGameObject);
    }
}
class Target extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.bounceCount = 0;
        this.owner = null;
    }
    draw() {
        const MAX_BOUNCE_FRAMES = 60;
        this.bounceCount++ ;
        this.bounceCount = this.bounceCount%MAX_BOUNCE_FRAMES;
        let bounce = this.bounceCount/MAX_BOUNCE_FRAMES;
        let margin = this.width * .15;
        let thickness = this.width / 2;
        drawCircle(this.context,
            this.x + this.width / 2,
            this.y + this.height / 2 + Math.sin(bounce*Math.PI*2) * .5,
            this.width / 2 - thickness / 2 - margin,
            null, COLOR_SAILLANT, thickness);
    }
}
class Platform extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dead = false;
        // FIXME INITIALIZE TRIGGERED MEMBER
        this.color = COLOR_SOMBRE;
        this.borderColor = null;
        this.MAX_POP_FRAMES = 20;
    }
    bounce() {
        const MAX_BOUNCE_FRAMES = 10;
        if (this.bounceCount == null) {this.bounceCount = 0;}
        if (this.bounceCount < 1) {
            this.bounceCount += 1 / MAX_BOUNCE_FRAMES;
        } else {this.bounceCount = 1;} // MAX
    }
    draw() {
        let thickness = this.width * .02;
        let bounce = 0;
        if (this.bounceCount != null) {
            bounce = Math.sin(this.bounceCount*Math.PI) * .5;
        }
        if (!this.dead) {
            drawBox(
                this.context,
                this.x + thickness,
                this.y + thickness + bounce,
                this.width - thickness*2, this.height - thickness*2,
                this.color, this.borderColor, thickness);
        }
        else if (this.popCountDown > 0) {
                this.popCountDown--;
                let step = this.MAX_POP_FRAMES - this.popCountDown;
                let size = step / (this.width / 2);
                let thickness = .1;
                drawCircle(this.context,
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    size,
                    null, COLOR_SAILLANT, thickness);
        }
    }
    release() {
        zzfx(...SOUND_POP);
        this.dead = true;
        this.popCountDown = this.MAX_POP_FRAMES;
    }
    trigger() {
        this.triggered = true;
        this.bounce();
    }
}
class ImmortalPlatform extends Platform {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.color = "magenta";
    }
    release(){}
    trigger() {
        if (this.triggered ) {return;}
        else {
            zzfx(...SOUND_IMMORTAL);
            this.triggered = true;
        }
    }
}
class MortalPlatform extends Platform {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.color = COLOR_SAILLANT;
        this.mortal = true;
    }
}
let ANIMATIONS = {
    IDLE: "Idle",
    RUNNING_RIGHT: "Running right",
    RUNNING_LEFT: "Running left"
}
class MainCharacter extends GameObject {
    constructor(context, x, y, width, height) {
        super(context, x, y, width, height);
        this.dx = 0;
        this.dy = 1; // FIXME GRAVITY!

        this.maxRunningSpeed = .8;
        this.animation = ANIMATIONS.IDLE;
        this.animation_step = 0;
        this.step = 0;
    }
    draw() {
        const MAX_STEP = 60; // Multiple of all the smaller steps number
        this.step++;
        this.step = this.step % MAX_STEP;

        // Anim. body bounce (30 frames loop)
        const BODY_BOUNCE_AMPLITUDE = this.width * .02;
        const BODY_BOUNCE_DURATION = 20;

        let FRAMES = 2;
        this.animation_step += .1;
        this.animation_step = this.animation_step%FRAMES;
        if (this.dx > 0) {
            this.animation = ANIMATIONS.RUNNING_RIGHT;
        } else if (this.dx < 0) {
            this.animation = ANIMATIONS.RUNNING_LEFT;
        }

        // DEFAULT VALUES
        let legThickness = this.width * .15;
        let bodyHeight = this.height * .8;
        let bodyWidth = bodyHeight;
        let xMargin = this.width - bodyWidth;
        let normalizedStep = (this.step % BODY_BOUNCE_DURATION)/ BODY_BOUNCE_DURATION;
        let bodyBounce = 0;

        let eyeCenter = this.getCenter();
        let pupilCenter = eyeCenter; // FIXME PUPIL SHIFT
        let eyeMiddle = this.getMiddle() - xMargin / 2;
        let eyeRadius = this.width / 5;

        let hipSpace = this.width * .4;
        let xleftHip = this.getCenter() - hipSpace / 2;
        let yleftHip =  this.getMiddle() + xMargin / 2;
        let xleftHeel = xleftHip;
        let yleftHeel =  this.getBottom() + .5; // FIXME

        let xrightHip = this.getCenter() + hipSpace / 2;
        let yrightHip =  this.getMiddle() + xMargin / 2;
        let xrightHeel = xrightHip;
        let yrightHeel =  this.getBottom() + .5; // FIXME

        if (this.animation == ANIMATIONS.IDLE) {
            bodyBounce = BODY_BOUNCE_AMPLITUDE * Math.sin(normalizedStep*2*Math.PI);
            eyeMiddle = eyeMiddle + bodyBounce;
        } else if (this.animation == ANIMATIONS.RUNNING_RIGHT) {
            eyeCenter =  this.getCenter() + xMargin / 2;
            pupilCenter = eyeCenter + eyeRadius / 3;
            xleftHeel = xleftHeel - Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            xrightHeel = xrightHeel + Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            yleftHeel = yleftHeel + Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
            yrightHeel = yrightHeel - Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
        } else if (this.animation == ANIMATIONS.RUNNING_LEFT) {
            eyeCenter =  this.getCenter() - xMargin / 2;
            pupilCenter = eyeCenter - eyeRadius / 3;
            xleftHeel = xleftHeel + Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            xrightHeel = xrightHeel - Math.sin(this.animation_step*Math.PI) * hipSpace / 2;
            yleftHeel = yleftHeel + Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
            yrightHeel = yrightHeel - Math.cos(this.animation_step*Math.PI) * hipSpace /4 - hipSpace/8;
        }

        // LEGS
        drawLine(this.context, xleftHip, yleftHip, xleftHeel, yleftHeel, COLOR_NOIR, legThickness);
        drawLine(this.context, xrightHip, yrightHip, xrightHeel, yrightHeel, COLOR_NOIR, legThickness);
        // BODY
        drawBox(
            this.context,
            this.x + xMargin / 2,
            this.y + bodyBounce,
            bodyWidth, bodyHeight,
            COLOR_NOIR, null, null);
        // EYE
        drawCircle(
            this.context, eyeCenter, eyeMiddle,
            eyeRadius,
            COLOR_WHITE, null, null);
        drawCircle(
            this.context, pupilCenter, eyeMiddle,
            eyeRadius / 2,
            COLOR_NOIR, null, null);
    }
    isFalling() {
        return (this.platformUid == null);
    }
    move() {
        // FIXME DECELERATE IF NOT GROUNDED
        this.x += this.dx; // FIXME TIMES SPEED
        if (this.isFalling()) { // FIXME REMOVE THIS STUPID CONDITION
            this.y += this.dy;
        }
    }
    turnBack() {
        this.dx = -this.dx;
    }
    crashInPlatform(platform) {
        zzfx(...SOUND_NOPE);
        // FIXME PUSHED BACK BUT DOES NOT CHANGE DIRECTION?
        if (this.dx > 0) {
            this.resetCenter(platform.getLeft());
        } else if (this.dx < 0) {
            this.resetCenter(platform.getRight());
        }
        this.turnBack();
    }
    resetCenter(x) {this.x = x - Math.ceil(this.width / 2);}
}
const GAME_STATE = { // USEFUL KEYS, IGNORE VALUES.
    INITIALIZATION: "INITIALIZATION",
    INITIALIZED: "INITIALIZED",
    PLAYING: "PLAYING",
    DEFAULT: "DEFAULT"
};
const GAME_ELEMENTS = { // USEFUL KEYS, IGNORE VALUES.
    NOTHING: "NOTHING",
    MAINCHARACTER: "MAINCHARACTER",
    PLATFORM: "PLATFORM",
    IMMORTALPLATFORM: "IMMORTALPLATFORM",
    MORTALPLATFORM: "MORTALPLATFORM",
    TARGET: "TARGET",
    DEFAULT: "DEFAULT"
};
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        let factor = this.canvas.width / REFERENCE_SIZE;
        this.context.scale(factor, factor);

        this.state = GAME_STATE.INITIALIZATION;
        this.level = null;
        this.grid = null;
        this.gridWidth = 8;
        this.blockWidth = REFERENCE_SIZE / this.gridWidth; // Platforms
        this.gridHeight = this.gridWidth; // Square
        this.blockHeight = REFERENCE_SIZE / this.gridHeight;

        this.character = null;
        this.target = null;
    }
    collisions() {
        // Collisions between character and walls!

        if (this.character.getRight() > REFERENCE_SIZE ||
            this.character.getLeft() < 0) {
            this.character.turnBack(); // FIXME BLOCK CONTROL FOR SOME TIME
        }

        // Collisions between character and platforms!
        this.character.platformUid = null;
        for (let platform of this.platforms) {
            if (platform.dead) {
                continue;
            }
            let platformTriggered = platform.triggered;

            // Is character crashing in the platform?
            if (this.character.isAlignedto(platform)) { this.character.crashInPlatform(platform); }

            // Is character grounded on a platform?
            if (this.character.centerIsAlignedTo(platform)) {
                // -- Horizontally aligned
                if (this.character.getBottom() >= platform.getTop() &&
                    this.character.getBottom() < platform.getBottom()) {
                    platform.trigger();
                    this.character.platformUid = platform.uid;
                    this.character.y = platform.getTop() - this.character.height;
                }
            }

            if (platformTriggered &&
                this.character.platformUid != platform.uid) {
                platform.release();
            }
        }
        // Is character within the target?
        if (this.character.isAlignedto(this.target)) {this.endGameCycle(true);}

        // Is character entering Hell?
        // FIXME DRAW LAVA POP

        // Is character in Hell?
        if (this.character.getTop() > REFERENCE_SIZE) {
            this.endGameCycle(false);
        }
    }
    cancelControls() {gClicked=false;}
    control() {

        if (gClicked) {
            if (this.state == GAME_STATE.INITIALIZED) {
                this.setState(GAME_STATE.PLAYING);
            } 
            if (this.state == GAME_STATE.PLAYING && !this.character.isFalling()) {
                if (this.character.dx == 0) {
                    this.character.dx = this.character.maxRunningSpeed;
                }
                else {
                    this.character.dx = -this.character.dx; // FIXME
                }
            }
            gClicked = false; // FIXME COYOTE TIME
        }
    }
    drawInstructions() {
        this.context.font = String(this.blockHeight/2) + "px sans-serif";
        this.context.fillStyle = COLOR_INSTRUCTIONS;
        this.context.textAlign = "center";
        this.context.fillText(
            "LEVEL "+ this.level, REFERENCE_SIZE / 2, this.blockHeight * 1 - this.blockHeight / 4);
    }
    // drawVersion() {
    //     this.context.font = "4px Times";
    //     this.context.fillStyle = COLOR_SAILLANT;
    //     this.context.textAlign = "left";
    //     this.context.fillText("version 1.a (sept. 11 12:47) ", 0, 4);
    // }
    drawBackground() {
        const WALL_WIDTH = REFERENCE_SIZE * 0.02;
        // -- Draw sky
        drawBox(this.context, 0, 0, REFERENCE_SIZE, REFERENCE_SIZE, COLOR_BACKGROUND);
        // -- Draw walls
        drawBox(this.context, 0, 0, WALL_WIDTH, REFERENCE_SIZE, COLOR_WALLS);
        drawBox(this.context, REFERENCE_SIZE - WALL_WIDTH, 0, REFERENCE_SIZE, REFERENCE_SIZE, COLOR_WALLS);
    }
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);

        // -- Background
        this.drawBackground();

        // DRAW PLATFORMS
        for (let platform of this.platforms) {
            platform.draw();
        }
        // DRAW ITEM
        this.target.draw();
        // DRAW MAIN CHARACTER
        this.character.draw();
        if (this.state == GAME_STATE.INITIALIZATION ||
            this.state == GAME_STATE.INITIALIZED) {
            this.drawInstructions();
        }
        // this.drawVersion() // DEBUG
    }
    generateGrid() {
        let grid = new Array(this.gridWidth);
        for (let i = 0; i < this.gridWidth; i++) {
            grid[i] = new Array(this.gridHeight);
            for (let j = 0; j < this.gridHeight; j++) {
                grid[i][j] = GAME_ELEMENTS.DEFAULT; // Placeholder
            }
        }
        let numLevelCompleted = this.level - 1;

        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                if (grid[i][j] != GAME_ELEMENTS.DEFAULT) {
                    continue; // Already set
                }
                // --- Platforms
                if (j > 0) { // Skip first line
                    if (!(j%2)) { // Only on odd lines
                        grid[i][j] = GAME_ELEMENTS.PLATFORM;
                    }
                }
                // -- Empty by default
                else {
                    grid[i][j] = GAME_ELEMENTS.NOTHING; // NOTHING BY DEFAULT
                }
            }
        }
        grid[1][0] = GAME_ELEMENTS.MAINCHARACTER;

        // Position Halo
        // -- Increase depth at first...
        let targetVerticalPosition = this.level % this.gridHeight; // Modulo could be removed
        // ... then random depth
        if (this.level >= this.gridHeight) {
            targetVerticalPosition = getRandomIntegerBetween(3, this.gridHeight - 1);
        }

        let targetHorizontalPosition = this.gridWidth - 2;
        if (targetVerticalPosition == this.gridHeight - 1) {
            // Margin for the last line
            targetHorizontalPosition = getRandomIntegerBetween(2, this.gridWidth - 3);
        } else if (targetVerticalPosition > 2) {
            targetHorizontalPosition = getRandomIntegerBetween(0, this.gridWidth - 1);
        }
        // -- No jumps - could be removed but kept for future
        // if (targetVerticalPosition == 0) {
        //     targetVerticalPosition = 3;
        // }
        grid[targetHorizontalPosition][targetVerticalPosition] = GAME_ELEMENTS.TARGET;

        this.grid = grid;
    }
    initialize() {
        if (this.level == null) {
            this.level = 1;
        }

        this.generateGrid(this.gridWidth, this.gridHeight);

        // Construct platforms
        this.platforms = new Array();
        this.character = null;
        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                if (this.grid[i][j] == GAME_ELEMENTS.MAINCHARACTER) {
                    // Construct main character
                    this.character = new MainCharacter(
                        this.context, i * this.blockWidth, j * this.blockHeight,
                        this.blockWidth, this.blockHeight);
                }
                else if (this.grid[i][j] == GAME_ELEMENTS.TARGET) {
                    // Set target
                    this.target = new Target(
                        this.context, i*this.blockWidth, j*this.blockHeight,
                        this.blockWidth, this.blockHeight);
                }
                else if (this.grid[i][j] == GAME_ELEMENTS.PLATFORM) {
                    this.platforms.push(
                        new Platform(
                            this.context, i * this.blockWidth, j * this.blockHeight,
                            this.blockWidth,this.blockHeight));
                }
                else if (this.grid[i][j] == GAME_ELEMENTS.IMMORTALPLATFORM) {
                    this.platforms.push(
                        new ImmortalPlatform(
                            this.context, i * this.blockWidth, j * this.blockHeight,
                            this.blockWidth,this.blockHeight));
                }
                else if (this.grid[i][j] == GAME_ELEMENTS.MORTALPLATFORM) {
                    this.platforms.push(
                        new MortalPlatform(
                            this.context, i * this.blockWidth, j * this.blockHeight,
                            this.blockWidth,this.blockHeight));
                }
                
            }
        }
        this.setState(GAME_STATE.INITIALIZED)
    }
    run() {
        if (this.state == GAME_STATE.INITIALIZATION) {
            this.initialize();
        }
        this.collisions();
        this.character.move();
        this.control();
        this.draw();
        requestAnimationFrame(() => this.run());
    }
    setState(state) {
        this.state = state;
    }
    endGameCycle(goToNextLevel) {
        if (goToNextLevel) {zzfx(...SOUND_TARGET);}
        else {zzfx(...SOUND_HELL);}
        this.cancelControls(); // FIXME
        if (goToNextLevel == true) {
            this.level++;
        }
        this.setState(GAME_STATE.INITIALIZATION);
    }
    // FIXME MAKE CONTROLLER CLASS
}

function initializeCanvas() {
    let myCanvas = document.createElement("canvas");
    let windowInnerHeight = window.innerHeight;
    let windowInnerWidth = window.innerWidth;
    let smallerWindowInnerSize = Math.min(windowInnerHeight, windowInnerWidth); // FIT SQUARE
    myCanvas.height = smallerWindowInnerSize;
    myCanvas.width = smallerWindowInnerSize;
    document.body.appendChild(myCanvas);
    return myCanvas;
}

let gControls = new Object(); // FIXME NOT GLOBAL
let gClicked = false;

function keyUpHandler(e) {
    gClicked = true;
}
function clickHandler(e) {
    gClicked = true;
}
function dblClickHandler(e) {
    // gClicked = true;
}
function touchUpHandler(e) {
    gClicked = true;
}

function main() {
    console.log("Hello, Death!")
    // -- Canvas
    let myCanvas = initializeCanvas();
    let game = new Game(myCanvas);
    game.run();
    // -- Control
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("touchend", touchUpHandler, false);
    document.addEventListener("click", clickHandler, false);
    document.addEventListener("dblclick", dblClickHandler, false);
    // --
    console.log("Bye, Death!")
}

main();