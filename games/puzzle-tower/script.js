const $ = document.querySelector.bind(document);
const _ = document.querySelectorAll.bind(document);
let STAGE_NUM = 0;
let RAISE_FLG = false;
const SCRN_WIDTH = 375;
const SCRN_HEIGHT = 375;
const PANEL_HEIGHT = SCRN_HEIGHT / 10;
const PANEL_WIDTH = PANEL_HEIGHT * 0.6;
const CLOUDS_BASE = 'The quick brown fox jumps over the lazy dog';
const TOWER_RADIUS = PANEL_WIDTH / 2 * Math.tan(deg2rad(75));
const GND_SIZE = TOWER_RADIUS * 3.5;
const PERS = SCRN_HEIGHT;
let FLOOR_CNT = 4;
const TOWER_OFFSET_X = (SCRN_WIDTH - (TOWER_RADIUS * 2)) / 2;
let TOWER_OFFSET_Y;
let TOWER_ANGLE;
let TIME_LIMIT = 0;//500
let TOWER_HEIGHT;
let GAME_START = false;
let START_TIME = 0;
let ROTATE_R = false;
let ROTATE_L = false;
let LOCK = false;
let SCALE = 1; //TBD

const LOC = {
  x: 0,
  y: 0,
  z: 0,
  degX: 15,//-30〜20, 15
  degY: 0,
  /*rTurnHandle: 0,
  rTurnStart: function () {
    this.rTurnHandle = setInterval(function () {
//      LOC.degY++;
//      LOC.degY += 5;
      LOC.degY += 2;
    }, 33);
  },
  rTurnStop: function () {
    clearInterval(this.rTurnHandle);
  },*/
};

function select(e) {
  if (!GAME_START) return;
  if (LOCK) return;
  LOCK = true;
  let targetRow = Number(e.target.dataset.row);
  let targetCol = Number(e.target.dataset.col);
  let rows = _('.panel:not(.back):not(.ph):not(.g)[data-col="' + targetCol + '"]');
  // vertical
  if (rows.length == (FLOOR_CNT - 1) * 2) {
    let rowNums = [], spaceRowNum;
    rows.forEach(row => {
      let rowNum = Number(row.dataset.row);
      if (!rowNums.includes(rowNum)) rowNums.push(rowNum);
    });
    for (let i = 1; i <= FLOOR_CNT; i++) {
      if (rowNums.includes(i)) continue;
      spaceRowNum = i;
    }
    rowNums = rowNums.filter(rowNum => {
      if (targetRow > spaceRowNum) {
        if (rowNum <= targetRow && rowNum > spaceRowNum) return true;
      } else {
        if (rowNum >= targetRow && rowNum < spaceRowNum) return true;
      }
    });
    _('.panel[data-col="' + targetCol + '"]').forEach(panel => {
      let rowNum = Number(panel.dataset.row);
      if (targetRow > spaceRowNum) {
        if (rowNum <= targetRow && rowNum > spaceRowNum) panel.dataset.row = rowNum - 1;
      } else {
        if (rowNum >= targetRow && rowNum < spaceRowNum) panel.dataset.row = rowNum + 1;
      }
      movePanal(panel);
    });
  // horizontal
  } else {
    let cols = _('.panel[data-row="' + targetRow + '"]');
    cols.forEach(col => {
      if (col.dataset.col < 5) {
        col.dataset.col = Number(col.dataset.col) + 1;
      } else {
        col.dataset.col = 0;
      }
      let newDeg = Number(col.dataset.deg) + 60;
      col.dataset.deg = newDeg;
      let j = (newDeg / 30) % 12;
      col.classList.remove('o1');
      col.classList.remove('o2');
      col.classList.remove('o3');
      if (j == 0 || j == 5) col.classList.add('o1');
      if (j == 1 || j == 4) col.classList.add('o2');
      if (j == 2 || j == 3) col.classList.add('o3');
      movePanal(col);
    });
  }
}

function movePanal(panel) {
  let offsetY = PANEL_HEIGHT * (FLOOR_CNT + 1 - panel.dataset.row);
  let scaleX = panel.classList.contains('ph') ? 0.8 : 1;
  let reverse = panel.classList.contains('back') ? ' rotateY(180deg)' : '';
  
  let transform = 'translateX(' + (TOWER_RADIUS - PANEL_WIDTH / 2) + 'px) translateY(' + offsetY + 'px) rotateY(' + panel.dataset.deg + 'deg) scale(' + scaleX + ', 1) translateZ(' + TOWER_RADIUS * scaleX + 'px)' + reverse;
  
  panel.style.transform = transform;
}

