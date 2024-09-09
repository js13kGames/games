console.log('begin')

window.addEventListener("load", function() {
    gameResize();
    document.querySelector('.start-box').style.display = 'block';
    document.querySelector('.start-box').onclick = function() {
        playSound(lickSound, .270);
        loadGame();
        document.querySelector('.start-box').style.display = 'none';
    }
    document.querySelector('.start-box').ontouchmove = function() {
        playSound(lickSound, .270);
        loadGame();
        document.querySelector('.start-box').style.display = 'none';
    }
}, false);

window.addEventListener("resize", function() {
    gameResize();
}, false);

window.addEventListener("keyup", mapKeyUp, false);

window.addEventListener("keydown", mapKeyDown, false);

window.addEventListener("keydown", function(e) {
    if([' ', 'ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].indexOf(e.key) > -1) {
        e.preventDefault();
    }
    
}, false);

var gameloop;
var dom = document.querySelector('.game').innerHTML;
var time = 0;
var timePrev = 0;
var toggleOnscreenControls = true;
var A;
var A2;
var skullEmoji = '💀';

var shelves = []
var angle = 0;
var x_velocity = 0;
var y_velocity = 0;
var x_translation = 5;
var y_translation = -25;
var map = {};
var freeze_controls = false;
var speedCoefficient = 3;
var crateMounted = 100;
var previousCrateMounted = 100;
var reverse = false;
var actor_in_shelf = false;
var hit_points = 100;
var damage_per_hit = .15;
var damage_while_running = .025;
var showColors = false;
    
var posX = [];
var valX = 0;
var combinations = [];
var aw = 0;

var crates = [];
var crateColors = [];

var cratesShelvedCount = 0;

var gameOver = false;

function instantiateGame(level_number, crates_count, remaining_hit_points, prev_x_velocity, prev_y_velocity, prev_x_translation, prev_y_translation, prev_angle) {
    shelves = []
    angle = prev_angle;
    x_velocity = prev_x_velocity;
    y_velocity = prev_y_velocity;
    x_translation = prev_x_translation;
    y_translation = prev_y_translation;
    map = {};
    freeze_controls = false;
    speedCoefficient = 3;
    crateMounted = 100;
    previousCrateMounted = 100;
    reverse = false;
    actor_in_shelf = false;
    hit_points = remaining_hit_points;
    damage_per_hit = .15;
    damage_while_running = .025;
    showColors = false;
        
    posX = [];
    valX = 0;
    combinations = [];
    aw = 0;

    crates = [];
    crateColors = [];

    level = level_number;
    cratesShelvedCount = 0;

    gameOver = false;

    document.querySelector('.game').innerHTML = dom;
    document.querySelector('.level-indicator').innerHTML = 'Level ' + level;

    if (toggleOnscreenControls == true) {
        document.querySelector(".mobile-controls-all").style.display = 'block';
        document.querySelector(".toggle-onscreen-controls").style.color = '#c3c3c3';
    } else {
        document.querySelector(".mobile-controls-all").style.display = 'none';
        document.querySelector(".toggle-onscreen-controls").style.color = '#5d5d5d';
    }
    
    if (level == 1) {
    }
    
    if (level == 2) {
        playSound(startLevel2Sound, 0.270);
    }
    
    if (level == 3) {
        playSound(startLevel3Sound, 0.270);
    }
    
    if (level == 4) {
        playSound(startLevel4Sound, 0.270);
    }
    
    if (level == 5) {
        playSound(startLevel5Sound, 0.270);
    }

    mobile_controls()
    createCrates(crates_count);
    game();
}

function tableCreate() {
    var game = document.querySelector('.game');
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.style.height = '100%';
    tbl.style.backgroundColor = '#1F2028';
    tbl.style.opacity = "1";
    tbl.style.borderSpacing = "25px 90px";

    var tbdy = document.createElement('tbody');

    shelvesCtr = 0;
    
    for (var i = 0; i < 5; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 10; j++) {
            shelves[shelvesCtr] = new shelf(tr,i,j,shelvesCtr);
            shelvesCtr++
        }
        tbdy.appendChild(tr);
    }

    shelves_odd = [];

    shelves.forEach(function(shelf){
        if(shelf['ctr'] % 2 != 0) {
            shelves_odd.push(shelf)
        }
    })

    shelves = shuffle(shelves_odd).slice(0, crates.length)
    tbl.appendChild(tbdy);
    game.appendChild(tbl);

    var shelf_ctr = 0;

    for (var r = 0; r < 5; r++) {
        
        for (var c = 0; c < 10; c++) {
            shelf_id = 'r' + r + 'c' + c;
            shelves.forEach(function(shelf){
                if (shelf['shelfID'] == shelf_id) {
                    if (shelf_ctr == 0 || shelf_ctr == 4 || shelf_ctr == 8 || shelf_ctr == 12 || shelf_ctr == 16 || shelf_ctr == 20 || shelf_ctr == 24){
                        document.querySelector("#" + shelf_id + "").style.backgroundColor = 'rgba(255,0,0,1)'
                        shelf['color'] = 'rgba(255,0,0,1)'
                    }
                
                    if (shelf_ctr == 1 || shelf_ctr == 5 || shelf_ctr == 9 || shelf_ctr == 13 || shelf_ctr == 17 || shelf_ctr == 21){
                        document.querySelector("#" + shelf_id + "").style.backgroundColor = 'rgba(0,128,0,1)'
                        shelf['color'] = 'rgba(0,128,0,1)'
                    }
                
                    if (shelf_ctr == 2 || shelf_ctr == 6 || shelf_ctr == 10 || shelf_ctr == 14 || shelf_ctr == 18 || shelf_ctr == 22){
                        document.querySelector("#" + shelf_id + "").style.backgroundColor = 'rgba(0,0,255,1)'
                        shelf['color'] = 'rgba(0,0,255,1)'
                    }
                
                    if (shelf_ctr == 3 || shelf_ctr == 7 || shelf_ctr == 11 || shelf_ctr == 15 || shelf_ctr == 19 || shelf_ctr == 23){
                        document.querySelector("#" + shelf_id + "").style.backgroundColor = 'rgba(255,255,0,1)'
                        shelf['color'] = 'rgba(255,255,0,1)'
                    }
                    shelf_ctr++
                }
            })
        }
    }

}

