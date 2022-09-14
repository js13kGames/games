let me;
let dinos = [];
let cycleTime = Date.now();
let lastanimation = null;
let dclr = "#2b2b2b";

let c = document.getElementById("c");
let ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = dclr;
ctx.textAlign = "center";
ctx.font = "20px Arial";

let asset = new Image();
asset.src = "dino.png";

socket.on("seed", function (id) {
    init(id);
});

socket.on("dinos", function (_dinos) {
    let i = _dinos.map(function (dino) {
        return dino.id;
    }).indexOf(me.id);
    if (i !== -1) {
        _dinos.splice(i, 1);
    }
    dinos = _dinos;
});

document.getElementById("msg").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        message();
    }
});

function init(id) {
    me = new Dino(id, "unknown", 0);
    console.log(me);
    socket.emit("born", me);
    window.requestAnimationFrame(cycle);
}

function update(dt) {
    me.move();
    me.fall();
    socket.emit("move", me);
}

function cycle(timestamp) {
    let dt = timestamp - cycleTime;

    update(dt);
    render();

    cycleTime = timestamp;

    window.requestAnimationFrame(cycle);
}

function toInput() {
    document.getElementById("in").style.display = "block";
}

function toGame() {
    document.getElementById("hm").style.display = "none";
    document.getElementById("in").style.display = "none";
    document.getElementById("gm").style.display = "block";
    me.name = document.getElementById("usr").value;
    me.color = document.getElementById("clr").value;
}

function message() {
    me.message = document.getElementById("msg").value;
    me.messageTime = Date.now();
    document.activeElement.blur();
    document.getElementById("msg").value = "";
}