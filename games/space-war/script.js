"use strict";
(() => {
  // Utilidades
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const BASE_HEIGHT = 732;
  const BASE_WIDTH = 412;
  const CACHE_KEY = "space-war-js13k";
  const supportedShare = "share" in navigator;
  const COLORS = {
    red: [
      "#ff5174",
      "#ff4a69",
      "#ee9cac",
      [, , 1675, , 0.06, 0.24, 1, 1.82, , , 837, 0.06],
    ],
    yellow: [
      "#ffe901",
      "#fed702",
      "#fff483",
      [, , 539, 0, 0.04, 0.29, 1, 1.92, , , 567, 0.02, 0.02, , , , 0.04],
    ],
    green: [
      "#48d054",
      "#43c04e",
      "#8ff498",
      [, , 1e3, , , 0.5, , , , , 99, 0.01, 0.03],
    ],
    blue: [
      "#009afe",
      "#018fff",
      "#6abcf2",
      [, 0.1, 75, 0.03, 0.08, 0.17, 1, 1.88, 7.83, , , , , 0.4],
    ],
  };

  const SOUNDS = {
    explosion: [, , 418, 0, 0.02, 0.2, 4, 1.15, -8.5, , , , , 0.7, , 0.1],
    kill: [
      2.06,
      ,
      437,
      ,
      0.19,
      1,
      2,
      1.19,
      0.9,
      0.9,
      ,
      ,
      ,
      0.5,
      ,
      0.4,
      0.34,
      0.69,
      0.06,
      0.22,
    ],
  };

  $("html").style.cssText += `--h: ${BASE_HEIGHT}px; --w: ${BASE_WIDTH}px`;
  const setHtml = (element, html) => (element.innerHTML = html);
  const ObjectKeys = (obj) => Object.keys(obj);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateLink = (label = "", url = "") =>
    `<a title=${label} href=${url} target="_blank" rel="noopener noreferrer">${label}</a>`;

  /**
   * Para edicioar eventos
   * @param {*} target
   * @param {*} type
   * @param {*} callback
   * @param {*} parameter
   */
  const $on = (target, type, callback, parameter = {}) => {
    if (target) {
      target.addEventListener(type, callback, parameter);
    }
  };

  /**
   * Agregar una clase a un elemento
   * @param {*} target
   * @param {*} className
   */
  const addClass = (target, className) => {
    if (target) {
      className.split(" ").forEach((classText) => {
        target.classList.add(classText);
      });
    }
  };

  /**
   * Eliminar la clase de un elemento
   * @param {*} target
   * @param {*} className
   */
  const removeClass = (target, className) => {
    if (target) {
      className.split(" ").forEach((classText) => {
        target.classList.remove(classText);
      });
    }
  };

  /**
   * Guadar la información dada en localStorage/sessionStorage
   * @param {*} data
   */
  const saveCache = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };

  /**
   * Obtener la data que está guardarda en localStorage
   */
  const getDataCache = () => {
    const data = localStorage.getItem(CACHE_KEY) || "";
    return data !== "" ? JSON.parse(data) : {};
  };

  /**
   * Guarda valores de una propiedad en localstorage
   * @param {*} property
   * @param {*} value
   */
  const savePropierties = (property, value) => {
    const localCache = getDataCache();
    localCache[property] = value;
    saveCache(localCache);
  };

  /**
   * Dada una propiedad, devuelve la información de la misma
   */
  const getValueFromCache = (key = "", initial) => {
    const localCache = getDataCache();
    return localCache[key] || initial;
  };

  /**
   * Determina si el dispotivo es mobile
   */
  const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const inlineStyles = (styles) =>
    ObjectKeys(styles).length
      ? `style='${ObjectKeys(styles)
          .map((v) => `${v}:${styles[v]}`)
          .join(";")}'`
      : "";

  /**
   * Agregar estilos inline a un elemento
   * @param {*} target
   * @param {*} styles
   */
  const addStyle = (target, styles) => {
    if (target) {
      for (let style in styles) {
        target.style[style] = styles[style];
      }
    }
  };

  /**
   * Para establecer un tiempo para hacer una acción en una función
   * útil para el evento de resize
   * @param {*} fn
   * @param {*} delay
   */
  const debounce = (fn, delay) => {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, delay);
    };
  };

  /**
   * Retonará las dimnesiones de la pantalla
   */
  const getDimensionsScreen = () => ({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const onWindowResize = debounce(() => {
    const { w, h } = getDimensionsScreen();
    const scale = Math.min(w / BASE_WIDTH, h / BASE_HEIGHT);
    const mobile = isMobile();
    addStyle($("body"), {
      zoom: `${w < BASE_WIDTH ? Math.round((w / BASE_WIDTH) * 100) : 100}%`,
      transform:
        scale >= 1 || mobile ? `scale(${!mobile ? scale : 1})` : undefined,
    });
  }, 100);

  const shareAction = (
    title = "",
    text = "",
    url = "",
    alternativeText = ""
  ) => {
    if (supportedShare) {
      navigator
        .share({ title, text, url })
        .then(() => {
          Modal.show({
            icon: "🥰",
            txt: "<h2>Thanks for sharing</h2>",
            no: "",
            yes: "Ok",
            timer: 2000,
          });
        })
        .catch((err) => {
          Modal.show({
            icon: "⚠️",
            txt: `<h2>Error</h2><p>${err}</p>`,
            no: "",
            yes: "Ok",
            timer: 2000,
          });
        });
    } else {
      Modal.show({
        icon: "👍",
        txt: alternativeText,
        no: "",
        yes: "Close",
      });
    }
  };

  // fin de utilidades

  const Modal = {
    show({ txt, icon = "", yes = "yes", no = "no", cb, timer = 0 }) {
      $("modal .txt").innerHTML =
        (icon
          ? `<p ${inlineStyles({ "font-size": "3rem" })}>${icon}</p>`
          : "") + txt;
      addStyle($("modal #btn1"), { display: yes ? "block" : "none" });
      addStyle($("modal #btn2"), { display: no ? "block" : "none" });
      $("modal #btn1").textContent = yes;
      $("modal #btn2").textContent = no;
      removeClass($("modal"), "hide");
      addClass($("modal"), "show");
      if (this.interval) {
        clearTimeout(this.interval);
      }
      if (timer) {
        this.interval = setTimeout(() => {
          this.hide();
        }, timer);
      }

      this.callback = cb;
    },
    hide() {
      removeClass($("modal"), "show");
      addClass($("modal"), "hide");
      if (this.interval) {
        clearTimeout(this.interval);
      }
    },
    render: () =>
      `<modal class="hide wh"><div class="ms wh"></div><div class="mw wh cs"><div class=mc><div class="wh cs txt"></div><div class="mb wh cs"><button id=btn1></button><button id=btn2></button></div></div></div></modal>`,
    events() {
      $$("modal button").forEach((btn) =>
        $on(btn, "click", (e) => {
          this.hide();
          this.callback && this.callback(e.target.id === "btn1");
        })
      );
    },
  };

  const Ship = (number = 1, styles = {}) =>
    `<div class=s${number} ${inlineStyles(styles)}></div>`;

  const Piano = () =>
    `<piano class="cs" ${inlineStyles({
      "flex-wrap": "wrap",
      width: "80%",
    })}>${ObjectKeys(COLORS)
      .map((v) => `<button disabled id=${v}></button>`)
      .join("")}</piano>`;

  const PauseButton = (icon = "⏸️") => `<button id=pause>${icon}</button>`;

  const Bullets = (id = "", styles = {}) =>
    `<div class=bullet id=${id} ${inlineStyles(styles)}></div>`;

  const Game = () => {
    let soundPattern = [];
    let intervalPattern;
    let counterPattern = 0;
    let score = 0;

    const shootLaser = async (ship = 1) => {
      const laser = $("#laser");
      const particle = $("#particle");
      const positionLaser = [260, 140];
      const positionParticle = ["43%", "13%"];
      const initialPosition = positionLaser[ship === 1 ? 1 : 0];
      const destinityParticle = [
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ];

      addStyle($(".game"), { animation: "unset" });

      addStyle(particle, {
        top: positionParticle[ship - 1],
        visibility: "visible",
      });

      for (let i = 0; i < 4; i++) {
        addStyle($(`#b-${i + 1}`), {
          top: "7px",
          left: "15px",
          visibility: "hidden",
          opacity: 0,
          transition: "left .8s ease, top .8s ease, opacity .8s ease",
          background: "#f5f301",
          height: "25px",
          transform: `rotate(${45 + 90 * i}deg)`,
        });
      }

      addStyle(laser, {
        left: "49%",
        top: `${initialPosition}px`,
        visibility: "visible",
        opacity: 0,
        transition: "top 0.5s ease, opacity 1s ease",
      });

      await delay(70);
      addStyle(laser, {
        top: `${positionLaser[ship - 1]}px`,
        opacity: 1,
      });

      await delay(200);
      laser.style = "";

      for (let i = 0; i < 4; i++) {
        const element = $(`#b-${i + 1}`);
        addStyle(element, {
          left: `${
            +element.style.left.split("px")[0] + destinityParticle[i][0] * 300
          }px`,
          top: `${
            +element.style.top.split("px")[0] + destinityParticle[i][1] * 300
          }px`,
          visibility: "visible",
          opacity: 1,
        });
      }

      zzfx(...SOUNDS[ship === 2 ? "explosion" : "kill"]);
      if (ship == 1) {
        addStyle($(".game"), { animation: "shakeY .5s" });        
        addStyle($(".s2"), {animation : "rOut .5s both"})
        if ("vibrate" in navigator) {
          navigator.vibrate(500);
        }
      } else {
        addStyle($(".s1"), { animation : "swing .5s both" });
      }

      await delay(500);
      particle.style = "";

      for (let i = 0; i < 4; i++) {
        $(`#b-${i + 1}`).style = "";
      }

      // Se genera otro patrón...
      if (ship === 2) {
        setSoundPattern();
        addStyle($(".s1"), { animation : "unset" });
      } else {
        await delay(500);
        Modal.show({
          icon: "🚀",
          txt: `<h2 ${inlineStyles({
            "margin-bottom": "10px",
          })}>Destroyed ship.</h2><p><b>You achieved ${score} points</b>, do you want to try again?</p>`,
          cb(answer) {
            answer ? restartGame() : Screen();
          },
        });
      }
    };

    /**
     * Habila/deshabilita los botones
     * @param {*} disabled
     */
    const changeButtonsState = (disabled = false) => {
      ObjectKeys(COLORS).forEach((v) => ($(`piano #${v}`).disabled = disabled));
    };

    /**
     * Función que ejecuta y muetra el sonido
     * @param {*} color
     */
    const executeButtonSound = (color = "") => {
      if (color !== "") {
        zzfx(...COLORS[color][3]);
      }

      ObjectKeys(COLORS).forEach(async (v) => {
        const element = $(`piano #${v}`);
        if (color === v) {
          addClass(element, "select");
          await delay(100);
          removeClass(element, "select");
        } else {
          removeClass(element, "select");
        }
      });
    };

    /**
     * Función que genera un nuevo patrón de sonido
     */
    const setSoundPattern = async (start = false) => {
      let index = 0;
      let counter = 0;
      soundPattern.push(ObjectKeys(COLORS)[randomNumber(0, 3)]);
      // Se bloquean los botones...
      changeButtonsState(true);

      if(start) {
        await delay(500);
      }

      if (intervalPattern) {
        clearInterval(intervalPattern);
      }

      intervalPattern = setInterval(() => {
        if (index >= soundPattern.length) {
          counterPattern = 0;
          clearInterval(intervalPattern);
          // Se habilitan los bototes...
          changeButtonsState(false);
        }

        if (counter % 2 === 0) {
          executeButtonSound(soundPattern[index]);
          index++;
        }

        counter++;
      }, 200);
    };

    /**
     * Función que revisa si el color seleccionado es el válido
     * @param {*} color
     */
    const checkSoundPattern = async (color = "") => {
      // Reproduce el sonido
      zzfx(...COLORS[color][3]);
      changeButtonsState(true);
      await delay(200);
      // Verificar si el sonido/color seleccionado es el válido...
      if (color === soundPattern[counterPattern]) {
        counterPattern++;
        if (counterPattern < soundPattern.length) {
          changeButtonsState(false);
        } else {
          shootLaser(2);
          score++;
          setHtml($("#score"), score);
          const currentScore = +getValueFromCache("score", 0);
          if (score > currentScore) {
            savePropierties("score", score);
          }
        }
      } else {
        shootLaser(1);
      }
    };

    const restartGame = async () => {
      soundPattern = [];
      counterPattern = 0;
      score = 0;
      addStyle($(".s2"), {animation : "up 400ms both"})
      setHtml($("#score"), score);
      await delay(200);
      setSoundPattern(true);
    };

    setHtml(
      $("#render"),
      `<div class="game cs wh" ${inlineStyles({ "flex-direction": "column" })}>
      ${PauseButton()}
      ${Bullets("laser")}
      <div id=particle>
      ${new Array(4)
        .fill(null)
        .map((_, i) => Bullets(`b-${i + 1}`))
        .join("")}
      </div>
      <div id=score>0</div>
      ${new Array(2)
        .fill(null)
        .map((_, i) =>
          Ship(i + 1, {
            width: "60px",
            height: "60px",
            filter: "drop-shadow(-14px -13px 3px var(--shadow))",
            "margin-bottom": i ? "30px" : "150px",
            "animation": `${i ? "up" : "down"} 400ms both`
          })
        )
        .join("")}
        ${Piano()}
      </div>`
    );

    $$("piano button").forEach((btn) =>
      $on(btn, "click", (e) => checkSoundPattern(e.target.id))
    );

    $on($("#pause"), "click", () => {
      if (intervalPattern) {
        clearInterval(intervalPattern);
      }

      Screen();
    });

    setSoundPattern(true);
  };

  const Lobby = () => {
    setHtml(
      $("#render"),
      `<div class="cs wh" ${inlineStyles({ "flex-direction": "column" })}>
        ${Ship(1, {
          width: "95px",
          height: "95px",
          filter: "drop-shadow(-14px -13px 3px var(--shadow))",
          "margin-bottom": "40px",
          animation: "rotation 10s infinite linear",
        })}
        <h1 class=logo ${inlineStyles({
          "margin-bottom": "10px",
        })}>Space War</h1>
        <h2>Best Score</h2>
        <div ${inlineStyles({
          "font-size": "60px",
          "font-weight": "bold",
        })}>${getValueFromCache("score", 0)}</div>
        <button class=button id=share>Share</button>
        <p class=copy>
          Press the right button to attack the enemy ship or your ship will be destroyed
        </p>
        <button class=button id=game>START</button>
        <a href=# id=about ${inlineStyles({
          color: "white",
          "z-index": 2,
          "font-size": "25px",
          "margin-top": "40px",
        })}>About</a>
      </div>`
    );

    $on($("#share"), "click", () => {
      const txt = `I have achieved ${getValueFromCache("score", 0)} points in Space War, how many can you achieve?`;
      shareAction(
        "Space War",
        txt,
        location.href,
        `<h2>Share</h2><p>${txt}</p><div ${inlineStyles({width : "85%", "margin-top" : "15px", "line-height" : 1.5})}><ul><li>${generateLink('Share in Twitter', `https://twitter.com/intent/tweet?text=${escape(`${txt} ${location.href}`)}`)}<ul><li>${generateLink('Share in Facebook', `https://www.facebook.com/sharer/sharer.php?u=${location.href}&quote=${escape(txt)}`)}<ul></div>`
      );
    });

    $on($("#game"), "click", () => Screen("Game"));
    $on($("#about"), "click", (e) => {
      e.preventDefault();
      Screen("About");
    });
  };

  const About = () => {
    setHtml(
      $("#render"),
      `<div class="cs wh" ${inlineStyles({ "flex-direction": "column" })}>
        ${PauseButton("⬅️")}
        ${Ship(2, {
          width: "100px",
          height: "100px",
          "margin-bottom": "30px",
        })}
        <h1 class=logo>Space War</h1>
        <h3>
        ${generateLink("By Jorge Rubiano", "https://github.com/Jorger")}
        </h3>
        <p class=copy>Space War is a game developed for the 2021 edition of the ${generateLink(
          "#JS13K",
          "https://js13kgames.com/"
        )}</p>
        <div ${inlineStyles({
          padding: "15px",
          width: "80%",
          "font-size": "20px",
          "line-height": "1.2",
          "margin-top": "-15px",
        })}><ul>${[
        ["Twitter", "https://twitter.com/ostjh"],
        ["Github", "https://github.com/Jorger"],
        ["Linkedin", "https://www.linkedin.com/in/jorge-rubiano-a8616319"],
      ]
        .map(
          (v) =>
            `<li ${inlineStyles({ "margin-bottom": "5px" })}>${generateLink(
              v[0],
              v[1]
            )}</li>`
        )
        .join("")}</ul></div>
      </div>`
    );
    $on($("#pause"), "click", () => Screen());
  };

  const Screen = (screen = "Lobby") => {
    const Handler = {
      Lobby,
      Game,
      About,
    };

    Handler[screen]();
  };

  const customClass = `piano button {
    height: calc(var(--w) * 0.22);
    width: calc(var(--w) * 0.3);
    border: none;
    cursor: pointer;
    margin: 5%;
    -webkit-tap-highlight-color: transparent;
    box-shadow: ${new Array(7)
      .fill(null)
      .map(
        (_, i) =>
          `var(--shadow) ${-2 * (i + 1)}px ${-2 * (i + 1)}px ${
            2 * (i + 1)
          }px 0px`
      )
      .join(",")};
  }
  ${ObjectKeys(COLORS)
    .map(
      (v) => `
    piano button#${v} {
      background: ${COLORS[v][0]};
      border-bottom: 10px solid ${COLORS[v][1]};
    }

    piano button#${v}:active, 
    piano button#${v}.select {
      border-bottom: 0;
      background : ${COLORS[v][2]};
      transform: translateY(4px);
    }`).join("")}
    ${["down", 'up'].map(v => `
    @keyframes ${v} {
      from { transform: translate3d(0, ${v === "down" ? "-100" : "100"}vh, 0); visibility: visible; }
      to { transform: translate3d(0, 0, 0); }
    }
    `).join("")}`;

  const style = document.createElement("style");
  setHtml(style, customClass);
  $("head").appendChild(style);

  setHtml($("#root"), `${Modal.render()}<div id="render" class="wh cs">`);
  Modal.events();

  if (!ObjectKeys(getDataCache()).length) {
    savePropierties("score", 0);
  }

  Screen();
  $on(document, "contextmenu", (event) => event.preventDefault());
  $on(window, "resize", onWindowResize);
  onWindowResize();
  console.log("%cGame developed by Jorge Rubiano.", "color:red; font-size:20px; font-weight: bold; -webkit-text-stroke: 1px black; border-radius:10px; padding: 20px; background-color: black;"
  );
})();
