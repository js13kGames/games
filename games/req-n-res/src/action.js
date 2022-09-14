// 時間経過
function timeProgress(elapsed) {
	timeLeft = TIME_LIMIT - elapsed;
	if (timeLeft <= 0) {
		messages = [];
		messages.push('408 Request Timeout');
		messages.push('Game over...');
		messages.push('(Press button A)');
		isGameOver = true;
	}
}

// プレイヤー操作
function playerVelocityAdjust() {
	var timestamp = new Date().getTime();
//	if (!lastPlayerMoveTime) lastPlayerMoveTime = timestamp;
	
	if ((lastPlayerMoveTime + 250) < timestamp) {
		lastPlayerMoveTime = timestamp;
		return true;
	}
}
function up() {
	if (playerVelocityAdjust() && !pause && !gameOver) {
		messages = [];
		if (playerDirection == 'n') {
			moveNorth();
		} else if (playerDirection == 'e') {
			moveEast();
		} else if (playerDirection == 's') {
			moveSouth();
		} else if (playerDirection == 'w') {
			moveWest();
		}
		tutorial01();
	}
}
function right() {
	if (playerVelocityAdjust() && !pause && !gameOver) {
		messages = [];
		if (playerDirection == 'n') {
			playerDirection = 'e';
		} else if (playerDirection == 'e') {
			playerDirection = 's';
		} else if (playerDirection == 's') {
			playerDirection = 'w';
		} else if (playerDirection == 'w') {
			playerDirection = 'n';
		}
		tutorial01();
	}
}
function down() {
	if (playerVelocityAdjust() && !pause && !gameOver) {
		messages = [];
		if (playerDirection == 'n') {
			moveSouth();
		} else if (playerDirection == 'e') {
			moveWest();
		} else if (playerDirection == 's') {
			moveNorth();
		} else if (playerDirection == 'w') {
			moveEast();
		}
		tutorial01();
	}
}
function left() {
	if (playerVelocityAdjust() && !pause && !gameOver) {
		messages = [];
		if (playerDirection == 'n') {
			playerDirection = 'w';
		} else if (playerDirection == 'e') {
			playerDirection = 'n';
		} else if (playerDirection == 's') {
			playerDirection = 'e';
		} else if (playerDirection == 'w') {
			playerDirection = 's';
		}
		tutorial01();
	}
}

function moveNorth() {
	if (field[playerY - 1][playerX]['type'] <= 0 &&
	(enemyY !== playerY - 1 || enemyX !== playerX)) {
		playerY--;
	}
}
function moveEast() {
	if (field[playerY][playerX + 1]['type'] <= 0 &&
	(enemyY !== playerY || enemyX !== playerX + 1)) {
		playerX++;
	}
}
function moveSouth() {
	if (field[playerY + 1][playerX]['type'] <= 0 &&
	(enemyY !== playerY + 1 || enemyX !== playerX)) {
		playerY++;
	}
}
function moveWest() {
	if (field[playerY][playerX - 1]['type'] <= 0 &&
	(enemyY !== playerY || enemyX !== playerX - 1)) {
		playerX--;
	}
}

function tutorial01() {
	if (needTutorial01 && playerDirection == 'n' && field[playerY - 1][playerX]['type'] == 2 ||
	    needTutorial01 && playerDirection == 'e' && field[playerY][playerX + 1]['type'] == 2 ||
	    needTutorial01 && playerDirection == 's' && field[playerY + 1][playerX]['type'] == 2 ||
	    needTutorial01 && playerDirection == 'w' && field[playerY][playerX - 1]['type'] == 2) {
		messages.push('Hint:');
		messages.push('Press button B toward the door');
		messages.push('to open it.');
	}
}

function a() {
//debugger;
	if (playerVelocityAdjust()) {
		if (mode == 'opening') {
			mode = 'main';
			messages = [];
			messages.push('Stage1: Local Area Network');
			messages.push('');
			messages.push('(Press button A)');
			pause = true;
			mainLoopId = setInterval(main, 250);
		} else
		if (mode == 'main') {
			if (pause && !gameOver && !stageClear) {
				messages = [];
				pause = false;
				if (hasKey) {
					isDrawKey = false;
				}
			} else
			if (stageClear && stageNum !== 3) {
				stageNum++;
				FIELD_W = 1 + 8 * stageNum;
				init();
				messages = [];
				if (stageNum == 2) {
					messages.push('Stage2: Wide Area Network');
				} else {
					messages.push('Stage3: Internet');
				}
				messages.push('');
				messages.push('(Press button A)');
				pause = true;
				mainLoopId = setInterval(main, 250);
			} else
			if (gameOver) {
				stageNum = 1;
				FIELD_W = 1 + 8 * stageNum;
				init();
				mode = 'opening';
				needTutorial01 = true;
				opening();
			} else
			if (stageClear && stageNum == 3) {
				location.href = 'http://example.com';
			}
		}
	}
}

function b() {
	if (playerVelocityAdjust() && !pause && !gameOver) {
		open();
	}
}

