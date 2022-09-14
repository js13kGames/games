class CompositePolygon {
	constructor(parts = []) {
		const s = this;
		s.parts = [];
		s.rotation = 0;
		let partKeys = Object.keys(parts);
		partKeys.forEach((key) => {
			s.parts.push(new Polygon(parts[key], key));
		});
		s.pos = new XY();
		s.center = new XY();
		s.size = new XY();
		s.halfSize = new XY();
		s.innerRadius = 0;
		s.outerRadius = 0;
		s.setDimensions();
	}

	rotate(theta) {
		this.rotation += theta;
	}

	setDimensions() {
		const s = this;
		let minX = Infinity, minY = minX;
		let maxX = -Infinity, maxY = maxX;
		s.parts.forEach((part) => {
			part.forEachPoint((x, y) => {
				if (x > maxX) { maxX = x; }
				if (x < minX) { minX = x; }
				if (y > maxY) { maxY = y; }
				if (y < minY) { minY = y; }
			});
		});
		s.size.y = maxY - minY; // height
		s.size.x = maxX - minX; // width
		s.halfSize = s.size.getMultiply(0.5);
		s.innerRadius = Math.min(s.halfSize.x, s.halfSize.y);
		s.outerRadius = Math.max(s.halfSize.x, s.halfSize.y);
		s.center.x = minX + s.halfSize.x;
		s.center.y = minY + s.halfSize.y;
	}

	getTransformStyle(offset = {}) {
		let {x,y} = this.pos;
		if (offset.x) { x += offset.x; }
		if (offset.y) { y += offset.y; }
		const hs = this.halfSize;
		x -= hs.x;
		y -= hs.y;
		return `translate(${x},${y}) rotate(${this.rotation} ${hs.x} ${hs.y})`;
	}
}
