let _createCanvas = (w, h, fn) => {
    var _canvas = document.createElement('canvas');
    _canvas.width = w;
    _canvas.height = h;
    fn(_canvas.getContext("2d"));
    return _canvas;
}

let _createCar = () => _createCanvas(280, 180, _ctx => {
    _ctx.fillStyle = '#333';
    _ctx.beginPath();
    _ctx.roundRect(20, 130, 50, 50, 5);
    _ctx.roundRect(210, 130, 50, 50, 5);
    _ctx.fill();

    _ctx.fillStyle = '#F17B85FF';
    _ctx.beginPath();
    _ctx.moveTo(40, 103);
    _ctx.lineTo(240, 103);
    _ctx.bezierCurveTo(260, 52, 260, 2, 140, 2);
    _ctx.bezierCurveTo(20, 2, 20, 52, 40, 102);
    _ctx.closePath();
    _ctx.fill();
    _ctx.strokeStyle = '#b02a37';
    _ctx.lineWidth = 2;
    _ctx.stroke();

    _ctx.fillStyle = '#e63946';
    _ctx.beginPath();
    _ctx.moveTo(10, 150); 
    _ctx.lineTo(270, 150); 
    _ctx.bezierCurveTo(290, 100, 290, 50, 140, 50);
    _ctx.bezierCurveTo(-10, 50, -10, 100, 10, 150);
    _ctx.closePath();
    _ctx.fill();
    _ctx.strokeStyle = '#b02a37';
    _ctx.lineWidth = 2;
    _ctx.stroke();

    _ctx.fillStyle = "#A59495FF";
    _ctx.beginPath();
    _ctx.roundRect(0, 140, 280, 20, 4);
    _ctx.fill();

    _ctx.fillStyle = '#ff6b6b';
    _ctx.beginPath();
    _ctx.arc(30, 110, 15, 0, Math.PI * 2);
    _ctx.fill();
    _ctx.beginPath();
    _ctx.arc(250, 110, 15, 0, Math.PI * 2);
    _ctx.fill();
});

