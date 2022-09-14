/*	All the game logic is here, because the client have to run the game itself for solo game,
	and the server too for multiplayer.. */


/// VARIABLES

const width=600;
const wAstMin = 7;
const wAstMax = 60;
const astVar = 2;
const astVarAngleMin = Math.PI/4;
const astVarAngleMax = Math.PI/2;
const astStepsToDir = 300;
const frameRate = 1000/60;
const maxVelocity = 3;
const maxVelocityShip = 7;
const expTime = 8;
const expR = 5;
const expVar = 15;
const expVarAngleMin = Math.PI/8;
const expVarAngleMax = Math.PI/2.8;
const rShip = 7;
const rotationSpeed = Math.PI/32;
const kickbackSpeed = 2;
const momentumFire = 15;
const momentumTeleport = 100;
const momentumAsteroids = 200;
const momentumRevive = 100;
const rBullet = 2;
const bulletSpeed = 7;
const maxObjects = 60;
const aliveTimePoints = 5000;
const killAstScore = 10;
const killShipScore = 100;


var asts = [];
var esth = {stroke:[],fill:[]};
var ships = [];
var bulls = [];

var counts={asteroid:0,revive:-1};


/// UTILITIES

function rand(min, max) {
	return min + Math.floor(Math.random()*(max-min));
}

function getPoint(dir,dist) {
	return {x:Math.cos(dir)*dist, y:Math.sin(dir)*dist}
}

function getVec(dx,dy) {
	return {angle:Math.atan2(dy,dx), dist:Math.sqrt(dx*dx+dy*dy)};
}

function capVel(v,mv) {
	mv = mv? mv:maxVelocity;
	if(v<-mv) return -mv;
	if(v>mv) return mv;
	return v;
}

function setDir(xOry,w) {
	return (xOry - rand(w,width-w)) / astStepsToDir;
}

function checkCollision(o1,o2) {
	var dist = Math.sqrt( (o2.x-o1.x)*(o2.x-o1.x)+(o2.y-o1.y)*(o2.y-o1.y) );
	return dist < o1.w+o2.w;
}

function moveObj(o, out) {
	out = true;
	o.x += o.dx;
	o.y += o.dy;
	if (o.x<-o.w) o.x = width+o.w;
	else if (o.x>o.w+width) o.x = -o.w;
	else if (o.y<-o.w) o.y = width+o.w;
	else if (o.y>o.w+width) o.y = -o.w;
	else out = false;
	return !out;
}

function countdown (el) {
	if (el.t===undefined) return true;
	return --el.t >1;
}

function getSafePlace() {
	var tries = 100,x,y, wSafe=rShip*3, safe, objs = asts.concat(ships, bulls);
	do {
		if(tries==20) wSafe = rShip;

		x = rand(rShip*2,width-rShip*2);
		y = rand(rShip*2,width-rShip*2);

		safe = !objs.some((o)=>checkCollision(o,{x:x,y:y,w:wSafe}));
		tries--;
	} while(!safe || tries>0);

	return {x:x,y:y};
}

function getShip(id) {
	for(var i=0;i<ships.length;i++) {
		if(ships[i].id == id) return ships[i];
	}
	return null;
}


/// ASTEROIDS STUFF

function createAsteroid(x,y,w,dx, dy,r,a) {
	var pts=[];
	w = w? w: rand(wAstMin,wAstMax);
	if(x==undefined) {
		do {
			r = rand(0,4);
			x = r%2? rand(-w,width+w) : (r==0? -w:width+w);
			y = r%2==0? rand(-w,width+w) : (r==1? -w:width+w);
		} while(ships.some((o)=>checkCollision(o,{x:x,y:y,w:w})) );
	}

	dx = capVel(dx? dx : setDir(x,w) );
	dy = capVel(dy? dy : setDir(y,w) );
	var angle = 0;
	var dist;

	while (angle<Math.PI*2) {
		dist = w + rand(-astVar, astVar);

		pts.push(getPoint(angle,dist));

		angle += rand(astVarAngleMin,astVarAngleMax);
	}
	pts.push(pts[0])
	asts.push(a={x:x,y:y,w:w,pts:pts,dx,dy});
	return a;
}

