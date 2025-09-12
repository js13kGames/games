function generateCat(){

let {sin,cos,PI,hypot,max,floor}=Math;
let frameCount=30;
let size=0.3;
let leg={upperLength:90,lowerLength:90,upperSwing:55*PI/180,lowerMin:10*PI/180,lowerMax:70*PI/180,lowerDelay:1,thick:14,bulge:0.5};
let arm={upperLength:60,lowerLength:60,thick:12,bulge:0.5,swing:45*PI/180};
let torso={length:100,thick:18,bulge:0.4};
let preRenderedImages=[];

function computeLeg(h,p,l,s){
let u=sin(p)*l.upperSwing,
k={x:h.x+sin(u)*l.upperLength*s,y:h.y+cos(u)*l.upperLength*s},
t=(sin(p-l.lowerDelay)+1)/2,
e=t<.5?2*t*t:-1+(4-2*t)*t,
f={x:k.x+sin(u+l.lowerMin+(l.lowerMax-l.lowerMin)*e)*l.lowerLength*s,y:k.y+cos(u+l.lowerMin+(l.lowerMax-l.lowerMin)*e)*l.lowerLength*s};
return {k,f};
}

function computeArm(s,p,a,c){
let b=PI/2,
w=sin(p)*a.swing,
A=b+w,
e={x:s.x+cos(A)*a.upperLength*c,y:s.y+sin(A)*a.upperLength*c},
dx=e.x-s.x,
dy=e.y-s.y,
l=hypot(dx,dy),
nx=dx/l,
ny=dy/l,
h={x:e.x-ny*a.lowerLength*c,y:e.y+nx*a.lowerLength*c};
return{e,h};
}

function makeOval(x1,y1,x2,y2,t,c,s){
let dx=x2-x1,dy=y2-y1,l=hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,h=t/2*s,b=l*0.2*c,p=new Path2D();
p.moveTo(x1+nx*h,y1+ny*h);
p.bezierCurveTo(x1+nx*h+dx/2+nx*b,y1+ny*h+dy/2+ny*b,x2+nx*h-dx/2+nx*b,y2+ny*h-dy/2+ny*b,x2+nx*h,y2+ny*h);
p.lineTo(x2-nx*h,y2-ny*h);
p.bezierCurveTo(x2-nx*h-dx/2-nx*b,y2-ny*h-dy/2-ny*b,x1-nx*h+dx/2-nx*b,y1-ny*h+dy/2-ny*b,x1-nx*h,y1-ny*h);
p.closePath();
return p;
}

function torsoPath(h,t,s){
let c={x:h.x,y:h.y-t.length*s},p=makeOval(h.x,h.y,c.x,c.y,t.thick,t.bulge,s);
return{path:p,chest:c};
}

function headPath(c){
let s=size,p=new Path2D(),r=25*s,g=4*s,hx=c.x,hy=c.y-r-g;
p.arc(hx,hy,r,0,7);
let eD=290,eH=13*s,eBW=12*s,aR=eD*PI/180,bX=hx+r*cos(aR),bY=hy+r*sin(aR),tX=hx+(r+eH)*cos(aR),tY=hy+(r+eH)*sin(aR),pA=aR+PI/2,lX=bX+(eBW/2)*cos(pA),lY=bY+(eBW/2)*sin(pA),rX=bX-(eBW/2)*cos(pA),rY=bY-(eBW/2)*sin(pA),e=new Path2D();
e.moveTo(lX,lY);
e.lineTo(tX,tY);
e.lineTo(rX,rY);
e.closePath();
p.addPath(e);
let eyD=190,eyR=8*s,eyA=eyD*PI/180,eyX=hx+15*s*cos(eyA),eyY=hy+15*s*sin(eyA);
return{path:p,eye:{x:eyX,y:eyY,r:eyR*.6}};
}

function legPath(h,p,d,s){
let {k,f}=computeLeg(h,p,d,s),P=new Path2D();
P.addPath(makeOval(h.x,h.y,k.x,k.y,d.thick,d.bulge,s));
P.addPath(makeOval(k.x,k.y,f.x,f.y,d.thick,d.bulge,s));
return P;
}

function armPath(s,p,d,c){
let {e,h}=computeArm(s,p,d,c),P=new Path2D();
P.addPath(makeOval(s.x,s.y,e.x,e.y,d.thick,d.bulge,c));
P.addPath(makeOval(e.x,e.y,h.x,h.y,d.thick,d.bulge,c));
return P;
}

function tailPath(h,s){
let P=new Path2D(),l=100*s,cp1X=h.x+l*.5,cp1Y=h.y-25*s,cp2X=h.x+l*.6,cp2Y=h.y+35*s,endX=h.x+l;
P.moveTo(h.x,h.y);
P.bezierCurveTo(cp1X,cp1Y,cp2X,cp2Y,endX,h.y);
return P;
}

function drawFrameToCtx(c,p0,p1,h){
let b=sin(p0*2+PI/4)*6*size,h0={x:h[0].x,y:h[0].y+b},h1={x:h[1].x,y:h[1].y+b},{path:tP,chest:ch}=torsoPath(h0,torso,size),hR=headPath(ch);
c.fillStyle='black';
c.fill(tP);
c.fill(armPath(ch,p0,arm,size));
c.fill(armPath(ch,p1,arm,size));
c.fill(legPath(h0,p0,leg,size));
c.fill(legPath(h1,p1,leg,size));
c.fill(hR.path);
let tS=tailPath(h0,size);
c.lineWidth=9*size;
c.strokeStyle='black';
c.lineCap='round';
c.stroke(tS);
c.beginPath();
c.fillStyle='yellow';
c.arc(hR.eye.x,hR.eye.y,max(hR.eye.r,0.8),0,7);
c.fill();
return hR.eye;
}

function buildFrames(){
preRenderedImages=[];
let c=document.createElement('canvas');
c.width=innerWidth;
c.height=innerHeight;
let o=c.getContext('2d'),h=[{x:0,y:0},{x:0,y:0}],l=(leg.upperLength+leg.lowerLength)*size;
for(let i=0;i<frameCount;i++){
o.clearRect(0,0,c.width,c.height);
o.save();
o.translate(c.width/2,c.height-l);
o.scale(-1,1);
let p0=-PI/2+(i/frameCount)*PI*2,p1=p0+PI;
drawFrameToCtx(o,p0,p1,h);
o.restore();
let img=new Image();
img.src=c.toDataURL();
preRenderedImages.push(img);
}
}

function draw(ctx,x,y,i,frame){
frame=floor(i)%frameCount;
let img=preRenderedImages[frame];
ctx.save();
ctx.translate(x,y);
ctx.drawImage(img,-img.width/2,-img.height);
ctx.restore();
}

buildFrames();

return {draw};

}

