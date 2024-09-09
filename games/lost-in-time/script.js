window.onload=dongu;
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + 1);
}
base=[
'11111111111111111111111111111111',
'14004444144444444441444444441111',
'10000000700000000007000000100000',
'10000000000000000000000000100000',
'10000000000000000000000000100030',
'11110000000044440000000000111111',
'10000000000000000000000000000111',
'00000000000000000000000000000000',
'00000044440000000000000000000000',
'00000000000000000000000000000000',
'00200000000000020000000000000000',
'11110000000004444000000000011111',
'00000000000000000000000000000000',
'00000000000000000000000000000000',
'00000004444000000000000000000000',
'00000000000000030000000000000000',
'11200000000002111000000000011111',
'11111200000111111100002111111111',
'11111111111111111111111111111111'];
a=base;
var d,sure=25;
tur=0;
c=document.getElementById('c');
t=c.getContext('2d');
im={};
var il={};
mod=0;
vx=5,vy=12.8;g=-0.64;
bol=[
	{
		s:"Welcome adventurer ! You were in a long journey to discover the mystery of the time, universe and the everything in time mazes. Accidentally, you lost your way and stuck in an endless time loop, consequently you're lost in time. Good luck!",
		b:false,
		f:function(){}
	},
	{								
		s:["Level 1 : First time, First steps...", " Level 1 : First time, First steps..", " That's it, now its simply here, I got it ! "],
		b:false,
		f:function(){
			im[2].src="a"+2+".png";
			im[3].src="a"+3+".png";}
	},
	{								
		s:[" Level 2 : But not last "," Level 2 : But not... What the hell...", " That's a loop including much of time loops."],
		b:false,
		f:function(){}
	},
	{								
		s:[" Level 3 : Fair is foul and foul is fair "," This time I know the trick "," I have just single explanation for this."],
		b:false,
		f:function(){
			im[2].src="a"+3+".png";
			im[3].src="a"+2+".png";
		}
	},
	{								
		s:[" Level 4 : Your other Left "," Left is right and right is left "," I must near the answer more than I've ever been."] ,
		b:false,
		f:function(){
			im[2].src="a"+2+".png";
			im[3].src="a"+3+".png";
			vx=-vx;
			karakter.vx=0;
			sure=25;
		}
	},
	{								
		s:[" Level 5 : A Little Moon Trip ","But Why again ?", " Time protecting It in It's best way "],
		b:false,
		f:function(){
			g=g/2;
			vx=-vx;
			karakter.vx=0;
		}
	},
	{								
		s:["Level 6 : Kinda Time-Lapse "," I feel like a mouse in a trap "," Just I have to break the loop somehow."],
		b:false,
		f:function(){
			g=2*g;
			sure=12.5
		}
	},
	{					  			
		s:[" Level 7 : Being a Time-Sloth "," I must hold on, answer is near "," But I can do nothing. I can just wait in patience..."],
		b:false,
		f:function(){
			sure=50;
		}
	},
	{					
		s:[" Level 8 : The last G-Bender "," I can feel, I feel it in my bones "," ..and belief. It can continue forever or finish now."],
		b:false,
		f:function(){
			sure=25;
			vy=-12.8;
			g=0.64;
		}
	},
	{								
		s:[" Level 9 : Darkness "," But now, What'll happen this time ?", " Perhaps..Who knows..Like the olds says : Third time's the charm... "],
		b:false,
		f:function(){
			vy=12.8;
			g=-0.64;

		}
	}
	];
