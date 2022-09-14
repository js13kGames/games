const Nucleus = {};

Nucleus.Model = (() => {
	function isFunction(obj) {
		return typeof(obj) === 'function';
	}

	function getEmptyArray(size) {
		let arr = [];
		arr.length = size;
		return arr;
	}

	function getEmptyArray2d(sizeX, sizeY) {
		let arr = getEmptyArray(sizeX);
		for (let i = 0; i < arr.length; i++) {
			arr[i] = getEmptyArray(sizeY);
		}

		return arr;
	}

	function getEmptyArray3d(sizeX, sizeY, sizeZ) {
		let arr = getEmptyArray(sizeX);
		for (let i = 0; i < arr.length; i++) {
			arr[i] = getEmptyArray(sizeY);
			for (let j = 0; j < arr[i].length; j++) {
				arr[i][j] = getEmptyArray(sizeZ);
			}
		}

		return arr;
	}

	function getBit(value, index) {
		return (value >> index & 1) == 1;
	}

	return {
		isFunction,
		getEmptyArray,
		getEmptyArray2d,
		getEmptyArray3d,
		getBit
	};
})();

Nucleus.Clock = (() => {
	const DEFAULT_FRAME_RATE = 30;
	let active = false;
	const instant = {
		frame: 0,
		tick: 0,
		lastTick: 0,
		elapsed() {
			return this.tick - this.lastTick;
		},
		fps() {
			const e = this.elapsed();
			return e > 0 ? (1000 / e) : 60;
		}
	};
	let hook = undefined;

	function raf(e) {
		const func = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(e) {
				return setTimeout(e, parseInt(1000 / DEFAULT_FRAME_RATE));
			};
		return func(e);
	}

	function start(callback) {
		if (!active) {
			active = true;
			if (callback) {
				if (Nucleus.Model.isFunction(callback)) {
					hook = callback;
				} else {
					hook = undefined;
					console.warn('Callback Must Be A Function:', callback);
				}
			} else {
				hook = undefined;
			}

			instant.lastTick = instant.tick;
			instant.frame = raf(loop);
			console.log('Clock Started');
		} else {
			console.warn('Clock Is Already Started');
		}
	}

	function stop() {
		if (active) {
			active = false;
			console.log('Clock Stopped');
		} else {
			console.warn('Clock Is Already Stopped');
		}
	}

	function loop(tick) {
		if (active) {
			instant.lastTick = instant.tick;
			instant.tick = tick;
			instant.frame = raf(loop);
			if (hook) {
				hook(instant);
			}
		}
	}

	function isActive() {
		return active;
	}

	function getInstant() {
		return instant;
	}

	return {
		start,
		stop,
		isActive,
		getInstant
	};
})();

Nucleus.Keys = (() => {
	let keyBindings = null;

	function handleKeyDown(e) {
		keyBindings[e.keyCode] = e;
	}

	function handleKeyUp(e) {
		keyBindings[e.keyCode] = undefined;
	}

	function start() {
		keyBindings = Nucleus.Model.getEmptyArray(256);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	}

	function stop() {
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
		keyBindings = null;
	}

	function checkCode(keyCode) {
		return keyBindings[keyCode] != undefined;
	}

	function checkKey(key) {
		return !!keyBindings.find(el => {
			return el && (el.key.toLowerCase() === key.toLowerCase());
		});
	}

	function isShift() {
		return checkCode(16);
	}

	function isControl() {
		return checkCode(17);
	}

	function isAlt() {
		return checkCode(18);
	}

	return {
		start,
		stop,
		checkCode,
		checkKey,
		isShift,
		isControl,
		isAlt
	};
})();

Nucleus.Cryo = class {
	constructor() {
	}

	static getAll(namespace = '', persist = true) {
		const prefix = namespace ? namespace + '.' : '';
		const storage = Nucleus.Cryo.#getStorage(persist);
		const all = {};
		for (let i = 0; i < storage.length; i++) {
			const key = storage.key(i);
			if (key.startsWith(prefix)) {
				const value = storage.getItem(key);
				const model = JSON.parse(value);
				all[key] = model;
			}
		}

		return all;
	}

	static get(key, namespace = '', persist = true) {
		const keyToUse = Nucleus.Cryo.#getKey(key, namespace);
		const storage = Nucleus.Cryo.#getStorage(persist);
		const value = storage.getItem(keyToUse);
		return JSON.parse(value);
	}

	static set(key, model, namespace = '', persist = true) {
		const keyToUse = Nucleus.Cryo.#getKey(key, namespace);
		const storage = Nucleus.Cryo.#getStorage(persist);
		const value = JSON.stringify(model);
		storage.setItem(keyToUse, value);
	}

	static remove(key, namespace = '', persist = true) {
		const keyToUse = Nucleus.Cryo.#getKey(key, namespace);
		const storage = Nucleus.Cryo.#getStorage(persist);
		storage.removeItem(keyToUse);
	}

	static removeByNamespace(namespace = '', persist = true) {
		const prefix = namespace ? namespace + '.' : '';
		const storage = Nucleus.Cryo.#getStorage(persist);
		for (let i = storage.length - 1; i >= 0; i--) {
			const key = storage.key(i);
			if (key.startsWith(prefix)) {
				storage.removeItem(key);
			}
		}
	}

	static removeAll(persist = true) {
		const storage = Nucleus.Cryo.#getStorage(persist);
		storage.clear();
	}

	static #getStorage(persist = true) {
		return persist ? localStorage : sessionStorage;
	}

	static #getKey(key, namespace = '') {
		const prefix = namespace ? namespace + '.' : '';
		return prefix + key;
	}
};
