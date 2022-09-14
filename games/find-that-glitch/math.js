"use strict";
var cos = Math.cos;
var sin = Math.sin;
function identity() {
	return new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1]);
}
function multiply(a,b) {
	var c = new Float32Array(16);
	for(var y=0;y<4;y++) {
		for(var x=0;x<4;x++) {
			for(var k=0;k<4;k++) {
				c[y*4+x]+=a[y*4+k]*b[k*4+x];
			}
		}
	}
	return c;
}
function transform(m,v) {
	var t = new Float32Array(4);
	for(var y=0;y<4;y++) {
		for(var x=0;x<4;x++) {
			t[y]+=v[x]*m[y*4+x];
		}
	}
	return t;
}
function rotateX(m, a){
	return multiply([
		1,0,0,0,
		0,cos(a),-sin(a),0,
		0,sin(a),cos(a),0,
		0,0,0,1],m)
}
function rotateY(m, a){
	return multiply([
		cos(a),0,sin(a),0,
		0,1,0,0,
		-sin(a),0,cos(a),0,
		0,0,0,1],m)
}
function rotateZ(m, a){
	return multiply([
		cos(a),-sin(a),0,0,
		sin(a),cos(a),0,0,
		0,0,1,0,
		0,0,0,1],m)
}
function perspective(m, r,t,f,n) {
	return multiply(m, new Float32Array([
		  r,  0,      0,       0,
		  0,  t,      0,       0,
		  0,  0,(f+n)/(n-f),   -1,
		  0,  0,(f*n)/(n-f), 0]));
}
function translate(m, v) {
	return multiply(new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		v[0],v[1],v[2],1]),m);
}
function add(a,b) {
	var c = new Float32Array(a.length);
	for(var i=0;i<c.length;i++) {
		c[i]=a[i]+b[i];
	}
	return c;
}
function sub(a,b) {
	return add(a,mulf(b,-1.0));
}
function distance(a,b) {
	var sum = 0;
	sub(a,b).forEach(function(s){
		sum = Math.max(sum,Math.abs(s));
	});
	return sum;
}
function mulf(a,b) {
	var c = new Float32Array(a.length);
	for(var i=0;i<c.length;i++) {
		c[i]=a[i]*b;
	}
	return c;
}
function floorv(v) {
	return v.map(Math.floor);
}

