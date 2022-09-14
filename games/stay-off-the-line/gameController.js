var myGamePiece;
var waterArea;
var skyArea;
var enemies = new Array();
var gameControl;
var myPauseButton;

class gameStateController
{
	/*things gameStateController will need to keep track of:
		-score
		-is game over
		-is game paused
		-difficulty multiplier, difficulty timer, game timer, enem timer all can be here instead of globals
	*/

	constructor()
	{
		this.diffTimer = 0;
		this.diffMulti = 0;
		this.gameTimer = 0;
		this.enemTimer = 0;
		this.score = 0;
		this.isPaused = false;
		this.isGameOver = false;
		this.deathString = "";
		this.highScore = 0;
	}

	updateScore()
	{
		var ctx = myGameArea.context;
		ctx.font = "30px Arial";
		
		ctx.textAlign = "left";
		if(!this.isGameOver)
		{
			if(this.score <= this.highScore)
				ctx.fillStyle = "green";
			else
				ctx.fillStyle = "yellow";
			ctx.fillText("Score: " + this.score, 10, 50);
		}
		else
		{
			ctx.fillStyle = "red";
			ctx.fillText("You Scored: " + this.score, 10, 50);
			ctx.textAlign = "right";
			ctx.fillText("Press [R] to Restart!", 790, 50);
			gameOverText(this.deathString);
		}
	}
}

function startGame() {
	gameControl = new gameStateController();
	updateLocalStorage(0);
	//only initialize game area if it has not been initialized before
	if(!myGameArea.canvas.innerHTML)
    	myGameArea.start();
    waterArea = new component(800,550, "lightblue", 0, 100);
    skyArea = new component(800,100, "#E6CAAD", 0, 0);
    myGamePiece = new player(32, 32, ["fish1.png","fish2.png"], 400, 275, "image", true);
    //spawns a boat from either side when starting
    generateEnemy();
    generateEnemy();
    if(enemies[0].isRight == enemies[1].isRight)
    	enemies[0].isRight = !enemies[1].isRight;
    myPauseButton = new pauseButton(740, 10, 50, 50);
    //with(new AudioContext)[5,7,13].map((v,i)=>{with(createOscillator())v&&start(e=[3,3,3][i]/5,connect(destination),frequency.value=988/1.06**v,type='sawtooth',)+stop(e+.2)});
}

