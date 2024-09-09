import { init, initPointer, initKeys, Sprite, Vector, Scene, keyPressed, getWorldRect, track, clamp, GameLoop } from "/kontra.mjs";

const { canvas, context } = init();

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
context.font = "bold 20px monospace";
context.textAlign = "center";
context.textBaseline = "middle";

const DELTA = 1000/60;
const TWO_PI = Math.PI * 2;

const cursorPath = new Path2D("M0 10 V0 h10, m10 0 h10 v10, m0 10 v10 h-10, m-10 0 h-10 v-10");
const heartPath = new Path2D("M 1,3 A 2,2 0,0,1 5,3 A 2,2 0,0,1 9,3 Q 9,6 5,8 Q 1,6 1,3 Z");

let gameStop = true;
let time = 0;

// Levels
let level = 0;
const levelData = [
	// [ levelTitle, enemyCount, enemySpawnTime, archerChance ]
	["You are the last alive,\ndefeat the remaining enemies.\nFinish Level 5 and win.", 3, 3, 0], // Level 1
	["Go ahead.", 5, 2, 0], // Level 2
	["Archers have appeared!", 5, 2, 0.3], // Level 3
	["More to come!", 15, 2, 0.4], // Level 4
	["The last battle to victory.", 20, 1, 0.5], // Level 5
	["Thanks for playing.", 0, 0, 0]
];

// Enemy
const enemies = [];
const arrows = [];
let levelTitle = levelData[level][0];
let enemyCount = levelData[level][1];
let enemySpawnTime = levelData[level][2]; // seconds.
let archerChance = levelData[level][3];

// Player
const MAX_HP = 3;
let hp = 3;

const pointer = initPointer();
initKeys();

const player = Sprite({
	x: WIDTH / 2 - 7.5,
	y: HEIGHT / 2 - 7.5,
	radius: 20,
	halfRadius: 20 / 2,
	anchor: Vector(0.5, 0.5),
	color: "#E8E3C8",
	update() {
		this.advance(DELTA);
		let pos = Vector(0, 0);

		if(keyPressed("w") || keyPressed("arrowup")) pos.y = -1;
		else if(keyPressed("s") || keyPressed("arrowdown")) pos.y = 1;

		if(keyPressed("a") || keyPressed("arrowleft")) pos.x = -1;
		else if(keyPressed("d") || keyPressed("arrowright")) pos.x = 1;

		if(pos.x !== 0 && pos.y !== 0) pos = pos.normalize();

		pos = pos.scale(0.15);

		this.dx = pos.x;
		this.dy = pos.y;

		if(this.x < this.radius) this.x = this.radius;
		else if(this.x > WIDTH - this.radius) this.x = WIDTH - this.radius;

		if(this.y < this.radius) this.y = this.radius;
		else if(this.y > HEIGHT - this.radius) this.y = HEIGHT - this.radius;
	},
	render() {
		context.fillStyle = this.color;

		context.beginPath();
		context.arc(0, 0, this.radius, 0, Math.PI * 2);
		context.fill();
	}
});

const sword = Sprite({
	x: player.x,
	y: player.y - player.height / 2,
	width: 10,
	height: 40,
	anchor: Vector(0.5, 0.8),
	isSwinging: false,
	lastAttackTime: 0,
	attackDur: 0.4,
	time: 0,
	margin: player.radius * 1.8,
	lastAngle: 0,
	amplitude: 1.5,
	period: 400,
	phase: 1.5,
	attack() {
		if(this.isSwinging === true) return;

		this.lastAngle = this.rotation - 1.6;
		this.lastAttackTime = Date.now();
		this.isSwinging = true;
	},
	update() {
		const angle = Math.atan2(pointer.y - player.y, pointer.x - player.x);
		this.rotation = angle + 1.6;
		
		if(!this.isSwinging) {
			this.x = player.x + Math.cos(angle) * this.margin;
			this.y = player.y + Math.sin(angle) * this.margin;

			return;
		}

		this.time += DELTA;

		this.x = player.x + Math.cos(angle) * this.margin;
		this.y = player.y + Math.sin(angle) * this.margin;

		// Calculate the swing angle based on the current rotation.
		this.rotation += Math.cos((TWO_PI / this.period) * this.time + this.phase) * this.amplitude;

		if(this.time / 1000 >= this.attackDur) {
			this.isSwinging = false;
			this.time = 0;
		}
	},
	render() {
		context.fillStyle = "#E8E3C8";

		context.beginPath();

		const halfWidth = this.width * 0.5;

		// Triangle
		context.lineTo(0, 2);
		context.lineTo(halfWidth, -halfWidth);
		context.lineTo(this.width, 2);

		context.roundRect(0, 0, this.width, this.height, 2);

		context.roundRect(-halfWidth, this.height - 12, this.width * 2, 5, 5);

		context.fill();
	}
});

