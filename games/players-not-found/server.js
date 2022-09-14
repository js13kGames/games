"use strict";

const players = [];
const newMapTime = 1000*60*5;
let gMap;
let mapTimeout;

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

	io: (socket) => {
		let user = createPlayer(socket.id);
		
		socket.emit('player', user);
		players.push(user);
		if(players.length==1) createMap();

		socket.on("disconnect", () => {
			console.log("Disconnected: " + socket.id);
			removeUser(user);
		});

		socket.on("color",()=>{
			user.cs = getColor();
			user.c = "rgb("+user.cs.join(",")+")";
			socket.emit('player', user);
		});

		socket.on("hat",(h)=>{
			user.hat =h;
		})

		socket.on("name", (n,h) => {
			console.log("name",socket.id);
			console.log("	user",user);
			console.log("	players.indexOf(user)",players.indexOf(user));
			user.n = strip(n); // name
			if(h) user.hat = h;
			if(user.id!= socket.id) user.id = socket.id;
			if(players.indexOf(user)==-1) {
				console.log("	push player");
				players.push(user);
				io.emit('players',players);
			}
			
			socket.emit('map', gMap);
			io.emit("msg",'<div>'+displayName(user.n,user.c)+' joined the game</div>');
		});

		socket.on("hiding", (p) => {
			console.log("hiding",p.id,user.id,socket.id);
			if(p.id==user.id) {
				user.x = p.x;
				user.y = p.y;
				user.alive = true;
				io.emit('players',players);
				io.emit("msg",'<div>'+displayName(user.n,user.c)+' is hidden!</div>');
			}
		});

		socket.on("chasing", (chased,p1,p2) => {
			p1 = players.find(el => el.id==chased.id);
			if(p1 && p1.alive) {
				p1.alive = false;
				p1.fail++;
				socket.emit("chasing",p1);
				p2 = players.find(el => el.id==user.id);
				if(p2) p2.score++;
				io.to(chased.id).emit('chased',p2);
				io.emit('players',players);
				io.emit("msg",'<div>'+displayName(p2.n,p2.c)+' caught '+displayName(p1.n,p1.c)+'!</div>');
			}
		});

		socket.on("msg", (msg) => {
			io.emit('msg','<div>'+displayName(msg.n,msg.c)+' : '+strip(msg.m)+'</div>');
		});
	},

};

let displayName = (n,c) => {
	return '<span style="color:'+strip(c||"black")+'">'+strip(n||"unknown")+'</span>';
}

let removeUser = (user) => {
	user = players.indexOf(user);
	if(user!=-1) players.splice(user,1);

	if(players.length==0 && mapTimeout) clearTo();
}

let clearTo = ()=>{
	if(mapTimeout) {
		clearTimeout(mapTimeout)
		mapTimeout = null;
	}
}


let createMap = () => {
	if(mapTimeout) clearTo();
	const NbEl = 60;
	
	const ZoomMin = 2;
	const ZoomMax = 2;
	gMap = [];

	for (let i = 0,zoom,el,s;i<NbEl;i++) {
		zoom = Math.max(ZoomMin,ZoomMax*Math.random());
		s = rand(spriteColors.length);
		el = {w:SpriteW*zoom,h:SpriteH*zoom,s:s+spriteStartID,c:"#"+spriteColors[s]};
		el.x = el.w/2+rand(MapW-el.w);
		el.y = el.h+rand(MapH-el.h);
		el.invert = rand(2)&1;

		gMap.push(el);
	}

	gMap.sort((e1,e2)=>e1.y-e2.y);

	mapTimeout = setTimeout(nextMapDisclaimer,newMapTime-10000);
}

let nextMapDisclaimer = ()=>{
	io.emit('newMap10');
	mapTimeout = setTimeout(newMap,10000);
}

let newMap = ()=>{
	createMap();
	io.emit('map', gMap,1);
}

function createPlayer (id,p,cs) {
	cs= getColor();
    p = {w:SpriteW,h:SpriteH,s:0,c:"rgb("+cs.join(",")+")",id:id,cs:cs,alive:false,score:0,fail:0,hat:0};
	p.x = MapW/2;
	p.y = MapH/2+SpriteH/2;
	return p;
}

function getColor(colors) {
	colors = [0,255,55+rand(150)];
	do {
		colors.sort(()=>.5 - Math.random());
	} while (colors[1] ==255);
	return colors;
}

let strip = (t)=>t.replace(/<\/?[^>]+(>|$)/g, "")||"?";