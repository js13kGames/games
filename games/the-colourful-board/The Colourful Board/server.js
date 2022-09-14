const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomColor = require('randomcolor');
const createBoard = require('./createBoard');
const createCoolDown = require('./createCoolDown');
const app = express();


app.use(express.static(`${__dirname}/client`));

const server = http.createServer(app);

const io = socketio(server);
const {clear, getBoard, makeTurn, registerPlayer} = createBoard(20);
io.on('connection', (sock)=> {
    let color = randomColor();
    //do not let the color same as board background color
    if (color === '#fff8dc') {
        color = randomColor();
    }
    let playerName = null;
    const cooldown = createCoolDown(2000);
    sock.emit('board', getBoard());

    sock.on('message', (text) => {
        splitterText = text.split('#');
        if (splitterText.length > 1) {
            playerName = splitterText[0];
            registerPlayer(playerName, color);
            text = playerName + ' ' + splitterText[1];
        }
        io.emit('message', text)
    });

    sock.on('turn', ({x,y}) => {
        if (cooldown()) {
            const turnObj = makeTurn(x,y,color);
            const playerWon = turnObj.isWinningTurn;
            if (turnObj.isValid) {
                io.emit('turn', {x,y,color});
            }
    
            if (playerWon) {
                sock.emit('message', 'Congratulations!');
                io.emit('message', `${playerName} won!`);
                io.emit('message', 'New Round');
                clear();
                io.emit('board', getBoard());
            }
        }
    });
});


server.on('error', (err) => {
    console.error('Error: ', err);
})
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log('Server is running...');
})