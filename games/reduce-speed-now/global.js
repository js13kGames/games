const MENU = 1;
const PLAYING = 2;
const LEVELCLEARED = 3;
const LEVELFAILED = 4;
const WON = 5;

const W = 160;
const H = 100;

let level = 0;
let state = MENU;
let wonObjects = [];

let energy = 100;
let distance = 0; // Distance car has travelled around track
let curvature = 0; // Current track curvature, lerped between track sections
let trackCurvature = 0; // Accumulation of track curvature
let trackDistance = 0; // Total distance of track
let car = { pos : 0 }; // Current car position
let steeringFactor = 2; // Steering factor, can be modified by power-ups
let playerCurvature = 0; // Accumulation of player curvature
let speed = 0; // Current player speed
let tracks = []; // Track sections, sharpness of bend, length of section
let rainbowCoins = [];
let increaseSpeedCoins = [];
let decreaseSpeedCoins = [];
let increaseSteeringFactorCoins = [];
let decreaseSteeringFactorCoins = [];
let unicorns = [];
let onEdge = false;
let delta = 0;

let totalTime = 0;

let visualCoordinates = {};
let deadObjects = {};
let debug = true;

let infoFont;
let infoTimer;

let skyFrom = -1;
let skyTransitionStart = -999999;

let carTilt = 0;

let levelFailedMenuItemSelected = 0;

let nextLevel = () => {
    level++;

    let rp, isp, dsp, isfp, dsfp;
    switch(level) {
        case 1:
            rp = 40, isp = 50, dsp = 70, isfp = 85, dsfp = 90;
            break;
        case 2:
            rp = 35, isp = 50, dsp = 70, isfp = 85, dsfp = 90;
            break;
        case 3:
            rp = 32, isp = 50, dsp = 70, isfp = 80, dsfp = 90;
            break;
        case 4:
            rp = 32, isp = 53, dsp = 70, isfp = 80, dsfp = 90;
            break;
        case 5:
            rp = 30, isp = 55, dsp = 70, isfp = 80, dsfp = 90;
            break;
    }

    energy = 100;
    distance = 0;
    curvature = 0;
    trackCurvature = 0;
    trackDistance = 0;
    car = { pos : 0 };
    steeringFactor = 2;
    playerCurvature = 0;
    speed = 0;

    tracks = [[0.8, 100]];
    for (let i = 0; i < 20 + 3 * level; i++) {
        let maxSharpness = 0.3 + 0.1 * level;
        let sharpness = Math.random() * maxSharpness;
        if (Math.random() < 0.5) {
            sharpness = -sharpness;
        }
        let length = Math.random() * 100 + 50;
        tracks.push([sharpness, length]);
    }
    trackDistance = 0;
    for (let t of tracks) {
        trackDistance += t[1];
    }

    rainbowCoins = [];
    increaseSpeedCoins = [];
    decreaseSpeedCoins = [];
    increaseSteeringFactorCoins = [];
    decreaseSteeringFactorCoins = [];
    unicorns = [];
    let d = 10 + Math.random() * 50;
    while (d < trackDistance) {
        let type = Math.floor(Math.random() * 100);
        let x = Math.random() * 0.8 + 0.1;
        if (type <= rp) {
            rainbowCoins.push({ ahead: d, left: x, asset: rainbowCoinAsset });
        } else if (type <= isp) {
            increaseSpeedCoins.push({ ahead: d, left: x, asset: increaseSpeedCoinAsset });
        } else if (type <= dsp) {
            decreaseSpeedCoins.push({ ahead: d, left: x, asset: decreaseSpeedCoinAsset });
        } else if (type < isfp) {
            increaseSteeringFactorCoins.push({ ahead: d, left: x, asset: increaseSteeringFactorCoinAsset });
        } else if (type < dsfp){
            decreaseSteeringFactorCoins.push({ ahead: d, left: x, asset: decreaseSteeringFactorCoinAsset });
        } else {
            unicorns.push({ ahead: d, left: x, asset: unicornAsset });
        }
        d += 10 + Math.random() * 50;
    }

    visualCoordinates = {};
    deadObjects = {};

    infoFont = 10;
    infoTimer = 0;
}

let increaseEnergy = by => {
    energy += by;
    if (energy > 100) {
        energy = 100;
    }
}

let decreaseEnergy = by => {
    energy -= by;
    if (energy < 0) {
        energy = 0;
    }
}

let increaseSpeed = by => {
    speed += by;
    if (speed > 5) {
        speed = 5;
    }
}

let decreaseSpeed = by => {
    speed -= by;
    if (speed < 0.5) {
        speed = 0.5;
    }
}

let increaseSteeringFactor = by => {
    steeringFactor += by;
    if (steeringFactor > 5) {
        steeringFactor = 5;
    }
}

let decreaseSteeringFactor = by => {
    steeringFactor -= by;
    if (steeringFactor < 1) {
        steeringFactor = 1;
    }
}