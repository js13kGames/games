function drawPerspective() {
	//ベースの暗闇
	perspectiveRenderer.beginPath();
	perspectiveRenderer.fillStyle = 'black';
	perspectiveRenderer.fillRect(0, 0, perspective.width, perspective.height);
	
	//奥の壁
	if (playerDirection == 'n' && playerY > 1 ||
	    playerDirection == 'e' && playerX < FIELD_W - 2 ||
	    playerDirection == 's' && playerY < FIELD_H - 2 ||
	    playerDirection == 'w' && playerX > 1) {
		if (playerDirection == 'n' && field[playerY - 2][playerX]['type'] > 0 ||
		    playerDirection == 'e' && field[playerY][playerX + 2]['type'] > 0 ||
		    playerDirection == 's' && field[playerY + 2][playerX]['type'] > 0 ||
		    playerDirection == 'w' && field[playerY][playerX - 2]['type'] > 0) {
		    if (playerDirection == 'n' && field[playerY - 2][playerX - 1]['type'] > 0 && field[playerY - 2][playerX + 1]['type'] <= 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 2]['type'] > 0 && field[playerY + 1][playerX + 2]['type'] <= 0 ||
			    playerDirection == 's' && field[playerY + 2][playerX + 1]['type'] > 0 && field[playerY + 2][playerX - 1]['type'] <= 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 2]['type'] > 0 && field[playerY - 1][playerX - 2]['type'] <= 0) {
				perspectiveRenderer.beginPath();
				perspectiveRenderer.fillStyle = '#101010';
				perspectiveRenderer.fillRect(0, perspective.height * 0.375, perspective.width * 0.625, perspective.height * 0.25);
			} else
		    if (playerDirection == 'n' && field[playerY - 2][playerX - 1]['type'] <= 0 && field[playerY - 2][playerX + 1]['type'] > 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 2]['type'] <= 0 && field[playerY + 1][playerX + 2]['type'] > 0 ||
			    playerDirection == 's' && field[playerY + 2][playerX + 1]['type'] <= 0 && field[playerY + 2][playerX - 1]['type'] > 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 2]['type'] <= 0 && field[playerY - 1][playerX - 2]['type'] > 0) {
				perspectiveRenderer.beginPath();
				perspectiveRenderer.fillStyle = '#101010';
				perspectiveRenderer.fillRect(perspective.width * 0.375, perspective.height * 0.375, perspective.width * 0.625, perspective.height * 0.25);
			} else
		    if (playerDirection == 'n' && field[playerY - 2][playerX - 1]['type'] <= 0 && field[playerY - 2][playerX + 1]['type'] <= 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 2]['type'] <= 0 && field[playerY + 1][playerX + 2]['type'] <= 0 ||
			    playerDirection == 's' && field[playerY + 2][playerX + 1]['type'] <= 0 && field[playerY + 2][playerX - 1]['type'] <= 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 2]['type'] <= 0 && field[playerY - 1][playerX - 2]['type'] <= 0) {
				perspectiveRenderer.beginPath();
				perspectiveRenderer.fillStyle = '#101010';
				perspectiveRenderer.fillRect(perspective.width * 0.375, perspective.height * 0.375, perspective.width * 0.25, perspective.height * 0.25);
			} else {
				perspectiveRenderer.beginPath();
				perspectiveRenderer.fillStyle = '#101010';
				perspectiveRenderer.fillRect(0, perspective.height * 0.375, perspective.width, perspective.height * 0.25);
			}
		}
	}
	
	//奥の壁が扉の場合
	if (playerDirection == 'n' && playerY > 1 && field[playerY - 2][playerX]['type'] == 2 ||
	    playerDirection == 'e' && playerX < FIELD_W - 2 && field[playerY][playerX + 2]['type'] == 2 ||
	    playerDirection == 's' && playerY < FIELD_H - 2 && field[playerY + 2][playerX]['type'] == 2 ||
	    playerDirection == 'w' && playerX > 1 && field[playerY][playerX - 2]['type'] == 2) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.lineWidth = 1;
		perspectiveRenderer.strokeStyle = '#000';
		perspectiveRenderer.strokeRect(perspective.width * 0.375, perspective.height * 0.375, perspective.width * 0.25, perspective.height * 0.25);
		perspectiveRenderer.beginPath();
		perspectiveRenderer.strokeStyle = '#000';
		perspectiveRenderer.moveTo(perspective.width * 0.5, perspective.height * 0.375);
		perspectiveRenderer.lineTo(perspective.width * 0.5, perspective.height * 0.625);
		perspectiveRenderer.closePath();
		perspectiveRenderer.stroke();
	}

	//天井
	perspectiveRenderer.beginPath();
	let gradientCeiling = perspectiveRenderer.createLinearGradient(0, 0, 0, perspective.height * 0.375);
	gradientCeiling.addColorStop(0.0, '#333');
	gradientCeiling.addColorStop(1.0, '#000');
	perspectiveRenderer.fillStyle = gradientCeiling;
	perspectiveRenderer.fillRect(0, 0, perspective.width, perspective.height * 0.375);

	//床
	perspectiveRenderer.beginPath();
	let gradientFloor = perspectiveRenderer.createLinearGradient(0, perspective.height * 0.625, 0, perspective.height);
	gradientFloor.addColorStop(0.0, '#000');
	gradientFloor.addColorStop(1.0, '#999');
	perspectiveRenderer.fillStyle = gradientFloor;
	perspectiveRenderer.fillRect(0, perspective.height * 0.625, perspective.width, perspective.height);

	//右壁
	let gradientRightWall = perspectiveRenderer.createLinearGradient(perspective.width * 0.625, 0, perspective.width, 0);
	gradientRightWall.addColorStop(0.0, '#000');
	gradientRightWall.addColorStop(1.0, '#999');
	//手前も奥も
	if (playerDirection == 'n' && field[playerY][playerX + 1]['type'] > 0 && field[playerY - 1][playerX + 1]['type'] > 0 ||
	playerDirection == 'e' && field[playerY + 1][playerX]['type'] > 0 && field[playerY + 1][playerX + 1]['type'] > 0 ||
	playerDirection == 's' && field[playerY][playerX - 1]['type'] > 0 && field[playerY + 1][playerX - 1]['type'] > 0 ||
	playerDirection == 'w' && field[playerY - 1][playerX]['type'] > 0 && field[playerY - 1][playerX - 1]['type'] > 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = gradientRightWall;
		perspectiveRenderer.moveTo(perspective.width * 0.625, perspective.height * 0.375);
		perspectiveRenderer.lineTo(perspective.width, 0);
		perspectiveRenderer.lineTo(perspective.width, perspective.height);
		perspectiveRenderer.lineTo(perspective.width * 0.625, perspective.height * 0.625);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		//扉
		if (playerDirection == 'n' && field[playerY][playerX + 1]['type'] == 2 ||
		playerDirection == 'e' && field[playerY + 1][playerX]['type'] == 2 ||
		playerDirection == 's' && field[playerY][playerX - 1]['type'] == 2 ||
		playerDirection == 'w' && field[playerY - 1][playerX]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 1;
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.75, perspective.height * 0.25);
			perspectiveRenderer.lineTo(perspective.width, 0);
			perspectiveRenderer.lineTo(perspective.width, perspective.height);
			perspectiveRenderer.lineTo(perspective.width * 0.75, perspective.height * 0.75);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.875, perspective.height * 0.125);
			perspectiveRenderer.lineTo(perspective.width * 0.875, perspective.height * 0.875);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
		} else
		if (playerDirection == 'n' && field[playerY - 1][playerX + 1]['type'] == 2 ||
		playerDirection == 'e' && field[playerY + 1][playerX + 1]['type'] == 2 ||
		playerDirection == 's' && field[playerY + 1][playerX - 1]['type'] == 2 ||
		playerDirection == 'w' && field[playerY - 1][playerX - 1]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 0.5;
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.625, perspective.height * 0.375);
			perspectiveRenderer.lineTo(perspective.width * 0.625, perspective.height * 0.625);
			perspectiveRenderer.lineTo(perspective.width * 0.75, perspective.height * 0.75);
			perspectiveRenderer.lineTo(perspective.width * 0.75, perspective.height * 0.25);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.6875, perspective.height * 0.3125);
			perspectiveRenderer.lineTo(perspective.width * 0.6875, perspective.height * 0.6875);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
		}
	//手前だけ
	} else if (playerDirection == 'n' && field[playerY][playerX + 1]['type'] > 0 && field[playerY - 1][playerX + 1]['type'] <= 0 ||
	playerDirection == 'e' && field[playerY + 1][playerX]['type'] > 0 && field[playerY + 1][playerX + 1]['type'] <= 0 ||
	playerDirection == 's' && field[playerY][playerX - 1]['type'] > 0 && field[playerY + 1][playerX - 1]['type'] <= 0 ||
	playerDirection == 'w' && field[playerY - 1][playerX]['type'] > 0 && field[playerY - 1][playerX - 1]['type'] <= 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = gradientRightWall;
		perspectiveRenderer.moveTo(perspective.width * 0.75, perspective.height * 0.25);
		perspectiveRenderer.lineTo(perspective.width, 0);
		perspectiveRenderer.lineTo(perspective.width, perspective.height);
		perspectiveRenderer.lineTo(perspective.width * 0.75, perspective.height * 0.75);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
	//奥だけ
	} else if (playerDirection == 'n' && field[playerY][playerX + 1]['type'] <= 0 && field[playerY - 1][playerX + 1]['type'] > 0 ||
	playerDirection == 'e' && field[playerY + 1][playerX]['type'] <= 0 && field[playerY + 1][playerX + 1]['type'] > 0 ||
	playerDirection == 's' && field[playerY][playerX - 1]['type'] <= 0 && field[playerY + 1][playerX - 1]['type'] > 0 ||
	playerDirection == 'w' && field[playerY - 1][playerX]['type'] <= 0 && field[playerY - 1][playerX - 1]['type'] > 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = gradientRightWall;
		perspectiveRenderer.moveTo(perspective.width * 0.625, perspective.height * 0.375);
		perspectiveRenderer.lineTo(perspective.width * 0.625, perspective.height * 0.625);
		perspectiveRenderer.lineTo(perspective.width * 0.75, perspective.height * 0.75);
		perspectiveRenderer.lineTo(perspective.width * 0.75, perspective.height * 0.25);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = '#404040';
		perspectiveRenderer.fillRect(perspective.width * 0.75, perspective.height * 0.25, perspective.width * 0.25, perspective.height * 0.5);
	}
	
	//左壁
	let gradientLeftWall = perspectiveRenderer.createLinearGradient(0, 0, perspective.width * 0.375, 0);
	gradientLeftWall.addColorStop(0.0, '#999');
	gradientLeftWall.addColorStop(1.0, '#000');
	//手前も奥も
	if (playerDirection == 'n' && field[playerY][playerX - 1]['type'] > 0 && field[playerY - 1][playerX - 1]['type'] > 0 ||
	playerDirection == 'e' && field[playerY - 1][playerX]['type'] > 0 && field[playerY - 1][playerX + 1]['type'] > 0 ||
	playerDirection == 's' && field[playerY][playerX + 1]['type'] > 0 && field[playerY + 1][playerX + 1]['type'] > 0 ||
	playerDirection == 'w' && field[playerY + 1][playerX]['type'] > 0 && field[playerY + 1][playerX - 1]['type'] > 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = gradientLeftWall;
		perspectiveRenderer.moveTo(perspective.width * 0.375, perspective.height * 0.625);
		perspectiveRenderer.lineTo(0, perspective.height);
		perspectiveRenderer.lineTo(0, 0);
		perspectiveRenderer.lineTo(perspective.width * 0.375, perspective.height * 0.375);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		//扉
		if (playerDirection == 'n' && field[playerY][playerX - 1]['type'] == 2 ||
		playerDirection == 'e' && field[playerY - 1][playerX]['type'] == 2 ||
		playerDirection == 's' && field[playerY][playerX + 1]['type'] == 2 ||
		playerDirection == 'w' && field[playerY + 1][playerX]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 1;
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.25, perspective.height * 0.25);
			perspectiveRenderer.lineTo(0, 0);
			perspectiveRenderer.lineTo(0, perspective.height);
			perspectiveRenderer.lineTo(perspective.width * 0.25, perspective.height * 0.75);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.125, perspective.height * 0.125);
			perspectiveRenderer.lineTo(perspective.width * 0.125, perspective.height * 0.875);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
		} else
		if (playerDirection == 'n' && field[playerY - 1][playerX - 1]['type'] == 2 ||
		playerDirection == 'e' && field[playerY - 1][playerX + 1]['type'] == 2 ||
		playerDirection == 's' && field[playerY + 1][playerX + 1]['type'] == 2 ||
		playerDirection == 'w' && field[playerY + 1][playerX - 1]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 0.5;
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.375, perspective.height * 0.375);
			perspectiveRenderer.lineTo(perspective.width * 0.375, perspective.height * 0.625);
			perspectiveRenderer.lineTo(perspective.width * 0.25, perspective.height * 0.75);
			perspectiveRenderer.lineTo(perspective.width * 0.25, perspective.height * 0.25);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
			perspectiveRenderer.beginPath();
			perspectiveRenderer.strokeStyle = 'black';
			perspectiveRenderer.moveTo(perspective.width * 0.3125, perspective.height * 0.3125);
			perspectiveRenderer.lineTo(perspective.width * 0.3125, perspective.height * 0.6875);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
		}
	//手前だけ
	} else if (playerDirection == 'n' && field[playerY][playerX - 1]['type'] > 0 && field[playerY - 1][playerX - 1]['type'] <= 0 ||
	playerDirection == 'e' && field[playerY - 1][playerX]['type'] > 0 && field[playerY - 1][playerX + 1]['type'] <= 0 ||
	playerDirection == 's' && field[playerY][playerX + 1]['type'] > 0 && field[playerY + 1][playerX + 1]['type'] <= 0 ||
	playerDirection == 'w' && field[playerY + 1][playerX]['type'] > 0 && field[playerY + 1][playerX - 1]['type'] <= 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = gradientLeftWall;
		perspectiveRenderer.moveTo(perspective.width * 0.25, perspective.height * 0.75);
		perspectiveRenderer.lineTo(0, perspective.height);
		perspectiveRenderer.lineTo(0, 0);
		perspectiveRenderer.lineTo(perspective.width * 0.25, perspective.height * 0.25);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
	//奥だけ
	} else if (playerDirection == 'n' && field[playerY][playerX - 1]['type'] <= 0 && field[playerY - 1][playerX - 1]['type'] > 0 ||
	playerDirection == 'e' && field[playerY - 1][playerX]['type'] <= 0 && field[playerY - 1][playerX + 1]['type'] > 0 ||
	playerDirection == 's' && field[playerY][playerX + 1]['type'] <= 0 && field[playerY + 1][playerX + 1]['type'] > 0 ||
	playerDirection == 'w' && field[playerY + 1][playerX]['type'] <= 0 && field[playerY + 1][playerX - 1]['type'] > 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = gradientLeftWall;
		perspectiveRenderer.moveTo(perspective.width * 0.25, perspective.height * 0.75);
		perspectiveRenderer.lineTo(perspective.width * 0.375, perspective.height * 0.625);
		perspectiveRenderer.lineTo(perspective.width * 0.375, perspective.height * 0.375);
		perspectiveRenderer.lineTo(perspective.width * 0.25, perspective.height * 0.25);
		perspectiveRenderer.closePath();
		perspectiveRenderer.fill();
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = '#404040';
		perspectiveRenderer.fillRect(0, perspective.height * 0.25, perspective.width * 0.25, perspective.height * 0.5);
	}
	
	//正面
	if (playerDirection == 'n' && field[playerY - 1][playerX]['type'] > 0 ||
	    playerDirection == 'e' && field[playerY][playerX + 1]['type'] > 0 ||
	    playerDirection == 's' && field[playerY + 1][playerX]['type'] > 0 ||
	    playerDirection == 'w' && field[playerY][playerX - 1]['type'] > 0) {
		perspectiveRenderer.beginPath();
		perspectiveRenderer.fillStyle = '#404040';
		//自分の左右が通路
		if (playerDirection == 'n' && field[playerY][playerX - 1]['type'] <= 0 && field[playerY][playerX + 1]['type'] <= 0 ||
		    playerDirection == 'e' && field[playerY - 1][playerX]['type'] <= 0 && field[playerY + 1][playerX]['type'] <= 0 ||
		    playerDirection == 's' && field[playerY][playerX + 1]['type'] <= 0 && field[playerY][playerX - 1]['type'] <= 0 ||
		    playerDirection == 'w' && field[playerY + 1][playerX]['type'] <= 0 && field[playerY - 1][playerX]['type'] <= 0) {
		    //斜め左右が通路
		    if (playerDirection == 'n' && field[playerY - 1][playerX - 1]['type'] <= 0 && field[playerY - 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 1]['type'] <= 0 && field[playerY + 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 's' && field[playerY + 1][playerX + 1]['type'] <= 0 && field[playerY + 1][playerX - 1]['type'] <= 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 1]['type'] <= 0 && field[playerY - 1][playerX - 1]['type'] <= 0) {
				perspectiveRenderer.fillRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.5, perspective.height * 0.5);
			} else
			//斜め左が通路
		    if (playerDirection == 'n' && field[playerY - 1][playerX - 1]['type'] <= 0 && field[playerY - 1][playerX + 1]['type'] > 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 1]['type'] <= 0 && field[playerY + 1][playerX + 1]['type'] > 0 ||
			    playerDirection == 's' && field[playerY + 1][playerX + 1]['type'] <= 0 && field[playerY + 1][playerX - 1]['type'] > 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 1]['type'] <= 0 && field[playerY - 1][playerX - 1]['type'] > 0) {
				perspectiveRenderer.fillRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.75, perspective.height * 0.5);
			} else
			//斜め右が通路
		    if (playerDirection == 'n' && field[playerY - 1][playerX - 1]['type'] > 0 && field[playerY - 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 1]['type'] > 0 && field[playerY + 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 's' && field[playerY + 1][playerX + 1]['type'] > 0 && field[playerY + 1][playerX - 1]['type'] <= 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 1]['type'] > 0 && field[playerY - 1][playerX - 1]['type'] <= 0) {
				perspectiveRenderer.fillRect(0, perspective.height * 0.25, perspective.width * 0.75, perspective.height * 0.5);
			} else {
				perspectiveRenderer.fillRect(0, perspective.height * 0.25, perspective.width, perspective.height * 0.5);
			}
		} else
		//自分の右が通路
		if (playerDirection == 'n' && field[playerY][playerX + 1]['type'] <= 0 ||
		    playerDirection == 'e' && field[playerY + 1][playerX]['type'] <= 0 ||
		    playerDirection == 's' && field[playerY][playerX - 1]['type'] <= 0 ||
		    playerDirection == 'w' && field[playerY - 1][playerX]['type'] <= 0) {
		    //右前も通路
			if (playerDirection == 'n' && field[playerY - 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 'e' && field[playerY + 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 's' && field[playerY + 1][playerX - 1]['type'] <= 0 ||
			    playerDirection == 'w' && field[playerY - 1][playerX - 1]['type'] <= 0) {
				perspectiveRenderer.fillRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.5, perspective.height * 0.5);
			} else {
				perspectiveRenderer.fillRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.75, perspective.height * 0.5);
			}
		} else
		//自分の左が通路
		if (playerDirection == 'n' && field[playerY][playerX - 1]['type'] <= 0 ||
		    playerDirection == 'e' && field[playerY - 1][playerX]['type'] <= 0 ||
		    playerDirection == 's' && field[playerY][playerX + 1]['type'] <= 0 ||
		    playerDirection == 'w' && field[playerY + 1][playerX]['type'] <= 0) {
		    //左前も通路
			if (playerDirection == 'n' && field[playerY - 1][playerX - 1]['type'] <= 0 ||
			    playerDirection == 'e' && field[playerY - 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 's' && field[playerY + 1][playerX + 1]['type'] <= 0 ||
			    playerDirection == 'w' && field[playerY + 1][playerX - 1]['type'] <= 0) {
				perspectiveRenderer.fillRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.5, perspective.height * 0.5);
			} else {
				perspectiveRenderer.fillRect(0, perspective.height * 0.25, perspective.width * 0.75, perspective.height * 0.5);
			}
		} else {
		//行き止まり
			perspectiveRenderer.fillRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.5, perspective.height * 0.5);
		}
		
		//扉
		if (playerDirection == 'n' && field[playerY - 1][playerX]['type'] == 2 ||
		    playerDirection == 'e' && field[playerY][playerX + 1]['type'] == 2 ||
		    playerDirection == 's' && field[playerY + 1][playerX]['type'] == 2 ||
		    playerDirection == 'w' && field[playerY][playerX - 1]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 1;
			perspectiveRenderer.strokeStyle = '#000';
			perspectiveRenderer.strokeRect(perspective.width * 0.25, perspective.height * 0.25, perspective.width * 0.5, perspective.height * 0.5);
			perspectiveRenderer.beginPath();
			perspectiveRenderer.strokeStyle = '#000';
			perspectiveRenderer.moveTo(perspective.width * 0.5, perspective.height * 0.25);
			perspectiveRenderer.lineTo(perspective.width * 0.5, perspective.height * 0.75);
			perspectiveRenderer.closePath();
			perspectiveRenderer.stroke();
		}
		//左
		if (playerDirection == 'n' && field[playerY - 1][playerX - 1]['type'] == 2 ||
		    playerDirection == 'e' && field[playerY - 1][playerX + 1]['type'] == 2 ||
		    playerDirection == 's' && field[playerY + 1][playerX + 1]['type'] == 2 ||
		    playerDirection == 'w' && field[playerY + 1][playerX - 1]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 1;
			perspectiveRenderer.strokeStyle = '#000';
			perspectiveRenderer.strokeRect(0, perspective.height * 0.25, perspective.width * 0.25, perspective.height * 0.5);
		}
		//右
		if (playerDirection == 'n' && field[playerY - 1][playerX + 1]['type'] == 2 ||
		    playerDirection == 'e' && field[playerY + 1][playerX + 1]['type'] == 2 ||
		    playerDirection == 's' && field[playerY + 1][playerX - 1]['type'] == 2 ||
		    playerDirection == 'w' && field[playerY - 1][playerX - 1]['type'] == 2) {
			perspectiveRenderer.beginPath();
			perspectiveRenderer.lineWidth = 1;
			perspectiveRenderer.strokeStyle = '#000';
			perspectiveRenderer.strokeRect(perspective.width * 0.75, perspective.height * 0.25, perspective.width * 0.25, perspective.height * 0.5);
		}
	}
}

