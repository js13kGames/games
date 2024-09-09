"use strict";let assets={images:[]};(function(root){let server,socket,audio,game=null,oneP,timeStamp,stTime,started,gameEnded,endSound,quitting,playingCard,playID=0,sSt,sStI,sSts,sStTmr=0,touch,sz=512,scale,prtrt,stage,field,hand,mPanel,meter,mana=0,manaMax=10,manaGain=1,sCard=null,dO,players=[new Player(),new Player()],p1,p2,expls,lsrs,unts,NOOP=()=>{},types=[[32,64,90,0,700,1500,100,'',[[320,0]],[[16,4]],0],[32,48,80,0,600,1000,50,'',[[288,0]],[[16,2]],800],[32,32,100,30,1200,200,200,'',[[0,0],[32,0],[0,0],[64,0]],[[10,12],[24,10],[28,4],[24,-4],[19,-6],[4,-6],[2,3],[8,8]],600],[32,32,10,50,0,50,100,'',[[0,256],[32,256],[0,256],[64,256]],[[0,0]],250],[32,32,80,40,800,100,50,'',[[96,0],[128,0],[96,0],[160,0]],[[10,10],[22,10],[26,6],[22,2],[20,0],[10,0],[8,6],[8,8]],400],[32,32,70,50,300,300,50,'',[[194,0],[226,0],[194,0],[258,0]],[[10,10],[22,10],[26,6],[22,2],[20,0],[10,0],[8,6],[8,8]],500],[32,32,80,25,800,250,500,'',[[96,256],[96,256],[128,256],[96,256],[96,256],[160,256]],[[14,20],[24,20],[24,16],[24,14],[22,10],[12,12],[10,16],[12,20]],400],],cards=[[[1,0,0]],[[2,0,0]],[[3,0,9],[3,15,9],[3,-15,9],[3,0,-9],[3,15,-9],[3,-15,-9]],[[4,0,-10],[4,-10,10],[4,10,10]],[[5,-6,0],[5,6,0]],[[6,0,0]],[[3,-8,9],[3,-24,9],[3,8,9],[3,16,9],[3,-8,0],[3,-24,0],[3,8,0],[3,16,0],[3,-8,-9],[3,-24,-9],[3,8,-9],[3,16,-9],],[[4,0,9],[4,15,9],[4,-15,9],[4,0,-9],[4,15,-9],[4,-15,-9]]];function Player(pInd){return{mana:0,deck:[],hand:[],played:{},confirmed:{},units:{},}}
function Card(id){let C=new Obj(0,0,64,64,'blue');C.cardID=id;C.sx=384+(id%2)*64;C.sy=0+Math.floor(id/2)*64;C.render=ctx=>{ctx.save();ctx.scale(2,2);ctx.drawImage(assets.images[0],C.sx,C.sy,C.w,C.h,C.x,C.y,C.w,C.h);ctx.restore()}
return C}
root.Game=function(opts){game=this;server=opts.server;socket=opts.socket;oneP=opts.oneP;var simulationTimestep=1000/60,frameDelta=0,lastFrameTimeMs=0,fps=60,lastFpsUpdate=0,framesThisSecond=0,numUpdateSteps=0,minFrameDelay=0,running=!1,started=!1,panic=!1,requestAnimationFrame=!server?window.requestAnimationFrame:(function(){var lastTimestamp=Date.now(),now,timeout;return function(callback){now=Date.now()
timeout=Math.max(0,simulationTimestep-(now-lastTimestamp));lastTimestamp=now+timeout;return setTimeout(function(){callback(now+timeout)},timeout)}})(),cancelAnimationFrame=!server?window.cancelAnimationFrame:clearTimeout,begin=NOOP,update=NOOP,draw=NOOP,rafHandle;this.MainLoop={setBegin:function(fun){begin=fun||begin},setUpdate:function(fun){update=fun||update},setDraw:function(fun){draw=fun||draw},start:function(){if(!started){started=!0;rafHandle=requestAnimationFrame(function(timestamp){draw(1);running=!0;lastFrameTimeMs=timestamp;lastFpsUpdate=timestamp;framesThisSecond=0;rafHandle=requestAnimationFrame(animate)})}},stop:function(){running=!1;started=!1;cancelAnimationFrame(rafHandle)},};function animate(timestamp){timeStamp=timestamp;rafHandle=requestAnimationFrame(animate);if(timestamp<lastFrameTimeMs+minFrameDelay){return}
frameDelta+=timestamp-lastFrameTimeMs;lastFrameTimeMs=timestamp;begin(timestamp,frameDelta);if(timestamp>lastFpsUpdate+1000){fps=0.25*framesThisSecond+0.75*fps;lastFpsUpdate=timestamp;framesThisSecond=0}
framesThisSecond++;numUpdateSteps=0;while(frameDelta>=simulationTimestep){update(simulationTimestep);frameDelta-=simulationTimestep;if(++numUpdateSteps>=240){panic=!0;break}}
draw(frameDelta/simulationTimestep);panic=!1}
this.init(opts)}
root.Game.prototype={init:function(opts){stage=new Obj(0,0,720,480);field=new Obj(70,0,480,480);let f1=new Obj(0,0,240,240);let f2=new Obj(240,240,240,240);hand=new Obj(550,0,150,480);mPanel=new Obj(0,0,70,480,'#595652');meter=new Obj(13,13,46,454);stage.addChild(field);field.render=NOOP;hand.render=NOOP;stage.addChild(hand);stage.addChild(mPanel);stage.render=()=>{};for(let i=0;i<4;i++){let o=new Obj(0,0,112,112,'blue')
o.render=()=>{}
hand.addChild(o)}
mPanel.addChild(meter);stTime=null;started=!1;sStI=0;sSts=[];players=[new Player(),new Player()];p1=players[0];p2=players[1];if(server){p1.socket=opts.players[0].socket;p2.socket=opts.players[1].socket}
gameEnded=!1;endSound=!1;quitting=!1;players.forEach(p=>{p.played={};p.confirmed={}})
if(server||oneP){p1.pInd=0;p2.pInd=1;p1.eInd=1;p2.eInd=0;p2.towers=[Unit(p2,100,60,0),Unit(p2,380,60,0)];p1.towers=[Unit(p1,100,420,0),Unit(p1,380,420,0)]}
lsrs=ObjectPool(Laser,[0,0]);if(!server){window.mobile=!1;if(typeof window.orientation!=='undefined'){mobile=!0;window.top.scrollTo(0,1)}
touch=new Obj();this.tDown=!1;sCard=null;let pInd=opts.pI;p1.pInd=pInd?1:0;p2.pInd=pInd?0:1;p1.eInd=1;p2.eInd=0;expls=ObjectPool(Explosion,[0,0]);this.canvas=Cnv(2,2);this.rsz(this.canvas);document.body.appendChild(this.canvas);let ctx=this.canvas.ctx;ctx.imageSmoothingEnabled=!1;this.ctx=ctx;ID=0;p1.spSh=assets.images[0];p2.spSh=assets.images[1];this.MainLoop.setDraw(this.render)}
dO=opts.dO||deckOrder();p1.deck.push(Card(0),Card(1),Card(2),Card(3),Card(4),Card(5),Card(6),Card(7));p2.deck.push(Card(0),Card(1),Card(2),Card(3),Card(4),Card(5),Card(6),Card(7));players.forEach((p,j)=>{let i,c,o=server?dO[p.pInd]:dO;for(i=0;i<4;i++){c=p.deck[o[i]];if(!server&&!j)
hand.children[i].addChild(c);p.hand.push(c)}
p.hand.forEach(C=>{p.deck.splice(p.deck.indexOf(C),1)})})
let m=this.MainLoop;m.setUpdate(this.update);m.setBegin(this.begin);m.start();if(!server&&!oneP)socket.emit('ready')},start:function(time){stTime=time},recState:function(st){sSts.push(st)},begin:function(tS,fD){if(oneP||(stTime&&!started&&now()>stTime))started=!0;if(!server){if(game.tDown){for(let i=0;i<4;i++){if(touchIn(hand.children[i]))
sCard=i}
if(sCard!==null&&touchIn(field)&&touch.y>(field.gY()+field.h)/2&&p1.mana>=vals[p1.hand[sCard].cardID]){game.playCard(sCard,null,0)}}
if(oneP&&Math.random()<0.05){let c=rInt(4),v=vals[p2.hand[c].cardID];if(p2.mana>=v){game.playCard(rInt(4),[,,rInt(100,190),rInt(100,140)],1)}}
if(sSts.length>sStI){sSt=JSON.parse(sSts[sStI]);if(now()<sSt[3]+100)return;players.forEach((p,i)=>{let units=sSt[p.pInd],unit,found,id;units.forEach(sU=>{found=!1;id=sU[0];if(p.units[id]){p.units[id].reconcile(sU);found=!0}
if(!found){addUnit([sU[1],sU[3]],p,sU);found=!1}})
for(let u in p.units){unit=p.units[u];found=!1;units.forEach(sU=>{if(sU[0]===unit.id)
found=!0})
if(!found)
removeUnit(unit)}});let i,l,p=p1.pInd;for(i=0;i<sSt[2].length;i++){l=sSt[2][i];lsrs.newObject({x:p?480-l[0]:l[0],y:p?480-l[1]:l[1],w:p?480-l[2]:l[2],h:p?480-l[3]:l[3],typ:l[4],time:l[5]})}
sStI++}
if(!server&&!oneP){}}else{let n=now();if(n>sStTmr+50){sStTmr=n;sendState()}}
field.children.forEach(o=>{if(o.dead)
removeUnit(o)})
if(!gameEnded&&(oneP||server)){if(p1.towers.length===0||p2.towers.length===0){gameEnded=!0;setTimeout(gameOver,1000)}}},update:function(tS){let o,objs,anm;for(o in animatedObjects){objs=animatedObjects[o];for(anm in objs)
objs[anm].update(now());}
field.children.forEach((o,i)=>{if(o){if(o.ai&&o.vis)o.ai();o.update(tS)}})
if(!started)return;players.forEach(p=>{p.mana=Math.min(manaMax,p.mana+(manaGain*tS/1000))})},render:function(){let i,c,ctx=game.ctx,w=meter.w/10,h=meter.h;ctx.clearRect(0,0,innerWidth,innerHeight);ctx.save();ctx.scale(scale,scale);if(sCard!==null){ctx.save();ctx.fillStyle='#fff';ctx.globalAlpha=0.3;ctx.fillRect(field.gX(),field.gY()+240,480,240);ctx.restore()}
displayObj(stage);ctx.strokeStyle='green';ctx.lineWidth=4;if(sCard!==null){c=hand.children[sCard];ctx.strokeRect(c.gX()+8,c.gY()+8,c.w,c.h)}
for(i=0;i<Math.floor(p1.mana);i++){ctx.fillStyle='green';ctx.fillRect(meter.gX()+w*i,meter.gY(),w,h)}
if(!started){ctx.textAlign='right';ctx.fillStyle='black';ctx.font='40px sans-serif'
ctx.fillText(decToBin(Math.floor((stTime-now())/100)),320+field.gX(),240+field.gY())}
if(gameEnded){let msg='';if(p1.towers.length>0){msg='You Win!'}else{msg='You Lose!'}
endSound=!0;ctx.textAlign='center';ctx.fillStyle='black';ctx.font='80px sans-serif'
ctx.fillText(msg,240+field.gX(),240+field.gY())}
ctx.restore()},gameOver:function(){gameOver()},playCard:function(card,data,pI,nC){if(playingCard)return;playingCard=!0;let n=data?data[3]:now(),p=players[pI],l;p.played[playID]=[card,n];players[pI].mana-=vals[players[pI].hand[card].cardID];if(server||oneP){cardConfirmed(p,playID++,data,card,nC)}
else{l=new Obj().cpy(touch).sub(field.gL());if(p1.pInd){l.x=480-l.x;l.y=480-l.y}
socket.emit('card','['+p1.pInd+','+card+','+l.x+','+l.y+','+n+','+playID++ +']')}},confCard:function(data){cardConfirmed(p1,data[5],null,data[1],data[6])},touch:function(x,y){touch.x=x;touch.y=y;touch.scl(1/scale)},rsz:cnv=>{let W=680,H=480,iW=innerWidth,iH=innerHeight,w=iW/H,h=iH/W,stl=cnv.style;scale=h;cnv.width=iW;cnv.height=iH;cnv.ctx.imageSmoothingEnabled=!1;stl.position='fixed';stl.left='0px';stl.top='0px';stl.zIndex=2;assets.images[2].style.zIndex=1;stage.x=innerWidth/2-H*scale/2;stage.y=innerHeight/2-W*scale/2;hand.x=0;hand.y=550;hand.w=H;hand.h=150;mPanel.x=0;mPanel.y=0;mPanel.w=H;mPanel.h=70;meter.w=454;meter.h=46;field.x=0;field.y=70;for(let i=0;i<4;i++){let card=hand.children[i];card.y=4;card.x=i*118}}};let displayObj=(obj)=>{let ctx=game.ctx;ctx.save();ctx.translate(obj.x,obj.y);if(obj.alpha!==1)
ctx.globalAlpha=obj.alpha;if(!obj.vis)ctx.globalAlpha=obj.alpha*0.5;if(!obj.render){ctx.fillStyle=obj.fill;ctx.fillRect(0,0,obj.w,obj.h)}else{obj.render(ctx)}
if(obj.children&&obj.children.length>0){obj.children.forEach(child=>{displayObj(child)})}
ctx.restore()},sendState=()=>{sSt=[];players.forEach(p=>{let i,u,x,y,units=[],tgt;for(i in p.units){u=p.units[i];x=rnd(u.x);y=rnd(u.y);units.push([u.id,u.typ,x,y,u.pT,u.tgt?u.tgt.id:null,u.atT,u.hlt,u.dead])}
sSt[p.pInd]=units})
let i,l,ls=[];for(i=0;i<lsrs.active.length;i++){l=lsrs.active[i];ls.push([l.x,l.y,l.w,l.h,l.typ,l.time])}
sSt.push(ls);sSt.push(now());sSt=JSON.stringify(sSt);p1.socket.emit('state',sSt);p2.socket.emit('state',sSt)},cardConfirmed=(p,pID,data,card,nC)=>{let d,c=p.played[pID],nCard,pCard;p.confirmed[pID]=c;delete p.played[pID];pCard=p.hand[card];nCard=drawCard(p,card,nC);if(oneP||server){cards[pCard.cardID].forEach(u=>{addUnit(c,p,data,u)})}
if(!server)anmPlayCard(p,card,pCard,nCard);else nextCard(p,card,pCard,nCard);if(!p.pInd)
sCard=null},drawCard=(p,space,nC)=>{let r=nC===undefined?rInt(p.deck.length):nC;let c=p.deck.splice(r,1)[0];return c},nextCard=(p,id,c,n)=>{playingCard=!1;if(!server&&p1.pInd===p.pInd){hand.children[id].removeChild(c);hand.children[id].addChild(n);c.alpha=1;c.x=0;c.y=0}
p.hand.splice(id,1,n);p.deck.push(c)},gameOver=()=>{if(quitting)return;quitting=!0;if(server){p1.socket.emit('gameOver');p2.socket.emit('gameOver')}else socket.emit('matchEnded','boo ya');if(game)
game.MainLoop.stop();if(!server){setTimeout(()=>{let node=document.getElementsByTagName('canvas')[0],btns=document.getElementsByTagName("button");document.body.removeChild(game.canvas);if(oneP)game=null;for(var i=0;i<btns.length;i++)
btns[i].disabled=!1;assets.images[2].style.zIndex=-1},1000)}},ID=0;function Obj(x,y,w,h,c){let O={id:ID++,x:x||0,y:y||0,w:w||0,h:h||0,vis:!0,alpha:1,fill:c||'red',add(o){this.x+=o.x;this.y+=o.y;return this},sub(o){this.x-=o.x;this.y-=o.y;return this},scl(o){this.x*=o;this.y*=o;return this},cpy(o){this.x=o.x;this.y=o.y;return this},clr(){this.x=0;this.y=0;return this},mag(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))},nrmlz(){let m=this.mag();if(m!=0){this.x=this.x/m;this.y=this.y/m}
return this},dist(o){return Math.sqrt(Math.pow(this.x-o.x,2)+Math.pow(this.y-o.y,2))},dir(){return Math.atan2(this.y,this.x)},parent:null,children:[],addChild(chld){if(chld.parent)
chld.parent.removeChild(chld);chld.parent=this;this.children.push(chld);this.children.sort((a,b)=>a.y+a.h*0.75-b.y+b.h*0.75)},removeChild(chld){if(chld.parent===this){this.children.splice(this.children.indexOf(chld),1);chld.parent=null}
else throw new Error(chld+"is not a child of "+this)},gX(){if(this.parent)
return this.x+this.parent.gX();else return this.x},gY(){if(this.parent)
return this.y+this.parent.gY();else return this.y},gL(){return new Obj(this.gX(),this.gY())},update(){}}
return O};let Unit=(ply,x,y,t,id)=>{let p=types[t],U=new Obj(x,y,p[0],p[1],p[7]);U.id=id||U.id;U.dead=!1;U.pT=null;U.dly=p[10];U.ply=ply;U.tm=ply.units;U.enm=players[ply.eInd].units;U.tgt=null;U.dir=Obj();U.aim=null;U.aPs=p[9];U.api=0;U.typ=t;U.rng=p[2];U.mvS=p[3];U.atS=p[4];U.atT=0;U.hlt=p[5];U.dmg=p[6];U.frms=p[8]||[];U.t=0;U.aI=0;if(t===6){let g=new Obj(0,0,32,32);g.sx=352;g.sy=256;g.render=c=>{c.drawImage(assets.images[0],g.sx,g.sy,g.w,g.h,g.x-20,g.y-29,g.w,g.h)}
U.addChild(g)}
U.tm[U.id]=U;field.addChild(U);U.ai=()=>{if(U.dead)return;if(U.tgt===null||U.tgt.dead||U.dist(U.tgt)>U.rng)
U.target();if(U.tgt!==null){if(U.dist(U.tgt)>U.rng||U.aim===null){U.dir.cpy(U.tgt).sub(U).nrmlz();U.aim=(Math.floor(U.dir.dir()/Math.PI*-4+4.5)+6)%8}
else U.dir.clr();if(U.dist(U.tgt)<U.rng){if(now()>U.atT+U.atS){let tg=U.tgt,ap=U.aPs[U.aim%U.aPs.length]||[0,0];if(U.typ===0){U.api=(U.api+1)%2;ap=U.aPs[U.api]||[[0,0]]}
if(U.typ===3){if(!server){expls.newObject([U.x,U.y+U.tgt.h*0.1])}
removeUnit(U);if(tg.takeDamage(U.dmg))
tg=null}else{if(U.typ===6){if(server){U.throwTime=now()}
else if(!U.throwing){U.throwing=!0;anmThrowGrenade(U,tg.x,tg.y);return}}else{if(server||oneP){let laser=lsrs.newObject({x:U.x+ap[0]-U.w/2,y:U.y+ap[1]-U.h/2,w:tg.x,h:tg.y,typ:U.typ})}
if(tg.takeDamage(U.dmg))
tg=null}}
U.atT=now()}}}},U.target=()=>{U.tgt=null;for(let i in U.enm){let enm=U.enm[i],dst=U.dist(enm);if(enm.dead)continue;if(U.tgt===null||dst<U.dist(U.tgt))
U.tgt=enm}},U.takeDamage=amount=>{U.hlt-=amount;if(U.hlt<=0){U.hlt=0;U.dead=!0;return!0}},U.update=d=>{if(U.vis){if(U.tgt===null)
U.target();if(U.tgt){U.dir.scl(U.mvS*d/1000);U.add(U.dir)}}
else{if(now()>U.pT+U.dly)
U.vis=!0}},U.reconcile=d=>{U.x=p1.pInd?480-d[2]:d[2];U.y=p1.pInd?480-d[3]:d[3];U.pT=d[4];U.atT=d[6];U.hlt=d[7];U.dead=d[8]},U.render=c=>{if(now()>U.t+80){U.t=now();U.aI++;U.aI=U.aI%U.frms.length}
if(U.dir.mag()<0.1)
U.aI=0;let frm=U.frms[U.aI];if(U.typ<2)
U.aim=0;if(frm){c.drawImage(U.ply.spSh,frm[0],frm[1]+U.aim*32,U.w,U.h,-U.w/2,-U.h*0.75,U.w,U.h)}}
return U},addUnit=(crd,p,data,U)=>{let i,u,enm=p.pInd?p1.units:p2.units,x=data?data[2]:touch.x-field.gX(),y=data?data[3]:touch.y-field.gY(),id=data?data[0]:undefined,typ=!server&&!oneP?data[1]:U[0];if(U){x+=U[1];y+=U[2]}
if(p1.pInd){x=480-x;y=480-y}
u=Unit(p,x,y,typ,id);u.pT=crd[1];u.vis=!1},removeUnit=(unit)=>{delete unit.tm[unit.id];if(unit.typ===0){if(server||oneP)
unit.ply.towers.splice(unit.ply.towers.indexOf(unit),1)}
field.removeChild(unit);for(let i in unit.enm){let en=unit.enm[i];if(en.tgt&&en.tgt.id===unit.id)
en.tgt=null}},lasers=['#fbf236','#d95763','#99e550',,'#ac3232','#6abe30'],Laser=(o)=>{let O=new Obj();O.init=(o)=>{O.typ=o.typ;O.time=o.time||now();O.x=o.x;O.y=o.y;O.w=o.w;O.h=o.h;field.addChild(O)}
O.render=ctx=>{if(now()>O.time){ctx.strokeStyle=lasers[O.typ];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(O.w-O.x,O.h-O.y);ctx.stroke()}}
O.update=tS=>{if(now()>O.time+Math.random()*275+25){field.removeChild(O);O.release()}}
return O},Explosion=()=>{let i,frm,e=new Obj(0,0,32,32);e.frms=[];for(i=0;i<8;i++)
e.frms.push([352,i*32]);e.init=(o)=>{e.x=o[0];e.y=o[1];e.time=now();e.aI=0;field.addChild(e)};e.update=()=>{if(now()>e.time+80)
e.aI++;if(e.aI===8){e.release();field.removeChild(e)}}
e.render=c=>{frm=e.frms[e.aI];c.drawImage(assets.images[0],frm[0],frm[1],32,32,-16,-16,32,32)}
return e},now=()=>{return Date.now()},rnd=(n)=>{return Math.floor(n*100)/100},rvrs=(obj)=>{obj.x=480-obj.x;obj.y=480-obj.y;return obj},touchIn=(obj)=>{if(touch.x>obj.gX()&&touch.x<obj.gX()+obj.w&&touch.y>obj.gY()&&touch.y<obj.gY()+obj.h)
return!0},animatedObjects={},ease={linear:x=>x,acceleration:x=>x*x,deceleration:x=>1-Math.pow(1-x,2),smoothStep:x=>x*x*Math.pow((3-2*x),1),},animateProperty=(o)=>{let anm={};Object.assign(anm,o);anm.sVal=anm.sVal||anm.target[anm.property];anm.repeatCount=1;anm.start=(sVal,eVal)=>{anm.sVal=JSON.parse(JSON.stringify(sVal));anm.eVal=JSON.parse(JSON.stringify(eVal));anm.playing=!0;anm.duration=anm.duration||1000;anm.stTime=now();if(!animatedObjects[anm.target.id])
animatedObjects[anm.target.id]={};animatedObjects[anm.target.id][anm.property]=anm};anm.start(anm.sVal,anm.eVal);anm.update=()=>{let eTime=now()-anm.stTime,time,curvedTime;if(anm.playing){if(eTime<anm.duration){let nTime=eTime/anm.duration;curvedTime=ease[anm.curve](nTime);anm.target[anm.property]=(anm.eVal*curvedTime)+(anm.sVal*(1-curvedTime))}else anm.end()}};anm.end=()=>{anm.complete()};anm.complete=()=>{anm.playing=!1;if(anm.onComplete)anm.onComplete(anm.target);delete animatedObjects[anm.target.id][anm.property]};anm.play=()=>anm.playing=!0;return anm},anmPlayCard=(p,id,c,n)=>{let card=p.hand[id];animateProperty({target:card,property:'y',eVal:-100,duration:350,curve:'acceleration',onComplete:()=>{nextCard(p,id,c,n)}});animateProperty({target:card,property:'alpha',eVal:0,duration:300,curve:'smoothStep'})},anmThrowGrenade=(u,X,Y)=>{let g=u.children[0],t=u.tgt;animateProperty({target:g,property:'x',eVal:(X-u.x)/(scale*2),duration:300,curve:'linear',onComplete:()=>{g.x=0;g.y=0;u.throwing=!1}});animateProperty({target:g,property:'y',eVal:(Y-u.y)/(scale*2),duration:300,curve:u.aim<=1?'acceleration':'deceleration',onComplete:()=>{expls.newObject([X,Y])
if(t.takeDamage(u.dmg))
u.tgt=null}})},decToBin=(dec)=>{return dec>=0?(dec>>>0).toString(2):0},ObjectPool=(object,def)=>{let i,pool={};pool.active=[];pool.inactive=[];pool.newObject=function(opts){let o;if(pool.inactive.length<1){o=object();o.init(opts);o.release=()=>{o.vis=!1;pool.active.splice(pool.active.indexOf(o),1);pool.inactive.push(o)}}else{o=pool.inactive.pop();o.init(opts);o.vis=!0}
pool.active.push(o);return o};return pool}
if(typeof define==='function'&&define.amd){define(root.MainLoop)}
else if(typeof module==='object'&&module!==null&&typeof module.exports==='object'){module.exports=root.Game}})(this);function Cnv(w,h){let c=document.createElement('canvas');c.ctx=c.getContext('2d');c.width=w;c.height=h;c.ctx.imageSmoothingEnabled=!1;return c};function deckOrder(){let i,d=[0,1,2,3,4,5,6,7],o=[];for(i=0;i<8;i++)
o.push(d.splice([rInt(d.length)],1)[0]);return o}
let vals=[6,5,3,2,4,3,6,5];function rInt(i,o){return Math.floor(Math.random()*i+(o||0))}
var server=typeof window!=="object"