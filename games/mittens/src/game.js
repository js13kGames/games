kontra.init();

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');


kontra.assets.imagePath = 'assets/images';
kontra.assets.load('tile3.png', 'player.png','enemy.png').then(function(){
var tile = kontra.sprite({
	x:0,
	y:0,
	image: kontra.assets.images.tile3

});

var enemies = [
	kontra.sprite({
	x: 100,
	y:110,
	image: kontra.assets.images.enemy,
	dx:1
	}),
	kontra.sprite({
	x: 100,
	y:80,
	image: kontra.assets.images.enemy,
	dx:1.5
	}),
	kontra.sprite({
	x: 100,
	y:150,
	image: kontra.assets.images.enemy,
	dx:0.8
	})
];
var player =kontra.sprite({
	x:108,
	y:230,
	image: kontra.assets.images.player
})

var loop = kontra.gameLoop({
	update: function(){
		if(kontra.keys.pressed('up')){
			player.y -= 1;
		}
		else if(kontra.keys.pressed('down')){
			player.y -= -1;
		}
		else if(kontra.keys.pressed('left')){
			player.x-=1;
		}

		else if(kontra.keys.pressed('right')){
			player.x+=1;
		}
		else if (kontra.keys.bind(['enter', 'space'], function() {
  			console.log("Open!");
  			
		})
			);
		if(player.y<=40){
			loop.stop();
			alert('You Won!');
			window.location='';
		}
		player.update();

		enemies.forEach(function(enemy){
		if(enemy.x> 200){
		enemy.x=200;
		enemy.dx = -Math.abs(enemy.dx);
		}
		else if(enemy.x< 32){
			enemy.x=32;
			enemy.dx = Math.abs(enemy.dx);
		}

		enemy.update();


		if(enemy.collidesWith(player)){
			loop.stop();
			alert('You Lost!!');
			window.location='';
		}
		});	
		 
		tile.update();
	},
	render: function(){
		tile.render();
		player.render();
		enemies.forEach(function(enemy){
			enemy.render();
		});
	}
});

loop.start();
}
);

function createText(canvas){
	var w=canvas.width;
}

