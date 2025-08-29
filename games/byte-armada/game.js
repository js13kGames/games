function game(channel,side){
element("style").textContent="*{position:fixed;margin:0;padding:0;box-sizing:border-box;touch-action:none;user-select:none;}";
document.body.style.background="black";
let {floor,ceil,random,PI,abs,atan2,min}=Math;
let level=12,W=min(innerWidth,innerHeight),mode=0,p=null,FPS=30,q=5,buckettime=20,cooldown=FPS,max=5,health=1,timers=[],scale=((W/q)/(FPS*buckettime));
let can=element("canvas"),c=can.getContext("2d");can.width=can.height=W;can.addEventListener("pointerdown",e=>{mode?(mode=0,start(e)):click(e);});

let sound=Sound();

let blue={
  id:0,
  health,
  speak:"Good job!",
  entities:[],laser:"blue",hull:gradient(c,[[0,"white"],[.08,"skyblue"],[.4,"blue"],[.6,"white"]]),
  shape:shape([[0,-10,2,-1,3,1,3,-2,5,-2,5,2,6,2,10,-1,9,5,3,10,3,7,2,6,2,7,0,7],[0,8,2,8,0,10]])
};
let red={
  health,
  speak:"Try again!",
  entities:[],laser:"red",hull:gradient(c,[[0,"white"],[.08,"gold"],[.4,"red"],[.6,"white"]]),
  shape:shape([[0,-1,1,-1,2,4,3,4,4,3,6,2,7,-1,8,-3,8,-7,9,-9,10,-7,10,4,8,7,6,8,3,10,2,7,0,7],[0,9,1,9,0,10]])
};
reset();

function reset(){
timers.forEach(clearInterval);timers=[];
c.clearRect(0,0,W,W);
mode=1;
blue.entities=[];red.entities=[];
if(channel){
  mode=0;
  blue.health=red.health=health;
  start();
  return;
}
c.strokeStyle="white";
for(let i=0;i<25;i++){let x=(i%5)*(W/5),y=floor(i/5)*(W/5);c.strokeRect(x,y,W/5,W/5);c.fillStyle="white";c.textAlign="center";c.textBaseline="middle";c.font=W/35+"px monospace";c.fillText((i+1),x+W/10,y+W/10);}
if(blue.health){
  level++;
  c.strokeStyle="lime";
}else{
  c.strokeStyle="red";
}
if(level>25){
  level=0;
}
let x=(level-1)%5*(W/5),y=floor((level-1)/5)*(W/5);c.strokeRect(x,y,W/5,W/5);
blue.health=red.health=health;
}

function start(p){
if(p){
  let {clientX:x,clientY:y}=p;
  level=floor(x*5/W)+floor(y*5/W)*5+1;
}
if(!channel){
  for(let i=0;i<3;i++) bot();
  let interval = 6000 - ((level - 1) * (5000 / 24));
  timers.push(setInterval(()=>{bot();},interval));
}
timers.push(setInterval(update,1000/FPS));
}


function update(){
c.clearRect(0,0,W,W);
c.drawImage(background,0,0);

//move
for(let i of [blue,red]){
  i.entities.forEach(e=>{
    e.y+=(e.speed*scale);
  });
}

//win
for(let [attacker,defender] of [[blue,red],[red,blue]]){
  for(let a of attacker.entities){
    if(a.y>0 && a.y<W)continue;
    --defender.health;
    if(defender.health<=0){
      speak(attacker.speak);
      reset();
      return;
    }
  }
}

//force deletion in case desynced 
if(channel){
  for(let i of [blue,red]){
    i.entities.forEach(e=>{
      if(e.hp<=0){
        channel.send(JSON.stringify({...e, delete: true}));
      }
    }); 
  }
}

//explosion
for(let i of [blue,red]){
  i.entities.filter(e=>e.hp<=0 || e.delete===true).forEach(explode);
}

//remove
for(let i of [blue,red]){
  i.entities=i.entities.filter(e=>e.hp>0 && e.y>0 && e.y<W && e.delete!==true);
}

//draw
for(let i of [blue,red]){
  c.strokeStyle=i.hull;
  i.entities.forEach(e=>{
    c.save();c.translate(e.x,e.y);c.rotate(e.angle);let s=W/100*e.hp+5;c.scale(s,s);c.lineWidth=1/s;c.stroke(i.shape);c.restore();
  });
}

//shoot
for(let [attacker,defender] of [[blue,red],[red,blue]]){
  for(let a of attacker.entities){
    if(a.cooldown>0){a.cooldown--;continue;}a.cooldown=cooldown;
    let target=null,best=Infinity,max=(a.range*(W/q))**2;
    for(let d of defender.entities){
      let dx=d.x-a.x,dy=d.y-a.y,dist=dx*dx+dy*dy;
      if(dist<=max&&dist<best){target=d;best=dist;}
    }
    if(!target)continue;
    target.hp-=1/a.range;
    a.angle=atan2(target.y-a.y,target.x-a.x)+PI/2;
    c.strokeStyle=attacker.laser;c.lineWidth=1;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(target.x,target.y);c.stroke();
  }
}
}//update

function entity(x,y,a,s,r,side,id){return {x,y,angle:a,speed:s,hp:q/abs(s),range:r,side,id};}

//function bot(){let r=red.entities;r.push(entity(rnd(W),(W-125),PI,rnd(q+1,1),rnd(q+1,1)));}
function bot(){let r=red.entities;r.push(entity(rnd(W),0,PI,rnd(q+1,1),rnd(q+1,1)));}

function click({clientX:x,clientY:y}){
let b=blue.entities;
if(b.length>=max)return;
y=ceil((W-y)/(W/q));
if(!p){
  //p=entity(x,5,0,-y);
  p=entity(x,W,0,-y);
}else{
  p.range=y;
  b.push(p);
  if(channel){ channel.send(JSON.stringify({ x: p.x, w: W, range: p.range, speed: p.speed, side: p.side = side, id: p.id = blue.id++ })); }
  p=null;
}
}

if (channel) { channel.onmessage = ({ data }) => {
  let parsed; try { parsed = JSON.parse(data); } catch { return; }; let { delete: del, id, side, x, w, speed, range } = parsed;
  //desync safeguard
  if (del === true) { ([red, blue].flatMap(t => t.entities).find(e => e.id === id && e.side === side) || {}).delete = true; return; }
  //add
  red.entities.push(entity( x / w * W, 0, PI, -speed, range, side, id));
}; }









function explode(target){
c.save();
c.translate(target.x, target.y);
c.fillStyle = "gold";
c.fill(shape([Array.from({ length: 40 }, () => rnd(40) - 20)], 1, false));
c.restore();
sound.explosion();
}

let background=(()=>{
let c=document.createElement("canvas").getContext("2d");c.canvas.width=c.canvas.height=W;
c.strokeStyle = "rgba(0,255,0,0.1)";
for(let i=0;i<25;i++){let x=(i%5)*(W/5),y=floor(i/5)*(W/5);c.strokeRect(x,y,W/5,W/5);}
return c.canvas;
})();

function speak(text){
if(!window.speechSynthesis) return;
let synth=window.speechSynthesis;
let utter=new SpeechSynthesisUtterance(text);
synth.speak(utter);
}

function gradient(c,a,type="radial",coords){
let g=type==="linear"?c.createLinearGradient(...(coords||[0,W,0,W-50])):c.createRadialGradient(...(coords||[0,0,0,0,0,1]));
a.forEach(e=>g.addColorStop(...e));
return g;
}

function shape(array,gridsize=20,mirror=true){let p=new Path2D;for(let i of array){for(let x of mirror?[1,-1]:[1]){p.moveTo(x*i[0]/gridsize,i[1]/gridsize);for(let j=2;j<i.length;j+=2)p.lineTo(x*i[j]/gridsize,i[j+1]/gridsize);}}return p;}

function rnd(b,a=0){return floor(random()*(b-a))+a;}

function Sound(){
let auc=new AudioContext();
let aubexplosion=noise(1);

function noise(seconds){
let b=auc.createBuffer(1,auc.sampleRate*seconds,auc.sampleRate);
b.getChannelData(0).forEach((_,i,a)=>a[i]=random()*2-1);
return b;
}

function explosion(){
let s=auc.createBufferSource();
s.buffer=aubexplosion;
let gain=auc.createGain();gain.gain.value=3;
let filter=auc.createBiquadFilter();filter.type="lowpass";filter.frequency.value=300;
gain.gain.linearRampToValueAtTime(0,auc.currentTime+1);
s.connect(filter);
filter.connect(gain);
gain.connect(auc.destination);
s.start(0,0,s.buffer.duration);
s.onended=function(){
  s.disconnect();
  gain.disconnect();
  filter.disconnect();
};
}

return {explosion};
}//end sound


}//game
