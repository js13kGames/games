class SpaceButton extends Urge.Sprite {
	#totalElapsed = 0;
	#delay = 1000;
	#duration = 5000;

	constructor(context) {
		super(context);
	}

	update(instant) {
		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		if (this.#totalElapsed > this.#delay) {
			const portrait = this.isPortrait();
			const canvas = this.getCanvas();
			const ctx = this.getContext();
			const width = portrait ? canvas.width / 2 : canvas.width / 3;
			const height = portrait ? width / 3 : width / 3;
			const x = (canvas.width - width) / 2;
			const y = (canvas.height - height) / 2;
			const fontName = 'sans-serif';
			const fontSize = parseInt(height * 2 / 3);
			const text = 'Rogue-19';

			const ratio = Math.min(1, (this.#totalElapsed - this.#delay) / this.#duration);

			ctx.globalAlpha = ratio;
			ctx.lineWidth = 10;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'black';
			ctx.strokeRect(x, y, width, height);
			ctx.fillRect(x, y, width, height);

			// TODO: handle alignment better
			ctx.lineWidth = 5;
			ctx.strokeStyle = 'white';
			ctx.font = fontSize + 'px ' + fontName;
			const textSize = ctx.measureText(text);
			const offsetX = (width - textSize.width) / 2
			const offsetY = fontSize + ((height - fontSize) / 2);
			ctx.strokeText(text, x + offsetX, y + offsetY);
			ctx.globalAlpha = 1;
		}
	}
}

// TODO: use underlying x/y from Sprite
class StarField extends Urge.RenderComponent {
	constructor(context, options) {
		super(context);
		this.x = 0;
		this.y = 0;
		this.image = options.image;
		this.scrollSeconds = options?.scrollSeconds ?? 10;
	}

	update(instant) {
		const portrait = super.isPortrait();
		const pixelCount = parseFloat((portrait ? super.getCanvas().height : super.getCanvas().width) / this.scrollSeconds);
		const pixelsToMove = pixelCount * instant.elapsed() / 1000;
		if (portrait) {
			this.x = 0;
			this.y += pixelsToMove;
		} else {
			this.y = 0;
			this.x -= pixelsToMove;
		}

		while (this.x < -super.getCanvas().width) {
			this.x += super.getCanvas().width;
		}

		while (this.y > super.getCanvas().height) {
			this.y -= super.getCanvas().height;
		}
	}

	render(instant) {
		super.getContext().drawImage(this.image, this.x, this.y, super.getCanvas().width, super.getCanvas().height);
		if (super.isPortrait()) {
			super.getContext().drawImage(this.image, this.x, this.y - super.getCanvas().height, super.getCanvas().width, super.getCanvas().height);
		} else {
			super.getContext().drawImage(this.image, this.x + super.getCanvas().width, this.y, super.getCanvas().width, super.getCanvas().height);
		}
	}
}

class Slogan extends Urge.Sprite {
	#text;
	#delay;
	#totalElapsed = 0;

	constructor(context, x, y, width, height, text, delay) {
		super(context, x, y, width, height);
		this.#text = text;
		this.#delay = delay;
	}

	update(instant) {
		super.update(instant);
		if (this.#totalElapsed > this.#delay) {
			const velocity = -0.25;
			const delta = this.getHeight() * velocity * (instant.elapsed() / 1000);
			this.offsetY(delta);
		}

		this.#totalElapsed += instant.elapsed();
	}

	render(instant) {
		if (this.#totalElapsed > this.#delay) {
			const ctx = this.getContext();
			const canvas = this.getCanvas();
			const halfHeight = canvas.height;
			const ratio = Math.min(1, Math.max(0, (this.getY() / halfHeight)));

			ctx.save();
			ctx.globalAlpha = ratio;
			ctx.scale(1, ratio);
			ctx.strokeStyle = 'darkgray';
			ctx.fillStyle = 'white';
			const fontSize = Math.max(10, (this.isPortrait() ? 40 : 48) * ratio);
			ctx.font = fontSize + 'px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText(this.#text, this.getX(), this.getY());
			ctx.restore();
		}
	}
}

class Ship extends Urge.Sprite {
	#active = false;
	#skills = null;
	#id = 1;
	#health = 0;
	#damage = 0;
	#score = 0;
	#screen = null;
	#lastSpacePressed = false;

	constructor(context, x, y, size, skills, screen) {
		super(context, x, y, size, size);
		this.#skills = skills;
		this.#id = skills.id;
		this.#health = skills.health;
		this.#damage = skills.damage;
		this.#screen = screen;
	}

	isActive() {
		return this.#active;
	}

	getId() {
		return this.#id;
	}

	getHealth() {
		return this.#health;
	}

	getDamage() {
		return this.#damage;
	}

	reduceHealth(damage) {
		this.#health -= Math.abs(damage);
		this.#health = Math.max(0, this.#health);
	}

	getScore() {
		return this.#score;
	}

	increaseScore(score) {
		this.#score += score;
	}

	isAlive() {
		return this.getHealth() > 0;
	}

	update(instant) {
		const delta = this.getWidth() * 4 * instant.elapsed() / 1000;
		const canvas = this.getCanvas();
		if (this.#active) {
			if (Nucleus.Keys.checkKey('w')) {
				this.offsetY(-delta);
			}

			if (Nucleus.Keys.checkKey('s')) {
				this.offsetY(delta);
			}

			if (Nucleus.Keys.checkKey('a')) {
				this.offsetX(-delta);
			}

			if (Nucleus.Keys.checkKey('d')) {
				this.offsetX(delta);
			}

			const sideLimit = 10;
			const canvas = this.getCanvas();
			if (super.isPortrait()) {
				this.setX(Math.min((canvas.width) - this.getWidth() - sideLimit, Math.max(sideLimit, this.getX())));
				this.setY(Math.max((canvas.height * 0.6), Math.min(canvas.height - this.getWidth() - sideLimit, this.getY())));
			} else {
				this.setX(Math.min((canvas.width * 0.4) - this.getWidth(), Math.max(sideLimit, this.getX())));
				this.setY(Math.min(canvas.height - this.getWidth() - sideLimit, Math.max(sideLimit, this.getY())));
			}

			const spacePressed = Nucleus.Keys.checkKey(' ');
			if (spacePressed && !this.#lastSpacePressed) {
				this.#screen.post(MessageType.PLAYER_BULLET);
			}

			this.#lastSpacePressed = spacePressed;
		} else {
			const size = this.getWidth();
			const slow = delta / 5;
			if (this.isPortrait()) {
				this.offsetY(-slow);
				const startY = this.isPortrait() ? canvas.height - (size * 3) : (canvas.height - size) / 2;
				if (this.getY() <= startY) {
					this.setY(startY);
					this.#active = true;
				}
			} else {
				this.offsetX(slow);
				const startX = this.isPortrait() ? (canvas.width - size) / 2 : size * 2;
				if (this.getX() >= startX) {
					this.setX(startX);
					this.#active = true;
				}
			}
		}
	}

	render(instant) {
		const points = super.isPortrait() ? [
			[this.getX() + this.getWidth(), this.getY() + this.getWidth()],
			[this.getX() + (this.getWidth() / 2), this.getY() + (this.getWidth() * 2 / 3)],
			[this.getX(), this.getY() + this.getWidth()],
			[this.getX() + (this.getWidth() / 2), this.getY()]
		] : [
			[this.getX(), this.getY() + this.getWidth()],
			[this.getX() + (this.getWidth() / 3), this.getY() + (this.getWidth() / 2)],
			[this.getX(), this.getY()],
			[this.getX() + this.getWidth(), this.getY() + (this.getWidth() / 2)]
		];
		const ctx = super.getContext();
		ctx.strokeStyle = 'cornflowerblue';
		ctx.lineWidth = 3;
		ctx.fillStyle = 'darkgreen';
		ctx.beginPath();
		ctx.moveTo(points[3][0], points[3][1]);
		points.forEach(p => {
			ctx.lineTo(p[0], p[1]);
			ctx.stroke();
		});
		ctx.fill();
		ctx.closePath();
	}
}

class PlayerBullet extends Urge.Sprite {
	constructor(context, x, y, width, height) {
		super(context, x, y, width, height);
	}

	update(instant) {
		const bulletSpeed = 40;
		const ratio = bulletSpeed * instant.elapsed() / 1000;
		if (super.isPortrait()) {
			this.offsetY(-this.getHeight() * ratio);
		} else {
			this.offsetX(this.getWidth() * ratio);
		}
	}

	render(instant) {
		const ctx = super.getContext();
		ctx.fillStyle = 'yellow';
		if (super.isPortrait()) {
			ctx.fillRect(this.getX() - this.getWidth(), this.getY() - this.getHeight(), this.getWidth(), this.getHeight());
		} else {
			ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
		}
	}
}

class Hud extends Urge.RenderComponent {
	#id = 1;
	#health = 0;
	#damage = 0;
	#score = 0;
	#remainingMiles = 0;

	constructor(context) {
		super(context);
	}

	setId(id) {
		this.#id = id;
	}

	setHealth(health) {
		this.#health = health;
	}

	setDamage(damage) {
		this.#damage = damage;
	}

	setScore(score) {
		this.#score = score;
	}

	setRemainingMiles(remainingMiles) {
		this.#remainingMiles = remainingMiles;
	}

	render(instant) {
		const GREEN = '#0a0';
		const FONT = '2em sans-serif';
		const ctx = super.getContext();
		const canvas = super.getCanvas();
		ctx.fillStyle = GREEN;
		ctx.font = FONT;
		ctx.textAlign = 'center';
		const id = this.#id;
		const h = this.#health;
		const d = this.#damage;
		const sc = this.#score;
		const m = parseInt(this.#remainingMiles);
		const display = `Clone #: ${id}, Health: ${h}, Damage: ${d}, Score: ${sc}, Remaining Miles: ${m}`;
		ctx.fillText(display, canvas.width / 2, canvas.height - 20);
	}
}

class Enemy extends Urge.Sprite {
	#health;
	#velocity;

	constructor(context, x, y, width, height, health, velocity) {
		super(context, x, y, width, height);
		this.#health = health;
		this.#velocity = velocity;
	}

	getHealth() {
		return this.#health;
	}

	getVelocity() {
		return this.#velocity;
	}

	reduceHealth(damage) {
		this.#health -= Math.abs(damage);
		this.#health = Math.max(0, this.#health);
	}

	isAlive() {
		return this.getHealth() > 0;
	}
}

class Cell extends Enemy {
	constructor(context, x, y, size, health, velocity) {
		super(context, x, y, size, size, health, velocity);
	}

	update(instant) {
		const movement = this.getWidth() * this.getVelocity() * (instant.elapsed() / 1000);
		if (super.isPortrait()) {
			this.offsetY(movement);
		} else {
			this.offsetX(-movement);
		}
	}

	render(instant) {
		const ctx = super.getContext();
		const center = this.getBoundingBox().getCenter();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'darkred';
		ctx.beginPath();
		ctx.arc(center[0], center[1], this.getWidth() / 2, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		ctx.lineWidth = 3;
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'blue';
		ctx.beginPath();
		ctx.arc(center[0], center[1], this.getWidth() / 6, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
}

class Incubator extends Enemy {
	#screen;
	#finalPosition;
	#reached = false;

	constructor(context, x, y, width, height, screen) {
		super(context, x, y, width, height, 1000000, 1);
		this.#screen = screen;
		this.#finalPosition = this.isPortrait()
			? 20
			: this.getCanvas().width - this.getWidth() - 20;
	}

	update(instant) {
		super.update(instant);
		if (this.#reached) {
			if (instant.frame % 20 == 0) {
				this.#screen.post(MessageType.INCUBATOR_CELL);
			}
		} else {
			if (this.isPortrait()) {
				if (this.getY() < this.#finalPosition) {
					const delta = this.getHeight() / 6;
					this.offsetY(delta * instant.elapsed() / 1000);
				} else {
					this.setY(this.#finalPosition);
					this.#reached = true;
				}
			} else {
				if (this.getX() > this.#finalPosition) {
					const delta = -this.getWidth() / 6;
					this.offsetX(delta * instant.elapsed() / 1000);
				} else {
					this.setX(this.#finalPosition);
					this.#reached = true;
				}
			}
		}
	}

	render(instant) {
		const canvas = this.getCanvas();
		const ctx = this.getContext();
		ctx.strokeStyle = 'darkgray';
		ctx.fillStyle = 'darkred';
		ctx.lineWidth = 3;
		ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
		ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
	}
}