const cursor = Sprite({
	x: pointer.x,
	y: pointer.y,
	width: 30,
	height: 30,
	size: 5,
	anchor: Vector(0.5, 0.5),
	color: "#E8E3C8",
	update() {
		this.x = clamp(20, WIDTH - (this.width - 10), pointer.x);
		this.y = clamp(20, HEIGHT - (this.height - 10), pointer.y);
	},
	render() {
		context.lineWidth = this.size;
		context.strokeStyle = this.color;

		context.stroke(cursorPath);
	},
	onDown() {
		sword.attack();
	}
});

const hud = Sprite({
	x: 0,
	y: 0,
	width: WIDTH,
	height: HEIGHT,
	render() {
		for(let i=0; i<MAX_HP; i++) {
			const posX = 35 * i;

			const heart = Sprite({
				x: 30 + posX,
				y: 30,
				width: 30,
				height: 30,
				scaleX: 3,
				scaleY: 3,
				color: "#E8E3C8",
				render() {
					context.fillStyle = this.color;
					context.strokeStyle = this.color;

					context[i < hp ? "fill" : "stroke"](heartPath);
				}
			});

			heart.render();
		}
		
		const enemyCountTxt = `Live Enemy: ${enemyCount}`;
		const enemyCountTxtWdth = context.measureText(enemyCountTxt).width;
		
		context.shadowOffsetX = 3;
		context.shadowOffsetY = 2;
		context.fillStyle = "rgb(232, 227, 200)";
		context.fillText(enemyCountTxt, WIDTH - 30 - enemyCountTxtWdth / 2, 50);
		
		context.font = "bold 30px monospace";
		context.fillText(`Level: ${level + 1}`, WIDTH / 2, 50);
		
		let lvlTitleHght = 0;
		const showWaitScreen = gameStop || hp <= 0;
		
		if(showWaitScreen) {
			context.fillStyle = "rgba(132, 127, 100, 0.3)";
			context.fillRect(-3, -2, this.width, this.height);
			
			context.font = "bold 30px monospace";
			context.fillStyle = "rgb(232 227 200)";
		}
		
		if(hp <= 0) {
			context.fillText("You lost, try again!", WIDTH * 0.5, HEIGHT * 0.3);
		} else if(gameStop) {
			const txts = levelTitle.split("\n");
			
			for(const txt of txts) {
				lvlTitleHght += context.measureText(txt).fontBoundingBoxAscent + 20;
				context.fillText(txt, WIDTH * 0.5, HEIGHT * 0.3 + lvlTitleHght);
			}
		}
		
		if(showWaitScreen && level < 5) {
			context.font = "bold 16px monospace";
			context.fillText("(Press space to start)", WIDTH * 0.5, HEIGHT * 0.4 + lvlTitleHght);
		}
	}
});

function randomEnemySpawnPoint() {
	const isVertical = chance();
	
	let x = 0;
	let y = 0;
	
	if(isVertical) {
		x = randInt(-20, WIDTH + 20);
		y = chance() ? -20 : HEIGHT + 20;
	} else {
		x = chance() ? -20 : WIDTH + 20;
		y = randInt(-20, HEIGHT + 20);
	}
	
	return { x, y };
}

