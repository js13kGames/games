let Atlas=function(args) {
let size=1;
let meshSize=2;
let islandThreshold=0.8;
let continentRadius=100;
let center=Cell({
coords: [0,0,0]
});
let cursor=center;
let path=[];
if(args) {
size=args.size||size;
meshSize=args.meshSize||meshSize;
islandThreshold=args.islandThreshold||islandThreshold;
continentRadius=args.continentRadius||continentRadius;
}
let reveal=function() {
this.onDisk(this.size).forEach((cell)=>{
cell.reveal(this.meshSize);
let distance=cell.distanceCells(new Cell({
coords: [0,0,0]
}));
let sigma=(Math.exp(1-this.islandThreshold)-1)/this.continentRadius;
let threshold=Math.log(sigma*distance+1)+this.islandThreshold;
if(cell.elevation > threshold) {
cell.type='island';
}
if(distance===this.continentRadius) {
cell.type='continent';
}
});
};
let generateAtlas=function() {
for(let i=0; i < this.size+this.meshSize; i++) {
this.onCircle(i).forEach((cell)=>cell.cnghb());
}
reveal.call(this)
};
let onCircle=function(radius) {
return this.center.onCircle(radius);
};
let onDisk=function(radius) {
return this.center.onDisk(radius);
};
let onMesh=function() {
let meshCells=[];
this.onDisk(this.size).forEach((cell)=>{
let [x,y,z]=cell.coords;
if((Math.abs(x)%this.meshSize===0)&&(Math.abs(y)%this.meshSize===0)&&(Math.abs(z)%this.meshSize===0)) {
meshCells.push(cell);
}
});
return meshCells;
};
let onIsland=function(cell) {
let island=[{
cell,
visited: false
}];
let index=0;
do {
island[index].visited=true;
for(let direction of Cell.DIRECTIONS) {
let neighbor=island[index].cell.neighbors[direction];
if(neighbor.type==='island') {
let notStored=undefined===island.find(({cell})=>{
let cc=cell.coords;
let nc=neighbor.coords;
if(cc[0] === nc[0]&&cc[1] === nc[1]&&cc[2] === nc[2]) {
return true;
} else {
return false;
}
});
if(notStored) {
island.push({
cell: neighbor,
visited: false
});
}
}
}
index=island.findIndex(({visited})=>!visited);
} while(index!==-1);
return island.map(({cell})=>cell);
};
let findCell=function([tx,ty,tz]) {
let cell=this.center;
let [sx,sy,sz]=cell.coords;
while((tx-sx!==0)||(ty-sy!==0)||(tz-sz!==0)) {
let dx=tx-sx;
let dy=ty-sy;
let dz=tz-sz;
if(dx > 0&&dy < 0) {
cell=cell.neighbors['east'];
} else if(dx > 0&&dz < 0) {
cell=cell.neighbors['northeast'];
} else if(dy > 0&&dz < 0) {
cell=cell.neighbors['northwest'];
} else if(dx < 0&&dy > 0) {
cell=cell.neighbors['west'];
} else if(dx < 0&&dz > 0) {
cell=cell.neighbors['southwest'];
} else if(dy < 0&&dz > 0) {
cell=cell.neighbors['southeast'];
}
[sx,sy,sz]=cell.coords;
}
return cell;
};
let findCursorCell=function([x,y]) {
let X=x-y*Math.sqrt(3)/3;
let Z=2*y/Math.sqrt(3);
let Y=- X-Z;
let RX=Math.round(X);
let RY=Math.round(Y);
let RZ=Math.round(Z);
let DX=Math.abs(X-RX);
let DY=Math.abs(Y-RY);
let DZ=Math.abs(Z-RZ);
if(DX > DY&&DX > DZ) {
RX=- RY-RZ;
} else if(DY > DZ) {
RY=- RX-RZ;
} else {
RZ=- RX-RY;
}
RX += this.center.coords[0];
RY += this.center.coords[1];
RZ += this.center.coords[2];
return findCell.call(this,[RX,RY,RZ]);
};
let findPath=function(coords) {
let frontier=[{
cell: this.center,
priority: 0
}];
let cameFrom={
[this.center.coords.join(':')]: null
};
let path=[];
while(frontier.length!==0) {
let current=frontier.shift().cell;
if(current.distance(Cell({coords}))===0) {
let cell=current;
while(cell!==null) {
path.push(cell);
cell=cameFrom[cell.coords.join(':')];
}
path.reverse();
return path;
}
for(let direction of Cell.DIRECTIONS) {
let next=current.neighbors[direction];
if(next&&Array.isArray(next.coords)&&cameFrom[next.coords.join(':')]===undefined) {
let priority=next.distance(Cell({coords}));
frontier.push({
cell: next,
priority
});
cameFrom[next.coords.join(':')]=current;
}
}
frontier.sort((a,b)=>a.priority-b.priority);
}
return [];
};
let move=function(direction) {
this.onCircle(this.size+this.meshSize).forEach((cell)=>{
let index=Cell.DIRECTIONS.indexOf(direction);
let dir1=Cell.DIRECTIONS[(index+2)%6];
let dir2=Cell.DIRECTIONS[(index+4)%6];
if(cell.neighbors[dir1]!==undefined&&cell.neighbors[dir2]!==undefined) {
cell.cnghb();
}
});
this.center=this.center.neighbors[direction];
reveal.call(this);
};
return {
size,
meshSize,
islandThreshold,
continentRadius,
center,
cursor,
path,
generateAtlas,
onCircle,
onDisk,
onMesh,
onIsland,
findCell,
findCursorCell,
findPath,
move
};
}
