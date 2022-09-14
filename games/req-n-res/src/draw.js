function drawMapEnemy() {
	let x = enemyX * CELL_SIZE;
	let y = enemyY * CELL_SIZE;
	let offsetX = parseInt(MAP_X) + parseInt(x);
	let offsetY = parseInt(MAP_Y) + parseInt(y);
	perspectiveRenderer.beginPath();
	perspectiveRenderer.fillStyle = 'purple';
	perspectiveRenderer.fillRect(offsetX, offsetY, ENEMY_W, ENEMY_H);
}

function drawMapPlayer() {
	perspectiveRenderer.beginPath();
	perspectiveRenderer.fillStyle = 'rgba(0, 0, 255, 1)';
	perspectiveRenderer.fillRect(MAP_X + playerX * CELL_SIZE, MAP_Y + playerY * CELL_SIZE, PLAYER_W, PLAYER_H);
	let adjX = 0;
	let adjY = 0;
	if (playerDirection == 'n') {
		adjX = 0;
		adjY = -1;
	} else if (playerDirection == 'e') {
		adjX = 1;
		adjY = 0;
	} else if (playerDirection == 's') {
		adjX = 0;
		adjY = 1;
	} else if (playerDirection == 'w') {
		adjX = -1;
		adjY = 0;
	}
	const MAX = 6;
	const ALPHA_ADJ = 1 / MAX;
	for (let i = 1; i < MAX; i++) {
		let markerX = playerX + adjX * i;
		let markerY = playerY + adjY * i;
		if (FIELD_H > markerY && markerY > 0 &&
		FIELD_W > markerX && markerX > 0) {
			if (field[markerY][markerX]['type'] == 0) {
				perspectiveRenderer.beginPath();
				let alpha = 1 - (ALPHA_ADJ * i) - 0.5;
				if (alpha > 0) {
					perspectiveRenderer.fillStyle = 'rgba(0, 0, 255, ' + alpha + ')';
					perspectiveRenderer.fillRect(MAP_X + markerX * CELL_SIZE, MAP_Y + markerY * CELL_SIZE, PLAYER_W, PLAYER_H);
				}
			} else {
				break;
			}
		}
	}
}

function drawMapField() {
	for (let row = 0; row < FIELD_H; row++) {
		for (let col = 0; col < FIELD_W; col++) {
			//通路
			if (field[row][col]['type'] == 0) {
				perspectiveRenderer.beginPath();
				perspectiveRenderer.fillStyle = '#0f0';
				perspectiveRenderer.fillRect(MAP_X + col * CELL_SIZE, MAP_Y + row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
			}
		}
	}
}

function drawMap() {
	drawMapField();
	
	drawMapPlayer();

//	drawMapEnemy();
}

function drawCompass() {
	const BASE_X = perspective.width * 0.65;
	const BASE_Y = perspective.height * 0.62;
	perspectiveRenderer.beginPath();
	perspectiveRenderer.fillStyle = 'black';
	perspectiveRenderer.ellipse(BASE_X, BASE_Y, 20, 8, 0, 0, 2 * Math.PI);
	perspectiveRenderer.fill();

	if (playerDirection == 'n') {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'red';
		perspectiveRenderer.moveTo(BASE_X - 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X + 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y - 8);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'white';
		perspectiveRenderer.moveTo(BASE_X - 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X + 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y + 8);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
	} else if (playerDirection == 'e') {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'red';
		perspectiveRenderer.moveTo(BASE_X, BASE_Y - 3);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y + 3);
		perspectiveRenderer.lineTo(BASE_X - 20, BASE_Y);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'white';
		perspectiveRenderer.moveTo(BASE_X, BASE_Y - 3);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y + 3);
		perspectiveRenderer.lineTo(BASE_X + 20, BASE_Y);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
	} else if (playerDirection == 's') {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'white';
		perspectiveRenderer.moveTo(BASE_X - 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X + 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y - 8);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'red';
		perspectiveRenderer.moveTo(BASE_X - 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X + 5, BASE_Y);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y + 8);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
	} else if (playerDirection == 'w') {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'white';
		perspectiveRenderer.moveTo(BASE_X, BASE_Y - 3);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y + 3);
		perspectiveRenderer.lineTo(BASE_X - 20, BASE_Y);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = 'red';
		perspectiveRenderer.moveTo(BASE_X, BASE_Y - 3);
		perspectiveRenderer.lineTo(BASE_X, BASE_Y + 3);
		perspectiveRenderer.lineTo(BASE_X + 20, BASE_Y);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
	}
}