level=1;
kon=new konuş();
function arada(x,y,z){
	m=Math.max(x,y);
	n=Math.min(x,y);
	return (m>z&z>n)?true:false;
}
asansor={
v:5,
x:20*32,
y:5*32,
dey:false,
ciz:function(){
	t.drawImage(im[4],asansor.x,576-asansor.y,32,32);
	t.drawImage(im[4],asansor.x+32,576-asansor.y,32,32);
	t.drawImage(im[4],asansor.x+64,576-asansor.y,32,32);	
	t.drawImage(im[4],asansor.x+96,576-asansor.y,32,32);	
},
d:function(){
	asansor.y+=asansor.v;
	if(asansor.y==12*32-4|asansor.y==5*32)asansor.v=-asansor.v;
	if(asansor.dey){karakter.y=asansor.y/32|0;karakter.yy=asansor.y%32;karakter.z=true;}
	karakter.y+=(karakter.yy/32|0)+(karakter.yy<0?-1:0);
		karakter.yy=karakter.yy%32+(karakter.yy<0?32:0);
},
alt:function(y){
		if(asansor.dey&!(arada(20*32,24*32,karakter.x*32+karakter.xx)|arada(20*32,24*32,karakter.x*32+karakter.xx+44)))
		{
			asansor.dey=false;
			karakter.vy=0;
		}
		if(arada(y,y-karakter.vy,asansor.y)&(arada(20*32,24*32,karakter.x*32+karakter.xx)|arada(20*32,24*32,karakter.x*32+karakter.xx+44)))
			if(karakter.vy<=0){
			karakter.yy-=karakter.vy;
			karakter.y+=(karakter.yy/32|0)+(karakter.yy<0?-1:0);
			karakter.yy=karakter.yy%32+(karakter.yy<0?32:0);
			karakter.vy=0;
			return true;
		}
		return false;
}
};
karakter={
	z:false,
	x:2,
	y:16,
	xx:0,
	yy:0,
	vx:0,
	vy:0,
	e:[0,0,1,3,4,5,6],
	ek:0,
	d:function(){
		if(karakter.bitti()){
			if(level%3==0){
				if(level==3&!del.b)
				mod=3;
			else mod=2;

			}
			karakter.sifirla();
			bol[level].b=false;
			if(level<bol.length-1){
				level++;
			}
			else{
				level=1;
				a=base;
				mod=0;
				bol[0].b=false;
				tur++;
				if(tur==3){
					mod=4;
				}
				}
		}
		if(karakter.acti()){
			a[15]=a[15].replaceAt(15,0);
			a[2]=a[2].replaceAt(26,0);
			a[3]=a[3].replaceAt(26,0);
			a[4]=a[4].replaceAt(26,0);
			a[5]=a[5].replaceAt(26,0);
		}
		if(karakter.yandi()){
			karakter.sifirla();
		}
		asansor.d();
		if(isNaN(karakter.r)){karakter.r=im[8];il={2:im[2],7:im[7],3:im[3]};}
		karakter.e=karakter.sinir(32*karakter.x+karakter.xx,32*karakter.y+karakter.yy);
		if(karakter.vx<0){
			if(!karakter.sol(karakter.x,karakter.y,karakter.xx+karakter.vx,karakter.yy)){
				karakter.xx+=karakter.vx;
			}
			else{
				karakter.xx=0;
			}
		}
		if(!karakter.sag(karakter.x,karakter.y,karakter.xx+karakter.vx,karakter.yy)&karakter.vx>0){
			karakter.xx+=karakter.vx;
			}
		karakter.x+=(karakter.xx/32|0)+(karakter.xx<0?-1:0);
		karakter.xx=karakter.xx%32+(karakter.xx<0?32:0);

		if(karakter.x*32+karakter.xx<=0){
			karakter.x=0;
			karakter.xx=0;
		}
		if(karakter.x*32+karakter.xx+44>=1024){
			karakter.x=30;
			karakter.xx=20;
		}
		if(karakter.alt(karakter.x,karakter.y,karakter.xx,karakter.yy)){
			karakter.vy=0;karakter.z=true;
		}
		else{
			karakter.vy+=(karakter.vy<-15|karakter.vy>15)?0:g;
		}
		if(!asansor.dey){
		if(karakter.vy>0){
			if(!karakter.ust(karakter.x,karakter.y,karakter.xx,karakter.yy+karakter.vy))
				karakter.yy+=karakter.vy;
			else if (karakter.yy!=0){ karakter.yy=karakter.ek;if(karakter.ek==0)karakter.y++;
			}
		}
		else if(karakter.vy<0){
			if(asansor.alt(karakter.y*32+karakter.yy)){
				karakter.y=asansor.y/32|0;
				karakter.yy=asansor.y%32;
					asansor.dey=true;
				karakter.vy=0;
			}
			else if(!karakter.alt(karakter.x,karakter.y,karakter.xx,karakter.yy+karakter.vy)){
				karakter.yy+=karakter.vy;
			}
			else{
				karakter.yy=0;
				karakter.y--;
				karakter.z=true;
			}
		}
		}
		karakter.y+=(karakter.yy/32|0)+(karakter.yy<0?-1:0);
		karakter.yy=karakter.yy%32+(karakter.yy<0?32:0);
		if(karakter.vy<0){
		}
		else if(karakter.ust(karakter.x,karakter.y,karakter.xx,karakter.yy)){
				karakter.yy=karakter.ek;
			}
		},
	acti:function(){
		if(arada(15*32,16*32,karakter.x*32+karakter.xx)|arada(15*32,16*32,karakter.x*32+karakter.xx+22)|arada(15*32,16*32+32,karakter.x*32+karakter.xx+44)){
			if(arada(2*32,4*32,karakter.y*32+karakter.yy)){
				return true;
			}	
		}
	},
	sifirla:function(){
			karakter.x=2;
			karakter.z=false;
			karakter.xx=0;
			karakter.y=16;
			karakter.yy=0;
			karakter.vy=0;
			a[15]=a[15].replaceAt(15,3);
			a[2]=a[2].replaceAt(26,1);
			a[3]=a[3].replaceAt(26,1);
			a[4]=a[4].replaceAt(26,1);
			a[5]=a[5].replaceAt(26,1);
	},
	yandi:function(){
		for(a1=0;a1<a.length;a1++){
			for(a2=0;a2<32;a2++){
				if(a[18-a1].charAt(a2)==2|a[18-a1].charAt(a2)==7){
					if(arada(a2*32,a2*32+32,karakter.x*32+karakter.xx)|arada(a2*32,a2*32+32,karakter.x*32+karakter.xx+22)|arada(a2*32,a2*32+32,karakter.x*32+karakter.xx+44)|arada(karakter.x*32+karakter.xx+44,karakter.x*32+karakter.xx,a2*32)){
						if(arada(a1*32,a1*32+32,karakter.y*32+karakter.yy)|arada(a1*32,a1*32+32,karakter.y*32+karakter.yy+16)|arada(a1*32,a1*32+32,karakter.y*32+karakter.yy+48)|arada(a1*32,a1*32+32,karakter.y*32+karakter.yy+64)|arada(karakter.y*32+karakter.yy,karakter.y*32+karakter.yy+64,a1*32)){
							return true;
						}
					}
				}
			}
		}
	},
	bitti:function(){
		if(arada(30*32,31*32,karakter.x*32+karakter.xx)|arada(30*32,31*32,karakter.x*32+karakter.xx+22)|arada(30*32,31*32+32,karakter.x*32+karakter.xx+44)){
			if(arada(13*32,15*32,karakter.y*32+karakter.yy)){
				return true;
			}	
		}
	},
	alt:function(x,y,xx,yy,r=true){
		if(asansor.alt(y*32+yy)){asansor.dey=true;return true;}
		e=karakter.sinir(32*x+xx,32*y+yy);
		y+=(yy/32|0)+(yy<0?-1:0);
		yy=yy%32+(yy<0?32:0);
		if(karakter.vy>0)return false;
		if(yy==0){
				for(i=0;i<3;i++){
				if(a[19-y].charAt(e[i])==1|a[19-y].charAt(e[i])==4)
					return true;
			}
			return false;
		}
		else{
			for(i=0;i<3;i++){
				if(a[18-y].charAt(e[i])==1|a[18-y].charAt(e[i])==4){
					if(r){
					karakter.y++;
					karakter.yy=0;}
					return true;
				}
			}
			return false;
		}
	},
	ust:function(x,y,xx,yy){
		karakter.ek=0;
		y+=(yy/32|0)+(yy<0?-1:0);
		yy=yy%32+(yy<0?32:0);
		e=karakter.sinir(32*x+xx,32*y+yy);
		for(i=0;i<3;i++){
			if(16-y>=0){
					if(a[16-y].charAt(e[i])==1)
					return true;
				else if(a[16-y].charAt(e[i])==4&yy>16){
					karakter.ek=16;
					return true;}
			}
		}
			return false;
	},
	sol:function(x,y,xx,yy){
		x+=(xx/32|0)+(xx<0?-1:0);
		xx=xx%32+(xx<0?32:0);
		e=karakter.sinir(32*x+xx,32*y+yy);
		for(i=3;i<6;i++){
			if(18-e[i]>=0){
				if(a[18-e[i]].charAt(x)==1|a[18-e[i]].charAt(x)==4){
					return true;}
				}
			}
			return false;		
	},
	sag:function(x,y,xx,yy){
		x+=(xx/32|0)+(xx<0?-1:0);
		xx=xx%32+(xx<0?32:0);
		e=karakter.sinir(32*x+xx,32*y+yy);
		for(i=3;i<6;i++){
			if(18-e[i]>=0){
				if((a[18-e[i]].charAt(x+2)==1|a[18-e[i]].charAt(x+2)==4)&xx>20){
					return true;}
			}
			}
			return false;		
	},
	sinir:function(x,y){
		l=[x,x+44,y,y+(y%64)];
		for(i=0;i<4;i++){
			l[i]=l[i]/32|0;
		}
		e=[l[0]+(x%32==0?1:0),(l[0]+l[1])/2|0,l[1],l[2]-(x%32==0?1:-1),l[2],l[2]+1,l[3]];
		return e;
		}
};
for (var i =0; i < 9; i++) {
	if(i!=5|i!=6){
	im[i]=il[i]=new Image();
	im[i].src=il[i].src="a"+i+".png";
	im[i].i=il[i].i=i;

}
}
function ab(){
	if(isNaN(im))il;
	karakter.d();
	t.clearRect(0,0,1024,576);
	for(c=0;c<18;c++){
		for(b=0;b<32;b++){

			t.drawImage(im[0],32*b,32*c,32,32);
		}
	}
	for(c=1;c<19;c++){
		for(b=0;b<32;b++){
			//console.log(isNaN(im[a[c].charAt(b)]));
			if(typeof im[a[c].charAt(b)]!="undefined")if(a[c].charAt(b)!=0)
			t.drawImage(im[a[c].charAt(b)],32*b,32*c-32,32,32);
		}
	}
	asansor.ciz();
	if(level==9){t.globalAlpha=0.95;t.fillRect(0,0,1024,576);t.globalAlpha=1;}
	t.drawImage(karakter.r,karakter.x*32+karakter.xx,576-(karakter.y*32+karakter.yy+64),44,64);
	}
