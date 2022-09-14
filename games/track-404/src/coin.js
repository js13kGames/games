let createCoin = (x, y, value, ticksToLive) => { 
    return { x: x, y: y, value: value, ticksToLive: ticksToLive }; 
}

let drawCoin = (coin, ctx) => {
    drawCircle(coin.x, coin.y, _coinRadius, 2, coin.value < 0 ? "white" : "black", coin.value < 0 ? "red" : "green", ctx);
    fillText(Math.abs(coin.value), coin.x, coin.y+8, "24px Arial", "center", coin.value < 0 ? "white" : "black", ctx);
}

let updateCoin = coin => {
    coin.x += gameContext.scrollX;
    coin.y += gameContext.scrollY;
    coin.ticksToLive--;
}

let coinIsAlive = coin => coin.ticksToLive > 0;

let isInsideCoin = (p, coin) => (p.x-coin.x) * (p.x-coin.x) + (p.y-coin.y) * (p.y-coin.y) < _coinRadius * _coinRadius;

let _coinRadius = 20;