function shelf(tr,i,j,ctr) {
    var td = document.createElement('td');
    this.shelfID = 'r' + i + 'c' + j;
    this.color = '';
    this.locked = false;
    this.ctr = ctr;
    td.setAttribute('id', this.shelfID);
    td.appendChild(document.createTextNode(''));
    td.style.opacity = ".6";
    td.style.borderRadius = '20px';
    tr.appendChild(td);
}

function game() {
    tableCreate();

    gameloop = window.setInterval(function(){
        go();
        actorToShelfCollision();
        actorToBoundaryCollision()
        relocate_crate();
    },10);

}

function gameStartShowHideColors(duration) {
    showColors = true;
    window.setTimeout(function() {
        showColors = false;
    }, duration)
}

function gameResize() {
    if (window.innerWidth > window.innerHeight) {
        document.querySelector('.game').style.scale = window.innerHeight/1000;
    } else {
        document.querySelector('.game').style.scale = window.innerWidth/1000;
    }
}

function gameOverInstantiate() {
    instructions_timeouts.forEach(function(timeout) {
        clearTimeout(timeout);
    })
    clearInterval(gameloop);
    clearTimeout(next_level_instance);
    gameOver = true;
    window.setTimeout(function() {
        instantiateGame(1, 3, 100, 0, 0, 5, -25, 0);
        playSound(startLevel1Sound, 0.270);
    }, 5000)
}

function go(){

    time += .01;

    document.querySelector(".hit-bar").style.backgroundColor = 'rgb(' + (100-hit_points/1.5) + ', ' + hit_points + ', 00)';
    document.querySelector(".hit-bar").style.width = hit_points + '%';
    keycodes = [' ', 'arrowleft','arrowup','arrowright','arrowdown','a','d','s','w']


    for (var i = 0; i <= 8; i ++){
    
        if (keycodes[i] == 'arrowright' || keycodes[i] == 'd') {
            if (map[keycodes[i]] == true){
                angle = (angle - speedCoefficient*1) % 360;
            }
        }
        if (keycodes[i] == 'arrowleft' || keycodes[i] == 'a') {
            if (map[keycodes[i]] == true){
                angle = (angle + speedCoefficient*1) % 360;
            }
        }

        if (keycodes[i] == 'arrowup' || keycodes[i] == 'w' || keycodes[i] == ' ') {
            if (map[keycodes[i]] == true){
                reverse = false;
                x_translation -= x_velocity;
                y_translation -= y_velocity;
                if (hit_points > 0) {
                    hit_points -= damage_while_running;
                }
                if (hit_points <= 0) {
                    if (gameOver == false) {
                        showMessage('Whoops..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                        gameOverInstantiate();
                        playSound(deathSound, 0.270);
                    };
                }
            } else {
            }
        }

        if (keycodes[i] == 'arrowdown' || keycodes[i] == 's') {            
            if (map[keycodes[i]] == true){
                if (crateMounted != 100) {
                    crates[crateMounted].mount = false;
                    crates[crateMounted].left_new = x_translation+17;
                    crates[crateMounted].top_new = y_translation+790;
                    previousCrateMounted = crateMounted;
                    crateMounted = 100;
                    document.querySelector('.forklift').style.top = '-12.5px';
                    playSound(dropCrateSound, 0.26);
                }
                reverse = true;
                x_translation += x_velocity;
                y_translation += y_velocity;
            } else {
            }
        }
    }


    x_velocity = speedCoefficient*(Math.cos( (90-angle)/(180/Math.PI) ));
    y_velocity = speedCoefficient*(Math.cos(angle/(180/Math.PI)));
    document.querySelector(".actor .rotator").style.transform = "rotate3d(0,0,1," + angle*-1 + "deg)";
    document.querySelector(".actor").style.transform = "translate3d(" + x_translation + "px, " + y_translation + "px, 0px)";

}
    
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    
    return array;
}


