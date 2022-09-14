function shoot(){
	document.getElementById("sc").insertAdjacentHTML('afterbegin','<a-entity rotation="'+document.getElementById("cam").getAttribute('rotation').x+" "+document.getElementById("cam").getAttribute('rotation').y+" "+document.getElementById("cam").getAttribute('rotation').z+" "+'" position="'+document.getElementById("cam").getAttribute('position').x+" "+document.getElementById("cam").getAttribute('position').y+" "+document.getElementById("cam").getAttribute('position').z+" "+'"><a-box anim-complete animation="property:position; to: 0 0 -30; dur: 3000; easing: easeOutQuad;" material="color: red" visible=true  class="	shot" ></a-box>	</a-entity>');
}
function clickBody(){
	shoot();
}
document.addEventListener("keydown", function(event) {
  if(event.which==69){
  	shoot();
  }
})
function spawnMonkey(){
	x=[0,-3,3,-3,-1,3]
	y=[4,-1,-1,-3,-3,-3]
	for(i=0;i<list.length;i++){
		
		//console.log(list[i])
		//x=Math.floor((Math.random() * 2) - 1);
		/*if(x==0){
			x=-2
		}
		else{
			x=3
		}*/
		//y=Math.floor((Math.random() * 2) -2);
		/*if(y==0){
			y=-2
		}
		else{
			y=1
		}*/
//		alert(x)
//		alert(y)
		//placeMonkey(list[i].getAttribute('position').x+x,3,list[i].getAttribute('position').y+y)
		index = Math.floor((Math.random() * 6)+ 0)
		console.log(list[i])
		console.log((list[i].x+x[index]),1,list[i].y+y[index])

		placeMonkey(list[i].x-x[index],1,list[i].y-y[index])
	//	placeMonkey(1,3,12)
	

	}

}
function placeMonkey(x,y,z){
	//console.log('ko')
	//console.log(x)
	//document.getElementById('sc').insertAdjacentHTML('afterbegin','<a-entity scale="10 10 10" position="'+x+' '+y+' '+z+'" text="value: '+x+' '+y+' '+z+'"></a-entity>')
	speed = Math.floor((Math.random() * 10) + 6)*1000;
	/*
	<a-entity animation="property:position; to: 0 3 0; dur: 1500; easing: easeInQuad"><a-cylinder rotation="10 3 0" color="#3F51B5" height="3" radius="0.8"><a-tetrahedron color="#3F51B5" radius="3" position="0 2 0"  rotation="225 0 45" width="256"></a-tetrahedron>	</a-cylinder><a-box color='#FF9800' position="0 -2 0" scale="4 3.5 2"></a-box>	<a-box color='#FF5722' rotation="0 0 45" position="-3 -2 0" scale="3 0.5 0.5"></a-box>	<a-box color='#FF5722' rotation="0 0 -45" position="3 -2 0" scale="3 0.5 0.5"></a-box></a-entity>
	*/
	document.getElementById('sc').insertAdjacentHTML('afterbegin','<a-entity scale="0.5 0.5 0.5" position="'+x+' '+y+' '+z+'"><a-entity animation="property:position; to: 0 30 0; dur: '+speed+';  easing: easeInQuad" collider-check raycaster="objects: .shot"><a-cylinder rotation="10 3 0" color="#3F51B5" height="3" radius="0.8"><a-tetrahedron color="#3F51B5" radius="3" position="0 2 0"  rotation="225 0 45" width="256"></a-tetrahedron>	</a-cylinder><a-box color="#FF9800" position="0 -2 0" scale="4 3.5 2"></a-box>	<a-box color="#FF5722" rotation="0 0 45" position="-3 -2 0" scale="3 0.5 0.5"></a-box>	<a-box color="#FF5722" rotation="0 0 -45" position="3 -2 0" scale="3 0.5 0.5"></a-box></a-entity></a-entity>');
	/*document.getElementById('sc').insertAdjacentHTML('afterbegin',' <a-entity animation="property:position; to: 0 16 0; dur: '+speed+'; easing: linear">\
			 <a-box color="orange" collider-check raycaster="objects: .shot" depth="1" height="2" width="1" position="'+x+' '+y+' '+z+'">\
			 	<a-box color="pink" depth="0.75" height="2" width="0.80" position="0 1 0" ></a-box>\
			 </a-box>\
		</a-entity>')
*/
}
function placeTree(x,y,z,rot){
	var el = document.createElement('a-entity');
	el.setAttribute('position',x+' '+y+' '+z);
	el.setAttribute('rotation','0 '+rot+' 0');
//	el.setAttribute('color',"#8B4513");
	saver={x: x, z: y,y: z}
	if(list.length<6){
		list.push(saver)
	}
	//console.log(x,y,z)
	//document.getElementById("sc").insertAdjacentHTML('<a-cylinder color="#8B4513" height="3" radius="1" position='+position)
	el.insertAdjacentHTML("afterbegin",'<a-cylinder color="#8B4513" height="3" radius="1" position="0 -3 0"></a-cylinder>')
	rand=Math.floor((Math.random() * 3) + 1);
	for (var i = 0; i < 4+rand; i++) {
		//rot=Math.floor((Math.random() * 12) + 1)*15;
		//if(i!=3+rand){
			el.insertAdjacentHTML("afterbegin",'<a-tetrahedron color="rgb(144,'+(200+i*10)+',144)" radius="'+(5-i/7)+'" position="0 '+i*3+' 0"  rotation="225 '+(rot*0)+' 45" width="512"></a-tetrahedron>') 	
		//}
		//else{
		//console.log(rot)
		//elite = document.createElement('a-entity');
		//elte.insertAfter('el')
		//el.insertAdjacentHTML("afterbegin",'<a-tetrahedron color="rgb(144,'+(200+i*10)+',144)" radius="'+(5-i/7)+'" position="0 '+i*3+' 0"  rotation="225 '+(rot*0)+' 45" width="512"></a-tetrahedron>') 
		//document.getElementById("sc").insertAdjacentHTML("afterbegin",'<a-tetrahedron color="rgb(144,'+(200+i*10)+',144)" radius="5" position="0 '+i*3+' 0"  rotation="225 '+(rot*0)+' 45" width="512"></a-tetrahedron>') 
		//console.log(i)
		//}
	}
	document.getElementById('sc').appendChild(el)
}	//document.getElementById("sc").insertAdjacentHTML('</a-cylinder>')
(function(){
	list=[]
	for (var i = 0; i < 20; i++) {
	rot=Math.floor((Math.random() * 12) + 1)*15;
	posX=Math.floor((Math.random() * 20) - 5)*4;
	posY=Math.floor((Math.random() * 20) - 5)*4;
	placeTree(posX, 2,posY,rot);

	//placeTree(1, 2, 5, 45);
	//placeTree(1, 2, 5, 45);

}
level = 4
monkey = level
for (var i = 0; i < monkey; i++) {
	spawnMonkey();
}
//spawnMonkey()
timer();
})();

function timer() {
seconds = 10
var x = setInterval(function() {
	seconds-=1
	if(score<100){
	
		if(seconds==0){
			
			alert('Times Up! You Loose')
			window.location.reload();

		}
	
	}
	else if(seconds==0){
		document.getElementById('time').setAttribute('value','You Win')
		clearInterval(x);
			
	}
	document.getElementById('time').setAttribute('value','Time Left: '+seconds+'')

}, 1000);
}