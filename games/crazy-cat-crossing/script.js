const cv=document.getElementById('g'),c=cv.getContext('2d');
cv.width=window.innerHeight,cv.height=window.innerHeight;
const W=cv.width,H=cv.height;
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(a,min=-Infinity,max=Infinity)=>Math.min(max,Math.max(min,a));
function rand(min,max){return Math.floor(Math.random()*(max-min+1)+min);};
function rC(){const hue=rand(1,360);const saturation=rand(30,70);const lightness=rand(60,100);return`hsl(${hue},${saturation}%,${lightness}%)`};
function coll(a,b){return(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y);};
const k=[];
let speed=2,frict=0.9,score=0,turn=0.05,carsArr=[],
    dead=false,crashed=false,started=false,cR=true,
    s=H/1.5,b=4,bC=16,wIS=false,sS=null;
class Car{
  constructor(lane){
    this.w=rand(2,3)*16;
    this.h=16;
    if(lane==="t"){
      this.y=H/2-s/2+rand(bC,s/2-bC*2);
      this.vx=-speed*frict-0.1*rand(0.9,1.2);
      this.x=W;
    }else{
      this.y=H/2+s/2-rand(bC*2,s/2-bC);
      this.vx=speed*frict-0.1*rand(0.9,1.2);
      this.x=-this.w;
    };
  this.clr=rC();
  };
  u(){this.x+=this.vx;c.fillStyle=this.clr;c.fillRect(this.x,this.y,this.w,this.h);this.y=clamp(this.y,H/2-s/2+b,H/2+s/2-b)};
  o(){return this.x<-this.w*2||this.x>W+this.w*2;};
};
function cars(){
  if(Math.random()<0.06){
    let lane=Math.random()<0.5?"t":"b";
    carsArr.push(new Car(lane));
  };
  carsArr.forEach(car=>car.u());
  carsArr=carsArr.filter(car=>!car.o());
};
let p={
  x:0,y:0,vx:0,vy:0,w:16,h:16,a:0,
  u(){
    let dx=Math.cos(this.a),dy=Math.sin(this.a);
    if(k['a']||k['ArrowLeft'])this.a-=turn;
    else if(k['d']||k['ArrowRight'])this.a+=turn;
    this.vx+=dx*speed*0.1;
    this.vy+=dy*speed*0.1;
    this.vx*=frict;this.vy*=frict;
    this.x+=this.vx;this.y+=this.vy;
    if(this.y<=0||this.y>=H-this.h){
      dead=true; crashed=true;cR=false;
      setTimeout(()=>cR=true,1000);
    }else if(this.y<=H/2-s/2||this.y>=H/2+s/2)this.x=clamp(this.x,b,W-this.w-b);
    else this.x=clamp(this.x,b,W-this.w-b);
    c.save();c.translate(this.x+this.w/2,this.y+this.h/2);c.rotate(this.a);
    c.fillStyle='#1B1B1B';c.fillRect(-this.w/2,-this.h/2,this.w,this.h);
    c.fillRect(-this.w/2,-this.h/2+this.h/4,this.w*1.25,this.h/2);
    c.restore();
  }
};
function R(){p.x=rand(b,W-p.w-b);p.y=rand(H-p.h-b,H/2+s/2+b);p.a=-Math.PI/2;score=0;sS='b'};R();
document.addEventListener('keydown',e=>{
  k[e.key]=true;
  if(!started){
    started=true;carsArr=[];R();
  } else if(crashed&&cR){
    crashed=false;dead=false;carsArr=[];R();
  }
});
document.addEventListener('keyup',e=>k[e.key]=false);
function U(){
	c.fillStyle=('#666');c.fillRect(0,0,W,H);
  c.fillStyle=('#382');c.fillRect(0,0,W,H/2-s/2);c.fillRect(0,H-H/2+s/2,W,H/2-s/2);
  c.fillStyle=('#ff0');c.fillRect(0,H/2-2,W,4);
  cars();
  if(started&&!crashed){
    if(!dead){
      p.u();
      const iS=(p.y+p.h>H/2-s/2&&p.y<H/2+s/2);
      if(wIS&&!iS){
        if(sS==="b"&&p.y<H/2-s/2){score++;sS="t"}
        else if(sS==="t"&&p.y>H/2+s/2){score++;sS="b"}
      };
      wIS=iS;
      if(p.y<=0||p.y>=H-p.h)R();
      for(let car of carsArr){
        if(coll(p,car)){
          dead=true;crashed=true;cR=false;
          setTimeout(()=>cR=true,1000);
          break;
        }
      }
    };
    c.fillStyle='#000';c.font='30px sans-serif';c.textAlign="left";c.fillText(score,10,35);
  };
  if(!started){
    c.fillStyle='#000';c.font='30px sans-serif';c.textAlign="center";
    c.fillText("You are a cat who stole a broken truck!",W/2,H/2-50);
    c.fillText("Get across the road without crashing.",W/2,H/2-10);
    c.fillText("Press ANY key to start.",W/2,H/2+60);
  }else if(crashed){
    c.fillStyle='#000';c.font='30px sans-serif';c.textAlign="center";
    c.fillText("CRASHED!",W/2,H/2-20);
    c.fillText("Press ANY key to restart.",W/2,H/2+40);
  };
  requestAnimationFrame(U);
};U();