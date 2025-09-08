const puzzle = document.getElementById('puzzle');
const message = document.getElementById('message');
const shuffleButton = document.getElementById('shuffle-button');

let tiles = [];

function initPuzzle() {
    tiles = [...Array(15).keys()].map(n => n + 1);
    tiles.push(""); // empty slot
    shuffleTiles();
    drawPuzzle();
    message.textContent = "Arrange the cat picture!";
}

function shuffleTiles() {
    do {
        tiles.sort(() => Math.random() - 0.5);
    } while (!isSolvable(tiles) || isSolved());
}

function drawPuzzle() {
    puzzle.innerHTML = '';
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');

        if (tile === "") {
            tileElement.classList.add('empty');
        } else {
            const x = (tile - 1) % 4;
            const y = Math.floor((tile - 1) / 4);
            tileElement.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;
            tileElement.addEventListener('click', () => moveTile(index));
        }

        puzzle.appendChild(tileElement);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf("");
    const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 4, emptyIndex + 4];

    if (index === emptyIndex - 1 && emptyIndex % 4 === 0) return; // left edge
    if (index === emptyIndex + 1 && emptyIndex % 4 === 3) return; // right edge

    if (validMoves.includes(index)) {
        [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
        drawPuzzle();
        checkWin();
    }
}

function checkWin() {
    const winState = [...Array(15).keys()].map(n => n + 1).concat("");
    if (JSON.stringify(tiles) === JSON.stringify(winState)) {
        message.textContent = "🎉 Congratulations! You solved the puzzle!";
    }
}

function isSolvable(arr) {
    let invCount = 0;
    const puzzleArr = arr.filter(n => n !== "");
    for (let i = 0; i < puzzleArr.length; i++) {
        for (let j = i + 1; j < puzzleArr.length; j++) {
            if (puzzleArr[i] > puzzleArr[j]) invCount++;
        }
    }
    const emptyRow = Math.floor(arr.indexOf("") / 4) + 1;
    return (invCount + emptyRow) % 2 === 0;
}

function isSolved() {
    const winState = [...Array(15).keys()].map(n => n + 1).concat("");
    return JSON.stringify(tiles) === JSON.stringify(winState);
}

shuffleButton.addEventListener('click', initPuzzle);

// start game
initPuzzle();