function newArcher(x, y) {
	const enemy = Sprite({
		x,
		y,
		speed: 3,
		width: 40,
		height: 40,
		color: "#FF7D6E",
		anchor: Vector(0.5, 0.5),
		time: 0,
		arrowDelay: 2,
		throwArrow() {
			if(this.time <= this.arrowDelay) return;
			
			this.time = 0;
			
			const dir = this.position.subtract(player.position)
				.normalize()
				.scale(this.speed);
			
			const arrowRot = Math.atan2(this.y - player.y, this.x - player.x);
			
			const arrow = Sprite({
				color: "#FF7D6E",
				x: this.x,
				y: this.y,
				width: 20,
				height: 5,
				rotation: arrowRot,
				isOffScreen() {
					return this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT
				},
				update() {
					this.x -= dir.x;
					this.y -= dir.y;
				}
			});
			
			arrows.push(arrow);
		},
		update() {
			const dist = this.position.subtract(player.position);
			
			if(dist.length() <= this.width * 6) {
				this.time += DELTA / 1000;
				this.throwArrow();
				return;
			}
			
			this.rotation += 0.05;
			
			const dir = dist.normalize()
				.scale(this.speed);

			this.x-= dir.x;
			this.y -= dir.y;
		},
		render() {
			context.fillStyle = this.color;

			context.beginPath();
			context.roundRect(0, 0, this.width, this.height, 10);
			context.fill();
		}
	});
	
	return enemy;
}

function newSwordsMan(x, y, speed) {
	const enemy = Sprite({
		x,
		y,
		speed,
		width: 40,
		height: 40,
		color: "#FF7D6E",
		anchor: Vector(0.5, 0.5),
		update() {
			this.rotation += 0.05;

			const dist = this.position.subtract(player.position)
				.normalize()
				.scale(this.speed);

			this.x -= dist.x;
			this.y -= dist.y;
		},
		render() {
			context.fillStyle = this.color;

			context.beginPath();
			context.roundRect(0, 0, this.width, this.height, 10);
			context.fill();
		}
	});
	
	return enemy;
}

function addEnemy() {
	const { x, y } = randomEnemySpawnPoint();
	const speed = randInt(1, 3);

	const enemy = chance(archerChance)
		? newArcher(x, y)
		: newSwordsMan(x, y, speed);

	return enemy;
}

function circleRectCollisionCheck(circle, _rect) {
	const rect = getWorldRect(_rect);
	
	const rectCos = Math.cos(_rect.rotation);
	const rectSin = Math.sin(_rect.rotation);
	
	let testX = circle.x;
	let testY = circle.y;

	// which edge is closest?
	if (circle.x < rect.x) testX = rect.x;
	else if (circle.x > rect.x + rect.width) testX = rect.x + rect.width;

	if (circle.y < rect.y) testY = rect.y;
	else if (circle.y > rect.y + rect.height) testY = rect.y + rect.height;

	// get distance from closest edges
	const distX = circle.x - testX;
	const distY = circle.y - testY;
	const distance = Math.hypot(distX, distY);

	return distance < circle.radius;
}

function rectCollisionCheck(_rectA, _rectB) {
	const rectA = getWorldRect(_rectA);
	const rectB = getWorldRect(_rectB);

	return (
		rectA.x + rectA.width >= rectB.x &&
		rectA.x <= rectB.x + rectB.width &&
		rectA.y + rectA.height >= rectB.y &&
		rectA.y < rectB.y + rectB.height
	);
}

function goNextLevel() {
	level++;
	levelTitle = levelData[level][0];
}

function resumeGame() {	
	// Reset enemy
	enemyCount = levelData[level][1];
	enemySpawnTime = levelData[level][2];
	archerChance = levelData[level][3];
	enemies.length = 0;
	
	// Reset sword
	sword.isSwinging = false;
	sword.time = 0;
	
	// Reset player
	player.x = WIDTH / 2 - player.radius / 2;
	player.y = HEIGHT / 2 - player.radius / 2;
	time = 0;
	
	if(hp <= 0) hp = MAX_HP;
	
	gameStop = false;
}

track(cursor);

const gameScene = Scene({
	objects: [player, sword, hud, cursor]
});

let currentScene = gameScene;

