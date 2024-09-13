const { PI, random } = Math;
const PI2 = PI * 2;
const [NO_COLLISION, WALL, TEAM_FRIEND, TEAM_ENEMY, TEAM_ITEM] = [0,1,2,3,4];

const objToStr = obj => Object.keys(obj).map(key => `${key}: ${obj[key].toString()}`);

const getObjectBounds = obj => {
const { pos, size } = obj;
const halfWidth = size.x / 2;
const halfHeight = size.y / 2;
return {
top: pos.y - halfHeight,
bottom: pos.y + halfHeight,
left: pos.x - halfWidth,
right: pos.x + halfWidth,
};
};

const collided = (aObj, bObj) => {
const a = getObjectBounds(aObj);
const b = getObjectBounds(bObj);
return (
!aObj.delete && !bObj.delete
&& !aObj.isDead && !bObj.isDead
&& (!aObj.playerIsTooFar || !bObj.playerIsTooFar)
&& aObj.team !== NO_COLLISION && bObj.team !== NO_COLLISION
&& aObj.team !== bObj.team
&& b.right > a.left && b.left < a.right
&& b.top < a.bottom && b.bottom > a.top
);
};
const vec2 = (x,y=x)=>new Vec2(x, y);
const normalizeRad = rad => rad < 0 ? rad + PI2 : rad % PI2;
const angleRadians = (v1, v2) => v1 && v2 ? normalizeRad(Math.atan2(v2.y - v1.y, v2.x - v1.x) + Math.PI / 2) : 0;
const distance = (v1, v2 = vec2(0)) => v1 && v2 ? Math.hypot(v2.x - v1.x, v2.y - v1.y) : 0;
const formatNum = n => isNaN(n) ? n : (~~(n * 1e3) / 1e3).toString();

const rand = (max, min = 0) => (Math.random() * (max - min)) + min;
const randVec = v => vec2(rand(v.x), rand(v.y));
const text = (str, pos, fontSize, angle, color, scaleParam = 1) => {
const scale = scaleParam * globalScale;
const relativePos = pos.scale(scale).subtract(cameraPos.scale(scale)).add(SCREEN_SIZE.scale(.5))
x.fillStyle = color;
x.textAlign = "center";
x.save();
x.translate(relativePos.x, relativePos.y);
x.rotate(angle);
x.font = (scale * fontSize) + "px'";
x.fillText(str, 0, 0);
x.restore();
};

const rect = (pos, size, angle, center, color, scaleParam = 1, isLine) => {
const scale = scaleParam * globalScale;
const relativePos = pos.scale(scale).subtract(cameraPos.scale(scale)).add(SCREEN_SIZE.scale(.5))
const scaledSize = size.scale(scale);
if (relativePos.x < -scaledSize.x || relativePos.y < -scaledSize.y
|| relativePos.x > SCREEN_SIZE.x + scaledSize.x || relativePos.y > SCREEN_SIZE.y + scaledSize.y) return;
const scaledCenter = (center || size.scale(.5)).scale(scale);
x.fillStyle = color;
x.strokeStyle = color;
x.save();
x.translate(relativePos.x, relativePos.y);
if (angle !== 0) x.rotate(angle);
if (isLine) {
x.lineWidth = scale;
x.strokeRect(-scaledCenter.x, -scaledCenter.y, scaledSize.x, scaledSize.y)
}
else {
x.fillRect(-scaledCenter.x, -scaledCenter.y, scaledSize.x, scaledSize.y);
}
x.restore();
};

const circle = (pos, size, color) => {
const scale = globalScale;
const relativePos = pos.scale(scale).subtract(cameraPos.scale(scale)).add(SCREEN_SIZE.scale(.5))
const scaledSize = size.scale(scale);
if (relativePos.x < -scaledSize.x || relativePos.y < -scaledSize.y
|| relativePos.x > SCREEN_SIZE.x + scaledSize.x || relativePos.y > SCREEN_SIZE.y + scaledSize.y)
return;
x.beginPath();
x.arc(relativePos.x, relativePos.y, scaledSize.x, 0, PI2);
x.fillStyle = color;
x.fill();
};
const cube = (pos, size, direction, center, color, height=1, scaleParam=1) => {
for(i=height;i--;)rect(pos.addY(i*-3), size, direction, center, color, scaleParam);
rect(pos.addY(height* -3), size, direction, center, "gray", scaleParam, true);
};
const line = (startPos, endPos, color, thickness) => {
if (!startPos || !endPos) return;
const scale = globalScale;
const start = startPos.scale(scale).subtract(cameraPos.scale(scale)).add(SCREEN_SIZE.scale(.5));
const end = endPos.scale(scale).subtract(cameraPos.scale(scale)).add(SCREEN_SIZE.scale(.5));
x.beginPath();
x.strokeStyle = color || "red";
x.lineWidth = (thickness || 3) * globalScale;
x.moveTo(start.x, start.y);
x.lineTo(end.x, end.y);
x.stroke();
};
const getGridPos = pos => pos && vec2(Math.round(pos.x / TILE_SIZE), Math.round(pos.y / TILE_SIZE));

