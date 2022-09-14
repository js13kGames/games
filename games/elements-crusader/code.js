// Start game
document.getElementById('t').addEventListener("click", function(){
	if(end==3) start();
	else if(end==0) shoot();
});
// Press button and go
window.addEventListener('keydown',(function(i){if(i.keyCode==37)go=1,i.preventDefault();if(i.keyCode==39)go=2,i.preventDefault();if(i.keyCode==32)i.preventDefault();}));
// Release button and stay
window.addEventListener('keyup',(function(i){

	if(i.keyCode==37 && go==1) go=0;
	else if(i.keyCode==39 && go==2) go=0;
// or shoot :D
	else if(i.keyCode==32) {
		if(end==3) start();
		else if(end==0) shoot();
	}
}));
// Mobile control
if (window.DeviceMotionEvent) window.addEventListener('devicemotion', function(e) {
	var accely = e.accelerationIncludingGravity.y;
	if(e.accelerationIncludingGravity.x>0) {if(accely<-0.5) go=1; else if(accely>0.5) go=2; else go=0;}
	else {if(accely<0.5) go=2; else if(accely>-0.5) go=1; else go=0;}
});

var isMobile = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/IEMobile/i)) ? 1 : 0;

var score, go, entities, boss, end;
var colors = ['080','00c','333','800'];
var canvas = document.getElementById('p');
var context = canvas.getContext('2d');
var text = document.getElementById('t').getContext('2d');
var ctx =  document.getElementById('s').getContext('2d');
var storage = window['localStorage'];

context.imageSmoothingEnabled = false;
context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;
context.fillStyle = '#fff';
context.strokeStyle = '#fff';
context.textAlign = 'center';
context.font = '30px Arial';
context.lineCap = 'square';

text.imageSmoothingEnabled = false;
text.webkitImageSmoothingEnabled = false;
text.mozImageSmoothingEnabled = false;
text.fillStyle = '#fff';
text.strokeStyle = '#fff';
text.textAlign = 'center';
text.font = '30px Arial';
text.lineCap = 'square';
ctx.strokeStyle = "#aaa";
ctx.fillStyle = "#aaa";

var stage = 0;
text.fillText("läding", 320, 80);

var a_lot_of_stars = [];

function restart_star(star) {
	star.x = (Math.random() * 2 - 1) * 4800;
	star.y = (Math.random() * 2 - 1) * 2700;
	star.z = 10;
	star.x2 = 0;
	star.y2 = 0;
}

// new stars
for (var i=0, n; i<500; i++) {
	var n = {};
	restart_star(n);
	a_lot_of_stars.push(n);
}

function intro(){
	stars_draw();
	text.font = (21-(stage/120))+'px Arial';
	text.clearRect(0, 0, 640, 360);
	text.fillText("Dobi", 320, 200-stage);
	text.font = (22-(stage/120))+'px Arial';
	text.fillText("ringlets.pl", 320, 250-stage);
	text.font = (23-(stage/120))+'px Arial';
	text.fillText("prezents", 320, 350-stage);
	text.font = (30-(stage/120))+'px Arial';
	text.fillText("Elements .-. Crusader", 320, 520-stage);
	text.font = (22-(stage/120))+'px Arial';
	if(isMobile) text.fillText("tap and tilt screen", 320, 560-stage);
	else text.fillText("use arrows and spacebar", 320, 560-stage);
	text.fillText("get 150 points and kill boss", 320, 590-stage);
	text.font = '30px Arial';
	if(stage<600) requestAnimFrame(intro);
	else start();
	stage++;
}

function start(){
	score = 0;
	end = 0;
	go = 0;
	boss = 0;
	stage = 0;
	entities = [{type:'player',x:320,y:340,color:'fff'}];
	text.clearRect(0, 0, 640, 360);
	requestAnimFrame(tick);
}

