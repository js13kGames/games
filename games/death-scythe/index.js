Array.prototype.last = function(){
    return (this.length>0)?this[this.length-1]:null;
}
Math.distance = function(p1, p2){
    return Math.abs(Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2)));
}
Math.rad2deg = function(rad){
    return rad * 180 / Math.PI;
}
Math.deg2rad = function(deg){
    return deg / 180 * Math.PI;
}
Math.angle = function(p1,p2){
    let w = p2.x - p1.x;
    let h = p2.y - p1.y;
    return Math.atan2(-h,w) - Math.PI/2;
}
Math.getPoint = function(pt, deg, len){
    return {x:pt.x + (len*Math.cos(deg)), y:pt.y + (len*Math.sin(deg))};
}

const AnimationDefs = {
    "character": {
        "forward": [{ frame: 0, duration: 0.08 }, { frame: 1, duration: 0.08 }, { frame: 2, duration: 0.08 }],
        "backward": [{ frame: 3, duration: 0.05 }, { frame: 4, duration: 0.05 }, { frame: 5, duration: 0.05 }]
    }
};

class Game{
    constructor(gameCanvas){
        this.canvas = gameCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.scenes = [];
        this.now = 0;
        this.last = 0;
        this.timeDelta = 0;
        this.click = false;
        document.addEventListener("click", this.clickCheck.bind(this), false);
    }

    clickCheck(){
        this.click = true;
    }

    update(){
        this.last = this.now;
        this.now = performance.now();
        this.timeDelta = (this.now-this.last)/1000;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.scenes.length > 0) {
            this.scenes.last().update(this.timeDelta, this.click);
            this.scenes.last().render(this.ctx);
        }
        this.click = false;
        requestAnimationFrame(this.update.bind(this));
    }

    push(scene){
        if( this.scenes.length>0 ) {
            this.scenes.last().pause();
        }
        scene.init();
        this.scenes.push(scene);
    }
}

class Scene {
    constructor(){
        this.children = [];
        this.elapsed = 0;
    }

    init(){
    }

    update(timeDelta){
        this.elapsed += timeDelta;
        this.children.forEach((child)=>{ child.update(timeDelta); });
    }

    render(ctx){
        this.children.forEach((child)=>{ child.render(ctx); });
    }

    pause(){
    }
}


class GameScene extends Scene {
    constructor(){
        super();
        this.cameraX = 100;

        this.character = new Character();
        this.background = new Background();
        this.itemManager = new ItemManager();
        this.scoreManager = new ScoreManager();
        this.soundManager = new SoundManager();
        this.ui = new UIController(this.scoreManager, this.character);

        this.children.push(this.background);
        this.children.push(this.itemManager);
        this.children.push(this.character);
        this.children.push(this.ui);

        this.children.forEach((ch)=>{ ch.parent = this; });
        this.character.sound = this.soundManager.play.bind(this.soundManager);

        this.state = 0;

    }

    init(){
        this.background.init();
        this.character.init();
        this.itemManager.init();
        this.cameraX = 100;
        this.scoreManager.reset();
        this.state = 0;
        this.character.setPivot({x: 300, y: 0});
        this.soundManager.init();
    }

    update(timeDelta, click){
        if( this.state === 0 ) {
            this.elapsed += timeDelta;
            this.children.forEach((ch) => {
                ch.update(timeDelta, this.character);
            });

            this.scoreManager.score = Math.max(0, ((this.cameraX - 100) / 10) | 0);

            this.cameraX = this.character.x;

            if (this.elapsed < 1 && this.character.pivot === null) {
                this.character.setPivot({x: 300, y: 0});
            }
            this.itemManager.checkCollision(this.character);
            if (click) {
                let tx = Math.cos(Math.PI / 4) * this.character.y + this.character.x;
                this.character.setPivot({x: tx, y: 0});
            }

            if (this.character.y > 540) {
                this.scoreManager.save();
                this.character.sound("gameover");
                this.state = 1;

            }
        } else {
            if (click) {
                this.init();
            }
        }


    }

