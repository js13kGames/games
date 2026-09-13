// ========================================
// AUDIO SYNTHESIS ENGINE (ZzFX Micro)
// ======================================== 
let audioCtx = null;
let isMuted = false;
let masterVolume = 0.3;

function getAudioContext() {
	if (!audioCtx) {
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	}
	
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}
	return audioCtx;
}

// Synthesizes dynamic sound buffers on the fly 
function playSound(freq = 400, length = 0.2, decay = 0.3, type = "sine") {
	if (isMuted) return;
	
	const ctx = getAudioContext();
	const sampleRate = ctx.sampleRate;
	const bufferSize = sampleRate * length;
	const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
	const channelData = buffer.getChannelData(0);
	
	for (let i = 0; i < bufferSize; i++) {
		let t = i / sampleRate;
		let envelope = Math.exp(-i / (bufferSize * decay));
		
		// Waveform generator 
		let sample = 0;
		if (type === "sine") {
			sample = Math.sin(2 * Math.PI * freq * t);
		} else if (type === "triangle") {
			sample = Math.abs((t * freq % 1) - 0.5) * 4 - 1;
		} else if (type === "sawtooth") {
			sample = 2 * (t * freq - Math.floor(0.5 + t * freq));
		}
		channelData[i] = sample * envelope * masterVolume;
	}
	
	let source = ctx.createBufferSource();
	source.buffer = buffer;
	source.connect(ctx.destination);
	source.start();
};

// Sound Effect Triggers
const sndPop = () => playSound(600, 0.05, 0.1, "sine");
const sndFlag = () => playSound(1200, 0.08, 0.2, "sine");
const sndHurt = () => playSound(140, 0.3, 0.4, "triangle");

// Fun Win Fanfare 
const sndWinFanfare = () => {
	const melody = [
		{ f: 523.25, d: 0.12, delay: 0 },		// C5 
		{ f: 659.25, d: 0.12, delay: 100 },		// E5 
		{ f: 783.99, d: 0.12, delay: 200 },		// G5 
		{ f: 1046.50, d: 0.40, delay: 320 },	// C6 
	];
	melody.forEach(note => {
		setTimeout(() => playSound(note.f, note.d, 0.4, "triangle"), note.delay);
	});
};

// Sad Game Over Musical Slide 
const sndGameOverJingle = () => {
	const melody = [
		{ f: 440.00, d: 0.20, delay: 0 },		// A4 
		{ f: 415.30, d: 0.20, delay: 180 },		// G#4 
		{ f: 392.00, d: 0.20, delay: 360 },		// G4 
		{ f: 349.23, d: 0.55, delay: 540 }		// F4 
	];
	melody.forEach(note => {
		setTimeout(() => playSound(note.f, note.d, 0.5, "sawtooth"), note.delay);
	});
};

// Background Music 
let musicInterval = null;
let noteIndex = 0;
const melodyNotes = [261.63, 329.63, 392.00, 523.25]; 		// C4, E4, G4, C5 

function playNextMusicNote() {
	if (isMuted || gameState !== STATE_PLAYING) return;
	playSound(melodyNotes[noteIndex], 0.25, 0.3, "triangle");
	noteIndex = (noteIndex + 1) % melodyNotes.length;
}

function startMusic() {
	stopMusic();
	musicInterval = setInterval(playNextMusicNote, 400);
}

function stopMusic() {
	if (musicInterval) {
		clearInterval(musicInterval);
		musicInterval = null;
	}
}

// ========================================= 
// GAME CONFIGURATION & STATE VARIABLES
// =========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const BASE_WIDTH = 480;
const BASE_HEIGHT = 520;
let scaleFactor = 1;

