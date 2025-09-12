onload=()=>{

document.title="J A Z Z";
document.head.appendChild(document.createElement("style")).textContent=" *{margin:0;padding:0;position:fixed;box-sizing:border-box;touch-action:none;user-select:none;} canvas{background:indigo;} body{background:black;} ";

document.addEventListener("contextmenu",(e)=>e.preventDefault());

let canvas=document.body.appendChild(document.createElement("canvas"));
let ctx=canvas.getContext("2d");

let source=null;
let context=null;
let buffer=null;
let isPlaying=false;

loadMusic().then(a=>{
  ({source,context,buffer}=a);
  source.start();
  isPlaying=true;
});

canvas.addEventListener("pointerdown",(e)=>{
  if(e.offsetY<canvas.height*0.1){
    if(source){
      if(isPlaying){
        mute=true;
//         alert("Stopping music");
        source.stop();
        isPlaying=false;
      }else{
        mute=false;
//         alert("Starting music");
        source=context.createBufferSource();
        source.buffer=buffer;
        source.loop=true;
        source.connect(context.destination);
        source.start();
        isPlaying=true;
      }
    }
  }else{
    if(context&&context.state==="suspended"){
      context.resume();
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    const note = notes[Math.min( Math.floor(x / (GAME_W / notes.length)), notes.length - 1)];
    if(!mute)sound(note);
    if(!jumping && note==150){
      velocityY=velocityYoriginal;
      jumping=true;
    }

  }
});



let mute=false;
let notes=[144, 147, 149, 150, 151, 154, 156];
let piano=[7,0,0,0,192,2,7,0,0,0,192,2,0,0,0,20000,192,0,0,0,0,121,0,0,0,0,0,0,0];
let A=new AudioContext();
let M=pl_synth_wasm_init;
function sound(note) {
M(A, m => {
  let s = A.createBufferSource();
  s.buffer = m.sound( piano, note);
  s.connect(A.destination);
  s.start();
});
}




let rooftopY=1000;
let catX=300;
let catY;
let jumpHeight=30;
let jumpWidth=200;
let scrollSpeed=3;
let minGap=jumpWidth*0.5;
let maxGap=jumpWidth*0.9;
let t_air=jumpWidth/scrollSpeed;
let t_up=t_air/2;
let gravity=(2*jumpHeight)/(t_up*t_up);
let velocityYoriginal=-gravity*t_up;
let velocityY=0;
let jumpY=0;
let jumping=false;
let currentFrame=0;
let prevt=performance.now();
let playbackIndex=0;
let playbackSpeed=0.3;
let GAME_W=900;
let GAME_H=1600;
canvas.width=GAME_W;
canvas.height=GAME_H;
let scale=1,
offsetX=0,
offsetY=0;
let resize=()=>{
let ratio=9/16;
let vw=innerWidth,
vh=innerHeight;
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

catY=rooftopY;

let cat=generateCat();
let rooftop=generateRooftops({GAME_W,GAME_H,minGap,maxGap,rooftopY});
let buildings=generateBuildings({GAME_W,GAME_H});
let snow=generateSnow({GAME_W,GAME_H});

requestAnimationFrame(animate);

function animate(time){
let delta=(time-prevt)/16.6667;
prevt=time;
delta=Math.min(delta,3);
rooftop.update({scrollSpeed,delta});
let land=null;
for(let r of rooftop.rooftops){if(catX>=r.x&&catX<=r.x+r.width){land=r;break;}}
jumpY+=velocityY*delta;
velocityY+=gravity*delta;
if(land&&jumpY>=0&&velocityY>=0){jumpY=0;velocityY=0;jumping=false;}
if(!land&&!jumping&&velocityY>=0){jumping=true;}
catY=(land?land.y:rooftopY)+jumpY;
ctx.clearRect(0,0,canvas.width,canvas.height);
buildings.draw(ctx,{scrollSpeed,delta});
rooftop.draw(ctx);
snow.draw(ctx,{scrollSpeed,delta});
cat.draw(ctx,catX,catY,playbackIndex,currentFrame);
playbackIndex+=playbackSpeed;
requestAnimationFrame(animate);
}

};

