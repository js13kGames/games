var ludo;
var context;
var zamo;
var okuloj;
var last_render;
var lasers = [];
var numbers = [];
var num_chosen_time = 0;
var chosen_num = -1;
var display_num;

var laser_speed = 6000.0;
var num_retain_time = 3000; // in milliseconds
var count_on_screen = 25;
var eyes_until = 0;


function rand(min, max)
{
    return Math.round(Math.random() * (max - min) + min);
}

function sqr(num)
{
    return Math.pow(num, 2);
}

function num2text(num)
{
    var cols = [], numbers = [], col;
    var digits = [
        'nulo', 'unu', 'du', 'tri', 'kvar', 'kvin', 'ses', 'sep', 'ok', 'naŭ'
    ];

    num = String(num);

    for (var i = num.length - 1; i >= 0; --i) {
        cols.push(Number(num.charAt(i)));
    }

    while(cols.length > 0) {
        num = cols.pop();
        if (num == 0) continue;

        num = digits[num];

        // Just 'cent', 'dek'; not 'unucent', 'unudek'
        if (num == 'unu' && cols.length > 0) num = '';

        if (cols.length == 2) {
            num += 'cent';
        } else if (cols.length == 1) {
            num += 'dek';
        }
        numbers.push(num);
    }

    return numbers.join(' ');
}

function update(time_elapsed)
{
    var num, laser;

    // Elektu nombron
    if ((num_chosen_time < Date.now() - num_retain_time || chosen_num == -1) && numbers.length > 0) {
        num_chosen_time = Date.now();
        var old_num = chosen_num;
        while (old_num == chosen_num) {
            chosen_num = rand(0, numbers.length - 1);
            if (numbers.length == 1) break;
        }
        display_num = num2text(numbers[chosen_num].val);
    }

    context.clearRect(0, 0, ludo.width, ludo.height);

    // Desegni Zamon
    if (zamo.img.complete) {
        context.drawImage(
            zamo.img, 0, 0, zamo.img.width, zamo.img.height,
            zamo.x, zamo.y, zamo.img.width, zamo.img.height
        );
    }

    // Aperigi nombrojn
    context.fillStyle = '#E0E0E0';
    context.font = '18px Arial';

    for (var i = 0; i < numbers.length; ++i) {
        num = numbers[i];
        context.fillText(num.val, num.x, num.y);
    }

    if (eyes_until >= Date.now()) {
        for (var i = 0; i < 2; ++i) {
            context.fillStyle = '#FF0000';
            context.beginPath();
            context.arc(okuloj[i].x, okuloj[i].y, 3, 0, 2 * Math.PI);
            context.fill();
        }
    }

    // Aperigi laserojn
    context.strokeStyle = '#FF0000';
    var del_lasers = [];
    for (var i = 0; i < lasers.length; ++i) {
        laser = lasers[i];
        laser.old_x = laser.x;
        laser.old_y = laser.y;
        laser.x = laser.x - (laser.x_vel * time_elapsed);
        laser.y = laser.y - (laser.y_vel * time_elapsed);

        if (laser.x < 0 || laser.x > ludo.width || laser.y < 0 || laser.y > ludo.height) {
            del_lasers.push(i);
            continue;
        }

        context.beginPath();
        context.moveTo(laser.x, laser.y);
        context.lineTo(laser.x - (laser.x_vel / 80), laser.y - (laser.y_vel / 80));
        context.stroke();

        // Detect collision between laser and chosen number
        if (chosen_num >= 0) {
            var num = numbers[chosen_num];
            var box = {
                left: num.x,
                right: num.x + context.measureText(num.val).width,
                top: num.y - 18,
                bottom: num.y
            };

            var x_match = (laser.x >= box.left && laser.x <= box.right) || (laser.old_x >= box.left && laser.old_x <= box.right) || (laser.x < box.left && laser.old_x >= box.right)
            var y_match = (laser.y >= box.top && laser.y <= box.bottom) || (laser.old_y >= box.top && laser.old_y <= box.bottom) || (laser.y >= box.bottom && laser.old_y <= box.top);
            if (x_match && y_match) {
                numbers.splice(chosen_num, 1);
                chosen_num = -1;
            }
        }
    }

    while (del_lasers.length > 0) {
        laser = del_lasers.pop();
        lasers.splice(laser, 1);
    }

    if (chosen_num > -1) {
        context.fillStyle = '#FF8000';
        context.font = '64px Arial';
        context.fillText(display_num, (ludo.width - context.measureText(display_num).width) / 2, 64);
    } else if (numbers.length == 0) {
        var txt = 'Jen, vi venkis la ludon!';
        context.fillStyle = '#FFFF00';
        context.font = '128px Arial';
        context.fillText(txt, (ludo.width - context.measureText(txt).width) / 2, 256);
    }
}

function main()
{
    var time_elapsed = (Date.now() - last_render) / 1000.0;

    update(time_elapsed);
    requestAnimationFrame(main);
    last_render = Date.now();
}

window.onload = function() {
    ludo = document.getElementById('ludo');
    ludo.width = document.body.clientWidth;
    ludo.height = document.body.clientHeight;

    context = ludo.getContext('2d');

    zamo = {
        img: new Image()
    };
    zamo.img.src = 'zam.png';
    zamo.x = ludo.width - zamo.img.width - 10,
    zamo.y = 10;

    okuloj = [
        {x: zamo.x + 14, y: zamo.y + 54},
        {x: zamo.x + 50, y: zamo.y + 52}
    ];

    // Pafu laserojn post musa klako
    ludo.onclick = function(e) {
        var xa_distanco, ya_distanco, dist;
        for (var i = 0; i < okuloj.length; ++i) {
            xa_distanco = (okuloj[i].x - e.clientX);
            ya_distanco = (okuloj[i].y - e.clientY);
            dist = Math.sqrt(sqr(xa_distanco) + sqr(ya_distanco));

            lasers.push({
                x: okuloj[i].x,
                y: okuloj[i].y,
                x_vel: (xa_distanco / dist) * laser_speed,
                y_vel: (ya_distanco / dist) * laser_speed,
            });
        }
        eyes_until = Date.now() + 300;

        return false;
    };

    // Initialise numbers
    var metric, val, num;
    for (var i = 0; i < count_on_screen; ++i) {
        val = rand(1, 999);
        metric = context.measureText(String(val));
        num = {
            val: val,
            x: rand(100, ludo.width - 100 - metric.width),
            y: rand(125, ludo.height - 100 - 18)
        };
        numbers[i] = num;
    }

    last_render = Date.now();
    main();
};
