// --- GAME SETUP ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 40;
const COLS = 15;
const ROWS = 12;
canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE;

// UI Elements
const timerEl = document.getElementById('timer');
const fishCountEl = document.getElementById('fish-count');
const messageEl = document.getElementById('message');

// Game state
let player, level, dogs, fish, otherPlayers, timeLeft, timerInterval, gameState;

// Multiplayer WebSocket setup
// This URL is now correctly parsed by the new connection function.
const RELAY_URL = 'wss://relay.js13kgames.com/shadow-prowler';
let ws;
const myId = Math.random().toString(36).substr(2, 9);


// --- CORE GAME LOGIC ---

function setupLevel() {
    gameState = 'playing';
    messageEl.textContent = '';
    timeLeft = 60;
    otherPlayers = new Map();

    // Level definition: 0=floor, 1=wall, 2=shadow
    level = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,2,2,2,0,0,0,1,0,0,0,1],
        [1,0,1,2,2,1,2,1,1,0,1,0,1,0,1],
        [1,0,1,2,2,1,2,1,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
        [1,2,2,1,0,1,1,1,0,1,2,2,1,0,1],
        [1,2,2,1,0,1,0,0,0,1,2,2,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,0,1,2,1],
        [1,0,0,0,0,1,0,0,0,0,0,0,1,2,1],
        [1,2,2,2,0,0,0,1,0,0,1,0,0,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    player = { x: 1, y: 1, hidden: false };
    fish = [{x: 13, y: 1}, {x: 1, y: 10}, {x: 8, y: 4}];
    dogs = [
        { x: 7, y: 2, path: [{x:7,y:2},{x:7,y:5}], target: 1, speed: 0.03 },
        { x: 2, y: 8, path: [{x:2,y:8},{x:10,y:8}], target: 1, speed: 0.05 }
    ];

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            gameOver('Time is up!');
        }
    }, 1000);

    updateUI();
    connectWebSocket();
}

function update() {
    if (gameState !== 'playing') return;
    
    moveDogs();
    checkCollisions();
    updateUI();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw level
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const tile = level[y][x];
            if (tile === 1) ctx.fillStyle = '#4a4a4a'; // Wall
            else if (tile === 2) ctx.fillStyle = '#2a2a2a'; // Shadow
            else ctx.fillStyle = '#383838'; // Floor
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Draw fish
    ctx.fillStyle = '#ff8c00';
    fish.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x * TILE_SIZE + TILE_SIZE / 2, f.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw dogs and their vision cones
    dogs.forEach(dog => {
        // Dog body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(dog.x * TILE_SIZE + 5, dog.y * TILE_SIZE + 5, TILE_SIZE - 10, TILE_SIZE - 10);
        
        // Vision cone
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        const visionX = dog.x * TILE_SIZE + TILE_SIZE/2;
        const visionY = dog.y * TILE_SIZE + TILE_SIZE/2;
        const dir = Math.sign(dog.path[dog.target].x - dog.x) || Math.sign(dog.path[dog.target].y - dog.y);
        
        if (dog.path[dog.target].x !== dog.path[0].x) { // Horizontal
             ctx.moveTo(visionX, visionY);
             ctx.lineTo(visionX + dir * 3 * TILE_SIZE, visionY - 1.5 * TILE_SIZE);
             ctx.lineTo(visionX + dir * 3 * TILE_SIZE, visionY + 1.5 * TILE_SIZE);
        } else { // Vertical
             ctx.moveTo(visionX, visionY);
             ctx.lineTo(visionX - 1.5 * TILE_SIZE, visionY + dir * 3 * TILE_SIZE);
             ctx.lineTo(visionX + 1.5 * TILE_SIZE, visionY + dir * 3 * TILE_SIZE);
        }
        ctx.closePath();
        ctx.fill();
    });

    // Draw other players (ghosts)
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#aaa';
    otherPlayers.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * TILE_SIZE + TILE_SIZE/2, p.y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE/2 - 5, 0, 2 * Math.PI);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw player (black cat)
    ctx.fillStyle = player.hidden ? '#444' : '#000';
    ctx.beginPath();
    ctx.arc(player.x * TILE_SIZE + TILE_SIZE/2, player.y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE/2 - 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw cat ears
    const baseX = player.x * TILE_SIZE + TILE_SIZE/2;
    const baseY = player.y * TILE_SIZE + TILE_SIZE/2 - (TILE_SIZE/2 - 5);
    ctx.beginPath();
    ctx.moveTo(baseX - 7, baseY);
    ctx.lineTo(baseX - 2, baseY - 5);
    ctx.lineTo(baseX - 5, baseY + 2);
    ctx.moveTo(baseX + 7, baseY);
    ctx.lineTo(baseX + 2, baseY - 5);
    ctx.lineTo(baseX + 5, baseY + 2);
    ctx.fill();
}

