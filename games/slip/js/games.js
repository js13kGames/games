
class Games {
	constructor(){
		
	}
	init(){
		score = 0;
		enemyPassed = 0;
		playerDirection = 0;
		playerPower = 0;
		playerMaxPower = 0;
		enemySpawnLimit = canvas.height*-0.8;
		playerState = "direction";
		
		player = new Entity(5, canvas.width/2, canvas.height-100);
		enemyArr = [];
		for(var i=0;i<50;i++){
			var enemy = new Entity(6+Math.random()*2, Math.random()*canvas.width, Math.random()*canvas.height*1.5 - canvas.height*0.8);
			enemy.isPassed = false;
			enemy.isClose = false;
			enemyArr.push(enemy);
		}
		playerPosArr = [];
		for(var i=0;i<10;i++){
			playerPosArr.push({pos:{x:player.pos.x, y:player.pos.y}, radius:player.radius});
		}
		
		sequence.play();
	}
	update(){
		var delta = getDeltaTime();
		
		if(playerState == "direction"){
			playerDirection += playerAngle*delta;
			if(playerDirection < - 90 || playerDirection > 90){
				if(playerDirection < -90) playerDirection = -90;
				else if(playerDirection > 90) playerDirection = 90;
				
				playerAngle *= -1;
			}
		}else if(playerState == "charge"){
			playerPower += playerAngle*delta;
			if(playerPower < 0 || playerPower > 100){
				if(playerPower < 0) playerPower = 0;
				else if(playerPower > 100) playerPower = 100;
				
				playerAngle *= -1;
			}
		}else if(playerState == "move"){
			
			playerPower -= Math.abs(0.1)*delta*0.5;
			
			var coef = easeOutSine(playerPower/playerMaxPower);
			
			var angle = ((playerDirection-90)*Math.PI/180);
			var moveX = Math.cos(angle)*2*coef;
			var moveY = -Math.sin(angle)*2*coef;
			
			enemySpawnLimit += moveY;
			
			player.pos.x += moveX;
			if(player.pos.x < player.radius) player.pos.x = player.radius;
			else if(player.pos.x > canvas.width-player.radius) player.pos.x = canvas.width-player.radius;
			
			for(var i = playerPosArr.length-1;i>=0;i--){
				if(i == 0){
					playerPosArr[i].pos.x = player.pos.x;
					playerPosArr[i].pos.y = player.pos.y;
					playerPosArr[i].radius = player.radius;
				}else{
					playerPosArr[i].pos.x = playerPosArr[i-1].pos.x;
					playerPosArr[i].pos.y = playerPosArr[i-1].pos.y+moveY*(i/10);
					playerPosArr[i].radius = playerPosArr[i-1].radius;
				}
			}
			
			for(var i=0;i<enemyArr.length;i++){
				enemyArr[i].pos.y += moveY;
				
				if(enemyArr[i].pos.y > canvas.height*1.2){
					enemyArr[i].radius = 6+Math.random()*2;
					enemyArr[i].pos.x = Math.random()*canvas.width;
					enemyArr[i].pos.y = enemySpawnLimit;
					enemyArr[i].isPassed = false;
					enemyArr[i].isClose = false;
					enemySpawnLimit -= (12 + Math.random()*8);
				}else if(enemyArr[i].pos.y > player.pos.y && enemyArr[i].isPassed == false){
					enemyArr[i].isPassed = true;
					coinSfx();
					
					if(isClose(player, enemyArr[i]) && enemyArr[i].isClose == false){
						enemyArr[i].isClose = true;
						score+=5;
						playerLimitAlphaClose = 1;
					}else{
						score+=1;
						playerLimitAlpha = 1;
					}
					
					enemyPassed++;
					if(enemyPassed % 15 == 0){
						player.radius++;
					}
				}
			}
			
			//Check collision
			for(var i=enemyArr.length-1;i>=0;i--){
				if(isCollide(player, enemyArr[i])){
					playerState = "gameover";
					sequence.stop();
					deathSfx();
					backgroundColor.r=254;
					backgroundColor.g=20;
					backgroundColor.b=20;
					
					if(score > bestScore){
						bestScore = score;
						localStorage.setItem("com.harsanalif.slip.bestScore",bestScore);
					}
				}
			}
			
			if(playerPower <= 0){
				playerPower = 0;
				playerState = "direction";
			}
		}
		
		if(backgroundColor.isReset() == false){
			if(backgroundColor.r > 5) backgroundColor.r-=2;
			else if(backgroundColor.r < 5) backgroundColor.r = 5;
			if(backgroundColor.g > 5) backgroundColor.g-=2;
			else if(backgroundColor.g < 5) backgroundColor.g = 5;
			if(backgroundColor.b > 5) backgroundColor.b-=2;
			else if(backgroundColor.b < 5) backgroundColor.b = 5;
		}
		
		if(playerLimitAlpha > 0){
			playerLimitAlpha -= 0.03*delta;
			if(playerLimitAlpha < 0) playerLimitAlpha = 0;
		}
		
		if(playerLimitAlphaClose > 0){
			playerLimitAlphaClose -= 0.02*playerLimitAlphaClose;
			if(playerLimitAlphaClose < 0) playerLimitAlphaClose = 0;
		}
	}
	draw(){
		
		ctx.font = "16px Courier";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		for(var i=0;i<enemyArr.length;i++){
			if(enemyArr[i].isPassed) this.drawEntityEnemy(enemyArr[i], "#0095DD");
			else this.drawEntityEnemy(enemyArr[i], "#DD0000");
			
			if(enemyArr[i].isClose){
				ctx.globalAlpha = playerLimitAlphaClose;
				ctx.fillText("CLOSE! +5", enemyArr[i].pos.x, enemyArr[i].pos.y-20);
				ctx.globalAlpha = 1;
			}
		}
		
		if(playerState == "direction"){
			//Direction
			ctx.save();
			ctx.closePath();
			ctx.translate(player.pos.x, player.pos.y);
			ctx.rotate((playerDirection-90)*Math.PI/180);
			ctx.beginPath();
			ctx.rect(0, -3, 100, 6);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.restore();
			
			if(isFirstTime){
				ctx.font = "20px Courier";
				ctx.fillStyle = "#FFFFFF";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText("HOLD DOWN TO START CHARGING", canvas.width*0.5, canvas.height*0.1);
			}
		}else if(playerState == "charge"){
			//Charge
			ctx.save();
			ctx.closePath();
			ctx.translate(player.pos.x, player.pos.y);
			ctx.rotate((playerDirection-90)*Math.PI/180);
			ctx.beginPath();
			ctx.rect(0, -3, 100, 6);
			ctx.fillStyle = "#777777";
			ctx.fill();
			ctx.beginPath();
			ctx.rect(0, -3, playerPower, 6);
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.restore();
			
			if(isFirstTime){
				ctx.font = "20px Courier";
				ctx.fillStyle = "#FFFFFF";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText("RELEASE TO MOVE", canvas.width*0.5, canvas.height*0.1);
			}
		}
		
		//Player Line 1
		ctx.save();
		ctx.globalAlpha = playerLimitAlpha;
		ctx.beginPath();
		ctx.rect(0, player.pos.y-2, canvas.width, 4);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.restore();
		//Player Line 2
		ctx.save();
		ctx.globalAlpha = playerLimitAlphaClose;
		ctx.beginPath();
		ctx.rect(0, player.pos.y-4, canvas.width, 8);
		ctx.fillStyle = "#ffffff";
		ctx.fill();
		ctx.restore();
		
		this.drawEntity(player, "#0095DD");
		for(var i = playerPosArr.length-1;i>=0;i--){
			ctx.globalAlpha = 1-(i/playerPosArr.length);
			this.drawEntity(playerPosArr[i], "#0095DD");
		}
		ctx.globalAlpha = 1;
		
		if(playerState == "gameover"){
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#000000";
			ctx.globalAlpha = 0.75;
			ctx.fill();
			ctx.globalAlpha = 1;
			
			ctx.font = "60px Courier";
			ctx.fillStyle = "#FF0000";
			ctx.fillText("GAME OVER", canvas.width*0.5, canvas.height*0.5);
			
			ctx.font = "30px Courier";
			ctx.fillStyle = "#FFFFFF";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("SCORE: "+score, canvas.width*0.5, canvas.height*0.675);
			
			ctx.font = "24px Courier";
			ctx.fillStyle = "#FFFFFF";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("BEST SCORE: "+bestScore, canvas.width*0.5, canvas.height*0.6);
		}else{
			ctx.font = "20px Courier";
			ctx.fillStyle = "#FFFFFF";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("SCORE: "+score, canvas.width*0.5, canvas.height*0.95);
		}
		
	}
	onPointerDown(e){
		if(playerState == "direction"){
			playerState = "charge";
		}else if(playerState == "gameover"){
			changeScene(new Title());
		}
	}
	onPointerUp(e){
		if(playerState == "charge"){
			playerMaxPower = playerPower;
			playerState = "move";
			launchSfx();
			isFirstTime = false;
		}
	}
	end(){
		backgroundColor.r = 5;
		backgroundColor.g = 5;
		backgroundColor.b = 5;
	}
	drawEntity(entity, color){
        ctx.beginPath();
        ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, Math.PI*2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
	}
	drawEntityEnemy(entity, color){
        ctx.beginPath();
		ctx.moveTo(entity.pos.x, entity.pos.y-entity.radius);
		ctx.lineTo(entity.pos.x+entity.radius, entity.pos.y);
		ctx.lineTo(entity.pos.x, entity.pos.y+entity.radius);
		ctx.lineTo(entity.pos.x-entity.radius, entity.pos.y);
		ctx.lineTo(entity.pos.x, entity.pos.y-entity.radius);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
	}
}

class Entity{
	constructor(radius, posX, posY){
		this.radius = radius;
		this.pos = {x:posX, y:posY};
	}
}

class Effect{
	constructor(posX, posY, text){
		this.alpha = 1;
		this.text = text;
		this.pos = {x:posX, y:posY};
	}
}