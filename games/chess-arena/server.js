"use strict";

// will store users 
// { i:id, n:name, cl:color, c:cell, p:piece, $:monetization }
const users = [];
let W = [];
let WIN = 0;

module.exports = {

	io: (sck) => {
		const user = {i:sck.id,$:0}
		users.push(user);

		sck.emit("board",{B:B,W:W});

		sck.on("disconnect", () => {
			console.log("Disonnected: " + sck.id);
			if(user.c){
				B[user.c] = 0;
			} else if (user.p){
				rW(user.p);
			}
			rU(user);
			io.emit("board",{B:B,W:W});
			io.emit("users",users);
			
		});

		sck.on("name", (n,i) => {
			for(i=0;i<users.length;i++) {
				if(users[i].n == n) {
					n = n+"_";
					i = 0;
				}
			}


			sU(sck,"n",n);
			io.emit("msg",n+" is now connected.");
			sck.emit("name",n);

			sU(sck,"cl",gC());
			sck.emit("choose",user.cl);

			io.emit("users",users);
		});

		sck.on("piece",(p,ps)=>{
			ps = getFreeP(user.cl);

			if(ps[p] || WIN) {
				if(WIN){
					io.emit("new");
					newB();
					WIN = 0;
					users.forEach((u)=>{
						u.c = undefined;
						u.p = undefined;
					})
					W=[];
					io.emit("board",{B:B,W:W});
				}
				sU(sck,"p",p|user.cl);
				W.push(user.p);
				io.emit("users",users);
			}
		});

		sck.on("promote",(p)=>{
			
			if(p&ALL && !(p&PAWN)){
				sU(sck,"p",p|user.cl|NO_MOVE_OR_PROMOTED);
				B[user.c] = user.p;
				user.nextM = Date.now()+(TIMES[user.p&ALL]-user.$)*1000;
				io.emit("board",{B:B,W:W});
				io.emit("users",users);
			}
		});

		sck.on("move",(m,c,cc,oc,t)=>{
			if (user.nextM>Date.now())return;

			c = user.c
			if(c) {
				cc = getM(c);
				if(cc.includes(m)){
					if(user.p&PAWN) user.p &= ~NO_MOVE_OR_PROMOTED;
					oc = setM(c, m)? m: null; 
				} else return;
			} else {
				c = startB[m];
				if(c==user.p && (B[m]===0 || B[m]&WHITE ^ user.p&WHITE)) {
					oc = m;
					rW(user.p);
					if(user.p&PAWN) user.p |= NO_MOVE_OR_PROMOTED;
					B[m] = user.p;
				} else return;
			}

			if(oc) {
				if((oc==25&&user.p&WHITE) || (oc==95&&!(user.p&WHITE))){
					t = (oc==25?"WHITE":"BLACK")+" WINS!";
					io.emit("msg",t);
					io.emit("win",t);
					WIN = 1;
				}

				// opponent on cell
				oc = gUbyKV("c",oc);
				if(oc) {
					io.emit("msg",oc.n+" has been killed by "+user.n);
					oc.c = null;
					console.log("kill "+oc.n);
					oc.p = null;
					io.to(oc.i).emit("choose",oc.cl);
				}
			}

			user.c = m;
			t = Date.now();
			user.nextM = t+(TIMES[user.p&ALL]-user.$)*1000;

			if(user.p&PAWN && 
				( (user.p&WHITE&&user.c<30) ||
					(!(user.p&WHITE)&& user.c>90) )
			 ) {
				sck.emit("promote");
			}
			io.emit("users",users);
			io.emit("board",{B:B,W:W,T:t});
		});

		console.log("Connected: " + sck.id);

		sck.on("monetization",()=>{
			sU(sck,"$",0.5);
			console.log("monetization",sck.id);
		});
	}

};

//get user
let gU = (id,i,u)=>{
	id = id.id? id.id:id;
	for(i=0;i<users.length;i++) {
		u = users[i];
		if(u && u.i == id) return u;
	}
	return {};
}

//get user by key/value
let gUbyKV= (k,v,i,u)=>{
	for(i=0;i<users.length;i++) {
		u = users[i];
		if(u && u[k] === v) return u;
	}
}

// remove user
let rU =(id)=> users.splice(users.indexOf(gU(id)), 1);
let rW =(p)=> W.splice(W.indexOf(gU(p)), 1);

// set the value of given key of user of given id (lot of of, nah?)
let sU = (u,k,v)=>{
	u = gU(u);
	u[k] = v;
}

// get the color of a new user
let gC = (b,w,i,u)=>{
	b = w = 0;
	for(i=0;i<users.length;i++) {
		u = users[i];
		if(u.cl!== undefined) {
			if(u.cl==WHITE) w++;
			else b++;
		}
	}


	return (w>b)? 0 : WHITE;
}