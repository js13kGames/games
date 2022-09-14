console.log('hello world');

const renderPlayerNames = (players) => {
    console.log('players: ', players);
}
const log = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
}

const onChatSubmitted = (sock) => (e) => {
    e.preventDefault();
    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
}

const getBoard = (canvas, numCells = 20) => {

    const ctx = canvas.getContext('2d');
    const cellSize = Math.floor(canvas.width/numCells);

    const fillCell = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.stroke();
    }

    const drawGrid = () => {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        for (let i=0; i <numCells + 1; i++) {
            ctx.moveTo(i*cellSize, 0);
            ctx.lineTo(i*cellSize, cellSize*numCells);
            ctx.moveTo(0, i*cellSize);
            ctx.lineTo(cellSize*numCells, i*cellSize);
        }
        ctx.stroke();
    };

    const clear = () => {
        ctx.clearRect(0,0, canvas.width, canvas.height);
    }

    const renderBoard = (board = []) => {
        board.forEach((row, y) => {
            row.forEach((color, x) => {
                color && fillCell(x,y,color);
            });
        });
    }
    const reset = (board) => {
        clear();
        drawGrid();
        renderBoard(board);
    }

    const getCellCoordinates = (x, y) => {
        return {
            x: Math.floor(x/cellSize),
            y: Math.floor(y/cellSize)
        }
    }

    return { fillCell, reset, getCellCoordinates };

}

const getClickCoordinates = (element, event) => {
    const { top, left } = element.getBoundingClientRect();
    const { clientX, clientY} = event;

    return {
        x: clientX - left,
        y: clientY - top
    };
};

const getPlayerName = () =>   {
    let playerName;
    var person = prompt("Please enter your name:", "");
    if (person == null || person == "") {
        playerName = `player_${randomPlayerName(5)}`;
    } else {
        playerName = person;
    }
    return playerName;
} 

const randomPlayerName = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

(() => {
    const canvas = document.querySelector('canvas');
    const {fillCell, reset, getCellCoordinates} = getBoard(canvas);

    reset();
    const playerName = getPlayerName();
    console.log('playerName:- ', playerName)
    const sock = io();
    sock.emit('message', `${playerName}#Joined!`);

    const onClick = (e) => {
        const {x, y} = getClickCoordinates(canvas, e);
        sock.emit('turn', getCellCoordinates(x,y));
    }

    sock.on('board', (board) => {
        console.log('board:- ', board);
        reset(board);
        //renderPlayerNames(gameInfo.players);
    });
    sock.on('message', log);
    sock.on('turn', ({x,y, color}) =>fillCell(x,y, color));
    document.querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));

    canvas.addEventListener('click', onClick);
})()