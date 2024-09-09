class Input {
	constructor() {
		this.forwardBackward = 0;
		this.leftRight 		= 0;
		this.upDown 		= 0;
		this.lookUp 		= false;
		this.lookDown 		= false;
		this.mousePosition 	= null;
		this.keyPressed 	= false;
		this.keyInstructions = {
			'a':			'left',
			65:				'left',
			'ArrowLeft': 	'left',
			37:				'left',
			'd':			'right',
			68:				'right',
			'ArrowRight':	'right',
			39:				'right',
			'w':			'forward',
			87:				'forward',
			'ArrowUp':		'forward',
			38:				'forward',
			's':			'backward',
			83:				'backward',
			'ArrowDown':	'backward',
			40:				'backward',
			'r':			'up',
			82:				'up',
			'f':			'down',
			70:				'down',
			'e':			'lookUp',
			69:				'lookUp',
			'q':			'lookDown',
			81:				'lookDown',
			'z':			'zAction',
			90:				'zAction'
		};
		this.anyKeyDownAction = function() {};
		this.updateCameraHorizon = function() {};
		this.zAction = function() {};
	}

	init(canvas, document) {
		canvas.onmousedown	= this.detectMouseDown.bind(this);
		canvas.onmouseup	= this.detectMouseUp.bind(this);
		canvas.onmousemove	= this.detectMouseMove.bind(this);
		canvas.ontouchstart	= this.detectMouseDown.bind(this);
		canvas.ontouchend	= this.detectMouseUp.bind(this);
		canvas.ontouchmove	= this.detectMouseMove.bind(this);
		document.addEventListener('keydown', this.detectKeysDown.bind(this));
		document.addEventListener('keyup', this.detectKeysUp.bind(this));
	}

	getMousePosition(e) {
		// fix for Chrome
		if (e.type.startsWith('touch')) {
			return [e.targetTouches[0].pageX, e.targetTouches[0].pageY];
		} else {
			return [e.pageX, e.pageY];
		}
	}

	detectMouseDown(e) {
		this.forwardBackward = 1.;
		this.mousePosition = this.getMousePosition(e);
		this.anyKeyDownAction();
		return;
	}

	detectMouseUp() {
		this.mousePosition = null;
		this.forwardBackward = 0;
		this.leftRight = 0;
		this.upDown = 0;
		return;
	}

	detectMouseMove(e) {
		e.preventDefault();
		if (this.mousePosition == null) { return; }
		if (this.forwardBackward == 0) { return; }

		const currentMousePosition = this.getMousePosition(e);

		this.leftRight = (this.mousePosition[0] - currentMousePosition[0]) / window.innerWidth * 2;
		this.upDown    = (this.mousePosition[1] - currentMousePosition[1]) / window.innerHeight * 10;

		const cameraHorizon  = 100 + (this.mousePosition[1] - currentMousePosition[1]) / window.innerHeight * 500;
		this.updateCameraHorizon(cameraHorizon);
	}

	getEventKeyInstruction(e) {
		const key = e.key || e.keyCode;
		const instruction = this.keyInstructions[key];
		return instruction;	
	}

	detectKeysDown(e) {
		this.keyPressed = true;
		switch(this.getEventKeyInstruction(e)) {
			case 'left':
				this.leftRight = +1.;
				break;
			case 'right':
				this.leftRight = -1.;
				break;
			case 'forward':
				this.forwardBackward = 1.;
				break;
			case 'backward':
				this.forwardBackward = -1.;
				break;
			case 'up':
				this.upDown = +2.;
				break;
			case 'down':
				this.upDown = -2.;
				break;
			case 'lookUp':
				this.lookUp = true;
				break;
			case 'lookDown':
				this.lookDown = true;
				break;
			default:
				return;
				break;
		}
		this.anyKeyDownAction();
		e.preventDefault();
		return false;
	}

	detectKeysUp(e) {
		switch(this.getEventKeyInstruction(e)) {
			case 'left':
			case 'right':
				this.leftRight = 0;
				break;
			case 'forward':
			case 'backward':
				this.forwardBackward = 0;
				break;
			case 'up':
			case 'down':
				this.upDown = 0;
				break;
			case 'lookUp':
				this.lookUp = false;
				break;
			case 'lookDown':
				this.lookDown = false;
				break;
			case 'zAction':
				this.zAction();
			default:
				return;
				break;
		}
		return false;
	}
}