function resizeCanvas() {
	const windowW = window.innerWidth;
	const windowH = window.innerHeight;
	
	// Maintain aspect ratio with scaling 
	const scale = Math.min(windowW / BASE_WIDTH, windowH / BASE_HEIGHT, 1);
	const displayW = Math.floor(BASE_WIDTH * scale);
	const displayH = Math.floor(BASE_HEIGHT * scale);

	const dpr = window.devicePixelRatio || 1;
	// Sharp rendering setup 
	canvas.width = BASE_WIDTH * dpr;
	canvas.height = BASE_HEIGHT * dpr;
	canvas.style.width = `${displayW}px`;
	canvas.style.height = `${displayH}px`;
	
	scaleFactor = scale;
	ctx.setTransform(1, 0, 0, 1, 0, 0);		// Reset scale transform 
	ctx.scale(dpr, dpr);
}

window.addEventListener("resize", resizeCanvas);

// =============================== 
// GAME CONFIGURATION & STATE 
// =============================== 
const GRID_SIZE = 8;
const TOTAL_UNICORNS = 10;
const HUD_HEIGHT = 60;
const BOARD_PADDING = 20;
const TILE_GAP = 4;

const boardWidth = BASE_WIDTH - (BOARD_PADDING * 2);
const TILE_SIZE = (boardWidth - (TILE_GAP * (GRID_SIZE - 1))) / GRID_SIZE;

const STATE_MENU = 0;
const STATE_PLAYING = 1;
const STATE_WIN = 2;
const STATE_GAMEOVER = 3;
let gameState = STATE_MENU;

let grid = [];
let inspectorMode = false; 		// Player-friendly testing mode 
let settingsOpen = false;		// Dropdown toggle 
let touchFlagMode = false;		// Mobile mode switch 
let firstClick = true;
let flagsPlaced = 0;
let lives = 3;
let revealedCount = 0;

// Timer & VFX Tracking 
//let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let particles = [];

// Animation State Variables 
let rainDrops = [];
let shakeTime = 0;
let flashAlpha = 0;
let animTimer = 0;
let modalScale = 0;

const NUMBER_COLORS = [
	'', '#74B9FF', '#55EFC4', '#FF7675', '#A29BFE',
	'#FDCB6E', 'E17055', '#00CEC9', '#D63031'
];

const RAINBOW_COLORS = [
	'#FF7675', '#FDCB6E', '#55EFC4', '#74B9FF', '#A29BFE'
];

// ====================== 
// GAME INIT & LOGIC
// ======================
function initGame() {
	grid = [];
	particles = [];
	rainDrops = [];
	firstClick = true;
	flagsPlaced = 0;
	lives = 3;
	revealedCount = 0;
	elapsedTime = 0;
	settingsOpen = false;
	shakeTime = 0;
	flashAlpha = 0;
	animTimer = 0;
	modalScale = 0;
	gameState = STATE_PLAYING;
	
	if (timerInterval) clearInterval(timerInterval);
	const startTime = Date.now();
	timerInterval = setInterval(() => {
		if (gameState === STATE_PLAYING) {
			elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		}
	}, 1000);
	
	startMusic();
	
	// Build Empty Grid 
	for (let r = 0; r < GRID_SIZE; r++) {
		let row = [];
		for (let c = 0; c < GRID_SIZE; c++) {
			row.push({
				r: r, 
				c: c,
				isUnicorn: false,
				revealed: false,
				flagged: false,
				neighborUnicorns: 0
			});
		}
		grid.push(row);
	}
	
	// Place Unicorns Randomly 
	let placed = 0;
	while (placed < TOTAL_UNICORNS) {
		let r = Math.floor(Math.random() * GRID_SIZE);
		let c = Math.floor(Math.random() * GRID_SIZE);
		if (!grid[r][c].isUnicorn) {
			grid[r][c].isUnicorn = true;
			placed++;
		}
	}
	
	recalculateNeighbors();
}

function recalculateNeighbors() {
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (!grid[r][c].isUnicorn) {
				grid[r][c].neighborUnicorns = countNeighbors(r, c);
			}
		}
	}
}

function countNeighbors(r, c) {
	let count = 0;
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			if (dr === 0 && dc === 0) continue;
			let nr = r + dr;
			let nc = c + dc;
			if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
				if (grid[nr][nc].isUnicorn) count++;
			}
		}
	}
	return count;
}

