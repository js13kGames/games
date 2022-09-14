let createStraightRoad = (x, y, rotation) => _createRoad(x, y, rotation, "straight");

let createCurvedRoad = (x, y, rotation) => _createRoad(x, y, rotation, "curve");

let createCrossRoad = (x, y, rotation) => _createRoad(x, y, rotation, "cross");

let _createRoad = (x, y, rotation, type) => {
    return { x: x, y: y, rotation: degToRad(rotation), type: type }; 
}

getRoadRectangle = r => {
    return { x: r.x, y: r.y, w: 100, h: 100 };
}

drawRoad = (road, ctx) => {
    if (road.type == "straight") {
        ctx.translate(road.x+50, road.y+50);
        ctx.rotate(road.rotation);
        ctx.strokeStyle = "#aaaaaa";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillRect(-50, -50, 100, 100);
        ctx.fillStyle = "white";
        ctx.fillRect(-50, -3, 20, 6);
        ctx.fillRect(-20, -3, 40, 6);
        ctx.fillRect(30, -3, 20, 6);
        ctx.rotate(-road.rotation);
        ctx.translate(-(road.x+50), -(road.y+50));
    }
    else if (road.type == "cross") {
        ctx.translate(road.x+50, road.y+50);
        ctx.rotate(road.rotation);
        ctx.translate(-50, -50);
        ctx.strokeStyle = "#aaaaaa";
        ctx.fillStyle = "#aaaaaa";
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 47, 20, 6);
        ctx.fillRect(30, 47, 40, 6);
        ctx.fillRect(80, 47, 20, 6);
        ctx.fillRect(47, 0, 6, 20);
        ctx.fillRect(47, 30, 6, 40);
        ctx.fillRect(47, 80, 6, 20);
        ctx.translate(50, 50);
        ctx.rotate(-road.rotation);
        ctx.translate(-(road.x+50), -(road.y+50));
    }
    else if (road.type == "curve") {
        ctx.translate(road.x+50, road.y+50);
        ctx.rotate(road.rotation);

        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.arc(-50, 50, 100, 3*Math.PI/2, Math.PI*2);
        ctx.lineTo(-50, 50);
        ctx.lineTo(-50, -50);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(-50, 50, 53, 3*Math.PI/2, Math.PI*2);
        ctx.lineTo(-50, 50);
        ctx.lineTo(-50, -50);
        ctx.fill();

        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.arc(-50, 50, 47, 3*Math.PI/2, Math.PI*2);
        ctx.lineTo(-50, 50);
        ctx.lineTo(-50, -50);
        ctx.fill();

        ctx.rotate(-road.rotation);
        ctx.translate(-(road.x+50), -(road.y+50));
    }
}

let updateRoad = road => {
    road.x += gameContext.scrollX;
    road.y += gameContext.scrollY;
}

let isInsideRoad = (p, r) => {
    var rr = getRoadRectangle(r);
    return !(p.x < rr.x || p.x > rr.x + rr.w || p.y < rr.y || p.y > rr.y + rr.h);
}
