const TILE_SIZE = 100;
const HALF_TILE = TILE_SIZE / 2;
const SCENE = {
START: 1,
LEVEL: 2,
GAMEOVER: 3,
};
const debug = 0;
let DEBUG_CONSOLE = [];

const SOUND = {
"boom": () => zzfx(...[.7,,51,.03,.17,.19,2,2.1,7,-20,,,.07,,,,.17,.56,.14,.25]),
"powerUp": () => zzfx(...[,,119,,.19,.09,2,2.3,-6,-13,,,,,,,.25,.86,.14,,-1258]),
"shoot": () => zzfx(...[1,,684,.05,.1,0,1,3,.2,,,,,.4,137,1,,.7,,,204]),
"death": () => zzfx(...[1.6,,618,.1,.08,.29,3,2.4,,-98,,,,,126,.1,.17,.51,.33,.1]),
"plasma": () => zzfx(...[,,143,.02,.03,.14,2,.5,-14,-11,,,,,14,,.05,.96,.12]),
"plasmaHit": ()=>zzfx(...[.3,,359,.1,.19,.2,3,3.6,5.9,,,,.07,,104,,,-0.02,.1]),
};
const STATE = {
PATROL: 1,
ATTACK: 2,
};
const COLORS = "000000,1D2B53,7E2553,008751,AB5236,5F574F,C2C3C7,FFF1E8,FF004D,FFA300,FFEC27,00E436,29ADFF,83769C,FF77A8,FFCCAA".split`,`.map(c=>"#"+c);
const [BLACK, DARK_BLUE, MAROON, DARK_GREEN, BROWN, DARK_GRAY, GRAY, WHITE, RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, PINK, SKIN] = COLORS;
const WEAPON = {
"BASIC_GUN": {
size: 10,
speed: 500,
range: 300,
color: RED,
followRate: 0,
explosion: {
size: 40,
damage: 10,
pushBack: 100,
timeLen: .3,
},
firingRate: 1,
damage: 10,
},
"PLASMA_GUN": {
size: 5,
speed: 900,
range: 400,
sound: "plasma",
explosion: {
size: 5,
pushBack: 10,
sound: "plasmaHit",
},
color: YELLOW,
firingRate: .2,
damage: 5,
},
"ENEMY_GUN": {
size: 10,
speed: 500,
range: 300,
color: YELLOW,
followRate: 0,
explosion: {
size: 40,
damage: 10,
pushBack: 40,
timeLen: .2,
},
firingRate: 4,
damage: 10,
},
};
const UNIT = {
"PLAYER": {
color: BLUE,
cannonColor: DARK_BLUE,
size: [80, 100],
speed: [300, 0, 600, 1000],
rotateSpeed: [3, 0, 12, 20],
weaponName: "BASIC_GUN",
hp: 100
},
"ENEMY_TANK": {
color: ORANGE,
size: [80, 100],
speed: [100, 0, 600, 1000],
rotateSpeed: [2, 0, 12, 20],
weaponName: "ENEMY_GUN",
hp: 40,
},
};

const ITEM = {
"HEALTH": {
label: "H",
color: MAROON,
textColor: WHITE,
hp: 30,
},
}