class Vec2 {
constructor(x = 0, y = 0) { this.x = x; this.y = y; }
copy() { return vec2(this.x, this.y); }
scale(s) { return vec2(this.x * s, this.y * s); }
add(v) { return vec2(this.x + v.x, this.y + v.y); }
subtract(v) { return vec2(this.x - v.x, this.y - v.y); }
addX(vx) { return vec2(this.x + vx, this.y); }
addY(vy) { return vec2(this.x, this.y + vy); }
setAngle(a=0, l=1) { this.x = l*Math.sin(a); this.y = l*Math.cos(a); return this; }
equals(v) { return !!v && this.x === v.x && this.y === v.y; }
toString() { return `x: ${~~this.x}, y: ${~~this.y}`; }
//  move vector in direction (angle) `a` (radians) at distance `l` (length)
move(a, l) { return vec2(this.x + l * Math.sin(a), this.y - l * Math.cos(a)); }
delta(a, l) { return vec2(l * Math.sin(a), -l * Math.cos(a)); }
}

class Speed {
//direction is -1, 0, or 1 (backward, stop, forward, accelorate)
constructor(maxSpeed = 1, direction = 0, accelorate = 0, decelorate = accelorate) {
this.maxSpeed = maxSpeed;
this.speed = direction * maxSpeed;
this.accelorate = accelorate;
this.decelorate = decelorate;
}
move(direction) {
if (this.accelorate === 0) {
this.speed = this.maxSpeed * direction;
}
else if (direction !== 0) {
const newSpeed = this.speed + (this.accelorate * tDiff* direction);
this.speed = newSpeed < 0 ? Math.max(newSpeed, -this.maxSpeed) : Math.min(newSpeed, this.maxSpeed);
}
else if (direction === 0 && this.speed !== 0) {
if (this.decelorate > 0) {
 const reverseDirection = this.speed < 0 ? 1 : -1;
 this.speed += reverseDirection * this.decelorate * tDiff;

 if ((reverseDirection === -1 && this.speed < 0)
 || (reverseDirection === 1 && this.speed > 0)) this.speed = 0;
}
else this.speed = 0;
}
}
copy() {
const { maxSpeed, speed, accelorate, decelorate } = this;
const direction = speed < 0 ? -1 : speed > 0 ? 1 : 0;
return new Speed(maxSpeed, direction, accelorate, decelorate);
}
toString() { return "maxSpeed,speed,accelorate,decelorate".split`,`.map(n => `${n}: ${formatNum(this[n])}`).join`,`; }
}

class Timer {
/**
* @param {*} timeLeft In seconds.
*/
constructor(timeLeft) {
this.time = timeLeft == undefined ? undefined : time + timeLeft;
this.setTime = timeLeft;
}
set(timeLeft=0) { this.time = time + timeLeft; this.setTime = timeLeft; }
unset() { this.time = undefined; }
elapsed() { return time > this.time; }
getPercent() { return !this.elapsed() ? Math.abs(Math.floor((this.time - time) / this.setTime * 1000) / 10000) : 0; }
}

const setUnitValues = (obj, unitName) => {
const unit = UNIT[unitName];
for (const name of Object.keys(unit)) obj[name] = unit[name];
};

class PushBack {
constructor({angle, pushBack = 20, timeLen = .3}) {
this.angle = angle;
this.pushBack = pushBack;
this.timeLen = timeLen;
this.timer = new Timer;
}
startPush() { this.timer = new Timer(this.timeLen); }
applyPush(obj) {
// if (!this.timer.elapsed()) {
obj.pos.move(this.angle, this.pushBack);
}
}

let shakeTimer = new Timer;
let shakeLevel = 0;
const shakeCam = (timerLen, level) => {
shakeTimer.set(timerLen);
shakeLevel = level;
};