function drawEnemy() {
	//目の前
	if (playerDirection == 'n' && playerY - 1 == enemyY && playerX == enemyX ||
	    playerDirection == 'e' && playerY == enemyY && playerX + 1 == enemyX ||
	    playerDirection == 's' && playerY + 1 == enemyY && playerX == enemyX ||
	    playerDirection == 'w' && playerY == enemyY && playerX - 1 == enemyX) {
		let x = perspective.width * 0.5;
		let y = perspective.height * 0.6;
		let radius = perspective.width * 0.09;
		let bg = perspectiveRenderer.createRadialGradient(x, y, 0, x, y, radius);
		bg.addColorStop(0.0, '#800080');
		bg.addColorStop(1.0, '#400040');
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = bg;
		perspectiveRenderer.arc(x, y, radius, 0, 2 * Math.PI, true);
		perspectiveRenderer.fill();

		//顔
		if (playerDirection == 'n' && enemyDirection == 's' ||
		playerDirection == 'e' && enemyDirection == 'w' ||
		playerDirection == 's' && enemyDirection == 'n' ||
		playerDirection == 'w' && enemyDirection == 'e') {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.fillStyle = 'black';
			perspectiveRenderer.arc(x - radius / 2.5, y - radius / 4, perspective.width * 0.03, 210 / 180 * Math.PI, 30 / 180 * Math.PI, true);
			perspectiveRenderer.fill();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.fillStyle = 'black';
			perspectiveRenderer.arc(x + radius / 2.5, y - radius / 4, perspective.width * 0.03, 150 / 180 * Math.PI, 330 / 180 * Math.PI, true);
			perspectiveRenderer.fill();
		} else
		if (playerDirection == 'n' && enemyDirection == 'w' ||
		playerDirection == 'e' && enemyDirection == 'n' ||
		playerDirection == 's' && enemyDirection == 'e' ||
		playerDirection == 'w' && enemyDirection == 's') {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.fillStyle = 'black';
			perspectiveRenderer.arc(x - radius / 2, y - radius / 4, perspective.width * 0.03, 150 / 180 * Math.PI, 330 / 180 * Math.PI, true);
			perspectiveRenderer.fill();
		} else
		if (playerDirection == 'n' && enemyDirection == 'e' ||
		playerDirection == 'e' && enemyDirection == 's' ||
		playerDirection == 's' && enemyDirection == 'w' ||
		playerDirection == 'w' && enemyDirection == 'n') {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.fillStyle = 'black';
			perspectiveRenderer.arc(x + radius / 2, y - radius / 4, perspective.width * 0.03, 210 / 180 * Math.PI, 30 / 180 * Math.PI, true);
			perspectiveRenderer.fill();
		}
	//2つ先
	} else
	if (playerDirection == 'n' && playerY - 2 == enemyY && playerX == enemyX && field[playerY - 1][playerX]['type'] == 0 ||
	    playerDirection == 'e' && playerY == enemyY && playerX + 2 == enemyX && field[playerY][playerX + 1]['type'] == 0 ||
	    playerDirection == 's' && playerY + 2 == enemyY && playerX == enemyX && field[playerY + 1][playerX]['type'] == 0 ||
	    playerDirection == 'w' && playerY == enemyY && playerX - 2 == enemyX && field[playerY][playerX - 1]['type'] == 0) {
		let x = perspective.width * 0.5;
		let y = perspective.height * 0.54;
		let radius = perspective.width * 0.05;
		let bg = perspectiveRenderer.createRadialGradient(x, y, 0, x, y, radius);
		bg.addColorStop(0.0, '#300030');
		bg.addColorStop(1.0, '#200020');
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = bg;
		perspectiveRenderer.arc(x, y, radius, 0, 2 * Math.PI, true);
		perspectiveRenderer.fill();
	} else
	//左前
	if (playerDirection == 'n' && playerY - 1 == enemyY && playerX - 1 == enemyX && field[playerY][playerX - 1]['type'] == 0 ||
	    playerDirection == 'e' && playerY - 1 == enemyY && playerX + 1 == enemyX && field[playerY - 1][playerX]['type'] == 0 ||
	    playerDirection == 's' && playerY + 1 == enemyY && playerX + 1 == enemyX && field[playerY][playerX + 1]['type'] == 0 ||
	    playerDirection == 'w' && playerY + 1 == enemyY && playerX - 1 == enemyX && field[playerY + 1][playerX]['type'] == 0) {
		let x = perspective.width * 0.2;
		let y = perspective.height * 0.6;
		let radius = perspective.width * 0.09;
		let bg = perspectiveRenderer.createRadialGradient(x, y, 0, x, y, radius);
		bg.addColorStop(0.0, '#300030');
		bg.addColorStop(1.0, '#200020');
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = bg;
		perspectiveRenderer.arc(x, y, radius, 300 / 180 * Math.PI, 60 / 180 * Math.PI, true);
		perspectiveRenderer.fill();
	} else
	//右前
	if (playerDirection == 'n' && playerY - 1 == enemyY && playerX + 1 == enemyX && field[playerY][playerX + 1]['type'] == 0 ||
	    playerDirection == 'e' && playerY + 1 == enemyY && playerX + 1 == enemyX && field[playerY + 1][playerX]['type'] == 0 ||
	    playerDirection == 's' && playerY + 1 == enemyY && playerX - 1 == enemyX && field[playerY][playerX - 1]['type'] == 0 ||
	    playerDirection == 'w' && playerY - 1 == enemyY && playerX - 1 == enemyX && field[playerY - 1][playerX]['type'] == 0) {
		let x = perspective.width * 0.8;
		let y = perspective.height * 0.6;
		let radius = perspective.width * 0.09;
		let bg = perspectiveRenderer.createRadialGradient(x, y, 0, x, y, radius);
		bg.addColorStop(0.0, '#300030');
		bg.addColorStop(1.0, '#200020');
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = bg;
		perspectiveRenderer.arc(x, y, radius, 120 / 180 * Math.PI, 240 / 180 * Math.PI, true);
		perspectiveRenderer.fill();
	}
}

