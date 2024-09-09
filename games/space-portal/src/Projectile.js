
import {Vector} from "./Vector.js";
import {MapData} from "./MapData.js";

export class Projectile
{
    static TYPE_BLUE = 0;
    static TYPE_ORANGE = 1;
    static TYPE_SHURIKEN = 999;
    constructor(pos, rot, type, mapData)
    {
        this.pos = {
            x: pos.x,
            y: pos.y,
            z: pos.z
        }

        this.rot = {
            x: rot.x,
            y: rot.y
        }

        this.previousCube = '-1|-1|-1';
        this.currentCube = '-1|-1|-1';

        this.mapData = mapData;

        this.destinationReached = false;
        this.portalSide = -1;




        this.type = type;

        const yfactor = (1 - Math.abs(Math.sin(rot.y) ** 5));
        this.moveVector = new Vector( yfactor * Math.sin(rot.x), Math.sin(rot.y), yfactor * -Math.cos(rot.x));


    }

    move(delta)
    {
        this.pos.x += this.moveVector.x / 100 * delta;
        this.pos.y += this.moveVector.y / 100 * delta;
        this.pos.z += this.moveVector.z / 100 * delta;
        this.currentCube = Math.floor(this.pos.x) + '|' + Math.floor(this.pos.y) + '|' + Math.floor(this.pos.z);
        if(this.currentCube !== this.previousCube)
        {
            this.changeBlock();
        }
    }

    changeBlock()
    {
        const currentBlock = {
            x: Math.floor(this.pos.x),
            y: Math.floor(this.pos.y),
            z: Math.floor(this.pos.z)
        };

        const previousCubeNums = this.previousCube.split('|').map(x=>Number(x));
        const previousBlock = {
            x: previousCubeNums[0],
            y: previousCubeNums[1],
            z: previousCubeNums[2]
        };

        if(this.mapData.blockAt(currentBlock.x, currentBlock.y, currentBlock.z) === MapData.BLOCK_WALL)
        {
            this.moveVector =  new Vector(0,0,0);

            this.currentBlock = currentBlock;

            if(currentBlock.z > previousBlock.z)
            {
                this.portalSide = 0;
            }
            else if(currentBlock.z < previousBlock.z)
            {
                this.portalSide = 1;
            }
            else if(currentBlock.x > previousBlock.x)
            {
                this.portalSide = 2;
            }
            else if(currentBlock.x < previousBlock.x)
            {
                this.portalSide = 3;
            }

            this.destinationReached = true;

            this.previousCube = this.currentCube;
        }
        else
        {
            this.previousCube = this.currentCube;
        }
    }
}