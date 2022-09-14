import { TILE_SIZE } from './constants.js';
import BoundingBoxCorners from './enums/bounding_box_corners.js';
import { ctx, } from './common.js';
import TileType from './enums/tile_type.js';
class Level {
    constructor(matrix) {
        this.#start = [];
        this.#end = [];
        this.#fakeEnd = [];
        this.#matrix = matrix;
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[0].length; col++) {
                const tile = matrix[row][col];
                if (tile === TileType.Start) {
                    this.#start = [col, row];
                }
                if (tile === TileType.Exit) {
                    this.#end = [col, row];
                }
                if (tile === TileType.FakeExit) {
                    this.#fakeEnd.push([col, row]);
                }
            }
        }
    }
    #matrix;
    #start;
    #end;
    #fakeEnd;
    get start() {
        return this.#start;
    }
    get end() {
        return this.#end;
    }
    get matrix() {
        return this.#matrix;
    }
    handleVerticalCollision(player) {
        const { boundingBox } = player;
        const tilesEntered = this.getTilesEntered(player);
        if (tilesEntered[BoundingBoxCorners.downLeft] + tilesEntered[BoundingBoxCorners.downRight] >= 1 && player.dy > 0) {
            player.y = ~~(boundingBox[BoundingBoxCorners.upLeft][1] / TILE_SIZE) * TILE_SIZE;
            player.dy = 0;
            player.isOnGround = true;
        }
        else if (tilesEntered[BoundingBoxCorners.upLeft] + tilesEntered[BoundingBoxCorners.upRight] >= 1) {
            player.y = ~~(boundingBox[BoundingBoxCorners.downLeft][1] / TILE_SIZE) * TILE_SIZE;
            player.dy = -player.dy;
        }
    }
    handleHorizontalCollision(player) {
        const { boundingBox } = player;
        const tilesEntered = this.getTilesEntered(player);
        if (tilesEntered[BoundingBoxCorners.upLeft] === 1 && tilesEntered[BoundingBoxCorners.downLeft] === 1) {
            player.x = ~~(boundingBox[BoundingBoxCorners.upRight][0] / TILE_SIZE) * TILE_SIZE;
            player.dx = -player.dx;
        }
        else if (tilesEntered[BoundingBoxCorners.upRight] === 1 && tilesEntered[BoundingBoxCorners.downRight] === 1) {
            player.x = ~~(boundingBox[BoundingBoxCorners.upLeft][0] / TILE_SIZE) * TILE_SIZE;
            player.dx = -player.dx;
        }
    }
    getTilesEntered(player) {
        const { boundingBox } = player;
        const upLeft = boundingBox[BoundingBoxCorners.upLeft];
        const upRight = boundingBox[BoundingBoxCorners.upRight];
        const downRight = boundingBox[BoundingBoxCorners.downRight];
        const downLeft = boundingBox[BoundingBoxCorners.downLeft];
        const upLeftTile = this.#matrix[~~(upLeft[1] / TILE_SIZE)][~~(upLeft[0] / TILE_SIZE)];
        const upRightTile = this.#matrix[~~(upRight[1] / TILE_SIZE)][~~(upRight[0] / TILE_SIZE)];
        const downRightTile = this.#matrix[~~(downRight[1] / TILE_SIZE)][~~(downRight[0] / TILE_SIZE)];
        const downLeftTile = this.#matrix[~~(downLeft[1] / TILE_SIZE)][~~(downLeft[0] / TILE_SIZE)];
        if (downRightTile === TileType.FakeExit) {
            this.#matrix[~~(downRight[1] / TILE_SIZE)][~~(downRight[0] / TILE_SIZE)] = TileType.Solid;
        }
        else if (downLeftTile === TileType.FakeExit) {
            this.#matrix[~~(downLeft[1] / TILE_SIZE)][~~(downLeft[0] / TILE_SIZE)] = TileType.Solid;
        }
        const tilesBeingEntered = [];
        tilesBeingEntered[BoundingBoxCorners.upLeft] = upLeftTile;
        tilesBeingEntered[BoundingBoxCorners.upRight] = upRightTile;
        tilesBeingEntered[BoundingBoxCorners.downRight] = downRightTile;
        tilesBeingEntered[BoundingBoxCorners.downLeft] = downLeftTile;
        return tilesBeingEntered;
    }
    reachedFakeExit(player) {
        const tilesEntered = this.getTilesEntered(player);
        if (tilesEntered[BoundingBoxCorners.downRight] === TileType.FakeExit || tilesEntered[BoundingBoxCorners.downLeft] === TileType.FakeExit) {
            return true;
        }
        return false;
    }
    reachedExit(player) {
        const tilesEntered = this.getTilesEntered(player);
        if (tilesEntered[BoundingBoxCorners.downRight] === TileType.Exit || tilesEntered[BoundingBoxCorners.downLeft] === TileType.Exit) {
            return true;
        }
        return false;
    }
    render(player) {
        this.renderMap();
        this.renderExit();
        this.renderHealth(player);
    }
    renderMap() {
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[0].length; col++) {
                let val = this.matrix[row][col];
                if (ctx !== null && !!val) {
                    if (val === TileType.Solid) {
                        ctx.fillStyle = '#424242';
                        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                    else if (val === TileType.Start) {
                        ctx.fillStyle = '#008000';
                        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE - 12);
                        ctx.fillStyle = '#424242';
                        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE + 8, TILE_SIZE, TILE_SIZE - 8);
                    }
                    else if (val === TileType.Exit || val === TileType.FakeExit) {
                        ctx.fillStyle = '#FF0000';
                        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE - 12);
                        ctx.fillStyle = '#424242';
                        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE + 8, TILE_SIZE, TILE_SIZE - 8);
                    }
                }
            }
        }
    }
    renderExit() {
        if (ctx !== null) {
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = '#bc1a1a';
            ctx.font = '12px monospace';
            const text = 'EXIT';
            const measurement = ctx?.measureText(text);
            const exits = this.#fakeEnd.concat([this.#end]);
            for (const [x, y] of exits) {
                ctx?.fillText(text, x * TILE_SIZE + (TILE_SIZE - measurement.width) / 2, y * TILE_SIZE - 5);
            }
        }
    }
    renderHealth(player) {
        if (ctx !== null && player) {
            const { health } = player;
            ctx.fillText('Health: ', 1.5 * TILE_SIZE, 1.5 * TILE_SIZE);
            for (let i = 0; i < health; i++) {
                ctx.fillStyle = 'red';
                ctx.fillText('♥', 1.5 * TILE_SIZE + ctx.measureText('Health: ').width + ctx.measureText('♥').width * i * 2, 1.5 * TILE_SIZE);
            }
        }
    }
}
export default Level;
