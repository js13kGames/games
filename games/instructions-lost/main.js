var level, light, levelsSeq, bugscount, bugsfound, timeSec = 60;
var lightAdd=0;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function levelInit() {
	timeEnd = new Date();
	timeEnd.setSeconds(timeEnd.getSeconds() + 31);
	level = levels[levelsSeq[levelN]];
	leveldatas = objMerge([elemdatas, level.datas]);
	light = objMerge([{w: 5, g: 1}, level.light]);
}

function levelChange() {
	$('#main')[0].innerHTML = '';
	init();
}

function initWindow() {
	winW = window.innerWidth;
	winH = window.innerHeight;
	gameSize = flr(Math.min(winW, winH) * .8);
	document.body.style = 'background:' + level.background;
	$('#main')[0].style = 'width:' + gameSize + 'px;height:' + gameSize + 'px;margin-top:' + ((winH - gameSize) / 2) + 'px;';
	xo = $('#main')[0].getBoundingClientRect().left;
	yo = $('#main')[0].getBoundingClientRect().top;
	var xb = ((winW - gameSize) / 2) / gameSize * 100 - light.w / 2 - light.g;
	var yb = ((winH - gameSize) / 2) / gameSize * 100 - light.w / 2 - light.g;
	light.x0 = -xb;
	light.x1 = 100 + xb;
	light.y0 = -yb;
	light.y1 = 100 + yb;
}

function initDraw() {
	//Light/Spot
	for (n = 0; n < light.s.q; n++) {
		if (light.s.v) {
			var spot = newEl('div');
			spot.className = 'spot';
			$('#main')[0].appendChild(spot);
		}
	}
	//Leaves
	bugscount = bugsfound = 0;
	for (var n = 0; n < level.dimx * Math.ceil(level.dimy); n++) {
		var l = newEl('div');
		l.className = 'lightable leaf';
		l.setAttribute('data-n', n);
		for (var key in leveldatas) {
			if (typeof (leveldatas[key]) === 'function') {
				l.setAttribute('data-' + key, leveldatas[key](l, n, level));
			} else {
				l.setAttribute('data-' + key, leveldatas[key]);
			}
		}
		$('#main')[0].appendChild(l);
	}
	//Header
	var head = newEl('div');
	head.setAttribute('id', 'head');
	head.className = 'ui';
	//Sliders
	var h = '';
	h += '&nbsp;Instructions lost';
	h += '<span class="credits"><span style="float:right;opacity:.5;">by Grégory Béal&nbsp;<br>@GregosEl&nbsp;</span></span>'
	head.innerHTML = h;
	$('#main')[0].appendChild(head);

	//Footer
	var foot = newEl('div');
	foot.setAttribute('id', 'foot');
	foot.className = 'ui';
	var h = '';
	h += '<div id="bugscount"></div>';
	h += '<div id="next"></div>';
	foot.innerHTML = h;
	$('#main')[0].appendChild(foot);

	//Light/Glow
	var glow = newEl('div');
	glow.className = 'glow';
	glow.style = 'width:' + (light.w + light.g * 2) + '%;height:' + (light.w + light.g * 2) + '%;';
	//Light/Lamp
	var lamp = newEl('div');
	lamp.className = 'glow';
	lamp.setAttribute('id', 'lamp');
	lamp.style = 'width:' + light.w + '%;height:' + light.w + '%;';
	$('#main')[0].appendChild(lamp);
	lampPlace(50, 50);
	uiDraw();
}

function refresh(now) {
	if (run) {
		lampDraw();
		uiDraw();
		timer = now;
		timeSec = Math.max(0, timeEnd - new Date());
		if (lightAdd > 0) {
			lightAdd -= .2;
			light.s.r += .2;
		}
		requestAnimationFrame(refresh);
	}
}

function lampPlaceAbs(x, y) {
	lampPlace(relX(x), relY(y));
}
function lampPlace(x, y) {
	light.x = mid(light.x0, x, light.x1);
	light.y = mid(light.y0, y, light.y1);
}

