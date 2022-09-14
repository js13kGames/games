var maxSpeed = 10;
var acceleration = 0.3;
var friction = 0.99;
var turnMax = 10;
var speed = 0;
var turn = 0;
var hero;
var stripes;
var street;
var cars;
var inst;
var kms;
var boom;
var carPass;
var carsPassed = 0;
var carsArr = [];
var wHeight = 0;
var sHeight = 0;
var totalKms = 0;
var offset = 0;
var firstPlay = false;
var botInLine = false;
var keypress = {
    up: false,
    right: false,
    left: false,
    down: false
};
var glitchOn = false;
var glitch;
var glitchCounter = 0;

function onLoad() {

    street = document.getElementById("street");
    stripes = document.getElementById("stripes");
    hero = document.getElementById("hero");
    cars = document.getElementById("cars");
    inst = document.getElementById("inst");
    kms = document.getElementById("totalKmsTxt");
    carPass = document.getElementById("carsPassedTxt");
    glitch = document.getElementById("glitchTxt");

    playBtn = document.getElementById('play');
    playBtn.addEventListener("click", startGame, false);

    wHeight = window.innerHeight
    sHeight = Math.floor((wHeight * 100) / 700);

    var bs = '';
    for (var i = 1; i < 14; i++) {
        if (i % 2 == 0)
            bs += '0 -' + (i * sHeight) + 'px 0 #d4d4d4,';
    }

    bs = bs.substring(0, bs.length - 1);
    stripes.style.height = sHeight + 'px';
    stripes.style.boxShadow = bs;
    street.pseudoStyle("after", "margin-top", -sHeight + 'px');
    stripes.style.top = wHeight - sHeight + 'px';

    hero.style.marginTop = wHeight + sHeight + 'px';
    hero.style.marginLeft = '100px';

    offset = stripes.offsetTop;

    cars.style.marginLeft = street.offsetLeft + 'px';
    inst.style.marginTop = -wHeight + sHeight + 'px';

    inst.style.display = 'block';
    cars.style.display = 'none';
    glitch.style.display = 'none';
    stripes.style.opacity = 0;
}

function startGame() {

    cars.style.display = 'block';
    inst.style.display = 'none';

    stripes.style.opacity = 1;

    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);

    if (!firstPlay) {
        loop();
        firstPlay = true;
    }
}

function keyUp(e) {
    move(e, false);
}

function keyDown(e) {
    move(e, true);
}

function move(e, isKeyDown) {

    if (e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
    }

    if (e.keyCode === 37) {
        keypress.left = isKeyDown;
    }

    if (e.keyCode === 38) {
        keypress.up = isKeyDown;
    }

    if (e.keyCode === 39) {
        keypress.right = isKeyDown;
    }

}

function loop() {

    setTimeout(function() {
        calcMovement();
        requestAnimationFrame(loop);
    }, 100 / 30);

}