function restartGame()
{
	myGameArea.clear();
	enemies = new Array();
	delete myGamePiece;
	startGame();

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.innerHTML = "Your Browser does not support HTML5 canvas!"
        this.context = this.canvas.getContext("2d");
        var insertPoint = document.getElementById("gameColumn");
        insertPoint.appendChild(this.canvas);
        //for 60 fps
        this.interval = setInterval(updateGameArea, 16.6666666667);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
        this.canvas.addEventListener('click', function(evt) {
			var mousePos = getMousePos(this.canvas, evt);
			if (isInside(mousePos,myPauseButton) && !gameControl.isGameOver) {
				gameControl.isPaused = !gameControl.isPaused;
		    }	
		}, false);
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    
    if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[65])) {
    	myGamePiece.speedX = -5;
    	if(!gameControl.isPaused)
    		myGamePiece.isRight = false;
    }
    if (myGameArea.keys && (myGameArea.keys[39] || myGameArea.keys[68])) {
    	myGamePiece.speedX = 5; 
    	if(!gameControl.isPaused)
    		myGamePiece.isRight = true;
    }
    if (myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87])) {
    	myGamePiece.speedY = -5; 
    }
    if (myGameArea.keys && (myGameArea.keys[40] || myGameArea.keys[83])) {
    	myGamePiece.speedY = 5; 
    }
    if (myGameArea.keys && myGameArea.keys[32])
    {
    	if(myGamePiece.boostCd)
    	{
    		myGamePiece.boostCd--;
    	}
    	else if(myGamePiece.totalBoosts && (myGamePiece.speedX != 0 || myGamePiece.speedY != 0) && !myGamePiece.isBoosting)
    	{
    		myGamePiece.boost();
    	}
    }
    if(myGameArea.keys && myGameArea.keys[82])
    {
    	if(gameControl.isGameOver)
    	{
    		restartGame();
    	}
    }
    //get water area
    waterArea.update();
    //get sky area
    skyArea.update();
    //get pause button
    if(!gameControl.isGameOver)
    	myPauseButton.update();
    //get enemies
    for(var i = 0; i < enemies.length; i++)
    {
    	if(gameControl.isGameOver && !enemies.isEnding)
    		enemies[i].endAnimation();
    	enemies[i].newPos();
    	enemies[i].update();
    }

    //get player
    myGamePiece.newPos();   
    myGamePiece.update();

    gameControl.updateScore();

    //check for collision with player, hooks and bait
    if(!gameControl.isGameOver)
    {
	    var j = 0;
	    for(var i = 0; i < enemies.length; i++)
	    {
	    	if(myGamePiece.checkCollision(enemies[i]))
	    	{
	    		bonkSfx();
	    		gameControl.deathString = "BONKED!";
	    		gameControl.isPaused = true;
	    		gameControl.isGameOver = true;
	    		enemies[i].hasFish = true;
	    		updateLocalStorage(gameControl.score);
	    		break;
	    	}

	    	for(j = 0; j < enemies[i].linesArray.length; j++)
	    	{
	    		if(myGamePiece.checkCollision(enemies[i].linesArray[j].hook))
	    		{
	    			//pause + gameover if player hits hook
	    			hookSfx();
	    			gameControl.deathString = "HOOKED!";
	    			gameControl.isPaused = true;
	    			gameControl.isGameOver = true;
	    			enemies[i].hasFish = true;
	    			updateLocalStorage(gameControl.score);
	    			enemies[i].linesArray[j].isReeling = true;
	    			myGamePiece.hookAttached = enemies[i].linesArray[j].hook;
	    		}

	    		if(enemies[i].linesArray[j].hasBait)
	    		{
	    			if(myGamePiece.checkCollision(enemies[i].linesArray[j].lineBait))
	    			{
	    				eatSfx();
	    				gameControl.score += 5;
	    				enemies[i].linesArray[j].hasBait = false;
	    				delete enemies[i].linesArray[j].lineBait;
	    				//limits three boosts
	    				if(myGamePiece.totalBoosts < 3)
	    					myGamePiece.totalBoosts++;
	    				//add to hunger timer
	    				myGamePiece.hungerTimer += 240;
	    			}
	    		}
	    	}
	    }
	}

	var tempEnem;
	//checks if enemies are off screen, deletes if they are
	for(var i = 0; i < enemies.length; i++)
	{
		tempEnem = enemies[i];
		if(tempEnem.isOffScreen())
		{
			enemies.splice(i,1);
			delete tempEnem;
			i--;
		}
	}
    
    //increments game times (if game is not paused)
    if(!gameControl.isPaused)
   	{ 
   		gameControl.gameTimer++;
	    gameControl.diffTimer++;
	    gameControl.enemTimer++;
	    if(gameControl.gameTimer % 60 == 0)
	    	gameControl.score++;
	    myGamePiece.hungerTimer--;
	    if(myGamePiece.hungerTimer < 0)
	    {
	    	starveSfx();
	    	gameControl.deathString = "STARVED!";
	    	gameControl.isPaused = true;
	    	gameControl.isGameOver = true;
	    	updateLocalStorage(gameControl.score);
	    	myGamePiece.starve();
	    }
	}

    //spawns enemy based on difficulty
    if(gameControl.enemTimer >= ((60 * 10) - (60 * (gameControl.diffMulti - 1))))
    {
    	if(gameControl.diffMulti < 1)
    	{
    		generateEnemy();
    		gameControl.enemTimer = 0;
    	}
    	else if(gameControl.diffMulti < 6)
    	{
    		generateEnemy();
    		generateEnemy();
    		gameControl.enemTimer = 0;
    	}
    	else
    	{
    		generateEnemy();
    		generateEnemy();
    		generateEnemy();
    		gameControl.enemTimer = 0;
    	}

    }
    //increase difficulty every 5 seconds
    if(gameControl.diffTimer >= ((60 * 7)))
    {
    	if(gameControl.diffMulti != 9)
    		gameControl.diffMulti++;
    	gameControl.diffTimer = 0;
    }
}

