function q(a){return document.getElementById(a)}
img={e:0};
COLORS=['red','green','blue'];
state={
  stopped:true,
  ended:false,
  width:0,
  height:0,
  arr:[],
  discs:[],
  speeds:[.05,.1,.3,.5],
  speed:2,
  id:0
}
edit={
  
}
/****************************\
EDITOR
\****************************/

function parseEdit(str){
  edit.points=[];
  str=str.split('*');
  var start=str[0].split(','),
  str=str[1],
  width=+str[0],
  l=height=+str[1],
  arr=[],
  i=2,
  j=0,
  d=0,
  c;
  while(l--){
    arr.push([]);
  }
  l=str.length;
  for(;i<l;i++){
    c=str[i];
    if(/\d/.test(c)){
      if(d){
        d+=''+c;
      }
      else{
        d=c-0;
      }
    }
    else{
      if(d){
        while(d--){
          arr[Math.floor(j/width)][j++%width]=c;
        }
      }
      else{
        arr[Math.floor(j/width)][j++%width]=c;
      }
      d=0;
    }
  }
  l=height,i=0;
  for(;i<l;i++){
    arr[i].unshift('b');
    arr[i].push('b');
  }
  c='bbbbbbbbb'.substring(0,width);
  arr.unshift(('c'+c+'N').split(''));
  arr.push(('B'+c+'D').split(''));
  edit.width=width+2;
  edit.height=height+2;
  edit.arr=arr;
  //Add discs
  if(start[0]){
    start.map(function(v,i){
      edit.points.push([+v[0],+v[1]]);
      if(v[2]!==undefined){
        edit.points.push([+v[2],+v[3]]);
      }
    });
  }
  else{
    
  }
  editE();
  drawEdit();
}

function editE(){
  var l=edit.points.length,col=COLORS[Math.floor(l/2)],c=edit.E.getContext('2d');
  c.fillStyle='#b71';
  c.fillRect(10,10,180,180);
  if(l>6)return;
  c.lineWidth=5;
  c.fillStyle=col;
  c.strokeStyle=col;
  if(l%2){
    c.strokeRect(50,50,100,100);
  }
  else{
    c.beginPath();
    c.arc(100,100,50,0,Math.PI*2);
    c.fill();
  }
}

function drawEdit(){
  var w=edit.width,h=edit.height,a=edit.arr,cw=1e3/w,ch=1e3/h,e=q('edit'),c=e.getContext('2d'),i=x=y=0,l=w*h,b;
  c.clearRect(0,0,1e3,1e3);
  //grid
  for(;i<l;i++){
    x=i%w;
    y=Math.floor(i/w);
    b=img[a[y][x]];
    if(b)c.drawImage(b,x*cw,y*ch,cw,ch);
  }
  
  //entry exit points
  edit.points.map(function(v,i){
    var col=COLORS[Math.floor(i/2)];
    c.lineWidth=5;
    c.fillStyle=col;
    c.strokeStyle=col;
    if(i%2){
      c.strokeRect(v[0]*cw+cw/4,v[1]*ch+ch/4,cw/2,ch/2);
    }
    else{
      c.beginPath();
      c.arc(v[0]*cw+cw/2,v[1]*ch+ch/2,cw/4,0,Math.PI*2);
      c.fill();
    }
  });
  
  
}
function reducePoints(x,y){
  var arr=[],test=false;
  edit.points=edit.points.filter(function(v){
    if(test){
      return false;
    }
    else if(v[0]==x&&v[1]==y){
      test=true;
      return false;
    }
    else{
      return true;
    }
  });
}
function saveEdit(){
  var arr=edit.arr,l=edit.width-2,str='',e=document.createElement('div');
  edit.points.map(function(v,i){
    if(!(i%2)){
      str+=',';
    }
    str+=v[0]+''+v[1];
  });
  str=str.slice(1);
  str+='*'+l+l;
  arr=arr.slice(1,l+1);
  arr.map(function(v){
    str+=v.slice(1,l+1).join('');
  });
  if(edit.level!==undefined){
    levels[edit.level]=str;
    edit.level=undefined;
  }
  else{
    levels.push(str);
    e.id=levels.length-1;
    q('levels').appendChild(e);
  }
  q('edit').style.display='';
}