function actorToShelfCollision() {
        
    var actor = document.querySelector(".actor");
    var ac_top = document.querySelector(".actor").getBoundingClientRect().top;
    var ac_bottom = document.querySelector(".actor").getBoundingClientRect().bottom;

    var ac_left = document.querySelector(".actor").getBoundingClientRect().left;
    var ac_right = document.querySelector(".actor").getBoundingClientRect().right;

    for (var ctr = 0; ctr < shelves.length; ctr++) {

        var shelf = document.querySelector("#" + shelves[ctr]['shelfID'] + "");
        var shelf_top = shelf.getBoundingClientRect().top;
        var shelf_bottom = shelf.getBoundingClientRect().bottom;

        var shelf_left = shelf.getBoundingClientRect().left;
        var shelf_right = shelf.getBoundingClientRect().right;

        if (showColors == false) {
            shelf.style.backgroundColor = '#04050D';
        } else {
            shelf.style.backgroundColor = shelves[ctr]['color'];
        }
        
        function actorToShelf(condition) {
            if ( ( (ac_left < shelf_right ) && (ac_right > shelf_right))
                &&
                ( ( (ac_top > shelf_top) && ( (ac_bottom) < (shelf_bottom) ) ) || ((ac_top > shelf_top) && ( (ac_top) < (shelf_bottom))) || ((ac_bottom < shelf_bottom) && ( (ac_bottom) > (shelf_top))) )
            ) {
                if (condition == 'matched'){
                    x_translation -= 3;
                }
                
                if (condition == 'not matched'){
                    x_translation += 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Dang..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'locked'){
                    x_translation += 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Oh no..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'no crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                    x_translation += 1;
                    actor_in_shelf = false;
                }
                
                if (condition == 'has crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                }
            }
            
            if ( ( (ac_right > shelf_left ) && (ac_left < shelf_left))
                &&
                ( ( (ac_top > shelf_top) && ( (ac_bottom) < (shelf_bottom) ) ) || ((ac_top > shelf_top) && ( (ac_top) < (shelf_bottom))) || ((ac_bottom < shelf_bottom) && ( (ac_bottom) > (shelf_top))) )
            ) {
                if (condition == 'matched'){
                    x_translation += 3;
                }
                
                if (condition == 'not matched'){
                    x_translation -= 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Welp..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'locked'){
                    x_translation -= 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Oh dear..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'no crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                    x_translation -= 1;
                    actor_in_shelf = false;
                }
                
                if (condition == 'has crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                }
            }
            
            if ( ( (ac_bottom > shelf_top ) && (ac_top < shelf_top))
                &&
                ( ( (ac_left > shelf_left) && ( (ac_right) < (shelf_right) ) ) )
            ) {
                if (condition == 'matched'){
                    y_translation += 3;
                }
                
                if (condition == 'not matched'){
                    y_translation -= 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Whoops..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'locked'){
                    y_translation -= 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Dang..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'no crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                    y_translation -= 1;
                    actor_in_shelf = false;
                }
                
                if (condition == 'has crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                }
            }
    
            if ( ( (ac_top < shelf_bottom ) && (ac_bottom > shelf_bottom))
                &&
                ( ( (ac_left > shelf_left) && ( (ac_right) < (shelf_right) ) ) )
            ) {
                if (condition == 'matched'){
                    y_translation -= 3;
                }
                
                if (condition == 'not matched'){
                    y_translation += 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Oh no..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };
                    }
                }
                
                if (condition == 'locked'){
                    y_translation += 5;
                    if (hit_points > 0) {
                        hit_points -= damage_per_hit;
                        playSound2(hitSound, 0.230);
                    }
                    if (hit_points <= 0) {
                        if (gameOver == false) {
                            showMessage('Welp..you kinda died. ' + skullEmoji + '</br></br>Simulator will reset in a bit', 5000);
                            gameOverInstantiate();
                            playSound(deathSound, 0.270);
                        };  
                    }
                }
                
                if (condition == 'no crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                    y_translation += 1;
                    actor_in_shelf = false;
                }
                
                if (condition == 'has crate'){
                    shelf.style.backgroundColor = shelves[ctr]['color'];
                }
            }
            
        }

        if ((crateMounted != 100) && (crates[crateMounted]['color'] == shelves[ctr]['color']) && (shelves[ctr]['locked'] == false)){
            actorToShelf('matched')

            if ( ( (ac_left < shelf_right ) && (ac_right < shelf_right))
                &&
                ( (ac_right > shelf_left ) && (ac_left > shelf_left) )
                &&
                (  (ac_top > shelf_top) && (ac_bottom) < (shelf_bottom) )
                &&
                ( (ac_bottom > shelf_top ) && (ac_top > shelf_top))
            ) {
                if (ac_left - shelf_left < shelf_right - ac_right) {
                    x_translation += 1;
                } else if (ac_left - shelf_left > shelf_right - ac_right) {
                    x_translation -= 1;
                } else if (ac_top - shelf_top < shelf_bottom - ac_bottom){
                    y_translation += 1;
                } else if (ac_top - shelf_top > shelf_bottom - ac_bottom){
                    y_translation -= 1;
                } else {
                }

                crates[crateMounted].mount = false;
                previousCrateMounted = crateMounted;
                crateMounted = 100;
                document.querySelector('.forklift').style.top = '-12.5px';
                playSound(shelfCrateSound, 0.265)

                if (hit_points < 85) {
                    hit_points += 15;
                } else {
                    hit_points = 100;
                }

                cratesShelvedCount ++;

                if (level == 1) {
                    if (cratesShelvedCount == 3) {
                        showMessage("Level 1 cleared in</br>" + parseInt(time).toString() + " seconds!</br></br>Get ready for the next level.</br></br>Hint: press <span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>W</span> and the up <span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>↑</span> key at the same time for a boost",6000);
                        instructions_timeouts.forEach(function(timeout) {
                            clearTimeout(timeout);
                        })
                        timePrev += time;
                        clearTimeout(next_level_instance);
                        playSound(endLevel1Sound, 0.270)
                        next_level_instance = window.setTimeout(function(){
                            clearInterval(gameloop);
                            instantiateGame(2, 7, hit_points, x_velocity, y_velocity, x_translation, y_translation, angle);
                            gameStartShowHideColors(2000);
                            time = 0;
                        }, 6000)
                    }
                }

                if (level == 2) {
                    if (cratesShelvedCount == 7) {
                        showMessage('Level 2 cleared in</br>' + parseInt(time).toString() + ' seconds!</br></br>Get ready for the next level.',5000);
                        timePrev += time;
                        clearTimeout(next_level_instance);
                        playSound(endLevel2Sound, 0.270)
                        next_level_instance = window.setTimeout(function(){
                            clearInterval(gameloop);
                            instantiateGame(3, 12, hit_points, x_velocity, y_velocity, x_translation, y_translation, angle);
                            gameStartShowHideColors(3000);
                            time = 0;
                        }, 5000)
                    }
                }

                if (level == 3) {
                    if (cratesShelvedCount == 12) {
                        showMessage('Level 3 cleared in</br>' + parseInt(time).toString() + ' seconds!</br></br>Get ready for the next level.',5000);
                        timePrev += time;
                        clearTimeout(next_level_instance);
                        playSound(endLevel3Sound, 0.270)
                        next_level_instance = window.setTimeout(function(){
                            clearInterval(gameloop);
                            instantiateGame(4, 18, hit_points, x_velocity, y_velocity, x_translation, y_translation, angle);
                            gameStartShowHideColors(4000);
                            time = 0;
                        }, 5000)
                    }
                }

                if (level == 4) {
                    if (cratesShelvedCount == 18) {
                        timePrev += time;
                        clearTimeout(next_level_instance);
                        playSound(endLevel4Sound, 0.270)
                        showMessage('Level 4 cleared in</br>' + parseInt(time).toString() + ' seconds!</br></br>Get ready for the final level.',5000);
                        next_level_instance = window.setTimeout(function(){
                            clearInterval(gameloop);
                            instantiateGame(5, 25, hit_points, x_velocity, y_velocity, x_translation, y_translation, angle);
                            gameStartShowHideColors(5000);
                            time = 0;
                        }, 5000)
                    }
                }

                if (level == 5) {
                    if (cratesShelvedCount == 25) {
                        timePrev += time;
                        clearTimeout(next_level_instance);
                        showMessage('🏅🥇</br></br><b>You are now forklift certified</b></br></br> Level cleared in ' + parseInt(time).toString() + ' seconds</br>all levels cleared in ' + parseInt(timePrev/60).toString() + ' minutes!</br></br>Simulator will reset in a bit', 15000);                                
                        hit_points = 100;
                        time = 0;
                        playSound(gameCompleteSound, 0.270);
                        next_level_instance = window.setTimeout(function() {
                            clearInterval(gameloop);
                            instantiateGame(1, 3, hit_points, x_velocity, y_velocity, x_translation, y_translation, angle);
                        }, 15000)
                                                
                        for (var ctr1 = 0; ctr1 < crates.length; ctr1++) {
                            document.querySelector("#el" + ctr1 + "").style.animation = 'glow 1s infinite';
                        }
                    }
                }

                var el = document.querySelector("#el" + previousCrateMounted + "");
                var x_adjusted = shelf.offsetLeft - parseInt(el.style.left.replace('px','')) + 12.75;
                var y_adjusted = shelf.offsetTop - parseInt(el.style.top.replace('px','')) + 12.75;
                el.style.transform = "translate3d(" + x_adjusted + "px, " + y_adjusted + "px, 0px) rotate3d(0,0,1," + 0 + "deg)";
                el.style.opacity = '1'
                el.style.animation = ''

                shelves[ctr].locked = true;
                crates[previousCrateMounted]['shelved'] = true;

                shelf.style.backgroundColor = shelves[ctr]['color'];

                actor_in_shelf = true;
            }
        }
        
        if((crateMounted != 100) && (crates[crateMounted]['color'] != shelves[ctr]['color'])) {
            actorToShelf('not matched')
        }

        if (crateMounted == 100){
            actorToShelf('no crate')
        } else {
            actorToShelf('has crate')
            
        }

        if (shelves[ctr]['locked'] == true && crateMounted != 100) {
            actorToShelf('locked')
        }
    }
}

function actorToBoundaryCollision(){

    var actor = document.querySelector(".actor");
    var ac_top = document.querySelector(".actor").getBoundingClientRect().top;
    var ac_bottom = document.querySelector(".actor").getBoundingClientRect().bottom;

    var ac_left = document.querySelector(".actor").getBoundingClientRect().left;
    var ac_right = document.querySelector(".actor").getBoundingClientRect().right;

    var g_offsetWidth = document.querySelector(".game").offsetWidth;
    var g_offsetHeight = document.querySelector(".game").offsetHeight;
    var g_left = document.querySelector(".game").getBoundingClientRect().left;
    var g_right = document.querySelector(".game").getBoundingClientRect().right;
    var g_top = document.querySelector(".game").getBoundingClientRect().top;
    var g_bottom = document.querySelector(".game").getBoundingClientRect().bottom;

    if (g_left >= ac_left){
        x_translation += g_offsetWidth-50;
    }

    if ( ( Math.abs( (ac_left) - (g_left)) <= 10 ) && ( Math.abs( (ac_bottom) - (g_bottom)) <= 10 ) ) {
        x_translation += g_offsetWidth-50;
        y_translation += -(g_offsetHeight-50);
    }

    if (g_right <= ac_right){
        x_translation += -(g_offsetWidth-50);
    }


    if ( ( Math.abs( (ac_right) - (g_right)) <= 10 ) && ( Math.abs( (ac_bottom) - (g_bottom)) <= 10 ) ) {
        x_translation -= g_offsetWidth-50;
        y_translation -= g_offsetHeight-50;
    }

    if (g_top >= ac_top){
        y_translation += g_offsetHeight-50;
    }

    if ( ( Math.abs( (ac_right) - (g_right)) <= 10 ) && ( Math.abs( (ac_top) - (g_top)) <= 10 ) ) {
        x_translation += g_offsetWidth-50;
        y_translation += g_offsetHeight-50;
    }

    if ( ( Math.abs( (ac_left) - (g_left)) <= 10 ) && ( Math.abs( (ac_top) - (g_top)) <= 10 ) ) {
        x_translation += g_offsetWidth-50;
        y_translation += g_offsetHeight-50;
    }

    if (g_bottom <= ac_bottom){
        y_translation += -(g_offsetHeight-45);
    }  
}

function mapKeyDown(event) {
    map[event.key.toLowerCase()] = true;
}

function mapKeyUp(event) {
    map[event.key.toLowerCase()] = false;
}
    


function crate(ctr) {

    this.neutral = false;
    this.ctr = ctr;
    this.top = combinations[ctr][0];	
    this.left = combinations[ctr][1];
    this.width = 25;
    this.height = 25;
    this.x_translate = 0;
    this.y_translate = 0;
    this.content = "";
    this.id = 'el' + ctr;
    this.class = 'crate';
    this.rotateBy = 0;
    this.mount = false;
    this.shelved = false;
    this.top_new = 0;
    this.left_new = 0;
    
    if (ctr == 0 || ctr == 4 || ctr == 8 || ctr == 12 || ctr == 16 || ctr == 20 || ctr == 24){
        this.backgroundColor = 'rgba(255,0,0,0.25)'
        this.color = 'rgba(255,0,0,1)'
    }

    if (ctr == 1 || ctr == 5 || ctr == 9 || ctr == 13 || ctr == 17 || ctr == 21){
        this.backgroundColor = 'rgba(0,128,0,0.25)'
        this.color = 'rgba(0,128,0,1)'
    }

    if (ctr == 2 || ctr == 6 || ctr == 10 || ctr == 14 || ctr == 18 || ctr == 22){
        this.backgroundColor = 'rgba(0,0,255,0.25)'
        this.color = 'rgba(0,0,255,1)'
    }

    if (ctr == 3 || ctr == 7 || ctr == 11 || ctr == 15 || ctr == 19 || ctr == 23){
        this.backgroundColor = 'rgba(255,255,0,0.25)'
        this.color = 'rgba(255,255,0,1)'
    }

    crateColors.push(this.color);

    var new_el = document.createElement("span"); 
    new_el.setAttribute('class', this.class); 
    new_el.setAttribute('id', this.id);
    new_el.setAttribute('style', "width: " + this.width + "px; height: " + this.height + "px; position: absolute; top: " + this.top + "px; left: " + this.left + "px; z-index: 99");

    this.top_new = this.top;
    this.left_new = this.left;

    var text = document.createTextNode(this.content); 
    
    new_el.appendChild(text);
    
    document.querySelector(".game").insertBefore(new_el, document.querySelector(".actor")); 
    
}

function createCrates(crates_count) {

    for (ctr = 0; valX <= 7500;  ctr++) {
        posX[ctr] = valX;
        valX += 75;
    }
    
    for (ctra = 1; ctra <= 9; ctra++) {
        for (ctrb = 2; ctrb <= 9; ctrb++) {
            combinations[aw] = [posX[ctra], posX[ctrb]];
            aw ++;
        }	
    }
    
    shuffle(combinations);
    
    for (var ctr = 0; ctr <= crates_count - 1; ctr++) {
        crates[ctr] = new crate(ctr);
    }
}

function relocate_crate() {
    for (var ctr = 0; ctr < crates.length; ctr++) {
    
        var actor = document.querySelector(".actor");
        var ac_offsetWidth = actor.offsetWidth;
        var ac_offsetHeight = actor.offsetHeight;
        var ac_offsetLeft = actor.offsetLeft;
        var ac_offsetTop = actor.offsetTop;
        var ac_top = document.querySelector(".actor").getBoundingClientRect().top;
        var ac_bottom = document.querySelector(".actor").getBoundingClientRect().bottom;
        var ac_left = document.querySelector(".actor").getBoundingClientRect().left;
        var ac_right = document.querySelector(".actor").getBoundingClientRect().right;
        
        var el = document.querySelector("#el" + ctr + "");
        var el_offsetWidth = el.offsetWidth;
        var el_offsetHeight = el.offsetHeight;
        var el_offsetLeft = el.style.left;
        var el_offsetTop = el.style.top;
        var el_top = el.getBoundingClientRect().top;
        var el_left = el.getBoundingClientRect().left;
        var el_right = el.getBoundingClientRect().right;
        var el_bottom = el.getBoundingClientRect().bottom;

        crates[ctr].x_translate = x_translation-crates[ctr].left_new+17
        crates[ctr].y_translate = y_translation-crates[ctr].top_new+790

        relocate_x = x_translation-parseInt(el.style.left.replace('px',''))+17
        relocate_y = y_translation-parseInt(el.style.top.replace('px',''))+790

        if (((Math.abs(crates[ctr].x_translate) <= 20 ) && (Math.abs(crates[ctr].y_translate) <= 20 )) && (crates[ctr].neutral == false) && crateMounted == 100 && crates[ctr].mount == false && reverse == false && crates[ctr].shelved == false && actor_in_shelf == false) {
            crateMounted = ctr;
            crates[ctr].mount = true;
            playSound(loadCrateSound, 0.26);
        } else {
            if (crates[ctr].shelved == false) {
                    el.style.color = 'rgba(195, 195, 195, 1)';
                    el.style.backgroundColor = '';
                el.style.animation = 'glow infinite 3s';
            }
        }

        if (crates[ctr].mount == true) {
            document.querySelector('.forklift').style.top = '6.5px';
            el.style.transform = "translate3d(" + relocate_x + "px, " + relocate_y + "px, 0px) rotate3d(0,0,1," + angle*-1 + "deg)";
            el.style.color = crates[ctr].color;
            el.style.backgroundColor = crates[ctr].backgroundColor;
            crates[ctr].shelved = false;
            el.style.animation = 'glow infinite 1s';
        }
    }
}

var instructions_timeouts = []

function showMessage(message, duration) {
    document.querySelector(".message").style.display = "block";
    document.querySelector(".message").innerHTML = message;
}

function hideMessage(delay) {
    window.setTimeout(function() {
        document.querySelector(".message").style.display = "none";
    }, delay)
}

function showInstructions() {
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").style.display = "block";
        document.querySelector(".message").innerHTML = "<h4>Welcome to</h4>";
        // playSound(messageBeep, 0.060);
    }, 1000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").style.display = "block";
        document.querySelector(".message").innerHTML = "<h4>Welcome to<br/><h3>Forklift</h3></h4>";
        playSound(messageBeep, 0.260);
    }, 2000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").style.display = "block";
        document.querySelector(".message").innerHTML = "<h4>Welcome to<br/><h3>Forklift Simulator</h3></h4>";
        playSound(messageBeep, 0.260);
    }, 3000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").style.display = "block";
        document.querySelector(".message").innerHTML = "<h4>Welcome to<br/><h3>Forklift Simulator 2022</h3></h4>";
        playSound(messageBeep, 0.260);
    }, 4000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div>You've been assigned to bring</div>these crates <div style='display: inline-block; background-color: #1F2028; padding: 4px 9px 11px 9px'><table style='position: relative; display: inline'><tr><td class='crate-sample' style='color:red'></td><td class='crate-sample' style='color:green'></td><td class='crate-sample' style='color:blue'></td></tr></table></div> to<div style='padding-top: 6.5px'>their respective shelves</div><div style='padding-top: 6.5px'><div><table style='top: 2.5px; position: relative; display: inline'><tr><td class='shelf-sample' style='background-color:red'></td> <td class='shelf-sample' style='background-color:green'></td> <td class='shelf-sample' style='background-color:blue'></td></tr></table></div></div>";
        playSound(messageBeep, 0.260);
    }, 7000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div style='padding-bottom: 6.5px'>But due to, uhh..low visibility</div><div style='padding-bottom: 6.5px'>crates look more like this</div><div style='display: inline-block; background-color: #1F2028; padding: 4px 9px 11px 9px'><table style='position: relative; display: inline'><tr><td class='crate-sample' style='color:#c3c3c3'></td> <td class='crate-sample' style='color:#c3c3c3'></td> <td class='crate-sample' style='color:#c3c3c3'></td></tr></table></div>";
        playSound(messageBeep, 0.260);
    }, 13000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div style='padding-bottom: 6.5px'>But due to, uhh..low visibility</div><div style='padding-bottom: 6.5px'>crates look more like this</div><div style='display: inline-block; background-color: #1F2028; padding: 4px 9px 11px 9px'><table style='position: relative; display: inline'><tr><td class='crate-sample' style='color:red'></td> <td class='crate-sample' style='color:green'></td> <td class='crate-sample' style='color:blue'></td></tr></table></div></br><div style='padding-top: 6.5px'>until you grab them,</div>";
        playSound(messageBeep, 0.260);
    }, 17000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div style='padding-bottom: 6.5px; padding-top: 6.5px'>and the shelves look like</div><div><table style='top: 2.5px; position: relative; display: inline'><tr><td class='shelf-sample' style='background-color:#0E1018'></td> <td class='shelf-sample' style='background-color:#0E1018'></td> <td class='shelf-sample' style='background-color:#0E1018'></td></tr></table></div>";
        playSound(messageBeep, 0.260);
    }, 19500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div style='padding-bottom: 6.5px; padding-top: 6.5px'>and the shelves look like</div><div><table style='top: 2.5px; position: relative; display: inline'><tr><td class='shelf-sample' style='background-color:red'></td> <td class='shelf-sample' style='background-color:green'></td> <td class='shelf-sample' style='background-color:blue'></td></tr></table></div><div style='padding-top: 9px'>until you get near them.</div>";
        playSound(messageBeep, 0.260);
    }, 22500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "the green bar <table style='position: relative; display: inline'><tr><td class='hit-bar-sample' style='background-color:green'></td></tr></table> at the</br></br>bottom shows the fuel you have</br>";
        playSound(messageBeep, 0.260);
    }, 26500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML += "<br/>before you, ";
        playSound(messageBeep, 0.260);
    }, 29500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML += "uhh..";
        playSound(messageBeep, 0.260);
    }, 30500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML += "die";
        playSound(messageBeep, 0.260);
    }, 31500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML += " " + skullEmoji;
        playSound(messageBeep, 0.260);
    }, 33000))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div style='padding-bottom: 6.5px'>Navigate using <span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>W</span>&nbsp<span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>A</span>&nbsp<span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>S</span>&nbsp<span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>D</span></div>or the arrow keys <span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>←</span>&nbsp<span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>↑</span>&nbsp<span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>↓</span>&nbsp<span style='color:#c3c3c3; padding: 0 7px 0 7px;background-color:#0E1018; border-radius: 4px'>→</span><div style='padding-bottom: 6.5px;padding-top: 6.5px'></br>if you're on mobile</div>use the onscreen controls";
        playSound(messageBeep, 0.260);
    }, 34500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        document.querySelector(".message").innerHTML = "<div style='padding-bottom: 6.5px'>Let's get to sorting crates,</div>shall we?";
        playSound(messageBeep, 0.260);
    }, 41500))
    
    instructions_timeouts.push(window.setTimeout(function(){
        gameStartShowHideColors(1000);
        document.querySelector(".message").style.display = "none";
        playSound(startLevel1Sound, 0.270);
    }, 44500))
}

