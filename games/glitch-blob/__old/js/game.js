console.log('game start');

var delta, lastFrameTimeMs, closeFoodDistance, closeFood, distanceToFood, foodSpeed, blobSpeed, i, j, food, blob,
    elBody = document.body,
    elGame = document.querySelector('.game'),
    elLevel = document.querySelector('.level'),
    elPoints = document.querySelector('.points').children[0],
    elBlobCount = document.querySelector('.blob-count').children[0],
    elBribe = document.querySelector('.bribe'),
    run = true,
    foodPool = [], blobPool = [], poopPool = [],
    blobs = [], foods = [], poops = [],
    activeFoods = [], activePoops = [],
    hungerLevel = 600, maxHunger = hungerLevel * 3 + 1, maxGrowth = 2,
    blinkWait = 800, poopWait = 500, birthWait = 700, chaseWait = 50,
    points = 130, totalBlobs = 0, loverBribed = false;

var elTitleScreen = document.querySelector('.title-screen'),
    elTitleText = document.querySelector('.title-text'),
    elBlobText = document.querySelector('.blob-text'),
    elPlay = document.querySelector('.play'),
    elHaiku = document.querySelector('.haiku');


titleScreen();

function titleScreen() {
  blobs.forEach(function (blob) {
    if (blob.active) {
      blob.active = false;
      blob.className = '';
      blobPool.push(blob);
    }
  });

  setTimeout(function () {
    elTitleScreen.classList.add('screen-glitch');
  }, 600);

  setTimeout(function () {
    elTitleScreen.classList.remove('screen-glitch');
  }, 700);

  setTimeout(function () {
    elTitleText.classList.remove('stop');
    elTitleText.classList.add('play');
  }, 800);

  setTimeout(function () {
    elTitleScreen.classList.add('screen-glitch');
  }, 2200);

  setTimeout(function () {
    elTitleScreen.classList.remove('screen-glitch');
  }, 2400);

  setTimeout(function () {
    elBlobText.classList.add('screen-glitch');
  }, 2800);

  setTimeout(function () {
    elBlobText.classList.remove('screen-glitch');
    elPlay.classList.add('show');
  }, 3000);
}

elPoints.innerHTML = points;

onTap(elBody, tapActions);

onTap(elPlay, function (e) {
    elTitleScreen.classList.add('screen-glitch');

  setTimeout(function () {
    elTitleText.classList.add('hide');
    elBody.classList.add('screen-glitch');
  }, 300);

  setTimeout(function () {
    elBody.classList.remove('screen-glitch');
    elTitleScreen.classList.remove('screen-glitch');

    elBody.classList.add('level-1');
    elTitleText.classList.add('stop');
    elTitleText.classList.remove('play');
  }, 500);
});

onTap(elHaiku, function (e) {
  if (!e.target.classList.contains('part-2')) {
    elTitleScreen.classList.add('screen-glitch');

    setTimeout(function () {
      elTitleScreen.classList.remove('screen-glitch');
    }, 200);

    e.target.classList.add('part-2');
  } else {
    elHaiku.classList.remove('part-2');

    addBlob({x: 300, y: 240});

    if (!elBody.classList.contains('level-1')) {
      addBlob({x: 500, y: 140}, 'ma');
    }

    points = 30;
    elPoints.innerHTML = points;

    elTitleScreen.classList.add('hide');
    elBody.classList.add('screen-glitch');

    if (elBody.classList.contains('lose')) {
      elTitleScreen.classList.remove('hide');
      elTitleText.classList.remove('hide');

      setTimeout(function () {
        elBody.classList.remove('lose');
        elBody.classList.remove('screen-glitch');

        titleScreen();
      }, 500);
    } else if (elBody.classList.contains('win')) {
      elTitleScreen.classList.remove('hide');

      setTimeout(function () {
        elBody.classList.remove('screen-glitch');
        elBody.classList.add('credits');
        elBody.classList.remove('win');
      }, 500);
    } else if (elBody.classList.contains('credits')) {
      elTitleText.classList.remove('hide');
      elTitleScreen.classList.remove('hide');
      elBody.classList.remove('credits');

      setTimeout(function () {
        elBody.classList.remove('screen-glitch');
        titleScreen();
      }, 500);
    } else {
      setTimeout(function () {
        elBody.classList.remove('screen-glitch');
      }, 200);
    }
  }
});

