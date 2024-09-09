(function () {
    const pixelW = 3;
    const pixelH = 3;
    let gravity = 0.08;

    const d = document;
    const canvas = d.getElementById('game');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const screenHeight = canvasHeight / pixelH;
    const ctx = canvas.getContext('2d');

    let text1 = 'Radiospace failure';
    let text2 = 'use up/down arrows to move your spaceship';
    let text3 = 'use space to shoot red and blue enemies.';
    let text4 = '';
    let t0 = +new Date;
    let score = 0;

    // HTML5 style palette - HTML5 because we ony only 5 colors.
    const palette = ['#aaa', '#aa0', '#a33', '#11a', '#444'];

    const randomColor = () => palette[~~(Math.random() * palette.length)];

    const dist = (x, y, x1, y1) => {
        return Math.sqrt( (x1 - x) * (x1 - x) + (y1 - y) + (y1 - y) );
    };

    const rndF = (min, max) => min + (Math.random() * (max - min));
    const rndI = (min, max) => ~~(min + (Math.random() * (max - min)));


    let objects = [];

    // `O` helper assigns default values to object and adds it to object list
    function O(o) {
        o.color = o.color || 0;
        o.vx = o.vx || 0;
        o.vy = o.vy || 0;
        objects.push(o);
    }

    // player

    const player = {
        x: 10,
        _y: 100,
        vx: 0,
        _vy: 0,
        get vy() {
            return this._vy;
        },
        set vy(v) {
            const max = 1;
            if (this.y <= 1) v = Math.max(0, v);
            this._vy = v;
            v > max && (this._vy = max);
            v < -max && (this._vy = -max);
        },
        get y() {
            return this._y;
        },
        set y(v) {
            this._y = Math.min(screenHeight, Math.max(0, v));
        },
        immortal: false,
        gravityScale: 0.01,
        get big() {
            return true;
        },
        deathMelody: [
            [1200, 400],
            [500, 200],
            [400, 200],
            [200, 200],
        ],
        get color() {
            return Math.random() < 0.8? 0 : 1;
        },

        up() {
            this.vy -= 1;
        },
        down() {
            this.vy += 1;
        },
        new() {
            document.location.reload();
        },
        space() {
            O({
                x: this.x + 4,
                y: this.y,
                vx: 2, vy: -0.1,
                get color() {
                    return Math.random() < 0.6? 0 : 1;
                },
                get big() {
                    return Math.random() < 0.1
                },
                gravityScale: 0.02,
                immortal: true,
                killer: true,
                ttl: 100,
            });
            melody([
                [400, 100],
                [500, 100],
                [650, 100],
            ]);
        },
        collision(target) {
            if (target.enemy) {
                score = (new Date - t0) / 1000;
                text1 = 'Game Over';
                text2 = `You survived ${score.toFixed(1)} seconds!`;
                text3 = 'press N to begin new game';
                this.dead = true;
            }
        }
    };

    objects.push(player);

    // keyboard

    d.addEventListener('keydown', e => {
        const keys = {
            38: 'up',
            40: 'down',
            32: 'space',
            78: 'new',
        };
        const handler = player[keys[e.keyCode]];

        if (typeof handler == 'function') {
            handler.call(player);
        }
    });

    // logic

    function update(o) {
        o.x += o.vx;
        o.y += o.vy;
        //if (dist(o.x, o.y, 200, 100) < 40)
        o.vy += gravity * ('gravityScale' in o? o.gravityScale : 1);
        if (o.y > 400) {
            o.y = 0;
            o.x = rndI(200,320);
            o.vy = 0;
        }
        if (o.enemy && dist(o.x, o.y, player.x, player.y) > 100) {
            o.vx += (player.x - o.x)/200;
            o.vy += (player.y - o.y)/200;
        }
        const max = 1;
        if (o.vx > max) o.vx = max;
        if (o.vx < -max) o.vx = -max;
        if (o.vy > max) o.vy = max;
        if (o.vy < -max) o.vy = -max;
        o.ttl = (o.ttl || 0) - 1;
        if (o.ttl == 0) {
            o.dead = true;
        }

    }

    function collisions() {
        for (let i = 0; i < objects.length - 1; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const a = objects[i];
                const b = objects[j];
                if (dist(a.x, a.y, b.x, b.y) < 3) {
                    a.dead = b.killer && !a.immortal;
                    b.dead = a.killer && !b.immortal;
                    a.collision && a.collision(b);
                    b.collision && b.collision(a);
                    if (a.dead || b.dead) {
                        melody(
                            a.deathMelody || b.deathMelody || [
                            [250, 100],
                            [200, 100],
                            [100, 100],
                        ]);
                    }
                }
            }
        }
    }

    (function loop() {

        if (Math.random()<0.3) {
            ctx.fillStyle = `rgba(${rndI(5,15)}, ${rndI(10, 20)}, ${rndI(10, 20)}, ${rndF(0.2, 0.4)})`;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        objects.forEach(o => {
            if (o.dead) {
                ctx.fillStyle = randomColor();//palette[4];
                ctx.fillRect(~~(pixelW * (o.x-2)), ~~(pixelH * (o.y-2)), pixelW * 4, pixelH * 4);
            } else {
                ctx.fillStyle = o.color >= 0? palette[o.color || 0] : (Math.random() < 0.4? randomColor() : palette[0]);
                if (o.big) {
                    ctx.fillRect(~~(pixelW * (o.x-1)), ~~(pixelH * (o.y-1)), pixelW * 3, pixelH * 3);
                } else
                    ctx.fillRect(~~(pixelW * o.x), ~~(pixelH * o.y), pixelW, pixelH);
                update(o);
            }
        });

        ctx.fillStyle = palette[0];

        if (text1) {
            ctx.font = '48px courier';
            ctx.fillText(text1,100,rndI(99,101))
        }
        if (text2) {
            ctx.font = '20px courier';
            ctx.fillText(text2, rndI(99,101), 200)
        }
        if (text3) {
            ctx.font = '20px courier';
            ctx.fillText(text3,rndI(99,101), 250)
        }
        if (!player.dead) {
            ctx.fillStyle = Math.random()<0.9? palette[0]: palette[2];
            ctx.font = '22px courier';
            ctx.fillText('you survived: ' + ((new Date - t0) / 1000).toFixed(1) + ' seconds.',rndI(99,101), 560)
        }


        collisions();
        requestAnimationFrame(loop);
        if (Math.random()<0.03)
            objects = objects.filter(o => !o.dead);

    })();

    setInterval(() => {
        O({
            x: rndI(200,320),
            y: 100,
            vx: rndF(-4, 0),
            vy: rndF(-4, 1),
            big: true,
            color: rndI(2, 4),
            ttl: 100,
            gravityScale:0,
            enemy: true
        });
    }, 300)

    setTimeout(() => {
        text1 = text2 = text3 = '';
    }, 3000);

})();
