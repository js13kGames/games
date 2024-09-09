"use strict";
var moveLocked = true;
var socket = io({ upgrade: false, transports: ["websocket"] });
var screen = document.getElementById("screen");
var rotX = Math.PI*.5;
var rotZ = 0;
var mapSize = 17;
var map = new Int8Array(mapSize*mapSize*mapSize);
var keys = [];
var pos = [mapSize/2,mapSize/2,mapSize/2];
var dugOut = null;
var deadline = new Date().getTime();
var message = function(){return ""};
var glitches = null;
var glitchesFound = 0;
var totalGlitches = 0;
set(floorv(pos), 1);
function get(p) {
	if(Math.min(p[0],p[1],p[2])<0 || Math.max(p[0],p[1],p[2])>=mapSize) {
		return -1;
	}
	return map[(p[2]*mapSize+p[1])*mapSize+p[0]];
}
function set(p,v) {
	if(Math.min(p[0],p[1],p[2])<0 || Math.max(p[0],p[1],p[2])>=mapSize) {
		throw new Error("Out of bounds: "+p);
	}
	map[(p[2]*mapSize+p[1])*mapSize+p[0]] = v;
}
function clamp(v, min, max) {
    return Math.max(min,Math.min(v,max));
}
screen.onclick = function() {
	if(screen.requestPointerLock){
		screen.requestPointerLock();
	} else {
		screen.mozRequestPointerLock();
	}
}
screen.onmousemove = function(e) {
	if(document.pointerLockElement != null || document.mozPointerLockElement != null) {
		rotZ-=e.movementX*0.01;
		rotX=clamp(rotX-e.movementY*0.01,0,Math.PI)
	}
}
screen.tabIndex = 0;
screen.onkeydown = function(e) {
	keys[e.keyCode] = true;
}

screen.onkeyup = function(e) {
	delete keys[e.keyCode];
}

