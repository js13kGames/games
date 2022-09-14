/**
 * @type { HTMLCanvasElement }
 */
const canvas  = document.querySelector("canvas");
const context = canvas.getContext("2d");

const canvas_size = Math.min(window.innerWidth, window.innerHeight) - 2;

canvas.width = canvas.height = canvas_size;

// not sure if i'll be needing this
class Sprite {
    /**
     * @param { string } path the path pointing to the sprite
     */
    constructor(path) {
        this.img     = new Image();
        this.img.src = path;
        this.width   = this.img.width;
        this.height  = this.img.height;
    }
}

/**
 * 
 * @param { CanvasRenderingContext2D } context 
 * @param { string } text 
 * @param { number } x 
 * @param { number } y 
 * @param { string } background_colour 
 * @param { string } text_colour 
 */
function fill_text_with_background(context, text, x, y, padding, background_colour, text_colour) {
    var text_metrics = context.measureText(text);
    var draw_x       = 0;
    var draw_y       = 0;
    switch (context.textAlign) {
        // going to assume English, unless i learn some more languages. human languages, not programmming languages
        case "start":
        case "left":
            draw_x = x;
            break;
        case "center":
            draw_x = x - text_metrics.width / 2;
            break;
        case "right":
        case "end":
            draw_x = x - text_metrics.width;
            break;
    }
    draw_x = draw_x - padding;
    draw_y = y - text_metrics.actualBoundingBoxAscent - padding;

    var draw_width  = text_metrics.width + 2 * padding;
    var draw_height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent + 2 * padding;

    context.save();
    context.fillStyle = background_colour;
    context.fillRect(draw_x, draw_y, draw_width, draw_height);
    context.fillStyle = text_colour;
    context.fillText(text, x, y);
    context.restore();
}

/**
 * 
 * @param { Entity[] } objects 
 * @param { Line_particle[] } particles
 * @param { CanvasRenderingContext2D } context 
 */
function draw(objects, particles, context) {
    context.clearRect(0, 0, canvas_size, canvas_size);
    context.lineWidth = 4;
    objects.forEach(obj => {
        if (!obj.active) return;
        context.strokeStyle = obj.colour.to_string();
        if (obj.constructor == Rocket) {
            // draw an arrow to guide the player and show them where their ship is going next
            var draw_arrow_direction;
            if (!space_bar) {
                // we need to draw the opposite direction
                if (obj.direction == "left") {
                    draw_arrow_direction = "right";
                } else {
                    draw_arrow_direction = "left";
                }
            } else {
                draw_arrow_direction = obj.direction;
            }

            context.fillStyle = "lime";
            context.save();
            context.translate(obj.position.x, obj.position.y);
            context.beginPath();
            switch (draw_arrow_direction) {
                case "left":
                    context.moveTo(-30, 15);
                    context.lineTo(-30, -15);
                    context.lineTo(-45, 0);
                    break;
                case "right":
                    context.moveTo(30, 15);
                    context.lineTo(30, -15);
                    context.lineTo(45, 0);
                    break;
            }
            context.closePath();
            context.fill();
            context.restore();

            if (Math.floor(obj.invincibility / 200) % 2) {
                return;
            }
        }
        context.beginPath();
        context.shadowColor = obj.colour.to_string();
        context.shadowBlur = 80;
        obj.get_lines().forEach(line => {
            context.moveTo(line.start.x, line.start.y);
            context.lineTo(line.end.x, line.end.y);
        });
        context.closePath();
        context.stroke();
    });

    particles.forEach(particle => {
        context.strokeStyle = particle.colour.to_string();
        context.beginPath();
        context.moveTo(particle.start.x, particle.start.y);
        context.lineTo(particle.end.x, particle.end.y);
        context.closePath();
        context.stroke();
    });

    context.save();

    switch (game_state) {
        case "menu":
            context.font      = "30px sans-serif";
            context.textAlign = "center";
            fill_text_with_background(context, "weaving rocket", canvas_size / 2, canvas_size / 2, 3, "black", "white");
            context.font = "15px sans-serif";
            fill_text_with_background(context, "use the SPACE BAR to weave in between the asteroids", canvas_size / 2, canvas_size / 2 + 40, "black", "white");
            if (frames % 60 < 30) {
                context.font = "15px sans-serif";
                fill_text_with_background(context, "press SPACE to start", canvas_size / 2, canvas_size / 2 + 80, "black", "white");
            }
            break;
        case "game over":
            context.font      = "30px sans-serif";
            context.textAlign = "center";
            fill_text_with_background(context, "GAME OVER", canvas_size / 2, canvas_size / 2, 3, "black", "white");
            if (frames % 60 < 30) {
                context.font = "15px sans-serif";
                fill_text_with_background(context, "press SPACE to restart", canvas_size / 2, canvas_size / 2 + 40, "black", "white");
            }
            break;
        case "playing":
            if (player == null) break;
            context.font         = "25px sans-serif";
            context.textAlign    = "left";
            context.textBaseline = "top";
            fill_text_with_background(context, `health: ${ player.health }`, 3, 3, 5, "black", "white");
            fill_text_with_background(context, `score: ${ score }`, 3, 41, 5, "black", "white");
            if (high_score) {
                fill_text_with_background(context, `best: ${ high_score }`, 3, 79, 5, "black", "white");
            }
    }

    context.restore();

    frames++;
}