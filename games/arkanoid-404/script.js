let player1_right   = false,
    player1_left    = false;


document.addEventListener("keydown", press);
function press(e) {

    if (e.keyCode === 39) {
        player1_right = true;
    }

    if (e.keyCode === 37) {
        player1_left = true;
    }

}
document.addEventListener("keyup", release);
function release(e) {

    if (e.keyCode === 39 ) {
        player1_right = false;
    }
    if (e.keyCode === 37 ) {
        player1_left = false;
    }
}


const playfield = {
    left: 5,
    top: 5,
    height: 700,
    width: 1000
}

const el_playfield = document.getElementById("playfield");



const paddle = {
    speed: 20,
    height: 10,
    width: 200,
    topEdge: 670,
    leftEdge: 500
}

const el_paddle = document.getElementById("paddle")



const ball = {
    speedX: -2,
    speedY: 2.5,
    size: 10,
    topEdge: 100,
    leftEdge: 200,
}

const el_ball = document.getElementById("ball")



    
    


function collision() {

        if (ball.leftEdge > playfield.width - ball.size) {
            ball.leftEdge = playfield.width - ball.size;
            ball.speedX *= -1.01;
        }

        if (ball.leftEdge < 0) {
            ball.leftEdge = 0;
            ball.speedX *= -1.01;
        }

        if (ball.topEdge < 0) {
            ball.topEdge = 0;
            ball.speedY *= -1.01;
        }

        if (ball.topEdge > playfield.height - ball.size) {
            gameOver()
        }

            if (
                ball.speedY > 0 &&
                ball.topEdge  >= paddle.topEdge  - ball.size     &&
                ball.topEdge  <= paddle.topEdge  + paddle.height &&
                ball.leftEdge >= paddle.leftEdge - ball.size    &&
                ball.leftEdge <= paddle.leftEdge + paddle.width
            ) {
                let a = 0;
                
                if (paddle.leftEdge + paddle.width / 5 > ball.leftEdge + 5) {
                    a = (Math.abs(ball.speedX) + Math.abs(ball.speedY))/4;               
                    console.log("skrajna lewa");
                }
                else {
                    if (paddle.leftEdge + paddle.width / 5 * 2 > ball.leftEdge + 5) {
                        a = (Math.abs(ball.speedX) + Math.abs(ball.speedY))/8;   
                        console.log("lewa");
                    }
                    else {
                        if (paddle.leftEdge + paddle.width / 5 * 4 < ball.leftEdge + 5) {
                            a = (Math.abs(ball.speedX) + Math.abs(ball.speedY))/4 * -1;   
                            console.log("skrajna prawa");
                        }
                        else {
                            if (paddle.leftEdge + paddle.width / 5 * 3 < ball.leftEdge + 5) {
                                a = (Math.abs(ball.speedX) + Math.abs(ball.speedY))/8 * -1;   
                                console.log("prawa");
                            }
                            else {
                                console.log("środek")
                            }
                        }
                    }
                }
                if (ball.speedX > 0) {
                    ball.speedY += a;
                    ball.speedX -= a
                }
                else{
                    ball.speedY -= a
                    ball.speedX -= a
                }
                if (ball.speedY < 1){
                    ball.speedY = 1;
                }
                if (ball.speedX < 0.2 && ball.speedX > -0.2){
                    ball.speedX < 0 ? ball.speedX = -0.2 : ball.speedX = 0.2
                }
                console.log(a, ball.speedX, ball.speedY)
                ball.speedY = Math.abs(ball.speedY) * -1.01; 
                if (ball.speedX > 10) ball.speedX = 10;
                if (ball.speedX < -10) ball.speedX = -10;
                if (ball.speedY < -10) ball.speedY = -10;
            }

            for (let i = 0; i < block.length; i++){
                if (block[i] == undefined) continue;
                if (                    
                    ball.topEdge <= block[i][0]*15+165 &&
                    ball.topEdge + ball.size >= block[i][0]*15+150 &&
                    ball.leftEdge + ball.size >= block[i][1]*50    &&
                    ball.leftEdge <= block[i][1]*50 + 50
                ){
                    if (ball.leftEdge + ball.size - ball.speedX < block[i][1]*50     ) ball.speedX *= -1;
                    else{if (ball.leftEdge - ball.speedX             > block[i][1]*50 + 50) ball.speedX *= -1;
                        else{if (ball.topEdge - ball.speedY              > block[i][0]*15+165 ) ball.speedY *= -1;
                            else{if (ball.topEdge + ball.size - ball.speedY  < block[i][0]*15+150 ) ball.speedY *= -1;
                            }
                        }
                    }
                    
                    
                    

                    block[i][2]--;
                    if (block[i][2] <= 0) {
                        document.getElementById(block[i][3]).classList.add("none");
                        delete block[i]
                    }
                    else{
                        let color;
                        if (block[i][2] == 1) color = "yellow";
                        if (block[i][2] == 2) color = "green";
                        if (block[i][2] == 3) color = "red";
                        if (block[i][2] == 4) color = "blue";
                        document.getElementById(block[i][3]).classList.add(color)
                    }
                    break;
                }
            }
        
}

