var jugador = document.getElementById("character");
var block = document.getElementById("obj");
var pad = document.getElementById("pad");
var point = document.getElementById("point");
var counter=0;
window.addEventListener("keydown",checkKeyPress,false);

function checkKeyPress(key){
    if(key.keyCode == "38" || key.keyCode == "87"){
        jump();
    }
}

function jump(){
    if(jugador.classList == "animate"){return}
    jugador.classList.add("animate");
    setTimeout(function(){
        jugador.classList.remove("animate");
    },300);
}

var checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(jugador).getPropertyValue("top"));
    let PointCheck = parseInt(window.getComputedStyle(point).getPropertyValue("left"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    let blockJump = parseInt(window.getComputedStyle(pad).getPropertyValue("left"));

    //Check if the block or pad is colitioning with the player
    if(blockLeft<20 && blockLeft>-20 && characterTop>=130 || blockJump<0 && blockJump>-100 && characterTop>=130){
        block.style.animation = "none";
        pad.style.animation = "none";
        alert("Game Over. score: "+Math.floor(counter/100));
        localStorage.setItem("Player",Math.floor(counter/100));
        counter=0;
        block.style.animation = "block 1s infinite linear";
        pad.style.animation = "pad 1.6s infinite linear";
    }
    //Check if the pad and player is in the right spot
    else if(blockJump<0 && blockJump>-100 && characterTop>=70){
        jugador.style.animation = "jumpPad 0.3s linear";
        jugador.style.top = "100px";
    }
    //Code for the player fold to the ground
    else if(blockJump<0 && blockJump>-100){
        jugador.style.animation = "jump 0.3s linear";
        jugador.style.top = "150px";
    }
    else{
        //Check is the block of the point is hiting by the player
        if(PointCheck<10 && PointCheck>-10 && characterTop<=100){
            counter = counter + 5;
        }
        //Check that the score is the same as 30 for speed increase
        if(Math.floor(counter/100) == 30){
            block.style.animation = "block 0.7s infinite linear";
            pad.style.animation = "pad 0.8s infinite linear";
        }
        counter++;
        document.getElementById("scorelocal").innerHTML = localStorage.getItem("Player");
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
    }
}, 10);