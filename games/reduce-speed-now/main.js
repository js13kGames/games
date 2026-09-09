const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var lastTime = Date.now();
let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);
    update(dt);
    render(canvas.width, canvas.height);
    requestAnimationFrame(gameLoop);
    lastTime = now;
}

setTimeout(() => {
    gameLoop();
}, 100);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let w = canvas.width;
    let h = canvas.height;
    if (w / h > W / H) {
        _h = h;
        _w = _h * W / H;
        _x = (w - _w) / 2;
        _y = 0;
    } else {
        _w = w;
        _h = w * H / W;
        _x = 0;
        _y = (h - _h) / 2;
    }
    _cell = Math.min(_w / W, _h / H);
}

window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();
