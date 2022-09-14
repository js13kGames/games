/*
* Game logic and initialization
*/

function startGame() {
    GameArea.start();
    // GamePiece = new freetile(BLOCK_SIZE, BLOCK_SIZE, "red", 10, 120);
    
    GAME_COLOUR="blue";
    GAME_SCORE=0;
    GAME_FREED=0;
    GAME_CREATED=0;
    GAME_DESTROYED=0;
    
    var grid_size = GRID_LENGTH*BLOCK_SIZE;
    Grid = new grid(grid_size/8,
		    grid_size/8,
		    GRID_LENGTH,
		    GRID_LENGTH);
    Grid.randomPopulate(GRID_LENGTH*GRID_LENGTH/2);
    Grid.initBorder();
    Grid.playerEnter(1,1);;
    Grid.playerIn = true;

    document.getElementById("startButton").innerText = "Reset";
}


function updateGameArea() {
    GameArea.clear();
    // GamePiece.move();
    // GamePiece.update();

    Grid.update();
    if (!Grid.playerIn) {
	// if (GameArea.key && GameArea.key == 37) { GamePiece.moveLeft(); }
	// if (GameArea.key && GameArea.key == 39) { GamePiece.moveRight(); }
	// if (GameArea.key && GameArea.key == 38) { GamePiece.moveUp(); }
	// if (GameArea.key && GameArea.key == 40) { GamePiece.moveDown(); }
    } else {
	if (GameArea.key && GameArea.key == 37) { Grid.moveLeft(); }
	if (GameArea.key && GameArea.key == 39) { Grid.moveRight(); }
	if (GameArea.key && GameArea.key == 38) { Grid.moveUp(); }
	if (GameArea.key && GameArea.key == 40) { Grid.moveDown(); }
    }
    
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

var GameArea =  {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = CANVAS_SIZE;
        this.canvas.height = CANVAS_SIZE;
	this.canvas.style="border:1px solid #d3d3d3;;"
	this.context = this.canvas.getContext("2d");
	
	this.grd = this.context.createLinearGradient(0, 0, 200, 0);
	this.grd.addColorStop(0, "red");
	this.grd.addColorStop(1, "white");
	this.context.fillStyle = this.grd;
	
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(updateGameArea, 60);
	
	window.addEventListener('keydown', function (e) {
            GameArea.key = e.keyCode;
	})

	window.addEventListener('keyup', function (e) {
            GameArea.key = false;
	})
    },

    updateScore : function() {
	GAME_SCORE = GAME_FREED*2 + GAME_CREATED - (GAME_DESTROYED * 2)
	document.getElementById("boxScore").innerText = GAME_SCORE;
	document.getElementById("boxFreed").innerText = GAME_FREED;
	document.getElementById("boxCreated").innerText = GAME_CREATED;
	document.getElementById("boxDestroyed").innerText = GAME_DESTROYED;
    },
    
    clear : function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// Redraw base canvas
	this.context.fillStyle = GAME_COLOUR;
	this.context.fillRect(0,0,this.canvas.width, this.canvas.height);

	this.updateScore();
    }
}
