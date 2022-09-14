	var ID = -1;
	
	var gameOver = false;
	var spaceDown = false
	var leftDown = false;
	var rightDown = false;
	
	var bossStage = false;
	var colorRate = 255;
	
	var fire = new Audio("fire.wav"); // buffers automatically when created
	var gain = new Audio("gainColor.mp3");
		
		canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
			w = window.innerWidth;
			h = window.innerHeight;
			canvas.width = w-100;
			canvas.height = h-50;
			var R=255,G=255,B=255;
			var BR=0,BG=0,BB=0;
			var lazerHeight = h;
		cubes = [];
		boss = {};
		glitches = [];
		var cubeNumber = 0;
		setInterval(generateBoxes,1250);
		setInterval(generateGlitches,200);
		var xp=0;
		var yp=h/2;
		
		square = {											
			x:w/2-30,
			y:h-80,
			c : "white",
			draw: function(){
				ctx.beginPath();
				colorRect(this.x,this.y,10,10,getRandomColor());
				colorRect(this.x,this.y+10,10,10,getRandomColor());
				colorRect(this.x,this.y-10,10,10,getRandomColor());
				colorRect(this.x+10,this.y,10,10,getRandomColor());
				colorRect(this.x+10,this.y+10,10,10,getRandomColor());
				colorRect(this.x+10,this.y-10,10,10,getRandomColor());
				colorRect(this.x-10,this.y,10,10,getRandomColor());
				colorRect(this.x-10,this.y+10,10,10,getRandomColor());
				colorRect(this.x-10,this.y-10,10,10,getRandomColor());
				}
			};
		boss = {
			speed : 6,
			x:w/2-20,
			y:-100,
			h:125,
			w:125,
			c : "red",
			pixelSize : 20,
			draw: function(){
				colorRect(this.x-this.pixelSize*2.5,this.y+this.pixelSize*1.5,this.pixelSize,this.pixelSize*4,this.c);
				colorRect(this.x-this.pixelSize*0.5,this.y+this.pixelSize*1.5,this.pixelSize,this.pixelSize*4,this.c);
				colorRect(this.x+this.pixelSize*1.5,this.y+this.pixelSize*1.5,this.pixelSize,this.pixelSize*4,this.c);
				colorRect(this.x-this.pixelSize*2.5,this.y-this.pixelSize*3.5,this.pixelSize*5,this.pixelSize*3,this.c);
				colorRect(this.x-this.pixelSize*4.5,this.y+this.pixelSize*1.5,this.pixelSize*9,this.pixelSize,this.c);
				colorRect(this.x-this.pixelSize*4.5,this.y-this.pixelSize*1.5,this.pixelSize,this.pixelSize*3,this.c);
				colorRect(this.x+this.pixelSize*3.5,this.y-this.pixelSize*1.5,this.pixelSize,this.pixelSize*3,this.c);
				colorRect(this.x-this.pixelSize*1.5,this.y-this.pixelSize*0.5,this.pixelSize*3,this.pixelSize,this.c);
				colorRect(this.x-this.pixelSize*0.5,this.y+this.pixelSize*0.5,this.pixelSize,this.pixelSize,this.c);
				colorRect(this.x-this.pixelSize*3.5,this.y-this.pixelSize*2.5,this.pixelSize*7,this.pixelSize,this.c);
				colorRect(this.x-this.pixelSize*3.5,this.y-this.pixelSize*4.5,this.pixelSize,this.pixelSize,this.c);
				colorRect(this.x+this.pixelSize*2.5,this.y-this.pixelSize*4.5,this.pixelSize,this.pixelSize,this.c);
				colorRect(this.x-this.pixelSize*4.5,this.y-this.pixelSize*5.5,this.pixelSize,this.pixelSize,this.c);
				colorRect(this.x+this.pixelSize*3.5,this.y-this.pixelSize*5.5,this.pixelSize,this.pixelSize,this.c);
				colorRect(this.x-this.pixelSize*5.5,this.y-this.pixelSize*4.5,this.pixelSize,this.pixelSize,this.c);
				colorRect(this.x+this.pixelSize*4.5,this.y-this.pixelSize*4.5,this.pixelSize,this.pixelSize,this.c);
			}
		};
		
		function gameEnd(){
			write("Game Over",w/100,w/3.6,h/2.5,'red');
			gameOver=true;
		}
		
		function gameWin(){
			ctx.font = "50px Arial";
			ctx.fillStyle = glitches.color;
			ctx.fillText("Congratulations! You are pixel now.",w/4.3, h/10);
			gameOver=true;
		}
		function rand(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		
		function bossMove(){
			if(boss.y<=110){
				boss.y += 1.5;
				}
			else
				boss.x += boss.speed;
			}
			
		function bossAtack(){
			bossStage = true;
			glitches.forEach(function(glitch) {
				var speed = glitch.speed || 500;
				glitch.y += glitch.speed;
				drawGlitches(ctx, glitch);
			});
		}
		
		function draw() {
			
			ID = requestAnimationFrame(draw,canvas);
		if (intro == true) {
			write("Move : <- ->",w/250,w/3.7,h/3,'black');
			write("Fire : /",w/250,w/1.8,h/3,'black');
			colorRect(xp,yp,10,10,'green');
			colorRect(xp,yp+10,10,10,'blue');
			colorRect(xp,yp-10,10,10,'red');
			xp+=4;
			write("Road",w/180,w/3,h/10,'red');
			write("To",w/180,w/2.28,h/10,'green');
			write("Pixel",w/180,w/2,h/10,'blue');
			write("Don't Shoot the Boss",w/260,w/3,h/2.05,'white');
			if(xp>=w-10)
			write("Press Spacebar To Start",w/240,w/3.3,h/1.2,'black');					//intro ekraný
			
			return;
		}
			if (gameOver == true) {
													//game over ekraný
				
				return;
			}
			if(BR>=255){
				lazerHeight = -h;
				cubes = [];
				if(boss.y<=50)
					almostRed();
				boss.c = 'rgb('+ colorRate +','+ 0 +',' + 0 + ')';;
				boss.draw();
				bossMove();
				bossAtack();
				}
				
			if(BG>=255){
				lazerHeight = -h;
				cubes = [];
				if(boss.y<=50)
					almostGreen();
				boss.c = 'rgb('+0+','+ colorRate +',' + 0 + ')';;
				boss.draw();
				bossMove();
				bossAtack();
				}
				
			if(BB>=255){
				lazerHeight = -h;
				cubes = [];
				if(boss.y<=50)
					almostBlue();
				boss.c = 'rgb('+0+','+0+',' + colorRate + ')';;
				boss.draw();
				bossMove();
				bossAtack();
				}
				
			square.draw();
			update();
			for (let i = 0; i < 5; i++) {
					ctx.fillStyle = `hsla(${Math.random() * 360},100%,50%,0.02)`;
					ctx.beginPath();
					ctx.moveTo(Math.random() * (canvas.width + 200) - 100, Math.random() * (canvas.width + 200) - 100);
					ctx.lineTo(Math.random() * (canvas.width + 200) - 100, Math.random() * (canvas.width + 200) - 100);
					ctx.lineTo(Math.random() * (canvas.width + 200) - 100, Math.random() * (canvas.width + 200) - 100);
					ctx.fill();
				}
				ctx.fillStyle = "rgba(0,0,0,0.2)";
			for (let y = 0; y < canvas.height; y += 50 + Math.random() * 50) {
				for (let x = 0; x < canvas.width; x+= 100) {
					ctx.fillRect(x + Math.random() * 60 - 30, y + Math.random() * 60 - 30,
					20 + 100 * Math.random(), 20 + 100 * Math.random());
				}
			}
			
			cubes.forEach(function(cube) {
				if(BR < 255 && BG < 255 && BB < 255){
				var speed = cube.speed || 500;
				cube.y += 5;
				drawCube(ctx, cube);
				}
				
			});
		}
		
		function drawCube( ctx, cube ) {
			ctx.fillStyle = cube.color;
			ctx.fillRect(cube.x,cube.y,cube.w, cube.h);
		}
		
		function drawGlitches(ctx,glitch){
			ctx.fillStyle = glitch.color;
			ctx.fillRect(glitch.x,glitch.y,glitch.w,glitch.h);
		}
	
		function astroidsColor(){
				var random = Math.floor((Math.random() * 3) + 1);
				var color;
			
				if(random == 1)
					color='red';
				else if(random == 2)
					color='blue';
				else if(random == 3)
					color='green';
				
				return color;
		}
		
		function moveMouse(e){
				mouse.x = e.pageX;
				mouse.y = e.pageY;
		}
		
		function lazerDraw(){	
			if(gameOver==false){
			colorRect(square.x,square.y-10,10,lazerHeight,getRandomColor());
			colorRect(square.x+10,square.y-10,10,lazerHeight,getRandomColor());
			colorRect(square.x-10,square.y-10,10,lazerHeight,getRandomColor());  
			}
		}
		
		function colorRect(leftX,topY,width,height,drawColor){				//Kare çizme fonksiyonu
			ctx.fillStyle = drawColor;
			ctx.fillRect(leftX,topY,width,height);
		}
		
		function getRandomColor() {			//random renk fonksiyonu
				
			var color = 'rgb(' + (Math.floor(Math.random() * (R-BR) + BR)) + ',' + (Math.floor(Math.random() * (G-BG) + BG )) + ',' + (Math.floor(Math.random() * (B-BB) + BB)) + ')';
			return color;
		}
		
		function drawScore() {
			ctx.font = "20px Arial";
			ctx.fillStyle = "red";
			ctx.fillText("Red: "+ BR +"~"+R, 8, 30);
			ctx.fillStyle = "green";
			ctx.fillText("Green: "+ BG +"~"+G, 8, 60);
			ctx.fillStyle = "blue";
			ctx.fillText("Blue: "+ BB + "~"+B, 8, 90);
		}
		
		function almostRed(){
			ctx.font = "60px Arial";
			ctx.fillStyle = "red";
			ctx.fillText("You r almost red pixel", w/4, h/2);
		}
		
		function almostGreen(){
			ctx.font = "60px Arial";
			ctx.fillStyle = "green";
			ctx.fillText("You r almost green pixel", w/4, h/2);
		}
		
		function almostBlue(){
			ctx.font = "60px Arial";
			ctx.fillStyle = "blue";
			ctx.fillText("You r almost blue pixel", w/4, h/2);
		}
		
		function update(){
			
			if(colorRate<=0)
				gameWin();
			
			if(gameOver==false){
			drawScore();
			isDeath();
			
			if(boss.x>=w-boss.pixelSize*3.5)
				boss.speed =- boss.speed;
			
			if(boss.x<=-boss.pixelSize*0.5)
				boss.speed =- boss.speed;
				
			if (spaceDown) {
				collisionLazer();
				lazerDraw();
				fire.play();
			}
			
			if (rightDown) {
				if(square.x<=w-30)
					square.x += 8
			}
			
			if (leftDown) {
				if(square.x>=20)
					square.x -= 8
			}
			if(cubes.length>0){
				if(cubes[0].y > h){
					cubes.splice(0,1);
				}
			}
			if(glitches.length>0){
				if(glitches[0].y>h)
					glitches.splice(0,1);
			}
			
			}
		}
		
		function collisionLazer(){
			step = 32;
			if(((square.x-15) < boss.x + boss.pixelSize*4.5)  && ((square.x+15) > boss.x-boss.pixelSize*3.5)){
				lazerHeight = boss.y-h+125;
				colorRate+=1;
				}
			for(var i=0;i<cubes.length;i++){
			if(((square.x-15) < cubes[i].x + (cubes[i].w))  && ((square.x+15) > cubes[i].x)){
				cubes[i].hp-=10;
				lazerHeight = cubes[i].y-h+150;
				if(cubes[i].hp==0)
				{	
					gain.play();
					if(cubes[i].color == 'green')
					{	
						if(G>=255)
							BG= Math.min(BG+step, 255);
						else
							G = Math.min(G+step, 255);

						if (BR<=0) 
							R = Math.max(R-step, 0);
						else
							BR = Math.max(BR-step, 0);
						if (BB<=0)
							B = Math.max(B-step, 0);
						else	
							BB = Math.max(BB-step, 0);
							
						cubes[i].color = 'white';
					}
					
					else if(cubes[i].color=='red')
					{
						
						if(R>=255)
							BR= Math.min(BR+step, 255);
						else
							R = Math.min(R+step, 255);

						if (BG<=0) 
							G = Math.max(G-step, 0);
						else
							BG = Math.max(BG-step, 0);
						if (BB<=0)
							B = Math.max(B-step, 0);
						else	
							BB = Math.max(BB-step, 0);
						
						cubes[i].color = 'white';
					}
						
					else if(cubes[i].color=='blue')
					{

						if(B>=255)
							BB= Math.min(BB+step, 255);
						else
							B = Math.min(B+step, 255);

						if (BG<=0) 
							G = Math.max(G-step, 0);
						else
							BG = Math.max(BG-step, 0);
						if (BR<=0) 
							R = Math.max(R-step, 0);
						else
							BR = Math.max(BR-step, 0);				
					
						cubes[i].color = 'white';
					}
				}
				break;
			}
			else 
				lazerHeight = -h;
			}
		}
		
		function isDeath(){
			if(cubes.length>0){
			if(((square.x-15) < cubes[0].x + (cubes[0].w))  && ((square.x+15) > cubes[0].x) &&
				(square.y-10 < cubes[0].y + cubes[0].h))
				gameEnd();
			}
			for(var i=0;i<glitches.length;i++){
				if(((square.x-15) < glitches[0].x + (glitches[0].w)) && ((square.x+15) > glitches[0].x) && 
				(square.y-10 < glitches[0].y + glitches[0].h))
				gameEnd();
			}
		}
		
		function generateBoxes(){
			if(intro == true)
				return;
			if(BR < 255 && BG < 255 && BB < 255){
				cubes.push({
				hp: 400,
				color: astroidsColor(),
				w: rand(50,100), h:rand(50,100),
				x: rand(100,w-200), y: -500,
				dx:0,dy:0,
				offset: rand(0,10),
				speed: rand(500,2000)
				});
				cubeNumber+=1;
			}
		}
		
		function generateGlitches(){
			if(bossStage == true){
			glitches.push({
				x: rand(boss.x-25,boss.x+25),
				y: rand(boss.y,boss.y+(boss.h)),
				speed:12,
				color:getRandomColor(),
				w: 25 , h:25
			});
			colorRate-=2;
			}
		}
		
		var intro = true
		draw();
		
		function moveArrow(e){
			if(e.keyCode==37)
				leftDown = true;
			if(e.keyCode==39)
				rightDown = true;
			if(xp>=w)
			{if (e.keyCode == 32 && intro) {
				intro = false
			}
			else if(e.keyCode == 32 && gameOver)
			{
				ctx.clearRect(0,0,w,h);
				cancelAnimationFrame(ID);
				R=255,G=255,B=255;
				BR=0,BG=0,BB=0;
				bossStage = false;
				cubes = [];
				square.x = w/2,
				boss.speed = 6,
				boss.x = w/2-20,
				boss.y = -100,
				boss.h = 125,
				boss.w = 125,
				boss.c = "red",
				pixelSize = 20,
				glitches = [];
				gameOver = false ;
				intro = true;
				xp=0;
				colorRate=255;
				draw();
			}
			else if(e.keyCode==32){
				spaceDown = true
				//space lazerdraw
			}
			}
			
		}
			
		function test (e) {
			if(e.keyCode==32){
				spaceDown = false
				//space lazerdraw
			}
			if(e.keyCode==37){
				leftDown = false
				//left down
			}
			if(e.keyCode==39){
				rightDown = false
				//right down
			}
		}
			document.onkeydown = moveArrow;
			document.onkeyup = test;