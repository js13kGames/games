const canvas = document.querySelector('#space');
const ctx = canvas.getContext('2d');
class Vec2d {
    constructor({x,y}) {
        this.x = x;
        this.y = y;
        this.dist = null;
    }
    diff(other) {
        return new Vec2d(this)._sub(other);
    }
    sum(other) {
        return new Vec2d(this)._add(other);
    }
    _sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    _add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    calcDist() {
        this.dist = Math.sqrt(this.x*this.x + this.y*this.y);
        return this.dist;
    }
    getMultiplied(factor) {
        return new Vec2d({
            x: this.x * factor,
            y: this.y * factor,
            dist: this.dist ? this.dist * factor : null
        });
    }
    getNormalized() {
        if(!this.dist) {
            this.calcDist();
        }
        return this.getMultiplied(1 / this.dist);
    }
}
class Game {
    constructor() {
        this.sprites= [];
        this.spriteHash = {};
        this.hudSprites = [];
        this.lastUpdate = Date.now();
        this.keyboard = {};
        this.camera = null;
        this.happyCustomers = 0;
        this.unhappyCustomers = 0;
        this.player = null;
        this.titleScreen = null;
    }
    init() {
        let self = this;
        this.setup();
        this.spawnPlayer();
        document.addEventListener('keydown', (e) => self.onKeyDown(e));
        document.addEventListener('keyup', (e) => self.onKeyUp(e));
        this.requestFrame();
    }

    setup() {         
        for(let i = 0; i < 500; i++) {
            this.addSprite(new Junk({
                x:Math.floor(Math.random()*canvas.width * 10 - canvas.width * 5),
                y:Math.floor(Math.random()*canvas.height * 10 - canvas.height * 5),
                w:Math.floor(Math.random()*5)+2,
                h:Math.floor(Math.random()*5)+2,
                dPos:new Vec2d({x:0,y:0})
            }), "junk");
        }

        let planet1 = this.addSprite(new Planet({x:800,y:300,r:120, color:'#00aa66'}), "planet");
        let planet2 = this.addSprite(new Planet({x:-50,y:600,r:80, color:'#00aa00'}), "planet");
        let planet2moon1 = this.addSprite(new Moon({x:-100000,y:-100000,r:40, color:'#999999', orbits:planet2}), "planet");
        let planet3 = this.addSprite(new Planet({x:0,y:-400,r:140, color:'#55aa00'}), "planet");
        let planet4 = this.addSprite(new Planet({x:1600,y:-800,r:200, color:'#00aa99'}), "planet");
        let planet5 = this.addSprite(new Planet({x:2500,y:1400,r:300, color:'#00aa99'}), "planet");
        let planet6 = this.addSprite(new Planet({x:-2500,y:1200,r:350, color:'#00aa99'}), "planet");
        let planet6moon1 = this.addSprite(new Moon({x:-100000,y:-100000,r:100, color:'#999999', orbits:planet6, orbitRadius:2.5,angularSpeed:0.1}), "planet");
        let planet6moon2 = this.addSprite(new Moon({x:-100000,y:-100000,r:100, color:'#999999', orbits:planet6, orbitRadius:4,angularSpeed:-0.05}), "planet");
        let planet6moon2_1 = this.addSprite(new Moon({x:-100000,y:-100000,r:50, color:'#999999', orbits:planet6moon2, orbitRadius:3,angularSpeed:-0.5}), "planet");
        let planet7 = this.addSprite(new Planet({x:-1400,y:-600,r:150, color:'#00aa00'}), "planet");
        let planet8 = this.addSprite(new Planet({x:-2700,y:-800,r:150, color:'#00aa00'}), "planet");
        let planet8moon1 = this.addSprite(new Moon({x:-100000,y:-100000,r:40, color:'#999999', orbits:planet8,orbitRadius:3}), "planet");
        let planet9 = this.addSprite(new Planet({x:-400,y:1600,r:80, color:'#00aa00'}), "planet");
        let planet10 = this.addSprite(new Planet({x:700,y:1600,r:150, color:'#00aa00'}), "planet");

        this.addHudSprite(new Text({
            x:10,
            y:10,
            text:'Happy Customers:',
            align:'start',
            updateText: (self) => { 
                self.text = "Happy Customers: " + self.game.happyCustomers;
            }
        }));
        this.addHudSprite(new Text({
            x:10,
            y:30,
            text:'Angry Customers:',
            align:'start',
            updateText: (self) => { 
                self.text = "Angry Customers: " + self.game.unhappyCustomers;
            }
        }));
        
        this.spawnCustomer();
        this.spawnCustomer();
    }

