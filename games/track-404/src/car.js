let createCar = (x, y, dir) => { 
    return { x: x, y: y, xf: x, yf: y, rotation: degToRad(dir) }; 
}

let drawCar = (car, ctx) => {
    ctx.translate(car.x+30, car.y+15);
    ctx.rotate(car.rotation);
    ctx.fillStyle = "green";
    ctx.fillRect(-30, -15, 60, 30);
    ctx.fillStyle = "white";
    ctx.fillRect(-30, -5, 60, 4);
    ctx.fillRect(-30, 1, 60, 4);
    ctx.fillStyle = "#222222";
    ctx.fillRect(-20, -13, 8, 26);
    ctx.fillRect(0, -13, 12, 26);
    ctx.fillRect(23, -13, 5, 8);
    ctx.fillRect(23, 5, 5, 8);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(-30, -15, 60, 30);
    ctx.rotate(-car.rotation);
    ctx.translate(-(car.x+30), -(car.y+15));
}

let updateCar = (car, turnLeft, turnRight, driveFast, dt) => {
    var delayFactor = 17/dt;

    car.frontLeft = {
        x: car.x + 30 - _diag * Math.cos(_angle2 + car.rotation),
        y: car.y + 15 - _diag * Math.sin(_angle2 + car.rotation),
    };
    car.frontRight = {
        x: car.x + 30 + _diag * Math.cos(_angle1 + car.rotation),
        y: car.y + 15 + _diag * Math.sin(_angle1 + car.rotation),
    };
    car.rearRight = {
        x: car.x + 30 + _diag * Math.cos(_angle2 + car.rotation),
        y: car.y + 15 + _diag * Math.sin(_angle2 + car.rotation),
    };
    car.rearLeft = {
        x: car.x + 30 - _diag * Math.cos(_angle1 + car.rotation),
        y: car.y + 15 - _diag * Math.sin(_angle1 + car.rotation),
    };
    if (turnLeft) {
        car.rotation -= degToRad(2*gameContext.speedFactor*delayFactor);
    }
    else if (turnRight) {
        car.rotation += degToRad(2*gameContext.speedFactor*delayFactor);
    }
    if (driveFast) {
        _driveForward(car, 10*gameContext.speedFactor*delayFactor);
    }
    else {
        _driveForward(car, 3*gameContext.speedFactor*delayFactor);
    }
}

let _diag = Math.sqrt(30*30+15*15);
let _angle1 = Math.atan(1/2);
let _angle2 = Math.PI/2 + Math.atan(2);

let _driveForward = (car, steps) => {
    const cos = Math.cos(car.rotation);
    const sin = Math.sin(car.rotation);

    car.xf = car.xf + steps * cos;
    var nextX = Math.round(car.xf);
    if (nextX > dimensions.maxX) {
        gameContext.scrollX = dimensions.maxX - nextX;
        gameContext.x += gameContext.scrollX;
        car.xf = dimensions.maxX;
        car.x = dimensions.maxX;
    }
    else if (nextX < dimensions.minX) {
        gameContext.scrollX = dimensions.minX - nextX;
        gameContext.x += gameContext.scrollX;
        car.xf = dimensions.minX;
        car.x = dimensions.minX;
    }
    else {
        gameContext.scrollX = 0;
        car.x = nextX;
    }

    car.yf = car.yf + steps * sin;
    var nextY = Math.round(car.yf);
    if (nextY > dimensions.maxY) {
        gameContext.scrollY = dimensions.maxY - nextY;
        gameContext.y += gameContext.scrollY;
        car.yf = dimensions.maxY;
        car.y = dimensions.maxY;
    }
    else if (nextY < dimensions.minY) {
        gameContext.scrollY = dimensions.minY - nextY;
        gameContext.y += gameContext.scrollY;
        car.yf = dimensions.minY;
        car.y = dimensions.minY;
    }
    else {
        gameContext.scrollY = 0;
        car.y = nextY;
    }
}
