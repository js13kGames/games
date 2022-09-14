function clickBody(){
	a = (document.getElementById("actor").getAttribute("position").y)

	if(a==1.25){
		document.getElementById("actor").setAttribute('position', "0 2.75 -4.9");	
	}
	else{
		document.getElementById("actor").setAttribute('position', "0 "+(a+1)+" -4.9");	
	}
	document.getElementById("cam").setAttribute("position",'0 '+(((document.getElementById("actor").getAttribute("position")).y-0.20)/2)+' 2')
}
(function(){
	document.getElementById("cam").setAttribute('rotation',"2 111 0");
  	document.getElementById("sc").insertAdjacentHTML("afterbegin", '<a-ring  position="0 1.25 -5"  color="#FFF" radius-inner="-1" radius-outer="0"></a-ring>');
  	l = ['#8BC34A','#FFEB3B','#2196F3','#F39C12']
  	for (var i = 2; i < 6; i++) {
  		rand = Math.floor((Math.random() * 180) + 0);
  		console.log(rand);
  		dur = Math.floor((Math.random() * 2) + 1);
  		dur = dur*5000;
  		index = Math.floor((Math.random() * l.length) + 0);
  		document.getElementById("sc").insertAdjacentHTML("afterbegin", '<a-ring segments-theta="60"  position="0 1.25 -5" rotation="0 0 '+rand+'" animation="property: rotation; to: 0 0 '+(360+rand)+'; loop: true; dur: '+dur+'; easing: linear;" color="'+l[index]+'" radius-inner="'+i+'" radius-outer="'+(i+1)+'"><a-ring collider-check raycaster="objects: .actor" position="'+i+'.50 0 0.1" color="#673AB7" radius-inner="-0.25" radius-outer="0.4"></a-ring><a-ring collider-check raycaster="objects: .actor" position="-'+i+'.5 0 0.1" color="#3F51B5" radius-inner="-0.25" radius-outer="0.4"></a-ring><a-ring collider-check raycaster="objects: .actor" position="0 '+i+'.45 0.1" color="#F44336" radius-inner="-0.25" radius-outer="0.4"></a-ring> <a-ring collider-check raycaster="objects: .actor" position="0 -'+i+'.45 0.1" color="#F44336" radius-inner="-0.25" radius-outer="0.4"></a-ring></a-ring>');
  	}
})();
