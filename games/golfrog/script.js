const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
});
const overlay = document.getElementById("overlay");
const hole = document.getElementById("hole");
const jumps = document.getElementById("jumps");
const stars = document.getElementById("stars");
const message = document.getElementById("message");
const menu = document.getElementById("menu");
const gameover = document.getElementById("gameover");

const dbg = {};

// https://lospec.com/palette-list/snap-12
const colors = [
    "#ffffff", "#ffd588", "#72cb48", "#b2d4d4",
    "#c45544", "#cc9155", "#0a8a71", "#66aaf7",
    "#7f3355", "#000000", "#114c77", "#8891aa",
];

// Seeded random number generator
const seed = dbg.seed = Date.now();
const seededRandom = (s) => {
    const random = (from = 0, to = 1) => {
        const value = (2 ** 31 - 1 & (s = Math.imul(48271, s + seed))) / 2 ** 31;
        return from + value * (to - from);
    };
    for (let i = 0; i < 20; i++) {
        random();
    }
    return random;
};

const camera = {
    pos: { x: 5, y: -2 },
    vel: Vec.zero(),
    size: 10,
};
const screenToWorld = (pos) => Vec.add(
    Vec.scale(Vec.subtract(pos, { x: .5, y: .5 }), camera.size),
    camera.pos);
const worldToScreen = (pos) => Vec.add(
    Vec.scale(Vec.subtract(pos, camera.pos), camera.size ** -1),
    { x: .5, y: .5 });

const playerTriangle = [
    {
        x: [-.3, 0, .3],
        y: [0, -.5, 0],
        color: 2,
        fill: true,
    }, {
        x: [-.12],
        y: [-.55],
        w: .2,
        color: 0,
    }, {
        x: [.12],
        y: [-.55],
        w: .2,
        color: 0,
    }, {
        x: [-.1],
        y: [-.55],
        w: .1,
        color: 9,
    }, {
        x: [.1],
        y: [-.55],
        w: .1,
        color: 9,
    }
];

const playerCircle = [
    {
        x: [0],
        y: [-.25],
        w: .7,
        color: 2,
    }, {
        x: [-.12],
        y: [-.55],
        w: .2,
        color: 0,
    }, {
        x: [.12],
        y: [-.55],
        w: .2,
        color: 0,
    }, {
        x: [-.1],
        y: [-.55],
        w: .1,
        color: 9,
    }, {
        x: [.1],
        y: [-.55],
        w: .1,
        color: 9,
    }
];

const player = {
    pos: Vec.zero(),
    vel: Vec.zero(),
    rot: 0,
    age: 0,
    damping: .5,
    gravity: 10,
    physics: {
        bounce: 0,
        friction: 0,
    },
    jump: {
        force: 20,
        limit: .6,
    },
    shapes: playerTriangle,
    shadow: .25,
};

const flag = {
    pos: Vec.zero(),
    stick: true,
    age: 0,
    shapes: [
        {
            x: [0, 0],
            y: [0, -.4],
            color: 5,
        }, {
            x: [0, 0, .4],
            y: [-.4, -.7, -.4],
            color: 4,
            fill: true,
        }
    ],
    shadow: .1,
};

const createCloud = (pos) => ({
    pos,
    shapes: [
        {
            x: [-1.5],
            y: [-1],
            w: 2,
            color: 11,
        }, {
            x: [.15],
            y: [-1.75],
            w: 2,
            color: 11,
        }, {
            x: [1.5],
            y: [-1],
            w: 2,
            color: 11,
        }, {
            x: [-1.5, 1.5],
            y: [-.5, -.5],
            w: 1,
            color: 11,
        },
    ],
});

const createStar = (pos) => ({
    star: pos,
    pos: Vec.zero(),
    age: 0,
    shapes: [
        {
            x: [0, -.07, -.26, -.12, -.16, 0, .16, .12, .26, .07],
            y: [-.5, -.32, -.3, -.18, 0, -.09, 0, -.18, -.3, -.32],
            w: .1,
            color: 1,
            fill: true,
        }
    ],
    shadow: .15,
});

const state = {
    hole: 1,
    jumps: 0,
    totalJumps: 0,
    stars: 0,
    totalStars: 0,
    message: "",
    won: false,
    wonAge: 0,
    outOfBounds: false,
    outOfBoundsAge: 0,
    paused: false,
};

const input = {
    primary: false,
    dragStart: Vec.zero(),
    dragEnd: Vec.zero(),
};

