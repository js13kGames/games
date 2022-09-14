export class Portal
{

    static TYPE_BLUE = 0;
    static TYPE_ORANGE = 1;

    constructor(id) {

        this.reset();
    }
    reset()
    {
        this.pos = {
            x: -1,
            y: -1,
            z: -1
        }
        this.side = -1;
    }
    updatePosition(pos, side)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.pos.z = pos.z;

        this.side = side;
    }
}