function lampDraw() {

	if (leafsel !== null) {
		var bw = gameSize * .0065;
		leafsel.style.borderWidth = bw + 'px';
		leafsel.style.margin = -bw + 'px';

	}
	Array.prototype.forEach.call($('.spot'), function (spot, n) {
		var surf = light.s.r + light.s.d * n;
		spot.style = 'background:' + light.s.c + ';width:' + surf + '%;height:' + surf + '%;opacity:' + ((light.s.q - n) / (light.s.q));
	});

	Array.prototype.forEach.call($('.spot'), function (e) {
		e.style.left = (light.x - parseFloat(e.style.width) / 2) + '%';
		e.style.top = (light.y - parseFloat(e.style.height) / 2) + '%';
	});

	var brs = Array(20);
	Array.prototype.forEach.call($('.lightable'), function (e) {
		brs.fill(1);
		if (data(e, 'b') !== 0) {
			brs[(Math.abs(data(e, 'b')) - 1) % level.bugs.types] = data(e, 'br');
		}
		//Repair leaf?
		if (data(e, 'b') < 1 && data(e, 'br') < 1) {
			e.dataset.br = Math.min(1, data(e, 'br') + .1);
		}

		var d = dist(light.x, light.y, parseFloat(e.dataset.x), parseFloat(e.dataset.y));
		var lumS = ((light.s.q - .5) * light.s.d) / 2;
		var lumr = light.s.r;
		var fac = mid(0, (lumS - d + lumr / 2) / (lumS), 1);
		var sizey;
		var sizex = sizey = 1 + fac * 3.5;

		switch (levelsSeq[levelN]) {
			case 'title':
				sizex = sizey = 5;
				e.style.transform = 'rotate(' + (data(e, 'r') * (1 - fac * brs[0])) + 'deg)';
				e.style.background = 'hsl(70, 26%, ' + (45 * (1 - fac * (1 - brs[1]))) + '%)';
				e.style.borderRadius = ((1 - brs[2]) * 50) + '%';
				break;

			case 'leaves':
				sizex = sizey = 3.5 + fac;
				e.style.transform = 'rotate(' + (data(e, 'r') * (1 - fac * brs[2])) + 'deg)';
				e.style.borderRadius = ((1 - fac * brs[1]) * 100) + '% 0';
				e.style.backgroundColor = 'hsl(' + (data(e, 'h') + fac * 100 * brs[0]) + ',' + (data(e, 's')) + '%,' + (data(e, 'l') + fac * 80 * brs[0]) + '%)';
				break;

			case 'halftones':
				var sizex = sizey = 1 + fac * (3.5 * brs[0]) + (0.8 * (1 - brs[2]));
				e.style.transform = 'rotate(45deg)';
				e.style.backgroundColor = '#000';
				e.style.borderRadius = (brs[1] * 50) + '%';
				break;

			case 'isoplanes':
				e.style.transform = 'scaleY(.5)rotate(' + (fac * 135) + 'deg)';
				break;

			case 'isocubes':
				sizex = 2.3 + fac * 4.5 * brs[0];
				sizey = 2.3 + fac * (2 + 2.5 * brs[1]);
				switch (e.dataset.t) {
					case '0'://Left
						e.style.transform = 'scaleX(' + (.6 + .266 * fac) + ')rotate(' + (45 * (1 - fac)) + 'deg)skewY(' + (fac * 27) + 'deg)';
						e.style.backgroundColor = 'hsl(252, 50%, ' + (38 * (1 - brs[2])) + '%)';
						break;
					case '1'://Top
						e.style.transform = 'scaleX(' + (.6 + .63 * fac) + ')scaleY(' + (1 - .28 * fac) + ')rotate(' + (45 + 90 * fac) + 'deg)';
						e.style.backgroundColor = 'hsl(277, 100%, ' + (82 * brs[2]) + '%)';
						break;
					case '2'://Right
						e.style.transform = 'scaleX(' + (.6 + .266 * fac) + ')rotate(' + (45 * (1 - fac)) + 'deg)skewY(-' + (fac * 27) + 'deg)';
						e.style.backgroundColor = 'hsl(272, 56%, ' + (47 * brs[2]) + '%)';
						break;
					case '3'://Disappear
						e.style.transform = 'scaleX(' + (1 - .4 * brs[0]) + ')rotate(' + (45 * brs[1]) + 'deg)';
						sizex = sizey = sizex * Math.max(0, (1 - fac * 1.5));
						e.style.backgroundColor = 'hsl(252, 50%, ' + (38 * brs[2]) + '%)';
						break;
				}
				break;

			case 'tvset':
				sizey = sizex = 2;
				sizex = sizey + fac * 3 * brs[1];
				e.style.transform = 'rotate(' + (data(e, 't') * 60) + 'deg)';
				if (data(e, 't') === 0) {
					e.style.transform = 'rotate(' + (timer * .1 % 360 * (brs[0] * 2 - 1) + 150) + 'deg)';
				} else if (brs[0] < 1) {
					sizex = sizey + 3 * (1 - brs[0]);
				}
				e.style.borderRadius = (100 * brs[3]) + 'px';
				e.style.backgroundColor = 'hsl(' + (data(e, 't') * 120 + 220) + ',' + (100 - 100 * fac * brs[2]) + '%,' + (40 + fac * 60 * brs[2]) + '%)';
				break;

			case 'pattern80':
				sizex = 2;
				sizey = sizex + 7 * fac * (brs[0] * .8 + .2);
				e.style.borderRadius = '999px';
				e.style.transform = 'rotate(' + ((data(e, 'r') * fac + timer * .04) * (brs[1] * 2 - 1) % 360) + 'deg)';
				var c = [406, 334, 215];
				e.style.backgroundColor = 'hsl(' + (226 * (1 - fac * brs[2]) + c[data(e, 't')] * fac * brs[2]) + ',' + (21 + fac * 79 * brs[2]) + '%, ' + (25 + 50 * fac * brs[2]) + '%)';
				break;

			case 'circuit':
				sizex = 1.6;
				sizey = sizex + 7.4 * fac * brs[0];
				sizex*=1+(1-brs[3])*.5;
				e.style.borderRadius = '999px';
				e.style.transform = 'rotate(' + (data(e, 't') * 60 + 30 * (1 - brs[2])) + 'deg)';
				e.style.backgroundColor = 'hsl(190, 100%, ' + (44 + 56 * (1 - brs[1])) + '%)';
				break;
			case 'columns':
				var n = data(e, 'n');
				var a = n / (24 * 24 / (Math.cos(timer * .001) * 8)) * Math.PI * 2 + timer * .001;
				var r = (n / 16) + 3;
				e.dataset.x = mid(0, 50 + Math.cos(a) * r, 100);
				e.dataset.y = mid(0, 50 + Math.sin(a) * r, 100);
				e.style.borderRadius = '50%';
				break;
			case 'weaving':
				sizex = 2 + fac * (2 * (1 - brs[0]));
				sizey = 2 + fac * 7.6 * brs[1];
				e.style.backgroundColor = 'hsl(14, 54%, 47%)';
				e.style.backgroundColor = 'hsl(' + (14 - 14 * fac) + ', ' + (54 + 45 * fac) + '%, ' + (47 + 6 * fac) + '%)';
				e.style.borderRadius = (50*(1-brs[2])*fac)+'px';
				if (e.dataset.t == 1) {
					e.style.backgroundColor = 'hsl(2, 49%, ' + (25 - 20 * fac) + '%)';
				}
				e.style.transform = 'rotate(' + (((data(e, 't') - .5) * 90) * fac) + 'deg)';
				break;
		}

		e.style.width = sizex + '%';
		e.style.height = sizey + '%';
		e.style.left = (data(e, 'x') + data(e, 'ox') * (1 - fac) - sizex / 2) + '%';
		e.style.top = (data(e, 'y') + data(e, 'oy') * (1 - fac) - sizey / 2) + '%';
	});
}