function loadGame() {
    next_level_instance = instantiateGame(1, 3, hit_points, 0, 0, 5, -25, 0);
    showInstructions();
}

function mobile_controls() {
    document.querySelector(".mobile-controls-forward").onmousedown = function (){
        map['arrowup'] = true;
        document.querySelector(".mobile-controls-forward").style.color = 'white';
    }

    document.querySelector(".mobile-controls-forward").onmouseup = function (){
        map['arrowup'] = false;
        document.querySelector(".mobile-controls-forward").style.color = 'grey';
    }

    document.querySelector(".mobile-controls-backward").onmousedown = function (){
        map['arrowdown'] = true;
        document.querySelector(".mobile-controls-backward").style.color = 'white';
    }

    document.querySelector(".mobile-controls-backward").onmouseup = function (){
        map['arrowdown'] = false;
        document.querySelector(".mobile-controls-backward").style.color = 'grey';
    }

    document.querySelector(".mobile-controls-left").onmousedown = function (){
        map['arrowleft'] = true;
        document.querySelector(".mobile-controls-left").style.color = 'white';
    }

    document.querySelector(".mobile-controls-left").onmouseup = function (){
        map['arrowleft'] = false;
        document.querySelector(".mobile-controls-left").style.color = 'grey';
    }

    document.querySelector(".mobile-controls-right").onmousedown = function (){
        map['arrowright'] = true;
        document.querySelector(".mobile-controls-right").style.color = 'white';
    }

    document.querySelector(".mobile-controls-right").onmouseup = function (){
        map['arrowright'] = false;
        document.querySelector(".mobile-controls-right").style.color = 'grey';
    }

    document.querySelector(".toggle-onscreen-controls").onclick = function (){
        if (toggleOnscreenControls == true){
            document.querySelector(".toggle-onscreen-controls").style.color = '#5d5d5d';
            document.querySelector(".mobile-controls-all").style.display = 'none';
            toggleOnscreenControls = false;
        } else {
            document.querySelector(".toggle-onscreen-controls").style.color = '#c3c3c3';
            document.querySelector(".mobile-controls-all").style.display = 'block';
            toggleOnscreenControls = true;
        }
    }
    
    
    document.querySelector(".mobile-controls-forward").ontouchstart = function (){
        map['arrowup'] = true;
        document.querySelector(".mobile-controls-forward").style.color = 'white';
    }

    document.querySelector(".mobile-controls-forward").ontouchend = function (){
        map['arrowup'] = false;
        document.querySelector(".mobile-controls-forward").style.color = 'grey';
    }

    document.querySelector(".mobile-controls-backward").ontouchstart = function (){
        map['arrowdown'] = true;
        document.querySelector(".mobile-controls-backward").style.color = 'white';
    }

    document.querySelector(".mobile-controls-backward").ontouchend = function (){
        map['arrowdown'] = false;
        document.querySelector(".mobile-controls-backward").style.color = 'grey';
    }

    document.querySelector(".mobile-controls-left").ontouchstart = function (){
        map['arrowleft'] = true;
        document.querySelector(".mobile-controls-left").style.color = 'white';
    }

    document.querySelector(".mobile-controls-left").ontouchend = function (){
        map['arrowleft'] = false;
        document.querySelector(".mobile-controls-left").style.color = 'grey';
    }

    document.querySelector(".mobile-controls-right").ontouchstart = function (){
        map['arrowright'] = true;
        document.querySelector(".mobile-controls-right").style.color = 'white';
    }

    document.querySelector(".mobile-controls-right").ontouchend = function (){
        map['arrowright'] = false;
        document.querySelector(".mobile-controls-right").style.color = 'grey';
    }

    document.querySelector(".toggle-onscreen-controls").ontouchmove = function (){
        if (document.querySelector(".mobile-controls-all").style.display == 'none'){
            document.querySelector(".mobile-controls-all").style.display = 'block';
        }
        if (document.querySelector(".mobile-controls-all").style.display == 'block'){
            document.querySelector(".mobile-controls-all").style.display = 'none';
        }
    }
}

