"use strict"
console.log("ping is pong");

var point = 0;
var remainpoints = 0;
var firstround = true;

var pointtext1='<a-text value="';
var pointtext2='" color="#BBB" position="-20 0 0" scale="50 50 50" rotation="0 90 0"></a-text>';

//document.getElementById('OK').addEventListener('click',cls);

function cls(){
	//console.log("clsOK");
	/*if(ok == 0){
		document.getElementById('IntroText').value="Nice! Now on left of you are your points! Press OK again to start the game!";
		ok = 1;	
		console.log("ok: ", ok);
	}*/
	document.getElementById('intro').innerHTML = "";
	//document.getElementById('mapmenu').innerHTML = "";
	document.getElementById('Point').innerHTML = pointtext1 + "0" + pointtext2;
	
	setInterval(function(){game();},5500);
}

var shitHTML1 = '<a-sphere radius="3" position=" 0 0 0" color="brown"><a-animation attribute="position" to="';
var shitHTML2 = ' ';
var shitHTML3 = ' -40" fill="forwards" dur="5000"></a-animation></a-sphere>';
var x = 0;
var y = 0;

function game(){
	if(remainpoints < 15){
		shitsend();
	}else{
		document.getElementById('intro').innerHTML = '<a-text  id="IntroText" value="Sorry, now we faild because too many wreckage remained in our spaceship! Now we have to evacuate! Please take off the headset!" color="red" position="-2 3 -3" scale="1.5 1.5 1.5"></a-text>';
	}
}

function shitsend(){
	var isthere = false;
	var x1 = 0;
	while (!isthere)
	{
		x1 = Math.floor(Math.random()*15)+(-45) + Math.floor(Math.random()*50)+(-5);
		//console.log("    x1: ",x1);
		if((x1<x-20 || x1>x+20) && (x1>-46 && x1<16)){isthere = true; x = x1;}
	}

	isthere = false;
	while (!isthere)
	{
		x1 = Math.floor(Math.random()*40)+(-15);
		if(x1!=y){isthere = true; y = x1;}
	}
	//shitHtml();
	whereis();
}

function shitHtml1(){
	document.getElementById("shitball").innerHTML = shitHTML1 + x + shitHTML2 + y + shitHTML3;
	/*console.log("shithtml ok");
	console.log("    x: ", x);
	console.log("    y: ", y);*/
}

function shitHtml2(){
	document.getElementById("shitball").innerHTML = shitHTML1 + x + shitHTML2 + y + ' -30" fill="forwards" dur="5000"></a-animation></a-sphere>';
}

function whereis(){
	var done=false;
	if((x>-10 && x<-20) && (y<30 && y>20)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>0 && x<-10) && (y<10 && y>20)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-10 && x<10) && (y<10 && y>20)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-30 && x<-20) && (y<10 && y>0)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-40 && x<-30) && (y<20 && y>10)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-40 && x<-30) && (y<40 && y>30)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-10 && x<0) && (y<50 && y>40)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-10 && x<10) && (y<50 && y>40)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>0 && x<20) && (y<30 && y>20)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>0 && x<10) && (y<0 && y>-10)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((x>-10 && x<-20) && (y<0 && y>-10)) {pointIncAndShow(); shitHtml1(); done = true;}
	if((done == false) && (firstround == false)){shitHtml2(); setTimeout(showOldFaild,5000); remainpoints = remainpoints +1;}
	if(firstround == true){firstround = false;}
}

function showOldFaild() {
	document.getElementById("lostshits").innerHTML = document.getElementById("lostshits").innerHTML + '<a-sphere radius="3" position=" ' + x + ' ' + y + ' -30" color="brown"></a-sphere>'; 
}

function pointIncAndShow(){
	point = point + 1;
	document.getElementById('Point').innerHTML = pointtext1 + point + pointtext2;
}