function createNumber(){
  var con=document.createDocumentFragment(),e;
  con.id=numberSelect;
  e=document.createElement('option');
  e.value=0;
  e.innerHTML='No Change';
  con.appendChild(e);
  levels.map(function(v,i){
    e=document.createElement('option');
    e.value=i+1;
    e.innerHTML=i+1;
    con.appendChild(e);
  });
  q('numberSelect').innerHTML='';
  q('numberSelect').appendChild(con);
}
/****************************\
EDITOR
\****************************/

function Disc(start,end,i){
  var t=this,w=state.width;
  if(start[0]&&start[1]){
    t.dir=start[0]!=w-1?[0,-1]:[-1,0];
  }
  else{
    t.dir=start[0]?[0,1]:[1,0];
  }
  w=1000/w;
  t.x=start[0]*w+w/2;
  t.y=start[1]*w+w/2;
  t.start=start;
  t.end=end;
  t.radius=w*.9/2;
  t.color=COLORS[i];
}

function parseLevel(str){
  state.discs=[];
  state.stopped=true;
  state.ended=false;
  str=str.split('*');
  var start=str[0].split(','),
  str=str[1],
  width=+str[0],
  l=height=+str[1],
  arr=[],
  i=2,
  j=0,
  d=0,
  c;
  while(l--){
    arr.push([]);
  }
  l=str.length;
  for(;i<l;i++){
    c=str[i];
    if(/\d/.test(c)){
      if(d){
        d+=''+c;
      }
      else{
        d=c-0;
      }
    }
    else{
      if(d){
        while(d--){
          arr[Math.floor(j/width)][j++%width]=c;
        }
      }
      else{
        arr[Math.floor(j/width)][j++%width]=c;
      }
      d=0;
    }
  }
  l=height,i=0;
  for(;i<l;i++){
    arr[i].unshift('b');
    arr[i].push('b');
  }
  c='bbbbbbbbb'.substring(0,width);
  arr.unshift(('P'+c+'O').split(''));
  arr.push(('X'+c+'S').split(''));
  state.width=width+2;
  state.height=height+2;
  state.arr=arr;
  //Add discs
  start.map(function(v,i){
    var m=[+v[0],+v[1]],n=[+v[2],+v[3]];
    state.discs.push(new Disc(m,n,i));
  });
  state.stopped=true;
  drawDisc();
  drawGame();
}

function countdown(){
  var c=q('game').getContext('2d'),i=3,id;
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='300px sans-serif';
  c.fillStyle='#fff';
  c.fillText(i--,500,500);
  id=setInterval(function(){
    drawGame();
    c.fillStyle='#fff';
    c.fillText(i,500,500);
    if(!i--){
      clearInterval(id);
      drawGame();
      state.stopped=false;
    }
  },1000);
}

function drawGame(){
  var w=state.width,h=state.height,a=state.arr,cw=1e3/w,ch=1e3/h,e=q('game'),c=e.getContext('2d'),i=x=y=0,l=w*h,b;
  c.clearRect(0,0,1e3,1e3);
  //grid
  for(;i<l;i++){
    x=i%w;
    y=Math.floor(i/w);
    b=img[a[y][x]];
    if(b)c.drawImage(b,x*cw,y*ch,cw,ch);
  }
  
  //entry exit points
  state.discs.map(function(v,i){
    var col=COLORS[i],s=v.start,e=v.end;
    c.lineWidth=5;
    c.fillStyle=col;
    c.strokeStyle=col;
    c.beginPath();
    c.arc(s[0]*cw+cw/2,s[1]*ch+ch/2,cw/4,0,Math.PI*2);
    c.fill();
    if(v.safe){
      c.fillRect(e[0]*cw+cw/4,e[1]*ch+ch/4,cw/2,ch/2);
    }
    else{
      c.strokeRect(e[0]*cw+cw/4,e[1]*ch+ch/4,cw/2,ch/2);
    }
  });
  
  
}
function drawDisc(){
  var c=q('disc').getContext('2d');
  c.clearRect(0,0,1e3,1e3);
  state.discs.map(function(v){
    c.fillStyle=v.color;
    c.beginPath();
    c.arc(v.x,v.y,v.radius,0,Math.PI*2);
    c.fill();
  });
}

