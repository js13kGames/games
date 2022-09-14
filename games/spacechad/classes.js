let scale = 2;

class Renderer {
    paused = 0;
    camera = {x: 0, y: 0}
    w = 600;
    h = 400;
    flyingDialogs = [];
    justbooted = 1;
    winstate = 0;

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.height = this.h * scale;
        this.canvas.width = this.w * scale;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
    }
    renderTick() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.renderSky();

        if(!this.justbooted || this.winstate) this.renderEntities();

        this.renderUI();

        if(this.justbooted == true){
            this.pausemenu('Your spaceship blew up, you are stranded in space', 215, 17);
            return false;
        }

        if(this.winstate == true){
            renderer.pausemenu('You created a new home for your crew, what a chad!', 215, 17);
            return false;
        }

        this.moveCamera();
    }
    renderSky(){
        this.ctx.fillStyle = '#0b182e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if(!this.stars){
            this.stars = [];
            for(let i = 0; i < 300; i++){
                this.stars.push({
                    x: this.camera.x + rand(-this.w * 2, this.w * 2), //rand(-this.w, this.w)/10 ,
                    y: this.camera.y + rand(-this.h * 2, this.h * 2), //rand(-this.h, this.h)/10,
                    r: Math.random()});
            }
        }

        this.stars.map(star => {
            //console.log(player.distanceTo(player.position, star))
            if(player.distanceTo(player.position, star) > this.w * 2){
                star.x = player.position.x + rand(-this.w * 2, this.w * 2);
                star.y = player.position.y + rand(-this.h * 2, this.h * 2);
            }
        })

        this.stars.map(star => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(
                star.x + this.camera.x + this.canvas.width/2,
                star.y + this.camera.y + this.canvas.height/2,
                star.r * scale,
                star.r * scale
            );
        })
    }
    renderUI(){
        this.buttons();

        //this.dialogs.push({x: this.w/2, y:100, olw: 2, w: this.w / 2, h: this.h / 10});
        this.renderFlyingDialogs();
    }
    buttons(){

        //space key
        let x = 10; let y = this.h - 10;

        let img = new Image; img.src = 'img/button.png';

        this.ctx.drawImage(img, (x - 1)*scale, (y - 10)*scale, scale * img.width, scale * img.height);

        this.ctx.font = 10*scale+"px monospace";
        this.ctx.fillText('space', (x+8)*scale, y*scale);

        //other keys

        x = 10; y = this.h - 45;

        img = new Image; img.src = 'img/arrows.png';

        this.ctx.drawImage(img, (x - 1)*scale, (y - 10)*scale, scale * img.width, scale * img.height);

        //button texts;
        this.ctx.font = 7*scale+"px monospace";
        this.ctx.fillText('to interact', (x + 50)*scale, (this.h - 10)*scale);
        this.ctx.fillText('to move around', (x + 50)*scale, (this.h - 30)*scale);
    }
    dialog(text, x, y, w, h, olw = 1){

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(
            x * scale - olw,
            y * scale - olw,
            w * scale + 2*olw,
            h * scale + 2*olw
        )
        
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(
            x * scale,
            y * scale,
            w * scale,
            h * scale
        )

        this.ctx.fillStyle = 'white';
        this.ctx.font = scale*40+"px monospace white";
        this.ctx.fillText(
            text,
            (x + 7)*scale,
            (y+10)*scale);
        console.log(this.ctx.font)
    }
    pausemenu(text, w, h){
        this.dialog(text, this.w/2 - w/2, this.h/2 - h/2, w, h);
    }
    renderFlyingDialogs(){
        entities.map(e => {
            let d = e.dialog;
            if(d && player.distanceTo(player.position, {x: d.x, y: d.y}) < e.radius + 130){
                let w;
                let h;

                if(!d.w || !d.h){
                    w = d.text.length*scale*7/3;
                    h = 10;
                }else{
                    w = d.w
                    h = d.h;
                }


                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(
                    (renderer.camera.x + d.x - w/2) * scale - d.olw + renderer.canvas.width/2,
                    (renderer.camera.y + d.y - h/2) * scale - d.olw + renderer.canvas.height/2,
                    w * scale + 2*d.olw,
                    h * scale + 2*d.olw
                )
        
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(
                    (renderer.camera.x + d.x - w/2) * scale + renderer.canvas.width/2,
                    (renderer.camera.y + d.y - h/2) * scale + renderer.canvas.height/2,
                    w * scale,
                    h * scale
                )

                this.ctx.fillStyle = 'white';
                this.ctx.font = 7*scale+"px monospace white";
                this.ctx.fillText(
                    d.text,
                    (renderer.camera.x + d.x - w/2 + 1)*scale + renderer.canvas.width/2,
                    (renderer.camera.y + d.y + h/5)*scale + renderer.canvas.height/2);
            }
        })
    }
    reset(){
        this.ctx.font = "1px monospace green";
    }
    renderEntities(){
        entities.map(entity => {
            entity.render();
        })
    }
    moveEntities(){
        entities.filter(x => x.id != player.id).map(otherEntity => {
            if(player.collision(player.position, player.radius, otherEntity)){
                //console.log('player stuck');
                player.onStuck(otherEntity);
            }
        })

        entities.map(entity => {
            let collision = false;

            let newCoords = {x: entity.position.x + entity.vel.x, y: entity.position.y + entity.vel.y}

            let otherEntities = entities.filter(x => x.id != entity.id)

            otherEntities.map(otherEntity => {
                if(entity.collision(newCoords, entity.radius, otherEntity)){
                    collision = true;
                    entity.onCollision(otherEntity);
                }
                //console.log(entity.id, otherEntity.id, entity.collision(newCoords, entity.radius, otherEntity));
            })

            if(!collision) entity.position = newCoords;
        })
    }
    tick(){
        if(this.paused){
            player.vel = { x: 0, y: 0 };
            this.pausemenu('game is paused', 80, 20);
        }else{
            this.moveEntities();

            entities.map(entity => {
                entity.onTick()
                entity.dialogs();
            })

            this.renderTick();
        }
    }
    moveCamera(){
        //fixed camera
        //this.camera.x = -player.position.x;
        //this.camera.y = -player.position.y;

        //following camera
        this.camera.x -= (player.position.x + this.camera.x) / 100;
        this.camera.y -= (player.position.y + this.camera.y) / 100;
    }
}
class Entity{
    rotation = 0;
    imgScale = 1;
    position = { x: 0, y: 0 };
    vel = { x: 0, y: 0 };
    image = 'noimg';
    debugCollision = 0;
    id = Math.random();
    dialogDistance = 70;
    imageBuffer = new Map();