class component{
	constructor(width, height, images, x, y, type,isRight)
	{
		this.type = type;
	  	if (this.type == "image") {
	  		this.images = images;
		    this.image = new Image();
		    this.image.src = images[0];
	  	}
	  	else
	  	{
	  		this.images = images;
	  	}
	    this.gamearea = myGameArea;
	    this.width = width;
	    this.height = height;
	    this.speedX = 0;
	    this.speedY = 0;    
	    this.x = x;
	    this.y = y;    
	    this.isRight = isRight;
	    this.shouldFlipY = false;
	}
	update()
	{
		var ctx = myGameArea.context;
	    if (this.type == "image") {
	    	if(!this.isRight)
	    	{
	    		if(this.shouldFlipY)
	       		{
		       		ctx.save();
		       		ctx.scale(-1,-1);
		       		ctx.drawImage(this.image,-this.x -this.width,-this.y - this.height);
		       		ctx.restore();
	       		}
	       		else
	       		{
		    		ctx.save();
					ctx.scale(-1, 1);
					ctx.drawImage(this.image, 
			        -this.x - this.width, 
			        this.y,
			        this.width, this.height);
			        ctx.restore();
		    	}
	    	}
	    	else
	    	{
	    		if(this.shouldFlipY)
	      		{
		       		ctx.save();
		       		ctx.scale(1,-1);
		       		ctx.drawImage(this.image,this.x,-this.y - this.height);
		       		ctx.restore();
	       		}
	       		else
	       		{
				    ctx.drawImage(this.image, 
			        this.x, 
			        this.y,
			        this.width, this.height);
				}
	       }

  		}
  		//fill in rect if no image passed
  		else{
		    ctx.fillStyle = this.images;
		    ctx.fillRect(this.x, this.y, this.width, this.height);
		}
    }

    checkCollision(otherComponent)
	{
		//checks if this component is within another
		if(this.x < otherComponent.x + otherComponent.width && this.x + this.width > otherComponent.x 
			&& this.y < otherComponent.y + otherComponent.height
			&& this.y + this.height > otherComponent.y)
		{
			return true;
		}

		return false;
	}
}

class player extends component
{
	constructor(width, height, images, x, y, type,isRight)
	{
		super(width,height,images,x,y,type,isRight);
		this.playerAnimCount = 0;
		this.curPlayerAnimIndex = 0;
		this.hookAttached = null;

		//boost related variables to keep track of
		this.totalBoosts = 3;
		this.isBoosting = false;
		this.boostLocation = new Array(0,0);
		this.boostLength = 100; //length of boost in pixels
		this.boostDuration = 5; //duration of boost in frames
		this.boostCd = 0;
		this.hungerTimer = 1800;//1800 = 30sec
	}

	updateAnim()
	{
		if(this.playerAnimCount > 10)
	    {
	    	if(this.curPlayerAnimIndex == (this.images.length - 1))
	    	{
	    		this.image.src = this.images[0];
	    		this.curPlayerAnimIndex = 0;
	    	}
	    	else
	    	{
	   			this.curPlayerAnimIndex++;
	    		this.image.src = this.images[this.curPlayerAnimIndex];
	    	}

	    	this.playerAnimCount = 0;
	    }
	}

	newPos()
	{
		if(!gameControl.isPaused)
		{
			var borderCollisionX = false;
	    	var borderCollisionY = false;

	    	//these variables will hold the speed of x that we are adding to player (depends on whether player is boosting or not)
	    	var tempSpeedX;
	    	var tempSpeedY;

	    	if(this.isBoosting)
	    	{
				if(this.x != this.boostLocation[0])
				{
					if(this.x <= this.boostLocation[0])
						tempSpeedX = this.boostLength / this.boostDuration;
					else
						tempSpeedX = (this.boostLength / this.boostDuration) * -1;
				}
				else
				{
					tempSpeedX = 0;
				}
				if(this.y != this.boostLocation[1])
				{
					if(this.y <= this.boostLocation[1])
						tempSpeedY = this.boostLength / this.boostDuration;
					else
						tempSpeedY = (this.boostLength / this.boostDuration) * -1;
				}
				else
				{
					tempSpeedY = 0;
				}
	    	}
	    	else
	    	{
	    		tempSpeedX = this.speedX;
	    		tempSpeedY = this.speedY;
	    	}

	    	if(this.x + tempSpeedX > myGameArea.canvas.width - this.width)
	    	{
	    		this.x = myGameArea.canvas.width - this.width;
	    		borderCollisionX = true;

	    	}
	    	if(this.x + tempSpeedX < 0)
	    	{
	    		this.x = 0;
	    		borderCollisionX = true;
	    	}
	    	if(this.y + tempSpeedY > myGameArea.canvas.height - this.height)
	    	{
	    		this.y = myGameArea.canvas.height - this.height;
	    		borderCollisionY = true;
	    	}
	    	if(this.y + tempSpeedY < 100)
	    	{
	    		this.y = 100;
	    		borderCollisionY = true;
	    	}
	    	if(!borderCollisionX)
	    	{
	    		this.x += tempSpeedX; 
	    	}    
	    	if(!borderCollisionY)
	    	{
	    		this.y += tempSpeedY;
	    		//gravity underwater (only when not boosting)
	    		if(!this.isBoosting && this.y != myGameArea.canvas.height + this.height)
	    			this.y += 0.5;
	    	}	

	    	if(this.speedX != 0 || this.speedY != 0)
		    {
		    	this.playerAnimCount++;
		    } 
		    else
		    {
		    	this.playerAnimCount = 0;
		    	this.curPlayerAnimIndex = 0;
		    	this.image.src = this.images[this.curPlayerAnimIndex];	
	    	}    

	    	if(this.isBoosting)
	    	{
	    		if(this.x == this.boostLocation[0] && this.y == this.boostLocation[1])
	    		{
	    			this.isBoosting = false;
	    			//cooldown for boost - in frames
	    			this.boostCd = 5;
	    		}
	    	}
	    	this.updateAnim();   
    	}
    	if(gameControl.isGameOver)
    	{
    		//lost because of hook
    		if(this.hookAttached)
    		{
    			this.loseAnimationHook();
    		}
    		//lost because of hunger timer
    		else if(this.hungerTimer <= 0)
    		{
    			if(this.y >= waterArea.y - 16)
    				this.y -= 3;
    		}
    		//lost because of collision with enemy boat
    		else
    		{
    			if(this.y >= waterArea.y - 32)
    				this.y--;
    		}
    	}      
	}