levelCompleteSound = [0,undefined,4,undefined,7,undefined,12];
startGameSound = [0,4,7,12,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
startLevel1Sound = [0,4,7,undefined,undefined,undefined,undefined,undefined,undefined];
startLevel2Sound = [1,5,8,undefined,undefined,undefined,undefined,undefined,undefined];
startLevel3Sound = [2,6,9,undefined,undefined,undefined,undefined,undefined,undefined];
startLevel4Sound = [3,7,10,undefined,undefined,undefined,undefined,undefined,undefined];
startLevel5Sound = [4,8,11,undefined,undefined,undefined,undefined,undefined,undefined];
endLevel1Sound = [0,4,7,12,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
endLevel2Sound = [1,5,8,13,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
endLevel3Sound = [2,6,9,14,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
endLevel4Sound = [3,7,10,15,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
endLevel5Sound = [4,8,11,16,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
loadCrateSound = [4,7,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
shelfCrateSound = [7,12,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
dropCrateSound = [7,4,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
messageBeep = [0,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
hitSound = [-20,undefined,undefined,undefined,undefined]
deathSound = [-21,-25,-45]
gameCompleteSound = [-5,0,4,7,undefined,4,7]
lickSound = [2,4,5,7,4,undefined,0,2]


function playSound(sound, volume) {
    if (A != null) {
        A.close()
    }

    f = function(i){
        var notes = sound;
        var n=3.5e4;
        if (i > n) return null;
        var idx = ((notes.length*i)/n)|0;
        var note = notes[idx];
        if (note === undefined) return 0;
        var r = Math.pow(2,note/12)*0.8;
        var q = t((i*notes.length)%n,n);
        return ((i*r)&64)?q:-q
    }


    t=(i,n)=>(n-i)/n;
    A=new AudioContext()
    m=A.createBuffer(1,96e3,48e3)
    b=m.getChannelData(0)
    for(i=96e3;i--;)b[i]=f(i)
    s=A.createBufferSource()
    s.buffer=m
    
    var gainNode = A.createGain()
    gainNode.gain.value = volume
    gainNode.connect(A.destination)
    s.connect(gainNode)
    s.start()
}

function playSound2(sound, volume) {
    if (A2 != null) {
        A2.close()
    }

    f = function(i){
        var notes = sound;
        var n=3.5e4;
        if (i > n) return null;
        var idx = ((notes.length*i)/n)|0;
        var note = notes[idx];
        if (note === undefined) return 0;
        var r = Math.pow(2,note/12)*0.8;
        var q = t((i*notes.length)%n,n);
        return ((i*r)&64)?q:-q
    }


    t=(i,n)=>(n-i)/n;
    A2=new AudioContext()
    m=A2.createBuffer(1,96e3,48e3)
    b=m.getChannelData(0)
    for(i=96e3;i--;)b[i]=f(i)
    s=A2.createBufferSource()
    s.buffer=m
    
    var gainNode = A2.createGain()
    gainNode.gain.value = volume
    gainNode.connect(A2.destination)
    s.connect(gainNode)
    s.start()
}
