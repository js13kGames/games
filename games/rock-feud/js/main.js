var gmStart = false; // games start
var hasWnr = false; // games stop
var curPl = 1; // current player

// scores
var pl1Sr = 0;
var pl2Sr = 0;

// triggerKeys
var pl1Ky = 'a';
var pl2Ky = 'l';
var triggerKy  = pl1Ky; // default
var hasHit = false;
var hasFired = false;

// walls
var maxW = 20;
var w1 = [];
var w2 = [];
for (var i = 1; i <= maxW; i++) {
    w1[i] = {x:0, y:0, c:0};
    w2[i] = {x:0, y:0, c:0};
}
var wlX = 145;
var wlY = 100;

// targetSignCoord
var tgX, tgY = 0;
var tgClr = '#FF10F0';
var tgXLmt, tgYLmt = 0;
var stpX = 0;
var stpY = 138; 
var enpX, enpY = 0;

// ballCoords
var blX, blY = 0;
var blXm = 2;
var blYm = -2;
var blSize = 5;

//canvas init
const dCanvas = document.getElementById('dCanvas');
const ctx = dCanvas.getContext('2d');
            
// key events
document.addEventListener('keyup', somethingUp, false);
document.addEventListener('keydown', somethingUp, false);

function somethingUp(e) {
    var dkey = e.key.toLowerCase();
    // start game
    if (gmStart == false && dkey == 'y') {
        dCanvas.style.background = '#ccc';
        document.getElementById('ruleBox').style.display = 'block';
        gmStart = true;
        setInterval(playOn, 10);
        
        // initial
        tgX = 90;
        tgY = 145;
        tgClr = '#FF10F0';
        curPl = 1;
        stpX = 70;
        triggerKy = pl1Ky;
        tgXLmt = tgX;
        tgYLmt = tgY;
        hasHit = true;
    }

    // fireKeys
    if (gmStart == true && hasWnr == false && dkey == triggerKy.toLowerCase()) {
        attack();
    }

    // directionKeys
    if (gmStart == true && hasWnr == false && (dkey == 'arrowup' || dkey == 'arrowdown'
    || dkey == 'arrowleft' || dkey == 'arrowright')) {
        // move arrow
        calculateTarget(dkey);
    }
}

