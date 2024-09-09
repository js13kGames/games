
var game_system;
var lines_list = document.getElementById("lines_handler");
var loop;
var click_count = 0;
var data_count=0;
var data_limit = 50;
var x1=0,y1=0,x2=0,y2 = 0;
var x0,y0;
var data_saved = [];
var prev_tag ;

var sc_temp = 0;
var score=0;
var time_left = 60;
var data_list = [ "C","C++","C#","Js","Css","Php","Java","SQL","Pytn","Ruby","Apk","Ios","Asp",".Net","Htm"];
var data_colors = [ "tomato","orange","purple","mediumseagreen","yellowgreen","dodgerblue","violet","cyan","green","salmon","chartreuse","lightskyblue","wheat","brown","lightseagreen"];

function value_reset(){
var lines_list = document.createElement("div");
lines_list.setAttribute("id","lines_handler");
game_system.appendChild(lines_list);
click_count = 0;
data_count=0;
data_limit = 50;
x1=0,y1=0,x2=0,y2 = 0;
data_saved = [];
sc_temp = 0;
score=0;
time_left = 60;
document.getElementById("score").innerHTML = "Score :</br>"+score;
document.getElementById("time_left").innerHTML = "Time Left :</br>" + time_left;
}
function create_data (){
	if(time_left == 0){
		clearInterval(loop);
		game_panel_show();
	}
	document.getElementById("time_left").innerHTML = "Time Left :</br>" + time_left;
	time_left--;
	
	if (data_count == data_limit)
		return;
		
	game_system = document.getElementById("gameplay");
	
	var data_unit = document.createElement("div");
	data_unit.setAttribute("class","data");
	var r = Math.floor(Math.random()* 15);
	data_unit.innerHTML = data_list[r];
	data_unit.style.background = data_colors[r];
	data_unit.style.left = Math.floor(Math.random()* (screen.width-100))+"px";
	data_unit.style.top = Math.floor(Math.random()* (screen.height-250))+"px";
	data_unit.setAttribute("id",data_count);
	data_unit.setAttribute("onclick","create_connect_line("+data_count+")");
	game_system.appendChild(data_unit);
	data_count++;
}

function create_connect_line(id){
	var d = document.getElementById(id);
	if(prev_tag == d.innerHTML){
	if(click_count == 0 ){
		x1 = parseInt(d.style.left);
		y1 = parseInt(d.style.top);
		x2=0;
		y2=0;
		x0=x1;
		y0=y1;
		data_saved = [];
		//alert(x1+","+y1);
		click_count++;
		prev_tag = d.innerHTML;
		data_saved.push(id);
	}else {
		if(x2 == 0 && y2 == 0){
			
		}
		else{
			x1=x2;
			y1=y2;
		}
		x2 = parseInt(d.style.left);
		y2 = parseInt(d.style.top);
		click_count++;
		if(x1==x2 || y1 == y2 ){
			click_count = 1;
		}else{
				
				data_saved.push(id);
				var line = document.createElement("div");
				line.setAttribute("class","connect");
				var dis = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
				var x_mid = (x1+x2)/2;
				var y_mid = (y1+y2)/2;
	
				var Angle_in_rad = Math.atan2(y1-y2,x1-x2);
				var Angle_in_deg = (Angle_in_rad * 180)/Math.PI;
	line.style.width = dis+"px";
	line.style.top = y_mid + 20+"px";
	line.style.left = x_mid +20 - dis/2 +"px";
	line.style.transform = "rotate("+Angle_in_deg+"deg)";
	lines_handler.appendChild(line);
	if(x0 == x2 && y0 == y2){
	setTimeout(function clear_off_data(){
		while(lines_handler.firstChild){
			lines_handler.removeChild(lines_handler.firstChild);
		}
		click_count= 0;
		data_saved.forEach(function delete_data(item,index){
		try{
			game_system.removeChild(document.getElementById(item));
			data_limit++;
			sc_temp++;
			}catch{
			}
		});
		score+= sc_temp;
		time_left += sc_temp * 3;
		sc_temp = 0;
		document.getElementById("score").innerHTML = "Score :</br>"+score;
		document.getElementById("time_left").innerHTML = "Time Left :</br>" + time_left;
		time_left--;
		data_saved = [];
		} , 100);
	}
		}
	}
	}else{
		x1 = parseInt(d.style.left);
		y1 = parseInt(d.style.top);
		x0 = x1;
		y0 = y1;
		y2 = 0;
		x2 = 0;
		click_count=1;
		prev_tag = d.innerHTML;
		while(lines_handler.firstChild){
		lines_handler.removeChild(lines_handler.firstChild);
		
	}
	data_saved = [];
	}
	

}
function start_game () {
		loop=setInterval(create_data,500);
		var start_menu = document.getElementById("start_menu");
		start_menu.style.display = "none";
}
function rules_hide(){
	 var panel = document.getElementById("rulespanel");
	 panel.style.display = "none";
}

function rules_show(){
	 var panel = document.getElementById("rulespanel");
	 panel.style.display = "block";
}

function game_panel_show(){
	var main = document.getElementById("main_panel");
	main.style.display = "block";
	document.getElementById("p_score").innerHTML="YOU SCORed: "+score;
}

function try_again(){
	while(lines_handler.firstChild){
		lines_handler.removeChild(lines_handler.firstChild);
	}
	while(game_system.firstChild){
		game_system.removeChild(game_system.firstChild);
	}
	var main = document.getElementById("main_panel");
	main.style.display = "none";
	value_reset();
	start_game();
}