'use strict';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const shipImage = document.createElement('img');
shipImage.src = './ship.png';
const tilesImage = document.createElement('img');
tilesImage.src = './tiles.png';
shipImage.addEventListener('load', () => {
    // TODO Implement a better loading system
});
tilesImage.addEventListener('load', () => {
    mainLoop();
});

document.getElementById('restartButton').addEventListener('click', (event) => {
    event.stopPropagation();
    socket.emit('restart');
});

let allowRestartFlag = false;

function allowRestart() {
    document.getElementById('restartButtonDiv').style = '';
    allowRestartFlag = true;
}

setTimeout(allowRestart, 30000);

function mainLoop() {
    ctx.beginPath();
    ctx.fillStyle = '#63caf5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (raceStartTime) {
        const time = Date.now() - raceStartTime;
        const position = player.getPosition(time);
        ctx.save();
        ctx.translate(-position + 200, 0);
        drawMap();
        
        ctx.fillStyle = '#0341ae';
        for (const bump of track.bumps) {
            ctx.fillRect(bump.start, 24, bump.length, 300);
        }

        ctx.strokeStyle = '#090';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();
        ctx.strokeStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(track.length + 10, 0);
        ctx.lineTo(track.length + 10, canvas.height);
        ctx.stroke();
        players.forEach((p, i) => {
            if (!p.track) return;
            const pos = p.getPosition(time);
            ctx.drawImage(shipImage, pos - 10, 32 + i * 16, 16, 16);
        });
        ctx.restore();
    }
    requestAnimationFrame(mainLoop);
}

function drawMap() {
    for (let i = -6; i < 100; i++) {
        ctx.drawImage(tilesImage, 128, 128 + 64, 64, 64, i*66, 0, 64, 64);
    }
}

let socket;
let track;
let player;
let raceStartTime;

let players = [];

function addPlayer(track, userId, name = 'You') {
    const player = new Player(track, userId === undefined, userId, name);
    players.push(player);
    return player;
}

function removePlayer(userId) {
    const pos = players.findIndex(p => p.id === userId);
    players.splice(pos, 1);
}

window.addEventListener('keypress', (event) => {
    if (event.key === 'r' && allowRestartFlag) {
        socket.emit('restart');
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault();
    }
});

function handleKeyDown(event) {
    if (event.key === ' ') {
        const time = Date.now() - raceStartTime;
        player.press(time);
    }
}

function handleKeyUp(event) {
    if (event.key === ' ') {
        const time = Date.now() - raceStartTime;
        player.release(time);
    }
}

function handlePointerDown() {
    const time = Date.now() - raceStartTime;
    player.press(time);
}

function handlePointerUp(event) {
    const time = Date.now() - raceStartTime;
    player.release(time);
}

function allowInputs() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
}

function disallowInputs() {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('pointerup', handlePointerUp);
}

class Track {
    constructor(length = 100) {
        this.length = length;
        this.bumps = [];
        for (let index = 1; index < Math.floor(length / 100); index++) {
            this.bumps.push({
                start: index * 100,
                length: 30,
            });
        }
    }

    isBump(position) {
        return this.bumps.some((bump) => (
            position >= bump.start && position <= bump.start + bump.length
        ));
    }
}

class Player {
    constructor(track, local=true, id=undefined, name='unknown') {
        this.id = id;
        this.track = track;
        this.changes = [];
        this.isDown = false;
        this.local = local;
        this.timeoutForNext = null;
        this.finishTime = null;
        this.name = name;
    }

    reset(track) {
        this.track = track;
        this.changes = [];
        this.isDown = false;
        if (this.timeoutForNext) {
            clearTimeout(this.timeoutForNext);
        }
        this.timeoutForNext = null;
        this.finishTime = null;
    }

    finish(time) {
        if (!this.track) return;
        this.finishTime = time;
        setMessage(`Player ${this.name} finished with ${(time / 1000).toFixed(2)} s.`);
    }

    addMovementEvent(change) {
        if (!this.track) return;
        if (this.finishTime) return;
        this.changes.push(change);
        if (this.local) {
            socket.emit('movement', change);

            this.setTimeoutForNext();
        }
    }

    setTimeoutForNext(time) {
        if (!this.track) return;
        if (this.timeoutForNext) {
            clearTimeout(this.timeoutForNext);
        }
        const next = player.getNextChange(time || this.lastChange.time);
        const nextTime = player.whenWillIbethere(next.position)
        const deltaTime = nextTime - (Date.now() - raceStartTime);
        this.timeoutForNext = setTimeout(() => {
            if (next.type === 'bumpstart' && this.isDown) {
                this.addMovementEvent({
                    time: nextTime,
                    position: next.position,
                    speed: 0.003,
                });
            } else if (next.type === 'finish') {
                this.addMovementEvent({
                    time: nextTime,
                    position: next.position,
                    speed: 0.01,
                });
                disallowInputs();
                socket.emit('finish', nextTime);
                this.finishTime = nextTime;
                console.log('You finished');
            }
            if (next.type !== 'finish') {
                this.setTimeoutForNext(nextTime);
            }
        }, deltaTime);
    }