document.getElementById("start").addEventListener("click", gameStart, false)
document.getElementById("restart").addEventListener("click", gameStart, false)

function gameOver(){
    document.getElementById("gameOver").classList.remove("none")
    document.getElementById("playfield").classList.add("none")
    pause = true;
}
let block = [
    [0, 4, 4],                           [ 0, 8, 4], [ 0, 9, 4], [ 0,10, 4],    [ 0,12, 4],
    [1, 4, 4],                           [ 1, 8, 4], [ 1, 9, 4], [ 1,10, 4],    [ 1,12, 4],
    [2, 4, 4],                           [ 2, 8, 4], [ 2, 9, 4], [ 2,10, 4],    [ 2,12, 4],
    [3, 4, 4],            [ 3, 6, 4],    [ 3, 8, 4],             [ 3,10, 4],    [ 3,12, 4],             [ 3,14, 4],
    [4, 4, 4],            [ 4, 6, 4],    [ 4, 8, 4],             [ 4,10, 4],    [ 4,12, 4],             [ 4,14, 4],
    [5, 4, 4],            [ 5, 6, 4],    [ 5, 8, 4],             [ 5,10, 4],    [ 5,12, 4],             [ 5,14, 4],
    [6, 4, 4], [6, 5, 4], [ 6, 6, 4],    [ 6, 8, 4],             [ 6,10, 4],    [ 6,12, 4], [ 6,13, 4], [ 6,14, 4],
    [7, 4, 4], [7, 5, 4], [ 7, 6, 4],    [ 7, 8, 4],             [ 7,10, 4],    [ 7,12, 4], [ 7,13, 4], [ 7,14, 4],
    [8, 4, 4], [8, 5, 4], [ 8, 6, 4],    [ 8, 8, 4],             [ 8,10, 4],    [ 8,12, 4], [ 8,13, 4], [ 8,14, 4],
                          [ 9, 6, 4],    [ 9, 8, 4],             [ 9,10, 4],                            [ 9,14, 4],
                          [10, 6, 4],    [10, 8, 4],             [10,10, 4],                            [10,14, 4],
                          [11, 6, 4],    [11, 8, 4],             [11,10, 4],                            [11,14, 4],
                          [12, 6, 4],    [12, 8, 4], [12, 9, 4], [12,10, 4],                            [12,14, 4],
                          [13, 6, 4],    [13, 8, 4], [13, 9, 4], [13,10, 4],                            [13,14, 4],
                          [14, 6, 4],    [14, 8, 4], [14, 9, 4], [14,10, 4],                            [14,14, 4],
    
    ] 
    let id = 0;
    block.forEach( bl => {
        const el = document.createElement("div");
        bl[3] = id;
        el.id = id
        id++;
        el.style.top = bl[0]*15+150 + "px";
        el.style.left = bl[1]*50 + "px";
        let color;
        if (bl[2] == 1) color = "yellow";
        if (bl[2] == 2) color = "green";
        if (bl[2] == 3) color = "red";
        if (bl[2] == 4) color = "blue";
        el.classList.add("block", color);
        el_playfield.appendChild(el);
        
    })
    let blockCopy = [
        [0, 4, 4],                           [ 0, 8, 4], [ 0, 9, 4], [ 0,10, 4],    [ 0,12, 4],
        [1, 4, 4],                           [ 1, 8, 4], [ 1, 9, 4], [ 1,10, 4],    [ 1,12, 4],
        [2, 4, 4],                           [ 2, 8, 4], [ 2, 9, 4], [ 2,10, 4],    [ 2,12, 4],
        [3, 4, 4],            [ 3, 6, 4],    [ 3, 8, 4],             [ 3,10, 4],    [ 3,12, 4],             [ 3,14, 4],
        [4, 4, 4],            [ 4, 6, 4],    [ 4, 8, 4],             [ 4,10, 4],    [ 4,12, 4],             [ 4,14, 4],
        [5, 4, 4],            [ 5, 6, 4],    [ 5, 8, 4],             [ 5,10, 4],    [ 5,12, 4],             [ 5,14, 4],
        [6, 4, 4], [6, 5, 4], [ 6, 6, 4],    [ 6, 8, 4],             [ 6,10, 4],    [ 6,12, 4], [ 6,13, 4], [ 6,14, 4],
        [7, 4, 4], [7, 5, 4], [ 7, 6, 4],    [ 7, 8, 4],             [ 7,10, 4],    [ 7,12, 4], [ 7,13, 4], [ 7,14, 4],
        [8, 4, 4], [8, 5, 4], [ 8, 6, 4],    [ 8, 8, 4],             [ 8,10, 4],    [ 8,12, 4], [ 8,13, 4], [ 8,14, 4],
                              [ 9, 6, 4],    [ 9, 8, 4],             [ 9,10, 4],                            [ 9,14, 4],
                              [10, 6, 4],    [10, 8, 4],             [10,10, 4],                            [10,14, 4],
                              [11, 6, 4],    [11, 8, 4],             [11,10, 4],                            [11,14, 4],
                              [12, 6, 4],    [12, 8, 4], [12, 9, 4], [12,10, 4],                            [12,14, 4],
                              [13, 6, 4],    [13, 8, 4], [13, 9, 4], [13,10, 4],                            [13,14, 4],
                              [14, 6, 4],    [14, 8, 4], [14, 9, 4], [14,10, 4],                            [14,14, 4],
    ];

	
	for(let i=0; i < block.length; i++){
        blockCopy[i][3] = block[i][3];
	}




