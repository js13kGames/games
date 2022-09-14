drawDebugInfo = () => {
    var l = dimensions.minX - gameContext.x;
    var t = dimensions.minY - gameContext.y;
    var r = dimensions.maxX - gameContext.x;
    var b = dimensions.maxY - gameContext.y;

    fillText(`Offset: ${gameContext.x}, ${gameContext.y}`, 100, 150, '16px Arial', 'left', 'white', context);
    fillText(`Scroll: ${gameContext.scrollX}, ${gameContext.scrollY}`, 100, 200, '16px Arial', 'left', 'white', context);
    fillText(`Visible area: (${l}, ${t}) - (${r}, ${b})`, 100, 250, '16px Arial', 'left', 'white', context);    
    if (gameContext.gameState == GameState.PLAYING) {
        _renderPoint(gameContext.car.frontLeft, "red");
        _renderPoint(gameContext.car.frontRight, "white");
        _renderPoint(gameContext.car.rearRight, "green");
        _renderPoint(gameContext.car.rearLeft, "blue");
        gameContext.roads.forEach(r => {
            context.strokeStyle = "white";
            var {x, y, w, h} = getRoadRectangle(r);
            context.strokeRect(x, y, w, h);
        });
        gameContext.environment.forEach(e => {
            var r = getEnvironmentRectangle(e);
            if (r) {
                context.strokeStyle = "red";
                context.strokeRect(r.x, r.y, r.w, r.h);
            }    
        });
    }
}

_renderPoint = (p, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(p.x, p.y, 3, 0, Math.PI*2);
    context.fill();
}
