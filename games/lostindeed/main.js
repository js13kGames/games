var C = document.getElementById('C');
var ctx = C.getContext("2d");
var container = document.getElementById('container');
window.addEventListener('keydown',readKey,false);
window.addEventListener('resize',resizeContainer,false);
var POSarray = [];
var doorArrayVer = [];
var doorArrayHor = [];
var interval;
var corn;
var messages = ['DNA is Overated',
                'Will you Accept your Fate?',
                'Saying Oh Shiet! might help.',
                'how long will it be for you?',
                'Will you Find the Way?',
                'Where Did You Make the Wrong Turn?',
                'How Did you Even Get Here?'];
areas[0].load(100,250,-1,0);

function deathAnimation(){
    eraseCanvas(0.6);
    for(i = 0; i < POSarray.length; ++i)
        drawPOS(POSarray[i]);  
    drawExplotion(explotion.X,explotion.Y,explotion.r,explotion.r2);
    explotion.r += 5;
    if(explotion.r > 40) explotion.r = 0;
    explotion.r2 += 5;
    if(explotion.r2 > 40) explotion.r2 = 0 ;
}
function animation() {
 eraseCanvas(1.0);
 drawWalls();
 for(i = 0; i < doorArrayVer.length; ++i)
    drawDoor(doorArrayVer[i]);
 for(i = 0; i < doorArrayHor.length; ++i)
    drawDoor(doorArrayHor[i]); 
 drawChampion();
  for(i = 0; i < POSarray.length; ++i)
    drawPOS(POSarray[i]);
  drawCorn();
  if(collisionChampPOS()) pauseGame();
  if(collisionChampCorn()) resetCorn(), addPOS();
  champion.move();
  for(i = 0; i < POSarray.length; ++i)
    POSarray[i].move();
    
}

window.onload = function() {
    interval = setInterval(animation,100);
}

// primitive functions for game
var areas = [];
resizeContainer();
function resizeContainer() {
  if(window.innerHeight > 600 ){
    var pad =  (window.innerHeight - 600) /2;  
    container.style.padding = "" + pad + "px 0 ";
  }
}
// key controls
function readKey(e) {
  if(e.key == 'ArrowRight')
    champion.Xdir = -1, champion.Ydir = 0;
  if(e.key == 'ArrowLeft')
     champion.Xdir = 1, champion.Ydir = 0;
  if(e.key == 'ArrowUp')
     champion.Ydir = 1, champion.Xdir = 0;
  if(e.key == 'ArrowDown')
     champion.Ydir = -1, champion.Xdir = 0;
  if(e.key == ' ')
      if(game.paused == true) unPauseGame();
}
function pauseGame(){
    clearInterval(interval);
    //eraseCanvas(1.0);
    explotion.X = champion.X;
    explotion.Y = champion.Y;
    interval = setInterval(deathAnimation,100);
    setTimeout(function(){clearInterval(interval);
                          eraseCanvas(1.0);
                          var msg = messages[Math.floor(Math.random() * messages.length)];
                          ctx.font = "30px Courier";
                          ctx.fillStyle = "chocolate";
                          ctx.textAlign = "center";
                          ctx.fillText(msg,C.width/2,C.height/2);
                          ctx.font = "20px Courier";
                          ctx.fillText("<SPACE> to continue",C.width/2,40 + C.height/2);
                          game.paused = true;
                },2000);
}
function unPauseGame() {
    game.paused = false;
    areas[0].load(100,250,-1,0);
    interval = setInterval(animation,100);
}

areas[0] = {
    numberPOS: 1,
    load : function(x,y,xdir,ydir){
        game.currentArea = 0;
           POSarray = [];
            doorArrayVer = [];
            doorArrayHor = [];
            for(k = 0;k < areas[0].numberPOS; ++k)
                POSarray.push(new POS(Math.random() * 850,
                                      Math.random() * 450,
                                      5 + Math.random() * 10,
                                      10 + Math.random() * 10,
                                      Math.random() * 3,
                                      -3 + Math.random() * 6 ));
            corn = new cornGrain(100,100);
            doorArrayVer.push(new doorEntry(900,200,900,300,areas[1].load,100,250,-1,0));
            champion.X = x;
            champion.Y = y;
            champion.Xdir = xdir;
            champion.Ydir = ydir;
    }
}
areas[1] = {
    numberPOS: 1,
    load : function(x,y,xdir,ydir){
        game.currentArea = 1;
            POSarray = [];
            doorArrayVer = [];
            doorArrayHor = [];
            for(k = 0;k < areas[1].numberPOS; ++k)
                POSarray.push(new POS(Math.random() * 850,
                                      Math.random() * 450,
                                      5 + Math.random() * 10,
                                      10 + Math.random() * 10,
                                      Math.random() * 3,
                                      -3 + Math.random() * 6 ));
            corn = new cornGrain(100,100);
            doorArrayVer.push(new doorEntry(0,200,0,300,areas[0].load,800,250,1,0));
            doorArrayHor.push(new doorEntry(400,0,500,0,areas[2].load,450,450,0,1));
            champion.X = x;
            champion.Y = y;
            champion.Xdir = xdir;
            champion.Ydir = ydir;
    }
}
areas[2] = {
    numberPOS: 1,
    load : function(x,y,xdir,ydir){
        game.currentArea = 2;
            POSarray = [];
            doorArrayVer = [];
            doorArrayHor = [];
            for(k = 0;k < areas[2].numberPOS; ++k)
                POSarray.push(new POS(Math.random() * 850,
                                      Math.random() * 450,
                                      5 + Math.random() * 10,
                                      10 + Math.random() * 10,
                                      Math.random() * 3,
                                      -3 + Math.random() * 6 ));
            corn = new cornGrain(100,100);
            doorArrayHor.push(new doorEntry(400,500,500,500,areas[1].load,450,50,0,-1));
            champion.X = x;
            champion.Y = y;
            champion.Xdir = xdir;
            champion.Ydir = ydir;
    }
}

