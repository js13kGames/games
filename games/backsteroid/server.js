let interval = null;
const users = [];
const nbMaxHigh = 99;
const heroku = typeof process !== "undefined";
let client;

/*if(heroku) {
	console.log("heroku !");
	const { Client } = require('pg');

	client = new Client({
	  connectionString: process.env.DATABASE_URL,
	  ssl: true,
	});
}*/

function test() {
	checkHighscores([{newHighscore:true,name:generateID().slice(0,5),highscore:Math.floor(Math.random()*100000)}]);
}


// for(var i=0;i<100;i++) {
	// test();
// }
console.log("storage.size()",storage.size());
console.log("heroku",heroku);

module.exports = {

	io: (socket) => {
		users.push(socket.id);

		socket.on("start", (data) => {
			console.log(users.length);
			if(users.length==1) {
				console.log("first user");
				startGame(socket);
			}
			var s = createShip(socket.id,data.name,data.highscoreID);
			// placeShip(s);
			ships.push(s);
			socket.emit("ready",socket.id);
		});
		socket.on("disconnect", () => {
			users.splice(users.indexOf(socket.id), 1);
			ships.splice(ships.indexOf(getShip(socket.id)),1);
			if(users.length==0) {
				console.log("no user");
				endGame(socket);
			}
		});

		socket.on("revive",()=>{
			console.log("revive",socket.id)
			let ship = getShip(socket.id);
			if(ship) {
				ship.score = ship.newHighscore = 0;
				placeShip(ship);
			}
		});

		socket.on("ship",(data)=>{
			let ship = getShip(socket.id);
			ship.left = data.left;
			ship.right = data.right;
			ship.fire = data.fire;
			ship.teleport = data.teleport;
		});

		// socket.on("leaderBoard",()=>{
		// 	getLeaderBoard().then((res)=>{
		// 		socket.emit("leaderBoard",res);
		// 	})
			
		// });

		console.log("Connected: " + socket.id);
		socket.emit("id",socket.id);
	},

	leaderBoard: (req, res) => {
		getLeaderBoard().then((leadB)=>{
			res.setHeader('Content-Type', 'application/json');
    		res.end(JSON.stringify(leadB));
		});
	}

};

function startGame(socket) {
	if(interval) return;
	asts = [];
	bulls = [];
	ships = [];
	interval = setInterval(function(){
		checkHighscores(logicLoop());
		io.volatile.emit("loop",{asts:asts,esth:esth,ships:ships,bulls:bulls});
	},frameRate);

	console.log("setInterval : "+interval);
}

function endGame() {
	if(interval===null) return;
	console.log("clearInterval : "+interval);
	clearInterval(interval);
	interval = null;
}

function checkHighscores(deadShips) {
	deadShips.forEach((el)=>{
		if (el.newHighscore) {
			console.log("new highscore");
			try{
				getSavedHigh(el.highscoreID).then((high)=>{
					if(el.highscore>high) saveHigh(el);
				})
				
			}catch(e){console.log("highscore error",e);}
		}
	});
}

async function getSavedHigh(id) {
	console.log("	getSavedHigh",id);
	let saved=null;
	if(id) {
		/*if(heroku) {
			// postgres
			await client.connect()
			const res = await client.query('SELECT score FROM highscoretab WHERE highscoreID = $1', [id]);
			saved = res.rows.length? res.rows.score : null;
			await client.end()
		} else {*/
			// sqlite
			saved = await storage.get(id,null);
			if(saved) saved = saved.score;
		// }
	}
	console.log("		"+JSON.stringify(saved));
	return saved;
}

async function saveHigh(ship) {
	console.log("	save highscore");
	if(ship.highscoreID) await removeHigh(ship.highscoreID);

	let newID;
	do {
		newID = generateID();
	} while(await getSavedHigh(newID) !== null)

	console.log ("		newID",newID);

	/*if(heroku) {
		// postgres
		await client.connect()
		await client.query('INSERT INTO highscoretab(highscoreID,name,score) VALUES($1,$2,$3)', [newID,ship.name,ship.highscore]);
		await client.end();
	} else {*/
		// sqlite
		console.log ("			sqlite save");
		try{
			saved = await storage.set(newID,{"name":ship.name,"score":ship.highscore});
		} catch(e) {console.log("set error",e)};
		ship.highscoreID = newID;
		console.log ("			end sqlite save");
	// }
	io.to(ship.id).emit("highscoreID",newID);
	

	checkNbHigh();

	storage.length().then((res)=>console.log);
}

async function removeHigh(id) {
	console.log("remove id",id);
	try{
		/*if(heroku) {
			// postgres
			await client.connect();
			await client.query('DELETE FROM highscoretab WHERE highscoreID = $1', [id]);
			await client.end();
		} else {*/
			// sqlite
				await storage.remove(id);
		// }
	} catch(e) {console.log("remove error",e)};
}

function generateID() {
	let gid="";
	for(var i=0;i<8;i++) gid += String.fromCharCode(65+rand(0,26));
		return gid;
}

async function checkNbHigh() {
	console.log("		checkNbHigh");
	/*if(heroku) {
		// postgres
		await client.connect();
		let length = await client.query('SELECT COUNT(*) FROM highscoretab');
		length = length.row[0].count;
		while (length>nbMaxHigh) {
			await client.query('DELETE FROM highscoretab WHERE score = (SELECT MIN(score) FROM highscoretab )');
			length = await client.query('SELECT COUNT(*) FROM highscoretab');
			length = length.row[0].count;
		}
		await client.end();
	} else {*/
		// sqlite
		storage.length().then(async (length)=>{
			console.log("			storage length",length, "length>nbMaxHigh",length>nbMaxHigh)
			while(length>nbMaxHigh) {
				let minKey, minValue,score;
				for(var i=0;i<length;i++) {
					score = await storage.get(await storage.key(i));
					
					if(minValue == undefined || minValue>score.score) {
						minValue = score.score;
						minKey = await storage.key(i);
					}
				}
				// console.log("minValue",minValue,"minKey",minKey);
				await removeHigh(minKey);
				length = await storage.length();
			}
		})
	// }
}


async function getLeaderBoard() {
	let res;
/*	if(heroku) {
		// postgres
		await client.connect();
		res = await client.query('SELECT * FROM highscoretab');
		await client.end();
	} else {
		// sqlite*/
		res=[];
		let el,key,length = await storage.length();
		for(var i=0;i<length;i++) {
			key = await storage.key(i);
			el = await storage.get(key);
			el.highscoreID = key;
			res.push(el);
		}
		
	// }
	return res.sort((s1,s2)=>{
			return s2.score - s1.score;
		});
}