function createParticles(x, y, colorList, count = 12, speedMult = 1, isRising = false) {
	for (let i = 0; i < count; i++) {
		let color = colorList[Math.floor(Math.random() * colorList.length)];
		let angle = Math.random() * Math.PI * 2;
		let speed = (1 + Math.random() * 4) * speedMult;
		particles.push({
			x: x, 
			y: y,
			vx: isRising ? (Math.random() - 0.5) * 2 : Math.cos(angle) * speed,
			vy: isRising ? -Math.random() * 3 - 1 : Math.sin(angle) * speed,
			size: 3 + Math.random() * 4,
			color: color,
			alpha: 1,
			life: isRising ? 0.96 + Math.random() * 0.02 : 0.92 + Math.random() * 0.05
		});
	}
}

function initRain() {
	rainDrops = [];
	for (let i = 0; i < 40; i++) {
		rainDrops.push({
			x: Math.random() * BASE_WIDTH,
			y: Math.random() * BASE_HEIGHT,
			length: 8 + Math.random() * 12,
			speed: 6 + Math.random() * 6
		});
	}
}

function updateParticles() {
	for (let i = particles.length - 1; i >= 0; i--) {
		let p = particles[i];
		p.x += p.vx;
		p.y += p.vy;
		p.alpha *= p.life;
		if (p.alpha < 0.05) {
			particles.splice(i, 1);
		}
	}
}

function drawParticles() {
	for (let p of particles) {
		ctx.save();
		ctx.globalAlpha = p.alpha;
		ctx.fillStyle = p.color;
		
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

function revealTile(r, c) {
	if (gameState !== STATE_PLAYING || settingsOpen) return;
	
	let tile = grid[r][c];
	if (tile.revealed || tile.flagged) return;
	
	let tileX = BOARD_PADDING + c * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
	let tileY = HUD_HEIGHT + BOARD_PADDING + r * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
	
	// First click protection: Move unicorn if hit on first move 
	if (firstClick) {
		firstClick = false;
		if (tile.isUnicorn) {
			tile.isUnicorn = false;
			let moved = false;
			for (let nr = 0; nr < GRID_SIZE && !moved; nr++) {
				for (let nc = 0; nc < GRID_SIZE && !moved; nc++) {
					if (!grid[nr][nc].isUnicorn && (nr !== r || nc !== c)) {
						grid[nr][nc].isUnicorn = true;
						moved = true;
					}
				}
			}
			recalculateNeighbors();
		}
	}
	
	tile.revealed = true;
	
	if (tile.isUnicorn) {
		lives--;
		sndHurt();
		shakeTime = 12; 			// Trigger screen shake 
		flashAlpha = 0.4;			// Brief red/white flash 
		createParticles(tileX, tileY, ['#FF7675', '#D63031', '#FDCB6E'], 20);
		
		if (lives <= 0) {
			gameState = STATE_GAMEOVER;
			clearInterval(timerInterval);
			stopMusic();
			sndGameOverJingle();
			initRain();
			revealAllUnicorns();
		}
	} else {
		revealedCount++;
		sndPop();
		createParticles(tileX, tileY, ['#DFE6E9', '#74B9FF'], 8);
		
		if (tile.neighborUnicorns === 0) {
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					let nr = r + dr;
					let nc = c + dc;
					if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
						if (!grid[nr][nc].revealed) {
							revealTile(nr, nc);
						}
					}
				}
			}
		}
	}
	checkWinState();
}

function toggleFlag(r, c) {
	if (gameState !== STATE_PLAYING || settingsOpen) return;
	
	let tile = grid[r][c];
	if (tile.revealed) return;
	
	tile.flagged = !tile.flagged;
	flagsPlaced += tile.flagged ? 1 : -1;
	sndFlag();
	
	let tileX = BOARD_PADDING + c * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
	let tileY = HUD_HEIGHT + BOARD_PADDING + r * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
	createParticles(tileX, tileY, RAINBOW_COLORS, 14);
	
	checkWinState();
}

