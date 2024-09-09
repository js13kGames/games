ctx = c.getContext('2d');
var W = window.innerWidth;
var H = window.innerHeight;
c.width = W;
c.height = H;
var lastTime = 0,
  currentTime,
  dt;
var cube1, cube2;
var particles = [];
var started =false;
var finishTime = 0;

function random(a,b){
  return a + ~~(Math.random()*(b-a));
}

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
    setTimeout(function() {
      destroyCubes(c1, c2)
    }, 1000);
  } else {
    var c1 = cube1, c2 = cube2;
    cube1 = cube2 = undefined;
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
  ctx.clearRect(0,0,W,H);
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