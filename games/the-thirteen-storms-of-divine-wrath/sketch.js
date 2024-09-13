/// @ts-check
const platformMaxSpawnx = 800;
const gameAreaWidth = 1200;
let touchGrass = false;
const spawnx = 0;
const spawny = 790;
let playerx = spawnx;
let playery = spawny;
let playerdy = 0;
let playerdx = 0;
let playerSize = 10;
let aIsDown = false;
let dIsDown = false;
let gameStart = false;
let pauseMenu = false;
let gameRestart = false;
let gameTime = 0;
let subtractedLevelTime = [];
let subtractedLevelTimeMinutes = [];
let subtractedLevelTimeSeconds = [];
let displaySubtractedLevelTimeMinutes = [];
let displaySubtractedLevelTimeSeconds = [];
let levelTimes = [];
const screenShakeTime = 300;
let timeSinceTouchedCloud = screenShakeTime;
const cloudSound = new Audio("Extreme gust.wav");
let prevGameTime = 0;

let gameRank = [
  "Invigorated",
  "refreshed",
  "Well Rested",
  "Bedraggled",
  "Exhausted",
  "Insomniac",
];

let stars = [];
const audioctx = new AudioContext();
const masterGain = audioctx.createGain();
masterGain.gain.setValueAtTime(0.2, 0);
let gameMute = false;
masterGain.connect(audioctx.destination);
let songPlayed = false;
let gameClicked = false;
let oscillators = [];
const notes = [
  261.61, 311.1, 261.6, 349.2, 261.61, 311.1, 261.6, 349.2, 261.61, 311.1,
  261.6, 196.0, 261.61, 311.1, 261.6, 196,
];
let noteDelay = 0.5;
let gameDelayStart = 0.3;
let gameSongDelay = 0.01538;
let songDuration = notes.length * noteDelay * 1000;
let songStart = 0;
let songGameStart = 0;
let gameSongDuration = 0;
let playerDirection = 1;
const stormGods = [
  "THOR",
  "INDRA",
  "TARANIS",
  "TEMPESTAS",
  "CHAAHK",
  "AEOLUS",
  "SUSANOO",
  "ZEUS",
  "RAIJIN",
  "TEFNUT",
];
const stormGodChosen = stormGods[Math.floor(Math.random() * stormGods.length)];
const jumpNotes = [2000, 200];

const jumpHeight = 90;
const jumpRun = 70;
const colors = {
  white: "#fbf5ef",
  yellow: "#f2d3ab",
  pink: "#c69fa5",
  purple: "#8b6d9c",
  blue: "#494d7e",
  black: "#272744",
};
const blackAlpha = "#272744bf";
const peakHeight = 100;
const peakWidth = 10;

let platforms = [];
let clouds = [];
let rain = [];
let rainDrops = 30;
let rainFallSpeed = 0.5;
let firstY = 330;
const canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
canvas.style.width = "400px";
canvas.style.height = "400px";
document.body.appendChild(canvas);

//player can move ~70 blocks per jump from up to down

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 <= x2 + w2 && x1 + w1 >= x2 && y1 + h1 >= y2 && y1 <= y2 + h2;
}

document.body.onkeydown = (e) => {
  if (e.key === "w" && touchGrass === true) {
    playerdy = -10;
    jumpSound();
  }
  if (e.key === "d") {
    dIsDown = true;
    playerDirection = 1;
  }
  if (e.key === "a") {
    aIsDown = true;
    playerDirection = -1;
  }
  if (e.key === "Enter") {
    gameStart = true;
    pauseMenu = false;
  }
  if (e.key === "Escape") {
    pauseMenu = true;
    gameStart = false;
  }
  if (e.key === "m" && gameMute === false) {
    gameMute = true;
  } else if (e.key === "m" && gameMute === true) {
    gameMute = false;
  }

  if (e.key === "Enter" && state === "menu") {
    state = "game";
    stopSoundEffects();
  }
  if (e.key === "r" && state === "end") {
    state = "game";
    stopSoundEffects;
    gameSong();
    levelTimes[0] = performance.now();
    levelTimes = [];
    prevGameTime = Math.floor(performance.now() / 1000);
  }
};

