const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const exitButton = document.querySelector('.exit-button');
const levelButtons = document.querySelector('.level-buttons');
const storyButton = document.querySelector('.story-button');
const readStory = document.getElementById('read-story');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2 + 50;
const radius = 20;
const spacing = 20;
let circleData = [];
let guessLimit;
let guessCount = 0;
let aiGuessCount = 0;
let score = 1;
let selectedMode = "Fun";
let timerInterval;
let aiScore = 1;
let aiGuesses = [];
let playerGuesses = [];

const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
let confettiPieces = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

class ConfettiPiece {
    constructor() {
        this.x = randomRange(0, confettiCanvas.width);
        this.y = randomRange(-confettiCanvas.height, 0);
        this.size = randomRange(5, 10);
        this.velocityX = randomRange(-2, 2);
        this.velocityY = randomRange(2, 5);
        this.color = `hsl(${randomRange(0, 360)}, 100%, 50%)`;
        this.rotation = randomRange(0, Math.PI * 2);
        this.rotationSpeed = randomRange(0.02, 0.05);
    }

    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation);
        confettiCtx.fillStyle = this.color;
        confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        confettiCtx.restore();
    }

    update() {
        this.velocityX += gravity;
        this.velocityY = Math.min(this.velocityY, terminalVelocity);
        this.velocityX *= (1 - drag);
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.rotation += this.rotationSpeed;
        if (this.x >= confettiCanvas.width || this.x <= 0) {
            this.velocityX *= -1;
        }
        if (this.y > confettiCanvas.height) {
            this.x = randomRange(0, confettiCanvas.width);
            this.y = randomRange(-confettiCanvas.height, 0);
            this.velocityX = randomRange(-2, 2);
            this.velocityY = randomRange(2, 5);
        }
    }
}

for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push(new ConfettiPiece());
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(confetti => {
        confetti.update();
        confetti.draw();
    });
    requestAnimationFrame(animateConfetti);
}

function startConfetti() {
    confettiCanvas.style.display = 'block';
    animateConfetti();
}

function stopConfetti() {
    setTimeout(() => {
        confettiCanvas.style.display = 'none';
    }, 5000);
}

function drawCircle(circle, fillStyle, strokeStyle, textColor) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    if (circle.visible) {
        ctx.fillStyle = textColor;
        ctx.fillText(circle.number, circle.x, circle.y);
    }
}