let _createUnicornCoin = () => _createCanvas(500, 500, _ctx => {
    _ctx.beginPath();
    _ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    _ctx.clip();

    _ctx.fillStyle = "#52b8f2";
    _ctx.beginPath();
    _ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    _ctx.fill();

    // Horn
    let hornGrad = _ctx.createLinearGradient(250, 50, 250, 200);
    hornGrad.addColorStop(0, '#ffe066');
    hornGrad.addColorStop(0.5, '#f783ac');
    hornGrad.addColorStop(1, '#da77f2');
    _ctx.beginPath();
    _ctx.moveTo(250, 40);
    _ctx.lineTo(220, 200);
    _ctx.lineTo(280, 200);
    _ctx.closePath();
    _ctx.fillStyle = hornGrad;
    _ctx.fill();
    _ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    _ctx.lineWidth = 5;
    for (let i = 70; i < 200; i += 30) {
        _ctx.beginPath();
        _ctx.moveTo(235 + (i*0.08), i);
        _ctx.lineTo(265 - (i*0.08), i + 10);
        _ctx.stroke();
    }

    // Left ear (outer)
    _ctx.beginPath();
    _ctx.ellipse(160, 180, 30, 60, -Math.PI / 6, 0, 2 * Math.PI);
    _ctx.fillStyle = '#ffffff';
    _ctx.fill();
    _ctx.strokeStyle = '#e9ecef';
    _ctx.lineWidth = 3;
    _ctx.stroke();

    // Left ear (inner)
    _ctx.beginPath();
    _ctx.ellipse(165, 185, 15, 40, -Math.PI / 6, 0, 2 * Math.PI);
    _ctx.fillStyle = '#ffdeeb';
    _ctx.fill();

    // Right ear (outer)
    _ctx.beginPath();
    _ctx.ellipse(340, 180, 30, 60, Math.PI / 6, 0, 2 * Math.PI);
    _ctx.fillStyle = '#ffffff';
    _ctx.fill();
    _ctx.stroke();

    // Right ear (inner)
    _ctx.beginPath();
    _ctx.ellipse(335, 185, 15, 40, Math.PI / 6, 0, 2 * Math.PI);
    _ctx.fillStyle = '#ffdeeb';
    _ctx.fill();

    // Head
    _ctx.beginPath();
    _ctx.arc(250, 280, 110, 0, 2 * Math.PI);
    _ctx.fillStyle = '#ffffff';
    _ctx.fill();
    // Skugga/kontur för att framhäva huvudet mot vit bakgrund
    _ctx.strokeStyle = '#e9ecef';
    _ctx.lineWidth = 4;
    _ctx.stroke();

    // Hair
    const colors = ['#ff8787', '#fcc419', '#4dadf7', '#da77f2'];
    const manePositions = [
        {x: 210, y: 190, r: 35},
        {x: 250, y: 180, r: 40},
        {x: 290, y: 190, r: 35},
        {x: 180, y: 220, r: 25}
    ];
    manePositions.forEach((pos, index) => {
        _ctx.beginPath();
        _ctx.arc(pos.x, pos.y, pos.r, 0, 2 * Math.PI);
        _ctx.fillStyle = colors[index % colors.length];
        _ctx.fill();
    });

    // Eyes
    function drawEye(x, y) {
        _ctx.beginPath();
        _ctx.arc(x, y, 24, 0, 2 * Math.PI);
        _ctx.fillStyle = '#212529';
        _ctx.fill();

        _ctx.beginPath();
        _ctx.arc(x - 8, y - 8, 8, 0, 2 * Math.PI);
        _ctx.fillStyle = '#ffffff';
        _ctx.fill();

        _ctx.beginPath();
        _ctx.arc(x + 8, y + 6, 4, 0, 2 * Math.PI);
        _ctx.fillStyle = '#ffffff';
        _ctx.fill();

        _ctx.beginPath();
        _ctx.arc(x - 4, y + 12, 2.5, 0, 2 * Math.PI);
        _ctx.fillStyle = '#ffffff';
        _ctx.fill();

        _ctx.strokeStyle = '#212529';
        _ctx.lineWidth = 3.5;
        _ctx.lineCap = 'round';
        
        let direction = x < 250 ? -1 : 1;

        _ctx.beginPath();
        _ctx.moveTo(x + (18 * direction), y - 12);
        _ctx.lineTo(x + (30 * direction), y - 18);
        _ctx.moveTo(x + (22 * direction), y);
        _ctx.lineTo(x + (34 * direction), y + 2);
        _ctx.stroke();
    }

    drawEye(195, 270);
    drawEye(305, 270);

    // Cheeks
    _ctx.fillStyle = 'rgba(255, 192, 203, 0.6)';
    _ctx.beginPath();
    _ctx.arc(165, 310, 18, 0, 2 * Math.PI);
    _ctx.fill();
    _ctx.beginPath();
    _ctx.arc(335, 310, 18, 0, 2 * Math.PI);
    _ctx.fill();

    // Nose
    _ctx.beginPath();
    _ctx.ellipse(250, 345, 65, 35, 0, 0, 2 * Math.PI);
    _ctx.fillStyle = '#fff0f6';
    _ctx.fill();
    _ctx.strokeStyle = '#fcc2d7';
    _ctx.lineWidth = 2;
    _ctx.stroke();
    _ctx.fillStyle = '#ffb3c1';
    _ctx.beginPath();
    _ctx.arc(230, 345, 5, 0, 2 * Math.PI);
    _ctx.arc(270, 345, 5, 0, 2 * Math.PI);
    _ctx.fill();

    // Mouth
    _ctx.beginPath();
    _ctx.arc(250, 350, 12, 0, Math.PI, false);
    _ctx.strokeStyle = '#ffb3c1';
    _ctx.lineWidth = 3;
    _ctx.stroke();

    _ctx.beginPath();
    _ctx.lineWidth = 30;
    _ctx.strokeStyle = "black";
    _ctx.arc(250, 250, 240, 0, 2 * Math.PI);
    _ctx.stroke();

});

