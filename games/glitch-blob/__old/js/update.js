function update(timestamp) {
  delta = (lastFrameTimeMs) ? timestamp - lastFrameTimeMs: 0;

  lastFrameTimeMs = timestamp;

  if (!run) return;

  if (totalBlobs <= 0 && points < 100) {
    elBody.classList = 'lose';

    endLevel();
  }

  activeFoods = [];

  // update food
  foodSpeed = 0.05 * delta;

  for (i = 0; i < foods.length; i++) {
    food = foods[i];

    if (!food.active) continue;

    food.y += foodSpeed;

    if (food.y > 400) {
      food.active = false;
      food.className = '';
      foodPool.push(food);
    } else {
      move(food);
    }

    if (food.active) activeFoods.push(food);
  }

  // update poop
  poopSpeed = 0.05 * delta;

  for (i = 0; i < poops.length; i++) {
    poop = poops[i];

    if (!poop.active) continue;

    if (!poop.transforming) {
       poop.y += poopSpeed;
    }

    move(poop);

    if (poop.y > 400) {
      poop.active = false;
      poop.className = '';
      poopPool.push(poop);
    }

    if (poop.active) activePoops.push(poop);
  }

  // update blob
  for (i = 0; i < blobs.length; i++) {

    blob = blobs[i];

    if (!blob.active) continue;

    updateBlob();
  }

  //run = false;

  requestAnimationFrame(update);
}