var gl = screen.getContext("webgl");
function createShader(type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {	
		throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));	
		gl.deleteShader(shader);
		return null;	
	}
	return shader;
}
var program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, `
precision mediump float;
uniform mat4 transform;
attribute vec3 position;
attribute vec3 normal;
varying vec3 fragmentNormal;
varying vec3 fragmentPosition;
void main(void) {
	gl_Position = transform*vec4(position,1.0);
	fragmentNormal = normal;
	fragmentPosition = position;
}`));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, `
precision mediump float;
varying vec3 fragmentNormal;
varying vec3 fragmentPosition;
void main(void) {
	float ceil = max(fragmentNormal.z,0.0)*3.0+1.0;
	vec3 pos = fragmentPosition+fragmentNormal*1.0/32.0;
	vec3 n = vec3(4.0,4.0,8.0);
	vec3 p = 1.0-abs(1.0-2.0*fract((pos/vec3(ceil,ceil,1.0)+vec3(1.0/8.0,0.125,0.0)*floor(pos.z*8.0))*n));
	float c = min(p.x,min(p.y,p.z));
	c = min(c,0.25)*3.0;
	float side = max(0.3+fragmentNormal.z,abs(fragmentNormal.z));
	gl_FragColor = vec4(c,c,c,1.0)*vec4(1.0,side,side,1.0);
}`));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	throw new Error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
}
var buffer = gl.createBuffer();
var bufferLength = 0;
function quad(v, position, normal) {
	var sign=normal[0]+normal[1]+normal[2];
	var v0 = [normal[1],normal[2],normal[0]];
	var v1 = [normal[2],normal[0],normal[1]];
	var triangles; 
	if(sign>0) {
		triangles = [[-1,-1],[1,1],[-1,1],[-1,-1],[1,-1],[1,1]]
	} else {
		triangles = [[-1,-1],[-1,1],[1,1],[-1,-1],[1,1],[1,-1]];
	}
	triangles.forEach(function(p){
		var f = add(mulf(v0,p[0]),mulf(v1,p[1]));
		add([.5,.5,.5],add(position,mulf(add(normal,f),.5))).forEach(function(s){
			v.push(s);
		});
		normal.forEach(function(s){
			v.push(s);
		});
	});
}
function draw() {
	var vertices = [];
	for(var z=0;z<mapSize;z++) {
		for(var y=0;y<mapSize;y++) {
			for(var x=0;x<mapSize;x++) {
				if(get([x,y,z])) {
					var i = 0;
					[[-1,0,0],[0,-1,0],[0,0,-1],[0,0,1],[0,1,0],[1,0,0]].forEach(function(n){
						if(get(add([x,y,z],n))!==1) {
							quad(vertices, [x,y,z], n);
						}
					});
				}
			}
		}
	}
	if(glitches) {
		glitches.forEach(function(g){
			for(var i=0;i<3*10;i++) {
				g.forEach(function(s){
					vertices.push(s+(Math.random()-0.5)*.5);
				})
				for(var j=0;j<3;j++) {
					vertices.push(Math.random()*2.0-.5);
				}
			}
		});
	}
	bufferLength=vertices.length/6;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
}
draw();
function tick() {
	if(moveLocked){
		return;
	}
	var s = 0.05;
	var dir = [keys[83]?s:0+keys[87]?-s:0,keys[68]?s:0+keys[65]?-s:0,keys[32]?s:0+keys[67]?-s:0];
	var v = [sin(rotZ) * dir[0] + cos(rotZ) * dir[1], -cos(rotZ) * dir[0] + sin(rotZ) * dir[1], dir[2]];
	for(var i=0;i<3;i++) {
		pos[i]+=v[i];
		var p = get(floorv(pos));
		if(p===-1 || (dugOut==null && p!=1)){
			pos[i]-=v[i];
		}
	}
	var pi = floorv(pos);
	if(get(pi) === 0) {
		dugOut.push(pi);
		set(pi,1);
		draw();
	}
	var remainingGlitches = [];
	if(glitches) {
		glitches.forEach(function(g){
			if(distance(pos,g)>0.1) {
				remainingGlitches.push(g);
			} else {
				glitchesFound += 1;
			}
		});
		if(glitches.length!=remainingGlitches.length) {
			glitches = remainingGlitches;
			draw();
		}
	}
}
function update() {
	tick();
	if(Math.random()<0.01) {
		draw();
	}
	var w = screen.width = innerWidth
	var h = screen.height = innerHeight
	gl.viewport(0, 0, w, h);
  gl.cullFace(gl.BACK);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(program);
	var ptransformUniform = gl.getUniformLocation(program, "transform");
	gl.uniformMatrix4fv(ptransformUniform, false, translate(rotateZ(rotateX(perspective(identity(), 1,w/h,100,0.01),rotX),rotZ),mulf(pos,-1)));
	var vertexPositionAttribute = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	var normalAttribute = gl.getAttribLocation(program, "normal");
	gl.enableVertexAttribArray(normalAttribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	var stride = 6*4;
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, stride, 0);
	gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, stride, 3*4);
	gl.drawArrays(gl.TRIANGLES, 0, bufferLength);
	document.getElementById("log").innerText = message();
	requestAnimationFrame(update);
}
function setDeadline(timeLeft) {
	deadline = new Date().getTime()+timeLeft;
}
function getSecondsRemaining() {
	return Math.max(0,Math.floor(1+(deadline - new Date().getTime())/1000.0));
}
socket.on("digStart", function(timeLeft) {
	setDeadline(timeLeft);
	map = new Int8Array(mapSize*mapSize*mapSize);
	pos = [mapSize/2,mapSize/2,mapSize/2];
	set(floorv(pos), 1);
	dugOut = [];
	glitches = null;
	draw();
	moveLocked = false;
	message = function(){return "Dig! "+getSecondsRemaining()+" seconds remainig"};
});
socket.on("digEnd", function(timeLeft){
	setDeadline(timeLeft);
	socket.emit("dugOut", dugOut);
	dugOut = null;
	moveLocked = true;
	message = function(){return "Starting hide in "+getSecondsRemaining()+" seconds"};
});
socket.on("hideStart", function(timeLeft, totalDugOut){
	setDeadline(timeLeft);
	map = new Int8Array(mapSize*mapSize*mapSize);
	pos = [mapSize/2,mapSize/2,mapSize/2];
	set(floorv(pos), 1);
	totalDugOut.forEach(function(p){
		set(p, 1);
	});
	draw();
	moveLocked = false;
	message = function(){return "Hide! "+getSecondsRemaining()+" seconds remaining"};
});
socket.on("hideEnd", function(timeLeft){
	setDeadline(timeLeft);
	moveLocked = true;
	socket.emit("hideAt", pos);
	message = function(){return "Find starts in "+getSecondsRemaining()+" seconds"};
});
socket.on("findStart", function(timeLeft, positions){
	setDeadline(timeLeft);
	glitches = positions;
	glitchesFound = 0;
	totalGlitches = glitches.length;
	draw();
	moveLocked = false;
	message = function(){return "Find "+glitches.length+" glitches! "+getSecondsRemaining()+" seconds remaining"};
});
socket.on("findEnd", function(timeLeft){
	socket.emit("glitchesFound", glitchesFound);
	setDeadline(timeLeft);
	moveLocked = true;
	message = function(){return "Found "+glitchesFound+"/"+totalGlitches+" glitches. Scores in "+getSecondsRemaining()+" seconds"};
});
socket.on("score", function(timeLeft, myId, scores){
	setDeadline(timeLeft);
	moveLocked = true;
	message = function(){
		var m = "New round in "+getSecondsRemaining()+" seconds.\n";
		var i = 0;
		scores.forEach(function(s){
			i++;
			m+=i+": ";
			if(s[0] === myId){
				m+="         You";
			} else {
				m+=("    Player #"+s[0]).slice(-12);
			}
			m+=" - "+s[1]+" points\n";
		});
		return m;
	};
});
socket.on("connect", function () {
	message = function(){return "Connected. Wait for next turn."};
});

socket.on("disconnect", function () {
	message = function(){return "Disconnected"};
});

socket.on("error", function () {
	message = function(){return "Error"};
});

update();
