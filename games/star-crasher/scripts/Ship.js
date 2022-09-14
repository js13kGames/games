class Ship {
	constructor() {
		var s = this;
		s.parts = 0;
		s.partsMax = 255;
		s.energy = 0;
		s.energyMax = 255;
		s.fuel = 0;
		s.fuelMax = 255;
		s.distanceToDepots = [];
		s.solarPanelsOpen = false;
		s.lastUpdate = null;
		s.repairingSystem = null;
		s.systemList = ['so','ca','fu','ov','ho','ro'];
		s.systems = {
			so: 0,
			ca: 0,
			fu: 0,
			ov: 0,
			ho: 0,
			ro: 0,
		};
		s.repairEnergy = 8;
		s.repairParts = 7;
		s.speed = 0;
		s.loading = null;
	}
	deploySolar() {
		this.solarPanelsOpen = (this.systems.so === 0) ? false : !this.solarPanelsOpen;
	}
	stop() {
		this.speed = 0;
	}
	accelerate(t) {
		let a = t;
		let boost = (this.fuel > t) ? 0.5 : 0;
		let m = 0.2 + boost + (this.systems.ov/100) * 2;
		this.fuel -= t;
		this.fuel = Math.max(0, this.fuel);
		this.speed += (a * m);
		this.speed = Math.min(this.speed, this.getMaxSpeed());
	}
	getMaxSpeed() {
		let boost = (this.fuel > 0) ? 5 : 0;
		let spd = 10;
		if (this.systems.ov === 100) {
			spd = 20;
			boost = (this.fuel > 0) ? 15 : 0;
		}
		return spd + boost;
	}
	getEnergyRate() {
		var s = this;
		let input = s.solarPanelsOpen ? (s.systems.so/10) : 0;
		let output = s.repairingSystem ? s.repairEnergy : 0;
		output += (s.loading) ? 1 : 0;
		let rate = input - output;
		return rate;
	}
	getHeightOffset() {
		return this.systems.ho === 100 ? 20 : 10;
	}
	advance() {
		var s = this;
		let ms = 1;
		if (s.lastUpdate) {
			let now = new Date();
			ms = now - s.lastUpdate;
			s.lastUpdate = now;
		}
		let t = ms / 1000;
		s.lastUpdate = new Date();
		s.energy += s.getEnergyRate() * t;
		s.energy = Math.max(0, Math.min(s.energy, s.energyMax));
		s.repairSystem(s.repairingSystem, t);
		return t;
	}
	canRepair(sys) {
		var s = this;
		return (
			(sys === 'so' && s.systems.so < 50)
			|| (sys === 'ca' && s.energy >= s.repairEnergy)
			|| (s.energy > s.repairEnergy && s.parts >= s.repairParts)
		);
	}
	repairSystem(sys, t) {
		if (!sys) { return; }
		var s = this;
		let rr = t * 4;
		if (!s.canRepair(sys)) {
			return;
		}
		s.systems[s.repairingSystem] += rr;
		s.systems[s.repairingSystem] = Math.min(s.systems[s.repairingSystem], 100);
		if (s.systems[s.repairingSystem] >= 100) {
			s.repairingSystem = null;
		}
		s.parts -= s.repairParts * t; // FIXME
		s.parts = Math.max(0, s.parts);
	}
	repair(sys) {
		this.repairingSystem = this.repairingSystem === sys ? null : sys;
	}
	getRepairInfo() {
		var s = this;
		let sys = s.repairingSystem;
		if (!sys) {
			let p = 0;
			s.systemList.forEach((sys) => { p += s.systems[sys]; });
			if (p === 0) {
				return 'ALL SYSTEMS OFFLINE';
			}
			return 'Total Repair Progress: ' + Math.floor((p / (s.systemList.length * 100)) * 100) + '%';
		}
		if (s.systems[sys] >= 100) {
			return 'Online - Repaired 100%'
		}
		if (s.canRepair(sys)) {
			return 'Repairing {' + sys.toUpperCase() + '} ' + Math.floor(s.systems[sys]) + '%';
		}
		return 'Need Energy/Parts to Repair';
	}
	getSystemButtonClass(sys) {
		let system = this.systems[sys];
		if (system >= 100) {
			return 'on';
		}
		if (this.repairingSystem === sys) {
			if (this.canRepair(sys)) {
				return 'working';
			}
			return 'alert';
		}
		return 'off';
	}
	setLoading(type) {
		this.loading = (type === this.loading) ? null : type;
	}
	load(n) {
		if (this.loading === 'fuel') {
			let m = (this.systems.fu === 100) ? 3 : 1;
			this.fuel += (n * m);
			this.fuel = Math.min(this.fuel, this.fuelMax);
		} else if (this.loading === 'parts') {
			let m = (this.systems.ca === 100) ? 3 : 1;
			this.parts += (n * m);
			this.parts = Math.min(this.parts, this.partsMax);
		}
	}
	isHoverOn() {
		return this.systems.ho === 100;
	}
}