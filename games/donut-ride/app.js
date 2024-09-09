var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var score = 0;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var isOffline = false;
var myReq; // animationFrame
var colorChangeIntervalRequest; // Car color change each iteration
var scoreUpdateRequest;

var currentCarColorIndex;
function myAnimationFrame(){
  const checkCollision = is_colliding(document.getElementById('js-bounce-donut'), document.getElementById('js-car'))
  if(checkCollision && !isOffline) {
    stop();
  } else {
    requestAnimationFrame(myAnimationFrame);
  }
}
function colorChangeInterval(){
  isOffline = false;
  var carIndex = Math.floor(Math.random() * 10) + 1;
  if(carIndex % 3 == 0){
    isOffline = true;
  }
  document.getElementById('car-offline').classList.add('off');
  [...document.getElementsByClassName('js-car-color')].forEach(val => { val.classList.remove(`car-color-${currentCarColorIndex}`); val.classList.add(`car-color-${carIndex}`);});
  if(isOffline){
    document.getElementById('car-offline').classList.add('on');
    document.getElementById('car-offline').classList.remove('off');
  }
  currentCarColorIndex = carIndex;
}
function scoreUpdate(){
  score++;
  [...document.getElementsByClassName('js-score')].forEach(val => { val.innerHTML = score;});
}
function start(dountIndex){
  score = 0;
  scoreUpdate();
  isOffline = false;
  if(!dountIndex){ dountIndex = Math.floor(Math.random() * 5) + 1  }
  document.getElementById('js-running-donut').classList.add(`donut-color-${dountIndex}`);
  [...document.getElementsByClassName('js-game-start')].forEach(val => { val.classList.add('on'); val.classList.remove('off')});
  [...document.getElementsByClassName('js-game-stopped')].forEach(val => { val.classList.add('off'); val.classList.remove('on')})
  colorChangeIntervalRequest = setInterval(colorChangeInterval, 5000);
  scoreUpdateRequest = setInterval(scoreUpdate, 1000);
  myAnimationFrame();
}
function stop(){
  myReq ? cancelAnimationFrame(myReq) : null; // Cancel animation frame
  clearInterval(colorChangeIntervalRequest); // cancel color change system
  clearInterval(scoreUpdateRequest); // cancel color change system
  [...document.getElementsByClassName('js-game-start')].forEach(val => { val.classList.add('off'); val.classList.remove('on')});
  [...document.getElementsByClassName('js-game-stopped')].forEach(val => { val.classList.add('on'); val.classList.remove('off')})
  document.getElementById('game-over').classList.remove('off');
}
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38' || e.keyCode == '32') {
      document.getElementById('js-bounce-donut').classList.add('js-bounce-dount');
      setTimeout(()=> { document.getElementById('js-bounce-donut').classList.remove('js-bounce-dount');}, 2000);
    }
}

function is_colliding(a, b) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();
  var buffer = 40;
  return !(
      ((aRect.top + aRect.height - buffer) < (bRect.top)) ||
      (aRect.top > (bRect.top + bRect.height - buffer)) ||
      ((aRect.left + aRect.width - buffer) < bRect.left) ||
      (aRect.left > (bRect.left + bRect.width - buffer))
  );
}