function drawGoal() {
	if (playerDirection == 'n' && field[playerY - 1][playerX]['content'] == 'goal' && field[playerY - 1][playerX]['type'] == 0 ||
	    playerDirection == 'e' && field[playerY][playerX + 1]['content'] == 'goal' && field[playerY][playerX + 1]['type'] == 0 ||
	    playerDirection == 's' && field[playerY + 1][playerX]['content'] == 'goal' && field[playerY + 1][playerX]['type'] == 0 ||
	    playerDirection == 'w' && field[playerY][playerX - 1]['content'] == 'goal' && field[playerY][playerX - 1]['type'] == 0) {
		if (stageNum < NUM_OF_STAGE) {
			perspectiveRenderer.beginPath();
			let gradientWarp = perspectiveRenderer.createLinearGradient(perspective.width * 0.375 + 10, 0, perspective.width * 0.625 - 10, 0);
			gradientWarp.addColorStop(0.0, '#00dbde');
			gradientWarp.addColorStop(1.0, '#fc00ff');
			perspectiveRenderer.fillStyle = gradientWarp;
			perspectiveRenderer.fillRect(perspective.width * 0.375 + 10, perspective.height * 0.375 + 10, perspective.width * 0.25 - 20, perspective.height * 0.25 - 10);
		} else {
			let x = perspective.width * 0.5;
			let y = perspective.height * 0.6;
			let radius = perspective.width * 0.09;
			let bg = perspectiveRenderer.createRadialGradient(x, y, 0, x, y, radius);
			bg.addColorStop(0.0, '#ffc0cb');
			bg.addColorStop(1.0, '#7f6066');
			perspectiveRenderer.beginPath();
			perspectiveRenderer.fillStyle = bg;
			perspectiveRenderer.arc(x, y, radius, 0, 2 * Math.PI, true);
			perspectiveRenderer.fill();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 2;
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.arc(x - radius / 2.5, y - radius / 8, perspective.width * 0.025, 0, 180 / 180 * Math.PI, true);
			perspectiveRenderer.stroke();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.arc(x + radius / 2.5, y - radius / 8, perspective.width * 0.025, 0, 180 / 180 * Math.PI, true);
			perspectiveRenderer.stroke();
		}
	}
}

function drawPlayer() {
	let x = perspective.width * 0.5;
	let y = perspective.height * 0.85;
	let radius = perspective.width * 0.15;
	perspectiveRenderer.beginPath();
	let bg = perspectiveRenderer.createRadialGradient(x, y, 0, x, y, radius);
	bg.addColorStop(0.0, '#87ceeb');
	bg.addColorStop(1.0, '#638aaa');
	perspectiveRenderer.fillStyle = bg;
	perspectiveRenderer.arc(x, y, radius, 0, 2 * Math.PI, true);
	perspectiveRenderer.fill();

	let glossX = perspective.width * 0.58;
	let glossY = perspective.height * 0.77;
	let glossRadius = perspective.width * 0.05;
	perspectiveRenderer.beginPath();
	let glossBg = perspectiveRenderer.createRadialGradient(glossX, glossY, 0, glossX, glossY, glossRadius);
	glossBg.addColorStop(0.0, 'rgba(255, 255, 255, 0.7)');
	glossBg.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
	perspectiveRenderer.fillStyle = glossBg;
	perspectiveRenderer.arc(glossX, glossY, glossRadius, 0, 2 * Math.PI, true);
	perspectiveRenderer.fill();
}

