let render = (w, h) => {

    let large = `${Math.trunc(w / 25)}px Arial`;
    let medium = `${Math.trunc(w / 50)}px Arial`;
    let small = `${Math.trunc(w / 75)}px Arial`;

    let text = (text, x, y, font, fillStyle = "gray", c = ctx) => {
        c.fillStyle = fillStyle;
        c.textAlign = "center";
        c.font = font;
        c.fillText(text, x, y);
    }

    delta = 0;
    _setClipRect();

    if (state === MENU) {
        let side = ww(3 * (3 + Math.sin(totalTime / 200)));
        _renderSky();
        _renderGrass([[0, 5], [4, 9], [12, 13], [24, 26]]);
        text("REDUCE SPEED NOW", xx(W / 2), yy(12), large, "white");
        text("A JS13K GAME BY JOHAN AHLGREN", xx(W / 2), yy(18), small, "white");
        text("Please don't run over the unicorns... they are both cute and fragile.", xx(0.5 * W), yy(27), small);
        ctx.drawImage(unicornAsset, xx(0.5 * W - 47) - side / 2, yy(26) - side / 2, side, side);
        ctx.drawImage(unicornAsset, xx(0.5 * W + 47) - side / 2, yy(26) - side / 2, side, side);

        text("This coin helps you keep your speed down. That is good for the unicorns.", xx(0.4 * W), yy(37), small);
        ctx.drawImage(decreaseSpeedCoinAsset, xx(0.4 * W - 49) - side / 2, yy(36) - side / 2, side, side);
        ctx.drawImage(decreaseSpeedCoinAsset, xx(0.4 * W + 49) - side / 2, yy(36) - side / 2, side, side);

        text("More speed. That is likely bad for both you and the unicorns.", xx(0.5 * W), yy(47), small);
        ctx.drawImage(increaseSpeedCoinAsset, xx(0.5 * W - 45) - side / 2, yy(46) - side / 2, side, side);
        ctx.drawImage(increaseSpeedCoinAsset, xx(0.5 * W + 45) - side / 2, yy(46) - side / 2, side, side);

        text("Improved steering helps you avoid the unicorns...", xx(0.6 * W), yy(57), small);
        ctx.drawImage(increaseSteeringFactorCoinAsset, xx(0.6 * W - 43) - side / 2, yy(56) - side / 2, side, side);
        ctx.drawImage(increaseSteeringFactorCoinAsset, xx(0.6 * W + 43) - side / 2, yy(56) - side / 2, side, side);

        text("...but this makes it harder to avoid them.", xx(0.5 * W), yy(67), small);
        ctx.drawImage(decreaseSteeringFactorCoinAsset, xx(0.5 * W - 40) - side / 2, yy(66) - side / 2, side, side);
        ctx.drawImage(decreaseSteeringFactorCoinAsset, xx(0.5 * W + 40) - side / 2, yy(66) - side / 2, side, side);

        text("And finally, at the end of the rainbow is... a pot of energy?", xx(0.4 * W), yy(77), small);
        ctx.drawImage(rainbowCoinAsset, xx(0.4 * W - 42) - side / 2, yy(76) - side / 2, side, side);
        ctx.drawImage(rainbowCoinAsset, xx(0.4 * W + 42) - side / 2, yy(76) - side / 2, side, side);

        text("PRESS SPACE TO PLAY", xx(W / 2), yy(90), medium, "white");
        return;
    } else if (state === LEVELFAILED) {
        _renderSky(level - 1);
        _renderGrass([[0, 5], [4, 9], [12, 13], [24, 26]]);
        text("LEVEL FAILED", xx(W / 2), yy(24), large, "white");
        if (levelFailedMenuItemSelected === 0) {
            text("RESTART LEVEL", xx(W / 2), yy(38), medium, "white");
            text("QUIT", xx(W / 2), yy(42), small);
        } else {
            text("RESTART LEVEL", xx(W / 2), yy(38), small);
            text("QUIT", xx(W / 2), yy(42), medium, "white");
        }
        text("USE ARROWS UP/DOWN TO SELECT OPTION. USE SPACE TO ACTIVATE", xx(W / 2), yy(80), small);
        return;
    } else if (state === WON) {
        _renderSky();
        _renderGrass([[0, 5], [4, 9], [12, 13], [24, 26]]);
        text("CONGRATULATIONS!", xx(W / 2), yy(24), large, "white");
        text("You have made it out of the dangerous unicorn school zone, and both you and the unicorns breathe a sigh of relief.", xx(W / 2), yy(34), small, "white");
        text("And the ones you hit? Oh, I am sure they are just fine.", xx(W / 2), yy(44), small, "white");
        text("THANK YOU FOR PLAYING", xx(W / 2), yy(80), small);
        wonObjects.forEach(o => {
            let dt = totalTime - o.time;
            let side = ww(10 * Math.sin(dt / 300));
            ctx.drawImage(o.asset, xx(o.x / 100 * W) - side / 2, yy(o.y / 100 * H) - side / 2, side, side);
            if (dt > 0.1 && Math.sin(dt / 300) < 0) {
                o.dead = true;
            }
        })
        return;
    } else {
        delta = onEdge ? Math.random() * 5 : 0;
        let skyAge = totalTime - skyTransitionStart;
        if (skyFrom >= 0 && skyAge < 1500) {
            _renderSky(skyFrom);
            ctx.globalAlpha = skyAge / 1500;
            _renderSky(level - 1);
            ctx.globalAlpha = 1;
        } else {
            _renderSky(level - 1);
        }
        _renderHills();
        _renderGrass(visualCoordinates.grassIntervals);
        _renderRoad();
        rainbowCoins.forEach((o, i) => _renderObject(o, 40, `R${i}`));
        increaseSpeedCoins.forEach((o, i) => _renderObject(o, 40, `IS${i}`));
        decreaseSpeedCoins.forEach((o, i) => _renderObject(o, 40, `DS${i}`));
        increaseSteeringFactorCoins.forEach((o, i) => _renderObject(o, 40, `ISF${i}`));
        decreaseSteeringFactorCoins.forEach((o, i) => _renderObject(o, 40, `DSF${i}`));   
        unicorns.forEach((o, i) => _renderObject(o, 40, `U${i}`));
        for (d in deadObjects) { _renderDeadObject(deadObjects[d]);}
        _renderCar();
        _renderInformation(text, medium);

        if (state === LEVELCLEARED) {
            let msg = "LEVEL CLEARED";
            let fontSize = Math.floor(infoFont);
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "white";
            ctx.font = `${fontSize}px Arial`;
            ctx.fillText(msg, xx(W / 2), yy(H / 2));
            ctx.strokeText(msg, xx(W / 2), yy(H / 2));
        }
    }

    _restoreClipRect();
}