boyut=40;
basik=0;
şey=0;
yon=["left","up","right","down"];
del={b:false,s:"Ups, your effecting by the gravitational force of a black hole. When It's happen, escape before you lost your body and soul.Good luck again !"}
function delik(){
	if(şey==0)şey=Math.floor((Math.random() * 4) + 1);
	t.fillRect(0,0,1024,576);
	t.drawImage(im[8],512-6.6*boyut,288-9.6*boyut,13.2*boyut,19.2*boyut);
	document.getElementById("p").innerHTML=yon[şey-1];
	boyut-=0.5;
	if(boyut==0){
		level-=(level==3)?2:3;
		mod=1;
		boyut=40
	}
	if(basik==şey+36){
		mod=1;
		basik=0;
	}
}
var bekle=0,bek=false;
function dongu(){
switch(mod){
	case 0:
	if(!bol[0].b){ 
		document.getElementById('c').style.display="none";
		kon.kay(bol[0].s);
		document.getElementById("p").innerHTML=bol[0].s;
		bol[0].b=true;
		setTimeout("bek=true",1000);
		}
	else{
		if(!kon.s.speaking&bek){
			bek=false;
			mod=1;
			bol[0].b=false;
			document.getElementById('c').style.display="block";
			bol[0].s="";
		}
		}
	break;
	case 1:
	if(!bol[level].b){kon.kay(bol[level].s[tur]);bol[level].b=true;bol[level].f();document.getElementById("p").innerHTML=bol[level].s[tur];
}
	ab();
	break;
	case 2:
	delik();
	break;
	case 3:
	if(tur!=0){mod=2;break;}
	if(!del.b){ 
		document.getElementById('c').style.display="none";
		kon.kay(del.s);
		document.getElementById("p").innerHTML=del.s;
		del.b=true;
		setTimeout("bek=true",1000);
		}
	else{
		if(!kon.s.speaking&bek){
			mod=2;
			bek=false;
			document.getElementById("p").innerHTML="";
			document.getElementById('c').style.display="block";
		}
		}
	break;
	case 4:
	document.getElementById('c').style.display="none";
	son="After than, We all learn that, surprisingly He was right. Who knows,that is luck or destiny. But truth is: there was the time and place that he took the answer he was looking for: the mystery of everything. The answer is too simple and you will not be happy. But it is it. And here it is, the mystery of the all of the  things is ... 42";	
	kon.kay(son);
	document.getElementById("p").innerHTML=son;
			break;
}

setTimeout(dongu,sure);
}
///////////////klavye
onkeydown = (e) => {
	if(mod==1){
	switch(e.keyCode){
  	case 37:
  		karakter.vx=-vx;
  		break;
  	case 38:
  	if(karakter.z|g>0){
  		asansor.dey=false;
  		karakter.vy=vy;
  		karakter.z=false;
  		}//setTimeout("karakter.vy=-vy;",200);
  		break;
  	case 39:
  		karakter.vx=+vx;
  		break;
  	case 40:
  	break;
  	
  }
	}
	if(mod==2){
		basik=e.keyCode;
	}
}
onkeyup = (e) => {
	switch(e.keyCode){
  	case 37:
  		if(karakter.vx==-vx)
		karakter.vx=0;
  		break;
  	case 39:
  		if(karakter.vx==vx)
		karakter.vx=0;
  		break;
  	}
}
function konuş(){
this.s=window.speechSynthesis;
var o,u=new SpeechSynthesisUtterance("");
this.i=0;
this.kay=function(x){
	u=new SpeechSynthesisUtterance(x);
	o=this.s.getVoices();
	for(i=0;i<o.length;i++){
	if(o[i].name=="Google UK English Male"){
		this.i=u.voice=o[i];
}
if(o[i].name=="english-us"){
		
		this.i=u.voice=o[i];
		}
}
this.s.speak(u);
}
}