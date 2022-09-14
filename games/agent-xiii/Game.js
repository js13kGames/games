/// <reference path="Stars.js" />
/// <reference path="Ship.js" />
/// <reference path="TypeWriter.js" />
/// <reference path="GameLogic.js" />

function Game() {
    Game.prototype = this;
    return this;
};

Game.prototype.keysDown = {};
Game.prototype.Canvas = null;  
Game.prototype.Context = null;
Game.prototype.Ship = null;
Game.prototype.Stars = null;
Game.prototype.Images = null;
Game.prototype.TypeWriter = null;
Game.prototype.TickCount = 0;
Game.prototype.FPS = 0;
Game.prototype.LastTickCount = new Date().getTime();
Game.prototype.GameEnd = null;
Game.prototype.Logic = null;
Game.prototype.Debug = false;
Game.prototype.GameStartTime = null;
Game.prototype.ShowTitleScreen = true;
Game.prototype.ShowHelp = false;
Game.prototype.StartGame = false;
Game.prototype.InGame = false;
Game.prototype.GameOver = false;
Game.prototype.FadeStepCount = 0;


Game.prototype.Settings = {
    ShowFPS: true,
    ViewPort: function () {
        //        var e = window, a = 'inner';
        //        if ( !( 'innerWidth' in window )){
        //            a = 'client';
        //            e = document.documentElement || document.body;
        //        }
        //        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
        return { width: 640, height: 480 };
    }
};


Game.prototype.Initialise = function () {
    var controller = Game.prototype;

    addEventListener("keydown", function (e) {
        Game.prototype.keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete Game.prototype.keysDown[e.keyCode];
    }, false);

    addEventListener("mousedown", function (e) {
        if (Game.prototype.InGame) {
            if (e.clientY < Game.prototype.Ship.Y) {
                Game.prototype.keysDown[38] = true;
            } else {
                Game.prototype.keysDown[40] = true;
            }
        }
    }, false);

    addEventListener("mouseup", function () {
        delete Game.prototype.keysDown[38];
        delete Game.prototype.keysDown[40];
    }, false);

    Game.prototype.TypeWriter = new TypeWriter();
    controller.Canvas = document.getElementById("gameCanvas");
    controller.Canvas.width = Game.prototype.Settings.ViewPort().width;
    controller.Canvas.height = Game.prototype.Settings.ViewPort().height;

    controller.Context = controller.Canvas.getContext("2d");
    controller.Ship = new Ship();
    controller.Stars = new Stars();
    controller.Logic = new GameLogic();
    controller.Stars.Initialise();
    controller.TypeWriter.Initialise();
    controller.Logic.Initialise();

    setInterval(controller.Tick, 5);
    setInterval(controller.Render, 60);

    var settings = new TypeWriterSettings();
    settings.Speed = 80;
    settings.Text = "Millions of lightyears away, in a far distant galaxy, AgentXIII is about to embark on one of the most important missions known to man... To clear the galaxy of space junk!!!!";
    Game.prototype.TypeWriter.TypeText(settings, controller.Context);
};

Game.prototype.Update = function () {//modifier) {
    var controller = Game.prototype;
    var ship = controller.Ship;

    if (controller.InGame) { //IN GAME!
        if (38 in Game.prototype.keysDown) { // Player holding up
            ship.Up();
        }
        if (40 in Game.prototype.keysDown) { // Player holding down
            ship.Down();
        }
        if (37 in Game.prototype.keysDown) { // Player holding left
            ship.Left();
        }
        if (39 in Game.prototype.keysDown) { // Player holding right
            ship.Right();
        }
        if (90 in Game.prototype.keysDown) { //Z
            ship.Boost = true;
        }
        if (88 in Game.prototype.keysDown) { //X          
        }
    }
    else {
        if (controller.GameOver)
            return;

        if (90 in Game.prototype.keysDown) { //Z
            controller.ShowTitleScreen = false;
            controller.ShowHelp = false;
            controller.InGame = true;
            controller.GameStartTime = new Date().getTime();

        }
        if (controller.ShowTitleScreen) {
            if (88 in Game.prototype.keysDown) { //X
                controller.ShowTitleScreen = false;
                controller.ShowHelp = true;

                var settings = new TypeWriterSettings();
                settings.Speed = 80;
                settings.Text = "The aim of the game is to collide your space ship into junk, to break it apart and protect the earth from atmospheric junk. Controls: Up, Down, Left, Right arrow keys to control the ship, and hold Z for nitro boost! Mobile users click the screen to move the ship in the Y direction";
                Game.prototype.TypeWriter.Clear();
                Game.prototype.TypeWriter.TypeText(settings, controller.Context);
            }
        }
    }
};