let _setClipRect = () => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xx(0), yy(0));
    ctx.lineTo(xx(W), yy(0));
    ctx.lineTo(xx(W), yy(H));
    ctx.lineTo(xx(0), yy(H));
    ctx.closePath();
    ctx.clip();
};

let _restoreClipRect = () => {
    ctx.restore();
};

let _renderSky = (timeOfDay = 2) => {
    // 0=late night, 1=early morning, 2=late morning, 3=even lighter, 4=bright day
    const skies = [
        ['#050318', '#0f0a3d', '#1e1060', '#2a1458', '#18082e'], // late night
        ['#120d4a', '#2b1a7a', '#7a3f96', '#d4607a', '#f09060'], // early morning
        ['#3b2e91', '#6a4fbf', '#ff9ec4', '#ffb347', '#ffd194'], // late morning
        ['#6b5cbc', '#9980d4', '#f4aac8', '#ffc87a', '#ffe8b0'], // even lighter
        ['#b8a8e8', '#ccd8f4', '#f4cce4', '#fde8b0', '#fffaee'], // bright day
    ];
    const s = skies[timeOfDay];
    const gradient = ctx.createLinearGradient(0, 0, 0, H / 2 * _cell);
    gradient.addColorStop(0.00, s[0]);
    gradient.addColorStop(0.30, s[1]);
    gradient.addColorStop(0.55, s[2]);
    gradient.addColorStop(0.75, s[3]);
    gradient.addColorStop(1.00, s[4]);
    ctx.fillStyle = gradient;
    ctx.fillRect(_x, _y, W * _cell + delta, H / 2 * _cell + delta);
}

let _renderHills = () => {
    let gradient = ctx.createLinearGradient(0, yy(H / 2), 0, yy(H / 2 - 16));
    gradient.addColorStop(0.0, '#4f5152');
    gradient.addColorStop(0.4, '#727475');
    gradient.addColorStop(0.7, '#bec1c2');
    gradient.addColorStop(0.9, 'white');
    gradient.addColorStop(1.0, 'white');
    ctx.fillStyle = gradient;

    let startX = undefined;
    for (let x = -1; x <= W; x++) {
        let y = Math.sin(x * 0.03 + trackCurvature) * 16;
        if (startX && (y < 0 || x == W)) {
            ctx.lineTo(xx(x), yy(H / 2 - y));
            ctx.lineTo(xx(x), yy(H / 2));
            ctx.lineTo(xx(startX), yy(H / 2));
            ctx.fill();
            startX = undefined;
        } else if (y > 0) {
            if (!startX) {
                startX = x;
                ctx.beginPath();
                ctx.moveTo(xx(x), yy(H / 2));
            }
            ctx.lineTo(xx(x), yy(H / 2 - y));
        } 
    }
}

let _renderGrass = (coordinates) => {
    for (let int of coordinates) {
        let x = xx(0);
        let y = yy(H / 2 + int[0]);
        let w = ww(W);
        let h = hh(int[1]);
        let gradient = ctx.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0.0, '#d4f4c7');
        gradient.addColorStop(0.4, '#a8e6a1');
        gradient.addColorStop(0.7, '#6fcf6a');
        gradient.addColorStop(0.9, '#3b7a3a');
        gradient.addColorStop(1.0, '#d4f4c7');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
    }
}

