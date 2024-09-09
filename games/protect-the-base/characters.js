var canvas = document.getElementById('drawHero');
var heroArt = canvas.getContext('2d');

function drawLineHero (x1, y1, x2, y2) {
    heroArt.beginPath();
    heroArt.moveTo(x1, y1);
    heroArt.lineTo(x2, y2);
    heroArt.stroke();
};

// hero head polygon
heroArt.fillStyle = 'rgb(152, 251, 152)';
heroArt.beginPath();
heroArt.moveTo(9, 1);
heroArt.lineTo(15, 1);
heroArt.lineTo(15, 1);
heroArt.lineTo(18, 5);
heroArt.lineTo(18, 14);
heroArt.lineTo(17, 14);
heroArt.lineTo(17, 15);
heroArt.lineTo(7, 15);
heroArt.lineTo(7, 14);
heroArt.lineTo(6, 13);
heroArt.lineTo(6, 5);
heroArt.closePath();
heroArt.fill();

// hero face paint
heroArt.fillStyle = '#228B22';
heroArt.beginPath();
heroArt.moveTo(7, 8);
heroArt.lineTo(9, 6);
heroArt.lineTo(10, 6);
heroArt.lineTo(11, 7);
heroArt.lineTo(11, 8);
heroArt.lineTo(12, 9);
heroArt.lineTo(13, 8);
heroArt.lineTo(13, 6);
heroArt.lineTo(15, 6);
heroArt.lineTo(17, 8);
heroArt.lineTo(17, 12);
heroArt.lineTo(15, 14);
heroArt.lineTo(14, 14);
heroArt.lineTo(13, 15);
heroArt.lineTo(11, 15);
heroArt.lineTo(10, 14);
heroArt.lineTo(9, 14);
heroArt.lineTo(7, 12);
heroArt.closePath();
heroArt.fill();

// hero eye area
heroArt.fillStyle = 'black';
heroArt.beginPath();
heroArt.moveTo(8, 9);
heroArt.lineTo(9, 8);
heroArt.lineTo(10, 8);
heroArt.lineTo(12, 10);
heroArt.lineTo(14, 8);
heroArt.lineTo(15, 11);
heroArt.lineTo(15, 12);
heroArt.lineTo(14, 13);
heroArt.lineTo(10, 13);
heroArt.lineTo(8, 11);
heroArt.closePath();
heroArt.fill();

// hero eyes
heroArt.strokeStyle = 'white';
drawLineHero(10, 9, 10, 11);
drawLineHero(14, 9, 14, 11);

// hero body
heroArt.fillStyle = 'rgb(152, 251, 152)';
heroArt.beginPath();
heroArt.moveTo(6, 14);
heroArt.lineTo(18, 14);
heroArt.lineTo(20, 16);
heroArt.lineTo(20, 25);
heroArt.lineTo(6, 25);
heroArt.lineTo(4, 16);
heroArt.closePath();
heroArt.fill();

// hero body cross
heroArt.strokeStyle = "rgb(212, 175, 55)";
drawLineHero(12, 15, 12, 24);
drawLineHero(8, 18, 16, 18)

var canvas = document.getElementById('drawCreep');
var creepArt = canvas.getContext('2d');

function drawLineCreep (x1, y1, x2, y2) {
    creepArt.beginPath();
    creepArt.moveTo(x1, y1);
    creepArt.lineTo(x2, y2);
    creepArt.stroke();
};

// creep body polygon
creepArt.fillStyle = 'rgb(210, 184, 135)';
creepArt.beginPath();
creepArt.moveTo(7, 21);
creepArt.lineTo(17, 21);
creepArt.lineTo(20, 28);
creepArt.lineTo(18, 31);
creepArt.lineTo(5, 31);
creepArt.lineTo(4, 28);
creepArt.closePath();
creepArt.fill();

// creep chicken legs
creepArt.strokeStyle = 'rgb(210, 184, 135)';
drawLineCreep(6, 31, 7, 36);
drawLineCreep(6, 33, 7, 36);
drawLineCreep(17, 31, 17, 33);
drawLineCreep(17, 33, 16, 36);

// creep head polygon
creepArt.fillStyle = 'rgb(191, 0, 0)';
creepArt.beginPath();
creepArt.moveTo(9, 8);
creepArt.lineTo(15, 8);
creepArt.lineTo(18, 18);
creepArt.lineTo(15, 28);
creepArt.lineTo(9, 28);
creepArt.lineTo(6, 18);
creepArt.closePath();
creepArt.fill();

//creep horns
creepArt.strokeStyle = 'rgb(191, 0, 0)';
drawLineCreep(8, 14, 8, 3);
drawLineCreep(8, 3, 10, 1);
drawLineCreep(16, 14, 16, 3);
drawLineCreep(16, 3, 14, 1);

// creep face
creepArt.beginPath();
creepArt.arc(9, 15, 1.5, 0, 2 * Math.PI, false);
creepArt.fillStyle = 'rgb(255, 211, 0)';
creepArt.fill();

creepArt.beginPath();
creepArt.arc(16, 15, 1.5, 0, 2 * Math.PI, false);
creepArt.fillStyle = 'rgb(255, 211, 0)';
creepArt.fill();

creepArt.strokeStyle = 'black';
drawLineCreep(9, 19, 11, 26);
drawLineCreep(11, 26, 12, 21);
drawLineCreep(12, 21, 14, 26);
drawLineCreep(14, 26, 16, 19);