var q=a=>document.getElementById(a);
var Q=(a,b)=>document['querySelector'+(b?'All':'')](a);
var R=a=>Math.floor(Math.random()*a);
var j2d=function F(a,sub){
  //v0.14
  var cre=function(obj,num){//Creates the HTML element
    var ele=document.createElement(obj.tag),ind,val;
    for(ind in obj){
      if(!/cn|ch|num|tag|txt|obj|css|js|mix/.test(ind)){
        val=obj[ind];
        val=((val.push?val[num]:val)+'').replace('$',num+1);
	      ele[ind]=val;
      }
    }
    if(obj.txt){
      val=obj.txt;
      val=((val.push?val[num]:val)+'').replace('$$',num+1);
      ele.innerHTML=val;
    }
    if(obj.css){
      var prop,style=obj.css;
      style=style.push?style[num]:style;
      for(prop in style){
        ele.style[prop]=style[prop];
      }
    }
    if(obj.js){
      var eve,eveObj=obj.js,fn,pre;
      ele.attachEvent?(fn='attachEvent',pre='on'):(fn='addEventListener',pre='');
      for(eve in eveObj){
        if(typeof eveObj[eve]=='function'){
          eveObj[eve]=[eveObj[eve]]
        }
        var l=eveObj[eve].length;
        while(l--){
          ele[fn](pre+eve,eveObj[eve][l])
        }
      }
    }
    if(obj.ch){
      val=obj.ch
      var x,el,o,out=[],i=0,l=val.length;
      for(;i<l;i++){
        el=val[i];
        o={};
        for(x in el){
          if(/ch/.test(x)){
            o[x]=el[x][0].push?el[x][num]:el[x];
          }
          else if(el[x].push){
            o[x]=el[x][num];
          }
          else{
            o[x]=el[x];
          }
        }
        out.push(o);
      }
      ele.appendChild(F(out,sub));
    }
    if(obj.cn){
      val=obj.cn;
      val=val[0].push?val[num]:val;
      ele.appendChild(F(val,sub));
    }
    return ele;
  }
  var merge=function(a,b){
    if(sub&&a.obj){
      var o=a.obj,x,i,l,rx,res;
      for(x in o){
        res=o[x];
        if(typeof res=='string'){
          res=[res];
        }
        i=0,l=res.length;
        for(;i<l;i++){
          if(res[i][0]=='_'){
            rx = new RegExp(res[i],'g');
            a[x]=a[x].replace(rx,sub[res[i]]);
          }
          else{
            a[x]=sub[res[i]];
          }
        }
      }
    }
    b.num=a.num||1;
    for(var x in a){
      b[x]=a[x];
      //If it is the cn prop check to see if it is an array of arrays if both are true get the length
      //or if its not check if it is an array and get the length
      if((/cn|ch/.test(x)&&a[x][0].push)||(!/cn|ch/.test(x)&&a[x].push)){b.num=a[x].length}
    }
    return b;
  }
  a.push||(a=[a]);
  var num,i,child,para,mix,mixP,//intialize
      frag=document.createDocumentFragment(),//Document fragment to hold elements
      len=a.length,j=0;//loop vars
  for(;j<len;j++){
    child=a[j],i=0,para=merge(child,{}),num=para.num;
    mix===undefined&&child.mix&&(mix=j,mixP=frag.childNodes.length);//Set position to start mix - only used if there are unmixed starting elements
    for(;i<num;i++){
      if(child.mix&&mix<j){//Intersperse the nodes
        frag.insertBefore(cre(para,i),frag.childNodes[(i+1)*(j-mix+1)-1+mixP]);
      }
      else{
        frag.appendChild(cre(para,i));
      }
    }
  }
  return frag;
}