function ending(){
	if(end!=0){
		context.fillStyle = 'rgba(0,0,0,.05)';
		context.fillRect(0, 0, 640, 360);
		context.fillStyle = '#fff';
	}
	if(storage.getItem('score')<score || !storage.getItem('score')) localStorage.setItem('score', score);
	text.clearRect(0, 0, 640, 360);
	if(end == 2) text.fillText("You win!", 320, stage-160);
	else text.fillText("You lose!", 320, stage-160);
	text.fillText("Score: "+score, 20+stage, 170);
	text.fillText("Best score: "+storage.getItem('score'),620-stage,200);
	text.fillText("Click to play again!", 320, 570-stage);
	if(stage<300) requestAnimFrame(ending);
	else end = 3;
	stage++;
}

function tick(){
	if(end==0) {
		var f;
		if(entities[0].color=='333') f = 5;
		else f = 3;
		if(go == 1 && entities[0].x>60) entities[0].x-=f;
		else if(go == 2 && entities[0].x<580) entities[0].x+=f;
		// clean up canvas
		context.clearRect(0, 0, 640, 360);
		text.clearRect(0, 0, 640, 360);
		if(score==0) text.fillText("Fight!", 320, 160);
		// stars
		stars_draw();
		// drawing background
		context.fillStyle = '#fff';
		context.strokeStyle = '#fff';
		context.beginPath();
		context.moveTo(0, 360);
		context.lineTo(140, 0);
		context.moveTo(640, 360);
		context.lineTo(500, 0);
		context.fill();
		context.stroke();
		context.closePath();
		text.font = '20px Arial';
		text.fillText(score, 320, 30);
		text.font = '30px Arial';
		// spawn
		if(Math.floor(Math.random()*500)>498) entities[entities.length]={type:'bonus',x:Math.random()*1000%300+180,y:1,color:colors[Math.floor(Math.random()*4)]};
		if(Math.floor(Math.random()*500)>497-score/20) entities[entities.length]={type:'enemy'+Math.floor(Math.random()*3),x:Math.random()*1000%300+180,y:1};
		if(score>150&&Math.floor(Math.random()*500)>498 && boss==0) entities[entities.length]={type:'boss',x:Math.random()*1000%300+180,y:40}, boss = 20;
		// colisions
		var i = entities.length-1, j;
		do {
			j = 0;
			while (j < i) {
				if(j.type==i.type) if(!collide(entities[j],entities[i])) collide(entities[i],entities[j]);
				j++;
			}
		} while (i--);
		// draw
		i = -1;
		while(entities[++i]) draw(entities[i]);
		// request new frame
		requestAnimFrame(tick);
	} else if(end==1) ending();
	else ending();
}

function collide(first,second){
	// player and enemy
	if(first.type=='player' && (second.type=='enemy0' || second.type=='enemy1' || second.type=='enemy2') && second.y>320 && second.x+60>first.x && second.x-50<first.x){
		end = 1;
		if(Math.floor(Math.random()*2)>0) playSound([3,0.12,0.69,0.6924,0.24,0.1823,,0.2196,,,,,,,,,,,1,,,,,0.5]);
		else playSound([3,0.26,0.1362,0.5954,0.3814,0.0803,,,,,,,,,,,,,1,,,,,0.5]);
		return 1;
	} else 
	// player and bullet2
	if(first.type=='player' && second.type=='bullet2' && second.y>340 && second.x+45>first.x && second.x-45<first.x){
		if(first.color!='00c') end = 1;
		else first.color = 'fff', second.y=0;
		playSound([3,0.12,0.69,0.6924,0.24,0.1823,,0.2196,,,,,,,,,,,1,,,,,0.5]);
		return 1;
	} else
	// player and bonus
	if(first.type=='player' && second.type=='bonus' && second.y>335 && second.x+50>first.x && second.x-50<first.x){
		text.fillText("yey!", 320, 160);
		first.color = second.color;
		second.y=0;
		score+=5;
		playSound([0,,0.0791,0.479,0.4523,0.8186,,,,,,0.3,0.689,,,,,,1,,,,,0.5]);
		return 1;
	} else
	// enemy and bullet1
	if(first.type=='bullet1' && (second.type=='enemy0' || second.type=='enemy1' || second.type=='enemy2') && second.x+20>first.x && second.x-20<first.x && second.y+20>first.y && second.y-20<first.y){
		second.y=0;
		if(first.color!='800') first.y=0;
		score++;
		if(Math.floor(Math.random()*2)>0) playSound([3,0.12,0.69,0.6924,0.24,0.1823,,0.2196,,,,,,,,,,,1,,,,,0.5]);
		else playSound([3,0.26,0.1362,0.5954,0.3814,0.0803,,,,,,,,,,,,,1,,,,,0.5]);
		return 1;
	} else
	// boss and bullet1
	if(first.type=='bullet1' && second.type=='boss' && second.x+50>first.x && second.x-50<first.x && second.y+5>first.y && second.y-20<first.y){
		first.y=0;
		if(boss==0) {
			second.y=0;
			score+=19;
			end = 2;
		} else boss--;
		score++;
		if(Math.floor(Math.random()*2)>0) playSound([3,0.12,0.69,0.6924,0.24,0.1823,,0.2196,,,,,,,,,,,1,,,,,0.5]);
		else playSound([3,0.26,0.1362,0.5954,0.3814,0.0803,,,,,,,,,,,,,1,,,,,0.5]);
		return 1;
	} else
	// shoot :D
	if(((second.type=='enemy0' || second.type=='enemy1' || second.type=='enemy2')&&Math.floor(Math.random()*1000)>998)||(second.type=='boss'&&Math.floor(Math.random()*500)>498)){
		entities[entities.length]={type:'bullet2',x:second.x,y:second.y};
		playSound([0,,0.1637,0.1687,0.2673,0.6742,0.2,-0.1553,,,,,,0.8438,-0.1923,,,,1,,,,,0.5]);
	} 
	return 0;
}

