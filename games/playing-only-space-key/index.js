const wordKind = ["#", "$", "%", "&", "?"];
const space = "　";

let answer;
let spaceCount;
let roundCount = 1;
let questionWordCount;
let questionWord;
let questionSentence;
let slideSpeed = 200;
let countDown;
let control = "nextRound";
let record = 0;

window.onkeydown = (event) => {
    if (event.keyCode === 32) {
        if (control === "nextRound") {
            control = "";
            spaceCount = 0;
            countDown = 2
            document.getElementById("count").textContent = spaceCount;
            round()
        } else if (control === "spaceCount") {
            spaceCount += 1
            document.getElementById("count").textContent = spaceCount;
        }
    }
}

const round = () => {
    document.getElementById("word").textContent = "Round " + roundCount;

    countDown -= 1;

    if (countDown == -2) {
        countDown = "";
        question();
    } else {
        setTimeout("round()", 1000);
    }

}

const question = () => {
    questionWordCount = Math.floor(Math.random() * 6) + 4;
    questionSentence = "" // default word start position
    answer = 0;

    for (let i = 0; i < questionWordCount; i++) {
        const charactersNumver = Math.floor(Math.random() * 6) + 1;
        questionWord = "";
        for (let n = 0; n < charactersNumver; n++) {
            questionWord = questionWord + wordKind[Math.floor(Math.random() * 4)];
        }
        questionSentence += space + questionWord;
    }

    answer = questionWordCount - 1;
    countDown = 3;
    startTimer();
}

const startTimer = () => {
    countDown <= 0 ? (
        document.getElementById("word").textContent = 'Start!!'
    ) : (
        document.getElementById("word").textContent = countDown
    )

    countDown -= 1;

    if (countDown == -2) {
        countDown = "";
        control = "spaceCount";
        document.getElementById("word").textContent = questionSentence;
        slide();
    } else {
        setTimeout("startTimer()", 1000);
    }
}

const slide = () => {
    const word = document.getElementById('word').textContent;
    const textdisplay = word.substring(1, word.length);

    document.getElementById("word").textContent = textdisplay;

    if (textdisplay === "") {
        countDown = 5;
        timeUpTimer();
    } else {
        setTimeout("slide()", slideSpeed);
    }
}

const timeUpTimer = () => {
    countDown <= 0 ? (
        control = "",
        document.getElementById("word").textContent = 'Time Up!!'
    ) : (
        document.getElementById("word").textContent = countDown
    )

    countDown -= 1;

    if (countDown === -3) {
        countDown = 6;
        correcAtnswer();
    } else {
        setTimeout("timeUpTimer()", 1000);
    }
}

const correcAtnswer = () => {
    countDown >= 3 ? (
        document.getElementById("word").textContent = "Answer is..."
    ) : (
        document.getElementById("word").textContent = "Answer is " + answer
    )

    countDown -= 1;

    if (countDown === -2) {
        countDown = "";
        next();
    } else {
        setTimeout("correcAtnswer()", 1000);
    }
}

const next = () => {
    if (spaceCount === answer) {
        roundCount += 1
        slideSpeed *= 0.8
        document.getElementById("word").textContent = "Next Round >>";
    } else {
        document.getElementById("word").textContent = "Game Over! score: " + (roundCount - 1);
        if (record < roundCount - 1){
            record = roundCount - 1;
            document.getElementById("record").textContent = "record: " + record;
        }
        roundCount = 1;
        slideSpeed = 200;
    }
    control = "nextRound";
}