function drawCenteredSquare(numCircles, maxNum, fill, stroke) {
    const circlePositions = [];
    const usedNumbers = new Set();
    circleData = [];
    switch(numCircles) {
        case 13:
            circlePositions.push(
                { x: centerX, y: centerY, fill: "#F1F08A", stroke: "#C6CD78" },
                { x: centerX, y: centerY - 50, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX + 50, y: centerY, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX, y: centerY + 50, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX - 50, y: centerY, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX, y: centerY - 100, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 50, y: centerY - 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 100, y: centerY, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 50, y: centerY + 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX, y: centerY + 100, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 50, y: centerY + 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 100, y: centerY, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 50, y: centerY - 50, fill: "#F4E557", stroke: "#F5A855" }
            );
            break;
        case 25:
            fill = "#EEC89F";
            stroke = "#EA5FF2D";
            circlePositions.push(
                { x: centerX, y: centerY, fill: "#F1F08A", stroke: "#C6CD78" },
                { x: centerX, y: centerY - 50, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX + 50, y: centerY, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX, y: centerY + 50, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX - 50, y: centerY, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX, y: centerY - 100, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 50, y: centerY - 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 100, y: centerY, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 50, y: centerY + 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX, y: centerY + 100, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 50, y: centerY + 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 100, y: centerY, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 50, y: centerY - 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX, y: centerY - 150, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 50, y: centerY - 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 100, y: centerY - 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 150, y: centerY, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 100, y: centerY + 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 50, y: centerY + 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX, y: centerY + 150, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 50, y: centerY + 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 100, y: centerY + 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 150, y: centerY, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 100, y: centerY - 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 50, y: centerY - 100, fill: "#EEC89F", stroke: "#EA5FF2D" }
            );
            break;
        case 41:
            fill = "#FFCCCC";
            stroke = "#FB7777";
            circlePositions.push(
                { x: centerX, y: centerY, fill: "#F1F08A", stroke: "#C6CD78" },
                { x: centerX, y: centerY - 50, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX + 50, y: centerY, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX, y: centerY + 50, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX - 50, y: centerY, fill: "#FECEA8", stroke: "#FF847C" },
                { x: centerX, y: centerY - 100, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 50, y: centerY - 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 100, y: centerY, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX + 50, y: centerY + 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX, y: centerY + 100, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 50, y: centerY + 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 100, y: centerY, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX - 50, y: centerY - 50, fill: "#F4E557", stroke: "#F5A855" },
                { x: centerX, y: centerY - 150, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 50, y: centerY - 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 100, y: centerY - 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 150, y: centerY, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 100, y: centerY + 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX + 50, y: centerY + 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX, y: centerY + 150, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 50, y: centerY + 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 100, y: centerY + 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 150, y: centerY, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 100, y: centerY - 50, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX - 50, y: centerY - 100, fill: "#EEC89F", stroke: "#EA5FF2D" },
                { x: centerX, y: centerY - 200, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 50, y: centerY - 150, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 100, y: centerY - 100, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 150, y: centerY - 50, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 200, y: centerY, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 150, y: centerY + 50, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 100, y: centerY + 100, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX + 50, y: centerY + 150, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX, y: centerY + 200, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 50, y: centerY + 150, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 100, y: centerY + 100, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 150, y: centerY + 50, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 200, y: centerY, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 150, y: centerY - 50, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 100, y: centerY - 100, fill: "#FFCCCC", stroke: "#FB7777" },
                { x: centerX - 50, y: centerY - 150, fill: "#FFCCCC", stroke: "#FB7777" }
            );
            break;
        default:
            console.error("Unsupported number of circles");
            return;
    }
    const minNum = 1;
    if (maxNum - minNum + 1 < numCircles) {
        console.error("The range of numbers is too small to ensure unique values.");
        return;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px Arial";
    circlePositions.forEach((pos) => {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
        }
        while (usedNumbers.has(randomNumber));
        usedNumbers.add(randomNumber);
        circleData.push({
            x: pos.x,
            y: pos.y,
            radius: radius,
            number: randomNumber,
            visible: false
        });
        drawCircle(circleData[circleData.length - 1], pos.fill, pos.stroke);
    });
    updateScore();
    if (selectedMode === "Competitive") {
        updateAIScore();
    }
}

