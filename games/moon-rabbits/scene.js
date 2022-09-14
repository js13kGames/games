function openScene() {
    scene01_opening();
}

var scene01_timer;
function scene01_opening() {
    let fieldCenter = document.querySelector('#field_display_center')
    fieldCenter.innerHTML = `
    <div id="scene01_container">
        <div class="scene01_field_top">
            <div id="scene01_moon"></div>
        </div>
        <div class="scene01_field_bottom">
            <div class="scene01_rabbit">
⠀⢀⣆⡉⠭⠭⠕⢂⠤⠤⠤⠄⢀⠀⠀
⢰⡉⠀⠈⠀⠀⣀⠈⠀⠟⠀⠀⠀⡇⠀
⠀⠈⠑⠒⠚⠉⠙⡀⠀⠀⠀⢀⠜⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠉⠳⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡆⠀⠀⠀⠀⡈⡅⠀
⠀⠀⠀⠀⠀⢀⠜⠀⠀⠀⠀⠀⡇⡇⠀
⠀⠀⠀⠀⢠⠏⠀⠀⠀⠀⠈⠲⡓⠜⠀
⠀⠀⠀⣀⡎⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀
⠀⠀⢰⡁⠰⡀⠀⠀⠀⠀⠀⢠⣃⠀⠀
⠀⠀⠀⠑⠓⠊⠂⠠⠤⠤⠬⠤⠬⠅
            </div>
            <div class="scene01_rabbit">
⠀⢀⣆⡉⠭⠭⠕⢂⠤⠤⠤⠄⢀⠀⠀
⢰⡉⠀⠈⠀⠀⣀⠈⠀⠟⠀⠀⠀⡇⠀
⠀⠈⠑⠒⠚⠉⠙⡀⠀⠀⠀⢀⠜⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠉⠳⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡆⠀⠀⠀⠀⡈⡅⠀
⠀⠀⠀⠀⠀⢀⠜⠀⠀⠀⠀⠀⡇⡇⠀
⠀⠀⠀⠀⢠⠏⠀⠀⠀⠀⠈⠲⡓⠜⠀
⠀⠀⠀⣀⡎⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀
⠀⠀⢰⡁⠰⡀⠀⠀⠀⠀⠀⢠⣃⠀⠀
⠀⠀⠀⠑⠓⠊⠂⠠⠤⠤⠬⠤⠬⠅
            </div>
        </div>
    </div>
    `
    let rabbits = document.querySelector('.scene01_field_bottom');
    let check = true;
    scene01_timer = setInterval(() => {
        if(check) {
            rabbits.style.justifyContent= "space-evenly";
            check = false;
        } else {
            rabbits.style.justifyContent= "center";
            check = true;
        }
    }, 1000);
}
function off_scene01() {
    clearInterval(scene01_timer)
}

var rabbit_count = 2;
var scene02_timer;
function scene02_ingame() {
    off_scene01()
    
    let fieldCenter = document.querySelector('#field_display_center')
    fieldCenter.innerHTML = `
    <div id="scene02_container">
    <div class ="scene02_spaceship">⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣾⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⢿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⢠⣾⣿⡏⠻⣿⣿⣿⠏⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⢾⣿⡟⠀⢠⣿⠈⠁⠀⢸⣿⣿⡇⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡟⠀⠀⠀⠀⠙⠛⠃⠀⠀⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    </div>
    
    </div>
    `
    for (let i = 1; i <= rabbit_count; i++) {
        let span_rabbit = document.createElement('span');
        span_rabbit.setAttribute('class', "scene02_rabbicon")
        span_rabbit.setAttribute('id', "rabbit" + i)
        span_rabbit.innerHTML = '🐇';
        let scene02Container = document.querySelector('#scene02_container')
        scene02Container.appendChild(span_rabbit)
    }

    scene02_move_rabbits(rabbit_count)
}

function scene02_move_rabbits(rabbit_input) {
    scene02_timer = setInterval(() => {
        for(let i = 1; i <= rabbit_input; i++) {
            let top_rand = (Math.random() * 375)
            let left_rand = (Math.random() * 463)
            let rabbit_id = document.querySelector(`#rabbit${i}`)
            rabbit_id.style.top = top_rand + 'px'
            rabbit_id.style.left = left_rand + 'px'
        }
    }, 1500)

}
function off_scene02() {
    clearInterval(scene02_timer)
}