function bugFound() {
	bugsfound++;
	lightAdd = (40 / bugscount);
}

function uiDraw() {
	$('#lamp')[0].style.left = (light.x - light.w / 2 - light.g) + '%';
	$('#lamp')[0].style.top = (light.y - light.w / 2 - light.g) + '%';
	$('#lamp')[0].style.border = (gameSize * light.g / 100) + 'px solid #fff';

	$('#head')[0].style.fontSize = (gameSize / 20) + 'px';
	$('#head')[0].style.fontWeight = 'normal';

	$('.credits')[0].style.fontSize = (gameSize / 40) + 'px';
	
	$('#bugscount')[0].style.fontSize = (gameSize / 20) + 'px';
	$('#bugscount')[0].innerHTML = bugsfound + '/' + bugscount;

	$('#next')[0].style.fontSize = (gameSize / 20) + 'px';
	$('#next')[0].innerHTML = flr(timeSec / 1000);

	if (timeSec <= 0 || bugsfound === bugscount) {
		$('#next')[0].style.pointerEvents = 'auto';
		$('#next')[0].style.cursor = 'pointer';
		$('#next')[0].style.background = '#fff';
		$('#next')[0].style.color = 'rgba(0,0,0,1)';
		$('#next')[0].innerHTML = ">";
	} else {
		$('#next')[0].style.pointerEvents = 'none';
		$('#next')[0].style.cursor = 'default';
		$('#next')[0].style.background = 'rgba(255,255,255,.2)';
		$('#next')[0].style.color = 'rgba(255,255,255,1)';
	}
}