document.body.onkeyup = (e) => {
  if (e.key === "a") {
    aIsDown = false;
  }
  if (e.key === "d") {
    dIsDown = false;
  }
};
document.body.onclick = (e) => {
  gameClicked = true;
};

//random platforms

const startY = 730;

let numPlatforms = 1;
const widthRange = [30, 70];
const generateHorizontalRadius = jumpRun;
const generateVerticalRadius = jumpHeight;
function generatePlatforms() {
  // Point 30px above center of top platform==last
  //point 10px from farthest left/right platform
  platforms = [];
  clouds = [];
  rain = [];
  const firstWidth =
    Math.random() * (widthRange[1] - widthRange[0]) + widthRange[0];
  const firstX = Math.random() * (platformMaxSpawnx - firstWidth) + 200;
  platforms.push({
    x: firstX,
    y: startY,
    w: firstWidth,
    h: playerSize * 1.5,
    peakx: firstX + firstWidth / 2,
    peaky: -peakHeight + startY,
    leftEdge: firstX - peakWidth,
    rightEdge: firstX + firstWidth + peakWidth,
  });

  for (let i = 1; i <= numPlatforms - 1; i++) {
    const prevPlatform = platforms[platforms.length - 1];

    while (true) {
      const randAngle = Math.random() * Math.PI;
      const randomDX = Math.cos(randAngle) * generateHorizontalRadius;
      const randomDY = Math.sin(randAngle) * generateVerticalRadius;

      const width =
        Math.random() * (widthRange[1] - widthRange[0]) + widthRange[0];
      const oldCenterX = prevPlatform.x + prevPlatform.w / 2;
      const newCenterX = oldCenterX + randomDX;
      const newY = prevPlatform.y - randomDY;

      if (
        newCenterX - width / 2 > (gameAreaWidth - platformMaxSpawnx) / 2 &&
        newCenterX + width / 2 <
          platformMaxSpawnx + (gameAreaWidth - platformMaxSpawnx) / 2
      ) {
        platforms.push({
          x: newCenterX - width / 2,
          y: newY,
          w: width,
          h: playerSize * 1.5,
          peakx: newCenterX,
          peaky: -peakHeight + newY,
          leftEdge: newCenterX - width / 2 - peakWidth,
          rightEdge: newCenterX + width / 2 + peakWidth,
        });
        break;
      }
    }
  }
  for (let i = 0; i < numPlatforms; i++) {
    let cloudPoints = [];
    const cloudWidth = 80;
    const cloudHeight = 20;
    for (let c = 0; c < 50; c++) {
      cloudPoints.push({
        x: Math.random() * cloudWidth - cloudWidth / 2,
        y: Math.random() * cloudHeight - cloudHeight / 2,
      });
    }

    clouds.push({
      x: platforms[i].x,
      y: platforms[i].y - playerSize * 6,
      angry: false,
      baddx: i % 2 === 0 ? 1 : -1,
      speed: Math.random() * 1.5 + 0.5,
      cloudSegmentRadius: 10,
      cloudPoints,
      width: cloudWidth,
      height: cloudHeight,
    });

    for (let j = 0; j < rainDrops; j++) {
      rain.push({
        x: Math.random() * clouds[i].width + clouds[i].x,
        y: Math.random() * clouds[i].height + clouds[i].y,
        r: Math.random() * 1 + 2,
        cloudOwnership: i,
      });
    }
  }
  for (let i = 0; i < rain.length; i++) {
    rain;
  }
}
generatePlatforms();

// Make Stars
function generateStars() {
  const starRadius = 100;

  stars = [];

  for (let i = 0; i <= 1300; i++) {
    let starSize = Math.random() * 4 + 2;
    stars.push({
      x: Math.random() * gameAreaWidth,
      y: -400 + Math.random() * 1400,
      r: starSize,
      movement: Math.random() + 1,
    });
  }
}

