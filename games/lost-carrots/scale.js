function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 4/3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    var gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;
}



function gameXToCanvasX(x){
    return x/game.gameWidth*gameCanvas.width;
}

function gameYToCanvasY(y){
    return y/game.gameHeight*gameCanvas.height;
}

function canvasXToGameX(x){
    return x*gameCanvas.width/game.gameWidth;
}

function canvasYToGameY(y){
    return y*gameCanvas.height/game.gameHeight;
}