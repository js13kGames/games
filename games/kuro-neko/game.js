if (localStorage.getItem('KuroNeko_HighScore') === null) {
    localStorage.setItem('KuroNeko_HighScore', '0');
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScoreElement = document.getElementById('highScoreValue');
const livesElement = document.getElementById('livesValue');
const gameOverElement = document.getElementById('gameOver');
const startScreenElement = document.getElementById('startScreen');
const finalScoreElement = document.getElementById('finalScore');

const catSprite = new Image();
const ghostSprite = new Image();
const redGhostSprite = new Image();
const playerSprite = new Image();
const grassSprite = new Image();         
ghostSprite.src = 'asset/ghost.png';
redGhostSprite.src = 'asset/red.png'; 
catSprite.src = 'asset/neko.png';
playerSprite.src = 'asset/player.png';
grassSprite.src = 'asset/grass.jpg';

let lastRedGhostTime = 0;
const RED_GHOST_INTERVAL = 7000;

const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 2400;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 150;

const MAX_REGULAR_GHOSTS = 9;
const MAX_RED_GHOSTS = 2;

let gameRunning = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('KuroNeko_HighScore'));
let lives = 9;
let camera = { x: 0, y: 0 };

highScoreElement.textContent = highScore;

let cat = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    radius: 15,
    speed: 3.5,
    facingLeft: false
};

let owner = {
    x: WORLD_WIDTH / 2 + 100,
    y: WORLD_HEIGHT / 2 + 100,
    radius: 12,
    speed: 0.8,
    direction: Math.random() * Math.PI * 2,
    changeDirectionTimer: 0,
    facingLeft: false
};

let enemies = [];
let obstacles = [];

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

function createObstacles() {
    obstacles = [];
    for (let i = 0; i < 20; i++) {
        obstacles.push({
            x: Math.random() * (WORLD_WIDTH - 100),
            y: Math.random() * (WORLD_HEIGHT - 100),
            width: 40 + Math.random() * 60,
            height: 40 + Math.random() * 60
        });
    }
}

function circleCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + obj2.radius;
}

function circleRectCollision(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

function isValidPosition(obj, newX, newY) {
    const tempObj = { ...obj, x: newX, y: newY };
    for (let obstacle of obstacles) {
        if (circleRectCollision(tempObj, obstacle)) {
            return false;
        }
    }
    return newX >= obj.radius && newX <= WORLD_WIDTH - obj.radius && 
            newY >= obj.radius && newY <= WORLD_HEIGHT - obj.radius;
}

function updateCat() {
    let newX = cat.x;
    let newY = cat.y;

    if (keys['w'] || keys['ArrowUp']) newY -= cat.speed;
    if (keys['s'] || keys['ArrowDown']) newY += cat.speed;
    if (keys['a'] || keys['ArrowLeft']) {
        newX -= cat.speed;
        cat.facingLeft = true;
    }
    if (keys['d'] || keys['ArrowRight']) {
        newX += cat.speed;
        cat.facingLeft = false;
    }

    if (isValidPosition(cat, newX, cat.y)) {
        cat.x = newX;
    }
    if (isValidPosition(cat, cat.x, newY)) {
        cat.y = newY;
    }
}

function updateOwner() {
    owner.changeDirectionTimer++;
    
    if (owner.changeDirectionTimer > 120 + Math.random() * 240) {
        owner.direction = Math.random() * Math.PI * 2;
        owner.changeDirectionTimer = 0;
    }

    const moveX = Math.cos(owner.direction) * owner.speed;
    const newX = owner.x + moveX;
    const newY = owner.y + Math.sin(owner.direction) * owner.speed;

    if (isValidPosition(owner, newX, newY)) {
        owner.x = newX;
        owner.y = newY;
        if (moveX !== 0) {
            owner.facingLeft = moveX < 0;
        }
    } else {
        owner.direction = Math.random() * Math.PI * 2;
    }
}

function spawnEnemy(isRedGhost = false) {
    let shouldSpawn = false;
    
    const regularGhostCount = enemies.filter(enemy => !enemy.isRed).length;
    const redGhostCount = enemies.filter(enemy => enemy.isRed).length;
    
    if (isRedGhost) {
        if (redGhostCount < MAX_RED_GHOSTS) {
            shouldSpawn = true;
        }
    } else if (Math.random() < 0.02) {
        if (regularGhostCount < MAX_REGULAR_GHOSTS) {
            shouldSpawn = true;
        }
    }
    
    if (shouldSpawn) {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
            case 0: 
                x = Math.random() * WORLD_WIDTH;
                y = 0;
                break;
            case 1: 
                x = WORLD_WIDTH;
                y = Math.random() * WORLD_HEIGHT;
                break;
            case 2: 
                x = Math.random() * WORLD_WIDTH;
                y = WORLD_HEIGHT;
                break;
            case 3: 
                x = 0;
                y = Math.random() * WORLD_HEIGHT;
                break;
        }

        const baseSpeed = 1.2 + Math.random() * 0.8;
        enemies.push({
            x: x,
            y: y,
            radius: 10,
            speed: isRedGhost ? baseSpeed * 1.5 : baseSpeed,
            facingRight: false,
            isRed: isRedGhost
        });
    }
}