	loseAnimationHook()
	{
		//later I will make fish turn to face angle of line, for now I do not need this
		this.x = this.hookAttached.x;
		this.y = this.hookAttached.y;
	}

	boost()
	{
		if(this.speedX > 0)
		{
			this.boostLocation[0] = this.x + this.boostLength;
			if(this.boostLocation[0] > myGameArea.canvas.width - this.width)
			{
				this.boostLocation[0] = myGameArea.canvas.width - this.width;
			}
		}
		else if(this.speedX < 0)
		{
			this.boostLocation[0] = this.x - this.boostLength;
			if(this.boostLocation[0] < 0)
			{
				this.boostLocation[0] = 0;
			}
		}
		else
		{
			this.boostLocation[0] = this.x;
		}
		if(this.speedY > 0)
		{
			this.boostLocation[1] = this.y + this.boostLength;
			if(this.boostLocation[1] > myGameArea.canvas.height - this.height)
			{
				this.boostLocation[1] = myGameArea.canvas.height - this.height;
			}
		}
		else if(this.speedY < 0)
		{
			this.boostLocation[1] = this.y - this.boostLength;
			if(this.boostLocation[1] < 100)
			{
				this.boostLocation[1] = 100;
			}
		}
		else
		{
			this.boostLocation[1] = this.y;
		}

		//prevents player from getting stuck in the bottom
		if(this.boostLocation[1] + this.height > myGameArea.canvas.height - this.height)
			this.boostLocation[1] = myGameArea.canvas.height - this.height;

		if(!gameControl.isGameOver)
			boostSfx();
		this.totalBoosts--;
		this.isBoosting = true;
	}

	drawBoostCircles(ctx)
	{
		var tempX;
		var tempY;
		for(var i = 1; i <= 3; i++)
		{
			tempX = this.x + ((this.width / 2) * (i - 1));
			tempY = this.y - 8;
			ctx.beginPath();
			ctx.arc(tempX,tempY,6,0,2 * Math.PI, false);
			//full circle - if there is a boost, fill the circle
			if(i <= this.totalBoosts)
			{
				ctx.fillStyle = 'pink';
				ctx.fill();
			}
			//empty circle - no boost
			ctx.strokeStyle = 'hotpink';
			ctx.stroke();

		}
	}

	starve()
	{
		this.shouldFlipY = true;
	}

	drawHungerTimer(ctx)
	{
		ctx.font = "30px Comic Sans MS";
		if(this.hungerTimer > 300)
			ctx.fillStyle = "hotpink";
		else
			ctx.fillStyle = "red";
		ctx.textAlign = "center";
		if(!this.isGameOver)
			ctx.fillText("" + Math.round(this.hungerTimer / 60), this.x + (this.width / 2), this.y - 16);
	}

