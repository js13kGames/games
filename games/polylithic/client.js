"use strict";

const COLOR_OWN_MOTHERSHIP_FILL = '#009688';
const COLOR_OPPONENT_MOTHERSHIP_FILL = '#FF5722';

const COLOR_OWN_DRONE_FILL = '#00BFA5';
const COLOR_OPPONENT_DRONE_FILL = '#DD2C00';
const COLOR_OWN_SELECTED_DRONE_FILL = '#FAFAFA';
const COLOR_OPPONENT_DRONE_CARRYING_FILL = 'rgba(0, 200, 100, 0.1)';
const COLOR_OWN_DRONE_CARRYING_FILL = 'rgba(100, 200, 0, 0.1)';

const DRONE_SELECTION_RADIUS = 50;

/** 
@class GameClient
=========================================================================================
Contains all of game logic. 
Communicates with outside using the Outside instance.
=========================================================================================
*/

class GameClient {

  constructor({ canvasEl, outside }) {
    this.canvasEl = canvasEl;
    this.outside = outside;
    this.isGameRunning = false;
    this.socket = null;
    this.gameData = null;
    this.mouse = {
      x: 0,
      y: 0,
      isPressed: false,
      isPrimary: true
    };
    this.fps = 0;
    this.setUpWebsocketAndInitiateMatchmaking();
  }

  setUpWebsocketAndInitiateMatchmaking() {
    this.outside.showFullPageMessage({ message: 'Waiting for opponent...' });
    let socket = this.socket = io({ upgrade: false, transports: ["websocket"], reconnection: false });

    socket.on("disconnect", () => {
      this.isGameRunning = false;
      this.outside.showFullPageMessage({ message: 'DISCONNECT! <br><br> You forfeited the game.', level: 'error' });
    });

    socket.on("error", (err) => {
      this.isGameRunning = false;
      this.outside.showFullPageMessage({ message: 'ERROR! <br><br> You forfeited the game.', level: 'error' });
    });

    socket.on("connect", () => {
      'pass';
    });

    socket.on("game-data", (data) => {
      // console.log("game-data", data)
      if (!this.isGameRunning) {
        this.isGameRunning = true;
        this.outside.notifyGameStart();
        this.secondaryLoop();
      }
      this.gameData = data;
      this.prepareCanvas();
      this.mainLoop();
    });

    socket.on("game-end", (data) => {
      this.isGameRunning = false;
      let { verdict, message } = data;
      let bigMessage, level;
      if (verdict === 'victory') {
        bigMessage = 'YOU WIN';
        level = 'success';
      } else {
        bigMessage = 'BETTER LUCK NEXT TIME'
        level = 'error';
      }
      this.outside.showFullPageMessage({ message, bigMessage, level });
    });
  }

  prepareCanvas() {
    this.ctx = this.canvasEl.getContext('2d');
    this.canvasWidth = this.canvasEl.width;
    this.canvasHeight = this.canvasEl.height;
  }

  drawBackdrop() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawMothership(whose) {
    let { health, x, y, r } = this.gameData[whose].mothership;
    if (whose === 'own') {
      this.ctx.fillStyle = COLOR_OWN_MOTHERSHIP_FILL;
    } else {
      this.ctx.fillStyle = COLOR_OPPONENT_MOTHERSHIP_FILL;
    }
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctx.fill();

    let healthX = (x === 0 ? x + r : x - r);
    let healthY = y - r * 2;
    this.drawHealth(healthX, healthY, health, MOTHERSHIP_MAX_HEALTH);
  }

  drawStoneReserves(whose) {
    let { stoneReserve } = this.gameData[whose];
    let { x, r } = this.gameData[whose].mothership;

    if (whose === 'own') {
      this.ctx.fillStyle = COLOR_OWN_MOTHERSHIP_FILL;
    } else {
      this.ctx.fillStyle = COLOR_OPPONENT_MOTHERSHIP_FILL;
    }

    let textX = (x === 0 ? x + r : x - r * 2);
    this.ctx.font = '48px serif';
    this.ctx.fillText(String(stoneReserve), textX, 100);

  }

  drawHealth(x, y, value, max) {
    value = Math.max(value, 0);
    let factor = value / max;
    let height = 40;
    let width = 4;
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(x, y, width, height);
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(x, y, width, height - (height * factor));
  }

