window.onload = function () {
    //Modal
    let modal = document.getElementById("myModal");
    let span = document.querySelector(".close");

    modal.style.display = "block";

    span.addEventListener("click",function(){
        modal.style.display = "none";
    })

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


    let canvas = document.querySelector(".canvas"),
        game = document.querySelector(".game"),
        guessButton = document.querySelector(".guessButton"),
        slider = document.querySelector(".slider"),
        sliderValue = document.querySelector(".sliderValue"),
        time = document.querySelector(".time"),
        points = document.querySelectorAll(".points"),
        total = document.querySelectorAll(".total"),
        correctStatement = document.querySelector(".correctStatement"),
        correctAnswer = document.querySelector(".correctAnswer"),
        gameOverText = document.querySelector(".gameOverText"),
        playAgain = document.querySelector(".playAgain");

    canvas.width = 300;
    canvas.height = canvas.width;
    slider.style.width = canvas.width + "px";

    let cw = canvas.width,
        ch = canvas.height,
        w = 200,
        h = 200,
        space = 0,
        ans = space,
        circleRadius = 50,
        seconds = 1000 * 60,
        timer;


    let c = canvas.getContext("2d");

    //gradient
    let g;

    let circleCanvas = document.querySelector('.circleCanvas');
    // Dimensions Of The Canvas
    circleCanvas.width = window.innerWidth;
    circleCanvas.height = window.innerHeight;
    // Get The Context 2d Dimensions
    let ctx = circleCanvas.getContext('2d');
    // colors Array
    let colorArray = ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#2980B9'];

    window.addEventListener('resize', function () {
        circleCanvas.width = window.innerWidth;
        circleCanvas.height = window.innerHeight;
        init();
    })

    // Circles for running in the page background
    function Circle(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        this.update = function () {
            if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }

    let circleArray = [];

    function init() {
        circleArray = [];
        let circlesNumber = window.innerWidth > window.innerHeight ? 500 : 100;
        for (var i = 0; i < circlesNumber; i++) {
            var radius = Math.random() * 4 + 1;
            var x = Math.random() * (innerWidth - radius * 2) + radius;
            var y = Math.random() * (innerHeight - radius * 2) + radius;
            var dx = (Math.random() - 0.5);
            var dy = (Math.random() - 0.5);
            circleArray.push(new Circle(x, y, dx, dy, radius));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (var i = 0; i < circleArray.length; i++) {
            circleArray[i].update();
        }
    }
    init();
    animate();

    //circle,square,triangle,rhombus
    function square() {
        c.beginPath();
        c.rect(cw / 2 - w / 2, ch / 2 - h / 2, w, h);
        c.closePath();
    }

    // This is a function that sets the gradient colorStop, so that the area of the circle is divided precisely.
    // I have used Math concept to find the length of the gradient level from the top of the circle.
    function calculateCircleSpace() {
        function func(x) {
            return x - (Math.sin(x) * Math.cos(x)) - (Math.PI * space);
        }
        function derivFunc(x) {
            return 1 + (Math.sin(x) * Math.sin(x)) - (Math.cos(x) * Math.cos(x));
        }
        function newtonRaphson(x) {
            let h = func(x) / derivFunc(x);
            while (Math.abs(h) >= 0.0001) {
                h = func(x) / derivFunc(x);
                x = x - h;
            }
            return x
        }
        let x = newtonRaphson(1);
        if (space > 0.5) {
            space = 1 - (circleRadius + circleRadius * Math.cos(x)) / 100
        } else {
            space = (circleRadius - circleRadius * Math.cos(x)) / 100
        }
    }

    function circle() {
        calculateCircleSpace();
        c.beginPath();
        c.arc(cw / 2, ch / 2, circleRadius * 2, 0, 2 * Math.PI);
        c.closePath();
    }

    function triangle() {
        // Divides the area of the triangle into the required space
        space = Math.sqrt(space);
        //rc-->rightCorner
        let rc = { x: cw / 2 + w / 2, y: ch / 2 + h / 2 }
        //lc-->leftCorner
        let lc = { x: cw / 2 - w / 2, y: ch / 2 + h / 2 }
        //uc-->upperCorner
        let uc = { x: cw / 2, y: ch / 2 - h / 2 }
        c.beginPath();
        c.moveTo(lc.x, lc.y);
        c.lineTo(rc.x, rc.y);
        c.lineTo(uc.x, uc.y);
        c.closePath();
    }

    function rhombus() {
        // No math is involved, gradient colorStop for square and rhombus is same.
        c.beginPath();
        c.moveTo(cw / 2 - w / 2, ch / 2);
        c.lineTo(cw / 2, ch / 2 - h / 2);
        c.lineTo(cw / 2 + w / 2, ch / 2);
        c.lineTo(cw / 2, ch / 2 + h / 2);
        c.lineTo(cw / 2 - w / 2, ch / 2);
        c.closePath();
    }


    function randomShape() {
        // Array of functions to call randomly.
        let functions = [square, circle, triangle, rhombus];
        space = Math.random();
        ans = Math.floor(space * 100);
        let i = Math.floor(Math.random() * functions.length)
        functions[i]()
    }

    function generateShape() {
        correctStatement.hidden = true;
        slider.value = 50;
        sliderValue.innerText = slider.value + "%";
        sliderValue.style.color = "white";

        c.clearRect(0, 0, cw, ch);
        g = c.createLinearGradient(cw / 2 - w / 2, ch / 2 - h / 2, cw / 2 - w / 2, ch / 2 + h / 2);
        randomShape();

        g.addColorStop(0, "white");
        g.addColorStop(space, "white");
        g.addColorStop(space, "#0075ff");
        g.addColorStop(1, "#0075ff");
        c.fillStyle = g;
        c.lineWidth = 3;
        c.strokeStyle = "orange";
        c.fill();
        c.stroke();
    }

    function gameOver() {
        game.hidden = true;
        gameOverText.hidden = false;
    }

    function timerFunction() {
        if (seconds == 60000)
            timer = setInterval(timerFunction, 1000)
        seconds -= 1000;
        time.innerHTML = '0:' + seconds / 1000;
        if (seconds <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }

    function checkAnswer() {
        if (seconds == 60000)
            timerFunction();
        if (slider.value <= ans + 7 && slider.value >= ans - 7) {
            points[0].innerText = parseInt(points[0].innerText) + 1;
            points[1].innerText = parseInt(points[1].innerText) + 1;
            correctStatement.style.color = "green";
            sliderValue.style.color = "green";
        } else {
            correctStatement.style.color = "red";
            sliderValue.style.color = "red";
        }
        if (slider.value == ans) {
            points[0].innerText = parseInt(points[0].innerText) + 1;
            points[1].innerText = parseInt(points[1].innerText) + 1;
            total[0].innerText = parseInt(total[0].innerText) + 1;
            total[1].innerText = parseInt(total[1].innerText) + 1;
        }
        total[0].innerText = parseInt(total[0].innerText) + 1;
        total[1].innerText = parseInt(total[1].innerText) + 1;
        correctStatement.hidden = false;
        correctAnswer.innerText = ans;
        setTimeout(generateShape, 1500);
    }

    generateShape();
    guessButton.addEventListener("click", checkAnswer);
    playAgain.addEventListener("click", function () {
        location.reload();
    })

    slider.oninput = function () {
        sliderValue.innerHTML = this.value + "%";
    }

}