let _createRainbowCoin = () => _createCanvas(310, 310, _ctx => {
    _ctx.beginPath();
    _ctx.arc(155, 155, 150, 0, 2 * Math.PI);
    _ctx.clip();
    let colors = ['#ff4136', '#ff851b', '#ffdc00', '#2ecc40', '#2dcfff', '#0051e0', '#b10dc9'];
    colors.forEach((color, index) => {
        _ctx.fillStyle = color;
        _ctx.fillRect(0, index * 43, 310, 43);
    });
    _ctx.lineWidth = 30;
    _ctx.strokeStyle = "black";
    _ctx.arc(155, 155, 150, 0, 2 * Math.PI);
    _ctx.stroke();
});

let _createRainbow = (colors) => _createCanvas(540, 300, _ctx => {
    const centerX = 270;
    const centerY = 300;
    const strokeWidth = 30;
    const radii = [150, 170, 190, 210, 230, 250];
    _ctx.lineWidth = strokeWidth;
    _ctx.lineCap = 'round';
    colors.forEach((color, index) => {
        _ctx.beginPath();
        _ctx.arc(centerX, centerY, radii[index], Math.PI, 0, false);
        _ctx.strokeStyle = color;
        _ctx.stroke();
    });
    return canvas;
});

let _createSpeedCoin = (higher) => _createCanvas(310, 310, _ctx => {
    const gradient = _ctx.createConicGradient(0, 155, 155);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.15, "red");
    gradient.addColorStop(0.25, "green");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(0.75, "orange");
    gradient.addColorStop(1, "red");

    _ctx.fillStyle = "black";
    _ctx.beginPath();
    _ctx.arc(155, 155, 155, 0, 2 * Math.PI);
    _ctx.fill();

    _ctx.fillStyle = gradient;
    _ctx.beginPath();
    _ctx.arc(155, 155, 147, 0.75 * Math.PI, 0.25 * Math.PI);
    _ctx.lineTo(155, 155);
    _ctx.fill();

    _ctx.fillStyle = "black";
    _ctx.beginPath();
    _ctx.arc(155, 155, 80, 0, 2 * Math.PI);
    _ctx.fill();

    _ctx.strokeStyle = "white";
    _ctx.lineWidth = 5;
    _ctx.beginPath();
    _ctx.moveTo(155, 155);
    _ctx.lineTo(higher ? 210 : 100, 200);
    _ctx.stroke();
});

let _createSteeringCoin = bg => _createCanvas(310, 310, _ctx => {
    _ctx.beginPath();
    _ctx.arc(155, 155, 150, 0, 2 * Math.PI);
    _ctx.clip();
    _ctx.fillStyle = bg;
    _ctx.beginPath();
    _ctx.arc(155, 155, 150, 0, 2 * Math.PI);
    _ctx.fill();
    _ctx.strokeStyle = "black";
    _ctx.lineWidth = 20;
    _ctx.beginPath();
    _ctx.arc(155, 155, 110, 0, 2 * Math.PI);
    _ctx.stroke();
    _ctx.beginPath();
    _ctx.moveTo(155, 155);
    _ctx.lineTo(155, 275);
    _ctx.stroke();
    _ctx.moveTo(155, 155);
    _ctx.lineTo(255, 95);
    _ctx.stroke();
    _ctx.moveTo(155, 155);
    _ctx.lineTo(55, 95);
    _ctx.stroke();
    _ctx.fillStyle = "black";
    _ctx.beginPath();
    _ctx.arc(155, 155, 50, 0, 2 * Math.PI);
    _ctx.fill();
    _ctx.lineWidth = 30;
    _ctx.strokeStyle = "black";
    _ctx.beginPath();
    _ctx.arc(155, 155, 150, 0, 2 * Math.PI);
    _ctx.stroke();
});

let carAsset = _createCar();
let rainbowCoinAsset = _createRainbowCoin();
let increaseSpeedCoinAsset = _createSpeedCoin(true);
let decreaseSpeedCoinAsset = _createSpeedCoin(false);
let unicornAsset = _createUnicornCoin();
let increaseSteeringFactorCoinAsset = _createSteeringCoin("#2ecc40");
let decreaseSteeringFactorCoinAsset = _createSteeringCoin("#ff4136");

