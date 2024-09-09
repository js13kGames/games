var Amissa = Amissa || {};

Amissa.Lost = {};

Amissa.Lost.init = function(stats) {
	this.day = stats.day;
	this.health = stats.health;
	this.strength = stats.strength;
	this.food = stats.food;
	this.energy = stats.energy;
	this.distance = 0;
};

// Food Rate
Amissa.Lost.consumeFood = function() {
	this.food -= Amissa.FOOD_RATE;
	if(this.food < 0) { this.food = 0; }
};

// Distance
Amissa.Lost.updateDistance = function() {
	if(this.health > 74) { var speed = Amissa.SPEED * 1.15; }
	else if(this.health > 39) { var speed = Amissa.SPEED; }
	else { var speed = Amissa.SPEED * 0.75; }
	this.distance += speed;
};