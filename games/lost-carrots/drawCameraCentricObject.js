function drawCameraCentricObject(cameraX, cameraY){
    this.cameraX = cameraX;
    this.cameraY = cameraY;
    //Function to draw the entire screen
    this.drawScene = function(){
        var gameCanvas = document.getElementById('gameCanvas');
        var ctx= gameCanvas.getContext("2d");        

            //Bounding Rect    
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); 
            draw.drawFilledRectCentered(game.gameWidth/2, game.gameHeight/2, game.gameWidth, game.gameHeight, "#2E8B57");                

            for(var p = 0; p < game.players.length; p++){                
                game.players[p].draw();
            }

            for(var b = 0; b < game.carrots.length; b++){
                game.carrots[b].drawCarrot();
            }

            for(var b = 0; b < game.coordinates.length; b++){
                game.coordinates[b].draw();
            }


            ctx.stroke();    
            ctx.closePath();
            //Scaling rect 
            ctx.beginPath();
            ctx.fillStyle = "#000000";     
            ctx.rect(0, gameCanvas.height - gameYToCanvasY(20), gameCanvas.width, gameCanvas.height);       
                draw.drawInfoText(10, 15, "Hunger: " + Math.floor(game.players[0].currentLife));
                draw.drawInfoText(10, 12, "Carrots collected: " + game.carrotsFound);
                draw.drawInfoText(30, 15, "Level: " + game.level);
                draw.drawInfoText(30, 12, "Next Level: " + (Math.ceil(game.level*game.level) - game.carrotsFound) + " Carrots");

                draw.drawInfoText(50, 12, "Metabolism: " + Math.floor(game.players[0].metabolism*100));
                draw.drawInfoText(50, 15, "Carrots available: " + game.carrots.length);
                draw.drawInfoText(70, 12, "New carrots in: " + Math.floor(game.carrotTimer));


            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            
    }

    //Draw Primitives
    this.drawRect = function(gameX, gameY, gameWidth, gameHeight)
    {
        var gameCanvas = document.getElementById('gameCanvas');
        var ctx= game.ctx;  

        ctx.rect(gameXToCanvasX(gameX), gameYToCanvasY(gameY), gameXToCanvasX(gameWidth), gameYToCanvasY(gameHeight));
        ctx.stroke();
    }

    this.drawInfoText = function(gameX, gameY, text)
    {
        var ctx = game.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#00FF00";
        ctx.fillText(text, gameXToCanvasX(gameX), gameYToCanvasY(game.gameHeight - gameY));    
        ctx.stroke();
        ctx.restore();
    }

    this.drawPlayerRect = function(gameX, gameY, gameWidth, gameHeight, orientation)
    {
        var gameCanvas = document.getElementById('gameCanvas');
        var ctx= game.ctx;
        var ship = game.players[0];
        ctx.save();
        ctx.translate(gameXToCanvasX(game.players[0].x + game.gameWidth/2 - this.cameraX ), gameYToCanvasY(-game.players[0].y + game.gameHeight/2 + this.cameraY));
        
        ctx.rotate(toRad(-orientation+90));
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();



            
            ctx.rect(gameXToCanvasX(-ship.width/2 - ship.width), gameYToCanvasY(ship.legWobble), gameXToCanvasX(gameWidth/2), gameYToCanvasY(gameHeight));            
             ctx.rect(gameXToCanvasX(ship.width), gameYToCanvasY(ship.legWobble), gameXToCanvasX(gameWidth/2), gameYToCanvasY(gameHeight));
             ctx.rect(gameXToCanvasX(-ship.height/2), gameYToCanvasY(ship.height/8), gameXToCanvasX(ship.height), gameYToCanvasY(ship.width*2));
             ctx.rect(gameXToCanvasX(-.5), gameYToCanvasY(-ship.height/8), gameXToCanvasX(1), gameYToCanvasY(1));
             ctx.rect(gameXToCanvasX(-.75), gameYToCanvasY(-ship.height/9), gameXToCanvasX(.5), gameYToCanvasY(2));
             ctx.rect(gameXToCanvasX(.25), gameYToCanvasY(-ship.height/9), gameXToCanvasX(.5), gameYToCanvasY(2));

ctx.fill();
        ctx.closePath();
                ctx.stroke();

        ctx.restore();





    }

    this.drawRectCentered = function(gameX, gameY, gameWidth, gameHeight, color)
    {
        
        var gameCanvas = document.getElementById('gameCanvas');
        var ctx= gameCanvas.getContext("2d");   
        ctx.save();
        ctx.beginPath();
        ctx.rect(gameXToCanvasX(gameX-gameWidth/2), gameYToCanvasY(gameY-gameHeight/2), gameXToCanvasX(gameWidth), gameYToCanvasY(gameHeight));
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    
    this.drawFilledRectCentered = function(gameX, gameY, gameWidth, gameHeight, color)
    {
        var gameCanvas = document.getElementById('gameCanvas');
        var ctx= gameCanvas.getContext("2d");   
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(gameXToCanvasX(gameX-gameWidth/2), gameYToCanvasY(gameY-gameHeight/2), gameXToCanvasX(gameWidth), gameYToCanvasY(gameHeight));
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }


this.drawText = function(gameX, gameY, text)
    {
        var ctx = game.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.fillText(text, gameXToCanvasX(gameX + game.gameWidth/2 - this.cameraX), gameYToCanvasY(-gameY + game.gameHeight/2 + this.cameraY))        ;    
        
          
        ctx.fill();
        ctx.restore();
    }

    this.drawBush = function(gameX, gameY, text)
    {
        var ctx = game.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#005500";
        //ctx.fillText(text, gameXToCanvasX(gameX + game.gameWidth/2 - this.cameraX), gameYToCanvasY(-gameY + game.gameHeight/2 + this.cameraY))        ;    
        ctx.rect(gameXToCanvasX(gameX + game.gameWidth/2 - this.cameraX), gameYToCanvasY(-gameY + game.gameHeight/2 + this.cameraY), gameXToCanvasX(3), gameYToCanvasY(3));    
          
        ctx.fill();
        ctx.restore();
    }

        this.drawCarrot = function(gameX, gameY)
    {
        var ctx = game.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "#FF8C00";
        //ctx.fillText(text, gameXToCanvasX(gameX + game.gameWidth/2 - this.cameraX), gameYToCanvasY(-gameY + game.gameHeight/2 + this.cameraY))        ;    
        ctx.rect(gameXToCanvasX(gameX + game.gameWidth/2 - this.cameraX), gameYToCanvasY(-gameY + game.gameHeight/2 + this.cameraY), gameXToCanvasX(1), gameYToCanvasY(1))        ;    
        
        ctx.fill();
        ctx.restore();
    }
}

function toRad(deg) {
  return deg * Math.PI / 180
}