function updateScore() {
    ctx.clearRect(0, 0, canvas.width, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    if (selectedMode === "Competitive") {
        ctx.fillText(`[PLAYER] Score: ${score}`, 100, 20);
    } else {
        ctx.fillText(`Score: ${score}`, 100, 20);
    }
    ctx.fillText(`Guess Count: ${guessCount}`, canvas.width - 150, 20);
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    circleData.forEach(circle => {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
        if (distance < circle.radius) {
            if (!circle.visible) {
                circle.visible = true;
                drawCircle(circle, '#F1F08A', '#C6CD78', '#000');
                guessCount++;
                if (circle.number === 13) {
                    if (score > 130) {
                        score = score * 13 - guessCount;
                    } else {
                        score = score * 13;
                    }
                    winAlert();
                } else {
                    if (score > 130) {
                        score -= 10;
                    }
                }
            }
            updateScore();
            if (selectedMode === "Competitive") {
                aiGuess();
            }
        }
    });
}

function winAlert() {
    canvas.style.display = "block";
    readStory.style.display = "none";
    exitButton.style.display = "block";
    levelButtons.style.display = "none";
    storyButton.style.display = "none";
    ctx.fillStyle = "#EBC49F";
    ctx.strokeStyle = "#D37676";
    ctx.fillRect(centerX - 200, centerY - 100, 350, 100);
    ctx.strokeRect(centerX - 200, centerY - 100, 350, 100);
    ctx.fillStyle = "#FF6868";
    ctx.font = "24px Arial";
    ctx.fillText("YOU WIN \u{1F3C6}!!", centerX - 20, centerY - 80);
    ctx.fillText("You found the number 13 \u{1F3C5}!", centerX - 20, centerY - 50);
    ctx.fillText(`Within ${guessCount} guesses!`, centerX - 20, centerY - 20);
    canvas.removeEventListener('click', handleClick, false);
    if (selectedMode === "Challenge") {
        clearInterval(timerInterval);
    }
    if (selectedMode === "Competitive" || selectedMode === "Challenge") {
        startConfetti();
        stopConfetti();
    }
}

function gameOverAlert(guessBool, timerBool, aiBool) {
    canvas.style.display = "block";
    readStory.style.display = "none";
    exitButton.style.display = "block";
    levelButtons.style.display = "none";
    storyButton.style.display = "none";
    ctx.fillStyle = "#EBC49F";
    ctx.strokeStyle = "D37676";
    ctx.fillRect(centerX - 200, centerY - 100, 350, 100);
    ctx.strokeRect(centerX - 200, centerY - 100, 350, 100);
    ctx.fillStyle = "#FF6868";
    ctx.font = "24px Arial";
    ctx.fillText("GAME OVER \u{1F340}!", centerX - 20, centerY - 50);
    console.log(`Guess: ${guessBool}; Timer: ${timerBool}; AI: ${aiBool}`);
    if (guessBool && selectedMode === "Challenge") {
        ctx.font = "20px Arial";
        ctx.fillText("You've used all your guesses!", centerX - 20, centerY - 20);
    } else if (timerBool && selectedMode === "Challenge") {
        ctx.font = "20px Arial";
        ctx.fillText("Time's up!", centerX - 20, centerY - 20);
    } else if (aiBool && selectedMode === "Competitive") {
        ctx.font = "20px Arial";
        ctx.fillText("AI Wins! Better luck next time.", centerX - 20, centerY - 20);
    }
    canvas.removeEventListener("click", handleClick, false);
}

function startGame(levelNumber) {
    canvas.style.display = "block";
    readStory.style.display = "none";
    exitButton.style.display = "none";
    levelButtons.style.display = "none";
    storyButton.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    guessCount = 0;
    if (selectedMode === "Challenge") {
        handleChallengeMode(levelNumber);
    } else if (selectedMode === "Fun") {
        drawGameBoard(levelNumber);
    } else if (selectedMode === "Competitive") {
        aiGuessCount = 0;
        handleCompetitiveMode(levelNumber);
    }
    canvas.addEventListener("click", handleClick);
}

function viewStory() {
    canvas.style.display = "none";
    readStory.style.display = "block";
    exitButton.style.display = "block";
    levelButtons.style.display = "none";
    storyButton.style.display = "none";
    readStory.innerHTML = "";
    const paraStory1 = document.createElement("p");
    paraStory1.innerHTML += "The number \"13\" is the third centered square number.  In elementary number theory, a centered square number is a centered <a href='https://en.wikipedia.org/wiki/Figurate_number' class='link-3d-perspective'>figurate number</a> that gives the number of dots in a square with a dot in the center and all other dots surrounding the center dot in successive square layers.";
    paraStory1.innerHTML += "<span style='font-style: italic;'><a href='https://en.wikipedia.org/wiki/Centered_square_number' class='link-3d-push'>&laquo; Wikipedia &raquo;</a>";
    readStory.appendChild(paraStory1);
    const paraStory2 = document.createElement("p");
    paraStory2.innerHTML += "There is another part to this game I wish to continue with.  The number \"13\" is the second star number, still a centered <a href='https://en.wikipedia.org/wiki/Figurate_number' class='link-3d-perspective'>figurate number</a>, but a centered hexagram, which is a 6-pointed star, such as the Star of David, or the board <a href='https://en.wikipedia.org/wiki/Chinese_checkers' class='link-3d-perspective'>Chinese checkers</a>.";
    paraStory2.innerHTML += "<span style='font-style: italic;'><a href='https://en.wikipedia.org/wiki/Star_number' class='link-3d-push'>&laquo; Wikipedia &raquo;</a>"
    readStory.appendChild(paraStory2);
}

function handleChallengeMode(levelNumber) {
    let timer;
    if (levelNumber === 13) {
        timer = 10;
        guessLimit = 6;
    } else if (levelNumber === 25) {
        timer = 10;
        guessLimit = 12;
    } else if (levelNumber === 41) {
        timer = 30;
        guessLimit = 20;
    }
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            updateTimerDisplay(timer);
        } else {
            clearInterval(timerInterval);
            gameOverAlert(false, true, false);
        }
    }, 1000);
    drawGameBoard(levelNumber);
    console.log(levelNumber, guessLimit);
    canvas.addEventListener("click", function handleClick() {
        if (guessCount >= guessLimit) {
            clearInterval(timerInterval);
            gameOverAlert(true, false, false);
        }
    });
}

