const cnv = document.getElementById("c");
const ctx = cnv.getContext("2d");

let WIDTH = 0,
  HEIGHT = 0,
  SCALE = 1,
  SCALE_SQRT = 1;

// game state
const GAME = {
  points: 0,
  end: 0,
  waves: [],
  fishes: [],
  paw: null,
  play: false,
  played: false,
  intervals: [],
};

const resizeObserver = new ResizeObserver(() => {
  cnv.width = WIDTH = window.innerWidth;
  cnv.height = HEIGHT = window.innerHeight;

  size = Math.min(WIDTH, HEIGHT);
  SCALE = Math.min(size / 720, 1);
  SCALE_SQRT = Math.sqrt(SCALE);
  FishScale = 1.5 * SCALE_SQRT;
  PawScale = 1.25 * SCALE_SQRT;

  GAME.paw.reset();
});

// reset game state
const reset = () => {
  FishSpeed = 0.2;

  GAME.fishes = [];
  GAME.waves = [];
  GAME.points = 0;

  const s = performance.now();
  GAME.end = s + 30 * 1000;

  GAME.intervals.forEach((i) => {
    clearInterval(i);
  });
  GAME.intervals = [];

  GAME.fishes.push(new Fish("grey"));
  GAME.intervals.push(
    setInterval(() => {
      GAME.fishes.push(new Fish("grey"));
    }, 1000)
  );
  GAME.intervals.push(
    setInterval(() => {
      GAME.fishes.push(new Fish(Math.random() > 0.5 ? "green" : "red"));
    }, 2000)
  );
  GAME.intervals.push(
    setInterval(() => {
      GAME.fishes.push(new Fish("gold"));
    }, 15000)
  );

  GAME.intervals.push(
    setInterval(() => {
      if (GAME.play) {
        FishSpeed += 0.005;
      }
    }, 10000)
  );
};

document.addEventListener("DOMContentLoaded", () => {
  cnv.width = WIDTH = window.innerWidth;
  cnv.height = HEIGHT = window.innerHeight;
  resizeObserver.observe(document.body);

  GAME.paw = new Paw();

  GAME.jingleToggle = new JingleToggle(true, { x: 60, y: 60 });
  GAME.jingleController = new AudioController(jingle);

  GAME.musicToggle = new MusicToggle(false, { x: 60, y: 140 });
  GAME.musicController = new AudioController(song, { loop: true });

  GAME.paw.addEventListener("reached", (e) => {
    const { x, y } = e.detail;

    GAME.waves.push(new Wave({ x, y }));
    [...GAME.fishes].forEach((f) => {
      if (f.isHit({ x, y })) {
        if (GAME.play) {
          f.evaluate();
        }
        f.destroy();
      }
    });

    if (!GAME.play && GAME.jingleToggle.isHit({ x, y })) {
      GAME.jingleToggle.toggle();
    }
    if (!GAME.play && GAME.musicToggle.isHit({ x, y })) {
      GAME.musicToggle.toggle();
    }

    if (GAME.jingleToggle.on) {
      GAME.jingleController.play();
    }
  });

  reset();
  startAnimation();
});

cnv.addEventListener("click", (e) => {
  const { x, y } = e;

  GAME.paw.reach({ x, y });
});

cnv.addEventListener("dblclick", (e) => {
  if (!GAME.play) {
    GAME.play = true;
    GAME.played = true;

    reset();
  }
});

let lT = 0;
const animate = (t) => {
  if (!lT) {
    lT = t;
    startAnimation();
  }
  const shift = t - lT;
  lT = t;

  ctx.clearRect(0, 0, cnv.width, cnv.height);

  drawWaves(shift);
  drawFishes(shift);
  if (!GAME.play) {
    drawToggles();
  }
  drawPaw(shift);
  drawText();
  if (!GAME.play) {
    drawState();
  }

  startAnimation();
};

const startAnimation = () => {
  window.requestAnimationFrame(animate);
};

const drawWaves = (shift) => {
  GAME.waves.forEach((w) => {
    w.move(shift);
    w.draw();
  });
};

const drawFishes = (shift) => {
  GAME.fishes.forEach((f) => {
    f.move(shift);
    f.draw();
  });
};

const drawToggles = () => {
  GAME.jingleToggle.draw();
  GAME.musicToggle.draw();
};

const drawPaw = (shift) => {
  GAME.paw.move(shift);
  GAME.paw.draw();
};

const drawText = () => {
  const now = performance.now();
  let seconds = Math.floor((GAME.end - now) / 1000);

  if (seconds <= 0) {
    GAME.play = false;
    seconds = 0;
  }

  ctx.font = `${Math.floor(64 * SCALE)}px sans-serif`;
  const text = GAME.played
    ? `${seconds}s : ${GAME.points}p`
    : `30s : ${GAME.points}p`;

  const metrics = ctx.measureText(text);
  const marginTB = 40 * SCALE;
  const marginLP = 60 * SCALE;
  const radius = 30 * SCALE;
  const border = 5;

  const rectInWidth = metrics.width + 2 * marginLP;
  const rectInHeight = metrics.actualBoundingBoxAscent + 2 * marginTB;

  ctx.lineWidth = border;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#222222aa";
  ctx.beginPath();
  ctx.roundRect((WIDTH - rectInWidth) / 2, -border, rectInWidth, rectInHeight, [
    0,
    0,
    radius,
    radius,
  ]);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.font = `${Math.floor(64 * SCALE)}px sans-serif`;
  ctx.fillText(
    text,
    (WIDTH - metrics.width) / 2,
    metrics.actualBoundingBoxAscent + marginTB - border
  );
};

const drawState = () => {
  ctx.font = `${Math.floor(120 * SCALE)}px sans-serif`;
  const logoText = "FISHING";
  const logoMetrics = ctx.measureText(logoText);

  ctx.font = `${Math.floor(32 * SCALE)}px sans-serif`;
  const insText = "Double click to start game!";
  const insMetrics = ctx.measureText(insText);

  const marginTB = 40 * SCALE;
  const marginLP = 60 * SCALE;
  const radius = 30 * SCALE;
  const border = 5;

  const width = Math.max(logoMetrics.width, insMetrics.width);
  const height =
    logoMetrics.actualBoundingBoxAscent +
    insMetrics.actualBoundingBoxAscent +
    marginTB;

  const rectWidth = width + 2 * marginLP;
  const rectHeight = height + 2 * marginTB;

  ctx.lineWidth = border;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#222222aa";
  ctx.beginPath();
  ctx.roundRect(
    (WIDTH - rectWidth) / 2,
    (HEIGHT - rectHeight) / 2,
    rectWidth,
    rectHeight,
    [radius]
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.font = `${Math.floor(120 * SCALE)}px sans-serif`;
  ctx.fillText(
    logoText,
    (WIDTH - logoMetrics.width) / 2,
    (HEIGHT - rectHeight) / 2 + logoMetrics.actualBoundingBoxAscent + marginTB
  );
  ctx.font = `${Math.floor(32 * SCALE)}px sans-serif`;
  ctx.fillText(
    insText,
    (WIDTH - insMetrics.width) / 2,
    (HEIGHT - rectHeight) / 2 +
      logoMetrics.actualBoundingBoxAscent +
      2 * marginTB +
      insMetrics.actualBoundingBoxAscent
  );
};
