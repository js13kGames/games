"use strict";var inLobby=[],inGame=[],matches=[];function findOpponent(user){for(var i=0;i<inLobby.length;i++){if(user!==inLobby[i]&&inLobby[i].opponent===null){new Match(user,inLobby[i]).loadGame()}}}
function leaveLobby(user){if(inLobby.indexOf(user)>-1)
inLobby.splice(inLobby.indexOf(user),1)}
function leaveMatch(user){if(inGame.indexOf(user)>-1)
inGame.splice(inGame.indexOf(user),1)}
function Match(user1,user2){this.user1=user1;this.user2=user2;this.dO=deckOrder();this.game=new Game({server:!0,players:[user1,user2],dO:[this.dO,this.dO]});matches.push(this)}
Match.prototype={loadGame:function(){this.user1.loadGame(this,this.user2,[0,this.dO]);this.user2.loadGame(this,this.user1,[1,this.dO])},begin:function(){if(this.user1.ready&&this.user2.ready){let time=Date.now()+5000;this.user1.socket.emit('begin',time);this.user2.socket.emit('begin',time);this.game.start(time-100)}},matchOver:function(){this.user1.match=null;this.user2.match=null;this.game.MainLoop.stop();this.game=null;matches.splice(matches.indexOf(this))
console.log(matches.length)}}
function User(socket){this.socket=socket;this.match=null;this.opponent=null;this.ready=!1}
User.prototype={loadGame:function(match,opponent,pI){this.match=match;leaveLobby(this);inGame.push(this);this.opponent=opponent;this.socket.emit("loadGame",JSON.stringify(pI))},begin:function(){this.ready=!0;this.match.begin()},end:function(){if(this.match)
this.match.matchOver();this.opponent=null;this.socket.emit("gameOver");leaveMatch(this)}}
module.exports=function(socket){var user=new User(socket);socket.on("disconnect",function(){console.log("Disconnected: "+socket.id);if(user.match)leaveMatch();else leaveLobby(user);if(user.opponent)
user.opponent.end()});socket.on('battle',function(){inLobby.push(user);findOpponent(user)})
socket.on('ready',function(data){user.begin()})
socket.on('card',function(data){data=JSON.parse(data);let pId=data[5],pI=data[0],nC=Math.floor(Math.random()*4);data[0]=null;user.match.game.playCard(data[1],data,pI,nC);data.push(nC);socket.emit('confirmCard',JSON.stringify(data))})
socket.on('matchEnded',function(data){user.end()})
console.log("Connected: "+socket.id)}