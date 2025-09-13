let fire_audio = document.getElementById('fire');
document.getElementById("fire").volume = 0.5;

let impact_audio = document.getElementById('impact');
document.getElementById("impact").volume = 0.5;

let pickup_audio = document.getElementById('pickup');
document.getElementById("pickup").volume = 0.5;

let music_audio = document.getElementById('music');
document.getElementById("music").volume = 0.5;

const TILE_SIZE = 8;
const SCALE = 5;
const PLAYER_MAX_SPEED = 0.4;
const PLAYER_JUMP_HEIGHT = 1.1;
const IMAGE_SOURCE = "spritesheet.png";
const canvas = document.getElementById('my_canvas');
const ctx = canvas.getContext('2d');
const keys = {
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
    arrowup: 'up',
    arrowleft: 'left',
    arrowdown: 'down',
    arrowright: 'right',
    " ": 'space'
};
let animation_id;
let player;
let scaled_canvas_width;
let scaled_canvas_height;
let tile_map;
let platforms = [];
let power_up;

let camera_x = 0;
let camera_y = 0;

let floor;

let enemies = [];
let spawn_points = [];

let world_width;
let world_height;
let enemy_spawned_count = 0;
let enemies_remaining = 0;

let has_collected_power_up = false;

class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.collected = false;

        this.frame_index = 0;
        this.frame_timer = 0;
        this.frame_interval = 12;
        this.y_offset = 0;
        this.float_speed = 0.02;
        this.max_float = 2;
        this.float_dir = 1;
    }

    update() {
        if (this.collected) return;

        this.y_offset += this.float_speed * this.float_dir;
        if (this.y_offset > this.max_float || this.y_offset < -this.max_float) {
            this.float_dir *= -1;
        }

        this.frame_timer++;
        if (this.frame_timer >= this.frame_interval) {
            this.frame_timer = 0;
            this.frame_index++;
            if (this.frame_index >= 4) {
                this.frame_index = 0;
            }
        }

        if (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        ) {
            this.collected = true;
            player.can_fire = true;
            has_collected_power_up = true;
            pickup_audio.play();
            music_audio.play()
            start_enemy_spawning();
            console.log("Power-up collected! You can now fire!");
        }
    }

    draw() {
        if (this.collected) return;

        ctx.drawImage(
            tile_map,
            this.frame_index * TILE_SIZE, 2 * TILE_SIZE,
            TILE_SIZE, TILE_SIZE,
            this.x, this.y + this.y_offset,
            this.width, this.height
        );
    }
}

