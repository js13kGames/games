"use strict";

// Game server

const DIM_ROWS = 6;
const DIM_COLS = 6;

class Game {
	constructor(p1,p2,id){
		this.id = id;
		this.players = [p1,p2];
		this.serializedBoard = "";
		this.numbers = [];
		this.board = this.createMatrix();
		this.finalNumber = Math.floor(Math.random() * 9) + 1;
		this.timer = null;
	}

	createMatrix() {
		this.serializedBoard = "";
		let m = [];
		for (let i = 0; i < DIM_ROWS; i++) {
			for (let j = 0; j < DIM_COLS; j++) {
				const value = Math.floor(Math.random() * 9) + 1;
				this.serializedBoard += `${value},`
				m[i * DIM_COLS + j] = { i, j, v: value };
			}
		}
		this.serializedBoard.slice(this.serializedBoard.length - 1 ,1);
		return m;
	}

	getNumber(event,pId,path){
		const number = Math.floor(Math.random() * 20) + 10;
		this.numbers.push(number);
		const numberId = this.numbers.length-1;
		this.players.forEach((p)=> p.socket.emit(event,{i: numberId,n:number},pId,path));
		if(event == 'next') clearTimeout(this.timer);
		this.timer = setTimeout(()=>this.getNumber('timeout',numberId),30000);
	}

	checkPath(path,pId){
		let player = this.players[pId];
		let sum = 0;
		const mustSum = this.numbers[this.numbers.length-1];
		for(let i=1;i<path.length;i++){
			const tile = this.board[(path[i].x * DIM_COLS) + path[i].y];
      sum += tile.v;
		}
		if(sum == mustSum){
			this.getNumber('next',pId,path);
		}
	}

	checkFinish(path,pId){
		let player = this.players[pId];
		let sum = this.finalNumber;
		const mustSum = this.numbers[this.numbers.length-1];
		for(let i=1;i<path.length;i++){
			const tile = this.board[(path[i].x * DIM_COLS) + path[i].y];
      sum += tile.v;
		}
		if(sum == mustSum){
			this.players.forEach((p)=> p.socket.emit('finish',pId,path));
			return true;
		}
		else return false;
	}

}

class GameServer {
	constructor(){
		this.games = [];
		this.users = [];
	}

	addUser(socket) {
		let findedRival = this.users.find((u) => !u.rival);
		const newUser = {id:socket.id, socket:socket , rival: findedRival ? findedRival : null, game: null, numPlayer: findedRival ? 2 : 1};
		if(findedRival) {
			findedRival.rival = newUser;
			const board = this.createGame(findedRival,newUser);
			const sendBoard = {sB:board.sB, fN:board.fN, nR:DIM_ROWS, nC:DIM_COLS};
			findedRival.socket.emit('play',{board: sendBoard, player: 1});
			socket.emit('play',{board: sendBoard, player: 2});
		}
		else socket.emit('wait');
		this.users.push(newUser);
	}

	createUser(socket){
		const code = this.randomCode();
		const newUser = {id:socket.id, socket:socket , rival: null, game: null, numPlayer: 1, codeGame: code};
		this.users.push(newUser);
		socket.emit('code',code)
	}

	joinUser(socket,code){
		let findedRival = this.users.find((u) => u.codeGame == code);
		if(findedRival) {
			const newUser = {id:socket.id, socket:socket , rival: findedRival, game: null, numPlayer: 2};
			findedRival.rival = newUser;
			const board = this.createGame(findedRival,newUser);
			const sendBoard = {sB:board.sB, fN:board.fN, nR:DIM_ROWS, nC:DIM_COLS};
			this.users.push(newUser);
			findedRival.socket.emit('play',{board: sendBoard, player: 1});
			socket.emit('play',{board: sendBoard, player: 2});
		}
		else {
			socket.emit('wrongCode',code);
		} 
	}

	remUser(socket) {
		const index = this.users.findIndex((u) => u.id == socket.id);

		if(index > -1){
			let currentRival = this.users[index].rival;
			if(currentRival){
				currentRival.rival = null;
				currentRival.socket.disconnect();
				if(currentRival.game) this.deleteGame(currentRival.game.id);
				const index = this.users.findIndex((u) => u.id == currentRival.socket.id);
				this.users.splice(index, 1);
			}
			this.users.splice(index, 1);
		}
	}

	createGame(p1,p2) {
		const newGame = new Game(p1,p2,this.games.length);
		this.games.push(newGame);
		p1.game = newGame;
		p2.game = newGame;
		return {sB: newGame.serializedBoard, fN: newGame.finalNumber};
	}

	remUserCode(socket,code){
		let index = this.users.findIndex((u) => u.id == socket.id);
		this.users.splice(index, 1);
	}

	deleteGame(id){
		const index = this.games.findIndex((g) => g.id == id);
		if(index > -1){
			clearTimeout(this.games[index].timer);
			delete this.games[index];
			this.games[index] = null;
			this.games.splice(index, 1);
		}
	}

	userReady(socket) {
		let user = this.users.find((u) => u.id == socket.id);
		user.ready = true;
		if(user.rival && user.rival.ready) {
			user.game.getNumber('start');
		}
	}

	checkPath(socket,p) {
		let user = this.users.find((u) => u.id == socket.id);
		user.game.checkPath(p,user.numPlayer);
	}

	checkFinish(socket,p) {
		let user = this.users.find((u) => u.id == socket.id);
		if (user.game.checkFinish(p,user.numPlayer)){
			this.remUser(socket);
			this.remUser(user.rival.socket);
		}
	}

	randomCode(){
		let code = ""
		for(let i = 0;i<4;i++){
			const rand = Math.floor(Math.random() * 36);
			const charcode = 48 + (rand<=9 ? rand : rand + 39)
			code += String.fromCharCode(charcode);
		}
		return code;
	}

	getServerInfo(socket){
		socket.emit('info',{p:this.users.length,g:this.games.length});
	}
}

const gs = new GameServer();

module.exports = {
	io: function (socket) {

		gs.getServerInfo(socket);
		
		socket.on("play", (type,data) => {
			switch(type){
				case 'rand': gs.addUser(socket);
				break;
				case 'create': gs.createUser(socket);
				break;
				case 'join': gs.joinUser(socket,data);
				break;
			}
			
		});

		socket.on("removeGame", () => {
			gs.remUserCode(socket);
		});

		socket.on("disconnect", () => {
			gs.remUser(socket);
		});

		socket.on("ready", () => {
			gs.userReady(socket);
		});

		socket.on("path", (p) => {
			gs.checkPath(socket,p);
		});

		socket.on("finish", (p) => {
			gs.checkFinish(socket,p);
		});
	}
}