function Player(){
  this.ley={e:200,a:200,f:200,w:200};
  this.rate={a:.001,e:.001,f:.001,w:.001}
}
Player.prototype.updateLey=function(T){
  var v=this.ley,r=this.rate;
  v.a+=r.a*T;
  v.e+=r.e*T;
  v.f+=r.f*T;
  v.w+=r.w*T;
}
function Creep(type,x,y,gx,gy){
  this.type=type;
  this.health=100;
  this.step=0;
  this.x=x;
  this.y=y;
  this.sx=x;
  this.sy=y;
  this.gx=gx;
  this.gy=gy;
  this.damage=20;
  this.speed=D/10/3;
  this.time=0;
  if(type=='a'){
    this.speed=D/10;
  }
  else if (type=='w'){
    this.speed=D/10/5;
  }
}
Creep.prototype.fire=function(){
  var m=this;
  attackList[PATH[m.step]].forEach(function(a){
    if(a.cool||Human.ley[a.ley]===0)return;
    m.health-=a.damage*multiplier(m.type,a.ley);
    a.cool=1;
    var c=getCoord(a.loc);
    if(m.type=='f'&&a.ley=='a'){
      m.damage=30;
    }
    if(m.type=='d'&&a.ley=='f'){
      m.damage+=25;
    }
    if(m.type=='e'&&a.ley=='w'){
      m.speed=D/10/8;
    }
    shots.push([c.x+c.w/2,c.y+c.h/2,m.x,m.y,colors[a.ley],25]);
  });
  if(m.health<0){ 
    return true;
  }
}
function multiplier(a,b){
  if(a=='a'&&b=='f'||a=='e'&&b=='a'||a=='f'&&b=='w'||a=='w'&&b=='e')return 10;
  return 1;
}
Creep.prototype.move=function(T){
  var m=this,d=Math.sqrt(Math.pow(m.gx-m.sx,2)+Math.pow(m.gy-m.sy,2)),p=(d/m.speed),r;
  m.time+=T;
  r=(m.time/1e3)/p;
  m.x=(m.gx-m.sx)*r+m.sx;
  m.y=(m.gy-m.sy)*r+m.sy;
  if(m.time/1000>=p){
    m.x=m.sx=m.gx;
    m.y=m.sy=m.gy;
    m.time=0;
    m.step++;
    var s=m.step;
    if(s+1===PATH.length){
      damage(m.damage);
      return true;
    }
    else{
      var c=getCoord(PATH[s+1]);
      if(PATH[s+1]-PATH[s]==10){
        m.gx=c.x+R(c.w);
        m.gy=c.y;
      }
      else if(PATH[s+1]-PATH[s]==-10){
        m.gx=c.x+R(c.w);
        m.gy=c.y+c.h;
      }
      else if(PATH[s+1]-PATH[s]==1){
        m.gx=c.x+c.w;
        m.gy=c.y+R(c.h);
      }
      else{
      }
    }
  }
}
function Building(ref,loc){
  this.ref=ref;
  this.type=ref[1].toLowerCase();
  this.ley=ref[0];
  this.health=100;
  this.damage=this.ley=='t'?0:20;
  this.loc=loc;
  this.cool=0;
}
//Global game values//
var buildType;
var creeps=[];
var buildList=[];
var ARR=new Array(100);
var PATH=[40,41,51,61,71,72,73,63,53,43,33,23,13,14,15,16,17,27,37,47,57,67,68,69,59,49];
var attackList={};
PATH.forEach(a=>attackList[a]=[]);
var attackTime=7e3;
var attacking=false;
var paused=false;
var attacks=0;
var shots=[];
var totalTime=0;
//Dimension of one side of the base
var D=0;
colors={
  a:'#eee',
  e:'#520',
  f:'#f11',
  w:'#7af'
};
values={
  E:0,
  A:0,
  F:0,
  W:0
};
buildings={
  aT:{s:'a',n:0},
  eT:{s:'e',n:0},
  fT:{s:'f',n:0},
  wT:{s:'w',n:0},
  aC:{s:'a',n:0},
  eC:{s:'e',n:0},
  fC:{s:'f',n:0},
  wC:{s:'w',n:0}
};
function gameLoop(T){
  if(paused)return;
  Human.updateLey(T);
  if(attackTime<=0){
    attack();
  }
  if(attackTime<5e3){
    var cl=q(PATH[0]+1).classList;
    !cl.contains('alert')&&cl.add('alert');
  }
  if(attacking&&creeps.length==0){
    attacking=false;
    q('can').style.display='';
  }
  if(attacking){
    creeps=creeps.filter(function(a){
      return !a.move(T);
    });
    buildList.forEach(function(a){
      a.cool-=T/1e3;
      if(a.cool<0)a.cool=0;
    });
    creeps=creeps.filter(function(a){
      return !a.fire();
    });
  }
  else{
    attackTime-=T;
  }
  updateUI();
}

function updateUI(){
  //Resource update
  var v=Human.ley;
  q('aDis').innerHTML=Math.floor(v.a);
  q('eDis').innerHTML=Math.floor(v.e);
  q('fDis').innerHTML=Math.floor(v.f);
  q('wDis').innerHTML=Math.floor(v.w);
  drawCreeps();
  drawShots();
}

function animLoop(render){
    var running, lastFrame=+new Date;
    function loop(now){
        // stop the loop if render returned false
        if (running!==false){
            requestAnimationFrame(loop);
            var T=now-lastFrame;
            if(T<100&&T>0){
              running = render(T);
            }
            lastFrame = now;
        }
    }
    loop(lastFrame);
}

function drawShots(){
  var can=q('can'),c=can.getContext('2d');
  shots=shots.filter(function(a){
    c.beginPath();
    c.moveTo(a[0],a[1]);
    c.lineTo(a[2],a[3]);
    c.strokeStyle=a[4];
    c.stroke();
    c[5]--;
    return c[5];
  });
}

