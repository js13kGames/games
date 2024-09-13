let globalScale = .8;
let time = tDiff = 0;
let scene = SCENE.START;
let cameraPos = null;
let objList = [];
let SCREEN_SIZE = vec2(1080);

const THINK_RATE = .05;
const PLAYER_DETECT_RANGE = 800;
const ENEMY_ATTACK_RANGE = 400;

let currMap;
let player;

const startLevel = level => {
objList = [];
currMap = new LevelMap(level);
const { route, cellSize } = currMap;
const [startX, startY] = route[0];
player = new PlayerUnit({pos: vec2(startX, startY).scale(cellSize).add(vec2(cellSize / 2))});
scene = SCENE.LEVEL;
};

let keys = {};
onkeydown=onkeyup=e=>{
keys['E**S***************s****lurd************************lBCr*F***J***N**lRdT*VuXYu'[e.which-13]]=e.type[5]
};

if (debug) window.addEventListener("wheel", e => {
const direction = (e.detail < 0) ? 1 : (e.wheelDelta > 0) ? 1 : -1;
globalScale = Math.min(3, Math.max(0.1, globalScale + direction * .2));
});

E=t=>{x.reset(tDiff = t - time)
time = t;
if (player && !player.isDead) {
player.move(keys.u ? 1 : keys.d ? -1 : 0);
player.rotate(keys.r ? 1 : keys.l ? -1 : 0);
player.isFiring = keys.s || keys.J || keys.X;
}

if (scene === SCENE.START) {
const screenCenter = cameraPos = SCREEN_SIZE.scale(.5);
text("13attle Tanks", screenCenter.addY(-300), 100);
text("Press 'space', 'j', 'x' to Fire & Start Game", screenCenter.addY(-200), 60);
text("WASD/ZQSD/arrow keys to move", screenCenter.addY(-100), 60);
if (!player) player = new PlayerUnit({pos: screenCenter.addY(100).copy(), angle: 2, scale: 3 });
if (!keys.r && !keys.l) player.rotate(9);
player.update();
player.render();
if (keys.s || keys.J || keys.X) startLevel(1);
}
else if (scene === SCENE.LEVEL) {
if (player) {
objList = objList.filter(o => !o.delete).sort((a, b) => a.isDead ? -1 : (a.pos?.y - a.center.y) - (b.pos?.y - b.center.y));
if (!shakeTimer.elapsed()) cameraPos = player.pos.copy().move(random() * PI2, shakeLevel * 20);
else cameraPos = player.pos.copy();
for(o of [...objList, currMap])o&&o.update();
}
const len = objList.length;
for(i=0;i<len-1;i++)for(j=i+1;j<len;j++)
if(collided(o=objList[i],p=objList[j])){o.collidedWith(p);p.collidedWith(o);}

for(o of [currMap, ...objList])o.render(time);

if (currMap.isLevelComplete()) startLevel(currMap.level + 1);

if (player && player.isDead) {
const screenCenter = cameraPos;
text("Game Over", screenCenter.addY(-300), 100, 0, MAROON);
text("Press 'space', 'j', 'x' to go back to menu", screenCenter.addY(-100), 60, MAROON);
if (keys.s || keys.J || keys.X) {
objList = [];
scene = SCENE.START;
player = null;
keys = {};
}
}
else {
const screenCenter = cameraPos;
text("Level " + currMap.level, screenCenter.addY(-550), 100, 0, DARK_GRAY);
}
}

if (debug) {
x.font="16px'";
x.fillStyle="black";
let startPos = vec2(50, 30);
[
`currMap.playerRouteIndex = ${currMap?.playerRouteIndex}`,
`globalScale = ${globalScale}`,
`objList.length: ${objList.length}`,
keys,
...DEBUG_CONSOLE,
].map((s, i) => x.fillText(JSON.stringify(s), startPos.x, startPos.y + (i * 30)))

DEBUG_CONSOLE = [];
}}