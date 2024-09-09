'use strict';

const c_crlf = '\r\n'; // carriage return line feed
const c_bdr = '#'; // border
const c_n = '\0'; // Null char

function ConvertStringTo2dArray(convertString) {
	// Assume lines are seperated by '\r\n'
	let result = [];
	if (convertString.length > 0) {
		const lines = convertString.split(c_crlf);

		for (var i = 0; i < lines.length; i++) {
			// Array.split removes some whitespace like null
			// Array.from maintains non-printable chars
			result[i] = Array.from(lines[i]);
		}
	}

	return result;
}

function Convert2dArrayToString(multiArray) {
	let result = '';
	//lines, columns
	for (let lines = 0; lines < multiArray.length; lines++) {
		//get columns
		for (let char = 0; char < multiArray[lines].length; char++) {
			if (multiArray[lines][char] !== undefined) {
				result = result + multiArray[lines][char];
			}
		}
		result = result + c_crlf;
	}

	return result;
}

function DrawBorder(charWidth, charHeight, showMore) {
	const top = c_bdr.repeat(charWidth);

	let result = top + c_crlf;

	// fill height with filler lines
	// total lines is a header and bottom (2) + input area (4) + content
	for (let i = 0; i < charHeight - (2 + 4); i++) {
		result = result + c_bdr + c_n.repeat(charWidth - 2) + c_bdr + c_crlf;
	}
	// draw lower text border
	if (showMore) {
		let middle = (charWidth / 2) - 3;
		//console.log('middle: ' + middle);
		// ...#### MORE ####...
		result = result + c_bdr.repeat(middle) + ' MORE ' + c_bdr.repeat(middle);
	} else {
		result = result + c_bdr.repeat(charWidth);
	}

	//draw input area
	for (let i = 0; i < 4; i++) {
		result = result + c_bdr + c_n.repeat(charWidth - 2) + c_bdr + c_crlf;
	}
	result = result + c_bdr.repeat(charWidth);

	return result;
}

function DrawMessageText(charWidth, charHeight, message) {
	// embed margins for the text, 1 char
	const topPad = c_n.repeat(charWidth) + c_crlf;
	let formattedMessage = topPad + c_crlf;

	//convert message to lines in case embedded line breaks
	const lines = message.split(c_crlf);

	for (let i = 0; i < lines.length; i++) {
		let lineText = lines[i];

		// only process if text is more than blank
		if (lineText.length > 0) {
			if (lineText.length + 4 > charWidth) { // message + margin in front and back
				//need to wrap line below
				//console.log('ERR: Need to wrap text to next line!');
				formattedMessage = formattedMessage + c_n.repeat(2) +
					lineText.substring(0, charWidth - 4) + c_n.repeat(charWidth - 2) + c_crlf
				//TODO: properly wrap text instead of trimming
			} else {
				// message can fit within line and padding
				formattedMessage = formattedMessage + c_n.repeat(2) +
					lineText + c_n.repeat(charWidth - lineText.length - 2) + c_crlf;
			}
		} else {
			// if blank line, still insert line
			formattedMessage = formattedMessage + c_n.repeat(charWidth) + c_crlf
		}
	}

	return formattedMessage + topPad;
}

function DrawInputText(charWidth, charHeight, inputString) {
	// from the bottom, go up one and output text there
	// 1 char border, 1 char space, start of first char
	let result = c_crlf.repeat(charHeight - 3) + c_n.repeat(2) + inputString;//prolly should trim to width - 4 (margin on each side)
	return result;
}

function Draw(charWidth, charHeight, message, input, showMore) {
	// define the array to draw the screen
	let screen = new Array(charHeight);
	for (var i = 0; i < screen.length; i++) {
		screen[i] = new Array(charWidth);
	}

	//convert each line of chars into char array
	const screen_layers = new Array(3);
	screen_layers[0] = ConvertStringTo2dArray(DrawBorder(charWidth, charHeight, showMore));
	screen_layers[1] = ConvertStringTo2dArray(DrawMessageText(charWidth, charHeight,
		message));
	screen_layers[2] = ConvertStringTo2dArray(DrawInputText(charWidth, charHeight,
		input));

	for (var x = 0; x < charHeight; x++) {
		//loop through all lines
		for (var y = 0; y < charWidth; y++) {
			//loop through all chars

			//find first one with not null char
			for (var layers = screen_layers.length - 1; layers >= 0; layers--) {
				//console.log('layers: ' + layers + ' x: ' + x + ' y: ' + y);
				// skip line if undefined, rely on bottom layer to pick up the slack
				if ((screen_layers[layers][x] !== undefined) && (screen_layers[layers][x][y] !== undefined) && (screen_layers[layers][x][y] !== c_n)) {
					screen[x][y] = screen_layers[layers][x][y];
					break;
				}
			}

			if (screen[x][y] === c_n || screen[x][y] === undefined) {
				//nothing found, default to blank
				screen[x][y] = ' ';
			}
		}
	}
	//console.log(screen);
	return screen;
}