class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update() {
    }
    draw() {
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Fireball {
    constructor(x, y, width, height, dx, dy) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.dx = dx;
        this.dy = dy;
        this.frame_index = 0;
        this.frame_timer = 0;
        this.frame_interval = 12;
        this.life_span = 300;
    }
    update() {
        this.y += this.dy;
        this.x += this.dx;
        this.life_span--;

        this.frame_timer++;
        if (this.frame_timer >= this.frame_interval) {
            this.frame_timer = 0;
            this.frame_index++;

            if (this.frame_index >= 4) {
                this.frame_index = 0;
            }
        }
    }
    draw() {
        ctx.save();
        if (this.dx < 0) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                tile_map,
                this.frame_index * TILE_SIZE, 2 * TILE_SIZE,
                TILE_SIZE, TILE_SIZE,
                -this.x - this.width, this.y,
                this.width, this.height
            );
        } else {
            ctx.drawImage(
                tile_map,
                this.frame_index * TILE_SIZE, 2 * TILE_SIZE,
                TILE_SIZE, TILE_SIZE,
                this.x, this.y,
                this.width, this.height
            );
        }
        ctx.restore();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.alive = true;
        this.is_counted = false;
        this.dy = 0;
        this.is_on_ground = true;
        this.speed = 0.1;
        this.jump_height = 0.8;
        this.fireballs = [];
        this.fire_cooldown = 0;

        this.facing = 'left';
        this.frame_index = 0;
        this.frame_timer = 0;
        this.frame_interval = 12;
        this.frame_index_y = 0;
    }
    update() {
        if (!this.alive) return;

        this.is_on_ground = false;

        if (player.x < this.x) {
            this.x -= this.speed;
            this.facing = 'left';
            this.frame_index_y = TILE_SIZE;
        } else if (player.x > this.x) {
            this.x += this.speed;
            this.facing = 'right';
            this.frame_index_y = TILE_SIZE;
        } else {
            this.frame_index_y = 0;
        }

        enemies.forEach(other_enemy => {
            if (other_enemy !== this && other_enemy.alive) {
                if (
                    Math.abs(this.x - other_enemy.x) < this.width &&
                    Math.abs(this.y - other_enemy.y) < this.height
                ) {
                    if (this.x < other_enemy.x) {
                        this.x -= 0.1;
                        other_enemy.x += 0.1;
                    } else {
                        this.x += 0.1;
                        other_enemy.x -= 0.1;
                    }
                }
            }
        });

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > world_width) this.x = world_width - this.width;

        if (!this.is_on_ground) {
            this.dy += 0.02;
        }
        this.y += this.dy;

        if (this.y + this.height >= floor.y) {
            this.y = floor.y - this.height;
            this.dy = 0;
            this.is_on_ground = true;
        }

        platforms.forEach(p => {
            if (
                this.y + this.height + this.dy >= p.y &&
                this.y + this.height <= p.y + p.height &&
                this.x + this.width > p.x &&
                this.x < p.x + p.width
            ) {
                this.y = p.y - this.height;
                this.is_on_ground = true;
                this.dy = 0;
            }
        });

        if (this.is_on_ground && Math.random() < 0.005) {
            this.dy = -this.jump_height;
            this.is_on_ground = false;
        }

        this.frame_timer++;
        if (this.frame_timer >= this.frame_interval) {
            this.frame_timer = 0;
            this.frame_index++;
            if (this.frame_index >= 4) {
                this.frame_index = 0;
            }
        }
    }
    draw() {
        if (!this.alive) return;

        ctx.save();
        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(
                tile_map,
                this.frame_index * TILE_SIZE, this.frame_index_y,
                TILE_SIZE, TILE_SIZE,
                -this.x - this.width, this.y,
                this.width, this.height
            );
        } else {
            ctx.drawImage(
                tile_map,
                this.frame_index * TILE_SIZE, this.frame_index_y,
                TILE_SIZE, TILE_SIZE,
                this.x, this.y,
                this.width, this.height
            );
        }
        ctx.restore();
    }
}


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.health = 3;
        this.alive = true;
        this.input = {
            up: false,
            left: false,
            down: false,
            right: false,
            space: false
        }
        this.dx = 0;
        this.dy = 0;
        this.is_on_ground = false;
        this.max_speed = PLAYER_MAX_SPEED;
        this.jump_height = PLAYER_JUMP_HEIGHT;
        this.facing = 'right';
        this.frame_index = 0;
        this.frame_timer = 0;
        this.frame_interval = 12;
        this.current_animation = 'idle';
        this.frame_index_y = 0;
        this.fireballs = [];
        this.fire_cooldown = 0;
        this.can_fire = false;
    }
    update() {
        this.is_on_ground = false;

        if (
            this.y + this.height + this.dy >= floor.y &&
            this.x + this.width > floor.x &&
            this.x < floor.x + floor.width
        ) {
            this.y = floor.y - this.height;
            this.is_on_ground = true;
        }

        if (!this.is_on_ground) {
            this.dy += 0.02;
        } else {
            this.dy = 0;
        }

        platforms.forEach(p => {
            if (
                this.y + this.height + this.dy >= p.y &&
                this.y + this.height <= p.y + p.height &&
                this.x + this.width > p.x &&
                this.x < p.x + p.width
            ) {
                this.y = p.y - this.height;
                this.is_on_ground = true;
                this.dy = 0;
            }
        });

        this.y += this.dy;
        this.x += this.dx;

        if (this.x < 0) {
            this.x = 0;
            this.dx = 0;
        }
        if (this.x + this.width > world_width) {
            this.x = world_width - this.width;
            this.dx = 0;
        }

        if (this.is_on_ground && this.input.up && this.dy < this.max_speed) {
            this.dy -= this.jump_height;
            this.is_on_ground = false;
        }
        if (this.input.left && this.dx > -this.max_speed) {
            this.dx -= this.max_speed;
            this.facing = 'left';
            this.current_animation = 'walking';
            this.frame_index_y = TILE_SIZE;
        }
        if (!this.input.left && !this.input.right) {
            this.dx = 0;
            this.current_animation = 'idle';
            this.frame_index_y = 0;
        }

        if (this.fire_cooldown > 0) this.fire_cooldown--;

        if (this.can_fire && this.input.space && this.fire_cooldown === 0) {
            this.firing = true;
            let fireball_speed_x = 0;
            if (this.dx == 0) {
                if (this.facing === 'left') {
                    fireball_speed_x -= this.max_speed * 2;
                } else {
                    fireball_speed_x = this.max_speed * 2;
                }
            } else {
                fireball_speed_x = this.dx * 2;
            }

            const fireSound = new Audio('fire.mp3');
            fireSound.volume = 0.5;
            fireSound.play();

            let new_fireball = new Fireball(this.x, this.y, TILE_SIZE, TILE_SIZE, fireball_speed_x, 0);
            this.fireballs.push(new_fireball);
            this.fire_cooldown = 30;
        }

        if (this.input.right && this.dx < this.max_speed) {
            this.dx += this.max_speed;
            this.facing = 'right';
            this.current_animation = 'walking';
            this.frame_index_y = TILE_SIZE;
        }

        this.frame_timer++;
        if (this.frame_timer >= this.frame_interval) {
            this.frame_timer = 0;
            this.frame_index++;

            if (this.frame_index >= 4) {
                this.frame_index = 0;
            }
        }

        this.fireballs.forEach(fireball => {
            fireball.update();
        });
    }
    draw() {
        this.fireballs.forEach(fireball => {
            fireball.draw();
        });

        ctx.save();
        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(
                tile_map,
                this.frame_index * TILE_SIZE, this.frame_index_y,
                TILE_SIZE, TILE_SIZE,
                -this.x - this.width, this.y,
                this.width, this.height
            );
        } else {
            ctx.drawImage(
                tile_map,
                this.frame_index * TILE_SIZE, this.frame_index_y,
                TILE_SIZE, TILE_SIZE,
                this.x, this.y,
                this.width, this.height
            );
        }

        ctx.restore();
    }
}

