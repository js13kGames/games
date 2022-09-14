// @ts-nocheck
var gamestatus={id:-1};
var pausediv=document.createElement("div");
pausediv.style="display:none;position:fixed;left:0px;top:0px;width:100%;height:100%;background:rgba(0,0,0,0.8);color:#ffffff;font-size:32px";
document.body.appendChild(pausediv);
function guiyi(x,y){var i1=1/(Math.sqrt(x*x+y*y)+1e-15);return {x:x*i1,y:y*i1};}
function turbulence(x0,x1=0.5){var i1=(Math.random()-0.5)*Math.random()*x1;var i2=Math.cos(i1),i3=Math.sin(i1);return {x:x0.x*i2-x0.y*i3,y:x0.x*i3+x0.y*i2};}
function getangle(x1,x2){
	var i1=(x1*x1+x2*x2);
	if(i1<=0)return 0;
	x1/=Math.sqrt(i1);//x2/=i1;
	return x2<0?-Math.acos(x1):Math.acos(x1);
}
function getclick(){
	var i1,i2,res={};
	for(i1 in keylist)if(keylist[i1])res[i1]=1;
	for(i2=downqueue.length;i2>0;--i2)res[downqueue.pop()]=1;
	return res;
}
var audioctx=new AudioContext();
function playsound(freq0,freq1,time0){
	var osc=audioctx.createOscillator();
	var gain=audioctx.createGain();
	osc.connect(gain);
	gain.connect(audioctx.destination);
	osc.frequency.setValueAtTime(freq0,audioctx.currentTime);
	osc.frequency.linearRampToValueAtTime(freq1,audioctx.currentTime+time0);
	osc.type='sine';
	osc.start();
	gain.gain.setValueAtTime(1,audioctx.currentTime);
	gain.gain.linearRampToValueAtTime(0,time0+audioctx.currentTime);
	setTimeout(function(){osc.stop();osc.disconnect();gain.disconnect();},time0*1234);
	return;
}
// playsound(440,880,0.1);

