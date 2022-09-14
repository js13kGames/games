let tree = (x, y) => {
    return { x: x, y: y, rot: Math.random() * 2 * Math.PI, size: {x: -40, y: -40, w: 80, h: 80}, draw: () => { 
        context.translate(-50, -50); 
        context.drawImage(_getCanvas("tree"), 0, 0); 
        context.translate(50, 50); 
    }};
}

let forest = (x, y, xcount, ycount) => {
    let rots = [];
    for (var i = 0; i < xcount * ycount; i++) {
        rots.push(Math.random() * 2 * Math.PI);
    }
    return { x: x, y: y, rot: 0, size: {x: -40, y: -40, w: 100 * (xcount-1) + 80, h: 100 * (ycount-1)+80}, draw: () => { 
        for (var xc=0; xc < xcount; xc++) {
            for (var yc=0; yc < ycount; yc++) {
                var rot = rots[yc + xc*ycount];
                context.translate(xc * 100, yc * 100);
                context.rotate(rot);
                context.translate(-50, -50); 
                context.drawImage(_getCanvas("tree"), 0, 0); 
                context.translate(50, 50); 
                context.rotate(-rot);
                context.translate(-(xc * 100), -(yc * 100));
            }     
        } 
    }};
}

let pond = (x, y) => {
    return { x: x, y: y, rot: Math.random() * 2 * Math.PI, draw: () => { 
        context.translate(-50, -50); 
        context.drawImage(_getCanvas("pond"), 0, 0); 
        context.translate(50, 50); 
    }};
}

let house = (x, y, rot) => {
    return { x: x, y: y, rot: degToRad(rot), size: {x: -50, y: -50, w: 100, h: 100}, draw: () => { 
        context.translate(-50, -50); 
        context.drawImage(_getCanvas("house"), 0, 0); 
        context.translate(50, 50); 
    }};
}

let houses = (x, y, xcount, ycount, rot) => {
    var size;
    if (rot==0) {
        size = {x: 0, y: 0, w: 100 * xcount, h: 100 * ycount};
    }
    else {
        size = {x: -100, y: 0, w: 100 * ycount, h: 100 * xcount};
    }
    return { x: x, y: y, rot: degToRad(rot), size: size, draw: () => { 
        for (var xc=0; xc < xcount; xc++) {
            for (var yc=0; yc < ycount; yc++) {
                context.translate(xc * 100, yc * 100);
                context.drawImage(_getCanvas("house"), 0, 0); 
                context.translate(-(xc * 100), -(yc * 100));
            }     
        } 
    }};
}

let propertyType1 = (x, y, rot) => {
    var size;
    if (rot==0) {
        size = {x: -42, y: -37, w: 400, h: 195};
    }
    else if (rot == 90) {
        size = {x: -157, y: -44, w: 195, h: 400};
    }
    else if (rot == 180) {
        size = {x: -357, y: -160, w: 400, h: 195};
    }
    else {
        size = {x: -35, y: -355, w: 195, h: 400};
    }
    return { x: x, y: y, rot: degToRad(rot), size: size, draw: () => { 
        context.translate(-50, -50); 
        context.drawImage(_getCanvas("propertyType1"), 0, 0); 
        context.translate(50, 50); 
    }};
}

let straightGravelRoad = (x, y, w, h, rot) => {
     return { x: x, y: y, rot: degToRad(rot), draw: () => { 
        context.rotate(rot);
        context.lineWidth = h;
        context.strokeStyle = "#d6ae3e";
        context.fillStyle = "#d6ae3e";
        context.fillRect(0, 0, w, h); 
        context.rotate(-rot);
        } 
    };
}

let blobShape = (x, y, col) => {
    let rot = Math.random() * Math.PI * 2;

    return { x: x, y: y,
        draw: () => {
            context.rotate(rot);
            drawCircle(0, 0, 40, 2, col, col, context);
            drawCircle(10, 20, 30, 2, col, col, context);
            drawCircle(35, 10, 15, 2, col, col, context);
            drawCircle(5, -35, 15, 2, col, col, context);
            drawCircle(-15, 0, 30, 2, col, col, context);
            context.rotate(-rot);
        } 
    };
}

let verticalWater = (x, y, h) => {
    var colors = [
        "#0000FF",
        "#0000EE",
        "#0000DD",
        "#0000CC",
        "#0000BB",
        "#0000AA",
        "#000099",
        "#000088",
        "#000077",
        "#000066",
    ]
    return { x: x, y: y, rot: 0, size: {x: 0, y: 0, w: 500, h: h},
        draw: () => { 
            for (var i = 0; i < 10; i++) {
                context.fillStyle = colors[i];
                context.fillRect(i * 50, 0, 100, h); 
            }
        }
    } 
}

let car = (x, y, rot, color) => {
    return { x: x, y: y, rot: degToRad(rot), size: {x: -30, y: -30, w: 60, h: 60},
        draw: () => {
            context.fillStyle = color;
            context.fillRect(-30, -15, 60, 30);
            context.fillStyle = "white";
            context.fillRect(-30, -5, 60, 4);
            context.fillRect(-30, 1, 60, 4);
            context.fillStyle = "#222222";
            context.fillRect(-20, -13, 8, 26);
            context.fillRect(0, -13, 12, 26);
            context.fillRect(23, -13, 5, 8);
            context.fillRect(23, 5, 5, 8);
            context.lineWidth = 2;
            context.strokeStyle = "black";
            context.strokeRect(-30, -15, 60, 30);
        }
    }
}

