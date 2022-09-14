function addBlob(startPoint = {x: 200, y: 200}, subtype) {
  var blob = (blobPool.length > 0) ? blobPool.pop() : elFromString('<div><div/></div>');

  subtype = subtype || '';

  blob.active = true;
  blob.dead = false;
  blob.className = 'blob ' + subtype;
  blob.x = startPoint.x;
  blob.y = startPoint.y;
  blob.gameType = 'blob';
  blob.transforms = [];
  blob.width = 32;
  blob.height = 25;
  blob.hunger = 400 * Math.random();
  blob.blinkWait = blinkWait * Math.random();
  blob.growth = 0;
  blob.foodEaten = 0;
  blob.poopWait = Math.round(poopWait * Math.random());
  blob.birthWait = Math.round(birthWait + birthWait * Math.random());
  blob.deathWait = 800;
  blob.chaseWait = chaseWait;
  blob.subtype = subtype;

  if (!blob.inDom) {
    blobs.push(blob);
    elLevel.appendChild(blob);
    blob.inDom = true;
  }

  totalBlobs++;
  elBlobCount.innerHTML = totalBlobs;
}

function updateBlob() {
  if (blob.hunger < maxHunger && !blob.digesting) blob.hunger++;

  blobSpeed = 0.07 * delta;
  closeFoodDistance = 9999;
  closeFood = false;

  if (blob.dead) {
    wander();

    blob.deathWait--;

    if (blob.deathWait <= 0) {
      // Destroy blob
      blob.active = false;
      blob.className = '';
      blobPool.push(blob);
    }
  } else {
    blob.blinkWait--;

    if (blob.blinkWait <= 0) {
      blob.classList.add('blink');
      blob.blinkWait = blinkWait;

      setTimeout(function () {
        if (this.digesting !== true) {
          this.classList.remove('blink');
        }
      }.bind(blob), 300);
    }

    handleHunger();

    if (blob.closeFood && blob.closeFood.active) {
        chaseFood();
    } else {
      if (blob.digesting !== true) {
        wander();
      }

      blob.closeFood = null;
    }

    if (blob.subtype === 'ma') {
      tryBirth();
    } else if (blob.subtype !== 'trans') {
      tryPoop();
    }
  }

  move(blob);
}

function handleHunger() {
  if (blob.hunger > hungerLevel) {
    blob.classList.add('hungry');

    if (blob.hunger > hungerLevel * 2) blob.classList.add('very-hungry');

    if (blob.hunger > hungerLevel * 3) {
      blob.classList.add('dead');
      blob.dead = true;
      totalBlobs--;
      elBlobCount.innerHTML = totalBlobs;
    } else {
      blob.chaseWait--;

      if (blob.chaseWait === 0) {
        blob.chaseWait = chaseWait;

        if (blob.subtype === 'trans') {
          for (j = 0; j < poops.length; j++) {
            food = poops[j];

            if (!food.active || food.type !== 'raw-anti-glitch') continue;

            tryForCloserFood();
          }
        } else if (blob.subtype === 'eater') {
          for (j = 0; j < blobs.length; j++) {
            food = blobs[j];

            if (food === blob || food.subtype || !food.active) continue;

            tryForCloserFood();
          }
        } else {
          for (j = 0; j < activeFoods.length; j++) {
            food = activeFoods[j];

            tryForCloserFood();
          }
        }

        function tryForCloserFood() {
          distanceToFood = Math.abs((food.x - blob.x) + (food.y - blob.y));

          if (distanceToFood < closeFoodDistance) {
            closeFoodDistance = distanceToFood;
            blob.closeFood = food;
          }
        }
      }
    }
  }
}

