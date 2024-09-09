initInput = doc => {
    doc.addEventListener('keydown', _keyDownHandler, false);
    doc.addEventListener('keyup', _keyUpHandler, false);
}

resetInput = () => {
    _turnLeft = false;
    _turnRight = false;
    _fastForward = false;
    _pause = false;
}

let turnLeft = () => _turnLeft;
let turnRight = () => _turnRight;
let fastForward = () => _fastForward;
let pause = () => _pause;

_keyDownHandler = e => {
    switch (e.keyCode) {
        case 37: _turnLeft = true; break;
        case 39: _turnRight = true; break; 
        case 32: _fastForward = true; break;
        case 80: _pause = true; break;
    }
}

_keyUpHandler = e => {
    switch (e.keyCode) {
        case 37: _turnLeft = false; break;
        case 39: _turnRight = false; break; 
        case 32: _fastForward = false; break;
        case 80: _pause = false; break;
    }
}

var _turnLeft = false;
var _turnRight = false;
var _fastForward = false;
var _pause = false;