function revealAllUnicorns() {
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c].isUnicorn) {
				grid[r][c].revealed = true;
			}
		}
	}
}

function checkWinState() {
	const totalSafeTiles = (GRID_SIZE * GRID_SIZE) - TOTAL_UNICORNS;
	let correctFlags = 0;
	
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c].isUnicorn && grid[r][c].flagged) {
				correctFlags++;
			}
		}
	}
	
	if (revealedCount === totalSafeTiles || correctFlags === TOTAL_UNICORNS) {
		gameState = STATE_WIN;
		clearInterval(timerInterval);
		stopMusic();
		sndWinFanfare();
		// Burst celebratory rainbow fireworks 
		createParticles(BASE_WIDTH / 2, BASE_HEIGHT / 2, RAINBOW_COLORS, 80, 2);
	}
}

function formatTime(seconds) {
	let m = Math.floor(seconds / 60).toString().padStart(2, '0');
	let s = (seconds % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
}

// ================== 
// RENDER ENGINE 
// ================== 
function draw() {
	animTimer++; 
	
	// Apply Screen Shake Camera Translation 
	ctx.save();
	if (shakeTime > 0) {
		let dx = (Math.random() - 0.5) * shakeTime;
		let dy = (Math.random() - 0.5) * shakeTime;
		ctx.translate(dx, dy);
		shakeTime--;
	}
	
	ctx.fillStyle = '#2A2D37';
	ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
	
	if (gameState === STATE_MENU) {
		drawMenuOverlay();
		updateParticles();
		drawParticles();
		ctx.restore();
		requestAnimationFrame(draw);
		return;
	}
	
	// Top HUD Bar 
	ctx.fillStyle = '#1e2029';
	ctx.fillRect(0, 0, BASE_WIDTH, HUD_HEIGHT);
	
	ctx.fillStyle = '#DFE6E9';
	ctx.font = 'bold 14px system-ui';
	ctx.textAlign = 'left';
	ctx.fillText(`🌈 ${flagsPlaced}/${TOTAL_UNICORNS}`, 14, 36);
	
	// Mobile Action Switcher (⛏️/🌈) 
	ctx.fillStyle = touchFlagMode ? "#A20BFE" : "#485460";
	ctx.beginPath();
	ctx.roundRect(110, 16,52, 28, 14);
	ctx.fill();
	ctx.font = "14px system-ui";
	ctx.textAlign = "center";
	ctx.fillText(touchFlagMode ? "🌈" : "⛏️", 136, 35);
	
	ctx.fillStyle = "#DFE6E9";
	ctx.font = "bold 14px system-ui";
	ctx.textAlign = 'center';
	ctx.fillText(`⏰ ${formatTime(elapsedTime)}`, BASE_WIDTH / 2 + 25, 36);
	
	let hearts = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives));
	ctx.textAlign = 'right';
	ctx.fillText(`${hearts}`, BASE_WIDTH - 50, 36);
	
	// Settings Dropdown Trigger Button 
	ctx.font = '18px system-ui';
	ctx.fillText('⚙️', BASE_WIDTH - 20, 36);
	
	// Grid Rendering with Win Bounce Animation 
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			let tile = grid[r][c];
			let x = BOARD_PADDING + c * (TILE_SIZE + TILE_GAP);
			let y = HUD_HEIGHT + BOARD_PADDING + r * (TILE_SIZE + TILE_GAP);
			
			// Win Animation: Gentle wave bounce on safe tiles 
			let bounceY = 0;
			if (gameState === STATE_WIN && tile.revealed) {
				bounceY = Math.sin(animTimer * 0.1 + (r + c) * 0.4) * 3;
			}
			
			let renderY = y + bounceY;
			
			if (tile.revealed || inspectorMode) {
				ctx.fillStyle = tile.isUnicorn ? '#FF7675' : '#353B48';
				ctx.beginPath();
				ctx.roundRect(x, y, TILE_SIZE, TILE_SIZE, 6);
				ctx.fill();
				
				if (tile.isUnicorn) {
					ctx.font = `${TILE_SIZE * 0.5}px system-ui`;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText('🦄', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
				} else if (tile.neighborUnicorns > 0) {
					ctx.fillStyle = NUMBER_COLORS[tile.neighborUnicorns];
					ctx.font = `bold ${TILE_SIZE * 0.45}px system-ui`;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(tile.neighborUnicorns, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
				}
			} else {
				ctx.fillStyle = '#485460';
				ctx.beginPath();
				ctx.roundRect(x, y, TILE_SIZE, TILE_SIZE, 6);
				ctx.fill();
				
				if (tile.flagged) {
					ctx.font = `${TILE_SIZE * 0.5}px system-ui`;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText('🌈', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
				} else {
					ctx.fillStyle = '#576574';
					ctx.beginPath();
					ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE * 0.2, 0, Math.PI * 2);
					ctx.fill();
				}
			}
		}
	}
	
	updateParticles();
	drawParticles();
	
	// Damage Flash Overlay 
	if (flashAlpha > 0) {
		ctx.fillStyle = `rgba(255, 118, 117, ${flashAlpha})`;
		ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
		flashAlpha -= 0.03;
	}
	
	// Dynamic State Overlay Animations 
	if (gameState === STATE_WIN) {
		// Spawn Continuous Rising Rainbow Confetti 
		if (Math.random() < 0.4) {
			createParticles(Math.random() * BASE_WIDTH, BASE_HEIGHT + 10, RAINBOW_COLORS, 2, 1, true);
		}
		drawModalOverlay("🦄 MEADOW SAVED! 🌈", `Time: ${formatTime(elapsedTime)} | Meadow Restored`, "#55EFC4");
	} else if (gameState === STATE_GAMEOVER) {
		drawRainAnimation();
		drawModalOverlay("⛈️ STORM OVERTAKEN!", "The unicorns were startled!", "#FF7675");
	}
	
	// Render Settings dropdown if open 
	if (settingsOpen) {
		drawSettingsDropdown();
	}
	
	ctx.restore();		// Restore shake transform 
	requestAnimationFrame(draw);
}

