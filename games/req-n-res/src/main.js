function main() {
	let timestamp = new Date().getTime();
	
	if (!startTime) startTime = timestamp;
	var progress = timestamp - startTime;
	
	if (pause) {
		if (!pauseStartTime) pauseStartTime = timestamp;
	} else {
		if (pauseStartTime !== null) {
			downTime += parseInt((timestamp - pauseStartTime) / 1000);
			pauseStartTime = null;
		}
		timeProgress(parseInt(progress / 1000) - downTime);
	}
	
	perspectiveRenderer.clearRect(0, 0, perspective.width, perspective.height);
	
	if (!pause) {
		moveEnemy();
		
		encountEnemy();
	}
	
	drawPerspective();

	drawEnemy();
	
	drawGoal();
	
	drawCompass();
	
	if (isDrawKey) {
		drawKey();
	}
	
	drawPlayer();
	
	if (hasMap) {
		drawMap();
	}
	
	if (hasKey && !isDrawKey) {
		drawKeySign();
	}
	
	drawMessage();
	
	drawTimeLimit();
	
	drawStageNum();

	if (isGameOver) {
		gameOver = true;
		clearInterval(mainLoopId);
	} else
	if (isStageClear) {
		stageClear = true;
		clearInterval(mainLoopId);
	}
}

