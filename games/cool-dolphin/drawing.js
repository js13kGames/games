var ctx = canvas.getContext("2d");
var colors = ["transparent","#37364e","#355d69","#6aae9d","#b9d4b4","#f4e9d4","#d0baa9","#9e8e91","#5b4a68"];
function drawImage(image, width) {
	for (var i = 0; i < image.length; i++) {
		ctx.fillStyle = colors[image[i]];
		ctx.fillRect(i % width - width / 2, ~~(i / width) - ~~(image.length / width) / 2, 1.1, 1.1);
	}
}
function drawCircle(xPos, yPos, radius, pixelize, xPerY = 1, add = 0) {
	for (var x = -radius; x < radius; x += pixelize) {
		for (var y = -radius; y < radius; y += pixelize) {
			if ((x ** 2 + (y * xPerY) ** 2) ** 0.5 < radius && xPerY >= 1) {
				ctx.fillRect(x + ~~xPos, y + ~~yPos, pixelize + add, pixelize + add);
			} else if (((x / xPerY) ** 2 + y ** 2) ** 0.5 < radius && xPerY < 1) {
				ctx.fillRect(x + ~~xPos, y + ~~yPos, pixelize + add, pixelize + add);
			}
		}
	}
}
function translate(x, y, sizeX, sizeY) {
	ctx.translate(~~x, ~~y);
	ctx.scale(sizeX, sizeY);
}
function b(a, b, t) {
	return a * (1 - t) + b * t;
}
function draw13(t) {
	ctx.beginPath();
	ctx.rotate(b(0, -Math.PI / 2, t));
	//ctx.moveTo(25, 25);
	//ctx.bezierCurveTo(50, -10, 50, -10, 50, 100);
	ctx.moveTo(-25, -37.5);
	//ctx.bezierCurveTo(0, 37.5 + 25, 0, 37.5 + 25, 25, 100);
	ctx.bezierCurveTo(0, b(-60, 0, t), 0, b(-60, 0, t), b(0, -25, t), 37.5);
	ctx.moveTo(50, -12.5);
	ctx.arc(50, -37.5, 25, Math.PI / 2, Math.PI, true);
	ctx.arc(50, -37.5, 25, Math.PI, Math.PI * b(1, 0.5, t), true);
	ctx.moveTo(50, -12.5);
	ctx.stroke(); // remove this string to view glasses
	// to remove glasses
	ctx.beginPath(); // remove this string to view glasses
	//ctx.arc(100, 75, 25, Math.PI * 1.5, Math.PI * b(1, 1, t), !b(1, 0, t));
	ctx.arc(50, b(12.5, 37.5, t), 25, -Math.PI / 2, Math.PI / 2, false);
	ctx.arc(50, b(12.5, 37.5, t), 25, Math.PI / 2, Math.PI * b(1, 1.5, t), false);
	//ctx.bezierCurveTo(b(50, 0, t), b(-10, 62.5, t), b(50, 0, t), b(-10, 62.5, t), b(50, 25, t), 100);
	ctx.stroke();
}
