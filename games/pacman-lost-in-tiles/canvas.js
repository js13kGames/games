var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 960;
canvas.height = 600;
document.body.appendChild(canvas);

var tiles_x = [];
var tiles_y = [];
var number_tiles = 0;
var max_number_tiles = 10;
var tile_pointer = 0;

localStorage.setItem("tile", 0);
localStorage.setItem("play_again", 1);
var keysDown = {};

var pacman = {
    x: 0,
    y: 0
};

function draw_pacman() {
    scale_pacman = 0.25;
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, 50 * scale_pacman, 0.25 * Math.PI, 1.25 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, 50 * scale_pacman, 0.75 * Math.PI, 1.75 * Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y - 50 * 0.5 * scale_pacman, 10 * scale_pacman, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
}

function draw_tiles(x, y) {
    scale_tiles = 0.25;
    ctx.beginPath();
    console.log("here" + x + " " + y)
    ctx.rect(x, y, scale_tiles * 50, scale_tiles * 50);
    ctx.fillStyle = 'black';
    ctx.fill();
}

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

var update = function() {
    if (38 in keysDown) { // Player holding up
        pacman.y -= 30;
        if(pacman.y<0)
            pacman.y=0;
    }
    if (40 in keysDown) { // Player holding down
        pacman.y += 30;
        if(pacman.y>canvas.height)
            pacman.y=canvas.height;   
    }
    if (37 in keysDown) { // Player holding left
        pacman.x -= 30;
        if(pacman.x<0)
            pacman.x=0;  
    }
    if (39 in keysDown) { // Player holding right
        pacman.x += 30;
        if(pacman.x>canvas.width)
            pacman.x=canvas.width;  
    }

    var i = 0;
    while (i < number_tiles) {
        if (pacman.x == tiles_x[i] && pacman.y == tiles_y[i]) {
            if (!alert("You Lost with a score of" + localStorage.getItem("tile"))) { window.location.href = "./index.html"; }
        }
        i++;
    }
};

var render = function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw_pacman();
    var i = 0;
    while (i < number_tiles) {
        draw_tiles(tiles_x[i], tiles_y[i]);
        i++;
    }

};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function() {
    update();
    render();

    requestAnimationFrame(main);
};

function tile_drop(x, y) {

    setTimeout(function() {
        if (number_tiles == max_number_tiles) {
            tiles_x[tile_pointer] = x;
            tiles_y[tile_pointer] = y;
            tile_pointer += 1;
            if (tile_pointer > max_number_tiles) {
                tile_pointer = 0;
            }
        } else {
            tiles_x.push(x);
            tiles_y.push(y);
            tile_pointer += 1;
            number_tiles += 1;
            if (tile_pointer > max_number_tiles) {
                tile_pointer = 0;
            }
        }
        console.log(x + " " + y);
        render();
        update();
        localStorage.setItem("tile", parseInt(localStorage.getItem("tile")) + 1);
    }, 1000);
}

setInterval(function() {
    var x = pacman.x;
    var y = pacman.y;
    tile_drop(x, y);
}, 1000);

main();