function cleanupDistantEnemies() {
    const MAX_DISTANCE = WORLD_WIDTH * 0.8;
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const dx = owner.x - enemy.x;
        const dy = owner.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > MAX_DISTANCE) {
            enemies.splice(i, 1);
        }
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        
        const dx = owner.x - enemy.x;
        const dy = owner.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const moveX = (dx / distance) * enemy.speed;
            enemy.x += moveX;
            enemy.y += (dy / distance) * enemy.speed;
            enemy.facingRight = moveX > 0;
        }

        if (circleCollision(enemy, cat)) {
            enemies.splice(i, 1);
            score += 1;
            scoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('KuroNeko_HighScore', highScore);
                highScoreElement.textContent = highScore;
            }
            continue;
        }
        
        if (circleCollision(enemy, owner)) {
            enemies.splice(i, 1);
            lives--;
            livesElement.textContent = lives;
            
            if (lives <= 0) {
                gameRunning = false;
                gameOverElement.style.display = 'block';
                finalScoreElement.textContent = score;
            }
            continue;
        }

        if (distance > WORLD_WIDTH) {
            enemies.splice(i, 1);
        }
    }
}

function updateCamera() {
    camera.x = owner.x - CANVAS_WIDTH / 2;
    camera.y = owner.y - CANVAS_HEIGHT / 2;

    camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH - CANVAS_WIDTH));
    camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT - CANVAS_HEIGHT));
}

function drawGrid() {
    if (grassSprite && grassSprite.complete) {
        const startX = Math.floor(camera.x / GRID_SIZE) * GRID_SIZE;
        const startY = Math.floor(camera.y / GRID_SIZE) * GRID_SIZE;
        
        const endX = startX + CANVAS_WIDTH + GRID_SIZE;
        const endY = startY + CANVAS_HEIGHT + GRID_SIZE;
        
        for (let y = startY; y < endY; y += GRID_SIZE) {
            for (let x = startX; x < endX; x += GRID_SIZE) {
                ctx.drawImage(
                    grassSprite,
                    x - camera.x,
                    y - camera.y,
                    GRID_SIZE,
                    GRID_SIZE
                );
            }
        }
    }
}

