/*global AFRAME*/
/*global document*/

var updateCanvas_rack = function (ctx, width, height, rackOn) {

    var i;

    // Draw on canvas...
    ctx.fillStyle = "#559";
    ctx.fillRect(0, 0, width, height);

    // network ports
    ctx.fillStyle = "#000";
    for (i = 0; i < 24; i = i + 1) {
        ctx.fillRect(50 + ((i % 12) * 30), 5 + (i > 11 ? 50 : 24), 20, 15);
    }

    // lights
    ctx.fillStyle = rackOn ? "lightgreen" : "#f00";
    ctx.beginPath();
    ctx.arc(10 + 14, 5 + 76, 6, 0, 2 * Math.PI, false);
    ctx.fill();

    //ctx.fillStyle = "#ddd";
    //ctx.font = "26px Arial";
    //ctx.fillText("ID Card Reader", 60, 84);
    //ctx.fillRect(320, 70, 80, 8);

};


var updateCanvas_poster = function (ctx, width, height) {

    var top,
        left,
        i,
        MESSAGE = "AJIISS09"; //RNBOE

    // Draw on canvas...
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    
    // middle line
    ctx.fillStyle = "grey";
    ctx.fillRect((width / 2) - 3, 0, 6, height);

    ctx.fillStyle = "#111";
    ctx.font = "120px Arial";
    ctx.textAlign="center";

    for (i = 0; i < MESSAGE.length; i = i + 1) {

        // basic units
        if (i % 2 === 0) {
            left = 85;
            top = top ? top + 180 : 160;
        } else {
            left = 265;
        }

        ctx.fillText(MESSAGE[i], left, top);

    }


};


AFRAME.registerComponent("draw-canvas", {

    schema: {"default": ""},

    init: function () {

        this.canvas = document.getElementById(this.data);

        if (this.data === "rack") {
            this.canvas.width = 450;
            this.canvas.height = 100;
        } else if (this.data === "poster") {
            this.canvas.width = 180 * 2;
            this.canvas.height = 400 * 2;
        }

        this.ctx = this.canvas.getContext("2d");

        window["updateCanvas_" + this.data](this.ctx, this.canvas.width, this.canvas.height, false);

    }

});