function handleCompetitiveMode(levelNumber) {
    drawGameBoard(levelNumber);
    canvas.addEventListener("click", handlePlayerGuess);
}

function handlePlayerGuess(event) {
    const clickedCircle = getClickedCircle(event);
    if (clickedCircle && !clickedCircle.visible) {
        playerGuesses.push(clickedCircle);
        guessCount++;
        clickedCircle.visible = true;
        drawCircle(clickedCircle, "#F1F08A", "#C6CD78", "#000");
        if (clickedCircle.number === 13) {
            canvas.removeEventListener("click", handlePlayerGuess);
            if (score > 130) {
                score = score * 13 - guessCount;
            } else {
                score *= 13;
            }
            winAlert();
        } else {
            if (score > 130)
                score -= 10;
        }
        updateScore();
    }
}

function aiGuess() {
    const availableCircles = circleData.filter(circle => !circle.visible && !aiGuesses.includes(circle));
    if (availableCircles.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCircles.length);
        const aiChosenCircle = availableCircles[randomIndex];
        aiGuesses.push(aiChosenCircle.number);
        aiGuessCount++;
        aiChosenCircle.visible = true;
        drawCircle(aiChosenCircle, '#FFAD60', '#D9534F', '#FFF');
        if (aiChosenCircle.number === 13) {
            canvas.removeEventListener("click", handlePlayerGuess);
            if (aiScore > 130) {
                aiScore = aiScore * 13 - aiGuessCount;
            } else {
                aiScore *= 13;
            }
            setTimeout(() => {
                gameOverAlert(false, false, true);
            }, 200);
        } else {
            if (aiScore > 130)
                aiScore -= 10;
        }
        updateAIScore();
    }
}

function updateTimerDisplay(time) {
    ctx.clearRect(0, 50, canvas.width, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`Timer: ${time}`, 70, 60);
}

function updateAIScore() {
    ctx.clearRect(0, 50, canvas.width, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`[AI] Score: ${aiScore}`, 100, 60);
    ctx.fillText(`Guess Count: ${aiGuessCount}`, canvas.width - 150, 60);
}

function getClickedCircle(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (const circle of circleData) {
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
        if (distance < circle.radius) {
            return circle;
        }
    }
    return null;
}

function drawGameBoard(levelNumber) {
    switch (levelNumber) {
        case 13:
            drawCenteredSquare(13, 13);
            break;
        case 25:
            drawCenteredSquare(25, 25);
            break;
        case 41:
            drawCenteredSquare(41, 41);
            break;
        default:
            console.error("Unsupported level!");
            return;
    }
}

function exitGame() {
    canvas.style.display = "none";
    readStory.style.display = "none";
    exitButton.style.display = "none";
    levelButtons.style.display = "block";
    storyButton.style.display = "block";
    if (selectedMode === "Challenge") {
        guessLimit = null;
    }
}

document.getElementById("selectMode").addEventListener("click", () => {
    const modeMenu = document.getElementById("modeMenu");
    modeMenu.style.display = modeMenu.style.display === "none" ? "block" : "none";
});

document.getElementById("modeChallenge").addEventListener("click", () => {
    selectedMode = "Challenge";
    document.getElementById("selectMode").textContent = "Mode: Challenge";
    document.getElementById("modeMenu").style.display = "none";
})

document.getElementById("modeFun").addEventListener("click", () => {
    selectedMode = "Fun";
    document.getElementById("selectMode").textContent = "Mode: Fun";
    document.getElementById("modeMenu").style.display = "none";
});

document.getElementById("modeCompetitive").addEventListener("click", () => {
    selectedMode = "Competitive";
    document.getElementById("selectMode").textContent = "Mode: Competitive";
    document.getElementById("modeMenu").style.display = "none";
});

document.getElementById('level1').addEventListener('click', () => startGame(13));
document.getElementById('level2').addEventListener('click', () => startGame(25));
document.getElementById('level3').addEventListener('click', () => startGame(41));
document.getElementById('story').addEventListener('click', viewStory);
document.getElementById('exit').addEventListener('click', exitGame);