function update() {
    if (!player.alive) {
        return;
    }

    player.update();
    enemies.forEach(e => e.update());

    if (power_up && !power_up.collected) {
        power_up.update();
    } else if (power_up && power_up.collected) {
        power_up = null;
    }

    player.fireballs.forEach((fb, index) => {
        enemies.forEach(e => {
            if (
                e.alive &&
                fb.x < e.x + e.width &&
                fb.x + fb.width > e.x &&
                fb.y < e.y + e.height &&
                fb.y + fb.height > e.y
            ) {
                if (!e.is_counted) {
                    enemies_remaining--;
                    e.is_counted = true;
                }
                e.alive = false;
                
                const impactSound = new Audio('impact.mp3');
                impactSound.volume = 0.5;
                impactSound.play();
                player.fireballs.splice(index, 1);
            }
        });

        if (fb.life_span < 0) {
            player.fireballs.splice(index, 1);
        }
    });

    enemies.forEach(e => {
        if (
            e.alive &&
            player.x < e.x + e.width &&
            player.x + player.width > e.x &&
            player.y < e.y + e.height &&
            player.y + player.height > e.y
        ) {
            player.health--;            
            const impactSound = new Audio('impact.mp3');
            impactSound.volume = 0.5;
            impactSound.play();
            e.alive = false;
            enemies_remaining--;
            e.is_counted = true;
        }
    });

    if (player.health <= 0) {
        player.alive = false;
        cancelAnimationFrame(animation_id);
    }


    camera_x = player.x - scaled_canvas_width / 2 + player.width / 2;
    camera_y = player.y - scaled_canvas_height / 2 + player.height / 2;

    if (camera_x < 0) camera_x = 0;
    if (camera_x + scaled_canvas_width > world_width) camera_x = world_width - scaled_canvas_width;
    if (camera_y < 0) camera_y = 0;
    if (camera_y + scaled_canvas_height > world_height) camera_y = world_height - scaled_canvas_height;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera_x, -camera_y);

    ctx.fillStyle = "rgba(52,140,49)";
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);

    enemies.forEach(e => e.draw());

    player.draw();
    platforms.forEach(p => p.draw());

    draw_spawn_points();

    if (power_up) {
        power_up.draw();
    }

    ctx.restore();

    draw_ui();
}

function draw_spawn_points() {
    if (enemy_spawned_count < spawn_points.length) {
        ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        ctx.lineWidth = 0.1;
        spawn_points.forEach(point => {
            ctx.strokeRect(point.x, point.y, TILE_SIZE, TILE_SIZE);
        });
    }
}

function draw_ui() {
    if (enemies_remaining > 0 && player.health > 0) {
        ctx.font = "6px Arial";
        ctx.textAlign = "start";
        ctx.fillStyle = "white";
        ctx.fillText("Enemies Remaining: " + enemies_remaining, 0, 10);
    }

    ctx.font = "6px Arial";
    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.fillText("Health: ", 0, 17);
    for (let i = 0; i < player.health; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(23 + i * 8, 13, 5, 5);
    }

    if (enemies_remaining === 0) {
        ctx.fillStyle = "white";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("You Win!", 50, 10);
    } else if (player.health <= 0) {
        ctx.fillStyle = "white";
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", 50, 10);
    }
}

