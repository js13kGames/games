var colorHouse ='#667788';

function drawHouse(pos) {
  ctx.beginPath();
  ctx.rect(pos[0], pos[1], pos[2],pos[3]);
  ctx.lineWidth="20";
  ctx.strokeStyle = color1;
  ctx.stroke();
  ctx.closePath();
}

function drawAllHouses(){
  ctx.clearRect(-10 , -10 , borderLeft +100,755);
  ctx.clearRect(borderRight-40 , -10 , canvas.width+10,755);

  //left part
  var rangeLeft = Math.floor(Math.random()*(200-50+1)+50);
  for(var i = borderLeft +40 -rangeLeft; i >- 100; i-=40){
    for (var j = 0; j < canvas.height -50; j+=40){
      var rand = Math.random();
      if (rand>0.4){
          drawPlayer([i,j]);
      }

    }
  }
  //right part
  var rangeRight = Math.floor(Math.random()*(200-50+1)+50);
  for(var i = borderRight + rangeRight  - 80; i< canvas.width ; i+=40){
    for (var j = 0 ; j < canvas.height -50; j+=40){
      var rand = Math.random();
      if (rand>0.4){
          drawPlayer([i,j])
      }

    }
  }
}
function startLogicDecor() {
    logicInterval = setInterval(drawAllHouses,150);
}
