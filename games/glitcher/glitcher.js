'use strict';

window.addEventListener('load', function() {

    var TILE_W = 32;
    var CANVAS_W = 224;
    var CANVAS_H = 126;
    var SCENE_W = Math.floor(CANVAS_W / TILE_W) + 1;
    var SCENE_H = Math.ceil(CANVAS_H / TILE_W);
    var OFFSET_Y = (SCENE_H * TILE_W - CANVAS_H) / 2;

    var ctxs = {};

    function addCanvas(name, z) {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.style['z-index'] = z;
        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;
        ctxs[name] = canvas.getContext('2d');
    };

    function clearCanvas(ctx) {
        ctx.save();
        ctx.resetTransform();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    function createTiles(img) {
        var tiles = [];
        var len = img.width / TILE_W;
        for (var i = 0; i < len; i += 1) {
            var canvas = document.createElement('canvas');
            canvas.width = TILE_W;
            canvas.height = TILE_W;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, i * TILE_W, 0,
                TILE_W, TILE_W, 0, 0, TILE_W, TILE_W);
            tiles.push(canvas);
        }
        return tiles;
    }

    addCanvas('main', 1);
    addCanvas('menu', 2)
    addCanvas('ui', 3);

    var ctx = ctxs.main;
    ctx.canvas.style['background'] = '#401910';

    var IMAGES = {};
    IMAGES.fossils = document.getElementById('fossils');
    IMAGES.brickWall = document.getElementById('brick-wall');

    /* #guy */
    var guy = {
        W: 10,
        V: 64,
        J: 54,

        x: 0,
        y: 0,

        anim: {
            t: 0,
            FPS: 0,
            frames: null
        },

        init: function() {
            this.anim.FPS = this.V / 5;

            var spritesheet = document.getElementById('guy');
            this.anim.frames = createTiles(spritesheet);
        },

        reset: function() {
            this.x = 0;
            this.y = -TILE_W / 2;
        },

        render: function(ctx, cam) {
            var x = this.x - cam.x + CANVAS_W / 2 - TILE_W / 2;
            var y = this.y - cam.y + CANVAS_H / 2 - TILE_W / 2;

            var frame = Math.floor(this.anim.t * this.anim.FPS);
            var img = this.anim.frames[frame];
            ctx.drawImage(img, x, y);
        },

        update: function(dt) {
            this.x += dt * this.V;

            this.anim.t += dt;
            this.anim.t %= this.anim.frames.length / this.anim.FPS;
        },

        jump: function() {
            var frame = Math.floor(this.anim.t * this.anim.FPS);
            var img = this.anim.frames[frame];
            effect.add(img, this.x, this.y);

            this.x += this.J;
            this.x = Math.min(this.x, cam.x + CANVAS_W / 2 - 5);

            audio.play('jump');
        }
    };

    /* #cam */
    var cam = {
        DX: 64,
        ACC: 128,
        DEC: 128,

        v: 0,
        x: 0,
        y: 0,

        init: function() {},

        reset: function() {
            this.v = 0;
            this.x = CANVAS_W / 2 + TILE_W / 2;
            this.y = TILE_W - CANVAS_H / 2 - OFFSET_Y;
        },

        update: function(dt, guy) {
            this.x += this.v * dt;

            var v = this.v - guy.V;
            var x = guy.x + this.DX - this.x;
            var dx = sign(v) * 0.5 * v * v / this.DEC;

            if (x * dx >= 0 && Math.abs(dx) <= Math.abs(x)) {
                /* accelerate */
                this.v += sign(v) * dt * this.ACC;
            } else {
                /* decelerate */
                this.v -= sign(v) * dt * this.DEC;
            }
        }
    };

    /* #scene */
    var scene = {
        ceilImages: null,
        bgImages: [IMAGES.fossils],
        floorImages: null,
        x: 0,
        ceil: [],
        bg: [],
        floor: [],

        init: function() {
            this.ceilImages = createTiles(document.getElementById('ceil'));
            this.floorImages = createTiles(document.getElementById('floor'));
            for (var i = 0; i < SCENE_H - 2; i += 1) {
                this.bg.push([]);
            }
            for (var i = 0; i < SCENE_W; i += 1) {
                this.genTiles();
            }
        },

        reset: function() {
            this.x = 0;
        },

        genTiles: function() {
            this.ceil.push(randomInt(this.ceilImages.length));
            this.floor.push(randomInt(this.floorImages.length));
            for (var j = 0; j < SCENE_H - 2; j += 1) {
                this.bg[j].push(randomInt(this.bgImages.length));
            }
        },

        popTiles: function() {
            this.ceil.shift();
            this.floor.shift();
            for (var j = 0; j < SCENE_H - 2; j += 1) {
                this.bg[j].shift();
            }
        },

        update: function(cam) {
            if (this.x + 32 < cam.x - CANVAS_W / 2) {
                this.x += 32;
                this.popTiles();
                this.genTiles();
            }
        },

        renderCol: function(ctx, cam, i) {
            var x = this.x + TILE_W * i - cam.x + CANVAS_W / 2;
            ctx.drawImage(this.ceilImages[this.ceil[i]],
                x, -OFFSET_Y);
            ctx.drawImage(this.floorImages[this.floor[i]],
                x, TILE_W * (SCENE_H - 1) - OFFSET_Y);
            for (var j = 1; j < SCENE_H - 1; j += 1) {
                ctx.drawImage(this.bgImages[this.bg[j - 1][i]],
                    x, TILE_W * j - OFFSET_Y);
            }
        },

        render: function(ctx, cam) {
            for (var i = 0; i < SCENE_W; i += 1) {
                this.renderCol(ctx, cam, i);
            }
        }
    };

    /* #obstacles */
    var obstacles = {
        DIST: 64,
        DELTA: 48,

        d: 0,
        walls: null,
        wallImages: [IMAGES.brickWall],

        init: function() {},

        reset: function() {
            this.walls = [-1234];
            this.d = 0;
        },

        update: function(dt) {
            var wallEnd = this.walls[this.walls.length - 1] + TILE_W;
            var camEnd = cam.x + CANVAS_W / 2;
            var camBegin = cam.x - CANVAS_W / 2;

            /* push wall */
            if (wallEnd + this.d <= camEnd) {
                this.walls.push(Math.ceil(camEnd));
                this.d = (Math.random() - 0.5) * this.DELTA + this.DIST;
            }

            /* pop wall */
            while (this.walls.length > 1 &&
                this.walls[0] + 32 < camBegin) {
                this.walls.shift();
            }
        },

        renderWall: function(ctx, x) {
            for (var i = 1; i < SCENE_H - 1; i += 1) {
                ctx.drawImage(this.wallImages[
                        randomInt(this.wallImages.length)],
                    x - cam.x + CANVAS_W / 2,
                    TILE_W * i - OFFSET_Y);
            }
        },

        render: function(ctx, cam) {
            for (var i = 0; i < this.walls.length; i += 1) {
                this.renderWall(ctx, this.walls[i]);
            }
        },

        collision: function(guy) {
            var le = guy.x - 5;
            var ri = guy.x + 5;

            for (var i = 0; i < this.walls.length; i += 1) {
                if (ri < this.walls[i]) {
                    break;
                }
            }

            if (i == 0) {
                return false;
            }

            var wall = this.walls[i - 1];
            if (le < wall + TILE_W) {
                return true;
            }
            return false;
        }
    };

    /* #effect */
    var effect = {
        list: null,

        init: function() {},

        reset: function() {
            this.list = [];
        },

        glitch: function(ctx, img, x, y) {
            var w = img.width;
            var h = img.height;
            var rects = Math.random() * 13;
            for (var i = 0; i < rects; i++) {
                var dx = Math.random() * 0.2 * w;
                var dy = Math.random() * h;
                var spliceW = w - dx;
                var spliceH = Math.min(randomInt(h / 3) + 5, h - dy);
                ctx.drawImage(img, 0, dy, spliceW, spliceH,
                    x + dx, y + dy, spliceW, spliceH);
                ctx.drawImage(img, spliceW, dy, dx, spliceH,
                    x, y + dy, dx, spliceH);
            }
        },

        add: function(img, x, y) {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');

            this.list.push({
                x: x,
                y: y,
                img: img,
                ctx: ctx
            });
        },

        update: function(cam) {
            while (this.list.length != 0 &&
                this.list[0].x + TILE_W / 2 < cam.x - CANVAS_W / 2) {
                this.list.shift();
            }
            for (var i = 0; i < this.list.length; i += 1) {
                var inst = this.list[i];
                var ctx = inst.ctx;
                if (Math.random() < 0.05) {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    this.glitch(ctx, inst.img, 0, 0);
                }
            }
        },

        render: function(ctx, cam) {
            for (var i = 0; i < this.list.length; i += 1) {
                var inst = this.list[i];
                var x = inst.x - cam.x + CANVAS_W / 2 - TILE_W / 2;
                var y = inst.y - cam.y + CANVAS_H / 2 - TILE_W / 2;
                if (Math.random() < 0.9) {
                    ctx.drawImage(inst.ctx.canvas, x, y);
                }
            }
        }
    }

    /* #menu */
    var menu = {
        restart_x: 0,
        restart_y: 0,
        highImg: null,
        restartImg: null,
        gameoverImg: null,

        init: function() {
            this.highImg = document.getElementById('highscore');
            this.restartImg = document.getElementById('restart');
            this.gameoverImg = document.getElementById('gameover');
            this.restart_x = CANVAS_W - TILE_W + this.restartImg.width / 2;
            this.restart_y = TILE_W / 4 - 1 + this.restartImg.height / 2;
        },

        reset: function() {},

        /* TODO: glitch bgCtx */
        render: function(fgCtx, bgCtx) {
            var ctx = fgCtx;
            ctx.drawImage(this.highImg, TILE_W / 2, TILE_W / 4 - 1);
            pixelFont.write(ctx, score.highscore, TILE_W, TILE_W / 2);
            ctx.drawImage(this.restartImg,
                this.restart_x - this.restartImg.width / 2,
                this.restart_y - this.restartImg.height / 2);
            ctx.drawImage(this.gameoverImg,
                CANVAS_W / 2 - this.gameoverImg.width / 2,
                CANVAS_H / 2 - this.gameoverImg.height / 2);
        }
    };

    /* #audio */
    var audio = {
        MUTATIONS: 5,
        audios: {},

        settings: {
            'jump': [0, 0.11, 0.14, 0.2, 0.26, 0.34, 0.085, 0.21, ,
                0.55, 0.51, -0.34, 0.26, 0.13, 0.01, 0.19, -0.1,
                0.17, 0.88, -0.15, 0.2, , -0.28, 0.15
            ],
            'dead': [0, , 0.01, , 0.20, 0.36, , -0.43, , , , , ,
                0.46, , , , , 1, , , 0.27, , 0.55
            ]
        },

        init: function() {
            for (var audioName in this.settings) {
                var settings = this.settings[audioName];
                var audios = [];
                this.audios[audioName] = audios;
                for (var i = 0; i < this.MUTATIONS; i += 1) {
                    var audio = new Audio();
                    audio.src = jsfxr(this.mutate(settings));
                    audios.push(audio);
                }
            }
        },

        reset: function() {},

        mutate: function(settings) {
            for (var i = 0; i < settings.length; i += 1) {
                if (Math.random() < 0.5 && settings[i]) {
                    settings[i] += Math.random() * 0.1 / 3 - 0.05 / 3;
                }
            }
            return settings;
        },

        play: function(audioName) {
            console.log('play audio: ' + audioName);
            this.audios[audioName][randomInt(this.MUTATIONS)].play();
        }
    };

    /* #pixelFont */
    var pixelFont = {
        CHAR_W: 3,
        CHAR_H: 5,
        chars: {},

        init: function() {
            var digits = document.getElementById('digits');
            for (var i = 0; i < 10; i += 1) {
                var canvas = document.createElement('canvas');
                canvas.width = this.CHAR_W;
                canvas.height = this.CHAR_H;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(digits, i * 3, 0, this.CHAR_W,
                    this.CHAR_H, 0, 0, this.CHAR_W, this.CHAR_H
                );
                this.chars[i] = canvas;
            }
        },

        reset: function() {},

        write: function(ctx, text, x, y) {
            text = text.toString();
            x -= text.length * (this.CHAR_W + 1) / 2 - 0.5;
            y -= this.CHAR_H / 2;
            for (var i = 0; i < text.length; i += 1) {
                ctx.drawImage(this.chars[text.charAt(i)], x, y);
                x += this.CHAR_W + 1;
            }
        }
    };

    /* #score */
    var score = {
        LS_ITEM: 'glitcher-highscore',
        startTime: 0,
        curScore: 0,
        dispScore: null,
        highscore: 0,
        new: false,
        newHighImg: null,

        init: function() {
            /* load highscore from localStorage */
            this.highscore = window.localStorage.getItem(this.LS_ITEM);

            /* create 'new highscore' img */
            var newImg = document.getElementById('new');
            var highImg = document.getElementById('highscore');
            var canvas = document.createElement('canvas');
            canvas.width = newImg.width + 2 + highImg.width;
            canvas.height = Math.max(newImg.height, highImg.height);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(newImg, 0, 0);
            ctx.drawImage(highImg, newImg.width + 2, 0);
            this.newHighImg = canvas;
        },

        reset: function() {
            this.startTime = performance.now();
            this.curScore = 0;
            this.dispScore = null;
            this.new = false;
        },

        update: function() {
            this.curScore = Math.floor(
                (performance.now() - this.startTime) / 1000);

            if (this.curScore > this.highscore) {
                this.new = true;
                this.highscore = this.curScore;
                window.localStorage.setItem(this.LS_ITEM, this.highscore);
            }
        },

        render: function(ctx) {
            if (this.curScore !== this.dispScore) {
                ctx.clearRect(0, 0, CANVAS_W, TILE_W);

                this.dispScore = this.curScore;
                pixelFont.write(ctx, this.curScore, CANVAS_W / 2, TILE_W / 2);

                if (this.new) {
                    ctx.drawImage(this.newHighImg,
                        CANVAS_W / 2 - this.newHighImg.width / 2,
                        TILE_W / 4 - 1);
                }
            }
        }
    };

    /* #fullscreen */
    var fullscreen = {
        img: document.getElementById('fullscreen'),
        x: 0,
        y: 0,

        init: function() {
            this.x = menu.restart_x;
            this.y = CANVAS_H - menu.restart_y;
        },

        reset: function() {
            var ctx = ctxs.ui;
            ctx.drawImage(this.img,
                this.x - this.img.width / 2,
                this.y - this.img.height / 2);
        },

        toggle: function() {
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        }
    };

    function dist(x0, y0, x1, y1) {
        var dx = x0 - x1;
        var dy = y0 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function restart() {
        preTime = null;
        gameover = false;
        for (var x in ctxs) {
            clearCanvas(ctxs[x]);
        }
        reset();
        requestAnimationFrame(mainLoop);
    }

    function listener(x, y) {
        if (dist(x, y, fullscreen.x, fullscreen.y) <
            fullscreen.img.width / 2) {
            fullscreen.toggle();
        } else if (gameover) {
            if (dist(x, y, menu.restart_x, menu.restart_y) <
                menu.restartImg.width / 2) {
                restart();
            }
        } else {
            guy.jump();
        }
    }

    document.addEventListener('mousedown', function(e) {
        e.preventDefault();
        var canvas = ctxs.main.canvas;
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        listener(x / zoom, y / zoom);
    });

    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
        var canvas = ctxs.main.canvas;
        var x = e.targetTouches[0].pageX - canvas.offsetLeft;
        var y = e.targetTouches[0].pageY - canvas.offsetTop;
        listener(x / zoom, y / zoom);
    });

    document.addEventListener('keydown', function(e) {
        if (e.code == 'Space') {
            e.preventDefault();
            listener(0, 0);
        }
    });

    var zoom = 1;

    function resize() {
        var CANVAS_RATIO = CANVAS_W / CANVAS_H;
        var windowRatio = window.innerWidth / window.innerHeight;

        if (CANVAS_RATIO > windowRatio) {
            zoom = window.innerWidth / CANVAS_W;
        } else {
            zoom = window.innerHeight / CANVAS_H;
        }

        for (var x in ctxs) {
            var canvas = ctxs[x].canvas;
            canvas.style.width = CANVAS_W * zoom;
            canvas.style.height = CANVAS_H * zoom;
        }
    }

    window.addEventListener('resize', resize);

    resize();

    function sign(x) {
        return (x < 0 ? -1 : 1);
    }

    function randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function init() {
        guy.init();
        cam.init();
        menu.init();
        scene.init();
        score.init();
        audio.init();
        effect.init();
        obstacles.init();
        pixelFont.init();
        fullscreen.init();
    }

    function reset() {
        guy.reset();
        cam.reset();
        menu.reset();
        scene.reset();
        score.reset();
        audio.reset();
        effect.reset();
        obstacles.reset();
        pixelFont.reset();
        fullscreen.reset();
    }

    var preTime = null;
    var gameover = false;

    function mainLoop(timestamp) {
        if (!preTime) {
            preTime = timestamp;
            score.startTime = timestamp;
        }

        var dt = timestamp - preTime;
        preTime = timestamp;
        dt *= 0.001;

        if (dt > 0.1) {
            dt = 0.016;
        }

        guy.update(dt);
        cam.update(dt, guy);
        scene.update(cam);
        effect.update(cam);
        obstacles.update(dt);
        score.update();

        var ctx = ctxs.ui;
        score.render(ctx);

        ctx = ctxs.main;
        scene.render(ctx, cam);
        obstacles.render(ctx, cam);
        effect.render(ctx, cam);
        guy.render(ctx, cam);

        if (obstacles.collision(guy)) {
            gameover = true;
            audio.play('dead');
            menu.render(ctxs.menu, ctxs.main);
        } else {
            requestAnimationFrame(mainLoop);
        }
    }

    init();
    reset();
    requestAnimationFrame(mainLoop);
});
