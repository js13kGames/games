
// http://gamedev.tutsplus.com/tutorials/implementation/cave-levels-cellular-automata

var world = [[]];
var charWorld = [[]];
var beastWorld = [[]];
var switched;
var charPos = [];
var beastPos = [];
var score = 0;
var moves = [0];
var levelCount;
var turn = false;

var worldWidth = 20;
var worldHeight = 15;
var tileWidth = 40;
var tileHeight = 40;

var chanceToStartAlive = 0.4;
var deathLimit = 3;
var birthLimit = 4;
var numberOfSteps = 8;
var treasureCount = 0;

var free = 0;
var wall = 1;
var treasure = 2;
var portal = 3;
var character = 4;
var beast = 5;
var switchFill = 6;

var freeCol = "#3355AA";
var treasureCol = "#F1D437";
var portalCol = "#FF3562";
var characterCol = "#71B48D";
var beastCol = "#E6E6EA";
var wallCol = "#443333";

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        move(-1, 0, false); //left
    } else if(event.keyCode == 38) {
        move(0, -1, true);  //up
    } else if(event.keyCode == 39) {
        move(1, 0, false);  //right
    } else if(event.keyCode == 40) {
        move(0, 1, true);   //down
    } else if(event.keyCode == 13) {
        play();
    }
    
    
});

function play(event) {
    //HTML5 stuff
    canvas = document.getElementById('gameCanvas');
    canvas.width = worldWidth * tileWidth;
    canvas.height = worldHeight * tileHeight;
    ctx = canvas.getContext("2d");

    ctx.font = "40px Courier";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Click to start", canvas.width/2, canvas.height/2);
    
    levelCount = 1;
    score = 0;
    moves = [0];
    document.getElementById("gameCanvas").onclick = function(){
        recreate();
    };
}
function recreate() {
    if(levelCount < 6){
        worldWidth = 20;
        worldHeight = 16;
        tileWidth = 40;
        tileHeight = 40;
    } else if(levelCount < 9){
        worldWidth = 25;
        worldHeight = 20;
        tileWidth = 32;
        tileHeight = 32;
    } else if(levelCount < 11){
        worldWidth = 40;
        worldHeight = 32;
        tileWidth = 20;
        tileHeight = 20;
    } else if(levelCount < 12){
        worldWidth = 50;
        worldHeight = 40;
        tileWidth = 16;
        tileHeight = 16;
    } else if(levelCount < 13){
        worldWidth = 80;
        worldHeight = 64;
        tileWidth = 10;
        tileHeight = 10;
    } else if(levelCount < 14){
        worldWidth = 100;
        worldHeight = 80;
        tileWidth = 8;
        tileHeight = 8;
    }

    world = generateMap();
    emptyWorld(charWorld);
    emptyWorld(beastWorld);
    placeTreasure();
    countTreasure();
    placePortal();
    placeChar();
    switched = false;
    redraw();
}

function emptyWorld(map) {
    for (var x = 0; x < worldWidth; x++) {
        map[x] = [];
        for (var y = 0; y < worldHeight; y++) {
            map[x][y] = 0;
        }
    }
}
function generateMap() {
    //So, first we make the map
    var map = [[]];
    //And randomly scatter solid blocks
    initialiseMap(map);

    //Then, for a number of steps
    for(var i=0; i<numberOfSteps; i++){
        //We apply our simulation rules!
        map = doSimulationStep(map);
    }

    //And we're done!
    return map;
}
function initialiseMap(map) {
    for (var x=0; x < worldWidth; x++)
    {
        map[x] = [];
        for (var y=0; y < worldHeight; y++)
        {
            map[x][y] = 0;
        }
    }

    for (var x=0; x < worldWidth; x++)
    {
        for (var y=0; y < worldHeight; y++)
        {
            //Here we use our chanceToStartAlive variable
            if (Math.random() < chanceToStartAlive)
            //We're using numbers, not booleans, to decide if something is solid here. 0 = not solid
                map[x][y] = 1;
        }
    }

    return map;
}
function doSimulationStep(map) {
    var newmap = [[]];
    for(var x = 0; x < map.length; x++){
        newmap[x] = [];
        for(var y = 0; y < map[0].length; y++)
        {
            //Count neighbours
            var nbs = countAliveNeighbours(map, x, y);
            //If the tile is currently solid
            if(map[x][y] > 0){
                //See if it should die
                if(nbs < deathLimit){
                    newmap[x][y] = 0;
                }
                //Otherwise keep it solid
                else{
                    newmap[x][y] = 1;
                }
            }
            //If the tile is currently empty
            else{
                //See if it should become solid
                if(nbs > birthLimit){
                    newmap[x][y] = 1;
                }
                else{
                    newmap[x][y] = 0;
                }
            }
        }
    }

    return newmap;
}
function countAliveNeighbours(map, x, y) { //This function counts the number of solid neighbours a tile has
    var count = 0;
    for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            var nb_x = i+x;
            var nb_y = j+y;
            if(i == 0 && j == 0){
            }
            //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
            else if(nb_x < 0 || nb_y < 0 ||
                nb_x >= map.length ||
                nb_y >= map[0].length){
                count = count + 1;
            }
            else if(map[nb_x][nb_y] == 1){
                count = count + 1;
            }
        }
    }
    return count;
}

function switchWorld(){
    if(switched == false) {
        for (var x = 0; x < worldWidth; x++) {
            for (var y = 0; y < worldHeight; y++) {
                if (world[x][y] == free)
                    world[x][y] = switchFill;
            }
        }
    } else if(switched == true){
        for (var x = 0; x < worldWidth; x++) {
            for (var y = 0; y < worldHeight; y++) {
                if (world[x][y] == switchFill)
                    world[x][y] = free;
            }
        }
    }
    switched = !switched;
    redraw();
}

