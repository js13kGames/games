const{init,GameLoop,Scene,GameObject,Button,Sprite,initPointer,track,bindKeys,Text}=kontra;const{canvas,context}=init();initPointer();kontra.initKeys();gameState=0;stateInit=!1;preSetup=!1;initProcessing=!1;load=null;titleObj=null;conObj=null;cntObj=null;startObj=null;sceneChange=-1;timer=0;cPlayer=null;helth=5;cPlayerID=null;players=[];opponents=[];pX=-10;pY=-10;gridX=16;gridY=16;isoX=16;isoY=9;scene=null;chunks=[];isoCells=[];isoHLT=null;cCVS=document.getElementById('compileIMG');blocks=[];blocksB=[];mX=10;mZ=15;tX=0
tZ=0;gX=!1;gZ=!1;cR=["#FFF","#000","","","","",""]
chunk0=Sprite({x:150,y:10,width:gridX*(isoX*2),height:gridY*(isoY*2),});cPlayer=Sprite({x:pX,y:pY,});fstTm=2;function CreateStarBlock(array,d,s){let rY=Math.random()*1+s;const block=Sprite({type:'block',x:Math.floor(Math.random()*(canvas.width*2-0))+0,y:Math.floor(Math.random()*canvas.width)+1,color:'white',width:d,height:d,dy:rY/1.75,dx:-rY,});array.push(block)}
function TitleGlitch(){x=~~mX;x==x%6&&x&1&&CrT();mX<=0?(gX=!gX,gX?(tX=Rand(0,12)|0,mX=Rand(0.3,10)):(mX=Rand(5,10),tX=-1,CrT())):(mX-=0.05);z=~~mZ;z==z%6&&z&1&&CrT();mZ<=0?(gZ=!gZ,gZ?(tZ=Rand(0,12)|0,mZ=Rand(0.3,10)):(mZ=Rand(5,10),tZ=-1,CrT())):(mZ-=0.05)}
function CrT(){titleObj=null;InitTitle(tX,tZ)}
function Loading(){load=Text({x:6,y:10,text:'Loading...',color:'#FFFFFF',font:'16px Verdana, bold, sans-serif'})}
function SceneSwitch(){stateInit=!1;if(sceneChange==0){gameState=0}else if(sceneChange==1){gameState=1}else if(sceneChange==2){gameState=2}else if(sceneChange==3){gameState=3}else if(sceneChange==4){gameState=0}
  sceneChange=-1}
function InitStartState(){InitTitle(-1,-1);InitStart();MKTxt("13",414,300,sm);MKTxt("by alex delderfield for js  k",196,300,sm);for(let i=0;i<8;i++){CreateStarBlock(blocks,4,2)}
  for(let i=0;i<10;i++){CreateStarBlock(blocksB,2,0.2)}}
function InitSetupState(){MKSqr(30,30,canvas.width-60,canvas.height-60,'#444');MKBt(500,250,95,32,'#666',2,"drop")
  MKTxt("setup for subspace drop",30,40,sm);MKTxt("connection active",450,40,sm);MKTxt("set id",28,100,md);MKTxt("xxx",140,100,md);MKTxt("set sector",28,140,md);MKTxt("00",230,140,md)}

function DrawGrid(){for(var i=0;i<helth;i++){MKGr(45,610-(i*28),2,md)}
  if(chunk0==null){chunk0=Sprite({x:150,y:10,width:gridX*(isoX*2),height:gridY*(isoY*2),color:'#333333',})}
  scene=Scene({id:'game',children:[chunk0]});BuildIsoGrid();cPlayer=Sprite({x:pX,y:pY,image:smLT[50],});chunk0.addChild(cPlayer)}


function BuildIsoGrid(){for(let i=0;i<gridY;i++){for(let j=0;j<gridX;j++){let pos=ConvertISOToScreenPos(chunk0,i,j);CreateIsoElement(pos[0],pos[1])}}}
function CreateIsoElement(xIn,yIn){const isoSQR=Sprite({x:xIn,y:yIn,width:0,image:smLT[46],});track(isoSQR);chunk0.addChild(isoSQR)}
canvas.addEventListener('mousemove',event=>{if(gameState==2){let bound=canvas.getBoundingClientRect();let xM=event.clientX-bound.left-canvas.clientLeft;let yM=event.clientY-bound.top-canvas.clientTop;let cursPos=SetToGrid(xM,yM);isoHLT.x=cursPos[0]-14;isoHLT.y=cursPos[1]-6}})

