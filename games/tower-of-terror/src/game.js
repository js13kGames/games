let side = 80;

let level = undefined;

const GSMENU = 0;
const GSPLAYING = 1;
const GSLEVELWON = 2;
const GSLEVELLOST = 3;
const GSGAMEWON = 4;
const GSGAMELOST = 5;

let lives = 0;
let gameState = GSMENU;

let waitScreen = svgGroup();
waitScreen.appendChild(svgText("...please wait... preparing the tower...", 250, 200, "red"));
svg.setAttribute("viewBox", "0 0 800 600");
svg.appendChild(waitScreen);

var lastTime = Date.now();

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);
    updateView(dt);
    requestAnimationFrame(gameLoop);
    lastTime = now;
}

setTimeout(() => {
    initSound();
    svg.removeChild(waitScreen);
    displayMenu();
    gameLoop();
}, 100);
