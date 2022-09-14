import ObjectC from"./ObjectC.js";export default class Dots extends ObjectC{dots=[];dotsNumber;points=0;constructor(){super();this.makeDotsArray();}
makeDotsArray(){this.dots=[];for(var X=20;X<=500;X+=20){this.dots.push([X,20,0]);this.dots.push([X,180,0]);this.dots.push([X,340,0]);this.dots.push([X,500,0]);}
for(var Y=20;Y<=500;Y+=20){if(!(Y===20||Y===180||Y===340||Y===500)){this.dots.push([20,Y,0]);this.dots.push([180,Y,0]);this.dots.push([340,Y,0]);this.dots.push([500,Y,0]);}}
this.dotsNumber=this.dots.length;}
drawDots(pacX,pacY){if(this.dotsNumber===0){this.dotsNumber=this.dots.length;for(let i=0;i<this.dots.length;i++){this.dots[i][2]=0;}}
for(let i=0;i<this.dots.length;i++){if(this.dots[i][0]===pacX&&this.dots[i][1]===pacY&&this.dots[i][2]===0){this.dots[i][2]=1;this.dotsNumber--;this.points++;}}
for(const dot of this.dots){if(dot[2]===0){var ctx=Dots.myGameArea;ctx.fillStyle="white";ctx.beginPath();ctx.arc(dot[0],dot[1],2,0,2*Math.PI);ctx.fill();}}}}