generateStars();
//starMovement();
let state = "menu"; // "menu" "game" "pause" "end"
let prevTime = performance.now();
function draw() {
  const now = performance.now();
  const dt = now - prevTime;
  prevTime = now;

  if (gameMute === false) {
    masterGain.gain.setValueAtTime(0.2, 0);
  } else {
    masterGain.gain.setValueAtTime(0, 0);
  }

  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("hi");
  }

  if (state === "menu") {
    //physics to get off menue
  }

  if (state === "pause") {
    //physics to get off pause
    if (gameStart === true) {
      state = "game";
    }
  }

  if (state === "end") {
    //physics to get off end
    if (gameRestart === true) {
      state = "game";
      gameRestart = false;
    }
  }

  if (state === "game") {
    if (pauseMenu === true) {
      state = "pause";
    }
    thirteenPhysics();
    function thirteenPhysics() {
      for (let i = 0; i < clouds.length; i++) {
        clouds[i].x += clouds[i].baddx * 1;
        if (clouds[i].x >= platforms[i].x + 150) {
          clouds[i].x = platforms[i].x + 150;
          clouds[i].baddx = -1 * clouds[i].speed;
        }
        if (clouds[i].x <= platforms[i].x - 150) {
          clouds[i].x = platforms[i].x - 150;
          clouds[i].baddx = 1 * clouds[i].speed;
        }
        for (let j = 0; j < rain.length; j++) {
          rain[j].y += rainFallSpeed;
          if (rain[j].y > 800) {
            rain[j].y = clouds[rain[j].cloudOwnership].y;
            rain[j].x =
              Math.random() * clouds[rain[j].cloudOwnership].width +
              clouds[rain[j].cloudOwnership].x;
          }
        }

        // const distBadx = Math.sqrt(
        //   (playerx - clouds[i].x) ** 2 + (playery - clouds[i].y) ** 2
        // );
      }
    }
    for (let i = 0; i < clouds.length; i++) {
      const distBad = rectIntersect(
        playerx,
        playery,
        playerSize,
        playerSize,
        clouds[i].x - clouds[i].width / 2,
        clouds[i].y - clouds[i].height / 2,
        clouds[i].width,
        clouds[i].height
      );
      const distBadLeft = rectIntersect(
        playerx,
        playery,
        playerSize,
        playerSize,
        clouds[i].x - clouds[i].width / 2,
        clouds[i].y - clouds[i].height / 2,
        clouds[i].width - clouds[i].width / 2,
        clouds[i].height
      );

      const distBadRight = rectIntersect(
        playerx,
        playery,
        playerSize,
        playerSize,
        clouds[i].x - clouds[i].width / 2,
        clouds[i].y - clouds[i].height / 2,
        clouds[i].width + clouds[i].width / 2,
        clouds[i].height
      );

      // Check for collision conditions
      if (distBad === true) {
        timeSinceTouchedCloud = 0;
        if (gameMute === true) {
        } else {
          cloudSound.play();
        }
        playerdy = -5;
        if (distBadLeft === true) {
          playerdx = -10;
        } else if (distBadRight === true) {
          playerdx = 10;
        }
      }
    }

    playerx += playerdx;

    if (Math.sign(playerdx) === -1) {
      playerdx += 0.5;

      if (playerdx >= 0) {
        playerdx = 0;
      }
    }

    if (Math.sign(playerdx) === 1) {
      playerdx -= 0.5;

      if (playerdx <= 0) {
        playerdx = 0;
      }
    }

    //controls

    if (dIsDown === true) {
      playerx += 2;
    }
    if (aIsDown) {
      playerx -= 2;
    }
    touchGrass = false;
    playerdy += 0.5;
    const prevPlayerY = playery;
    playery += playerdy;
    if (playery >= 790) {
      playery = 790;
      if (playerdy > 0) {
        playerdy = 0;
        touchGrass = true;
      }
    }

    // top half

    for (let i = 0; i < platforms.length; i++) {
      if (
        rectIntersect(
          playerx,
          playery,
          playerSize,
          playerSize,
          platforms[i].x,
          platforms[i].y,
          platforms[i].w,
          platforms[i].h
        )
      ) {
        // if previously above platform, do this stuff
        if (prevPlayerY + playerSize <= platforms[i].y) {
          playery = platforms[i].y - playerSize;
          if (playerdy > 0) {
            playerdy = 0;
          }
          touchGrass = true;
        }
      }
    }
    //player at end

    const lastPlatform = platforms[platforms.length - 1];

    const endGoalTouch = rectIntersect(
      playerx,
      playery,
      playerSize,
      playerSize,
      lastPlatform.x + lastPlatform.w / 2,
      lastPlatform.y - 10,
      10,
      10
    );
    if (endGoalTouch === true) {
      playerx = 200;
      playery = 790;
      levelTimes.push(Math.floor(performance.now() / 1000));

      if (numPlatforms < 13) {
        numPlatforms++;
        generatePlatforms();
        stopSoundEffects();
        gameSong();
        rainFallSpeed += 0.05;
        endGoalSound();
      } else if (numPlatforms === 13) {
        // Time it took to complete Levels
        subtractedLevelTime = [];
        subtractedLevelTimeMinutes = [];
        subtractedLevelTimeSeconds = [];
        displaySubtractedLevelTimeMinutes = [];
        displaySubtractedLevelTimeSeconds = [];

        levelCompleteTime();

        state = "end";
        numPlatforms = 1;
        generatePlatforms();
        gameTime = Math.floor(performance.now() / 1000) - prevGameTime;
        stopSoundEffects();
        menuSong();
        rainFallSpeed = 0.5;

        return;
      }
    }

    //player bounds
    playerx = Math.round((gameAreaWidth + playerx) % gameAreaWidth);

    playery = Math.min(800 - playerSize, playery);

    //drawing

    //draw camera
    ctx.save();

    ctx.translate(
      -playerx + 200 - playerSize / 2,
      -playery + 300 - playerSize / 2
    );

    timeSinceTouchedCloud += dt;

    if (timeSinceTouchedCloud < screenShakeTime) {
      const shakeTimeRemaining = screenShakeTime - timeSinceTouchedCloud;
      const shakeInitialStrength = 10;
      const shakeStrength = shakeTimeRemaining / screenShakeTime;
      ctx.translate(
        Math.round(
          Math.random() * shakeInitialStrength * shakeStrength -
            shakeInitialStrength / 2
        ),
        Math.round(
          Math.random() * shakeInitialStrength * shakeStrength -
            shakeInitialStrength / 2
        )
      );
    }
    function drawMirror(mirror) {
      mirror();
      if (ctx === null) {
        throw new Error("hi");
      }
      //Left Side
      ctx.save();
      ctx.translate(gameAreaWidth, 0);
      mirror();
      ctx.restore();
      //Right Side
      ctx.save();
      ctx.translate(-gameAreaWidth, 0);
      mirror();
      ctx.restore();
    }
    //draw mirror background
    {
      drawMirror(drawAll);
      drawMirror(drawMountains);
      drawMirror(drawFloor);
      drawMirror(drawControls);
      drawMirror(drawGoal);
      drawMirror(drawCloudsOutline);
      drawMirror(drawClouds);
      drawMirror(drawRain);
      drawMirror(drawPlatforms);
    }

    //draw player
    ctx.fillStyle = colors.pink;
    let playerAnimateSpeed = 150;
    const playerAnimateFrames = Math.round(
      performance.now() / playerAnimateSpeed
    );
    if (
      touchGrass === true &&
      playerAnimateFrames % 2 === 1 &&
      (dIsDown === true || aIsDown === true)
    ) {
      ctx.fillRect(playerx, playery - 10, playerSize, playerSize);
      //clothing
      ctx.fillStyle = colors.blue;
      ctx.lineWidth = 2;
      ctx.beginPath;
      ctx.moveTo(playerx, playery + playerSize / 2 - 10);
      ctx.lineTo(playerx + playerSize, playery + playerSize / 2 - 10);
      if (playerDirection === 1) {
        ctx.lineTo(playerx, playery + playerSize - 10);
      } else {
        ctx.lineTo(playerx + playerSize, playery + playerSize - 10);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      //eye
      ctx.fillStyle = "black";
      if (playerDirection === 1) {
        ctx.fillRect(
          playerx + playerSize - 3,
          playery + playerSize / 10 - 10,
          2,
          2
        );
      } else {
        ctx.fillRect(playerx + 3, playery + playerSize / 10 - 10, 2, 2);
      }
    } else {
      ctx.fillRect(playerx, playery, playerSize, playerSize);
      //clothing
      ctx.fillStyle = colors.blue;
      ctx.lineWidth = 2;
      ctx.beginPath;
      ctx.moveTo(playerx, playery + playerSize / 2);
      ctx.lineTo(playerx + playerSize, playery + playerSize / 2);
      if (playerDirection === 1) {
        ctx.lineTo(playerx, playery + playerSize);
      } else {
        ctx.lineTo(playerx + playerSize, playery + playerSize);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "black";
      //eye
      if (playerDirection === 1) {
        ctx.fillRect(playerx + playerSize - 3, playery + playerSize / 10, 2, 2);
      } else {
        ctx.fillRect(playerx + 3, playery + playerSize / 10, 2, 2);
      }
    }

    ctx.restore();
    //Game music
    if (
      songPlayed === true &&
      performance.now() - songStart >= gameSongDuration
    ) {
      gameSong(); // Restart the music
    }

    //draw pause menu
    if (state === "pause") {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = colors.white;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colors.black;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = 1;
      ctx.font = "40px Arial";
      ctx.fillText("Enter to Unpause", canvas.width / 2, canvas.height / 2);
    }
  }

  const gameTimeMinutes = Math.floor(gameTime / 60);
  const gameTimeSeconds = gameTime % 60;
  let displaySeconds = gameTimeSeconds + "";
  let displayMinutes = gameTimeMinutes + "";
  let endStatus = "";
  //end Status/Rank
  {
    if (gameTimeMinutes < 2) {
      endStatus = gameRank[0];
    } else if (gameTimeMinutes < 3) {
      endStatus = gameRank[1];
    } else if (gameTimeMinutes < 4) {
      endStatus = gameRank[2];
    } else if (gameTimeMinutes < 5) {
      endStatus = gameRank[3];
    } else if (gameTimeMinutes < 6) {
      endStatus = gameRank[4];
    } else {
      endStatus = gameRank[5];
    }
  }
  if (gameTimeSeconds < 10) {
    displaySeconds = "0" + displaySeconds;
  }
  if (gameTimeMinutes < 10) {
    displayMinutes = "0" + displayMinutes;
  }

  // draw Menu State
  if (state === "menu") {
    //drawing
    //background
    ctx.fillStyle = colors.white;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (gameClicked === true) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, colors.black);
      gradient.addColorStop(0.7, colors.pink);
      gradient.addColorStop(1, colors.yellow);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawStars();
      ctx.fillStyle = colors.black;
      ctx.fillRect(0, 300, canvas.width, 100);

      //player
      ctx.fillStyle = colors.pink;
      ctx.translate(-playerSize * 2, 0);
      ctx.fillRect(
        canvas.width / 2,
        300 - playerSize * 4,
        playerSize * 4,
        playerSize * 4
      );

      ctx.fillStyle = colors.blue;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 300 - (playerSize * 4) / 2);
      ctx.lineTo(canvas.width / 2 + playerSize * 4, 300 - (playerSize * 4) / 2);
      ctx.lineTo(canvas.width / 2, 300);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      //eye
      ctx.fillStyle = "black";
      ctx.fillRect(
        canvas.width / 2 + playerSize * 4 - 12,
        300 - ((playerSize * 4) / 4) * 3.5,
        2 * 4,
        2 * 4
      );
      ctx.translate(playerSize * 2, 0);
      //Text

      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.white;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "30px Arial";
      ctx.fillText("The Thirteen Storms of", canvas.width / 2, 90);
      ctx.fillStyle = colors.black;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "60px Georgia";
      ctx.fillText(stormGodChosen, canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = colors.white;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "30px Arial";
      ctx.fillText("Press Enter to Start", canvas.width / 2, 335);
      ctx.font = "20px Arial";
      ctx.fillText("Press M to mute", canvas.width / 2, 365);
    } else {
      ctx.fillStyle = colors.black;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "60px Arial";
      ctx.fillText("Please Click :)", canvas.width / 2, canvas.height / 2);
    }

    //music
    {
      if (
        songPlayed === true &&
        performance.now() - songStart >= songDuration
      ) {
        menuSong(); // Restart the music
      }

      if (songPlayed === false && gameClicked === true) {
        menuSong();
      }
    }
  }
  // Draw End State
  if (state === "end") {
    if (songPlayed === true && performance.now() - songStart >= songDuration) {
      menuSong(); // Restart the music
    }

    //Storm Braved Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 125);
    gradient.addColorStop(0.05, blackAlpha);
    gradient.addColorStop(0.3, colors.black);
    gradient.addColorStop(0.7, blackAlpha);

    //Background Gradient
    const gradientBackground = ctx.createLinearGradient(0, 400, 0, 0);
    gradientBackground.addColorStop(1, colors.black);
    gradientBackground.addColorStop(0.45, colors.pink);
    gradientBackground.addColorStop(0, colors.yellow);

    ctx.fillStyle = gradientBackground;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = gradient;
    // ctx.fillRect(0, 0, canvas.width, 125);

    //draw text
    {
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.purple;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "40px Arial";
      ctx.fillText("Storm Braved", canvas.width / 2, 90);
      ctx.fillStyle = colors.black;
      ctx.font = "20px Arial";
      ctx.fillText(
        "in " + displayMinutes + ":" + displaySeconds,
        canvas.width / 2,
        107
      );
      ctx.fillStyle = colors.black;
      ctx.font = "17px Arial";
      ctx.fillText("Press R to Restart", canvas.width / 2, 190);
      ctx.fillStyle = colors.black;
      ctx.font = "30px Arial";
      ctx.fillText(endStatus, canvas.width / 2, 155);

      ctx.fillStyle = colors.black;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "20px Arial";
      for (
        let i = 1;
        i < Math.floor(displaySubtractedLevelTimeMinutes.length / 2);
        i++
      ) {
        ctx.fillText(
          i +
            " " +
            displaySubtractedLevelTimeMinutes[i] +
            ":" +
            displaySubtractedLevelTimeSeconds[i],
          canvas.width / 3,
          210 + i * 25
        );
      }
      for (let i = 7; i < displaySubtractedLevelTimeMinutes.length - 1; i++) {
        ctx.fillStyle = colors.black;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Arial";
        ctx.fillText(
          i +
            " " +
            displaySubtractedLevelTimeMinutes[i] +
            ":" +
            displaySubtractedLevelTimeSeconds[i],
          (canvas.width / 3) * 2,
          210 + (i - 6) * 25
        );
      }
    }
  }
  //draw game art functions
  function drawAll() {
    //draw play area
    if (ctx === null) {
      throw new Error("hi");
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, -400, gameAreaWidth, canvas.height + 1000);
    drawStars();

    //stars
  }
  function drawGoal() {
    const lastPlatform = platforms[platforms.length - 1];
    if (ctx === null) {
      throw new Error("hi");
    }
    //goal
    ctx.fillStyle = colors.yellow;
    ctx.fillRect(
      lastPlatform.x + lastPlatform.w / 2,
      lastPlatform.y - 10,
      10,
      10
    );
    ctx.fillStyle = colors.pink;
    ctx.strokeStyle = colors.black;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lastPlatform.x + lastPlatform.w / 2 - 5, lastPlatform.y - 10);
    ctx.lineTo(lastPlatform.x + lastPlatform.w / 2 + 15, lastPlatform.y - 10);
    ctx.lineTo(lastPlatform.x + lastPlatform.w / 2 + 5, lastPlatform.y - 20);
    ctx.fill();
    ctx.stroke();

    //Village Houses
    ctx.fillStyle = colors.black;
    ctx.fillRect(lastPlatform.x - 5, lastPlatform.y - 10, 10, 10);
    ctx.fillStyle = colors.pink;
    ctx.beginPath();
    ctx.moveTo(lastPlatform.x - 10, lastPlatform.y - 10);
    ctx.lineTo(lastPlatform.x + 10, lastPlatform.y - 10);
    ctx.lineTo(lastPlatform.x + 0, lastPlatform.y - 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colors.black;
    ctx.fillRect(
      lastPlatform.x + lastPlatform.w - 5,
      lastPlatform.y - 10,
      10,
      10
    );
    ctx.fillStyle = colors.pink;
    ctx.beginPath();
    ctx.moveTo(lastPlatform.x + lastPlatform.w - 10, lastPlatform.y - 10);
    ctx.lineTo(lastPlatform.x + lastPlatform.w + 10, lastPlatform.y - 10);
    ctx.lineTo(lastPlatform.x + lastPlatform.w, lastPlatform.y - 20);
    ctx.fill();
    ctx.stroke();
  }
  function drawPlatforms() {
    if (ctx === null) {
      throw new Error("hi");
    }
    for (let i = 0; i < platforms.length; i++) {
      ctx.fillStyle = colors.purple;
      ctx.fillRect(
        platforms[i].x,
        platforms[i].y,
        platforms[i].w,
        platforms[i].h
      );
    }
  }
  function drawMountains() {
    if (ctx === null) {
      throw new Error("hi");
    }
    for (let i = numPlatforms - 1; i >= 0; i--) {
      //Math
      const angleToLeftEdge = Math.atan2(
        platforms[i].peaky - (platforms[i].y - 20),
        platforms[i].peakx - platforms[i].leftEdge
      );

      const angleToRightEdge = Math.atan2(
        platforms[i].peaky - (platforms[i].y - 20),
        platforms[i].peakx - platforms[i].rightEdge
      );
      const arbitRadius = 2000;
      const arbitPeak = 50;
      const rightEdgedx = Math.cos(angleToRightEdge);
      const rightEdgedy = Math.sin(angleToRightEdge);
      const leftEdgedx = Math.cos(angleToLeftEdge);
      const leftEdgedy = Math.sin(angleToLeftEdge);

      //draw Mountain
      ctx.lineWidth = 10;
      ctx.fillStyle = colors.blue;
      ctx.strokeStyle = colors.black;
      ctx.beginPath();
      ctx.moveTo(platforms[i].peakx, platforms[i].peaky);
      ctx.lineTo(
        platforms[i].peakx + rightEdgedx * arbitRadius,
        platforms[i].peaky - rightEdgedy * arbitRadius
      );
      ctx.lineTo(
        platforms[i].peakx + leftEdgedx * arbitRadius,
        platforms[i].peaky - leftEdgedy * arbitRadius
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      //draw Mountain peak
      ctx.lineWidth = 10;
      ctx.fillStyle = colors.white;
      ctx.strokeStyle = colors.black;
      ctx.beginPath();
      ctx.moveTo(platforms[i].peakx, platforms[i].peaky);
      ctx.lineTo(
        platforms[i].peakx + rightEdgedx * arbitPeak,
        platforms[i].peaky - rightEdgedy * arbitPeak
      );
      ctx.lineTo(
        platforms[i].peakx + leftEdgedx * arbitPeak,
        platforms[i].peaky - leftEdgedy * arbitPeak
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
  function drawClouds() {
    if (ctx === null) {
      throw new Error("hi");
    }
    for (let i = 0; i < clouds.length; i++) {
      ctx.fillStyle = colors.black;

      //outline circles
      for (let j = 0; j < clouds[i].cloudPoints.length; j++) {
        ctx.beginPath();
        ctx.roundRect(
          clouds[i].x +
            clouds[i].cloudPoints[j].x -
            clouds[i].cloudSegmentRadius,
          clouds[i].y +
            clouds[i].cloudPoints[j].y -
            clouds[i].cloudSegmentRadius,
          clouds[i].cloudSegmentRadius * 2,
          clouds[i].cloudSegmentRadius * 2,
          100
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  function drawCloudsOutline() {
    if (ctx === null) {
      throw new Error("hi");
    }
    for (let i = 0; i < clouds.length; i++) {
      ctx.fillStyle = colors.white;

      //outline circles
      for (let j = 0; j < clouds[i].cloudPoints.length; j++) {
        ctx.beginPath();
        ctx.roundRect(
          clouds[i].x +
            clouds[i].cloudPoints[j].x -
            clouds[i].cloudSegmentRadius,
          clouds[i].y +
            clouds[i].cloudPoints[j].y -
            clouds[i].cloudSegmentRadius,
          clouds[i].cloudSegmentRadius * 2.07,
          clouds[i].cloudSegmentRadius * 2.07,
          100
        );
        ctx.fill();
        ctx.closePath();
      }
    }
  }

  function drawFloor() {
    if (ctx === null) {
      throw new Error("hi");
    }
    ctx.fillStyle = colors.black;
    ctx.fillRect(0, 800, gameAreaWidth, 200);
  }
  function drawControls() {
    if (ctx === null) {
      throw new Error("hi");
    }
    ctx.fillStyle = colors.yellow;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = "25px Arial";
    ctx.fillText("WASD to Move ", spawnx, spawny + 50);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "25px Arial";
    ctx.fillText("ESC to Pause", spawnx, spawny + 50);
  }
  function drawStars() {
    if (ctx === null) {
      throw new Error("hi");
    }

    for (let i = 0; i < stars.length; i++) {
      const starOscSpeed = stars[i].movement * 0.01;
      // 0-1 with time
      const additionalRadius =
        (Math.sin(performance.now() * starOscSpeed) + 1) / 2;
      ctx.beginPath();
      const starSizeMultiplier = 0.25;
      const radius = stars[i].r * starSizeMultiplier + additionalRadius;
      ctx.roundRect(
        stars[i].x - radius,
        stars[i].y - radius,
        radius * 2,
        radius * 2,
        100
      );
      ctx.fillStyle = colors.white;
      ctx.fill();
    }
  }
  function drawRain() {
    if (ctx === null) {
      throw new Error("hi");
    }

    for (let i = 0; i < rain.length; i++) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.roundRect(rain[i].x, rain[i].y, rain[i].r, rain[i].r, 100);
      ctx.fill();
    }
  }
}

//menu music
function menuSong() {
  for (let i = 0; i < notes.length; i++) {
    {
      soundEffect("sine", notes[i], noteDelay, i * noteDelay);
    }
    songPlayed = true;
    songStart = performance.now();
  }
}
//game music
function gameSong() {
  for (let i = 0; i < notes.length; i++) {
    {
      soundEffect(
        "sine",
        notes[i],
        gameDelayStart - gameSongDelay * numPlatforms,
        i * (gameDelayStart - gameSongDelay * numPlatforms)
      );
    }
    songPlayed = true;
    songStart = performance.now();
    gameSongDuration =
      notes.length * (gameDelayStart - gameSongDelay * numPlatforms) * 1000;
  }
}

//end goal Sound
function endGoalSound() {
  const osc = audioctx.createOscillator();
  osc.connect(masterGain);
  osc.frequency.value = 300;
  osc.type = "sine";
  //osc.start();
  //osc.stop(audioctx.currentTime + duration);
  osc.start(audioctx.currentTime);
  osc.stop(audioctx.currentTime + 0.2);
  oscillators.push(osc);
  osc.frequency.exponentialRampToValueAtTime(900, 0.2 + audioctx.currentTime);
}
//jump sound
function jumpSound() {
  const osc = audioctx.createOscillator();
  osc.connect(masterGain);
  osc.frequency.value = 800;
  osc.type = "triangle";
  //osc.start();
  //osc.stop(audioctx.currentTime + duration);
  osc.start(audioctx.currentTime);
  osc.stop(audioctx.currentTime + 0.15);
  oscillators.push(osc);
  osc.frequency.exponentialRampToValueAtTime(200, 0.15 + audioctx.currentTime);
}

window.setInterval(draw, 1000 / 60);

function soundEffect(
  type,
  //"sine" | "triangle" | "sawtooth" | "square";
  frequency,
  duration,
  delay
) {
  const osc = audioctx.createOscillator();
  osc.connect(masterGain);
  osc.frequency.value = frequency;
  osc.type = type;
  //osc.start();
  //osc.stop(audioctx.currentTime + duration);
  osc.start(audioctx.currentTime + (delay || 0));
  osc.stop(audioctx.currentTime + duration + (delay || 0));
  oscillators.push(osc);
}
function stopSoundEffects() {
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].stop();
  }
  oscillators = [];
}
function levelCompleteTime() {
  for (let i = 0; i < numPlatforms + 1; i++) {
    if (i === 0) {
    } else subtractedLevelTime[i] = levelTimes[i] - levelTimes[i - 1];
    subtractedLevelTimeMinutes.push(Math.floor(subtractedLevelTime[i] / 60));
    subtractedLevelTimeSeconds.push(subtractedLevelTime[i] % 60);
    displaySubtractedLevelTimeMinutes.push(subtractedLevelTimeMinutes[i] + "");
    displaySubtractedLevelTimeSeconds.push(subtractedLevelTimeSeconds[i] + "");
    if (subtractedLevelTimeMinutes[i] < 10) {
      displaySubtractedLevelTimeMinutes[i] =
        "0" + displaySubtractedLevelTimeMinutes[i];
    }
    if (subtractedLevelTimeSeconds[i] < 10) {
      displaySubtractedLevelTimeSeconds[i] =
        "0" + displaySubtractedLevelTimeSeconds[i];
    }
  }
}
