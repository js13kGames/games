function J(){this.B=function(e){for(var f=0;24>f;f++)this[String.fromCharCode(97+f)]=e[f]||0;0.01>this.c&&(this.c=0.01);e=this.b+this.c+this.e;0.18>e&&(e=0.18/e,this.b*=e,this.c*=e,this.e*=e)}}
var W=new function(){this.A=new J;var e,f,d,g,l,z,K,L,M,A,m,N;this.reset=function(){var c=this.A;g=100/(c.f*c.f+0.001);l=100/(c.g*c.g+0.001);z=1-0.01*c.h*c.h*c.h;K=1E-6*-c.i*c.i*c.i;c.a||(m=0.5-c.n/2,N=5E-5*-c.o);L=0<c.l?1-0.9*c.l*c.l:1+10*c.l*c.l;M=0;A=1==c.m?0:2E4*(1-c.m)*(1-c.m)+32};this.D=function(){this.reset();var c=this.A;e=1E5*c.b*c.b;f=1E5*c.c*c.c;d=1E5*c.e*c.e+10;return e+f+d|0};this.C=function(c,O){var a=this.A,P=1!=a.s||a.v,r=0.1*a.v*a.v,Q=1+3E-4*a.w,n=0.1*a.s*a.s*a.s,X=1+1E-4*a.t,Y=1!=
a.s,Z=a.x*a.x,$=a.g,R=a.q||a.r,aa=0.2*a.r*a.r*a.r,D=a.q*a.q*(0>a.q?-1020:1020),S=a.p?(2E4*(1-a.p)*(1-a.p)|0)+32:0,ba=a.d,T=a.j/2,ca=0.01*a.k*a.k,E=a.a,F=e,da=1/e,ea=1/f,fa=1/d,a=5/(1+20*a.u*a.u)*(0.01+n);0.8<a&&(a=0.8);for(var a=1-a,G=!1,U=0,v=0,w=0,B=0,t=0,x,u=0,h,p=0,s,H=0,b,V=0,q,I=0,C=Array(1024),y=Array(32),k=C.length;k--;)C[k]=0;for(k=y.length;k--;)y[k]=2*Math.random()-1;for(k=0;k<O;k++){if(G)return k;S&&++V>=S&&(V=0,this.reset());A&&++M>=A&&(A=0,g*=L);z+=K;g*=z;g>l&&(g=l,0<$&&(G=!0));h=g;0<
T&&(I+=ca,h*=1+Math.sin(I)*T);h|=0;8>h&&(h=8);E||(m+=N,0>m?m=0:0.5<m&&(m=0.5));if(++v>F)switch(v=0,++U){case 1:F=f;break;case 2:F=d}switch(U){case 0:w=v*da;break;case 1:w=1+2*(1-v*ea)*ba;break;case 2:w=1-v*fa;break;case 3:w=0,G=!0}R&&(D+=aa,s=D|0,0>s?s=-s:1023<s&&(s=1023));P&&Q&&(r*=Q,1E-5>r?r=1E-5:0.1<r&&(r=0.1));q=0;for(var ga=8;ga--;){p++;if(p>=h&&(p%=h,3==E))for(x=y.length;x--;)y[x]=2*Math.random()-1;switch(E){case 0:b=p/h<m?0.5:-0.5;break;case 1:b=1-2*(p/h);break;case 2:b=p/h;b=0.5<b?6.28318531*
(b-1):6.28318531*b;b=0>b?1.27323954*b+0.405284735*b*b:1.27323954*b-0.405284735*b*b;b=0>b?0.225*(b*-b-b)+b:0.225*(b*b-b)+b;break;case 3:b=y[Math.abs(32*p/h|0)]}P&&(x=u,n*=X,0>n?n=0:0.1<n&&(n=0.1),Y?(t+=(b-u)*n,t*=a):(u=b,t=0),u+=t,B+=u-x,b=B*=1-r);R&&(C[H%1024]=b,b+=C[(H-s+1024)%1024],H++);q+=b}q=0.125*q*w*Z;c[k]=1<=q?32767:-1>=q?-32768:32767*q|0}return O}};
window.jsfxr=function(e){W.A.B(e);var f=W.D();e=new Uint8Array(4*((f+1)/2|0)+44);var f=2*W.C(new Uint16Array(e.buffer,44),f),d=new Uint32Array(e.buffer,0,44);d[0]=1179011410;d[1]=f+36;d[2]=1163280727;d[3]=544501094;d[4]=16;d[5]=65537;d[6]=44100;d[7]=88200;d[8]=1048578;d[9]=1635017060;d[10]=f;for(var f=f+44,d=0,g="data:audio/wav;base64,";d<f;d+=3)var l=e[d]<<16|e[d+1]<<8|e[d+2],g=g+("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>18]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>
12&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>6&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l&63]);d-=f;return g.slice(0,g.length-d)+"==".slice(0,d)};




ctx = c.getContext('2d');
var WW = window.innerWidth;
var WH = window.innerHeight;
c.width = WW;
c.height = WH;
var sounds = {};
var lastTime = 0,
  currentTime,
  dt;
var cube1, cube2;
var particles = [];
var started =false;
var finishTime = 0;
var glitchTime = 0;

function random(a,b){
  return a + ~~(Math.random()*(b-a));
}

