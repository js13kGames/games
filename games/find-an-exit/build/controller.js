onkeydown = (event) => {
    let { code } = event;
    if (keyMap.has(code)) {
        let action = keyMap.get(code);
        keyPressed[action] = true;
    }
};
onkeyup = (event) => {
    let { code } = event;
    if (keyMap.has(code)) {
        let action = keyMap.get(code);
        keyPressed[action] = false;
    }
};
export const keyMap = new Map([
    ['KeyA', 3 /* Left */],
    ['ArrowLeft', 3 /* Left */],
    ['KeyD', 4 /* Right */],
    ['ArrowRight', 4 /* Right */],
    ['KeyW', 1 /* Jump */],
    ['ArrowUp', 1 /* Jump */],
    ['Space', 1 /* Jump */],
    ['KeyS', 2 /* Crouch */],
    ['ArrowDown', 2 /* Crouch */],
    ['Enter', 0 /* Enter */],
]);
export const keyPressed = [];