    constructor(position, r = 13, k = undefined){ // k is buffer for more info
        this.position = position;
        if(!this.radius) this.radius = r;
        this.k = k;
        this.init();
    }
    collision(pos, r, otherEntity){
        return this.distanceTo(pos, otherEntity.position) < r + otherEntity.radius
    }
    distanceTo(v, v2){
        return Math.sqrt(Math.pow((v.x - v2.x), 2) + Math.pow((v.y - v2.y), 2));
    }
    onTick(){

    }
    circle(){
        let pos = this.position;
        let r = this.radius;

        renderer.ctx.beginPath();
        renderer.ctx.arc((renderer.camera.x  + pos.x) * scale + renderer.canvas.width/2, (renderer.camera.y + pos.y) * scale + renderer.canvas.height/2, r * scale, 0, 2 * Math.PI);
        renderer.ctx.strokeStyle = 'red';
        renderer.ctx.stroke();
    }
    loadImage(){
        let pos = this.position;
        let vel = this.vel;

        let img;

        if(this.imageBuffer[this.image]){
            img = this.imageBuffer[this.image]
        }else{
            img = new Image;
            img.src = 'img/'+this.image+'.png';

            this.imageBuffer[this.image] = img;
        }

        let w = img.width;
        let h = img.height;

        renderer.ctx.save();
        renderer.ctx.translate((renderer.camera.x + pos.x) * scale + renderer.canvas.width/2, (renderer.camera.y + pos.y) * scale + renderer.canvas.height/2);

        if(vel.x != 0 || vel.y != 0){
            this.rotation = Math.atan2(vel.y, vel.x) + (90 * Math.PI / 180);
        }

        if(!this.dontRotate) renderer.ctx.rotate(this.rotation);

        let x = -w/2 * scale * this.imgScale;
        let y = -h/2 * scale * this.imgScale;

        renderer.ctx.drawImage(img, x, y, w * scale * this.imgScale, h * scale * this.imgScale);
        renderer.ctx.restore();
    }
    render(){
        this.loadImage();
        if(this.debugCollision) this.circle();
    }
    onInteract(){}
    dialogs(){ //deletes dialogs if they are outdated
        if(this.dialog && new Date() - this.dialog.start > this.dialog.duration){
            this.dialog = undefined;
        }
    }
    destroy(){
        entities = entities.filter(x => x.id != this.id)
    }
    onCollision(otherEntity){
        if(otherEntity.id != player.id){
            let multiplier = 0.3 / otherEntity.radius;
            otherEntity.vel.x += (otherEntity.position.x - this.position.x)*multiplier;
            otherEntity.vel.y += (otherEntity.position.y - this.position.y)*multiplier;
        }
    }
    init(){}
}
class Player extends Entity{
    type = 'player';
    playerSpeed = 2;
    image = '2'
    radius = 13;

