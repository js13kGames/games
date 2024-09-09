let VARS = {
  desX: 0,
  desY: 0,
  idSeed: 0,
  files: [],
  movingElement: null,
  timeLeft: 0,
  level: null,
  timeout: null,
  status: "undecided", // "victory", "defeat"
};

let CONSTS = {
  maxInARow: 12,
  iconDim: 80,
};

const setupVariables = (level) => {
  VARS.level = level;

  let rect = document.querySelector(".work-area").getBoundingClientRect();
  VARS.desX = rect.left;
  VARS.desY = rect.top;

  VARS.idSeed = 1;
  VARS.files = [];

  VARS.movingElement = null;

  VARS.timeLeft = level.time;
  VARS.lastTime = null;

  VARS.status = "undecided";
};

const initiateGameBoard = () => {
  document.querySelector(".main").innerHTML = "";
  document.querySelector(".main").innerHTML = `
  <div class="game">
    <div class="desktop">
      <div class="work-area"></div>
      <div class="task-bar">
        <div class="btn start-btn" onclick="toggleStartMenu()">⭐ Start</div>
        <div class="filler"></div>
        <div class="btn objective-btn" onclick="toggleObjectivesMenu()">🏆 Objectives</div>
        <div class="btn time-remaining-btn">⏰ Remaining <span class="time-left">*</span> second(s)</div>
      </div>
      <div class="start-menu hidden">
        <div class="btn menu-buttton"  onclick="startGameClicked(0)">Start Level 1 (Easy)</div>
        <div class="btn menu-buttton"  onclick="startGameClicked(1)">Start Level 2 (Moderate)</div>
        <div class="btn menu-buttton"  onclick="startGameClicked(2)">Start Level 3 (Hard)</div>
        <div class="btn menu-buttton" onclick="sourceClicked()">Source & Credits</div>
      </div>
      <div class="objectives-area hidden">
        <div class="objective-header">
          <div class="objective-header-title">🏆 Objectives</div>
          <div class="btn objective-header-icon" onclick="hideObjectivesMenu()">x</div>
        </div>
        <div class="objectives"></div>
      </div>
      <div class="verdict-area hidden">
        <div class="verdict"></div>
      </div>
      <div class="welcome-area hidden">
        <div class="welcome-header">
          <div class="welcome-header-title">Welcome to OCD Relief !</div>
          <div class="btn welcome-header-icon" onclick="closeWelcomeMenu()">x</div>
        </div>
        <div class="details">
          <div class="welcome-title">OCD Relief</div>
          <div class="welcome-heading">
            Bring moments of relief to folks with OCD (Obsessive-compulsive disorder) 
            through a fun game of organizing messy desktop spaces.
          </div>
          <div class="welcome-heading">
            Your time will start as soon as you close this window.
            Before that check out the objectives and organize your 
            desktop space accordingly, before the time runs out. 
          </div>
          <div class="welcome-heading">The 90's aesthetics is just a bonus.</div>

          <div class="welcome-heading" style="margin-top: 30px">
          Game dev: <a href="https://github.com/ishafayet" target="_blank">Sayem Shafayet</a><br>
          Music by: <a href="https://www.linkedin.com/in/myshaazfar"  target="_blank">Mysha Azfar</a><br>
          </div>

          <div class="version">Version 0.0.1-POC</div>
        </div>
      </div>
    </div>
  </div>
  `;
};

const addIcon = (file) => {
  let graphic = "?";
  let displayName = `${file.name}.${file.extension}`;
  if (file.type === "dir") {
    graphic = "📁";
    displayName = file.name;
  } else if (file.type === "recycle") {
    graphic = "🗑️";
    displayName = file.name;
  } else if (["mp3", "wav"].indexOf(file.extension) > -1) {
    graphic = "🎵";
  } else if (["doc", "docx", "txt", "pdf"].indexOf(file.extension) > -1) {
    graphic = "📄";
  }

  let top = VARS.desY + 0;
  let left = VARS.desX + 0;

  document.querySelector(".work-area").innerHTML += `
    <div class="icon" style="top: ${top}px; left: ${left}px; z-index: 1;" data-id="${file.id}">
      <div class="icon-graphic">${graphic}</div>
      <div class="icon-label">${displayName}</div>
    </div>
  `;
};