    spawnPlayer() {
        this.player = this.addSpriteToLayer(new Player({x:220,y:180}), 1, "player");
        this.camera = new Camera({follow: this.player});
        this.titleScreen = this.addHudSprite(new TitleScreen());
    }

    shuffleArray(array){
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    spawnCustomer() {
        let player = this.player ?  this.player : {landedPlanet: null};
        let candidates = this.spriteHash["planet"].filter(planet => planet != player.landedPlanet && !(planet instanceof Moon));
        this.shuffleArray(candidates);
        console.log(candidates);
        this.addSpriteToLayer(new Customer({planetFrom: candidates[0], planetTo: candidates[1]}), 2, "customer");
    }

    onKeyDown(e) {
        this.keyboard[e.code] = true;
    }
    onKeyUp(e) {
        this.keyboard[e.code] = false;
    }
    keyPressed(code) {
        return this.keyboard[code];
    }
    updateAndRender() {
        let now = Date.now();
        let delta = (now - this.lastUpdate)/1000;
        this.lastUpdate = now;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.cleanupSprites();
        this.updateSprites(delta);
        this.updateHudSprites(delta);
        if(this.camera) {
            this.camera.update(delta);
        }
        if(this.camera) {
            this.camera.transformToCamera();
        }
        this.renderSprites();
        if(this.camera) {
            this.camera.resetTransformation();
        }
        this.renderHudSprites();
        this.requestFrame();
    }
    requestFrame() {
        requestAnimationFrame(() => {this.updateAndRender()});
    }
    addSprite(sprite, hashKey) {
        return this.addSpriteToLayer(sprite, 0, hashKey);
    }
    addSpriteToLayer(sprite, layer, hashKey) {
        sprite.game = this;
        if(!this.sprites[layer]) {
            this.sprites[layer] = [];
        }
        this.sprites[layer].push(sprite);
        if(hashKey) {
            if(!this.spriteHash[hashKey]) {
                this.spriteHash[hashKey] = [];
            }
            this.spriteHash[hashKey].push(sprite);
        }
        return sprite;
    }
    addHudSprite(sprite) {
        sprite.game = this;
        this.hudSprites.push(sprite);
        return sprite;
    }
    cleanupSprites() {
        this.sprites.forEach((layer,idx) => {
            this.sprites[idx] = layer.filter(sprite => sprite.ttl > 0);
        });
        for(let key in this.spriteHash) {
            this.spriteHash[key] = this.spriteHash[key].filter(sprite => sprite.ttl > 0);
        }
        this.hudSprites = this.hudSprites.filter(sprite => sprite.ttl > 0);
    }
    updateSprites(delta) {
        this.sprites.forEach(layer => {
            layer.forEach(sprite => sprite.update(delta));
        });
    }
    updateHudSprites(delta) {
        this.hudSprites.forEach(sprite => sprite.update(delta));
    }
    renderSprites() {
        this.sprites.forEach(layer => {
            layer.forEach(sprite => sprite.render());
        });
    }
    renderHudSprites() {
        this.hudSprites.forEach(sprite => sprite.render());
    }
}
class Camera {
    constructor({x,y, follow}) {
        this.pos = new Vec2d({
            x: x || canvas.width / 2,
            y: y || canvas.height / 2
        });
        this.follow = follow;
    }
    update(delta) {
        if(this.follow) {
            this.pos.x = this.follow.pos.x;
            this.pos.y = this.follow.pos.y;
        }
    }
    transformToCamera() {
        ctx.save()
        ctx.translate(
            -(this.pos.x - canvas.width/2),
            -(this.pos.y - canvas.height/2)
        );
    }
    resetTransformation() {
        ctx.restore();
    }
}
class Sprite {
    constructor({x, y, w, h, pos, dPos, rect, ttl, origin, color, game}) {
        this.pos = new Vec2d(pos || {x:x, y:y});
        this.rect = new Vec2d(rect || {x:w, y:h});
        this.origin = new Vec2d(origin || this.rect.getMultiplied(.5));
        this.dPos = new Vec2d(dPos || {x:0, y:0});
        this.ttl = ttl || Infinity;
        this.color = color || '#ffffff';
        this.game = game;
    }
    update(delta) {
        this.ttl -= delta;
    }
    render() {}
}
class TitleScreen extends Sprite {
    constructor() {
        super({
            x:80,
            y:100,
            w:1, h:1
        });
    }
    render() {
        let grid = 20;
        let letters= [
            {  // S
                x:0, y:0, c:'#ffffff',
                points:[
                    [-2,-2], [2,-2], [2,-1], [-1,-1], [-1,0], [2,0], [2,3], [-2,3], [-2,2], [1,2], [1,1], [-2,1] 
                ]
            },
            {  // P
                x:5, y:0, c:'#ffffff',
                points:[
                    [-2,-2], [2,-2], [2,0], [1,0], [1,-1], [-1,-1], [-1,0], [2,0], [2,1], [-1,1], [-1,3], [-2,3] 
                ]
            },
            {  // A
                x:9.5, y:0, c:'#ffffff',
                points:[
                    [0,-2], [2,3], [1,3], [0.66,2], [-1.66,2], [-1.33,1], [0.33,1], [-0.33,-1] 
                ]
            },
            {  // C
                x:14, y:0, c:'#ffffff',
                points:[
                    [-2,-2], [2,-2], [2,-1], [-1,-1], [-1,2], [2,2], [2,3], [-2,3] 
                ]
            },
            {  // E - upper
                x:19, y:0, c:'#ffffff',
                points:[
                    [-2,-2], [2,-2], [2,-1], [-2,-1], 
                ]
            },
            {  // E - lower
                x:19, y:0, c:'#ffffff',
                points:[
                    [-2,0], [2,0], [2,1], [-1,1], [-1,2], [2,2], [2,3], [-2,3] 
                ]
            },
            {  // T
                x:24, y:0, c:'#000000', s:'#ffffff', l:2,
                points:[
                    [-2,-2], [2,-2], [2,-1], [0.5,-1], [0.5,3], [-0.5,3], [-0.5,-1], [-2,-1] ,[-2,-2]
                ]
            },
            {  // A
                x:28, y:0, c:'#000000', s:'#ffffff', l:2,
                points:[
                    [0,-2], [2,3], [1,3], [0.66,2], [-1.66,2], [-1.33,1], [0.33,1], [-0.33,-1], [0,-2]
                ]
            },
            {  // X1
                x:33, y:0, c:'#ffffff',
                points:[
                    [-2,-2], [-1,-2], [2,3], [1,3],
                ]
            },
            {  // X2
                x:33, y:0, c:'#ffffff', s:'#000000', l:2,
                points:[
                    [-2,3], [-1,0.5], [0.25,-1], [2,-2.5],[6,-4], [2.5,-1.8], [0.75,0], [-1,3], [-2,3],
                ]
            },
            {  // I
                x:37, y:0, c:'#000000', s:'#ffffff', l:2,
                points:[
                    [-0.5,-2], [0.5,-2], [0.5,3], [-0.5,3], [-0.5,-2]
                ]
            },
        ];
        letters.forEach(letter => {
            ctx.save();
            ctx.translate(this.pos.x + letter.x*grid, this.pos.y + letter.y*grid);
            ctx.beginPath();
            ctx.fillStyle = letter.c;
            ctx.strokeStyle = letter.s || 'transparent';
            ctx.lineWidth = letter.l || 1;
            letter.points.forEach((point,index) => {
                if(index == 0) {
                    ctx.moveTo(point[0]*grid, point[1]*grid);
                } else {
                    ctx.lineTo(point[0]*grid, point[1]*grid);
                }
            });
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        });

        ctx.save();
        ctx.translate(this.pos.x + -2*grid, this.pos.y + 7*grid);
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("This is the Starships latest usecase: Interplanetary Taxi Service!", 0, 0);
        ctx.fillText("Controlls:", 0, 30);
        ctx.fillText(" -> use the [left] and [right]-arrowkeys to turn the starship", 40, 60); 
        ctx.fillText(" -> use the [up]-arrowkey to fire the boosters ", 40, 90);  
        ctx.fillText("Customers (red circles) are waiting on planets, the green markers around your starship will guide you there.", 0, 140);
        ctx.fillText("Try to transport as many customers as you can, without crashing into anything...", 0, 170);
        ctx.fillText("There is no Game-Over, you will respawn after every unplanned rapid disassembly.", 0, 200);
        ctx.fillText("But if you had a customer aboard, this one may be unhappy ;-)", 0, 220);
        ctx.closePath();
        ctx.restore();
    }
}
class Planet extends Sprite {
    constructor(obj) {
        super(obj);
        let {r} = obj;
        this.radius = r;
    }
    render() {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        for(let r = 4; r > 1; r -=0.25) {
            ctx.beginPath();
            ctx.fillStyle = '#aaaaff08';
            ctx.arc(0, 0, this.radius * r, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

class Moon extends Planet {
    constructor(obj) {
        super(obj);
        let {orbits, angularPos, angularSpeed, orbitRadius} = obj;
        this.orbits = orbits;
        this.orbitRadius = orbitRadius || 4;
        this.angularPos = angularPos || 0;
        this.angularSpeed = angularSpeed || 0.15;
    }
    update(delta) {
        this.angularPos += this.angularSpeed * delta;
        let pos = new Vec2d(this.orbits.pos);
        let orbitPos = new Vec2d({
            x:Math.cos(this.angularPos) * this.orbits.radius * this.orbitRadius, 
            y:Math.sin(this.angularPos) * this.orbits.radius * this.orbitRadius
        });
        this.pos = pos.sum(orbitPos);
    }
}

class Customer extends Sprite {
    constructor(obj) {
        let {planetFrom, planetTo} = obj;
        obj.x = planetFrom.pos.x;
        obj.y = planetFrom.pos.y;
        super(obj);
        this.planetFrom = planetFrom;
        this.planetTo = planetTo;
        this.radius = 10;
        this.boarded = null;
    }
    update(delta) {
        super.update(delta);
        if(this.boarded) {
            this.pos.x = this.boarded.pos.x;
            this.pos.y = this.boarded.pos.y;
        }
    }
    render() {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#ff0000';
        ctx.arc(0, 0, this.radius -2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff44';
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.planetTo.pos.x, this.planetTo.pos.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        if(this.game.player && !this.boarded) {
            let diff = this.pos.diff(this.game.player.pos);
            let dist = diff.calcDist();
            let dir = diff.getNormalized();
            let lineFrom = this.game.player.pos.sum(dir.getMultiplied(80));
            let lineTo = this.game.player.pos.sum(dir.getMultiplied(140));
            let distPos = this.game.player.pos.sum(dir.getMultiplied(155));
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = '#66ff6699';
            ctx.moveTo(lineFrom.x, lineFrom.y);
            ctx.lineTo(lineTo.x, lineTo.y);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.translate(distPos.x, distPos.y);
            ctx.fillStyle = '#66ff6699';
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(Math.floor(dist-this.planetFrom.radius-this.game.player.origin.x), 0, 0);
            ctx.closePath();
            ctx.restore();
        }
    }
}

class Particle extends Sprite {
    constructor(obj) {
        super(obj);
        this.rot = obj.rot || 0;
        this.dRot = obj.dRot || 0;
        this.resize = obj.resize || 1;
    }
    update(delta) {
        super.update(delta);
        this.pos.x += this.dPos.x * delta;
        this.pos.y += this.dPos.y * delta;
        if(this.resize != 1) {
            this.rect = this.rect.getMultiplied(1 + (this.resize -1) * delta);
        }
        this.rot += this.dRot;
        if(this.game.spriteHash.planet) {
            this.game.spriteHash.planet.forEach(planet => {
                let distance = planet.pos.diff(this.pos);
                let dist = distance.calcDist();
                if(dist < planet.radius) {
                    this.pos.x += -this.dPos.x * delta;
                    this.pos.y += -this.dPos.y * delta;
                    this.dPos = this.dPos.getMultiplied(-0.2);
                }
            });
        }
    }
    render() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.color || '#ffffff';
        ctx.fillRect(-this.origin.x, -this.origin.y, this.rect.x, this.rect.y);
        ctx.closePath();
        ctx.restore();
    }
}

class Junk extends Sprite {
    constructor(obj) {
        super(obj);
        this.dPos = obj.dPos || new Vec2d({
            x: Math.random()*50 - 25,
            y: Math.random()*50 - 25
        });
        this.rot = 0;
        this.dRot = Math.random() * 0.1 - 0.05;
        this.isDebris = obj.isDebris || false;
    }
    update(delta) {
        super.update(delta);
        this.pos.x += this.dPos.x * delta;
        this.pos.y += this.dPos.y * delta;
        this.rot += this.dRot;
    }
    render() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.origin.x, -this.origin.y, this.rect.x, this.rect.y);
        ctx.closePath();
        ctx.restore();
    }
}
class Player extends Sprite {
    
    constructor(obj) {
        super({...obj, w :50, h:20});
        this.dPos.x = 0;
        this.dPos.y = 0;
        this.rot = 0;
        this.thrustDirectionStrength = 200;
        this.maxSpeed = 300;
        this.customer = null;
        this.landed = false;
        this.landedPlanet = null;
        this.landedPos = null;
    }

    update(delta) {
        let thrustDirection = new Vec2d({x:Math.cos(this.rot), y:Math.sin(this.rot)});
        let thrustDirection90Left = new Vec2d({x:thrustDirection.y, y:-thrustDirection.x});
        let thrustDirection90Right = new Vec2d({x:-thrustDirection.y, y:thrustDirection.x});
        if(this.game.spriteHash.planet) {
            let explodeSensors = [
                this.pos.sum(thrustDirection.getMultiplied(55-this.origin.x)), // nose
                this.pos.sum(thrustDirection90Left.getMultiplied(5 + this.origin.y)).sum(thrustDirection.getMultiplied(30-this.origin.x)), // left front fin
                this.pos.sum(thrustDirection90Right.getMultiplied(5 + this.origin.y)).sum(thrustDirection.getMultiplied(30-this.origin.x)), // right front fin
                this.pos.sum(thrustDirection90Left.getMultiplied(5 + this.origin.y)).sum(thrustDirection.getMultiplied(3.5-this.origin.x)), // left back fin
                this.pos.sum(thrustDirection90Right.getMultiplied(5 + this.origin.y)).sum(thrustDirection.getMultiplied(3.5-this.origin.x)), // right back fin
            ];
            let gear = this.pos.sum(thrustDirection.getMultiplied(-this.origin.x));

            if(this.landed) {
                this.pos = this.landedPlanet.pos.sum(this.landedPos);
            } else {
                this.game.spriteHash.planet.forEach(planet => {
                    let distance = planet.pos.diff(this.pos);
                    let dist = distance.calcDist();
                    if(dist > planet.radius * 4) {
                        return;
                    }
                    this.dPos._add(distance.getNormalized());
                    let exploded = false;
                    explodeSensors.forEach(sensor => {
                        let sensorDistance = planet.pos.diff(sensor).calcDist();
                        if(sensorDistance <= planet.radius) {
                            exploded = true;
                        }
                    });

                    if(exploded) {
                        this.ttl = 0;
                        for(let i = 0; i <100; i++) {
                            this.game.addSprite(new Particle({
                                pos: this.pos.sum(new Vec2d({x:Math.random()*50 - 25, y:Math.random()*20 - 10})),
                                rect: {x:Math.random()*5+2, y:Math.random()*5+2},
                                dPos: this.dPos.getMultiplied(0.1).sum(new Vec2d({x:Math.random()*150 - 25, y:Math.random()*150 - 25})),
                                dRot: Math.random()*0.2-0.11,
                                ttl: Math.random()*5+1,
                                isDebris: true,
                                color:'#ffffaa'
                            }), "debris");
                        }
                        if(this.customer) {
                            this.customer.ttl = 0;                  
                            this.game.unhappyCustomers += 1;
                            this.game.spawnCustomer();
                        }
                        this.game.player = null;
                        setTimeout(()=> {
                            this.game.spawnPlayer();
                        }, 1000);
                    }
                    let gearDistance = planet.pos.diff(gear).calcDist();
                    if(gearDistance <= planet.radius && !exploded) {
                        this.landed = true;
                        this.landedPlanet = planet;
                        this.landedPos = this.pos.diff(planet.pos);
                    }
                });
            }
        }
        if(this.game.keyPressed("ArrowUp")) {
            if(this.game.titleScreen) {
                this.game.titleScreen.ttl = 0;
                this.game.titleScreen = null;
            }
            this.dPos._add(thrustDirection.getMultiplied(delta * this.thrustDirectionStrength));
            let particleDir = thrustDirection.getMultiplied(-40)._add(this.dPos);
            particleDir.x = particleDir.x + Math.random()*20 - 10;
            particleDir.y = particleDir.y + Math.random()*20 - 10;
            this.game.addSprite(new Particle({
                pos: this.pos.sum(thrustDirection.getMultiplied(-15)),
                rect: {x:8, y:8},
                dPos: particleDir,
                ttl: Math.random()*2+1,
                color: '#ffff00',
                resize: 0.4
            }), "debris");
            this.landed = false;
            this.landedPlanet = null;
            this.landedPos = null;
        }
        if(this.game.keyPressed("ArrowDown")) {
            //nothing, there are no brakes in space!
        }
        if(this.game.keyPressed("ArrowLeft")) {
            if(!this.landed) {
                this.rot -= 0.02;
            }
        }
        if(this.game.keyPressed("ArrowRight")) {
            if(!this.landed) {
                this.rot += 0.02;
            }
        }
        let speed = this.dPos.calcDist();
        if(speed > this.maxSpeed) {
            this.dPos = this.dPos.getMultiplied(this.maxSpeed / speed);
        }
        
        if(!this.landed) {
            this.pos.x += this.dPos.x * delta;
            this.pos.y += this.dPos.y * delta;
        } else {
            this.dPos.x = 0;
            this.dPos.y = 0;
            if(!this.customer) {
                let customer = this.game.spriteHash.customer.find(customer => customer.planetFrom === this.landedPlanet);
                if(customer) {
                    customer.boarded = this;
                    this.customer = customer;
                }
            } else {
                if(this.customer.planetTo === this.landedPlanet) {
                    this.customer.ttl = 0;
                    this.customer.boarded = null;                    
                    this.game.happyCustomers += 1;
                    this.customer = null;
                    this.game.spawnCustomer();
                }
            }
        }
    }
    render() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(-this.origin.x, -this.origin.y, 40, 20);
        ctx.moveTo(30-this.origin.x, -5-this.origin.y);
        ctx.lineTo(35-this.origin.x, -this.origin.y);
        ctx.lineTo(40-this.origin.x, -this.origin.y);
        ctx.lineTo(50-this.origin.x, -5);
        ctx.lineTo(55-this.origin.x, 0);
        ctx.lineTo(50-this.origin.x, 5);
        ctx.lineTo(40-this.origin.x, this.origin.y);
        ctx.lineTo(35-this.origin.x, this.origin.y);
        ctx.lineTo(30-this.origin.x, 5+this.origin.y);
        ctx.fill();
        ctx.moveTo(-this.origin.x+2, -5 - this.origin.y);
        ctx.lineTo(20-this.origin.x,0);
        ctx.lineTo(-this.origin.x+2, 5 + this.origin.y);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

class Text extends Sprite {
    constructor(obj) {
        super(obj);
        let {text, updateText, font, align, baseline} = obj;
        this.text = text || "";
        this.font = font || "bold 16px sans-serif";
        this.align = align || "start"; // start, center, end
        this.baseline = baseline || "hanging"; // hanging, middle, alphabetic
        if(typeof updateText == "function") {
            this.updateText = updateText;
        } else {
            this.updateText = ()=>{};
        }
    }
    update(delta) {
        super.update(delta);
        this.updateText(this);
    }
    render() {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = '#ffffff';
        ctx.font = this.font;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.fillText(this.text, 0, 0);
        ctx.closePath();
        ctx.restore();
        //console.log(this.text);
    }
}



let space = new Game();
space.init();



let handleResize = () => {
    let docElem = document.documentElement;
    let body = document.getElementsByTagName('body')[0];
    let width = window.innerWidth || docElem.clientWidth || body.clientWidth;
    let height = window.innerHeight|| docElem.clientHeight|| body.clientHeight;

    let canvas = document.querySelector('canvas');
    canvas.width = width-30;
    canvas.height = height-30;
} 
window.addEventListener('resize', handleResize);
handleResize();