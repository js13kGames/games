window.onload = function(){
	var ctx = [], 
		dots = [], //clear dots for every level
		balls = [],
		board = {
			width: 188, 
			height: 110
		},
		rect = {},
		rim = {},
		settings = {
			width: 320, 
			height: 480,
			level: 0, 
			score: 0, 
			numBall: 5,
		};
		
	function ball(){
		//settings
		this.max = 120,
		this.radius = 50,
		this.hyp = 0,
		this.release = false,
		this.move = false,
		this.hitBoard = false,
		this.rotate = 0,
		
		//use for calc
		this.originalX = settings.width*0.5, this.originalY = settings.height*0.6, 
		this.x = settings.width*0.5, this.y = settings.height*0.6,
		this.vX = 0, this.vY = 0
	}
	
	function dot(x, y){
		this.x = x,
		this.y = y,
		this.hit = false, 
		this.radius = 16
	}

	window.requestAnimFrame = (function(callback){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
    })();

//MODEL---------------------------------------------//		
	function initialize(){		
		var date = new Date();
        var time = date.getTime();
		
		balls.push(new ball);
		renderBackground(function(){
			renderHoop(function(){
				bindInputs(function(){
					advanceLevel();
					animate(time); 	
				});
			});
		}); 
	}
	
	function createCanvas(element, handle){
		var el = document.getElementById(element),
			canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'); 
	
		canvas.width = settings.width;
		canvas.height = settings.height;
		canvas.id = handle;
		
		context.clearRect(0,0,canvas.width,canvas.height);
		el.appendChild(canvas);
		ctx[handle] = context;
		
		return ctx[handle];
	}

	
	function advanceLevel(){
		settings.numBall = 5;
		settings.level++;
		levelDots(settings.level);
		drawLife();
		announce('Level '+ settings.level);
	}
	
	function playAgain(str){
		var pause = document.getElementById('pause-overlay'), 
			msg = document.getElementById('msg');
		msg.innerHTML = str;
		pause.style.display ='block';
	}
	
	function levelDots(x){
		var renderLevel = {
				1: [
					[settings.width/2, 110],
					[settings.width/2, 170]
				],
				2: [
					[settings.width*0.2,110], 
					[settings.width*0.4,130], 
					[settings.width*0.6,150], 
					[settings.width*0.8,170], 
				],
				3: [
					[settings.width*0.33, 80],
					[settings.width*0.66, 120],
					[settings.width*0.33, 160],
					[settings.width*0.66, 200]
				],
				4: [
					[settings.width*0.25, 80],
					[settings.width*0.5, 110],
					[settings.width*0.75, 140]
				], 
				5: [
					[settings.width*0.1, 20],
					[settings.width*0.2, 35],
					[settings.width*0.3, 50],
					[settings.width*0.4, 65],
					[settings.width*0.5, 80],
					[settings.width*0.6, 95],
					[settings.width*0.7, 110],
					[settings.width*0.8, 125],
					[settings.width*0.9, 140],	
					[settings.width*0.8, 155],
					[settings.width*0.7, 170],
					[settings.width*0.6, 185],
					[settings.width*0.5, 200],
					[settings.width*0.4, 215],
					[settings.width*0.3, 230],
					[settings.width*0.2, 245],
					[settings.width*0.1, 260],
				]
			};
		
		dots = []; 

		if(renderLevel[x]){
			renderLevel[x].map(function(el){
				dots.push(new dot(el[0],el[1]));
			});
		} else {
			playAgain('You won!');
		}
	}
	
	function announce(str){
		var element = document.getElementById('announcement');
			
		element.innerHTML = str;
		element.className = '';
		setTimeout(function(){element.className = 'zoomfade';}, 1);
	}
	
	function clickBall(click, thisBall){
		var hyp = findHyp(click.clientX, click.clientY, thisBall.x, thisBall.y);
		
		if(hyp < thisBall.radius) {return true;}
		
		return false;
	}
	
	function findHyp(x, y, i, j){
		var a = x - i, 
			b = y - j;
			
		return Math.sqrt((a*a) + (b*b));
	}
	
	function updateDots(){
		var thisBall = balls[balls.length-1];
		for(var i = 0; i < dots.length; i++){
			var hyp = findHyp(thisBall.x, thisBall.y, dots[i].x, dots[i].y);
		
			if(hyp < thisBall.radius) dots[i].hit = true;
		}
		
		if (dots.length == checkHit()){
			balls.push(new ball);
			advanceLevel();	
			return;
		}
	}
	
	function checkHit(){
		var score = 0;
		for (var i = 0; i < dots.length; i++){
			if (dots[i].hit == true) score++;
		}
		console.log(score + '=' + dots.length);
		if(score > 0){
			return score;
		} else {
			return 9999;
		}
	}
	
	function animate(lastTime){	
		var date = new Date(); 
        var time = date.getTime();
        var timeDiff = time - lastTime;
	
		for (var i = 0; i < balls.length; i++){			
			if(balls[i].release){
				update(timeDiff, balls[i]);				
			}
			updateDots(balls[i]);
			drawBall();
		} 	
		
		checkBall();
		renderDots();		
		requestAnimFrame(function(){animate(time);});
	}
	
	function checkBall(){
		var thisBall = balls[balls.length-1];

		if(thisBall.release && thisBall.vX == 0 && thisBall.vY < 1){
			if(settings.numBall){
				balls.push(new ball);
				settings.numBall--;
				drawLife();
			} else {
				playAgain('Game over');
			}
		}
	}
	
	function update(timeDiff, thisBall){
		var floorFriction = 1 * timeDiff / 1000, 
			shrinkRadius = -1 * timeDiff / 1000 * thisBall.hyp, 
			gravity, 
			ceiling = false, 
			bleacherHeight = (settings.height/12)*10.5;
		
		if(thisBall.y > settings.height){
			gravity = 10;
		} else {
			gravity = 20 * timeDiff / 1000;
		}
			
		thisBall.vY += gravity;
		//must be before borders
		thisBall.x += thisBall.vX;
		thisBall.y += thisBall.vY;
		
		//border	
		if(thisBall.y + thisBall.radius >= bleacherHeight){
			thisBall.y = bleacherHeight - thisBall.radius; //resets position if next frame moves ball below floor
			thisBall.vY *= -1;
			thisBall.vY *= 0.65;
		}
		
		if((thisBall.x + thisBall.radius) >= settings.width){
			thisBall.x = settings.width - thisBall.radius; 
			thisBall.vX *= -1;
			thisBall.vX *= 0.8;
		} 
		
		if((thisBall.x - thisBall.radius) <= 0){
			thisBall.x = thisBall.radius;
			thisBall.vX *= -1;
			thisBall.vX *= 0.8;
		}
		
		if (thisBall.y + thisBall.radius == bleacherHeight) {
			if (thisBall.vX > 0.1) {
				thisBall.vX -= floorFriction;
				thisBall.rotate -= floorFriction;
			}
			else if (thisBall.vX < -0.1) {
				thisBall.vX += floorFriction;
				thisBall.rotate += floorFriction;
			} 
			else{
				thisBall.vX = 0;
				thisBall.rotate = 0;
			}
		}
	
		if(thisBall.radius < 25) {
			thisBall.hitBoard = true;
		} 
			
		if(!thisBall.hitBoard){
			thisBall.radius += shrinkRadius;
		}
		
	}
	
	
//VIEWS---------------------------------------------//		
	function drawLife(){
		var rimctx = ctx['rimctx'], 
			img = new Image(), 
			diam = 50;

		img.src = 'img/bball.png';
			
		var x = diam + 5,
			y = settings.height * 0.885;
		
		rimctx.save();
		rimctx.clearRect(0, settings.height * 0.85, settings.width, settings.height);
		
		for(var i = 0; i < settings.numBall; i++){
			rimctx.drawImage(img, settings.width - (x * (i+1)), y, diam, diam);
		}
		
		rimctx.restore();
	}
	
	function renderDots(){
		var dotsctx = ctx['dotsctx'] || createCanvas('game-screen', 'dotsctx'), 
			img = new Image();
			
		img.src = 'img/star.png';
		
		dotsctx.clearRect(0, 0, settings.width, settings.height);
		
		for(var i = 0; i < dots.length; i++){
			if(!dots[i].hit){
			dotsctx.drawImage(img, dots[i].x - dots[i].radius, dots[i].y - dots[i].radius);
			}
		}	
	}
	
	function drawBall(){			
		var ballctx = ctx['ballctx'] || createCanvas('game-screen', 'ballctx'), 
			img = new Image();
		
		img.src = 'img/bball.png';
		
		ballctx.clearRect(0, 0, settings.width, settings.height)
			
		for(var i = 0; i < balls.length; i++){
			var radius = balls[i].radius;
			ballctx.save();
			ballctx.drawImage(img, balls[i].x - radius, balls[i].y - radius, radius*2, radius*2 + 3);
			ballctx.restore();
		}
	}
	
	function renderBackground(callback){
		var bleacherHeight = (settings.height/12)*10.5,
			floorHeight = (settings.height/12)*1.5, 
			bgctx = createCanvas('game-screen', 'bgctx'); //ctx[0]
			
		board.left = (settings.width - board.width)/2;
		board.top = (settings.height - board.height)/8; 
		rect.width = (board.width/72)*24;
		rect.height = (board.height/42)*18;
		rect.left = ((board.width-rect.width)/2) + board.left;
		rect.top = ((board.height-rect.height)*.66) + board.top;
	
		bgctx.save();
			bgctx.fillStyle = '#E9E9E9';
			bgctx.fillRect(0, 0, settings.width, bleacherHeight); //bleacher
			
			bgctx.fillStyle = '#FDBB2F';
			bgctx.fillRect(0, bleacherHeight, settings.width, floorHeight); //floor
			
			bgctx.beginPath(); //line
			bgctx.strokeStyle = 'black';
			bgctx.lineWidth = 0.1;
			bgctx.moveTo(0, bleacherHeight);
			bgctx.lineTo(settings.width, bleacherHeight);
			bgctx.stroke();
			bgctx.closePath();
			
			bgctx.fillStyle = 'white';
			bgctx.fillRect(board.left, board.top, board.width, board.height);
			bgctx.strokeStyle = 'black';
			bgctx.lineWidth = 2;
			bgctx.strokeRect(board.left, board.top, board.width, board.height);
			bgctx.strokeRect(rect.left, rect.top, rect.width, rect.height); 
		bgctx.restore();

		callback();
	}
	
	function renderHoop(callback){
		var rimctx = createCanvas('game-screen', 'rimctx');
		
		rim.top = rect.top + rect.height + 5;
		rim.lineTo = rect.left + rect.width;
	
		rimctx.save();
			rimctx.beginPath();
			rimctx.strokeStyle = 'red';
			rimctx.lineWidth = 3;
			rimctx.moveTo(rect.left, rim.top);
			rimctx.lineTo(rim.lineTo, rim.top);
			rimctx.stroke();
			rimctx.closePath();
		rimctx.restore();
		
		callback();
	}
	
	function powerBar(mouseUp, hyp, max){
		var	thisBall = balls[balls.length-1],
			rimctx = ctx['rimctx'], 
			x = 15,
			y = settings.height * 0.8,
			gradient;
		
		gradient = rimctx.createLinearGradient(x, y, x, y - max);
		gradient.addColorStop(0, "rgb(42, 255, 7)");
		gradient.addColorStop(0.5, "rgb(253, 250, 23)");
		gradient.addColorStop(1, "rgb(255, 130, 9)");
	
		clearPower(x, y, max, rimctx);
		
		rimctx.save();
		rimctx.fillStyle = gradient;
		rimctx.fillRect(x, y, x, -hyp);
		rimctx.restore();
		
		if(mouseUp && hyp > 0.5){
			hyp *= 0.8;
			requestAnimFrame(function(){
                powerBar(true, hyp, max);
			});
		} 
		return;
	}
	
	function clearPower(x, y, max, ctx){
		ctx.save(false);
		ctx.clearRect(x, y, x, -max);
		ctx.restore();
	}
	
	//CONTROLLER
	function bindInputs(callback){
		document.addEventListener('mousedown', begin, false);
		document.addEventListener('touchdown', begin, false);
		document.addEventListener('mouseup', end, false);
		document.addEventListener('touchup', end, false);
		
		callback();
	};
	
	function begin(click){		
		document.addEventListener('mousemove', move, false);
		document.addEventListener('touchmove', move, false);
		
		if(click.target.nodeName == 'BUTTON'){
			var pause = document.getElementById('pause-overlay');
			
			balls = [];
			balls.push(new ball);
			settings.level = 0;
			pause.style.display = 'none';
			advanceLevel();
		}
	}
	
	function move(click){
		var	thisBall = balls[balls.length-1];
		
		if(clickBall(click, thisBall) && !thisBall.release){
			thisBall.x = click.pageX || click.clientX,
			thisBall.y = click.pageY || click.clientY;

			thisBall.vX = (thisBall.originalX - thisBall.x) * 0.25; //dampener
			thisBall.vY = (thisBall.originalY - thisBall.y) * 0.25;
			
			thisBall.hyp = Math.min(findHyp(thisBall.originalX, thisBall.originalY, thisBall.x, thisBall.y), thisBall.max);
			
			thisBall.move = true;
		}
		
		powerBar(false, thisBall.hyp, thisBall.max);	
		return false;
	}

	function end(){
		var	thisBall = balls[balls.length-1],
			date = new Date;
		
		if(thisBall.move){
			thisBall.release = date.getTime();
			powerBar(true, thisBall.hyp, thisBall.max);
		}
		
		document.removeEventListener('mousemove', move, false);
		document.removeEventListener('touchmove', move, false);
		
		return false;
	}

	
	initialize();
};