onload=()=>{
document.title="Bike";
const style=document.createElement("style");
style.textContent="*{margin:0;padding:0;position:fixed;touch-action:none;user-select:none;background:black;}";
document.head.appendChild(style);

const canvas=document.createElement("canvas");
document.body.appendChild(canvas);
const ctx=canvas.getContext("2d");






document.addEventListener("contextmenu", function(e) {
    e.preventDefault(); // Prevents the menu from showing
});





let score=0;

const GAME_W=900;
const GAME_H=1600;
canvas.width=GAME_W;
canvas.height=GAME_H;

//scaling
let scale=1,offsetX=0,offsetY=0;
const resize=()=>{
const ratio=9/16;
let vw=innerWidth,vh=innerHeight;
if(vw/vh>ratio){
  scale=vh/GAME_H;
  offsetX=(vw-GAME_W*scale)/2;
  offsetY=0;
}else{
  scale=vw/GAME_W;
  offsetX=0;
  offsetY=(vh-GAME_H*scale)/2;
}
canvas.style.width=GAME_W*scale+"px";
canvas.style.height=GAME_H*scale+"px";
canvas.style.left=offsetX+"px";
canvas.style.top=offsetY+"px";
};
onresize=resize;
resize();

let w=GAME_W,h=GAME_H;

// --- Background Music ---
let audioContext = new AudioContext();
pl_synth_wasm_init(audioContext, (synth) => {
// let synth=pl_synth_init(audioContext);
const buffer = synth.song(song);
const source = audioContext.createBufferSource();
source.buffer = buffer;
source.loop = true;
source.connect(audioContext.destination);
source.start();
});

//---ground(slope)---
let offset=0;
const amplitude=40;
const freq=1/100;
const linearSlope=0.5;
const slope=(x)=>Math.sin((x+offset)*freq)*amplitude+(h/2)+x*linearSlope;
const slopeDerivative=(x)=>amplitude*freq*Math.cos((x+offset)*freq)+linearSlope;

//---mountains---
const mountainScale=w*2;
const mountainData=[[-20,0,-16,-6,-13,-2,-6,-18,-2,-8,2,-16,6,-8,12,-20,20,0,-20,0,-20,h,20,h,20,0]];
const mountainShape=makeShape(mountainData,40,false);
let mountainOffset=0;
function drawMountains(dt){
mountainOffset=(mountainOffset+1*dt)%(w*2);
function drawChunk(x){
  ctx.save();
  ctx.translate(x,h*0.7);
  ctx.scale(mountainScale,mountainScale);
  ctx.fillStyle="white";
  ctx.fill(mountainShape);
  ctx.restore();
}
drawChunk(w/2-mountainOffset);
drawChunk(w/2-mountainOffset+mountainScale);
}

//---cats---
const catHead=makeShape([[0,-6,3,-6,6,-10,10,-2,10,2,7,7,4,9,0,9]]);
const cats=[];
const CAT_SIZE=20,CAT_SPEED=4;
for(let i=0;i<3;i++){const x=400+i*600;cats.push({x,y:slope(x)-CAT_SIZE,size:CAT_SIZE,rotation:0,active:true});}

//---crash---
let crashActive=false;
let crashX=0,crashY=0;

//---player(cycle)---
const cycle={x:100,y:0,size:40,vy:0,onGround:true};
const playerEmoji=String.fromCodePoint(0x1F6B4,0x200D,0x2642,0xFE0F);
let holding=false;
const GRAVITY=1,HOLD_GRAVITY=0.35;
let flipCharge=0,flipRotation=0,flipping=false;







//---loop---
let lastTime=performance.now();
function loop(now){
const dt=(now-lastTime)/(1000/60);
lastTime=now;
offset+=4*dt;
ctx.fillStyle="skyblue";ctx.fillRect(0,0,w,h);
drawMountains(dt);
drawGround();
updateCycle(dt);
updateCats(dt);
drawCycle(dt);
if(crashActive){crash();}
drawScore();
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);








function crash(){
ctx.font="60px serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(String.fromCodePoint(0x1F4A5),crashX,crashY);
crashActive=false;
score--;
}

function drawGround(){
ctx.fillStyle="tan";
ctx.beginPath();
ctx.moveTo(0,h);
for(let x=0;x<=w;x+=10)ctx.lineTo(x,slope(x));
ctx.lineTo(w,h);
ctx.closePath();
ctx.fill();
}

function updateCats(dt){
for(const c of cats){
  c.x-=CAT_SPEED*dt;
  if(c.x<-c.size){
    c.x=w+800+Math.random()*800;
    c.active=true;
  }
  c.y=slope(c.x)-c.size;
  drawCat(c,dt);
  //collision
  const dx=cycle.x-c.x;
  const dy=(cycle.y+cycle.size/2)-(c.y+c.size/2);
  const dist=Math.sqrt(dx*dx+dy*dy);
  if(dist<(cycle.size+c.size)/2&&c.active){
    //crash
    c.active=false;
    crashActive=true;
    crashX=cycle.x;
    crashY=cycle.y+cycle.size/2;
  }
  else if(c.active&&cycle.x>c.x+c.size){
    //successful
    score++;
    c.active=false;
  }
}
}

function drawCat(c,dt){
ctx.save();
ctx.translate(c.x,c.y+c.size/2);
ctx.rotate(c.rotation);
ctx.scale(c.size,c.size);
ctx.fillStyle="black";
ctx.fill(catHead);
ctx.restore();
c.rotation-=0.1*dt;
}

function updateCycle(dt){
const groundY=slope(cycle.x);
if(cycle.onGround){
  cycle.y=groundY-cycle.size;
  cycle.vy=0;
}else{
  cycle.vy+=(holding?HOLD_GRAVITY:GRAVITY)*dt;
  cycle.y+=cycle.vy*dt;
  if(cycle.y>=groundY-cycle.size){
    const slopeAngle=Math.atan2(slopeDerivative(cycle.x),1);
    const diff=Math.abs(((flipRotation%(2*Math.PI))-slopeAngle+Math.PI)%(2*Math.PI)-Math.PI);
    if(flipping&&diff>Math.PI/2){
      crashActive=true;
      crashX=cycle.x;
      crashY=cycle.y+cycle.size/2;
      cycle.y=groundY-cycle.size;
      cycle.vy=0;
      cycle.onGround=true;
      flipping=false;
      flipRotation=flipCharge=0;
    }else{
      cycle.y=groundY-cycle.size;
      cycle.vy=0;
      cycle.onGround=true;
      flipping=false;
      flipRotation=flipCharge=0;
    }
  }
}
}

function drawCycle(dt){
let angle=Math.atan2(slopeDerivative(cycle.x),1);
if(!cycle.onGround&&flipping){
  flipRotation-=0.1*flipCharge*dt;
  angle=flipRotation;
}
ctx.save();
ctx.translate(cycle.x,cycle.y+cycle.size/2);
ctx.scale(-1,1);
ctx.rotate(-angle);
ctx.font=cycle.size+"px serif";
ctx.textAlign="center";
ctx.textBaseline="middle";
ctx.fillText(playerEmoji,0,0);
ctx.restore();
}

function drawScore(){
ctx.fillStyle="black";
ctx.font="20px serif";
ctx.textAlign="left";
ctx.textBaseline="top";
ctx.fillText("Score: "+score,20,20);
}

function makeShape(array,gridsize=20,mirror=true){
const p=new Path2D();
for(const i of array){
  for(const x of (mirror?[1,-1]:[1])){
    p.moveTo(x*i[0]/gridsize,i[1]/gridsize);
    for(let j=2;j<i.length;j+=2)
      p.lineTo(x*i[j]/gridsize,i[j+1]/gridsize);
  }
}
return p;
}

addEventListener("pointerdown",()=>{
    if (audioContext.state === 'suspended') audioContext.resume();
holding=true;
flipCharge++;
if(cycle.onGround){
  cycle.vy=-15;
  cycle.onGround=false;
  flipping=true;
}
});
const release=()=>{holding=false;};
addEventListener("pointerup",release);
addEventListener("pointercancel",release);
addEventListener("pointerout",release);
addEventListener("pointerleave",release);











};