let _renderRoad = () => {
    let polygon = visualCoordinates.lefts.concat(visualCoordinates.rights.toReversed());

    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) {
        ctx.lineTo(polygon[i][0], polygon[i][1]);
    }
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, yy(H / 2), 0, yy(H));
    gradient.addColorStop(0.0, '#f75ea6');
    gradient.addColorStop(1.0, '#63dcf7');
    ctx.fillStyle = gradient;
    ctx.fill();
}

let _renderCar = () => {
    let w = ww(28);
    let h = hh(21);
    let cx = visualCoordinates.carX;
    let cy = visualCoordinates.carY;

    ctx.save();
    ctx.translate(cx, cy);
    // Horizontal shear: top of car leans in direction of turn
    ctx.transform(1, 0, -carTilt * 0.18, 1, 0, 0);
    ctx.drawImage(carAsset, -w / 2, -h / 2, w, h);
    ctx.restore();
}

let _renderObject = (o, size, key) => {
    let vo = visualCoordinates[key];
    if (!vo || deadObjects[key]) {
        return;
    }

    ctx.globalAlpha = vo.alpha;
    let width = ww(size * vo.size);
    let height = hh(size * vo.size);
    ctx.drawImage(o.asset, vo.x - width / 2, vo.y - height / 2, width, height);
    ctx.globalAlpha = 1;
}

let _renderDeadObject = (o) => {
    ctx.globalAlpha = o.alpha;
    let width = ww(18);
    let height = hh(18);
    ctx.drawImage(o.asset, o.x - width / 2, o.y - height / 2, width, height);
    ctx.globalAlpha = 1;
}

let _renderInformation = (text, font) => {

    let getPercentColor = p => { // p = 0 - 1
        let r, g, b = 0;
        if (p < 0.5) {
            // 0% to 50%: Red stays at 255, Green ramps up
            r = 255;
            g = Math.round((p / 0.5) * 255);
        } else {
            // 50% to 100%: Green stays at 255, Red ramps down
            r = Math.round((1 - (p - 0.5) / 0.5) * 255);
            g = 255;
        }
        return `rgb(${r}, ${g}, ${b})`;
    }

    let s = x => x * _cell;

    let infoCanvas = _createCanvas(s(53), s(20), _ctx => {

        let renderGauge = (x, y, level, invertColor, caption) => {
            let cx = x * _cell + delta;
            let cy = y * _cell + delta;
            let r = 10 * _cell;

            _ctx.fillStyle = "#210413";
            _ctx.beginPath();
            _ctx.arc(s(x), s(y), s(10), 0, 2 * Math.PI);
            _ctx.fill();

            level = Math.min(Math.max(level, 0), 1); // Clamp level between 0 and 1
            let angle = 0.75 + level * 1.5;
            _ctx.fillStyle = getPercentColor(invertColor ? 1 - level : level);
            _ctx.beginPath();
            _ctx.arc(s(x), s(y), s(10), 0.75 * Math.PI, angle * Math.PI);
            _ctx.lineTo(s(x), s(y));
            _ctx.fill();

            _ctx.fillStyle = "#0d0107";
            _ctx.beginPath();
            _ctx.arc(s(x), s(y), s(7), 0, 2 * Math.PI);
            _ctx.fill();

            _ctx.fillStyle = "white";
            _ctx.beginPath();
            _ctx.arc(s(x) - s(5), s(y) + s(5), s(0.5), 0, 2 * Math.PI);
            _ctx.fill();
            _ctx.beginPath();
            _ctx.arc(s(x), s(y) - s(7), s(0.5), 0, 2 * Math.PI);
            _ctx.fill();
            _ctx.beginPath();
            _ctx.arc(s(x) + s(5), s(y) + s(5), s(0.5), 0, 2 * Math.PI);
            _ctx.fill();

            text(caption, s(x), s(y+1), font, "white", _ctx);
        }
        renderGauge(10, 10, speed / 3, true, "SPEED");
        renderGauge(42, 10, distance / trackDistance, false, "DIST");

        _ctx.fillStyle = getPercentColor(energy / 100);
        _ctx.strokeStyle = "black";
        _ctx.lineWidth = 2;
        let h = energy * 15 / 100;
        _ctx.fillRect(s(22), s(15-h), s(8), s(h));
        _ctx.strokeRect(s(22), 0, s(8), s(15));

        text(`${level} / 5`, s(26), s(19), font, "white", _ctx);
    });

    ctx.globalAlpha = 0.5;
    ctx.drawImage(infoCanvas, xx(W / 2 - 30), yy(10));
    ctx.globalAlpha = 1;
}

let xx = x => _x + x * _cell + delta;
let yy = y => _y + y * _cell + delta;
let ww = w => w * _cell;
let hh = h => h * _cell;

let _w, _h, _x, _y, _cell;
