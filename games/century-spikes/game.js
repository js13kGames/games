(function () {
  'use strict';

  /**
   * @preserve
   * Kontra.js v9.0.0
   */
  let noop=()=>{};function removeFromArray(t,e){let i=t.indexOf(e);if(-1!=i)return t.splice(i,1),!0}let canvasEl,context,callbacks$2={};function on(t,e){callbacks$2[t]=callbacks$2[t]||[],callbacks$2[t].push(e);}function emit(t,...e){(callbacks$2[t]||[]).map((t=>t(...e)));}let handler$1={get:(t,e)=>"_proxy"==e||noop};function getCanvas(){return canvasEl}function getContext(){return context}function init$1(t,{contextless:e=!1}={}){if(canvasEl=document.getElementById(t)||t||document.querySelector("canvas"),e&&(canvasEl=canvasEl||new Proxy({},handler$1)),!canvasEl)throw Error("You must provide a canvas element for the game");return context=canvasEl.getContext("2d")||new Proxy({},handler$1),context.imageSmoothingEnabled=!1,emit("init"),{canvas:canvasEl,context:context}}class Animation{constructor({spriteSheet:t,frames:e,frameRate:i,loop:s=!0,name:a}){let{width:n,height:o,margin:r=0}=t.frame;Object.assign(this,{spriteSheet:t,frames:e,frameRate:i,loop:s,name:a,width:n,height:o,margin:r,isStopped:!1,_f:0,_a:0});}clone(){return new Animation(this)}start(){this.isStopped=!1,this.loop||this.reset();}stop(){this.isStopped=!0;}reset(){this._f=0,this._a=0;}update(t=1/60){if(!this.isStopped)if(this.loop||this._f!=this.frames.length-1)for(this._a+=t;this._a*this.frameRate>=1;)this._f=++this._f%this.frames.length,this._a-=1/this.frameRate;else this.stop();}render({x:t,y:e,width:i=this.width,height:s=this.height,context:a=getContext()}){let n=this.frames[this._f]/this.spriteSheet._f|0,o=this.frames[this._f]%this.spriteSheet._f|0;a.drawImage(this.spriteSheet.image,o*this.width+(2*o+1)*this.margin,n*this.height+(2*n+1)*this.margin,this.width,this.height,t,e,i,s);}}function factory$b(){return new Animation(...arguments)}let leadingSlash=/^\//,trailingSlash=/\/$/,dataMap=new WeakMap,imagePath="";function getUrl(t,e){return new URL(t,e).href}function joinPath(t,e){return [t.replace(trailingSlash,""),t?e.replace(leadingSlash,""):e].filter((t=>t)).join("/")}function getExtension(t){return t.split(".").pop()}function getName(t){let e=t.replace("."+getExtension(t),"");return 2==e.split("/").length?e.replace(leadingSlash,""):e}let imageAssets={},dataAssets={};function addGlobal(){window.__k||(window.__k={dm:dataMap,u:getUrl,d:dataAssets,i:imageAssets});}function loadImage(t){return addGlobal(),new Promise(((e,i)=>{let s,a,n;if(s=joinPath(imagePath,t),imageAssets[s])return e(imageAssets[s]);a=new Image,a.onload=function(){n=getUrl(s,window.location.href),imageAssets[getName(t)]=imageAssets[s]=imageAssets[n]=this,emit("assetLoaded",this,t),e(this);},a.onerror=function(){i("Unable to load image "+s);},a.src=s;}))}function rotatePoint(t,e){let i=Math.sin(e),s=Math.cos(e);return {x:t.x*s-t.y*i,y:t.x*i+t.y*s}}function clamp(t,e,i){return Math.min(Math.max(t,i),e)}function getWorldRect(t){let{x:e=0,y:i=0,width:s,height:a}=t.world||t;return t.mapwidth&&(s=t.mapwidth,a=t.mapheight),t.anchor&&(e-=s*t.anchor.x,i-=a*t.anchor.y),s<0&&(e+=s,s*=-1),a<0&&(i+=a,a*=-1),{x:e,y:i,width:s,height:a}}class Vector{constructor(t=0,e=0,i={}){null!=t.x?(this.x=t.x,this.y=t.y):(this.x=t,this.y=e),i._c&&(this.clamp(i._a,i._b,i._d,i._e),this.x=t,this.y=e);}set(t){this.x=t.x,this.y=t.y;}add(t){return new Vector(this.x+t.x,this.y+t.y,this)}subtract(t){return new Vector(this.x-t.x,this.y-t.y,this)}scale(t){return new Vector(this.x*t,this.y*t)}normalize(t=this.length()||1){return new Vector(this.x/t,this.y/t)}dot(t){return this.x*t.x+this.y*t.y}length(){return Math.hypot(this.x,this.y)}distance(t){return Math.hypot(this.x-t.x,this.y-t.y)}angle(t){return Math.acos(this.dot(t)/(this.length()*t.length()))}direction(){return Math.atan2(this.y,this.x)}clamp(t,e,i,s){this._c=!0,this._a=t,this._b=e,this._d=i,this._e=s;}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?clamp(this._a,this._d,t):t;}set y(t){this._y=this._c?clamp(this._b,this._e,t):t;}}function factory$a(){return new Vector(...arguments)}class Updatable{constructor(t){return this.init(t)}init(t={}){this.position=factory$a(),this.velocity=factory$a(),this.acceleration=factory$a(),this.ttl=1/0,Object.assign(this,t);}update(t){this.advance(t);}advance(t){let e=this.acceleration;t&&(e=e.scale(t)),this.velocity=this.velocity.add(e);let i=this.velocity;t&&(i=i.scale(t)),this.position=this.position.add(i),this._pc(),this.ttl--;}get dx(){return this.velocity.x}get dy(){return this.velocity.y}set dx(t){this.velocity.x=t;}set dy(t){this.velocity.y=t;}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}set ddx(t){this.acceleration.x=t;}set ddy(t){this.acceleration.y=t;}isAlive(){return this.ttl>0}_pc(){}}class GameObject extends Updatable{init({width:t=0,height:e=0,context:i=getContext(),render:s=this.draw,update:a=this.advance,children:n=[],anchor:o={x:0,y:0},opacity:r=1,rotation:h=0,scaleX:l=1,scaleY:d=1,...c}={}){this._c=[],super.init({width:t,height:e,context:i,anchor:o,opacity:r,rotation:h,scaleX:l,scaleY:d,...c}),this._di=!0,this._uw(),this.addChild(n),this._rf=s,this._uf=a,on("init",(()=>{this.context??=getContext();}));}update(t){this._uf(t),this.children.map((e=>e.update&&e.update(t)));}render(){let t=this.context;t.save(),(this.x||this.y)&&t.translate(this.x,this.y),this.rotation&&t.rotate(this.rotation),1==this.scaleX&&1==this.scaleY||t.scale(this.scaleX,this.scaleY);let e=-this.width*this.anchor.x,i=-this.height*this.anchor.y;(e||i)&&t.translate(e,i),this.context.globalAlpha=this.opacity,this._rf(),(e||i)&&t.translate(-e,-i),this.children.map((t=>t.render&&t.render())),t.restore();}draw(){}_pc(){this._uw(),this.children.map((t=>t._pc()));}get x(){return this.position.x}get y(){return this.position.y}set x(t){this.position.x=t,this._pc();}set y(t){this.position.y=t,this._pc();}get width(){return this._w}set width(t){this._w=t,this._pc();}get height(){return this._h}set height(t){this._h=t,this._pc();}_uw(){if(!this._di)return;let{_wx:t=0,_wy:e=0,_wo:i=1,_wr:s=0,_wsx:a=1,_wsy:n=1}=this.parent||{};this._wx=this.x,this._wy=this.y,this._ww=this.width,this._wh=this.height,this._wo=i*this.opacity,this._wsx=a*this.scaleX,this._wsy=n*this.scaleY,this._wx=this._wx*a,this._wy=this._wy*n,this._ww=this.width*this._wsx,this._wh=this.height*this._wsy,this._wr=s+this.rotation;let{x:o,y:r}=rotatePoint({x:this._wx,y:this._wy},s);this._wx=o,this._wy=r,this._wx+=t,this._wy+=e;}get world(){return {x:this._wx,y:this._wy,width:this._ww,height:this._wh,opacity:this._wo,rotation:this._wr,scaleX:this._wsx,scaleY:this._wsy}}set children(t){this.removeChild(this._c),this.addChild(t);}get children(){return this._c}addChild(...t){t.flat().map((t=>{this.children.push(t),t.parent=this,t._pc=t._pc||noop,t._pc();}));}removeChild(...t){t.flat().map((t=>{removeFromArray(this.children,t)&&(t.parent=null,t._pc());}));}get opacity(){return this._opa}set opacity(t){this._opa=clamp(0,1,t),this._pc();}get rotation(){return this._rot}set rotation(t){this._rot=t,this._pc();}setScale(t,e=t){this.scaleX=t,this.scaleY=e;}get scaleX(){return this._scx}set scaleX(t){this._scx=t,this._pc();}get scaleY(){return this._scy}set scaleY(t){this._scy=t,this._pc();}}class Sprite extends GameObject{init({image:t,width:e=(t?t.width:void 0),height:i=(t?t.height:void 0),...s}={}){super.init({image:t,width:e,height:i,...s});}get animations(){return this._a}set animations(t){let e,i;for(e in this._a={},t)this._a[e]=t[e].clone(),i=i||this._a[e];this.currentAnimation=i,this.width=this.width||i.width,this.height=this.height||i.height;}playAnimation(t){this.currentAnimation?.stop(),this.currentAnimation=this.animations[t],this.currentAnimation.start();}advance(t){super.advance(t),this.currentAnimation?.update(t);}draw(){this.image&&this.context.drawImage(this.image,0,0,this.image.width,this.image.height),this.currentAnimation&&this.currentAnimation.render({x:0,y:0,width:this.width,height:this.height,context:this.context}),this.color&&(this.context.fillStyle=this.color,this.context.fillRect(0,0,this.width,this.height));}}function factory$8(){return new Sprite(...arguments)}let fontSizeRegex=/(\d+)(\w+)/;function parseFont(t){if(!t)return {computed:0};let e=t.match(fontSizeRegex),i=+e[1];return {size:i,unit:e[2],computed:i}}class Text extends GameObject{init({text:t="",textAlign:e="",lineHeight:i=1,font:s=getContext()?.font,...a}={}){t=""+t,super.init({text:t,textAlign:e,lineHeight:i,font:s,...a}),this.context&&this._p(),on("init",(()=>{this.font??=getContext().font,this._p();}));}get width(){return this._w}set width(t){this._d=!0,this._w=t,this._fw=t;}get text(){return this._t}set text(t){this._d=!0,this._t=""+t;}get font(){return this._f}set font(t){this._d=!0,this._f=t,this._fs=parseFont(t).computed;}get lineHeight(){return this._lh}set lineHeight(t){this._d=!0,this._lh=t;}render(){this._d&&this._p(),super.render();}_p(){this._s=[],this._d=!1;let t=this.context,e=[this.text];if(t.font=this.font,e=this.text.split("\n"),this._fw&&e.map((e=>{let i=e.split(" "),s=i.shift(),a=s;i.map((e=>{a+=" "+e,t.measureText(a).width>this._fw&&(this._s.push(s),a=e),s=a;})),this._s.push(a);})),!this._s.length&&this.text.includes("\n")){let i=0;e.map((e=>{this._s.push(e),i=Math.max(i,t.measureText(e).width);})),this._w=this._fw||i;}this._s.length||(this._s.push(this.text),this._w=this._fw||t.measureText(this.text).width),this.height=this._fs+(this._s.length-1)*this._fs*this.lineHeight,this._uw();}draw(){let t=0,e=this.textAlign,i=this.context;e=this.textAlign||("rtl"==i.canvas.dir?"right":"left"),t="right"==e?this.width:"center"==e?this.width/2|0:0,this._s.map(((s,a)=>{i.textBaseline="top",i.textAlign=e,i.fillStyle=this.color,i.font=this.font,this.strokeColor&&(i.strokeStyle=this.strokeColor,i.lineWidth=this.lineWidth??1,i.strokeText(s,t,this._fs*this.lineHeight*a)),i.fillText(s,t,this._fs*this.lineHeight*a);}));}}function factory$7(){return new Text(...arguments)}let pointers=new WeakMap,callbacks$1={},pressedButtons={},pointerMap={0:"left",1:"middle",2:"right"};function circleRectCollision(t,e){let{x:i,y:s,width:a,height:n}=getWorldRect(t);do{i-=t.sx||0,s-=t.sy||0;}while(t=t.parent);let o=e.x-Math.max(i,Math.min(e.x,i+a)),r=e.y-Math.max(s,Math.min(e.y,s+n));return o*o+r*r<e.radius*e.radius}function getCurrentObject(t){let e=t._lf.length?t._lf:t._cf;for(let i=e.length-1;i>=0;i--){let s=e[i];if(s.collidesWithPointer?s.collidesWithPointer(t):circleRectCollision(s,t))return s}}function getPropValue(t,e){return parseFloat(t.getPropertyValue(e))||0}function getCanvasOffset(t){let{canvas:e,_s:i}=t,s=e.getBoundingClientRect(),a="none"!=i.transform?i.transform.replace("matrix(","").split(","):[1,1,1,1],n=parseFloat(a[0]),o=parseFloat(a[3]),r=(getPropValue(i,"border-left-width")+getPropValue(i,"border-right-width"))*n,h=(getPropValue(i,"border-top-width")+getPropValue(i,"border-bottom-width"))*o,l=(getPropValue(i,"padding-left")+getPropValue(i,"padding-right"))*n,d=(getPropValue(i,"padding-top")+getPropValue(i,"padding-bottom"))*o;return {scaleX:(s.width-r-l)/e.width,scaleY:(s.height-h-d)/e.height,offsetX:s.left+(getPropValue(i,"border-left-width")+getPropValue(i,"padding-left"))*n,offsetY:s.top+(getPropValue(i,"border-top-width")+getPropValue(i,"padding-top"))*o}}function pointerDownHandler(t){let e=null!=t.button?pointerMap[t.button]:"left";pressedButtons[e]=!0,pointerHandler(t,"onDown");}function pointerUpHandler(t){let e=null!=t.button?pointerMap[t.button]:"left";pressedButtons[e]=!1,pointerHandler(t,"onUp");}function mouseMoveHandler(t){pointerHandler(t,"onOver");}function blurEventHandler$2(t){pointers.get(t.target)._oo=null,pressedButtons={};}function callCallback(t,e,i){let s=getCurrentObject(t);s&&s[e]&&s[e](i),callbacks$1[e]&&callbacks$1[e](i,s),"onOver"==e&&(s!=t._oo&&t._oo&&t._oo.onOut&&t._oo.onOut(i),t._oo=s);}function pointerHandler(t,e){t.preventDefault();let i=t.target,s=pointers.get(i),{scaleX:a,scaleY:n,offsetX:o,offsetY:r}=getCanvasOffset(s);t.type.includes("touch")?(Array.from(t.touches).map((({clientX:t,clientY:e,identifier:i})=>{let h=s.touches[i];h||(h=s.touches[i]={start:{x:(t-o)/a,y:(e-r)/n}},s.touches.length++),h.changed=!1;})),Array.from(t.changedTouches).map((({clientX:i,clientY:h,identifier:l})=>{let d=s.touches[l];d.changed=!0,d.x=s.x=(i-o)/a,d.y=s.y=(h-r)/n,callCallback(s,e,t),emit("touchChanged",t,s.touches),"onUp"==e&&(delete s.touches[l],s.touches.length--,s.touches.length||emit("touchEnd"));}))):(s.x=(t.clientX-o)/a,s.y=(t.clientY-r)/n,callCallback(s,e,t));}function initPointer({radius:t=5,canvas:e=getCanvas()}={}){let i=pointers.get(e);if(!i){let s=window.getComputedStyle(e);i={x:0,y:0,radius:t,touches:{length:0},canvas:e,_cf:[],_lf:[],_o:[],_oo:null,_s:s},pointers.set(e,i);}return e.addEventListener("mousedown",pointerDownHandler),e.addEventListener("touchstart",pointerDownHandler),e.addEventListener("mouseup",pointerUpHandler),e.addEventListener("touchend",pointerUpHandler),e.addEventListener("touchcancel",pointerUpHandler),e.addEventListener("blur",blurEventHandler$2),e.addEventListener("mousemove",mouseMoveHandler),e.addEventListener("touchmove",mouseMoveHandler),i._t||(i._t=!0,on("tick",(()=>{i._lf.length=0,i._cf.map((t=>{i._lf.push(t);})),i._cf.length=0;}))),i}function clear(t){let e=t.canvas;t.clearRect(0,0,e.width,e.height);}function GameLoop({fps:t=60,clearCanvas:e=!0,update:i=noop,render:s,context:a=getContext(),blur:n=!1}={}){if(!s)throw Error("You must provide a render() function");let o,r,h,l,d,c=0,u=1e3/t,p=1/t,g=e?clear:noop,f=!0;function m(){if(r=requestAnimationFrame(m),f&&(h=performance.now(),l=h-o,o=h,!(l>1e3))){for(emit("tick"),c+=l;c>=u;)d.update(p),c-=u;g(d.context),d.render();}}return n||(window.addEventListener("focus",(()=>{f=!0;})),window.addEventListener("blur",(()=>{f=!1;}))),on("init",(()=>{d.context??=getContext();})),d={update:i,render:s,isStopped:!0,context:a,start(){o=performance.now(),this.isStopped=!1,requestAnimationFrame(m);},stop(){this.isStopped=!0,cancelAnimationFrame(r);},_frame:m,set _last(t){o=t;}},d}let currGesture,callbacks={},init=!1,gestureMap={swipe:{touches:1,threshold:10,touchend({0:t}){let e=t.x-t.start.x,i=t.y-t.start.y,s=Math.abs(e),a=Math.abs(i);if(!(s<this.threshold&&a<this.threshold))return s>a?e<0?"left":"right":i<0?"up":"down"}},pinch:{touches:2,threshold:2,touchstart({0:t,1:e}){this.prevDist=Math.hypot(t.x-e.x,t.y-e.y);},touchmove({0:t,1:e}){let i=Math.hypot(t.x-e.x,t.y-e.y);if(Math.abs(i-this.prevDist)<this.threshold)return;let s=i>this.prevDist?"out":"in";return this.prevDist=i,s}}};function initGesture(){init||(init=!0,on("touchChanged",((t,e)=>{Object.keys(gestureMap).map((i=>{let s,a=gestureMap[i];(!currGesture||currGesture==i)&&e.length==a.touches&&[...Array(e.length).keys()].every((t=>e[t]))&&(s=a[t.type]?.(e)??"")&&callbacks[i+s]&&(currGesture=i,callbacks[i+s](t,e));}));})),on("touchEnd",(()=>{currGesture=0;})));}let keydownCallbacks={},keyupCallbacks={},pressedKeys={},keyMap={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"};function call(t=noop,e){t._pd&&e.preventDefault(),t(e);}function keydownEventHandler(t){let e=keyMap[t.code],i=keydownCallbacks[e];pressedKeys[e]=!0,call(i,t);}function keyupEventHandler(t){let e=keyMap[t.code],i=keyupCallbacks[e];pressedKeys[e]=!1,call(i,t);}function blurEventHandler(){pressedKeys={};}function initKeys(){let t;for(t=0;t<26;t++)keyMap["Key"+String.fromCharCode(t+65)]=String.fromCharCode(t+97);for(t=0;t<10;t++)keyMap["Digit"+t]=keyMap["Numpad"+t]=""+t;window.addEventListener("keydown",keydownEventHandler),window.addEventListener("keyup",keyupEventHandler),window.addEventListener("blur",blurEventHandler);}function keyPressed(t){return !![].concat(t).some((t=>pressedKeys[t]))}function parseFrames(t){if(+t==t)return t;let e=[],i=t.split(".."),s=+i[0],a=+i[1],n=s;if(s<a)for(;n<=a;n++)e.push(n);else for(;n>=a;n--)e.push(n);return e}class SpriteSheet{constructor({image:t,frameWidth:e,frameHeight:i,frameMargin:s,animations:a}={}){if(!t)throw Error("You must provide an Image for the SpriteSheet");this.animations={},this.image=t,this.frame={width:e,height:i,margin:s},this._f=t.width/e|0,this.createAnimations(a);}createAnimations(t){let e,i;for(i in t){let{frames:s,frameRate:a,loop:n}=t[i];if(e=[],null==s)throw Error("Animation "+i+" must provide a frames property");[].concat(s).map((t=>{e=e.concat(parseFrames(t));})),this.animations[i]=factory$b({spriteSheet:this,frames:e,frameRate:a,loop:n,name:i});}}}function factory$1(){return new SpriteSheet(...arguments)}

  const levels = [
    {
      startX: 400,
      props: {
        ring: { dx: -2.8, y: 300 },
        firepot: { y: 300 },
      },
      shouldGenerateRing: (rings) => {},

      objects: [{ x: 1, type: "ring" }],
    },
  ];

  window.c.getAttribute("width") / window.c.getAttribute("height");
  const scale = 1;
  const W = window.innerWidth / scale;
  const H = window.innerHeight / scale;
  window.c.setAttribute("width", W);
  window.c.setAttribute("height", H);
  // window.c.style.width = W * scale;
  // window.c.style.height = "100dvh";

  function collides(sprite1, sprite2) {
    return (
      sprite1.x < sprite2.x + sprite2.width &&
      sprite1.x + sprite1.width > sprite2.x &&
      sprite1.y < sprite2.y + sprite2.height &&
      sprite1.y + sprite1.height > sprite2.y
    );
  }

  let { canvas } = init$1();
  initKeys();
  initPointer();
  initGesture();

  const G = 0.4;
  const JUMP_FORCE = -10;

  let scrollingSpeed = 0;
  let score = 0;

  Promise.all([loadImage("player.png"), loadImage("spikes.png")]).then(
    ([playerImg, spikesImg]) => {
      initSetup(playerImg, spikesImg);
    }
  );

  let platforms = [];

  let player = factory$8({});
  let spikeSpriteSheet;

  function getPlayerRect() {
    const rect = getWorldRect(player);
    rect.x += 5;
    rect.width -= 10;
    rect.y += 5;
    rect.height -= 10;
    return rect;
  }

  let scoreText = factory$7({
    text: "Score: 0",
    font: "28px Arial",
    color: "white",
    x: 20,
    y: 20,
  });

  let npcs = [];

  let loop = GameLoop({
    // create the main game loop
    update: function () {
      // update the game state
      player.update();

      {
        player.dy += G; // Gravity pulling down
      }

      if (!player.isDead) {
        player.y += G;
      }

      if (player.y > canvas.height - player.height / 2 && !player.isDead) {
        // If on ground
        player.y = canvas.height - player.height / 2;
        player.dy = 0;
        if (!player.onGround) ;
        player.onGround = true;
        player.rotation = 0;

        player.playAnimation("walk");
      }

      if (!player.onGround) {
        if (!player.isDead) {
          player.rotation += 0.14;
        } else {
          player.rotation -= 0.05;
        }
      } else {
        createWalkParticles(1);
      }

      //  Collision check
      if (!player.isDead) {
        npcs.forEach((npc) => {
          if (npc.type === "ring") {
            // npc.x -= scrollingSpeed;

            if (collides(npc, getPlayerRect())) {
              console.log("collide");
              player.isDead = true;
              jump();
              blood();
              player.playAnimation("dead");
              setTimeout(() => {
                reset();
              }, 2000);
            }
          }
        });
      }

      if (keyPressed("z")) {
        jump();
      }
      if (keyPressed("arrowleft") || player.walkingDirection === "left") {
        walk(-1);
      }
      if (keyPressed("arrowright") || player.walkingDirection === "right") {
        walk(1);
      }

      if (player.y >= canvas.height * 0.8 && scrollingSpeed) {
        console.log("move stop");
        // scrollingSpeed = 0;
      }

      const lastRing = npcs.findLast((npc) => npc.type === "ring");
      if (lastRing && lastRing.x < canvas.width / 2) {
        generateRings();
      }

      npcs = npcs.filter((npc) => npc.x > 0);

      // fireballs.forEach((fireball) => fireball.update());
      npcs.forEach((npc) => npc.update());

      if (!player.isDead) {
        score += 0.1;
      }
      scoreText.text = `Score: ${Math.floor(score)}`;
    },
    render: function () {
      // render the game state
      player.render();
      platforms.forEach((platform) => platform.render());
      npcs.forEach((npc) => npc.render());
      scoreText.render();
    },
  });

  function jump() {
    if (player.onGround || player.isDead) {
      player.onGround = false;
      // If on ground
      player.dy = JUMP_FORCE;
      player.playAnimation("jump");
    }
  }
  function walk(dir) {
    player.playAnimation("walk");

    createWalkParticles(dir);
  }

  function blood() {
    const count = 10;
    for (let i = 0; i < count; i++) {
      npcs.push(
        factory$8({
          x: player.x,
          y: player.y,
          width: 10,
          height: 10,
          dx: Math.random() * 2 - 1,
          dy: -(Math.random() * 3 + 1),
          ddy: 0.2,
          ttl: 4,
          anchor: { x: 0.5, y: 0.5 },
          color: "#f00",
          update() {
            this.advance();
            // reduce opacity
            // this.opacity -= 0.05;
            // this.rotation += 0.1;
            // if (this.opacity < 0) {
            // this.ttl = 0;
            // }
          },
        })
      );
    }
  }
  function createWalkParticles(dir = 1) {
    const count = 1;
    if (Math.random() > 0.1 || !player.onGround) return;
    for (let i = 0; i < count; i++) {
      npcs.push(
        factory$8({
          x: player.x - player.width / 2,
          y: player.y + player.height / 2 - 10,
          width: 15,
          height: 15,
          dx: (Math.random() * 1 + 0.5) * -dir,
          dy: -(Math.random() * 2 + 0.5),
          ttl: 3,
          anchor: { x: 0.5, y: 0.5 },
          color: "#ccc5",
          update() {
            this.advance();
            // reduce opacity
            this.opacity -= 0.05;
            this.rotation += 0.1;
            if (this.opacity < 0) {
              this.ttl = 0;
            }
          },
        })
      );
    }
  }
  window.addEventListener("click", function (e) {
    jump();
  });

  window.addEventListener("touchend", function (e) {
    jump();
  });

  function startLevel(levelId) {
    const level = levels[levelId];
    level.objects.forEach((obj) => {
      if (obj.type === "ring") {
        npcs.push(
          factory$8({
            ...ringObj,
            x: level.startX + obj.x * 200,
            y: level.props.ring.y,
            dx: level.props.ring.dx,
          })
        );
      }
    });
  }

  function initSetup(playerImg, spikesImg) {
    let spriteSheet = factory$1({
      image: playerImg,
      frameWidth: 10,
      frameHeight: 10,
      frameMargin: 0,
      animations: {
        // create a named animation: walk
        idle: {
          frames: "0..1", // frames 0 through 9
          frameRate: 2,
        },
        walk: {
          frames: "2..4", // frames 0 through 9
          frameRate: 8,
        },
        jump: {
          frames: "5", // frames 0 through 9
          frameRate: 6,
        },
        dead: {
          frames: "6", // frames 0 through 9
          frameRate: 1,
        },
      },
    });
    player = factory$8({
      width: 50,
      height: 50,
      anchor: { x: 0.5, y: 0.5 },
      onGround: false,
      // use the sprite sheet animations for the sprite
      animations: spriteSheet.animations,
    });

    player.x = 100;
    // platforms[0].x + platforms[0].width / 2;
    player.y = canvas.height - player.height / 2;
    player.playAnimation("walk");

    spikeSpriteSheet = factory$1({
      image: spikesImg,
      frameWidth: 10,
      frameHeight: 10,
      animations: {
        idle: {
          frames: "0",
        },
      },
    });

    ringObj.animations = spikeSpriteSheet.animations;
    // ringObj.animations = ringSpriteSheet.animations;

    setTimeout(() => {
      startLevel(0);
    }, 100);
  }
  const ringObj = {
    type: "ring",
    y: H - 50,
    width: 50,
    height: 50,
    dx: levels[0].props.ring.dx,
  };

  function generateRings() {
    const type = Math.random();

    if (type > 0.8) {
      npcs.push(
        factory$8({
          ...ringObj,
          x: canvas.width + 100,
        })
      );
      npcs.push(
        factory$8({
          ...ringObj,
          x: canvas.width + 400,
        })
      );
      npcs.push(
        factory$8({
          ...ringObj,
          x: canvas.width + 600,
        })
      );
    } else {
      npcs.push(
        factory$8({
          ...ringObj,
          x: canvas.width + 100,
        })
      );
    }
  }

  function reset() {
    player.isDead = false;
    score = 0;
    npcs = [];
    speedFactor = 0;
    ringObj.dx = -2.8;
    startLevel(0);
  }
  loop.start(); // start the game

  function levelUp() {
    ringObj.dx -= 0.3;
    setTimeout(levelUp, 5000);
  }

  levelUp();

})();
