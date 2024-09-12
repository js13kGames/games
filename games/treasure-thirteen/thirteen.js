let board = [];
let rows = 8;
let columns = 8;

let minesCount = 13;
let minesLocation = [];
let treasureLocation = [];

let tilesClicked = 0;
let flagEnabled = false;

let lives = 3;
let gameOver = false;

window.onload = function() {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function setTreasures() {
    let treasuresLeft = 10;
    while (treasuresLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id) && !treasureLocation.includes(id)) {
            treasureLocation.push(id);
            treasuresLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = "Mines left: " + minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("restart-button").style.display = "none";
    lives = 3;
    gameOver = false;
    minesLocation = [];
    treasureLocation = [];
    board = [];
    tilesClicked = 0;
    document.getElementById("lives").innerText = "Lives: " + lives;

    setMines();
    setTreasures();

    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = ''; // Clear previous board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", clickTile);
            boardDiv.append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        } else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (treasureLocation.includes(tile.id)) {
        tile.innerText = "💰";  // Gold/Silver coin icon
        tile.classList.add("treasure-found");
        lives += 1;
        document.getElementById("lives").innerText = `Lives: ${lives}`;
        return;
    }

    if (minesLocation.includes(tile.id)) {
        lives -= 1;
        tile.innerText = "💥";  // Explosion icon
        tile.classList.add("mine-hit");
        document.getElementById("lives").innerText = `Lives: ${lives}`;

        if (lives <= 0) {
            gameOver = true;
            document.getElementById("mines-count").innerText = "Game Over";
            revealMines();
            document.getElementById("restart-button").style.display = "block";
            document.getElementById("restart-button").addEventListener("click", startGame);
            return;
        }
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let treasuresFound = 0;

    treasuresFound += checkTile(r-1, c-1);
    treasuresFound += checkTile(r-1, c);
    treasuresFound += checkTile(r-1, c+1);
    treasuresFound += checkTile(r, c-1);
    treasuresFound += checkTile(r, c+1);
    treasuresFound += checkTile(r+1, c-1);
    treasuresFound += checkTile(r+1, c);
    treasuresFound += checkTile(r+1, c+1);

    // Just show an empty space, no numbers
    board[r][c].innerText = "";
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (treasureLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