    frame = 1;
    timetemp = new Date();
    changeEvery = 125;

    init(){
        this.movement();
    }
    movement(){
        document.addEventListener('keydown', e => {
            if(e.key == 'ArrowRight') {
                if(player.vel.x < this.playerSpeed) player.vel.x += this.playerSpeed;
            }else if(e.key == 'ArrowLeft') {
                if(player.vel.x > -this.playerSpeed) player.vel.x -= this.playerSpeed;
            }

            if(e.key == 'ArrowUp') {
                if(player.vel.y > -this.playerSpeed) player.vel.y -= this.playerSpeed;
            }else if(e.key == 'ArrowDown') {
                if(player.vel.y < this.playerSpeed) player.vel.y += this.playerSpeed;
            }

            if(e.key == ' '){
                if(renderer.justbooted) renderer.justbooted = false;

                let dist = 100000;
                let closest;
                entities.filter(x => this.distanceTo(this.position, x.position) < x.dialogDistance + x.radius).map(x => {
                    console.log('xx')
                    if(this.distanceTo(this.position, x.position) < dist){
                        closest = x;
                    }
                });
                closest.onInteract();
            }

            if(e.key == 'p'){
                renderer.paused = !renderer.paused;
            }
        }, false);
        document.addEventListener('keyup', e => {
            if(e.key == 'ArrowRight') {
                player.vel.x -= this.playerSpeed;
            }
            else if(e.key == 'ArrowLeft') {
                player.vel.x += this.playerSpeed;
            }

            if(e.key == 'ArrowUp') {
                player.vel.y += this.playerSpeed;
            }
            else if(e.key == 'ArrowDown') {
                player.vel.y -= this.playerSpeed;
            }
        }, false);
    }
    onCollision(otherEntity){
        if(otherEntity.type == 'water'){
            otherEntity.destroy();

            this.dialog = {text: "you can't push water around", start: new Date(), duration: 1000, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
        }

        let multiplier = 0.3 / otherEntity.radius;
        otherEntity.vel.x += (otherEntity.position.x - this.position.x)*multiplier;
        otherEntity.vel.y += (otherEntity.position.y - this.position.y)*multiplier;
    }
    onStuck(otherEntity){
        let multiplier = 0.5;
        otherEntity.position.x += (otherEntity.position.x - this.position.x)*multiplier;
        otherEntity.position.y += (otherEntity.position.y - this.position.y)*multiplier;
    }
    render(){
        if(this.debugCollision) this.circle();

        if(new Date() - this.timetemp > this.changeEvery){
            if(this.vel.x != 0 || this.vel.y != 0){
                if(this.frame == 1){
                    this.image = '2';
                    this.frame = 2;
                }else{
                    this.image = '1';
                    this.frame = 1;
                }
                this.timetemp = new Date();
            }
        }

        this.loadImage();
    }
}
class Rock extends Entity{
    type = 'rock';
    image = 'bigRock';
    watercontent = 0;

