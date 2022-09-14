"use strict"
//----------------------- variable declaration-----------------------------------//
var point = 0;
var remainpoints = 0;
var firstround = true;
var nr = 0;
var nrList = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

var pointtext1='<a-text value="';
var pointtext2='" color="#BBB" position="-20 0 0" scale="50 50 50" rotation="0 90 0"></a-text>';

function cls(){
	document.getElementById('intro').innerHTML = "";
	document.getElementById('Point').innerHTML = pointtext1 + "0" + pointtext2;
	
	setInterval(function(){PrisonGame();},3000);
}

//***********************************//
function coloring(i){
    document.getElementById(i).setAttribute('opacity', '1');
	document.getElementById(i).setAttribute('color', 'red');
	document.getElementById(i).setAttribute('material', 'src: #my-texture');
}

function PrisonGame(){
	if (firstround){
		rebelRandomizer();
		nrList[nr] = 3;
		firstround = false;
	}else{
		for (var i = nrList.length - 1; i >= 0; i--) {
			if(nrList[i] == 0){
				remainpoints = remainpoints+1;
				showFaildPrisonNr();
			}

			if(nrList[i] > -1){
				nrList[i] = nrList[i]-1;
			}	
		}
		rebelRandomizer();
		nrList[nr] = 3;
	}
}

function rebelRandomizer(){
	var isthere = false;
	var x1 = 0;
	isthere = false;

	while (!isthere)
	{
		x1 = Math.floor(Math.random()*33)+1;
		if(x1!=nr){
			isthere = true; 
			nr = x1;
			document.getElementById(nr).addEventListener('click',coloring(nr));
		}
	}
}

function showFaildPrisonNr() {
	document.getElementById('Point').innerHTML= '<a-text value="' + remainpoints + '" color="#BBB" position="-20 0 0" scale="50 50 50" rotation="0 90 0"></a-text>';
	if(remainpoints > 20){
		document.getElementById('intro').innerHTML = '<a-text  id="IntroText" value="You failed! Too many inmates escaped from the prison! You`ve lost your job.! Please take off the headset!" color="red" position="-2 3 -3" scale="1.5 1.5 1.5"></a-text>';
	}
}

function shoot(i) {
	console.log(i, " shooted");
	nrList[i] = -1;
	point = point+1;
	document.getElementById(i).setAttribute('opacity','0');
}