  drawDrone(drone, whose) {
    let { x, y, r, carryingStone, pathList, id } = drone;

    this.ctx.fillStyle = (whose === 'own' ? COLOR_OWN_DRONE_CARRYING_FILL : COLOR_OPPONENT_DRONE_CARRYING_FILL);;
    this.ctx.beginPath();
    let carryingRad = (this.selectedDrone && this.selectedDrone.id === id) ? r + carryingStone + 5 : r + carryingStone;
    this.ctx.arc(x, y, carryingRad, 0, 2 * Math.PI, false);
    this.ctx.fill();

    if (whose === 'own' && this.selectedDrone && this.selectedDrone.id === id) {
      this.ctx.fillStyle = COLOR_OWN_SELECTED_DRONE_FILL;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r + 5, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }
    this.ctx.fillStyle = (whose === 'own' ? COLOR_OWN_DRONE_FILL : COLOR_OPPONENT_DRONE_FILL);
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    this.ctx.fill();
    if (whose === 'own') {
      if (pathList.length > 0) {
        let { x2, y2 } = pathList[0];
        this.ctx.strokeStyle = '#B0BEC5';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([8, 6]);
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, r, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    }
  }

  drawStone(stone) {
    let { x, y, r } = stone;
    this.ctx.fillStyle = 'yellow';
    let width = r;
    let height = r;
    this.ctx.beginPath();
    this.ctx.moveTo(x + width * 0.5, y);
    this.ctx.lineTo(x, y + height * 0.5);
    this.ctx.lineTo(x + width * 0.5, y + height);
    this.ctx.lineTo(x + width, y + height * 0.5);
    this.ctx.lineTo(x + width * 0.5, y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  updateFps() {
    if (!this.__fps__time) this.__fps__time = Date.now();
    if (Date.now() - this.__fps__time > 1000) {
      document.getElementById('fps').innerHTML = '' + this.fps;
      this.__fps__time = Date.now();
      this.fps = 0;
    }
    this.fps += 1;
  }

  mainLoop() {
    this.drawBackdrop();
    this.drawMothership('own');
    this.drawMothership('opponent');
    this.drawStoneReserves('own');
    this.drawStoneReserves('opponent');
    this.gameData.stoneList.forEach(stone => this.drawStone(stone));
    this.gameData.opponent.droneList.forEach(drone => this.drawDrone(drone, 'opponent'));
    this.gameData.own.droneList.forEach(drone => this.drawDrone(drone, 'own'));
    this.updateFps();
  }

  drawCursor() {
    let { x, y, isPressed } = this.mouse;
    this.ctx.strokeStyle = (isPressed ? '#FFEB3B' : '#4CAF50');
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(x - 15, y);
    this.ctx.lineTo(x + 15, y);
    this.ctx.moveTo(x, y - 15);
    this.ctx.lineTo(x, y + 15);
    this.ctx.stroke();
  }

  drawPossibleTargetPath() {
    if (this.selectedDrone) {
      this.selectedDrone = this.gameData.own.droneList.find(drone => drone.id === this.selectedDrone.id);
    }
    if (this.selectedDrone) {
      let { x, y, r } = this.selectedDrone;
      let { x: x2, y: y2, isPressed } = this.mouse;
      this.ctx.strokeStyle = (isPressed ? '#FFEB3B' : '#4CAF50');
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([8, 6]);
      this.ctx.beginPath();
      this.ctx.arc(x2, y2, r, 0, 2 * Math.PI, false);
      this.ctx.stroke();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  secondaryLoop() {
    if (!this.isGameRunning) return;
    if (this.gameData) {
      this.drawCursor();
      this.drawPossibleTargetPath();
    }
    requestAnimationFrame(() => {
      this.secondaryLoop();
    });
  }

  setMouseCoord({ x, y }) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  setMouseDownStatus(isPrimary, isPressed) {
    this.mouse.isPressed = isPressed;
    this.mouse.isPrimary = isPrimary;
  }

  onMouseClick(isPrimary) {
    if (!this.gameData) return;
    let { x, y } = this.mouse;

    if (isPrimary) {
      let isClickingMothership = (() => {
        let { x: x1, y: y1, r } = this.gameData.own.mothership;
        return (Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y)) < r);
      })();
      if (isClickingMothership) {
        this.socket.emit('command:spawn-drone', {});
        return
      }
      let nearby = this.gameData.own.droneList.map(drone => {
        let { x: x1, y: y1 } = drone;
        return { d: (Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y))), drone };
      })
        .filter(({ d, drone }) => d < (drone.r + DRONE_SELECTION_RADIUS))
        .sort((a, b) => a.d - b.d);
      let drone = (nearby.length > 0 ? nearby[0].drone : null);
      if (drone) {
        this.selectedDrone = drone;
      } else {
        this.selectedDrone = null;
      }
    } else {
      if (this.selectedDrone) {
        this.socket.emit('command:move-drone', { x, y, id: this.selectedDrone.id });
      }
    }
  }

}



/** 
@class Outside
=========================================================================================
Interacts with UI and User
=========================================================================================
*/

class Outside {

  _el(querySelector) { return document.querySelector(querySelector); };

  _on(querySelector, eventName, fn) { return this._el(querySelector).addEventListener(eventName, fn); };

  _setDisplayStyle(querySelector, value) { return this._el(querySelector).style.display = value };

  showFullPageMessage({ message, level = 'info', bigMessage = '' }) {
    this._setDisplayStyle('#menu', 'flex');
    this._setDisplayStyle('#message-box', 'block');
    this._setDisplayStyle('#canvas', 'none');
    let color = {
      'info': 'blue',
      'success': 'green',
      'error': 'red'
    }[level];
    this._el('#message').style.color = color;
    this._el('#message').innerHTML = message;
    this._el('#big-message').style.color = color;
    this._el('#big-message').innerHTML = bigMessage;
  }

  notifyGameStart() {
    this._setDisplayStyle('#menu', 'none');
    this._setDisplayStyle('#canvas', 'block');
  }

  start() {
    this._on('#playButton', 'click', () => {
      this._setDisplayStyle('#intro', 'none');
      this._gameClient = new GameClient({
        canvasEl: this._el('#canvas'),
        outside: this
      });

      this._on('#canvas', 'mousemove', (evt) => {
        var rect = canvas.getBoundingClientRect();
        this._gameClient.setMouseCoord({
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        });
      });

      this._on('#canvas', 'mousedown', (evt) => {
        let isPrimary = (event.button === 0);
        this._gameClient.setMouseDownStatus(isPrimary, false);
        this._gameClient.onMouseClick(isPrimary);
      });

      this._on('#canvas', 'mouseup', (event) => {
        let isPrimary = (event.button === 0);
        this._gameClient.setMouseDownStatus(isPrimary, true);
      });

    });
    // playButton.click(); // FOR TESTING
  }

}

/** 
@code Wrapper
=========================================================================================
Interacts with UI and User
=========================================================================================
*/

window.addEventListener("load", () => {
  (new Outside()).start();
});
