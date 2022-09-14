const player = {
    x: 0,
    y: 0,

    life: 3,

    cellX: 4,
    cellY: 7,

    init: function () {
        this.cellX = 4;
        this.cellY = 7;

        this.life = 3;

        this.x = ((this.cellX + 1) * rectangle.width) - (rectangle.width / 2);
        this.y = ((this.cellY + 1) * (rectangle.height + rectangle.sideHeight)) / 2;
    },

    goRight: function () {
        if (this.cellY % 2 !== 0) {
            this.cellX += 1;
        }

        this.cellY += 1;

        this.x += 50;
        this.y += 35;
    },

    goLeft: function () {
        if (this.cellY % 2 === 0) {
            this.cellX -= 1;
        }

        this.cellY += 1;

        this.x -= 50;
        this.y += 35;
    },

    isPlayerDead: function () {
        const isAfterLastCellColumn = player.cellY >= board.cells.length;

        return isAfterLastCellColumn || this.isPlayerGoOut() || this.isPLayerOnEmptyCell();
    },

    isPlayerGoOut: function() {
        return player.y < 0 || player.x < 0 || player.x > canvas.width;
    },

    isPLayerOnEmptyCell: function () {
        return board.cells[player.cellY][player.cellX].empty;
    },

    update() {
        this.y -= gameSpeed;
    },

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x - 25, this.y + rectangle.height /4 - 5);
        ctx.lineTo(this.x - 25 + rectangle.width / 4, this.y - 15);
        ctx.lineTo(this.x - 25 + rectangle.width /2, this.y + rectangle.height / 4 - 5);
        ctx.lineTo(this.x - 25 + rectangle.width / 4, this.y + rectangle.height/ 2 - 5);
        ctx.fillStyle = '#191919';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x - 25, this.y + rectangle.height /4 - 5);
        ctx.lineTo(this.x - 25 + rectangle.width / 4, this.y - 15);
        ctx.lineTo(this.x - 25 + rectangle.width / 4, this.y + rectangle.height/ 2 - 5);
        ctx.fillStyle = 'red';
        ctx.fill();

        ctx.closePath();
    }
};