	update()
	{
		if(!gameControl.isGameOver)
		{
			this.drawHungerTimer(myGameArea.context);
			this.drawBoostCircles(myGameArea.context);
		}
		super.update();
	}
}

function generateEnemy()
{
	var newWidth = randomIntFromInterval(32,128);
	var newHeight = 32;
	var spawnLoc = Math.floor((Math.random() * 2) + 1);
	var newY;
	var newX;
	var newIsRight;
	if(spawnLoc == 1)
	{
		newY = 100 - (newHeight / 2);
		newX = 0 - newWidth;
		newIsRight = true;
	}
	else
	{
		newY = 100 - (newHeight / 2);
		newX = myGameArea.canvas.width;
		newIsRight = false;
	}
	//randomly generate speed later
	if(gameControl.diffMulti < 5)
		var newSpeed = randomIntFromInterval(1,3);
	else
		var newSpeed = randomIntFromInterval(2,6);
	var newNumPoles;
	if(gameControl.diffMulti == 1)
		newNumPoles = 1;
	else if(gameControl.diffMulti < 4)
	{
		newNumPoles = randomIntFromInterval(1,2);
	}
	else if(gameControl.diffMulti < 7)
	{
		newNumPoles = randomIntFromInterval(1,3);
	}
	else
	{
		newNumPoles = randomIntFromInterval(1,4);
	}
	enemies.push(new enemy(newWidth, newHeight,["boat.png"], newX, newY, "image", newIsRight, newSpeed, newNumPoles));
}

//enemy class
class enemy extends component
{
	//movement function (bobs up and down and moves across)
	//new constructor that specifies speed
	//array of lines
	//pole draw function (hard)
	//number of poles
	constructor(width, height, images, x, y, type, isRight, speed, numPoles)
	{
		super(width,height,images,x,y,type,isRight);
		this.speedX = speed;
		this.numPoles = numPoles;
		this.linesArray = new Array();
		this.startingPositions = new Array();
		this.getStartingPositions();
		this.generateLines();
		this.hasFish = false;
		this.isEnding = false;
	}

	newPos()
	{
		if(!gameControl.isPaused || (gameControl.isGameOver && !this.hasFish))
		{
			//need to add bobbing up and down here
			if(this.isRight)
			{
				this.x += this.speedX;
				for(var i = 0; i < this.startingPositions.length; i++)
				{
					this.startingPositions[i] += this.speedX;
				}
			}
			else
			{
				this.x -= this.speedX;
				for(var i = 0; i < this.startingPositions.length; i++)
				{
					this.startingPositions[i] -= this.speedX;
				}
			}
		}
	}

	endAnimation()
	{
		if(!this.isEnding)
		{
			if(!this.hasFish)
			{
				this.isEnding = true;
				if(this.x + this.width > myGameArea.canvas.width / 2)
				{
					this.isRight = true;

				}
				else
				{
					this.isRight = false;
				}
				for(var i = 0; i < this.linesArray.length; i++)
				{
					this.linesArray[i].speed *=3;
					if(this.linesArray[i].isRight == this.isRight)
					{
						this.linesArray[i].hook.isRight = this.isRight;
						if(this.linesArray[i].hasBait)
							this.linesArray[i].lineBait.isRight = this.isRight;
					}
					else
					{

						this.linesArray[i].isRight = this.isRight;
						//this means that it will be turning right
						if(this.isRight)
						{
							this.linesArray[i].startPos[0] -= 30;
							this.linesArray[i].endPos[0] -= 30;
							this.linesArray[i].hook.x -= 30;
							if(this.linesArray[i].hasBait)
								this.linesArray[i].baitPoint[0] -= 30;
						}
						else
						{
							this.linesArray[i].startPos[0] += 30;
							this.linesArray[i].endPos[0] += 30;
							this.linesArray[i].hook.x += 30;
							if(this.linesArray[i].hasBait)
								this.linesArray[i].baitPoint[0] += 30;
						}
						this.linesArray[i].hook.isRight = this.isRight;
						if(this.linesArray[i].hasBait)
							this.linesArray[i].lineBait.isRight = this.isRight;
					}
				}
			}
			else
			{
				this.isEnding = true;
			}

			this.speedX *= 3;
		}
	}

	//gets starting positions of the lines
	getStartingPositions()
	{
		//draw each pole, starting from the left
		var tempPos = this.x;
		for(var i = 0; i < this.numPoles; i++)
		{
			tempPos = tempPos + (this.width/(this.numPoles + 1));
			this.startingPositions.push(tempPos);
		}
	}

