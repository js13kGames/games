var points = 0,
    pointsPerClick = 1,
    production = 0,
    pointsDisplay = document.getElementById('points'),
    ppsDisplay = document.getElementById('pps'),
    emojisContainer = document.getElementById('emojis'),
    shopContainer = document.getElementById('shop'),
    particlesContainer = document.getElementById('particles'),
    buildings = [
        { name: 'Loupe', cost: 10, additionalPPC: 1, owned: 0, emoji: '\uD83D\uDD0D' },
        { name: 'Rabbit', cost: 500, production: 8, owned: 0, emoji: '\uD83D\uDC07' },
        { name: 'Dog', cost: 2e3, production: 48, owned: 0, emoji: '\uD83D\uDC3A' },
        { name: 'Compass', cost: 1e4, production: 301, owned: 0, emoji: '\u2196\uFE0F' },
        { name: 'Map', cost: 160942, production: 1337, owned: 0, emoji: '\uD83D\uDDFA\uFE0F' },
        { name: 'GPS', cost: 9999999, production: 9999, owned: 0, emoji: '\uD83D\uDEF0\uFE0F' }
    ];

if (localStorage.save) {
    var save = JSON.parse(localStorage.save);
    points = save.points,
        pointsPerClick = save.pointsPerClick,
        production = save.production,
        buildings = save.buildings,
        emojisContainer.innerHTML = '',
        ppsDisplay.innerHTML = `${production} Footsteps per Second`,
        pointsDisplay.innerHTML = `${Math.floor(points)} Footsteps`;
    for (var a of buildings)
        for (var b = 0; b < a.owned; b++)
            emojisContainer.innerHTML += a.emoji
}

var addPoints = function () {
    var a = Math.round;
    points += pointsPerClick,
        pointsDisplay.innerHTML = `${Math.floor(points)} Footsteps`;
    var b = document.createElement('div');
    b.innerHTML = `+${pointsPerClick}`,
        b.className = 'particle',
        b.style.position = 'absolute',
        b.style.left = `${a(10 + 20 * Math.random())}vw`,
        b.style.top = `${a(10 + 20 * Math.random())}vw`,
        particlesContainer.appendChild(b),
        b.addEventListener('webkitAnimationEnd', (a) => { particlesContainer.removeChild(a.srcElement) }, !1)
};

var buy = function (a) {
    var b = Math.floor;
    var c = buildings[a];
    if (c.cost <= points) {
        points -= c.cost,
            c.production ? (production += c.production, ppsDisplay.innerHTML = `${production} Footsteps per Second`) : pointsPerClick += c.additionalPPC;
        c.owned++;
        c.cost = b(1.1 * c.cost);
        c.div.children[0].children[0].innerHTML = c.owned;
        c.div.children[0].children[1].innerHTML = c.cost;
        pointsDisplay.innerHTML = `${b(points)} Footsteps`, emojisContainer.innerHTML = '';
        var a = buildings[0].owned;
        d = 10 <= a;
        for (let b of buildings) {
            d && b.owned != a && (d = !1);
            for (let a = 0; a < b.owned; a++) emojisContainer.innerHTML += b.emoji
        } d && alert('You\'ve won! Congratultions!')
    }
}

var loop = function () {
    0 < production && (points += production / 30, pointsDisplay.innerHTML = `${Math.floor(points)} Footsteps`), setTimeout(loop, 1e3 / 30)
};

window.onload = function () {
    for (let a of buildings) {
        let b = document.createElement('div');
        b.innerHTML = `<div class="buyable" onclick="buy(${buildings.indexOf(a)});"> ${a.name} <div class="owned">${a.owned}</div> <div class="cost">${a.cost}</div> </div>`;
        a.div = b;
        shopContainer.appendChild(b);
    }
    loop();
}; 

var saveGame = function() { 
    localStorage.save = JSON.stringify({ points, pointsPerClick, production, buildings });
}; 

setInterval(saveGame, 5e3), window.onbeforeunload = saveGame;