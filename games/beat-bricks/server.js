"use strict";let scores=[{n:'keith',s:15000},{n:'ken',s:12500},{n:'hans',s:10000}];module.exports={io:(socket)=>{if(storage.size()<=0){console.log('initializing scores')
storage.set('scores',scores)}
socket.on("getScores",m=>{storage.get('scores',scores).then(s=>{socket.emit('hiScores',s)})});socket.on('submitScore',s=>{storage.get('scores',scores).then(hS=>{if(storage.size()>13000)
hS.pop();for(let i=0;i<hS.length;i++){if(hS[i].s<s.s){hS.splice(i,0,s);storage.set('scores',hS);socket.emit('place',[i,hS]);return}}
hS.push(s);storage.set('scores',hS);socket.emit('place',[hS.length-1,hS])})})}}