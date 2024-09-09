class Polygon {
	constructor(arr, name) {
		var p = this;
		p.arr = arr;
		p.name = name;
	}

	forEachPoint(callback) {
		let a = this.arr;
		for(let i = 0; i < a.length; i += 2) {
			let more = (i < a.length - 2);
			callback(a[i], a[i + 1], more);
		}		
	}

	getPointsString() {
		let s = '';
		this.forEachPoint((x, y, more) => {
			s += `${x} ${y}` + (more ? ',' : '');
		});
		return s;
	}
}