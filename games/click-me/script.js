var start = new Date().getTime();
var count = 0;

 function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
		}
    return color;
    }
			
function delay(){
	setTimeout(changeshape, Math.random() * 2000);
}

function changeshape(){
	var top = Math.random() * 400;
	var left = Math.random() * 400;
	var height = Math.random() * 200 + 100;
	var width = Math.random() * 200 + 100;
	
	document.getElementById("shape").style.backgroundColor  = getRandomColor();
	document.getElementById("shape").style.width = width + "px";
	document.getElementById("shape").style.height = height + "px";
	document.getElementById("shape").style.left = left + "px";
	document.getElementById("shape").style.top = top + "px";
	if(Math.random() > 0.5)
		document.getElementById("shape").style.borderRadius = "50%";
	
	else
		document.getElementById("shape").style.borderRadius = "0%";
		
	document.getElementById("shape").style.display ="block";
	start = new Date().getTime();
}

delay();
document.getElementById("shape").onclick = function(){
	count++;
	document.getElementById("shape").style.display ="none";
	var end = new Date().getTime();
	var time = (end - start)/1000;
	document.getElementById("timetaken").innerHTML = time + "s";
	if(time > 2){
		alert("YOUR GAME IS OVER......! YOUR POINT IS: " + count);
		count = 0;
	}
	delay();
}