function start_enemy_spawning() {
    let spawn_interval = setInterval(() => {
        if (enemy_spawned_count < spawn_points.length) {
            const spawn_point = spawn_points[enemy_spawned_count];
            enemies.push(new Enemy(spawn_point.x, spawn_point.y));
            enemy_spawned_count++;
        } else {
            clearInterval(spawn_interval);
        }
    }, 500);
}

function loop() {
    update();
    draw();
    animation_id = requestAnimationFrame(loop);
}

function start() {
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    resize();

    world_width = scaled_canvas_width * 2;
    world_height = scaled_canvas_height;

    const platform_start_x = scaled_canvas_width / 3;
    const platform_start_y = scaled_canvas_height - TILE_SIZE;
    player = new Player(platform_start_x, platform_start_y - TILE_SIZE * 5);

    floor = {
        x: 0,
        y: scaled_canvas_height,
        width: world_width,
        height: TILE_SIZE
    };

    platforms = [
        new Platform(scaled_canvas_width / 2, scaled_canvas_height - TILE_SIZE * 2, TILE_SIZE * 4, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 + TILE_SIZE * 5, scaled_canvas_height - TILE_SIZE * 4, TILE_SIZE * 3, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 + TILE_SIZE * 9, scaled_canvas_height - TILE_SIZE * 6, TILE_SIZE * 2, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 - TILE_SIZE * 5, scaled_canvas_height - TILE_SIZE * 4, TILE_SIZE * 4, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 - TILE_SIZE * 9, scaled_canvas_height - TILE_SIZE * 6, TILE_SIZE * 3, TILE_SIZE),
        new Platform(scaled_canvas_width / 2, scaled_canvas_height - TILE_SIZE * 8, TILE_SIZE * 2, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 + TILE_SIZE * 15, scaled_canvas_height - TILE_SIZE * 2, TILE_SIZE * 5, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 + TILE_SIZE * 19, scaled_canvas_height - TILE_SIZE * 4, TILE_SIZE * 3, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 - TILE_SIZE * 15, scaled_canvas_height - TILE_SIZE * 2, TILE_SIZE * 5, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 - TILE_SIZE * 19, scaled_canvas_height - TILE_SIZE * 4, TILE_SIZE * 3, TILE_SIZE),
        new Platform(scaled_canvas_width / 2 - TILE_SIZE * 15, scaled_canvas_height - TILE_SIZE * 7, TILE_SIZE * 2, TILE_SIZE)
    ];

    const original_spawn_points = [
        {x: 50, y: floor.y - TILE_SIZE},
        {x: 100, y: floor.y - TILE_SIZE},
        {x: 200, y: floor.y - TILE_SIZE},
        {x: platforms[6].x + TILE_SIZE, y: platforms[6].y - TILE_SIZE},
        {x: platforms[8].x + TILE_SIZE, y: platforms[8].y - TILE_SIZE},
        {x: platforms[0].x + TILE_SIZE, y: platforms[0].y - TILE_SIZE},
        {x: platforms[1].x + TILE_SIZE, y: platforms[1].y - TILE_SIZE},
        {x: platforms[4].x + TILE_SIZE, y: platforms[4].y - TILE_SIZE},
        {x: platforms[5].x + TILE_SIZE, y: platforms[5].y - TILE_SIZE},
    ];

    spawn_points = original_spawn_points.concat(original_spawn_points, original_spawn_points);

    enemies_remaining = spawn_points.length;

    const top_most_platform = platforms.at(1);
    power_up = new PowerUp(top_most_platform.x + TILE_SIZE / 2, top_most_platform.y - TILE_SIZE * 2);

    let image = new Image();
    image.src = IMAGE_SOURCE;
    image.onload = function() {
        tile_map = image;
        animation_id = requestAnimationFrame(loop);
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scaled_canvas_width = canvas.width / SCALE;
    scaled_canvas_height = canvas.height / SCALE;

    ctx.scale(SCALE, SCALE);
    ctx.imageSmoothingEnabled = false;
}

document.addEventListener('keydown', (event) => {
    const dir = keys[event.key.toLocaleLowerCase()];
    if (dir) {
        player.input[dir] = true;
    }
});

document.addEventListener('keyup', (event) => {
    const dir = keys[event.key.toLocaleLowerCase()];
    if (dir) {
        player.input[dir] = false;
    }
});

start();