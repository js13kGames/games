window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
    

function animLoop() {
    game.nowTime = Date.now();
    //var dt = (now - last)/16.66666666666666 * (.8);
    
    var dt = (game.nowTime-game.lastTime)/1000;
    update(dt);
    draw.drawScene();
    requestAnimFrame(animLoop);
    game.lastTime = game.nowTime;
    
}

function update(dt){    
    //Example of key handling
    if(game.keys[82]){
        console.log("new!");
        game = new gameObject();
        game.init();
    }

    //Example of update loop
    for(var p = 0; p < game.players.length; p++){
        game.players[p].update(dt);
    } 

    for(var c = 0; c < game.coordinates.length; c++){
        game.coordinates[c].update(dt);
    }

    for(var c = 0; c < game.carrots.length; c++){
        game.carrots[c].update(dt);
        if(Math.sqrt((game.carrots[c].x - game.players[0].x)*(game.carrots[c].x - game.players[0].x) + (game.carrots[c].y - game.players[0].y)*(game.carrots[c].y - game.players[0].y)) < 5)
        {
            game.yumTimer = 1;
            game.carrots.splice(c, 1);
            game.carrotsFound++;
            game.players[0].currentLife+=20;            
            if(game.carrotsFound - Math.ceil(game.level*game.level) == 0)
            {
                game.level++;
                game.players[0].metabolism*= 1.3;
                game.players[0].moveSpeed+=10;  
                game.players[0].turnSpeed+=.5;  
           
            console.log(game.players[0].width);
            }
        }


    }

    for(var c = 0; c < game.coordinates.length; c++){        
        if(Math.sqrt((game.coordinates[c].x - game.players[0].x)*(game.coordinates[c].x - game.players[0].x) + (game.coordinates[c].y - game.players[0].y)*(game.coordinates[c].y - game.players[0].y)) < 4)
        {
            if(game.brambleTimer <= 0)
            {
            game.brambleTimer = 1;            
            game.players[0].currentLife-=20;            
        }

        }


    }

    game.carrotTimer -= dt;
    game.yumTimer -= dt;
    game.brambleTimer -= dt;
    if(game.players[0].velocity > 10)
    {
    game.legTimer -= dt;
}

    if(game.legTimer < 0)
    {
        game.players[0].legWobble *= -1;
        game.legTimer =.2;

    }

    if(game.carrotTimer < 0)
    {
        game.addCarrots();
        game.carrotTimer = 15;
    }
}

game = new gameObject();
game.init();
draw = new drawCameraCentricObject();
//draw = new drawPlayerCentricObject();
resizeGame();
animLoop();