function calcMovement() {

    if (keypress.up) {

        if (speed < maxSpeed)
            speed += acceleration;
    }

    if (keypress.left) {
        if (turn < turnMax) {
            turn -= 1;
        }
    } else if (keypress.right) {
        if (turn > -turnMax) {
            turn += 1;
        }
    }

    speed *= friction;

    if (speed < 0.1 && speed > -0.1) {
        speed = 0;
    }

    if (speed != 0) {

        if (turn != 0) {
            if (!glitchOn)
                turn *= 0.5;
            else
                turn *= -0.5;
        }

        var x = parseInt(hero.style.marginLeft.substring(0, hero.style.marginLeft.length - 2)) + Math.floor((speed * turn));

        if (x > 10 & x < 530)
            hero.style.marginLeft = x + "px";

        var y = Math.floor(stripes.offsetTop + Math.floor(speed));
        stripes.style.top = y + "px";

        if (stripes.offsetTop >= (sHeight * 14))
            stripes.style.top = wHeight - sHeight + 'px';

        if (keypress.up) {
            totalKms += (stripes.offsetTop) / 50000;
            totalKms = Math.round(totalKms * 100) / 100;

            kms.innerHTML = "Distance (km) : " + totalKms;
            carPass.innerHTML = "Cars Overtaken : " + carsPassed;
        }


        if (totalKms % 0.5 == 0 && parseInt(speed) >= 10)
            addBotCars();

        if (totalKms % 10 == 0 && parseInt(totalKms) > 9) {
            if (glitchOn == false) {
                glitchOn = true;
                glitch.style.display = 'block';
            } else {
                glitchOn = false;
                glitch.style.display = 'none';
            }
        }

        //Move Bot Cars
        for (var i = 0; i < carsArr.length; i++) {
            var c = carsArr[i];
            var cy = Math.floor(c.offsetTop + Math.floor(speed));
            c.style.top = cy + 'px';

            if (c.offsetTop >= (sHeight * 14)) {
                cars.removeChild(c);
                carsPassed++;
            }

            //CheckCrash
            if (hero.offsetLeft < c.offsetLeft + 100 &&
                hero.offsetLeft + 100 > c.offsetLeft &&
                hero.offsetTop < c.offsetTop + 170 &&
                170 + hero.offsetTop > c.offsetTop) {

                boom = document.createElement("DIV");
                hero.appendChild(boom);
                boom.className = 'blast';

                resetGame();
            }

        }
    }
}

function addBotCars() {

    var cars = document.getElementById("cars");

    var botCar = document.createElement("DIV");
    cars.appendChild(botCar);
    botCar.className = 'car';

    var botCarF = document.createElement("DIV");
    var botCarW = document.createElement("DIV");
    var botCarB = document.createElement("DIV");
    botCar.appendChild(botCarF);
    botCar.appendChild(botCarW);
    botCar.appendChild(botCarB);
    botCarF.className = 'carFront';
    botCarW.className = 'carWindow';
    botCarB.className = 'carBack';

    botCar.style.marginTop = '0px';
    if (botInLine == false) {
        botInLine = true;
        botCar.style.marginLeft = hero.offsetLeft + 'px';
    } else {
        botInLine = false;
        botCar.style.marginLeft = ((Math.random() * 320) + 1) + 'px';
    }
    botCar.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    carsArr.push(botCar);
}

function resetGame() {
    speed = 0;
    turn = 0;
    wHeight = 0;
    sHeight = 0;
    totalKms = 0;
    offset = 0;
    carsPassed = 0;
    glitchCounter = 0;
    glitchOn = false;
    keypress = {
        up: false,
        right: false,
        left: false,
        down: false
    };
    botInLine = false;

    carPass.innerHTML = "";
    kms.innerHTML = "";
    glitch.style.display = 'none';

    window.removeEventListener("keydown", keyDown, false);
    window.removeEventListener("keyup", keyUp, false);

    setTimeout(function() {

        while (cars.children.length > 1) {
            cars.removeChild(cars.lastChild);
        }
        hero.removeChild(boom);

        carsArr = [];

        wHeight = window.innerHeight
        sHeight = Math.floor((wHeight * 100) / 700);

        inst.style.display = 'block';
        cars.style.display = 'none';

        stripes.style.opacity = 0;

    }, 1000);

}

function onResize() {
    cars.style.marginLeft = street.offsetLeft + 'px';
}

(function() {
    a = {
        _b: 0,
        c: function() {
            this._b++;
            return this.b;
        }
    };
    HTMLElement.prototype.pseudoStyle = function(d, e, f) {
        var g = "pseudoStyles";
        var h = document.head || document.getElementsByTagName('head')[0];
        var i = document.getElementById(g) || document.createElement('style');
        i.id = g;
        var j = "pseudoStyle" + a.c();
        this.className += " " + j;
        i.innerHTML += " ." + j + ":" + d + "{" + e + ":" + f + "}";
        h.appendChild(i);
        return this;
    };
})();