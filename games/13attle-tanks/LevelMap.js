class LevelMap {
constructor(level = 1) {
this.level = level;
this.multiplier = level * 1.2;
const pathLen = 4 + ~~(this.multiplier);
const cellSize = Math.min(1e3 * this.multiplier, 1200);
this.cellSize = cellSize;
// console.log(, this.multiplier, ~~(4 * this.multiplier))
const { levelMap, route, levelSize } = generateMap(pathLen);
this.dimensions = vec2(levelSize);
this.size = vec2(levelSize).scale(cellSize);
this.route = route;
this.playerRouteIndex = 0;
this.playerRouteTimer = new Timer(1);
this.halfCell = cellSize / 2;
this.enemies = [];
this.enemiesPerRoom = Math.min(~~this.multiplier, 4);

this.walls = [];
for(i=levelMap.length;i--;){
const px = i % levelSize;
const py = ~~(i / levelSize)
const posX = (px * cellSize) + this.halfCell;
const posY = (py * cellSize) + this.halfCell;
if (levelMap[i] === 1) this.walls.push(new Wall({pos: vec2(posX, posY), size: vec2(cellSize)}));
}
const mapWidth = this.size.x;
const halfMapWidth = vec2(this.size.x / 2);
for(let i=3;i--;)for(let j=3;j--;){
if (!(i === 1 && j === 1)) {
 new Wall({pos: vec2(mapWidth * (i-1), mapWidth * (j-1)).add(halfMapWidth), size: this.size});
}
}
const unitSpacing = this.cellSize * .2 ;
for(i=1;i<route.length;i++) {
const cellCenter = vec2(...route[i]).scale(cellSize).add(vec2(this.halfCell));
for(let k=this.enemiesPerRoom;k--;) {
 const pos = cellCenter.addX(unitSpacing * ((k+1) % 2)).addY(unitSpacing * ((~~(k / 2) + 1) % 2));
 this.enemies.push(new EnemyUnit({
 pos,
 patrolPos: pos.addX(cellSize * .3),
 unitName: "ENEMY_TANK",
 }));
}
}
}

update() {
const { cellSize, route, playerRouteTimer } = this;
// where is the player currently on the route? (we'll check every second)
if (playerRouteTimer.elapsed()) {
let routeIndex = 0;
for (let i = 0; i < route.length; i++) {
 if (collided(player, {
 pos: vec2(...route[i]).scale(cellSize).add(vec2(this.halfCell)), size: vec2(cellSize)
 })) {
 routeIndex = i;
 break;
 }
}
this.playerRouteIndex = routeIndex;
this.playerRouteTimer.set(1);
}
}

isLevelComplete() { return this.enemies.filter(e => !e.isDead).length === 0;
}

render() {
let tilePos;
const HALF_TILE_VEC = vec2(HALF_TILE);
let i = -1;
while (i++ * TILE_SIZE < this.size.x) {
let j = -1;
while (j++ * TILE_SIZE < this.size.y) {
 tilePos = vec2(i, j).scale(TILE_SIZE).add(HALF_TILE_VEC);
 rect(tilePos, vec2(TILE_SIZE * .9), 0, 0, GRAY);
}
}
const { playerRouteIndex, route, cellSize, halfCell } = this;
const nextIndex = Math.min(playerRouteIndex + 1, route.length - 1);
if (route[nextIndex]) {
const targetPos = vec2(...route[nextIndex]).scale(cellSize).add(vec2(halfCell));
const angle = angleRadians(player.pos, targetPos);
line(player.pos.move(angle, 200), targetPos, BROWN, 20);
}
}
}

const generateMap = pathLen => {
const levelSize = pathLen * 1.3 >> 0;
const halfSize = levelSize / 2 >> 0
const pathStart = {x: halfSize, y: halfSize}
const pathPos = vec2(pathStart.x, pathStart.y);
const levelMap = new Array(levelSize * levelSize).fill(1);
const [DIR_U, DIR_L, DIR_D, DIR_R] = [1,2,3,4];
const getLevelPos = (posX, posY) => (
posX >= 0 && posY >= 0 && posX < levelSize && posY < levelSize ? levelMap[posY * levelSize + posX] : -1
);
const trackDir = [];
const route = [[pathStart.x, pathStart.y]];

levelMap[pathPos.y * levelSize + pathPos.x] = 0;
for(i=pathLen-1;i--;){
const { x, y } = pathPos;
const possibleDir = [];
const trackLen = trackDir.length;
const lastDir1 = trackLen - 1 >= 0 ? trackDir[trackLen - 1] : -1;
const lastDir2 = trackLen - 2 >= 0 ? trackDir[trackLen - 2] : -2;
const lastDir = lastDir1 === lastDir2 ? lastDir1 : 0;
if (lastDir !== DIR_U && y-1 >= 0 && ![[x,y-1],[x-1,y-1],[x+1,y-1],[x,y-2]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_U);
if (lastDir !== DIR_L && x-1 >= 0 && ![[x-1,y],[x-1,y-1],[x-1,y+1],[x-2,y]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_L);
if (lastDir !== DIR_D && y+1 < levelSize && ![[x,y+1],[x-1,y+1],[x+1,y+1],[x,y+2]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_D);
if (lastDir !== DIR_R && x+1 < levelSize && ![[x+1,y],[x+1,y-1],[x+1,y+1],[x+2,y]].find(([o,p]) => getLevelPos(o,p)===0))possibleDir.push(DIR_R);

if (possibleDir.length) {
const nextDir = possibleDir[~~(Math.random() * possibleDir.length)];
if (nextDir === DIR_U) pathPos.y -= 1;
if (nextDir === DIR_L) pathPos.x -= 1;
if (nextDir === DIR_D) pathPos.y += 1;
if (nextDir === DIR_R) pathPos.x += 1;
trackDir.push(nextDir);
levelMap[pathPos.x + pathPos.y * levelSize] = 0;
route.push([pathPos.x, pathPos.y]);
}
else return generateMap(pathLen, pathStart);
}
return { levelMap, route, levelSize };
};