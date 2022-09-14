  var x = document.createElement("TABLE");
  x.setAttribute("id", "playground");
  //x.setAttribute("style", "width:100%");
  document.body.appendChild(x);

var idx = 0;
var elements = [];
selected = {};

var errors = ['404.0','404.1','404.2','404.3','404.4','404.5','404.6','404.7','404.8','404.9','404.10','404.11','404.12','404.13','404.14','404.15','404.16','404.17','404.18','404.19','404.20'];
rows = {}
            
for (var i = 0; i < 100; i++) {
	rows[i] = document.createElement("TR");
	errorforthisrow = false;
	for (var d = 0; d < 100; d++) {

		cell = document.createElement("TD");
		cell.setAttribute("id",idx);
		img = document.createElement("IMG");
		if (((i == 50)&&(d == 49))||((i == 50)&&(d == 51))) {
			img.setAttribute("src", "cpu.png");
			elements.push({"id":idx,"role":"CPU"});
			cell.appendChild(img);
		}
		else if ((i == 50)&&(d == 50)) {
			img.setAttribute("src", "pc.png");
			var myBodyId = document.getElementById("commentbox");   
		    var newBaitTag = document.createElement('a');
		    var newBaitText = document.createTextNode("Start game!");
		    //newBaitTag.setAttribute('href', "#"+idx);
		    newBaitTag.setAttribute('href', "#4560");
		    newBaitTag.setAttribute('id', "starter");
		    // we create new things above
		    // we append them to the page body below
		    newBaitTag.appendChild(newBaitText);
		    myBodyId.appendChild(newBaitTag); 
		    //this part was from here: https://stackoverflow.com/a/43551068
		    elements.push({"id":idx,"role":"HOME"});
			cell.appendChild(img);
		}
		else if((rand = Math.floor(Math.random() * 20)) < 2){
			switch(rand){
				case 0: 
					img.setAttribute("src", "cloud2.png");
					elements.push({"id":idx,"role":"CLOUD"});
						break;	
				case 1: 
					img.setAttribute("src", "trex.png");
					elements.push({"id":idx,"role":"TREX"});
					break;	
			}
			cell.appendChild(img);
		}
		else if((errors.length != 0) && (!errorforthisrow) && (Math.floor(Math.random()) * 900000 < 6)) {
			error = errors.pop();
			err = document.createElement("DIV");
			err.appendChild(document.createTextNode(error));
			elements.push({"id":idx,"role":"ERROR"});
			cell.appendChild(err);	
			errorforthisrow = true;
		}
		else{
			img.setAttribute("src", "tile.png");
			elements.push({"id":idx,"role":"tile"});
			cell.appendChild(img);
		}
		idx++
		rows[i].appendChild(cell);

	}
	document.getElementById("playground").appendChild(rows[i]);
}

var cpuselected = false;
var cpuid = 0;
document.getElementById("playground").addEventListener("click",function(event){
    switch(elements[event.target.parentNode.id].role){
    	case "HOME":
    		document.getElementById("inventory").innerHTML="This is the home of the CPUs. This is your base.";
    		cpuselected = false;
    		break;
    	case "CLOUD":
    		document.getElementById("inventory").innerHTML="You can got one more piece of data from the cloud servers!";
    		cpuselected = false;
    		break;
    	case "TREX":
    		document.getElementById("inventory").innerHTML="This t-rex is dangerous! You can defeat one using a cloud data!<br>Be carefoul!";
    		cpuselected = false;
    		break;
    	case "ERROR":
    		document.getElementById("inventory").innerHTML="This is a piece of error what you are searching for!";
    		cpuselected = false;
    		break;
    	case "tile":
    		document.getElementById("inventory").innerHTML="Extract it with a CPU core, to know what is inside of it!";
    		cpuselected = false;
    		break;
    	case "CPU":
    		document.getElementById("inventory").innerHTML="Use your CPU cores to collect error fragments, extract cloud data or contents of tiles.<br>Select left click, go/extract nearby tile with right click.";
    		cpuselected = true;
    		cpuid = event.target.parentNode.id;
    		break;
    }
	event.preventDefault();
},false);

var clouds = 0;
var remaingerrors = errors.length;
var bits = 0

document.getElementById("starter").addEventListener("click",function(e) {
	document.getElementById("commentbox").innerHTML = "clouds: ";
	cloud = document.createElement("DIV");
	cloud.setAttribute("id","cloud");
	cloud.appendChild(document.createTextNode(clouds));
	document.getElementById("commentbox").appendChild(cloud);
	document.getElementById("commentbox").innerHTML += "<br>remaining errors: ";
	errornr = document.createElement("DIV");
	errornr.setAttribute("id","errors");
	errornr.appendChild(document.createTextNode(remaingerrors));
	document.getElementById("commentbox").appendChild(errornr);
	document.getElementById("commentbox").innerHTML += "<br>collected bits: ";
	collectedbit = document.createElement("DIV");
	collectedbit.setAttribute("id","bits");
	collectedbit.appendChild(document.createTextNode(bits));
	document.getElementById("commentbox").appendChild(collectedbit);
})