function killAst(ast,dx,dy) {
	var diffAngle = Math.PI/3;
	if(ast.w/2>wAstMin) {
		var vec = getVec(dx,dy);
		var nAngle, nDx, nDy, a2,a1,pt;

		nAngle = vec.angle - diffAngle/2 +Math.random()*diffAngle;
		pt = getPoint(nAngle,vec.dist);
		nDx = capVel(ast.dx/2 + pt.x);
		nDy = capVel(ast.dy/2 + pt.y);
		a1 = createAsteroid(ast.x, ast.y, ast.w/2, nDx, nDy) ;

		do {
			nAngle = vec.angle - diffAngle/2 +Math.random()*diffAngle;
			pt = getPoint(nAngle,vec.dist);
			nDx = capVel(ast.dx/2 + pt.x);
			nDy = capVel(ast.dy/2 + pt.y);
			pt = getPoint(nAngle,ast.w);
			a2 = createAsteroid(ast.x+pt.x, ast.y+pt.y, ast.w/2, nDx, nDy);
		} while(checkCollision(a1,a2));

		// asts.push(a1,a2);
		
	}
	asts.splice(asts.indexOf(ast),1);
}


/// EXPLOSIONS STUFF

function createExplosion(o1,o2) {
	var vec, pt, x,y,dist, angle=0, pts=[],count=0,w;
	if(o1.w>o2.w) {
		var oT = o1;
		o1 = o2;
		o2 = oT;
	}
	var vec = getVec(o2.x-o1.x,o2.y-o1.y);
	var pt = getPoint(vec.angle,o1.w);
	x = o1.x + pt.x;
	y = o1.y + pt.y;

	addExplosion(x,y);
}

function addExplosion(x,y,stroke) {
	var dist, angle=0, pts=[],count=0,w;

	while (angle<Math.PI*2) {
		dist = (count%2)? expR :expR + rand(expR,expVar) ;

		pts.push(getPoint(angle,dist));

		angle += rand(expVarAngleMin,expVarAngleMax);

		count++;
	}

	pts.push(pts[0]);
	
	esth[stroke?"stroke":"fill"].push({t:expTime,x:x,y:y,pts:pts});
}


/// SHIPS STUFF

function createShip(id,name,highscoreID) {
	return {id:id,pts:ptsShip(0),x:0,y:0,w:rShip,dir:0,dx:0,dy:0,id:id,score:0,highscore:0,alive:false,aliveSince:0,kills:0,name:name,highscoreID:highscoreID,counts:{fire:0,teleport:0}};
}

function ptsShip(dir,pts) {
	pts=[];
	for (var i=0;i<3;i++) {
		pts.push(getPoint(dir, rShip*(i==0?2.2:1.6)))
		dir += Math.PI*2/3;
	}
	pts.push(pts[0]);
	return pts;
}

function turnShip(ship,dir) {
	ship.dir += dir;
	ship.pts = ptsShip(ship.dir);
}

function killShip(ship) {
	// id = id? id : ships.indexOf(ship);
	// ships.splice(id,1);
	ship.score = calcScore(ship);
	
	if (ship.score>ship.highscore) {
		ship.newHighscore = true;
		ship.highscore = ship.score;
	}
	// counts.revive = momentumRevive;
	ship.alive = false;
	// placeShip(ship);
}

function placeShip(ship) {
	var coor = getSafePlace();
	ship.x = coor.x;
	ship.y = coor.y;
	ship.dx = ship.dy = 0;
	ship.dir = -Math.PI/2;
	ship.pts = ptsShip(ship.dir);
	ship.alive = true;
	ship.aliveSince = Date.now();
}

function calcScore(ship) {
	if (!ship) return 0;
	return ship.score + (ship.alive? Math.floor((Date.now() - ship.aliveSince)/aliveTimePoints):0);
}