	//generates lines that are coming off of the boat
	generateLines()
	{
		var newAngle;
		var newLength;
		var newHasBait;
		var startPos;
		for(var i = 0; i < this.startingPositions.length; i++)
		{
			//calculates an angle between 45 and 90 degs	
			newLength = randomIntFromInterval(75,510);

			if(gameControl.diffMulti == 1)
				newHasBait = 1;
			else if(gameControl.diffMulti < 4)
				newHasBait = randomIntFromInterval(1,2);
			else if(gameControl.diffMulti < 7)
				newHasBait = randomIntFromInterval(1,3);
			else
				newHasBait = randomIntFromInterval(1,5);
			if(newHasBait == 1)
				newHasBait = true;
			else
				newHasBait = false;
			if(!this.isRight)
			{
				startPos = [this.startingPositions[i] + 15,this.y - 15];
				newAngle = randomIntFromInterval(45,90);
			}
			else
			{
				startPos = [this.startingPositions[i] - 15,this.y - 15];
				newAngle = randomIntFromInterval(90,135);
			}
			
			this.linesArray.push(new line(newAngle,startPos, newLength,this.speedX,this.isRight,newHasBait,this));
		}
	}

	drawPoles()
	{
		var ctx = myGameArea.context;
		for(var i = 0; i < this.startingPositions.length; i++)
		{
			ctx.beginPath();
			ctx.moveTo(this.startingPositions[i],this.y);
			ctx.lineTo(this.startingPositions[i],this.y - 15);
			if(!this.isRight)
			{
				ctx.lineTo(this.startingPositions[i] + 15,this.y - 15);
			}
			else
			{
				ctx.lineTo(this.startingPositions[i] - 15,this.y - 15);
			}
			ctx.strokeStyle = 'black';
			ctx.stroke();
		}
	}

	drawLines()
	{
		for(var i = 0; i < this.linesArray.length; i++)
		{
			this.linesArray[i].newPos();
			this.linesArray[i].update();
		}
	}

	update()
	{
		super.update();
		this.drawPoles();
		this.drawLines();
		
	}

