"use strict"

var NR_OF_LIFE = 3;
var alive = true;
var tmp = "";

var zozo = '-5 -1.3 -15';

document.getElementById("zombie").addEventListener("click", function(){
    console.info("FIRE");
    tmp = document.getElementById("zombies").innerHTML;
    document.getElementById("zombies").innerHTML = "";
    newzombie();
});

document.getElementById("zombie").addEventListener('componentchanged', function(){
     if((document.getElementById("zombie").getAttribute('position').x >-1) && (document.getElementById("zombie").getAttribute('position').y >-1) && (document.getElementById("zombie").getAttribute('position').z >4.8)){
     	document.getElementById("zombies").innerHTML = "";
     	decLife();
     	newzombie();
     }
});


function decLife() {
		--NR_OF_LIFE;
		if(NR_OF_LIFE == 0){
			document.getElementById('life').setAttribute('value', 'OVER');
			var newPosition = new THREE.Vector3( -4.8, -3.8, 5);
			document.getElementById('life').setAttribute('position', newPosition);
			NR_OF_LIFE = 0;
	}
	console.info("NR_OF_LIFE: " + NR_OF_LIFE);
}

function newzombie() {
	if(NR_OF_LIFE != 0){
		console.info("new zozo");
		var X = 0;
		var Z = 0;

		var val = Math.floor((Math.random() * 50) + 20);
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		X = val * plusOrMinus;
		val = Math.floor((Math.random() * 50) + 20);
		plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		Z = val * plusOrMinus;
		console.log("X: " + X + " Z: " + Z);
    	document.getElementById("zombies").innerHTML = '<a-box id="zombie" material="src: #zombie1" width="0" height="4" depth="0.4" transparent="true" opacity="0.75" position="' + X + ' -1.3 ' + Z + '" rotation="0 0 0" scale="2 0.5 3"> <a-animation attribute="position" to="0 0 5" fill="forwards" dur="5000"></a-animation></a-box>';
    	rebindZozo();
	}
}

function rebindZozo() {
    document.getElementById("zombie").addEventListener('componentchanged', function(){
        if((document.getElementById("zombie").getAttribute('position').x >-1) && 
           (document.getElementById("zombie").getAttribute('position').y >-1) && 
           (document.getElementById("zombie").getAttribute('position').z >4.8)) {
            document.getElementById("zombies").innerHTML = "";
            newzombie();
            decLife();
        }
    });
}