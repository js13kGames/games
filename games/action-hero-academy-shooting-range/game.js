const GameContainer = (function GameContainer() {
  const sceneEl = document.querySelector("a-scene");
  const rangeEl = document.getElementById("range");
  const wallEl = document.getElementById("wall-hint");
  const worldEl = document.getElementById("world");
  let gunEls = [];
  const sound = new ProceduralSample();

  const logEl = document.getElementById("log");
  function log(msg) {
    logEl.setAttribute("value", msg);
  }

  function showTutorialBtn() {
    document.getElementById("tutorial-btn").setAttribute("visible", true);
  }
  let HIGH_SCORE = 0;
  function showPoster() {
    HIGH_SCORE = localStorage.getItem("endless-highscore");
    document.getElementById("high-score").setAttribute("value", HIGH_SCORE);
    document.getElementById("high-poster").setAttribute("visible", true);
  }

  let LEVEL = 0;
  const savedLevel = localStorage.getItem("endless-unlocked");
  if (savedLevel) {
    LEVEL = Infinity;
    showTutorialBtn();
    showPoster();
  }
  // TODO: LOAD

  function emit(name) {
    log(name);
    var parameters = Array.from(arguments).slice(1); // capture additional arguments
    if (parameters.length === 0) {
      sceneEl.dispatchEvent(new Event(name));
    } else {
      var event = document.createEvent("CustomEvent");
      // CustomEvent: name, canBubble, cancelable, detail
      event.initCustomEvent(name, true, true, parameters);
      sceneEl.dispatchEvent(event);
    }
  }

  // Listen shortcut to put everyone on the same element
  function listen(name, func) {
    sceneEl.addEventListener(
      name,
      function listenPass(e) {
        func.apply(null, e.detail);
      },
      false
    );
  }

  function unlisten(name, func) {
    sceneEl.removeEventListener(name, func);
  }

  function setText(textObj) {
    for (let id in textObj) {
      document.getElementById(id).setAttribute("value", textObj[id]);
    }
  }

  listen("level-start", function startLevel() {
    try {
      victoryEl.object3D.position.y = victoryAway;
      victoryY = victoryAway;
      victoryTarget = victoryAway;
      if (LEVEL === Infinity) { // ENDLESS_MODE.onstart
        for (let i = 0; i < 5; i++) {
          makeTarget({});
        }
        timerStart = now + 0;
        lastTarget = now + 0;
        ENDLESS_MODE.onstart();
        log(timerStart);
      } else {
        LEVEL_DATA[LEVEL].onstart();
      }
    } catch(e) {
      log(e);
    }
  })

  function loadLevel(curr) {
    const level = curr === Infinity
      ? ENDLESS_MODE
      : LEVEL_DATA[curr];
    setText(level.text);
    level.onload();
  }

  function clearRange() {
    for (let target of targets) {
      if (target && target.parentNode) {
        target.parentNode.removeChild(target);
      }
    }
    targets = [];
  }

  listen("level-reset", function levelReset() {
    if (LEVEL < Infinity) {
      document.getElementById("high-poster").setAttribute("visible", false);
      document.getElementById("tutorial-btn").setAttribute("visible", false);
    }
    clearRange();
    for (let gun of gunEls) {
      worldEl.removeChild(gun);
    }
    gunEls = []
    inHand = {};
    if (LEVEL > 0) {
      makeGun("red", -.5);
    }
    if (LEVEL > 1) {
      makeGun("blue", .5);
    }
    if (LEVEL > 2) {
      makeGun("yellow");
    }
    loadLevel(LEVEL);
  });

  listen("level-end", function nextLevel() {
    LEVEL += 1;
    if (LEVEL === Infinity) {
      ENDLESS_MODE.onend(score);
      if (score >= HIGH_SCORE) {
        localStorage.setItem("endless-highscore", score);
      }
      score = 0;
      showPoster();
      maskT = 0;
      setTimeout(_ => {
        worldEl.object3D.rotation.y = 0;
      }, 500);
    } else if (LEVEL === LEVEL_DATA.length) {
      LEVEL = Infinity;
      localStorage.setItem("endless-unlocked", "booya");
      showTutorialBtn();
      loadLevel(LEVEL);
    } else if (LEVEL < Infinity) {
      loadLevel(LEVEL);
    }
  });

  listen("target-destroyed", function victoryCheck() {
    score += 1;
    if (LEVEL < Infinity && rangeEl.querySelectorAll(".target").length === 0) {
      victoryTarget = 1.6; // Drop victory button
    }
  });

  const LEVEL_DATA = [];
  function setLevels(data) {
    LEVEL_DATA.splice(0, LEVEL_DATA.length); // gut
    LEVEL_DATA.push(...data); // set
    emit("levels-set");
  }

  function closest(target, els) {
    try {
      const targetPos = target.object3D.getWorldPosition();
      function dist(el) {
        if (el.dataset.held === "true") {
          log("held " + el.id)
          return Infinity;
        }
        return el.object3D.getWorldPosition().distanceTo(targetPos);
      }
      let closest = els[0];
      let closestDist = dist(els[0]);
      for (let i = 1; i < els.length; i++) {
        const d = dist(els[i]);
        if (d < closestDist) {
          closest = els[i];
          closestDist = d;
        }
      }
      if (closestDist > 1/4) {
        return null;
      }
      return closest;
    } catch (e) {
      log(e);
    }
  }

  function setupTutorial(hand) {
    // Add shoot backside
    const shootBack = hand.querySelector(".tutorial-shoot").cloneNode();
    shootBack.setAttribute("rotation", "0 90 -40");
    hand.appendChild(shootBack);
    // Elements
    let grabEl = hand.querySelector(".tutorial-grab");
    let dropEl = hand.querySelector(".tutorial-drop");
    let shootEls = hand.querySelectorAll(".tutorial-shoot");
    let shot = false;
    // Events
    function grabDropCycle() {
      try {
        shootEls.forEach(el => el.setAttribute("opacity", inHand[hand.id] ? .5 : 1));
        if (grabEl) {
          hand.removeChild(grabEl);
          grabEl = false;
          dropEl.setAttribute("opacity", 1);
        } else if (dropEl) {
          hand.removeChild(dropEl);
          dropEl = null;
          if (shot) {
            hand.removeEventListener(this, grabDropCycle);
          }
        } else if (shot) {
          hand.removeEventListener(this, grabDropCycle);
        }
      } catch(e) {
        log(e);
      }
    }
    function shootCycle() {
      if (inHand[hand.id]) {
        shootEls.forEach(el => hand.removeChild(el));
        hand.removeEventListener("triggerdown", shootCycle);
        shot = true;
      }
    }
    hand.addEventListener("abuttondown", grabDropCycle.bind("abuttondown"), { passive: true });
    hand.addEventListener("xbuttondown", grabDropCycle.bind("xbuttondown"), { passive: true });
    hand.addEventListener("triggerdown", shootCycle, { passive: true });
  }

  let inHand = {};
  function setupHand(hand) {
    setupTutorial(hand);
    function pickup(hand) {
      try {
        const newFriend = closest(hand, gunEls);
        if (newFriend === null) {
          return;
        }
        newFriend.object3D.matrix.copy(new THREE.Matrix4());
        newFriend.object3D.matrix.decompose(
          newFriend.object3D.position,
          newFriend.object3D.quaternion,
          newFriend.object3D.scale
        );
        hand.object3D.add( newFriend.object3D );
        newFriend.dataset.held = true;
        inHand[hand.id] = newFriend;
        hand.setAttribute("line", "opacity:1;color:" + newFriend.getAttribute("color"));
      } catch (e) {
        log(e);
      }
    }
    function drop(hand) {
      try {
        const carryEL = inHand[hand.id];
        const carryObj = carryEL.object3D;
        carryObj.matrix.premultiply( hand.object3D.matrixWorld );
        carryObj.matrix.premultiply( worldEl.object3D.matrixWorld );
        carryObj.matrix.decompose(
          carryObj.position,
          carryObj.quaternion,
          carryObj.scale
        );
        worldEl.object3D.add( carryObj );
        inHand[hand.id] = null;
        carryEL.dataset.held = false;
        hand.setAttribute("line", "opacity:0;color:purple");
      } catch (e) {
        log(e);
      }
    }
    function handleButton(hand) {
      if (inHand[hand.id]) {
        drop(hand);
      } else {
        pickup(hand);
      }
    }
    function handleTrigger(hand) {
      if (inHand[hand.id]) {
        sound.shoot();
      }
    }

    // TODO: select startstart, selectend
    // Oculus controls
    hand.addEventListener("abuttondown", _ => handleButton(hand), { passive: true });
    hand.addEventListener("xbuttondown", _ => handleButton(hand), { passive: true });
    hand.addEventListener("gripdown", _ => pickup(hand), { passive: true });
    hand.addEventListener("gripup", _ => drop(hand), { passive: true });
    hand.addEventListener("triggerdown", _ => handleTrigger(hand), { passive: true });
  }

  /**
   * black  | 0b000
   * red    | 0b100
   * orange | 0b110
   * yellow | 0b010
   * green  | 0b011
   * blue   | 0b001
   * purple | 0b101
   * white  | 0b111
   */
  const colorByBin = [
    "black",
    "blue",
    "yellow",
    "green",
    "red",
    "purple",
    "orange",
    "white",
  ];
  function toRYB(color) {
    return colorByBin.indexOf(color);
  }
  function toName(hex) {
    return colorByBin[hex];
  }
  function subColors(opName, subName) {
    const opBin = toRYB(opName);
    const subBin = toRYB(subName);
    const res = (opBin | subBin) ^ subBin;
    return toName(res);
  }

  function bindTarget(target) {
    // Trigger press
    // - Spin buttons
    if (target.id === "tutorial-box") {
      target.addEventListener("mousedown", () => {
        LEVEL = 0;
        emit("level-reset");
        log("tutorial");
      }, { passive: true });
    } else if (target.classList.contains("spin-control")) {
      target.addEventListener("mousedown", () => {
        if (target.id !== "start-btn" || inHand[event.detail.cursorEl.id]) {  // Can't shoot start with an empty hand
          maskT = target.dataset.rotation/360 * 2 * Math.PI;
          setTimeout(_ => {
            worldEl.object3D.rotation.y = target.dataset.rotation/360 * 2 * Math.PI;
          }, 500);
        }
        if (target.id === "start-btn" && inHand[event.detail.cursorEl.id]) {
          emit("level-start");
        } else if (target.id === "reset-btn") {
          emit("level-reset");
        } else if (target.id === "victory-btn") {
          emit("level-end");
        }
      }, { passive: true });
    // Targets
    } else {
      if (typeof target.getAttribute("color") === "undefined") {
        return;
      }
      target.addEventListener("mousedown", event => {
        const targetColor = target.getAttribute("color");
        const shotBy = inHand[event.detail.cursorEl.id];
        const shotColor = shotBy.getAttribute("color");
        const newColor = subColors(targetColor, shotColor);
        if (newColor === "black") {
          target.parentNode.removeChild(target);
          emit("target-destroyed");
        } else {
          target.setAttribute("color", newColor);
        }
      }, { passive: true });
    }

    /*
    target.addEventListener("raycaster-intersected", () => {
      target.setAttribute("color", "orange")
    }, { passive: true });
    */
  }

  function makeTarget(op) {
    const el = document.createElement("a-cylinder");
    el.className = "target";
    if (typeof op.color === "undefined") {
      const index = Math.floor(Math.random() * (colorByBin.length - 1)) + 1; // no black
      op.color = colorByBin[index];
    }
    el.setAttribute("color", op.color);
    el.setAttribute("scale", ".25 .05 .25");
    if (typeof op.position === "undefined") {
      // Random position
      const x = Math.random() * 6 - 3;
      const y = Math.random() + 1.5;
      const z = Math.random() * 3 + 2;
      el.setAttribute("position", x + " " + y + " " + z);
    } else {
      el.setAttribute("position", op.position);
    }
    el.setAttribute("rotation", "90 0 0");
    bindTarget(el);
    targets.push(el);
    rangeEl.appendChild(el);
    return el;
  }

  function moveMask() {
    maskEl.object3D.position.y = Math.abs(Math.cos(maskA)) *  .5;
    maskEl.object3D.position.z = Math.abs(Math.sin(maskA)) * -.5 + .2;
    maskEl.object3D.rotation.x = Math.abs(Math.cos(maskA)) * Math.PI / 2;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    seconds = (Math.floor((seconds % 60) * 1000) / 1000);
    if (seconds < 10) {
      return "0" + mins + ":0" + seconds;
    }
    return "0" + mins + ":".slice(0, seconds.length - 4) + seconds;
  }

  let lastFrame = 0;
  let lastTarget = 0;
  const start = Date.now();
  let now = 0;

  let maskA = 0;
  let maskT = 0;
  const maskEl = document.getElementById("mask");

  const victoryEl = document.getElementById("victory-mount");
  const victoryAway = 5;
  let victoryY = victoryAway;
  let victorySpeed = 0;
  let victoryTarget = victoryAway;

  let timerStart = 0;
  let score = 0;
  let targets = [];
  function loop() {
    requestAnimationFrame(loop);
    now = Date.now() - start;
    const delta = (now - lastFrame) / 1000;
    // log(delta + " (" + Math.floor(1/delta) + "fps)");

    try {
    if (timerStart) {
      const secondsLeft = 30 - Math.round(now - timerStart) / 1000;
      if (secondsLeft <= 0) {
        timerStart = false;
        wallEl.setAttribute("value", "0:00.000");
        clearRange();
        emit("level-end");
      } else {
        log(formatTime(secondsLeft));
        wallEl.setAttribute("value", formatTime(secondsLeft));
        const interval = 2500;
        if (now - lastTarget > interval) {
          makeTarget({});
          lastTarget += interval;
        }
      }
    }
    } catch(e) {
      log(e);
    }

    if (victoryTarget < victoryAway) {
      if (victoryY < victoryTarget) {
        victorySpeed *= -.6;
      } else {
        victorySpeed -= delta / 10;
        victorySpeed *= .99;
      }
      victoryY += victorySpeed;
      victoryEl.object3D.position.y = victoryY;
    }

    if (maskA > maskT) {
      maskA -= Math.min(delta * Math.PI, maskA - maskT);
      moveMask();
    }
    if (maskA < maskT) {
      maskA += Math.min(delta * Math.PI, maskT - maskA);
      moveMask();
    }


    /*
    for (let target of targets) {
      target.object3D.position.x += .5 * delta;
    }*/

    lastFrame = now;
  }

  // Setup
  listen("levels-set", function setup() {
    loadLevel(LEVEL);
    if (LEVEL === Infinity) {
      emit("level-reset"); // guns. lots of guns.
    }
    document.querySelectorAll("[oculus-touch-controls]").forEach(setupHand);
    document.querySelectorAll(".target").forEach(bindTarget);
    requestAnimationFrame(loop);
  });

  function makeGun(color, x) {
    const el = document.createElement("a-entity");
    el.className = "gun";
    el.id = color + "-gun";
    el.setAttribute("position", (x || 0) + " 1 -.6");
    el.setAttribute("rotation", "0 0 90");
    el.setAttribute("color", color);
    const barrel = document.createElement("a-box");
    barrel.setAttribute("position", "-.01 -.05 -.05");
    barrel.setAttribute("rotation", "50 0 0");
    barrel.setAttribute("scale", ".03 .2 .05");
    barrel.setAttribute("color", color);
    const handle = document.createElement("a-box");
    handle.setAttribute("position", "-.01  -.05 .05");
    handle.setAttribute("rotation", "-50 0 0");
    handle.setAttribute("scale", ".03 .12 .05");
    handle.setAttribute("color", color);
    el.appendChild(barrel);
    el.appendChild(handle);

    worldEl.appendChild(el);
    gunEls.push(el);
  }

  return { listen, log, makeGun, makeTarget, setLevels, setText }
})();

const ENDLESS_MODE = {
  text: {},
  onload: function() {
    GameContainer.setText({
      "table-text": "It's time for CHALLENGE MODE!\n\nCongratulations. Only the finest gun floaters and backwards shooters make it to this point.\n\nRemember!\n- Float the guns where you can find them -\n- White targets need all the colors -\n- Shoot the floor to exit quickly -\n\nYou'll have 30 seconds to shoot as many targets as you can. Get set up, take a deep breath, and LET'S DO THIS!"
    });
  },
  onend: function(score) {
    GameContainer.setText({
      "table-text": "Awesome shooting!\n\nYou shot " + score + " targets!\n\nShoot the ON button when you're ready to go again and THANK YOU FOR PLAYING!"
    });
  }
};
