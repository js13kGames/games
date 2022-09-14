// Coordinate class
function Coords(x,y){
	this.x = x;
	this.y = y;
	this.check(); 
}
Coords.prototype.getCopy = function () {
	var coord = this;
	return new Coords(coord.x, coord.y);
};
Coords.prototype.set = function(coord){
	coord.check();
	this.x = coord.x;
	this.y = coord.y;
}
Coords.prototype.add = function(coord){
	coord.check();
	this.x += coord.x;
	this.y += coord.y;
	return this;
}
Coords.prototype.multiply = function(n){
	this.x *= n;
	this.y *= n;
	return this;
}
Coords.prototype.getMultiply = function(n){
	var x = this.x * n;
	var y = this.y * n;
	return new Coords(x, y);
}
Coords.prototype.getDot = function(coord){
	coord.check();
	// A dot B = ||A|| ||B|| cos theta ?
	// this.getMagnitude() * coord.getMagnitude()    ???
	return ((this.x * coord.x) + (this.y * coord.y));
}
Coords.prototype.clear = function(){
	this.x = 0;
	this.y = 0;
	return this;
}
Coords.prototype.setTangent = function(){
	var x = this.x;
	this.x = this.y;
	this.y = x;
	return this;
}
Coords.prototype.setPolar = function(r, theta){
	// theta is expected in radians
	this.x = r * Math.cos(theta);
	this.y = r * Math.sin(theta);
}
Coords.prototype.getDistance = function(coord){
	coord.check();
	return Math.sqrt(
		Math.pow( (this.x - coord.x), 2)
		+ Math.pow( (this.y - coord.y), 2)
	);
}
Coords.prototype.getUnitVector = function(coord){
	coord.check();
	var x = 0, y = 0;
	var d = Math.abs(this.getDistance(coord));
	if (this.x != coord.x) {
		var dx = coord.x - this.x;
		x =  dx / d;
	}
	if (this.y != coord.y) { 
		var dy = coord.y - this.y;
		y = dy / d;
	}
	return new Coords(x, y);
}
Coords.prototype.getMagnitude = function(){
	return Math.sqrt(
		Math.pow(this.x, 2)
		+ Math.pow(this.y, 2)
	);
}
Coords.prototype.isEqual = function(coord){
	return (this.x == coord.x && this.y == coord.y);
}
Coords.prototype.isEqualInteger = function(coord){
	return (Math.round(this.x) == Math.round(coord.x) && Math.round(this.y) == Math.round(coord.y));
}
Coords.prototype.check = function(){
	if (typeof this.x !== "number" || isNaN(this.x)) {
		console.error("Bad coord.x", this.x);
		this.x = 0;
	}
	if (typeof this.y !== "number" || isNaN(this.y)) {
		console.error("Bad coord.y", this.y);
		this.y = 0;
	}
	return this;    
}