const gameLoop = GameLoop({
	clearScreen: false,
	update() {
		if(gameStop && level < 5 && keyPressed("space")) resumeGame();
		
		if(!gameStop && time >= enemySpawnTime && enemies.length < enemyCount) {
			const enemy = addEnemy();
			enemies.push(enemy);
			
			time = 0;
		}

		time += DELTA/1000;
		
		for(let idx=0; idx<enemies.length; idx++) {
			const enemy = enemies[idx];
			const isEnemyHitsPlayer = circleRectCollisionCheck(player, enemy);
			const isSwordHitsEnemy = sword.isSwinging && rectCollisionCheck(sword, enemy);

			if(isEnemyHitsPlayer) {
				hp -= 1;
				enemies.splice(idx, 1);
				enemyCount -= 1;
				
				playSound("damage");
				continue;
			} else if(isSwordHitsEnemy) {
				enemies.splice(idx, 1);
				enemyCount -= 1;
				
				playSound("hit");
				continue;
			}

			enemy.update();
		}
		
		for(let idx=0; idx<arrows.length; idx++) {
			const arrow = arrows[idx];
			const isArrowHitsPlayer = circleRectCollisionCheck(player, arrow);
			
			if(isArrowHitsPlayer) {
				arrows.splice(idx, 1);
				hp -= 1;
				
				playSound("damage");
				continue;
			}
			
			if(arrow.isOffScreen()) {
				arrows.splice(idx, 1);
				continue;
			}
			
			arrow.update();
		}

		currentScene.update();
		
		if(hp <= 0) {
			enemies.length = 0;
			arrows.length = 0;
			gameStop = true;
		}

		if(!gameStop && enemyCount <= 0) {
			gameStop = true;
			arrows.length = 0;
			goNextLevel();
		}
	},
	render() {
		context.fillStyle = "#FCA6AC";
		context.fillRect(0, 0, WIDTH, HEIGHT);

		context.shadowColor = "#2176CC";
		context.shadowOffsetX = 4;
		context.shadowOffsetY = 4;
		
		if(gameStop && level < 5 && keyPressed("space")) resumeGame();

		for(const enemy of enemies) {
			enemy.render();
		}
		
		for(const arrow of arrows) {
			arrow.render();
		}
		
		currentScene.render();
	}
});

gameLoop.start();

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (mid = 0.5) => Math.random() > 1 - mid;

function playSound(name, volume = 0.3) {
	zzfxV = volume;
	zzfx(...sounds[name]);
}

const sounds = {
	hit: [1.66,,163,.01,.04,.03,,.1,-8.8,.1,,,,,,.1,.03,.59,.05],
	damage: [1.6,,278,,.01,.01,2,.7,-7.1,,,,.07,1,,,.09,.81,.08],
	upgrade: [1.81,,27,.04,.17,.47,2,1.26,-3.1,,,.08,,,,,.14,.54,.2,.29]
};

// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a tiny build of zzfx with only a zzfx function to play sounds.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

let zzfx,zzfxV,zzfxX

// ZzFXMicro - Zuper Zmall Zound Zynth - v1.2.1 by Frank Force ~ 880 bytes
zzfxV=.3    // volume
zzfx=       // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=
0,B=0,M=Math,R=44100,d=2*M.PI,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g
=0,H=0,a=0,n=1,I=0,J=0,f=0,x,h)=>{e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d
/R;v*=d/R;z*=R;l=R*l|0;for(h=e+m+r+t+c|0;a<h;k[a++]=f)++J%(100*F|0)||(f=q?1<q?2<
q?3<q?M.sin((g%d)**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.
round(g/d)-g/d):M.sin(g),f=(l?1-B+B*M.sin(d*a/l):1)*(0<f?1:-1)*M.abs(f)**D*zzfxV
*p*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:
(a<h-c?1:(h-a)/c)*k[a-c|0]/2):f),x=(b+=u+=y)*M.cos(A*H++),g+=x-x*E*(1-1E9*(M.sin
(a)+1)%2),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();b.
buffer=p;b.connect(zzfxX.destination);b.start();return b};zzfxX=new AudioContext;
window.zzfx=zzfx;