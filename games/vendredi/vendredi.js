window.addEventListener('load',function load(event) {
let levels=[
{
fish: 5,
maxFish: 5,
fishingProbability: 0.5,
meat: 0,
maxMeat: 5,
meatingProbability: 0.9,
atlas: {
size: 16,
meshSize: 4,
islandThreshold: 0.8,
continentRadius: 8
}
}
];
let score={};
let levelID=parseInt(window.localStorage.getItem('levelBest'))||0;
let gameon=true;
let moving=false;
let movePerSecond=10;
let atlas=undefined;
let canvas=document.getElementById('canvas');
let generateLevel=function() {
let current=levels[levels.length-1];
levels.push({
fish: current.fish,
maxFish: current.maxFish,
fishingProbability: current.fishingProbability*0.95,
meat: current.meat,
maxMeat: current.maxMeat,
meatingProbability: current.meatingProbability*0.95,
atlas: {
size: current.atlas.size,
meshSize: current.atlas.meshSize,
islandThreshold: current.atlas.islandThreshold,
continentRadius: current.atlas.continentRadius+8
}
});
};
for(let i=0; i < levelID; i++) {
generateLevel();
}
let loadLevel=function(level) {
score={
days: 0,
food: {
fish: {
number: level.fish,
ate: 0
},
meat: {
number: level.meat,
ate: 0
}
},
islands: 0,
move: 0
};
atlas=Atlas(level.atlas);
atlas.generateAtlas();
canvas.atlas=atlas;
document.getElementById('level-id').textContent=`${levelID+1}`;
document.getElementById('level').style.display='block';
document.getElementById('level').className='visible';
setTimeout(()=>{
document.getElementById('level').className='hidden';
},1000);
};
let reset=function() {
document.getElementById('final-score').style.display='none';
for(let element of document.getElementsByClassName('dead')) {
element.style.display='none';
}
for(let element of document.getElementsByClassName('alive')) {
element.style.display='none';
}
document.getElementById('next').style.display='none';
document.getElementById('previous').style.display='none';
document.getElementById('scores').style.display='none';
moving=false;
gameon=true;
};
let renderScore=function() {
gameon=false;
document.getElementById('final-days').textContent=score.days;
document.getElementById('final-islands').textContent=score.islands;
document.getElementById('final-fish').textContent=score.food.fish.ate;
document.getElementById('final-meat').textContent=score.food.meat.ate;
document.getElementById('final-score').style.display='block';
let table=document.getElementById('scores');
let tbody=table.getElementsByTagName('tbody')[0];
let scores=JSON.parse(window.localStorage.getItem('scores'))||{};
if(scores[levelID]) {
let threebest=scores[levelID].sort((a,b) =>{
let ddays=a.days-b.days
if(ddays!==0) {
return ddays;
}
let dislands=a.islands-b.islands
if(dislands!==0) {
return dislands;
}
let dfood=a.fish+a.meat-b.fish-b.meat;
if(dfood!==0) {
return dfood;
}
}).slice(0,3);
while(tbody.firstChild) {
tbody.removeChild(tbody.firstChild);
}
for(let score of threebest) {
let tr=document.createElement('tr');
let tdDays=document.createElement('td');
tdDays.textContent=score.days;
tr.appendChild(tdDays);
let tdIslands=document.createElement('td');
tdIslands.textContent=score.islands;
tr.appendChild(tdIslands);
let tdFish=document.createElement('td');
tdFish.textContent=score.food.fish.ate;
tr.appendChild(tdFish);
let tdMeat=document.createElement('td');
tdMeat.textContent=score.food.meat.ate;
tr.appendChild(tdMeat);
tbody.appendChild(tr);
}
table.style.display='block';
}
};
let die=function() {
for(let element of document.getElementsByClassName('dead')) {
element.style.display='inline-block';
};
if(levelID > 0) {
document.getElementById('previous').style.display='inline-block';
document.getElementById('previous-level').textContent=`${levelID}`;
}
renderScore();
};
let saved=function() {
for(let element of document.getElementsByClassName('alive')) {
element.style.display='inline-block';
};
document.getElementById('next').style.display='inline-block';
document.getElementById('next-level').textContent=`${levelID+2}`;
if(levelID > 0) {
document.getElementById('previous').style.display='inline-block';
document.getElementById('previous-level').textContent=`${levelID}`;
}
let scores=JSON.parse(window.localStorage.getItem('scores'))||{};
if(!Array.isArray(scores[levelID])) {
scores[levelID]=[];
}
scores[levelID].push(score);
window.localStorage.setItem('scores',JSON.stringify(scores));
renderScore();
}
let updatePath=function(mousex,mousey) {
let x=(mousex-canvas.center.x)/canvas.unit;
let y=(mousey-canvas.center.y)/canvas.unit;
atlas.cursor=atlas.findCursorCell([x,y]);
atlas.path=atlas.findPath(atlas.cursor.coords);
};
let fishing=function(cell) {
let fished=Math.random() < levels[levelID].fishingProbability;
if(fished&&score.food.fish.number < levels[levelID].maxFish) {
score.food.fish.number++;
canvas.foundFish(cell);
}
};
let exploring=function(cell) {
let island=atlas.onIsland(cell);
if(!cell.visited) {
score.islands++;
island.forEach((cell)=>{
cell.visited=true;
});
}
let meats=0;
for(let i=0; i < levels[levelID].maxMeat; i++) {
let meated=Math.random() < levels[levelID].meatingProbability;
if(meated&&score.food.meat.number+meats < levels[levelID].maxMeat) {
meats++;
}
}
score.food.meat.number += meats;
canvas.foundMeat(cell,meats);
};
let move=function(first,second) {
let dx=second.coords[0]-first.coords[0];
let dy=second.coords[1]-first.coords[1];
let dz=second.coords[2]-first.coords[2];
if(dx > 0&&dy < 0&&dz===0) {
atlas.move('east');
} else if(dx > 0&&dy===0&&dz < 0) {
atlas.move('northeast');
} else if(dx===0&&dy > 0&&dz < 0) {
atlas.move('northwest');
} else if(dx < 0&&dy > 0&&dz===0) {
atlas.move('west');
} else if(dx < 0&&dy===0&&dz > 0) {
atlas.move('southwest');
} else if(dx===0&&dy < 0&&dz > 0) {
atlas.move('southeast');
}
};
let update=function() {
// Update days
score.days++;
// Update food
if(score.food.meat.number > 0) {
score.food.meat.number--;
score.food.meat.ate++;
} else {
score.food.fish.number--;
score.food.fish.ate++;
}
};
let gameLoop=function(start,path) {
let first=path[0];
let second=path[1];
if(atlas.path.length>=2) {
move(first,second);
update();
}
if(second.type==='island') {
exploring(second);
} else if(second.type==='water') {
fishing(second);
}
if(second.type==='continent') {
saved();
return;
} else if(score.food.fish.number===0&&score.food.meat.number===0) {
die();
return;
}
let time=performance.now();
if(gameon&&path.length > 2) {
setTimeout(gameLoop,start+1000/movePerSecond-time,start+1000/movePerSecond,path.slice(1));
} else {
moving=false;
}
};
let render=function(time) {
canvas.draw();
// Update food
score.food.fish.number=Math.min(score.food.fish.number,levels[levelID].maxFish);
score.food.meat.number=Math.min(score.food.meat.number,levels[levelID].maxMeat);
document.getElementById('fish').textContent=score.food.fish.number;
document.getElementById('meat').textContent=score.food.meat.number;
if(score.food.fish.number>=levels[levelID].maxFish) {
document.getElementById('max-fish').style.display='inline-block';
} else {
document.getElementById('max-fish').style.display='none';
}
if(score.food.meat.number>=levels[levelID].maxMeat) {
document.getElementById('max-meat').style.display='inline-block';
} else {
document.getElementById('max-meat').style.display='none';
}
if(gameon) {
window.requestAnimationFrame(render);
}
};
window.addEventListener('resize',(event)=>{
canvas.draw();
});
window.addEventListener('mousemove',(event)=>{
if(!moving) {
updatePath(event.clientX,event.clientY);
}
});
window.addEventListener('click',(event)=>{
if(gameon&&!moving) {
moving=true;
gameLoop(performance.now(),atlas.path);
}
});
document.getElementById('replay').addEventListener('click',(event)=>{
event.stopPropagation();
loadLevel(levels[levelID]);
reset();
window.requestAnimationFrame(render);
});
document.getElementById('next').addEventListener('click',(event)=>{
event.stopPropagation();
if(levelID===levels.length-1) {
generateLevel();
}
levelID++;
window.localStorage.setItem('levelBest',Math.max(levelID,parseInt(window.localStorage.getItem('levelBest')||0)));
loadLevel(levels[levelID]);
reset();
window.requestAnimationFrame(render);
});
document.getElementById('previous').addEventListener('click',(event)=>{
event.stopPropagation();
if(levelID > 0) {
levelID--;
}
loadLevel(levels[levelID]);
reset();
window.requestAnimationFrame(render);
});
reset();
loadLevel(levels[levelID]);
window.requestAnimationFrame(render);
});