function draw() {
  if (ROTATE_R) {
    LOC.degY--;
    //LOC.degY = LOC.degY - 0.1;
  } else if(ROTATE_L) {
    LOC.degY++;
  }
  let transform = 'rotateX(' + LOC.degX + 'deg) rotateY(' + LOC.degY + 'deg) translateY(' + LOC.y + 'px) ';
  $('#container').style.transform = transform;
  if (GAME_START) {
    let now = Date.now();
    //$('#time .now').innerText = now;
    //$('#time .elapse').innerText = (now - START_TIME) / 1000;
    
    let limit = TIME_LIMIT - parseInt((now - START_TIME) / 1000);
    $('#info .limit').innerText = 'Time ' + ('00' + limit).slice(-3);
    if (limit < 1) gameOver();
  }
  requestAnimationFrame(draw);
}

window.onload = function() {
  init();
  
  $('#rotateR').onclick = e => {
    if (!ROTATE_R) {
      ROTATE_R = true;
      ROTATE_L = false;
    } else {
      ROTATE_R = false;
    }
  };
  
  $('#rotateL').onclick = e => {
    if (!ROTATE_L) {
      ROTATE_L = true;
      ROTATE_R = false;
    } else {
      ROTATE_L = false;
    }
  };
  
  $('#start input').onclick = e => start();
  
  requestAnimationFrame(draw);
}