Game.prototype.Render = function () {
    var controller = Game.prototype;

    controller.Context.fillStyle = "#000000";
    controller.Context.fillRect(0, 0, Game.prototype.Settings.ViewPort().width, Game.prototype.Settings.ViewPort().height);
    controller.Stars.Render(controller.Context);

    if (controller.ShowTitleScreen) {
        var img = new Image();
        img.src = "agent13.png";
        controller.Context.fillStyle = "#72AFFF";
        controller.Context.fillRect(100, 50, 440, 280);
        controller.Context.drawImage(img, 120, 70, 100, 100);
        controller.TypeWriter.Render(controller.Context, 300);

        controller.Context.fillStyle = "yellow";
        controller.Context.font = "bold 70px Courier New";
        controller.Context.fillText("AgentXIII", 150, 300);

        controller.Context.fillStyle = "white";
        controller.Context.font = "bold 14px Courier New";
        controller.Context.fillText("PRESS 'Z' TO START", 250, 350);
        controller.Context.fillText("PRESS 'X' FOR HELP", 250, 370);

    }

    if (controller.ShowHelp) {

        var img = new Image();
        img.src = "agent13.png";


        controller.Context.fillStyle = "#72AFFF";
        controller.Context.fillRect(100, 50, 440, 280);
        controller.Context.drawImage(img, 120, 70, 100, 100);
        controller.TypeWriter.Render(controller.Context, 300);


        //controller.Context.fillStyle = "yellow";
        //controller.Context.font = "bold 70px Courier New";
        //controller.Context.fillText("AgentXIII", 150, 300);


        controller.Context.fillStyle = "white";
        controller.Context.font = "bold 14px Courier New";
        controller.Context.fillText("PRESS 'Z' TO START", 250, 350);
    }

    if (controller.InGame) { //IN GAME!
        controller.Logic.Render(controller.Context);

        controller.Context.fillStyle = "white";
        controller.Context.font = "bold 20px Courier New";
        controller.Context.fillText("Score:" + GameLogic.prototype.Score, 500, 465);

        controller.Context.fillStyle = "white";
        controller.Context.font = "bold 20px Courier New";
        var time = new Date().getTime() - controller.GameStartTime;
        controller.Context.fillText((time / 1000) + "s", 50, 465);

        //render atmosphere
        controller.Context.beginPath();
        controller.Context.arc(-70, 242, 160, 0, 2 * Math.PI, false);
        controller.Context.strokeStyle = "#555555";
        controller.Context.lineWidth = 3;
        controller.Context.fillStyle = "#444444";
        if (Game.prototype.Ship.Health < 400) {
            controller.Context.fillStyle = "#333333";
            controller.Context.strokeStyle = "#444444";
        }
        if (Game.prototype.Ship.Health < 300) {
            controller.Context.fillStyle = "#222222";
            controller.Context.strokeStyle = "#333333";
        }
        if (Game.prototype.Ship.Health < 200) {
            controller.Context.strokeStyle = "#222222";
            controller.Context.fillStyle = "#111111";
        }
        if (Game.prototype.Ship.Health < 100) {
            controller.Context.strokeStyle = "#111111";
            controller.Context.fillStyle = "#000000";
        }
        controller.Context.fill();
        controller.Context.stroke();

        //render earth
        controller.Context.beginPath();
        controller.Context.arc(-100, 240, 150, 0, 2 * Math.PI, false);
        controller.Context.fillStyle = "blue";
        controller.Context.fill();

        controller.Context.beginPath();
        controller.Context.moveTo(0, 170);
        controller.Context.lineTo(15, 190);
        controller.Context.lineTo(22, 220);
        controller.Context.lineTo(17, 280);
        controller.Context.lineTo(0, 290);
        controller.Context.fillStyle = "green";
        controller.Context.fill();

        controller.Context.beginPath();
        controller.Context.moveTo(20, 290);
        controller.Context.lineTo(25, 295);
        controller.Context.lineTo(27, 310);
        controller.Context.lineTo(20, 330);
        controller.Context.lineTo(15, 330);
        controller.Context.lineTo(12, 310);
        controller.Context.fillStyle = "green";
        controller.Context.fill();

        controller.Ship.Render(controller.Context);
    }

    if (controller.GameOver) {
        controller.ShowTitleScreen = false;
        controller.ShowHelp = false;
        controller.StartGame = false;
        controller.InGame = false;

        controller.Context.fillStyle = "white";
        controller.Context.font = "bold 50px Courier New";

        controller.Context.fillText("Game Over!!", 150, 150);
        controller.Context.font = "bold 30px Courier New";

        controller.Context.fillText("Score:" + GameLogic.prototype.Score, 220, 250);
        var time = controller.GameEnd - controller.GameStartTime;
        controller.Context.fillText((time / 1000) + "s", 220, 200);
        controller.Context.fillText("Check out my blog: ", 100, 300);
        controller.Context.fillText("http://craigpayne.info", 100, 340);
    }

    if (controller.Debug) {
        var explosionCount = 0;
        for (var i = 0; i < GameLogic.prototype.Explosions.length; i++) {
            if (GameLogic.prototype.Explosions[i] != null)
                explosionCount += 1;
        }
        var rockCount = 0;
        for (i = 0; i < GameLogic.prototype.Rocks.length; i++) {
            if (GameLogic.prototype.Rocks[i] != null)
                rockCount += 1;
        }

        controller.Context.fillStyle = "white";
        controller.Context.font = "bold 16px Courier New";
        controller.Context.fillText(
            " Rocks:" + rockCount +
            " Explosions:" + explosionCount +
            " ShipX:" + controller.Ship.X +
            " ShipY:" + controller.Ship.Y, 5, 465);
    }
};

Game.prototype.Tick = function () {
    var controller = Game.prototype;
    controller.Update();
    var stars = controller.Stars;
    stars.Tick();

    if (controller.InGame) { //IN GAME!
        var ship = Game.prototype.Ship;
        ship.Tick();
        var gameLogic = Game.prototype.Logic;
        gameLogic.Tick();
    }
};