function InitGameState(){MKTxt("subspace sector  00",4,30,sm);MKBt(10,280,32,32,'#666',69,"q")
  MKGr(36,60,50,md);isoHLT=Sprite({x:0,y:0,image:smLT[47],});addRQSP(isoHLT)}
function CreateUserObj(xIn,yIn){var p=ConvertISOToScreenPos(chunk0,xIn-0.5,yIn-0.5);const userObj=Sprite({x:p[0],y:p[1],image:smLT[50],});chunk0.addChild(userObj);opponents.push(userObj)}
function RefreshOnConnection(){for(let i=0;i<players.length;i++){players[i].isActive=!1}
  players.length=0;players=[];RefreshPlayers()}
//Functions called by CLIENT
function SetClientPosition(id, x, y) {
  //init creation
  if(cPlayerID == null) {
    cPlayerID = id; //set ID
    const user = new User(id, x, y, 5);

    cPlayerUsr = user;
    players.push(user);
  }

  cPlayerUsr.x = x;
  cPlayerUsr.y = y;

  var p = ConvertISOToScreenPos(chunk0, cPlayerUsr.x -0.5, cPlayerUsr.y -0.5);
  pX= p[0];
  pY= p[1];
}
function RefreshPlayers(){for(let i=0;i<opponents.length;i++){opponents[i].isActive=!1;chunk0.removeChild(opponents[i])}
  opponents.length=0;opponents=[]
  for(let i=0;i<players.length;i++){if(players[i].id!=cPlayerID){CreateUserObj(players[i].x,players[i].y)}}}
//for updating opponent positions
function SetOpponentPosition(id,x,y){for(let i=0;i<players.length;i++){if(players[i].id==id){players[i].x=x;players[i].y=y;RefreshPlayers()
  return}}
//Create/Remove opponents
function SetUser(id, val, x, y, rad) {
  if (val == 0) {
    players.splice(players.indexOf(id), 1);

    RefreshPlayers();

  } else if (val == 1) {
    const user = new User(id, x, y, rad);
    players.push(user);
    RefreshPlayers();
  }
}
const loop=GameLoop({update:()=>{if(sceneChange!=-1){if(timer>0){timer-=0.1}else{SceneSwitch();clearRenderQ()}}
    blocks.map(block=>{block.update();if(block.y>canvas.height||block.x<0){block.y=-block.height;block.x=Math.floor(Math.random()*(canvas.width*2-0))+0}});blocksB.map(block=>{block.update();if(block.y>canvas.height||block.x<0){block.y=-block.height/2;block.x=Math.floor(Math.random()*(canvas.width*2-0))+0}});if(gameState==0){if(!initProcessing&&!preSetup){Loading();InitPreLoad();preSetup=!0}
      if(!initProcessing&&preSetup){ProcessLetters()}
      if(!stateInit&&initProcessing){load=null;if(cPlayerID==null){SetMessage()}else{SetMessage("session connected")}
        InitStartState();stateInit=!0}
      if(stateInit){TitleGlitch()}}else if(gameState==1){if(!stateInit){InitSetupState();stateInit=!0}}else if(gameState==2){if(!stateInit){InitGameState();DrawGrid();stateInit=!0}
      if(cPlayer!=null){cPlayer.x=pX;cPlayer.y=pY}
      if(fstTm>=0.1){fstTm-=0.1}else if(fstTm>=0){RefreshPlayers();fstTm=-1}}else if(gameState==3){}},render:()=>{if(conObj)conObj.render();if(cntObj)cntObj.render();if(gameState==0){if(load){load.render()}
    blocksB.map(block=>block.render());if(titleObj){titleObj.render()}
    if(startObj){startObj.render()}
    blocks.map(block=>block.render())}else if(gameState==1){}else if(gameState==2){blocksB.map(block=>block.render());rQ.sp.forEach(element=>{element.obj.render()});if(chunk0){chunk0.render()}
    blocks.map(block=>block.render())}else if(gameState==3){}
    rQ.ui.forEach(element=>{element.obj.render()})}});loop.start()
class User{constructor(id,x,y,rad){this.id=id;this.x=x;this.y=y;this.combat=!1;this.attRad=rad}}
bindKeys(['left','a'],function(e){document.getElementById("left").click()},'keyup');bindKeys(['right','d'],function(e){document.getElementById("right").click()},'keyup');bindKeys(['up','w'],function(e){document.getElementById("up").click()},'keyup');bindKeys(['down','s'],function(e){document.getElementById("down").click()},'keyup')}