function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawGrid();

    ctx.fillStyle = '#444';
    for (let obstacle of obstacles) {
        const screenX = obstacle.x - camera.x;
        const screenY = obstacle.y - camera.y;
        
        if (screenX + obstacle.width >= 0 && screenX <= CANVAS_WIDTH &&
            screenY + obstacle.height >= 0 && screenY <= CANVAS_HEIGHT) {
            ctx.fillRect(screenX, screenY, obstacle.width, obstacle.height);
        }
    }

    for (let enemy of enemies) {
        const screenX = enemy.x - camera.x;
        const screenY = enemy.y - camera.y;
        
        if (screenX >= -enemy.radius && screenX <= CANVAS_WIDTH + enemy.radius &&
            screenY >= -enemy.radius && screenY <= CANVAS_HEIGHT + enemy.radius) {
            
            const currentSprite = enemy.isRed ? redGhostSprite : ghostSprite;
            
            if (currentSprite && currentSprite.complete) {
                const spriteSize = enemy.radius * 3;
                ctx.save();

                if (!enemy.facingRight) {
                    ctx.drawImage(currentSprite,
                        screenX - spriteSize/2,
                        screenY - spriteSize/2,
                        spriteSize,
                        spriteSize
                    );
                } else {
                    ctx.scale(-1, 1);
                    ctx.drawImage(currentSprite,
                        -screenX - spriteSize/2,
                        screenY - spriteSize/2,
                        spriteSize,
                        spriteSize
                    );
                }
                ctx.restore();
            }
            
            ctx.shadowColor = '#ffffff44';
            ctx.shadowBlur = 15;
            ctx.shadowBlur = 0;
        }
    }

    const ownerScreenX = owner.x - camera.x;
    const ownerScreenY = owner.y - camera.y;
    if (playerSprite && playerSprite.complete) {
        const spriteSize = owner.radius * 8;
        ctx.save();
        if (owner.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(playerSprite,
                -ownerScreenX - spriteSize/2,
                ownerScreenY - spriteSize/2,
                spriteSize,
                spriteSize
            );
        } else {
            ctx.drawImage(playerSprite,
                ownerScreenX - spriteSize/2,
                ownerScreenY - spriteSize/2,
                spriteSize,
                spriteSize
            );
        }
        ctx.restore();
    }

    const catScreenX = cat.x - camera.x;
    const catScreenY = cat.y - camera.y;
    if (catSprite && catSprite.complete) {
        const spriteSize = cat.radius * 3;
        ctx.save();
        if (cat.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(catSprite, 
                -catScreenX - spriteSize/2, 
                catScreenY - spriteSize/2,
                spriteSize,
                spriteSize
            );
        } else {
            ctx.drawImage(catSprite, 
                catScreenX - spriteSize/2, 
                catScreenY - spriteSize/2,
                spriteSize,
                spriteSize
            );
        }
        ctx.restore();
    }
}

function gameLoop() {
    if (!gameRunning) return;

    const currentTime = Date.now();
    
    if (currentTime - lastRedGhostTime >= RED_GHOST_INTERVAL) {
        spawnEnemy(true);
        lastRedGhostTime = currentTime;
    }

    updateCat();
    updateOwner();
    spawnEnemy(false);
    updateEnemies();
    cleanupDistantEnemies();
    updateCamera();
    draw();

    requestAnimationFrame(gameLoop);
}

function restartGame() {
    gameRunning = true;
    score = 0;
    lives = 9;
    enemies = [];
    lastRedGhostTime = Date.now(); 
    startScreenElement.style.display = 'none';
    
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
    
    cat.x = WORLD_WIDTH / 2;
    cat.y = WORLD_HEIGHT / 2;
    owner.x = WORLD_WIDTH / 2 + 100;
    owner.y = WORLD_HEIGHT / 2 + 100;
    owner.direction = Math.random() * Math.PI * 2;
    owner.changeDirectionTimer = 0;

    scoreElement.textContent = score;
    livesElement.textContent = lives;
    gameOverElement.style.display = 'none';

    createObstacles();
    gameLoop();
}

function startGame() {
    gameRunning = true;
    lastRedGhostTime = Date.now(); 
    startScreenElement.style.display = 'none';
    createObstacles();
    gameLoop();
}

draw();