const TOMATO_CLASS = "tomato";
const ORANGE_CLASS = "orange";

function space() {
  for (var i = 1; i <= 12; i++) {
    const x = document.getElementById(`${i}`);
    x.innerHTML = `<img src="" alt="">`;
    x.innerHTML;
  }
}

function tomato(fruitId) {
  const x = document.getElementById(`${fruitId}`);
  x.innerHTML = `<img src="https://img.icons8.com/plasticine/100/000000/tomato.png" alt="">`;
  return x.innerHTML;
}

function orange(fruitId) {
  const x = document.getElementById(`${fruitId}`);
  x.innerHTML = `<img src="https://img.icons8.com/plasticine/100/000000/orange.png" alt="">`;
  return x.innerHTML;
}
function O() {
  var oImg = document.createElement("img");
  oImg.setAttribute(
    "src",
    "https://img.icons8.com/plasticine/100/000000/orange.png"
  );
  oImg.setAttribute("alt", "na");
  document.getElementById("O").appendChild(oImg);
}

function T() {
  var oImg = document.createElement("img");
  oImg.setAttribute(
    "src",
    "https://img.icons8.com/plasticine/100/000000/tomato.png"
  );
  oImg.setAttribute("alt", "na");
  document.getElementById("T").appendChild(oImg);
}

function finalCode() {
  if (!tomatoTurn) {
    var tImg = document.createElement("img");
    tImg.setAttribute(
      "src",
      "https://img.icons8.com/plasticine/100/000000/tomato.png"
    );
    tImg.setAttribute("alt", "na");
    document.getElementById("colorCode").appendChild(tImg);
  } else {
    var oImg = document.createElement("img");
    oImg.setAttribute(
      "src",
      "https://img.icons8.com/plasticine/100/000000/orange.png"
    );
    oImg.setAttribute("alt", "na");
    document.getElementById("colorCode").appendChild(oImg);
  }
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [1, 2, 3],
  [4, 5, 6],
  [5, 6, 7],
  [8, 9, 10],
  [9, 10, 11],
  [0, 4, 8],
  [1, 5, 9],
  [2, 6, 10],
  [3, 7, 11],
  [1, 6, 11],
  [0, 5, 10],
  [3, 6, 9],
  [2, 5, 8],
];
const board = document.getElementById("board");
const cellElements = document.querySelectorAll("[data-cell]");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
let tomatoTurn;
var x = document.getElementById("pop");

function pop() {
  x.play();
}

startGame();

restartButton.addEventListener("click", startGame);
function startGame() {
  tomatoTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(TOMATO_CLASS);
    cell.classList.remove(ORANGE_CLASS);
    space();
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

cellElements.forEach((cell) => {
  cell.addEventListener("click", handleClick, { once: true });
});

function handleClick(e) {
  const cell = e.target;
  const currentClass = tomatoTurn ? ORANGE_CLASS : TOMATO_CLASS;
  pop();
  placeMark(cell, currentClass, cell.id);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = `Draw!`;
  } else {
    score(tomatoTurn);
    winningMessageTextElement.innerHTML = `${
      tomatoTurn ? "Orange" : "Tomato"
    } Won!. But the final code doesn't match the Farm Code Database(404 Error). Try New combination.`;
  }
  winningMessageElement.classList.add("show");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(TOMATO_CLASS) ||
      cell.classList.contains(ORANGE_CLASS)
    );
  });
}

function placeMark(cell, currentClass, id) {
  currentClass === ORANGE_CLASS ? orange(id) : tomato(id);
  cell.classList.add(currentClass);
}

function swapTurns() {
  tomatoTurn = !tomatoTurn;
}

function setBoardHoverClass() {
  board.classList.remove(TOMATO_CLASS);
  board.classList.remove(ORANGE_CLASS);

  if (tomatoTurn) {
    board.classList.add(ORANGE_CLASS);
  } else {
    board.classList.add(TOMATO_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function score(tomatoTurn) {
  if (!tomatoTurn) {
    T("T");
    finalCode();
  } else {
    O("O");
    finalCode();
  }
}