document.getElementById("playground").addEventListener("contextmenu",function(event){
    event.preventDefault();
    if(cpuselected){
    	if ((event.target.parentNode.id == cpuid +1)   ||
    	    (event.target.parentNode.id == cpuid -1)   ||
    	    (event.target.parentNode.id == cpuid -100) ||
    	    (event.target.parentNode.id == cpuid +100) 
    	   ){
    		switch(elements[event.target.parentNode.id].role){
		    	case "HOME":
		    		document.getElementById("inventory").innerHTML="Not possible to move here!";
		    		cpuselected = false;
		    		break;
		    	case "CLOUD":
		    		document.getElementById(cpuid).innerHTML=" + ";
		    		clouds += 1;
		    		document.getElementById("cloud").innerHTML=clouds;
		    		document.getElementById("inventory").innerHTML="You collected one more cloud data!";

		    		img = document.createElement("IMG");
					img.setAttribute("src", "cpu.png");
					elements[event.target.parentNode.id].role = "CPU";
					elements[cpuid].role = "tile";
//					document.getElementById(event.target.parentNode.id).innerHTML="";
		    		document.getElementById(event.target.parentNode.id).appendChild(img);
		    		cpuselected = false;
		    		break;
		    	case "TREX":
		    		document.getElementById("inventory").innerHTML="This t-rex is dangerous! You can defeat one using a cloud data!<br>Be carefoul!";
		    		if (clouds == 0) {
		    			document.getElementById("inventory").innerHTML="You don't have necessary cloud data to defeat this t-rex!";
		    		} else {
		    			clouds -= 1;
		    			document.getElementById(cpuid).innerHTML=" + ";
			    		document.getElementById("cloud").innerHTML=clouds;
			    		document.getElementById("inventory").innerHTML="You defeated the t-rex!";

			    		img = document.createElement("IMG");
						img.setAttribute("src", "cpu.png");
						elements[event.target.parentNode.id].role = "CPU";
						elements[cpuid].role = "tile";
	//					document.getElementById(event.target.parentNode.id).innerHTML="";
			    		document.getElementById(event.target.parentNode.id).appendChild(img);
		    		}
		    		cpuselected = false;
		    		break;
		    	case "ERROR":
		    		remaingerrors -= 1;
	    			document.getElementById(cpuid).innerHTML=" + ";
		    		document.getElementById("errors").innerHTML=remaingerrors;
		    		document.getElementById("inventory").innerHTML="You have found one more 404 error type!";

			    	img = document.createElement("IMG");
					img.setAttribute("src", "cpu.png");
					elements[event.target.parentNode.id].role = "CPU";
					elements[cpuid].role = "tile";
//					document.getElementById(event.target.parentNode.id).innerHTML="";
			    	document.getElementById(event.target.parentNode.id).appendChild(img);
		    		cpuselected = false;
		    		break;
		    	case "tile":
		    		bits += 1;
	    			document.getElementById(cpuid).innerHTML=" + ";
		    		document.getElementById("bits").innerHTML=bits;
		    		document.getElementById("inventory").innerHTML="You have found one more bit.";

			    	img = document.createElement("IMG");
					img.setAttribute("src", "cpu.png");
					elements[event.target.parentNode.id].role = "CPU";
					elements[cpuid].role = "tile";
//					document.getElementById(event.target.parentNode.id).innerHTML="";
			    	document.getElementById(event.target.parentNode.id).appendChild(img);
		    		cpuselected = false;
		    		break;
		    	case "CPU":
		    		document.getElementById("inventory").innerHTML="Can't merge two CPU different core!";
		    		cpuselected = false;
		    		break;
    		}
	    }else{
	    	document.getElementById("inventory").innerHTML="WARNING <br> Moving is only possible to nearby areas!";
	    }	
    }
},false);

/*
var notepad = document.getElementById("notepad");
notepad.addEventListener("contextmenu",function(event){
    event.preventDefault();
    var ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "block";
    ctxMenu.style.left = (event.pageX - 10)+"px";
    ctxMenu.style.top = (event.pageY - 10)+"px";
},false);
notepad.addEventListener("click",function(event){
    var ctxMenu = document.getElementById("ctxMenu");
    ctxMenu.style.display = "";
    ctxMenu.style.left = "";
    ctxMenu.style.top = "";
},false);*/