//Tiny JQuery-inspired functions
function $(s) {
	return document.querySelectorAll(s);
}
function newEl(el) {
	return document.createElement(el);
}

//Math
function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function flr(n) {
	return Math.floor(n);
}
function frnd(n) {
	return flr(rnd(n));
}
function mid(l, n, h) {
	if (n < l)
		return l;
	if (n > h)
		return h;
	return n;
}
function rnd(n) {
	return Math.random() * n;
}
//Returns relative X (%) from absolute X (px).
function relX(x) {
	return ((x - xo) / gameSize * 100);
}
//Returns relative Y (%) from absolute Y (px).
function relY(y) {
	return ((y - yo) / gameSize * 100);
}

//Various
function data(e, p) {
	return parseFloat(e.dataset[p]);
}
function pause() {
	run = !run;
}
//Merges and returns an objects list (aka Object.assign for ES<6)
function objMerge(ol) {
	var ot = {};
	ol.forEach(function (o) {
		for (var p in o) {
			ot[p] = o[p];
		}
	});
	return ot;
}

//Main
function launch() {
	timer = 0;
	run = true;
	mck = false;//Mouse click
	levelsInit();
	init();
	initEventsOnce();
	requestAnimationFrame(refresh);
}

function init() {
	leafsel = null;
	levelInit();
	initWindow();
	initDraw();
	initEventsAgain();
}

function initEventsOnce() {
	document.addEventListener('mousemove', function (e) {
		if (mck)
			lampPlaceAbs(e.clientX, e.clientY);
	});

	$('#main')[0].addEventListener('mouseover', function (e) {
		Array.prototype.forEach.call($('.leaf'), function (leaf) {
			if (leafsel !== null) {
				leafsel.style.borderWidth = '0';
				leafsel.style.margin = '0';
				leafsel = null;
			}
		});
	});

	document.addEventListener('mouseup', function (e) {
		mck = false;
	});
}

function initEventsAgain() {
	$('#lamp')[0].addEventListener('mousedown', function (e) {
		e.preventDefault();
		if (e.which === 1) {
			mck = true;
		}
	});

	Array.prototype.forEach.call($('.leaf'), function (leaf) {
		leaf.addEventListener('mouseover', function (e) {
			e.stopPropagation();
			if (leafsel !== null && leafsel !== leaf) {
				leafsel.style.borderWidth = '0';
				leafsel.style.margin = '0';
			}
			leafsel = leaf;
		});
		leaf.addEventListener('mousedown', function (e) {
			e.preventDefault();
			if (e.which === 1 && data(leaf, 'b') > 0) {
				leaf.dataset.b = -data(leaf, 'b');
				bugFound();
			}
		});
	});

	$('#next')[0].addEventListener('mousedown', function (e) {
		e.preventDefault();
		if (e.which === 1) {
			levelN = (levelN + 1) % levelsSeq.length;
			levelChange();
		}
	});

	Array.prototype.forEach.call($('input[type=range]'), function (range) {
		range.addEventListener('mousemove', function (e) {
			light.s[range.dataset.k] = parseFloat(range.value);
		});
	});

}

