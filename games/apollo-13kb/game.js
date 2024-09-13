const win = window;
const doc = document;
const $ = (q) => doc.querySelector(q);
const $id = (id) => doc.getElementById(id);
const $html = (id, h) => $id(id).innerHTML = h;
const synth = win.speechSynthesis;
const listen = win.addEventListener;
const wait = win.setTimeout;
const BOX_SIZE = 400;
const HALF = BOX_SIZE / 2;
const { random, floor } = Math;

const N = null;
const BARK_TIME = 9000;

const fuelCell = 'M2,0 h10 v13 h2 v15 h-14 v-15 h2 Z';
const oTank = 'M4,4 l4,-4 h7 l4,4 v7 l-4,4 h-7 l-4,-4 Z';
const f = {
	sound: 1,
}; // Flags
const buttonActions = {};

let // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
zzfxV=.3,               // volume
zzfxX=new AudioContext; // audio context
const zzfx=                   // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
=f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)
%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a<
e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(h
-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
b.buffer=p;b.connect(zzfxX.destination);b.start()}

const SOUNDS = {
	click: () => zzfx(...[.9,,51,,.02,.03,3,3.8,,5,,,,,,,,.54,,,-1492]),
	beep: () => zzfx(...[1.4,,641,.02,.05,.16,,2.7,,,269,.06,,,,,.07,.56,.03,,-1234]),
	pwrdn: () => zzfx(...[1.5,,482,.04,.23,.39,1,3.7,8,,-94,.08,.1,,,,,.86,.17,.02,670]),
	pwrup: () => zzfx(...[1.1,,512,.09,.14,.35,1,3.9,,,-175,.06,.09,,,.1,,.61,.1]),
	boom: () => zzfx(...[2.2,,91,.04,.12,.43,4,3.8,9,,,,,1.5,,.4,.3,.43,.23]),
	sep: () => zzfx(...[1.5,,98,.02,.14,.79,4,.2,,,,,.11,1.6,26,.5,.37,.4,.25,.26,-3431]),
	door: () => zzfx(...[.9,,372,.01,.09,.15,3,1.7,,,50,,.01,1.6,1,.1,,.7,.04,.17,-2456]),
	burn: () => zzfx(...[,,52,.05,.27,.54,4,1.3,,-4,,,,1.5,,.8,,.3,.16,,143]),
};

const HATCH_CLOSED_PATH = 'M8,0 h15 v12 v-12 h15 l8,12 h-46 Z';
const HATCH_OPEN_PATH = 'M8,0 h8 v12 h14 v-12 h8 l8,12 h-46 Z';

function sound(name) {
	if (f.sound && SOUNDS[name]) SOUNDS[name]();
}

function checkFuelCell() {
	if (f.checkFC) return;
	sound('click');
	f.checkFC = f.blast;
	allParts['SM-fuel-cell-2'].status = (f.blast) ? 'LOW' : 'nominal';
	['SM-fuel-cell-1', 'SM-fuel-cell-3'].forEach(
		(id) => {
			const p = allParts[id];
			if (f.blast) {
				p.classes.push('err');
				p.status = 'WARNING';
			} else {
				p.status = 'nominal';
			}
		}
	);
	zoomOut();
	render();
}

function doBurn() {
	zoomOut();
	sound('burn');
	allParts.flame.hidden = 0;
	render();
	const id = setInterval(() => sound('burn'), 150);
	wait(() => {
		allParts.flame.hidden = 1;
		render();
		clearInterval(id);
	}, 2000);
}
win.doBurn = doBurn;

function lmBurn() {
	if (f.freeReturn) {
		f.reentryCourse = 1;
		doBurn();
	} else if (f.atMoon) {
		f.freeReturn = 1;
		f.atMoon = 0;
		doBurn();
	} else {
		speakGroundControl('Please do not fire the thrusters now or you will go off course.');
	}
}

function separate(module) {
	// if (!allParts.CM.command) return;
	sound('click');
	zoomOut();
	wait(() => {
		sound('sep');
		allParts[module].disconnected = 1;
		render();
		if (!f.reentryCourse) speakGroundControl('Oh no, what have you done?');
	}, 2000);
}

