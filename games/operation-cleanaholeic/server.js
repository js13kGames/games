"use strict";

const MESSAGE_NEW_NAME = "a";
const MESSAGE_ENTRY = "b";
const MESSAGE_REQUEST_BOARD = "c";
const MESSAGE_BOARD_DATA = "d";

const STORAGE_KEY = "l";
const LEADERBOARD_MAX_ENTRIES = 10;
const LEVEL_INDEX_MAX = 9;

let leaderboards = null;
let players = 0;

function log(a, b)
{
	// this is useful to recover the leaderboard if the storage
	// gets corrupted or anything unexpected happens
	console.log(Date.now() + ":" + a + ":" + JSON.stringify(b));
}

function cleanupScores(array)
{
	let n, a, b, r, i;
	
	array.sort((a, b) => b[5] - a[5]);
	
	r = [];
	for (i=0; i<=LEVEL_INDEX_MAX; i++)
	{
		n = 0;
		for (a of array)
		{
			if (a[0] == i)
			{
				n++;
				r.push(a);
				if (n >= LEADERBOARD_MAX_ENTRIES)
				{
					break;
				}
			}
		}
	}
	
	return r;
}

async function submitEntry(socket_id, entry)
{
	let a;
	
	// format:
	// 0: u: level_index
	// 1: u: points
	// 2: u: corrections
	// 3: u: force_used
	// 4: u: time
	// 5: u: score
	// 6: u: name
	// 7: socket_id
	// 8: timestamp
	
	entry[7] = socket_id;
	entry[8] = (Date.now() / 1000) | 0;
	
	a = (await storage.get(STORAGE_KEY)) || [];
	a.push(entry);
	a = cleanupScores(a);
	await storage.set(STORAGE_KEY, a);
	
	log("a", a);
	log("b", entry);
}

async function setName(socket_id, name)
{
	let a = (await storage.get(STORAGE_KEY)) || [];
	
	log("c",[ socket_id, name ]);
	
	for (let b of a)
	{
		if (b[7] == socket_id)
		{
			b[6] = name;
		}
	}
	
	await storage.set(STORAGE_KEY, a);
}

async function sendBoard(socket)
{
	socket.emit(MESSAGE_BOARD_DATA, await storage.get(STORAGE_KEY));
}

module.exports = {
	io: (socket) => {
		socket.on("disconnect", () => {
			players--;
			log("e", players);
		});
		socket.on(MESSAGE_ENTRY, (entry) => submitEntry(socket.id, entry));
		socket.on(MESSAGE_NEW_NAME, (name) => setName(socket.id, name));
		socket.on(MESSAGE_REQUEST_BOARD, () => sendBoard(socket));
		
		players++;
		log("d", players);
	},
};
