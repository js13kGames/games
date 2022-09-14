const GameState = {
    IDLE: 1,
    PLAYING: 2,
    PAUSED: 3,
    PAUSED_FOR_RESIZE: 4,
    CONTINUING: 5,
    WELLDONE: 6,
    PRESENTLEVEL: 7,
    GAMEOVER: 8
}

const HIGHSCORESTRING = "johan.ahlgren.404.highscore";

var gameContext = {
    x: 0,
    y: 0,
    scrollX : 0, 
    scrollY : 0,
    gameState: GameState.IDLE,
    tick: 0,
    score: 0,
    value: 0, 
    startTime: 0,
    linksFound: 0,
    bestTime: null,

    reset() {
        this.x = 0;
        this.y = 0;
        this.tick = 0;
        this.score = 0;
        this.linksFound = 0;
        this.startTime = Date.now();
        this.roads = [];
        this.coins = [];
        this.environment = [];
        this.energy = 500;
        this.speedFactor = 1;
        this.level = 1;
        this.course = 0;
        this.getHighScore();
        this.highScoreSet = false;
    },

    resetcourse() {
        this.x = 0;
        this.y = 0;
        this.tick = 0;
        this.energy = 500;
        this.value = 0;
        this.coins = [];
        var {x, y, dir } = buildCourse(this.course);
        this.car = createCar(x, y, dir);
        resetInput();
    },

    update(dt) {
        if (this.gameState == GameState.PLAYING) {
            if (pause()) {
                this.setGameState(GameState.PAUSED);
                return;
            }
            this.tick++;
            this.coins.filter(c => !coinIsAlive(c)).forEach(c => c.road.hasCoin = false);
            this.coins = this.coins.filter(c => coinIsAlive(c));
            this.roads.forEach(r => updateRoad(r));
            this.environment.forEach(e => updateEnvironment(e));
            this.coins.forEach(c => updateCoin(c));
            updateCar(this.car, turnLeft(), turnRight(), fastForward(), dt);
            if (this.carHitsEnvironment()) {
                this.removeEnergy(this.energy);
            }
            var coveredRoad = this.coveredRoad();
            if (coveredRoad == -1) {
                this.removeEnergy(2);
            }
            addCoin(coveredRoad);
            var coinHit = this.coins.find(c => this.carInsideCoin(c));
            if (coinHit) {
                this.value += coinHit.value;
                if (this.valueNeeded() == 0) {
                    this.linksFound++;
                    this.score += this.energy;
                    this.setGameState(GameState.WELLDONE);
                }
                removeCoin(coinHit);
                this.addEnergy(10);
            }
            if (this.tick % 20 == 0) {
                this.removeEnergy(1);
            }
        }
    },

    render() {
        if (this.gameState == GameState.PLAYING) {
            this.environment.forEach(e => drawEnvironment(e, context));
            this.roads.forEach(r => drawRoad(r, context));
            this.coins.forEach(c => drawCoin(c, context));
            drawCar(this.car, context);
        }
    },

    addEnergy(value) {
        this.energy += value;
        if (this.energy > 500) {
            this.energy = 500;
        }
    },

    removeEnergy(value) {
        if (!CHEAT) {
            if (this.energy > 0) {
                this.energy -= value;
                if (this.energy <= 0) {
                    this.highScoreSet = this.setHighScore(this.score);
                    this.setGameState(GameState.GAMEOVER);
                }
            }
        }
    },

    setGameState(newState) {
        switch(newState) {
            case GameState.PLAYING:
                this.resetcourse();
                this.gameState = GameState.PLAYING;
                break;
            case GameState.CONTINUING:
                this.gameState = GameState.PLAYING;
                break;
            case GameState.GAMEOVER:
                this.gameState = GameState.GAMEOVER;
                setTimeout(() => this.setGameState(GameState.IDLE), 3000);
                break;
            case GameState.WELLDONE:
                this.gameState = GameState.WELLDONE;
                this.energy = 500;
                this.course++;
                if (this.course == _courses.length) {
                    this.course = 0;
                    this.speedFactor *= 1.5;
                    this.level++;
                }
                setTimeout(() => this.setGameState(GameState.PRESENTLEVEL), 3000);
                break;
            case GameState.PRESENTLEVEL:
                this.gameState = GameState.PRESENTLEVEL;
                setTimeout(() => this.setGameState(GameState.PLAYING), 3000);
                break;
            case GameState.IDLE:
                this.gameState = GameState.IDLE;
                this.reset();
                break;
            default:
                this.gameState = newState;
        }
    },

    coveredRoad() {
        flInside = false;
        frInside = false;
        rrInside = false;
        rlInside = false;
        for (var i=0; i < this.roads.length; i++) {
            var r = this.roads[i];
            flInside = flInside || isInsideRoad(this.car.frontLeft, r); 
            frInside = frInside || isInsideRoad(this.car.frontRight, r); 
            rrInside = rrInside || isInsideRoad(this.car.rearRight, r); 
            rlInside = rlInside || isInsideRoad(this.car.rearLeft, r);
            if (flInside && frInside && rrInside && rlInside) {
                return i;
            } 
        }
        return -1;
    },

    carInsideCoin(coin) {
        return isInsideCoin(this.car.frontLeft, coin) || 
            isInsideCoin(this.car.frontRight, coin) || 
            isInsideCoin(this.car.rearRight, coin) || 
            isInsideCoin(this.car.rearLeft, coin);
    },

    valueNeeded() {
        return 404 - this.value;
    },

    carInsideRect(r) {
        return this.pointInsideRect(this.car.frontLeft, r) || 
            this.pointInsideRect(this.car.frontRight, r) || 
            this.pointInsideRect(this.car.rearRight, r) || 
            this.pointInsideRect(this.car.rearLeft, r);
    },

    pointInsideRect(p, r) {
        return !(p.x < r.x || p.x > r.x + r.w || p.y < r.y || p.y > r.y + r.h);
    },

    carHitsEnvironment() {
        for (var i = 0; i < this.environment.length; i++) {
            var r = getEnvironmentRectangle(this.environment[i]);
            if (r && this.carInsideRect(r)) {
                return true;
            }
        }
        return false;
    },

    getHighScore() {
        this.highScore = parseInt(localStorage.getItem(HIGHSCORESTRING)) || 0;
    },

    setHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem(HIGHSCORESTRING, this.score);
            return true;
        }
        return false;
    },
}