function drawRainAnimation() {
	ctx.strokeStyle = "rgba(116, 185, 255, 0.4)";
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	for (let drop of rainDrops) {
		ctx.moveTo(drop.x, drop.y);
		ctx.lineTo(drop.x - 2, drop.y + drop.length);
		drop.y += drop.speed;
		drop.x -= 0.5;
		if (drop.y > BASE_HEIGHT) {
			drop.y = -10;
			drop.x = Math.random() * BASE_WIDTH;
		}
	}
	ctx.stroke();
}

function drawSettingsDropdown() {
	const menuX = BASE_WIDTH - 170;
	const menuY = HUD_HEIGHT + 8;
	const menuW = 150;
	const menuH = 80;
	
	ctx.fillStyle = "#1E2029";
	ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
	ctx.shadowBlur = 10;
	ctx.beginPath();
	ctx.roundRect(menuX, menuY, menuW, menuH, 8);
	ctx.fill();
	ctx.shadowBlur = 0;		// Reset shadow 
	
	ctx.font = "13px system-ui";
	ctx.textAlign = "left";
	
	// Option 1: Mute 
	ctx.fillStyle = "#DFE6E9";
	ctx.fillText(`${isMuted ? "🔇 Sound: Off" : "🔊 Sound: On"}`, menuX + 15, menuY + 30);
	
	// Option 2: Inspector Mode 
	ctx.fillStyle = inspectorMode ? "#55EFC4" : "#DFE6E9";
	ctx.fillText(`🔍 Testing: ${inspectorMode ? "ON" : "OFF"}`, menuX + 15, menuY + 60);
}

