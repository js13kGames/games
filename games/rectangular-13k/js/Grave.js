/*
	By Yhoyhoj : twitter.com/yhoyhoj
*/

function Grave(x,y){

	this.x = x;
	this.y = y;

	objects.push(this);

}
Grave.prototype.render = function() {

	c.fillStyle = "green";
	c.shadowBlur=7;
	c.shadowOffsetX = -2;
	c.shadowOffsetY = 2;
	c.fillRect(this.x, this.y, 10, 20);
	c.fillText(this.x, this.x+500, this.y);
	c.fillText(this.x, this.x-500, this.y);

}
Grave.prototype.tick = function() {

	var fall = true;
	var speed;

	/*if(this.x < 0-this.size) {
		this.x = canvas.width+this.size;
		this.y = Math.random()*canvas.height+1;
	}*/
	if(this.y > canvas.height)
		this.y = -20;

	for(var i = 0; i < objects.length; i++) {
		var p = objects[i];
		p.grave = false;

//			Squares :

		if(p instanceof Square)	{

			if(this.x > p.x-5 && this.x < p.x + p.size ){

				if(this.y+20 < p.y+1 && this.y+20 > p.y-2){
					p.grave = this;
					speed = p.speed;
					fall = false;
				}
			}

		}

	}

	if(speed > 0){
		this.x -= speed;
	}

	if(fall) {
		this.y+=2;
		this.render();
	}
}