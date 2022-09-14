const canvas=document.getElementById('canvas');const context=canvas.getContext('2d');const background=new Image();background.src="./assets/background.png";const enemyimg=new Image();enemyimg.src='./assets/zombie.png';const ladyimg=new Image();ladyimg.src='./assets/lady.png';let image=new Image();image.src='./assets/x.png';let enemies=[];let girls=[];let time=0;let score=0;let loser=!1;let combocalled=!1;let spawnTime=120;let currentCombo;let currentKey;let keyindex;let charStr;let charCode;let xofgirlsposition=30;let warning='';let deathcause='';const possible="ASDQWERTFGYHUJ";const textsingame=['LADIES MAN','SPACE TO START','WP COWBOY','BAD COMBO','ZOMBIE GOT YOU','DONT SHOT LADIES','SPACE TO RESTART',];const colors=['white','black','#F80000','#70D038',];let colorsofcombopixels=[colors[2],colors[2],colors[2]];kontra.init();let spriteSheetEnemy=kontra.spriteSheet({image:enemyimg,frameWidth:18.333333,frameHeight:26,animations:{walk:{frames:'0..2',frameRate:10}}});let spriteback=kontra.sprite({x:0,y:0,image:background});let spriteSheetplayer=kontra.spriteSheet({image:image,frameWidth:34.9,frameHeight:39,animations:{walk:{frames:'0..3',frameRate:3}}});let spriteplayer=kontra.sprite({x:40,y:112,animations:spriteSheetplayer.animations});function createEnemy(){let x=kontra.sprite({x:250,y:125,dx:-1,animations:spriteSheetEnemy.animations,name:'enemy',})
enemies.push(x);return x}
function createGirl(){let x=kontra.sprite({x:250,y:128,dx:-1,image:ladyimg,name:'lady',});enemies.push(x);return x}
function RandomChar(){var text="";for(var i=0;i<3;i++)
text+=possible.charAt(Math.floor(Math.random()*possible.length));return text}
document.onkeypress=function(evt){evt=evt||window.event;charCode=evt.keyCode||evt.which;charStr=String.fromCharCode(charCode);if(charCode==32)
loop.start();if(charCode==32&&loser)
window.location.reload()};function callDraw(colors){var x=80;var index=0;colors.forEach(currentcolor=>{drawText(currentCombo.charAt(index),3,x,50,currentcolor,60);x+=30;index++})}
function toLoseScreen(){context.clearRect(0,0,canvas.width,canvas.height);spriteback.render();if(deathcause==textsingame[5])
drawText(deathcause,3,20,30,colors[0],0);else drawText(deathcause,3,30,30,colors[0],0);drawText(score+' ladies saved',2,65,70,colors[1],0);drawText(textsingame[6],2,60,110,colors[0],0);loop.stop()}
background.onload=function(){spriteback.render();drawText(textsingame[0],4,40,40,colors[0],0);drawText(textsingame[1],2,70,100,colors[1],0)}
let loop=kontra.gameLoop({fps:60,update:function(dt){time++;enemies.forEach(element=>{element.update()});spriteplayer.update();if(time%spawnTime==0){if(!combocalled){currentCombo=RandomChar();keyindex=0;currentKey=currentCombo.charAt(0);combocalled=!0}
if(Math.random()>0.3)
createEnemy();else createGirl()}
enemies.forEach(element=>{if(element.x<45&&element.name=='enemy'){deathcause=textsingame[4];loser=!0;sequencelose.play()}
else if(element.x<45&&element.name=='lady'){element.x=xofgirlsposition;element.dx=0;score++;girls.push(element);xofgirlsposition-=10;sequencegotscore.play();if(score>0&&score%3==0)
spawnTime=parseInt((spawnTime*80)/100);}
if(element.x<45)
enemies.shift()});if(currentKey!=null&&charStr!=null&&charCode!=32){if(charStr.toLowerCase()==currentKey.toLowerCase()){sequencecombo.play();if(keyindex==2&&currentCombo.charAt(2)==currentKey){if(enemies[0].image==ladyimg){deathcause=textsingame[5];loser=!0;sequencelose.play()}
else{enemies.shift();sequencekill.play();currentKey=null;currentCombo=RandomChar();keyindex=0;currentKey=currentCombo.charAt(0);colorsofcombopixels=[colors[2],colors[2],colors[2]];warning=textsingame[2]}}
else{colorsofcombopixels[keyindex]=colors[3];keyindex++;currentKey=currentCombo[keyindex]}}
else{sequencefailcombo.play();currentKey=null;currentCombo=RandomChar();keyindex=0;currentKey=currentCombo.charAt(0);colorsofcombopixels=[colors[2],colors[2],colors[2]];warning=textsingame[3]}
charStr=null}},render:function(){spriteback.render();girls.forEach(element=>{element.render()});enemies.forEach(element=>{element.render()});spriteplayer.render();drawText(score+' ladies saved',2,10,10,colors[1],0);if(currentCombo!=null)
callDraw(colorsofcombopixels);if(warning==textsingame[3])
drawText(warning,2,60,30,colors[1],0);else drawText(warning,2,80,30,colors[1],0);if(loser)
toLoseScreen()}})