    press(timestamp) {
        if (!this.track) return;
        if (timestamp < 0 || player.finishTime) return;
        if (this.isDown) return;
        this.isDown = true;
        const position = this.getPosition(timestamp);
        const change = {
            time: timestamp,
            position,
            speed: this.track.isBump(position) ? 0.005 : 0.04,
        };
        this.addMovementEvent(change);
    }

    release(timestamp) {
        if (!this.track) return;
        if (timestamp < 0 || player.finishTime) return;
        if (!this.isDown) return;
        this.isDown = false;
        const position = this.getPosition(timestamp);
        const change = {
            time: timestamp,
            position,
            speed: 0.01,
        };
        this.addMovementEvent(change);
    }

    get lastChange() {
        if (this.changes.length === 0) {
            return {
                time: 0,
                position: 0,
                speed: 0.01,
            };
        }
        return this.changes[this.changes.length - 1];
    }

    whenWillIbethere(target) {
        const deltaLength = target - this.lastChange.position;
        const speed = this.lastChange.speed;
        return deltaLength / speed + this.lastChange.time;
    }

    getNextChange(timestamp) {
        const position = this.getPosition(timestamp);
        const finish = this.track.length;
        const nextBumpStart = (this.track.bumps.find((bump) => (
            position < bump.start
        )) || {}).start || finish + 1;
        const nextBumpEndBump = this.track.bumps.find((bump) => (
            position < bump.start + bump.length
        ));
        const nextBumpEnd = nextBumpEndBump ? nextBumpEndBump.start + nextBumpEndBump.length : finish + 1;
        if (nextBumpStart < finish || nextBumpEnd < finish) {
            if (nextBumpStart < nextBumpEnd) {
                return {
                    position: nextBumpStart,
                    type: 'bumpstart',
                };
            } else {
                return {
                    position: nextBumpEnd,
                    type: 'bumpend',
                };
            }
        }
        return {
            position: finish,
            type: 'finish',
        };
    }

    getPosition(timestamp) {
        const delta = timestamp - this.lastChange.time;
        if (this.finishTime) {
            return this.track.length + Math.min(delta * this.lastChange.speed, 48);
        }
        return this.lastChange.position + delta * this.lastChange.speed;
    }
}

function setMessage(text) {
    document.getElementById('message').innerText = text;
}

function displayHighscore(highscore) {
    const highscoreDiv = document.getElementById('highscore');
    const tbody = highscoreDiv.querySelector('tbody');
    while (tbody.firstChild && tbody.removeChild(tbody.firstChild));
    highscore.forEach((entry, index) => {
        const tr = document.createElement('tr');
        const place = document.createElement('td');
        const name = document.createElement('td');
        const time = document.createElement('td');
        place.innerText = `#${index + 1}`;
        name.innerText = `${entry.name}`;
        time.innerText = `${(entry.finishTime/1000).toFixed(2)} s`;
        tr.appendChild(place);
        tr.appendChild(name);
        tr.appendChild(time);
        tbody.appendChild(tr);
    });
    highscoreDiv.style = '';
}

/**
 * Binde Socket.IO and button events
 */
function bind() {

    socket.on('start', (length) => {
        track = new Track(length);
        raceStartTime = Date.now() + 5000;
        players.forEach(p => p.reset(track));
        setMessage('New race about to start!');
        setTimeout(() => { setMessage('3'); }, 2000);
        setTimeout(() => { setMessage('2'); }, 3000);
        setTimeout(() => { setMessage('1'); }, 4000);
        setTimeout(() => {
            setMessage('GO!');
            allowInputs();
            player.setTimeoutForNext(0);
        }, 5000);
    });

    socket.on('joined', (id, name) => {
        setMessage(`Player ${name} joined.`);
        addPlayer(null, id, name);
    });

    socket.on('userFinished', (id, time) => {
        const player = players.find(p => p.id === id);
        if (player) {
            player.finish(time);
        } else {
            console.error(`Unknown player ${id} finished.`);
        }
    });

    socket.on('you', (id, name) => {
        player.id = id;
        player.name = name;
        setMessage(`Connected. Your name is ${name}.`);
        if (players.length === 1) {
            allowRestart();
        }
    });

    socket.on('left', (id) => {
        const player = players.find(p => p.id === id);
        setMessage(`Player ${player.name} left.`);
        removePlayer(id);
        if (players.length === 1) {
            allowRestart();
        }
    });

    socket.on('movement', (id, movement) => {
        players.find(p => p.id === id).addMovementEvent(movement);
    });

    socket.on('highscore', (highscore) => {
        displayHighscore(highscore);
        allowRestart();
    });

    socket.on('connect', () => {
        players = [player];
        setMessage('Connected.');
    });

    socket.on('disconnect', () => {
        players = [];
        setMessage('Connection lost!');
    });

    socket.on('error', () => {
        players = [];
        setMessage('Connection error!');
    });
}

setMessage('Waiting for the next race to start…');
player = addPlayer(track);

/**
 * Client module init
 */
function init() {
    socket = io({ upgrade: false, transports: ['websocket'] });
    bind();
}

window.addEventListener('load', init, false);
