const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 640;
const height = 360;

const startScreen = +document.location.hash.substr(1);
let currentScreen = startScreen > 0 && startScreen < screens.length ? startScreen : 0;
document.location.hash = '#' + currentScreen;
let scale;
let offsetX, offsetY;
let transitioning;
let metDarkLord;
