/*
* Objects 
*/

BLOCK_SIZE=30;
BORDER_SIZE=1;
GRID_LENGTH=20;
CANVAS_SIZE=BLOCK_SIZE * GRID_LENGTH + (BLOCK_SIZE * GRID_LENGTH)*0.25 ; 
STATE_EMPTY=0;
STATE_PLAYER=1;
STATE_LIFE=2;
STATE_EXIT=3;

GAME_COLOUR="blue";
GAME_SCORE=0;
GAME_FREED=0;
GAME_CREATED=0;
GAME_DESTROYED=0;

function component(width, height, color, x, y) {
    MAX_SPEED = 5;
    SPEED_INC = 0.1

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;

    this.move = function() {
	//Nothing
    }; 
    
    this.update = function(){
	this.move();	
	ctx = GameArea.context;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);	
    };
}

function tile(width, height, color, x, y) {
    component.call(this, width, height, color, x, y);

    /*
      States:
      0 - Empty
      1 - Player
      2 - Life

    */
    this.state = STATE_EMPTY;

    this.updateState = function(){	
	switch(this.state) {
	case STATE_EMPTY:
	    this.color = 'grey';
            break;
	case STATE_PLAYER:
	    this.color = 'red';
            break;	
	case STATE_LIFE:
	    this.color = 'white';
            break;
	case STATE_EXIT:
	    this.color = 'brown';
            break;
	default:
	    break;
	}
    }

    this.die = function(){
	this.state = STATE_EMPTY;
	GAME_DESTROYED += 1
    }

    this.spawn = function(){
	this.state = STATE_LIFE;
	GAME_CREATED += 1;
    }
}

function Point(x,y){
    this.x = x;
    this.y = y;
}