const explosionPart = {
	a: 'M0,30 l2,2 v-4 Z',
};
const rcsLeft = 'M0,0 h-5 l1,-5 h-5 l1,5 h-4 v4 l-4,-1 v5 l4,-1 v4 h4 l-1,5 h5 l-1,-5 h5 Z';
const rcsRight = 'M0,0 h5 l-1,-5 h5 l-1,5 h4 v4 l4,-1 v5 l-4,-1 v4 h-4 l1,5 h-5 l1,-5 h-5 Z';

const ship = {
	rot: 0,
	x: 0,
	y: 0,
	w: 134,
	h: 390,
	id: 'ship',
	p: '',
	classes: [],
	children: [
		{
			id: 'LM',
			rot: 1,
			w: 134,
			h: 150,
			p: (
				`67,20 130,20 130,70 94,70` // lander
				+ ` 94,76 114,76 124,80 126,100 126,130 120,140`
				+ ` 80,145 77,150 57,150 54,145` // top
				+ ` 14,140 8,130 8,100 10,80 20,76 40,76 `
				+ ` 40,70 4,70 4,20` // lander
			),
			a: 	(`M35,20 v50 h64 v-50` // lines on lander
			),
			t: 'The Lunar Module (LM or "lim") is used to land on the surface of the moon.',
			command: 0,
			power: 100,
			children: [
				{
					id: 'LM-label',
					x: -50,
					y: 70,
					hidden: 1,
					svg: `<g class="label"><text>Lunar</text><text y="20">Module</text></g>`,
				},
				{
					id: 'LM-d-eng',
					x: 52,
					y: 10,
					p: '0,0 30,0 20,10 10,10',
					t: 'The descent engines of the LM can be used for ship navigation in a pinch.',
					status: 'Undamaged',
					b: [['LM-burn', 'Burn', lmBurn]],
					children: [
						{
							id: 'flame',
							hidden: 1,
							a: 'M0,0 l-20,-20 l30,10 l5,-40 l5,40 l30,-20 l-20,30 Z',
						},
					],
				},
				{
					id: 'LM-crew',
					x: 27,
					y: 90,
					a: 'M0,0 l10,-10 h60 l10,10 v36 l-10,10 h-60 l-10,-10 Z',
					t: 'LM crew compartment - meant for 2',
					status: () => `Crew: ${allParts.LM.crew || 0} / 2`,
					b: [
						['move-to-LM', 'Move crew here', () => {
							if (!allParts.hatch.open) {
								speakCrew('The hatch is closed.');
								return;
							}
							allParts.explosion1.hidden = 1;
							allParts.explosion2.hidden = 1;
							allParts.explosion3.hidden = 1;
							allParts.LM.crew = 3;
							allParts.CM.crew = 0;
							render();
						}],
					],
				},
				{
					id: 'LM-antenna',
					x: 95,
					y: 144,
					a: 'M0,0 h36 l-5,5 v5 l5,5 h5 l5,-5 v-5 l-5,-5 Z',
				},
				{
					id: 'legs',
					a: `M35,70 l-20,-10 l10,-60 l4,4 l2,-2 l-10,-10 l-2,2 l3,3 l-10,62 l-8,10
						M99,70 l20,-10 l-10,-60 l-4,4 l-2,-2 l10,-10 l2,2 l-3,3 l10,62 l8,10 Z`,
				},
				{
					id: 'LM-reaction-control-1',
					x: 9,
					y: 90,
					a: rcsLeft,
				},
				{
					id: 'LM-reaction-control-2',
					x: 125,
					y: 90,
					a: rcsRight,
				},
				{
					id: 'LM-AGC',
					x: 24,
					y: 100,
					p: '0,0 10,0 10,10 0,10',
					t: 'LM AGC (Apollo Guidance Computer)',
					status: () => {
						const s = [];
						if (allParts.LM.command) s.push('LM CMD');
						if (f.dataXfer) s.push('Nav Data Loaded');
						return s.join(', ');
					},
					b: [
						['LM-xfer', 'Transfer data from CM', () => {
							f.dataXfer = 1;
							zoomOut();
						}],
						['LM-cmd', 'Take Command', () => {
							if (!f.dataXfer) {
								speakGroundControl('You need data transferred first.');
								return;
							}
							sound('click');
							allParts.LM.command = 1;
							allParts.CM.command = 0;
						}],
						// ['LM-nav', 'Navigate into position'],
						['LM-burn', 'Burn', lmBurn],
					]
				},
				{
					id: 'LM-pow',
					x: 26,
					y: 120,
					p: '2,0 8,0 10,10 0,10',
					t: 'LM Power',
					status: () => (allParts.LM.power ? 'Usage: High' : 'Usage: Low'),
					b: [
						['LM-off', 'Turn off non-essentials', () => {
							sound('pwrdn');
							allParts.LM.power = 0;
							zoomOut();
						}],
					],
				},
				{
					id: 'LM-temp',
					x: 50,
					y: 76,
					p: '0,0 8,0 8,10 0,10',
					t: 'LM Temperature',
					status: () => (allParts.LM.power ? 'Comfortable' : 'Very Low'),
					// controls: temp up/down
				},
				{
					id: 'LM-co2',
					x: 80,
					y: 80,
					// p: '0,0 20,0 20,8 0,8',
					a: 'M0,0 h20 v8 h-2 v2 h-6 v-2 h-12 Z',
					t: 'LM CO2 Scrubber',
					status: () => {
						if (f.co2Scrub) return 'Supplemental cannister connected';
						if (allParts.LM.crew > 2) return 'CO2 Increasing Too Fast';
						return 'Nominal';
					},
					b: [['build', 'Build new CO2 cannister', () => {
						sound('click');
						f.co2Scrub = 1;
						zoomOut();
					}]],
				},
			],
		},
		{
			id: 'CM',
			x: 0,
			y: 150,
			w: 134,
			h: 80,
			p: `
				82,0 134,73 134,80 100,80
					0,80 0,73 52,0
			`,
			// a: 'M4,73 h126',
			t: 'The Command Module (CM)',
			command: 1,
			crew: 3,
			power: 100,
			children: [
				{
					id: 'CM-label',
					x: -40,
					y: 30,
					hidden: 1,
					svg: `<g class="label"><text>Command</text><text y="20">Module</text></g>`,
				},
				{
					id: 'CM-crew',
					x: 54,
					y: 14,
					a: 'M0,0 h26 l20,20 v20 l-10,8 h-46 l-10,-8 v-20 Z',
					t: 'CM crew compartment',
					co2: 0,
					status: () => `Crew: ${allParts.CM.crew || 0} / 3`,
					b: [
						['move-to-CM', 'Move crew here', () => {
							if (!allParts.hatch.open) {
								speakCrew('The hatch is closed.');
								return;
							}
							allParts.CM.crew = 3;
							allParts.LM.crew = 0;
							render();
						}],
					],
				},
				{
					id: 'CM-AGC',
					x: 75,
					y: 20,
					p: '0,0 10,0 10,10 0,10',
					t: 'CM AGC (Apollo Guidance Computer)',
					status: () => (allParts.CM.command ? 'CM CMD' : ''),
					b: [
						['LM-cmd', 'Take Command', () => {
							sound('click');
							allParts.CM.command = 1;
							allParts.LM.command = 0;
						}],
					],
				},
				{
					id: 'hatch',
					x: 44,
					y: 0,
					a: HATCH_CLOSED_PATH,
					// p: '8,0 38,0 46,12 0,12',
					// a: 'M23,0 v12',
					// a: 'M13,0 v12 h20 v-12 Z',
					// a: 'M8,0 h15 v12 v-12 h15 l8,12 h-46 Z',
					// a: 'M8,0 h8 v12 h14 v-12 h8 l8,12 h-46 Z',
					open: 0,
					t: 'CM-LM Hatch',
					status: () => (allParts.hatch.open ? 'Open' : 'Closed'),
					b: [['open-hatch', 'Open', () => {
							sound('door');
							allParts.hatch.open = 1;
							allParts.hatch.a = HATCH_OPEN_PATH;
							render();
						}],
						['close-hatch', 'Close', () => {
							sound('door');
							allParts.hatch.open = 0;
							allParts.hatch.a = HATCH_CLOSED_PATH;
							render();
						}],
					],
				},
				{
					id: 'CM-LM-dock',
					x: 57,
					y: -9,
					p: '0,0 20,0 20,8 0,8',
					b: [['disconnect-LM', 'Disconnect', () => {
						if (allParts.hatch.open) {
							speakCrew(`If we do that with the hatch open, we'll die.`);
							return;
						}
						separate('LM');
					}]],
				},
				{
					id: 'CM-SM-dock',
					x: 0,
					y: 73,
					p: '0,0 134,0 134,7 0,7',
					b: [['disconnect-SM', 'Disconnect', () => {
						separate('SM');
					}]],
				},
				{
					id: 'CM-pow',
					x: 55,
					y: 60,
					p: '2,0 8,0 10,7 0,7',
					t: 'CM Power Distribution System',
					status: () => (allParts.CM.power ? 'Power On' : 'Power Off'),
					b: [
						['power-up-CM', 'On', () => {
							allParts.CM.power = 1;
							sound('pwrup');
						}],
						['power-down-CM', 'Off', () => {
							allParts.CM.power = 0;
							sound('pwrdn');
						}],
					],
				},
				{
					id: 'CM-parachutes',
					x: 32,
					y: 14,
					p: '0,16 12,0 22,0 10,16',
					depolyed: 0,
					b: [
						['open-chute', 'Deploy', () => {
							if (!f.atmosphere) {
								speakCrew('Oh no! Do not do that.');
								return;
							}
							sound('click');
							allParts['CM-parachutes'].deployed = 1;
							allParts['deployed-chutes'].packed = 0;
							zoomOut();
						}]
					],
					children: [
						{
							id: 'deployed-chutes',
							x: 0,
							y: 0,
							packed: 1,
							a: 'M-20,-100 l10,-20 l10,-10 l20,-10 h30 l20,10 l10,10 l10,20 l-30,100 l25,-100 h-100 l25,100 l-30,-100 Z',
						},
					],
				},
			],
		},
		{
			id: 'SM',
			x: 0,
			y: 230,
			w: 134,
			h: 150,
			p: `
				67,0 134,0 134,100 124,100 124,110 80,110 104,150
					30,150 54,110 10,110 10,100 0,100 0,0
			`,
			a: 'M14,100 h106 M55,112 h24 M45,130 h44',
			t: 'The Service Module (SM)',
			children: [
				{
					id: 'SM-label',
					x: -50,
					y: 70,
					hidden: 1,
					svg: `<g class="label"><text>Service</text><text y="20">Module</text></g>`,
				},
				{
					id: 'SM-panel',
					x: 85,
					y: 10,
					a: 'M0,0 h45 v80 h-45 Z',
					hidden: 1,
					children: [
						{
							...explosionPart,
							id: 'explosion1',
						},
						{
							...explosionPart,
							id: 'explosion2',
							x: 20,
							y: 10,
						},
						{
							...explosionPart,
							id: 'explosion3',
						},
					],
				},
				{
					id: 'SM-fuel-cell-1',
					x: 42,
					y: 14,
					a: fuelCell,
					b: [['check-fuel-cell', 'Check', checkFuelCell]],
				},
				{
					id: 'SM-fuel-cell-2',
					x: 60,
					y: 14,
					a: fuelCell,
					b: [['check-fuel-cell', 'Check', checkFuelCell]],
				},
				{
					id: 'SM-fuel-cell-3',
					x: 78,
					y: 14,
					a: fuelCell,
					b: [['check-fuel-cell', 'Check', checkFuelCell]],
				},
				{
					id: 'SM-O-1',
					x: 50,
					y: 48,
					a: oTank,
					t: 'Oxygen tank 1 (supplies the fuel cell)',
					b: [['stir-1', 'Stir', () => {
						if (f.blast) return;
						if (!allParts.CM.power) {
							speakCrew('Stirring requires power.');
							return;
						}
						allParts['SM-O-1'].status = 'stirred';
						sound('click');
					}]],
				},
				{
					id: 'SM-O-2',
					x: 70,
					y: 48,
					a: oTank,
					t: 'Oxygen tank 2 (supplies the fuel cell)',
					b: [['stir-2', 'Stir', () => {
						if (f.blast) return;
						if (!allParts.CM.power) {
							speakCrew('Stirring requires power.');
							return;
						}
						sound('click');
						allParts['SM-O-2'].status = 'stirred';
						wait(() => {
							sound('boom');
							allParts.explosion1.hidden = 0;
							f.blast = 1;
							allParts['SM-O-2'].status = 'destroyed?';
							allParts['SM-panel'].hidden = 0;
							['SM-O-2', 'SM-panel'].forEach(
								(id) => allParts[id].classes.push('err')
							);
						}, 2000);
						zoomOut();
						render();
					}]],
					// display: power left
				},
				{
					id: 'high-gain-antenna',
					x: 128,
					y: 100,
					a: 'M0,0 l20,20 l5,-5 l-5,-4 l-1,-3 l14,10 l-3,1 l-3,-2 l-7,7 l-24,-24 Z',
				},
				{
					id: 'SM-reaction-control-1',
					x: 1,
					y: 20,
					a: rcsLeft,
				},
				{
					id: 'SM-reaction-control-2',
					x: 133,
					y: 20,
					a: rcsRight,
				},
			],
		},
	]
};
const allParts = (() => {
	const getChildrenObj = (parent) => {
		const { children } = parent;
		if (!children) return N;
		let o = {};
		children.forEach((c) => {
			// Do some normalizing of the parts
			if (!c.x) c.x = 0;
			if (!c.y) c.y = 0;
			if (!c.children) c.children = [];
			if (!c.rot) c.rot = 0;
			if (!c.classes) c.classes = [];
			c.parent = parent;
			
			o[c.id] = c;
			o = { ...o, ...getChildrenObj(c) };
		});
		return o;
	};
	return { ship, ...getChildrenObj(ship) };
})();
console.log(allParts);