    render(ctx){
        ctx.save();
        ctx.translate(-this.cameraX + 200, 0);
        super.render(ctx);
        ctx.restore();

    }
}
class GameObject{
    init(){  }
    update(timeDelta) { }
    render(ctx){ }
}
class Character extends GameObject {
    constructor(){
        super();
        this.img = new Image();
        this.img.src = "./image/character-Sheet.png";
        this.spriteSheet = new SpriteSheet(this.img);
        this.animations = {};

        for (let i in AnimationDefs.character) {
            if (!AnimationDefs.character.hasOwnProperty(i)) continue;
            this.animations[i] = new Animation(this.spriteSheet, AnimationDefs.character[i]);
        }
        this.soul = 100;
    }

    init(){
        this.x = 50;
        this.y = 50;
        this.gravity = 5;
        this.pivot = null;
        this.position = null;
        this.force = {x:0,y:0};
        this.pLen = 0;
        this.angle = 0;
        this.accel = 0;
        this.radius = 20;
        this.currentAnimation = "forward";
        this.soul = 100;
    }
    gotItem(item) {
        switch (item) {
            case "soul":
                if(this.soul  < 101){
                    this.soul += 2;
                }
                this.sound("soul");
                break;
        }
    }
    setPivot(point){
        if( this.pivot === null && this.soul > 0){
            this.pivot = point;
            this.pLen = Math.distance({ x: this.x, y: this.y }, point);
            this.position = {x:this.x - this.pivot.x, y:this.y - this.pivot.y};
            this.angle = Math.angle({x:this.x, y:this.y}, this.pivot);
            this.accel = -1.3 * (this.force.x+this.force.y) / this.pLen * Math.sin(this.angle);

            this.soul -= 10;
            if(this.soul < 0) {
                this.soul = 0;
            }
            this.update(0);
        } else if(this.pivot !== null){
            this.pivot = null;
            this.pLen = 0;
            this.position = null;
            this.angle = 0;
            this.accel = 0;
            this.update(0);
            this.force.x *= 2;
            this.force.y -= 1.5;
            this.sound("jump");
        }
    }

    update(timeDelta){
        if(!this.pivot){
            this.force.y += this.gravity * timeDelta;
            this.force.x *= 0.99;
            this.x += this.force.x;
            this.y += this.force.y;
        }else {
            let ang = this.angle;
            let ang_vel = -1 * this.gravity / this.pLen * Math.sin(ang);
            this.accel += ang_vel * timeDelta;

            this.accel *= 0.999;

            if (Math.abs(Math.rad2deg(ang + this.accel)) >= 90) {
                this.setPivot(null);
            } else {
                ang += this.accel;
                this.angle = ang;
                this.force.x = this.pLen * this.accel * Math.cos(ang);
                this.force.y = -this.pLen * this.accel * Math.sin(ang);

                if (this.position.y + this.y + this.force.y < 0) this.force.y *= -1;

                this.position.x += this.force.x;
                this.position.y += this.force.y;
                this.x = this.position.x + this.pivot.x;
                this.y = this.position.y + this.pivot.y;
            }

            if (this.force.x < 0) {
                this.currentAnimation = "backward";
            } else {
                this.currentAnimation = "forward";
            }
        }
        this.magnet = Math.max(0, this.magnet - timeDelta);
        this.animations[this.currentAnimation].update(timeDelta);
    }

    render(ctx){
        ctx.save();
        if (this.pivot !== null) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(this.pivot.x, this.pivot.y);
            ctx.lineTo(this.pivot.x + this.position.x, this.pivot.y + this.position.y);
            ctx.stroke();
        }
        this.animations[this.currentAnimation].draw(ctx, this.x, this.y, 0.5);
        ctx.restore();

    }
}

class Background extends GameObject{
    constructor(){
        super();
        let imageUrls = ["./image/back.png"];
        this.images = [];
        this.images = imageUrls.map((v)=>{ let img = new Image(); img.src = v; return img; });
    }

    update(timeDelta) {


    }