let entities = [];
let ground = null;

const startHole = (h) => {
    state.hole = h;
    state.jumps = state.stars = 0;
    state.won = false;
    state.wonAge = 0;
    entities = [flag, player];
    if (h === 1) {
        state.message = "Drag to jump";
        player.pos = { x: Math.PI / 2, y: 0 };
        flag.pos = { x: 2.5 * Math.PI, y: 0 };
        ground = (x) => .5 - .5 * Math.sin(x);
    } else if (h === 2) {
        state.message = "Collect stars\n (if you like)";
        player.pos = { x: Math.PI / 2, y: 0 };
        flag.pos = { x: 2.5 * Math.PI, y: 0 };
        entities.push(createStar({ x: 3, y: -1.5 }));
        entities.push(createStar({ x: 4.5, y: -2.3 }));
        entities.push(createStar({ x: 6, y: -1.5 }));
        entities.push(createCloud({ x: 5.5, y: -3.5 }));
        ground = (x) => .5 - .9 * Math.sin(x) - .5 * Math.sin(.2 * x);
    } else if (h === 3) {
        state.message = "Tap & hold while\njumping to bounce";
        player.pos = { x: Math.PI / 2, y: 1 };
        flag.pos = { x: 2.5 * Math.PI, y: 0 };
        entities.push(createStar({ x: 4, y: 1.3 }));
        ground = (x) => 1 + .5 * Math.exp(-1 * (x - 4.5) ** 2);
    } else if (h === 4) {
        state.message = "Try to roll with it";
        camera.pos = { x: 4, y: -2 };
        camera.size = 15;
        player.pos = { x: -2, y: 1 };
        flag.pos = { x: 7.5, y: 0 };
        entities.push(createStar({ x: .5, y: .2 }));
        entities.push(createStar({ x: 2.5, y: .6 }));
        entities.push(createStar({ x: 4.5, y: -.2 }));
        ground = (x) => .5 * Math.sin(x) + .5 * Math.sin(.5 * x);
    } else if (h === 5) {
        state.message = "Can you do it in one jump?";
        camera.pos = { x: 5.5, y: -2 };
        camera.size = 13;
        player.pos = { x: 1, y: 1 };
        flag.pos = { x: 5.5, y: 0 };
        entities.push(createStar({ x: 7, y: -1.5 }));
        entities.push(createStar({ x: 9, y: .5 }));
        entities.push(createCloud({ x: -1, y: -3 }));
        entities.push(createCloud({ x: 10, y: -4 }));
        ground = (x) => .7 * Math.sin(x) + .5 * Math.sin(.5 * x - Math.PI);
    } else if (h === 6) {
        state.message = "Precision is key";
        camera.pos = { x: 6.5, y: -3.5 };
        camera.size = 13;
        player.pos = { x: 1, y: 1 };
        flag.pos = { x: 10, y: 0 };
        entities.push(createStar({ x: 3, y: -5.5 }));
        entities.push(createCloud({ x: 1.5, y: -3.5 }));
        entities.push(createCloud({ x: 11.5, y: -3.3 }));
        ground = (x) => .7 - 3 * Math.exp(-.5 * (x - 4.5) ** 2) - 6 * Math.exp(-.5 * (x - 10) ** 2);
    } else if (h === 7) {
        state.message = "Stop, drop & roll";
        camera.pos = { x: 6, y: -2.5 };
        camera.size = 12;
        player.pos = { x: 1, y: 1 };
        flag.pos = { x: 10.5, y: 0 };
        entities.push(createStar({ x: 7, y: .4 }));
        entities.push(createStar({ x: 9, y: -1 }));
        entities.push(createCloud({ x: 3.5, y: -3.5 }));
        ground = (x) => .7 - 3 * Math.exp(-.5 * (x - 4.5) ** 2) - 4 * Math.exp(-.4 * (x - 10.5) ** 2);
    } else if (h === 5) {
        state.message = "Bounce, bounce, bounce";
        camera.pos = { x: 5, y: -2.5 };
        camera.size = 16;
        player.pos = { x: 1.05, y: 1 };
        flag.pos = { x: 13.6, y: 0 };
        entities.push(createStar({ x: 5.24, y: -.4 }));
        entities.push(createStar({ x: 9.4, y: -.5 }));
        entities.push(createCloud({ x: 11, y: -5 }));
        ground = (x) => .7 - .2 * x ** .5 * Math.sin(1.5 * x);
    } else if (h === 9) {
        state.message = "Leap of faith";
        camera.pos = { x: 7, y: -1 };
        camera.size = 15;
        player.pos = { x: 1, y: 1 };
        flag.pos = { x: 12.5, y: 0 };
        entities.push(createStar({ x: 2.5, y: -3 }));
        entities.push(createStar({ x: 5, y: -.4 }));
        entities.push(createStar({ x: 9, y: -1 }));
        entities.push(createCloud({ x: 0, y: -2.5 }));
        entities.push(createCloud({ x: 11, y: -4 }));
        ground = (x) => 5 * (1 + Math.exp(-2 * x + 7)) ** -1;
    } else if (h === 10) {
        state.message = "Who put that there?";
        camera.pos = { x: 4.5, y: -1 };
        camera.size = 15;
        player.pos = { x: -1.5, y: 1 };
        flag.pos = { x: 10, y: 0 };
        entities.push(createStar({ x: 3, y: -3 }));
        entities.push(createStar({ x: 5.5, y: 0 }));
        entities.push(createCloud({ x: 9, y: -3 }));
        ground = (x) => - 1.5 * Math.exp(-2 * x ** 2) + 3 * (1 + Math.exp(-2 * x + 10)) ** -1 + Math.exp(-5 * (x - 10) ** 2);
    } else if (h === 11) {
        state.message = "Uphill race";
        camera.pos = { x: 0, y: -5 };
        camera.size = 15;
        player.pos = { x: 0, y: 1 };
        flag.pos = { x: -5.5, y: 0 };
        entities.push(createStar({ x: 3, y: -1.2 }));
        entities.push(createStar({ x: -1, y: -7 }));
        entities.push(createCloud({ x: 1, y: -7 }));
        ground = (x) => -.12 * x ** 2 + .1 * Math.sin(2 * x);
    } else if (h === 12) {
        state.message = "Now where is that flag?";
        camera.pos = { x: 7, y: -3 };
        camera.size = 20;
        player.pos = { x: -1, y: 1 };
        flag.pos = { x: 10, y: 0 };
        entities.push(createStar({ x: 1, y: .3 }));
        entities.push(createStar({ x: 16, y: -2.4 }));
        entities.push(createCloud({ x: 1.5, y: 1.2 }));
        entities.push(createCloud({ x: 9, y: .5 }));
        entities.push(createCloud({ x: 17, y: -1.5 }));
        entities.push(createCloud({ x: 5, y: -3 }));
        ground = (x) => .2 * Math.sin(2 * x) + .7 * Math.sin(.7 * x) - .1 * x;
    } else if (h === 13) {
        state.message = "What the ...?";
        camera.pos = { x: 2, y: -1 };
        camera.size = 12;
        player.pos = { x: -1.5, y: 1 };
        flag.pos = { x: 10, y: 0 };
        entities.push({
            trap: true,
            pos: { x: 2.65, y: -1.55 },
            rot: 1.8,
            shapes: flag.shapes,
        });
        entities.push({
            pos: { x: 3, y: -1.5 },
            shapes: [
                {
                    x: [0, 0],
                    y: [0, -2],
                    w: .1,
                    color: 9,
                }
            ],
        });
        entities.push(createCloud({ x: 3, y: -3 }));
        entities.push(createCloud({ x: 7, y: -2 }));
        entities.push(createCloud({ x: 3, y: 5.5 }));
        ground = (x) => .8 * Math.sin(x) + 8 * Math.exp(-.3 * (x - 3.5) ** 2);
    }
};

