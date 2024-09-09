class Mapa {
    canvas;
    gridSize;
    grid;
    constructor(canvas, gridSize, xL, yL) {
        this.canvas = canvas;
        this.gridSize = gridSize;
        this.grid = [];
        this.criaMapa(xL, yL);
    }

    criaMapa(xL, yL) {
        for (let y = 0; y < yL; y++) {
            this.grid[y] = [];
            for (let x = 0; x < xL; x++) {
                if (rnd(1, 50) == 2) 
                    this.grid[y][x] = Sprite({
                        x: x * this.gridSize,
                        y: y * this.gridSize,
                        width: this.gridSize,
                        height: this.gridSize,
                        image: imageAssets['assets/montanha'],
                    });
                else
                    this.grid[y][x] = Sprite({
                        x: x * this.gridSize,
                        y: y * this.gridSize,
                        width: this.gridSize,
                        height: this.gridSize,
                        color: '#44891a'
                    });
            }
        }
    }

    renderMap() {
        this.grid.forEach(x => x.forEach(y => y.render()));
    }
}
