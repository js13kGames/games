"use strict";

let server = null;
let dinos = [];

function cycle() {
    if (server === null)
        return;
    server.emit("dinos", dinos);
}

setInterval(function () {
    cycle();
}, 20);


module.exports = {
    io: (socket) => {
        if (server === null) {
            server = socket.server;
        }

        socket.emit("seed", socket.id);

        socket.on("born", function (dino) {
            dinos.push(dino);
        });

        socket.on("move", function (dino) {
            let i = dinos.map(function (dino) {
                return dino.id;
            }).indexOf(socket.id);
            if (i !== -1) {
                dinos[i] = dino;
            }
        });

        socket.on("disconnect", function () {
            let i = dinos.map(function (dino) {
                return dino.id;
            }).indexOf(socket.id);
            if (i !== -1) {
                dinos.splice(i, 1);
            }
        });
    }
};