const autoSort = (by) => {
  let iconList = document.querySelectorAll(".icon");
  if (by === "id") {
    Array.from(iconList).sort((a, b) => {
      idA = parseInt(a.getAttribute("data-id"));
      idB = parseInt(b.getAttribute("data-id"));
      return idB - idA;
    });
  }

  let line = 0;
  for (let i = 0; i < iconList.length; i++) {
    let icon = iconList[i];
    icon.style.top = VARS.desY + line * CONSTS.iconDim + "px";
    icon.style.left =
      VARS.desX + (i % CONSTS.maxInARow) * CONSTS.iconDim + "px";
    if ((i + 1) % CONSTS.maxInARow === 0) line += 1;
  }
};

const prepareFiles = () => {
  VARS.files.push({
    id: VARS.idSeed++,
    type: "recycle",
    extension: null,
    name: "Recycle Bin",
    originalName: "Recycle Bin",
    files: [],
  });

  VARS.level.input.forEach((fullPath) => {
    let id = VARS.idSeed++;

    let path = fullPath.split("/");
    let file = path.pop();
    let [name, extension] = file.split(".");

    let parent = VARS;
    if (path.length !== 0) {
      parent = VARS.files.find((f) => f.name === path[0]);
      if (!parent) throw new Error(`Invalid parent ${fullPath}`);
    }

    if (!extension) {
      parent.files.push({
        id,
        type: "dir",
        extension: null,
        name,
        originalName: name,
        files: [],
      });
    } else {
      parent.files.push({
        id,
        type: "file",
        extension,
        name,
        originalName: name,
        files: null,
      });
    }
  });
};

const prepareObjectives = () => {
  VARS.objectives = VARS.level.objectives;
  VARS.objectives.forEach((obj) => {
    obj.status = false;
  });
};

const renderDesktop = () => {
  VARS.files.forEach((file) => {
    addIcon(file);
  });
};

const findFileByEl = (el) => {
  let id = parseInt(el.getAttribute("data-id"));
  let file = VARS.files.find((f) => f.id === id);
  return file;
};

const setupListeners = () => {
  const clearMovingElement = () => {
    VARS.movingElement.style.zIndex = 1;
    VARS.movingElement.classList.remove("moving");
    VARS.movingElement = null;
  };

  document.querySelectorAll(".icon").forEach((el) => {
    el.addEventListener("dblclick", (e) => {
      // only accept primary button
      if (e.button !== 0) return;

      el.wasDoubleClick = true;
      let file = findFileByEl(el);
      if (file.type === "file") {
        alert(
          `No program is installed that can handle "${file.extension}" files.` +
            ` However, you can still move the file around, rename and delete.`
        );
        return;
      }
    });

    el.addEventListener("mousedown", (e) => {
      // only accept primary button
      if (e.button !== 0) return;

      // avoid double click
      if (e.detail === 2) return;

      if (!VARS.movingElement) {
        setTimeout(() => {
          if (el.wasDoubleClick) {
            el.wasDoubleClick = false;
            return;
          }
          VARS.movingElement = el;
          VARS.movingElement.style.zIndex = 2;
          VARS.movingElement.classList.add("moving");
        }, 200);
      }
    });

    el.addEventListener("mouseup", (e) => {
      // only accept primary button
      if (e.button !== 0) return;

      if (VARS.movingElement) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        console.log("from el", el);

        let sourceEl = VARS.movingElement;
        let destinationEl = el;

        clearMovingElement();

        if (sourceEl === destinationEl) return;

        let destinationId = parseInt(destinationEl.getAttribute("data-id"));
        let sourceId = parseInt(sourceEl.getAttribute("data-id"));
        let destination = VARS.files.find((f) => f.id === destinationId);
        let source = VARS.files.find((f) => f.id === sourceId);

        if (
          source.type !== "file" ||
          (destination.type !== "dir" && destination.type !== "recycle")
        ) {
          alert("Only files can be moved into folders");
          return;
        }

        VARS.files.splice(VARS.files.indexOf(source), 1);
        destination.files.push(source);
        calculateObjectives();

        sourceEl.parentNode.removeChild(sourceEl);
      }
    });
  });

  document.querySelector(".work-area").addEventListener("mousemove", (e) => {
    e.preventDefault();

    // only accept primary button
    if (e.button !== 0) return;

    if (VARS.movingElement) {
      VARS.movingElement.style.left =
        String(e.clientX + CONSTS.iconDim / 4) + "px";
      VARS.movingElement.style.top =
        String(e.clientY + CONSTS.iconDim / 4) + "px";
    }
  });

  document.querySelector(".work-area").addEventListener("mouseup", (e) => {
    // only accept primary button
    if (e.button !== 0) return;

    if (VARS.movingElement) {
      clearMovingElement();
    }
  });
};

