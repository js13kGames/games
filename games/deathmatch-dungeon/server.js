"use strict";

const items = [];
const itemSpawnPoints = [{x: 16, y: 88},{x: 208, y:80},{x: 288, y: 80}, {x: 480, y: 88},{x: 16, y: 464},{x: 208, y:472},{x: 288, y:472},{x: 480, y: 464}];
let chat = [];
const maxChats = 20;
const maxChatChars = 60;
let timer = null;

let match = {
    launchTime: 0,
    startTime: 0
}

let results = [];

/**
 * Server game loop
 */
function gameUpdate() {
    // On first call there are no items so spawn one at each spawn point
    if (!items.length) itemSpawnPoints.forEach((spawnPoint, i) => {
        items.push({
            id: i,
            type: (Math.random() < 0.5) ? 1 : Math.floor(Math.random() * 5) + 2,
            x: spawnPoint.x,
            y: spawnPoint.y,
            time: Date.now()
        });
    });
    // If an item spawn point is empty and a fixed time has passed then spawn a random item there
    items.forEach(item => {
        if (item.type == 0 && Date.now() > item.time + 5000) item.type = (Math.random() < 0.5) ? 1 : Math.floor(Math.random() * 5) + 2;
    });
    io.sockets.emit('itemUpdate', items);

    if (chat[0] && chat[0].time + 15000 < Date.now()) {
        chat.splice(0, 1);
        io.sockets.emit('chat', chat.map(i => i.txt));
    }

    if (timer == null) timer = setInterval(gameUpdate, 5000);
}

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

    io: (socket) => {
        gameUpdate();

        socket.on("disconnect", () => {
            io.sockets.emit('playerDisconnect', socket.id);
        });

        socket.on("removeRunes", () => {
            io.sockets.emit('removeRunes', socket.id);
        });

        socket.on("addRune", (rune) => {
            io.sockets.emit('addRune', socket.id, rune);
        });

        socket.on("addProjectile", (projectile) => {
            io.sockets.emit('addProjectile', socket.id, projectile);
        });

        socket.on("matchUpdate", (newMatch) => {
            match = Object.assign(match, newMatch);
        });

        socket.on("getMatchStatus", () => {
            if (match.launchTime > 0 || match.startTime > 0) io.sockets.emit('setMatchStatus', socket.id, match);
        });

        socket.on("claimItem", (id, type) => {
            let i = items.findIndex(o => {
                return o.id === id;
            });
            if (i !== -1) {
                items[i].time = Date.now();
                items[i].type = 0;
            }
            io.sockets.emit('claimItem', type, socket.id);
            io.sockets.emit('itemUpdate', items);
        });

        socket.on("stateUpdate", (player) => {
            io.sockets.emit('stateUpdate', player);
        });
        
        socket.on("chat", (type, updateTxt, user = "") => {
            updateTxt = updateTxt.substring(0, maxChatChars + 1);
            updateTxt = type + ((type == 0) ? user + ": " : "") + updateTxt;
            if (chat.push({txt: updateTxt, time: Date.now()}) > maxChats) chat.splice(0, 1);
            io.sockets.emit('chat', chat.map(i => i.txt));
        });
        
        socket.on("startMatch", () => {
            results.length = 0;
            io.sockets.emit('startMatch');
        });

        socket.on("getResults", () => {
            io.sockets.emit('getResults', results);
        });

        socket.on("addFrag", (id, username, deadId, deadUsername) => {
            io.sockets.emit('addFrag', id, deadUsername);
            // Increase score of attacker
            if (!results.some(e => { if (e.id === id) { e.score++; return true; }})) {
                results.push({id: id, username: username, score: 1, deaths: 0});
            }
            // Increase deaths of dead player
            if (!results.some(e => { if (e.id === deadId) { e.deaths++; return true; }})) {
                results.push({id: deadId, username: deadUsername, score: 0, deaths: 1});
            }
        });
        
    },

};
