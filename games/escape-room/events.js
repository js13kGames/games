/*
    event hooks for window object
*/
window.addEventListener('resize', function (e) {
	myGameArea.canvas.width = window.innerWidth;
	myGameArea.canvas.height = window.innerHeight;
	updateGameArea();
});
// respond to keyboard events
window.addEventListener('keydown', function (e) {
	myGameArea.arrowKeys = (myGameArea.arrowKeys || []);
	if (e.keyCode >= 37 && e.keyCode <= 40) { //arrow keys
		// 37-left, 38-up, 39-right, 40-down
		// offset keyCode so index starts at zero and there won't be empty items in array
		myGameArea.arrowKeys[e.keyCode - 37] = true;
	} else if (e.keyCode === 8 && myGameArea.acceptInput) { // backspace
		myGameArea.stringBuffer = myGameArea.stringBuffer.substr(0, myGameArea.stringBuffer.length - 1);
	}
});
window.addEventListener('keyup', function (e) {
	if (e.keyCode >= 37 && e.keyCode <= 40) {
		// offset keyCode so index starts at zero and there won't be empty items in array
		myGameArea.arrowKeys[e.keyCode - 37] = false;
	}
});
window.addEventListener('keypress', function (e) {
	myGameArea.stringBuffer = (myGameArea.stringBuffer || '');
	if (e.keyCode === 13 && myGameArea.stringBuffer !== '') {
		// enter key
		let answer = myGameArea.stringBuffer;
		myGameArea.stringBuffer = '';
		let commandResult = parseCommandText(answer);
		if (commandResult !== undefined) {
			//Do Interaction
			showCommandMessage(commandResult);
		} else {
			//showNextDialogMessage(answer);
			myGameArea.getNextMessage();
		}
	} else if (e.keyCode === 13) {
		// nothing typed
		myGameArea.getNextMessage();
	} else if (myGameArea.acceptInput) {
		let newChar = String.fromCharCode(e.charCode);

		if (myGameArea.buffPosition === myGameArea.stringBuffer.length) {
			myGameArea.buffPosition = myGameArea.buffPosition + 1
		}
		myGameArea.stringBuffer = myGameArea.stringBuffer + newChar;
		//console.log('keypress: ' + myGameArea.stringBuffer);
	}
});



/* Network Detection */
UpdateStatus(navigator.onLine);
// if ('connection' in navigator) {
// 	DisplayConnectionSpeed(navigator.connection);
// 	navigator.connection.addEventListener('change', function (evt) {
// 		DisplayConnectionSpeed(evt.target);
// 	});
// }

window.addEventListener('online', function () {
	UpdateStatus(true);
});
window.addEventListener('offline', function () {
	UpdateStatus(false);
});

function UpdateStatus(isConnected) {
	myGameArea.onlineStatus = isConnected;
}
