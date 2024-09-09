'use strict';

function GetRoomData(index) {
	let result;
	switch (index) {
		case 0:
			result = GetRoomData0();
			break;
	}
	if (result) {
		//add global commands
		result.commands = result.commands.concat(getGameCommands());
	}
	return result;
}

function GetRoomData0() {
	const room0Commands = [
		{
			id: 2, label: 'start-room-desc', verb: 'look', noun: 'room'
			, msg: 'You find your[self] in a [room]\r\n'
			+ 'with smooth walls. It appears to be\r\n'
			+ 'made of stainless steel. There is a\r\n'
			+ 'single [door]. [Bones] lie in a\r\n'
			+ 'pile in a corner. A radiator with a\r\n'
			+ 'chain running out from it connects\r\n'
			+ 'to a pair of [manacles].'
		}
		, {
			id: 3, label: 'start-room-self', verb: 'look', noun: 'self'
			, msg: 'Your shirt is torn, the long\r\n'
				+ 'sleeves are shredded. Your pants\r\n'
				+ 'are torn and the pant legs are\r\n'
				+ 'shredded as well. You notice you\r\n'
				+ 'are missing the pinky finger on\r\n'
				+ 'your left hand and you are not\r\n'
				+ 'wearing shoes. You can feel\r\n'
				+ 'something in your [pocket].'
		}
		, {
			id: 4, label: 'start-room-bones', verb: 'look', noun: 'bones'
			, msg: 'The bones have been picked cleaned.\r\n'
				+ 'It looks like they have been chewed\r\n'
				+ 'on by a pack of hungry dogs. You\r\n'
				+ 'would guess this used to be a\r\n'
				+ 'side of beef.'
		}
		, {
			id: 5,
			 label: 'start-room-pocket', verb: 'look', noun: 'pocket'
			, msg: 'You find a [pen], a [matchbook], and\r\n'
				+ 'a pack of chewing [gum].'
		}
		, {
			id: 6, label: 'start-room-pen', verb: 'look', noun: 'pen'
			, msg: 'A ballpoint pen. It clicks and the\r\n'
				+ 'point comes out. It clicks again and\r\n'
				+ 'it goes back in. It has a long metal\r\n'
				+ 'strip on the top half for clipping\r\n'
				+ 'it onto a pocket.'
		}
		, {
			id: 7, label: 'start-room-match', verb: 'look', noun: 'matchbook'
			, msg: 'A plain matchbook of 18 matches.'
		}
		, {
			id: 8, label: 'start-room-gum', verb: 'look', noun: 'gum'
			, msg: 'A 5 pack of Rigley\'s DoubleMint gum.'
		}
		, {
			id: 9, label: 'start-room-manacles', verb: 'look', noun: 'manacles'
			, msg: 'The manacles look like an antique.\r\n'
				+ 'While they look very sturdy, they\r\n'
				+ 'could probably be picked quite\r\n'
				+ 'easily if you had the right tool.'
		}
		, {
			id: 10, label: 'start-room-door', verb: 'look', noun: 'door'
			, checkVariable: 'rm0-unchained', checkValue: 1
			, msg: 'It\'s hard to get a good look at\r\n'
				+ 'the door while you\'re chained\r\n'
				+ 'to the radiator.'
			, msgSuccess: 'The door appears to be\r\n'
				+ 'opened by an electric [lock].\r\n'
				+ 'The electric lock seems to\r\n'
				+ 'have a [wire] loose.'
		}
		, {
			id: 11, label: 'start-room-l-error', verb: 'look', noun: 'error'
			, msg: 'You look all around, but\r\n'
				+ 'cannot seem to find one.\r\n'
		}
		, {
			id: 13, label: 'start-room-shim', verb: 'look', noun: 'shim'
			, checkVariable: 'rm0-shim', checkValue: 1
			, msg: 'You cannot find one.'
			, msgSuccess: 'It\'s a flat metal strip.'
		}
		, {
			id: 14, label: 'start-room-use', verb: 'use', noun: 'error'
			, msg: 'While that seemed like a great idea\r\n'
				+ 'in your head, you\'re not sure how\r\n'
				+ 'that would be useful right now.'
		}
		, {
			id: 15, label: 'start-room-u-pen', verb: 'use', noun: 'pen'
			, setVariable: 'rm0-shim', setValue: 1
			, msg: 'You break the clip off the front of\r\n'
				+ 'the pen and fashion a [shim] that\r\n'
				+ 'you believe will open the\r\n'
				+ '[manacles].'
		}
		, {
			id: 16, label: 'start-room-u-shim', verb: 'use', noun: 'shim'
			, checkVariable: 'rm0-shim', checkValue: 1
			, setVariable: 'rm0-unchained', setValue: 1
			, msg: 'You cannot find one.'
			, msgSuccess: 'You use the shim to unlock the\r\n'
				+ 'manacles. You\'re free to walk\r\n'
				+ 'around the room.'
		}
		, {
			id: 17, label: 'start-room-u-door', verb: 'use', noun: 'door'
			, checkVariable: 'rm0-wireConnected', checkValue: 1
			, msg: 'The door appears to be\r\n'
				+ 'opened by an electric [lock].\r\n'
				+ 'The electric lock seems to\r\n'
				+ 'have a [wire] loose.'
			, msgSuccess: 'The door opens, you appear to\r\n'
				+ 'be in a basement. You see stairs in\r\n'
				+ 'front of you. You take the stairs up\r\n'
				+ 'and find yourself in an abandoned\r\n'
				+ 'building. You make your way to the\r\n'
				+ 'door and freedom! You don\'t know\r\n'
				+ 'how or why you ended up chained up\r\n'
				+ 'in a place like this, but you\'re\r\n'
				+ 'happy to be free.\r\n\r\n'
				+ 'CONGRATS ON ESCAPING THE ROOM!!!'
			, next: 'game-end'
		}
		, {
			id: 18, label: 'start-room-u-lock', verb: 'look', noun: 'lock'
			, checkVariable: 'rm0-wireConnected', checkValue: 1
			, msg: 'The lock says it is currently\r\n'
			+ 'OFFLINE. There seems to be a\r\n'
			+ '[wire] loose underneath.'
			, msgSuccess: 'The lock says it is currently\r\n'
				+ 'ONLINE.'
		}
		, {
			id: 19, label: 'start-room-u-gum', verb: 'use', noun: 'gum'
			, msg: 'You pop a stick of chewing gum\r\n'
				+ 'into your mouth. It is both\r\n'
				+ 'minty and refreshing.'
		}
		, {
			id: 20, label: 'start-room-u-lock', verb: 'use', noun: 'lock'
			, checkVariable: 'rm0-wireConnected', checkValue: 1
			, msg: 'It is currently OFFLINE'
			, msgSuccess: 'The door unlocks.'
		}
		, {
			id: 21, label: 'start-room-look-wire', verb: 'look', noun: 'wire'
			, checkVariable: 'rm0-unchained', checkValue: 1
			, msg: 'You cannot do this now.'
			, msgSuccess: 'The wire should connect over to the\r\n'
				+ 'other side of the [lock], you should\r\n'
				+ 'be able to connect it if you tried.'

		}
		, {
			id: 22, label: 'start-room-use-wire', verb: 'use', noun: 'wire'
			, checkVariable: 'rm0-unchained', checkValue: 1
			, setVariable: 'rm0-wireConnected', setValue: 1
			, msg: 'You cannot do this now.'
			, msgSuccess: 'You connect the wire to the other\r\n'
				+ 'side and the electric [lock] says\r\n'
				+ 'ONLINE. You could probably use it\r\n'
				+ 'to unlock the [door] now.'

		}
	];
	const roomStory = [
		{
			id: 1, label: 'start-room-title', supressCmd: true
			, msg: 'Welcome...\r\n'
				+ 'If you dare to play this game\r\n'
				+ 'do not be afraid.\r\n'
				+ 'Whatever happens past this point\r\n'
				+ 'remember: it is only a game\r\n\r\n\r\n\r\n\r\n\r\n\r\n'
				+ '(press Enter to continue...)'
			, next: 'start-room-instructions'
		}
		, {
			id: 2, label: 'start-room-instructions', supressCmd: true
			, msg: 'To play, you can press Enter when\r\n'
				+ 'you see the MORE below.\r\n\r\n\r\n'
				+ 'Commands:\r\n'
				+ 'look <object>\r\n'
				+ 'use <object>\r\n'
				+ 'save game\r\n'
				+ 'load game\r\n'
				+ 'reset game\r\n'
				+ 'list commands'
			, next: 'start-room-intro'
		}
		, {
			id: 3, label: 'start-room-intro', supressCmd: true
			, msg: 'You wake up on a cold floor.\r\n'
				+ 'You sit up and realize your ankles\r\n'
				+ 'are manacled.  A chain runs from\r\n'
				+ 'them to a rusty radiator.'
			, next: 'start-room-desc'
		}
		, {
			id: 4, label: 'start-room-desc', supressCmd: false
			, msg: 'You find your[self] in a [room]\r\n'
				+ 'with smooth walls. It appears to be\r\n'
				+ 'made of stainless steel. There is a\r\n'
				+ 'single [door]. [Bones] lie in a\r\n'
				+ 'pile in a corner. A radiator with a\r\n'
				+ 'chain running out from it connects\r\n'
				+ 'to a pair of [manacles].'
		}
		, {
			id: 5, label: 'game-end', supressCmd: false
			, msg: 'THE END\r\n'
		}
	];
	const roomdata = {
		commands: room0Commands
		, messages: roomStory
	};
	return roomdata;
}