function flipRow(arr,j){
  var old=arr[j],row=old.slice(1,state.width-1).reverse();
  row.unshift(old[0]);
  row.push(old[old.length-1]);
  arr[j]=row;
}
function flipCol(arr,j){
  var h=arr.length,l=h/2-.5,i=1,t;
  for(;i<l;i++){
    t=arr[i][j];
    arr[i][j]=arr[h-i-1][j];
    arr[h-i-1][j]=t;
  }
}

function turn(d,x,y,dist,m,n,ent){
  var w=1e3/state.width,h=1e3/state.height,pt=[w*x+m*w,h*y+n*h],circ=d.radius*Math.PI*2,angle,
  dif=Math.abs(pt[0]-d.x)>Math.abs(pt[1]-d.y);
  if(d.x>x*w&&d.y>y*h&&d.x<x*w+w&&d.y<y*h+h){
    angle=Math.atan((d.x-pt[0])/(d.y-pt[1]));
    angle=(angle/(Math.PI*2)*circ+dist*d.spin)/circ*Math.PI*2;
    d.dir=[d.spin*Math.cos(angle),d.spin*-Math.sin(angle)];
  }
  else{
    if(ent){
      d.spin=d.spin||(dif^!m)*2-1;
      if(Math.round(d.dir[1])){
        if(d.y-h*y>0^n){
          state.ended=true;
        }
      }
      else{
        if(d.x-w*x>0^m){
          state.ended=true;
        }
      }
    }
    else{
      d.dir=[Math.round(d.dir[0]),Math.round(d.dir[1])];
      d.spin=undefined;
      if(d.dir[0]){
        d.y+=((w*y+w/2)-d.y)/2
      }
      else{
        d.x+=((h*x+h/2)-d.x)/2
      }
    }
  }
}

function cellEnter(d,x,y,distance){
  var cell=state.arr[y][x];
  if(d.start[0]==x&&d.start[1]==y&&(-d.start[0]+1)*d.dir[0]>=0&&(-d.start[1]+1)*d.dir[1]>=0){}
  else if(d.end[0]==x&&d.end[1]==y){}
  else{
    switch(cell){
      case'e':
        break;
      case's':
      case'b':
        state.ended=true;
        break;
      case't':
        d.dir=[d.dir[0]*-1,d.dir[1]*-1];
        d.x+=d.dir[0]*5;
        d.y+=d.dir[1]*5;
        break;
      case'l':
        turn(d,x,y,distance,0,1,1);
        break;
      case'L':
        turn(d,x,y,distance,0,0,1);
        break;
      case'R':
        turn(d,x,y,distance,1,0,1);
        break;
      case'r':
        turn(d,x,y,distance,1,1,1);
        break;
    }
  }
}
function cellExit(d,x,y,distance){
  var cell=state.arr[y][x];
  if(d.start[0]==x&&d.start[1]==y){}
  else if(d.end[0]==x&&d.end[1]==y){//Disc completed
    d.finish=true;
    drawGame();
  }
  else{
    switch(cell){
      case'e':
        break;
      case's':
      case't':
        state.ended=true;
        break;
      case'l':
        turn(d,x,y,distance,0,1);
        break;
      case'L':
        turn(d,x,y,distance,0,0);
        break;
      case'R':
        turn(d,x,y,distance,1,0);
        break;
      case'r':
        turn(d,x,y,distance,1,1);
        break;
    }
  }
}

function gameLoop(T){
  if(state.stopped||state.ended)return;
  var won=true,w=state.width,h=state.height,distance=state.speeds[state.speed]*T;
  state.discs.map(function(v){
    if(won&&v.finish){
      won=true;
    }
    else if(!v.finish){
      won=false;
      cellEnter(v,Math.floor((v.x+v.dir[0]*v.radius)/(1000/w)),Math.floor((v.y+v.dir[1]*v.radius)/(1000/h)),distance);
      cellExit(v,Math.floor((v.x+v.dir[0]*-1*v.radius)/(1000/w)),Math.floor((v.y+v.dir[1]*-1*v.radius)/(1000/h)),distance);
      v.x+=v.dir[0]*distance;
      v.y+=v.dir[1]*distance;
    }
  });
  if(won){
    state.stopped=true;
    var e=q(state.id);
    if(!e.className||e.className[1]<state.speed){
      e.className='s'+state.speed;
    }
    if(levels.every(function(v,i){
      return q(i).className!=='';
    })){
      editor();
    }
    q('game').style.display='';
    q('disc').style.display='';
  }
  drawDisc();
}