function levelsInit() {
	var col = {h: 200, rh: 60, s: 70, rs: 20, l: 16, rl: 4};
	elemdatas = {
		t: 0,
		ox: 0, oy: 0,
		x: function (l, n) {
			return n % level.dimx * 100 / (level.dimx - 1);
		},
		y: function (l, n) {
			return flr(n / level.dimx) * 100 / (level.dimy - 1);
		},
		b: function () {
			var bug = 0;
			var prob = mid(5, Math.sqrt(level.dimx * level.dimy), 50);
			if (rnd(prob) < 1) {
				bug = frnd(20) + 1;
				bugscount++;
			}
			return bug;
		},
		br: function (l) {
			return 0;
		},
	};
	levels = {
		title: {
			dimx: 11, dimy: 11,
			background: '#ccc276',
			light: {s: {v: true, r: 25, q: 3, d: 8, c: 'hsl(53, 74%, 66%)'}},
			bugs: {types: 3},
			datas: {r: 45 + 90},
		},
		leaves: {
			dimx: 24, dimy: 24,
			background: '#081238',
			light: {s: {v: true, r: 15, q: 10, d: 4, c: 'hsl(291,100%,14%)'}},
			bugs: {types: 3},
			datas: {
				ox: function () {
					return rnd(5) - 2.5;
				},
				oy: function () {
					return rnd(5) - 2.5;
				},
				r: function () {
					return rnd(360);
				},
				h: function () {
					return col.h + rnd(col.rh);
				},
				s: function () {
					return col.s + rnd(col.rs);
				},
				l: function () {
					return col.l + rnd(col.rl);
				},
			},
		},
		pattern80: {
			dimx: 24, dimy: 24,
			background: 'hsl(226, 21%, 15%)',
			light: {s: {v: false, r: 25, q: 5, d: 5, c: 'hsl(258, 27%, 35%)'}},
			bugs: {types: 3},
			datas: {
				t: function () {
					return frnd(3);
				},
				ox: function () {
					return rnd(5) - 2.5;
				},
				oy: function () {
					return rnd(5) - 2.5;
				},
				x: function (l, n) {
					return n % level.dimx * 100 / (level.dimx - 1) - data(l, 'ox');
				},
				y: function (l, n) {
					return flr(n / level.dimx) * 100 / (level.dimy - 1) - data(l, 'oy');
				},
				r: function () {
					return rnd(360);
				},
			},
		},
		halftones: {
			dimx: 24, dimy: 48,
			background: 'hsl(45, 100%, 51%)',
			light: {s: {v: false, r: 15, q: 8, d: 8, c: '#44cdce'}},
			bugs: {types: 3},
			datas: {
				x: function (l, n) {
					return (n - flr(n / level.dimx) % 2 / 2) % level.dimx * 100 / (level.dimx - 1);
				},
			},
		},
		isoplanes: {
			dimx: 16, dimy: 32,
			light: {s: {v: true, r: 15, q: 2, d: 20}},
			bugs: {types: 3},
			datas: {
				x: function (l, n) {
					return (n - flr(n / level.dimx) % 2 / 2) % level.dimx * 100 / (level.dimx - 1);
				},
			},
		},
		isocubes: {
			dimx: 16, dimy: 18.47,
			background: '#8e7dd0',
			light: {s: {v: true, r: 35, q: 6, d: 5}},
			bugs: {types: 3},
			datas: {
				x: function (l, n) {
					return (n - flr(n / level.dimx) % 2 / 2) % level.dimx * 100 / (level.dimx - 1);
				},
				t: function (l, n) {
					return ((flr(n / level.dimx) + flr(n % level.dimx) % 2 * 2) % 4);
				},

			},
		},
		tvset: {
			dimx: 24, dimy: 27.71,
			background: '#201746',
			light: {s: {v: true, r: 35, q: 6, d: 3,
					c: 'hsl(258, 40%, 25%)',
					c: 'hsl(230, 80%, 25%)',
				}},
			bugs: {types: 4},
			datas: {
				x: function (l, n) {
					return (n - flr(n / level.dimx) % 2 / 2) % level.dimx * 100 / (level.dimx - 1);
				},
				t: function (l, n) {
					return ((flr(n / level.dimx) + flr(n % level.dimx) % 2 * 2) % 4);
				},

			},
		},
		circuit: {
			dimx: 16, dimy: 18.47,
			background: 'hsl(192, 100%, 17%)',
			light: {s: {v: false, r: 35, q: 2, d: 6, c: 'hsl(258, 27%, 35%)'}},
			bugs: {types: 4},
			datas: {
				x: function (l, n) {
					return (n - flr(n / level.dimx) % 2 / 2) % level.dimx * 100 / (level.dimx - 1);
				},
				t: function (l, n) {
					return frnd(3);
				},

			},
		},
		columns: {
			dimx: 2, dimy: 20,
			background: '#99a4ad',
			light: {s: {v: false, r: 15, q: 5, d: 8, c: '#44cdce'}},
			bugs: {types: 3},
			datas: {
			},
		},
		weaving: {
			dimx: 12, dimy: 24,
			background: 'hsl(14, 45%, 33%)',
			light: {s: {v: true, r: 28, q: 5, d: 8, c: 'hsl(0, 85%, 32%)'}},
			bugs: {types: 3},
			datas: {
				x: function (l, n) {
					return (n - flr(n / level.dimx) % 2 / 2) % level.dimx * 100 / (level.dimx - 1);
				},
				t: function (l, n, level) {
					return (flr(n / level.dimx) % 2);
				},
			},
		},
	};
	levelsSeq = ['title', 'leaves', 'weaving', 'tvset', 'halftones', 'circuit', 'pattern80', 'isocubes'];
	levelN = 0;
}
window.onresize = function () {
	initWindow();
	uiDraw();
};

document.addEventListener('DOMContentLoaded', function () {
	launch();
});