// drawing functions
function drawChampion() {
  drawCircle(champion.X, champion.Y, 5, "#aaf");
  ctx.strokeStyle="#aaf";
  if(champion.Xdir != 0)
    drawEllipse(champion.X - 4 * champion.Xdir,champion.Y, 25, 10),drawTailHor(champion.X, champion.Y, champion.s, champion.tail);
   else
    drawEllipse(champion.X,champion.Y - 4 * champion.Ydir, 13, 22),drawTailVer(champion.X, champion.Y, champion.s, champion.tail);
}
function drawTailHor(x, y, s, t) {
  ctx.strokeStyle = "#aaf";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);  

  ctx.bezierCurveTo(
    x + t * 0.45 * champion.Xdir + 20 * Math.cos(s * (Math.PI / 180)),
    y + -25 * Math.sin(s * (Math.PI / 180)),
    x + t * 0.70 * champion.Xdir + 10 * Math.cos(s * (Math.PI / 180)),
    y + 20 * Math.sin(s * (Math.PI / 180)),
    x + t * 1.0 * champion.Xdir + 10 * Math.cos(s * (Math.PI / 180)),
    y + 1.0 * Math.sin(s * (Math.PI / 180))
  );
  champion.speed +=  10 * Math.cos(s * (Math.PI / 180));
  ctx.stroke();
}
function drawTailVer(x, y, s, t) {
  ctx.strokeStyle = "#aaf";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);//initial point

  ctx.bezierCurveTo(
    x + -25 * Math.sin(s * (Math.PI / 180)),   
    y + t * 0.45 * champion.Ydir + 20 * Math.cos(s * (Math.PI / 180)),
    x + 20 * Math.sin(s * (Math.PI / 180)),
    y + t * 0.70 * champion.Ydir + 10 * Math.cos(s * (Math.PI / 180)),
    x - 1 * Math.sin(s * (Math.PI / 180)),
    y + t * 1.0 * champion.Ydir + 10 * Math.cos(s * (Math.PI / 180))
  );
    champion.speed +=  10 * Math.cos(s * (Math.PI / 180));
  ctx.stroke();
}
function drawDoor(door){
    drawLine(door.X1,door.Y1,door.X2,door.Y2,'#1b0000',10);
}
function collisionChampPOS(){
    var colided = false;
    var d = 0;
    for(i = 0; i < POSarray.length; ++i){
        d = Math.sqrt( (POSarray[i].X - champion.X) * (POSarray[i].X - champion.X) + (POSarray[i].Y - champion.Y) * (POSarray[i].Y - champion.Y) );
        if(d < POSarray[i].size * 2.0) colided = true;
    }
    if(colided == true)
    console.log('shiet colided');
    return colided;
}
function collisionChampCorn(){
    var colided = false;
    var d = 0;
     d = Math.sqrt( (corn.X - champion.X) * (corn.X - champion.X) + (corn.Y - champion.Y) * (corn.Y - champion.Y) );
    if(d < 40) colided = true,game.cornScore +=1,console.log('corn score: ' + game.cornScore);
    return colided;
}
function collisionChampDoorVer(){
    for(i = 0; i < doorArrayVer.length; ++i){
        if(champion.Y > doorArrayVer[i].Y1 && champion.Y < doorArrayVer[i].Y2 )
           if(champion.X > ((doorArrayVer[i].X1)-35) && champion.X < ((doorArrayVer[i].X1)+35)) doorArrayVer[i].toArea(doorArrayVer[i].CX,doorArrayVer[i].CY,doorArrayVer[i].Xdir,doorArrayVer[i].Ydir);
    }
    
}
function collisionChampDoorHor(){
   for(i = 0; i < doorArrayHor.length; ++i){
        if(champion.X > doorArrayHor[i].X1 && champion.X < doorArrayHor[i].X2 )
           if(champion.Y > ((doorArrayHor[i].Y1)-40) && champion.Y < ((doorArrayHor[i].Y1)+40)) doorArrayHor[i].toArea(doorArrayHor[i].CX,doorArrayHor[i].CY,doorArrayHor[i].Xdir,doorArrayHor[i].Ydir);
    }
}
function resetCorn(){
    corn.X = Math.random() * 800;
    corn.Y = Math.random() * 400;
}
function addPOS(){
    POSarray.push(new POS(Math.random() * 850,
                          Math.random() * 450,
                          5 + Math.random() * 10,
                          10 + Math.random() * 10,
                          Math.random() * 3,
                          -3 + Math.random() * 6 ));
    areas[game.currentArea].numberPOS +=1;
}
function drawPOS(pos) {
  drawCircle(pos.X,pos.Y,pos.size,'#440');  
  ctx.beginPath();
  ctx.arc(pos.X,pos.Y - pos.size,pos.size,0,2*Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pos.X-10,pos.Y + pos.size,pos.size,0,2*Math.PI);
  ctx.fill();
}
function drawCorn(){
    if(corn.active)
        drawCircle(corn.X,corn.Y,10,'yellow');
}
function drawWalls(){
    drawRect(0,0,900,500,10);
}
function drawExplotion(x,y,r,r2){
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(x,y,r,0,2*Math.PI);
  ctx.stroke();
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(x,y,r2,0,2*Math.PI);
  ctx.stroke();
}
function drawCircle(x,y,r,color) {
  ctx.fillStyle = color;//1a0d00 
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x,y,r,0,2*Math.PI);
  ctx.fill();
}
function drawLine(x1,y1,x2,y2,color,width){
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
function drawRect(x1,y1,x2,y2,w){
      ctx.beginPath();
      ctx.rect(x1, y1, x2, y2);
      ctx.lineWidth = w;
      ctx.strokeStyle = 'chocolate';
      ctx.stroke();
}
function drawEllipse(centerX, centerY, width, height) {
	
  ctx.beginPath();
  
  ctx.moveTo(centerX, centerY - height/2); // A1
  
  ctx.bezierCurveTo(
    centerX + width/2, centerY - height/2, // C1
    centerX + width/2, centerY + height/2, // C2
    centerX, centerY + height/2); // A2

  ctx.bezierCurveTo(
    centerX - width/2, centerY + height/2, // C3
    centerX - width/2, centerY - height/2, // C4
    centerX, centerY - height/2); // A1
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#aaf";
  ctx.stroke();
  ctx.closePath();	
}   
function eraseCanvas(opacity) {
  ctx.beginPath();
  ctx.rect(0, 0, 900, 500);
  ctx.fillStyle = "rgba(26, 0, 0, " + opacity + ")";
  ctx.fill();
  //ctx.stroke();
}

// classes ans objects
var game = {
    paused : false,
    cornScore: 0,
    currentArea : 0
}
var explotion = {
    X : 0,
    Y : 0,
    r : 0,
    r2 : 30
}
var champion = {
  X : 150,
  Y : 250,
  r : 3,
  s : 0,
  tail : 80,
  speed : 20,
  Xdir : -1,
  Ydir : 0,
  move : function(){
      champion.s += 60;
      if(champion.s == 360) champion.s = 0;
      if(champion.X + champion.speed * champion.Xdir * -1 < 890 && champion.X + champion.speed * champion.Xdir * -1 > 10)
        champion.X -= champion.speed * champion.Xdir;
      else collisionChampDoorVer();
      if(champion.Y + champion.speed * champion.Ydir * -1 < 480 && champion.Y + champion.speed * champion.Ydir * -1 > 20)
        champion.Y -= champion.speed * champion.Ydir;
      else collisionChampDoorHor();
  }
}

var POS = function (x,y,size,speed,xs,ys) {
  this.X = x;
  this.Y = y;
  this.size = size;
  this.speed = speed;
  this.Xs = xs;
  this.Ys = ys;
  this.move = function(){
    this.X += this.Xs * this.speed;
    this.Y += this.Ys * this.speed;
    if(this.X > 850 || this.X < 0)
      this.Xs = this.Xs * -1;
     if(this.Y > 450 || this.Y < 0)
      this.Ys = this.Ys * -1;
  }
}
var cornGrain = function(x,y){
    this.active = true;
    this.X =      x;
    this.Y =      y;
}
var doorEntry = function(x1,y1,x2,y2,a,cx,cy,xdir,ydir){
    this.X1 = x1;
    this.Y1 = y1;
    this.X2 = x2;
    this.Y2  = y2;
    this.toArea = a;
    this.CX = cx;
    this.CY = cy;
    this.Xdir = xdir;
    this.Ydir = ydir;
}
