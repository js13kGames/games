  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  window.addEventListener("keydown", moveElephant, false);
  
  function moveElephant(e) {
      switch(e.keyCode) {
        case 32:
          lostElephant.y = lostElephant.y-30;
          break;  
      }   
      e.preventDefault();
      drawLostElephant(lostElephant, context);
  } 

  function drawCar(car, context) {
    var img = new Image();
    img.src = 'car.png';
    context.drawImage(img, car.x, car.y);
  }
  function drawLostElephant(car, context) {
    var img = new Image();
    img.src = 'lost_elephant.png';
    context.drawImage(img, car.x, car.y);
  }
  function drawFriendElephant(car, context) {
    var img = new Image();
    img.src = 'lost_elephant.png';
    context.drawImage(img, car.x, car.y);
    context.drawImage(img, car.x+150, car.y);
  }
  function drawRoad(car, context) {
    context.beginPath();
    context.rect(car.x, car.y+10, car.width, car.height+20);
    context.fillStyle = '#A68B44';
    context.fill();
    context.lineWidth = car.borderWidth;
    context.strokeStyle = '#A09383';
    context.stroke();
  }
  function animate(car, canvas, context, startTime) {
    car.x = car.x + 8;
    if (car.x >= 1300) {
      car.x = -50;
    }
    car1.x = car1.x + 5.1;
    if (car1.x >= 1300) {
      car1.x = -50;
    }
    car2.x = car2.x + 7.6;
    if (car2.x >= 1300) {
      car2.x = -50;
    }
    car3.x = car3.x + 4.3;
    if (car3.x >= 1300) {
      car3.x = -50;
    }
    car4.x = car4.x + 3.5;
    if (car4.x >= 1300) {
      car4.x = -50;
    }
    car5.x = car5.x + 5.8;
    if (car5.x >= 1300) {
      car5.x = -50;
    }

    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw
    initCanvas();
    drawRoad(myRoad, context);
    drawCar(car, context);
    drawRoad(myRoad1, context);
    drawCar(car1, context);
    drawRoad(myRoad2, context);
    drawCar(car2, context);
    drawRoad(myRoad3, context);
    drawCar(car3, context);
    drawRoad(myRoad4, context);
    drawCar(car4, context);
    drawRoad(myRoad5, context);
    drawCar(car5, context);
    drawLostElephant(lostElephant, context);
    drawFriendElephant(friendElephant, context);

    // request new frame
    requestAnimFrame(function() {
      var collision = contains(lostElephant, car5) || contains(lostElephant, car4) ||
        contains(lostElephant, car3) || contains(lostElephant, car2) || contains(lostElephant, car1) ||
        contains(lostElephant, car);

      if (collision) {
        alert('You killed the elephant');
        lostElephant.x = 600;
        lostElephant.y = 550;
      }
      else if (lostElephant.y <= 0) {
        alert('Congratz! You Won');
        lostElephant.x = 600;
        lostElephant.y = 550;
      }
      animate(car, canvas, context, startTime);
    });
  }

  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  function initCanvas() {
    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "20px Arial";
    context.fillStyle = "Black";
    context.fillText("Press Space bar to move the elephant",445,620);
  }
  initCanvas();


  var car = {
    x: 40,
    y: 70,
    width: 100,
    height: 50,
    borderWidth: 5
  };

  var myRoad = {
    x: 0,
    y: 53,
    width: 1278,
    height: 50,
    borderWidth: 5
  };

  var car1 = {
    x: 40,
    y: 150,
    width: 100,
    height: 50,
    borderWidth: 5
  };

  var myRoad1 = {
    x: 0,
    y: 133,
    width: 1278,
    height: 50,
    borderWidth: 5
  };

  var car2 = {
    x: 40,
    y: 230,
    width: 100,
    height: 50,
    borderWidth: 5
  };

  var myRoad2 = {
    x: 0,
    y: 213,
    width: 1278,
    height: 50,
    borderWidth: 5
  };

  var car3 = {
    x: 40,
    y: 310,
    width: 100,
    height: 50,
    borderWidth: 5
  };

  var myRoad3 = {
    x: 0,
    y: 293,
    width: 1278,
    height: 50,
    borderWidth: 5
  };

  var car4 = {
    x: 40,
    y: 390,
    width: 100,
    height: 50,
    borderWidth: 5
  };

  var myRoad4 = {
    x: 0,
    y: 373,
    width: 1278,
    height: 50,
    borderWidth: 5
  };

  var car5 = {
    x: 40,
    y: 470,
    width: 100,
    height: 50,
    borderWidth: 5
  };

  var myRoad5 = {
    x: 0,
    y: 453,
    width: 1278,
    height: 50,
    borderWidth: 5
  };

  var lostElephant = {
    x: 600,
    y: 550,
    width: 50,
    height: 50,
    borderWidth: 5
  };

  var friendElephant = {
    x: 500,
    y: 0,
    width: 50,
    height: 50,
    borderWidth: 5
  };

  drawLostElephant(lostElephant, context);
  drawRoad(myRoad, context);
  drawCar(car, context);
  drawRoad(myRoad1, context);
  drawCar(car1, context);
  drawRoad(myRoad2, context);
  drawCar(car2, context);
  drawRoad(myRoad3, context);
  drawCar(car3, context);
  drawRoad(myRoad4, context);
  drawCar(car4, context);
  drawRoad(myRoad5, context);
  drawCar(car5, context);
  drawFriendElephant(friendElephant, context);

  function contains(elephant, car) {
  return !(car.x > (elephant.x + elephant.width) || 
    (car.x + car.width) < elephant.x || 
    car.y > (elephant.y + elephant.height) ||
    (car.y + car.height) < elephant.y);
  }

  // wait one second before starting game
  setTimeout(function() {
    var startTime = (new Date()).getTime();
    animate(car, canvas, context, startTime);
  }, 1000);