function draw(object){
	if(object.y>0 && object.y<350){
		if(object.type=='player'){
			context.drawImage(player[object.color],object.x-50,object.y-40);
		} else if(object.type=='bullet1'){
			context.fillStyle = '#'+object.color;
			context.beginPath();
			context.arc(object.x, object.y, 3+(object.y/100), 0, Math.PI * 2);
			context.arc(object.x, object.y+2, 3+(object.y/100), 0, Math.PI * 2);
			context.fill();
			context.closePath();
			context.fillStyle = '#fff';
			object.y-=5;
			object.x-=(object.x-320)/100;
		} else if(object.type=='bullet2'){
			context.beginPath();
			context.arc(object.x, object.y, 3+(object.y/100), 0, Math.PI * 2);
			context.arc(object.x, object.y-2, 3+(object.y/100), 0, Math.PI * 2);
			context.fill();
			context.closePath();
			object.y+=4;
			object.x+=(object.x-320)/125;
		} else if(object.type=='enemy0'){
			context.drawImage(enemy0,object.x-20,object.y-20,enemy0.width*(object.y/1000+0.7),enemy0.height*(object.y/1000+0.7));
			object.y++;
			object.x+=(object.x-320)/500;
		} else if(object.type=='enemy1'){
			context.drawImage(enemy1,object.x-20,object.y-20,enemy1.width*(object.y/1000+0.7),enemy1.height*(object.y/1000+0.7));
			object.y++;
			object.x+=(object.x-320)/500;
		} else if(object.type=='enemy2'){
			context.drawImage(enemy2,object.x-30,object.y-10,enemy2.width*(object.y/1000+0.7),enemy2.height*(object.y/1000+0.7));
			object.y+=2;
			object.x+=(object.x-320)/250;
		} else if(object.type=='boss'){
			context.drawImage(bosss,object.x-50,object.y-12,bosss.width*(object.y/1000+0.7),bosss.height*(object.y/1000+0.7));
			if(( Math.floor(Math.random()*2)>0 && object.x<500) || object.x<140) object.x+=5;
			else object.x-=5;
			object.y+=0.18;
		} else if(object.type=='bonus'){
			context.fillStyle =  '#'+object.color;
			context.beginPath();
			context.arc(object.x, object.y, 7+(object.y/100), 0, Math.PI * 2);
			context.fill();
			context.closePath();
			context.fillStyle = '#fff';
			object.y+=2;
			object.x+=(object.x-320)/250;
		}
	// Deleting of old entities
	} else entities.splice(entities.indexOf(object), 1);
}

