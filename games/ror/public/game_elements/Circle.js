import ObjectC from"./ObjectC.js";export default class Circle extends ObjectC{color;x;y;gameBackground;rect;speedX=0;speedY=0;b=0;i=100;flag=0;constructor(x,y,gameBackground,rect){super();this.x=x;this.y=y;this.gameBackground=gameBackground;this.rect=rect;}
animation(){var horizontal;var vertical;if(this.speedY==0&&this.speedX==0){horizontal=0;vertical=0;}else if(this.speedY<0&&this.speedX==0){horizontal=0;vertical=-19;}else if(this.speedY>0&&this.speedX==0){horizontal=0;vertical=19;}else if(this.speedY==0&&this.speedX>0){horizontal=19;vertical=0;}else if(this.speedY==0&&this.speedX<0){horizontal=-19;vertical=0;}
var ctx=Circle.myGameArea;var gradient=ctx.createRadialGradient(horizontal,vertical,0,0,0,19);gradient.addColorStop(0,'white');gradient.addColorStop(0.1,'rgb('+this.i+', '+this.i+', '+this.i+')');gradient.addColorStop(1,'rgb(100, 100, 100)');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(0,0,19,0,Math.PI*2);ctx.fill();if(this.flag===0){this.i=this.i+4;}else{this.i=this.i-4;}
if(this.i===252){this.flag=1;}
if(this.i===100){this.flag=0;}}
update(){var ctx=Circle.myGameArea;ctx.translate(this.x,this.y);ctx.fillStyle='white';this.animation();ctx.translate(-this.x,-this.y);}
newPos(){if(this.b==1){this.speedX=-2;}else if(this.b==2){this.speedY=-2;}else if(this.b==3){this.speedX=2;}else if(this.b==4){this.speedY=2;}
this._collisionControl();}
_collisionControl(){if(this.x==this.gameBackground.x+20&&this.speedX<=0){this.speedX=0;}
if(this.x==this.gameBackground.x+this.gameBackground.width-20&&this.speedX>=0){this.speedX=0;}
if(this.y==this.gameBackground.y+20&&this.speedY<=0){this.speedY=0;}
if(this.y==this.gameBackground.y+this.gameBackground.height-20&&this.speedY>=0){this.speedY=0;}
for(let k=0;k<this.rect.length;k++){if(this.x==this.rect[k].x-20&&(this.y>this.rect[k].y-20&&this.y<this.rect[k].y+this.rect[k].height+20)&&this.speedX>=0){this.speedX=0;}
if(this.x==this.rect[k].x+this.rect[k].width+20&&(this.y>this.rect[k].y-20&&this.y<this.rect[k].y+this.rect[k].height+20)&&this.speedX<=0){this.speedX=0;}
if(this.y==this.rect[k].y-20&&(this.x>this.rect[k].x-20&&this.x<this.rect[k].x+this.rect[k].width+20)&&this.speedY>=0){this.speedY=0;}
if(this.y==this.rect[k].y+this.rect[k].height+20&&(this.x>this.rect[k].x-20&&this.x<this.rect[k].x+this.rect[k].width+20)&&this.speedY<=0){this.speedY=0;}}
if(0<this.speedY&&this.speedXm1!==0){this.speedX=0;this.speedY=2;}
if(0>this.speedY&&this.speedXm1!==0){this.speedX=0;this.speedY=-2;}
if(this.speedX!==0&&this.speedY!==0){this.speedY=0;}
this.speedXm1=this.speedX;this.x+=this.speedX;this.y+=this.speedY;}}