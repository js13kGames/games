class GameObject {
constructor({pos, size, angle = 0, center, color, scale, moveSpeed, rotateSpeed, isSolid, team, hp, isImmovable, canDie}) {
this.pos = pos;
this.gridPos = getGridPos(pos);
this.size = size || vec2(1);
this.center = center || this.size.scale(.5);
this.color = color || GRAY;
this.scale = scale || 1;
this.angle = angle;
this.moveSpeed = moveSpeed || new Speed;
this.pushAngle = undefined;
this.pushBack = undefined;
this.rotateSpeed = rotateSpeed || new Speed;
this.isSolid = isSolid;
this.team = team || NO_COLLISION;
this.hp = hp || 1;
this.lastFlash = undefined;
this.isDead = false;
this.isImmovable = isImmovable;
this.canDie = canDie;
objList.push(this);
}

move(direction) { this.moveSpeed.move(direction); }
rotate(direction) { this.rotateSpeed.move(direction); }

update() {
const { moveSpeed, angle, pushAngle, pushBack, pos, size, rotateSpeed, canDie, hp, isDead } = this;
if (moveSpeed.speed !== 0) this.pos = pos.move(angle, moveSpeed.speed * tDiff);
if (pushBack !== undefined && pushAngle !== undefined) {
 this.pos = pos.move(pushAngle, pushBack * this.pushTimer.getPercent());
 if (this.pushTimer.elapsed()) this.pushAngle = this.pushBack = undefined;
}
if (rotateSpeed.speed !== 0) {
 const newAngle = (angle + rotateSpeed.speed * tDiff);
 this.angle = newAngle >= 0 ? (newAngle % PI2) : (PI2 + newAngle);
}
this.gridPos = getGridPos(pos);
if (canDie && hp <= 0 && !isDead) {
 new Explosion({pos: this.pos.copy(), size: size.scale(2), timeLen: 2, team: NO_COLLISION, sound: "death"});
 this.isDead = true;
 this.isFiring = false;
 this.team = NO_COLLISION;
}
}
pushObj(angle, pushBack) {
this.pushTimer = new Timer(.3);
this.pushAngle = angle;
this.pushBack = pushBack;
}
collidedWith(obj) {
if (debug) DEBUG_CONSOLE.push(`${this.constructor.name} collidedWith ${obj.constructor.name}`);
}
render() {
const { pos, size, angle, center, color } = this;
rect(pos, size, angle, center, color);
}
toString() { return `pos,gridPos,size,angle,center,color,moveSpeed,rotateSpeed`.split`,`.map(n=>`${n}: ${formatNum(this[n])}`); }
}
