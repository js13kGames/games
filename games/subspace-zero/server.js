"use strict";const users=[];const zones=[];const combatSQRs=[]
function configUser(user,val){for(let i=0;i<users.length;i++){if(user!==users[i]){if(val==0){users[i].setUser(user.socket.id,val,0,0,0)}else if(val==1){users[i].setUser(user.socket.id,val,user.x,user.y,user.attRad);user.setUser(users[i].socket.id,val,users[i].x,users[i].y,user.attRad)}}}
  if(val==0){removeUser(user);console.log("removal of user: "+user.socket.id)}else if(val==1){users.push(user);console.log("addition of user: "+user.socket.id)}}
function removeUser(user){users.splice(users.indexOf(user),1)}
function updateUserLocation(user){var pos=user.returnLoc();for(let i=0;i<users.length;i++){if(user!==users[i]){console.log("sending updated coords to "+users[i].socket.id+" for "+user.socket.id+" : "+pos[0]+', '+pos[1]);users[i].updateUserLoc(user.socket.id,pos[0],pos[1])}}}
function updateConnectedCount(){for(let i=0;i<users.length;i++){users[i].updateCount()}}
function setRandomStart(user){var randX=Math.floor(getRandomArbitrary(1,16));var randY=Math.floor(getRandomArbitrary(1,16));console.log("spawn loc X:"+randX+', Y:'+randY);if(randX!=null&&randY!=null){user.updateLoc(randX,randY)}else{console.log("ERROR, RANDOM LOCATION GENERATED NULL")}}
function getRandomArbitrary(min,max){return Math.random()*(max-min)+min}
class User{constructor(socket){this.socket=socket;this.game=null;this.guess=GUESS_NO;this.x=0;this.y=0;this.attRad=5;this.combat=!1}
  setCombat(bo){this.combat=bo}
  setMove(move){if(move==1){this.y--;this.updateLoc(this.x,this.y);updateUserLocation(this)}else if(move==2){this.x--;this.updateLoc(this.x,this.y);updateUserLocation(this)}else if(move==3){this.x++;this.updateLoc(this.x,this.y);updateUserLocation(this)}else if(move==4){this.y++;this.updateLoc(this.x,this.y);updateUserLocation(this)}else{console.log("Unknown input: "+move)}
    return!0}
  returnLoc(){return[this.x,this.y]}
  updateCount(){this.socket.emit("updateCount",users.length)}
  setUser(id,val,x,y,rad){console.log("...sending... setUser "+id+" x::"+x+", y::"+y);this.socket.emit("setUser",id,val,x,y,rad)}
  updateLoc(x,y){this.x=x;this.y=y;this.socket.emit("updateLoc",this.socket.id,this.x,this.y)}
  updateUserLoc(id,x,y){this.socket.emit("updateUserLoc",id,x,y)}}

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

  io: (socket) => {

    const user = new User(socket);
    setRandomStart(user);

    configUser(user, 1); //add new

    updateConnectedCount();


    socket.on("disconnect",()=>{console.log("Disconnected: "+socket.id);configUser(user,0);updateConnectedCount()
      console.log("Currently connected: "+users.length+" users \n")})

    // socket.on("updateCount", () => {
    // 	console.log("User has connected, currently connected: " + users.length + " users");
    socket.on("move",(move)=>{console.log("Move Player: "+socket.id);for(var i=0;i<users.length;i++){if(users[i].socket.id==socket.id){users[i].setMove(move);return}}})

    console.log("Connected: " + socket.id);
    console.log("Currently connected: " + users.length + " users \n");
  },
  stat:(req,res)=>{storage.get('games',0).then(games=>{res.send(`<h1>Rounds played: ${games}</h1>`)})}

};