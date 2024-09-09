var gameContext = {
    gameState: GameState.IDLE,
    mousePos: { x : 0, y : 0 },
    msRemaining: 0,

    update(ms) {
        if (this.msRemaining > 0)
        {
            this.msRemaining -= ms;
            if (this.msRemaining <= 0)
            {
                if (this.gameState == GameState.LEVELWON)
                {
                    this.setGameState(GameState.PLAYING);
                }
                else if (this.gameState == GameState.GAMEOVER)
                {
                    this.setGameState(GameState.IDLE);
                }
                return;
            }
        }
        
        if (this.gameState == GameState.PLAYING) {
            board.update(ms, this.mousePos);
            if (board.levelWon()) {
                this.setGameState(GameState.LEVELWON);
            }
            if (board.levelLost()) {
                this.setGameState(GameState.GAMEOVER);
            }
        }
    },

    render() {
        function drawSprite(sprite, pos, scale, alpha) {
            var a = alpha || 1.0;
            var s = scale || 1;
            var w = sprite.width * s;
            var h = sprite.height * s;
            var left = (pos.x - w / 2) / s;
            var top = (pos.y - h / 2) / s;
            context.save();
            context.scale(s, s);
            context.globalAlpha = a;
            context.drawImage(sprite, left, top);
            context.restore();
        }

        drawing.fillRect(0, 0, 1200, 800, "#407122");
       
        switch (this.gameState)
        {
            case GameState.IDLE:
                drawing.fillText("TURRETS AND TREBUCHETS", 600, 150, {font: "36px Arial", textAlign: "center"});
                drawing.fillText("It is the early 13th century and war rages across Europe. Your mission", 600, 300, {textAlign: "center"});
                drawing.fillText("is to attack and conquer the surrounding villages using the increasingly", 600, 340, {textAlign: "center"});
                drawing.fillText("popular long-range catapult, the trebuchet. However, the defenders also", 600, 380, {textAlign: "center"});
                drawing.fillText("have some tricks to make your task a lot less enjoyable.", 600, 420, {textAlign: "center"});
                drawing.fillText("Start by either loading your trebuchet (which increases the damage it", 600, 520, {textAlign: "center"});
                drawing.fillText("will make when hitting a village) or moving to a more favorable position.", 600, 560, {textAlign: "center"});
                drawing.fillText("Then attack one of the villages. When all your trebuchets have attacked", 600, 600, {textAlign: "center"});
                drawing.fillText("a village, the villages will counter-attack. You also need to watch out", 600, 640, {textAlign: "center"});
                drawing.fillText("for the medieval earthquakes - they are very unpredictable... Good luck!", 600, 680, {textAlign: "center"});
                break;
            case GameState.PLAYING:
                board.draw(drawSprite);
                break;
            case GameState.LEVELWON:
                drawing.fillText("LEVEL WON", 600, 400, {textAlign: "center"});
                break;
            case GameState.GAMEOVER:
                drawing.fillText("GAME OVER", 600, 400, {textAlign: "center"});
                if (board.newHighScore) {
                    drawing.fillText("New high score: " + board.highScore, 600, 440, {textAlign: "center"});
                }
                break;
            default:
                break;
        }
    },

    click()
    {
        switch (this.gameState)
        {
            case GameState.IDLE:
                this.setGameState(GameState.PLAYING);
                break;
            case GameState.PLAYING:
                board.click(this.mousePos);
                break;
            default:
                break;
        }
    },

    mouseMove(e)
    {
        var rect = canvas.getBoundingClientRect();
        this.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    },

    setGameState(newState) {
        switch(newState) {
            case GameState.PLAYING:
                board.reset();
                this.gameState = GameState.PLAYING;
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                break;
            case GameState.LEVELWON:
                this.gameState = GameState.LEVELWON;
                this.msRemaining = 800;
                break;
            case GameState.GAMEOVER:
                board.gameOver();
                this.gameState = GameState.GAMEOVER;
                this.msRemaining = 2000;
            default:
                this.gameState = newState;
        }
    },
}

