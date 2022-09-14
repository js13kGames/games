const KEY_PRESSED  = 2;
const KEY_SEEN     = 1;

var space_bar = 0;

addEventListener("keydown", event => {
    if (event.code == "Space") {
        space_bar = space_bar ? KEY_SEEN : KEY_PRESSED;
    }
});

addEventListener("keyup", event => {
    if (event.code == "Space") {
        space_bar = 0;
    }
})