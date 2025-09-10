let left = false;
let right = false;
let up = false;
let down = false;

document.addEventListener('keydown', e => {
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        left = true;
    }
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        right = true;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        up = true;
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        down = true;
    }
}, false);

document.addEventListener('keyup', e => {
    if (e.code == "ArrowLeft" || e.code == "KeyA") {
        left = false;
    }
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        right = false;
    }
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        up = false;
    }
    if (e.code == "ArrowDown" || e.code == "KeyS") {
        down = false;
    }
}, false);