var rand = function(n){ return Math.random() * n; };
var randInt = function(n){ return Math.floor(rand(n)) + 1; }
var randAround = function(n){
	var a = rand(n);
	var b = rand(n);
	return (a-b);
};