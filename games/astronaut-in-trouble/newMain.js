const S_W = document.body.clientWidth
const S_H = document.body.clientHeight
const RAT = S_W/S_H;

const R = (S_W<1000)?1.9:3;

const C_W = S_W / R;    //Canvas Width
const C_H = C_W / RAT;    //Canvas Height

const G = 20;       //Gravity
const M_G = 210;    //Max Gravity
const F = 1;        //Griction

const J_S = 440;

const R_V = 150;
const R_W = 300;
const R_H = 45;
const R_B = 35;

const PTID = 100;

const C = document.getElementById('screen').getContext('2d');
C.canvas.width = C_W;
C.canvas.height = C_H;

C.imageSmoothingEnabled= false

const F_M = '.75rem';
const F_B = '1.4rem';
const F_XB = '1.6rem';

class Vec2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class Sprite{
    constructor(img, w = img.width, h = img.height){
        this.size = new Vec2(w, h);
        this.pos = new Vec2;
        this.vel = new Vec2;
        this.img = img;
    }

    get left() {
        return this.pos.x;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get top() {
        return this.pos.y;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }
}
class SpritePlayer{
    constructor(spSh, w = spSh.width, h = spSh.height){
        this.size = new Vec2(w, h);
        this.pos = new Vec2;
        this.vel = new Vec2;
        this.index = 0;
        this.countAnimation = spSh.width / w;
        this.spSh = spSh
        this.renderAnimation();
    }

    renderAnimation(){
        const BUFFER = document.createElement('canvas');
        BUFFER.width = this.size.x;
        BUFFER.height = this.size.y;
        
        this.index = (this.index < this.countAnimation) ? this.index : 0;

        BUFFER.getContext('2d').drawImage(
            this.spSh,
            this.index*this.size.x, 0,
            this.size.x, this.size.y,
            0, 0,
            this.size.x, this.size.y
        );
        this.img = BUFFER;
        this.index++;
    }

