function* border(center, radius) {
    let x = center.x - radius;
    let y = center.y - radius;
    let dx = 1;
    let dy = 0;
    const max = (radius * 2 + 1) * 4 - 4;
    for (let i = 0; i < max; i++) {
        yield {x, y};
        if (i > 0 && i % (max / 4) == 0) {
            const tmp = dx;
            dx = -dy;
            dy = tmp;
        }
        x += dx;
        y += dy;
    }
}


function *radiate(center, maxRadius) {
    yield center;
    for (let r = 1; r < maxRadius; r++) {
        for (const pt of border(center, r)) {
            yield pt;
        }
    }
}

function computeObjectsDelta(a, b) {
    const result = [];
    for (const k in a) {
        const delta = a[k] - (b[k] || 0);
        for (let i = 0; i < delta; i++) {
            result.push(k);
        }
    }
    return result;
}

const sleep = t => new Promise(r => {
    setTimeout(r, t);
});

const $ = (tag) => document.createElement(tag);

