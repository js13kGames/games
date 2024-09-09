function switchWeapon(event){
    game.selectedWeapon++
    game.selectedWeapon %= 2;
}

function keyDown(event){ 
  game.keys[event.keyCode] = true;
  //console.log(event.keyCode);
}

function keyUp(event){ 
  game.keys[event.keyCode] = false;
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);