function drawMenuOverlay() {
	ctx.fillStyle = "#FF7675";
	ctx.font = 'bold 26px system-ui';
	ctx.textAlign = 'center';
	ctx.fillText('🦄 UNICORN MEADOWS 🌈', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 60);
	
	ctx.fillStyle = '#DFE6E9';
	ctx.font = '14px system-ui';
	ctx.fillText('Clear storm clouds to reveal safe paths.', BASE_WIDTH / 2, BASE_HEIGHT / 2 - 20);
	ctx.fillText('Plant Rainbow Flags on resting unicorns!', BASE_WIDTH / 2, BASE_HEIGHT / 2);
	
	ctx.fillStyle = '#A29BFE';
	ctx.beginPath();
	ctx.roundRect(BASE_WIDTH / 2 - 80, BASE_HEIGHT / 2 + 40, 160, 48, 8);
	ctx.fill();
	
	ctx.fillStyle = '#1E2029';
	ctx.font = 'bold 16px system-ui';
	ctx.fillText('PLAY GAME', BASE_WIDTH / 2, BASE_HEIGHT / 2 + 70);
}

function drawModalOverlay(title, subtitle, color) {
	// Ease-in spring scale for the popup 
	if (modalScale < 1) {
		modalScale += (1 - modalScale) * 0.12;
	}
	
	ctx.fillStyle = 'rgba(26, 28, 35, 0.88)';
	ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
	
	ctx.save();
	ctx.translate(BASE_WIDTH / 2, BASE_HEIGHT / 2);
	ctx.scale(modalScale, modalScale);
	
	ctx.fillStyle = color;
	ctx.font = 'bold 24px system-ui';
	ctx.textAlign = 'center';
	ctx.fillText(title, 0, -40);
	
	ctx.fillStyle = '#DFE6E9';
	ctx.font = '14px system-ui';
	ctx.fillText(subtitle, 0, -5);
	
	// Primary Button: PLAY AGAIN 
	ctx.fillStyle = '#A29BFE';
	ctx.beginPath();
	ctx.roundRect(-90, 30, 180, 42, 8);
	ctx.fill();
	
	ctx.fillStyle = '#1E2029';
	ctx.font = 'bold 15px system-ui';
	ctx.fillText('PLAY AGAIN', 0, 56);
	
	// Secondary Button: MAIN MENU 
	ctx.fillStyle = "#485460";
	ctx.beginPath();
	ctx.roundRect(-90, 84, 180, 38, 8);
	ctx.fill();
	
	ctx.fillStyle = "#DFE6E9";
	ctx.font = "bold 14px system-ui";
	ctx.fillText("MAIN MENU", 0, 108);
	
	ctx.restore();
}

// ================================ 
// INPUT & GESTURE CONTROLLERS 
// ================================ 
function getCanvasCoords(clientX, clientY) {
	const rect = canvas.getBoundingClientRect();
	const clickX = (clientX - rect.left) / scaleFactor;
	const clickY = (clientY - rect.top) / scaleFactor;
	return { x: clickX, y: clickY };
}

function getTileFromCoords(clickX, clickY) {
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			let x = BOARD_PADDING + c * (TILE_SIZE + TILE_GAP);
			let y = HUD_HEIGHT + BOARD_PADDING + r * (TILE_SIZE + TILE_GAP);
			
			if (clickX >= x && clickX <= x + TILE_SIZE && 
				clickY >= y && clickY <= y + TILE_SIZE) {
					return { r: r, c: c };
			}
		}
	}
	return null;
}