function editor(){
  q('editIcon').style.display='block';
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
animLoop(gameLoop);

(function createImages(){
  var e,c,l=200,t;
  //Stone
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=2;
  c.fillStyle='#aaa';
  c.strokeStyle='#666';
  rect(c,l);
  img.s=e;
  //Tire
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=2;
  c.fillStyle='#222';
  c.strokeStyle='#666';
  rect(c,l);
  img.t=e;
  //down-left
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=200;
  c.strokeStyle='rgba(0,0,0,.5)';
  c.beginPath();
  c.moveTo(0,100);
  c.arcTo(100,100,100,200,100);
  c.stroke();
  img.l=e;
  //down-right
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=200;
  c.strokeStyle='rgba(0,0,0,.5)';
  c.beginPath();
  c.moveTo(200,100);
  c.arcTo(100,100,100,200,100);
  c.stroke();
  img.r=e;
  //up-Right
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=200;
  c.strokeStyle='rgba(0,0,0,.5)';
  c.beginPath();
  c.moveTo(100,0);
  c.arcTo(100,100,200,100,100);
  c.stroke();
  img.R=e;
  //up-left
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=200;
  c.strokeStyle='rgba(0,0,0,.5)';
  c.beginPath();
  c.moveTo(100,0);
  c.arcTo(100,100,0,100,100);
  c.stroke();
  img.L=e;
  //Border
  e=creCanvas(l);
  c=e.getContext('2d');
  c.lineWidth=2;
  c.fillStyle='#b71';
  c.strokeStyle='#666';
  rect(c,l);
  img.b=e;
  t=e;
  //Reset
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillText('\u21BB',100,100);
  img.O=e;
  //Play
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillText('\u25B6',100,100);
  img.P=e;
  //Back
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillText('\u2190',100,100);
  img.X=e;
  //Speed
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillText('\u27A0',100,100);
  img.S=e;
  //Dimensions
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillText('\u25A6',100,100);
  img.D=e;
  //Choose level
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='60px sans-serif';
  c.fillText('1',100,60);
  c.fillText('2',60,140);
  c.fillText('3',140,140);
  img.N=e;
  //Save/Back
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillText('\u261C',100,100);
  img.B=e;
  //clear
  e=creCanvas(l);
  c=e.getContext('2d');
  c.textAlign='center';
  c.textBaseline='middle';
  c.font='180px sans-serif';
  c.fillStyle='red';
  c.fillText('\u22A0',100,100);
  img.c=e;
  //Entry/Exit
  e=creCanvas(l);
  c=e.getContext('2d');
  c.drawImage(t,0,0);
  img.E=e;
  edit.E=e;
  
  function creCanvas(l){
    var e=document.createElement('canvas');
    e.width=l;
    e.height=l;
    return e;
  }
  function rect(c,l){
    c.beginPath();
    c.moveTo(9,0);
    c.arcTo(l,0,l,l,9);
    c.arcTo(l,l,0,l,9);
    c.arcTo(0,l,0,0,9);
    c.arcTo(0,0,l,0,9);
    c.fill();
    c.stroke();
  }
})();

(function createMenu(){
  var con=document.createDocumentFragment();
  'cEstRLrl'.split('').map(function(v){
    img[v].id=v;
    con.appendChild(img[v]);
  });
  q('menu').appendChild(con);
})();

(function createHelp(){
  var con=document.createDocumentFragment(),e,i;
  help.map(function(v){
    v=v.split('*');
    e=document.createElement('div');
    e.className='row';
    e.innerHTML=v[1];
    i=new Image();
    if(img[v[0]]){
      i.src=img[v[0]].toDataURL();
      e.appendChild(i);
    }
    con.appendChild(e);
  });
  q('help').appendChild(con);
})();

(function addLevels(){
  var i=0,l=levels.length,con=document.createDocumentFragment(),e;
  for(;i<l;i++){
    e=document.createElement('div');
    e.id=i;
    con.appendChild(e);
  }
  q('levels').appendChild(con);
})();

q('levels').onclick=function(e){
  var id=e.target.id;
  if(/^\d+$/.test(id)){
    q('game').style.display='block';
    q('disc').style.display='block';
    state.id=id;
    parseLevel(levels[id]);
  }
  else if(id=='helpIcon'){
    q('help').style.display='block';
  }
}

q('helpClose').onclick=function(){
  q('help').style.display='';
}

q('editIcon').onclick=function(){
  q('edit').style.display='block';
  edit.width=5;
  edit.height=5;
  parseEdit('*5525e');
}

q('menu').onclick=function(e){
  var id=e.target.id;
  edit.arr[0][0]=id;
  edit.tile=id;
  drawEdit();
  q('menu').style.display='';
}

q('edit').onclick=function(e){
  var x=e.pageX-this.offsetLeft,y=e.pageY-this.offsetTop,
  W=edit.width,H=edit.height,
  w=this.offsetWidth/W,h=this.offsetHeight/W,
  t=edit.tile,
  i,c,borderPoint=false;
  x=Math.floor(x/w);
  y=Math.floor(y/h);
  i=W*y+x;
  edit.points.map(function(v){
    if(v[0]==x&&v[1]==y){
      borderPoint=true;
    }
  });
  
  if(x==0||x==W-1){
    if(y==0){
      if(x){
        //Levels
        createNumber();
        q('number').style.display='block';
      }
      else{
        //Menu
        q('menu').style.display='block';
        
      }
    }
    else if(y==H-1){
      if(x){
        //Size
        q('size').style.display='block';
      }
      else{
        //Back
        saveEdit();
      }
    }
    else{
      //EE
      if(t=='E'&&edit.points.length<6&&!borderPoint){
        edit.points.push([x,y]);
      }
      else if(t=='c'&&borderPoint){
        reducePoints(x,y);
      }
      editE();
      drawEdit();
    }
  }
  else if(y==0||y==H-1){
    //EE
    if(t=='E'&&edit.points.length<6&&!borderPoint){
      edit.points.push([x,y]);
    }
    else if(t=='c'&&borderPoint){
      reducePoints(x,y);
    }
    editE();
    drawEdit();
  }
  else{
    if(t=='c'){
      edit.arr[y][x]='e';
      drawEdit();
    }
    else if(t!='E'){
      edit.arr[y][x]=t;
      drawEdit();
    }
  }
}

q('numberClose').onclick=function(){
  q('number').style.display='';
  var v=q('numberSelect').value;
  if(v-0){
    parseEdit(levels[v-1]);
    edit.level=v-1;
  }
}

q('sizeClose').onclick=function(){
  var l=document.querySelector('input[name="size"]:checked').value;
  q('size').style.display='';
  parseEdit('*'+l+l+l*l+'e');
}

q('game').onclick=function(e){
  var x=e.pageX-this.offsetLeft,y=e.pageY-this.offsetTop,
  W=state.width,H=state.height,
  w=this.offsetWidth/W,h=this.offsetHeight/W,
  i,c;
  x=Math.floor(x/w);
  y=Math.floor(y/h);
  i=W*y+x
  if(x==0||x==W-1){
    if(y==0){
      if(x){
        //Reset
        parseLevel(levels[state.id]);
      }
      else{
        //Play
        if(state.ended){
          parseLevel(levels[state.id]);
          countdown();
        }
        else if(state.stopped){
          countdown();
        }
      }
    }
    else if(y==H-1){
      if(x){
        //Speed
        if(state.stopped||state.ended){
          q('speed').style.display='block';
        }
      }
      else{
        //Back
        state.ended=true;
        q('game').style.display='';
        q('disc').style.display='';
      }
    }
    else{
      flipRow(state.arr,y);
      drawGame();
    }
  }
  else if(y==0||y==H-1){
    flipCol(state.arr,x);
    drawGame();
  }
  else{ 
    c=state.arr[y][x];
    if(/[rlRL]/.test(c)){
      state.arr[y][x]={r:'L',l:'R',R:'l',L:'r'}[c];
    }
    drawGame();
  }
}

q('speedClose').onclick=function(){
  state.speed=document.querySelector('input[name="speed"]:checked').value;
  q('speed').style.display='';
}