const STORY = [
	// {
		// h --> houston communications
		// c --> crew barks
	// }
	// Launch
	// Burn to moon
	// Do video broadcast
	// Date is April 13
	{
		d: [
			`Take a look around the ship, but be careful what switches you press.`,
			'We need you to stir the oxygen tanks in the Service Module.',
			'Hit the switches to stir the Oxygen tanks to keep them working.',
		],
		check: () => (f.blast),
		dp: 0.7,
	},
	{
		d: [
			`$Okay, Houston, we've had a problem here.`,
			`$We've had a Main B Bus undervolt, and heard a pretty large bang.`,
			'$We should check the fuel cells.',
			'$We are leaking something out of the Service Module.',
			'Check the fuel cells please.',
		],
		check: () => (f.checkFC),
		dp: 0.71,
	},
	{
		d: [
			'Power will be out in 15 minutes. You need to use the Lim as a life boat.',
			'Open the hatch and head into the Lim.',
			`If you stay in the Command Module, you'll be out of power and oxygen soon.`,
		],
		check: () => (allParts.LM.crew >= 3),
		dp: 0.72,
	},
	{
		d: [
			'Use the computer to transfer data from the CM to the Lim.',
			'Before you are out of power, you need that data in the Lim to survive.',
		],
		check: () => (f.dataXfer),
		dp: 0.73,
	},
	{
		d: ['Seal the door.', 'Close the hatch to CM so we can shut it down.'],
		check: () => (!allParts.hatch.open),
		dp: 0.74,
	},
	{
		d: [
			'Take command from the Lim.',
			`You won't be headed to the moon's surface with the Lim, but it is still useful.`,
		],
		check: () => (allParts.LM.command),
		dp: 0.75,
	},
	{
		d: ['You should turn off the Command Module.', `We don't want to lose any more power.`],
		check: () => (!allParts.CM.power),
		dp: 0.76,
	},
	{
		d: ['The Lim needs everything turned off except the essentials.',
			`It is going to get cold, but we have to conserve power in order to make it home.`,
		],
		check: () => (!allParts.LM.power),
		dp: 0.77,
	},
	{
		start: () => { f.atMoon = 1; },
		d: [`You should be swinging around the moon now. Enjoying the view?`,
			`We need to do another burn with the Lim's engine for a free return trajectory.`,
		], // position ship?
		check: () => (f.freeReturn),
		dp: 1,
	},
	{
		d: ['The C.O. 2 in the Lim is increasing too fast with all three of you in there.',
			'You need to fabricate a new C.O. 2 absorbing cannister.',
		],
		check: () => (f.co2Scrub),
		dp: 0.9,
	},
	{
		d: [
			`As you are approaching Earth again, you can return to the Command Module.`,
			`Sorry it's so cold in there.`,
			'Open the hatch to come in to the CM.',
		],
		check: () => (allParts.CM.crew >= 3),
		dp: 0.4,
	},
	{
		d: [`We've never powered up a CM before, but we think it can be done.`,
			'Power up the Command Module and take control of it from the computer.'],
		check: () => (allParts.CM.power && allParts.CM.command),
		dp: 0.35,
	},
	{
		d: [
			`It looks like you've drifted slowly off course.`,
			`You need to do another burn to correct your entry angle or you'll bounce off the atmosphere back into space.`,
		],
		check: () => (f.reentryCourse),
		dp: 0.3,
	},
	{
		d: [`You're almost home. It's time to jettison the Service Module.`,
			'Disconnect the SM and take some photos as it leaves.',
		], // Jettison SM
		check: () => (allParts.SM.disconnected),
		dp: 0.25,
	},
	{
		d: [`The Lim was a good lifeboat, but it's time to say goodbye.`,
			'Disconnect the LM, and start preparing for entry into the atmosphere.',
		], // Jettison LM
		check: () => (allParts.LM.disconnected),
		dp: 0.1,
	},
	{
		start: () => { f.atmosphere = 1; },
		d: [
			`The heat shield worked! You're in the atmosphere!`,
			'Open your parachute quickly.',
			'You would expect the parachute to deploy automatically but this is more interactive.',
		],
		check: () => (allParts['CM-parachutes'].deployed),
		dp: 0,
	},
	{
		d: ['Welcome home!',
			'People around the world were watching the mission and praying for you.',
			'President Nixon will meet you in Hawaii to give you the Presidential Medal of Freedom',
			'$The game is over. Refresh the page to play again.'
		],
	}
];

