function coordinate(x, y){
    this.x = x;
    this.y = y;
        
    this.width = 1;
    this.height = 3;
        
    this.right = function(){return this.x + this.width/2;};
    this.left = function(){return this.x - this.width/2};
    this.top = function(){return this.y - this.height/2};
    this.bottom = function(){return this.y + this.height/2};
     
    this.draw = function(){            
            draw.drawBush(this.x, this.y, this.x + "," + this.y)

    }         

    this.drawCarrot = function(){
        draw.drawCarrot(this.x, this.y);
    }
    this.update = function(){

    }   
}