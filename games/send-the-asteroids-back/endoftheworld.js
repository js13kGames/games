let {
    init,
    initKeys,
    imageAssets,
    keyPressed,
    load,
    getStoreItem,
    setStoreItem,
    GameLoop,
    Pool,
    Sprite,
    SpriteSheet
} = kontra;

let gameSetting = {
    level: 1,
    asteroids: 0,
    playerAcc: 0.1,
    maxPlasma: 150,
    plasmaBurnRate: 10,
    plasmaRefillRate: 1,
    playerFireRate: 0.1,
    plasmaTtl: 140,
    canvasHeight: 800,
    canvasWidth: 800
}

init();
initKeys();

let playerSprite

let asteroidArray = []
let asteroidTrail = []
let plasmaArray = []
let spriteArray = []
let bgStars = Pool({
    create: Sprite
})

function ArcadeAudio() {
    this.sounds = {};
    function add( key, count, settings ) {
        this.sounds[ key ] = [];
        settings.forEach( function( elem, index ) {
            this.sounds[ key ].push( {
            tick: 0,
            count: count,
            pool: []
            } );
            for( var i = 0; i < count; i++ ) {
            var audio = new Audio();
            audio.src = jsfxr( elem );
            this.sounds[ key ][ index ].pool.push( audio );
            }
        }, this );
    };
}

function collide(asteroid, plasma) {
    let dx = asteroid.x - plasma.x;
    let dy = asteroid.y - plasma.y;
    if (Math.sqrt(dx * dx + dy * dy) < asteroid.radius + plasma.radius) {
        ZZFX.z(99533, {volume:.4});
        ZZFX.z(99540, {volume:.4});
        plasma.alive = false
        if (asteroid.x > plasma.x && asteroid.dx < 0) {
            if (asteroid.dx < 0) asteroid.dx *= -1.1
        } else {
            if (asteroid.dx > 0) asteroid.dx *= -1.1
        }
        if (asteroid.y > plasma.y) {
            if (asteroid.dy < 0) asteroid.dy *= -1.1
        } else {
            if (asteroid.dy > 0) asteroid.dy *= -1.1
        }
        asteroid.hit = true
    }
}

function createAsteroid() {
    let size = random(40) + 20
    let asteroid = Sprite({
        type: 'asteroid',
        alive: true,
        hit: false,
        x: random(gameSetting.canvasWidth),
        y: random(-30),
        anchor: {x: 0.5, y: 0.5},
        dx: (Math.random() * 3) - 1.5,
        dy: Math.random(),
        ddy: 0.008,
        radius: size / 2,
        height: size,
        width: size,
        rotation: Math.random() * (Math.PI * 2),
        rotationSpeed: Math.random() - 0.5,
        image: imageAssets['img/asteroid01'],
        update() {
            this.rotation += this.rotationSpeed
            this.advance()
            if ((this.x + this.radius < 0) || (this.x - this.radius > gameSetting.canvasWidth) || (this.y < -30)) {
                this.alive = false
                if (this.hit) {
                    gameSetting.asteroids -= 1
                } else {
                    setTimeout(() => createAsteroid(), Math.random() * 5000)
                }
            }
            if (this.y + this.radius > gameSetting.canvasHeight) {
                playerSprite.alive = false
            }
        }
    })
    asteroidArray.push(asteroid)
}

function createAsteroids(number, delay) {
    gameSetting.asteroids = number
    for (let i = 0; i < number; i++) {
        setTimeout(() => createAsteroid(), Math.random() * delay)
    }
}

function createBg() {
    for (let i = 0; i < 100; i++) {
        let size = random(2) + 1
        bgStars.get({
            x: random(gameSetting.canvasWidth),
            y: random(gameSetting.canvasHeight),
            color: `rgba(255, 255, 255, ${Math.random()})`,
            width: size,
            height: size
        })
    }
}