let focusPartId = N;
let storyCheckIntervalId = 0;
let storyBarkTimerId = 0;
let storyBeatIndex = 0;
let distPercent = 0;
let starOffsets = [100, 100, 100];

function getStoryBeat() {
	return STORY[storyBeatIndex];
}

function checkStory() {
	const b = getStoryBeat();
	if (b.check && b.check()) {
		moveStory(b.next || (storyBeatIndex + 1));
	}
}

function stopStory() {
	clearInterval(storyCheckIntervalId);
	stopBark();
}

function stopBark() {
	clearTimeout(storyBarkTimerId);
}

function startStory() {
	stopStory();
	storyCheckIntervalId = setInterval(checkStory, 500);
	moveStory(0);
	// bark();
}

function nextBark(b) {
	stopBark();
	storyBarkTimerId = setTimeout(bark, BARK_TIME * ((b.barkIndex === 0) ? 4 : 1));
}

function bark(b = getStoryBeat()) {
	if (!b.d) return;
	if (b.barkIndex === undefined) b.barkIndex = 0;
	const text = b.d[b.barkIndex];
	if (text.charAt(0) === '$') speakCrew(text.substring(1));
	else speakGroundControl(text);
	b.barkIndex = (b.barkIndex + 1) % b.d.length;
	nextBark(b);
}

