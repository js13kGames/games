drawOverlay = (gameContext, ctx) => {
    switch(gameContext.gameState) {
        case GameState.IDLE: 
        case GameState.PAUSED:
            _background(ctx);
            fillText("track 404", dimensions.cx, 170, "40px Arial", "center", "white", ctx);
            _overlayText("target coin value is 404", 300, ctx);
            _overlayText("use left and right arrow to steer, space to boost", 340, ctx);
            _overlayText("hit coins for positive (green) or negative (red) value", 380, ctx);
            _overlayText("preserve energy by staying on the road and by hitting coins", 420, ctx);

            _overlayText("current high score: " + gameContext.highScore, 480, ctx);
            if (gameContext.gameState == GameState.IDLE) {
                _overlayText("click to play", 550, ctx);
            }
            else {
                _overlayText("paused - click to continue", 550, ctx);
            }
            break;
        case GameState.PAUSED_FOR_RESIZE:
            _background(ctx);
            fillText("404", dimensions.cx, 170, "40px Arial", "center", "white", ctx);
            _overlayText("requires a canvas area of at least 800 by 800 pixels", 300, ctx);
            if (!canvasIsLargeEnough()) {
                var {w, h} = getCanvasSize();
                _overlayText(`current size is ${w} by ${h} pixels`, 340, ctx);
                _overlayText("please resize your browser", 550, ctx);
            }
            else {
                _overlayText("ok - click to continue", 550, ctx);
            }
            break;
        case GameState.GAMEOVER:
            _background(ctx);
            _overlayText("game over", 300, ctx);
            _overlayText("final score: " + gameContext.score, 480, ctx);
            if (gameContext.highScoreSet) {
                _overlayText("new high score: " + gameContext.score, 520, ctx);
            }
            break;
        case GameState.WELLDONE:
            _background(ctx);
            _overlayText("well done", 300, ctx);
            _overlayText("current score: " + gameContext.score, 480, ctx);
            break;
        case GameState.PRESENTLEVEL:
            _background(ctx);
            _overlayText(`level ${gameContext.level} - \"${_courses[gameContext.course].name}\"`, 300, ctx);
            break;
        case GameState.PLAYING:
            fillRect(0, 0, dimensions.w, topRowHeight, "black", ctx);
            fillRect(10, 20, (dimensions.w - 20) * gameContext.energy / 500, 60, _energyBarGradient(ctx), ctx);
            drawCircle(dimensions.cx, 50, 50, 0, "", "black", ctx)
            drawCircle(dimensions.cx, 50, 40, 0, "", gameContext.valueNeeded() < 0 ? "red" : "green", ctx)
            fillText(gameContext.value, dimensions.cx, 60, "28px Arial", "center", gameContext.score > 404 ? "white" : "black", ctx);
            fillText(`coin value needed: ${gameContext.valueNeeded()}`, 100, 60, "24px Arial", "left", "white", ctx);
            fillText(`coin value needed: ${gameContext.valueNeeded()}`, dimensions.w-100, 60, "24px Arial", "right", "white", ctx);
            break;
    }
}

let _background = ctx => fillRect(0, 0, dimensions.w, dimensions.h, "black", ctx);

let _overlayText = (text, y, ctx) => fillText(text, dimensions.cx, y, "24px Arial", "center", "white", ctx);

let _energyBarGradient = ctx => {
    var g = ctx.createLinearGradient(0, 0, dimensions.w, 0);
    g.addColorStop(0, "red");
    g.addColorStop(0.5, "yellow");
    g.addColorStop(1, "green");
    return g;
}
