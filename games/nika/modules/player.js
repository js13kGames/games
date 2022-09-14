m.set(
    'player',
    (
        function module(
            engine
        ) {
            'use strict';
            var
                prototype;
            prototype = {
                challenge: challenge,
                crash: crash,
                finish: finish,
                lose: lose,
                off: off,
                on: on,
                rubberband: rubberband,
                update: update,
                win: win
            };
            return Player;
            //
            // functions
            //
            function Player(
                node,
                distanceNode,
                faceNode,
                lapsNode,
                laurelNode,
                rbNode,
                scoreNode,
                timeNode,
                id,
                nickname
            ) {
                var
                    player;
                player = Object.create(prototype);
                player.node = node;
                player.distanceNode = distanceNode;
                player.faceNode = faceNode;
                player.lapsNode = lapsNode;
                player.laurelNode = laurelNode;
                player.rbNode = rbNode;
                player.scoreNode = scoreNode;
                player.timeNode = timeNode;
                player.id = id;
                player.nickname = nickname;
                // activate
                player.challengeTime = 0;
                player.crashed = false;
                player.distance = 0;
                player.faceChallenge = faceChallenge.bind(player);
                player.finished = false;
                player.internalTimeout = null;
                player.ready = false;
                player.time = 0;
                return player;
            }
            function challenge(done) {
                this.challengeTime = Date.now();
                this.node.classList.add('challenged');
                this.challenged = true;
                this.done = done;
            }
            function crash() {
                this.crashed = true;
            }
            function faceChallenge() {
                if (
                    this.challenged
                ) {
                    this.time += Date.now() - this.challengeTime;
                } else {
                    this.time += 200;
                }
                this.timeNode.textContent = this.raceTime - this.time;
                if (
                    this.raceTime - this.time < 1
                ) {
                    this.crash();
                }
                if (
                    this.challenged
                ) {
                    this.node.classList.remove('challenged');
                    this.challenged = false;
                    this.lap += 1;
                    this.lapsNode.textContent = setLaps(this.lap, this.laps);
                    if (
                        this.lap === this.laps
                    ) {
                        this.finish();
                    }
                    this.done();
                }
            }
            function finish() {
                this.node.removeEventListener('touchstart', this.faceChallenge);
            }
            function lose() {
                this.node.classList.add('loser');
                this.node.classList.remove('ahead');
            }
            function off(score, lastTime) {
                this.challenged = false;
                this.crashed = false;
                this.ready = false;
                this.node.classList.remove('ahead');
                this.node.classList.remove(this.id);
                this.node.classList.remove('loser');
                this.distanceNode.textContent = '';
                this.faceNode.textContent = this.nickname;
                if (
                    !lastTime
                ) {
                    this.faceNode.classList.add('blink');
                }
                this.lapsNode.textContent = '';
                this.laurelNode.classList.add('hidden');
                this.scoreNode.textContent = score;
                this.timeNode.textContent = '';
            }
            function on(laps, raceTime) {
                this.lap = 0;
                this.laps = laps;
                this.raceTime = raceTime;
                this.ready = true;
                this.time = 0;
                this.node.classList.add(this.id);
                this.node.addEventListener('touchstart', this.faceChallenge);
                this.distanceNode.textContent = '0';
                this.faceNode.classList.remove('blink');
                this.faceNode.textContent = '';
                this.lapsNode.textContent = setLaps(this.lap, this.laps);
                this.laurelNode.classList.remove('hidden');
                this.scoreNode.textContent = '';
                this.timeNode.textContent = raceTime;
            }
            function rubberband() {
                var
                    height,
                    position,
                    width;
                height = parseInt(window.getComputedStyle(this.node).height);
                width = parseInt(window.getComputedStyle(this.node).width);
                position = engine.position(height, width);
                this.rbNode.classList.remove('hidden');
                this.rbNode.style.bottom = position.height + 'px';
                this.rbNode.style.right = position.width + 'px';
                setTimeout(
                    function onTimeout(player) {
                        player.rbNode.classList.add('hidden');
                    },
                    250,
                    this
                );
            }
            function setLaps(lap, laps) {
                return lap + '/' + laps;
            }
            function update() {
                this.distanceNode.textContent = Math.abs(this.distance);
                if (
                    this.distance < 0
                ) {
                    this.node.classList.add('ahead');
                } else {
                    this.node.classList.remove('ahead');
                }
            }
            function win() {
                this.faceNode.textContent = 'NIKA';
            }
        }(
            m.get('engine')
        )
    )
);
