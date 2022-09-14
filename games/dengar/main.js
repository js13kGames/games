onresize=e=>{let zoom=Math.min(window.innerWidth/640,window.innerHeight/900);document.body.style.MozTransform="scale("+zoom+")";document.body.style.MozTransformOrigin="0 0";document.body.style.paddingTop=((window.innerHeight/document.body.style.zoom)-900)/2};onresize();document.body.style.maxWidth=640;document.body.style.margin="auto";var context=document.querySelector("canvas").getContext("2d");context.canvas.height=480;context.canvas.width=640;var iFrame=0;const TILESIZE=32;var gamestate=0;var towerSpawned=!1;var spritesheet={img:document.getElementById('spritesheet')}
class Heart
{constructor(){this.activate()}
activate(){this.active=!0}
deactivate(){this.active=!1}
draw(i)
{let sx=this.active?0:1*TILESIZE;let sy=3*TILESIZE;let x=i*(TILESIZE+8)+8;let y=8;context.drawImage(spritesheet.img,sx,sy,TILESIZE,TILESIZE,x,y,TILESIZE,TILESIZE)}}
var character={x:600,y:0,sx:0,sy:0,xVel:0,yVel:0,jumping:!0,hp:3,grace:!1,hearts:[new Heart(),new Heart(),new Heart()],update:function()
{if(controller.up&&!this.jumping)
{this.yVel-=20;this.jumping=!0}
if(!(controller.right&&controller.left))
{if(controller.left){this.xVel-=.5}
if(controller.right){this.xVel+=.5}}
this.yVel+=1;this.xVel*=0.9;this.x+=this.xVel;this.y+=this.yVel;this.checkBoundaries();this.draw()},checkBoundaries:function()
{if(this.y+TILESIZE>floor.y)
{this.jumping=!1;this.y=floor.y-TILESIZE;this.yVel=0}
if(gamestate!=3)
{if(this.x<0){this.x=1}
if(this.x+TILESIZE>context.canvas.width){this.x=context.canvas.width-TILESIZE}}},draw:function()
{this.sx=0;this.sy=0;if(controller.left){this.sy=32}
if(controller.right){this.sy=64}
if(controller.up){this.sx=32}
context.drawImage(spritesheet.img,this.sx,this.sy,TILESIZE,TILESIZE,this.x,this.y,TILESIZE,TILESIZE);for(let i=0;i<this.hearts.length;i++)
{this.hearts[i].draw(i)}},decreaseHealth:function()
{if(!this.grace&&gamestate!=3)
{this.hp--;this.hearts[this.hp].deactivate();this.yVel-=10;console.log("HIT! New HP: "+this.hp);this.gracePeriod()}},gracePeriod:function()
{this.grace=!0;setTimeout(function(){character.grace=!1},1000)},};class bgTile
{constructor(sx,sy,width=32,height=32)
{this.sx=sx;this.sy=sy;this.width=width;this.height=height}}
class Scrollable
{constructor(height=1,y=0,speed=1,sy=0)
{this.height=height;this.y=y;this.speed=speed;this.sy=sy;this.strips=[];this.offset=0;for(let i=0;i<=context.canvas.width/TILESIZE;i++)
{this.makeNewStrip()}}
makeNewStrip()
{let newStrip=[];for(let i=0;i<this.height;i++)
{let sx=65+Math.floor(Math.random()*32);let sy=this.sy;let newTile=new bgTile(sx,sy);newStrip.push(newTile)}
this.strips.push(newStrip);if(this.strips.length-1>context.canvas.width/TILESIZE)
{this.strips.shift()}
if(this.offset>=32)
{this.offset=0}}
update()
{this.offset+=this.speed*(16/60);if(this.offset>=32)
{this.makeNewStrip()}
this.draw()}
draw()
{for(let i=this.strips.length-1;i>=0;i--)
{for(let j=0;j<this.strips[i].length;j++)
{let sx=this.strips[i][j].sx;let sy=this.strips[i][j].sy;let dx=(context.canvas.width-(i+1)*TILESIZE)+Math.floor(this.offset);let dy=j*TILESIZE+this.y;context.drawImage(spritesheet.img,sx,sy,TILESIZE,TILESIZE,dx,dy,TILESIZE,TILESIZE)}}}}
class Floor extends Scrollable
{constructor()
{super(4,context.canvas.height-4*TILESIZE,10,64)}
makeNewStrip()
{if(distance<250)
{let fence=new Fence();if(!towerSpawned)
{let tower=new Tower();towerSpawned=!0}}
if(this.offset>=32)
{let cactuschance=(distance*-0.00004)+0.5;if(Math.random()<=cactuschance&&distance>250)
{let cactus=new Cactus()}}
super.makeNewStrip()}}
var sky=new Scrollable(11,0,1);var hills=new Scrollable(1,10*TILESIZE,1,32);var floor=new Floor();var controller={left:!1,right:!1,up:!1,keyListener:function(event)
{var key_state=(event.type=="keydown")?true:!1;switch(event.keyCode)
{case 32:controller.up=key_state;break;case 37:case 65:controller.left=key_state;break;case 39:case 68:controller.right=key_state;break;default:console.log("Key #"+event.keyCode+" pressed");break}},update:function()
{let filepath='gamepad';if(this.up){filepath+='U'}
if(!(this.left&&this.right))
{if(this.left){filepath+='L'}
if(this.right){filepath+='R'}}
document.getElementById('gamepad').src=filepath+'.png'}};cancelEvent=function(e){e.preventDefault();e.stopPropagation();e.cancelBubble=!0;e.returnValue=!1};firefoxHandler=function(e){let y1=350;let y2=500;let lx1=20;let lx2=80;let rx1=120;let rx2=180;let jx1=300;let jx2=440;controller.up=!1;controller.left=!1;controller.right=!1;for(let i=0;i<=e.touches.length;i++)
{let touchX=e.touches[i].pageX;let touchY=e.touches[i].pageY;if(touchY>=y1&&touchY<=y2)
{if(touchX>=jx1&&touchX<=jx2){controller.up=!0}
else if(touchX>=lx1&&touchX<=lx2){controller.left=!0}
else if(touchX>=rx1&&touchX<=rx2){controller.right=!0}}}
cancelEvent(e)}
gamepad.ontouchstart=gamepad.ontouchend=gamepad.ontouchmove=gamepad.ontouchcancel=cancelEvent;if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
{d='touchstart';u='touchend'}
else{d='mousedown';u='mouseup'};touchL.addEventListener(d,e=>{cancelEvent(e);controller.left=!0},!1);touchL.addEventListener(u,e=>{cancelEvent(e);controller.left=!1},!1);touchR.addEventListener(d,e=>{cancelEvent(e);controller.right=!0},!1);touchR.addEventListener(u,e=>{cancelEvent(e);controller.right=!1},!1);touchJ.addEventListener(d,e=>{cancelEvent(e);controller.up=!0},!1);touchJ.addEventListener(u,e=>{cancelEvent(e);controller.up=!1},!1);gamepad.addEventListener(d,e=>{firefoxHandler(e)},!1);gamepad.addEventListener(u,e=>{firefoxHandler(e)},!1);var ObjectManager={gameObjects:[],cactibuffer:0,cacticount:0,cactiCheck:function()
{if(this.cacticount>=3)
{this.cactibuffer=3;this.cacticount=0}},update:function()
{this.purgeInactive();this.checkAllCollisions();this.drawAll()},purgeInactive:function()
{for(let i=0;i<this.gameObjects.length;i++)
{if(!this.gameObjects[i].active)
{delete this.gameObjects[i];this.gameObjects.splice(i,1)}}},checkAllCollisions:function()
{for(let i=0;i<this.gameObjects.length;i++)
{this.gameObjects[i].checkCollisions()}},drawAll:function()
{for(let i=0;i<this.gameObjects.length;i++)
{this.gameObjects[i].draw()}}}
class GameObject
{constructor(x=0,y=0,width=TILESIZE,height=TILESIZE,sx=0,sy=0)
{this.x=x;this.y=y;this.width=width;this.height=height;this.sx=sx;this.sy=sy;this.active=!0;ObjectManager.gameObjects.push(this)}
draw()
{if(gamestate!=3){this.x+=floor.speed*(16/60)}
context.drawImage(spritesheet.img,this.sx,this.sy,this.width,this.height,this.x,this.y,this.width,this.height);this.active=this.x<context.canvas.width}
checkCollisions()
{if(character.x<this.x+this.width&&character.x+TILESIZE>this.x&&character.y<this.y+this.height&&character.y+TILESIZE>this.y)
{this.processCollisions()}
return!1}
processCollisions()
{}}
class Cactus extends GameObject
{constructor()
{let row=0;ObjectManager.cactiCheck();if(ObjectManager.cactibuffer>0)
{row=Math.floor(Math.random()*4);ObjectManager.cactibuffer--;console.log(ObjectManager.cactibuffer)}
else{row=Math.floor(Math.random()*10)-1;if(row>4){row=-1}
if(row===-1){ObjectManager.cacticount++}
else{ObjectManager.cacticount--}}
let x=-TILESIZE;let y=floor.y+(row*TILESIZE);let sx=(2*TILESIZE)+(TILESIZE*Math.floor(Math.random()*2));let sy=3*TILESIZE;super(x,y,TILESIZE,TILESIZE,sx,sy)}
processCollisions()
{if(this.active)
{character.decreaseHealth();this.active=!1}}}
class Fence extends GameObject
{constructor()
{let x=-TILESIZE;let y=floor.y-TILESIZE;let sx=4*TILESIZE;let sy=2*TILESIZE;super(x,y,TILESIZE,TILESIZE,sx,sy)}}
class Tower extends GameObject
{constructor()
{let x=-TILESIZE/2;let y=floor.y-(2*TILESIZE);let sx=4*TILESIZE;let sy=0*TILESIZE;super(x,y,TILESIZE,2*TILESIZE,sx,sy)}}
var prevFrameTime=0;var fps=0;function drawFPS(iFrame)
{if(iFrame%10===0)
{fps=Math.floor(1000/(performance.now()-prevFrameTime))}
prevFrameTime=performance.now();context.font="normal bold 1em courier new";context.fillStyle="yellow";context.textAlign="right";context.fillText(fps,context.canvas.width,10)}
var distance=5000;function drawDistance()
{distance--;context.font="normal bold 1.5em courier new";context.fillStyle="yellow";context.textAlign="right";context.fillText(" "+distance+"m",context.canvas.width,16)}
var game={update:function()
{switch(gamestate)
{case 0:context.fillStyle="#3F3F3F";context.fillRect(0,0,context.canvas.width,context.canvas.height);sky.draw();hills.draw();floor.draw();character.update();context.fillStyle="yellow";context.textAlign="center";context.font="normal bold 5em courier new";let x=context.canvas.width/2;let y=(context.canvas.height/2)-64;context.fillText("DENGAR",x,y);context.font="normal bold 1.25em courier new";y+=32;context.fillText("Anime fans across the world have succesfully",x,y);y+=32;context.fillText("raided AREA 51, but poor Dengar here",x,y);y+=32;context.fillText("quite enjoyed his containment facility",x,y);y+=32;context.fillText("Jump to get started!",x,y);if(controller.up){gamestate=1}
break;case 1:context.fillStyle="#3F3F3F";context.fillRect(0,0,context.canvas.width,context.canvas.height);sky.update();hills.update();floor.update();character.update();ObjectManager.update();controller.update();drawDistance();if(iFrame<60){iFrame++}else{iFrame=0}
if(character.hp<=0)
{character.draw();context.fillStyle="yellow";context.textAlign="center";context.font="normal bold 5em courier new";let x=context.canvas.width/2;let y=(context.canvas.height/2)-32;context.fillText("GAME OVER",x,y);y+=32;context.font="normal bold 1.5em courier new";context.fillText("Jump to try again!",x,y);gamestate=2}
else if(distance<100)
{gamestate=3}
break;case 2:if(controller.up){window.location.reload(!1)}
break;case 3:controller.left=!0;controller.right=!1;controller.up=!1
sky.draw();hills.draw();floor.draw();character.update();ObjectManager.update();if(distance>=0)
{drawDistance()}
else{context.fillStyle="yellow";context.textAlign="center";context.font="normal bold 5em courier new";let x=context.canvas.width/2;let y=(context.canvas.height/2)-32;context.fillText("VICTORY",x,y);context.font="normal bold 1.25em courier new";y+=32;context.fillText("Dengar has been reunited with his...people(?)",x,y);y+=32;context.fillText("Jump to try again!",x,y);gamestate=2}
break;default:console.log("INVALID GAMESTATE: "+gamestate);break}
window.requestAnimationFrame(game.update)}}
window.addEventListener("keydown",controller.keyListener);window.addEventListener("keyup",controller.keyListener);window.requestAnimationFrame(game.update)