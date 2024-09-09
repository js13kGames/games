const rectangle = {
    height: 50,
    width: 100,
    sideHeight: 10,

    draw: function (x, y, row, column) {
        this.drawTopRect(x, y, row, column);
        this.drawLeftRect(x, y);
        this.drawRightRect(x, y);
    },

    drawTopRect: function (x, y, row, column) {
        ctx.beginPath();
        ctx.moveTo(x, y + this.height / 2);
        ctx.lineTo(x + this.width / 2, y);
        ctx.lineTo(x + this.width, y + this.height / 2);
        ctx.lineTo(x + this.width / 2, y + this.height);
        ctx.fillStyle = board.cells[row][column].color;
        ctx.fill();
    },

    drawLeftRect: function(x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y + this.height / 2);
        ctx.lineTo(x, y + this.sideHeight + this.height / 2);
        ctx.lineTo(x + this.width / 2, y + this.sideHeight + this.height);
        ctx.lineTo(x + this.width / 2, y + this.height);
        ctx.fillStyle = '#acacac';
        ctx.fill();
    },

    drawRightRect: function(x, y) {
        ctx.beginPath();
        ctx.moveTo(x + this.width / 2, y + this.height);
        ctx.lineTo(x + this.width / 2, y + this.sideHeight + this.height);
        ctx.lineTo(x + this.width, y + this.sideHeight + this.height / 2);
        ctx.lineTo(x + this.width, y + this.height / 2);
        ctx.fillStyle = '#191919';
        ctx.fill();
    }
};