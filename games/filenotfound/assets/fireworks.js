const $canvas = document.querySelector('#main');
const context = $canvas.getContext('2d');

const resizeCanvas = (width, height) => {
  $canvas.width = width;
  $canvas.height = height;
}
resizeCanvas(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
})

class Particle {
  constructor(x, y, r, vX, vY, vR, color, maxTime) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vX = vX;
    this.vY = vY;
    this.vR = vR;
    this.color = color;
    this.maxTime = maxTime;
    this.time = 0;
  }
  
  move (timeInSeconds) {
    this.x += this.vX * timeInSeconds;
    this.y += this.vY * timeInSeconds;
    this.r += this.vR * timeInSeconds;
    this.time += timeInSeconds;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(
      this.x,
      this.y,
      this.r,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
  }
}

class RingParticle extends Particle {
  constructor(x, y, r, vX, vY, vR, color, maxTime) {
    super(x, y, r, vX, vY, vR, color, maxTime);
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.arc(
      this.x,
      this.y,
      this.r,
      0,
      Math.PI * 2
    );
    ctx.globalAlpha = 1 - (this.time / this.maxTime);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

const randomFloat = (min, max) => (Math.random() * (max - min) + min);

const animation = (ctx) => {
  const startTime = performance.now();
  const particlesCount = 50;
  const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
  const createParticles = numberOfParticles => {
    const w2 = $canvas.width / 2
    const h2 = $canvas.height / 2
    const startX = randomFloat(-w2, w2);
    const startY = randomFloat(-h2, h2);
    let result = Array(numberOfParticles).fill(0).map(() => {
      const randomAngle = Math.random() * Math.PI * 2;
      const v = randomFloat(100, 300);
      const vX = Math.cos(randomAngle) * v;
      const vY = Math.sin(randomAngle) * v;
      return new Particle(
        startX + randomFloat(-5, 5),
        startY + randomFloat(-5, 5),
        randomFloat(30, 40),
        vX,
        vY,
        -100,
        colors[Math.floor(Math.random() * colors.length)],
        5
      );
    });
    if (Math.random() < 0.5) {
      result.push(
        new RingParticle(startX, startY, 0, 0, 0, 200, 'white', 0.5)
      );
    }
    return result;
  };
  const particles = createParticles(particlesCount);
  let counter = 0;
  const physics = timeInSeconds => {
    particles.forEach((particle, i) => {
      particle.move(timeInSeconds);
      if (particle.r < 0 || particle.time > particle.maxTime) {
        particles.splice(i, 1);
      }
    })
    counter += timeInSeconds;
    if (counter > 0.2) {
      counter = 0;
      Array.prototype.push.apply(particles, createParticles(particlesCount));
    }
  }
  const draw = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    particles.forEach(particle => {
      ctx.save();
      ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
      particle.draw(ctx);
      ctx.restore();
    });
  }
  
  let lastRender = 0;
  const loop = (timestamp) => {
    const deltaTime = timestamp - lastRender;
    physics(deltaTime / 1000);
    draw();
    lastRender = timestamp
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
animation(context);
