'use strict';

var socket = {};
var config = { pad1:0.5, pad2:0.5, ballX:0.5, ballY:0.5 };
var connected = false;
var playerName = 'Player '+Math.random().toString().replace(/.*\./,'');

function connect() {
  connected = true;
  console.log('connecting');
  if (!socket.connected) socket = io(document.location.href);
  socket.on('news', onNews);
  socket.on('config', onConfig);
  socket.on('disconnect', onDisconnect);
  socket.emit('playerInfo', { name: playerName });
  setTimeout(tic, 10);
}

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(fn){ setTimeout(fn, 33); };

function tic() {
  if (!connected) return;
  pad1.style.top  = (100 * config.pad1)  + '%';
  pad2.style.top  = (100 * config.pad2)  + '%';
  ball.style.top  = (100 * config.ballY) + '%';
  ball.style.left = (100 * config.ballX) + '%';
  window.requestAnimationFrame(tic);
};

function onNews(data) {
  console.log(data);
  var msg = document.createElement('p');
  msg.className = 'show';
  msg.innerHTML = data.message;
  messageBox.appendChild(msg);
  setTimeout(function(){ msg.className = '' }, 10);
  setTimeout(function(){ messageBox.removeChild(msg) }, 20*1000);
}

var endGameMsg = 'The server connection dropped.';
function onConfig(data) {
  for (var k in data) { config[k] = data[k] }
  player1.innerHTML = config.player1 +
                      ' <b>'+config.pointsP1+'</b>' +
                      '<br><small>Last record '+config.recordP1+'</small>';
  player2.innerHTML = '<b>'+config.pointsP2+'</b> ' +
                      config.player2 +
                      '<br><small>Last record '+config.recordP2+'</small>';
  if (data.playing===false) {
    endGameMsg = data.message || 'The server connection dropped.';
  }
}

function onDisconnect(data) {
  connected = false;
  console.log('disconnected', data);
  openDialog(
    'Disconnected', endGameMsg+'<br>Do you want to reconnect?',
    'Reconnect', function() {
      document.location.reload();
      dialog.style.display = 'none';
  });
}

function openNameDialog() {
  var name = docCookies.getItem('playerName') || '';
  openDialog(
    'Welcome',
    'What is your name?' +
    '<form onsubmit="getName(); return false">' +
    '<input id="playerNameInput" value="'+name+'"></form>',
    'Enter', getName
  );
}
function getName() {
  docCookies.setItem('playerName', playerNameInput.value, Infinity);
  playerName = playerNameInput.value;
  dialog.style.display = 'none';
  connect();
}

function openDialog(title, content, btLabel, btFunc) {
  console.log('open dialog', title, dialog);
  dialog.style.display = 'block';
  dialogTitle.innerHTML = title;
  dialogContent.innerHTML = content;
  dialogBtFunc.innerHTML = btLabel;
  dialogBtFunc.onclick = btFunc;
  console.log('open dialog done');
}

var lastY = 0;
var currentY = 0;
document.ontouchmove = function(ev) {
  currentY = ev.touches[0].screenY;
  ev.preventDefault();
};
document.onmousemove = function(ev) {
  currentY = ev.clientY;
};
setInterval(function(){
  // Submit mouse position only each 33ms if it was changed.
  if (!connected || !config.playing) return;
  if (lastY != currentY) {
    lastY = currentY
    socket.emit('move', { y: currentY/document.body.clientHeight });
  }
}, 33);

