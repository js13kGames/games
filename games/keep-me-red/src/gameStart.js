var status = document.getElementById("status");
document.onkeypress = function(event) {
  var key = event.keyCode;
var canvasArea = document.getElementById('play');
  var intro = document.getElementById('intro');
  if(key==13)
  {
    if(canvasArea.style.display=='none')
    {
      canvasArea.style.display = 'block';
      intro.style.display = 'none';
    }
  }
  startGame();
}
function startGame() {
  offlineSymbol = new component(30,30,5,0,2*Math.PI,"red");
  score = new obstacle("30px","Consolas","white",280,40,"text");
  myPlayArena.start();
}
var myPlayArena = {

  canvas : document.createElement("canvas"),
  start : function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.getElementById('play').appendChild(this.canvas);
    this.interval = setInterval(updatePlayArena,20);
    this.frameNo = 0;
    window.addEventListener('keydown',function (evt) {
      myPlayArena.key = evt.keyCode;
      if(evt.keyCode==37 || evt.keyCode==38 || evt.keyCode==39 || evt.keyCode== 40)
      {
      evt.preventDefault();
    }
    })
    window.addEventListener('keyup',function (evt) {
      myPlayArena.key = false;
    })
  },
  clear : function () {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}
function everyInterval(n)
{
    if((myPlayArena.frameNo/n)%1==0)
    {
      return true;
    }
    return false;
}
var playObstacles = [];
function obstacle(width,height,color,x,y,type,what)
{
    this.text = what;
    this.type = type;
    this.width = width;
    this.height = height;
    this.changeX = 0;
    this.changeY = 0;
    this.x = x;
    this.y = y;
    this.update = function(color) {
        ctx = myPlayArena.context;
        if(this.type=="text")
        {
          ctx.font = this.width + " " + this.height;
          ctx.fillStyle = color;
          //console.log(this.text);
          ctx.fillText(this.text,this.x,this.y);
        }
        else {
          ctx.fillStyle = color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    }
    this.changePos = function() {
        this.x += this.changeX;
        this.y += this.changeY;
    }
}
var offlineSymbol;
var alphabets = [];
function component(x,y,r,sAngle,eAngle,color)
{
  this.x = x;
  this.y = y;
  this.r = r;
  this.sAngle = sAngle;
  this.eAngle = eAngle;
  this.changeX = 0;
  this.changeY = 0;
  this.update = function (color) {
    ctx = myPlayArena.context;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,this.sAngle,this.eAngle);
    ctx.fillStyle = color;
    ctx.fill();
  }
  this.changePos = function () {
    this.x += this.changeX;
    this.y +=this.changeY;
  }
  this.crashWith = function (obstacleObject) {
    var playObjectLeft = this.x;
    var playObjectRight = this.x + (2 * this.r - 5);
    //console.log(playObjectRight);
    var playObjectTop = this.y;
    var playObjectBottom = this.y + (2 * this.r - 5);
    var obstacleObjectLeft = obstacleObject.x;
    //console.log(obstacleObjectLeft);
    var obstacleObjectRight = obstacleObject.x + (obstacleObject.width);
    var obstacleObjectTop = obstacleObject.y;
    var obstacleObjectBottom = obstacleObject.y + (obstacleObject.height);
    var isCrash = true;
    if((playObjectBottom<obstacleObjectTop) || (playObjectTop>obstacleObjectBottom) || (playObjectRight<obstacleObjectLeft) || (playObjectLeft>obstacleObjectRight))
    {
      isCrash = false;
    }
    return isCrash;
  }
}
var winCharacters = ['O','F','L','I','N','E'];
var isCharacters = [];
var captured = [0,0,0,0,0,0];
function updatePlayArena() {
  var j,c=0;
  for(i=0;i<playObstacles.length;i++)
  {
    if(offlineSymbol.crashWith(playObstacles[i]))
    {
      offlineSymbol.update("green");
      for (i = 0; i < playObstacles.length; i++) {
        playObstacles[i].update("red");
      }
      myPlayArena.stop();
      return;
    }
    else {
      if(i%2==0)
      {
        j = i - c;
      }
      else {
        j = i - (c+1);
        c++;
      }
      if(isCharacters[j] && (offlineSymbol.x-alphabets[j].x)==2)
      {
        var index = winCharacters.indexOf(alphabets[j].text);
        console.log(index);
        if(captured[index]==0)
        {
          captured[index] = 1;
        }
        updateStatus();
        console.log(captured);
        var clear = new obstacle("30px","Consolas","white",alphabets[j].x,alphabets[j].y,"text",alphabets[j].text);
        clear.update("#212121");
      }
    }
  }
  var newX,newY,height,minHeight,maxHeight,gap,minGap,maxGap;
    myPlayArena.clear();
    myPlayArena.frameNo+=1;
    var randomNumber = Math.floor(Math.random() * (5-3+1) + 3);
    if(myPlayArena.frameNo==1 || everyInterval(100))
    {
      newX = myPlayArena.canvas.width;
      minHeight = 15;
      maxHeight = 150;
      minGap = 18;
      maxGap = 23;
      height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      isCharacters.push(false);
      alphabets.push(new obstacle("30px","Consolas","white",newX,height+gap,"text",""));
      if(myPlayArena.frameNo%randomNumber==0){
        var print = winCharacters[Math.floor(Math.random()*winCharacters.length)];
      alphabets.pop();
      alphabets.push(new obstacle("30px","Consolas","white",newX,height+gap,"text",print));
      isCharacters.pop();
      isCharacters.push(true);
    }
      playObstacles.push(new obstacle(10,height,"green",newX,0));
      playObstacles.push(new obstacle(10,myPlayArena.canvas.height-height-gap,"green",newX,height+gap));
    }
    offlineSymbol.changeX = 0;
    offlineSymbol.changeY = 0;
    if(myPlayArena.key){
    switch (myPlayArena.key) {
      case 37: offlineSymbol.changeX = -1;
              break;
      case 38:offlineSymbol.changeY = -1;
              break;
      case 39:offlineSymbol.changeX = 1;
              break;
      case 40:offlineSymbol.changeY = 1;
              break;
            }
  }
  for (i = 0; i < playObstacles.length; i++) {
    playObstacles[i].x-=1;
    playObstacles[i].update("green");
  }
  for (var i = 0; i < alphabets.length; i++) {
    alphabets[i].x-=1;
    alphabets[i].update("white");
  }
  score.text = "SCORE : " + myPlayArena.frameNo;
  score.update("white");
  offlineSymbol.changePos();
  offlineSymbol.update("red");



}
function updateStatus() {
  for(i = 0;i<6;i++)
  {
    if(captured[i]==1)
    {
      if(i==1)
      {
        status.innerHTML += captured[i];
      }
  status.innerHTML += captured[i];
  captured[i] = 2;
}
}
var flag = true;
for(i=0;i<6;i++)
{
  if(captured[i]!=2)
  {
    flag = false
  }
}
if(flag)
{
  win();
}
}
function win()
{
  status.innerHTML="OFFLINE";
}