function createHud() {
    let plasmaBar = Sprite({
        x: 80,
        y: 785,
        color: 'green',
        width: 120,
        height: 10,
        update() {
            this.width = playerSprite.plasma
            if (this.width < 50) this.color = 'red'
            if (this.width > 50 && this.width < 100) this.color = 'yellow'
            if (this.width > 100) this.color = 'green'
        }
    })
    spriteArray.push(plasmaBar)

    let plasmaTxt = Sprite({
        x: 10,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Monospace'
            this.context.textAlign = 'left'
            this.context.textBaseline = 'middle'
            this.context.fillText(`plasma: `, this.x, this.y)
        }

    })
    spriteArray.push(plasmaTxt)

    let currentLevel = Sprite({
        x: gameSetting.canvasWidth - 450,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Monospace'
            this.context.textAlign = 'left'
            this.context.textBaseline = 'middle'
            this.context.fillText(`level: ${gameSetting.level}`, this.x, this.y)
        }

    })
    spriteArray.push(currentLevel)

    let asteroidsRemaining = Sprite({
        x: gameSetting.canvasWidth - 250,
        y: gameSetting.canvasHeight - 10,
        color: 'white',
        width: this.plasma,
        render() {
            this.context.fillStyle = this.color;
            this.context.font = '15px Monospace'
            this.context.textAlign = 'left'
            this.context.textBaseline = 'middle'
            this.context.fillText(`asteroids remaining: ${gameSetting.asteroids}`, this.x, this.y)
        }

    })
    spriteArray.push(asteroidsRemaining)
}

function createLevelTitle() {
    bgStars.get({
        x: 400,
        y: 400,
        anchor: {x: 0.5, y: 0.5},
        ttl: 240,
        render() {
            this.context.fillStyle = `rgba(0, 125, 255, ${this.ttl / 240})`
            this.context.textAlign = 'center'
            this.context.textBaseline = 'middle'
            this.context.font = '50px Monospace'
            this.context.fillText(`level ${gameSetting.level}`, this.x, this.y)
        }
    })
}

function createPlasma(x, y, size) {
    let plasmaSheet = SpriteSheet({
        image: imageAssets['img/Plasma02'],
        frameHeight: 11,
        frameWidth: 11,
        animations: {
            default: {
                frames: [0,1],
                frameRate: 6
            }
        }

    })
    let plasma = Sprite({
        type: 'plasma',
        alive: true,
        x: x,
        y: y,
        dy: -1,
        anchor: {x: 0.5, y: 0.5},
        width: size,
        height: size,
        radius: size / 2,
        animations: plasmaSheet.animations,
        ttl: gameSetting.plasmaTtl,
        alpha: 1,
        update() {
            if (this.ttl < 1) {
                this.alive = false
            } else if (this.ttl < (gameSetting.plasmaTtl - 50) && this.dy != 0) {
                this.dy = 0
            }
            this.alpha = this.ttl / gameSetting.plasmaTtl
            this.advance()
            asteroidArray.map((asteroid) => {collide(asteroid, this)})
        }
    })
    plasmaArray.push(plasma)
    ZZFX.z(57766,{volume:.4,frequency:500,length:.2,attack:.07,slide:1.5,noise:1.9,modulation:-1,modulationPhase:.51});
}

