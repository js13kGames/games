(function() {
  let socket,
    bReady,
    bThrow,
    cMain,
    cLocal,
    message,
    score,
    points = {
      win: 0,
      lose: 0
    },
    ready = false,
    opponentReady = false,
    isBombOwner = false;

  function disableRButton() {
    bReady.setAttribute("disabled", "disabled");
    bReady.style.zIndex = "1";
  }

  function enableRButton() {
    bReady.removeAttribute("disabled");
    bReady.style.zIndex = "2";
  }

  function disableTButton() {
    bThrow.setAttribute("disabled", "disabled");
    bThrow.style.zIndex = "1";
    cMain.classList.remove("owner");
    cLocal.classList.remove("owner");
  }

  function enableTButton() {
    bThrow.removeAttribute("disabled");
    bThrow.style.zIndex = "2";
    cMain.classList.add("owner");
    cLocal.classList.add("owner");
  }

  function setMessage(text) {
    message.innerHTML = text;
  }

  function updateCountdown(time) {
    cMain.innerHTML = time;
  }

  function resetCountdown() {
    cMain.innerHTML = "";
    resetLocalCountdown();
  }

  function updatecLocal(time) {
    cLocal.innerHTML = time;
  }

  function resetLocalCountdown() {
    cLocal.innerHTML = "";
  }

  function displayScore(text) {
    score.innerHTML = [
      "<h2>" + text + "</h2>",
      "<div>Won: " + points.win + "</div>",
      "<div>Lost: " + points.lose + "</div>"
    ].join("");
    cMain.classList.add("exploded");
  }

  function hideScore() {
    score.innerHTML = "";
    cMain.classList.remove("exploded");
  }

  function bind() {
    socket.on("start", () => {
      const pointsCount = points.win + points.lose;

      if (pointsCount === 0) {
        setMessage("Get ready!");
      }
      enableRButton();
    });

    socket.on("ready", bombOwner => {
      ready = true;
      if (bombOwner) {
        isBombOwner = bombOwner;
      }
      setMessage("Waiting for opponent to get ready...");
      disableRButton();
      hideScore();
      updateCountdown(10);
      if (ready && opponentReady) {
        setMessage("");
        if (isBombOwner) {
          enableTButton();
        } else {
          disableTButton();
        }
      }
    });

    socket.on("opponentReady", () => {
      opponentReady = true;
      hideScore();
      if (!isBombOwner) {
        setMessage("Get ready!");
      }
      if (ready && opponentReady) {
        setMessage("");
        if (isBombOwner) {
          enableTButton();
        } else {
          disableTButton();
        }
      }
    });

    socket.on("update", bombOwner => {
      isBombOwner = bombOwner;
      if (isBombOwner) {
        updatecLocal(3);
        enableTButton();
        setMessage("");
      } else {
        disableTButton();
        setMessage("Prepare to catch!");
      }
    });

    socket.on("win", () => {
      points.win++;
      ready = false;
      opponentReady = false;
      isBombOwner = false;
      setMessage("");
      resetCountdown();
      displayScore("You win!");
      enableRButton();
      disableTButton();
    });

    socket.on("lose", () => {
      points.lose++;
      ready = false;
      opponentReady = false;
      isBombOwner = false;
      setMessage("");
      resetCountdown();
      displayScore("You lose!");
      enableRButton();
      disableTButton();
    });

    socket.on("end", () => {
      disableTButton();
      disableRButton();
      hideScore();
      setMessage("Waiting for opponent...");
    });

    socket.on("tick", time => {
      updateCountdown(time);
    });

    socket.on("tickLocal", time => {
      if (isBombOwner) {
        updatecLocal(time);
      } else {
        resetLocalCountdown();
      }
    });

    socket.on("connect", () => {
      disableTButton();
      disableRButton();
      setMessage("Waiting for opponent...");
    });

    socket.on("disconnect", () => {
      disableTButton();
      disableRButton();
      hideScore();
      setMessage("Connection lost!");
    });

    socket.on("error", () => {
      disableTButton();
      disableRButton();
      setMessage("Connection error!");
    });

    socket.on("throw", () => {
      setMessage("Bomb in the air!");
    });

    bThrow.addEventListener("click", function(e) {
      socket.emit("throw");
    });

    bReady.addEventListener("click", function(e) {
      socket.emit("ready");
    });
  }

  function init() {
    socket = io({ upgrade: false, transports: ["websocket"] });
    cMain = document.getElementById("countdownMain");
    cLocal = document.getElementById("countdownLocal");
    bThrow = document.getElementById("buttonThrow");
    bReady = document.getElementById("buttonReady");
    message = document.getElementById("message");
    score = document.getElementById("score");
    bind();
  }

  window.addEventListener("load", init, false);
})();
