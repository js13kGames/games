let Cell=function(args) {
let coords=[];
let neighbors={};
let type='water';
let gradient=Perlin.generateGradient();
let elevation=0;
let visited=false;
if(args) {
coords=args.coords;
Object.assign(neighbors,args.neighbors);
type=args.type||'water';
}
let offsetDirectionFunction=function(offset) {
return function(direction) {
let index=Cell.DIRECTIONS.findIndex((e)=>e===direction);
if(index!==-1) {
return Cell.DIRECTIONS[(index+offset)%6];
} else {
throw new Error(`reverseDirection: '${direction}' is not a valid direction.`)
}
};
}
let reverseDirection=offsetDirectionFunction(3);
let nextDirection=offsetDirectionFunction(1);
let previousDirection=offsetDirectionFunction(5);
let distance=function(cell) {
let s=this.pxlc();
let d=cell.pxlc();
let dx=s[0]-d[0];
let dy=s[1]-d[1];
return Math.sqrt(
dx*dx+dy*dy
);
};
let distanceCells=function(cell) {
return Math.max(
Math.abs(cell.coords[0]-this.coords[0]),
Math.abs(cell.coords[1]-this.coords[1]),
Math.abs(cell.coords[2]-this.coords[2])
);
};
let onCircle=function(radius) {
let circleCells=[];
let cell=this;
if(radius===0) {
return [cell];
}
for(let i=0; i < radius; i++) {
cell=cell.neighbors.southwest;
}
for(let direction of Cell.DIRECTIONS) {
for(let i=0; i < radius; i++) {
circleCells.push(cell);
cell=cell.neighbors[direction];
}
}
return circleCells;
};
let onDisk=function(radius) {
let cell=this;
let diskCells=[];
for(let i=0; i<=radius; i++) {
this.onCircle(i).forEach((c)=>diskCells.push(c));
}
return diskCells;
};
let neighborCoords=function(direction) {
if(direction==='east') {
return [coords[0]+1,coords[1]-1,coords[2]];
} else if(direction==='northeast') {
return [coords[0]+1,coords[1],coords[2]-1];
} else if(direction==='northwest') {
return [coords[0],coords[1]+1,coords[2]-1];
} else if(direction==='west') {
return [coords[0]-1,coords[1]+1,coords[2]];
} else if(direction==='southwest') {
return [coords[0]-1,coords[1],coords[2]+1];
} else if(direction==='southeast') {
return [coords[0],coords[1]-1,coords[2]+1];
}
};
let cnghb=function() {
for(let direction of Cell.DIRECTIONS) {
if(neighbors[direction]===undefined) {
neighbors[direction]=Cell({
coords: neighborCoords(direction)
});
}
}
for(let direction of Cell.DIRECTIONS) {
let reverse=reverseDirection(direction);
neighbors[direction].neighbors[reverse]=this;
let next=nextDirection(direction);
neighbors[direction].neighbors[previousDirection(reverse)]=neighbors[next];
let previous=previousDirection(direction);
neighbors[direction].neighbors[nextDirection(reverse)]=neighbors[previous];
}
};
let pxlc=function() {
let x=this.coords[0]+this.coords[2]/2;
let y=Math.sqrt(3)*this.coords[2]/2;
return [x,y];
};
let reveal=function(meshSize) {
this.elevation=Perlin.calculate(this,meshSize);
}
return {
coords,
neighbors,
type,
gradient,
elevation,
visited,
reverseDirection,
nextDirection,
previousDirection,
distance,
distanceCells,
onCircle,
onDisk,
cnghb,
pxlc,
reveal
};
};
Cell.DIRECTIONS=['east','northeast','northwest','west','southwest','southeast'];
