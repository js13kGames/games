ctx = document.getElementById('canvas').getContext('2d');

firecolor = false; //fire 'blink' animation
fireposition = [600, 800]; //2 bonfire
deathposition = 94; //coord of Grim Reaper
score = 0;

death = new Image();
death.src = "death.png";
death.onload = function() {ctx.drawImage(death, 26, 94);}; //load and draw Grim Reaper on canvas

function gameloop() {
	//sky
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, 620, 160);

	//ground
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 160, 620, 40);

	//display score on corner
	ctx.fillText(score, 8, 16);

	//waterMark
	ctx.fillStyle = '#ffffff';
	ctx.fillText("js13kGames", 554, 184);

	//character on position
	ctx.drawImage(death, 26, deathposition);

	collision = false;

	fireposition[0] -= 22; //fire 1 moves fast
	fireposition[1] -= 14; //fire 2 moves slow

	for(x = 0; x < 2; x++) { //2 bonfire

		if(firecolor == x) { //bonfire[x] frame 1

			ctx.fillStyle = '#bb6644';

			ctx.beginPath();
			ctx.moveTo(fireposition[x] + 50, 156);
			ctx.lineTo(fireposition[x] + 30, 156);
			ctx.lineTo(fireposition[x] + 14, 136);
			ctx.lineTo(fireposition[x] + 35, 146);
			ctx.lineTo(fireposition[x] + 40, 126);
			ctx.lineTo(fireposition[x] + 45, 146);
			ctx.lineTo(fireposition[x] + 64, 136);
			ctx.fill();

		} else { //bonfire[x] frame 2

			ctx.fillStyle = '#ff9966';

			ctx.beginPath();
			ctx.moveTo(fireposition[x] + 50, 156);
			ctx.lineTo(fireposition[x] + 30, 156);
			ctx.lineTo(fireposition[x] + 24, 130);
			ctx.lineTo(fireposition[x] + 40, 150);
			ctx.lineTo(fireposition[x] + 54, 130);
			ctx.fill();
		}

		if(fireposition[x] < 0) {
			fireposition[x] = 660; //respawn
			score++;
		}

		if(fireposition[x] < 30 && fireposition[x] > -40 && deathposition > 66) collision = true;
	}

	firecolor = !firecolor; //fire 'blink' animation

	//handle position on screen
	if(deathposition % 2 == 0 && deathposition < 94) deathposition -= 8; //character jumping up
	else if(deathposition < 88) deathposition += 8; //character falling (if does not hit the ground) 
	if(deathposition < 26) deathposition = 23; //if character reach top it start fall

	if(collision) {
		alert('game over'); //'game over' message
		deathposition = 94; //reset jump
		fireposition = [600, 800]; //reset both bonfire position
		score = 0; //reset score
	}
}

setInterval(gameloop, 50);

document.addEventListener("keydown", function() {
	if(deathposition > 80) deathposition = 88; //start the jump
});