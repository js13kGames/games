"use strict"

function clickonperson(e){
	change(2);
	console.log("AA")
}
function clickonperson1(e){
	change(1);
	console.log("BB")
}

function change(e) {
	var thing = []
	if (e == 1) {
		thing = ["name1", "age1", "job1", "weakness1", "strength1", "box1"];
	} else {
		thing = ["name2", "age2", "job2", "weakness2", "strength2", "box2"];
	}

	var age = 0;
	for (var i = 0; i < thing.length; i++) {
		switch (i){
			case 0:
					var j = Math.floor(Math.random() * names.length); 
					document.getElementById(thing[0]).setAttribute('value',names[j]);
			case 1:
					var j = Math.floor(Math.random() * 100); 
					document.getElementById(thing[1]).setAttribute('value',j);
					age = j;
			case 2:
					if (age>17) {
						var j = Math.floor(Math.random() * jobs.length); 
						document.getElementById(thing[2]).setAttribute('value',jobs[j]);
					}else{
						document.getElementById(thing[2]).setAttribute('value',"-");
					}
			case 3:
					var j = Math.floor(Math.random() * weaknesses.length); 
					document.getElementById(thing[3]).setAttribute('value',weaknesses[j]);
			case 4:
					var j = Math.floor(Math.random() * strength.length); 
					document.getElementById(thing[4]).setAttribute('value',strength[j]);
			case 5:
					var j = Math.floor(Math.random() * 100); 
					var v = document.getElementById(thing[5]).getAttribute('value');
					var tmp = document.getElementById("animarumid").getAttribute('value');
					document.getElementById("animarumid").setAttribute('value', parseInt(tmp)+parseInt(v));
					document.getElementById(thing[5]).setAttribute('value', j);
					

					var lvl = parseInt(document.getElementById("levelid").getAttribute('value'));
					if(tmp>1000*parseInt(lvl)){
							lvl = lvl +1;
							document.getElementById("levelid").setAttribute('value',lvl);
						}

					var jj = parseInt(document.getElementById("pop").getAttribute('v'));
					if (jj >8974047463) {
						if (j<jj) {
							document.getElementById("go").setAttribute('visible', "true");
							document.getElementById("p1").setAttribute('visible', "false");
							document.getElementById("p2").setAttribute('visible', "false");
						}else
						{
							document.getElementById("go").setAttribute('visible', "true");
							document.getElementById("go").setAttribute('value', "!! YOU WON !!");

							document.getElementById("p1").setAttribute('visible', "false");
							document.getElementById("p2").setAttribute('visible', "false");
						}
					}else
					{
						var j = Math.floor(Math.random() * 100);
						var tmp = parseInt(document.getElementById("pop").getAttribute('v'));
						var tmp2 = parseInt(j)+tmp;

						document.getElementById("pop").setAttribute('v', tmp2);
						document.getElementById("pop").setAttribute('text', "value:"+tmp2);
					}
		}
	}
}