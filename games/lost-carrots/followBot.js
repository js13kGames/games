function followBot(x, y){	
	this.x = 10;
	this.y = 10;

	this.width = 10;
	this.height = 10;

	this.orientation = 90;
	this.velocity = 10;
	
	this.currentTime = 0;

	this.update = function(dt){
		this.x+= this.velocity*Math.cos(toRad(this.orientation))*dt;
		this.y+= this.velocity*Math.sin(toRad(this.orientation))*dt;
	}

	this.draw = function(){
		draw.drawRectCentered(this.x, this.y, this.width, this.height, "#FF0000");
	}
}