// start
function playOn() {
    ctx.clearRect(0, 0, dCanvas.width, dCanvas.height);

    // score boards
    ctx.beginPath();
    ctx.font = '36px arial';
    ctx.fillStyle = '#FF10F0';
    ctx.fill();
    ctx.fillText(pl1Sr, 5, 30);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '36px arial';
    ctx.fillStyle = '#1F51FF';
    ctx.fill();
    ctx.fillText(pl2Sr, 250, 30);
    ctx.closePath();
    
    // draw wall 
    ctx.beginPath();
    ctx.rect(wlX, wlY, 5, 50);
    ctx.fillStyle = '#a5700d';
    ctx.fill();
    ctx.closePath();

    // draw house left & right
    drawHouses(w1, w2);

    // draw weapon left
    ctx.beginPath();
    ctx.rect(62, 128, 10, 20);
    ctx.fillStyle = '#FF10F0';
    ctx.fill();
    ctx.closePath();
    
    // draw weapon right
    ctx.beginPath();
    ctx.rect(227, 128, 10, 20);
    ctx.fillStyle = '#1F51FF';
    ctx.fill();
    ctx.closePath();    

    if (hasHit == true) {
        // target +
        ctx.beginPath();
        ctx.font = '24px arial';
        ctx.fillStyle = tgClr;
        ctx.fill();
        ctx.fillText('+', tgX, tgY);
        ctx.closePath();

        // target line
        ctx.beginPath();
        ctx.moveTo(stpX, stpY);
        enpX = (curPl == 1) ? tgX+5 : tgX+5;
        enpY = tgY - 5;
        ctx.lineTo(enpX, enpY);
        ctx.stroke();
        ctx.closePath();

        // ball starting point
        blX = enpX;
        blY = enpY;
    }
    
    if (hasFired == true) {
        ctx.beginPath();
        ctx.fillStyle = '#7B3F00';
        ctx.arc(blX, blY, blSize, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        if (blX > dCanvas.width - blSize || blX < blSize) {
            blXm = -blXm;
        }
        if (blY > dCanvas.height - blSize || blY < blSize) {
            blYm = -blYm;
        }

        blX += blXm;
        blY += blYm;

        // check hit
        checkHits();
    }
}


function attack() {
    // release rock
    hasHit = false;
    hasFired = true;
    if (curPl == 1) {
        tgX = 90;
        tgY = 145;
        tgClr = '#FF10F0';
        curPl = 2;
        stpX = 70;
        triggerKy = pl1Ky;
    } else {
        tgX = 200;
        tgY = 145;
        tgClr = '#1F51FF';
        curPl = 1;
        stpX = 230;
        triggerKy = pl2Ky;
    }
    tgXLmt = tgX;
    tgYLmt = tgY;
}

function drawHouses(w1, w2) {
    // left
    var lx = 2;
    var ly = 102;
    var wp = 12;
    var wpl = 5;
    var sc1 = 0;
    var sc2 = 0;
    var brickSz = 10;

    for (var i = 1; i <= maxW; i++) {
        // check hit
        var curB = w1[i];
        w1[i].x = lx;
        w1[i].y = ly;
        if (curB.c == 0) {
            ctx.beginPath();
            ctx.rect(lx, ly, brickSz, brickSz);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
            ctx.closePath();
            sc1++;
        }
        if (i % wpl == 0) {
            ly = ly + wp;
            lx = lx - (wpl * wp);
        }
        lx = lx + wp;
    }
    pl1Sr = sc1;

    // right
    lx = 239;
    ly = 102;
    for (var i = 1; i <= maxW; i++) {
        // check hit
        var curB = w2[i];
        w2[i].x = lx;
        w2[i].y = ly;
        if (curB.c == 0) {
            ctx.beginPath();
            ctx.rect(lx, ly, brickSz, brickSz);
            ctx.fillStyle = '#0000FF';
            ctx.fill();
            ctx.closePath();
            sc2++;
        }
        if (i % wpl == 0) {
            ly = ly + wp;
            lx = lx - (wpl * wp);
        }
        lx = lx + wp;
    }
    pl2Sr = sc2;

    if (pl1Sr == 0 || pl2Sr == 0) {
        // game over
        hasWnr = true;
        setInterval(function() {
            if (document.getElementById('endScreen').style.display != 'block') {
            var addTxt = (pl1Sr == 0)? 'RED ARMY WINS!' : 'BLUE ARMY WINS!';
            addTxt = addTxt + document.getElementById('endScreen').getElementsByTagName('h2')[0].innerHTML;
            document.getElementById('endScreen').getElementsByTagName('h2')[0].innerHTML = addTxt;
            document.getElementById('endScreen').style.display = 'block';
            }
        }, 4000);
        window.location.reload();
    }
}


function calculateTarget(dkey) {
    var minX = tgXLmt - 10;
    var maxX = tgXLmt + 10;
    var minY = tgYLmt - 20;
    var maxY = tgYLmt + 20;

    if (dkey == 'arrowup' && tgY  > minY) {
        tgY = tgY - 1;
    } else if (dkey == 'arrowdown' && tgY < maxY) {
        tgY = tgY + 1;
    } else if (dkey == 'arrowleft' && tgX > minX) {
        tgX = tgX - 1;
    } else if (dkey == 'arrowright' && tgX < maxX) {
        tgX = tgX + 1;
    }
}


function checkHits() {

    var hitWall = false;
    // check if ball hits wall
    if (blX > wlX - blSize && blX < wlX + blSize &&
        blY > wlY - blSize && blY < wlY + 75 + blSize) {
        hasHit = true;
        hasFired = false;
        hitWall = true;
    }

    if (hitWall == false) {
        var walls = [w1, w2];
        for (var vx = 0; vx < walls.length; vx++) {
            var wall = walls[vx];
            for (var ix=1; ix < wall.length; ix++) {
                // not damaged
                if (wall[ix].c == 0) {
                    // check if ball is within coordinates
                    if (blX > wall[ix].x - blSize && blX < wall[ix].x + blSize &&
                        blY > wall[ix].y - blSize && blY < wall[ix].y + blSize) {
                            hasHit = true;
                            hasFired = false;
                            wall[ix].c = 1;
                    }
                }
            }
        }
    }
}