function moveDogs() {
    dogs.forEach(dog => {
        const target = dog.path[dog.target];
        if (Math.abs(dog.x - target.x) < 0.1 && Math.abs(dog.y - target.y) < 0.1) {
            dog.target = 1 - dog.target; // Switch target
        }
        const newTarget = dog.path[dog.target];
        dog.x += Math.sign(newTarget.x - dog.x) * dog.speed;
        dog.y += Math.sign(newTarget.y - dog.y) * dog.speed;
    });
}

function checkCollisions() {
    // Check if player is hidden
    player.hidden = (level[player.y][player.x] === 2);

    // Fish collection
    const fishIndex = fish.findIndex(f => f.x === player.x && f.y === player.y);
    if (fishIndex !== -1) {
        fish.splice(fishIndex, 1);
        if (fish.length === 0) {
            gameOver('You got all the fish!');
        }
    }

    // Dog collision
    if (!player.hidden) {
        dogs.forEach(dog => {
            if (Math.floor(dog.x) === player.x && Math.floor(dog.y) === player.y) {
                gameOver('Caught by a dog!');
            }
            // Check vision cone (simplified check)
            const dx = player.x - Math.floor(dog.x);
            const dy = player.y - Math.floor(dog.y);
            const dir = Math.sign(dog.path[dog.target].x - dog.x) || Math.sign(dog.path[dog.target].y - dog.y);
            
            // Horizontal patrol
            if (dog.path[dog.target].y === dog.path[0].y && Math.sign(dx) === dir && Math.abs(dx) < 3 && Math.abs(dy) <=1) {
                gameOver('Spotted!');
            }
            // Vertical patrol
            if (dog.path[dog.target].x === dog.path[0].x && Math.sign(dy) === dir && Math.abs(dy) < 3 && Math.abs(dx) <=1) {
                gameOver('Spotted!');
            }
        });
    }
}

function updateUI() {
    timerEl.textContent = timeLeft;
    fishCountEl.textContent = `${3 - fish.length}/3`;
}

function gameOver(message) {
    if (gameState !== 'playing') return;
    gameState = 'over';
    clearInterval(timerInterval);
    messageEl.textContent = `${message} Press R to restart.`;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- INPUT HANDLING ---

window.addEventListener('keydown', e => {
    if (gameState !== 'playing') {
        if (e.key.toLowerCase() === 'r') {
            setupLevel();
        }
        return;
    }

    let newX = player.x;
    let newY = player.y;

    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') newY--;
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') newY++;
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') newX--;
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') newX++;

    if (level[newY][newX] !== 1) { // Not a wall
        player.x = newX;
        player.y = newY;
        sendPosition();
    }
});


// --- MULTIPLAYER (OPTIONAL) --- [UPDATED SECTION]

function connectWebSocket() {
    // This function is now wrapped in a try-catch block.
    // This makes the online feature truly optional: if the connection
    // fails for any reason (bad URL, server down, library not loaded),
    // it won't crash the offline single-player game.
    try {
        // The original RELAY_URL was not structured correctly for PartySocket.
        // It expects a 'host' and a 'room' separately. We parse them here.
        const url = new URL(RELAY_URL);
        const host = url.hostname;
        const room = url.pathname.substring(1); // Remove leading '/'

        // We only try to connect if the URL looks like a real one.
        if (host.includes('js13kgames.com')) {
             ws = new PartySocket({
                host: host,
                room: room,
             });

            ws.onopen = () => {
                console.log(`Connected to game server room: ${room}`);
                sendPosition();
            };
        
            ws.onmessage = event => {
                const data = JSON.parse(event.data);
                if (data.id !== myId) {
                    otherPlayers.set(data.id, { x: data.x, y: data.y });
                }
            };
        
            ws.onclose = () => {
                console.log('Disconnected from game server.');
            };

            ws.onerror = (err) => {
                console.error("WebSocket Error:", err);
            };

        } else {
            console.warn("Multiplayer disabled: Using placeholder URL.");
        }
    } catch (error) {
        console.error("Could not establish WebSocket connection:", error);
    }
}

function sendPosition() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ id: myId, x: player.x, y: player.y }));
    }
}


// --- INITIALIZE GAME ---
setupLevel();
gameLoop();