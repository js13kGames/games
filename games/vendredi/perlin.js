let Perlin={};
Perlin.g=[
[0.70,-0.70,0],
[0.70,0,-0.70],
[0,0.70,-0.70],
[-0.70,0.70,0],
[-0.70,0,0.70],
[0,-0.70,0.70],
];
Perlin.eg=[
[0.81,-0.40,-0.40],
[0.40,0.40,-0.81],
[-0.40,0.81,-0.40],
[-0.81,0.40,0.40],
[-0.40,-0.40,0.81],
[0.40,-0.81,0.40],
];
Perlin.g=Perlin.g.concat(Perlin.eg);
Perlin.generateGradient=function() {
let index=Math.floor(Perlin.g.length*Math.random());
return Perlin.g[index];
}
Perlin.calculate=function(cell,meshSize) {
let onMesh=function(cell) {
let [x,y,z]=cell.coords;
if((Math.abs(x)%meshSize===0)&&(Math.abs(y)%meshSize===0)&&(Math.abs(z)%meshSize===0)) {
return true;
} else {
return false;
}
}
let diff=function(point1,point2) {
return point2.map((x,i)=>x-point1[i]);
}
let norm=function(vec) {
return Math.sqrt(vec.reduce((sum,x)=>sum+x*x,0));
}
let normalize=function(vec) {
let n=norm(vec);
return (n > 0)?vec.map((x)=>x/n):vec;
}
let dotproduct=function(vec1,vec2) {
return vec1.map((x,i)=>x*vec2[i]).reduce((sum,x)=>sum+x,0);
}
let corners=[];
for(let c of cell.onDisk(meshSize)) {
if(onMesh(c)) {
corners.push(c);
}
if(corners.length>=3) {
break;
}
};
let delta=corners.map((corner)=>normalize(diff(corner.coords,cell.coords)));
let elevations=corners.map((corner,i)=>dotproduct(corner.gradient,delta[i]));
elevations=elevations.map((elevation)=>6*Math.pow(elevation,5)-15*Math.pow(elevation,4)+10*Math.pow(elevation,3));
let w=corners.map((corner)=>meshSize-cell.distanceCells(corner));
return elevations.reduce((sum,x,i)=>sum+x*w[i],0)/meshSize;
}
