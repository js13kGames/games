function displayMenu() {
    menu = svgGroup();
    menu.appendChild(svgTower(0, 0));
    menu.appendChild(svgText("TOWER OF TERROR", 200, 100, "red", "Arial", 60));
    menu.appendChild(svgGoodLuck(300, 195));
    menu.appendChild(svgText("the lucky number is on your side", 330, 200, "red"));
    menu.appendChild(svgBadLuck(330, 235));
    menu.appendChild(svgText("the unlucky number is not", 360, 240, "red"));
    menu.appendChild(svgPortal(250, 275));
    menu.appendChild(svgText("the portals... you never know where you will end up", 280, 280, "red"));
    menu.appendChild(svgCat(120, 315));
    menu.appendChild(svgText("the black cats... your biggest fear... the horror makes you sweat and clouds your vision", 150, 320, "red"));
    menu.appendChild(svgHorseshoe(320, 355));
    menu.appendChild(svgText("the horseshoe is your way out", 350, 360, "red"));
    menu.appendChild(svgText("don't get stuck in the maze... and make sure your heart can take the horror of the black cats...", 130, 460, "red"));
    menu.appendChild(svgText("click to escape the tower... and the terror!", 300, 500, "red"));
    menu.appendChild(svgText("uses pl_synth (https://github.com/phoboslab/pl_synth) for audio", -150, 590, "blue"));
    svg.setAttribute("viewBox", "0 0 800 600");
    svg.appendChild(menu);
    svg.addEventListener("click", _startGame);
}

function _startGame(e) {
    svg.removeEventListener("click", _startGame);
    svg.removeChild(menu);
    menu = undefined;
    lives = 0;
    startLevel(0);
    gameState = GSPLAYING;
    if (!songNode) {
        songNode = play(songBuffer, true);
    }
}

let songNode = undefined;
let menu = undefined;