function grid(x, y, width, height){
    // todo: parameter x,y
    X = x;
    Y = y;
    TILE_SIZE = BLOCK_SIZE - BORDER_SIZE;
    BORDER=BORDER_SIZE;
    
    playerPoint = new Point(-1,-1);
    playerIn = false;
    moveCooldown = 0.0;

    this.escapedList = [];
    this.gridArray = [];
    for ( var i = 0; i < height; i++){
	this.gridArray.push( [] );
	for ( var j = 0; j < width; j++){
	    this.gridArray[i].push(new tile(TILE_SIZE,
					    TILE_SIZE,
					    "grey",
					    X + (BORDER*i + TILE_SIZE*i),
					    Y + (BORDER*j + TILE_SIZE*j)
					   ));
	}
    }

    this.playerEnter = function(x,y){
	this.gridArray[x][y].state = STATE_PLAYER;
	
	playerPoint.x = x;
	playerPoint.y = y;
    }

    this.moveLife = function() {
	for ( var i = 0; i < height; i++){
	    for ( var j = 0; j < width; j++) {
		if (this.gridArray[i][j].state == STATE_LIFE){
		    this.move(i, j);
		}
	    }
	}

    }

    this.getNeighbours = function(x,y) {
	var listOfPoints = [];
	for(var i = -1; i < 2; i++) {
	    for(var j = -1; j < 2; j++) {
		if (!(i == 0 && j == 0)) {
		    var dx = x + i;
		    var dy = y + j;
		    if (dx < width && dx >= 0 &&
			dy < height && dy >= 0) {
			if (this.gridArray[dx][dy].state == STATE_LIFE ||
			   this.gridArray[dx][dy].state == STATE_PLAYER ){
			    listOfPoints.push(new Point(dx,dy));
			}
		    }
		}
	    }
	}
	return listOfPoints;
    }

    this.getEmptyPoint = function(x,y) {
	var point = new Point(-1,-1);
	var listOfPoints = [];
	
	for ( var i = -1; i < 2; i++) {
	    for ( var j = -1; j < 2; j++) {
		if (!(i == 0 && j == 0)) {
		    var dx = x + i;
		    var dy = y + j;
		    if (dx < width && dx >= 0 &&
			dy < height && dy >= 0) {			
			if (this.gridArray[dx][dy].state == STATE_EMPTY ||
			    this.gridArray[dx][dy].state == STATE_EXIT ){			    
			    listOfPoints.push(new Point(dx,dy));
			}
		    }
		}
	    }
	}
	if (listOfPoints.length == 0){
	    return point
	}
	
	return listOfPoints[ Math.floor(Math.random() * listOfPoints.length)];
    }
    
    this.checkGrid = function(i,j) {
	if ( this.gridArray[i][j].state == STATE_LIFE ){
	    var neighbours = [];
	    neighbours = this.getNeighbours(i,j);
	    if (neighbours.length > 3 || neighbours.length < 2){
		console.log("Killed " + i + " " + j);
		this.gridArray[i][j].die();
	    } else { //if (neighbours.length == 3) {
	    	var emptyPoint = this.getEmptyPoint(i,j);
		if (emptyPoint.x == -1){
		    console.log("No space!!!");
		} else {
		    if (this.gridArray[emptyPoint.x][emptyPoint.y].state == STATE_EXIT) {
			this.gridArray[i][j].die();
			GAME_DESTROYED -= 1; // Compensate for die
			GAME_FREED += 1;
			
			var cx = this.gridArray[emptyPoint.x][emptyPoint.y].x;
			var cy = this.gridArray[emptyPoint.x][emptyPoint.y].y;
			
			var escaped = null;
			console.log("Escaped! at: x:" + cx + " : " + cy ) ;
			escaped = new freetile(BLOCK_SIZE, BLOCK_SIZE, "white", cx, cy);
			if (emptyPoint.x < width/2) {	    
			    escaped.speedX = -10;			    
			}

			if (emptyPoint.x > width/2) {
			    escaped.speedX = 10;
			}

			if (emptyPoint.y < height/2) {
			    escaped.speedY = -10;
			}

			if (emptyPoint.y > height/2) {
			    escaped.speedY = 10;
			}

			this.escapedList.push( escaped );
			
		    }  else {
			console.log("Spawned new life at " + i + " " + j);
			this.gridArray[emptyPoint.x][emptyPoint.y].spawn();

		    }
		}
	    }
	}
    }
    
    this.update = function() {
	for (var i = 0; i < width; i++) {
	    for (var j = 0; j < height; j++) {		
		this.gridArray[i][j].updateState();
		this.gridArray[i][j].update();
	    }
	}
	for (var i = 0; i < this.escapedList.length; i++){
	    if (this.escapedList[i].x < -100 ||
		this.escapedList[i].x > 5000 ||
		this.escapedList[i].y < 5000 ||
		this.escapedList[i].y < -100){
		
		// Destroy out of bound objects
		// this.escapedList.splice(i,1); // Remove from list
		
	    } else {
		// Updated
		
	    }
	    this.escapedList[i].update();
	}
    }

    this.randomPopulate = function(n) {
	for ( var i = 0; i < n; i++) {
	    x = Math.round(Math.random() * width) % width;
	    y = Math.round(Math.random() * height) % height;
	  
	    this.gridArray[x][y].state = STATE_LIFE;
	}
	this.gridArray[1][2].state = STATE_EMPTY;
	this.gridArray[2][1].state = STATE_EMPTY;
	this.gridArray[2][2].state = STATE_EMPTY;	
    }

    this.initBorder = function(){
	for ( var i = 0; i < width; i++) {
	    this.gridArray[i][0].state = STATE_EXIT;
	    this.gridArray[i][height - 1].state = STATE_EXIT;
	}
	for ( var j = 0; j < height; j++) {
	    this.gridArray[0][j].state = STATE_EXIT;
	    this.gridArray[width-1][j].state = STATE_EXIT;
	}
    }

    this.move = function(dx,dy) {
	if (moveCooldown <= 0.0 && this.gridArray[playerPoint.x + dx][playerPoint.y + dy].state == STATE_EMPTY ) {
	    // Move player first	    
	    this.gridArray[playerPoint.x][playerPoint.y].state = STATE_EMPTY;	
	    playerPoint.x = playerPoint.x + dx;
	    playerPoint.y = playerPoint.y + dy;
	    this.gridArray[playerPoint.x][playerPoint.y].state = STATE_PLAYER;	    
	    
	    // Check grid around player
	    for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
		    if (!(i == 0 && j == 0)) {
			var dx = playerPoint.x + i;
			var dy = playerPoint.y + j;
			if (dx < width && dx >= 0 && dy < height && dy >= 0) {
			    this.checkGrid(dx, dy);
			}
		    }
		}
	    }
	  
	    moveCooldown = 0.1;
	} else {
	    moveCooldown -= 0.1;
	}

	if ( (this.gridArray[playerPoint.x+1][playerPoint.y].state != STATE_EMPTY &&
	      this.gridArray[playerPoint.x-1][playerPoint.y].state != STATE_EMPTY &&
	      this.gridArray[playerPoint.x][playerPoint.y+1].state != STATE_EMPTY &&
	      this.gridArray[playerPoint.x][playerPoint.y-1].state != STATE_EMPTY ) ) {
	    GAME_COLOUR="red";
	}
    }

    this.moveUp = function() {
	if (playerPoint.y > 0) this.move(0,-1);
    };

    this.moveDown = function() {
	if (playerPoint.y < height-1) this.move(0,1);
    };

    this.moveLeft = function() {
	if (playerPoint.x > 0) this.move(-1,0);
    };

    this.moveRight = function() {
	if (playerPoint.x < width-1) this.move(1,0);
    };
    
}

function freetile(width, height, color, x, y) {
    component.call(this, width, height, color, x, y);

    this.move = function() {
        this.x += this.speedX + (Math.random(1) - Math.random(1)) * 20;
	this.y += this.speedY + (Math.random(1) - Math.random(1)) * 20;
    };

    this.moveUp = function() {
	if (this.speedY > -MAX_SPEED){
	    this.speedY -= SPEED_INC; 
	}	
    };

    this.moveDown = function() {
	if (this.speedY < MAX_SPEED){
	    this.speedY += SPEED_INC;
	}
    };

    this.moveLeft = function() {
	if (this.speedX > -MAX_SPEED){
	    this.speedX -= SPEED_INC;
	}	
    };

    this.moveRight = function() {
	if (this.speedX < MAX_SPEED) {
	    this.speedX += SPEED_INC;
	}
    };
}
