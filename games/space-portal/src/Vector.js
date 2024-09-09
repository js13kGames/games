export class Vector
{
    constructor(x, y, z)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    multiply(amount)
    {
        if(amount instanceof Vector)
        {
            this.x *= amount.x;
            this.y *= amount.y;
            this.z *= amount.z;
        }
        else
        {
            this.x *= amount;
            this.y *= amount;
            this.z *= amount;
        }
    }
    dot(v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    length()
    {
        return Math.sqrt(this.dot(this));
    }

    unit()
    {
        const length = this.length();
        if(length !== 0)
        {
            this.x = this.x / length;
            this.y = this.y / length;
            this.z = this.z / length;
        }
    }

    rotateBy(by)
    {
        const length = this.length();
        const angle = Math.atan2(this.y, this.x) + by;

        const tempVector = new Vector(Math.cos(angle), Math.sin(angle));
        tempVector.unit();
        tempVector.multiply(length);

        this.x = tempVector.x;
        this.y = tempVector.y;
        this.z = tempVector.z;

    }
}