function init() {
  TOWER_HEIGHT = PANEL_HEIGHT * (FLOOR_CNT + 2);
  TOWER_OFFSET_Y = PANEL_HEIGHT * (7 - FLOOR_CNT);
  $('#title').style.width = SCRN_WIDTH - 40 + "px";
  $('#title').style.height = SCRN_HEIGHT - 40 + "px";
  $('#start').style.width = SCRN_WIDTH - 40 + "px";
  $('#ctrl').style.width = SCRN_WIDTH + "px";
  _('#ctrl input').forEach(e => {
    e.style.width = SCRN_WIDTH / 8 + "px";
    e.style.height = SCRN_HEIGHT + "px";
  });
  $('#info').style.width = SCRN_WIDTH + "px";
  
  $('#scrn').style.width = SCRN_WIDTH + "px";
  $('#scrn').style.height = SCRN_HEIGHT + "px";
  $('#scrn').style.perspective = PERS + "px";
  
  $('#container').style.height = SCRN_HEIGHT + "px";
  
  $('#ground').style.width = GND_SIZE + "px";
  $('#ground').style.height = GND_SIZE + "px";
  let gndOffsetX = (SCRN_WIDTH - GND_SIZE) / 2;
  let gndOffsetY = (GND_SIZE / -2 + PANEL_HEIGHT * 9) + 1;
  $('#ground').style.transform = 'translate3d(' + gndOffsetX + 'px, ' + gndOffsetY + 'px, 0) rotateX(90deg)';
  
  $('.panel').style.width = PANEL_WIDTH + "px";
  $('.panel').style.height = PANEL_HEIGHT + "px";
  
  $('#tower').style.height = PANEL_HEIGHT * (FLOOR_CNT + 2) + "px";
  $('#tower').style.width = TOWER_RADIUS * 2 + "px";
  $('#flg').style.width = PANEL_WIDTH + "px";
  $('#flg').style.height = PANEL_WIDTH + "px";
  $('#flg').style.lineHeight = PANEL_WIDTH + "px";
  $('#top').style.width = TOWER_RADIUS * 2 + "px";
  $('#top').style.height = TOWER_RADIUS * 2 + "px";
  $('#top').style.transform = 'translateY(-' + TOWER_RADIUS + 'px) rotateX(90deg) scale(0.8)';
  $('#roof').style.width = TOWER_RADIUS * 2 + "px";
  $('#roof').style.height = TOWER_RADIUS * 2 + "px";
  $('#roof').style.transform = 'translateY(' + (PANEL_HEIGHT - TOWER_RADIUS + 0.5) + 'px) rotateX(90deg)';
  $('#btm').style.width = TOWER_RADIUS * 2 + "px";
  $('#btm').style.height = TOWER_RADIUS * 2 + "px";
  $('#btm').style.transform = 'translateY(' + (TOWER_HEIGHT - TOWER_RADIUS) + 'px) rotateX(90deg)';
  $('#shadow').style.height = TOWER_HEIGHT + "px";
  $('#shadow').style.width = TOWER_RADIUS * 2 + "px";
  $('#shadow').style.borderRadius = TOWER_RADIUS + "px";
  $('#shadow').style.transform = 'translate3d(' + TOWER_OFFSET_X + 'px, ' + TOWER_OFFSET_Y + 'px, 0) rotateY(-90deg) rotateX(90deg)';
  
  let floorNums = [];
  for (let i = FLOOR_CNT; i > 0; i--) {
    for (let j = 0; j < 6; j++) {
      floorNums.push(i);
    }
  }
  shuffle(floorNums);
  
  for (let i = 0; i < (FLOOR_CNT + 2); i++) {
    for (let j = 0; j < 12; j++) {
      let panel = $('.panel.origin').cloneNode();
      panel.classList.remove('origin');
      panel.dataset.row = i;
      panel.dataset.col = parseInt(j / 2);
      panel.dataset.deg = j * 30;
      if (i == FLOOR_CNT + 1) panel.classList.add('ph');
      if (i == 0) panel.classList.add('g');
      let backPanel = panel.cloneNode();
      backPanel.classList.add('back');

      movePanal(panel);
      movePanal(backPanel);
      
      if (i > 0 && i < FLOOR_CNT + 1) {
        if (j % 2 == 0) {
          let floorNum = floorNums.pop();
          panel.innerText = floorNum;
        }
        panel.onclick = select;
        panel.ontransitionend = e => {
          if (!LOCK) return;
          LOCK = false;
          if (judge()) {
            //RAISE_FLG = false;
            raiseFlag();
          }
        };
      }
      
      if (j % 2 == 0) {
        panel.classList.add('left');
      } else {
        panel.classList.add('right');
      }
      
      if (j == 0 || j == 5) panel.classList.add('o1');
      if (j == 1 || j == 4) panel.classList.add('o2');
      if (j == 2 || j == 3) panel.classList.add('o3');
      
      $('#tower').appendChild(panel);
      $('#tower').appendChild(backPanel);
    }
  }
  _('.panel[data-row="1"][data-col="0"]').forEach(elm => {
    elm.remove();
  });
  judge();
  
  let bldgHeight = PANEL_HEIGHT * 2;
  $('.bldg').style.width = SCRN_WIDTH * 2 + "px";
  $('.bldg').style.height = bldgHeight + "px";
  for (let i = 0; i < 4; i++) {
    let bldg = $('.bldg').cloneNode();
    bldg.classList.remove('origin');
    bldg.style.transform = 'translate3d(-' + SCRN_WIDTH / 2 + 'px, ' + (PANEL_HEIGHT * 9 - bldgHeight) + 'px, 0) rotateY(' + 90 * i + 'deg) translateZ(-' + SCRN_WIDTH + 'px)';
    $('#container').appendChild(bldg);
  }
  
  setClouds();
}

function start() {
  $('#title').style.display = 'none';
  $('#title .first').style.display = 'none';
  $('#info').style.display = 'block';
  _('.panel').forEach(elm => {
    elm.style.color = '#fff';
    elm.style.textShadow = '1px 1px 0 red,-1px 1px 0 red,1px -1px 0 red,-1px -1px 0 red';
  });
  $('#tower').style.transition = 'ease-in 1s';
  START_TIME = Date.now();
  GAME_START = true;
  $('#flg').style.display = 'none';
  if (STAGE_NUM > 0) {
    FLOOR_CNT++;
    _('#tower .panel').forEach(p => p.remove());
    init();
  }
  STAGE_NUM++;
  TIME_LIMIT = STAGE_NUM * 120;
}

