// entities and particles are in objects.js

/*
    for asteroid density, 0.05 is very few asteroids, 0.2 is a lot and almost impossible to dodge
*/
var asteroid_density = 0.05;
var powerup_chance = 0.0015;

function reset() {
    // clear everything
    entities   = [];
    game_state = "menu";
    player     = null;
    score      = 0;
}

function start() {
    // give the player a new rocket
    player = new Rocket();
    entities.push(player);

    game_state = "playing";
    frames     = 0;
}

/**
 * @param { number } lapse 
 */
function update(lapse) {
    // detect if the space bar is pressed
    if (space_bar & KEY_PRESSED) {
        if (game_state == "menu") {
            start();
            space_bar = KEY_SEEN;
        }
        if (game_state == "game over") {
            reset();
            space_bar = KEY_SEEN;
        }
    }

    // update everything as usual
    entities = entities.filter(e => e.active);
    entities.forEach(e => e.update(lapse, entities));

    particles = particles.filter(p => p.lifetime > 0);
    particles.forEach(p => p.update(lapse));

    if (Math.random() < asteroid_density) {
        entities.push(new Asteroid(Math.random() * canvas_size, Math.floor(Math.random() * 8 + 5), new Colour(255, 255, 255)));
    }

    if (Math.random() < powerup_chance) {
        entities.push(new Powerup(Math.random() * canvas_size, ["shield", "gun", "totem"][Math.floor(Math.random() * 3)], new Colour(255, 0, 0)));
    }

    if (fire_gun) {
        entities.push(new Bullet());
        fire_gun = !fire_gun;
    }

    if (game_state == "playing" && (frames % 60) == 0) {
        score++;
    }
}

var last_time = null;
function animate(time) {
    var lapse = last_time == null ? 0 : time - last_time;
    lapse     = Math.min(lapse, 33);
    last_time = time;
    update(lapse);
    draw(entities, particles, context);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);