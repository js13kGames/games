
class Ship extends CompositePolygon {
	constructor(parts = []) {
		super(parts);
		this.health = 100;
		this.fuel = 500;
		this.thrustMagnitude = 100000;
	}
	damage(n) {
		this.health -= n;
	}
	dead() {
		return this.health <= 0;
	}
	getAlertLevel() {
		if (this.dead()) { return 'red'; }
		return '';
	}
	getFacingUnitVector() {
		const radians = (this.rotation - 90) * Math.PI / 180;
		const x = Math.cos(radians);
		const y = Math.sin(radians);
		return new XY(x, y);
	}
	spin(theta) {
		if (this.isColliding) {
			theta = theta / 5;
			this.damage(1);
		}
		return this.rotate(theta);
	}
	thrust(n) {
		if (this.fuel < n || this.dead()) {
			return false;
		}
		const unit = this.getFacingUnitVector();
		const thrustForce = unit.getMultiply(n * this.thrustMagnitude);
		this.fuel -= n;
		// console.log(thrustForce.getMagnitude());
		this.force.add(thrustForce);
	}
}
