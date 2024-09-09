var score = 0;
var hero = {   
		x: 300,
		y: 400
	}

var enemies = [{x: 50, y:50},{x: 250, y:50}, {x: 450, y:250}, {x: 550, y:250}]; 

var bullets = [];

function displayHero(){ 
	document.getElementById('hero').style['top'] = hero.y + "px"; 
	document.getElementById('hero').style['left'] = hero.x + "px";
}

function displayEnemies(){
	var output = ''; 
	for(var i=0; i<enemies.length; i++){ 
		output += "<div class='enemy1' style='top:"+enemies[i].y+"px; left:"+enemies[i].x+"px;'></div>";  // Displays Enemies
	}
	document.getElementById('enemies').innerHTML = output;
}

function moveEnemies(){
	for(var i=0; i<enemies.length; i++){
		enemies[i].y += 5;

		if(enemies[i].y > 540){
			enemies[i].y = 0;
			enemies[i].x = Math.random()*500;
		}
	}
}

function moveBullets(){
	for(var i=0; i<bullets.length; i++){
		bullets[i].y -= 5;

		if (bullets[i].y<0){
			bullets[i] = bullets[bullets.length-1];
			bullets.pop();
		}
	}
}


function displayBullets(){
	var output = '';
	for(var i=0; i<bullets.length; i++){
		output += "<div class='bullet' style='top:"+bullets[i].y+"px; left:"+bullets[i].x+"px;'></div>"; 
		}
		document.getElementById('bullets').innerHTML = output;
	}
	
function displayScore(){
	document.getElementById('score').innerHTML = score;	
}

function gameLoop(){
	displayHero();
	moveEnemies();
	displayEnemies();
	moveBullets();
	displayBullets();
	detectCollision();
	displayScore();
}

function detectCollision(){
	for(var i=0; i<bullets.length; i++){
		for(var j=0; j<enemies.length; j++){

			if( Math.abs(bullets[i].x - enemies[j].x) < 10 && Math.abs(bullets[i].y - enemies[j].y) < 10) {
				console.log('bullet', i, 'and enemy',j, 'collided');
				score += 10;
			}
		}		
	}
};
 
setInterval(gameLoop, 20); // runs gameLoop 

document.onkeydown = function(a) {  
	if(a.keyCode == 37){ // key left
		hero.x -= 10; 
	} else if(a.keyCode == 39){ // key right
		hero.x += 10;
	}
	if(a.keyCode == 38){ // key up
		hero.y -= 10;
	} else if (a.keyCode == 40){ // key down
		hero.y += 10;
	} else if (a.keyCode == 32){ // space bar
		bullets.push({x: hero.x+6, y: hero.y-15});
		displayBullets();
	}
	displayHero(); 
}

displayHero(); 
displayEnemies(); 