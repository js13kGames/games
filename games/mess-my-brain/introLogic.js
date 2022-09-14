class Person{
  constructor(){
    this.name = this.name();
    this.age = this.age();
    this.wife = this.wife();
    this.traits = this.traits();
    this.nr = this.nr();
  }
  name(){
    var firstNames = ['Elijah' ,'James' ,'William' ,'Oliver' ,'Connor' ,'Matthew','Daniel' ,'Luke' ,'Brayden' ,'Jayce' ,'Henry' ,'Carter' ,'Dylan' ,'Gabriel' ,'Joshua' ,'Nicholas' ,'IsaacOwen',
      'Jackson' ,'Aiden', 'Liam', 'Lucas', 'Noah', 'Mason', 'Jayden', 'Ethan', 'Jacob', 'Jack', 'Caden', 'Logan', 'Benjamin', 'Michael', 'Caleb', 'Ryan', 'Alexander'];

    var lastNames = ['Sauter' , 'Dyson' , 'Burkhead' , 'Wess' , 'Flinchbaugh' , 'Eisenmann' , 'Winrow' , 'Rybicki' , 'Crenshaw' , 'Ledwell' , 'Sonnenberg' ,'Valliere' , 'Jeans' , 'Pridemore' , 'Lundgren' , 'Schoemaker' ];
    var name = firstNames[Math.floor(Math.random()*firstNames.length)] + ' ' + lastNames[Math.floor(Math.random()*lastNames.length)];
    return name;
  }
  age(){
    return Math.floor(Math.random()*(75-18+1)+19);
  }
  wife(){
    var firstNames= ['Lorraine' , 'Sharie' , 'Kathrine' , 'Carla' , 'Laureen' , 'Clemencia']
    var lastNames = ['Sauter' , 'Dyson' , 'Burkhead' , 'Wess' , 'Flinchbaugh' , 'Eisenmann' , 'Winrow' , 'Rybicki' , 'Crenshaw' , 'Ledwell' , 'Sonnenberg' ,'Valliere' , 'Jeans' , 'Pridemore' , 'Lundgren' , 'Schoemaker' ];
    var name = firstNames[Math.floor(Math.random()*firstNames.length)] + ' ' + lastNames[Math.floor(Math.random()*lastNames.length)];
    var rand = Math.random();
    if (rand < 0.8){
      return 'none';
    }else {
      return name;
    }
  }
  traits(){
    var traitsList1 = [ 'Reliable' , 'Emotional' , ' Amoral'  ,'Focused'];
    var traitsList2 = ['Crude' , ' Greedy' , 'Odd' , 'Weak' , ];
    var traits = traitsList1[Math.floor(Math.random()*traitsList1.length)] + ', ' +  traitsList2[Math.floor(Math.random()*traitsList2.length)];
    return traits;
  }
  nr(){
    var nr = 0;
    for (var i = 0 ; i < 3 ; i++){
      var nr1 = Math.floor(Math.random() *10);
      nr = nr*10 +nr1;
    }
    return nr;
  }
  static experimentNr(){
    var nr = 0;
    for (var i = 0 ; i < 3 ; i++){
      var nr1 = Math.floor(Math.random() *10);
      nr = nr*10 +nr1;
    }
    return nr;
  }

}
var person = new Person();

function drawDocumentBorders() {
  var pointLeftUp = [canvas.width/2 -250 ,25];
  var pointRightUp = [canvas.width/2 +250 , 25];
  var pointLeftDown = [canvas.width/2 -250 , canvas.height -25];
  var pointRightDown = [canvas.width/2 +250 , canvas.height - 25];
  ctx.beginPath();
  ctx.moveTo(pointLeftUp[0],pointLeftUp[1]);
  ctx.lineWidth = 20;
  ctx.lineTo(pointLeftDown[0] , pointLeftDown[1]);
  ctx.lineTo(pointRightDown[0 ], pointRightDown[1]);
  ctx.lineTo(pointRightUp[0 ], pointRightUp[1]+200);
  ctx.lineTo(pointRightUp[0 ] -200, pointRightUp[1]+200);
  ctx.lineTo(pointRightUp[0 ] -200, pointRightUp[1]);
  ctx.moveTo(pointRightUp[0] -210,pointRightUp[1]-4);
  ctx.lineTo(pointRightUp[0 ] +4 , pointRightUp[1]+200);
  ctx.moveTo(pointLeftUp[0] -10,pointLeftUp[1]);
  ctx.lineTo(pointRightUp[0] -200 , pointRightUp[1]);

  ctx.strokeStyle = color1;
  ctx.stroke();
  ctx.closePath();

}
function drawPhotoFrame() {
  var pointFrame = [  canvas.width/2 -195 ,75];
  ctx.beginPath();
  ctx.rect(pointFrame[0] , pointFrame[1], 125,140);
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'color1';
  ctx.stroke();
  ctx.closePath();
}
function drawPlayerPortrer(pos) {
  //corp
  ctx.beginPath();
  ctx.rect(pos[0] , pos[1] , 85 , 110);
  ctx.fillStyle = color1;
  ctx.fill();
  ctx.closePath();

  //left eye
  ctx.beginPath();
  ctx.arc(pos[0] +25, pos[1] +25, 15, 0, Math.PI*2, false);
  ctx.fillStyle = color2;
  ctx.fill();
  ctx.closePath();


  //right eye
  ctx.beginPath();
  ctx.arc(pos[0] +60, pos[1] +25, 15, 0, Math.PI*2, false);
  ctx.fillStyle = color2;
  ctx.fill();
  ctx.closePath();


  // mouth
  ctx.beginPath();
  ctx.arc(pos[0] +40, pos[1] +80, 25, 3, Math.PI*2, false);
  ctx.fillStyle = color2;
  ctx.fill();
  ctx.closePath();
}
function drawText(){
  var point = [canvas.width/2 -250 ,25];
  ctx.font = '20px "Courier New", Courier, monospace';
  ctx.fillStyle = color1;
  ctx.fillText("SUBJECT #" + person.nr, point[0] +50, 250);

  ctx.fillText("NAME : " + person.name,point[0] +50, 320);
  ctx.fillText("AGE : " + person.age, point[0] +50, 360);
  ctx.fillText("WIFE: "+ person.wife, point[0] +50, 400);
  ctx.fillText("TRAITS : " + person.traits, point[0] +50, 440);
  var date = new Date();
  ctx.fillText('Test subject for experiment #' + Person.experimentNr(), point[0] +50, 510);

  ctx.font = '40px Impact, Charcoal, sans-serif';
  ctx.fillText('TOP S' ,point[0] +205 ,150);

  ctx.font = '30px Impact, Charcoal, sans-serif';
  ctx.fillText('PRESS SPACE TO START' , point[0]+115 , 700)


}
var joculSaInceput = false;

function spaceHandler(e) {
  if ( e.keyCode == 32 && joculSaInceput ==false){
    joculSaInceput = true;
    ctx.clearRect(0,0 , canvas.width , canvas.height);
    startLogic();
    startLogicDecor();
  }

}




 // sound