function chaseFood() {
  var antiGlitch,
      tempY,
      tempX;

  if (blob.subtype === 'trans') {
    tempY = blob.y + blob.height * 3;
    tempX = blob.x + blob.width / 2 - 5;
  } else {
    tempY = blob.y + blob.height / 2;
    tempX = blob.x + blob.width / 2;
  }

  if (blob.closeFood.x + blob.closeFood.width / 2 < tempX - 1) {
    blob.x -= blobSpeed;
    blob.classList.add('left');
    blob.classList.remove('right');
  } else if (blob.closeFood.x + blob.closeFood.width / 2 > tempX + 1) {
    blob.x += blobSpeed;
    blob.classList.add('right');
    blob.classList.remove('left');
  }

  if (blob.closeFood.y + blob.closeFood.height / 2 < tempY - 1) {
    blob.y -= blobSpeed;
  } else if (blob.closeFood.y + blob.closeFood.height / 2 > tempY + 1) {
    blob.y += blobSpeed;
  }

  //if (boxesCollide(blob, blob.closeFood)) {
  if (boxesCollide({x: tempX, y: tempY, width: 4, height: 4}, {x: blob.closeFood.x + blob.closeFood.width / 2, y: blob.closeFood.y + blob.closeFood.height / 2, width: 4, height: 4})) {
    // eat food
    blob.hunger -= hungerLevel;
    blob.classList.remove('hungry', 'very-hungry');

    if (blob.growth < maxGrowth) {
      blob.foodEaten++;
      blob.wanderPt = null;

      if (blob.foodEaten === 2) {
        blob.foodEaten = 0;
        blob.growth++;

        if (blob.growth === 1) {
          blob.transforms = (blob.subtype === '') ? ['scale(1.2)'] : ['scale(1.1)'];
        } else {
          blob.transforms = (blob.subtype === '') ? ['scale(1.5)'] : ['scale(1.2)'];
        }
      }
    }

    if (blob.subtype === 'trans') {
      blob.closeFood.active = false;
      food.transforming = true;
      blob.digesting = true;
      blob.hunger = 0;
      blob.classList.add('blink');
      antiGlitch = blob.closeFood;

      setTimeout(function () {
        this.digesting = false;
        this.classList.remove('blink');

        antiGlitch.active = true;
        antiGlitch.type = 'pure-anti-glitch';
        antiGlitch.classList.add('pure-anti-glitch');
        antiGlitch.transforming = false;

        this.closeFood = null;
      }.bind(blob), 2000);
    } else {
      // Destroy food
      blob.closeFood.active = false;
      blob.closeFood.className = '';

      if (blob.subtype === 'eater') {
        totalBlobs--;
        blobPool.push(blob.closeFood);
      } else {
        foodPool.push(blob.closeFood);
      }
    }

    blob.closeFood = null;
  }
}

function tryPoop() {
  if (blob.growth > 0) {
    blob.poopWait--;

    if (blob.poopWait === 0) {
      blob.poopWait = poopWait;

      var poopType = (blob.growth === 2) ? 'gold' : 'silver';

      if (blob.subtype === 'eater') {
        poopType = 'raw-anti-glitch';
      }

      addPoop({
          x: blob.x,
          y: blob.y
      }, poopType);
    }
  }
}

function tryBirth() {
    blob.birthWait--;

    if (blob.birthWait === 0) {
      blob.classList.add('birthing');
      blob.birthWait = birthWait;


      setTimeout(function () {


        addBlob({
          x: this.x + this.width / 2,
          y: this.y + this.height * 2
        });

        this.classList.remove('birthing');
      }.bind(blob), 5000)
    }
}

function wander() {
  // wander
  blobSpeed = 0.01 * delta;

  blob.wanderPt = blob.wanderPt || {
    x: blob.x + 120 * Math.random() * ((Math.random() > 0.5) ? -1 : 1),
    y: blob.y + 120 * Math.random() * ((Math.random() > 0.5) ? -1 : 1)
  };

  if (blob.dead && blob.y - blobSpeed > 0) {
    blob.y -= blobSpeed;
  } else {
    if (blob.wanderPt.x < blob.x - 1 && blob.wanderPt.x > 0) {
      blob.x -= blobSpeed;
      blob.classList.add('left');
      blob.classList.remove('right');
    } else if (blob.wanderPt.x > blob.x + 1 && blob.wanderPt.x < 600) {
      blob.x += blobSpeed;
      blob.classList.add('right');
      blob.classList.remove('left');
    } else {
      blob.wanderPt.x = blob.x + 140 * Math.random() * ((Math.random() > 0.5) ? -1 : 1);
    }

    if (blob.wanderPt.y < blob.y - 1 && blob.wanderPt.y > 0) {
      blob.y -= blobSpeed;
    } else if (blob.wanderPt.y > blob.y + 1 && blob.wanderPt.y < 400) {
      blob.y += blobSpeed;
    } else {
      blob.wanderPt.y = blob.y + 140 * Math.random() * ((Math.random() > 0.5) ? -1 : 1);
    }
  }
}
