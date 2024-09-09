// URGE (Update Render Game Engine)
const Urge = (() => {
	const ABSTRACT_ERROR = 'Abstract Class Cannot Be Instantiated';

	function $(s) {
		return document.querySelector(s);
	}

	class Dimension {
		#width;
		#height;

		constructor(width, height) {
			this.#width = width;
			this.#height = height;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
		}
	}

	class BoundingBox extends Dimension {
		#x;
		#y;

		constructor(x, y, width, height) {
			super(width, height);
			this.#x = x;
			this.#y = y;
		}

		getX() {
			return this.#x;
		}

		getY() {
			return this.#y;
		}

		getLeft() {
			return this.getX();
		}

		getRight() {
			return this.getX() + this.getWidth();
		}

		getTop() {
			return this.getY();
		}

		getBottom() {
			return this.getY() + this.getHeight();
		}

		getCenter() {
			return [this.getX() + (this.getWidth() / 2), this.getY() + (this.getHeight() / 2)];
		}

		getTopLeft() {
			return [this.getLeft(), this.getTop()];
		}

		getTopRight() {
			return [this.getRight(), this.getTop()];
		}

		getBottomLeft() {
			return [this.getLeft(), this.getBottom()];
		}

		getBottomRight() {
			return [this.getRight(), this.getBottom()];
		}

		getCorners() {
			return [
				this.getTopLeft(),
				this.getTopRight(),
				this.getBottomLeft(),
				this.getBottomRight()
			];
		}

		intersects(box) {
			if (this.getRight() < box.getLeft()) {
				return false;
			}

			if (this.getLeft() > box.getRight()) {
				return false;
			}

			if (this.getBottom() < box.getTop()) {
				return false;
			}

			if (this.getTop() > box.getBottom()) {
				return false;
			}

			const corners = this.getCorners();
			const valid = corners.some(c => {
				const validLeft = c[0] >= box.getLeft();
				const validRight = c[0] <= box.getRight();
				const validTop = c[1] >= box.getTop();
				const validBottom = c[1] <= box.getBottom();
				//console.log(c, validLeft, validRight, validTop, validBottom);
				return validLeft && validRight && validTop && validBottom;
			});

			return valid;
		}
	}

	class Component {
		#context;

		constructor(context) {
			this.#context = context;
			if (this.constructor == Component) {
				throw new Error(ABSTRACT_ERROR);
			}
		}

		getContext() {
			return this.#context;
		}

		setContext(context) {
			this.#context = context;
		}

		getCanvas() {
			const selector = this.#context.canvas?.id ? '#' + this.#context.canvas.id : 'canvas';
			const canvasById = $(selector);
			const canvas = $('canvas');
			return (canvasById ?? canvas) ?? this.#context.canvas;
		}

		isPortrait() {
			const canvas = this.getCanvas();
			return canvas.height > canvas.width;
		}

		update(instant) {
		}

		debug(instant, ...models) {
			if (instant.frame % 60 == 0) {
				console.log('*** DEBUG ***', performance.now(), ...models);
			}
		}
	}

	class RenderComponent extends Component {
		constructor(context) {
			super(context);
			if (this.constructor == RenderComponent) {
				throw new Error(ABSTRACT_ERROR);
			}
		}

		render(instant) {
			RenderComponent.clear(this.getContext());
		}

		updateAndRender(instant) {
			this.update(instant);
			this.render(instant);
		}

		static clear(ctx, color = 'black', width = 0, height = 0) {
			const w = width > 0 ? width : ctx.canvas.width;
			const h = height > 0 ? height : ctx.canvas.height;
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, w, h);
		}
	}

	class Sprite extends RenderComponent {
		#x = 0;
		#y = 0;
		#width = 0;
		#height = 0;

		constructor(context, x, y, width, height) {
			super(context);
			if (this.constructor == Sprite) {
				throw new Error(ABSTRACT_ERROR);
			}

			this.#x = x;
			this.#y = y;
			this.#width = width;
			this.#height = height;
		}

		getX() {
			return this.#x;
		}

		setX(x) {
			this.#x = x;
		}

		offsetX(delta) {
			this.#x += delta;
		}

		getY() {
			return this.#y;
		}

		setY(y) {
			this.#y = y;
		}

		offsetY(delta) {
			this.#y += delta;
		}

		getWidth() {
			return this.#width;
		}

		getHeight() {
			return this.#height;
		}

		getBoundingBox() {
			return new BoundingBox(this.#x, this.#y, this.#width, this.#height);
		}

		moveTo(x, y) {
			this.setX(x);
			this.setY(y);
		}

		moveBy(deltaX, deltaY) {
			this.offsetX(deltaX);
			this.offsetY(deltaY);
		}
	}

	class ComponentStore extends Component {
		#map = null;

		constructor(context) {
			super(context);
			this.#map = new Map();
		}

		put(...components) {
			const arr = [];
			for (let component of components) {
				if (!(component instanceof Component)) {
					throw new Error('Not A Component');
				}

				const id = this.#getUniqueId();
				this.#map.set(id, component);
				arr.push(id);
			}

			return arr;
		}

		get(id) {
			return this.#map.get(id);
		}

		remove(id) {
			this.#map.delete(id);
		}

		clear() {
			this.#map.clear();
		}

		keys() {
			return this.#map.keys();
		}

		values() {
			return this.#map.values();
		}

		entries() {
			return this.#map.entries();
		}

		entriesByType(type) {
			const arr = [];
			for (let e of this.entries()) {
				if (e[1] instanceof type) {
					arr.push(e);
				}
			}

			return arr;
		}

		forEach(callback) {
			this.#map.forEach(callback);
		}

		count() {
			return this.#map.size;
		}

		update(instant) {
			this.#map.forEach(c => {
				if (c instanceof Component) {
					c.update(instant);
				}
			});
		}

		updateByTypes(instant, ...types) {
			types.forEach(type => {
				this.#map.forEach(c => {
					if (c instanceof Component && c instanceof type) {
						c.update(instant);
					}
				});
			});
		}

		render(instant) {
			this.#map.forEach(c => {
				if (c instanceof RenderComponent) {
					c.render(instant);
				}
			});
		}

		renderByTypes(instant, ...types) {
			types.forEach(type => {
				this.#map.forEach(c => {
					if (c instanceof RenderComponent && c instanceof type) {
						c.render(instant);
					}
				});
			});
		}

		#getUniqueId() {
			const now = performance.now();
			const r = parseInt(Math.random() * 100000000);
			return now.toString() + '_' + r.toString();
		}
	}

	const ScreenState = {
		INACTIVE: 0,
		INITIALIZING: 1,
		ACTIVE: 2,
		TERMINATING: 3
	};
	Object.freeze(ScreenState);

	class Screen extends RenderComponent {
		#store;
		#game;
		#state;
		#screenState;
		#canvas;

		constructor(game, state) {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			super(context);
			this.#canvas = canvas;
			if (this.constructor == Screen) {
				throw new Error(ABSTRACT_ERROR);
			}

			this.#store = new ComponentStore(context);
			this.#game = game;
			this.#state = state;
			this.#screenState = ScreenState.INACTIVE;
		}

		getCanvas() {
			return this.#canvas;
		}

		updateCanvas(width, height) {
			this.#canvas.width = width;
			this.#canvas.height = height;
		}

		getStore() {
			return this.#store;
		}

		getState() {
			return this.#state;
		}

		getScreenState() {
			return this.#screenState;
		}

		init() {
			console.log(performance.now(), 'Screen Initialization');
			this.#screenState = ScreenState.INITIALIZING;
		}

		activate() {
			console.log(performance.now(), 'Screen Activation');
			this.#screenState = ScreenState.ACTIVE;
		}

		term() {
			console.log(performance.now(), 'Screen Termination');
			this.#screenState = ScreenState.TERMINATING;
		}

		deactivate() {
			console.log(performance.now(), 'Screen Deactivation');
			this.getStore().clear();
			this.#screenState = ScreenState.INACTIVE;
		}

		navigate(screenType) {
			this.#game.navigate(screenType);
		}
	}

	class Game extends RenderComponent {
		#selector;
		#screenTypes;
		#screens = {};
		#currentScreenType = null;
		#incomingScreenType = null;
		#navigationElapsed = -1;
		#transitionDuration = 2000;

		constructor(screenTypes, selector = 'canvas') {
			const canvas = $(selector);
			if (!canvas) {
				throw new Error('Canvas Not Found: ' + selector);
			}

			super(canvas.getContext('2d'));
			if (this.constructor == Game) {
				throw new Error(ABSTRACT_ERROR);
			}

			this.#selector = selector;
			this.#screenTypes = screenTypes;
		}

		getCanvas() {
			return $(this.#selector);
		}

		updateScreens(width, height) {
			this.forEachScreen(screen => screen.updateCanvas(width, height));
		}

		async init() {
		}

		async start(startScreenType) {
			console.log('Starting...');
			return this.init().then(s => {
				console.log('Game State:', s);
				for (let t of this.#screenTypes) {
					if (t.prototype instanceof Screen) {
						const screen = new t(this, s);
						this.#screens[t.name] = screen;
					} else {
						console.warn('Invalid Screen: ' + t.name);
					}
				}

				console.log('Game Screens:', this.#screens);
				const initialScreen = this.#screens[startScreenType.name];
				if (initialScreen) {
					this.navigate(startScreenType);
				}

				Nucleus.Clock.start(instant => this.updateAndRender(instant));
				return s;
			}).catch(f => {
				console.error(f);
				return f;
			}).finally(() => {
				console.log('Started');
			});
		}

		// TODO: may need a message based system as individual screens will flag when to navigate
		navigate(screenType) {
			if (this.#navigationElapsed < 0) {
				this.#navigationElapsed = 0;
				if (this.#currentScreenType) {
					const currentName = this.#currentScreenType.name;
					const current = this.#screens[currentName];
					if (current) {
						current.term();
					}
				}

				const name = screenType?.name ?? '';
				const screen = this.#screens[name];
				if (screen) {
					screen.init();
				}

				this.#incomingScreenType = screenType;
			} else {
				console.warn('Currently Navigating... Please Wait...');
			}
		}

		#endNavigation() {
			if (this.#navigationElapsed >= 0) {
				if (this.#currentScreenType) {
					const currentName = this.#currentScreenType.name;
					const current = this.#screens[currentName];
					if (current) {
						current.deactivate();
					}
				}

				const name = this.#incomingScreenType.name;
				const screen = this.#screens[name];
				if (screen) {
					screen.activate();
				}

				this.#currentScreenType = this.#incomingScreenType;
				this.#incomingScreenType = null;
				this.#navigationElapsed = -1;
			} else {
				console.warn('Not Currently Navigating... Unable To End Navigation...');
			}
		}

		forEachScreen(screenFunc) {
			for (let screenType in this.#screens) {
				const screen = this.#screens[screenType];
				if (screenFunc) {
					screenFunc(screen);
				}
			}
		}

		update(instant) {
			super.update(instant);

			// TODO: only update current and incoming screens?
			this.forEachScreen(screen => {
				if (screen.getScreenState() != ScreenState.INACTIVE) {
					screen.update(instant);
				}
			});

			if (this.#navigationElapsed >= 0) {
				this.#navigationElapsed += instant.elapsed();
				if (this.#navigationElapsed > this.#transitionDuration) {
					this.#endNavigation();
				}
			}
		}

		// TODO: handle transition rendering
		render(instant) {
			super.render(instant);
			const canvas = this.getCanvas();
			const ctx = this.getContext();

			const navigating = this.#navigationElapsed >= 0;
			const incomingRatio = this.#navigationElapsed / this.#transitionDuration;
			const currentScreenRatio = navigating ? (1 - incomingRatio) : 1;
			const incomingScreenRatio = navigating ? incomingRatio : 0;
			//this.debug(instant, 'FPS', instant.fps());

			// TODO: only update current and incoming screens?
			this.forEachScreen(screen => {
				if (screen.getScreenState() != ScreenState.INACTIVE) {
					screen.render(instant);

					// TODO: perform ratio updates to screen canvases here
					const canvas = screen.getCanvas();
					const context = screen.getContext();
					const width = canvas.width;
					const height = canvas.height;

					if (this.#currentScreenType && screen instanceof this.#currentScreenType) {
						ctx.globalAlpha = currentScreenRatio;
						ctx.drawImage(screen.getCanvas(), 0, 0, canvas.width, canvas.height);
					}

					if (this.#incomingScreenType && screen instanceof this.#incomingScreenType) {
						ctx.globalAlpha = incomingScreenRatio;
						ctx.drawImage(screen.getCanvas(), 0, 0, canvas.width, canvas.height);
					}

					ctx.globalAlpha = 1;
				}
			});
		}

		generateCanvas(f, w = 256, h = 256) {
			const c = document.createElement('canvas');
			c.width = w;
			c.height = h;
			const x = c.getContext('2d');
			if (f) {
				f(x);
			}

			return c;
		}

		async generateImage(func, type = 'image/png', quality = 0.92, width, height) {
			const c = this.generateCanvas(func, width, height);
			const i = new Image();
			i.src = c.toDataURL(type, quality);
			await i.decode();
			return i;
		}
	}

	class WatchValue {
		#value;
		#previousValue;

		constructor(value) {
			this.#value = value;
			this.#previousValue = value;
		}

		get() {
			return this.#value;
		}

		set(value) {
			this.#previousValue = this.#value;
			this.#value = value;
		}

		hasChanged() {
			return this.#value != this.#previousValue;
		}
	}

	return {
		Dimension,
		BoundingBox,
		Component,
		RenderComponent,
		Sprite,
		ComponentStore,
		ScreenState,
		Screen,
		Game,
		WatchValue
	};
})();
