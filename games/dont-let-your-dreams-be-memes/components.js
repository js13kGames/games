'use strict';

AFRAME.registerComponent('cursor-defuse', {
    schema: { default: '' },

    init: function init() {
        var _this = this;

        var defuse = function defuse() {
            _this.el.setAttribute('geometry', 'thetaLength', 0);
        };
        this.el.addEventListener('click', defuse);
        this.el.addEventListener('mouseleave', defuse);
    }
});

AFRAME.registerComponent('canvas-paint-wall', {
    schema: { default: '' },

    init: function init() {
        var canvas = document.getElementById(this.data).getContext('2d');

        canvas.fillStyle = '#fdf4e3';
        canvas.fillRect(0, 0, 512, 512);

        canvas.font = "bold 48px 'Segoe UI','Helvetica Neue',sans-serif";
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';

        canvas.fillStyle = '#bdb7aa';
        canvas.fillText('NO ESCAPE', 256, 256);
    }
});

AFRAME.registerComponent('canvas-paint-button', {
    schema: { default: '' },

    init: function init() {
        var canvas = document.getElementById(this.data).getContext('2d');

        canvas.fillStyle = '#F50057';
        canvas.fillRect(0, 0, 256, 128);

        canvas.font = "bold 40px 'Segoe UI','Helvetica Neue',sans-serif";
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';

        canvas.save();
        canvas.translate(128, 64);
        canvas.scale(0.85, 1);

        canvas.fillStyle = '#fff';
        canvas.fillText('INSERT COIN', 0, 0);

        canvas.restore();
    }
});

var PICTURES = ['🍌', '🍇', '🍒', '🍋', '🍓', '🌟', '💎'];

var STATE_IDLE = 0;
var STATE_SPINNING = 1;

var MIN_SPEED = 0.3;
var FRICTION = 0.03;

AFRAME.registerComponent('program', {
    schema: { default: '' },

    init: function init() {
        var _this2 = this;

        this.money = 10;
        this.pos = [200, 200, 200];
        this.speed = [0, 0, 0];
        this.target = [-1, -1, -1];
        this.state = STATE_IDLE;

        var pointer = document.getElementById('pointer');
        var button = document.getElementById('insert-coin');

        this.buttonEnable = function () {
            button.className = 'clickable';
            pointer.components.raycaster.refreshObjects();
        };

        this.buttonDisable = function () {
            button.className = '';
            pointer.components.raycaster.refreshObjects();
        };

        button.addEventListener('click', function (event) {
            --_this2.money;
            _this2.speed = [3.5 + Math.random(), 4 + Math.random() * 0.5, 3 + Math.random() * 1.5];
            _this2.target = [-1, -1, -1];
            _this2.state = STATE_SPINNING;
            _this2.buttonDisable();
        });

        var reel = this.reel = document.getElementById('canvas-reel');
        var reelCanvas = reel.getContext('2d');

        reelCanvas.fillStyle = '#fff';
        reelCanvas.fillRect(0, 0, 200, 1600);

        reelCanvas.font = "bold 80px 'Segoe UI','Helvetica Neue',sans-serif";
        reelCanvas.textAlign = 'center';
        reelCanvas.textBaseline = 'middle';

        for (var i = 0; i < 8; ++i) {
            var j = i * 200;

            reelCanvas.fillStyle = '#ECEFF1';
            reelCanvas.fillRect(20, 20 + j, 160, 160);

            reelCanvas.fillStyle = '#bdb7aa';
            reelCanvas.fillText(PICTURES[i % 7], 100, 100 + j);
        }

        var canvas = this.canvas = document.getElementById(this.data).getContext('2d');

        canvas.font = "bold 48px 'Segoe UI','Helvetica Neue',sans-serif";
        canvas.textAlign = 'center';
        canvas.textBaseline = 'middle';

        canvas.fillStyle = '#fdf4e3';
        canvas.fillRect(0, 0, 800, 450);
    },
    tick: function tick(time, timeDelta) {
        if (this.state == STATE_SPINNING) {
            for (var i = 0; i < 3; ++i) {
                if (this.speed[i] == 0) continue;

                if ((this.speed[i] -= FRICTION) <= MIN_SPEED) {
                    this.speed[i] = MIN_SPEED;
                    if (this.target[i] == -1) {
                        this.target[i] = Math.floor(this.pos[i] * 0.005) * 200;
                    }
                }

                this.pos[i] -= this.speed[i] * timeDelta;
                if (this.target[i] != -1 && this.pos[i] <= this.target[i]) {
                    this.pos[i] = this.target[i];
                    this.speed[i] = 0;
                    this.target[i] = -1;
                } else if (this.pos[i] < 0) this.pos[i] += 1400;
            }

            if (this.speed[0] == 0 && this.speed[1] == 0 && this.speed[2] == 0) {
                if (this.pos[0] == this.pos[1] && this.pos[1] == this.pos[2]) {
                    this.money += 10;
                }
                this.state = STATE_IDLE;
                if (this.money > 0) this.buttonEnable();else {
                    var c = document.getElementById('canvas-button').getContext('2d');
                    c.fillStyle = '#fff';
                    c.fillRect(10, 61, 236, 6);
                }
            }
        }

        var canvas = this.canvas;

        canvas.fillStyle = '#fdf4e3';
        canvas.fillRect(0, 0, 800, 450);

        canvas.fillStyle = '#bdb7aa';
        canvas.fillText('SAVINGS: €' + this.money, 400, 50);

        canvas.fillRect(0, 120, 800, 5);
        canvas.fillRect(0, 325, 800, 5);

        canvas.drawImage(this.reel, 0, this.pos[0], 200, 200, 50, 125, 200, 200);
        canvas.drawImage(this.reel, 0, this.pos[1], 200, 200, 300, 125, 200, 200);
        canvas.drawImage(this.reel, 0, this.pos[2], 200, 200, 550, 125, 200, 200);
    }
});