let _getCanvas = name => {

    let _createCanvas = (w, h, fn) => {
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        fn(canvas.getContext("2d"));
        return canvas;
    }
    
    let _createBlob = col => _createCanvas(100, 100, ctx => {
        drawCircle(50, 40, 40, 2, col, col, ctx);
        drawCircle(60, 60, 30, 2, col, col, ctx);
        drawCircle(85, 55, 15, 2, col, col, ctx);
        drawCircle(55, 25, 15, 2, col, col, ctx);
        drawCircle(35, 60, 30, 2, col, col, ctx);
    });

    let _createTree = () => _createBlob("#166e16");

    let _createPond = () => _createBlob("blue");

    let _createFence = () => _createCanvas(100, 8, ctx => {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.lineTo(100, 4);
        ctx.stroke();
        ctx.fillRect(22, 0, 6, 8);
        ctx.fillRect(72, 0, 6, 8);
    });

    let _createHouse = () => _createCanvas(100, 100, ctx => {
        let drawPane = (x, y, ctx) => {
            ctx.fillRect(x, y, 14, 6);
            ctx.strokeRect(x, y, 14, 6);
        }
    
        let drawSmallPane = (x, y, ctx) => {
            ctx.fillRect(x, y, 7, 6);
            ctx.strokeRect(x, y, 7, 6);
        }
    
        let drawEvenRow = (x, y, ctx) => {
            drawPane(x+0, y, ctx);
            drawPane(x+14, y, ctx);
            drawPane(x+28, y, ctx);
            drawSmallPane(x+42, y, ctx);
        }
    
        let drawOddRow = (x, y, ctx) => {
            drawSmallPane(x+0, y, ctx);
            drawPane(x+7, y, ctx);
            drawPane(x+21, y, ctx);
            drawPane(x+35, y, ctx);
        }
    
        let drawHalf = (x) => {
            drawEvenRow(x, 0, ctx);
            drawOddRow(x, 7, ctx);
            drawEvenRow(x, 14, ctx);
            drawOddRow(x, 21, ctx);
            drawEvenRow(x, 28, ctx);
            drawOddRow(x, 35, ctx);
            drawEvenRow(x, 42, ctx);
            drawOddRow(x, 49, ctx);
            drawEvenRow(x, 56, ctx);
            drawOddRow(x, 63, ctx);
            drawEvenRow(x, 70, ctx);
            drawOddRow(x, 77, ctx);
            drawEvenRow(x, 84, ctx);
            drawOddRow(x, 91, ctx);
       }

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#2c2c2c";
        ctx.fillStyle = "#585858";
        drawHalf(0);
        ctx.strokeStyle = "#111111";
        ctx.fillStyle = "#444444";
        drawHalf(50);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, 49, 97);
        ctx.strokeRect(50, 0, 49, 97);
    });
    
    let _createProperty1 = () => _createCanvas(520, 320, ctx => {
        ctx.drawImage(_getCanvas("fence"), 10, 10);
        ctx.drawImage(_getCanvas("fence"), 110, 10);
        ctx.drawImage(_getCanvas("fence"), 210, 10);
        ctx.drawImage(_getCanvas("fence"), 310, 10);
        ctx.drawImage(_getCanvas("fence"), 10, 206);
        ctx.drawImage(_getCanvas("fence"), 110, 206);
        ctx.drawImage(_getCanvas("fence"), 310, 206);
        
        ctx.rotate(degToRad(90));
        ctx.drawImage(_getCanvas("fence"), 12, -12);        
        ctx.drawImage(_getCanvas("fence"), 112, -12);        
        ctx.drawImage(_getCanvas("fence"), 12, -412);        
        ctx.drawImage(_getCanvas("fence"), 112, -412);        
        ctx.rotate(-degToRad(90));

        ctx.drawImage(_getCanvas("tree"), 50, 80);
        ctx.drawImage(_getCanvas("house"), 200, 50);
    });

    if (typeof _getCanvas.canvases == "undefined") {
        _getCanvas.canvases = {};
        _getCanvas.canvases.tree = _createTree();
        _getCanvas.canvases.pond = _createPond();
        _getCanvas.canvases.fence = _createFence();
        _getCanvas.canvases.house = _createHouse();
        _getCanvas.canvases.propertyType1 = _createProperty1();

    }

    return _getCanvas.canvases[name];
}

drawEnvironment = e => {
    context.translate(e.x, e.y);
    context.rotate(e.rot);
    e.draw();
    context.rotate(-e.rot);
    context.translate(-e.x, -e.y);
}

updateEnvironment = e => {
    e.x += gameContext.scrollX;
    e.y += gameContext.scrollY;
}

getEnvironmentRectangle = e => {
    if (e.size) {
        return {x: e.x+e.size.x, y: e.y+e.size.y, w: e.size.w, h: e.size.h};
    }
    return undefined;
}