function moveStory(toIndex) {
	stopBark();
	storyBeatIndex = toIndex;
	const b = getStoryBeat();
	if (b.start) b.start();
	if (b.dp || b.dp === 0) distPercent = b.dp;
	render();
	storyBarkTimerId = setTimeout(() => bark(b), 1000);
	// bark(b);
}

function advanceStory() {
	moveStory(storyBeatIndex + 1);
}

function speakCrew(text) {
	speak(text, 0, 0.2, 1.5);
	$html('bark', text);
}

function speakGroundControl(text) {
	speak(text, 0, 1.2, 1.3);
	$html('bark', text);
}

function speak(text, voice, pitch = 1, rate = 1) {
	synth.cancel(); // cancel previous speech
	if (!f.sound) return;
	// Based on example from https://mdn.github.io/web-speech-api/speak-easy-synthesis/
	const utterance = new SpeechSynthesisUtterance(text);
	if (typeof voice === 'number') {
		const voices = synth.getVoices();
		voice = voices[voice];
	}
	utterance.voice = voice;
	utterance.pitch = pitch;
	utterance.rate = rate;
	utterance.onpause = (event) => {
	  const char = event.utterance.text.charAt(event.charIndex);
	  console.log('Speech paused at character ' + event.charIndex + ' of "' +
	  event.utterance.text + '", which is "' + char + '".');
	};
	synth.speak(utterance);
	// console.log('Speaking', text, utterance);
}