function createPlayer() {
    playerSheet = SpriteSheet({
        image: imageAssets['img/astronaught'],
        frameHeight: 16,
        frameWidth: 16,
        animations: {
            default: {
                frames: '0..2',
                frameRate: 6
            }
        }
    })
    playerSprite = Sprite({
        type: 'player',
        alive: true,
        x: gameSetting.canvasWidth / 2,
        y: gameSetting.canvasHeight * 0.6,
        anchor: {x: 0.5, y: 0.5},
        dx: 0,
        dy: 0,
        dt: 0,
        width: 32,
        height: 32,
        radius: 16,
        plasma: gameSetting.maxPlasma,
        animations: playerSheet.animations,
        update() {
            if (keyPressed('left')) {
                ZZFX.z(4759,{volume:.4,frequency:1000,length:.1,attack:.79,slide:5.4,noise:3.9});
                if (this.dx > 0) {
                    this.dx -= gameSetting.playerAcc * 2
                } else {
                    this.dx -= gameSetting.playerAcc
                }
            }
            if (keyPressed('right')) {
                ZZFX.z(4759,{volume:.4,frequency:1000,length:.1,attack:.79,slide:5.4,noise:3.9});
                if (this.dx < 0) {
                    this.dx += gameSetting.playerAcc * 2
                } else {
                    this.dx += gameSetting.playerAcc
                }
            }
            if (!keyPressed('left') && !keyPressed('right')) {
                if (this.dx < gameSetting.playerAcc && this.dx > -gameSetting.playerAcc) {
                    this.dx = 0
                } else if (this.dx > 0) {
                    this.dx -= 0.01
                } else {
                    this.dx += 0.01
                }
            }
            if (keyPressed('up')) {
                ZZFX.z(4759,{volume:.4,frequency:1000,length:.1,attack:.79,slide:5.4,noise:3.9});
                this.dy -= gameSetting.playerAcc
            }
            if (keyPressed('down')) {
                ZZFX.z(4759,{volume:.4,frequency:1000,length:.1,attack:.79,slide:5.4,noise:3.9});
                this.dy += gameSetting.playerAcc
            }
            if (!keyPressed('up') && !keyPressed('down')) {
                if (this.dy < gameSetting.playerAcc && this.dy > -gameSetting.playerAcc) {
                    this.dy = 0
                } else if (this.dy > 0) {
                    this.dy -= 0.01
                } else {
                    this.dy += 0.01
                }
            }
            this.advance()
            if (this.x - this.radius < 0) {
                this.x = this.radius
                this.dx = 0
            }
            if (this.x + this.radius > gameSetting.canvasWidth) {
                this.x = gameSetting.canvasWidth - this.radius
                this.dx = 0
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius
                this.dy = 0
            }
            if (this.y + this.radius > gameSetting.canvasHeight - 30) {
                this.y = gameSetting.canvasHeight - this.radius - 30
                this.dy = 0
            }
            this.dt += 1/60

            if (keyPressed('space') && this.plasma >= 1 && this.dt > gameSetting.playerFireRate) {
                createPlasma(this.x, this.y - (this.radius * 2), (this.radius * 2))
                this.plasma -= gameSetting.plasmaBurnRate
                this.dt = 0
            }
            if (!keyPressed('space') && this.plasma < gameSetting.maxPlasma) {
                this.plasma += gameSetting.plasmaRefillRate
                if (playerSprite.plasma > gameSetting.maxPlasma) {
                    playerSprite.plasma = gameSetting.maxPlasma
                }
            }
        }
    })
}

function lostGame() {
    gameSetting.asteroids = 999
    playerSprite.alive = true
    ZZFX.z(5962);
    bgStars.get({
        x: 400,
        y: 400,
        anchor: {x: 0.5, y: 0.5},
        update() {
            plasmaArray = []
            asteroidArray = []
            spriteArray = []
            playerSprite.x = gameSetting.canvasWidth / 2
            playerSprite.y = gameSetting.canvasHeight / 2 + 50
            if (keyPressed('space')) {
                gameSetting.level = 1
                bgStars.clear()
                spriteArray = []
                startLevel()
                plasmaArray = []
            }
            this.advance()
        },
        render() {
            this.context.fillStyle = `rgba(255, 0, 0, 0.5)`
            this.context.font = '50px Monospace'
            this.context.textAlign = 'center'
            this.context.textBaseline = 'middle'
            this.context.fillText('GAME OVER!', this.x, this.y)
        }
    })
    bgStars.get({
        x: 400,
        y: 520,
        anchor: {x: 0.5, y: 0.5},
        alpha: 1.0,
        fading: false,
        update() {
            this.advance()
            if (this.fading == true){
                this.alpha += 0.005
                if (this.alpha > 1.0) {
                    this.alpha = 1.0
                    this.fading = false
                }
            } else {
                this.alpha -= 0.005
                if (this.alpha < 0.0) {
                    this.alpha = 0.0
                    this.fading = true
                }
            }
        },
        render() {
            this.context.fillStyle = `rgba(0, 0, 255, ${this.alpha})`
            this.context.font = '20px Monospace'
            this.context.textAlign = 'center'
            this.context.textBaseline = 'middle'
            this.context.fillText('Hit SPACE to go back to level 1!', this.x, this.y)
        }
    })
}

function random(number) {
    return Math.round(Math.random() * number)
}