function shoot(){
	if(entities[0].color=='080') entities[entities.length]={type:'bullet1',x:entities[0].x,y:345,color:entities[0].color};
	entities[entities.length]={type:'bullet1',x:entities[0].x,y:325,color:entities[0].color};
	playSound([0,,0.241,0.032,0.1773,0.7634,0.0847,-0.3813,,,,,,0.2293,0.0405,,0.0862,-0.0484,1,,,0.2982,,0.5]);
}

function stars_draw(){
	ctx.clearRect(0, 0, 640, 360);

	for (var i=0; i<500; i++) {
		var n = a_lot_of_stars[i],
		x = n.x / n.z,
		y = n.y / n.z,
		e = (1.0 / n.z + 1) * 2;

		if (n.x2 !== 0) {
			// drawing
			ctx.lineWidth = e;
			ctx.beginPath();
			ctx.moveTo(x + 320, y + 10);
			ctx.lineTo(n.x2 + 320, n.y2 + 10);
			ctx.stroke();
		}

		// new settings
		n.x2 = x;
		n.y2 = y;
		n.z -= 0.1;

		// get out the borders
		if (n.z < 0.1 || n.x2 > 640 || n.y2 > 360) restart_star(n);

	}
}

var url = window.URL || window.webkitURL;

function playSound(params) {
	var soundURL = jsfxr(params);
	var player = new Audio();
	player.addEventListener('error', function(e) {}, false);
	player.src = soundURL;
	player.play();
	player.addEventListener('ended', function(e) {
		url.revokeObjectURL(soundURL);
	}, false);
}
// preRendering
function preRender(w,h,p){
	var c = document.createElement('canvas'), k = c.getContext('2d');
	c.width = w, c.height = h, k.fillStyle = '#fff', k.strokeStyle = '#fff', p(k);
	return c;
}

var enemy0 = preRender(40,40,function(context){
	var object = {x:20, y:20};
	context.beginPath();
	context.moveTo(object.x-20, object.y-20);
	context.arc(object.x, object.y, 5, 1, 2);
	context.moveTo(object.x+20, object.y+20);
	context.arc(object.x, object.y, 5, 1, 2, 1);
	context.fill();
	context.closePath();
});

var enemy1 = preRender(40,40,function(context){
	var object = {x:20, y:20};
	context.beginPath();
	context.moveTo(object.x+20, object.y-20);
	context.arc(object.x, object.y, 5, 1, 2);
	context.moveTo(object.x-20, object.y+20);
	context.arc(object.x, object.y, 5, 1, 2, 1);
	context.fill();
	context.closePath();
});

var enemy2 = preRender(60,20,function(context){
	context.beginPath();
	context.moveTo(0, 0);
	context.bezierCurveTo(30, 20, 30, 30, 60, 0);
	context.stroke();
	context.closePath();
});

var bosss = preRender(100,25,function(context){
	var object = {x:50, y:25};
	context.beginPath();
	context.arc(object.x-50, object.y, 20, 0, Math.PI * 2);
	context.moveTo(object.x-50, object.y);
	context.quadraticCurveTo(object.x,object.y-25,object.x+50,object.y);
	context.arc(object.x+50, object.y, 20, 0, Math.PI * 2);
	context.moveTo(object.x, object.y-20);
	context.arc(object.x, object.y-25, 20, 0, Math.PI * 2);
	context.stroke();
	context.fill();
	context.closePath();
});

function players(color){return preRender(100,50,function(context){
	var object = {x:50, y:30};
	context.beginPath();
	context.fillStyle = '#'+color;
	context.strokeStyle = '#'+color;
	context.arc(object.x-30, object.y, 12, 0, Math.PI * 2);
	context.moveTo(object.x+30, object.y);
	context.arc(object.x+30, object.y, 12, 0, Math.PI * 2);
	context.moveTo(object.x-30, object.y+10);
	context.lineTo(object.x+30, object.y+10);
	context.lineTo(object.x+15, object.y-5);
	context.lineTo(object.x-15, object.y-5);
	context.stroke();
	context.fill();
	context.closePath();
})};

var player = new Array();
player['fff'] = players('fff');
player['080'] = players('080');
player['00c'] = players('00c');
player['333'] = players('333');
player['800'] = players('800');


// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();