function getSvg(g) {
	const classes = [
		(g.id === focusPartId) ? 'focused' : '',
		(g.disconnected) ? 'disconnected' : '',
		(g.packed) ? 'packed' : '',
		(g.hidden) ? 'hidden' : '',
		...g.classes,
	].join(' ');
	const pathClass = (g.a && g.a.charAt(g.a.length - 1) === 'Z') ? 'c-p' : 'o-p';
	const crewY = (g.id === 'LM') ? 120 : 50;
	return `<g id="${g.id}" transform="rotate(${g.rot}) translate(${g.x}, ${g.y})" class="${classes}">
		<!-- <rect width="${g.w || 0}" height="${g.h || 0}" class="guide" /> -->
		${g.p ? `<polygon points="${g.p}" />` : ''}
		${g.a ? `<path d="${g.a}" class="${pathClass}" />` : ''}
		<!-- <text x="10" y="50" font-size="10">${g.id}</text> -->
		${g.children.map((c) => getSvg(c)).join(' ')}
		${g.crew ? `<text x="67" y="${crewY}">👨‍🚀👨‍🚀👨‍🚀</text>` : ''}
		${g.svg || ''}
	</g>`;
}

function getPartCoords(part) {
	if (!part) return [0, 0];
	const [px, py] = getPartCoords(part.parent);
	return [part.x + px, part.y + py];
}