function drawMessage() {
	if (messages.length > 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.lineWidth = 1;
		perspectiveRenderer.strokeStyle = '#0f0';
		perspectiveRenderer.strokeRect(5, 5, perspective.width - 10, perspective.height * 0.24);
		perspectiveRenderer.beginPath();
		perspectiveRenderer.textBaseline = 'top';
		perspectiveRenderer.fillStyle = '#0f0';
		perspectiveRenderer.font = FONT_SIZE + 'px courier';
		for (let i = 0; i < messages.length; i++) {
			perspectiveRenderer.fillText(messages[i], 10, 10 + FONT_SIZE * i);
		}
	}
}

function drawTimeLimit() {
	perspectiveRenderer.beginPath();
	perspectiveRenderer.textBaseline = 'bottom';
	perspectiveRenderer.fillStyle = '#0f0';
	perspectiveRenderer.font = FONT_SIZE + 'px courier';
	perspectiveRenderer.fillText('TIME: ' + timeLeft, 5, perspective.height - 5);
}

function drawStageNum() {
	perspectiveRenderer.beginPath();
	perspectiveRenderer.textBaseline = 'bottom';
	perspectiveRenderer.fillStyle = '#0f0';
	perspectiveRenderer.font = FONT_SIZE + 'px courier';
	perspectiveRenderer.fillText('STAGE: ' + stageNum, 5, perspective.height - 20);
}

function renderKey(x, y, color) {
	perspectiveRenderer.beginPath();
	perspectiveRenderer.lineWidth = 2;
	perspectiveRenderer.strokeStyle = color;
	perspectiveRenderer.arc(x + 5, y + 5, 5, 0, 2 * Math.PI, true);
	perspectiveRenderer.stroke();
	perspectiveRenderer.beginPath();
	perspectiveRenderer.moveTo(x + 10, y + 5);
	perspectiveRenderer.lineTo(x + 25, y + 5);
	perspectiveRenderer.closePath();
	perspectiveRenderer.stroke();
	perspectiveRenderer.fillStyle = color;
	perspectiveRenderer.fillRect(x + 17.5, y + 5, 5, 5);
}

function drawKey() {
	if (playerDirection == 'n' && field[playerY - 1][playerX]['content'] == 'key' && field[playerY - 1][playerX]['type'] == 0 ||
	    playerDirection == 'e' && field[playerY][playerX + 1]['content'] == 'key' && field[playerY][playerX + 1]['type'] == 0 ||
	    playerDirection == 's' && field[playerY + 1][playerX]['content'] == 'key' && field[playerY + 1][playerX]['type'] == 0 ||
	    playerDirection == 'w' && field[playerY][playerX - 1]['content'] == 'key' && field[playerY][playerX - 1]['type'] == 0) {
		renderKey(perspective.width * 0.5 - 12.5, perspective.height * 0.6 - 5, '#ff0');
	}
}

function drawKeySign() {
	renderKey(10, perspective.height - 50, '#ff0');
}

function opening() {
	perspectiveRenderer.clearRect(0, 0, perspective.width, perspective.height);

	perspectiveRenderer.beginPath();
	perspectiveRenderer.fillStyle = 'black';
	perspectiveRenderer.fillRect(0, 0, perspective.width, perspective.height);

	perspectiveRenderer.beginPath();
	perspectiveRenderer.lineWidth = 1;
	perspectiveRenderer.strokeStyle = '#0f0';
	perspectiveRenderer.strokeRect(5, 5, perspective.width - 10, perspective.height * 0.24);
	perspectiveRenderer.beginPath();
	perspectiveRenderer.lineWidth = 1;
	perspectiveRenderer.strokeStyle = '#0f0';
	perspectiveRenderer.fillStyle = '#0f0';
	perspectiveRenderer.textBaseline = 'top';
	perspectiveRenderer.font = perspective.height * 0.2 + 'px courier';
	perspectiveRenderer.strokeText('Req N\' Res', 10, 10);
	perspectiveRenderer.fillText('Req N\' Res', 10, 10);
	
	messages = [];
	messages.push('> GET / HTTP/1.1');
	messages.push('> Host: example.com');
	messages.push('');
	messages.push('Find \'Response\' in the maze of ');
	messages.push('network traffic.');
	messages.push('');
	messages.push('(Press button A)');
	perspectiveRenderer.beginPath();
	perspectiveRenderer.fillStyle = '#0f0';
	perspectiveRenderer.font = FONT_SIZE + 'px courier';
	for (let i = 0; i < messages.length; i++) {
		perspectiveRenderer.fillText(messages[i], 10, perspective.height * 0.3 + FONT_SIZE * i);
	}
}