function tapActions(e) {
  if (e.target.className === 'level') {
    if (points >= 2) {
      points -= 2;

      var rect = e.target.getBoundingClientRect();

      addFood({
        x: e.offsetX || e.targetTouches[0].pageX - rect.left - elBody.scrollLeft,
        y: e.offsetY || e.targetTouches[0].pageY - rect.top - elBody.scrollTop
      });

      elPoints.innerHTML = points;
    }
  }

  if (e.target.classList.contains('add-blob')) {
    var tempPoints = points;

    if (points > 0) {
      switch (e.target.dataset.type) {
        case 'ma':
          points -= 500; break;
        case 'eater':
          points -= 1000; break;
        case 'trans':
          points -= 2000; break;
        default:
          points -= 100; break;
      }

      if (points < 0) {
        points = tempPoints;
      } else {
         addBlob({
          x: 50 + 500 * Math.random(),
          y: 25 + 200 * Math.random()
        }, e.target.dataset.type);
      }

      elPoints.innerHTML = points;
    }
  }

  if (e.target.classList.contains('poop')) {
    switch (e.target.type) {
        case 'gold':
          points += 50; break;
        case 'raw-anti-glitch':
          points += 500; break;
        case 'pure-anti-glitch':
          points += 2000;
          elBribe.dataset.antiglitch++;

          if (elBribe.dataset.antiglitch >= 15) {
            elBribe.classList.add('win');
          }

          break;
        default:
          points += 10; break;
      }

    collectPoop(e.target);

    elPoints.innerHTML = points;
  }

  if (e.target.className === 'bribe') {
    var tempPoints = points;

    if (points > 0) {
      if (
        (elBody.classList.contains('level-1') && points >= 3000) ||
        (elBody.classList.contains('level-2') && points >= 10000) ||
        (elBody.classList.contains('level-3') && elBribe.dataset.antiglitch >= 15)
      ) {
        endLevel();
      }

      elPoints.innerHTML = points;
    }
  }

  run = true;
}

requestAnimationFrame(update);

function endLevel() {
  elBody.classList.add('screen-glitch');

  points = 130;
  totalBlobs = 0;

  blobs.forEach(function (blob) {
    if (blob.active) {
      blob.active = false;
      blob.className = '';
      blobPool.push(blob);
    }
  });

  setTimeout(function () {
    elHaiku.classList.remove('part-2');

    elTitleText.classList.add('hide');
    elTitleScreen.classList.remove('hide');

    if (elBody.classList.contains('lose')) {

    } else if (elBody.classList.contains('level-1')) {
      elBody.classList.remove('level-1');
      elBody.classList.add('level-2');
    } else if (elBody.classList.contains('level-2')) {
      elBody.classList.remove('level-2');
      elBody.classList.add('level-3');
    } else {
      elBody.classList.remove('level-3');
      elBody.classList.add('win');
    }

    elBody.classList.remove('screen-glitch');
  }, 200);
}


function onTap(el, callback) {
    var touched = false,
        tapCallback = handleTap();

    el.addEventListener('touchstart', tapCallback);
    el.addEventListener('click', tapCallback);

    return tapCallback;

    function handleTap() {
        return function (e) {
            // prevent click event event if triggering event was touchstart
            if (e.type === 'touchstart') {
                e.preventDefault();
                touched = true;
            } else if (touched === true) {
                touched = false;
                return false;
            }

            callback(e);
        };
    }
}
