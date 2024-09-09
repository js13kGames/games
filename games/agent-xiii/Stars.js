function Stars() {
    Stars.prototype = this;
    return this;
}

Stars.prototype.TickType = 0;
Stars.prototype.StarMapLayerX = [];
Stars.prototype.StarMapLayerY = [];
Stars.prototype.StarMapLayerTickCount = [];
Stars.prototype.StarCount = 150;

Stars.prototype.Initialise = function () {

    for (var i = 0; i < Stars.prototype.StarCount; i++) {
        var randomX = Math.floor((Math.random() * Game.prototype.Settings.ViewPort().width) + 1);
        var randomY = Math.floor((Math.random() * Game.prototype.Settings.ViewPort().height) + 1);
        Stars.prototype.StarMapLayerX[i] = randomX;
        Stars.prototype.StarMapLayerY[i] = randomY;
    }
};

Stars.prototype.Tick = function () {

    for (var i = 0; i < Stars.prototype.StarCount; i++) {
        //this should move the stars in layers
        if ((i % (Stars.prototype.TickType + 1)) == 0) {
            Stars.prototype.StarMapLayerX[i] -= 1;
            if (Stars.prototype.StarMapLayerX[i] == 0) {
                Stars.prototype.StarMapLayerX[i] = Game.prototype.Settings.ViewPort().width;
            }
        }
    }

    Stars.prototype.TickType += 1;
    if (Stars.prototype.TickType == 15) {
        Stars.prototype.TickType = 0;
    }
};

Stars.prototype.Render = function (context) {
    for (var i = 0; i < Stars.prototype.StarCount; i++) {

        var rand = Math.floor((Math.random() * 8) + 1);
        switch (rand) {
            case 0: context.strokeStyle = "white"; break;
            case 1: context.strokeStyle = "yellow"; break;
            case 2: context.strokeStyle = "red"; break;
            case 3: context.strokeStyle = "cyan"; break;
            case 4: context.strokeStyle = "green"; break;

            case 5: context.strokeStyle = "white"; break;
            case 6: context.strokeStyle = "white"; break;
            case 7: context.strokeStyle = "white"; break;
        }
        context.lineWidth = 1;
        var x = Stars.prototype.StarMapLayerX[i];
        var y = Stars.prototype.StarMapLayerY[i];
        Stars.prototype.DrawStar(context, x, y, 1);
    }
};

Stars.prototype.DrawStar = function (context, x, y, radius) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y - radius);
    context.lineTo(x + radius, y);
    context.lineTo(x, y + radius);
    context.lineTo(x - radius, y);
    context.lineTo(x, y);
    context.stroke();
};