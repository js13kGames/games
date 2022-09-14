function meter(x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;  
    
    this.orientations = {"Horizontal":0, "Vertical":1};
    
    if(this.type == game.meterTypes.Level){
        this.width = 40;
        this.height = 2;
        this.currentLevel = game.currentLevelTimer;                     //Current Value of Timer
        this.maxLevel = 10;                                             //Max Value of Timer
        this.orientation = this.orientations.Horizontal;
    }
    
    this.update = function(dt){
        if(this.type == game.meterTypes.Level){                                    
            this.currentLevel += dt;
            if(this.currentLevel > this.maxLevel)                       //Example timer will loop when it hits the max level.
                this.currentLevel = 0; 
        }
    }
    
    this.draw = function(){ 
        if(this.type == game.meterTypes.Life)
            var color = game.colors.Ship;                              //Uses color scheme in game.js
        else
            var color = "#000000";
        
        if(this.orientation == this.orientations.Vertical){
            
            draw.drawRectCentered(this.x, this.y, this.width, this.height, "#000000");
            draw.drawFilledRectCentered(this.x, this.y, this.width, this.height*(this.currentLevel/this.maxLevel), color); 
        }
        else if(this.orientation == this.orientations.Horizontal){
            draw.drawRectCentered(this.x, this.y, this.width, this.height, "#000000");
            draw.drawFilledRectCentered(this.x, this.y, this.width*(1-this.currentLevel/this.maxLevel), this.height, color);    
        }
        
       
    }
}