function drawCreeps(){
  var can=q('can'),c=can.getContext('2d');
  c.clearRect(0,0,can.width,can.height);
  creeps.forEach(function(a){
    circle(c,a.x,a.y,colors[a.type]);
  });
}

function circle(c,x,y,col){
  c.fillStyle=col;
  c.beginPath();
  c.arc(x,y,D/100,0,Math.PI*2);
  c.fill();
}

function damage(a){
  if(buildList.length===0){
    paused=true;
    q('lost').style.display='block';
    q('sec').innerHTML=((new Date())-totalTime)/1000;
    return;
  }
  var i=R(buildList.length),b=buildList[i];
  b.health-=a;
  if(b.health<=0){
    buildList.splice(i,1);
    buildings[b.ref].n--;
    ARR[b.loc]='';
    q(b.loc+1).className='cell';
  }
}

function getCoord(i){
  var e=q(i+1);
  return {x:e.offsetLeft,y:e.offsetTop,w:e.offsetWidth,h:e.offsetHeight};
}

function attack(){
  q(PATH[0]+1).classList.remove('alert');
  q('can').style.display='block';
  attackTime=R(5e3)+10e3;
  attacking=true;
  generateCreeps();
  attacks++;
}

function generateCreeps(){
  var l=attacks*5+R(5)+1,t=['a','e','f','w'],c=getCoord(PATH[0]);
  while(l--){
    creeps.push(new Creep(t[R(4)],0,c.y+c.w/2,c.x+c.w,c.y+R(c.h)));
  }
}

function build(e){
  var ele=e.originalTarget;
  Array.prototype.forEach.call(ele.parentNode.children,a=>a.style.border='');
  ele.style.border='1px solid gold';
  buildType=ele.id;
  q('cost').innerHTML=buildings[buildType].n*200+200;
}

function action(e){
  var ele=e.originalTarget,i=ele.id-1;
  if(ARR[i]){
    return;
  }
  else if(buildType){
    var o=buildings[buildType],cost=o.n*200+200,t='t';
    if(Human.ley[o.s]>cost){
      Human.ley[o.s]-=cost;
      if(buildType[1]=='C'){
        Human.rate[o.s]+=.001;
        t='c';
      }
      q(i+1).className+=' '+o.s+t+'bg';
      o.n++;
      var b=new Building(buildType,i);
      ARR[i]=b;
      buildList.push(b);
      if(buildType[1]=='T'){
        if(ARR[i-11]==9){
          attackList[i-11].push(b);
        }
        if(ARR[i-10]==9){
          attackList[i-10].push(b);
        }
        if(ARR[i-9]==9){
          attackList[i-9].push(b);
        }
        if(ARR[i+11]==9){
          attackList[i+11].push(b);
        }
        if(ARR[i+10]==9){
          attackList[i+9].push(b);
        }
        if(ARR[i+9]==9){
          attackList[i+9].push(b);
        }
        if(ARR[i+1]==9){
          attackList[i+1].push(b);
        }
        if(ARR[i-1]==9){
          attackList[i-1].push(b);
        }
      }
      //Clear build
      q('cost').innerHTML='';
      q(buildType).style.border='';
      buildType='';
    }
    else{
      q(o.s+'Dis').style.border='2px dashed red';
      setTimeout(a=>q(o.s+'Dis').style.border='',2e3)
    }
  }
  else{
    return;
  }
}

var Human = new Player();
var Computer = new Player();

(function startup(){
  var FS=((b,c,d,e,f,g)=>(a=>({name:a?a+(a==f?'':'Is')+c:b,eve:a+b+'change',req:a+(a?'R':'r')+'equest'+(a?c:d),exit:a+(a?e+c:'exit'+d)}))
      ((D=>D[f+e+c]?f:D[g+e+c]?g:'')(document)))('fullscreen','FullScreen','Fullscreen','Cancel','moz','webkit');
  q('start').onclick=function(){
    q('gameCon').style.display='block';
    q('gameCon')[FS.req](Element.ALLOW_KEYBOARD_INPUT);
    var w=screen.width;
    var h=screen.height;
    var v,d,i;
    //alert(h,w);
    if(h>w){
      v=w;
      d='height';
      i='Top';
    }
    else{
      v=h;
      d='width';
      i='Left';
    }
    D=v;
    //Build HTML and set event handlers
    q('gameCon').style['padding'+i]=v+'px';
    q('base').style[d]=v+'px';
    q('can').width=v;
    q('can').height=v;
    q('base').appendChild(j2d({tag:'div',id:'$',className:'cell',num:100}));
    PATH.forEach(a=>{ARR[a]=9;q(a+1).style.background='#db8'});
    q('base').onclick=action;
    q('build').onclick=build;
    totalTime=new Date();
    animLoop(gameLoop);
  };
})()