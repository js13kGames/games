var map = (function(){
return {
	width:		1024,
	height:		1024,
	shift:		10,  // power of two: 2^10 = 1024
	altitude:	new Uint8Array(1024*1024), // 1024 * 1024 byte array with height information
	color:		new Uint32Array(1024*1024), // 1024 * 1024 int array with RGB colors
	depots: [],
	setup: setupMap
};

function setupMap() {
	const baseAlt = 10;
	for(let i = 0; i < map.altitude.length; i++) {
		setAltitudeAtIndex(i, baseAlt);
	}
	generateTerrain(0.7, 2000);
	console.time('set mountains and holes');
	setMountains();
	setHoles();
	console.timeEnd('set mountains and holes');
	console.time('smooth');
	// smoothMap(1);
	smoothMap(5);
	smoothMap(2);
	console.timeEnd('smooth');
	// altitude o - 118 .... set to ~200
	console.time('set color and depots');
	setMapColor();
	setDepots();
	console.timeEnd('set color and depots');
}


function generateTerrain(roughness = 0.7, altScale = 1000) {
	// http://www.playfuljs.com/realistic-terrain-in-130-lines/
	console.time('generateTerrain');
	const max = map.width - 1;
	let seed = 9;
	setAltitude(0, 0, altScale);
	setAltitude(max, 0, altScale / 2);
	setAltitude(max, max, altScale / 2);
	setAltitude(0, max, altScale / 2);
	divide(max, altScale);

	function divide(size, altSize) {
	  let x, y; 
	  const half = size / 2;
	  const scale = roughness * altSize;
	  if (half < 1) {
	  	return;
	  }
	  for (y = half; y < max; y += size) {
	    for (x = half; x < max; x += size) {
	      square(x, y, half, getAlt(++seed, scale));
	    }
	  }
	  for (y = 0; y <= max; y += half) {
	    for (x = (y + half) % size; x <= max; x += size) {
	      diamond(x, y, half, getAlt(++seed, scale));
	    }
	  }
	  divide(half, altSize / 2);
	}

	function getAlt(seed, scale) {
		return getPseudoRandom(++seed) * (scale * 2) - scale;
	}

	function average(values) {
	  var valid = values.filter(function(val) { return val !== -1; });
	  var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
	  return total / valid.length;
	}

	function square(x, y, size, offset) {
	  const avg = average([
	    getAltitude(x - size, y - size),   // upper left
	    getAltitude(x + size, y - size),   // upper right
	    getAltitude(x + size, y + size),   // lower right
	    getAltitude(x - size, y + size)    // lower left
	  ]);
	  setAltitude(x, y, avg + offset);
	}

	function diamond(x, y, size, offset) {
	  const avg = average([
	    getAltitude(x, y - size),      // top
	    getAltitude(x + size, y),      // right
	    getAltitude(x, y + size),      // bottom
	    getAltitude(x - size, y)       // left
	  ]);
	  setAltitude(x, y, avg + offset);
	}
	console.timeEnd('generateTerrain');
}


function setMountains() {
	const mtSize = 200;
	let seed = 100;
	const radiusScale = 200;
	for(let m = 0; m < 50; m++) {
		seed += m;
		const x = getPseudoRandomInt(seed, map.width);
		const y = getPseudoRandomInt(++seed, map.height);
		const mAlt = getPseudoRandomInt(++seed, mtSize);
		const radius = getPseudoRandomInt(++seed, radiusScale);
		loopCircle(x, y, radius, (x, y) => {
			let alt = getAltitude(x, y);
			alt = Math.max(alt, mAlt/3);
			setAltitude(x, y, alt);
		});
		loopCircle(x, y, radius/2, (x, y) => {
			let alt = getAltitude(x, y);
			alt = (alt + mAlt/2) / 2;
			setAltitude(x, y, alt);
		});
		loopCircle(x, y, radius/3, (x, y) => {
			let alt = getAltitude(x, y);
			alt = (alt + mAlt + mAlt) / 3;
			setAltitude(x, y, alt);
		});
	}
}

function setHoles() {
	let seed = 4;
	const radiusScale = 100;
	for(let m = 0; m < 30; m++) {
		seed += m;
		const x = getPseudoRandomInt(seed, map.width);
		const y = getPseudoRandomInt(++seed, map.height);
		const radius = getPseudoRandomInt(++seed, radiusScale);
		const water = getPseudoRandom(++seed) < 0.3;
		loopCircle(x, y, radius, (x, y) => {
			let alt = getAltitude(x, y);
			alt /= 2;
			setAltitude(x, y, alt);
		});
		loopCircle(x, y, radius/2, (x, y) => {
			let alt = getAltitude(x, y);
			alt = water ? 0 : alt/3;
			setAltitude(x, y, alt);
		});
	}
}

function smoothMap(radius = 5) {
	// TODO: Should use something like https://github.com/flozz/StackBlur/blob/master/src/stackblur.js
	for(let i = 0; i < map.altitude.length; i++) {
		let y = Math.floor(i / map.width);
		let x = i - (y * map.width);
		const alts = [map.altitude[i]];
		loopSquare(x, y, radius, (x, y) => {
			alts.push(getAltitude(x, y));
		});
		const sumReducer = (acc, curr) => acc + curr;
		const sum = alts.reduce((acc, curr) => acc + curr);
		const smoothedAlt = sum / alts.length;
		setAltitudeAtIndex(i, smoothedAlt);
	}
}

function getAltitude(x, y) {
	let i = getXYIndex(x, y);
	if (i < 0) { i = map.altitude.length - i; }
	else if (i >= map.altitude.length) { i -= map.altitude.length; }
	return map.altitude[i];
}

function getXYIndex(x, y) {
	return Math.round(x + y * map.height);
}

function setAltitude(x, y, n) {
	setAltitudeAtIndex(getXYIndex(x, y), n);
}

function setAltitudeAtIndex(i, n) {
	map.altitude[i] = n ? Math.round(n) : 0;
}

function setMapColor() {
	const maxColor = 200;
	for(let y = 0; y < map.height; y++) {
		let shadow = 0;
		for (let x = 0; x < map.width; x++) {
			const i = x + (y * map.height);
			const altitude = map.altitude[i];
			let a = 40 + altitude * 1.1;
			if (map.altitude[i] < map.altitude[i - 1]) {
				if (shadow === 0) {
					shadow += 10;
				}
				shadow += 4;
			} else {
				shadow -= 7;
			}
			shadow = Math.min(70, Math.max(shadow, 0));
			a -= shadow;
			a = Math.max(a, 0);
			let r = a + (Math.random() * 5);
			let g = (altitude === 0) ? 100 + (Math.random() * 15) : a;
			let b = a * 1.5;
			r = Math.min(r, maxColor);
			g = Math.min(g, maxColor);
			b = Math.min(b, maxColor);
			map.color[i] = 0xFF000000 | (b << 16) | (g << 8) | r;
		}
	}
}

function setDepots() {
	map.depots.length = 0;
	let seed = 2;
	for (let d = 0; d < 2; d++) {
		const depot = {
			x: getPseudoRandomInt(++seed, map.width),
			y: getPseudoRandomInt(++seed, map.height),
			radius: 8,
			topRadius: 4,
			baseAltitude: 0,
			topAltitude: 0,
			baseColor: 0xFFaaaa44,
			topColor: (d == 1) ? 0xFF779999 : 0xFF999977,
			type: (d == 1) ? 'fuel' : 'parts',
			quantity: 100,
		};
		depot.baseAltitude = getAltitude(depot.x, depot.y) + 6;
		depot.topAltitude = depot.baseAltitude + 10;
		map.depots.push(depot);
		setSquare(depot.x, depot.y, depot.baseColor, depot.baseAltitude, depot.radius);
		setSquare(depot.x, depot.y, depot.topColor, depot.topAltitude, depot.topRadius);
	}
}

function setSquare(baseX, baseY, color, alt, radius) {
	loopSquare(baseX, baseY, radius, (x, y) => {
		const i = getXYIndex(x, y);
		map.altitude[i] = alt;
		map.color[i] = color;
	});
}

function loopSquare(baseX, baseY, radius, callback) {
	for (let x = baseX - radius; x <= baseX + radius; x++) {
		for (let y = baseY - radius; y <= baseY + radius; y++) {
			callback(x, y);
		}
	}
}

function loopCircle(baseX, baseY, radius, callback) {
	loopSquare(baseX, baseY, radius, (x, y) => {
		if (distanceBetweenPoints(baseX, baseY, x, y) <= radius) {
			callback(x, y);
		}
	});
}

function distanceBetweenPoints(x1, y1, x2, y2) {
	return Math.sqrt( Math.pow( (x1 - x2), 2) + Math.pow( (y1 - y2), 2) );
}

// Helpers

function getPseudoRandomInt(seed, n) {
	return Math.round(getPseudoRandom(seed) * n);
}

function getPseudoRandom(seed) {
	// http://stackoverflow.com/a/19303725/1766230
	var x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

})();