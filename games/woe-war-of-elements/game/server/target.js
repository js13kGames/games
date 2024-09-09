/* jshint node:true */
"use strict";

var id = 0;
var Target = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.id = id;
	id++;

	this.baseY = this.y;
	this.rand1 = Math.random() * 0.075 + 0.075;
	this.rand2 = Math.random() * 2.5;
	this.progress = 0;
};

Target.prototype.move = function() {
	this.progress += 0.1;

	this.x = 0.02 * this.progress;
	this.y = this.baseY + this.rand1 * Math.sin(this.rand2 * this.progress);
};

Target.prototype.info = function () {
	return {
		id: this.id,
		x: this.x,
		y: this.y
	};
};

Target.SIZE = 0.05;

module.exports = Target;