    render(ctx){
        let x = this.parent.cameraX - 400;

        ctx.save();
        if(this.parent.state === 0) {
            ctx.font = "bold 100px verdana";
            ctx.fillText("Death Scythe", 100, 200);
        }
        ctx.translate(x, 0);
        let backgroundX = -(x/2) % 1800;
        ctx.drawImage(this.images[0], backgroundX, 0,1800,600);
        ctx.drawImage(this.images[0], backgroundX + 1800, 0,1800,600);

        ctx.restore();

    }
}

class UIController extends GameObject {
    constructor(scoremanager, character){
        super();
        this.scoreManager = scoremanager;
        this.character = character;
    }

    render(ctx){
        ctx.save();
        ctx.translate(this.parent.cameraX-200, 0);

        if (this.parent.state === 0) {
            ctx.fillStyle = "white";
            ctx.font = "bold 35px verdana";
            ctx.fillText(this.scoreManager.score + "m", 650, 50);

            ctx.font = "20px verdana";
            ctx.fillText("BESTSCORE " + this.scoreManager.highscore + "m", 650, 80);

            ctx.fillStyle = "white";
            ctx.fillRect(30, 30, 600, 30);
            ctx.fillStyle = "black";
            let soul = this.character.soul/100 * 600;
            ctx.fillRect(30, 30, soul, 30);
            ctx.fillStyle = "gray";
            ctx.fillText("SOUL", 40, 52);

        } else {
            ctx.fillStyle = "black";
            ctx.font = "bold 130px verdana";
            ctx.fillText("GAME OVER", 15, 200);

            ctx.font = "bold 50px verdana";
            ctx.fillText("SCORE : " + this.scoreManager.score + "m", 150, 300);
            ctx.font = "bold 50px verdana";
            ctx.fillText("BESTSCORE : " + this.scoreManager.highscore + "m", 150, 350);
        }
        ctx.restore();
    }
}

class ScoreManager {
    constructor() {
        this.highscore = localStorage.getItem("deathscythescore") || 0;
        this._score = 0;
    }

    reset() {
        this._score = 0;
    }

    save() {
        if (this.highscore > 0) {
            localStorage.setItem("deathscythescore", this.highscore);
        }
    }

    set score(v) {
        this._score = v;
        if (this._score > this.highscore) this.highscore = this._score;
    }

    get score() {
        return this._score;
    }
}
class Sprite {
    constructor(image, sx, sy, sw, sh, ox, oy) {
        this.img = image;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.ox = ox || 0;
        this.oy = oy || 0;
    }
    draw(ctx, x, y, size) {
        ctx.save();
        let scale = size || 1;
        ctx.translate(x, y);
        ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh,
            -this.ox * scale, -this.oy * scale, this.sw * scale, this.sh * scale);
        ctx.restore();
    }
}
class SpriteSheet {
    constructor(image) {
        this.img = image;
        this.sprites = [];

        let spr = new Sprite(this.img, 0, 0, 128, 128, 32, 32);
        this.sprites.push(spr);
        spr = new Sprite(this.img, 128, 0, 128, 128, 32, 32);
        this.sprites.push(spr);
        spr = new Sprite(this.img, 256, 0, 128, 128, 32, 32);
        this.sprites.push(spr);
        spr = new Sprite(this.img, 384, 0, 128, 128,  32, 32);
        this.sprites.push(spr);
        spr = new Sprite(this.img, 512, 0, 128, 128,  32, 32);
        this.sprites.push(spr);
        spr = new Sprite(this.img, 640, 0, 128, 128,  32, 32);
        this.sprites.push(spr);
        spr = new Sprite(this.img, 768, 0, 128, 128,  32, 32);
        this.sprites.push(spr);
    }
    get(idx) {
        return this.sprites[idx];
    }
}

class Animation {
    constructor(_sheet, defs, opt) {
        this.elapsed = 0;
        this.curFrame = 0;
        this.sprites = _sheet;
        this.frames = defs;
        this.done = false;
        this.duration = defs.reduce((p, v) => { return p + v.duration; }, 0);
        this.loop = (opt && opt.hasOwnProperty('loop')) ? opt.loop : true;
    }

