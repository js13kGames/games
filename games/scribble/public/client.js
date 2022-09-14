"use strict";

(function () {

    var socket;
    var canvas = document.getElementById('gameBoard');
    var guessLogList = document.getElementById('guessLogList');
    var scoreList = document.getElementById('scoreList');
    var canvasPressed = false, drawLock = true;
    var ctx = canvas.getContext('2d');
    var rect = canvas.getBoundingClientRect();
    var initClientX, initClientY;

    function setConnectionStatus(message) {
        var connectionStatus = document.getElementById('connectionStatus');
        connectionStatus.innerText = message;
    }

    function setCurrentView(viewName) {
        var views = ['Join', 'Game', 'Result'];

        for(var i=0; i < views.length; i++) {
            var viewDisplay = 'none';
            if (views[i] === viewName) {
                viewDisplay = 'block'
            }
            document
                .getElementById('page' + views[i])
                .style.display = viewDisplay;
        }
    }

    function setVisibility(component, visibility) {
        component.style.display = visibility;
    }

    function bindConnectionEvents() {
        socket.on("connect", function () {
            setConnectionStatus('Have fun!')
        });

        socket.on("disconnect", function () {
            setConnectionStatus("Connection lost!");
        });

        socket.on("error", function () {
            setConnectionStatus("Connection error!");
        });
    }

    function bindGameEvents() {
        socket.on('gameStart', function (payload) {
            console.log(payload);
            var guessers = [];
            var drawer;
            var playerDetails = document.getElementById('playerDetails');             
            for (var i = 0; i < payload.players.length; i++) {
                var user = payload.players[i];
                if (i == payload.drawingPlayerId) {
                    drawer = user;
                } else {
                    guessers.push(user.name);
                }
            }
            if (payload.word) {
                drawLock = false;
                document.getElementById('help').innerHTML = 'Draw and help ' + guessers.join() + ' find the lost <h2>' + payload.word + '</h2>';
                setVisibility(document.getElementById('guessComponent'), 'none');
            } else {
                drawLock = true;
                document.getElementById('help').innerHTML = drawer.name + ' is trying to help you find a lost object.'
                setVisibility(document.getElementById('guessComponent'), 'block');
            }
        });

        var remoteMousePressed = false;
        socket.on('draw-mousedown', function (evt) {
            console.log('draw event', evt);
            remoteMousePressed = true;
            ctx.beginPath();
            ctx.moveTo(evt.clientX, evt.clientY);
        });
        socket.on('draw-mouseup', function (evt) {
            console.log('draw event', evt);
            remoteMousePressed = false;
        });
        socket.on('draw-mousemove', function (evt) {
            console.log('draw event', evt);
            if (remoteMousePressed) {
                ctx.lineTo(evt.clientX, evt.clientY);
                ctx.moveTo(evt.clientX, evt.clientY);
                ctx.stroke();
            }
        });
        socket.on('guess-correct', function (payload) {
            console.log('correct', payload);
            var ele = document.createElement('li');
            ele.innerHTML = payload.by  + ' found the lost object (+1)';
            guessLogList.appendChild(ele);
            setVisibility(document.getElementById('guessComponent'), 'none');
        });
        socket.on('guess-wrong', function (payload) {
            console.log('wrong', payload);
            var ele = document.createElement('li');
            ele.innerHTML = 'Wrong guess <b>' + payload.word + '</b> by ' + payload.by;
            guessLogList.appendChild(ele);
            document.getElementById('guessComment').innerHTML = '<span style="color: red;">' + payload.word + '</span> is wrong.';
            document.getElementById('guessBox').value = '';
        });
        socket.on('game-end', function (payload) {
            console.log('game-end', payload);
            setCurrentView('Result'); 
            var drawer;
            var guessers = [];           
            for (var i = 0; i < payload.players.length; i++) {
                var player = payload.players[i];
                if (i === payload.drawingPlayerId)
                    drawer = player;
                else
                    guessers.push(player.name);
            }
            document.getElementById('resultComment').innerHTML = drawer.name + ' helped ' +
                guessers.join() + ' to find the lost ' + payload.word + ' on the internet.';
        });
    }

    window.joinGame = function(username) {
        document.getElementById('help').innerHTML = 'Trying to find someone to play with you...';
        socket.emit('join', {username: username});
        setCurrentView('Game');
        setVisibility(document.getElementById('guessComponent'), 'none');
    };

    window.guessWord = function(word) {
        if (word && word.length > 0)
            socket.emit('guess', {word: word});
    };
    
    canvas.addEventListener('mousedown', function (evt) {
      console.log('event mousedown', evt);
      if (drawLock) return;
      canvasPressed = true;
      ctx.beginPath();
      ctx.moveTo(evt.clientX, evt.clientY);
      socket.emit('draw-mousedown', { clientX: evt.clientX, clientY: evt.clientY});
    });
    
    canvas.addEventListener('mouseup', function (evt) {
      console.log('event mouseup', evt);
      if (drawLock) return;
      canvasPressed = false;
      socket.emit('draw-mouseup', {});
    });
    
    canvas.addEventListener('mousemove', function (evt) {
      console.log('event mousemove', evt);
      if (drawLock) return;
      if (canvasPressed) {
        ctx.lineTo(evt.clientX, evt.clientY);
        ctx.moveTo(evt.clientX, evt.clientY);
        ctx.stroke();
        socket.emit('draw-mousemove', { clientX: evt.clientX, clientY: evt.clientY});
      }
    });
    /**
     * Client module init
     */
    function init() {
        setCurrentView('Join');
        setConnectionStatus('Initializing game...');
        socket = io({ upgrade: false, transports: ["websocket"] });
        bindConnectionEvents();
        bindGameEvents();
    }

    window.addEventListener("load", init, false);

})();