    onCollision(otherEntity){
        switch(otherEntity.type){
            case 'rock':
                if(this.type == 'rock'){
                    (this.radius > otherEntity.radius) ? this.combine(otherEntity) : otherEntity.combine(this)
                }else{
                    let multiplier = 0.3 / otherEntity.radius;
                    otherEntity.vel.x += (otherEntity.position.x - this.position.x)*multiplier;
                    otherEntity.vel.y += (otherEntity.position.y - this.position.y)*multiplier;
                }
                break;
            case 'water':
                otherEntity.destroy();

                if(this.type == 'rock'){
                    this.dialog = {text: "You havent planted anything, watering is useless", start: new Date(), duration: 2000, x: this.position.x, y: this.position.y - this.radius, olw: 1};
                }else if(this.type == 'plantedRock'){
                    this.watercontent++;

                    if(this.watercontent < 4){
                        this.dialog = {text: "Plants are watered, still more water needed", start: new Date(), duration: 2000, x: this.position.x, y: this.position.y - this.radius , olw: 1};
                        this.image = 'splash'+this.watercontent;
                    }else{
                        this.image = 'splash4'
                        setTimeout(function(){
                            renderer.winstate = 1;
                        }, 1000);
                    }
                }
                break;
            default:
                if(otherEntity.id == player.id) break;
                let multiplier = 0.3 / otherEntity.radius;
                otherEntity.vel.x += (otherEntity.position.x - this.position.x)*multiplier;
                otherEntity.vel.y += (otherEntity.position.y - this.position.y)*multiplier;
                break;
        }
    }
    onTick(){
        this.vel.x *= 0.97;
        this.vel.y *= 0.97;

        if(Math.random() > 0.995){
            this.vel.x += Math.random() / 2;
        }else if(Math.random() > 0.995){
            this.vel.y += Math.random() / 2;
        }
    }
    combine(otherEntity){
        otherEntity.destroy();

        this.radius += otherEntity.radius / 3;
        this.imgScale += otherEntity.imgScale / 3;
        this.dialogDistance = this.radius + 20;
    }
    init(){
        this.imgScale = this.radius * 0.045;
        this.dialogDistance = this.radius + 20;
    }
    onInteract(){
        switch(this.type){
            case 'rock':
                if(this.radius <= 20){
                    this.dialog = {text: 'too small to plant anything', start: new Date(), duration: 500, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
                }else if(this.radius < 50){
                    this.dialog = {text: 'Still small to plant anything', start: new Date(), duration: 500, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
                }else if(this.radius >= 50){
                    this.dialog = {text: "planted the seeds", start: new Date(), duration: 1000, x: this.position.x, y: this.position.y - this.radius, olw: 1};
                    
                    this.image = 'bigRockPlanted';
                    this.type = 'plantedRock';
                }
                break;
            case 'plantedRock':
                this.dialog = {text: "plants can't survive without water", start: new Date(), duration: 500, x: this.position.x, y: this.position.y - this.radius, olw: 1};
                break;
        }
    }
}
class Floater extends Entity{
    init(){
        this.imgScale = this.radius * 0.045;
        this.image = this.k.img;
        this.imgScale = this.k.imgScale;
    }
    onTick(){
        this.vel.x *= 0.97;
        this.vel.y *= 0.97;

        if(Math.random() > 0.995){
            this.vel.x += Math.random() / 3;
        }else if(Math.random() > 0.995){
            this.vel.y += Math.random() / 3;
        }
    }
    onInteract(){
        this.dialog = {text: 'just a piece of our broken spaceship', start: new Date(), duration: 1000, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
    }
}
class NPC extends Entity{
    imgScale = 1
    rotation = rand(0, 4);

    onTick(){
        this.vel.x *= 0.97;
        this.vel.y *= 0.97;

        if(Math.random() > 0.995){
            this.vel.x += Math.random() / 3;
        }else if(Math.random() > 0.995){
            this.vel.y += Math.random() / 3;
        }
    }
}
class Ali extends NPC{
    image = 'ali'

    onInteract(){
        let responses = [
            'leave me alone! please...',
            'we are going to die here...',
            'let me die in peace...',
            'we are doomed...',
            'piss off... will ya...',
            'I dont want to talk to you!',
            'go away, I never even liked you!',
            "spaceship's broken beyond repair",
            "I am not crying! something fell in my eye",
        ]
        this.dialog = {text: responses[parseInt(rand(0, responses.length - 1).toFixed(0))], start: new Date(), duration: 1500, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
    }
}
class Armen extends NPC{
    image = 'armen';
    inter = 0;

    onInteract(){
        let response;

        switch(this.inter){
            case 0:
                response = "I don't know what went wrong, the spaceship just went Boom";
                break;
            case 1:
                response = "only thing we have now is plant seeds";
                break;
            case 2:
                response = "you can plant them maybe, I don't know man";
                break;
            default:
                response = "good luck, I already gave up, we are pretty much dead";
                break;
        }

        if(!this.dialog){
            this.dialog = {text: response, start: new Date(), duration: 2500, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
            this.inter++;
        }
    }
}
class Water extends Entity{
    type = 'water';
    image = 'water';

    dontRotate = true;

    onCollision(otherEntity){

    }
    onTick(){
        this.vel.x *= 0.97;
        this.vel.y *= 0.97;

        if(Math.random() > 0.995){
            this.vel.x += Math.random() / 3;
        }else if(Math.random() > 0.995){
            this.vel.y += Math.random() / 3;
        }
    }
    init(){
        this.imgScale = this.radius * 0.115;
        this.dialogDistance = this.radius + 20;
    }
    onInteract(){
        this.dialog = {text: "don't push water around", start: new Date(), duration: 1000, x: this.position.x, y: this.position.y - this.radius * 2, olw: 1};
    }
}
function rand(min, max) {
    return Math.random() * (max - min) + min;
}