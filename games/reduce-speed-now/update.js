let update = (dt) => {
    totalTime += dt;
    let et = dt / 1000;

    if (state === MENU) {
        if (space.released) {
            space.released = false;
            level = 0;
            nextLevel();
            state = PLAYING;
        } else {
            return;
        }
    }

    if (state === WON) {
        if (space.released) {
            space.released = false;
            wonObjects = [];
            state = MENU;
        } else {
            wonObjects = wonObjects.filter(o => !o.dead);
            if (Math.random() < 0.2) {
                wonObjects.push({ 
                    x: Math.random() * 100, 
                    y: Math.random() * 100, 
                    time: totalTime, 
                    dead: false,
                    asset: Math.random() < 0.3 ? rainbowCoinAsset : unicornAsset
                });
            }
        }
        return;
    }

    if (state == LEVELCLEARED) {
        infoFont += 80 * et;
        infoTimer += 80 * et;
        infoFont = Math.min(infoFont, 144);
        if (infoTimer > 300) {
            skyFrom = level - 1;
            skyTransitionStart = totalTime;
            nextLevel();
            state = PLAYING;
        } else {
            return;
        }
    }

    if (state == LEVELFAILED) {
        if (down.released) {
            levelFailedMenuItemSelected = 1;
            down.released = false;
            return;
        }
        if (up.released) {
            levelFailedMenuItemSelected = 0;
            up.released = false;
            return;
        }
        if (space.released) {
            space.released = false;
            if (levelFailedMenuItemSelected === 0) {
                level--;
                nextLevel();
                state = PLAYING;
            } else {
                levelFailedMenuItemSelected = 0;
                state = MENU;
                return;
            }
        }
    }

    decreaseEnergy(5 * et);
    if (energy <= 0) {
        state = LEVELFAILED;
        return;
    }

    increaseSpeed(0.2 * et);

    // Car Curvature is accumulated left/right input, but inversely proportional to speed i.e. it is harder to turn at high speed
    if (left.down && car.pos > -0.8) {
        playerCurvature -= steeringFactor * speed * et * (1 - speed / 2);
    }

    if (right.down && car.pos < 0.8) {
        playerCurvature += steeringFactor * speed * et * (1 - speed / 2);
    }

    onEdge = Math.abs(car.pos) > 0.79;
    if (onEdge) {
        decreaseSpeed(20.0 * et);
        energy -= 10.0 * et;
    }

    // Move car along track according to car speed
    distance += 70 * speed * et;

    if (distance >= trackDistance) {
        state = level == 5 ? WON : LEVELCLEARED;
        return;
    }

    // Get Point on track
    let offset = 0;
    let trackSection = 0;

    if (distance >= trackDistance)
    {
        distance -= trackDistance;
    }
               
    // Find position on track (could optimise)
    while (trackSection < tracks.length && offset <= distance)
    {                      
        offset += tracks[trackSection][1];
        trackSection++;
    }
               
    // Interpolate towards target track curvature
    let targetCurvature = tracks[trackSection - 1][0];
    let trackCurveDiff = (targetCurvature - curvature) * et * speed;

    // Accumulate player curvature
    curvature += trackCurveDiff;

    // Accumulate track curvature
    trackCurvature += curvature * et * speed;

    // The car position on road is proportional to difference between current accumulated track curvature, and 
    // current accumulated player curvature i.e. if they are similar, the car will be in the middle of the track
    car.pos = playerCurvature - trackCurvature;

    let targetTilt = (right.down ? 1 : 0) - (left.down ? 1 : 0);
    carTilt += (targetTilt - carTilt) * Math.min(et * 5, 1);

    _updateVisualCoordinates();
    _checkForCollisions();
    _updateDeadObjects(et);
}

