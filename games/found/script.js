var objid = 0;
var newGameArea;
var ctx
var screenResized = false
var player;
var gameStarted = false;
var deaths = 0
var playerControl = {
  LEFT: false,
  UP: false,
  RIGHT: false,
  DOWN: false,
  JUMP:false,
  ENTER:false
};
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
function playerControlKeyPressed(event){
    const key = event.key
    if (gameStarted){
        if(key == "ArrowRight" || key == "D" || key == "d"){
            playerControl.RIGHT = true
        }
        if(key == "ArrowLeft" || key == "A" || key == "a"){
            playerControl.LEFT = true
        }
        if(key == "ArrowUp" || key == "W" || key == "w"){
            if(!player.gravityAvailabe){
                playerControl.UP = true
            }
        }
        if(key == "ArrowDown" || key == "s" || key == "S"){
            playerControl.DOWN = true
        }
        if(key == " "){
            playerControl.JUMP = true
        }
        if(key=="Enter"){
            playerControl.ENTER = true
        }
    }
    else {
        if(key=="Enter"){
            document.getElementById("screenLoader").style.animation = "fadeOut2 0.5s ease-in"
            document.getElementById("startScreen").style.animation = "fadeOut 0.5s ease-in"
            setTimeout(()=>{
                document.getElementById("screenLoader").style.display = "none"
                document.getElementById("startScreen").style.display = "none"
            },500)
            gameStarted = true
        }
    }
    
}
function playerControlKeyReleased(event){
    const key = event.key
    if(key == "ArrowRight" || key == "D" || key == "d"){
        playerControl.RIGHT = false
    }
    if(key == "ArrowLeft" || key == "A" || key == "a"){
        playerControl.LEFT = false
    }
    if(key == "ArrowUp" || key == "W" || key == "w"){
        if(!player.gravityAvailabe){
            playerControl.UP = false
        }
    }
    if(key == "ArrowDown" || key == "s" || key == "S"){
        playerControl.DOWN = false
    }
    if(key == " "){
        playerControl.JUMP = false
        player.jumpPressed = false
    }
    if(key=="Enter"){
        playerControl.ENTER = false
    }
}
var testObject
var testObject2
var testObject3
var testObject4
var testObject5
var gameCanvas
function init() {
    document.getElementById("screenLoader").style.opacity = 0.7
    gameCanvas = document.getElementById('gameAreaCanvas')
    newGameArea = new gameArea()
    ctx = newGameArea.context
    level = LevelGenerator()
    window.requestAnimationFrame(updateGameArea)
    document.addEventListener("keydown",playerControlKeyPressed, false);	
    document.addEventListener("keyup",playerControlKeyReleased, false);
}
window.addEventListener('resize', ()=>{
    screenResized = true
}, false)
class gameArea {
    constructor (
        width=1300,height=700,color="rgb(59, 59, 59)"
    ) {
        this.color = color
        this.width = width
        this.height = height
        this.start()
    }
    resizeGame() {
        var gameAreaBody = document.getElementById('gameArea');
        var widthToHeight = 16 / 9;
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthToHeight = newWidth / newHeight;
        
        if (newWidthToHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;
            gameAreaBody.style.height = newHeight + 'px';
            gameAreaBody.style.width = newWidth + 'px';
        } else {
            newHeight = newWidth / widthToHeight;
            gameAreaBody.style.width = newWidth + 'px';
            gameAreaBody.style.height = newHeight + 'px';
        }
        
        gameAreaBody.style.marginTop = (-newHeight / 2) + 'px';
        gameAreaBody.style.marginLeft = (-newWidth / 2) + 'px';
    }
    start() {
        this.canvas = gameCanvas
        this.resizeGame()
        this.canvas.style.backgroundColor = this.color
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext("2d")
        this.context.imageSmoothingEnabled = false
    }
    clear() {
        if(screenResized){
            screenResized = false
            this.resizeGame()
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function updateGameArea() {
    newGameArea.clear()
    if (level !=null){
        level.playLevel()
        player.start()
    }
    window.requestAnimationFrame(updateGameArea)
}
document.addEventListener("DOMContentLoaded",init)
function playSound(params) {
    var url = window.URL || window.webkitURL;
    try {
        var soundURL = jsfxr(params);
        var player = new Audio();
        player.addEventListener('error', function(e) {
        }, false);
        player.src = soundURL;
        player.play();
        player.addEventListener('ended', function(e) {
        url.revokeObjectURL(soundURL);
        }, false);
    } catch(e) {
        console.log(e);
    }
}

function playString(name="death") {
    var str
    var flagTouch = "[0,,0.0154,0.538,0.329,0.5342,,,,,,0.4599,0.6024,,,,,,1,,,,,0.52]"
    if (name =="death"){
        str = "[1,,0.0404,,0.2501,0.6364,,-0.4971,,,,,,,,,,,1,,,0.2928,,0.5]"
    }
    else if(name == "keyPress"){
        str = "[0,,0.0185,0.5339,0.1614,0.28,0.16,,,,,,,,,,,,1,,,,,0.52]"
    }
    else if(name=="flag"){
        str = flagTouch
    }
    var temp = str.split(",");
    var params = new Array();
    for(var i = 0; i < temp.length; i++) {
        params[i] = parseFloat(temp[i]);
    }
    playSound(params);
}
