'use strict';

let gpTitle;
let gpMessage;

function startGame() {
	gpTitle = new component('30px', 'Ariel', 'green', 24, 30, 'text');

	gpMessage = new component('24px', 'Consolas', 'red', 24, 40, 'array');
	myGameArea.start();
}

const myGameArea = {
	canvas: document.getElementById('myCanvas'),
	stringBuffer: '', // holds text before Enter key is hit
	screenBuffer: '', // holds text of "screen"
	buffPosition: 0, // position in the buffer where the "cursor" is
	lineBuffer: new Array(), // holds the lines commited after Enter key
	arrowKeys: [],
	gameFps: 30,
	acceptInput: true,  // default to allow entry on message
	roomIndex: 0,
	roomMessageIndex: 0,
	roomData: {},
	gameSave: {},
	currentRoomSave: {},
	currentDialog: {},
	onlineStatus: false,
	start: function () {
		this.speedX = 0;
		this.speedY = 0;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.stringBuffer = '';
		this.getRoomData();
		this.getNextMessage();
		this.gameSave = this.getDefaultGameData();
		this.currentRoomSave = this.getDefaultRoomData(0);

		this.context = this.canvas.getContext('2d', { alpha: false }); // turn off transparency
		this.interval = setInterval(this.updateGameArea, 1000 / this.gameFps);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	getNextMessage: function () {
		if (myGameArea.roomMessageIndex >= 0 && myGameArea.roomMessageIndex < myGameArea.roomData.messages.length) {
			//index within the bounds of messages array
			let currentMessage = myGameArea.roomData.messages[myGameArea.roomMessageIndex];

			// increment index
			if (myGameArea.roomMessageIndex < myGameArea.roomData.messages.length
				&& currentMessage.msg !== undefined) {

				if (currentMessage.msg.supressCmd) {
					myGameArea.acceptInput = !supressCmd;
				}
				if (currentMessage.next !== undefined) {
					myGameArea.roomMessageIndex = this.findMessageByLabel(currentMessage.next, myGameArea.roomMessageIndex);
				}
			}
			myGameArea.screenBuffer = currentMessage.msg;
			this.currentDialog = currentMessage;
		} else {
			myGameArea.screenBuffer = 'unknown message';
		}
	},
	findMessageByLabel: function (labelToFind, currentLine) {
		// if no label or currentLine is less than zero, don't do it
		if (labelToFind.length > 0 && currentLine >= 0) {
			for (let i = currentLine; i < myGameArea.roomData.messages.length; i++) {
				const line = myGameArea.roomData.messages[i];
				if (line.label !== undefined && line.label === labelToFind) {
					return i;
				}
			}
		}
		return currentLine;
	},
	getRoomData: function () {
		if (this.roomIndex === 0) {
			this.roomData = GetRoomData(this.roomIndex);
		}
	},
	getDefaultGameData: function () {
		const gameData = {
			playerName: 'Player1'
			, currentRoomIndex: 0
			, lockedRooms: [0]
			, inventory: [
				{ name: 'pen', value: 1 }
				, { name: 'matchbook', value: 18 }
				, { name: 'gum', value: 5 }
			]
		};
		return gameData;
	},
	getDefaultRoomData: function (index) {
		switch (index) {
			case 0:
				return this.getDefaultRoom0Data();
				break;
		}
	},
	getDefaultRoom0Data: function () {
		const roomData = [
			{ name: 'rm0-unchained', value: 0 }
			, { name: 'rm0-shim', value: 0 }
			, { name: 'rm0-padlockOpen', value: 0 }
			, { name: 'rm0-roomComplete', value: 0 }
			, { name: 'rm0-wireConnected', value: 0 }
		];

		return roomData;
	},
	updateGameArea: function () {
		myGameArea.clear();

		if (myGameArea.currentDialog && myGameArea.currentDialog.next) {
			// theres more text to show
			gpMessage.text = Convert2dArrayToString(
				Draw(40, 20, myGameArea.screenBuffer, myGameArea.stringBuffer, true));
		} else {
			// end of text, not continuation
			gpMessage.text = Convert2dArrayToString(
				Draw(40, 20, myGameArea.screenBuffer, myGameArea.stringBuffer));
		}
		gpMessage.update();

		if (myGameArea.onlineStatus === true) {
			gpTitle.text = 'Escape!			ONLINE Mode'
		} else {
			gpTitle.text = 'Escape!			Super Cool OFFLINE Mode'
		}
		
		gpTitle.update();
	}
}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;

	this.update = function () {
		const ctx = myGameArea.context;
		if (this.type == 'text') {
			if (this.text !== undefined) {
				ctx.font = this.width + ' ' + this.height;
				ctx.fillStyle = color;
				ctx.fillText(this.text, this.x, this.y);
			}
		} else if (this.type === 'array') {
			if (this.text !== undefined) {
				//console.log(this.text);
				let lines = this.text.split('\r\n');
				const spacing = 20;

				//could make different colors
				ctx.font = this.width + ' ' + this.height;
				ctx.fillStyle = color;

				for (let i = 0; i < lines.length; i++) {
					let lineSpace = (spacing * (i + 1)) + this.y;
					ctx.fillText(lines[i], this.x, lineSpace);
					//console.log('linespacing: ' + lineSpace);
				}
			}
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	this.newPos = function () {
		this.x += this.speedX;
		this.y += this.speedY;
	}
}

// if there is text in the command box,
// verify if it is a command or dialog answer
// process accordingly
function parseCommandText(command) {
	let result = { verb: '', noun: '' };//default to dialog text

	// seperate by spaces, assume last item is noun
	const lineArray = command.split(' ');
	if (lineArray.length > 1 && lineArray[lineArray.length - 1] !== undefined) {
		// only use last word
		result.noun = lineArray[lineArray.length - 1];

		// if Look or Use is in the command string, then command, else, dialog
		result.verb = lineArray[0].toLowerCase();
	} else {
		return;
	}

	return result;
}

function processCommand(command) {
	// command: id, label, verb, noun, msg, msgSuccess 
	// checkVariable, checkValue, setVariable, setValue
	let result;
	if (command) {
		// system commands
		if (command.verb === 'save' && command.noun ==='game') {
			saveGame();
		} else if (command.verb === 'load' && command.noun ==='game') {
			loadGame();
		}

		if (command.msg) {
			result = command.msg;
		}

		// potentially could have both set
		if (command.checkVariable && command.checkValue) {
			// if valid, use msgSuccess
			let checkSetting = myGameArea.currentRoomSave.filter(setting => setting.name === command.checkVariable);
			if (checkSetting && checkSetting.length === 1) {
				if (checkSetting[0].value === command.checkValue) {
					//inside if
					console.log(checkSetting[0].value === command.checkValue);
		
					if (command.msgSuccess) {
						result = command.msgSuccess;
					}
					if (command.next) {
						// should jumpt to next dialog
						myGameArea.roomMessageIndex = myGameArea.findMessageByLabel(command.next, myGameArea.roomMessageIndex);
					}
					// check is successful, then do setVariable if available
					if (command.setVariable && command.setValue) {
						//if valid, commit variable to settings
						let updateSetting = myGameArea.currentRoomSave.filter(setting => setting.name === command.setVariable);
						if (updateSetting && updateSetting.length === 1) {
							// if it is already set, then we have already performed this action
							if (updateSetting[0].value !== command.setValue) {
								updateSetting[0].value = command.setValue;
							} else {
								// potentially duplicate, need to check if dupes is okay
								// use door isn't a good one to show this message
								// result = 'You have already performed this\r\n'
								// 	+ 'action.';
							}
						}
					} // if (command.setVariable && command.setValue) {		
				} else {
				}
			}
		} else {
			if (command.setVariable && command.setValue) {
				//if valid, commit variable to settings
				let updateSetting = myGameArea.currentRoomSave.filter(setting => setting.name === command.setVariable);
				if (updateSetting && updateSetting.length === 1) {
					// if it is already set, then we have already performed this action
					if (updateSetting[0].value !== command.setValue) {
						updateSetting[0].value = command.setValue;
					} else {
						// potentially duplicate, need to check if dupes is okay
						// use door isn't a good one to show this message
						// result = 'You have already performed this\r\n'
						// 	+ 'action.';
					}
				}
			} // if (command.setVariable && command.setValue) {

		}
	} // if (command) {
	return result;
}

function saveGame() {
	if (typeof (Storage) !== "undefined") {
		let saveData = {
			roomIndex: myGameArea.roomIndex
			, roomMessageIndex: myGameArea.roomMessageIndex
			, roomData: myGameArea.roomData
			, gameSave: myGameArea.gameSave
			, currentRoomSave: myGameArea.currentRoomSave
			, currentDialog: myGameArea.currentDialog
		}
		localStorage.setItem('escapegame.saveData', JSON.stringify(saveData));
	}
}

function loadGame() {
	if (typeof (Storage) !== "undefined") {
		let saveDataString = localStorage.getItem('escapegame.saveData');
		let saveData = JSON.parse(saveDataString);

		myGameArea.roomIndex = saveData.roomIndex;
		myGameArea.roomMessageIndex = saveData.roomMessageIndex;
		myGameArea.roomData = saveData.roomData;
		myGameArea.gameSave = saveData.gameSave;
		myGameArea.currentRoomSave = saveData.currentRoomSave;
		myGameArea.currentDialog = saveData.currentDialog;
	}
}

function showCommandMessage(command) {
	// command should be an object with verb, noun
	if (command !== undefined) {
		const cmd = myGameArea.roomData.commands;
		// const found = cmd.find( getCommandMessage);
		let error;
		for (let i = 0; i < cmd.length; i++) {
			if (cmd[i].verb !== undefined
				&& cmd[i].verb === command.verb) {
				//console.log(cmd[i].verb + ' == ' + command.verb + ' ' + cmd[i].noun + ' == ' + command.noun);
				if (cmd[i].noun !== undefined
					&& cmd[i].noun === command.noun) {
					myGameArea.screenBuffer = processCommand(cmd[i]); //cmd[i].msg;
					//myGameArea.screenBuffer = cmd[i].msg;
					return;
					break;
				}
				if (cmd[i].noun !== undefined
					&& cmd[i].noun === 'error') {
					//save error for later if not found
					error = cmd[i];
				}
			}
		} // for loop
		// if we made it here, nothing was found
		myGameArea.screenBuffer = error.msg;
	} // if (command !== undefined) {
}

function getCommandMessage(command) { //}, verb, noun) {
	//return command.verb === verb && command.noun === noun;
	return command.verb === 'use' && command.noun === 'gum';
}