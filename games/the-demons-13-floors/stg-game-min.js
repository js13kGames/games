const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const rainContainer=document.querySelector('.rain');function createRain(){const container=document.querySelector('.container');const containerWidth=container.clientWidth;for(let i=0;i<100;i++){const raindrop=document.createElement('div');raindrop.classList.add('raindrop');raindrop.style.left=`${Math.random() * containerWidth}px`;raindrop.style.animationDuration=`${1 + Math.random()}s`;rainContainer.appendChild(raindrop)}}
createRain();let audioContext;let gainNode;let isPlaying=!1;const musicnotes=[[0,15],[1,15],[3,10],[4,10],[6,8],[7,8],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[15,5],[16,5],[17,8],[18,8],[19,8],[20,8],[21,8],[22,8],[23,7],[24,7],[25,10],[26,10],[27,10],[28,10],[29,10],[30,10],[31,10],[32,10],[34,10],[35,10],[36,11],[37,11],[38,10],[39,10],[40,8],[41,8],[42,7],[43,7],[44,8],[45,8],[46,7],[47,7],[48,5],[49,5],[50,3],[51,3],[33,10],[54,3],[55,3],[58,3],[59,3],[60,3],[61,3],[62,3],[63,3],[64,3],[65,3],[66,3],[67,3],[68,5],[69,5],[70,3],[72,2],[73,2],[74,2],[75,2],[76,2],[77,2],[78,2],[79,2],[71,3],[80,8],[81,8],[82,8],[83,8],[84,7],[85,7],[87,5],[89,3],[90,3],[91,3],[92,3],[93,3],[94,3],[95,3],[96,3],[97,10],[98,10],[99,10],[100,10],[102,10],[103,10],[104,8],[105,8],[106,7],[107,7],[110,7],[111,7],[112,5],[113,5],[114,8],[115,8],[118,8],[119,8],[120,7],[121,7],[122,10],[123,10],[124,10],[125,10],[101,10],[32,8],[33,8],[41,5],[42,5],[71,5],[88,7],[89,5]];const a=(notes,center,duration,decaystart,decayduration,interval,volume,waveform)=>{audioContext=new(window.AudioContext||window.webkitAudioContext)();gainNode=audioContext.createGain();gainNode.connect(audioContext.destination);for(let i of notes){const oscillator=audioContext.createOscillator();oscillator.frequency.setValueAtTime(center*1.06**(13-i[1]),audioContext.currentTime+i[0]*interval);oscillator.type=waveform;const noteGain=audioContext.createGain();noteGain.gain.setValueAtTime(volume,audioContext.currentTime+i[0]*interval);noteGain.gain.setTargetAtTime(1e-5,audioContext.currentTime+i[0]*interval+decaystart,decayduration);oscillator.connect(noteGain);noteGain.connect(gainNode);oscillator.start(audioContext.currentTime+i[0]*interval);oscillator.stop(audioContext.currentTime+i[0]*interval+duration)}};function playMusic(){if(isPlaying){return}else{isPlaying=!0;a(musicnotes,220,.9,.1,.005,.2,.1,'triangle');setTimeout(()=>{isPlaying=!1},26000)}}
var music;let zzfxV=.3,zzfxX=new AudioContext,zzfx=(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]=f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(h-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();b.buffer=p;b.connect(zzfxX.destination);b.start()}
let gameState='start';let currentLevel=1;const totalLevels=13;let animationFrameId;let godtime=!1;var fps=60;var now;var then=Date.now();var interval=1000/fps;var delta;var time=0;var frame=0;var score=0;const player={x:canvas.width/2-25,y:canvas.height-60,width:50,height:50,speed:5,slowSpeed:2,bullets:[],moveLeft:!1,moveRight:!1,moveUp:!1,moveDown:!1,isSlow:!1,canShoot:!0,lives:13,shoot:function(){this.bullets.push({x:this.x+this.width/2-2.5,y:this.y,width:5,height:10})}};const explosions=[];function createExplosion(x,y,size,maxSize){explosions.push({x:x,y:y,size:size,maxSize:maxSize,duration:30,opacity:1.0})}
const palette='1c130af0ebea9391900f1945376ed65d8f24eda20ceb6320';const icons={"boss132":"H@@@@AHIIIIA@IJRJ@@QJIJ@@IJRJ@@IJIJ@@IJRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss122":"H@@@@AHIIIIA@IJRJ@@QJIJ@@IJQI@@IJJI@@IJRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss112":"H@@@@AHIIIIA@IJIJ@@QJQJ@@IJIJ@@IJIJ@@IJIJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss102":"H@@@@AHIIIIA@IJQI@@QJJJ@@IJJJ@@IJJJ@@IJQI@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss92":"H@@@@AHIIIIA@IIRJ@@IJJJ@@IIRJ@@IIIJ@@IIIJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss82":"H@@@@AHIIIIA@IIRJ@@IJJJ@@IIRJ@@IIJJ@@IIRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss72":"H@@@@AHIIIIA@IIRJ@@IJIJ@@IIIJ@@IIIJ@@IIIJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss62":"H@@@@AHIIIIA@IIRJ@@IJJI@@IIRJ@@IIJJ@@IIRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss52":"H@@@@AHIIIIA@IIRJ@@IJJI@@IIRJ@@IIIJ@@IIRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss42":"H@@@@AHIIIIA@IIJJ@@IJJJ@@IIRJ@@IIIJ@@IIIJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss32":"H@@@@AHIIIIA@IIRJ@@IJIJ@@IIRJ@@IIIJ@@IIRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss22":"H@@@@AHIIIIA@IIRJ@@IJIJ@@IIRJ@@IIJI@@IIRJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss12":"H@@@@AHIIIIA@IIIJ@@IJQJ@@IIIJ@@IIIJ@@IIIJ@@IIII@H@II@A@IIII@@@II@@@@HA@@","boss131":"H@@@@AHIIIIA@IJRJ@@QJIJ@@IJRJ@@IJIJ@@IJRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss121":"H@@@@AHIIIIA@IJRJ@@QJIJ@@IJRJ@@IJJI@@IJRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss111":"H@@@@AHIIIIA@IJIJ@@QJQJ@@IJIJ@@IJIJ@@IJIJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss101":"H@@@@AHIIIIA@IJRJ@@QJJJ@@IJJJ@@IJJJ@@IJRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss91":"H@@@@AHIIIIA@IIRJ@@IJJJ@@IIRJ@@IIIJ@@IIIJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss81":"H@@@@AHIIIIA@IIRJ@@IJJJ@@IIRJ@@IIJJ@@IIRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss71":"H@@@@AHIIIIA@IIRJ@@IJIJ@@IIIJ@@IIIJ@@IIIJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss61":"H@@@@AHIIIIA@IIRJ@@IJJI@@IIRJ@@IIJJ@@IIRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss51":"H@@@@AHIIIIA@IIRJ@@IJJI@@IIRJ@@IIIJ@@IIRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss41":"H@@@@AHIIIIA@IIJJ@@IJJJ@@IIRJ@@IIIJ@@IIIJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss31":"H@@@@AHIIIIA@IIRJ@@IJIJ@@IIRJ@@IIIJ@@IIRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss21":"H@@@@AHIIIIA@IIRJ@@IJIJ@@IIRJ@@IIJI@@IIRJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","boss11":"H@@@@AHIIIIA@IIIJ@@IJQJ@@IIIJ@@IIIJ@@IIIJ@@IIII@@@II@@@HIIA@@AIIH@@@HA@@","player1":"@`hED@`Dmm`D`hmmEDDmmmm`DPQJB`DPRRB`Dj}oU`DPmmB`DhmmE``@BP@D`DBP`D@`AHD@","player2":"@PhEB@PBmmPBPhmmEBBmmmmPBPQJBPRPRRBRBj}oUPB@mm@PBhmmEPP@BP@BPBBPPB@PAHB@",};const drawIcon=(ctx,icon,x,y,scale,flash)=>{const imageData=[];[...icon].map(c=>{const z=c.charCodeAt(0);imageData.push(z&7);imageData.push((z>>3)&7)});const size=Math.sqrt(icon.length*2);for(let j=0;j<size;j++){for(let i=0;i<size;i++){if(imageData[j*size+i]){const index=6*(imageData[j*size+i]-1);if(flash){ctx.fillStyle='lightgray'}else{ctx.fillStyle='#'+palette.substring(index,index+6)}
ctx.fillRect(x+i*scale,y+j*scale,scale,scale)}}}};let bossActive=!1;let boss=null;const enemyBullets=[];function drawPlayer(){if(godtime){ctx.globalAlpha=0.5}else{ctx.globalAlpha=1}
if(frame%60<30){drawIcon(ctx,icons[`player1`],player.x,player.y,player.width/12,!1)}else{drawIcon(ctx,icons[`player2`],player.x,player.y,player.width/12,!1)}
if(player.isSlow){ctx.fillStyle='red';ctx.beginPath();ctx.arc(player.x+player.width/2,player.y+player.height/2,3,0,Math.PI*2);ctx.fill()}
ctx.globalAlpha=1}
function drawPlayerBullets(){ctx.fillStyle='red';player.bullets.forEach((bullet,index)=>{ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);bullet.y-=7;if(bullet.y<0){player.bullets.splice(index,1)}})}
function updatePlayer(){const speed=player.isSlow?player.slowSpeed:player.speed;if(player.moveLeft&&player.x>0)player.x-=speed;if(player.moveRight&&player.x<canvas.width-player.width)player.x+=speed;if(player.moveUp&&player.y>0)player.y-=speed;if(player.moveDown&&player.y<canvas.height-player.height)player.y+=speed;if(player.canShoot){player.shoot();player.canShoot=!1;setTimeout(()=>player.canShoot=!0,300)}}
function drawScreen(textLines,bgColor='white',textColor='black'){ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=textColor;ctx.strokeStyle='#000';ctx.globalAlpha=0.5;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(canvas.width/2,0);ctx.lineTo(canvas.width/2,canvas.height);ctx.stroke();ctx.globalAlpha=1;ctx.font='30px Arial';ctx.textAlign='center';textLines.forEach((line,index)=>{ctx.fillText(line.text,canvas.width/2,canvas.height/2+index*40)})}
let bossHitFlash=!1;let bossHitTimer=0;let gamePhase='flyingToBoss';let preBossFlyTime=2000;let bossIntroTime=3000;let bossReady=!1;function startFlyingToBoss(){gamePhase='flyingToBoss';setTimeout(()=>{startBossIntro()},preBossFlyTime)}
function updateFlyingToBoss(){if(player.y>100){player.y-=1}
drawPlayer()}
function startBossIntro(){gamePhase='bossIntro';setTimeout(()=>{bossReady=!0;gamePhase='fightingBoss'},bossIntroTime)}
function drawBossIntro(){if(currentLevel===1){drawScreen([{text:'What’s wrong with this place?'},{text:'Something, lurking ahead.'},{text:'I must face what lies beneath.'}],'black','white')}else if(currentLevel===2){drawScreen([{text:'It doesn\'t just go up.'},{text:'A second demon.'},{text:'Waiting for me.'}],'black','white')}else if(currentLevel===3){drawScreen([{text:'I can’t turn back now?'},{text:'Twisted!'},{text:'Number Demon!'}],'black','white')}else if(currentLevel===4){drawScreen([{text:'Something unnatural'},{text:'More sinister.'},{text:'I falling into their trap?'}],'black','white')}else if(currentLevel===5){drawScreen([{text:'Still same world?'},{text:'Keep me from leaving?'},{text:'But the path darker.'}],'black','white')}else if(currentLevel===6){drawScreen([{text:'City!'},{text:'Crazy!'},{text:'I losing my own?'}],'black','white')}else if(currentLevel===7){drawScreen([{text:'Every floor.'},{text:'Further from the truth.'},{text:'Just, going.'}],'black','white')}else if(currentLevel===8){drawScreen([{text:'Train?'},{text:'Where they want?'},{text:'I\'m losing grip?'}],'black','white')}else if(currentLevel===9){drawScreen([{text:'Can I still...'},{text:'Trust.'},{text:'Myself?'}],'black','white')}else if(currentLevel===10){drawScreen([{text:'This is wrong...'},{text:'Toying with me.'},{text:'I was stopping them.'}],'black','white')}else if(currentLevel===11){drawScreen([{text:'Darkness...'},{text:'Peace...'},{text:'How I got here?'}],'black','white')}else if(currentLevel===12){drawScreen([{text:'Lift won’t stop.'},{text:'Broken, real...'},{text:'Into pieces.'}],'black','white')}else if(currentLevel===13){drawScreen([{text:'Final demon!'},{text:'What...'},{text:'A Beautiful world!'}],'black','white')}}
function drawBoss(){if(boss){if(bossHitFlash){ctx.fillStyle='lightgray';bossHitTimer--;if(bossHitTimer<=0){bossHitFlash=!1}}
if(frame%60<30){drawIcon(ctx,icons[`boss${currentLevel}1`],boss.x,boss.y,boss.width/12,bossHitFlash)}else{drawIcon(ctx,icons[`boss${currentLevel}2`],boss.x,boss.y,boss.width/12,bossHitFlash)}
boss.x+=boss.speed;if(boss.x<=0||boss.x+boss.width>=canvas.width){boss.speed=-boss.speed}
if(frame%10===0){shootBossBullets(boss)}}}
function spawnBoss(level){boss={x:canvas.width/2-75,y:50,width:150,height:150,maxHealth:50+(currentLevel-1)*10,health:50+(currentLevel-1)*10,speed:1,};bossActive=!0}
function drawBossHealthBar(){const barWidth=canvas.width-40;const barHeight=20;const barX=20;const barY=10;const healthPercentage=boss.health/boss.maxHealth;ctx.fillStyle='#444';ctx.fillRect(barX,barY,barWidth,barHeight);ctx.fillStyle='#FF0000';ctx.fillRect(barX,barY,barWidth*healthPercentage,barHeight);ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(barX,barY,barWidth,barHeight)}
let angleOffset=0;function shootBossBullets(boss){if(currentLevel===1){generateBulletsPattern(boss,3,1,focusedPattern,0)}else if(currentLevel===2){generateBulletsPattern(boss,2,8,circularPattern,Math.PI/27)}else if(currentLevel===3){generateBulletsPattern(boss,2,8,circularPattern,Math.PI/180)}else if(currentLevel===4){generateBulletsPattern(boss,8,3,logarithmicSpiralPattern,Math.PI/180);generateBulletsPattern(boss,3,8,decircularPattern,Math.PI/180)}else if(currentLevel===5){generateBulletsPattern(boss,2,6,decircularPattern,Math.PI/180);generateBulletsPattern(boss,2,6,circularPattern,Math.PI/180)}else if(currentLevel===6){generateBulletsPattern(boss,1,12,butterflyCurvePattern,Math.PI/90)}else if(currentLevel===7){generateBulletsPattern(boss,3,16,subwayPattern,Math.PI/120)}else if(currentLevel===8){generateBulletsPattern(boss,3,16,trainPattern,0)}else if(currentLevel===9){generateBulletsPattern(boss,2,8,circularPattern,Math.PI/27);generateBulletsPattern(boss,1,8,subwayPattern,Math.PI/60)}else if(currentLevel===10){generateBulletsPattern(boss,3,16,spirographPattern,Math.PI/120)}else if(currentLevel===11){generateBulletsPattern(boss,3,12,logarithmicSpiralPattern,Math.PI/60)}else if(currentLevel===12){generateBulletsPattern(boss,1,16,trochoidFlowerPattern2,Math.PI/72)}else if(currentLevel===13){generateBulletsPattern(boss,1,32,subwayPattern,Math.PI/60)}}
function generateBulletsPattern(boss,bulletSpeed,bulletCount,patternFunction,anglechange){for(let i=0;i<bulletCount;i++){const{dx,dy}=patternFunction(i,bulletCount,boss,player);enemyBullets.push({x:boss.x+boss.width/2,y:boss.y+boss.height/2,width:15,height:15,dx:(dx+0.01)*bulletSpeed,dy:(dy+0.01)*bulletSpeed})}
angleOffset+=anglechange}
function drawEnemyBullets(){if(currentLevel===13||currentLevel===6||currentLevel===10){ctx.fillStyle='black'}else{ctx.fillStyle='yellow'}
for(let index=enemyBullets.length-1;index>=0;index--){const bullet=enemyBullets[index];bullet.x+=bullet.dx;bullet.y+=bullet.dy;ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);if(bullet.y>canvas.height||bullet.y<0||bullet.x<0||bullet.x>canvas.width){enemyBullets.splice(index,1)}}}
function circularPattern(i,bulletCount,boss,player){boss.speed=0;const angle=(Math.PI*2/bulletCount)*i+angleOffset;return{dx:Math.cos(angle),dy:Math.sin(angle)}}
function butterflyCurvePattern(i,bulletCount,boss,player){boss.speed=0;const angle=(Math.PI*2/bulletCount)*i+angleOffset;const r=Math.exp(Math.sin(angle))-2*Math.cos(4*angle)+Math.pow(Math.sin((2*angle-Math.PI)/24),5);return{dx:r*Math.cos(angle),dy:r*Math.sin(angle)}}
function decircularPattern(i,bulletCount,boss,player){boss.speed=0;const angle=(Math.PI*2/bulletCount)*i+angleOffset;return{dx:Math.sin(angle),dy:Math.cos(angle)}}
function subwayPattern(i,bulletCount,boss,player){const angle=(Math.PI*2/bulletCount)*i+angleOffset;return{dx:Math.cos(angle),dy:Math.sin(angle)}}
function trochoidFlowerPattern(i,bulletCount,boss,player){const k=4;const angle=(Math.PI*2/bulletCount)*i+angleOffset;return{dx:Math.cos(k*angle)*Math.cos(angle),dy:Math.sin(k*angle)*Math.sin(angle)}}
function trochoidFlowerPattern2(i,bulletCount,boss,player){const k=2;const angle=(Math.PI*2/bulletCount)*i+angleOffset;return{dx:Math.cos(k*angle)*Math.cos(angle),dy:Math.sin(k*angle)*Math.sin(angle)}}
function logarithmicSpiralPattern(i,bulletCount,boss,player){boss.speed=0;const a=0.1;const b=0.2;const angle=(Math.PI*2/bulletCount)*i+angleOffset;const r=a*Math.exp(b);const direction=Math.sin(frame/100)>=0?1:-1;return{dx:r*Math.cos(direction*angle),dy:r*Math.sin(direction*angle)}}
function spirographPattern(i,bulletCount,boss,player){boss.speed=0;const R=5;const r=2;const p=1;const angle=(Math.PI*2/bulletCount)*i+angleOffset;const x=(R-r)*Math.cos(angle)+p*Math.cos(((R-r)/r)*angle);const y=(R-r)*Math.sin(angle)-p*Math.sin(((R-r)/r)*angle);return{dx:x/R,dy:y/R}}
function focusedPattern(i,bulletCount,boss,player){const dx=player.x-boss.x;const dy=player.y-boss.y;const magnitude=Math.sqrt(dx*dx+dy*dy);return{dx:(dx/magnitude),dy:(dy/magnitude)}}
function trainPattern(i,bulletCount,boss,player){return{dx:Math.sin(i/bulletCount*Math.PI*2),dy:1}}
function drawExplosions(){explosions.forEach((explosion,index)=>{ctx.save();ctx.globalAlpha=explosion.opacity;ctx.fillStyle='orange';ctx.beginPath();ctx.arc(explosion.x,explosion.y,explosion.size,0,Math.PI*2);ctx.fill();ctx.restore();if(explosion.size<explosion.maxSize){explosion.size+=1}
explosion.opacity-=0.03;if(explosion.opacity<=0){explosions.splice(index,1)}})}
function checkCollisions(){const playerCenterX=player.x+player.width/2;const playerCenterY=player.y+player.height/2;const hitboxRadius=3;player.bullets.forEach((bullet,bulletIndex)=>{if(boss){if(bullet.x<boss.x+boss.width&&bullet.x+bullet.width>boss.x&&bullet.y<boss.y+boss.height&&bullet.y+bullet.height>boss.y){boss.health--;score+=1;player.bullets.splice(bulletIndex,1);zzfx(...[,,129,.01,,.15,,,,,,,,5]);createExplosion(bullet.x+bullet.width/2,bullet.y+bullet.height/2,5,10);bossHitFlash=!0;bossHitTimer=5;if(boss.health<=0){boss=null;bossActive=!1;zzfx(...[,,172,.8,,.8,1,.76,7.7,3.73,-482,.08,.15,,.14]);advanceLevel()}
if(score%130===0){player.lives+=1;zzfx(...[,,20,.04,,.6,,1.31,,,-990,.06,.17,,,.04,.07])}}}});enemyBullets.forEach((bullet,bulletIndex)=>{const distX=bullet.x+bullet.width/2-playerCenterX;const distY=bullet.y+bullet.height/2-playerCenterY;const distance=Math.sqrt(distX*distX+distY*distY);if(distance<hitboxRadius&&!godtime){player.lives-=1;enemyBullets.splice(bulletIndex,1);zzfx(...[,,333,.01,0,.9,4,1.9,,,,,,.5,,.6]);createExplosion(player.x+player.width/2,player.y+player.height/2,10,30);if(player.lives<0){resetGame()}
setTimeout(()=>{godtime=!1},3000);godtime=!0}})}
function updateHUD(){document.getElementById('lives').textContent=`Lives: ${player.lives}`;document.getElementById('level').textContent=`Level: ${currentLevel}`;document.getElementById('score').textContent=`Score: ${score}`}
function advanceLevel(){if(currentLevel<totalLevels){currentLevel++;initializeGame(!0);spawnBoss(currentLevel)}else{initializeGame();ctx.clearRect(0,0,canvas.width,canvas.height);gameState='gameOver';drawScreen([{text:'You Win!'},{text:'Thanks for Playing!'},{text:'Press Enter to Restart'}])}}
function resetGame(){ctx.clearRect(0,0,canvas.width,canvas.height);initializeGame();gameState='gameOver';drawScreen([{text:'Game Over'},{text:'Thanks for Playing!'},{text:'Press Enter to Restart'}])}
function initializeGame(resetLevel=!1){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.shadowBlur=0;player.x=canvas.width/2-player.width/2;player.y=canvas.height-60;player.lives=resetLevel?player.lives:13;player.bullets=[];player.moveLeft=!1;player.moveRight=!1;player.moveUp=!1;player.moveDown=!1;player.isSlow=!1;player.canShoot=!0;playing=!1;bossActive=!1;boss=null;enemyBullets.length=0;angleOffset=0;if(!resetLevel){currentLevel=1;gameState='start'}else{gameState='levelComplete'}}
function drawElevatorPanel(){const buttonSize=40;const spacing=10;const panelWidth=3*buttonSize+2*spacing;const panelHeight=6*buttonSize+5*spacing;const panelX=(canvas.width-panelWidth)/2;const panelY=(canvas.height-panelHeight)/2;ctx.globalAlpha=0.4;ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(panelX-10,panelY-20,panelWidth+20,panelHeight+40);const columns=[[1,2,3,4,5,6],[13,13,13,13,13,13],[7,8,9,10,11,12]];columns.forEach((column,colIndex)=>{column.forEach((floor,rowIndex)=>{const buttonX=panelX+colIndex*(buttonSize+spacing);const buttonY=panelY+rowIndex*(buttonSize+spacing);ctx.fillStyle='#000';if(floor===currentLevel){ctx.fillStyle='#FF0000'}
ctx.beginPath();ctx.arc(buttonX+buttonSize/2,buttonY+buttonSize/2,buttonSize/2,0,Math.PI*2);ctx.fill();ctx.fillStyle=(floor===currentLevel)?'#000':'#fff';ctx.font='20px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(floor,buttonX+buttonSize/2,buttonY+buttonSize/2)})});ctx.globalAlpha=1}
function startGameLoop(){if(animationFrameId){cancelAnimationFrame(animationFrameId)}
animationFrameId=requestAnimationFrame(gameLoop)}
var S=Math.sin;var C=Math.cos;var T=Math.tan;function R(r,g,b,a){a=a===undefined?1:a;return'rgba('+(r|0)+','+(g|0)+','+(b|0)+','+a+')'}
function animateBackground(t,level){let x=ctx;let c=canvas;var w=400;var h=600;if(level===1){}else if(level===2){x.shadowColor=`hsl(${t*400},99%,50%)`
x.shadowBlur=30}else if(level===3){c.width|=0;for(let i=0;i<14;i++){x.font='20px monospace';x.fillStyle=R(255*S(T(t)),0,0);x.fillText('WARING!',0,(i*99+t*333)%600);x.fillText('WARING!',320,(i*99+t*333)%600)}}else if(level===4){l=(v,y,w,z)=>{x.beginPath(x.lineWidth=9);x.moveTo(v,y);x.lineTo(w,z);x.stroke()}
c.width|=0
for(i=8;i--;)l(600,-2e3,i*404,h=1000);for(i=40;i--;)l(0,y=3**((t+i/3)%9%h),2e3,y)}else if(level===5){for(s=k=46;k--;s/=.98)for(i=32;i--;)for(j=18;j--;32-k<(i+t^j)**3%40&&x.fillRect(600+(j-9)*s,400+(i-16-t%1)*s,s,s))x.fillStyle=R(v=k*9,v,v)}else if(level===6){for(s=k=38;k--;s/=.97)for(i=23;i--;)for(j=14;j--;30-k<(i+t^j)**3%33&&x.fillRect(400+(j-14)*s,600+(i-22-t%1)*s,s,s))x.fillStyle=R(v=90-(k*2),v*Math.sin(t*.2),v*Math.cos(t*.01));}else if(level===7){x.shadowBlur=0
for(s=k=29;k--;s/=.81)for(j=25;i=--j>>2;e%5<i&&j-18&&x.fillRect(300+j%4*s-s/.4-k*9,400+i*s-4.8*s,s,s))e=j^k/8+t*6,x.fillStyle=R(v=e%7*k,v,v)}else if(level===8){for(s=i=w=c.width|=0;i--;s*=.98)j=i-t*30|0,x.fillRect(200-(j%9?j%2?-.5:.5:.6)*s+(w-i)*S(j/199),200+s,j%9?s/9+9:s*1.3,s/9+2)}else if(level===9){c.width|=0;for(let i=0;i<14;i++){x.font='20px monospace';x.fillStyle=R(255*S(T(t)),0,0);x.fillText('13!',0,(i*99+t*333)%600);x.fillText('13!',320,(i*99+t*333)%600)}}else if(level===10){x.shadowColor=`hsl(${t*400},99%,50%)`
x.shadowBlur=30
for(s=k=29;k--;s/=.81)for(j=25;i=--j>>2;e%5<i&&j-18&&x.fillRect(300+j%4*s-s/.4-k*9,400+i*s-4.8*s,s,s))e=j^k/8+t*6}else if(level===11){x.shadowBlur=0
x.fillStyle='black';x.fillRect(0,0,c.width,c.height)}else if(level===12){c.width|=0
for(i=360;i--;)x.lineTo((S(t-i)*i+t*S(t+i))*3,(S(t+(i&i/2))*(2e3*S((i&(256*t))|i)*t-i))/(t+t))
x.fill`evenodd`}else if(level===13){for(i=100;i--;)for(j=60;j--;x.fillStyle=`hsl(${180*(C(i/10+t/2)**3+S(j/10+t/2))+60*t},99%,50%)`)x.fillRect(10*i,10*j,10,10)}}
function gameLoop(){now=Date.now();delta=now-then;time=frame/30;if(time*30|0==frame-1){time+=0.000001}
frame++;ctx.clearRect(0,0,canvas.width,canvas.height);animateBackground(time,currentLevel);drawElevatorPanel();if(gameState==='start'){drawScreen([{text:'Press Enter to Start'}])}else if(gameState==='playing'){if(gamePhase==='flyingToBoss'){updateFlyingToBoss()}else if(gamePhase==='bossIntro'){drawBossIntro()}else if(gamePhase==='fightingBoss'){updatePlayer();drawPlayer();if(bossReady){drawBoss();drawBossHealthBar()}
checkCollisions();drawPlayerBullets();drawEnemyBullets();drawExplosions();updateHUD()}}else if(gameState==='paused'){drawScreen([{text:'Paused'},{text:'Press Space to Resume'},{text:'Press Escape to Leave'}])}else if(gameState==='levelComplete'){drawScreen([{text:`Level ${currentLevel - 1} Complete!`},{text:'Press Enter to Continue'}])}else if(gameState==='gameOver'){resetGame()}
if(gameState!=='gameOver'){animationFrameId=requestAnimationFrame(gameLoop)}}
initializeGame();document.addEventListener('keydown',function(event){if(gameState==='start'&&event.key==='Enter'){gameState='playing';music=setInterval(playMusic,1000);spawnBoss(currentLevel);startFlyingToBoss()}else if(gameState==='playing'&&event.key==='Escape'){gameState='paused'}else if(gameState==='paused'&&event.key===' '){gameState='playing'}else if(gameState==='paused'&&event.key==='Escape'){gameState='gameOver'}else if(gameState==='gameOver'&&event.key==='Enter'){clearInterval(music);initializeGame();startGameLoop()}else if(gameState==='levelComplete'&&event.key==='Enter'){gameState='playing';gamePhase='flyingToBoss';spawnBoss(currentLevel);startFlyingToBoss();startGameLoop()}});document.addEventListener('keydown',function(event){if(event.key==='ArrowLeft')player.moveLeft=!0;if(event.key==='ArrowRight')player.moveRight=!0;if(event.key==='ArrowUp')player.moveUp=!0;if(event.key==='ArrowDown')player.moveDown=!0;if(event.key==='Shift')player.isSlow=!0});document.addEventListener('keyup',function(event){if(event.key==='ArrowLeft')player.moveLeft=!1;if(event.key==='ArrowRight')player.moveRight=!1;if(event.key==='ArrowUp')player.moveUp=!1;if(event.key==='ArrowDown')player.moveDown=!1;if(event.key==='Shift')player.isSlow=!1});gameLoop()