function getGameCommands() {
	const gameCommands = [
		{
			id: 1000, label: 'list-commands', verb: 'list', noun: 'commands'
			, msg: 'save game\r\n'
				+ 'load game\r\n'
				+ 'reset game\r\n'
				+ 'look <object>\r\n'
				+ 'use <object>'
		}
		, {
			id: 1001, label: 'save-game', verb: 'save', noun: 'game'
			, msg: 'Game saved'
		}
		, {
			id: 1002, label: 'load-game', verb: 'load', noun: 'game'
			, msg: 'Game loaded'
		}
		, {
			id: 1003, label: 'reset-game', verb: 'reset', noun: 'game'
			, msg: 'Game reset'
		}
	];
	return gameCommands;
}

/* Game Data */
// function getDefaultGameData() {
//     const gameData = {
//         playerName: 'Player1'
//         , currentRoomIndex: 0
//         , lockedRooms: [0]
//         , inventory: [
//             { name: 'pen', value: 1 }
//             , { name: 'matchbook', value: 18 }
//             , { name: 'gum', value: 5 }
//         ]
//     };
//     return gameData;
// }

// function getDefaultRoomData(index) {
//     switch (index) {
//         case 0:
//             return getDefaultRoom0Data();
//             break;
//     }
// }

// function getDefaultRoom0Data() {
//     const roomData = {
//         unchained: 0
//         , shimMade: 0
//         , padlockOpen: 0
//         , roomComplete: 0
//     };
// }