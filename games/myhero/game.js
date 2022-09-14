zzfxV=.3
zzfx=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);q=zzfxX.createBuffer(1,h,zzfxR);q.getChannelData(0).set(Z);c=zzfxX.createBufferSource();c.buffer=q;c.connect(zzfxX.destination);c.start();return c};zzfxX=new(window.AudioContext||webkitAudioContext);zzfxR=44100
var classTile=class{constructor(g,px,py){this.g=g;this.pos={x:px,y:py};this.name='tile';}
getBBox(){return{x:this.pos.x,y:this.pos.y,width:this.g.rockWidth,height:this.g.rockHeight}}
draw(){let y='#FFFF00';this.g.cx.fillStyle=y;this.g.cx.fillRect(this.pos.x,this.pos.y,this.g.rockWidth,this.g.rockHeight)}};var classLaser=class{constructor(h){this.h=h;this.name='laser';this.asset=[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0];this.length=10;}
getBBox(){let xPos=0;if(this.h.dir=='r')xPos=this.h.pos.x+(this.h.asset[0][0].length*this.h.g.tileWidth);else xPos=this.h.pos.x-this.h.g.tileWidth*(this.length);return{x:xPos,y:this.h.pos.y+(3*this.h.g.tileWidth),width:this.length*this.h.g.tileWidth,height:this.h.g.tileHeight}}
hit(){var find=false;var rect1=this.getBBox();this.h.g.cx.beginPath();this.h.g.cx.lineWidth="1"
this.h.g.cx.strokeStyle="blue";this.h.g.cx.rect(rect1.x,rect1.y,rect1.width,rect1.height);this.h.g.cx.stroke();for(let t=0,g_l=this.h.g.g[this.h.rock.position].length;t<g_l;t++){if(this.h.g.g[this.h.rock.position][t].getBBox&&!this.h.g.g[this.h.rock.position][t].hide&&'snakebat'.indexOf(this.h.g.g[this.h.rock.position][t].name)!=-1){var rect2=this.h.g.g[this.h.rock.position][t].getBBox();if(rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y){zzfx(...[,,321,,.09,.17,1,1.13,,,,,,1.9,,.4,.13,.53,.05]);find=true;this.h.g.g[this.h.rock.position][t].hide=true;this.h.g.increaseScore(50);return;}}
if(t==g_l-1)return find;}}
fire(){let r='#ff0000';this.h.g.cx.fillStyle=r;let dimy=this.asset.length;let yPos=this.h.pos.y;this.h.g.cx.fillStyle=r;if(this.h.dir=='r'){let xPos=this.h.pos.x+(this.h.asset[0][0].length*this.h.g.tileWidth);for(let tx=0;tx<this.length;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.h.g.cx.fillRect(xPos,yPos,this.h.g.tileWidth,this.h.g.tileHeight)
yPos+=this.h.g.tileHeight;}
xPos+=this.h.g.tileWidth;yPos=this.h.pos.y;}}else{let xPos=this.h.pos.x-this.h.g.tileWidth;for(let tx=0;tx<this.length;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.h.g.cx.fillRect(xPos,yPos,this.h.g.tileWidth,this.h.g.tileHeight)
yPos+=this.h.g.tileHeight;}
xPos-=this.h.g.tileWidth;yPos=this.h.pos.y;}}
zzfx(...[,,600,.01,,.47,,.45,,,,,.05,,,,.16,,.08,.46]);this.hit();}};var classHero=class{constructor(g,xp,yp,rock){this.g=g;this.asset=[[[1,1,1,1,1,1,1,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,1,1,0],[0,0,0,1,1,1,0,0],[0,0,0,1,1,1,1,0],[0,0,0,1,0,1,0,0],[0,0,0,1,1,1,1,0],[0,0,0,1,0,1,1,0],[0,0,0,1,0,0,1,0],[0,0,0,1,1,1,1,0],[0,0,0,0,1,1,1,0],[0,0,0,0,0,1,1,0],[0,0,0,0,1,1,1,0],[0,0,0,1,1,1,0,0],[0,0,0,1,1,0,0,0]],[[0,1,1,1,1,1,0,0],[0,0,0,1,0,0,0,0],[0,0,0,1,0,1,1,0],[0,0,0,1,1,1,0,0],[0,0,0,1,1,1,1,0],[0,0,0,1,0,1,0,0],[0,0,0,1,1,1,1,0],[0,0,0,1,0,1,1,0],[0,0,0,1,0,0,1,0],[0,0,0,1,1,1,1,0],[0,0,0,0,1,1,1,0],[0,0,0,0,0,1,1,0],[0,0,0,0,1,1,1,0],[0,0,0,1,1,1,0,0],[0,0,0,1,1,0,0,0]]];this.pos={x:xp,y:yp};this.frame=0;this.nFrames=this.asset.length;this.dir='r';this.velocity=this.g.tileWidth;this.name='hero';this.laser=new classLaser(this);this.rock=rock;}
left(){this.dir='l';if(!this.hit(this.pos.x-this.velocity,this.pos.y))this.pos.x-=this.velocity;}
up(){this.dirV='u';if(!this.hit(this.pos.x,this.pos.y-this.velocity))this.pos.y-=this.velocity;}
right(){this.dir='r';if(!this.hit(this.pos.x+this.velocity,this.pos.y))this.pos.x+=this.velocity;}
down(){this.dirV='d';if(!this.hit(this.pos.x,this.pos.y+this.velocity))this.pos.y+=this.velocity;else if(!this.g.idle)this.g.addBomb(this,this.pos.x,this.pos.y)}
fire(){this.laser.fire();}
getBBox(){return{x:this.pos.x,y:this.pos.y,width:((this.asset[this.frame][0].length)*this.g.tileWidth),height:((this.asset[this.frame].length)*this.g.tileHeight)}}
hit(posx,posy){var me=this;var find=false;var rect1=me.getBBox();rect1.x=posx;rect1.y=posy;for(let t=0,g_l=me.g.g[me.rock.position].length;t<g_l;t++){if(me.g.g[me.rock.position][t].getBBox&&!me.g.g[me.rock.position][t].hide&&'herobombtext'.indexOf(me.g.g[me.rock.position][t].name)==-1){var rect2=me.g.g[me.rock.position][t].getBBox();if(rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y){find=true;if('snakebat'.indexOf(me.g.g[me.rock.position][t].name)!=-1&&!this.hide){this.hide=true;me.g.g[me.rock.position][t].hide=true;this.die();}}}
if(t==g_l-1)return find;}}
die(){let rect1=this.getBBox();this.g.die();zzfx(...[,,558,.04,,.08,3,.1,,-24,-824,.06,,,,,.33,,.04]);this.g.addText(rect1.x,rect1.y+rect1.height/2-40,"D I E!")}
draw(){(this.frame+1)>(this.nFrames-1)?this.frame=0:this.frame++;let w='#FFFFFF';if(!this.g.idle){if(!this.dirV){switch(this.dir){case'l':this.left.call(this);break;case'r':this.right.call(this);break;}}else{switch(this.dirV){case'u':this.up.call(this);break;case'd':this.down.call(this);break;}}}else{if(this.fireLaser)this.fire()
this.down.call(this);}
let refresh=false;if(this.pos.y>this.g.c.height){this.rock.position+=(this.g.rockObj.numRoomsX);this.pos.y-=this.g.c.height;refresh=true;}else if(this.pos.y<0){this.rock.position-=(this.g.rockObj.numRoomsX);this.pos.y+=this.g.c.height;refresh=true;}
if(this.pos.x>this.g.c.width){this.rock.position+=1;this.pos.x-=this.g.c.width;refresh=true;}else if(this.pos.x<0){this.rock.position-=1;this.pos.x+=this.g.c.width;refresh=true;}
if(refresh){this.rock.drawEnv=true;return;}
let dimx=this.asset[this.frame].length;let dimy=this.asset[this.frame][0].length;let yPos=this.pos.y;this.g.cx.fillStyle=w;if(this.dir=='r'){let xPos=this.pos.x;for(let tx=0;tx<dimx;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[this.frame][tx][ty]==1)this.g.cx.fillRect(xPos,yPos,this.g.tileWidth,this.g.tileHeight)
xPos+=this.g.tileWidth;}
yPos+=this.g.tileHeight;xPos=this.pos.x;}}else{let xPos=this.pos.x;for(let tx=0;tx<dimx;tx++){for(let ty=dimy-1;ty>=0;ty--){if(this.asset[this.frame][tx][ty]==1)this.g.cx.fillRect(xPos,yPos,this.g.tileWidth,this.g.tileHeight)
xPos+=this.g.tileWidth;}
yPos+=this.g.tileHeight;xPos=this.pos.x;}}}};var classWall=class{constructor(g,px,py){this.g=g;this.pos={x:px,y:py};this.name='wall';this.wallWidth=this.g.rockWidth/2;}
getBBox(){return{x:this.pos.x+this.g.rockWidth/2-this.wallWidth/2,y:this.pos.y,width:this.wallWidth,height:this.g.rockHeight}}
draw(){let g='#777777';this.g.cx.fillStyle=g;let offsetx=this.pos.x+this.g.rockWidth/2-this.wallWidth/2;this.g.cx.fillRect(offsetx,this.pos.y,this.wallWidth,this.g.rockHeight)}};var classTrap1=class{constructor(g,posx,posy,dir){this.g=g;this.name='snake';this.asset=[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0];this.minLength=5;this.length=this.minLength;this.maxLength=20;this.posx=posx;this.posy=posy;this.dir=dir;this.scale='plus';}
getBBox(){let py=this.posy+(4*this.g.tileWidth)
if(this.dir=='r')return{x:this.posx,y:py,width:this.length*this.g.tileWidth,height:this.g.tileHeight}
else return{x:this.posx+this.g.rockWidth-(this.length*this.g.tileWidth),y:py,width:this.length*this.g.tileWidth,height:this.g.tileHeight}}
draw(){let g='#0000ff';this.g.cx.fillStyle=g;let dimy=this.asset.length;let yPos=this.posy;let rect1=this.getBBox();this.g.cx.beginPath();this.g.cx.lineWidth="1"
this.g.cx.strokeStyle="yellow";this.g.cx.rect(rect1.x,rect1.y,rect1.width,rect1.height);this.g.cx.stroke();this.g.cx.fillStyle=g;if(this.dir=='r'){let xPos=this.posx;for(let tx=0;tx<this.length;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.g.cx.fillRect(xPos,yPos,this.g.tileWidth,this.g.tileHeight)
yPos+=this.g.tileHeight;}
xPos+=this.g.tileWidth;yPos=this.posy;}}else{let xPos=this.posx+this.g.rockWidth-this.g.tileWidth;for(let tx=0;tx<this.length;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.g.cx.fillRect(xPos,yPos,this.g.tileWidth,this.g.tileHeight)
yPos+=this.g.tileHeight;}
xPos-=this.g.tileWidth;yPos=this.posy;}}
if(this.scale=='plus')
if(this.length<this.maxLength)this.length++;else this.scale='minus'
else
if(this.length>this.minLength)this.length--;else this.scale='plus'}};var classBat=class{constructor(h,x,y){this.h=h;this.name='bat';this.asset=[[1,0,0,0,1,0,1,0,1,0,0,0,1,0,0],[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],[0,0,1,0,0,0,1,0,1,0,1,0,0,0,1]];this.fly=0;this.spriteWidth=5;this.spriteHeight=this.asset[this.fly].length/this.spriteWidth;this.xPos=x;this.yPos=y;this.cirPoints=[];this.frame=0;this.nFrames=30;this.radius=20;this.circleRange=360;this.circumferencePoints();}
circumferencePoints(){var centerX=this.xPos;var centerY=this.yPos;var radius=this.radius;var points=[];let v;for(var degree=0;degree<this.circleRange;){var radians=degree*Math.PI/180;var x=centerX+radius*Math.cos(radians);var y=centerY+radius*Math.sin(radians);points.push({xp:x,yp:y});degree+=this.circleRange/this.nFrames;}
this.cirPoints=points;}
getBBox(){return{x:this.xPos,y:this.yPos,width:this.spriteWidth*this.h.tileWidth,height:this.spriteHeight*this.h.tileWidth}}
hit(){var find=false;var rect1=this.getBBox();for(let t=0,g_l=this.h.g[this.h.rockObj.position].length;t<g_l;t++){if(this.h.g[this.h.rockObj.position][t].getBBox&&!this.h.g[this.h.rockObj.position][t].hide&&this.h.g[this.h.rockObj.position][t].name.indexOf('snake')!=-1){var rect2=this.h.g[this.h.rockObj.position][t].getBBox();if(rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y){zzfx(...[,,321,,.09,.17,1,1.13,,,,,,1.9,,.4,.13,.53,.05]);find=true;this.h.g[this.h.rock.position][t].hide=true;this.h.g.increaseScore(50);}}
if(t==g_l-1)return find;}}
draw(){let v='#ff00ff';this.h.cx.fillStyle=v;let dimy=this.asset[this.fly].length;this.yPos=this.cirPoints[this.frame].yp;this.xPos=this.cirPoints[this.frame].xp;let rect1=this.getBBox();for(let ty=0;ty<dimy;ty++){if(this.asset[this.fly][ty]==1)this.h.cx.fillRect(this.xPos,this.yPos,this.h.tileWidth,this.h.tileHeight)
if((ty+1)%this.spriteWidth==0){this.yPos+=this.h.tileHeight;this.xPos=this.cirPoints[this.frame].xp;}else{this.xPos+=this.h.tileWidth;}}
this.hit();this.frame=(this.frame+1)>=this.nFrames?0:this.frame+1;this.fly=(this.fly+1)>=this.asset.length?0:this.fly+1;}}
var classPage=class{constructor(h,x,y){this.h=h;this.name='page';this.asset=[1,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1];this.fly=0;this.spriteWidth=6;this.spriteHeight=this.asset.length/this.spriteWidth;this.xPos=x;this.yPos=y;this.cirPoints=[];this.frame=0;this.nFrames=30;this.radius=20;this.circleRange=360;this.circumferencePoints();}
circumferencePoints(){var centerX=this.xPos;var centerY=this.yPos;var radius=this.radius;var points=[];let v;for(var degree=0;degree<this.circleRange;){var radians=degree*Math.PI/180;var x=centerX+radius*Math.cos(radians);var y=centerY+radius*Math.sin(radians);points.push({xp:x,yp:y});degree+=this.circleRange/this.nFrames;}
this.cirPoints=points;}
getBBox(){return{x:this.xPos,y:this.yPos,width:this.spriteWidth*this.h.tileWidth,height:this.spriteHeight*this.h.tileWidth}}
hit(){var find=false;var rect1=this.getBBox();for(let t=0,g_l=this.h.sg.length;t<g_l;t++){if(this.h.sg[t].getBBox&&!this.h.sg[t].hide&&this.h.sg[t].name.indexOf('hero')!=-1){var rect2=this.h.sg[t].getBBox();if(rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y){find=true;this.hide=true;zzfx(...[,,420,.03,,.06,1,.01,,78,,,,,,,.21,,.03]);this.h.heroObj.g.findPage();return;}}
if(t==g_l-1)return find;}}
draw(){let v='#ff7777';let b='#000000';this.h.cx.fillStyle=v;let dimy=this.asset.length;this.yPos=this.cirPoints[this.frame].yp;this.xPos=this.cirPoints[this.frame].xp;let rect1=this.getBBox();for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.h.cx.fillRect(this.xPos,this.yPos,this.h.tileWidth,this.h.tileHeight)
if((ty+1)%this.spriteWidth==0){this.yPos+=this.h.tileHeight;this.xPos=this.cirPoints[this.frame].xp;}else{this.xPos+=this.h.tileWidth;}}
this.hit();this.frame=(this.frame+1)>=this.nFrames?0:this.frame+1;if(this.frame==0)
this.h.cx.fillStyle=b;else
this.h.cx.fillStyle=v;this.fly=(this.fly+1)>=this.asset.length?0:this.fly+1;}}
var Cell=class{constructor(i,j,w,m){this.i=i;this.j=j;this.w=w;this.m=m;this.walls=[true,true,true,true];this.visited=false;this.ground=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];this.trap=false;}
checkNeighbors(){let neighbors=[];let top=this.m.grid[this.m.index(this.i,this.j-1)];let right=this.m.grid[this.m.index(this.i+1,this.j)];let bottom=this.m.grid[this.m.index(this.i,this.j+1)];let left=this.m.grid[this.m.index(this.i-1,this.j)];if(top&&!top.visited){neighbors.push(top);}
if(right&&!right.visited){neighbors.push(right);}
if(bottom&&!bottom.visited){neighbors.push(bottom);}
if(left&&!left.visited){neighbors.push(left);}
if(neighbors.length>0){let r=Math.floor(Math.random()*neighbors.length);return neighbors[r];}else{return undefined;}}
highlight(){}
show(){let up=false,right=false,down=false,left=false;this.ground=[1,0,1,0,0,0,1,0,1];this.ground=[1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1];if(this.walls[0]){this.ground[1]=1;this.ground[2]=1;this.ground[3]=1;up=true;}
if(this.walls[1]){this.ground[9]=1;this.ground[14]=1;this.ground[19]=1;right=true;}
if(this.walls[2]){this.ground[21]=1;this.ground[22]=1;this.ground[23]=1;down=true;}
if(this.walls[3]){this.ground[5]=1;this.ground[10]=1;this.ground[15]=1;left=true;}
if(this.visited){}
if(this.i||this.j){if((up&&down)&&(!left&&!right)){this.ground[7]=3;this.ground[12]=3;this.ground[17]=3;}
if(((up||down)&&(left&&!right))||((up||down)&&(!left&&right))){this.ground[17]=6;}
if((!down)&&(!left&&right)){this.ground[21]=8;}
if((!down)&&(left&&!right)){this.ground[23]=7;}
if((!up&&!down)&&(left&&right)){if(this.trap)
this.ground[13]=4
else
this.ground[11]=5;this.trap=!this.trap;}
if((up||down)&&(left&&right)){this.ground[12]=9;}}};}
var Maze=class{constructor(x,y,w){this.cols=x;this.rows=y;this.w=w;this.current={};this.grid=[];this.stack=[];for(let j=0;j<this.rows;j++){for(let i=0;i<this.cols;i++){var cell=new Cell(i,j,this.w,this);this.grid.push(cell);}}
this.current=this.grid[0];return this.draw();}
draw(){for(let i=0;i<this.grid.length;i++){this.grid[i].show();}
this.current.visited=true;this.current.highlight();let next=this.current.checkNeighbors();if(next){next.visited=true;this.stack.push(this.current);this.removeWalls(this.current,next);this.current=next;this.draw()}else if(this.stack.length>0){this.current=this.stack.pop();this.draw()}else{return this.grid.map(({ground})=>ground)}}
index(i,j){if(i<0||j<0||i>this.cols-1||j>this.rows-1){return-1;}
return i+j*this.cols;}
removeWalls(a,b){let x=a.i-b.i;if(x===1){a.walls[3]=false;b.walls[1]=false;}else if(x===-1){a.walls[1]=false;b.walls[3]=false;}
let y=a.j-b.j;if(y===1){a.walls[0]=false;b.walls[2]=false;}else if(y===-1){a.walls[2]=false;b.walls[0]=false;}}}
var classSnake=class{constructor(g,posx,posy,dir){this.g=g;this.name='snake';this.asset=[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0];this.length=3;this.posx=posx;this.posy=posy;this.dir=dir;}
getBBox(){let py=this.posy+(4*this.g.tileWidth)
if(this.dir=='r')return{x:this.posx,y:py,width:this.length*this.g.tileWidth,height:this.g.tileHeight}
else return{x:this.posx+this.g.rockWidth-(3*this.g.tileWidth),y:py,width:this.length*this.g.tileWidth,height:this.g.tileHeight}}
draw(){let g='#00ff00';this.g.cx.fillStyle=g;let dimy=this.asset.length;let yPos=this.posy;this.g.cx.fillStyle=g;if(this.dir=='r'){let xPos=this.posx;for(let tx=0;tx<this.length;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.g.cx.fillRect(xPos,yPos,this.g.tileWidth,this.g.tileHeight)
yPos+=this.g.tileHeight;}
xPos+=this.g.tileWidth;yPos=this.posy;}}else{let xPos=this.posx+this.g.rockWidth-this.g.tileWidth;for(let tx=0;tx<this.length;tx++){for(let ty=0;ty<dimy;ty++){if(this.asset[ty]==1)this.g.cx.fillRect(xPos,yPos,this.g.tileWidth,this.g.tileHeight)
yPos+=this.g.tileHeight;}
xPos-=this.g.tileWidth;yPos=this.posy;}}}};var classRock=class{constructor(g){this.g=g;this.numRoomsX=20;this.numRoomsY=20;let m=new Maze(this.numRoomsX,this.numRoomsY,30);this.screen=m.draw();this.g.maxNumPages=this.screen.filter(x=>x.includes(9)).length;this.pos={x:0,y:0};this.drawEnv=true;this.position=0;this.screenSize=5;}
drawMap(){let x=0,y=0;let roomX=0,roomY=0;let roomSizeX=Math.floor(this.g.c.width/this.numRoomsX);let roomSizeY=Math.floor(this.g.c.height/this.numRoomsY);let rockSizeX=Math.floor(roomSizeX/this.screenSize);let rockSizeY=Math.floor(roomSizeY/this.screenSize);for(let s=0,s_l=this.screen.length;s<s_l;s++){this.g.cx.fillStyle='#333333';let dimx=this.screen[s].length;this.g.cx.fillRect(roomX,roomY,roomSizeX,roomSizeY)
this.g.cx.fillStyle='#FFFF00';for(let tx=0;tx<dimx;tx++){if(this.screen[s][tx]==1){this.g.cx.fillStyle='#FFFF00';this.g.cx.fillRect(x,y,rockSizeX,rockSizeY)}else if(this.screen[s][tx]==3){this.g.cx.fillStyle='#777777';this.g.cx.fillRect(x,y,rockSizeX,rockSizeY)}else if(this.screen[s][tx]==4||this.screen[s][tx]==5){this.g.cx.fillStyle='#0000ff';this.g.cx.fillRect(x,y,rockSizeX,rockSizeY)}
else if(this.screen[s][tx]==6){this.g.cx.fillStyle='#00ffff';this.g.cx.fillRect(x,y,rockSizeX,rockSizeY)}
else if(this.screen[s][tx]==7||this.screen[s][tx]==8){this.g.cx.fillStyle='#00ff00';this.g.cx.fillRect(x,y,rockSizeX,rockSizeY)}
else if(this.screen[s][tx]==9){this.g.cx.fillStyle='#ff7777';this.g.cx.fillRect(x,y,rockSizeX,rockSizeY)}
if((tx+1)%this.screenSize==0){y+=rockSizeY;x=roomX;}else{x+=rockSizeX;}}
if(s==this.position){this.g.cx.fillStyle='#ffffff';this.g.cx.beginPath();this.g.cx.arc(roomX+roomSizeX/2,roomY+roomSizeY/2,roomSizeX/2,0,2*Math.PI);this.g.cx.fill();}
if((s+1)%this.numRoomsX==0){roomY+=roomSizeY;y=roomY;x=0;roomX=0;}else{roomX+=roomSizeX
x=roomX;y=roomY;}}}
draw(){if(this.drawEnv){let b='#000000';let y='#FFFF00';let dimx=this.screen[this.position].length;let dimy=this.screen[this.position][0].length;let yPos=this.pos.y;let xPos=this.pos.x;if(!this.g.g[this.position]){this.g.g[this.position]=[];for(let tx=0;tx<dimx;tx++){switch(this.screen[this.position][tx]){case 1:this.g.g[this.position].push(new classTile(this.g,xPos,yPos))
break
case 2:break
case 3:this.g.g[this.position].push(new classWall(this.g,xPos,yPos))
break
case 4:this.g.g[this.position].push(new classTrap1(this.g,xPos,yPos,'l'))
break
case 5:this.g.g[this.position].push(new classTrap1(this.g,xPos,yPos,'r'))
break
case 6:this.g.g[this.position].push(new classBat(this.g,xPos,yPos))
break
case 7:this.g.g[this.position].push(new classSnake(this.g,xPos,yPos,'l'))
break
case 8:this.g.g[this.position].push(new classSnake(this.g,xPos,yPos,'r'))
break
case 9:this.g.g[this.position].push(new classPage(this.g,xPos,yPos,'r'))
break}
if((tx+1)%this.screenSize==0){yPos+=this.g.rockHeight;xPos=this.pos.x;}else{xPos+=this.g.rockWidth;}}}
if(!this.g.heroObj){this.g.heroObj=new classHero(this.g,this.g.rockWidth,this.g.rockHeight,this)
this.g.sg.push(this.g.heroObj)}
this.drawEnv=false;}}};var classBomb=class{constructor(h,x,y){this.h=h;this.name='bomb';this.hposx=x;this.hposy=y;this.width=50;this.height=70;this.ewidth=250;this.eheight=300;this.timer=2000;this.TScreated=Date.now()
this.timePassed=0
this.explode=false;}
getBBox(){let xPos=0;let yPos=0;if(this.explode){xPos=this.hposx+(this.h.asset[0][0].length*this.h.g.tileWidth)/2-this.ewidth/2;yPos=this.hposy+(this.h.asset[0].length*this.h.g.tileHeight)-this.eheight;return{x:xPos,y:yPos,width:this.ewidth,height:this.eheight}}else{xPos=this.hposx+(this.h.asset[0][0].length*this.h.g.tileWidth)/2-this.width/2;yPos=this.hposy+(this.h.asset[0].length*this.h.g.tileHeight)-this.height;return{x:xPos,y:yPos,width:this.width,height:this.height}}}
hit(){let ts=Date.now()
if((ts-this.TScreated)>this.timer){this.explode=true;zzfx(...[,,106,,.11,.82,4,.94,.4,,,,,.8,,.4,.27,.84,.08]);}
var rect1=this.getBBox();var find=false;for(let t=0,g_l=this.h.g.g[this.h.rock.position].length;t<g_l;t++){if(this.h.g.g[this.h.rock.position][t].getBBox&&!this.h.g.g[this.h.rock.position][t].hide&&this.h.g.g[this.h.rock.position][t].name.indexOf('wall')!=-1){var rect2=this.h.g.g[this.h.rock.position][t].getBBox();if(rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y){find=true;this.h.g.g[this.h.rock.position][t].hide=true;this.h.g.increaseScore(50);}}
if(this.h.getBBox&&this.explode){var rect2=this.h.getBBox();if(rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y&&!this.h.hide){find=true;this.h.hide=true;this.h.die();}}
if(t==g_l-1)return find;}}
draw(){this.hit();let r='#ff0000';this.h.g.cx.fillStyle=r;let rect1=this.getBBox()
let hw=Math.ceil(this.width/2);let hh=Math.ceil(this.height/2);this.h.g.cx.fillRect(rect1.x,rect1.y,hw,hh)
this.h.g.cx.fillRect(rect1.x,rect1.y+rect1.height-hh,hw,hh)
this.h.g.cx.fillRect(rect1.x+rect1.width-hw,rect1.y,hw,hh)
this.h.g.cx.fillRect(rect1.x+rect1.width-hw,rect1.y+rect1.height-hh,hw,hh)
if(this.explode){this.h.g.addText(rect1.x,rect1.y+rect1.height/2,"B O O M!")
this.hide=true;}}};var classText=class{constructor(g,x,y,t){this.g=g;this.name='text';this.hposx=x;this.hposy=y;this.timer=2000;this.TScreated=Date.now()
this.timePassed=0
this.str=t;}
draw(){let ts=Date.now()
if((ts-this.TScreated)>this.timer){this.hide=true;if(this.g.lives>0&&this.g.heroObj.hide)this.g.heroObj.hide=false;}
this.g.cx.fillStyle="#FFFFFF";this.g.cx.fillText(this.str,this.hposx,this.hposy)}};var Utils=class{constructor(){this.c={};this.cx={};this.tileWidth=0;this.tileHeight=0;this.resX=0;this.resY=0;this.splash=true;this.stringToPrint="M.Y.H.E.R.O.<br />Homage to Atari classic H.E.R.O. by Morticcino.<br />Press 's' to start. In game: press 'm' to show map, use arrow keys to move, space for laser. Arrow down for bomb.<br />Discover all pages to finish level in time!"
if(!localStorage.myheroScore)localStorage.myheroScore=0;}
increaseScore(points){this.score+=points;localStorage.myheroScore=(this.score>parseInt(localStorage.myheroScore))?this.score:localStorage.myheroScore;this.printScore()}
decreaseNumMap(){if(this.numMap>0&&!this.lockNumMap)this.numMap--;this.lockNumMap=true
this.printNumMap();}
findPage(){this.pages++;this.increaseScore(100);this.printPages()
if(this.pages==this.maxNumPages-1)this.startGame()}
laserTemp(){if(this.lazTemp<100)this.lazTemp++;this.printLaserTemp();}
decrLaserTemp(){if((this.lazTemp-1)>=0)this.lazTemp--;this.printLaserTemp();}
die(){this.lives--;this.printLives();if(this.lives==0){this.splash=true;this.stringToPrint='No other life!<br />Your record is '+localStorage.myheroScore+'<br />Press \'s\' to restart';}}
printScore(){document.getElementById('score').innerText='Score '+this.score;}
printLaserTemp(){document.getElementById('laserTemperature').innerText='Laser temperature '+this.lazTemp;}
printLives(){document.getElementById('lives').innerText='Lives '+this.lives;}
printTimer(){document.getElementById('timer').innerText='Timer '+this.timer;}
printPages(){document.getElementById('pages').innerText='Pages '+this.pages+' of '+this.maxNumPages;}
printNumMap(){document.getElementById('numMap').innerText='View Map '+this.numMap;}
updateTime(){if(!this.splash){let min_sec=this.timer.split(':');if(parseInt(min_sec[1])==0){min_sec[1]='59';if((parseInt(min_sec[0])-1)<0){this.splash=true;min_sec[1]='00';this.stringToPrint='Time ends!<br />Your record is '+localStorage.myheroScore+'<br />Press \'s\' to restart';}else{min_sec[0]=(parseInt(min_sec[0])-1)}}else{min_sec[1]=(parseInt(min_sec[1])-1)}
this.timer=min_sec[0].toString().padStart(2,'0')+':'+min_sec[1].toString().padStart(2,'0');this.printTimer();}}
startTimer(){this.timerInterval=setInterval(()=>{this.updateTime()},1000)}
stopTimer(){clearInterval(this.timerInterval);}
init3dCanvas(){}
init2DCanvas(rx,ry,square=true){if(square){let size=(window.innerWidth>window.innerHeight)?window.innerHeight:window.innerWidth;this.c.width=size;this.c.height=size;}else{this.c.width=window.innerWidth;this.c.height=window.innerHeight;}
document.body.appendChild(this.c);this.get2DContext();}
get2DContext(){this.cx=this.c.getContext('2d');}
initLowRezCanvas(resx,resy,rockSizeX,rockSizeY){this.resX=resx;this.resY=resy;this.idle=true;this.c=document.getElementsByTagName('canvas')[0];if(this.c.length>0){this.c=this.c[0];this.get2DContext();}
this.init2DCanvas(resx,resy)
this.setResolution(resx,resy,rockSizeX,rockSizeY)
this.setHandlerEvents();this.cx.font="bold 50px sans-serif";this.drawGame();}
startGame(fromKey){this.heroDir='';this.heroFire=false;this.idle=true;if(fromKey)this.score=0;this.pages=0;this.maxNumPages=0;this.lives=3;this.lazTemp=0;this.timer='10:00';this.numMap=3;this.sg=[];this.heroObj=null;this.rockObj=new classRock(this);this.sg.push(this.rockObj);this.g=new Array(this.rockObj.numRoomsX*this.rockObj.numRoomsY);this.printScore();this.printLives();this.printTimer();this.printPages();this.printNumMap();}
setResolution(x,y,rx,ry){this.tileWidth=Math.floor(this.c.width / x);this.tileHeight=Math.floor(this.c.height / y);this.c.width=this.tileWidth*x;this.c.height=this.tileHeight*y;this.rockWidth=Math.floor(this.c.width / rx);this.rockHeight=Math.floor(this.c.height / ry);}
setHandlerEvents(){document.addEventListener('keydown',event=>{this.keyDown(event)})
document.addEventListener('keyup',event=>{this.keyUp(event)})}
keyDown(event){switch(event.keyCode){case 32:this.heroObj.fireLaser=true;break;case 37:this.idle=false;this.heroObj.dir='l';this.heroObj.dirV='';break;case 38:this.idle=false;this.heroObj.dirV='u';break;case 39:this.idle=false;this.heroObj.dir='r';this.heroObj.dirV='';break;case 40:this.idle=false;this.heroObj.dirV='d';break;case 77:if(this.numMap)this.showMap=true;this.decreaseNumMap();break;case 83:if(this.splash)this.splash=false;this.hideString();this.startGame('k');this.startTimer();break;}}
keyUp(e){this.idle=true;this.heroObj.fireLaser=false;this.heroObj.dirV='';this.bombAdded=false;this.showMap=false;this.lockNumMap=false;}
addBomb(h,x,y){if(!this.bombAdded){this.g[this.rockObj.position].push(new classBomb(h,x,y))
this.bombAdded=true;}}
addText(x,y,t){this.g[this.rockObj.position].push(new classText(this,x,y,t))}
cleanCanvas(){this.cx.fillStyle='black';this.cx.fillRect(0,0,this.c.width,this.c.height)}
drawGame(){var me=this;setInterval(function(){me.cleanCanvas()
me.gameLoop();},30)}
printString(){document.getElementsByTagName('canvas')[0].style.display='none';document.getElementById('gamesdata').style.display='none';document.getElementsByClassName('printString')[0].style.display='block';document.getElementsByClassName('printString')[0].innerHTML=this.stringToPrint;}
hideString(){document.getElementsByTagName('canvas')[0].style.display='block';document.getElementById('gamesdata').style.display='block';document.getElementsByClassName('printString')[0].style.display='none';}
gameLoop(){if(!this.showMap&&!this.credits&&!this.splash){for(let g_i=0,g_l=this.sg.length;g_i<g_l;g_i++){if(!this.sg[g_i].hide)this.sg[g_i].draw();}
for(let g_i=0,g_l=this.g[this.rockObj.position].length;g_i<g_l;g_i++){if(!this.g[this.rockObj.position][g_i].hide)this.g[this.rockObj.position][g_i].draw();}}else if(this.showMap){this.cleanCanvas();this.rockObj.drawMap();}else if(this.splash){this.cleanCanvas();this.stopTimer();this.printString();}}};