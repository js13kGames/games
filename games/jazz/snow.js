function generateSnow({GAME_W:W,GAME_H:H}){

function rnd(min,max){return min+Math.random()*(max-min);}

let color="#FFFFFF";
let count=150;
let speedmin=0.2;
let speedmax=1;
let sizemin=2;
let sizemax=4;
let particles=[];

function init(){
for(let i=0;i<count;i++){
  particles.push({
    x:rnd(0,W),
    y:rnd(0,H),
    size:rnd(sizemin,sizemax),
    speed:rnd(speedmin,speedmax)
  });
}
}

function draw(C,{scrollSpeed:S,delta:D}){
C.fillStyle=color;
for(let p of particles){
  p.y+=p.speed*D;
  p.x-=S*D;
  C.beginPath();
  C.arc(p.x,p.y,p.size,0,Math.PI*2);
  C.fill();
  if(p.y>H){
    p.y=-p.size;
    p.x=rnd(0,W);
  }else if(p.x<-p.size){
    p.x=W+p.size;
    p.y=rnd(0,H);
  }
}
}

init();
return {draw};

}
