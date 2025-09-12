function generateBuildings({GAME_W:W,GAME_H:H}){

function rnd(min,max){return min+Math.random()*(max-min);}

let B=[];
let minw=350;
let maxw=700;
let mingap=20;
let maxgap=70;
let minh=300;
let maxh=H;
let winw=100;
let winh=300;
let wingap=10;
let bcolor="black";
let wcolor="yellow";

function buildings(){
B=[];
let x=0;
while(x<W*2){
  let width=rnd(minw,maxw);let gap=rnd(mingap,maxgap);let height=rnd(minh,maxh);
  B.push({x,width,height,color:bcolor});
  x+=width+gap;
}
}

function draw(ctx,{scrollSpeed,delta}){
for(let r of B){
  r.x-=scrollSpeed*0.5*delta;
  ctx.fillStyle=r.color;
  ctx.fillRect(r.x,H-r.height,r.width,r.height);
  drawWindows(ctx,r.x,H-r.height,r.width,r.height);
}
if(B.length&&B[0].x+B[0].width<0){B.shift();}
while(B.length&&B[B.length-1].x<W){
  let last=B[B.length-1];
  let width=rnd(minw,maxw);let gap=rnd(mingap,maxgap);let height=rnd(minh,maxh);
  B.push({x:last.x+last.width+gap,width,height,color:bcolor});
}
}

function drawWindows(ctx,x,y,width,height){
ctx.fillStyle=wcolor;
for(let i=wingap;i+winw<=width-wingap;i+=winw+wingap){
  for(let j=wingap;j+winh<=height-wingap;j+=winh+wingap){
    ctx.fillRect(x+i,y+j,winw,winh);
  }
}
}

buildings();

return {draw};
}