function handleInput(clickX, clickY, isSecondary = false) {
	getAudioContext();

	// Handle Clicks on Start/Title Screen 
	if (gameState === STATE_MENU) {
		if (clickX >= BASE_WIDTH / 2 - 80 && clickX <= BASE_WIDTH / 2 + 80 && 
			clickY >= BASE_HEIGHT / 2 + 40 && clickY <= BASE_HEIGHT / 2 + 88) {
			initGame();
			sndPop();
		}
		return;
	}
	
	// Handle Clicks on Win/Loss Screens 
	if (gameState == STATE_WIN || gameState === STATE_GAMEOVER) {
		// PLAY AGAIN 
		if (clickX >= BASE_WIDTH / 2 - 90 && clickX <= BASE_WIDTH / 2 + 90 && 
			clickY >= BASE_HEIGHT / 2 + 30 && clickY <= BASE_HEIGHT / 2 + 72) {
			initGame();
			sndPop();
		}
		//  MAIN MENU 
		else if (clickX >= BASE_WIDTH / 2 - 90 && clickX <= BASE_WIDTH / 2 + 90 &&
				 clickY >= BASE_HEIGHT / 2 + 84 && clickY <= BASE_HEIGHT / 2 + 122) {
			gameState = STATE_MENU;
			stopMusic();
			sndPop();
		 }
		 return;
	}
	
	// Toggle Mobile Touch Flag Mode Switcher (⛏️ / 🌈) 
	if (gameState === STATE_PLAYING && 
		clickX >= 100 && clickX <= 170 && 
		clickY <= HUD_HEIGHT) {
		touchFlagMode = !touchFlagMode;
		sndPop();
		return;
	}
	
	// Handle Settings Gear Toggle Button 
	if (gameState === STATE_PLAYING && clickX >= BASE_WIDTH - 40 && clickY <= HUD_HEIGHT) {
		settingsOpen = !settingsOpen;
		sndPop();
		return;
	}
	
	// Handle Settings Dropdown Menu Clicks 
	if (settingsOpen) {
		const menuX = BASE_WIDTH - 170;
		const menuY = HUD_HEIGHT + 8;
		
		// Clicked Mute Option 
		if (clickX >= menuX && clickX <= menuX + 150 &&
			clickY >= menuY + 10 && clickY <= menuY + 40) {
			isMuted = !isMuted;
			sndPop();
			return;
		}
		
		// Clicked Inspector Mode Option 
		if (clickX >= menuX && clickX <= menuX + 150 && 
			clickY >= menuY + 40 && clickY <= menuY + 70) {
			inspectorMode = !inspectorMode;
			sndPop();
			return;
		}
		
		// Close dropdown when clicking anywhere else 
		settingsOpen = false;
		return;
	}
	
	// Handle Grid Clicks 
	let coords = getTileFromCoords(clickX, clickY);
	if (coords) {
		if (isSecondary || touchFlagMode) {
			toggleFlag(coords.r, coords.c);
		} else {
			revealTile(coords.r, coords.c);
		}
	}
}

// Mouse Control 
canvas.addEventListener("click", (e) => {
	const coords = getCanvasCoords(e.clientX, e.clientY);
	handleInput(coords.x, coords.y, false);
});

canvas.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	const coords = getCanvasCoords(e.clientX, e.clientY);
	handleInput(coords.x, coords.y, true);
});

// Touch & Long-Press Control Engine 
let touchTimer = null;
let touchStartPos = { x: 0, y: 0 };
let isLongPress = false;

canvas.addEventListener("touchstart", (e) => {
	if (e.touches.length > 1) return;
	const touch = e.touches[0];
	const coords = getCanvasCoords(touch.clientX, touch.clientY);
	touchStartPos = coords;
	isLongPress = false;
	
	// Trigger long press for mobile flagging (300ms hold)
	touchTimer = setTimeout(() => {
		isLongPress = true;
		if (navigator.vibrate) navigator.vibrate(40);		// Haptic feedback 
		handleInput(coords.x, coords.y, true);
	}, 300);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
	if (!touchTimer) return;
	const touch = e.touches[0];
	const coords = getCanvasCoords(touch.clientX, touch.clientY);
	// Cancel tap/hold if finger moves more than 10px 
	if (Math.hypot(coords.x - touchStartPos.x, coords.y - touchStartPos.y) > 10) {
		clearTimeout(touchTimer);
		touchTimer = null;
	}
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
	if (touchTimer) {
		clearTimeout(touchTimer);
		touchTimer = null;
		if (!isLongPress) {
			const touch = e.changedTouches[0];
			const coords = getCanvasCoords(touch.clientX, touch.clientY);
			handleInput(coords.x, coords.y, false);
		}
	}
	e.preventDefault();
}, { passive: false });

// Init & Start Animation Loop
resizeCanvas();
requestAnimationFrame(draw);