const retryHole = () => startHole(state.hole);
const nextHole = () => {
    state.totalJumps += state.jumps;
    state.totalStars += state.stars;
    startHole(state.hole + 1);
};

const draw = () => {
    update();

    // HUD
    hole.innerText = `${state.hole}/13`;
    jumps.innerText = state.jumps + state.totalJumps;
    stars.innerText = state.stars + state.totalStars;
    message.innerText = state.message;

    // Menu
    const showMenu = state.won && state.wonAge > 1;
    menu.style.display = showMenu ? "block" : "none";
    overlay.style.background = showMenu ? "#0008" : "#0000";

    // Game over
    gameover.style.display = state.gameover ? "block" : "none";

    // Screen coordinates
    ctx.save();
    ctx.scale(canvas.width, canvas.width);

    // Sky
    ctx.fillStyle = colors[10];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // World coordinates
    ctx.save();
    ctx.translate(.5, .5);
    ctx.scale(camera.size ** -1, camera.size ** -1);
    ctx.translate(-camera.pos.x, -camera.pos.y);

    // Ground
    ctx.save()
    ctx.beginPath();
    const steps = canvas.width >> 2;
    for (let i = 0; i <= steps; i++) {
        const x = i / steps;
        const p = screenToWorld({ x, y: 0 });
        ctx.lineTo(p.x, ground(p.x));
    }
    ctx.fillStyle = colors[6];
    const bottomRight = screenToWorld({ x: 1, y: 1 });
    ctx.lineTo(bottomRight.x, bottomRight.y);
    const bottomLeft = screenToWorld({ x: 0, y: 1 });
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.fill();

    ctx.clip(); // Ground clip

    // Shadows
    for (const e of entities.filter(e => e.shadow)) {
        ctx.save();
        const y = ground(e.pos.x);
        const d = y - e.pos.y;
        const r = .5 + Math.exp(.3 * d);
        ctx.beginPath();
        ctx.ellipse(e.pos.x, y + .1, e.shadow * r, e.shadow * r / 3, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.globalAlpha = .2 * Math.exp(-d);
        ctx.fill();
        ctx.restore();
    }

    ctx.restore(); // Ground clip

    // Drag direction
    const drag = Vec.limit(Vec.subtract(input.dragEnd, input.dragStart), player.jump.limit);
    const showDrag = !state.won && player.grounded && Vec.length(drag) > .01;
    if (showDrag) {
        ctx.save();
        ctx.translate(player.pos.x, player.pos.y - .2);
        ctx.rotate(Vec.angle(drag));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(3 * Vec.length(drag) + .2, 0);
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = .25;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }

    // Dive streaks
    if (player.diving) {
        const n = 5;
        const rand = seededRandom(Math.round(20 * player.age));
        for (let i = 0; i < n; i++) {
            ctx.save();
            ctx.translate(.5 * (rand() - .5), .5 * (rand() - .5));
            ctx.beginPath();
            const start = Vec.add(
                Vec.add(player.pos, Vec.scale(Vec.normalize(player.vel), -.3)),
                { x: 0, y: -.3 });
            const end = Vec.subtract(start, Vec.scale(Vec.normalize(player.vel), .1 + .05 * Vec.length(player.vel)));
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = colors[0];
            ctx.lineCap = "round";
            ctx.lineWidth = .1;
            ctx.globalAlpha = (i + 1) / n;
            ctx.stroke();
            ctx.restore();
        }
    }

    // Shapes
    for (const e of entities.filter(e => e.shapes)) {
        ctx.save();
        ctx.translate(e.pos.x, e.pos.y);
        ctx.rotate(e.rot ?? 0);
        ctx.lineJoin = ctx.lineCap = "round";
        for (const shape of e.shapes) {
            ctx.beginPath();
            ctx.moveTo(shape.x[0], shape.y[0]);
            for (let i = 1; i < shape.x.length - 1; i++) {
                ctx.lineTo(shape.x[i], shape.y[i]);
            }
            ctx.lineTo(shape.x[shape.x.length - 1], shape.y[shape.y.length - 1]);
            ctx.fillStyle = ctx.strokeStyle = colors[shape.color];
            ctx.lineWidth = shape.w ?? .15;
            if (shape.fill) {
                ctx.closePath();
                ctx.fill();
            }
            ctx.stroke();
        }
        ctx.restore();
    }

    // Particles
    for (const e of entities.filter(e => e.particle)) {
        ctx.save();
        ctx.fillStyle = colors[e.particle.color];
        ctx.globalAlpha = 1 - (e.age / e.ttl) ** 4;
        ctx.beginPath();
        ctx.arc(e.pos.x, e.pos.y, e.particle.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    // Drag trajectory
    if (showDrag) {
        ctx.save();
        ctx.fillStyle = colors[0];
        let { pos } = player;
        let vel = Vec.scale(drag, player.jump.force);
        const dt = .5 / Vec.length(vel);
        let dist = .1;
        for (let i = 0; i < 10; i++) {
            pos = Vec.add(pos, Vec.scale(vel, dt));
            vel = Vec.scale(Vec.add(vel, { x: 0, y: player.gravity * dt }), player.damping ** dt);
            dist += Vec.length(vel) * dt;
            const r = 1 - Math.exp(-dist);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y - .2, .1 * r, 0, 2 * Math.PI);
            ctx.globalAlpha = Math.max(0, -.16 * dist * (dist - 5));
            ctx.fill();
        }
        ctx.restore();
    }

    // Debug overlay
    if (location.hash === "#debug") {
        ctx.save();
        ctx.lineWidth = .05;
        ctx.globalAlpha = .5;
        // Origin
        for (let entity of entities.filter(e => e.pos)) {
            ctx.fillStyle = "#f00";
            ctx.fillRect(
                entity.pos.x - ctx.lineWidth,
                entity.pos.y - ctx.lineWidth,
                2 * ctx.lineWidth,
                2 * ctx.lineWidth);
        }
        // Velocity vector
        for (let entity of entities.filter(e => e.vel)) {
            const end = Vec.add(entity.pos, Vec.scale(entity.vel, .1));
            ctx.beginPath();
            ctx.moveTo(entity.pos.x, entity.pos.y);
            ctx.lineTo(end.x, end.y);
            ctx.strokeStyle = "#0f0";
            ctx.stroke();
        }
        ctx.restore();
        // Debug object
        let pre = document.getElementById("dbg");
        if (pre == null) {
            pre = document.createElement("pre");
            pre.id = "dbg";
            pre.style.position = "absolute";
            pre.style.pointerEvents = "none";
            pre.style.color = "white";
            pre.style.textShadow = "1px 1px black";
            document.body.append(pre);
        }
        pre.innerText = JSON.stringify(dbg, (k, v) => v.toFixed == null ? v : Number(v.toFixed(3)), 2);
    }

    ctx.restore(); // World coordinates
    ctx.restore(); // Screen coordinates

    requestAnimationFrame(draw);
};

let last = performance.now();
const update = () => {
    const now = performance.now();
    let dt = (now - last) / 1000;
    last = now;

    if (state.paused) {
        return;
    }

    if (state.won) {
        state.wonAge += dt;
    }

    // Game over
    for (const e of entities.filter(e => e.trap)) {
        if (!state.gameover && Vec.distance(player.pos, e.pos) < 1) {
            state.gameover = true;
            entities = entities.filter(e => e !== player);
            entities.unshift({
                pos: { x: 3, y: 8 },
                vel: { x: 0, y: -50 },
                damping: .01,
                gravity: 20,
                shapes: [
                    {
                        x: [-1, 0, 1, 1.5, 0, 0, -.5],
                        y: [-3, -1, -4, -1, 20, 20, 0],
                        color: 8,
                        fill: true,
                    }, {
                        x: [1],
                        y: [-1],
                        w: .5,
                        color: 0,
                    }, {
                        x: [.9],
                        y: [-1.1],
                        w: .3,
                        color: 9,
                    }
                ],
            });
            entities.unshift(player);
        }
    }
    if (state.gameover) {
        dt *= .1;
        player.vel.x *= .01 ** dt;
    }

    // Check out of bounds
    const ps = worldToScreen(player.pos);
    state.outOfBounds = ps.x < 0 || ps.x > 1 || ps.y < 0 || ps.y > 1;
    if (state.outOfBounds) {
        state.outOfBoundsAge += dt;
        if (!state.won && state.outOfBoundsAge > 2) {
            retryHole();
        }
    } else {
        state.outOfBoundsAge = 0;
    }

    // Check if player has stopped on ground
    player.grounded = player.pos.y >= ground(player.pos.x)
        && Vec.length(player.vel) * dt < .01;

    // Detect dive
    player.diving = !state.won && !player.grounded && input.primary;
    player.gravity = player.diving ? 30 : 10;
    player.physics.bounce = player.diving ? .9 : 0;
    player.physics.friction = player.diving ? 1 : 0;
    player.shapes = player.diving ? playerCircle : playerTriangle;

    // Detect drag
    if (!input.primary) {
        const drag = Vec.limit(Vec.subtract(input.dragEnd, input.dragStart), player.jump.limit);
        if (!state.won && player.grounded && Vec.length(drag) > .02) {
            state.jumps++;
            player.vel = Vec.add(player.vel, Vec.scale(drag, player.jump.force));
        }
        input.dragStart = input.dragEnd = Vec.zero();
    }

    // Win condition
    if (!state.won && Vec.distance(player.pos, flag.pos) < .5) {
        const pos = Vec.add(flag.pos, { x: 0, y: -.2 });
        for (let i = 0; i < 50; i++) {
            const vel = Vec.scale(
                Vec.rotate(
                    { x: 0, y: -1 },
                    1.5 * (Math.random() - .5)),
                5 * (Math.random() + .2));
            entities.push({
                pos,
                vel,
                gravity: 2,
                damping: .3,
                physics: {
                    bounce: 0,
                    friction: 0,
                },
                age: 0,
                ttl: 2 * (Math.random() + .2),
                particle: {
                    size: .08,
                    color: 4,
                },
            });
        }
        state.won = true;
    }

    // Flag animation
    flag.rot = .1 * Math.sin(1.5 * flag.age);

    // Star animation
    for (const e of entities.filter(e => e.star)) {
        e.pos = Vec.add(e.star, { x: 0, y: .05 * Math.sin(2 * e.age) });
    }

    // Star collection
    for (const e of entities.filter(e => e.star)) {
        if (Vec.distance(player.pos, e.star) < .5) {
            const pos = Vec.add(e.star, { x: 0, y: -.2 });
            const n = 10;
            for (let i = 0; i < n; i++) {
                const vel = Vec.scale(
                    Vec.rotate({ x: 1, y: 0 }, 2 * Math.PI * i / n),
                    1.5);
                entities.push({
                    pos,
                    vel,
                    gravity: 1,
                    damping: .3,
                    physics: {
                        bounce: 0,
                        friction: 0,
                    },
                    age: 0,
                    ttl: .5 * (Math.random() + .5),
                    particle: {
                        size: .07,
                        color: 1,
                    },
                });
            }
            e.ttl = 0;
            state.stars++;
        }
    }

    // Age
    for (const e of entities.filter(e => e.age != null)) {
        e.age += dt;
        if (e.ttl != null && e.age > e.ttl) {
            e.kill = true;
        }
    }
    // Stick
    for (const e of entities.filter(e => e.stick)) {
        e.pos.y = ground(e.pos.x);
    }
    // Velocity
    for (const e of entities.filter(e => e.vel)) {
        e.pos = Vec.add(e.pos, Vec.scale(e.vel, dt));
    }
    // Ground collision
    for (const e of entities.filter(e => e.physics)) {
        const x = .01;
        const y = ground(e.pos.x + x) - ground(e.pos.x);
        const g = Vec.normalize({ x, y });
        const normal = { x: -g.y, y: g.x };
        if (e.pos.y > ground(e.pos.x)) {
            e.pos.y = ground(e.pos.x);
            const ref = Vec.add(e.vel, Vec.scale(normal, -2 * Vec.dot(e.vel, normal)));
            const a = Vec.angle(g);
            const rot = Vec.rotate(ref, -a);
            e.vel = Vec.rotate({ x: e.physics.friction ** dt * rot.x, y: e.physics.bounce * rot.y }, a);
        }
    }
    // Damping
    for (const e of entities.filter(e => e.damping)) {
        e.vel = Vec.scale(e.vel, e.damping ** dt);
    }
    // Gravity
    for (const e of entities.filter(e => e.gravity)) {
        e.vel = Vec.add(e.vel, { x: 0, y: e.gravity * dt });
    }

    entities = entities.filter(e => !e.kill);

    // Debugging
    dbg.dt = dt;
    dbg.input = input;
    dbg.state = state;
};

const getScreenCoords = (e) => ({
    x: e.pageX / canvas.width,
    y: e.pageY / canvas.height
});
document.addEventListener("pointerdown", (e) => {
    input.primary = true;
    input.dragStart = input.dragEnd = getScreenCoords(e);
});
document.addEventListener("pointermove", (e) => {
    if (input.primary) {
        input.dragEnd = getScreenCoords(e);
    }
});
document.addEventListener("pointerup", () => {
    input.primary = false;
});
document.addEventListener("pointercancel", () => {
    input.primary = false;
    input.dragEnd = input.dragStart;
});
document.addEventListener("blur", () => state.paused = true);
document.addEventListener("focus", () => state.paused = false);

// Canvas resizing
const resize = () => {
    const unit = 32;
    const size = Math.min(Math.floor(Math.min(window.innerWidth, window.innerHeight) / unit), 24);
    canvas.width = canvas.height = size * unit;
    overlay.style.width = overlay.style.height = `${canvas.width}px`;
    overlay.style.left =
        canvas.style.left = `${(window.innerWidth - canvas.width) / 2}px`;
    overlay.style.top =
        canvas.style.top = `${(window.innerHeight - canvas.height) / 2}px`;
    overlay.style.fontSize = `${.04 * canvas.width}px`;
};
window.addEventListener("resize", resize);

resize();
startHole(state.hole);
draw();