	isOffScreen()
	{
		var tempHook;
		var boatOffScreen = false;

		if(this.isRight)
		{
			if(this.x > myGameArea.canvas.width)
			{
				boatOffScreen = true;
			}
		}
		else
		{
			if(this.x + this.width < 0)
			{
				boatOffScreen = true;
			}
		}

		//if the boat is not off the screen, there is no reason to delete it
		if(!boatOffScreen)
		{
			return false;
		}

		var numHooksOff = 0;
		for(var i = 0; i < this.linesArray.length; i++)
		{
			tempHook = this.linesArray[i].hook;
			if(this.isRight)
			{
				if(tempHook.x > myGameArea.canvas.width)
				{
					numHooksOff++;
				}
			}
			else
			{
				if(tempHook.x + tempHook.width < 0)
				{
					numHooksOff++;
				}
			}
		}
		//returns true if all hooks are off the screen
		if(numHooksOff == this.linesArray.length)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

//line class, not a component because not a rectangle
class line
{
	constructor(angle, startPos, length, speed, isRight, hasBait, parentBoat)
	{
		this.angle = angle;
		this.startPos = startPos;
		this.length = length;
		this.speed = speed;
		this.isRight = isRight;
		this.parentBoat = parentBoat;
		this.endPos = new Array();
		this.calculateEndPos();
		this.hasBait = hasBait;
		if(hasBait)
		{
			this.baitPoint = new Array();
			this.generateBaitPoint();
			this.lineBait = new bait(this.baitPoint[0],this.baitPoint[1], this);
		}
		var xPos;
		var yPos;
		if(this.isRight)
		{
			xPos = this.endPos[0] + 12;
		}
		else
		{
			xPos = this.endPos[0] - 12;
		}
		this.hook = new hook(24,24,["hook.png"],xPos,this.endPos[1],"image",this.isRight,this.speed,this);
		this.isReeling = false;
	}

	//hitting a line will slow the player down (unless obtaining bait)
	collisionCheck()
	{

	}

	//move the start position of the line before next update
	newPos()
	{
		if(!gameControl.isPaused || (gameControl.isGameOver && !this.parentBoat.hasFish))
		{
			if(this.isRight)
			{
				this.startPos[0] += this.speed;
				this.endPos[0] += this.speed;
				if(this.hasBait)
					this.baitPoint[0] += this.speed;

			}
			else
			{
				this.startPos[0] -= this.speed;
				this.endPos[0] -= this.speed;
				if(this.hasBait)
					this.baitPoint[0] -= this.speed;
			}
		}
		if(this.isReeling)
		{
			if(this.hasBait)
			{
				this.hasBait = false;
				delete this.lineBait;
			}
			if(this.length >= 0)
			{
				this.length -= 3;
				this.calculateEndPos();
			}
			else
			{
				length = 0;
				this.isReeling = false;
			}

		}
		this.hook.newPos();
		if(this.hasBait)
			this.lineBait.newPos();
	}

	calculateEndPos()
	{
		this.endPos[0] = this.startPos[0] + (this.length * Math.cos(Math.PI *this.angle / 180));
		this.endPos[1] = this.startPos[1] + (this.length * Math.sin(Math.PI *this.angle / 180));
	}

	//draw line
	update()
	{
		//draw the line
		var ctx = myGameArea.context;
		ctx.beginPath();
		ctx.moveTo(this.startPos[0],this.startPos[1]);
		ctx.lineTo(this.endPos[0],this.endPos[1]);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		//draw the hook
		this.hook.update();
		if(this.hasBait)
			this.lineBait.update();
	}

	//moveline - later when I add up and down movement to line
	moveLine()
	{

	}
	//will be used to generate a point to put the bait on the line
	generateBaitPoint()
	{
		//bait will be randomly placed from halfway down the line to the end
		var baitLength = randomIntFromInterval((this.length / 2), this.length - 10);

		//get x position of bait
		this.baitPoint[0] =  this.startPos[0] + (baitLength * Math.cos(Math.PI *this.angle / 180));
		//get y position of bait
		this.baitPoint[1] = this.startPos[1] + (baitLength * Math.sin(Math.PI *this.angle / 180));
	}
}

//bait class, feeds player, gives boost, and increases score by 5
class bait extends component
{
	constructor(x,y, parentLine)
	{
		super(24,24, ["bait1.png","bait2.png"], x, y, "image", parentLine.isRight);
		this.parentLine = parentLine;
		this.animCount = 0;
		this.curAnimIndex = 0;
		this.animLength = randomIntFromInterval(10,20);
	}

	updateAnim()
	{
		if(this.animCount > this.animLength)
	    {
	    	if(this.curAnimIndex == (this.images.length - 1))
	    	{
	    		this.image.src = this.images[0];
	    		this.curAnimIndex = 0;
	    	}
	    	else
	    	{
	   			this.curAnimIndex++;
	    		this.image.src = this.images[this.curAnimIndex];
	    	}

	    	this.animCount = 0;
	    }
	}

	newPos()
	{

		this.x = this.parentLine.baitPoint[0] - 12;
		this.y = this.parentLine.baitPoint[1];
		if(!gameControl.isPaused || (gameControl.isGameOver && !this.parentLine.parentBoat.hasFish))
		{
			this.animCount++;
			this.updateAnim();	
		}
	}
}

//hook class
class hook extends component
{	
	constructor(width, height, images, x, y, type, isRight, speed, parentLine)
	{
		super(width, height, images, x, y, type, isRight);
		if(isRight)
		{
			this.x = this.x - this.width;
		}
		this.speedX = speed;
		this.parentLine = parentLine;
	}

	//making it so the hook is always on the end of the line, no matter where it moves to
	newPos()
	{

		this.x = this.parentLine.endPos[0] - 12;
		this.y = this.parentLine.endPos[1];	
	}

	update()
	{
		super.update();
	}
}

//graphic for a pause button
class pauseButton
{
	constructor(x,y,width,height)
	{
		//initially the game will start off playing
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.playing = true;
	}

	update()
	{
		if(gameControl.isPaused)
			this.playing = false;
		else
			this.playing = true;

		var ctx = myGameArea.context;
		ctx.fillStyle = "black";

		//draws pause icon
		if(this.playing)
		{	
			ctx.fillRect(this.x, this.y, this.width / 3, this.height);
			ctx.fillRect(this.x + 2 * (this.width / 3), this.y, this.width / 3, this.height);
		}
		//draws play icon
		else
		{
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x, this.y + this.height);
			ctx.lineTo(this.x + this.width, this.y + (this.height / 2));
			ctx.fill();
		}
	}
}

//HELPER FUNCTIONS BELOW
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//storage functions
function updateLocalStorage(score)
{
	//init if there is no local storage already
	if(localStorage.getItem("scores") == null)
	{
		initLocalStorage();
	}
	//get array out of local storage
	var tempLocalArray = JSON.parse(localStorage.getItem("scores"));
	
	for(var i = 0; i < tempLocalArray.length; i++)
	{
		if(tempLocalArray[i] < score)
		{
			//insert into array if score is higher than one at index
			tempLocalArray.splice(i, 0, score);
			break;
		}
	}

	if(tempLocalArray.length > 10)
	{
		tempLocalArray.splice(10,10);
	}

	//save updated array back to local storage

	localStorage.setItem("scores", JSON.stringify(tempLocalArray));

	//displays scores on HTML
	displayScores();

}

function initLocalStorage()
{
	var tempArray = new Array();
	for(var i = 0; i < 10; i++)
	{
		tempArray.push(0);
	}
	localStorage.setItem("scores", JSON.stringify(tempArray));
}

function displayScores()
{
	var table = document.getElementById("scoreTable");
	table.innerHTML = "";
	var tempLocalArray = JSON.parse(localStorage.getItem("scores"));
	gameControl.highScore = tempLocalArray[0];

	for(var i = 0; i < tempLocalArray.length; i++)
	{
		if(tempLocalArray[i])
		{
			var tempRow = table.insertRow(i);
			var cell1 = tempRow.insertCell(0);
			var cell2 = tempRow.insertCell(1);
			cell1.innerHTML = (i+1) + ".";
			cell2.innerHTML = tempLocalArray[i];
		}	
	}
}

//mouse detection functions (only used for pause button)
function getMousePos(canvas, event) {
	var rect = myGameArea.canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}
function isInside(pos, rect){
	return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y;
}

//displays game over text in middle of screen
function gameOverText(text)
{
	var ctx = myGameArea.context;
	ctx.font = "50px Comic Sans MS";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText("" + text, 400, 300);
}

//sound effects - made with miniMusic - https://xem.github.io/miniMusic/simple.html
function boostSfx()
{
	with(new AudioContext)
	with(G=createGain())
	for(i in D=[14,9,2])
	with(createOscillator())
	if(D[i])
	connect(G),
	G.connect(destination),
	start(i*.05),
	frequency.setValueAtTime(440*1.06**(13-D[i]),i*.05),type='triangle',
	gain.setValueAtTime(1,i*.05),
	gain.setTargetAtTime(.0001,i*.05+.03,.005),
	stop(i*.05+.04);
}

function eatSfx()
{
	with(new AudioContext)
	with(G=createGain())
	for(i in D=[14,12,12,9])
	with(createOscillator())
	if(D[i])
	connect(G),
	G.connect(destination),
	start(i*.075),
	frequency.setValueAtTime(440*1.06**(13-D[i]),i*.075),type='triangle',
	gain.setValueAtTime(1,i*.075),
	gain.setTargetAtTime(.0001,i*.075+.05,.005),
	stop(i*.075+.07);
}

function hookSfx()
{
	with(new AudioContext)
	with(G=createGain())
	for(i in D=[18,19,24,25,24])
	with(createOscillator())
	if(D[i])
	connect(G),
	G.connect(destination),
	start(i*.1),
	frequency.setValueAtTime(440*1.06**(13-D[i]),i*.1),type='triangle',
	gain.setValueAtTime(1,i*.1),
	gain.setTargetAtTime(.0001,i*.1+.08,.005),
	stop(i*.1+.09);
}

function bonkSfx()
{
	with(new AudioContext)
	with(G=createGain())
	for(i in D=[22,22,23,24,23])
	with(createOscillator())
	if(D[i])
	connect(G),
	G.connect(destination),
	start(i*.022),
	frequency.setValueAtTime(440*1.06**(13-D[i]),i*.022),
	gain.setValueAtTime(1,i*.022),
	gain.setTargetAtTime(.0001,i*.022+.00,.005),
	stop(i*.022+.01);
}

function starveSfx()
{
	with(new AudioContext)
	with(G=createGain())
	for(i in D=[21,,24,24,25])
	with(createOscillator())
	if(D[i])
	connect(G),
	G.connect(destination),
	start(i*.22),
	frequency.setValueAtTime(440*1.06**(13-D[i]),i*.22),
	gain.setValueAtTime(1,i*.22),
	gain.setTargetAtTime(.0001,i*.22+.20,.005),
	stop(i*.22+.21)
}