function gameOver() {
  $('#tower').animate(
    [
      {
        transform : 'translate3d(' + TOWER_OFFSET_X + 'px, ' + TOWER_OFFSET_Y + 'px, 0) rotateZ(' + TOWER_ANGLE + 'deg)',
      },
      {
        transform : 'translate3d(' + (TOWER_OFFSET_X + TOWER_RADIUS * 2) + 'px, ' + (TOWER_OFFSET_Y - TOWER_RADIUS * 2) + 'px, 0) rotateZ(' + 90 + 'deg)',
        offset: 0.90
      },
      {
        transform : 'translate3d(' + (TOWER_OFFSET_X + TOWER_RADIUS * 2) + 'px, ' + (TOWER_OFFSET_Y - TOWER_RADIUS * 2) + 'px, 0) rotateZ(' + 89 + 'deg)',
        offset: 0.95
      },
      {
        transform : 'translate3d(' + (TOWER_OFFSET_X + TOWER_RADIUS * 2) + 'px, ' + (TOWER_OFFSET_Y - TOWER_RADIUS * 2) + 'px, 0) rotateZ(' + 90 + 'deg)',
        offset: 1
      },
    ],
    {
      duration: 2000,
      fill: 'forwards',
      easing: 'ease-in'
    }
  );
  //ROTATE_R = true;
  //LOC.degY = -90;
  //$('#tower').style.transformOrigin = 'right bottom';
  //$('#roof').style.background = '#8A8180';
  $('#btm').style.display = 'block';
  GAME_START = false;
}

function judge() {
  let fRatio = fitRatio();
  tiltTower(fRatio);
  if (fRatio == 1) return true;
  return false;
}

function tiltTower(ratio) {
  const MAX_ANGLE = 5.5;//5.5
  const MIN_ANGLE = 0;//3.97
  TOWER_ANGLE = MAX_ANGLE - (MAX_ANGLE - MIN_ANGLE) * ratio;
  $('#tower').style.transform = 'translate3d(' + TOWER_OFFSET_X + 'px, ' + TOWER_OFFSET_Y + 'px, 0) rotateZ(' + TOWER_ANGLE + 'deg)';
  $('#info .angle').innerText = 'Lean ' + (parseInt(TOWER_ANGLE * 100) / 100).toFixed(2) + '°';
}

function fitRatio() {
  let fitCount = 0;
  _('.panel.left:not(.back):not(.ph):not(.g)').forEach(panel => {
    if (panel.dataset.row == panel.innerText) fitCount++;
  });
  //$('#fitRatio').innerText = fitCount / 35;
  return fitCount / (FLOOR_CNT * 6 - 1);
}

function raiseFlag() {
  $('#flg').style.display = 'block';
  $('#flg').animate(
    [
      {
        transform: 'translateX(' + TOWER_RADIUS + 'px) translateY(-' + PANEL_WIDTH * 2 + 'px)'
      },
      {
        transform: 'translateX(' + TOWER_RADIUS + 'px) rotateY(30deg) translateY(-' + PANEL_WIDTH * 2 + 'px)',
        background: '#c00'
      },
      {
        transform: 'translateX(' + TOWER_RADIUS + 'px) translateY(-' + PANEL_WIDTH * 2 + 'px)'
      }
    ],
    {
      duration: 1000,
      iterations: Infinity
    }
  );
  //STAGE_NUM++;
  //alert(STAGE_NUM);
  //RAISE_FLG = true;
  GAME_START = false;
  $('#title').style.display = 'block';
  $('#info').style.display = 'none';
  if (STAGE_NUM == 1) {
    $('#title .second').style.display = 'block';
  } else if(STAGE_NUM == 2) {
    $('#title .second').style.display = 'none';
    $('#title .third').style.display = 'block';
  } else if(STAGE_NUM == 3) {
    $('#title .third').style.display = 'none';
    $('#start').style.display = 'none';
    $('#title .fin').style.display = 'block';
  }
}

function setClouds() {
  $('#clouds').style.width = SCRN_WIDTH + "px";
  let base = CLOUDS_BASE.split(' ');
  base.forEach(b => {
    let elm = document.createElement('p');
    elm.innerText = b;
    elm.style.width = SCRN_WIDTH + "px";
    let deg = rand(0, 359);
    let dist = rand(250, 1000);
    elm.style.transform = 'rotateY(' + deg + 'deg) translateZ(-' + dist + 'px) ';
    elm.style.fontSize = dist / 150 + 'em';
    $('#clouds').appendChild(elm);
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function deg2rad(degree) {
  return degree * Math.PI / 180;
}

function debug(key, value) {
  $('#d-' + key + ' span').innerText = value;
}