function snd (sid, settings){
  sounds[sid] = [];
  settings.forEach(function(s){
    var a = new Audio();
    a.src = jsfxr(s);
    sounds[sid].push(a);
  });
}
function play (sid){
  sounds[sid] && sounds[sid][random(0, sounds[sid].length - 1)].play();
}
snd('powerup', [
  [2,,0.2307,,0.4397,0.3404,,0.1526,,0.0544,0.4236,,,0.3724,,,,,1,,,,,0.5],
  [2,,0.3894,,0.3024,0.4107,,0.1792,,,,,,0.0228,,0.5141,,,1,,,,,0.5]
  // [1,,0.0439,,0.4676,0.2578,,0.2415,,,,,,,,,,,1,,,,,0.5]
]);
snd('gameover', [
  [2,0.18,0.24,,0.54,0.34,,,,1,0.31,,,,0.8522,,,,0.23,,,,,0.49]
]);

function getCube(sizeClass) {
  var node = document.createElement('div');
  node.classList.add('_3dbox');
  node.classList.add(sizeClass);
  node.innerHTML = '<div class="f f--front"></div><div class="f f--top"></div><div class="f f--bottom"></div><div class="f f--left"></div><div class="f f--right"></div><div class="f f--back"></div>';
  return node;
}

function generateCubes() {
  var colors = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
  for(var x = colors.length; x--;) {
    var y = random(0, colors.length);
    var temp = colors[x];
    colors[x] = colors[y];
    colors[y] = temp;
  }
  x = 0;
  for(var i = 0; i<4; i++)
  for(var j = 0;j<3;j++) {
  	var cube = getCube('cube-100px');
    var cubeinner = getCube('cube-30px');
    var colorValue = colors[x++];
    cubeinner.classList.add('cube--c' + colorValue);
    cube.value = colorValue;
    cube.appendChild(cubeinner);
    cube.style.left = (120 * i) + 'px';
    cube.style.zIndex = j;
    cube.z = j;
    // cube.style.transitionDuration = (0.3 + Math.random() * 1.5) + 's';
    cube.transform = { x: 0, y: 300, z: j * 200 };
    setTransform(cube);
    (function(cube) {
      setTimeout(function() {
        cube.transform.y = 0;
        setTransform(cube);
      }, random(50, 1000));
    })(cube);

    cube.addEventListener('click', function (e) {
      if(!started) return;
      if (!cube1) {
        cube1 = e.currentTarget;
      } else {
        if (cube1 === e.currentTarget) { return; }
        cube2 = e.currentTarget;
        checkMatch();
      }
      var bound = e.currentTarget.getBoundingClientRect()
      e.currentTarget.classList.add('open');
      blast(bound.left + bound.width/2, e.pageY, e.currentTarget.z)
    });
    space.appendChild(cube);
  }
}

function setTransform(el) {
  el.style.transform = 'translateZ(' + el.transform.z + 'px) translateY(' + el.transform.y + 'px)';
}

function destroyCubes(c1, c2) {
  var bound1 = c1.getBoundingClientRect()
  var bound2 = c2.getBoundingClientRect()
  blast(bound1.left + bound1.width/2, bound1.top + bound1.height/2, c1.z);
  blast(bound2.left + bound2.width/2, bound2.top + bound2.height/2, c2.z);
  c1.transform.y = -100;
  c2.transform.y = -100;
  c1.classList.add('destroy');
  c2.classList.add('destroy');
  setTransform(c1);
  setTransform(c2);
  c1.addEventListener('transitionend', function () {
    if (!c1) return;
    c1.remove();
    c2.remove();
    if (!space.children.length) {
      started = false;
      ui.classList.add('finish');
      timer.textContent = 'Finished in ' + timer.textContent + 'seconds';
    }
  });
}
function checkMatch() {
  if (cube1.value === cube2.value) {
    var c1 = cube1, c2 = cube2;
    cube1 = undefined;
    cube2 = undefined;
    play('powerup');
    setTimeout(function() {
      destroyCubes(c1, c2);
    }, 1000);
  } else {
    var c1 = cube1, c2 = cube2;
    cube1 = cube2 = undefined;
    play('gameover');
    setTimeout(function () {
      c1.classList.remove('open');
      c2.classList.remove('open');
    }, 1000);
  }
}

function blast(x, y, z) {
  for (var i = 10; i--;) {
    particles.push({ x: x + random(-50,50), y: y + random(-50,50), size: random(2+2*z,10+6*z), vx: random(0,0), vy: random(-5,-1), alpha: 1 });
  }
}
function drawParticle(p){
  p.x += p.vx * Math.sin(Date.now() / 500);
  p.y += p.vy;
  p.vy -= dt;
  // p.alpha -= dt;
  p.size -= 10 * dt;
  if (p.size < 0) p.size = 0;
  ctx.fillStyle = 'hsla(54, 100%, 56%, ' + p.alpha + ')';
  ctx.fillRect(p.x, p.y, p.size, p.size);
}

function loop() {
  currentTime = Date.now();
  dt = (currentTime - lastTime)/1000;
  lastTime = currentTime;
  glitchTime -= 1;
  if (!glitchTime) {
    space.style.animation = 'none';
    c.style.animation = 'none';
  }
  ctx.clearRect(0,0,WW,WH);
    if (glitchTime <=0 && Math.random() > 0.995) {
      glitchTime = random(10, 200);
      space.style.animation = 'squiggly-anim 0.34s linear infinite';
      c.style.animation = 'squiggly-anim 0.34s linear infinite';
    }
  if (started) {
    finishTime += dt;
    timer.textContent = ~~(finishTime);
  }
  for (var i=particles.length;i--;) {
    drawParticle(particles[i]);
    if (particles[i].y < 0) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(loop);
}
function start() {
  started = true;
  ui.classList.add('small');
}
loop();
window.onload = function () {
  generateCubes();
  // setTimeout(generateCubes, 500);
  setTimeout(function() {
    ui.classList.add('show');
  }, 500);
}