    get left() {
        return this.pos.x;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get top() {
        return this.pos.y;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }
}

class Camera {
    constructor(x, y) {
        this.pos = new Vec2(x, y);
    }
}

function refreshPage() { document.location.reload(); }

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function drawRect(w, h, color){
    const BUFFER = document.createElement('canvas');
    BUFFER.width = w;
    BUFFER.height = h;
    BUFFER.getContext('2d').fillStyle = color;
    BUFFER.getContext('2d').fillRect(0, 0, w, h);
    return BUFFER;
}

function getFocused(){
    if ('hidden' in document) return document.hidden ? false : true;
    if ('mozHidden' in document) return document.mozHidden ? false : true;
    if ('webkitHidden' in document) return document.webkitHidden ? false : true;
    if ('msHidden' in document) return document.msHidden ? false : true;
}

function onVisibilityChange(callback) {
    var visible = true;

    if (!callback) {
        throw new Error('no callback given');
    }

    function focused() {
        if (!visible) {
            callback(visible = true);
        }
    }

    function unfocused() {
        if (visible) {
            callback(visible = false);
        }
    }

    // Standards:
    if ('hidden' in document) {
        document.addEventListener('visibilitychange',
            function () { (document.hidden ? unfocused : focused)() });
    }
    if ('mozHidden' in document) {
        document.addEventListener('mozvisibilitychange',
            function () { (document.mozHidden ? unfocused : focused)() });
    }
    if ('webkitHidden' in document) {
        document.addEventListener('webkitvisibilitychange',
            function () { (document.webkitHidden ? unfocused : focused)() });
    }
    if ('msHidden' in document) {
        document.addEventListener('msvisibilitychange',
            function () { (document.msHidden ? unfocused : focused)() });
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
        document.onfocusin = focused;
        document.onfocusout = unfocused;
    }
    // All others:
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
};

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
}

function createGame([spritePlayer, spriteR, fullIcon, spriteBg]){
    const STATE = {
        running: false,
        focused: getFocused(),
        currentScreen: 'StartScreen'
    }
    const CAMERA_OBJ = new Camera();
    const CONTROLS = (() => {
        document.addEventListener("touchstart", keyHandler);
        document.addEventListener("touchend", keyHandler);
        document.addEventListener("keydown", keyHandler);
        document.addEventListener("keyup", keyHandler);
        document.addEventListener("mousedown", keyHandler);

        const CONTROLS = {
            enter: false,
            jump: false,
            pos: new Vec2,
            // any : false,
        };

        function keyHandler(e){
            const state = e.type === "keydown" || e.type === "touchstart"

            if (e.type === "touchstart" || e.type === "touchend") {
                var e = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
                var touch = e.touches[0] || e.changedTouches[0];
                CONTROLS.pos.x = touch.pageX;
                CONTROLS.pos.y = touch.pageY;
                
                if(state && CONTROLS.pos.x < 40 && CONTROLS.pos.y < 40){
                    console.log('full')
                    toggleFullScreen();
                    e.preventDefault();
                    return;
                }else{
                    console.log('n')
                    if(STATE.currentScreen == 'StartScreen') startGame();
                    if(STATE.currentScreen == 'GameOver') refreshPage();
                }
                
                CONTROLS.jump = state;
                e.preventDefault();
            }

            if (e.keyCode == 32) {
                CONTROLS.jump = state;
                e.preventDefault();
            }

            if (e.keyCode == 13) {
                CONTROLS.enter = state;
                if(STATE.currentScreen == 'StartScreen') startGame();
                if(STATE.currentScreen == 'GameOver') refreshPage();
                e.preventDefault();
            }

            if (state) { CONTROLS.any = true } // must reset when used
        }

        return CONTROLS;
    })();

    onVisibilityChange(focused => {
        STATE.focused = focused;

        if(STATE.currentScreen == 'Playing'){
            if(focused){
                lastRequestId = requestAnimationFrame(update);
                playBgm();
            }
        }
    });

    const PLAYER = {
        // sprite: new Sprite(spritePlayer),
        sprite: new SpritePlayer(spritePlayer, 24, 23),
        is_on_floor: false,

        jump: function(){
            PLAYER.sprite.vel.y = -J_S;
            playJump()
        },
        
        checkcollisionWithRocket: function(rocket){
            if (PLAYER.sprite.left <= rocket.collision().x + rocket.collision().w &&
                PLAYER.sprite.right >= rocket.collision().x &&
                (PLAYER.sprite.top + PLAYER.sprite.size.y) - 4 < rocket.collision().y + 4 &&
                PLAYER.sprite.bottom > rocket.collision().y
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    function animate(){
        setTimeout(() => {
            PLAYER.sprite.renderAnimation();
            animate()
        }, 100);
    }
    animate();

    const ROCKET = {
        rocketsList: [],

        createNew: function() {
            const ROCKET_NEW = new Sprite(spriteR, R_W, R_H);
            ROCKET_NEW.vel = new Vec2(-R_V, 0);

            const NEW_POS = ROCKET.setNewPosition();
            ROCKET_NEW.pos = new Vec2(NEW_POS.x - 20, NEW_POS.y);
            ROCKET_NEW.collision = function(){
                return {
                    x: this.pos.x + 25,
                    y: this.pos.y,
                    w: this.size.x - 50,
                    h: this.size.y,
                };
            }

            return ROCKET_NEW;
        },

        setNewPosition: function() {
            let codePosY = getRandomInt(-1, 2);

            return new Vec2(
                ROCKET.setNewPositionX(codePosY),
                ROCKET.setNewPositionY(codePosY),
            );
        },

        setNewPositionX: function(codePosY) {
            let newPositionX = 100;

            if (ROCKET.rocketsList.length !== 0) {
                switch (codePosY) {
                    case -1:
                        newPositionX = ROCKET.rocketsList[ROCKET.rocketsList.length - 1].pos.x + R_W + R_B + 15;
                        break;

                    case 0:
                        newPositionX = ROCKET.rocketsList[ROCKET.rocketsList.length - 1].pos.x + R_W + R_B + 50;
                        break;

                    case 1:
                        newPositionX = ROCKET.rocketsList[ROCKET.rocketsList.length - 1].pos.x + R_W + R_B + 20;
                        break;
                }
            }

            return newPositionX;
        },

        setNewPositionY: function(codePosY) {
            let newPositionY = 150;

            if (ROCKET.rocketsList.length === 0) {
                return newPositionY;
            }

            newPositionY = ROCKET.rocketsList[ROCKET.rocketsList.length - 1].pos.y;
            switch (codePosY) {
                case -1:
                    return newPositionY -= 55;
                case 0:
                    return newPositionY;
                case 1:
                    return newPositionY += R_H + 40;
            }
        },

        increase: function() {
            ROCKET.rocketsList.push(ROCKET.createNew());
        }
    }

    function drawBackground(){
        C.fillStyle = 'rgb(12, 13, 32)';
        C.fillRect(0, 0, C.canvas.width, C.canvas.height);
    
        for (let x = 0; (x*spriteBg.width) <= C_W; x++) {
            for (let y = 0; (y*spriteBg.height) < C_W; y++) {
                C.drawImage(spriteBg, x*spriteBg.width, y*spriteBg.height);
            }
        }
    }

    function drawBtnFull(){
        C.drawImage(fullIcon, 5, 5, 8, 8);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function playGameOver() {
        STATE.currentScreen = 'GameOver';

        const CURR_SCORE = SCORE.point;
        let MAX_SCORE = getCookie('MAX_SCORE');
        if(MAX_SCORE == null) MAX_SCORE = 0;

        if(CURR_SCORE > MAX_SCORE){
            writeOnScreen(
                'Congratulation!',
                F_B,
                {x: C_W/2, y: C.canvas.height/2-30},
                'center',
                'green');
            writeOnScreen(
                `You beat the previous High Score: ${MAX_SCORE}`,
                F_M,
                {x: C.canvas.width/2, y: C.canvas.height/2+42},
                'center');

            document.cookie = `MAX_SCORE=${CURR_SCORE}; Secure`;
        }else{
            writeOnScreen(
                'Game Over',
                F_B,
                {x: C.canvas.width/2, y: C.canvas.height/2-30},
                'center',
                'red');

            writeOnScreen(
                `Higher Score: ${MAX_SCORE}`,
                F_M,
                {x: C.canvas.width/2, y: C.canvas.height/2+42},
                'center',
                'green');
        }

        writeOnScreen(
            'Press ENTER or TOUCH THE SCREEN to play again',
            F_M,
            {x: C.canvas.width/2, y: C.canvas.height/2+20},
            'center');

        with (new AudioContext)
        with (GA = createGain())
        for (i in D = [19, 21, 24])
            with (createOscillator())
            if (D[i])
                connect(GA),
                    GA.connect(destination),
                    start(i * .1),
                    frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * .1), type = 'triangle',
                    gain.setValueAtTime(1, i * .1),
                    gain.setTargetAtTime(.0001, i * .1 + .08, .005),
                    stop(i * .1 + .09)
    }
    
    function playBgm() {
        aCtx = new AudioContext
        GA = aCtx.createGain()
        GA.gain.value = 0.1 // 10 %
        GA.connect(aCtx.destination)
        
        const notes = [14, 14, 15, 15, 17, 17, 19, 19, 19, 20, 21, 21, 21, 21, 21, 21, 21, 21, 23];
        with (aCtx) notes.map((v, i) => { with (createOscillator()) v && start(e = [9, 25, 8, 24, 6, 22, 4, 16, 20, 12, 1, 2, 3, 13, 17, 18, 28, 29, 15][i] / 5, connect(GA), frequency.value = 988 / 1.06 ** v, type = 'triangle',) + stop(e + .2) })

        let delay = notes.length * 332;

        setTimeout(() => {
            if (STATE.currentScreen === 'GameOver' || !STATE.running || !STATE.focused) return;
            playBgm()
        }, delay);
    }

    function playJump(){
        this.sound = document.createElement("audio");
        this.sound.src = 'jump_comp.wav';
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.sound.play();
    }

    function drawSprite(sprite, w = sprite.size.x, h = sprite.size.y){
        let camX = CAMERA_OBJ.pos.x;
        let camY = CAMERA_OBJ.pos.y;

        C.drawImage(
            sprite.img,
            sprite.pos.x + camX,
            sprite.pos.y + camY,
            w, h);

        if(sprite.collision){
            C.beginPath();
            C.strokeStyle = 'red';
            C.lineWidth  = 1;
            C.rect(sprite.collision().x + camX, sprite.collision().y + camY, sprite.collision().w, sprite.collision().h);
            // C.stroke();
        }
    }

    function writeOnScreen(text, size = F_B, pos = new Vec2(), textAligh = "left", color = '#fff'){ 
        C.font = size + " Arial";
        C.fillStyle = color;
        C.textAlign = textAligh;
        C.fillText(text, pos.x, pos.y);
    }

    const SCORE = {
        point:0,
        start: function(){
            SCORE.increase();
        },

        increase: function(){
            setTimeout(() => {
                this.point += 1;
                const M = Math.floor(this.point / PTID);

                if(this.point > 50) dif = 0.5 * M;
                SCORE.increase();
            }, 100);
        }
    }

    function drawScore(){
        writeOnScreen(
            SCORE.point.toString(),
            F_M,
            new Vec2(20, 20),
            'left'
        );
    }

    let lastTime = null;
    let deltaTime = 0;
    let lastRequestId = null;
    dif = 0
    
    function update(time){
        if(!STATE.focused || !STATE.running) return;

        if(!lastTime) lastTime = time;

        deltaTime = (time - lastTime) / 1000;

        drawBackground();
        drawScore();

        if (CONTROLS.jump && PLAYER.is_on_floor) PLAYER.jump();

        PLAYER.sprite.vel.y += G;
        if (PLAYER.sprite.vel.y > M_G) PLAYER.sprite.vel.y = M_G;
        PLAYER.sprite.pos.y += PLAYER.sprite.vel.y * deltaTime;

        ROCKET.rocketsList.map((rocket_i, i) => {
            rocket_i.pos.x += Math.round(rocket_i.vel.x * deltaTime) - dif;
            // rocket_i.pos.y += Math.round(rocket_i.vel.y * deltaTime);

            if (rocket_i.pos.x < - R_W - CAMERA_OBJ.pos.x) {
                ROCKET.increase();
                ROCKET.rocketsList.shift();
            }

            if (PLAYER.checkcollisionWithRocket(rocket_i)) {
                PLAYER.sprite.vel.y = 0;
                PLAYER.sprite.pos.y = (rocket_i.pos.y - PLAYER.sprite.size.y) + 2;
                PLAYER.is_on_floor = true;
            }

            drawSprite(rocket_i);
        });

        if (PLAYER.sprite.vel.y != 0) {
            PLAYER.is_on_floor = false;

            if (PLAYER.sprite.bottom > ROCKET.rocketsList[1].pos.y + 500) {
                playGameOver();
                STATE.running = false;
            }
        }

        CAMERA_OBJ.pos.y = (C.canvas.height / 2) - PLAYER.sprite.size.y - PLAYER.sprite.pos.y - 15;
        drawSprite(PLAYER.sprite);

        drawBtnFull();

        lastTime = time;

        if(STATE.focused) lastRequestId = requestAnimationFrame(update);
        else console.log('stoped');
    }

    function startGame(){
        playBgm();
        STATE.currentScreen = 'Playing';
        STATE.running = true;
        
        CAMERA_OBJ.pos.x = (C.canvas.width / 2) - PLAYER.sprite .size.x - 90;
        
        SCORE.start();

        ROCKET.increase();
        ROCKET.increase();
        ROCKET.increase();

        // console.log(ROCKET);

        lastRequestId = requestAnimationFrame(update);
    }

    function startScreen(){
        drawBackground();
        writeOnScreen(
            '🧑‍🚀',
            F_XB,
            {x: C.canvas.width/2, y: C.canvas.height/2-20},
            'center');
        writeOnScreen(
            'Astronaut in Trouble',
            F_XB,
            {x: C.canvas.width/2, y: C.canvas.height/2+10},
            'center');
        writeOnScreen(
            'Press Enter to Start',
            F_M,
            {x: C.canvas.width/2, y: C.canvas.height/2+25},
            'center');
    }
    startScreen()

    return {startGame, startScreen}
}

Promise.all([
    loadImage('./a2.webp'),
    loadImage('./r6.png'),
    loadImage('./full_comp.svg'),
    loadImage('./bg.webp'),
])
.then(([a, r, i, s]) => {
    const game = createGame([a, r, i, s]);
})