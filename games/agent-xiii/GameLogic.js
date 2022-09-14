
function GameLogic() {
    GameLogic.prototype = this;
}

GameLogic.prototype.Explosions = [];
GameLogic.prototype.Score = 0;
GameLogic.prototype.GenerateRockWaitTime = 0;
GameLogic.prototype.Rocks = [];
GameLogic.prototype.Initialise = function () {
};

GameLogic.prototype.GenerateRock = function () {
    var rock = new Rock();
    rock.X = 680;
    rock.Speed = Math.floor((Math.random() * 3) + 3);
    rock.Y = Math.floor((Math.random() * 640) + 1);
    rock.SizeModifier = Math.floor((Math.random() * 5) + 1);
    rock.Score = rock.Y;

    var rand = Math.floor((Math.random() * 5) + 1);
    switch (rand) {
        case 0: rock.Colour = "brown"; break;
        case 1: rock.Colour = "orange"; break;
        case 2: rock.Colour = "purple"; break;
        case 3: rock.Colour = "white"; break;
        case 4: rock.Colour = "grey"; break;
    }

    return rock;
};

GameLogic.prototype._odd = true;
GameLogic.prototype.Tick = function () {
    if (GameLogic.prototype._odd) {
        GameLogic.prototype._odd = false;
        return;
    }
    else {
        GameLogic.prototype._odd = true;
    }

    GameLogic.prototype.GenerateRockWaitTime += 1;

    for (var i = 0; i < GameLogic.prototype.Rocks.length; i++) {
        var rock = GameLogic.prototype.Rocks[i];
        if (rock != null) {

            rock.X -= rock.Speed;
            var y = (Math.floor((Math.random() * 10) + 1)) - 5;

            if (rock.Y + y > 640)
                rock.Y -= y - 10;
            else if (rock.Y - y < 0)
                rock.Y += y + 10;
            else
                rock.Y += y;
        }
    }

    //collision?
    for (var j = 0; j < GameLogic.prototype.Rocks.length; j++) {
        var rock = GameLogic.prototype.Rocks[j];
        if (rock != null) {

            if (rock.X > Game.prototype.Ship.X - 20) {
                if (rock.X < Game.prototype.Ship.X + 30) {
                    if (rock.Y > Game.prototype.Ship.Y - 20) {
                        if (rock.Y < Game.prototype.Ship.Y + 20) {
                            GameLogic.prototype.Score += 10 * rock.SizeModifier;
                            GameLogic.prototype.Rocks[j] = null;
                            var explosion = new Explosion();
                            explosion.TL = { X: rock.X, Y: rock.Y };
                            explosion.TR = { X: rock.X, Y: rock.Y };
                            explosion.BL = { X: rock.X, Y: rock.Y };
                            explosion.BR = { X: rock.X, Y: rock.Y };
                            GameLogic.prototype.Explosions[GameLogic.prototype.Explosions.length] = explosion;
                        }
                    }
                }
            }
        }
    }

    //animate explosions for hit rubbush
    for (i = 0; i < GameLogic.prototype.Explosions.length; i++) {
        var speed = 3;
        if (GameLogic.prototype.Explosions[i] != null) {
            GameLogic.prototype.Explosions[i].TL.X += -speed;
            GameLogic.prototype.Explosions[i].TL.Y += -speed;
            GameLogic.prototype.Explosions[i].TR.X += speed;
            GameLogic.prototype.Explosions[i].TR.Y += -speed;
            GameLogic.prototype.Explosions[i].BL.X += -speed;
            GameLogic.prototype.Explosions[i].BL.Y += speed;
            GameLogic.prototype.Explosions[i].BR.X += speed;
            GameLogic.prototype.Explosions[i].BR.Y += speed;
        }
    }

    //clean up rocks
    for (i = 0; i < GameLogic.prototype.Rocks.length; i++) {
        if (GameLogic.prototype.Rocks[i] != null) {
            if (GameLogic.prototype.Rocks[i].X < -1) {
                if (GameLogic.prototype.Rocks[i].Y > 100 && GameLogic.prototype.Rocks[i].Y < 540) {
                    //the rock hit the earth, take off some health
                    Game.prototype.Ship.Health -= 5 * GameLogic.prototype.Rocks[i].SizeModifier;

                    if (Game.prototype.Ship.Health < 1) {
                        Game.prototype.GameOver = true;
                        Game.prototype.GameEnd = new Date().getTime();
                        Game.prototype.InGame = false;
                    }
                }
                GameLogic.prototype.Rocks[i] = null;
            }
        }
    }

    //clean up explosions
    for (i = 0; i < GameLogic.prototype.Explosions.length; i++) {
        if (GameLogic.prototype.Explosions[i] != null) {
            if (GameLogic.prototype.Explosions[i].TL.X < -500) {
                GameLogic.prototype.Explosions[i] = null;
            }
        }
    }

    if (GameLogic.prototype.GenerateRockWaitTime == 50) {
        GameLogic.prototype.Rocks[GameLogic.prototype.Rocks.length] = GameLogic.prototype.GenerateRock();
        GameLogic.prototype.GenerateRockWaitTime = 0;
    }
};

GameLogic.prototype.Render = function (context) {
    var rocks = GameLogic.prototype.Rocks;
    for (var i = 0; i < rocks.length; i++) {
        if (rocks[i] != null) {
            context.fillStyle = rocks[i].Colour;
            context.fillRect(rocks[i].X, rocks[i].Y, 4 * rocks[i].SizeModifier, 4 * rocks[i].SizeModifier);
        }
    }

    for (i = 0; i < GameLogic.prototype.Explosions.length; i++) {
        var explosion = GameLogic.prototype.Explosions[i];
        if (explosion != null) {
            var size = 5;
            context.fillStyle = "yellow";
            context.fillRect(explosion.TL.X, explosion.TL.Y, size, size);
            context.fillRect(explosion.TR.X, explosion.TR.Y, size, size);
            context.fillRect(explosion.BL.X, explosion.BL.Y, size, size);
            context.fillRect(explosion.BR.X, explosion.BR.Y, size, size);
        }
    }
};

function Rock() {
    return {
        Speed: 0,
        X: 0,
        Y: 0,
        SizeModifier: 0,
        Colour: "white",
        Score: 0
    };
}

function Explosion() {
    return {
        TL: 0,
        TR: 0,
        BL: 0,
        BR: 0
    };
}