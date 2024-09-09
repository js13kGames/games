'use strict';const canvas=document.getElementById("screen");const ctx=canvas.getContext('2d');function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
ctx.canvas.width=608;ctx.canvas.height=360;var ac=new AudioContext();let tempo=120;let beepNote=new TinyMusic.Note('F3 0.0125');let beepSnd=new TinyMusic.Sequence(ac,tempo);beepSnd.gain.gain.value=0.06;beepSnd.push(beepNote);beepSnd.loop=!1;let walkNote=new TinyMusic.Note('G2 s');let walkSnd=new TinyMusic.Sequence(ac,tempo);walkSnd.gain.gain.value=0.25;walkSnd.push(walkNote);walkSnd.loop=!1;let killNote=new TinyMusic.Note('B2 s');let killSnd=new TinyMusic.Sequence(ac,tempo/2);killSnd.waveType="sine";killSnd.gain.gain.value=0.12;killSnd.staccato=0;killSnd.bass.gain.value=30;killSnd.treble.gain.value=15;killSnd.push(killNote);killSnd.loop=!1;let goodNote=new TinyMusic.Note('C5 s');let goodSnd=new TinyMusic.Sequence(ac,tempo);goodSnd.waveType="sine";goodSnd.gain.gain.value=0.10;goodSnd.push(goodNote);goodSnd.loop=!1;var level_1=`
#############
##.........##
##.s.....i.##
##.........##
#############
##.........##
##.p.....e.##
##.........##
#############
`;var level_2=`
#############
#...####....#
#.#.####e.i.#
#.#....#....#
#.####.#.####
#....#.#....#
####.#.####.#
#p..s#......#
#############
`;var level_3=`
#############
######.....e#
######.....i#
######..##.##
#e......#...#
#i.e.#..#i.e#
######..#####
###p......s##
#############
`;var level_4=`
#############
##...#...#.e#
##ei...#...i#
######.######
#s........e##
###.##.######
###e##p######
######i######
#############
`;var level_5=`
#############
##e.i#.....##
###.##.###.##
#s.....###p##
######.######
###e.......##
#####i.e#ie##
#############
#############
`;var level_6=`
#############
#ie##e.....i#
#....##.#####
####.......e#
##...####.###
###.##.....s#
#......######
#i####.....p#
#############
`;var level_7=`
#############
####e...i####
######.######
##.......####
#e.#..##.####
#.i##.i...p##
#.....#######
#####.s...e##
#############
`;var level_8=`
#############
####i....#e##
#e###.e#...i#
#......###s##
##..#......##
##p###.###e##
######i######
#############
#############
`;var level_9=`
#############
###i.....####
###...##..###
##...#e.#..##
#..e..#..i..#
##.....#...##
###.....#.###
####...p#.se#
#############
`;var levels=[level_1,level_2,level_3,level_4,level_5,level_6,level_7,level_8,level_9];var paths=[];let h;for(h=0;h<levels.length;h++)paths.push("");var secondTry=!1;var currentLevelIndex=0;const gridSize=32;var takeInput=!1;var timer=13;var target="e";var goal=0;var enableSkins=!1;var playerSpriteIndex=0;var score=0;var animationCounter=0;var transition=!1;var this_level=levels[currentLevelIndex].split("\n");setupGoal(target);takeInput=!0;var RFD;var moveShadowCounter=0;var shadowPlayerInterval=290;var monoSprite=new Image();monoSprite.src="spritesExtended.png";let spriteIndex=0;let enemySprites=[2,7,9,11,13];let innocentSprites=[4,8,10,12,14];Mousetrap.bind('shift',function(){if(enableSkins){if(spriteIndex<innocentSprites.length-1){spriteIndex+=1}else{spriteIndex=0}}},"keypress");let enemy={width:gridSize,height:gridSize,color:"red"};let hazard={width:gridSize,height:gridSize,color:"orange"};let innocent={width:gridSize,height:gridSize,color:"blue"};let wall={width:gridSize,height:gridSize,color:"black"};let player={width:gridSize,height:gridSize,x:0,y:0,key:'p',color:"green"};let shadowPlayer={width:gridSize,height:gridSize,x:0,y:0,key:'p',color:"yellow"};function gotoNextLevel(){if(secondTry==!1){secondTry=!0;this_level=levels[currentLevelIndex].split("\n");target='i';setupGoal(target);moveShadowCounter=0;player.key='s'}else{secondTry=!1;player.key='p';if(currentLevelIndex<levels.length-1){currentLevelIndex++;this_level=levels[currentLevelIndex].split("\n");target='e';setupGoal(target)}else{clearInterval(main);gameWin();console.log("end of game")}}}
function setupGoal(target){let y;let x;goal=0;for(y=0;y<this_level.length;y++){for(x=0;x<this_level[1].length;x++){if(this_level[y][x]==target){goal++}}}}
var oldScore=0;function levelTransition(timeout){clearTimeout(timerHandler);clearTimeout(shadowPlayerMoving)
if(oldScore==0){oldScore=timer;score+=timer}
timerRunning=!0;timer=13;ctx.fillStyle="black";let levelHeight=(this_level.length-2)*gridSize;if(animationCounter<levelHeight){animationCounter++;setTimeout(function(){timeout=timeout/4
levelTransition(timeout)},timeout)}else{gotoNextLevel();levelTransitionEnd(100)}}
function levelTransitionEnd(timeout){if(animationCounter>0){animationCounter--;setTimeout(levelTransitionEnd,timeout/2)}else{oldScore=0;takeInput=!0;transition=!1;timer=13;timerRunning=!1;clearTimeout(shadowPlayerMoving)
if(secondTry==!0)shadowPlayerMoving=setTimeout(moveShadowPlayer,shadowPlayerInterval)}}
var slowTextCounter=0;var queueCounter=0;var slowTextHandler;async function drawPixelTextSlow(message,x,y,size,delay,color="white"){if(queueCounter<message.length){if(slowTextCounter<message[queueCounter].length){if(message[queueCounter]==="narrator"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"magenta");beepSnd.play()}else if(message[queueCounter]==='\n'){queueCounter++;slowTextCounter=-1;y+=gridSize
x=-8}else if(message[queueCounter]==="stabbing robot 3000"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"red");beepSnd.play()}else if(message[queueCounter]==="b"){ctx.fillStyle="black";let rectWidth=message[queueCounter-1].length*(size+10);let rectX=x-(rectWidth+size+10);ctx.fillRect(rectX,y,rectWidth,size*5);x=rectX}else if(message[queueCounter]==='c'){await sleep(1000);ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);if(score===0){drawPixelText("press space to skip",200,(this_level.length-2)*gridSize,1.50,!1,"orange")}
x=-20;y=48}else if((message[queueCounter]==="hardware")||(message[queueCounter]==="limitations")){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"rgb(249, 152, 240)");beepSnd.play()}else if(message[queueCounter]==="Good."){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"rgb(152, 249, 188)");beepSnd.play()}else if((message[queueCounter]==="Just remember WASD to move the robot")||(message[queueCounter]=="and to stab targets just move into them.")){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"rgb(249, 96, 19)");beepSnd.play()}else if(message[queueCounter]==="d"){await sleep(400);if(!spaceBind){return 1}}else if(message[queueCounter]==="            STABBING NOISES"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"red")}else if(message[queueCounter]==="x"){let i;let sidebarX=(this_level.length+2)
for(i=0;i<23;i++){ctx.fillStyle="black";ctx.fillRect((sidebarX+1)*gridSize-20,160,180,20);drawnScore++;goodSnd.play();drawPixelText("score "+drawnScore.toString(),(sidebarX+1)*gridSize-20,160,3,!0);await sleep(25)}}else if(message[queueCounter]==="v"){Mousetrap.unbind('space');main=setInterval(mainLoop,25)}else if(message[queueCounter]=="COIL FOR WEB MONETIZATION"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"orange");beepSnd.play()}else if(message[queueCounter]==="XRP"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"lime");beepSnd.play()}else if(message[queueCounter]===";"){window.location.reload()}else{drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,color);beepSnd.play()}
slowTextCounter++;slowTextHandler=setTimeout(function(){drawPixelTextSlow(message,x+size+10,y,size,delay,color)},delay)}else{slowTextCounter=0;queueCounter++;drawPixelTextSlow(message,x+size+10,y,size,delay,color)}}else{slowTextCounter=0;queueCounter=0}}
function drawPixelText(message,x,y,size,italics=!1,color="white"){let i;let pixelX=x;let pixelY=y;ctx.fillStyle=color;message=message.toUpperCase();for(i=0;i<message.length;i++){let j;let drawY=pixelY;let drawX=pixelX;if(letters[message[i]]!=undefined){for(j=0;j<letters[message[i]].length;j++){let k;if(italics)pixelX+=1;for(k=0;k<letters[message[i]][j].length;k++){if(letters[message[i]][j][k]==1){ctx.fillRect(drawX,drawY,size,size)}
drawX+=size}
drawY+=size;drawX=pixelX}
pixelX+=(letters[message[i]].length)*size}}}
var drawnScore=0;function drawLevel(level_array){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.lineWidth=1;let y,x;for(y=0;y<level_array.length;y++){for(x=0;x<level_array[y].length;x++){switch(level_array[y][x]){case '#':ctx.fillStyle=wall.color;ctx.drawImage(monoSprite,6*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height);break;case 'p':if(secondTry==!1){player.x=x;player.y=y;ctx.drawImage(monoSprite,playerSpriteIndex*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height)}else{shadowPlayer.x=x;shadowPlayer.y=y;ctx.drawImage(monoSprite,32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height)}
break;case 's':if(secondTry==!0){player.x=x;player.y=y;ctx.drawImage(monoSprite,playerSpriteIndex*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height)}
break;case 'e':ctx.fillStyle=enemy.color;ctx.drawImage(monoSprite,enemySprites[spriteIndex]*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height);break;case "E":ctx.drawImage(monoSprite,3*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height);break;case "I":ctx.drawImage(monoSprite,5*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height);break;case 'i':ctx.fillStyle=innocent.color;ctx.drawImage(monoSprite,innocentSprites[spriteIndex]*32,0,32,32,x*gridSize,y*gridSize,wall.width,wall.height);break;default:break}}}
ctx.fillStyle="black";let sidebarX=(this_level.length+2)
ctx.fillRect(sidebarX*gridSize,32,6*gridSize,(y-2)*gridSize);if(drawnScore<score){drawnScore++;goodSnd.play()}
drawPixelText("score "+drawnScore.toString(),(sidebarX+1)*gridSize-20,160,3,!0);drawPixelText("time: "+timer.toString(),(sidebarX+1)*gridSize-20,210,3,!0);drawPixelText("target ",(sidebarX+1)*gridSize-20,110,3,!0);if(target=='i'){ctx.drawImage(monoSprite,innocentSprites[spriteIndex]*32,0,32,32,(sidebarX+1)*gridSize+100,100,wall.width,wall.height)}else if(target=='e'){ctx.drawImage(monoSprite,enemySprites[spriteIndex]*32,0,32,32,(sidebarX+1)*gridSize+100,100,wall.width,wall.height)}
if(transition==!0){ctx.fillStyle="black";let levelWidth=(this_level[1].length)*gridSize;ctx.fillRect(0,32,levelWidth,animationCounter)}}
function checkCollision(x,y){switch(this_level[y][x]){case '#':return!1;case "E":return!1;case "I":return!1;case 's':case 'p':if(secondTry==!0){RFD=2;gameOver();return!1}else{return!0}
case target:this_level[y]=splice(this_level[y],x,1,target.toUpperCase());goal--;score+=10;if(goal<=0){transition=!0;takeInput=!1;animationCounter=0;levelTransition(100)}
return!1;case 'i':if('i'!=target){this_level[y]=splice(this_level[y],x,1,'I');RFD=1;gameOver()}
return!1;case 'e':if('e'!=target){this_level[y]=splice(this_level[y],x,y,"E");RFD=1;gameOver()}
return!1;default:return!0}};function updatePlayerArray(dx,dy,object){let replace=this_level[object.y+dy][object.x+dx];this_level[object.y+dy]=splice(this_level[object.y+dy],object.x+dx,1,object.key);this_level[object.y]=splice(this_level[object.y],object.x,1,replace);object.y+=dy;object.x+=dx}
var inputDelay=140;var stopInput=!1;function resumeInput(){if(stopInput)stopInput=!1}
function movePlayer(dx,dy,direction){if((takeInput)&&(!stopInput)){if(checkCollision(player.x+dx,player.y+dy)){updatePlayerArray(dx,dy,player);if(secondTry===!1){paths[currentLevelIndex]=paths[currentLevelIndex]+direction}}
stopInput=!0;setTimeout(resumeInput,inputDelay)}}
let keyQueue=[];function removeValueArray(value,arr){let i;let newArr=[];for(i=0;i<arr.length;i++){if(arr[i]!==value)newArr.push(arr[i])}
return newArr}
Mousetrap.bind(['w','up'],function(){if(!keyQueue.includes('w')){keyQueue.push('w')}},"keydown");Mousetrap.bind(['w','up'],function(){if(keyQueue.includes('w')){keyQueue=removeValueArray('w',keyQueue)}},"keyup");Mousetrap.bind(['s','down'],function(){if(!keyQueue.includes('s')){keyQueue.push('s')}},"keydown");Mousetrap.bind(['s','down'],function(){if(keyQueue.includes('s')){keyQueue=removeValueArray('s',keyQueue)}},"keyup");Mousetrap.bind(['a','left'],function(){if(!keyQueue.includes('a')){keyQueue.push('a')}},"keydown");Mousetrap.bind(['a','left'],function(){if(keyQueue.includes('a')){keyQueue=removeValueArray('a',keyQueue)}},"keyup");Mousetrap.bind(['d','right'],function(){if(!keyQueue.includes('d')){keyQueue.push('d')}},"keydown");Mousetrap.bind(['d','right'],function(){if(keyQueue.includes('d')){keyQueue=removeValueArray('d',keyQueue)}},"keyup");var shadowPlayerMoving;function moveShadowPlayer(){if(moveShadowCounter<paths[currentLevelIndex].length){switch(paths[currentLevelIndex][moveShadowCounter]){case 'n':if(checkCollision(shadowPlayer.x,shadowPlayer.y-1))updatePlayerArray(0,-1,shadowPlayer);break;case 's':if(checkCollision(shadowPlayer.x,shadowPlayer.y+1))updatePlayerArray(0,1,shadowPlayer);break;case 'e':if(checkCollision(shadowPlayer.x+1,shadowPlayer.y))updatePlayerArray(1,0,shadowPlayer);break;case 'w':if(checkCollision(shadowPlayer.x-1,shadowPlayer.y))updatePlayerArray(-1,0,shadowPlayer);break}
moveShadowCounter++}
if(this_level[shadowPlayer.y-1][shadowPlayer.x]=='e'){this_level[shadowPlayer.y-1]=splice(this_level[shadowPlayer.y-1],shadowPlayer.x,1,"E")}else if(this_level[shadowPlayer.y+1][shadowPlayer.x]=='e'){this_level[shadowPlayer.y+1]=splice(this_level[shadowPlayer.y+1],shadowPlayer.x,1,"E")}else if(this_level[shadowPlayer.y][shadowPlayer.x+1]=='e'){this_level[shadowPlayer.y]=splice(this_level[shadowPlayer.y],shadowPlayer.x+1,1,"E")}else if(this_level[shadowPlayer.y][shadowPlayer.x-1]=='e'){this_level[shadowPlayer.y]=splice(this_level[shadowPlayer.y],shadowPlayer.x-1,1,"E")}
shadowPlayerMoving=setTimeout(moveShadowPlayer,shadowPlayerInterval)}
var gameOverCounter=0;function gameOver(){takeInput=!1;killSnd.play();clearTimeout(shadowPlayerMoving);clearInterval(main);gameOverCounter=0;drawGameOver(0.025)}
var gameoverHandler;function drawGameOver(timeout){ctx.fillStyle="red";let levelWidth=(this_level[1].length+6)*gridSize;ctx.fillRect(0,32,levelWidth,gameOverCounter);let levelHeight=(this_level.length-2)*gridSize;if(gameOverCounter<levelHeight){gameOverCounter++;gameoverHandler=setTimeout(drawGameOver,timeout)}else{drawPixelText("G A M E O V E R",levelWidth/4,levelHeight/2,4);switch(RFD){case 0:drawPixelText("TIME RAN OUT",levelWidth/4,levelHeight/1.5,2);break;case 1:drawPixelText("YOU KILLED THE INCORRECT TARGET",levelWidth/4,levelHeight/1.5,2);break;case 2:drawPixelText("YOU GOT KILLED BY YOUR PAST SELF",levelWidth/4,levelHeight/1.5,2);break}
drawPixelText("PRESS R TO RESTART",levelWidth/4,levelHeight/1.2,2);Mousetrap.bind("r",function(){Mousetrap.unbind("r");clearTimeout(gameoverHandler);timer=13;clearTimeout(shadowPlayerMoving);moveShadowCounter=0;if(secondTry==!1){target='e'}else{target='i';shadowPlayerMoving=setTimeout(moveShadowPlayer,200)}
score=0;drawnScore=0;animationCounter=0;transition=!1;this_level=levels[currentLevelIndex].split("\n");goal=0;setupGoal(target);takeInput=!0;main=setInterval(mainLoop,25)})}}
var timerRunning=!1;var timerHandler;function updateTimer(){if(timer>0){timer--}else{RFD=0;gameOver()}
timerRunning=!1}
let itc=1;let testChar='a';function mainLoop(){if(timerRunning==!1){timerRunning=!0;timerHandler=setTimeout(updateTimer,1000)}
switch(keyQueue[keyQueue.length-1]){case 'w':movePlayer(0,-1,'n');break;case 's':movePlayer(0,1,'s');break;case 'd':movePlayer(1,0,'e');break;case 'a':movePlayer(-1,0,'w');break}
if(document.monetization){if((document.monetization.state==='started')&&(enableSkins!=!0)){enableSkins=!0}}
drawLevel(this_level)}
let titleContents=["Hello dear player.  It is I the","narrator","!","d","\n","And you are the","stabbing robot 3000","\n","your task is to stab","m y political opponents","b","very bad people.","\n","d","This would be a simple task but due to","hardware","\n","limitations","you will have to kill half the targets","\n","within two 13 second chunks. ","\n","The side bar will inform you of your target","\c","If you stab the wrong target you will recieve","\n","a gameover. Also when you kill the second half","\n","of targets you'll have to avoid yourself killing","\n","the first half of targets.","\n","Confusing?","d","d","d","Good.","\n","Just remember WASD to move the robot","\n","and to stab targets just move into them.","d","d","d","d","d","v"];var main;var spaceBind=!0;function titleScreen(){let gameX=5;let gameY=48;let fontSize=2;score=0;ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);drawPixelTextSlow(titleContents,gameX,gameY,fontSize,65);drawPixelText("press space to skip",200,(this_level.length-2)*gridSize,1.50,!1,"orange");Mousetrap.bind('space',function(){clearTimeout(slowTextHandler);Mousetrap.unbind('space');spaceBind=!1;slowTextCounter=0;queueCounter=0;main=setInterval(mainLoop,25)})}
function coilMsg(){let info=["HELLO DEAR PLAYER, IT IS I the","narrator","!","d","\n","I see you're curious about the paid skins.","\n","You see, this game uses","COIL FOR WEB MONETIZATION","\n","SO you can use the coil extension for your","\n","web browser to pay any amount in","XRP","to unlock","\n","the special skins for the target characters","\n","in the game.","d","d","d","what is ","XRP","? you ask?","d","d","d","d","\c","\n","XRP","is a cryptocurrency which you can use to...","\n","buy stuff?","\n","d","d","d","it can do 1500 transactions per second.","d","d","d","\n","that's cool.","d","d","\n","look if you want the skins just send some","\n","XRP","points?","d","d","d","dollars?","d","d",'coins?',"\n","just send some numbers and press the SHIFT key","\n","to shuffle through skins.","d","d","d","d","d","d",";"];ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);score=1;drawPixelTextSlow(info,5,48,2,65)}
function splashScreen(){let alignX=13;ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);drawPixelText("BACKSTABBERS",alignX,98,9,!0,"red");drawPixelText("BACKSTABBERS",alignX+3,100,9,!0,"lime");drawPixelText("A GAME ABOUT STABBING",alignX+90,150,3,!0,"aqua");drawPixelText("PRESS ENTER TO START GAME",30,220,2,!1,"red");drawPixelText("PRESS ENTER TO START GAME",31,220,2,!1,"lime");drawPixelText("PRESS S TO BUY SKINS",30,240,2,!1,"red");drawPixelText("PRESS S TO BUY SKINS",31,240,2,!1,"lime");Mousetrap.bind("s",function(){Mousetrap.unbind("s");Mousetrap.unbind("enter");coilMsg()});Mousetrap.bind("enter",function(){Mousetrap.unbind("enter");Mousetrap.unbind("s");titleScreen()})}
function gameWin(){spaceBind=!0;let endscreenText=["GOOD JOB!","\n","You have taken down all the targets.","\n","You even netted a total of "+score+" points!","\n","HOWEVER, this is not the end of our journey,","\n","stabbing robot 3000","there will inevitably be","\n","more targets to be stabbed during my","\n","illegal seizure of power               ","b",'LEGITIMATE CAMPAIGN.',"\c","so uhh.. great  job hero!","d","\n","err..","d","power off?","d","d","d","\n","wait what are you doing with that knife?","\n","d","d","TURN OFF  ROBOT!   STOP!","\n","d","d","I DEMAND YOU STOP ROBOT","d","\n","ROBOT TURN OF F","\n","            STABBING NOISES","d","d","d","d","d","d","d","x","\c","d","d","d","d","d","d","d","d","d","\n","you win.","d","d","d","d","d","d","d","d","d","\n","\c","Here's some trivia:","\n","Backstabbers was remorsefully developed by","\n","Milan Donhowe","for the 2019 13kb JS GameJam","\n","Libraries used include:",'\n',"Voca.js","Mousetrap","PixelFont","And TinyMusic."];let fontSize=2;ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);drawPixelTextSlow(endscreenText,5,54,fontSize,50)}
splashScreen()