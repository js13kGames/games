/*=============================
     TILE MAP CONSTRUCTOR
===============================

Platform Tile type:
0 - blank tile
1 - bottom tile with grass 
2 - top tile with grass
3 - bottom tile without grass
4 - top tile without grass
5 - death zone
6 - teleportation ground
7 - goal

==============================*/

function constructMap(map) {
    for (var i = 0; i < map.length; i++) {
        var tilePosY = i * tileDimension;
        for (var j = 0; j < map[i].length; j++) {
            var tilePosX = j * tileDimension;
            var tileType = map[i][j];
            if (tileType !== 0) {
                platformTiles.push(new platformTile(tilePosX, tilePosY, tileDimension, tileDimension, tileType));
            }
        }
    }
}




/*****************
        MAP
*****************/


// 10 by 20 map
var map = [
    [2, 4, 4, 4, 5, 2, 6, 6, 6, 6, 4, 4, 4, 4, 2, 2, 6, 6, 6, 4],
    [0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 4, 2, 4, 0, 0, 0, 0, 0, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 2, 5, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 3, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 0, 0, 0, 0, 0, 0, 1],
    [3, 3, 5, 3, 1, 1, 6, 6, 6, 6, 3, 3, 3, 6, 1, 3, 1, 3, 1, 3],

];


//    platformTiles.push(new platformTile(120, 450, 60, 60, 1));
//    platformTiles.push(new platformTile(300, 300, 60, 60, 1));
//    platformTiles.push(new platformTile(180, 450, 60, 60, 5));
//    platformTiles.push(new platformTile(250, 450, 60, 60, 1));
//    platformTiles.push(new platformTile(50, 50, 60, 60, 2));
//    platformTiles.push(new platformTile(200, 100, 60, 60, 2));
//    platformTiles.push(new platformTile(300, 160, 60, 60, 5));
//    platformTiles.push(new platformTile(500, 470, 60, 60, 6));
//    platformTiles.push(new platformTile(560, 470, 60, 60, 6));
//    platformTiles.push(new platformTile(620, 470, 60, 60, 6));
//    platformTiles.push(new platformTile(500, 0, 60, 60, 6));
//    platformTiles.push(new platformTile(560, 0, 60, 60, 6));
//    platformTiles.push(new platformTile(620, 0, 60, 60, 6));
//



// Add water
//water.push(new fluid(500, 460, 180, 60));
//water.push(new fluid(500, -20, 180, 60));


(function addRandomStars() {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            var tileType = map[i][j];
            if (tileType === 0) {
                if (Math.random() > 0.95) {
                    totalNumOfGoals ++;
                    map[i][j] = 7;
                }
            }
        }
    }
})();



constructMap(map) // Construct the map

// Lastly, add the edge
platformTiles.push(new platformTile(0, 0, 0, height, 0)); // Left Edge
platformTiles.push(new platformTile(0, height, width, 50, 0)); // bottom edge
platformTiles.push(new platformTile(0, -50, width, 50, 0));
platformTiles.push(new platformTile(width, 0, 50, height, 0));