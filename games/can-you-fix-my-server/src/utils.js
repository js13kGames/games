function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {

  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below
  let left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
  let right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
  let top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
  let bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

  // if ANY of the above are true, the line
  // has hit the rectangle
  if (left || right || top || bottom) {
    return true;
  }
  return false;
}


// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the direction of the lines
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    return true;
  }
  return false;
}

function toogle(){
  document.getElementById('canvas').style.display = 'flex';document.getElementById('welcome').style.display = 'none'
  when = ac.currentTime;
  //start the lead part immediately
  sequence1.play( when );
  // delay the harmony by 16 beats
  sequence2.play( when + ( 60 / tempo ) * 16 );
  // start the bass part immediately
  sequence3.play( when );
}

const colors = {
  background: "#7c3f58",
  dot: "#f9a875",
  selectedDot: "#eb6b6f",
  line: "#fff6d3",
}