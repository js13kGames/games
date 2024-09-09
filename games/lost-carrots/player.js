function player(x, y){
    this.x = x;
    this.y = y;
    
    this.velX = 0;
    this.velY = 0;
    this.velStrafe = 0;
    this.velocity = 0;
    
    this.width = 1;
    this.height = 3;
    this.accel = 40;
    this.moveSpeed = 20;

    //cooldowns
    this.swapCooldown = 1;
    this.swapCooldownCurrent = 0;

    this.cameraCooldown = .25;
    this.cameraCooldownCurrent = 0;

    this.orientation = 90;

    this.currentLife = 200;    

    this.state = "ship"; //ship, bot

    this.metabolism = .05;

    this.turnSpeed = 2;
    this.legWobble = .3;

    this.right = function(){return this.x + this.width/2;};
    this.left = function(){return this.x - this.width/2};
    this.top = function(){return this.y - this.height/2};
    this.bottom = function(){return this.y + this.height/2};
    
    this.printSides = function(){        
        console.log("Player Right: " + this.right() + " Left: " + this.left() + " Top" + this.top() + " Bottom" + this.bottom());
    }
    
    this.draw = function(){
        
        draw.drawPlayerRect(game.gameWidth/2, game.gameHeight/2, this.width, this.height, this.orientation);   

        if(this.currentLife <= 0)
        {
            draw.drawText(this.x-15,this.y -5, "You ran out of food, game over! Press R to restart.");   
        }

        if(game.yumTimer > 0)
        {
            draw.drawText(this.x-8,this.y -5, "Yum, carrot! +20 Health.");      
        }

        if(game.brambleTimer > 0)
        {
            draw.drawText(this.x-8,this.y -5, "Ouch, prickly bramble! -20 Health.");      
        }

        
    }        
            
    this.update = function(dt){


        this.currentLife-=this.metabolism;
        //Update Cooldowns
        this.swapCooldownCurrent -= dt;
        this.cameraCooldownCurrent -= dt;

        

            if(game.drawType == "player")
            {
                draw.cameraX = this.x;
                draw.cameraY = this.y;
            }
                
        if(game.keys[66]){
            this.state = "ship";
        }
        if(this.state == "ship")
        {
            this.velStrafe/= 1.3;
            //A
            if(game.keys[65]){
                this.orientation+=this.turnSpeed;
            }
            //D
            if(game.keys[68]){
                this.orientation-=this.turnSpeed;
            }
                        
            if(game.keys[87]){
                this.velocity += this.accel*dt;
                if (this.velocity > this.moveSpeed*2)
                    this.velocity = this.moveSpeed*2;
            }
            
            if(game.keys[83]){
                this.velocity += -this.accel*dt;
                if (this.velocity < -this.moveSpeed*2)
                    this.velocity = -this.moveSpeed*2;
            }

            if(this.velocity < 0)
                this.velocity = 0;
        }        
                
        
        var oldX = this.x;
        var oldY = this.y;
        
        this.x += this.velX;
        this.y += this.velY; 

        this.x += this.velocity * Math.cos(toRad(this.orientation))*dt + this.velStrafe * Math.cos(toRad(this.orientation - 90))*dt;
        this.y += this.velocity * Math.sin(toRad(this.orientation))*dt + this.velStrafe * Math.sin(toRad(this.orientation - 90))*dt;  

        if(this.currentLife <= 0)
        {
            this.currentLife =0;
this.moveSpeed =0;
        }
    }
}