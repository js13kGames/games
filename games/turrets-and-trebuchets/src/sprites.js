var sprites = {

    __createSprite(w, h) {
        var sprite = document.createElement('canvas');
        sprite.width = w;
        sprite.height = h;
        sprite.ctx = sprite.getContext("2d"); 
        return sprite;
    },

    __createCircle(def) {
        var circle = this.__createSprite(2 * def.r, 2 * def.r);
        circle.ctx.strokeStyle = def.strokeStyle;
        circle.ctx.fillStyle = def.fillStyle;
        circle.ctx.lineWidth = def.lineWidth;
        var startAngle = def.startAngle || 0;
        var endAngle = def.endAngle || 2 * Math.PI;
        circle.ctx.beginPath();
        circle.ctx.arc(def.r, def.r, def.r, startAngle, endAngle);
        if (def.fillStyle) {
            circle.ctx.fill();
        } else {
            circle.ctx.stroke();
        }
        return circle;
    },

    __createLevelFilledCircle(def, filledPercent) {
        var fp = Math.max(Math.min(filledPercent, 100), 0);
        var topY = (1 - (fp / 100)) * 2 * def.r;
        var dy = topY - def.r;
        var angle = Math.asin(dy / def.r);
        def.startAngle = angle;
        def.endAngle = Math.PI - angle;
        return this.__createCircle(def);
    },

    __createHealthCircle(health) {
        var r = Math.round(245 - health * 1.25).toString(16);
        var g = Math.round(66 + health * 1.8).toString(16);
        var b = (66).toString(16);
        return this.__createLevelFilledCircle({ r: 100, fillStyle: `#${r}${g}${b}` }, health);
    },

    __drawTrebuchet(ctx) {
        ctx.beginPath();
        ctx.moveTo(60, 160);
        ctx.lineTo(140, 160);
        ctx.lineTo(110, 40);
        ctx.lineTo(90, 40);
        ctx.lineTo(60, 160);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(25, 60);
        ctx.lineTo(180, 130);
        ctx.lineTo(174, 140);
        ctx.lineTo(20, 70);
        ctx.lineTo(26, 60);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(30, 75);
        ctx.lineTo(15, 120);
        ctx.lineTo(45, 120);
        ctx.lineTo(30, 75);
        ctx.stroke();
    },

    __drawVillage(ctx) {
        ctx.beginPath();
        ctx.moveTo(50, 170);
        ctx.lineTo(80, 170);
        ctx.lineTo(80, 130);
        ctx.lineTo(120, 130);
        ctx.lineTo(120, 170);
        ctx.lineTo(150, 170);
        ctx.lineTo(135, 80);
        ctx.lineTo(65, 80);
        ctx.lineTo(50, 170);
        ctx.lineTo(80, 170);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(40, 80);
        ctx.lineTo(160, 80);
        ctx.lineTo(160, 40);
        ctx.lineTo(130, 40);
        ctx.lineTo(130, 60);
        ctx.lineTo(120, 60);
        ctx.lineTo(120, 40);
        ctx.lineTo(80, 40);
        ctx.lineTo(80, 60);
        ctx.lineTo(70, 60);
        ctx.lineTo(70, 40);
        ctx.lineTo(40, 40);
        ctx.lineTo(40, 80);
        ctx.lineTo(160, 80);
        ctx.stroke();
    },

    __createTrebuchetOrVillage(health, drawFn, isDone) {
        var result = this.__createCircle({ r: 100, fillStyle: `#d4d1cb` });
        var healthCircle = this.__createHealthCircle(health);
        result.ctx.drawImage(healthCircle, 0, 0);
        result.ctx.strokeStyle = isDone ? "gray" : "black";
        result.ctx.lineWidth = 5;
        drawFn(result.ctx);
        return result;
    },

    createHealthPowerup(highlight) {
        var result = this.__createCircle({ r: 100, fillStyle: `#fcc200` });
        result.ctx.strokeStyle = "black";
        result.ctx.lineWidth = 5;
        
        result.ctx.beginPath();
        result.ctx.arc(88, 112, 50, 0.9 *  Math.PI, 0.6 * Math.PI);
        result.ctx.stroke();

        result.ctx.beginPath();
        result.ctx.moveTo(40, 126);
        result.ctx.lineTo(40, 160);
        result.ctx.lineTo(74, 160);
        result.ctx.stroke();

        result.ctx.beginPath();
        result.ctx.arc(20, 180, 80, 1.57 *  Math.PI, 1.93 * Math.PI);
        result.ctx.stroke();

        result.ctx.beginPath();
        result.ctx.moveTo(122, 30);
        result.ctx.lineTo(122, 74);
        result.ctx.lineTo(154, 42);
        result.ctx.moveTo(122, 74);
        result.ctx.lineTo(166, 74);
        result.ctx.stroke();

        if (highlight) {
            result.ctx.strokeStyle = "#daa520";
            result.ctx.lineWidth = 10;
            result.ctx.beginPath();
            result.ctx.arc(100, 100, 95, 0, 2 * Math.PI);
            result.ctx.stroke();
        }

        return result;
    },

    // Public

    createTrebuchet(health, isDone) { return this.__createTrebuchetOrVillage(health, this.__drawTrebuchet, isDone) },
    createVillage(health) { return this.__createTrebuchetOrVillage(health, this.__drawVillage) },
    createRange() { return this.__createCircle({ r: 100, fillStyle: `#38631c` }) },
    createAttack() { return this.__createCircle({ r: 7, fillStyle: `black` }) },
    createHighlight() { return this.__createCircle({ r: 100, fillStyle: `yellow` }) },
}
