let left = { keys: ["ArrowLeft", "KeyA"], pressed: false, released: false, down: false };
let right = { keys: ["ArrowRight", "KeyD"], pressed: false, released: false, down: false };
let up = { keys: ["ArrowUp", "KeyW"], pressed: false, released: false, down: false };
let down = { keys: ["ArrowDown", "KeyS"], pressed: false, released: false, down: false };
let space = { keys: ["Space"], pressed: false, released: false, down: false };

let keys = [left, right, up, down, space];

document.addEventListener('keydown', e => {
    keys.forEach(key => {
        let oldDown = key.down;
        if (key.keys.includes(e.code)) {
            key.down = true;
            key.pressed = !oldDown;
        }
    });
}, false);

document.addEventListener('keyup', e => {
    keys.forEach(key => {
        let oldDown = key.down;
        if (key.keys.includes(e.code)) {
            key.down = false;
            key.released = oldDown;
        }
    });
}, false);