function setScene(x, y, scale = 1, rot = 0) {
	$id('scene-g').style.transform = `scale(${scale}) translate(${x}px, ${y}px) rotate(${rot}deg)`;
}

function toggleLabels(show) {
	const h = (show) ? 0 : 1;
	allParts['CM-label'].hidden = h;
	allParts['LM-label'].hidden = h;
	allParts['SM-label'].hidden = h;
	render();
}
win.toggleLabels = toggleLabels;

function zoom(x, y, w, h, rot = 0) {
	// const { w, h } = part;
	const size = Math.max(w, h);
	// console.log(width, height, size);
	const zoom = 400 / (size * 1.5);
	y = (-y - h/2) + HALF;
	x = (-x - w/2) + HALF;
	setScene(x, y, zoom, rot);
}

function zoomTo(part = ship) {
	if (!part) part = ship; // return setScene(0, 0, 1);
	toggleLabels(part === ship);
	let [x, y] = getPartCoords(part);
	// console.log(part.id, 'intial x,y', x, y);
	const { width, height } = $id(part.id).getBBox();
	zoom(x, y, width, height);
}

function zoomOut() { zoomTo(); }

win.activateButton = (buttonId) => {
	const fn = buttonActions[buttonId];
	// console.log(buttonId, fn);
	if (fn) fn();
	render();
};

