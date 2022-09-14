!function t(e,n,s){function i(a,r){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!r&&c)return c(a,!0);if(o)return o(a,!0);var w=new Error("Cannot find module '"+a+"'");throw w.code="MODULE_NOT_FOUND",w}var p=n[a]={exports:{}};e[a][0].call(p.exports,function(t){var n=e[a][1][t];return i(n||t)},p,p.exports,t,e,n,s)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<s.length;a++)i(s[a]);return i}({1:[function(t,e,n){const s=t("./Engine/gameLoop"),i=t("./Engine/inputManager"),o=t("./Heplers/SoundManager"),a=t("./Engine/gsm"),r=t("./Heplers/Camera"),c=t("./States/menuState");t("./States/levelState");t("./States/howToPlayState");t("./Heplers/Wall.helper");t("./UI/App");const w=document.querySelector("#game"),p=w.getContext("2d"),h=new r(0,0,800,600,p);window.gameContext=p,window.gameCamera=h,window.gameCanvas=w;const l=()=>{const t=window.innerWidth,e=window.innerHeight;let n=t/810;t>810&&(e<620*n&&(n=e/620),w.style.transform=`scale(${n})`,w.style.transformOrigin="top")};window.addEventListener("resize",l),l();const d=(t,e)=>new Promise(n=>{const s=e?new Audio:new Image;s.src=t,s.onload=()=>{n(s)},s.onerror=t=>{console.log(t)}});(async()=>{window.gsm=new a,o.init(),i.init(),await window.gsm.changeState(c),window.assets={},window.assets.player=await d("IT_Man.png"),window.assets.computer=await d("Computer.png"),window.assets.password=await d("Item_1.png"),window.assets.wall=await d("Walls.png"),window.assets.backgroundWall=await d("Wall.png"),window.assets.enemy1=await d("Enemy_1.png"),window.assets.enemy2=await d("Enemy_2.png"),s.start(t=>{i.update(),h.update(),window.gsm.update(t)})})()},{"./Engine/gameLoop":4,"./Engine/gsm":5,"./Engine/inputManager":6,"./Heplers/Camera":7,"./Heplers/SoundManager":12,"./Heplers/Wall.helper":13,"./States/howToPlayState":14,"./States/levelState":15,"./States/menuState":16,"./UI/App":26}],2:[function(t,e,n){var s,i;s=this,i=function(t){var e=440*Math.pow(Math.pow(2,1/12),-9),n=/^[0-9.]+$/,s=/\s+/,i=/(\d+)/,o={};function a(t){var e=t.split(s);this.frequency=a.getFrequency(e[0])||0,this.duration=a.getDuration(e[1])||0}function r(t,e,n){this.ac=t||new AudioContext,this.createFxNodes(),this.tempo=e||120,this.loop=!0,this.smoothing=0,this.staccato=0,this.notes=[],this.push.apply(this,n||[])}"B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb".split("|").forEach(function(t,e){t.split("-").forEach(function(t){o[t]=e})}),a.getFrequency=function(t){var n=t.split(i),s=o[n[0]],a=(n[1]||4)-4;return e*Math.pow(Math.pow(2,1/12),s)*Math.pow(2,a)},a.getDuration=function(t){return n.test(t)?parseFloat(t):t.toLowerCase().split("").reduce(function(t,e){return t+("w"===e?4:"h"===e?2:"q"===e?1:"e"===e?.5:"s"===e?.25:0)},0)},r.prototype.createFxNodes=function(){var t=this.gain=this.ac.createGain();return[["bass",100],["mid",1e3],["treble",2500]].forEach(function(e,n){(n=this[e[0]]=this.ac.createBiquadFilter()).type="peaking",n.frequency.value=e[1],t.connect(t=n)}.bind(this)),t.connect(this.ac.destination),this},r.prototype.push=function(){return Array.prototype.forEach.call(arguments,function(t){this.notes.push(t instanceof a?t:new a(t))}.bind(this)),this},r.prototype.createCustomWave=function(t,e){e||(e=t),this.waveType="custom",this.customWave=[new Float32Array(t),new Float32Array(e)]},r.prototype.createOscillator=function(){return this.stop(),this.osc=this.ac.createOscillator(),this.customWave?this.osc.setPeriodicWave(this.ac.createPeriodicWave.apply(this.ac,this.customWave)):this.osc.type=this.waveType||"square",this.osc.connect(this.gain),this},r.prototype.scheduleNote=function(t,e){var n=60/this.tempo*this.notes[t].duration,s=n*(1-(this.staccato||0));return this.setFrequency(this.notes[t].frequency,e),this.smoothing&&this.notes[t].frequency&&this.slide(t,e,s),this.setFrequency(0,e+s),e+n},r.prototype.getNextNote=function(t){return this.notes[t<this.notes.length-1?t+1:0]},r.prototype.getSlideStartDelay=function(t){return t-Math.min(t,60/this.tempo*this.smoothing)},r.prototype.slide=function(t,e,n){var s=this.getNextNote(t),i=this.getSlideStartDelay(n);return this.setFrequency(this.notes[t].frequency,e+i),this.rampFrequency(s.frequency,e+n),this},r.prototype.setFrequency=function(t,e){return this.osc.frequency.setValueAtTime(t,e),this},r.prototype.rampFrequency=function(t,e){return this.osc.frequency.linearRampToValueAtTime(t,e),this},r.prototype.play=function(t){return t="number"==typeof t?t:this.ac.currentTime,this.createOscillator(),this.osc.start(t),this.notes.forEach(function(e,n){t=this.scheduleNote(n,t)}.bind(this)),this.osc.stop(t),this.osc.onended=this.loop?this.play.bind(this,t):null,this},r.prototype.stop=function(){return this.osc&&(this.osc.onended=null,this.osc.disconnect(),this.osc=null),this},t.Note=a,t.Sequence=r},"function"==typeof define&&define.amd?define(["exports"],i):"object"==typeof n&&"string"!=typeof n.nodeName?i(n):i(s.TinyMusic={})},{}],3:[function(t,e,n){e.exports={ECS:function(t){this.systems=t,this.start=()=>{this.systems.forEach(t=>{t.init()})},this.update=t=>{this.systems.forEach(e=>{e.update(t)})}},Entity:function(t){this.components={},this.componentTypes=t.map(t=>t.n),t.forEach(t=>{this.components[t.n]=t})}}},{}],4:[function(t,e,n){let s=0;function i(t){return window.requestAnimationFrame(function(){let e=Date.now(),n=e-s;n>999?n=1/60:n/=1e3,s=e,t(n)})}e.exports={start:function(t){return i(function e(n){t(n),i(e)})},stop:function(t){window.cancelAnimationFrame(t)}}},{}],5:[function(t,e,n){function s(){}s.prototype.update=t=>{this.currentState.update(t)},s.prototype.changeState=async t=>{await t.init(),this.currentState=t},e.exports=s},{}],6:[function(t,e,n){const s={update:function(){let t;for(t=8;t<222;t++)this.keys[t].isDown&&(this.keys[t].isDown===this.keys[t].prevIsDown?this.keys[t].isPressed=!0:this.keys[t].isPressed=!1,this.keys[t].prevIsDown=this.keys[t].isDown)},init:function(){this.keys={};for(let t=8;t<222;t++)this.keys[t]={isDown:!1,isPressed:!1};window.addEventListener("keydown",t=>{try{this.keys[t.which].isDown=!0}catch(t){}}),window.addEventListener("keyup",t=>{try{this.keys[t.which].isDown=!1,this.keys[t.which].prevIsDown=!1,this.keys[t.which].isPressed=!1}catch(t){}})}};e.exports=s},{}],7:[function(t,e,n){const{SCALE:s,TILE_SIZE:i}=t("../const"),o=function(t,e,n,s,i){this.ctx=i,this.x=t,this.y=e,this.w=n,this.h=s,this.color=0};o.prototype.update=function(){this.ctx.fillStyle=`hsl(${this.color}, 100%, 20%)`,this.color+=1,this.color>360&&(this.color=0),this.ctx.fillRect(-5e3,-5e3,1e4,1e4),this.ctx.fillStyle="#111",this.ctx.fillRect(20,20,33*i*s-50,37*i*s-50),this.followPoint&&this.moveTo(this.followPoint.x,this.followPoint.y)},o.prototype.setFollowPoint=function(t){this.followPoint=t},o.prototype.moveTo=function(t,e){const n=t-this.w+64,i=e-this.h+64;let o=(this.x-n)*s,a=(this.y-i)*s;this.ctx.translate(o,a),this.x=n,this.y=i},e.exports=o},{"../const":36}],8:[function(t,e,n){const{Entity:s}=t("../../Engine/ecs"),{TILE_SIZE:i}=t("../../const");e.exports=function(t,e,n,o){return new s([{n:"Cp",state:"LOCKED",timer:0,password:"SECRET_123"},{n:"D",width:64,height:64,image:o},{n:"A",currentFrame:0,state:1===n?"BROKEN":"LOCKED",frames:3,animations:{LOCKED:2,BROKEN:{frames:[0,1],time:5},FIXED:1},delayTimer:0},{n:"Ph",x:t*i,y:e*i,vx:0,vy:0,ax:0,ay:0,width:64,height:64,skipCollisionCheck:!0}])}},{"../../Engine/ecs":3,"../../const":36}],9:[function(t,e,n){e.exports=[[[6,"w","w",6,"w","w",6,"w","w",6,"w",6,"w",6,"w",6,"w",6,"w","w",6,"w","w",6,"w","w",6,"w","w",6,"w","w",6],["w","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","w"],[6,"",6,"w",6,"w",6,"",6,"w","w",6,"w",6,"",6,"w",6,"",6,"w","w",6,"w",6,"",6,"w",6,"w",6,"",6],["w","","w",7,7,7,"w","","w",7,7,7,7,"w","","w",7,"w","","w",7,7,7,7,"w","","w",7,7,7,"w","","w"],["w","","w",7,7,7,"w","","w",7,7,7,7,"w","","w",7,"w","","w",7,7,7,7,"w","","w",7,7,7,"w","","w"],[6,"",6,"w",6,"w",6,"",6,"w","w",6,"w",6,"",6,"w",6,"",6,"w","w",6,"w",6,"",6,"w",6,"w",6,"",6],["w","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","w"],["w","",6,"w",6,"w",6,"",6,"w",6,"",6,"w",6,"w",6,"w",6,"w",6,"",6,"w",6,"",6,"w",6,"w",6,"","w"],[6,"","w",7,7,7,"w","","w",7,"w","","w",7,7,7,7,7,7,7,"w","","w",7,"w","","w",7,7,7,"w","",6],["w","",6,"w",6,"w",6,"","w",7,6,"",6,"w","w",6,"w",6,"w","w",6,"",6,7,"w","",6,"w",6,"w",6,"","w"],["w","","","","","","","",6,7,"w","","","","","","","","","","","","w",7,6,"","","","","","","","w"],[6,"w",6,"",6,"w",6,"","w",7,6,"w","w",6,"w",6,"w",6,"w",6,"w","w",6,7,"w","",6,"w",6,"",6,"w",6],["w",7,"w","","w",7,"w","","w",7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,"w","","w",7,"w","","w",7,"w"],["w",7,"w","","w",7,"w","",6,"w",6,"w","w",6,"w",6,"w",6,"w",6,"w","w",6,"w",6,"","w",7,"w","","w",7,"w"],[6,7,6,"",6,7,6,"","","","","","","","","",0,"","","","","","","","","",6,7,6,"",6,7,6],["w",7,"w","","w",7,"w","",6,"w",6,"",6,"w","w",6,"w","w",6,"w",6,"",6,"w",6,"","w",7,"w","","w",7,"w"],[6,7,"w","",6,"w",6,"","w",7,"w","","w",7,7,7,7,7,7,7,"w","","w",7,"w","",6,"w",6,"","w",7,"w"],["w",7,6,"","","","","","w",7,"w","",6,"w","w",6,7,6,"w","w",6,"","w",7,"w","","","","","",6,7,6],[6,7,"w","",6,"w",6,"",6,7,6,"","","","","w",7,"w","","","","",6,7,6,"",6,"w",6,"","w",7,"w"],["w",7,6,"","w",7,"w","","w",7,"w","","","","","w",7,"w","","","","","w",7,"w","","w",7,"w","","w",7,"w"],[6,7,"w","",6,7,6,"",6,7,6,"",6,"w","w",6,7,6,"w","w",6,"",6,7,6,"",6,7,6,"",6,7,6],["w",7,"w","","w",7,"w","","w",7,"w","","w",7,7,7,7,7,7,7,"w","","w",7,"w","","w",7,"w","","w",7,"w"],[6,"w",6,"",6,"w",6,"",6,"w",6,"",6,"w","w",6,"w",6,"w","w",6,"",6,"w",6,"",6,"w",6,"",6,"w",6],["w","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","w"],[6,"",6,"w",6,"w",6,"",6,"w",6,"w","w",6,"",6,"w",6,"",6,"w",6,"w","w",6,"",6,"w",6,"w",6,"",6],["w","","w",7,7,7,"w","","w",7,7,7,7,"w","","w",7,"w","","w",7,7,7,7,"w","","w",7,7,7,"w","","w"],["w","",6,"w",6,"w",6,"",6,"w",6,"w","w",6,"",6,"w",6,"",6,"w",6,"w","w",6,"",6,7,6,"w",6,"","w"],[6,"","","","","","","","","","","","","","","","","","","","","","","","","","w",7,"w","","","",6],["w","",6,"w",6,"w",6,"",6,"w",6,"",6,"w",6,"w",6,"w",6,"w",6,"",6,"w",6,"",6,7,6,"","","","w"],["w","","w",7,7,7,"w","","w",7,"w","","w",7,7,7,7,7,7,7,"w","","w",7,"w","","w",7,"w","","","","w"],[6,"",6,"w",6,"w",6,"",6,7,6,"",6,"w","w",6,7,6,"w","w",6,"",6,7,6,"",6,"w",6,"","","",6],["w","","","","","","","","w",7,"w","","","","","w",7,"w","","","","","w",7,"w","","","","","","","","w"],["w","",6,"w",6,"w",6,"w",6,7,6,"w","w",6,"",6,7,6,"",6,"w","w",6,7,6,"w",6,"w",6,"w",6,"","w"],[6,"","w",7,7,7,7,7,7,7,7,7,7,"w","","w",7,"w","","w",7,7,7,7,7,7,7,7,7,7,"w","",6],["w","",6,"w",6,"w",6,"w",6,"w","w",6,"w",6,"",6,"w",6,"",6,"w","w",6,"w",6,"w",6,"w",6,"w",6,"","w"],["w","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","w"],[6,"w","w",6,"w","w",6,"w","w",6,"w",6,"w",6,"w",6,"w",6,"w","w",6,"w","w",6,"w","w",6,"w","w",6,"w","w",6]]]},{}],10:[function(t,e,n){const{Entity:s}=t("../../Engine/ecs"),{TILE_SIZE:i}=t("../../const");e.exports=function(t,e,n){return[new s([{n:"P",state:"idle",alive:!0,timer:1500},{n:"D",width:96,height:96,flipX:!1,image:t.assets.player,offsetX:8,priority:2},{n:"A",currentFrame:0,state:"IDLE",frames:5,animations:{BACK_UP:{frames:[3,4],time:10},WALK:{frames:[1,2],time:10},IDLE:0},delayTimer:0},{n:"Ph",x:e*i,y:n*i,vx:0,vy:0,ax:0,ay:0,width:80,height:96}])]}},{"../../Engine/ecs":3,"../../const":36}],11:[function(t,e,n){const{Entity:s}=t("../Engine/ecs"),{TILE_SIZE:i}=t("../const"),{generateWall:o,generatePhEntities:a}=t("./Wall.helper"),r=t("./Map/Level1"),c=t("./Map/PlayerGenerator"),w=t("./Map/ComputerGenerator"),p=[c,(t,e,n)=>[w(e,n,1,t.assets.computer)],(t,e,n)=>[w(e,n,2,t.assets.computer)],()=>{},()=>{},()=>{},(t,e,n)=>{const r=o(t,e,n);if(r)return[new s([{n:"D",x:e*i,y:n*i,width:288,height:288,image:t.assets.wall,currentFrame:5-r.type,rotate:r.rotation,offsetX:112,offsetY:112},{n:"Ph",x:e*i,y:n*i,width:64,height:64,vx:0,vy:0,ax:0,ay:0},{n:"M"}]),...a(r,e,n)]},(t,e,n)=>[new s([{n:"D",x:e*i,y:n*i,width:102,height:102,image:t.assets.backgroundWall,offsetX:20,offsetY:20},{n:"Ph",x:e*i,y:n*i,width:102,height:102,vx:0,vy:0,ax:0,ay:0}])]],h=function(t){this.rows=37,this.cols=33,this.assets=t,this.mapData=r};h.prototype.loadMap=function(t){const e=this.mapData[t];let n=[];for(let t=0;t<this.rows;t++)for(let s=0;s<this.cols;s++){const i=e[t][s];if(""===i)continue;const o=Number(i);if("number"!=typeof i)continue;const a=p[o](this,s,t);n=n.concat(a)}return n.filter(t=>t)},e.exports=h},{"../Engine/ecs":3,"../const":36,"./Map/ComputerGenerator":8,"./Map/Level1":9,"./Map/PlayerGenerator":10,"./Wall.helper":13}],12:[function(t,e,n){const s=t("tinymusic");e.exports={init:()=>{ac=new AudioContext,this.sounds={},this.sounds.fixing=new s.Sequence(ac,280,["B2 q","B2 q","G2 q"]),this.sounds.fixing.createCustomWave([-.8,1,.8,.8,-.8,-.8,-1]),this.sounds.fixing.gain.gain.value=.4,this.sounds.fixing.staccato=.2,this.sounds.fixing.loop=!1,this.sounds.death=new s.Sequence(ac,280,["F2 q","E3 q","- q","Ab2 q","- q","F2 q"]),this.sounds.death.createCustomWave([-1,0,1,0,-1,0,1]),this.sounds.death.gain.gain.value=.4,this.sounds.death.staccato=.2,this.sounds.death.loop=!1,this.sounds.pickup=new s.Sequence(ac,280,["G2 q","B2 q"]),this.sounds.pickup.createCustomWave([-.8,1,.8,.8,-.8,-.8,-1]),this.sounds.pickup.gain.gain.value=.4,this.sounds.pickup.staccato=.2,this.sounds.pickup.loop=!1},play:t=>{this.sounds[t].play()},stop:t=>{this.sounds[t].stop()}}},{tinymusic:2}],13:[function(t,e,n){const{Entity:s}=t("../Engine/ecs"),{TILE_SIZE:i}=t("../const");e.exports={generateWall:function(t,e,n){const{mapData:s}=t,i=s[0],o=[];for(let t=0;t<3;t++)for(let s=0;s<3;s++)t%2==0&&s%2==0||1===s&&1===t||i[n+t-1]&&"w"===i[n+t-1][e+s-1]&&o.push({x:s,y:t,ox:e+s,oy:n+t});switch(o.length){case 2:{const[t,e]=o;if(2===Math.abs(t.x-e.x)||2===Math.abs(t.y-e.y))return{type:2,rotation:t.x===e.x?0:1,walls:o};const n={type:3,walls:o};return 2===e.x?n.rotation=0:2===t.x?n.rotation=1:0===t.x?n.rotation=2:0===e.x&&(n.rotation=3),n}case 3:{const t={type:4,walls:o},[e,n,s]=o;return n.y===s.y||e.y===n.y?(t.rotation=1===e.x?3:1,t):(t.rotation=0===n.x?2:0,t)}case 4:return{type:5,walls:o}}},generatePhEntities:function(t,e,n){const{walls:o}=t,a=o.sort((t,e)=>t.x-e.x)[0],r=o.sort((t,e)=>t.y-e.y)[0],c=o.sort((t,e)=>e.x-t.x)[0],w=o.sort((t,e)=>e.y-t.y)[0],p=0===a.x?32:0,h=0===r.y?32:0;return[new s([{n:"D",x:t.ox+1*i,y:t.oy*i,width:12,height:12},{n:"Ph",x:a.ox*i-p-96,y:(n+1)*i-96,width:128*(c.x-a.x)+64,height:64,vx:0,vy:0,ax:0,ay:0},{n:"M"}]),new s([{n:"D",x:t.ox+1*i,y:t.oy*i,width:12,height:12,offsetX:20},{n:"Ph",x:(e+1)*i-96,y:r.oy*i-h-96,width:64,height:128*(w.y-r.y)+64,vx:0,vy:0,ax:0,ay:0},{n:"M"}])]}}},{"../Engine/ecs":3,"../const":36}],14:[function(t,e,n){t("../Engine/inputManager"),t("./menuState");const s={init:()=>{window.dispatch("HIDE_MENU"),window.dispatch("SHOW_HTP")},update:()=>{}};window.howToPlayState=s,e.exports=s},{"../Engine/inputManager":6,"./menuState":16}],15:[function(t,e,n){const{ECS:s,Entity:i}=t("../Engine/ecs"),o=(t("../Heplers/SoundManager"),t("../Systems/playerSystem")),a=t("../Systems/physicsSystem"),r=t("../Systems/drawSystem"),c=t("../Systems/animationSystem"),w=t("../Systems/collisionSystem"),p=t("../Systems/computerSystem"),h=t("../Systems/itemSystem"),l=t("../Systems/spawnerSystem"),d=t("../Systems/enemySystem"),u=t("../States/menuState"),{ENEMY_SPEED:y}=t("../const"),m=t("../Heplers/MapGenerator"),f=(t,e,n,s=1)=>new i([{n:"E",type:n,bh:1===n?"RANDOM":"LINEAR",dirTimer:0},{n:"A",currentFrame:0,state:"WALK",frames:2===n?3:2,animations:{WALK:{frames:2===n?[0,1,2]:[0,1],time:2===n?20:13}},delayTimer:0},{n:"D",x:-100,y:-100,width:96,height:96,image:2===n?assets.enemy2:assets.enemy1,offsetX:12,offsetY:12},{n:"Ph",x:t,y:e,vx:0,vy:0,ax:0,ay:y*s,width:72,height:72,skipCollisionCheck:!0}]),x={init:async()=>{const t=window.assets;x.ecs=new s([o,a,r,c,w,p,h,l,d]);const e=await new m(t);window.dispatch("HIDE_GOM"),window.dispatch("HIDE_BU_MODAL"),window.dispatch("HIDE_PASS_INDICATOR");const n=e.loadMap(0);n.push(new i([{n:"S"},{n:"Cp",state:"FIXED",timer:0},{n:"D",width:64,height:64,image:t.computer},{n:"A",currentFrame:0,state:"FIXED",frames:3,animations:{LOCKED:2,BROKEN:{frames:[0,1],time:5},FIXED:1},delayTimer:0},{n:"Ph",x:100,y:100,vx:0,vy:0,ax:0,ay:0,width:64,height:64,skipCollisionCheck:!0}]),new i([{n:"S"},{n:"I",name:"Password",type:"PASS",pass:"SECRET_123",floatTimer:1,floatDirection:-1,timer:0},{n:"D",x:-100,y:-100,width:52,height:52,invisible:!0,image:t.password}]),f(655,500,2,-1),f(2395,500,2),f(2395,1400,2),f(655,1400,1),f(655,2400,1,-1),f(2395,2400,1));const y=n.find(t=>t.componentTypes.includes("P"));window.gameCamera.setFollowPoint(y.components.Ph),r.init(n,window.gameContext),p.init(n),h.init(n),w.init(n),o.init(n,u),a.init(n),c.init(n),l.init(n),d.init(n)},update:t=>{x.ecs.update(t)}};window.levelState=x,e.exports=x},{"../Engine/ecs":3,"../Heplers/MapGenerator":11,"../Heplers/SoundManager":12,"../States/menuState":16,"../Systems/animationSystem":17,"../Systems/collisionSystem":18,"../Systems/computerSystem":19,"../Systems/drawSystem":20,"../Systems/enemySystem":21,"../Systems/itemSystem":22,"../Systems/physicsSystem":23,"../Systems/playerSystem":24,"../Systems/spawnerSystem":25,"../const":36}],16:[function(t,e,n){const s=t("../Engine/inputManager"),i=t("./levelState"),o={init:()=>{window.dispatch("SHOW_MENU"),window.dispatch("HIDE_HTP")},update:()=>{s.keys[32].isDown&&(window.dispatch("HIDE_MENU"),window.gsm.changeState(i))}};window.menuState=o,e.exports=o},{"../Engine/inputManager":6,"./levelState":15}],17:[function(t,e,n){const s={init:t=>{this.systemEntities=t.filter(t=>t.componentTypes.includes("A"))},update:t=>{this.systemEntities.forEach(t=>{const{state:e,currentFrame:n,animations:s}=t.components.A;if(currentState=Object.keys(s).find(t=>{const e=s[t];if(e.frames)return e.frames.includes(n)?t:void 0}),currentState!==e)return t.components.A.delayTimer=0,void(s[e].frames?t.components.A.currentFrame=s[e].frames[0]:t.components.A.currentFrame=s[e]);t.components.A.delayTimer++,t.components.A.delayTimer<=s[e].time||(t.components.A.delayTimer=0,t.components.A.currentFrame+=1,t.components.A.currentFrame>s[e].frames[s[e].frames.length-1]&&(t.components.A.currentFrame=s[e].frames[0]))})}};e.exports=s},{}],18:[function(t,e,n){const s={init:t=>{this.playerEntity=t.filter(t=>t.componentTypes.includes("P"))[0],this.systemEntities=t.filter(t=>t.componentTypes.includes("Ph")&&!t.componentTypes.includes("P"))},update:t=>{(t=>{t.x<0&&(t.x=0),t.y<0&&(t.y=0)})(this.playerEntity.components.Ph),this.systemEntities.forEach(t=>{t.components.Ph.skipCollisionCheck||((t,e)=>{if(((t,e)=>t.x<e.x+e.width&&t.x+t.width>e.x&&t.y<e.y+e.height&&t.y+t.height>e.y)(t,e)){let n=t.width+t.x-e.x,s=e.x+e.width-t.x,i=t.height+t.y-e.y,o=e.y+e.height-t.y;const a=[n,s,i,o];switch(Math.min(...a)){case n:t.x=e.x-t.width+t.ax,t.ax=0,t.vx=0;break;case s:t.x=e.x+e.width+t.ax,t.ax=0,t.vx=0;break;case i:t.y=e.y-t.height+t.ay,t.ay=0,t.vy=0;break;case o:t.y=e.y+e.height+t.ay,t.ay=0,t.vy=0}return!0}})(this.playerEntity.components.Ph,t.components.Ph)})}};e.exports=s},{}],19:[function(t,e,n){const s=t("../Heplers/SoundManager"),{SCALE:i}=t("../const");const o=t=>{const e=t.computerEntity,n=t.passEntity,o=e.components.Ph,a=e.components.Cp,r=e.components.A;if(function(t,e){const{x:n,y:s,width:i,height:o}=t.components.Ph,{x:a,y:r,width:c,height:w}=e;return(p={x:n,y:s,width:i,height:o}).x<(h={x:a,y:r,width:c,height:w}).x+h.width&&p.x+p.width>h.x&&p.y<h.y+h.height&&p.y+p.height>h.y;var p,h}(this.playerEntity,o)){if(window.dispatch("HIDE_INDICATOR"),"BACK_UP"!==this.playerEntity.components.P.state)return a.backupTimer=0,void window.dispatch("HIDE_BU_MODAL");switch(a.state){case"BROKEN":a.backupTimer++,window.dispatch("SHOW_BU_MODAL",a.backupTimer,o.x*i,o.y*i),a.backupTimer>40&&(a.state="FIXED",r.state="FIXED",a.backupTimer=0,window.dispatch("ADD_SCORE",100),window.dispatch("HIDE_BU_MODAL"),s.play("fixing"),this.playerEntity.components.P.timer=this.playerEntity.components.P.timer+700);break;case"LOCKED":n.components.D.invisible?(a.state="BROKEN",r.state="BROKEN"):window.dispatch("CHANGE_STATUS","You need to pickup password first to unlock computer!")}}else window.dispatch("SHOW_INDICATOR")},a={init:t=>{this.playerEntity=t.find(t=>t.componentTypes.includes("P")),this.computerEntity=t.filter(t=>t.componentTypes.includes("Cp"))[0],this.passEntity=t.find(t=>t.componentTypes.includes("I")&&"PASS"===t.components.I.type)},update:()=>{o(this)}};e.exports=a},{"../Heplers/SoundManager":12,"../const":36}],20:[function(t,e,n){const{SCALE:s}=t("../const"),i={init:(t,e)=>{this.systemEntities=t.filter(t=>t.componentTypes.includes("D")).sort((t,e)=>{return(t.components.D.priority?t.components.D.priority:0)-(e.components.D.priority?e.components.D.priority:0)}),this.context=e,this.context.webkitImageSmoothingEnabled=!1,this.context.imageSmoothingEnabled=!1},update:()=>{this.systemEntities.forEach(t=>{const{x:e,y:n,width:i,height:o,image:a,flipX:r,invisible:c,currentFrame:w,rotate:p}=t.components.D;let{offsetX:h,offsetY:l}=t.components.D;if(l=l||0,h=h||0,c)return;const d=t.components.A;if(a){if(this.context.save(),this.context.translate((e-h)*s,(n-l)*s),p&&(this.context.translate(i*s/2,o*s/2),this.context.rotate(Math.PI/2*p),this.context.translate(-i*s/2,-o*s/2)),d){const{currentFrame:t}=d;r&&(this.context.scale(-1,1),this.context.translate(-i*s,0)),this.context.drawImage(a,16*t,0,16,16,0,0,i*s,o*s)}else w?this.context.drawImage(a,16*w,0,16,16,0,0,i*s,o*s):this.context.drawImage(a,0,0,16,16,0,0,i*s,o*s);this.context.restore()}})}};e.exports=i},{"../const":36}],21:[function(t,e,n){const{ENEMY_SPEED:s}=t("../const"),i=t("../Heplers/SoundManager");function o(t,e){return t.x<e.x+e.width&&t.x+t.width>e.x&&t.y<e.y+e.height&&t.y+t.height>e.y}const a=(t,e,n)=>{const i=t.components.Ph,a=t.components.E,r={top:!1,left:!1,right:!1,bottom:!1};let c;e.forEach(t=>{const e=t.components.Ph;if(!r.top){const t=i.vy<0?32:i.height;r.top=o(e,{x:i.x,y:i.y-t,width:i.width,height:i.height})}if(!r.bottom){const t=i.vy>0?32:i.height;r.bottom=o(e,{x:i.x,y:i.y+t,width:i.width,height:i.height})}if(!r.left){const t=i.vx<0?32:i.width;r.left=o(e,{x:i.x-t,y:i.y,width:i.width,height:i.height})}if(!r.right){const t=i.vx>0?32:i.width;r.right=o(e,{x:i.x+t,y:i.y,width:i.width,height:i.height})}}),i.vx<0?(c="left",r.right=!0):i.vx>0?(c="right",r.left=!0):i.vy<0?(c="top",r.bottom=!0):(c="bottom",r.top=!0),a.dirTimer++;const w=!r[c];let p=!1;if(a.dirTimer<50&&w)return;if(w){if(!n)return;if(Math.random()>.5){const t=Object.keys(r).map(t=>!r[t]&&t).filter(t=>t);if(t.length<3)return;p=t[Math.floor(Math.random()*t.length)]}}else{const t=Object.keys(r).map(t=>!r[t]&&t).filter(t=>t);p=t[Math.floor(Math.random()*t.length)]}if(!p)return;i.ax=0,i.vx=0,i.ay=0,i.vy=0,a.dirTimer=0;const h=t.components.D;"left"===p?(i.ax=-s,h.flipX=!0):"right"===p?(i.ax=s,h.flipX=!1):"top"===p?i.ay=-s:"bottom"===p&&(i.ay=s)},r={init:t=>{this.systemEntities=t.filter(t=>t.componentTypes.includes("E")),this.player=t.find(t=>t.componentTypes.includes("P")),this.mapEntities=t.filter(t=>t.componentTypes.includes("M"))},update:t=>{this.systemEntities.forEach(t=>{const e=t.components.E;"RANDOM"===e.bh?a(t,this.mapEntities,!0):"LINEAR"===e.bh&&a(t,this.mapEntities,!1);const n=this.player.components.Ph;this.player.components.P.alive&&o(n,t.components.Ph)&&(this.player.components.P.alive=!1,i.play("death"),this.player.components.P.reason="VIRUS",window.dispatch("SHOW_GOM","Computer Virus got you!"),n.ax=0,n.ay=0)})}};e.exports=r},{"../Heplers/SoundManager":12,"../const":36}],22:[function(t,e,n){const s=t("../Heplers/SoundManager"),i={init:t=>{this.player=t.find(t=>t.componentTypes.includes("P")),this.systemEntities=t.filter(t=>t.componentTypes.includes("I"))},update:()=>{this.systemEntities.forEach(t=>{const e=t.components.I,n=t.components.D;n.invisible||(((t,e)=>{t.floatTimer>10&&(t.floatDirection=-t.floatDirection,t.floatTimer=0),t.timer>2&&(e.y=e.y+t.floatDirection,t.floatTimer++,t.timer=0),t.timer++})(e,n),((t,e)=>t.x<e.x+e.width&&t.x+t.width>e.x&&t.y<e.y+e.height&&t.y+t.height>e.y)(this.player.components.Ph,n)&&(n.invisible=!0,this.player.components.P.timer=this.player.components.P.timer+200,window.dispatch("HIDE_PASS_INDICATOR"),s.play("pickup")))})}};e.exports=i},{"../Heplers/SoundManager":12}],23:[function(t,e,n){const{FRICTION:s}=t("../const"),i={init:t=>{this.systemEntities=t.filter(t=>t.componentTypes.includes("Ph"))},update:t=>{this.systemEntities.forEach(t=>{const e=t.components.Ph,n=t.components.D,{ax:i,ay:o}=e;e.x+=e.vx,e.y+=e.vy,e.vx+=i,e.vy+=o,n&&(n.x=e.x,n.y=e.y),e.vx*=s,e.vy*=s})}};e.exports=i},{"../const":36}],24:[function(t,e,n){const s=t("../Engine/inputManager"),i=t("../Heplers/SoundManager"),{PLAYER_AX:o,PLAYER_AY:a}=t("../const"),r={init:t=>{this.systemEntities=t.filter(t=>t.componentTypes.includes("P")&&t.componentTypes.includes("Ph")&&t.componentTypes.includes("A")&&t.componentTypes.includes("D"))},update:t=>{this.systemEntities.forEach(t=>{const e=t.components.P;if(!e.alive)return t.components.Ph.ax=0,t.components.Ph.ay=0,void(s.keys[32].isDown&&window.gsm.changeState(window.levelState));s.keys[37].isDown?(e.state="GO_LEFT",s.keys[38].isDown?e.state="GO_UP_LEFT":s.keys[40].isDown&&(e.state="GO_DOWN_LEFT")):s.keys[39].isDown?(e.state="GO_RIGHT",s.keys[38].isDown?e.state="GO_UP_RIGHT":s.keys[40].isDown&&(e.state="GO_DOWN_RIGHT")):s.keys[38].isDown?(e.state="GO_UP",s.keys[37].isDown?e.state="GO_UP_LEFT":s.keys[39].isDown&&(e.state="GO_UP_RIGHT")):s.keys[40].isDown?(e.state="GO_DOWN",s.keys[37].isDown?e.state="GO_DOWN_LEFT":s.keys[39].isDown&&(e.state="GO_DOWN_RIGHT")):e.state="IDLE",s.keys[32].isDown&&(e.state="BACK_UP");const n=t.components.Ph,r=t.components.D,c=t.components.A;switch(e.state){case"GO_UP":c.state="WALK",n.ay=-a,n.ax=0;break;case"GO_DOWN":c.state="WALK",n.ay=a,n.ax=0;break;case"GO_LEFT":c.state="WALK",n.ax=-o,n.ay=0,r.flipX=!0;break;case"GO_RIGHT":c.state="WALK",n.ax=o,n.ay=0,r.flipX=!1;break;case"GO_UP_RIGHT":c.state="WALK",n.ax=.8*o,n.ay=.8*-a,r.flipX=!1;break;case"GO_UP_LEFT":c.state="WALK",n.ax=.8*-o,n.ay=.8*-a,r.flipX=!0;break;case"GO_DOWN_RIGHT":c.state="WALK",n.ax=.8*o,n.ay=.8*a,r.flipX=!1;break;case"GO_DOWN_LEFT":c.state="WALK",n.ax=.8*-o,n.ay=.8*a,r.flipX=!0;break;default:n.ax=0,n.ay=0,n.vx=0,n.vy=0}"IDLE"===e.state&&(c.state="IDLE"),"BACK_UP"===e.state&&(c.state="BACK_UP"),e.timer--,window.dispatch("UPDATE_TIME",e.timer),e.timer<=0&&(i.play("death"),e.alive=!1,e.reason="TIME",window.dispatch("SHOW_GOM","Your time finished!"))})}};e.exports=r},{"../Engine/inputManager":6,"../Heplers/SoundManager":12,"../const":36}],25:[function(t,e,n){const{TILE_SIZE:s}=t("../const"),i=32*s,o=36*s,a=(t,e)=>t.x<e.x+e.width&&t.x+t.width>e.x&&t.y<e.y+e.height&&t.y+t.height>e.y,r=(t,e,n)=>{let s,r,c=!1;for(;!c;){s=Math.floor(Math.random()*i),r=Math.floor(Math.random()*o),c=!t.find(t=>{const i=t.components.Ph;return a({x:s,y:r,width:e,height:n},i)})}return{x:s,y:r}},c={init:t=>{this.phEntities=t.filter(t=>t.componentTypes.includes("Ph")),this.systemEntities=t.filter(t=>t.componentTypes.includes("S"))},update:t=>{const e=this.systemEntities.filter(t=>t.componentTypes.includes("Cp")),n=this.systemEntities.filter(t=>t.componentTypes.includes("I"))[0];if(!e.filter(t=>"FIXED"!==t.components.Cp.state).length){const t=Math.floor(2*Math.random()),s=e[0].components.Ph,i=e[0].components.Cp,o=e[0].components.A,a=0===t?"BROKEN":"LOCKED";i.state=a,o.state=a;const{x:c,y:w}=r(this.phEntities,s.width,s.height);if(s.x=c,s.y=w,"LOCKED"===a){const t=n.components.D,{x:e,y:s}=r(this.phEntities,t.width,t.height);t.x=e,t.y=s,n.components.D.invisible=!1,window.dispatch("SET_PASS_INDICATOR",e,s)}window.dispatch("SET_INDICATOR",c,w)}}};e.exports=c},{"../const":36}],26:[function(t,e,n){const{html:s,createStore:i}=t("./innerself"),o=t("./state"),{attach:a,connect:r,dispatch:c}=i(o),w=t("./OuterUI"),p=t("./BUM"),h=t("./ComputerIndicator"),l=t("./PasswordIndicator"),d=t("./Menu"),u=t("./HowToPlay"),y=t("./GOM");window.connect=r,window.dispatch=c,a(function(){return s`
    ${r(w)()} 
    ${r(p)()} 
    ${r(h)()} 
    ${r(l)()} 
    ${r(d)()}
    ${r(u)()}
    ${r(y)()}
  `},document.querySelector("#root"))},{"./BUM":27,"./ComputerIndicator":28,"./GOM":29,"./HowToPlay":30,"./Menu":31,"./OuterUI":32,"./PasswordIndicator":33,"./innerself":34,"./state":35}],27:[function(t,e,n){const{html:s}=t("./innerself"),{SCALE:i}=t("../const");e.exports=function(t){const{displayBUModal:e,buTime:n}=t;if(!e)return s``;const i=Math.floor(2.5*n),o=window.gameCanvas?`${window.gameCanvas.getBoundingClientRect().height.toFixed(0)/2-90}px`:"50%";return s`
    <style>
      .buModal {
        top: ${o};
        left: 50%;
        position: absolute;
        border: 2px solid #73f6c6;
        padding: 10px 20px;
        z-index: 9;
        transform: translate(-50%, -50%);
      }
    </style>
    <div class="buModal">
      <span class="title">BACKING UP</span>
      <div class="perc">${i}%</div>
    </div>
  `}},{"../const":36,"./innerself":34}],28:[function(t,e,n){const{html:s}=t("./innerself"),{SCALE:i}=t("../const");e.exports=function(t){if(!window.gameCamera)return s``;const{displayIndicator:e,indicatorX:n,indicatorY:i}=t,{x:o,y:a}=window.gameCamera;if(!e)return s``;const r=document.querySelector("#game").getBoundingClientRect(),c=r.width,w=r.height,p=c/800,h=o,l=a,d=n-800,u=i-600,y=Math.sqrt(Math.pow(d-h,2)+Math.pow(u-l,2));return s`
    <style>
      .indicator {
        z-index: 5;
        display: inline-block;
        width: 5px;
        height: 5px;
        font-size: 20px;
        font-weight: 700;
        color: #dd00aa;
        text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
        position: absolute;
        transform: translate(${h+50*p/y*(d-h)-o}px, ${l+50*p/y*(u-l)-a+w/2}px);
      }
    </style>
    <div class='indicator'>C</div>
  `}},{"../const":36,"./innerself":34}],29:[function(t,e,n){const{html:s}=t("./innerself");e.exports=function(t){const{displayGOModal:e,score:n,killedBy:i}=t;if(!e)return s``;const o=window.gameCanvas?`${window.gameCanvas.getBoundingClientRect().height.toFixed(0)/2}px`:"50%";return s`
    <style>
      .background {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10;
      }

      .gom {
        font-size: 25px;
        position: absolute;
        border: 2px solid #73f6c6;
        z-index: 11;
        background-color: black;
        padding: 20px 150px 50px 150px;
        min-width: 400px;
        min-height: 200px;
        text-align: center;
        top: ${o};
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .gom .btn {
        margin: 30px 0;
      }
    </style>
    <div class="background"></div>
    <div class="gom">
      <h1>GAME OVER!</h1>
      <div>${i}</div>
      <div>You have scored: ${n.toFixed(0)}</div>
      <div class="btn" onclick="window.gsm.changeState(window.levelState)">[ Restart ]</div>
    </div>
  `}},{"./innerself":34}],30:[function(t,e,n){const{html:s}=t("./innerself");e.exports=function(t){const{htpVisible:e}=t;return e?s`
    <style>
      .HTP_tip {
        border: 1px solid currentcolor;
        padding: 40px;
      }
      .comp { color: #dd00aa; }
      .pass { color: #00dd00; }
    </style>
    <div class="HTP screen">
      <h1>How to play?</h1>
      <p class="HTP_tip">
        Use ARROWS for movement. Use SPACE to make backup.
        You make backup by stepping on computer first.
      </p>
      <p class="HTP_tip">
        To gain up time you need to make backup on computers.
        For locked computers you need to find password first.
      </p>
      <p class="HTP_tip">
        <span class="pass">P</span> and <span class="comp">C</span> 
        letters will show you where are password and computer
      </p>
      <p class="HTP_tip">
        You lose when your time ends.
        Watch out for Computer Viruses! 
      </p>
      <div class="btn" onclick="window.gsm.changeState(window.menuState)">[ Go back ]</div>
    </div>
  `:s``}},{"./innerself":34}],31:[function(t,e,n){const{html:s}=t("./innerself");e.exports=function(t){const{menuStateVisible:e}=t;return e?s`
    <style>
      .Menu h1, 
      .Menu h2 {
        display: inline-block;
      }

      .Menu h1 {
        font-size: 140px;
      }

      .Menu h2 {
        margin-left: 10px;
        font-size: 90px;
      }

      .Menu__blink {
        animation: test .7s infinite alternate steps(1); 
        opacity: 1;
      }

      .Menu__btn {
        cursor: pointer;
      }

      .Menu__btn:hover {
        color: white;
      }

      @keyframes test {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
      }
    </style>
    <div class="Menu screen">
      <div class="Menu__logo">
        <h1>IT</h1>
        <h2>man</h2>
      </div>
      <h3 class="Menu__blink">Press SPACE to start</h3> 
      <div class="btn" onclick="window.gsm.changeState(window.howToPlayState)">
        [ How to play? ]
      </div>
    </div>
  `:s``}},{"./innerself":34}],32:[function(t,e,n){const{html:s}=t("./innerself");e.exports=function(t){const{score:e,timeLeft:n}=t;return s`
    <style>
      .ui {
        background-color: black;
        position: absolute;
        z-index: 8;
        min-width: 600px;
        margin: 0px 10px;
        text-align: center;
        padding: 10px;
        font-size: 20px;
        display: flex;
        justify-content: space-around;
        border: 2px solid #73f8c6;
        left: 50%;
        transform: translateX(-50%);
      }

      .danger {
        color: #ff0000;
      }
    </style>
    <div class="ui">
      <span>SCORE: ${e.toFixed(0)}</span>
      <span class="${n<400&&"danger"}">TIME: ${n}</span>
    </div>
  `}},{"./innerself":34}],33:[function(t,e,n){const{html:s}=t("./innerself"),{SCALE:i}=t("../const");e.exports=function(t){if(!window.gameCamera)return s``;const{displayPassIndicator:e,passIndicatorX:n,passIndicatorY:i}=t,{x:o,y:a}=window.gameCamera;if(!e)return s``;const r=document.querySelector("#game").getBoundingClientRect(),c=r.width,w=r.height,p=c/800,h=o,l=a,d=n-800,u=i-600,y=Math.sqrt(Math.pow(d-h,2)+Math.pow(u-l,2));return s`
    <style>
      .pass-indicator {
        z-index: 5;
        display: inline-block;
        width: 5px;
        height: 5px;
        font-size: 20px;
        font-weight: 700;
        color: #00ff00;
        text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
        position: absolute;
        transform: translate(${h+50*p/y*(d-h)-o}px, ${l+50*p/y*(u-l)-a+w/2}px);
      }
    </style>
    <div class='pass-indicator'>P</div>
  `}},{"../const":36,"./innerself":34}],34:[function(t,e,n){e.exports={html:function([t,...e],...n){return n.reduce((t,n)=>t.concat(n,e.shift()),[t]).filter(t=>null!=t).join("")},createStore:function(t){let e=t();const n=new Map,s=new Map;function i(){for(const[t,i]of n){const n=i();if(n!==s.get(t)){s.set(t,n),t.innerHTML=n;const i=new CustomEvent("render",{detail:e});t.dispatchEvent(i)}}}return{attach(t,e){n.set(e,t),i()},connect:t=>(...n)=>t(e,...n),dispatch(n,...s){e=t(e,n,s),i()}}}}},{}],35:[function(t,e,n){const s={eq:[],score:0,lifes:3,bumX:100,bumY:100,displayPassIndicator:!1};e.exports=function(t=s,e,n){switch(e){case"ADD_SCORE":{const[e]=n;return{...t,score:t.score+e}}case"SET_PASS_INDICATOR":{const[e,s]=n;return{...t,passIndicatorX:e,passIndicatorY:s,displayPassIndicator:!0}}case"SHOW_PASS_INDICATOR":return{...t,displayPassIndicator:!0};case"HIDE_PASS_INDICATOR":return{...t,displayPassIndicator:!1};case"SET_INDICATOR":{const[e,s,i,o]=n;return{...t,indicatorX:e,indicatorY:s,playerX:i,playerY:o,displayIndicator:!0}}case"SHOW_INDICATOR":return{...t,displayIndicator:!0};case"HIDE_INDICATOR":return{...t,displayIndicator:!1};case"UPDATE_TIME":return{...t,timeLeft:n[0],score:t.score+.1};case"SHOW_GOM":return{...t,displayGOModal:!0,killedBy:n[0]};case"HIDE_GOM":return{...t,score:0,displayGOModal:!1};case"SHOW_BU_MODAL":{const[e]=n;return{...t,buTime:e,displayBUModal:!0}}case"HIDE_BU_MODAL":return{...t,displayBUModal:!1};case"SHOW_HTP":return{...t,htpVisible:!0};case"HIDE_HTP":return{...t,htpVisible:!1};case"SHOW_MENU":return{...t,menuStateVisible:!0};case"HIDE_MENU":return{...t,menuStateVisible:!1}}return t}},{}],36:[function(t,e,n){e.exports={PLAYER_AX:1.6,PLAYER_AY:1.6,FRICTION:.85,SCALE:.5,TILE_SIZE:96,ENEMY_SPEED:1.4}},{}]},{},[1]);