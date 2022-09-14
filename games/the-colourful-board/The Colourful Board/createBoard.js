const createBoard = (size) => {
    let board;
    const players = [];

    const clear = () => {
        board = Array(size).fill().map(() => Array(size).fill(null));
    }

    const getBoard = () => {
        return board;
    };

    const makeTurn = (x,y,color) => {
        if (board[y][x] === null) {
            board[y][x] = color;
            return {'isValid': true, 'isWinningTurn': isWinningTurn(x,y)}
        }
        return {'isValid': false};
    }

    const registerPlayer = (playerName, color) => {
        players.push({
            name: playerName,
            color: color
        });
    }

    const inBounds = (x,y) => {
        return y >= 0 && y < board.length && x >= 0 && x < board[y].length;
    }

    const numMatches = (x, y, dx, dy) => {
        let i = 1;
        while (inBounds(x + i*dx, y + i*dy) && board[y + i*dy][x+ i*dx] === board[y][x]) {
            i++;
        }
        return i - 1;
    }

    const isWinningTurn = (x,y) => {
        for (let dx = -1; dx <2; dx++) {
            for (let dy = -1; dy <2; dy++) {
                if (dx === 0 && dy === 0) {
                    continue;
                }

                const count = numMatches(x, y, dx, dy) + numMatches(x, y, -dx, -dy) + 1;
                if (count >= 5) {
                    return true;
                }
            }
        }
        return false;
    }

    clear();
    return {clear, getBoard, makeTurn, registerPlayer};
}

module.exports = createBoard;