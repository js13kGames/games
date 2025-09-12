function generateRooftops({GAME_W:W,GAME_H:H,minGap,maxGap,rooftopY}){

function rnd(min,max){return min+Math.random()*(max-min);}

let rooftops=[];
let minw=250;
let maxw=600;

function drawRoundedRect(C,x,y,width,height,radius){
C.beginPath();C.moveTo(x+radius,y);
C.lineTo(x+width-radius,y);C.quadraticCurveTo(x+width,y,x+width,y+radius);C.lineTo(x+width,y+height);C.lineTo(x,y+height);C.lineTo(x,y+radius);C.quadraticCurveTo(x,y,x+radius,y);
C.closePath();
}

function generateInitialRooftops(){
rooftops=[];
let x=0;
while(x<W*2){
  let width=rnd(minw,maxw);
  let gap=rnd(minGap,maxGap);
  rooftops.push({x,width,y:rooftopY});
  x+=width+gap;
}
}

function update({scrollSpeed,delta}){
for(let r of rooftops)r.x-=scrollSpeed*delta;
if(rooftops.length&&rooftops[0].x+rooftops[0].width<0)rooftops.shift();
while(rooftops.length&&rooftops[rooftops.length-1].x<W){
  let last=rooftops[rooftops.length-1];
  let width=rnd(minw,maxw);
  let gap=rnd(minGap,maxGap);
  rooftops.push({x:last.x+last.width+gap,width,y:rooftopY});
}
}

function draw(C){
let radius=5;
for(let r of rooftops){
  let gradient=C.createLinearGradient(0,H,0,r.y);
  gradient.addColorStop(0.00,"hsl(0, 0%, 30%)");
  gradient.addColorStop(0.98,"hsl(0, 0%, 10%)");
  gradient.addColorStop(0.98,"hsl(0, 0%, 70%)");
  gradient.addColorStop(1.00,"hsl(0, 0%, 30%)");
  C.fillStyle=gradient;
  drawRoundedRect(C,r.x,r.y,r.width,H-r.y,radius);
  C.fill();
}
}

generateInitialRooftops();

return {rooftops,update,draw};

}

