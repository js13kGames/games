const max = Math.max;
const min = Math.min;
const abs = Math.abs;
const dist = (x1, y1, x2, y2) => {
    return Math.hypot(x2 - x1, y2 - y1);
}
const dist2 = (x1, y1, x2, y2) => {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}
const distm = (x1, y1, x2, y2) => {
    return abs(x2 - x1) + abs(y2 - y1);
}
const createRectangle = (x, y, width, height) => {
    return [
        { x1: x, y1: y, x2: x + width, y2: y },
        { x1: x, y1: y, x2: x, y2: y + height },
        { x1: x + width, y1: y, x2: x + width, y2: y + height },
        { x1: x, y1: y + height, x2: x + width, y2: y + height },
    ]
}

const createPolygon = (x, y, radius, sides) => {
    let lines = [];
    let start;
    let last;
    let end;
    for (let i = 0; i < sides; i++) {
        let currPoint = {
            x: Math.cos((i / sides) * Math.PI * 2) * radius + x,
            y: Math.sin((i / sides) * Math.PI * 2) * radius + y
        }
        if (i === 0) {
            start = currPoint;
            last = currPoint;
            continue;
        }
        lines.push({
            x1: last.x,
            y1: last.y,
            x2: currPoint.x,
            y2: currPoint.y
        })
        if (i === sides - 1) {
            end = currPoint;
        }
        last = currPoint;
    }
    lines.push({
        x1: end.x,
        y1: end.y,
        x2: start.x,
        y2: start.y
    });
    return lines;
}
const xyToMxb = (line) => {
    const m = (line.y2 - line.y1) / (line.x2 - line.x1);
    return {
        m,
        b: line.y1 - m * line.x1
    }
}

const isHorizontal = (line) => {
    return line.y1 === line.y2;
}

const isVertical = (line) => {
    return line.x1 === line.x2;
}
const isClose = (a, b) => {
    return abs(a - b) <= 1e-9;
}
const intersect = (line1, line2) => {
    if (isVertical(line2)) {
        return intersectVertical(line1, line2);
    }
    if (isVertical(line1)) {
        return intersectVertical(line2, line1);
    }
    const oldLine2 = line2;
    const oldLine1 = line1;
    line1 = xyToMxb(line1);
    line2 = xyToMxb(line2);
    const x = (line2.b - line1.b) / (line1.m - line2.m);
    const y = line1.m * x + line1.b;
    return {
        intersect: onSegment(oldLine2.x1, oldLine2.y1, x, y, oldLine2.x2, oldLine2.y2) && onSegment(oldLine1.x1, oldLine1.y1, x, y, oldLine1.x2, oldLine1.y2),
        point: { x, y }
    }
}
const intersectVertical = (line, vertical) => {
    const oldLine1 = line;
    const x = vertical.x1;
    line = xyToMxb(line);
    const y = line.m * x + line.b;
    return {
        intersect: onSegment(vertical.x1, vertical.y1, x, y, vertical.x2, vertical.y2) && onSegment(oldLine1.x1, oldLine1.y1, x, y, oldLine1.x2, oldLine1.y2),
        point: { x, y }
    }
}
const intersectCircle = (line, circle) => {
    const oldLine = line;
    line = xyToMxb(line);
    const m = line.m;
    const b = line.b;
    const h = circle.x;
    const k = circle.y;
    const r = circle.r;
    const x1 = (
        (-h - k * m + m * b + Math.sqrt(-1 * m ** 2 * h ** 2 + 2 * k * m * h - 2 * m * b * h + 2 * k * b + m ** 2 * r ** 2 + r ** 2 - k ** 2 - b ** 2)) /
        (-1 - m ** 2)
    );
    const x2 = (
        (-h - k * m + m * b - Math.sqrt(-1 * m ** 2 * h ** 2 + 2 * k * m * h - 2 * m * b * h + 2 * k * b + m ** 2 * r ** 2 + r ** 2 - k ** 2 - b ** 2)) /
        (-1 - m ** 2)
    );
    const y1 = m * x1 + b;
    const y2 = m * x2 + b;
    return [{
        intersect: onSegment(oldLine.x1, oldLine.y1, x1, y1, oldLine.x2, oldLine.y2),
        point: { x: x1, y: y1 }
    }, {
        intersect: onSegment(oldLine.x1, oldLine.y1, x2, y2, oldLine.x2, oldLine.y2),
        point: { x: x2, y: y2 }
    }];
}
const onSegment = (x1, y1, px, py, x2, y2) => {
    return isClose(distm(x1, y1, px, py) + distm(px, py, x2, y2), distm(x1, y1, x2, y2));
}
const perpendicularLine = (line, point) => {
    return {
        m: -(1 / line.m),
        b: point.y + (point.x / line.m)
    }
}
const perpendicularDistance = (line, point) => {
    let oldLine = line;
    if (isHorizontal(line)) {
        let lowerBound;
        let upperBound;
        if (line.x1 > line.x2) {
            upperBound = line.x1;
            lowerBound = line.x2;
        } else {
            upperBound = line.x2;
            lowerBound = line.x1;
        }
        if (point.x < lowerBound || point.x > upperBound) {
            return Infinity;
        }
        return Math.abs(line.y1 - point.y);
    }
    if (isVertical(line)) {
        let lowerBound;
        let upperBound;
        if (line.y1 > line.y2) {
            upperBound = line.y1;
            lowerBound = line.y2;
        } else {
            upperBound = line.y2;
            lowerBound = line.y1;
        }
        if (point.y < lowerBound || point.y > upperBound) {
            return Infinity;
        }
        return Math.abs(line.x1 - point.x);
    }
    line = xyToMxb(line);
    const pline = perpendicularLine(line, point);
    const x = (pline.b - line.b) / (line.m - pline.m);
    const y = line.m * x + line.b;
    if (!onSegment(oldLine.x1, oldLine.y1, x, y, oldLine.x2, oldLine.y2)) {
        return Infinity;
    }
    return dist(x, y, point.x, point.y);
}
const perpendicularPoint = (line, point) => {
    let oldLine = line;
    if (isHorizontal(line)) {
        return { x: point.x, y: line.y1 }
    }
    if (isVertical(line)) {
        return { x: line.x1, y: point.y }
    }
    line = xyToMxb(line);
    const pline = perpendicularLine(line, point);
    let x = (pline.b - line.b) / (line.m - pline.m);
    let y = line.m * x + line.b;
    /*if (!onSegment(oldLine.x1, oldLine.y1, x, y, oldLine.x2, oldLine.y2)) {
        return Infinity;
    }*/
    if (Number.isNaN(x)) {
        x = 0;
    }
    if (Number.isNaN(y)) {
        y = 0;
    }
    return { x, y };
}