function placeTreasure() {
    var treasureHiddenLimit = 5;
    for (var x=0; x < worldWidth; x++)
    {
        for (var y=0; y < worldHeight; y++)
        {
            if(world[x][y] == 0){
                var nbs = countAliveNeighbours(world, x, y);
                if(nbs >= treasureHiddenLimit){
                    world[x][y] = 2;
                }
            }
        }
    }
}
function countTreasure(){
    treasureCount = 0;
    for (var x=0; x < worldWidth; x++) {
        for (var y = 0; y < worldHeight; y++) {
            if (world[x][y] == 2) {
                treasureCount = treasureCount + 1;
            }
        }
    }
}
function placePortal() {
    var portalLimit = 4;

    for (var x=0; x < worldWidth; x++)
    {
        for (var y=0; y < worldHeight; y++)
        {
            if(world[x][y] == 0){
                var nbs = countAliveNeighbours(world, x, y);
                if(nbs >= portalLimit){
                    world[x][y] = 3;
                }
            }
        }
    }
}
function placeChar(){
    for (var x=0; x < worldWidth; x++) {
        for (var y=0; y < worldHeight; y++) {
            if(world[x][y] == free) {
                charWorld[x][y] = character;
                charPos = [x, y];
                x = worldWidth;
                break;
            }
        }
    }
    beastWorld[worldWidth - 2][y] = beast;
    beastPos = [worldWidth - 2, y];
}

function interact(){
    if(world[charPos[0]][charPos[1]] == treasure){
        if(!switched){ world[charPos[0]][charPos[1]] = free; }
        else {world[charPos[0]][charPos[1]] = switchFill;}
        score++;
        countTreasure();
    } else if (world[charPos[0]][charPos[1]] == portal){
        world[charPos[0]][charPos[1]] = free;
        switchWorld();
    }
}

function moveHandler(x, y, vert) {
    charWorld[charPos[0] + x][charPos[1] + y] = character;
    charWorld[charPos[0]][charPos[1]] = 0;
    if(vert){
        charPos[1] = charPos[1] + y;
    } else if(!vert){
        charPos[0] = charPos[0] + x;
    }
}
function move(x, y, vert){
    if(!switched){
        if(world[charPos[0] + x][charPos[1] + y] == free) {
            moves.push(free);
            moveHandler(x, y, vert);
        } else if(world[charPos[0] + x][charPos[1] + y] == treasure){
            moves.push(treasure);
            moveHandler(x, y, vert);
            interact();
        } else if(world[charPos[0] + x][charPos[1] + y] == portal) {
            moves.push(portal);
            moveHandler(x, y, vert);
            interact();
        }
    } else if(switched) {
        if(world[charPos[0] + x][charPos[1] + y] == switchFill){
            moves.push(switchFill);
            moveHandler(x, y, vert);
        } else if(world[charPos[0] + x][charPos[1] + y] == wall) {
            moves.push(wall);
            moveHandler(x, y, vert);
        } else if(world[charPos[0] + x][charPos[1] + y] == treasure){
            moves.push(treasure);
            moveHandler(x, y, vert);
            interact();
        } else if(world[charPos[0] + x][charPos[1] + y] == portal) {
            moves.push(portal);
            moveHandler(x, y, vert);
            interact();
        }
    }
    hunt();
}

function beastHandler(x, y, vert){
    beastWorld[beastPos[0] + x][beastPos[1] + y] = beast;
    beastWorld[beastPos[0]][beastPos[1]] = 0;
    if(vert){
        beastPos[1] = beastPos[1] + y;
    } else if(!vert){
        beastPos[0] = beastPos[0] + x;
    }
}
function hunt(){
    if (turn) {
        if (beastPos[0] > charPos[0]) {
            beastHandler(-1, 0, false);
        } else if (beastPos[0] < charPos[0]) {
            beastHandler(1, 0, false);
        }
        if (beastPos[1] > charPos[1]) {
            beastHandler(0, -1, true);
        } else if (beastPos[1] < charPos[1]) {
            beastHandler(0, 1, true);
        }
    }
    turn = !turn;
}

function gameOver(){
    if((moves[moves.length - 2] == wall && moves[moves.length - 1] == portal) ||
        (switched && beastPos[0] == charPos[0] && beastPos[1] == charPos[1])) {
        ctx.fillStyle = '#443333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "80px Courier";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
        ctx.font = "40px Courier";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Click to Play Again", canvas.width/2, canvas.height*3/5);
    }
    document.getElementById("gameCanvas").onclick = function(){
        play();
    };
    if(treasureCount == 0){
        recreate();
        levelCount++;
    }
}
function redraw() {
    // clear the screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // colouring handler
    for (var x = 0; x < worldWidth; x++) {
        for (var y = 0; y < worldHeight; y++) {

            if(world[x][y] == free)
                ctx.fillStyle = freeCol;
            else if(world[x][y] == treasure)
                ctx.fillStyle = treasureCol;
            else if(world[x][y] == portal)
                ctx.fillStyle = portalCol;
            else
                ctx.fillStyle = wallCol;

            if(charWorld[x][y] == character) {
                ctx.fillStyle = characterCol;
            } else if(switched && beastWorld[x][y] == beast) {
                ctx.fillStyle = beastCol;
            }

            ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
        }
    }
    ctx.font = "bold 30px Courier";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(levelCount + "." + score, 40, canvas.height-10);

    gameOver();
    setInterval(redraw, 100);
}

// the game's canvas element
var canvas = null;
// the canvas 2d context
var ctx = null;

// ensure that console.log doesn't cause errors
if (typeof console == "undefined") var console = { log: function() {} };

