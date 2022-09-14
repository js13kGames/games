document.onkeydown = (event) => {
    if (event.srcElement.id === "msg")
        return;

    switch (event.keyCode) {
        /*a*/
        case 68:
            me.walk(-1);
            break;

        /*d*/
        case 65:
            me.walk(1);
            break;

        /*space*/
        case 32:
            me.jump();
            break;
    }
};

document.onkeyup = (event) => {
    switch (event.keyCode) {
        case 68:
        case 65:
            me.walk(0);
            break;
    }
};

