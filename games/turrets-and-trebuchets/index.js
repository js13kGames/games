const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const drawing = createDrawing(context);

let lastTime = Date.now();

gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime);
    gameContext.update(dt);
    gameContext.render();
    requestAnimationFrame(gameLoop);
    lastTime = now;
}

initialize = () => {
    window.addEventListener('resize', () => {
        handleResize();
    });
    canvas.addEventListener('click', () => {
        gameContext.click();
    });
    canvas.addEventListener("mousemove", e => {
        gameContext.mouseMove(e);
    });
    handleResize();
    gameLoop();
}

handleResize = () => {
    canvas.width = 1200;
    canvas.height = 800;
    canvas.style.marginTop = `${(window.innerHeight - 800) / 2}px`;
    canvas.style.marginLeft = `${(window.innerWidth - 1200) / 2}px`;
}

window.addEventListener('load', () => initialize()); 