const updateClock = () => {
  if (VARS.timeLeft <= 0) return;
  if (VARS.lastTime) {
    let lastTime = VARS.lastTime;
    VARS.lastTime = Date.now();
    let diff = VARS.lastTime - lastTime;
    VARS.timeLeft = (VARS.timeLeft * 1000 - diff) / 1000;
    document.querySelector(".time-left").innerHTML = Math.ceil(VARS.timeLeft);
  } else {
    VARS.lastTime = Date.now();
  }
  if (VARS.timeLeft <= 0) {
    calculateObjectives();
    if (VARS.status !== "victory") {
      VARS.status = "defeat";
    }
  }
  if (VARS.status === "victory") {
    scope.playVictoryMusic();
    showVerdict();
    return;
  } else if (VARS.status === "defeat") {
    scope.playDefeatMusic();
    showVerdict();
    return;
  }
  VARS.timeout = setTimeout(() => {
    updateClock();
  }, 900);
};

const beginClock = () => {
  scope.playMainMusic();
  updateClock();
};

const hideStartMenu = () => {
  let el = document.querySelector(".start-menu");
  el.classList.add("hidden");
};

const showStartMenu = () => {
  let el = document.querySelector(".start-menu");
  el.classList.remove("hidden");
  el.style.top = String(VARS.desY + (720 - 124 - 40)) + "px";
  el.style.left = String(VARS.desX + 4) + "px";
};

const toggleStartMenu = () => {
  let el = document.querySelector(".start-menu");
  if (el.classList.contains("hidden")) {
    showStartMenu();
  } else {
    hideStartMenu();
  }
};

const hideObjectivesMenu = () => {
  let el = document.querySelector(".objectives-area");
  el.classList.add("hidden");
};

const calculateObjectives = () => {
  let el = document.querySelector(".objectives");
  el.innerHTML = "";

  var successCount = 0;
  VARS.objectives.forEach((objective) => {
    objective.status = objective.testFn(VARS.files);
    if (objective.status) successCount += 1;
    el.innerHTML += `
    <div class="objective-label">
      ${objective.status ? "✔️" : "☐"} ${objective.text}
    </div>
    `;
  });

  if (successCount === VARS.objectives.length) {
    VARS.status = "victory";
  }
};

const showObjectivesMenu = () => {
  calculateObjectives();
  let el = document.querySelector(".objectives-area");
  el.classList.remove("hidden");
  el.style.top = String(VARS.desY + (720 - 400 - 40)) + "px";
  el.style.left = String(VARS.desX + 720 - 68) + "px";
};

const toggleObjectivesMenu = () => {
  let el = document.querySelector(".objectives-area");
  if (el.classList.contains("hidden")) {
    showObjectivesMenu(el);
  } else {
    hideObjectivesMenu(el);
  }
};

const closeWelcomeMenu = () => {
  let el = document.querySelector(".welcome-area");
  el.classList.add("hidden");
  beginClock();
};

const showWelcomeMenu = () => {
  let el = document.querySelector(".welcome-area");
  el.classList.remove("hidden");
  el.style.top = String(VARS.desY + 140) + "px";
  el.style.left = String(VARS.desX + 200) + "px";
};

const toggleWelcomeMenu = () => {
  let el = document.querySelector(".welcome-area");
  console.log(el);
  if (el.classList.contains("hidden")) {
    showWelcomeMenu();
  } else {
    closeWelcomeMenu();
  }
};

const sourceClicked = () => {
  window.open("https://github.com/iShafayet/ocd-relief-js13k");
  hideStartMenu();
};

const startGameClicked = (level) => {
  scope.startGame(level);
};

const closeVerdict = () => {
  let el = document.querySelector(".verdict-area");
  el.classList.add("hidden");
  beginClock();
};

const showVerdict = () => {
  let el = document.querySelector(".verdict-area");
  el.classList.remove("hidden");

  if (VARS.status === "victory") {
    el.classList.add("victory");
    el.innerHTML = "✌️ Victory!";
  } else if (VARS.status === "defeat") {
    el.classList.add("defeat");
    el.innerHTML = "😞 Defeated...";
  }

  el.style.top = String(VARS.desY + 250) + "px";
  el.style.left = String(VARS.desX + 310) + "px";
};

scope.startGame = (levelIndex) => {
  localStorage.setItem("ocd-relief-js13k--last-level", String(levelIndex));

  if (VARS.timeout) {
    clearTimeout(VARS.timeout);
  }

  let level = scope.levelList[levelIndex];

  initiateGameBoard();
  setupVariables(level);

  prepareFiles();
  prepareObjectives();
  renderDesktop();
  autoSort("id");
  setupListeners();

  console.debug(level);

  showWelcomeMenu();
};
