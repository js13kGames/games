//ios
/* ピッチインピッチアウトによる拡大縮小を禁止 */
document.documentElement.addEventListener('touchstart', function (e) {
	if (e.touches.length >= 2) {e.preventDefault();}
}, {passive: false});
/* ダブルタップによる拡大を禁止 */
var t = 0;
document.documentElement.addEventListener('touchend', function (e) {
	var now = new Date().getTime();
		if ((now - t) < 350){
		e.preventDefault();
	}
	t = now;
}, false);

window.addEventListener('DOMContentLoaded', (event) => {
	userInput();
	perspective = document.querySelector('#perspective');
	perspectiveRenderer = perspective.getContext('2d');
	perspective.width = SCREEN_W;
	perspective.height = SCREEN_H;
	opening();
});

function makeField() {
	field = new Array(FIELD_H);

	//外枠作成
	for (let row = 0; row < FIELD_H; row++) {
		if (row == 0 || row == FIELD_H - 1) {
			field[row] = new Array(FIELD_W);
			for (let col = 0; col < FIELD_W; col++) {
					field[row][col] = {type: 1};
			}
		} else {
			field[row] = new Array(FIELD_W);
			for (let col = 0; col < FIELD_W; col++) {
				if (col == 0 || col == FIELD_W - 1) {
					field[row][col] = {type: 1};
				} else {
					field[row][col] = {type: 0};
				}
			}
		}
	}
	//console.log(field);

	//棒倒し法で内側の壁作成
	for (let row = 2; row < FIELD_H - 2; row = row + 2) {
		for (let col = 2; col < FIELD_W - 2; col = col + 2) {
			field[row][col]['type'] = 1;
			let direction;
			if (row == 2) {
				direction = randNum(0, 3);
			} else {
				direction = randNum(1, 3);
			}
			if (direction == 0) {
				//n
				field[row - 1][col]['type'] = 1;
			} else if (direction == 1) {
				//e
				field[row][col + 1]['type'] = 1;
			} else if (direction == 2) {
				//s
				field[row + 1][col]['type'] = 1;
			} else if (direction == 3) {
				//w
				field[row][col - 1]['type'] = 1;
			}
		}
	}
	//console.log(field);

	//壁作成
	let doors = [];
	for (let row = 1; row < field.length; row = row + 2) {
		for (let col = 1; col < field[row].length; col = col + 2) {
			//playerとenemyの初期位置と、壁は対象外
			if (row == playerY && col == playerX ||
			row == enemyY && col == enemyX ||
			field[row][col]['type'] == 1) {
				continue;
			}
			
			let wallCount = 0;
			//n
			if (field[row - 1][col]['type'] == 1) {
				wallCount++;
			}
			//e
			if (field[row][col + 1]['type'] == 1) {
				wallCount++;
			}
			//s
			if (field[row + 1][col]['type'] == 1) {
				wallCount++;
			}
			//w
			if (field[row][col - 1]['type'] == 1) {
				wallCount++;
			}
			//三方が壁に囲まれている袋小路を扉で塞ぐ
			if (wallCount == 3) {
				field[row][col]['type'] = 1;
				//n
				if (field[row - 1][col]['type'] == 0) {
					field[row - 1][col]['type'] = 2;
					field[row - 1][col]['content'] = '';
					doors.push({'row': row - 1, 'col': col});
				} else
				//e
				if (field[row][col + 1]['type'] == 0) {
					field[row][col + 1]['type'] = 2;
					field[row][col + 1]['content'] = '';
					doors.push({'row': row, 'col': col + 1});
				} else
				//s
				if (field[row + 1][col]['type'] == 0) {
					field[row + 1][col]['type'] = 2;
					field[row + 1][col]['content'] = '';
					doors.push({'row': row + 1, 'col': col});
				} else
				//w
				if (field[row][col - 1]['type'] == 0) {
					field[row][col - 1]['type'] = 2;
					field[row][col - 1]['content'] = '';
					doors.push({'row': row, 'col': col - 1});
				}
			}
		}
	}
	
//console.log(JSON.stringify(doors));
	if (doors.length <= CONTENTS.length) {
		console.info('500 Internal Server Error\nRecreate the field.');
//		location.reload();
		makeField();
		return;
	}
	for (let i = 0; i < CONTENTS.length; i++) {
		if (doors.length < 1) {
			break;
		}
		let targetIndex = randNum(0, doors.length - 1);
		field[doors[targetIndex].row][doors[targetIndex].col]['content'] = CONTENTS[i];
		doors = doors.filter((item, index) => index !== targetIndex);
	}

//console.log(field);
}

makeField();

function resetGlobalVar() {
	startTime = null;
	isGameOver = false;
	gameOver = false;
	isStageClear = false;
	stageClear = false;
	playerX = 1;
	playerY = 1;
	playerDirection = 'e';
	enemyX = FIELD_W - 2;
	enemyY = FIELD_H - 2;
	enemyDirection = 'w';
//	pause = true;
	pauseStartTime = null;
	downTime = 0;
	timeLeft = TIME_LIMIT;
	hasKey = false;
	hasMap = false;
//	hasMap = true;
	isDrawKey = true;
//	mode = 'opening';
	lastMoveEnemyTime = null;
//	lastPlayerMoveTime = new Date().getTime();
}

function init() {
	resetGlobalVar();
	MAP_X = SCREEN_W - FIELD_W * CELL_SIZE;
	makeField();
}