function startLevel() {
    plasmaArray = []
    createLevelTitle()
    switch (gameSetting.level){
        case 1:
            createBg()
            createPlayer()
            createHud()
            createAsteroids(5, 10000)
            break
        case 2:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(6, 9000)
            break
        case 3:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(7, 8000)
            break
        case 4:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(8, 7000)
            break
        case 5:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(9, 5500)
            break
        case 6:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(10, 5000)
            break
        case 7:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(11, 4500)
            break
        case 8:
            gameSetting.plasmaBurnRate += 1
            createAsteroids(12, 4000)
            break
        default:
            plasmaArray = []
            spriteArray = []
            bgStars.get({
                x: 400,
                y: 400,
                render() {
                    this.context.fillStyle = 'rgba(255, 255, 255, 1.0)'
                    this.context.font = '50px Monospace'
                    this.context.textAlign = 'center'
                    this.context.textBaseline = 'middle'
                    this.context.fillText(`YOU SAVED THE EARTH`, this.x, this.y)
                }
            })
            loop.stop()
    }
}

function titleScreen() {
    createBg()
    createPlayer()
    gameSetting.asteroids = 999

    const gameTitle = 'send the asteroids back'
    const secondTile = [
        'asteroids are fliying through space',
        'towards earth, with your plasma wall',
        'building hammer send them back and',
        'save the earth!',
        '',
        'hit space to start']
    const instructionTitle = 'hit space to start'
    
    bgStars.get({
        x: 400,
        y: 200,
        spaceHit: false,
        update() {
            playerSprite.x = gameSetting.canvasWidth / 2
            playerSprite.y = gameSetting.canvasHeight / 2
            plasmaArray = []
            asteroidArray = []
            spriteArray = []
            if (keyPressed('space')) {
                this.spaceHit = true
            }
            if (!keyPressed('space') && this.spaceHit) {
                bgStars.clear()
                gameSetting.level = 1
                spriteArray = []
                startLevel()
                plasmaArray = []
            }
            this.advance()
        },
        render() {
            this.context.save()
            this.context.font = '900 50px Monospace'
            this.context.textAlign = 'center'
            this.context.textBaseline = 'middle'
            this.context.fillStyle = `rgba(0, 128, 255, 1.0)`
            this.context.strokeStyle = 'rgba(128, 128, 128, 1.0)'
            this.context.shadowColor = 'rgba(255, 255, 255, 0.3)'
            this.context.shadowBlur = 10
            this.context.fillText(gameTitle, this.x, this.y)
            this.context.strokeText(gameTitle, this.x, this.y)
            this.context.restore()
        }
    })

    let txtY = 500
    for (let txt of secondTile) {
        bgStars.get({
            x: 400,
            y: txtY,
            render() {
                this.context.save()
                this.context.font = '900 30px Monospace'
                this.context.textAlign = 'center'
                this.context.textBaseline = 'middle'
                this.context.fillStyle = `rgba(0, 128, 255, 1.0)`
                this.context.strokeStyle = 'rgba(128, 128, 128, 1.0)'
                this.context.shadowColor = 'rgba(255, 255, 255, 0.3)'
                this.context.shadowBlur = 10
                this.context.fillText(txt, this.x, this.y)
                this.context.strokeText(txt, this.x, this.y)
                this.context.restore()
            }
        })
        txtY +=50
    }
    loop.start()
}

let loop = GameLoop({
    update() {
        asteroidArray.map((sprite) => {sprite.update()})
        asteroidArray = asteroidArray.filter(sprite => sprite.alive)
        plasmaArray.map((sprite) => {sprite.update()})
        plasmaArray = plasmaArray.filter(sprite => sprite.alive)
        spriteArray.map((sprite) => {sprite.update()})
        playerSprite.update()
        bgStars.update()
        if (!playerSprite.alive) {
            lostGame()
        }
        if (gameSetting.asteroids < 1) {
            gameSetting.level += 1
            startLevel()
        }
    },
    render() {
        bgStars.render()
        asteroidArray.map((sprite) => {
            sprite.render()
        })
        plasmaArray.map((sprite) => {
            sprite.render()
        })
        spriteArray.map((sprite) => {
            sprite.render()
        })
        playerSprite.render()
    }
})

load('img/astronaught.png', 'img/Plasma02.png','img/asteroid01.png').then(() => {titleScreen()})