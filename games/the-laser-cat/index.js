

let currLaserTile; 
let currBombTile;
let score = 0;
let gameOver = false;


window.onload = function(){
  setGame();
};

function setGame(){
  //there will be our grid for the HTML 
  for (let i= 0; i<9; i++){ //this means itll start from 0 to 8 but will stop at nine
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  
  }
  setInterval(setLaser, 1000);//2k ms~~2 sec
  setInterval(setBomb, 2000);//3k ms~~ 3sec
}
  function getRandomTile(){
  //this function is gonna return a num between 0 and 1 
  //and multiplyig it by 9 is gonna genertae all the numbers under nine but not nine itseld
  let num = Math.floor(Math.random()* 9);
  return num.toString();
}
function setLaser(){
  if (currLaserTile){
    currLaserTile.innerHTML = "";
  }
  
  
  let laser = document.createElement("img");
  laser.src = "./laser.png" ;
  laser.className = "laser";
  let num = getRandomTile();
  if (currBombTile && currLaserTile.id == num){
    return;
  }
  
  currLaserTile= document.getElementById(num);
  currLaserTile.appendChild(laser);
}
function setBomb(){
  if(gameOver){
    return;
  }
  if(currBombTile){
    currBombTile.innerHTML= "";
  }
  let bomb = document.createElement("img");
  bomb.src = "./bomb.png";
  bomb.style.width = "80px";
  bomb.style.height = "80px";
  
  let num =getRandomTile();

  currBombTile = document.getElementById(num);
  currBombTile.appendChild(bomb);
   if (currLaserTile && currBombTile.id == num){
    return;
  }
}
function selectTile(){
  if (gameOver){
    return;
  }
  if (this == currLaserTile){
    score += 10;
    document.getElementById("score"). innerText = score.toString();
  }
  else if (this == currBombTile){
    document.getElementById("score").innerText =  "LASERS CATCHED:"+ score.toString();
    gameOver = true;  
  }
}
let correctAnswers = 0;
let currentQuestion;
let gamePaused;

function selectTile(){
  if (gamePaused) return;
  if (this == currLaserTile){
    score += 10;
    document.getElementById("score").innerText = score.toString();
  } else if (this == currBombTile){
    gamePaused = true;
    showMathPopup();
  }
  
}
function showMathPopup(){
  document.getElementById("math-popup").style.display = "block";
  generateQuestion();
}

function generateQuestion(){
  let a = Math.floor(Math.random() * 10) +1;
  let b = Math.floor(Math.random() * 10) +1;
  currentQuestion = a + b;
  document.getElementById("math-question").innerText = `what is ${a} + ${b}`;
  document.getElementById("math-answer").value = " ";
  document.getElementById("math-feedback").innerText = "";
}

function submitAnswer(){
  let userAnswer = parseInt(document.getElementById("math-answer").value);
  if (userAnswer === currentQuestion){
    correctAnswers++;
    document.getElementById("math-feedback").innerText = "correct :D";
    if (correctAnswers>=5){
      resumeGame();
    }
    else {
      setTimeout(generateQuestion, 1000);//is gonna generate a ques every 1 sec
    }
  } else{
    document.getElementById("math-feedback").innerText = "try again :/";
  }
}
function resumeGame(){
  document.getElementById("math-popup").style.display = 'none';
  correctAnswers = 0;
  gamePaused = false;
}
window.onload = function(){
  document.getElementById("start-button").addEventListener("click", function(){
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    setGame();  
  });
  
};
const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

function spawnCloud(){
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    cloud.style.top = Math.random() * window.innerHeight + "px";
    document.body.appendChild(cloud);
    
    //now this gotta remove em once theyre done floating
    setInterval(spawnCloud, 2000);
    setTimeout(()=> cloud.remove(), 30000);
}
function spawnCloud2(){
    const cloud2 = document.createElement("div");
    cloud2.className = "cloud2";
    cloud2.style.top = Math.random() * window.innerHeight + "px";
    document.body.appendChild(cloud2);
    
    //now this gotta remove em once theyre done floating
    setInterval(spawnCloud2, 2000);
    setTimeout(()=> cloud2.remove(), 30000);
}