/// BULLETS STUFF

function createBullet(ship) {
	var dXY = getPoint(ship.dir,bulletSpeed);
	var offset = getPoint(ship.dir,rShip*2);
	bulls.push({x:ship.x+offset.x,y:ship.y+offset.y,dx:dXY.x,dy:dXY.y,w:1,ship:ship});
}


/// GAME LOOP

function logicLoop() {
	var o1,o2,deadShips=[];

	// COUNTS
	for (var id in counts) {
	  counts[id]--;
	}

	for (var i=ships.length-1;i>-1;i--) {
		o1 = ships[i];
		if(!o1.alive) continue;
		o1.counts.fire--; o1.counts.teleport--;
		if(o1.left) turnShip(o1,-rotationSpeed);
		if(o1.right) turnShip(o1,rotationSpeed);
		if(o1.fire && o1.counts.fire<1) {
			var kickback = getPoint(o1.dir+Math.PI, kickbackSpeed);
			o1.dx = capVel(o1.dx + kickback.x, maxVelocityShip);
			o1.dy = capVel(o1.dy + kickback.y, maxVelocityShip);
			o1.counts.fire = momentumFire;
			createBullet(o1);
			o1.fire = false;
		}
		if(o1.teleport && o1.counts.teleport<1) {
			addExplosion(o1.x,o1.y,true);
			o1.counts.teleport = momentumTeleport;
			o1.score = calcScore(o1);
			placeShip(o1);
			o1.teleport = false;
		}

		moveObj(o1);
		// collision with other ships
		for (var j=i+1;j<ships.length; j++) {
			o2 = ships[j];
			if(checkCollision(o1,o2)) {
				killShip(o1);
				killShip(o2);
				createExplosion(o1,o2);
				break;
			}
		}
	}

	for (var i=bulls.length-1;i>-1;i--) {
		o1 = bulls[i]
		if (!moveObj(o1)) bulls.splice(i,1);
		else {
			for (var j=0;j<ships.length; j++) {
				o2 = ships[j];
				if(o2.alive && checkCollision(o1,o2)) {
					bulls.splice(i,1);
					deadShips.push(o2);
					killShip(o2);
					createExplosion(o1,o2);
					if(o1.ship!=o2 && o1.ship.alive) {
						o1.ship.score += killShipScore;
						o1.ship.kills++;
					}
					break;
				}
			}
		}
	}

	for (var i=asts.length-1;i>-1;i--) {
		o1 = asts[i];
		moveObj(o1);

		// collision between asteroids
		for (var j=i+1;j<asts.length; j++) {
			o2 = asts[j];
			if(checkCollision(o1,o2)) {
				killAst(o1,o2.dx,o2.dy);
				killAst(o2,o1.dx,o1.dy);
				createExplosion(o1,o2);
				break;
			}
		}

		// collision with bullets
		for (var j=0;j<bulls.length; j++) {
			o2 = bulls[j];
			if(checkCollision(o1,o2)) {
				killAst(o1,o2.dx/2,o2.dy/2);
				bulls.splice(j,1);
				createExplosion(o1,o2);
				if(o2.ship.alive) o2.ship.score += killAstScore;
				break;
			}
		}

		// collision with ships
		for (var j=0;j<ships.length; j++) {
			o2 = ships[j];
			if(o2.alive && checkCollision(o1,o2)) {
				killAst(o1,o2.dx,o2.dy);
				deadShips.push(o2);
				killShip(o2);
				createExplosion(o1,o2);
				break;
			}
		}
	}

	esth.stroke = esth.stroke.filter(countdown);
	esth.fill = esth.fill.filter(countdown);


	if(counts.asteroid<0 && (ships.length+asts.length<maxObjects)) {
		createAsteroid();
		counts.asteroid = momentumAsteroids;
	}

	if(counts.revive===0) {
		placeShip(player);
		ships.push(player);
	}

	return deadShips;
}
