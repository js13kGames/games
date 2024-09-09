let entities = [];

let player = new Player({x: 0, y: 0});

entities.push(player);

let renderer = new Renderer();

for(i = 0; i < 100; i++){
    let scatter = 2;
    let position;
    do{
        position = {x: rand(-renderer.w * scatter, renderer.w * scatter), y:rand(-renderer.h * scatter, renderer.h * scatter)};
    }
    while(player.distanceTo(player.position, position) < 300)

    entities.push(new Rock(position, rand(5, 15)));
}

for(i = 0; i < 70; i++){
    let scatter = 2;
    let position;
    do{
        position = {x: rand(-renderer.w * scatter, renderer.w * scatter), y:rand(-renderer.h * scatter, renderer.h * scatter)};
    }
    while(player.distanceTo(player.position, position) < 300)

    entities.push(new Water(position, rand(7, 13)));
}


//spaceship
entities.push(new Floater({x: -25, y: -80}, 23, {img: 'scrap1', imgScale: 2.5}));
entities.push(new Floater({x: -125, y: -20}, 12, {img: 'scrap3', imgScale: 1.5}));
entities.push(new Floater({x: 70, y: 120}, 12, {img: 'scrap2', imgScale: 1.5}));


entities.push(new Ali({x: 130, y: 100}, 12));
entities.push(new Armen({x: -170, y: -50}, 12));

render();

function render(){
    renderer.tick();
    requestAnimationFrame(render);
}