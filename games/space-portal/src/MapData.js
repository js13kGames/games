export class MapData
{
    static BLOCK_WALL = 1;
    static BLOCK_EMPTY = 0;
    static BLOCK_VOID = -1;

    constructor(blocks = [[[MapData.BLOCK_WALL]]], startingPosition = {x:0,y:1,z:0}, endPos = {x:0,y:1,z:0}, hue = 0) {
        this.blocks = blocks;
        this.startingPosition = startingPosition;
        this.size = {
            x: blocks.length,
            y: blocks[0].length,
            z: blocks[0][0].length
        }
        this.endPos = endPos;
        this.hue = hue;
    }

    updateAtPosition(x,y,z,type)
    {
        if(this.blocks[x] === undefined)
            this.blocks[x] = [];

        if(this.blocks[x][y] === undefined)
            this.blocks[x][y] = [];

        this.blocks[x][y][z] = type;
    }

    blockAt(x,y,z)
    {
        let block = MapData.BLOCK_VOID;
        if(this.blocks[x] && this.blocks[x][y] && this.blocks[x][y][z] !== undefined)
            block = this.blocks[x][y][z];

        return block;
    }


}