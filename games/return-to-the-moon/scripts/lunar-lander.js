var g = (function(){

const ship = physics.physical(new Ship({
	top: [0, 10,  10, 0,  30, 0,  40, 10,  40, 30,  30, 40,  10, 40,  0, 30],
	core: [0,40, 40,40, 40,56, 0,56],
	engine: [15,56, 25,56, 30,70, 10,70],
	leg1: [],
	leg2: [],
}));
const moon = physics.physical(new CompositePolygon({ 
	chunk: [
		100,100, 300,0, 500,100, 
		600,300, 
		500,500, 300,600, 100,500,
		0,300
	]
}));
const physicalObjects = [moon, ship];

ship.mass = 1000;
moon.mass = 100000;

ship.name = 'ship';
moon.name = 'moon';

moon.pos.x = 400;
moon.pos.y = 500;

ship.rotation = Math.random() * 45;
ship.vel.y = -20 + Math.random() * -200;
ship.vel.x = 50 + Math.random() * 300;
ship.pos.x = -100;
ship.pos.y = 100;
// console.log(ship.pos, moon.pos);

// ---------------------------------------------
// Keyboard and mouse interaction

const input = new Input();
const worldSize = new XY(800, 600);
const offset = new XY();
let lastLoopTime = 0;
let continueLoop = true;
let disp;
const elts = {};

init();

return {
	input, ship, moon,
	start, stop
};

function $(q) { return document.querySelectorAll(q); }

function init() {
	document.addEventListener('DOMContentLoaded', () => {
		disp = $('#display')[0];
		elts.health = $('.health')[0];
		elts.speedX = $('.speedX')[0];
		elts.speedY = $('.speedY')[0];
		elts.fuel = $('.fuel')[0];
		elts.altitude = $('.altitude')[0];
		elts.intro = $('.intro')[0];
		elts.intro.classList.add('on');
		input.init(disp, document);
		input.anyKeyDownAction = begin;
	});
}

function begin() {
	input.anyKeyDownAction = () => {};
	elts.intro.classList.remove('on');
	const dl = $('dl');
	dl.forEach((elt) => { elt.classList.add('on'); });
	lastLoopTime = performance.now();
	continueLoop = true;
	window.requestAnimationFrame(loop);
}

function getCompositePolygonSvg(compPoly, outerClass = '', innerClass = '') {
	let svg = `<g class="${outerClass}" transform="${compPoly.getTransformStyle(offset)}" x="${compPoly.pos.x}" y="${compPoly.pos.y}">`;
	compPoly.parts.forEach((part) => {
		svg += getPolygonSvg(`${part.name} ${innerClass}`, part); // `<polygon class="${part.name} part" points="${part.polygon.getPointsString()}" />`;
	});
	svg += '</g>';
	return svg;
}

function getPolygonSvg(classNames, polygon) {
	return `<polygon class="${classNames}" points="${polygon.getPointsString()}" />`;
}

function draw(t) {
	const partClass = 'part ' + ship.getAlertLevel();
	disp.innerHTML = getCompositePolygonSvg(moon, 'moon') +  getCompositePolygonSvg(ship, 'ship', partClass);
	disp.setAttribute('viewBox', `0 0 ${worldSize.x} ${worldSize.y}`);
	elts.health.innerHTML = Math.ceil(ship.health);
	elts.speedX.innerHTML = Math.round(ship.vel.x);
	elts.speedY.innerHTML = Math.round(ship.vel.y);
	elts.fuel.innerHTML = Math.round(ship.fuel);
	elts.altitude.innerHTML = Math.round(getAltitude());
}

function getAltitude() {
	const r = moon.pos.getDistance(ship.pos);
	return r - moon.innerRadius - ship.innerRadius;
}

function loop(now) {
	let deltaT = (now - lastLoopTime) / 1000;
	if (input.leftRight) {
		ship.spin(input.leftRight * -3);
	}
	if (input.forwardBackward > 0) {
		ship.thrust(input.forwardBackward);
	}
	physics(physicalObjects, deltaT);
	const desiredOffset = new XY(
		(worldSize.x / 2) - ship.pos.x,
		(worldSize.y / 2.5) - ship.pos.y
	);
	// offset.multiply(2);
	offset.add(desiredOffset);
	offset.multiply(1 / 2);
	// console.log(ship.pos.x, ship.pos.y, offset);
	draw(deltaT);
	lastLoopTime = now;
	if (continueLoop) {
		window.requestAnimationFrame(loop);
	}
	if (ship.dead()) {
		$('.failure')[0].classList.add('on');
	} else if (getAltitude() < 0.5 && ship.vel.getMagnitude() < 0.5) {
		$('.win')[0].classList.add('on');
	}
}

function start() { continueLoop = true; }
function stop() { continueLoop = false; }

})();

// console.log(g);
