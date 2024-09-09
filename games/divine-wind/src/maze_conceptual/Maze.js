class Maze {
    constructor(layers, seed, start, end) {
        this.grid = generate_maze(layers, seed, start, end);
        this.offsets = [];
        for (let i = 0; i < this.grid.length; i++) {
            this.offsets.push(0);
        }
    }

    connectedNeighbors(coords) {
        const currCell = this.grid[coords.layer][coords.cell];
        const currOffset = this.offsets[coords.layer];
        const currLayerCellCount = this.grid[coords.layer].length;
        let neighbors = [];
        // outer
        if (coords.layer < this.grid.length - 1) {
            const outerOffset = this.offsets[coords.layer + 1];
            const outerCellCount = this.grid[coords.layer + 1].length;
            const hasTwoOuterAdjacent = 2 * currLayerCellCount === outerCellCount;
            if (hasTwoOuterAdjacent) {
                const effectiveOffset = (2 * currOffset - outerOffset + outerCellCount) % outerCellCount;
                if (!currCell.outer0) {
                    let offsetCell = (coords.cell * 2 + effectiveOffset) % outerCellCount;
                    neighbors.push(new MazeCoordinates(coords.layer + 1, offsetCell));
                }
                if (!currCell.outer1) {
                    let offsetCell = (coords.cell * 2 + 1 + effectiveOffset) % outerCellCount;
                    neighbors.push(new MazeCoordinates(coords.layer + 1, offsetCell));
                }
            } else if (!currCell.outer0) {
                const effectiveOffset = (currOffset - outerOffset + outerCellCount) % outerCellCount;
                let offsetCell = (coords.cell + effectiveOffset) % outerCellCount;
                neighbors.push(new MazeCoordinates(coords.layer + 1, offsetCell));
            }
        }
        // inner
        if (coords.layer > 1) {
            const innerOffset = this.offsets[coords.layer - 1];
            const innerCellCount = this.grid[coords.layer - 1].length;
            const hasDoublyLargeInnerAdjacent = currLayerCellCount === 2 * innerCellCount;
            if (hasDoublyLargeInnerAdjacent) {
                const effectiveCell = coords.cell + currOffset;
                let offsetCell = (Math.floor(effectiveCell / 2) - innerOffset + innerCellCount) % innerCellCount;
                const isFirstCell = effectiveCell % 2 === 0;
                const innerCell = this.grid[coords.layer - 1][offsetCell];
                if (isFirstCell) {
                    if (!innerCell.outer0) {
                        neighbors.push(new MazeCoordinates(coords.layer - 1, offsetCell));
                    }
                } else {
                    if (!innerCell.outer1) {
                        neighbors.push(new MazeCoordinates(coords.layer - 1, offsetCell));
                    }
                }
            } else {
                const effectiveOffset = (currOffset - innerOffset + innerCellCount) % innerCellCount;
                let offsetCell = (coords.cell + effectiveOffset) % currLayerCellCount;
                const innerCell = this.grid[coords.layer - 1][offsetCell];
                if (!innerCell.outer0) {
                    neighbors.push(new MazeCoordinates(coords.layer - 1, offsetCell));
                }
            }
        }
        // clockwise
        if (!currCell.clockwise) {
            const clockwiseCell = (coords.cell + 1) % currLayerCellCount;
            neighbors.push(new MazeCoordinates(coords.layer, clockwiseCell));
        }
        // counter-clockwise
        const counterClockwiseCell = (coords.cell - 1 + currLayerCellCount) % currLayerCellCount;
        if (!this.grid[coords.layer][counterClockwiseCell].clockwise) {
            neighbors.push(new MazeCoordinates(coords.layer, counterClockwiseCell));
        }
        return neighbors;
    }
    setOffsets(offsets) {
        this.offsets = offsets;
    }
    scrambleOffsets() {
        for (let i = 1; i < this.grid.length - 1; i++) {
            this.offsets[i] = randIntFromZero(this.grid[i].length);
        }
    }
}