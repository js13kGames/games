onload=()=>{
document.title="FURBALL";
const style=document.createElement("style");
style.textContent=" *{margin:0;padding:0;position:fixed;box-sizing:border-box;touch-action:none;user-select:none;} canvas{background:linear-gradient(to top,blue,skyblue);} body{background:black;} ";
document.head.appendChild(style);

const canvas=document.createElement("canvas");
let level=Object.assign(document.createElement("input"),{type:"range",value:3,min:1,max:10});
level.addEventListener("input",()=>pspeed=level.value/10);
document.body.append(canvas,level);

let FPS=60,interval,maxdx,score=0,W,H,plats,u,gravity,jumpstrength,pspace,pspeed,playersize;
let platformShape,catHeadShape,catEyeShape;
let A=new AudioContext();
const ctx=canvas.getContext("2d");

createPlatform();
createCat();
resize();
start();

addEventListener("resize",resize);

addEventListener("visibilitychange",()=>{
if(document.hidden)clearInterval(interval);
else start();
});

canvas.addEventListener("pointerdown",e=>{
if(u.jumping)return;
playSound("jump");
let vx=Math.max(-maxdx,Math.min(maxdx,e.offsetX-W/2))*0.05;
Object.assign(u,{vx,vy:jumpstrength,jumping:true,onplatform:null});
});

function start(){interval=setInterval(loop,1000/FPS);}

function loop(){
ctx.clearRect(0,0,W,H);
ctx.strokeStyle = "rgb(255,255,255,0.1)"; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
updatePlatforms();
updateCat();
drawPlatforms();
drawCat();
drawScore();
}

function resize(){
const ASPECT_RATIO=9/16;
H=window.innerHeight;
W=H*ASPECT_RATIO;
if(W>window.innerWidth){W=window.innerWidth;H=W/ASPECT_RATIO;}
canvas.width=W;
canvas.height=H;
canvas.style.left=((window.innerWidth-W)/2)+"px";
const scale=H/600;
gravity=0.5*scale;
jumpstrength=-12*scale;
pspace=90*scale;
pspeed=level.value/10*scale;
playersize=20*scale;
maxdx=150*scale;
ctx.font=(Math.max(10,Math.min(20,10*scale)))+"px monospace";
plats=[];
for(let y=0;y<H;y+=pspace){
  const x=Math.random()*W;
  const vx=(Math.random()<0.5?-1:1)*0.5*scale;
  plats.push({x,vx,y});
}
u={size:playersize,x:plats[0].x,y:plats[0].y-playersize,vx:0,vy:0,jumping:false,angle:0,onplatform:plats[0]};
}

function createPlatform(){
  const diamondShape=[[0,0,16,0,20,4,0,20]];
  platformShape=shape(diamondShape);
}

function createCat(){
  const catHead=[[0,-6,3,-6,6,-10,10,-2,10,2,7,7,4,9,0,9]];
  const catEye=[[2,0,3,-2,5,-3,5,-1,2,0]];
  catHeadShape=shape(catHead);
  catEyeShape=shape(catEye);
}

function updatePlatforms(){
plats.forEach(p=>{
  p.x+=p.vx;
  if(p.x<0)p.x=W;
  else if(p.x>W)p.x=0;
  p.y+=pspeed;
  if(p.y>H){
    p.y=-playersize;
    p.x=Math.random()*W;
    p.vx=(Math.random()<0.5?-1:1)*0.5*(H/600);
  }
  if(u.onplatform===p){
    u.x+=p.vx;
    if(u.x<0)u.x=W;
    else if(u.x>W)u.x=0;
  }
});
}

function drawPlatforms(){
plats.forEach(p=>{
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.scale(u.size,u.size);
  const gradient=ctx.createLinearGradient(-1,-1,1,1);
  gradient.addColorStop(0,"rgba(255,255,255,0.9)");
  gradient.addColorStop(0.5,"rgba(200,200,255,0.6)");
  gradient.addColorStop(1,"rgba(150,150,200,0.3)");
  ctx.fillStyle=gradient;
  ctx.fill(platformShape);
  ctx.restore();
});
}

function updateCat(){
if(!u.jumping){u.y+=pspeed;if(u.y>H)resetPlayer();return;}
u.vy+=gravity;
u.y+=u.vy;
u.x+=u.vx;
u.angle+=u.vx*0.05;
if(u.x+u.size<0)u.x=W;
else if(u.x>W)u.x=-u.size;
const landed=plats.some(p=>{
if(u.vy>0&&u.x+u.size>p.x-playersize&&u.x<p.x+playersize&&u.y+u.size>p.y-playersize&&u.y+u.size<p.y+u.vy+1){
  Object.assign(u,{vy:0,jumping:false,y:p.y-u.size,angle:0});
  if(u.onplatform!==p)score++;
  u.onplatform=p;
  return true;
}
});
if(!landed)u.onplatform=null;
if(u.y>H)resetPlayer();
}

function drawCat(){
ctx.save();
ctx.translate(u.x+u.size/2,u.y+u.size/2);
ctx.rotate(u.angle);
ctx.scale(u.size,u.size);
ctx.fillStyle="rgba(0,0,0,0.7)";
ctx.fill(catHeadShape);
ctx.fillStyle="rgba(0,255,0,0.9)";
ctx.fill(catEyeShape);
ctx.restore();
}

function drawScore(){
ctx.fillStyle="black";
ctx.fillText("Score:"+score,20,40);
}

function resetPlayer(){
  // playSound("fall"); 
  const audio = new Audio("furball.aac");
  audio.play();
  score -= 5;
  const p = plats.reduce((c, plat) => Math.abs(plat.y - H / 2) < Math.abs(c.y - H / 2) ? plat : c);
  Object.assign(u, {x: p.x, y: p.y - u.size, vx: 0, vy: 0, jumping: false, angle: 0, onplatform: p});
}

function shape(array,gridsize=20,mirror=true){
let p=new Path2D();
for(let i of array){
  for(let x of (mirror?[1,-1]:[1])){
    p.moveTo(x*i[0]/gridsize,i[1]/gridsize);
    for(let j=2;j<i.length;j+=2)p.lineTo(x*i[j]/gridsize,i[j+1]/gridsize);
  }
}
return p;
}

function playSound(type){
const params={jump:{n:1e4,exp:1.055,mask:128},fall:{n:5e4,exp:0.9,mask:200}}[type];
if(!params)return;
let t=(i)=>(params.n-i)/params.n;
let f=(i)=>i>params.n?null:((Math.pow(i,params.exp)&params.mask)?1:-1)*Math.pow(t(i),type==="jump"?2:3);
let m=A.createBuffer(1,96e3,48e3);
let b=m.getChannelData(0);
for(let i=96e3;i--;)b[i]=f(i);
let s=A.createBufferSource();
s.buffer=m;
s.connect(A.destination);
s.start();
}

}