function playlevel1(){
	showcanvas();
	var gameid=Math.random();
	var me=MovingCirc(0.2*cvw,0.5*cvh,0,0,16);
	var boss=MovingCirc(0.8*cvw,0.5*cvh,0,0,50);
	// me.ang=-1.3;me.health=10;me.shield=8;me.cd=0;
	// boss.ang=-Math.PI;boss.health=100;boss.cd=1;
	function init(){
		me.x=0.2*cvw;me.y=0.5*cvh;me.v.x=me.v.y=0;
		me.ang=getangle(msx-me.x,msy-me.y);me.health=10;me.shield=8;me.cd=0;
		boss.x=0.8*cvw;boss.y=0.5*cvh;boss.v.x=boss.v.y=0;
		boss.ang=-Math.PI;boss.health=100;boss.cd=1;
		bullets=[];
		pausediv.style.display="none";
		ctx.clearRect(0,0,cvw,cvh);
		// clearkey();
		return;
	}
	init();
	me.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(102,204,153,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/10*this.health),Math.PI*0.5);
		ctx.fillStyle="#bbddff";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=4;
		ctx.strokeStyle="#6699ff";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625*this.shield),this.ang+Math.PI*(1+0.0625*this.shield));
		ctx.strokeStyle="#336699";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625),this.ang+Math.PI*(1+0.0625));
		var i1=Math.cos(this.ang),i2=Math.sin(this.ang);
		ctx.lineWidth=4;
		ctx.lineCap="round";
		ctx.strokeStyle="#66cc66";
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1-7*i2,this.y-4*i2+7*i1);
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1+7*i2,this.y-4*i2-7*i1);
	}
	me.display();
	boss.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(204,102,51,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/100*this.health),Math.PI*0.5);
		ctx.fillStyle="#ffff99";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=6;
		ctx.strokeStyle="#ffffcc";
		drawcircle(this.x,this.y,this.r*(0.7*this.cd+0.2),false,true);
		ctx.strokeStyle="#ffcc66";
		drawcircle(this.x,this.y,this.r-3,false,true);
	}
	boss.display();
	var bullets=[];
	var walls=[FixedRect(512,256,16,128),FixedRect(500,-500,800,500),FixedRect(500,cvh+500,800,500),FixedRect(-500,300,500,800),FixedRect(cvw+500,300,500,800)];
	function newbullet(x,y,vx=0,vy=0,life=1,r=10,id=0){
		var res=MovingCirc(x,y,vx,vy,r);
		res.id=id;res.life=life;
		return res;
	}
	function drawBullet(x0){
		ctx.lineWidth=2;
		if(x0.id==0){
			ctx.fillStyle="rgba(0,0,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#000000";
		}else{
			ctx.fillStyle="rgba(255,153,00,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#ff9933";
		}
		drawcircle(x0.x,x0.y,x0.r,true,true);
	}
	function stop(msg){
		gamestatus.id=-1;
		pausediv.style.display="block";
		pausediv.innerText=msg;
		function listenkey(){
			var clk=getclick();
			if(clk["KeyN"])playlevel2();
			else if(clk["KeyB"])showlevels();
			else if(clk["KeyR"])playlevel1();
			else setTimeout(listenkey,100);
		}
		listenkey();
	}
	function medamage(x0){
		me.health-=x0;
		if(me.health<=0){
			playsound(440,0,1);
			stop("\nLevel failed.\n\nR to try again.\nN to skip to next level.\nB to select a level.");
		}
	}
	function bossdamage(x0){
		boss.health-=x0;
		if(boss.health<=0){
			playsound(880,880,1);
			stop("\nLevel completed!\n\nR to play again.\nN to start next level.\nB to select a level.");
		}
	}
	function judgeshield(x0){
		var i1=guiyi(x0.x-me.x,x0.y-me.y),i2=-Math.cos(me.ang),i3=-Math.sin(me.ang);
		if(i1.x*i2+i1.y*i3>=Math.cos(Math.PI*(0.0625*me.shield))){
			me.shield=(me.shield>2?me.shield-1:1);
			playsound(440,880,0.2);
			return true;
		}else{
			medamage(1);
			playsound(880,660,0.2);
			return false;
		}
	}
	var KeyPup=1;
	function upd(){
		if(gamestatus.id!=gameid)return;
		requestAnimationFrame(upd);
		var clklist=getclick();
		//pause and continue
		if(gamestatus.paused){
			if(clklist["KeyR"]){
				gamestatus.paused=0;
				init();
			}else if(clklist["KeyB"]){
				gamestatus.id=-1;
				showlevels();
			}
		}
		if(!keylist["KeyP"])KeyPup=true;
		if(clklist["KeyP"]&&KeyPup){
			KeyPup=false;
			if(gamestatus.paused<0){
				gamestatus.paused=60;
			}else{
				gamestatus.paused=-1;
				pausediv.style.display="block";
				pausediv.innerText="Press P to continue.\nPress R to restart.\nPress B to select a level.";
			}
			// console.log(gamestatus.paused);
		}
		if(gamestatus.paused){
			if(gamestatus.paused>0){
				pausediv.innerText="";
				for(var foo=gamestatus.paused;foo>0;--foo)pausediv.innerText+='_';
				if(gamestatus.paused>1)gamestatus.paused-=1;
				else{
					gamestatus.paused=0;
					pausediv.style.display="none";
				}
			}
			return;
		}
		//update
		ctx.clearRect(0,0,2333,2333);
		if(msmoved)me.ang=getangle(msx-me.x,msy-me.y);
		msmoved=false;
		if(clklist["KeyX"]){
			me.v.x=Math.cos(me.ang);
			me.v.y=Math.sin(me.ang);
			if(me.v.x*(msx-me.x)+me.v.y*(msy-me.y)<=0)me.v.x=me.v.y=0;
		}else{
			me.v.x=0;me.v.y=0;
		}
		me.cd-=0.05;
		if(me.cd<0)me.cd=0;
		if(me.cd<=0){
			if(clklist["KeyC"]){
				bullets.push(newbullet(me.x,me.y,3*Math.cos(me.ang),3*Math.sin(me.ang),4,6,0));
				me.cd=1;
				playsound(660,880,0.1);
			}
		}
		boss.cd-=0.03;
		if(boss.cd<0)boss.cd=0;
		if(boss.cd<=0){
			let aimvec=guiyi(me.x-boss.x,me.y-boss.y);
			bullets.push(newbullet(boss.x,boss.y,aimvec.x*1.5,aimvec.y*1.5,3,6,1));
			if(boss.health<=50){
				bullets.push(newbullet(boss.x,boss.y,aimvec.x-0.5774*aimvec.y,aimvec.y+0.5774*aimvec.x,3,6,1));
				bullets.push(newbullet(boss.x,boss.y,aimvec.x+0.5774*aimvec.y,aimvec.y-0.5774*aimvec.x,3,6,1));
				// bullets.push(newbullet(boss.x,boss.y,aimvec.x*1.5,aimvec.y*1.5,3,6,0));
			}
			boss.cd=1;
		}
		me.shield+=0.02;
		if(me.shield>8)me.shield=8;
		if(testCircleCollide(me,boss)){
			medamage(1);
			bossdamage(1);
			let foo=circlecollide(me.v,me.x,me.y,1,boss.v,boss.x,boss.y,233333);
			me.v=foo.v1;
		}
		var i1,i2;
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],me))workRectCircCollide(walls[i1],me);
		me.x+=me.v.x;me.y+=me.v.y;
		for(i1=bullets.length-1;i1>=0;--i1){
			bullets[i1].x+=bullets[i1].v.x;
			bullets[i1].y+=bullets[i1].v.y;
			if(testCircleCollide(bullets[i1],boss)){
				bossdamage(1);
				let foo=circlecollide(boss.v,boss.x,boss.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
				bullets[i1].v=foo.v2;
				--bullets[i1].life;
			}else if(testCircleCollide(bullets[i1],me)){
				if(judgeshield(bullets[i1])){
					let foo=circlecollide(me.v,me.x,me.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
					bullets[i1].v=foo.v2;
					--bullets[i1].life;
				}else bullets[i1].life=0;
			}
		}
		for(i1=walls.length-1;i1>=0;--i1){
			for(i2=bullets.length-1;i2>=0;--i2){
				if(testRectCircCollide(walls[i1],bullets[i2])){
					--bullets[i2].life;
					if(bullets[i2].life>0)workRectCircCollide(walls[i1],bullets[i2]);
				}
			}
		}
		ctx.lineWidth=2;
		ctx.strokeStyle="#666666";
		ctx.fillStyle="#999999";
		for(i1=walls.length-1;i1>=0;--i1){
			drawrect(walls[i1].x,walls[i1].y,walls[i1].a,walls[i1].b,walls[i1].ang,true,true);
		}
		me.display();
		boss.display();
		for(i1=bullets.length-1;i1>=0;--i1){
			if(bullets[i1].life>0){
				drawBullet(bullets[i1]);
			}else{
				bullets[i1]=bullets[bullets.length-1];
				--bullets.length;
			}
		}
	}
	gamestatus={start:init,end:stop,update:upd,paused:0,id:gameid};
	upd();
}
function playlevel2(){
	showcanvas();
	var gameid=Math.random();
	var me=MovingCirc(0.2*cvw,0.5*cvh,0,0,16);
	var boss=MovingCirc(0.8*cvw,0.5*cvh,0,0,50);
	// me.ang=-1.3;me.health=10;me.shield=8;me.cd=0;
	// boss.ang=-Math.PI;boss.health=160;boss.cd=1;
	function init(){
		me.x=0.2*cvw;me.y=0.5*cvh;me.v.x=me.v.y=0;
		me.ang=getangle(msx-me.x,msy-me.y);me.health=10;me.shield=8;me.cd=0;
		boss.x=0.8*cvw;boss.y=0.5*cvh;boss.v.x=boss.v.y=0;
		boss.ang=-Math.PI;boss.health=160;boss.cd=1;
		bullets=[];
		pausediv.style.display="none";
		ctx.clearRect(0,0,cvw,cvh);
		// clearkey();
		return;
	}
	init();
	me.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(102,204,153,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/10*this.health),Math.PI*0.5);
		ctx.fillStyle="#bbddff";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=4;
		ctx.strokeStyle="#6699ff";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625*this.shield),this.ang+Math.PI*(1+0.0625*this.shield));
		ctx.strokeStyle="#336699";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625),this.ang+Math.PI*(1+0.0625));
		var i1=Math.cos(this.ang),i2=Math.sin(this.ang);
		ctx.lineWidth=4;
		ctx.lineCap="round";
		ctx.strokeStyle="#66cc66";
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1-7*i2,this.y-4*i2+7*i1);
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1+7*i2,this.y-4*i2-7*i1);
	}
	me.display();
	boss.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(204,102,51,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/160*this.health),Math.PI*0.5);
		ctx.fillStyle="#66cc99";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=6;
		ctx.strokeStyle="#aaddaa";
		drawcircle(this.x,this.y,this.r*(0.7*this.cd+0.2),false,true);
		ctx.strokeStyle="#339966";
		drawcircle(this.x,this.y,this.r-3,false,true);
	}
	boss.display();
	var bullets=[];
	var walls=[FixedRect(384,192,16,16),FixedRect(640,320,16,16),FixedRect(500,-500,800,500),FixedRect(500,cvh+500,800,500),FixedRect(-500,300,500,800),FixedRect(cvw+500,300,500,800)];
	function newbullet(x,y,vx=0,vy=0,life=1,r=10,id=0){
		var res=MovingCirc(x,y,vx,vy,r);
		res.id=id;res.life=life;
		return res;
	}
	function drawBullet(x0){
		ctx.lineWidth=2;
		if(x0.id==0){
			ctx.fillStyle="rgba(0,0,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#000000";
		}else{
			ctx.fillStyle="rgba(51,153,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#339900";
		}
		drawcircle(x0.x,x0.y,x0.r,true,true);
	}
	function stop(msg){
		gamestatus.id=-1;
		pausediv.style.display="block";
		pausediv.innerText=msg;
		function listenkey(){
			var clk=getclick();
			if(clk["KeyN"])playlevel3();
			else if(clk["KeyB"])showlevels();
			else if(clk["KeyR"])playlevel2();
			else setTimeout(listenkey,100);
		}
		listenkey();
	}
	function medamage(x0){
		me.health-=x0;
		if(me.health<=0){
			playsound(440,0,1);
			stop("\nLevel failed.\n\nR to try again.\nN to skip to next level.\nB to select a level.");
		}
	}
	function bossdamage(x0){
		boss.health-=x0;
		if(boss.health<=0){
			playsound(880,880,1);
			stop("\nLevel completed!\n\nR to play again.\nN to start next level.\nB to select a level.");
		}
	}
	function judgeshield(x0){
		var i1=guiyi(x0.x-me.x,x0.y-me.y),i2=-Math.cos(me.ang),i3=-Math.sin(me.ang);
		if(i1.x*i2+i1.y*i3>=Math.cos(Math.PI*(0.0625*me.shield))){
			me.shield=(me.shield>2?me.shield-1:1);
			playsound(440,880,0.2);
			return true;
		}else{
			medamage(1);
			playsound(880,660,0.2);
			return false;
		}
	}
	var KeyPup=1;
	function upd(){
		if(gamestatus.id!=gameid)return;
		requestAnimationFrame(upd);
		var clklist=getclick();
		//pause and continue
		if(gamestatus.paused){
			if(clklist["KeyR"]){
				gamestatus.paused=0;
				init();
			}else if(clklist["KeyB"]){
				gamestatus.id=-1;
				showlevels();
			}
		}
		if(!keylist["KeyP"])KeyPup=true;
		if(clklist["KeyP"]&&KeyPup){
			KeyPup=false;
			if(gamestatus.paused<0){
				gamestatus.paused=60;
			}else{
				gamestatus.paused=-1;
				pausediv.style.display="block";
				pausediv.innerText="Press P to continue.\nPress R to restart.\nPress B to select a level.";
			}
			// console.log(gamestatus.paused);
		}
		if(gamestatus.paused){
			if(gamestatus.paused>0){
				pausediv.innerText="";
				for(var foo=gamestatus.paused;foo>0;--foo)pausediv.innerText+='_';
				if(gamestatus.paused>1)gamestatus.paused-=1;
				else{
					gamestatus.paused=0;
					pausediv.style.display="none";
				}
			}
			return;
		}
		//update
		ctx.clearRect(0,0,2333,2333);
		if(msmoved)me.ang=getangle(msx-me.x,msy-me.y);
		msmoved=false;
		if(clklist["KeyX"]){
			me.v.x=Math.cos(me.ang);
			me.v.y=Math.sin(me.ang);
			if(me.v.x*(msx-me.x)+me.v.y*(msy-me.y)<=0)me.v.x=me.v.y=0;
		}else{
			me.v.x=0;me.v.y=0;
		}
		me.cd-=0.05;
		if(me.cd<0)me.cd=0;
		if(me.cd<=0){
			if(clklist["KeyC"]){
				bullets.push(newbullet(me.x,me.y,3*Math.cos(me.ang),3*Math.sin(me.ang),4,6,0));
				me.cd=1;
				playsound(660,880,0.1);
			}
		}
		boss.cd-=0.025;
		if(boss.cd<0)boss.cd=0;
		if(boss.cd<=0){
			let aimvec=guiyi(me.x-boss.x,me.y-boss.y);
			// bullets.push(newbullet(boss.x,boss.y,aimvec.x*1.5,aimvec.y*1.5,3,6,0));
			for(var foo=0;foo<8;++foo){
				let bar1=Math.cos(Math.PI/4*foo),bar2=Math.sin(Math.PI/4*foo);
				bullets.push(newbullet(boss.x,boss.y,1.2*(aimvec.x*bar1-aimvec.y*bar2),1.2*(aimvec.y*bar1+aimvec.x*bar2),3,6,1));
			}
			if(boss.health<=80){
				for(var foo=0;foo<5;++foo){
					let bar=Math.random()*2*Math.PI;
					bullets.push(newbullet(boss.x,boss.y,Math.cos(bar),Math.sin(bar),1,8,1));
				}
			}
			boss.cd=1;
		}
		boss.v=guiyi(me.x-boss.x,me.y-boss.y);
		boss.v.x*=0.3;boss.v.y*=0.3;
		me.shield+=0.02;
		if(me.shield>8)me.shield=8;
		var i1,i2;
		if(testCircleCollide(me,boss)){
			medamage(1);
			bossdamage(1);
			let foo=circlecollide(me.v,me.x,me.y,1,boss.v,boss.x,boss.y,233333);
			me.v=foo.v1;
		}
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],me))workRectCircCollide(walls[i1],me);
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],boss))workRectCircCollide(walls[i1],boss);
		me.x+=me.v.x;me.y+=me.v.y;
		boss.x+=boss.v.x;boss.y+=boss.v.y;
		//bullets
		for(i1=bullets.length-1;i1>=0;--i1){
			bullets[i1].x+=bullets[i1].v.x;
			bullets[i1].y+=bullets[i1].v.y;
			if(testCircleCollide(bullets[i1],boss)){
				bossdamage(1);
				let foo=circlecollide(boss.v,boss.x,boss.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
				bullets[i1].v=foo.v2;
				--bullets[i1].life;
			}else if(testCircleCollide(bullets[i1],me)){
				if(judgeshield(bullets[i1])){
					let foo=circlecollide(me.v,me.x,me.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
					bullets[i1].v=foo.v2;
					--bullets[i1].life;
				}else bullets[i1].life=0;
			}
		}
		for(i1=walls.length-1;i1>=0;--i1){
			for(i2=bullets.length-1;i2>=0;--i2){
				if(testRectCircCollide(walls[i1],bullets[i2])){
					--bullets[i2].life;
					if(bullets[i2].life>0)workRectCircCollide(walls[i1],bullets[i2]);
				}
			}
		}
		ctx.lineWidth=2;
		ctx.strokeStyle="#666666";
		ctx.fillStyle="#999999";
		for(i1=walls.length-1;i1>=0;--i1){
			drawrect(walls[i1].x,walls[i1].y,walls[i1].a,walls[i1].b,walls[i1].ang,true,true);
		}
		me.display();
		boss.display();
		for(i1=bullets.length-1;i1>=0;--i1){
			if(bullets[i1].life>0){
				drawBullet(bullets[i1]);
			}else{
				bullets[i1]=bullets[bullets.length-1];
				--bullets.length;
			}
		}
	}
	gamestatus={start:init,end:stop,update:upd,paused:0,id:gameid};
	upd();
}
function playlevel3(){
	showcanvas();
	var gameid=Math.random();
	var me=MovingCirc(0.2*cvw,0.5*cvh,0,0,16);
	var boss=MovingCirc(0.8*cvw,0.5*cvh,0,0,30);
	// me.ang=-1.3;me.health=10;me.shield=8;me.cd=0;
	// boss.ang=-Math.PI;boss.health=80;boss.cd=1;
	function init(){
		me.x=0.2*cvw;me.y=0.5*cvh;me.v.x=me.v.y=0;
		me.ang=getangle(msx-me.x,msy-me.y);me.health=10;me.shield=8;me.cd=0;
		boss.x=0.7*cvw;boss.y=0.5*cvh;boss.v.x=0;boss.v.y=1;
		boss.ang=-Math.PI;boss.health=80;boss.cd=1;boss.cd2=1;
		bullets=[];
		pausediv.style.display="none";
		ctx.clearRect(0,0,cvw,cvh);
		// clearkey();
		return;
	}
	init();
	me.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(102,204,153,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/10*this.health),Math.PI*0.5);
		ctx.fillStyle="#bbddff";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=4;
		ctx.strokeStyle="#6699ff";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625*this.shield),this.ang+Math.PI*(1+0.0625*this.shield));
		ctx.strokeStyle="#336699";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625),this.ang+Math.PI*(1+0.0625));
		var i1=Math.cos(this.ang),i2=Math.sin(this.ang);
		ctx.lineWidth=4;
		ctx.lineCap="round";
		ctx.strokeStyle="#66cc66";
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1-7*i2,this.y-4*i2+7*i1);
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1+7*i2,this.y-4*i2-7*i1);
	}
	me.display();
	var thre=40;
	boss.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(204,102,51,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/80*this.health),Math.PI*0.5);
		ctx.fillStyle="#6699cc";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=6;
		if(this.health<=thre){
			ctx.strokeStyle="rgba(153,204,255,0.5)";
			drawcircle(this.x,this.y,this.r*(1+this.cd2),false,true);
		}
		ctx.strokeStyle="#99bbcc";
		drawcircle(this.x,this.y,this.r*(0.7*this.cd+0.2),false,true);
		ctx.strokeStyle="#336699";
		drawcircle(this.x,this.y,this.r-3,false,true);
	}
	boss.display();
	var bullets=[];
	var walls=[FixedRect(384,128,16,16,0.25*Math.PI),FixedRect(384,384,16,16,0.25*Math.PI),FixedRect(384,256,4,4,0.25*Math.PI),FixedRect(500,-500,800,500),FixedRect(500,cvh+500,800,500),FixedRect(-500,300,500,800),FixedRect(cvw+500,300,500,800)];
	function newbullet(x,y,vx=0,vy=0,life=1,r=10,id=0){
		var res=MovingCirc(x,y,vx,vy,r);
		res.id=id;res.life=life;
		return res;
	}
	function drawBullet(x0){
		ctx.lineWidth=2;
		if(x0.id==0){
			ctx.fillStyle="rgba(0,0,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#000000";
		}else if(x0.id==1){
			ctx.fillStyle="rgba(51,102,153,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#336699";
		}else{
			ctx.fillStyle="rgba(102,153,255,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#6699ff";
		}
		drawcircle(x0.x,x0.y,x0.r,true,true);
	}
	function stop(msg){
		gamestatus.id=-1;
		pausediv.style.display="block";
		pausediv.innerText=msg;
		function listenkey(){
			var clk=getclick();
			if(clk["KeyN"])playlevel4();
			else if(clk["KeyB"])showlevels();
			else if(clk["KeyR"])playlevel3();
			else setTimeout(listenkey,100);
		}
		listenkey();
	}
	function medamage(x0){
		me.health-=x0;
		if(me.health<=0){
			playsound(440,0,1);
			stop("\nLevel failed.\n\nR to try again.\nN to skip to next level.\nB to select a level.");
		}
	}
	function bossdamage(x0){
		boss.health-=x0;
		if(boss.health<=0){
			playsound(880,880,1);
			stop("\nLevel completed!\n\nR to play again.\nN to start next level.\nB to select a level.");
		}
	}
	function judgeshield(x0){
		var i1=guiyi(x0.x-me.x,x0.y-me.y),i2=-Math.cos(me.ang),i3=-Math.sin(me.ang);
		if(i1.x*i2+i1.y*i3>=Math.cos(Math.PI*(0.0625*me.shield))){
			me.shield=(me.shield>2?me.shield-1:1);
			playsound(440,880,0.2);
			return true;
		}else{
			medamage(1);
			playsound(880,660,0.2);
			return false;
		}
	}
	var KeyPup=1;
	function upd(){
		if(gamestatus.id!=gameid)return;
		requestAnimationFrame(upd);
		var clklist=getclick();
		//pause and continue
		if(gamestatus.paused){
			if(clklist["KeyR"]){
				gamestatus.paused=0;
				init();
			}else if(clklist["KeyB"]){
				gamestatus.id=-1;
				showlevels();
			}
		}
		if(!keylist["KeyP"])KeyPup=true;
		if(clklist["KeyP"]&&KeyPup){
			KeyPup=false;
			if(gamestatus.paused<0){
				gamestatus.paused=60;
			}else{
				gamestatus.paused=-1;
				pausediv.style.display="block";
				pausediv.innerText="Press P to continue.\nPress R to restart.\nPress B to select a level.";
			}
			// console.log(gamestatus.paused);
		}
		if(gamestatus.paused){
			if(gamestatus.paused>0){
				pausediv.innerText="";
				for(var foo=gamestatus.paused;foo>0;--foo)pausediv.innerText+='_';
				if(gamestatus.paused>1)gamestatus.paused-=1;
				else{
					gamestatus.paused=0;
					pausediv.style.display="none";
				}
			}
			return;
		}
		//update
		ctx.clearRect(0,0,2333,2333);
		if(msmoved)me.ang=getangle(msx-me.x,msy-me.y);
		msmoved=false;
		if(clklist["KeyX"]){
			me.v.x=Math.cos(me.ang);
			me.v.y=Math.sin(me.ang);
			if(me.v.x*(msx-me.x)+me.v.y*(msy-me.y)<=0)me.v.x=me.v.y=0;
		}else{
			me.v.x=0;me.v.y=0;
		}
		me.cd-=0.05;
		if(me.cd<0)me.cd=0;
		if(me.cd<=0){
			if(clklist["KeyC"]){
				bullets.push(newbullet(me.x,me.y,3*Math.cos(me.ang),3*Math.sin(me.ang),4,6,0));
				me.cd=1;
				playsound(660,880,0.1);
			}
		}
		boss.cd-=0.05;
		if(boss.cd<=0){
			let aimvec=turbulence(guiyi(me.x-boss.x,me.y-boss.y));
			bullets.push(newbullet(boss.x,boss.y,aimvec.x*1.5,aimvec.y*1.5,2,5,1));
			if(boss.health<=thre){
				// for(var foo=0;foo<5;++foo){
				// 	let bar=Math.random()*2*Math.PI;
				// 	bullets.push(newbullet(boss.x,boss.y,Math.cos(bar),Math.sin(bar),1,8,1));
				// }
			}
			boss.cd=1;
		}
		if(boss.health<=thre){
			boss.cd2-=0.005;
			if(boss.cd2<=0){
				playsound(1320,440,0.3);
				for(var foo=bullets.length-1;foo>=0;--foo){
					if(bullets[foo].id!=1)continue;
					let bar=bullets[foo].v;
					// bullets.push(newbullet(bullets[foo].x,bullets[foo].y,bar.x-bar.y*0.577,bar.y+bar.x*0.577,1,4,2));
					// bullets.push(newbullet(bullets[foo].x,bullets[foo].y,bar.x+bar.y*0.577,bar.y-bar.x*0.577,1,4,2));
					bullets.push(newbullet(bullets[foo].x,bullets[foo].y,bar.x*0.866-bar.y*0.5,bar.y*0.866+bar.x*0.5,1,4,2));
					bullets.push(newbullet(bullets[foo].x,bullets[foo].y,bar.x*0.866+bar.y*0.5,bar.y*0.866-bar.x*0.5,1,4,2));
				}
				boss.cd2=1;
			}
		}
		me.shield+=0.02;
		if(me.shield>8)me.shield=8;
		var i1,i2;
		if(testCircleCollide(me,boss)){
			medamage(1);
			bossdamage(1);
			let foo=circlecollide(me.v,me.x,me.y,1,boss.v,boss.x,boss.y,233333);
			me.v=foo.v1;
		}
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],me))workRectCircCollide(walls[i1],me);
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],boss))workRectCircCollide(walls[i1],boss);
		me.x+=me.v.x;me.y+=me.v.y;
		boss.x+=boss.v.x;boss.y+=boss.v.y;
		//bullets
		for(i1=bullets.length-1;i1>=0;--i1){
			bullets[i1].x+=bullets[i1].v.x;
			bullets[i1].y+=bullets[i1].v.y;
			if(testCircleCollide(bullets[i1],boss)){
				bossdamage(1);
				let foo=circlecollide(boss.v,boss.x,boss.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
				bullets[i1].v=foo.v2;
				--bullets[i1].life;
			}else if(testCircleCollide(bullets[i1],me)){
				if(judgeshield(bullets[i1])){
					let foo=circlecollide(me.v,me.x,me.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
					bullets[i1].v=foo.v2;
					--bullets[i1].life;
				}else bullets[i1].life=0;
			}
		}
		for(i1=walls.length-1;i1>=0;--i1){
			for(i2=bullets.length-1;i2>=0;--i2){
				if(testRectCircCollide(walls[i1],bullets[i2])){
					--bullets[i2].life;
					if(bullets[i2].life>0)workRectCircCollide(walls[i1],bullets[i2]);
				}
			}
		}
		ctx.lineWidth=2;
		ctx.strokeStyle="#666666";
		ctx.fillStyle="#999999";
		for(i1=walls.length-1;i1>=0;--i1){
			drawrect(walls[i1].x,walls[i1].y,walls[i1].a,walls[i1].b,walls[i1].ang,true,true);
		}
		me.display();
		boss.display();
		for(i1=bullets.length-1;i1>=0;--i1){
			if(bullets[i1].life>0){
				drawBullet(bullets[i1]);
			}else{
				bullets[i1]=bullets[bullets.length-1];
				--bullets.length;
			}
		}
	}
	gamestatus={start:init,end:stop,update:upd,paused:0,id:gameid};
	upd();
}
function playlevel4(){
	showcanvas();
	var gameid=Math.random();
	var me=MovingCirc(0.2*cvw,0.5*cvh,0,0,16);
	var boss=[];//MovingCirc(0.8*cvw,0.5*cvh,0,0,30);
	// me.ang=-1.3;me.health=10;me.shield=8;me.cd=0;
	// boss.ang=-Math.PI;boss.health=80;boss.cd=1;
	function init(){
		me.x=0.2*cvw;me.y=0.5*cvh;me.v.x=me.v.y=0;
		me.ang=getangle(msx-me.x,msy-me.y);me.health=10;me.shield=8;me.cd=0;
		boss=[MovingCirc(0.7*cvw,0.5*cvh,-0.6,-0.6,40)];
		// boss[0].x=0.7*cvw;boss[0].y=0.5*cvh;boss[0].v.x=0;boss[0].v.y=1;
		boss[0].ang=-Math.PI;boss[0].health=80;boss[0].mxh=80;boss[0].cd=1;boss[0].id=1;
		bullets=[];
		pausediv.style.display="none";
		ctx.clearRect(0,0,cvw,cvh);
		// clearkey();
		return;
	}
	init();
	me.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(102,204,153,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/10*this.health),Math.PI*0.5);
		ctx.fillStyle="#bbddff";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=4;
		ctx.strokeStyle="#6699ff";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625*this.shield),this.ang+Math.PI*(1+0.0625*this.shield));
		ctx.strokeStyle="#336699";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625),this.ang+Math.PI*(1+0.0625));
		var i1=Math.cos(this.ang),i2=Math.sin(this.ang);
		ctx.lineWidth=4;
		ctx.lineCap="round";
		ctx.strokeStyle="#66cc66";
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1-7*i2,this.y-4*i2+7*i1);
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1+7*i2,this.y-4*i2-7*i1);
	}
	me.display();
	bossdisplay=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(204,102,51,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2*this.health/this.mxh),Math.PI*0.5);
		ctx.fillStyle="#ff9900";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=6;
		ctx.strokeStyle="#ff6633";
		drawcircle(this.x,this.y,this.r*(0.7*this.cd+0.2),false,true);
		ctx.strokeStyle="#ff3300";
		drawcircle(this.x,this.y,this.r-3,false,true);
	}
	bosssplit=function(){
		var i1,i2={};
		for(i1 in this)i2[i1]=this[i1];
		i2.mxh=this.mxh*0.5;
		i2.health=i2.mxh;
		i2.v={x:this.v.y,y:-this.v.x};
		i2.id=this.id+1;
		i2.r=this.r-10;
		boss.push(i2);
		i2={};
		for(i1 in this)i2[i1]=this[i1];
		i2.mxh=this.mxh*0.5;
		i2.health=i2.mxh;
		i2.v={x:-this.v.y,y:this.v.x};
		i2.id=this.id+1;
		i2.r=this.r-10;
		boss.push(i2);
		playsound(1320,440,0.3);
	}
	bossdisplay.call(boss[0]);
	var bullets=[];
	var walls=[FixedRect(512,128,16,16),FixedRect(512,384,16,16),FixedRect(384,256,16,16),FixedRect(640,256,16,16),FixedRect(500,-500,800,500),FixedRect(500,cvh+500,800,500),FixedRect(-500,300,500,800),FixedRect(cvw+500,300,500,800)];
	function newbullet(x,y,vx=0,vy=0,life=1,r=10,id=0){
		var res=MovingCirc(x,y,vx,vy,r);
		res.id=id;res.life=life;
		return res;
	}
	function drawBullet(x0){
		ctx.lineWidth=2;
		if(x0.id==0){
			ctx.fillStyle="rgba(0,0,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#000000";
		}else{
			ctx.fillStyle="rgba(204,0,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#ee0000";
		}
		drawcircle(x0.x,x0.y,x0.r,true,true);
	}
	function stop(msg){
		gamestatus.id=-1;
		pausediv.style.display="block";
		pausediv.innerText=msg;
		function listenkey(){
			var clk=getclick();
			if(clk["KeyN"])playlevel5();
			else if(clk["KeyB"])showlevels();
			else if(clk["KeyR"])playlevel4();
			else setTimeout(listenkey,100);
		}
		listenkey();
	}
	function medamage(x0){
		me.health-=x0;
		if(me.health<=0){
			playsound(440,0,1);
			stop("\nLevel failed.\n\nR to try again.\nN to skip to next level.\nB to select a level.");
		}
	}
	// function bossdamage(x0){
	// 	boss.health-=x0;
	// 	if(boss.health<=0)stop("\nLevel completed!\n\nR to play again.\nN to start next level.\nB to select a level.");
	// }
	function judgeshield(x0){
		var i1=guiyi(x0.x-me.x,x0.y-me.y),i2=-Math.cos(me.ang),i3=-Math.sin(me.ang);
		if(i1.x*i2+i1.y*i3>=Math.cos(Math.PI*(0.0625*me.shield))){
			me.shield=(me.shield>2?me.shield-1:1);
			playsound(440,880,0.2);
			return true;
		}else{
			medamage(1);
			playsound(880,660,0.2);
			return false;
		}
	}
	var KeyPup=1;
	function upd(){
		if(gamestatus.id!=gameid)return;
		requestAnimationFrame(upd);
		var clklist=getclick();
		//pause and continue
		if(gamestatus.paused){
			if(clklist["KeyR"]){
				gamestatus.paused=0;
				init();
			}else if(clklist["KeyB"]){
				gamestatus.id=-1;
				showlevels();
			}
		}
		if(!keylist["KeyP"])KeyPup=true;
		if(clklist["KeyP"]&&KeyPup){
			KeyPup=false;
			if(gamestatus.paused<0){
				gamestatus.paused=60;
			}else{
				gamestatus.paused=-1;
				pausediv.style.display="block";
				pausediv.innerText="Press P to continue.\nPress R to restart.\nPress B to select a level.";
			}
			// console.log(gamestatus.paused);
		}
		if(gamestatus.paused){
			if(gamestatus.paused>0){
				pausediv.innerText="";
				for(var foo=gamestatus.paused;foo>0;--foo)pausediv.innerText+='_';
				if(gamestatus.paused>1)gamestatus.paused-=1;
				else{
					gamestatus.paused=0;
					pausediv.style.display="none";
				}
			}
			return;
		}
		//update
		var i1,i2;
		ctx.clearRect(0,0,2333,2333);
		if(msmoved)me.ang=getangle(msx-me.x,msy-me.y);
		msmoved=false;
		if(clklist["KeyX"]){
			me.v.x=Math.cos(me.ang);
			me.v.y=Math.sin(me.ang);
			if(me.v.x*(msx-me.x)+me.v.y*(msy-me.y)<=0)me.v.x=me.v.y=0;
		}else{
			me.v.x=0;me.v.y=0;
		}
		me.cd-=0.05;
		if(me.cd<0)me.cd=0;
		if(me.cd<=0){
			if(clklist["KeyC"]){
				bullets.push(newbullet(me.x,me.y,3*Math.cos(me.ang),3*Math.sin(me.ang),4,6,0));
				me.cd=1;
				playsound(660,880,0.1);
			}
		}
		for(i1=boss.length-1;i1>=0;--i1){
			boss[i1].cd-=0.01*boss[i1].id*(2-boss[i1].health/boss[i1].mxh);
			if(boss[i1].cd<=0){
				let aimvec=turbulence(guiyi(me.x-boss[i1].x,me.y-boss[i1].y));
				bullets.push(newbullet(boss[i1].x,boss[i1].y,aimvec.x*2,aimvec.y*2,3,7,1));
				boss[i1].cd=1;
			}
			if(testCircleCollide(me,boss[i1])){
				medamage(1);
				boss[i1].health-=1;
				let foo=circlecollide(me.v,me.x,me.y,1,boss[i1].v,boss[i1].x,boss[i1].y,233333);
				me.v=foo.v1;
			}
			for(i2=walls.length-1;i2>=0;--i2)if(testRectCircCollide(walls[i2],boss[i1]))workRectCircCollide(walls[i2],boss[i1]);
			boss[i1].x+=boss[i1].v.x;boss[i1].y+=boss[i1].v.y;
		}
		me.shield+=0.02;
		if(me.shield>8)me.shield=8;
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],me))workRectCircCollide(walls[i1],me);
		me.x+=me.v.x;me.y+=me.v.y;
		//bullets
		for(i1=bullets.length-1;i1>=0;--i1){
			bullets[i1].x+=bullets[i1].v.x;
			bullets[i1].y+=bullets[i1].v.y;
			for(i2=boss.length-1;i2>=0;--i2){
				if(boss[i2].health>0&&testCircleCollide(bullets[i1],boss[i2])){
					boss[i2].health-=1;
					let foo=circlecollide(boss[i2].v,boss[i2].x,boss[i2].y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
					bullets[i1].v=foo.v2;
					--bullets[i1].life;
				}
			}
			if(i2<0&&testCircleCollide(bullets[i1],me)){
				if(judgeshield(bullets[i1])){
					let foo=circlecollide(me.v,me.x,me.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
					bullets[i1].v=foo.v2;
					--bullets[i1].life;
				}else bullets[i1].life=0;
			}
		}
		for(i1=walls.length-1;i1>=0;--i1){
			for(i2=bullets.length-1;i2>=0;--i2){
				if(testRectCircCollide(walls[i1],bullets[i2])){
					--bullets[i2].life;
					if(bullets[i2].life>0)workRectCircCollide(walls[i1],bullets[i2]);
				}
			}
		}
		ctx.lineWidth=2;
		ctx.strokeStyle="#666666";
		ctx.fillStyle="#999999";
		for(i1=walls.length-1;i1>=0;--i1){
			drawrect(walls[i1].x,walls[i1].y,walls[i1].a,walls[i1].b,walls[i1].ang,true,true);
		}
		me.display();
		for(i1=boss.length-1;i1>=0;--i1){
			if(boss[i1].health<=0){
				if(boss[i1].id<3)bosssplit.call(boss[i1]);
				boss[i1]=boss[boss.length-1];
				--boss.length;
			}
		}
		if(boss.length<=0){
			playsound(880,880,1);
			stop("\nLevel completed!\n\nR to play again.\nN to start next level.\nB to select a level.");
		}
		for(i1=boss.length-1;i1>=0;--i1){
			bossdisplay.call(boss[i1]);
		}
		for(i1=bullets.length-1;i1>=0;--i1){
			if(bullets[i1].life>0){
				drawBullet(bullets[i1]);
			}else{
				bullets[i1]=bullets[bullets.length-1];
				--bullets.length;
			}
		}
	}
	gamestatus={start:init,end:stop,update:upd,paused:0,id:gameid};
	upd();
}
function playlevel5(){
	showcanvas();
	var gameid=Math.random();
	var me=MovingCirc(0.2*cvw,0.5*cvh,0,0,16);
	var boss=MovingCirc(970,0.5*cvh,0,0,30);
	// me.ang=-1.3;me.health=10;me.shield=8;me.cd=0;
	// boss.ang=-Math.PI;boss.health=80;boss.cd=1;
	function init(){
		me.x=0.2*cvw;me.y=0.5*cvh;me.v.x=me.v.y=0;
		me.ang=getangle(msx-me.x,msy-me.y);me.health=10;me.shield=8;me.cd=0;
		boss.x=970;boss.y=0.5*cvh;boss.v.x=0;boss.v.y=0.5;
		boss.ang=-Math.PI;boss.health=120;boss.cd=1;boss.cd2=1;
		bullets=[];
		pausediv.style.display="none";
		ctx.clearRect(0,0,cvw,cvh);
		// clearkey();
		return;
	}
	init();
	me.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(102,204,153,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/10*this.health),Math.PI*0.5);
		ctx.fillStyle="#bbddff";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=4;
		ctx.strokeStyle="#6699ff";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625*this.shield),this.ang+Math.PI*(1+0.0625*this.shield));
		ctx.strokeStyle="#336699";
		drawcircle(this.x,this.y,this.r-2,false,true,this.ang+Math.PI*(1-0.0625),this.ang+Math.PI*(1+0.0625));
		var i1=Math.cos(this.ang),i2=Math.sin(this.ang);
		ctx.lineWidth=4;
		ctx.lineCap="round";
		ctx.strokeStyle="#66cc66";
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1-7*i2,this.y-4*i2+7*i1);
		drawline(this.x+8*i1,this.y+8*i2,this.x-4*i1+7*i2,this.y-4*i2-7*i1);
	}
	me.display();
	var thre=60;
	boss.display=function(){
		ctx.lineWidth=10;
		ctx.lineCap="butt";
		ctx.strokeStyle="rgba(204,102,51,0.5)";
		drawcircle(this.x,this.y,this.r+6,false,true,Math.PI*(0.5-2/120*this.health),Math.PI*0.5);
		ctx.fillStyle="#999999";
		drawcircle(this.x,this.y,this.r,true,false);
		ctx.lineWidth=6;
		if(this.health<=thre){
			ctx.strokeStyle="rgba(51,51,51,0.5)";
			drawcircle(this.x,this.y,this.r*(1+this.cd2),false,true);
		}
		ctx.strokeStyle="#cccccc";
		drawcircle(this.x,this.y,this.r*(0.7*this.cd+0.2),false,true);
		ctx.strokeStyle="#666666";
		drawcircle(this.x,this.y,this.r-3,false,true);
	}
	boss.display();
	var bullets=[];
	var walls=[FixedRect(32,32,16,16,0.25*Math.PI),FixedRect(992,32,16,16,0.25*Math.PI),FixedRect(32,480,16,16,0.25*Math.PI),FixedRect(992,480,16,16,0.25*Math.PI),FixedRect(512,256,20,20),FixedRect(500,-500,800,500),FixedRect(500,cvh+500,800,500),FixedRect(-500,300,500,800),FixedRect(cvw+500,300,500,800)];
	function newbullet(x,y,vx=0,vy=0,life=1,r=10,id=0){
		var res=MovingCirc(x,y,vx,vy,r);
		res.id=id;res.life=life;
		return res;
	}
	function drawBullet(x0){
		ctx.lineWidth=2;
		if(x0.id==0){
			ctx.fillStyle="rgba(0,0,0,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#000000";
		}else if(x0.id==1){
			ctx.fillStyle="rgba(153,153,153,"+(1-1.8/(x0.life+1))+")";
			ctx.strokeStyle="#999999";
		}else{
			ctx.fillStyle="rgba(51,51,51,"+(1-1.2/(x0.life+1))+")";
			ctx.strokeStyle="#333333";
		}
		drawcircle(x0.x,x0.y,x0.r,true,true);
	}
	function stop(msg){
		gamestatus.id=-1;
		pausediv.style.display="block";
		pausediv.innerText=msg;
		function listenkey(){
			var clk=getclick();
			// if(clk["KeyN"])playlevel4();
			// else 
			if(clk["KeyB"])showlevels();
			else if(clk["KeyR"])playlevel5();
			else setTimeout(listenkey,100);
		}
		listenkey();
	}
	function medamage(x0){
		me.health-=x0;
		if(me.health<=0){
			playsound(440,0,1);
			stop("\nLevel failed.\n\nR to try again.\nB to select a level.");
			// stop("\nLevel failed.\n\nR to try again.\nN to skip to next level.\nB to select a level.");
		}
	}
	function bossdamage(x0){
		boss.health-=x0;
		if(boss.health<=0){
			playsound(1000,1000,1);
			stop("\nCongratulations!You beat the last level.\nHappy Mid-Autumn Festival!\n\nR to play again.\nB to select a level.");
		}
	}
	function judgeshield(x0){
		var i1=guiyi(x0.x-me.x,x0.y-me.y),i2=-Math.cos(me.ang),i3=-Math.sin(me.ang);
		if(i1.x*i2+i1.y*i3>=Math.cos(Math.PI*(0.0625*me.shield))){
			me.shield=(me.shield>2?me.shield-1:1);
			playsound(440,880,0.2);
			return true;
		}else{
			medamage(1);
			playsound(880,660,0.2);
			return false;
		}
	}
	var KeyPup=1;
	function upd(){
		if(gamestatus.id!=gameid)return;
		requestAnimationFrame(upd);
		var clklist=getclick();
		//pause and continue
		if(gamestatus.paused){
			if(clklist["KeyR"]){
				gamestatus.paused=0;
				init();
			}else if(clklist["KeyB"]){
				gamestatus.id=-1;
				showlevels();
			}
		}
		if(!keylist["KeyP"])KeyPup=true;
		if(clklist["KeyP"]&&KeyPup){
			KeyPup=false;
			if(gamestatus.paused<0){
				gamestatus.paused=60;
			}else{
				gamestatus.paused=-1;
				pausediv.style.display="block";
				pausediv.innerText="Press P to continue.\nPress R to restart.\nPress B to select a level.";
			}
			// console.log(gamestatus.paused);
		}
		if(gamestatus.paused){
			if(gamestatus.paused>0){
				pausediv.innerText="";
				for(var foo=gamestatus.paused;foo>0;--foo)pausediv.innerText+='_';
				if(gamestatus.paused>1)gamestatus.paused-=1;
				else{
					gamestatus.paused=0;
					pausediv.style.display="none";
				}
			}
			return;
		}
		//update
		ctx.clearRect(0,0,2333,2333);
		if(msmoved)me.ang=getangle(msx-me.x,msy-me.y);
		msmoved=false;
		if(clklist["KeyX"]){
			me.v.x=Math.cos(me.ang);
			me.v.y=Math.sin(me.ang);
			if(me.v.x*(msx-me.x)+me.v.y*(msy-me.y)<=0)me.v.x=me.v.y=0;
		}else{
			me.v.x=0;me.v.y=0;
		}
		me.cd-=0.05;
		if(me.cd<0)me.cd=0;
		if(me.cd<=0){
			if(clklist["KeyC"]){
				bullets.push(newbullet(me.x,me.y,3*Math.cos(me.ang),3*Math.sin(me.ang),4,6,0));
				me.cd=1;
				playsound(660,880,0.1);
			}
		}
		boss.cd-=0.03;
		if(boss.cd<=0){
			let aimvec=turbulence(guiyi(me.x-boss.x,me.y-boss.y));
			bullets.push(newbullet(boss.x,boss.y,aimvec.x*1.6,aimvec.y*1.6,3,6,1));
			for(var foo=0;foo<4;++foo)bullets.push(newbullet(boss.x,boss.y,Math.cos((foo/2+0.25)*Math.PI)*1.3,Math.sin((foo/2+0.25)*Math.PI)*1.3,2,6,1));
			if(boss.health<=thre){
				for(var foo=0;foo<1;++foo){
					let bar=Math.random()*2*Math.PI;
					bullets.push(newbullet(boss.x,boss.y,Math.cos(bar),Math.sin(bar),1,6,1));
				}
			}
			boss.cd=1;
		}
		if(boss.health<=thre){
			boss.cd2-=0.002;
			boss.cd-=0.01;
			if(boss.cd2<=0){
				playsound(1320,440,0.3);
				for(var foo=bullets.length-1;foo>=0;--foo){
					if(bullets[foo].id!=1)continue;
					let bar=guiyi(me.x-bullets[foo].x,me.y-bullets[foo].y),bar2=Math.random()*0.5+0.5;
					bullets.push(newbullet(bullets[foo].x,bullets[foo].y,bar.x*bar2,bar.y*bar2,1,4,2));
				}
				boss.cd2=1;
			}
		}
		me.shield+=0.02;
		if(me.shield>8)me.shield=8;
		var i1,i2;
		if(testCircleCollide(me,boss)){
			medamage(1);
			bossdamage(1);
			let foo=circlecollide(me.v,me.x,me.y,1,boss.v,boss.x,boss.y,233333);
			me.v=foo.v1;
		}
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],me))workRectCircCollide(walls[i1],me);
		for(i1=walls.length-1;i1>=0;--i1)if(testRectCircCollide(walls[i1],boss))workRectCircCollide(walls[i1],boss);
		me.x+=me.v.x;me.y+=me.v.y;
		boss.x+=boss.v.x;boss.y+=boss.v.y;
		//bullets
		for(i1=bullets.length-1;i1>=0;--i1){
			bullets[i1].x+=bullets[i1].v.x;
			bullets[i1].y+=bullets[i1].v.y;
			if(testCircleCollide(bullets[i1],boss)){
				if(bullets[i1].id<=1)bossdamage(1);
				let foo=circlecollide(boss.v,boss.x,boss.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
				bullets[i1].v=foo.v2;
				--bullets[i1].life;
			}else if(testCircleCollide(bullets[i1],me)){
				if(judgeshield(bullets[i1])){
					let foo=circlecollide(me.v,me.x,me.y,233333,bullets[i1].v,bullets[i1].x,bullets[i1].y,1);
					bullets[i1].v=foo.v2;
					--bullets[i1].life;
				}else bullets[i1].life=0;
			}
		}
		for(i1=walls.length-1;i1>=0;--i1){
			for(i2=bullets.length-1;i2>=0;--i2){
				if(testRectCircCollide(walls[i1],bullets[i2])){
					--bullets[i2].life;
					if(bullets[i2].life>0)workRectCircCollide(walls[i1],bullets[i2]);
				}
			}
		}
		ctx.lineWidth=2;
		ctx.strokeStyle="#666666";
		ctx.fillStyle="#999999";
		for(i1=walls.length-1;i1>=0;--i1){
			drawrect(walls[i1].x,walls[i1].y,walls[i1].a,walls[i1].b,walls[i1].ang,true,true);
		}
		me.display();
		boss.display();
		for(i1=bullets.length-1;i1>=0;--i1){
			if(bullets[i1].life>0){
				drawBullet(bullets[i1]);
			}else{
				bullets[i1]=bullets[bullets.length-1];
				--bullets.length;
			}
		}
	}
	gamestatus={start:init,end:stop,update:upd,paused:0,id:gameid};
	upd();
}