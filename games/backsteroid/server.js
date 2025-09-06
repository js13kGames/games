let interval = null
const users = []
const nbMaxHigh = 99

module.exports = {
	io: socket => {
		users.push(socket.id);

		socket.on("start", (data) => {
			if(users.length==1) {
				startGame(socket);
			}
			var s = createShip(socket.id,data.name,data.highscoreID)
			ships.push(s)
			socket.emit("ready",socket.id)
		});
		socket.on("disconnect", () => {
			users.splice(users.indexOf(socket.id), 1);
			ships.splice(ships.indexOf(getShip(socket.id)),1);
			if(users.length==0) {
				endGame(socket);
			}
		});

		socket.on("revive",()=>{
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

		socket.emit("id",socket.id);
	},

	leaderBoard: (req, res) => {
		getLeaderBoard().then((leadB)=>{
			res.setHeader('Content-Type', 'application/json');
    		res.end(JSON.stringify(leadB));
		})
	}
}

function startGame(socket) {
	if(interval) return;
	asts = [];
	bulls = [];
	ships = [];
	interval = setInterval(function(){
		checkHighscores(logicLoop());
		io.volatile.emit("loop",{asts:asts,esth:esth,ships:ships,bulls:bulls});
	},frameRate)
}

function endGame() {
	if(!interval) return
	clearInterval(interval)
	interval = null
}

function checkHighscores(deadShips) {
	deadShips.forEach((el)=>{
		if (el.newHighscore) {
      getSavedHigh(el.highscoreID).then((high)=>{
        if(el.highscore>high) saveHigh(el);
      })
		}
	});
}

async function getSavedHigh(id) {
	if (id) {
    let saved = await storage.get(id)
    if (saved) return saved.score
	}
}

async function saveHigh(ship) {
	if (ship.highscoreID) await removeHigh(ship.highscoreID)

	let newID
	do {
		newID = generateID();
	} while (await getSavedHigh(newID) !== null)

  await storage.set(newID,{"name":ship.name,"score":ship.highscore});
  ship.highscoreID = newID;

	io.to(ship.id).emit("highscoreID",newID);

	checkNbHigh()
}

async function removeHigh(id) {
  await storage.remove(id)
}

function generateID() {
	let gid="";
	for(var i=0;i<8;i++) gid += String.fromCharCode(65+rand(0,26));
		return gid;
}

async function checkNbHigh() {
  let length = await storage.length()
  while (length > nbMaxHigh) {
    let minKey, minValue,score;
    for(var i=0;i<length;i++) {
      score = await storage.get(await storage.key(i));

      if(minValue == undefined || minValue > score.score) {
        minValue = score.score;
        minKey = await storage.key(i);
      }
    }
    await removeHigh(minKey);
    length = await storage.length()
  }
}


async function getLeaderBoard() {
	let res = []
  let el,key,length = await storage.length()
  for(var i=0;i<length;i++) {
    key = await storage.key(i);
    el = await storage.get(key);
    el.highscoreID = key;
    res.push(el);
  }
  return res.sort((s1, s2) => s2.score - s1.score)
}