function gameStart() { 
    block = [
        [0, 4, 4],                           [ 0, 8, 4], [ 0, 9, 4], [ 0,10, 4],    [ 0,12, 4],
        [1, 4, 4],                           [ 1, 8, 4], [ 1, 9, 4], [ 1,10, 4],    [ 1,12, 4],
        [2, 4, 4],                           [ 2, 8, 4], [ 2, 9, 4], [ 2,10, 4],    [ 2,12, 4],
        [3, 4, 4],            [ 3, 6, 4],    [ 3, 8, 4],             [ 3,10, 4],    [ 3,12, 4],             [ 3,14, 4],
        [4, 4, 4],            [ 4, 6, 4],    [ 4, 8, 4],             [ 4,10, 4],    [ 4,12, 4],             [ 4,14, 4],
        [5, 4, 4],            [ 5, 6, 4],    [ 5, 8, 4],             [ 5,10, 4],    [ 5,12, 4],             [ 5,14, 4],
        [6, 4, 4], [6, 5, 4], [ 6, 6, 4],    [ 6, 8, 4],             [ 6,10, 4],    [ 6,12, 4], [ 6,13, 4], [ 6,14, 4],
        [7, 4, 4], [7, 5, 4], [ 7, 6, 4],    [ 7, 8, 4],             [ 7,10, 4],    [ 7,12, 4], [ 7,13, 4], [ 7,14, 4],
        [8, 4, 4], [8, 5, 4], [ 8, 6, 4],    [ 8, 8, 4],             [ 8,10, 4],    [ 8,12, 4], [ 8,13, 4], [ 8,14, 4],
                              [ 9, 6, 4],    [ 9, 8, 4],             [ 9,10, 4],                            [ 9,14, 4],
                              [10, 6, 4],    [10, 8, 4],             [10,10, 4],                            [10,14, 4],
                              [11, 6, 4],    [11, 8, 4],             [11,10, 4],                            [11,14, 4],
                              [12, 6, 4],    [12, 8, 4], [12, 9, 4], [12,10, 4],                            [12,14, 4],
                              [13, 6, 4],    [13, 8, 4], [13, 9, 4], [13,10, 4],                            [13,14, 4],
                              [14, 6, 4],    [14, 8, 4], [14, 9, 4], [14,10, 4],                            [14,14, 4],
        
        ] 
        for(let i=0; i < blockCopy.length; i++){
            block[i][3] = blockCopy[i][3];
        }

        block.forEach( bl => {
            document.getElementById(bl[3]).classList.remove("none");
            document.getElementById(bl[3]).classList.remove("blue");
            document.getElementById(bl[3]).classList.remove("red");
            document.getElementById(bl[3]).classList.remove("yellow");
            document.getElementById(bl[3]).classList.remove("green");
            let color;
            if (bl[2] == 1) color = "yellow";
            if (bl[2] == 2) color = "green";
            if (bl[2] == 3) color = "red";
            if (bl[2] == 4) color = "blue";
            document.getElementById(bl[3]).classList.add(color);
        })

    ball.speedX= -2;
    ball.speedY= 3;
    ball.size= 10;
    ball.topEdge= 50;
    ball.leftEdge= 200;

    paddle.leftEdge= 500;

    document.getElementById("header").textContent="GAME OVER";
    
    el_paddle.style.top   = paddle.topEdge  + "px";
    el_paddle.style.width   = paddle.width  + "px";
    el_paddle.style.height   = paddle.height  + "px";
    el_paddle.style.left   = paddle.leftEdge  + "px";
    el_ball.style.top      = ball.topEdge + "px";
    el_ball.style.left     = ball.leftEdge + "px";


    document.getElementById("playfield").classList.remove("none")
    document.getElementById("menu").classList.add("none")
    document.getElementById("gameOver").classList.add("none")

    pause = false;
    gameLoop()
}

let pause = false;
function gameLoop() {

    if (player1_left){
        paddle.leftEdge -= paddle.speed;

        if (paddle.leftEdge < 0) {
            paddle.leftEdge = 0;
        }
    }
    if (player1_right) {
        paddle.leftEdge += paddle.speed;

        if (paddle.leftEdge > playfield.width - paddle.width) {
            paddle.leftEdge = playfield.width - paddle.width;
        }
    }
    ball.leftEdge += ball.speedX;
    ball.topEdge  += ball.speedY;

    collision()
    
    el_paddle.style.left   = paddle.leftEdge  + "px";
    el_ball.style.top      = ball.topEdge + "px";
    el_ball.style.left     = ball.leftEdge + "px";

    end()

    if(pause) return;
    window.requestAnimationFrame(gameLoop);
}

function end(){
    for (x in block) return;
    document.getElementById("header").textContent="Theme not found";
    gameOver()
}