function open() {
	messages = [];

	let front;
	if (playerDirection == 'n') {
		front = field[playerY - 1][playerX];
	} else
	if (playerDirection == 'e') {
		front = field[playerY][playerX + 1];
	} else
	if (playerDirection == 's') {
		front = field[playerY + 1][playerX];
	} else
	if (playerDirection == 'w') {
		front = field[playerY][playerX - 1];
	}

	if (front['type'] == 2) {
		needTutorial01 = false;
		if (front['content'] == 'goal') {
			if (hasKey) {
				front['type'] = 0;
				isStageClear = true;
				if (stageNum < NUM_OF_STAGE) {
					messages.push('301 Moved Permanently');
					messages.push('');
					messages.push('(Press button A)');
				} else {
					messages.push('> HTTP/1.1 200 OK');
					messages.push('');
					messages.push('(Press button A)');
				}
			} else {
				messages.push('403 Forbidden');
				messages.push('This door requires a key.');
				if (stageNum == NUM_OF_STAGE) {
					messages.push('Response> I\'m here!');
				}
			}
		} else
		if (front['content'] == 'map') {
			front['type'] = 0;
			messages.push('Got the map.');
			hasMap = true;
		} else
		if (front['content'] == 'key') {
			front['type'] = 0;
			messages.push('Got the key.');
			messages.push('');
			messages.push('(Press button A)');
			pause = true;
			hasKey = true;
		} else {
			front['type'] = 0;
			messages.push('404 Not Found');
		}
	}
}

function moveEnemy() {
	var timestamp = new Date().getTime();
	if (!lastMoveEnemyTime) lastMoveEnemyTime = timestamp;
	
	if ((lastMoveEnemyTime + 250) < timestamp) {
		lastMoveEnemyTime = timestamp;
		
		let directions = {'n': 0, 'e': 0, 's': 0, 'w': 0};
		if (field[enemyY - 1][enemyX]['type'] == 0 &&
		    (enemyY - 1 !== playerY || enemyX !== playerX)) {
			directions.n = 1;
		}
		if (field[enemyY][enemyX + 1]['type'] == 0 &&
		    (enemyY !== playerY || enemyX + 1 !== playerX)) {
			directions.e = 1;
		}
		if (field[enemyY + 1][enemyX]['type'] == 0 &&
		    (enemyY + 1 !== playerY || enemyX !== playerX)) {
			directions.s = 1;
		}
		if (field[enemyY][enemyX - 1]['type'] == 0 &&
		    (enemyY !== playerY || enemyX - 1 !== playerX)) {
			directions.w = 1;
		}

		let aisles = []
		if (enemyDirection == 'n') {
			if (directions.w) aisles.push('w');
			if (directions.n) aisles.push('n');
			if (directions.e) aisles.push('e');
		} else
		if (enemyDirection == 'e') {
			if (directions.n) aisles.push('n');
			if (directions.e) aisles.push('e');
			if (directions.s) aisles.push('s');
		} else
		if (enemyDirection == 's') {
			if (directions.e) aisles.push('e');
			if (directions.s) aisles.push('s');
			if (directions.w) aisles.push('w');
		} else
		if (enemyDirection == 'w') {
			if (directions.s) aisles.push('s');
			if (directions.w) aisles.push('w');
			if (directions.n) aisles.push('n');
		}
		
		let move = true;
		
		// 分岐
		if (aisles.length > 1) {
			enemyDirection = aisles[randNum(0, aisles.length - 1)];
		} else
		// 一択
		if (aisles.length == 1) {
			enemyDirection = aisles[0];
		} else {
			// 後ろに戻れるか
			if (enemyDirection == 'n' && directions.s) {
				enemyDirection = 's';
			} else
			if (enemyDirection == 'e' && directions.w) {
				enemyDirection = 'w';
			} else
			if (enemyDirection == 's' && directions.n) {
				enemyDirection = 'n';
			} else
			if (enemyDirection == 'w' && directions.e) {
				enemyDirection = 'e';
			} else {
				move = false;
			}
		}
		
		if (move) {
			if (enemyDirection == 'n') enemyY--;
			if (enemyDirection == 'e') enemyX++;
			if (enemyDirection == 's') enemyY++;
			if (enemyDirection == 'w') enemyX--;
		}
	}
}

function encountEnemy() {
	let isEncount = false;
	// n
	if (playerDirection == 'n' && enemyX == playerX && enemyY == playerY - 1) {
		enemyDirection = 's';
		isEncount = true;
	}
	// e
	if (playerDirection == 'e' && enemyX == playerX + 1 && enemyY == playerY) {
		enemyDirection = 'w';
		isEncount = true;
	}
	// s
	if (playerDirection == 's' && enemyX == playerX && enemyY == playerY + 1) {
		enemyDirection = 'n';
		isEncount = true;
	}
	// w
	if (playerDirection == 'w' && enemyX == playerX - 1 && enemyY == playerY) {
		enemyDirection = 'e';
		isEncount = true;
	}
	if (isEncount) {
		messages = [];
		messages.push('400 Bad Request');
		messages.push('HELO');
	}
}