    update(timeDelta) {
        if (this.done) return;
        this.elapsed += timeDelta;
        if (!this.loop && this.elapsed > this.duration) {
            this.done = true;
            this.curFrame = this.frames.length - 1;
        } else {
            let idx = 0, sum = 0;
            while (true) {
                sum += this.frames[idx].duration;
                if (sum >= this.elapsed) break;
                idx += 1;
                idx %= this.frames.length;
            }
            this.curFrame = idx;
        }
    }
    draw(ctx, x, y, size){
        this.sprites.get(this.frames[this.curFrame].frame).draw(ctx, x, y, size);
    }
}


class ItemManager extends GameObject {
    constructor() {
        super();
        this.items = [];
        this.minX = 0;
        this.img = new Image();
        let imageUrls = ["./image/soul.png"];
        this.images = [];
        this.images = imageUrls.map((v)=>{ let img = new Image(); img.src = v; return img; });

        this.lastItemX = 900;
        this.soulY = 260;
    }

    init() {
        super.init();
        this.items = [];
        this.minX = 0;
        this.lastItemX = 900;
        this.soulY = 260;
    }

    checkCollision(char) {
        // 캐릭터와 충돌을 판정

        this.items.forEach((i) => {
            i.isHit(char);
        });
    }

    update(timeDelta, char) {
        this.minX = this.parent.cameraX - 200;
        this.items.forEach((i) => {
            i.update(timeDelta);
            if (i.x < this.minX - 50) i.destroy = true;
        });
        this.items = this.items.filter((i) => { return !i.destroy; });
        if (this.lastItemX - this.minX <= 540 + 380) {
            this.lastItemX += 80;
            this.soulY += Math.floor(Math.random() * 40) - 20;
            // 화면 밖으로 벗어나지 않게
            if (this.soulY < 20) this.soulY = 20;
            if (this.soulY > 520) this.soulY = 520;
            this.createItem("soul", this.lastItemX, this.soulY);

        }
    }

    render(ctx) {
        let maxX = this.minX + 1000;
        this.items.forEach((i) => {
            i.render(ctx, maxX);
        });
    }

    createItem(type, x, y) {
        let item = null;
        switch (type) {
            case "soul":
                item = new Soul(x, y, this.images[0]);
                break;
        }
        if (item) this.items.push(item);
    }
}
class Item extends GameObject {
    constructor(x, y, img) {
        super();
        this.x = x;
        this.originY = y;
        this.ty = 0;
        this.radius = 20;
        this.elapsed = 0;
        this.destroy = false;
        this.itemImg = img;
    }

    get y() {
        return this.originY + this.ty;
    }


    update(timeDelta) {
    }

    isHit(char) {
        if (Math.distance(char, this) <= (char.radius + this.radius)) {
            char.gotItem(this.action());
        }
    }

    render(ctx, maxX) {
        if (this.x > maxX + this.radius * 2) {
            ctx.save();
            ctx.fillStyle = "red";
            ctx.fillRect(maxX - 40, this.y - 20, 30, 40);
            ctx.fillRect(maxX - 45, this.y - 15, 40, 30);
            ctx.fillRect(maxX - 5, this.y - 2, 5, 5);
            ctx.drawImage(this.itemImg, maxX - 25, this.y);
            ctx.restore();
        } else {
            ctx.drawImage(this.itemImg, this.x, this.y);
        }
    }

    action() {
        this.destroy = true;
    }
}

class Soul extends Item {
    action() {
        super.action();
        return "soul";
    }
}

class SoundManager {
    constructor(){
        this.sounds = {};
        this.soundFiles = ['jump',  'soul', 'gameover'];
        this.soundFiles.forEach((v)=>{
            this.sounds[v] = document.createElement("audio");
            this.sounds[v].src = "./sound/" + v + ".mp3";
            this.sounds[v].id = v;
            this.sounds[v].muted = true;
        });
    }

    init(){
        this.soundFiles.forEach((v)=>{
            this.sounds[v].muted = false;
        });
    }

    stop(name){
        this.sounds[name].pause();
        this.sounds[name].currentTime = 0;
    }

    play(name){
        if( this.sounds[name]){
            this.stop(name);
            this.sounds[name].play();
        }
    }
}

const game = new Game(document.getElementById('canvas'));
game.push(new GameScene());
game.update();