let _updateVisualCoordinates = () => {

    let _calculateRoadAndGrassPositions = () => {
        visualCoordinates = { lefts: [], rights: [], grassIntervals: [] };
        let grassTop = 0;
        let previousGrassColor = undefined;
        for (let y = 0; y <= H / 2; y++) {
            let perspective = y / (H / 2);
            let roadWidth = 0.1 + perspective * 0.8; // Min 10% Max 90%
            let clipWidth = roadWidth * 0.15;
            let halfRoadWidth = roadWidth / 2;
            let middlePoint = 0.5 + curvature * Math.pow((1 - perspective), 3);
            visualCoordinates.lefts.push([xx((middlePoint - halfRoadWidth - clipWidth) * W), yy(H / 2 + y)]);
            visualCoordinates.rights.push([xx((middlePoint + halfRoadWidth + clipWidth) * W), yy(H / 2 + y)]);
            
            let grassColor = Math.sin(20 * Math.pow(1 - perspective, 3) + distance * 0.1) > 0 ? 0 : 1;
            if (y == H / 2 - 1 || (previousGrassColor && previousGrassColor != grassColor)) {
                visualCoordinates.grassIntervals.push([grassTop, y - grassTop + 1]);
                grassTop = y;
            }
            previousGrassColor = grassColor;
        }
    }

    let _getObjectX = (y, offset) => {
        let l = visualCoordinates.lefts, r = visualCoordinates.rights;
        if (y < l[0][1]) {
            return;
        }

        let i = l.findIndex(e => e[1] >= y);
        let leftTopY = l[i - 1][1];
        let leftBotY = l[i][1];
        let offsetY = (y - leftTopY) / (leftBotY - leftTopY);

        let leftTopX = l[i - 1][0];
        let leftBotX = l[i][0];
        let rightTopX = r[i - 1][0];
        let rightBotX = r[i][0];

        let leftX = leftTopX + (leftBotX - leftTopX) * offsetY;
        let rightX = rightTopX + (rightBotX - rightTopX) * offsetY;
        
        return leftX + offset * (rightX - leftX);
    }

    let _updateVisualObject = (o, i, name) => {
        let key = `${name}${i}`;
        visualCoordinates[key] = undefined;
        let drawDistance = 170;
        let nearClip = 10;  // Objects closer than this are past the car
        let distAhead = (o.ahead - distance + trackDistance) % trackDistance;
        if (distAhead <= nearClip || distAhead > drawDistance) {
            return;
        }
        let perspective = nearClip / distAhead;
        let y = yy(H / 2 + perspective * (H / 2));
        let x = _getObjectX(y, o.left);
        if (x) {
            visualCoordinates[key] = { x : x, y : y, size: perspective, alpha: (drawDistance - distAhead) / drawDistance }
        }
    }

    _calculateRoadAndGrassPositions();
    rainbowCoins.forEach((r, i) => _updateVisualObject(r, i, "R"));
    increaseSpeedCoins.forEach((r, i) => _updateVisualObject(r, i, "IS"));
    decreaseSpeedCoins.forEach((r, i) => _updateVisualObject(r, i, "DS"));
    increaseSteeringFactorCoins.forEach((r, i) => _updateVisualObject(r, i, "ISF"));
    decreaseSteeringFactorCoins.forEach((r, i) => _updateVisualObject(r, i, "DSF"));
    unicorns.forEach((r, i) => _updateVisualObject(r, i, "U"));
    visualCoordinates.carX = xx(W / 2 + W * car.pos / 2);
    visualCoordinates.carY = yy(0.9 * H);
}

let _checkForCollisions = () => {
    let cx = visualCoordinates.carX;
    let cy = visualCoordinates.carY;

    let _checkForCollision = (o, i, name, fn) => {
        let key = `${name}${i}`;
        if (!visualCoordinates[key] || deadObjects[key]) {
            return;
        }
        let ox = visualCoordinates[key].x;
        let oy = visualCoordinates[key].y;
        if (Math.abs(ox - cx) < ww(20) && Math.abs(oy - cy) < hh(14)) {
            deadObjects[key] = { x: ox, y: oy, dx: Math.random() * 20 - 10, dy: -20, alpha: 1, asset: o.asset };
            fn();
        }
    }

    let octave = () => Math.trunc((energy - 1) / 20) + 2;

    rainbowCoins.forEach((o, i) => _checkForCollision(o, i, "R", () => {
        playHappySound(octave());
        increaseEnergy(10);
    }, 440));
    increaseSpeedCoins.forEach((o, i) => _checkForCollision(o, i, "IS", () => {
        playNeutralSound(octave());
        increaseSpeed(1);
    }, 261.63));
    decreaseSpeedCoins.forEach((o, i) => _checkForCollision(o, i, "DS", () => {
        playNeutralSound(octave());
        decreaseSpeed(1);
    }, 392));
    increaseSteeringFactorCoins.forEach((o, i) => _checkForCollision(o, i, "ISF", () => {
        playNeutralSound(octave());
        increaseSteeringFactor(1);
    }, 659.25));
    decreaseSteeringFactorCoins.forEach((o, i) => _checkForCollision(o, i, "DSF", () => {
        playNeutralSound(octave());
        decreaseSteeringFactor(1);
    }, 493.88));
    unicorns.forEach((o, i) => _checkForCollision(o, i, "U", () => {
        playSadSound(octave());
        decreaseEnergy(10);
    }, 440));
}

let _updateDeadObjects = (et) => {
    for (let key in deadObjects) {
        let o = deadObjects[key];
        o.x += o.dx * et * 100;
        o.y += o.dy * et * 100;
        o.alpha -= et;
        if (o.alpha <= 0) {
            delete deadObjects[key];
        }
        o.dy += et * 60;
    }
};