function openPartPanel(part) {
	const p = $id('panel');
	if (!part) {
		p.innerHTML = '';
		p.classList.remove('p-o');
		return;
	}
	// console.log(part.t, part.id);
	let buttonsHtml = '';
	if (part.b) {
		buttonsHtml = part.b.map((b) => {
			const [id, label, action] = b;
			buttonActions[id] = () => {
				action();
				openPartPanel(part);
			};
			return `<button id="${id}" onclick="activateButton('${id}')">${label}</button>`
		}).join('');
	}
	const status = (typeof part.status === 'function') ? part.status() : part.status || '';
	const statusHtml = (status) ? `<b class="status">${status}</b>` : '';
	p.innerHTML = `<button id="back-btn">&#128938;</button><b>${part.t || part.id}</b>${statusHtml}${buttonsHtml}`;
	p.classList.add('p-o');
}

function focus(part = N) {
	focusPartId = part ? part.id : N;
	render();
	zoomTo(part);
	openPartPanel(part);
}

function setupEvents() {
	$id('svg').addEventListener('click', (e) => {
		const closestElementWithId = e.target.closest('[id]');
		if (!closestElementWithId) return focus();
		const part = allParts[closestElementWithId.id];
		focus(part);
		// console.log(e.target, part);
	});
}

function render() {
	// console.log('---RENDER---');
	$html('scene-g', getSvg(ship));
	const mapX = distPercent * 360;
	$id('a13').style.transform = `translate(${mapX}px,0px)`;
}

function makeStarsImage(m = 2) {
	const c = doc.createElement('canvas');
	c.width = win.screen.width;
	c.height = win.screen.height;
	const ctx = c.getContext('2d');
	const randCoord = (max) => floor(random() * max);
	const count = Math.max(c.width, c.height) * m;
	for(let i = 0; i < count; i++) {
		ctx.fillStyle = (random() < 0.5) ? '#fff' : '#ccb';
		ctx.fillRect(randCoord(c.width), randCoord(c.height), 1, 1);
	}
	// ctx.fillStyle = '#ff86'; ctx.fillRect(0, 0, 100, 100);
	const img = new Image();
	img.src = c.toDataURL();
	return img;
}

function makeStarsBackgrounds() {
	const stars = [makeStarsImage(2), makeStarsImage(.1), makeStarsImage(.1)];
	const s = $id('scene');
	s.style.backgroundImage = stars.map((star) => `url(${star.src})`).join(',');
}

function animateStars() {
	const s = $id('scene');
	if (f.atmosphere) {
		s.classList.add('sky');
		s.style.backgroundImage = '';
		s.style.backgroundPositionY = '0';
	} else {
		starOffsets.forEach((p, i) => {
			starOffsets[i] = (p + i + 0.1) % win.screen.height;
		});
		s.style.backgroundPositionY = starOffsets.map((p) => `${p}px`).join(',');
	}
	wait(animateStars, 50);
}


listen('DOMContentLoaded', () => {
	setupEvents();
	synth.onvoiceschanged = () => { // Wait until voices are loaded
		focus();
		toggleLabels(0);
		render();
		makeStarsBackgrounds();
		let started = 0;
		zoom(0, 0, 500, 500, 90);
		listen('click', (e) => {
			const { id } = e.target;
			if (id === 'back-btn') {
				focus();
			} else if (id === 'sound-tog') {
				f.sound = !f.sound ? 1 : 0;
				e.target.innerHTML = (f.sound) ? '🔊' : '🔇';
			} else if (id === 'ff') {
				bark();
			} else if (id === 'pause') {
				stopBark();
			} else if (id === 'begin') {
				sound('click');
				$id('splash').style.display = 'none';
				$id('pause').style.visibility = 'visible';
				$id('ff').style.visibility = 'visible';
				zoomOut();
				if (!started) {
					animateStars();
					startStory();
					started = 1;
				}
			}
		});
		
	};
});

win.allParts = allParts;
win.f = f;

