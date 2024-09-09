import { MAX_JUMP_VELOCITY, TILE_SIZE } from './constants.js';
import { keyPressed } from './controller.js';
import BoundingBoxCorners from './enums/bounding_box_corners.js';
import { ctx } from './common.js';
class Player {
    constructor(startingPoint) {
        this.dx = 0;
        this.dy = 0;
        this.#storedVelocity = 0;
        this.#isJumped = false;
        this.isOnGround = true;
        this.#health = 3;
        this.#jumpAcceleration = -2;
        this.#moveAcceleration = 0.3;
        this.#boundingBox = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
        ];
        let { x, y } = startingPoint;
        this.#x = x;
        this.#y = y - 1;
        this.adjustBoundingBox();
    }
    #x;
    #y;
    #storedVelocity;
    #isJumped;
    #health;
    #jumpAcceleration;
    #moveAcceleration;
    #boundingBox;
    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    set y(y) {
        this.#y = y;
    }
    set x(x) {
        this.#x = x;
    }
    get health() {
        return this.#health;
    }
    get isJumped() {
        return this.#isJumped;
    }
    get boundingBox() {
        return this.#boundingBox;
    }
    loseLife() {
        this.#health--;
    }
    isDead() {
        if (this.#health === 0) {
            return true;
        }
        return false;
    }
    move(timeStep) {
        if (keyPressed[4 /* Right */] && this.dx < 10) {
            this.dx += this.#moveAcceleration;
        }
        else if (keyPressed[3 /* Left */] && this.dx > -10) {
            this.dx += -this.#moveAcceleration;
        }
        else {
            this.dx *= 0.6;
        }
        this.x += this.dx * timeStep;
    }
    jump(timeStep) {
        if (this.isOnGround) {
            if (keyPressed[1 /* Jump */]) {
                this.#storedVelocity += this.#jumpAcceleration;
                this.#storedVelocity = Math.max(this.#storedVelocity, -MAX_JUMP_VELOCITY);
            }
            if (!keyPressed[1 /* Jump */] || this.#storedVelocity === -MAX_JUMP_VELOCITY) {
                this.dy = this.#storedVelocity;
                this.isOnGround = false;
                this.#storedVelocity = 0;
            }
        }
        this.y += this.dy * timeStep;
    }
    adjustBoundingBox() {
        this.#boundingBox[BoundingBoxCorners.upLeft] = [this.#x, this.#y];
        this.#boundingBox[BoundingBoxCorners.upRight] = [this.#x + TILE_SIZE, this.#y];
        this.#boundingBox[BoundingBoxCorners.downRight] = [this.#x + TILE_SIZE, this.#y + TILE_SIZE];
        this.#boundingBox[BoundingBoxCorners.downLeft] = [this.#x, this.#y + TILE_SIZE];
    }
    render() {
        if (ctx !== null) {
            ctx.strokeStyle = '#39658C';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.boundingBox[0][0], this.boundingBox[0][1], TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#39658C';
            const facialFeatureSize = TILE_SIZE / 6;
            if (this.dx >= 0) {
                ctx.fillRect(this.boundingBox[0][0] + 2 * facialFeatureSize, this.boundingBox[0][1] + facialFeatureSize, facialFeatureSize, facialFeatureSize); // left eye
                ctx.fillRect(this.boundingBox[0][0] + 4 * facialFeatureSize, this.boundingBox[0][1] + facialFeatureSize, facialFeatureSize, facialFeatureSize); // right eye
                ctx.fillRect(this.boundingBox[0][0] + 2 * facialFeatureSize, this.boundingBox[0][1] + 3 * facialFeatureSize, 3 * facialFeatureSize, facialFeatureSize); // mouth
            }
            else {
                ctx.fillRect(this.boundingBox[0][0] + facialFeatureSize, this.boundingBox[0][1] + facialFeatureSize, facialFeatureSize, facialFeatureSize); // left eye
                ctx.fillRect(this.boundingBox[0][0] + 3 * facialFeatureSize, this.boundingBox[0][1] + facialFeatureSize, facialFeatureSize, facialFeatureSize); // right eye
                ctx.fillRect(this.boundingBox[0][0] + facialFeatureSize, this.boundingBox[0][1] + 3 * facialFeatureSize, 3 * facialFeatureSize, facialFeatureSize); // mouth
            }
        }
    }
}
export default Player;
