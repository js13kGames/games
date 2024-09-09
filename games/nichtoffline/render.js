function render() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    renderFloor();
    renderClouds();
    renderDinos();
}

function renderDinos() {
    let distance = me.distance / 10;
    let floor = 5;
    let sxmodes = [
        848, 936, 980
    ];
    let sx = 848, sy = 2, w = 43, h = 46;
    if (me.mode === 1) {
        sx = sxmodes[1];
    }
    else if (me.mode === 2) {
        sx = sxmodes[2];
    }
    ctx.fillStyle = me.color;
    if (me.north) {
        ctx.scale(-1, 1);
        ctx.drawImage(asset, sx, sy, w, h, (c.width / 2 - me.width / 2) * -1 - me.width, c.height - me.height - me.y / 2 - floor, me.width, me.height);
        ctx.fillRect((c.width / 2 - me.width / 4 + 7.5) * -1, c.height - me.height - (me.y / 2 * 1.2) - distance - floor, 12, distance);
        ctx.fillRect((c.width / 2 - me.width / 4 + 12.5) * -1, c.height - me.height - (me.y / 2 * 1.2) - floor - 4, 22, 5);
    }
    else {
        ctx.drawImage(asset, sx, sy, w, h, c.width / 2 - me.width / 2, c.height - me.height - me.y / 2 - floor, me.width, me.height);
        ctx.fillRect(c.width / 2 - me.width / 4 + 15, c.height - me.height - (me.y / 2 * 1.2) - distance - floor, 12, distance);
        ctx.fillRect(c.width / 2 - me.width / 4 + 10, c.height - me.height - (me.y / 2 * 1.2) - floor - 4, 22, 5);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (Date.now() - me.messageTime <= 10000) {
        ctx.fillStyle = dclr;
        ctx.font = "15px Arial";
        ctx.fillText(me.message,  c.width / 2, c.height - me.height - (me.y / 2 * 1.2) - distance - 15);
    }

    for (let i = 0; i < dinos.length; i++) {
        let dino = dinos[i];
        sx = 848; sy = 2;
        if (dino.mode === 1) {
            sx = sxmodes[1];
        }
        else if (dino.mode === 2) {
            sx = sxmodes[2];
        }
        ctx.fillStyle = dino.color;
        distance = dino.distance / 10;
        if (dino.north) {
            ctx.scale(-1, 1);
            ctx.drawImage(asset, sx, sy, w, h, (me.x - dino.x + (c.width / 2 - dino.width / 2)) * -1 - dino.width, c.height - dino.height - dino.y / 2 - floor, dino.width, dino.height);
            ctx.fillRect((me.x - dino.x + (c.width / 2 - dino.width / 4) + 7.5) * -1, c.height - dino.height - (dino.y / 2 * 1.2) - distance - floor, 12, distance);
            ctx.fillRect((me.x - dino.x + (c.width / 2 - dino.width / 4) + 12.5) * -1, c.height - dino.height - (dino.y / 2 * 1.2) - floor - 4, 22, 5);
        }
        else {
            ctx.drawImage(asset, sx, sy, w, h, me.x - dino.x + (c.width / 2 - dino.width / 2), c.height - dino.height - dino.y / 2 - floor, dino.width, dino.height);
            ctx.fillRect(me.x - dino.x + (c.width / 2 - dino.width / 4) + 15, c.height - dino.height - (dino.y / 2 * 1.2) - distance - floor, 12, distance);
            ctx.fillRect(me.x - dino.x + (c.width / 2 - dino.width / 4) + 10, c.height - dino.height - (dino.y / 2 * 1.2) - floor - 4, 22, 5);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = dclr;
        ctx.font = "20px Arial";
        ctx.fillText(dino.name,  me.x - dino.x + (c.width / 2 - dino.width / 4), c.height - dino.height - (dino.y / 2 * 1.2) - distance - 30);
        if (Date.now() - dino.messageTime <= 10000) {
            ctx.font = "15px Arial";
            ctx.fillText(dino.message,  me.x - dino.x + (c.width / 2 - dino.width / 4), c.height - dino.height - (dino.y / 2 * 1.2) - distance - 15);
        }
    }
}

function renderFloor() {
    let sx = 2, sy = 54, w = 1200, h = asset.height - sy;
    ctx.drawImage(asset, sx, sy, w, h, me.x + c.width / 2 - w, c.height - h, w, h);
    ctx.drawImage(asset, sx, sy, w, h, me.x + c.width / 2, c.height - h, w, h);
}

function renderClouds() {

}