class Vec {
    static equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    static add(a, b) {
        return {x: a.x + b.x, y: a.y + b.y};
    }

    static subtract(a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    }

    static multiply(a, b) {
        return {x: a.x * b.x, y: a.y * b.y};
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }

    static scale(vec, fac) {
        return {x: vec.x * fac, y: vec.y * fac};
    }

    static rotate(vec, rad) {
        const sin = Math.sin(rad);
        const cos = Math.cos(rad);
        return {
            x: cos * vec.x - sin * vec.y,
            y: sin * vec.x + cos * vec.y
        };
    }

    static angle(vec) {
        return Math.atan2(vec.y, vec.x);
    }

    static length(vec) {
        return Math.hypot(vec.x, vec.y);
    }

    static length2(vec) {
        return vec.x ** 2 + vec.y ** 2;
    }

    static normalize(vec) {
        const length = Vec.length(vec);
        if (length === 0) return vec;
        return Vec.scale(vec, 1 / length);
    }

    static floor(vec) {
        return {x: Math.floor(vec.x), y: Math.floor(vec.y)};
    }

    static flip(vec) {
        return {x: vec.y, y: vec.x};
    }

    static distance(a, b) {
        return Vec.length(Vec.subtract(b, a));
    }

    static distance2(a, b) {
        return Vec.length2(Vec.subtract(b, a));
    }
}
