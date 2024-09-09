var x = 10,y = 10;

var bx = 0 , by = 0;

var rot = 0;

var left_temp = 110 ,top_temp = 50;

var ball_dir = 0;

var obj , ball_c , a , ball;

var mov_rot = false;

var loop;

var game_over = false;

var c ;

var dir_change = true;

var n = 0;

var rot_toggle = 1;

var speed = 20;

var rot_speed = 1;

var rot_counter = 0;

var count_system = 50;

var ignore = false;

function reset_values(){
	x = 10;
	y = 10;
	bx = 0 
	by = 0;
	rot = 0;
	left_temp = 110 ;
	top_temp = 50;
	ball_dir = 0;
	mov_rot = false;
	game_over = false;
	dir_change = true;
	rot_toggle = 1;
	speed = 20;
	rot_speed = 1;
	rot_counter = 0;
	count_system = 70;
	ignore = false;
	document.getElementById("angleShow").innerHTML = rot_counter;
}


function create_system(){

	obj = document.getElementById("system");
	ball = document.createElement("div");
	ball.setAttribute("class","ball_handler");
	ball_c = document.createElement("div");
	ball_c.setAttribute("class","ball");
	ball.appendChild(ball_c);
	ball.style.top = top_temp +"px";
	ball.style.left = left_temp +"px";
	ball.style.zIndex = "2";
	obj.appendChild(ball);
	
	
	create_circle(0);
	
	for (var i = 1; i<= count_system; i++){
		var k = Math.floor(Math.random()* 4);
		create_circle(k);
	}
	
	create_circle(0);
	obj.lastChild.style.background = "orange";
	obj.lastChild.style.backgroundImage = "url('ring.png')";
}

function create_circle(p1){
	if ( p1 == 0  && x < 1200){
		//right_side
		create_line(0);
		var c1 = document.createElement("div");
		c1.setAttribute("class","loader1");
		c1.style.top = y+"px";
		c1.style.left = x + "px";
		obj.appendChild(c1);
	}
	else if  ( p1 == 1 && y < 400){
		//Down_side
		create_line(1);
		var c1 = document.createElement("div");
		c1.setAttribute("class","loader1");
		c1.style.top = y+"px";
		c1.style.left = x + "px";
		obj.appendChild(c1);
	}
	else if ( p1 == 2  && x > 200){
		//left_side
		create_line(2);
		var c1 = document.createElement("div");
		c1.setAttribute("class","loader1");
		c1.style.top = y+"px";
		c1.style.left = x + "px";
		obj.appendChild(c1);
	}
	else if ( p1 == 3 && y > 200){
		//top_side
		create_line(3);
		var c1 = document.createElement("div");
		c1.setAttribute("class","loader1");
		c1.style.top = y+"px";
		c1.style.left = x + "px";
		obj.appendChild(c1);
	}
}

function create_line(p2){
	if( p2 ==0){
		//Right_side
		x+=100;
		y+= 40;
		var la1 = document.createElement("div");
		la1.setAttribute("class","connector2");
		la1.style.top = y+"px";
		la1.style.left = x+"px";
		x+= 100;
		y-= 40;
		obj.appendChild(la1);
	}
	else if ( p2 == 1){
		//Down_side
		y += 100;
		x+= 40;
		var la1 = document.createElement("div");
		la1.setAttribute("class","connector1");
		la1.style.top = y+"px";
		la1.style.left = x+"px";
		x -= 40;
		y += 100;
		obj.appendChild(la1);
	}
	else if ( p2 == 2){
		//Left_side
		x -= 100;
		y += 40;
		var la1 = document.createElement("div");
		la1.setAttribute("class","connector2");
		la1.style.top = y+"px";
		la1.style.left = x+"px";
		y -= 40;
		x -= 100;
		obj.appendChild(la1);
	}
	else if ( p2 == 3){
		//top_side
		y -= 100;
		x += 40;
		var la1 = document.createElement("div");
		la1.setAttribute("class","connector1");
		la1.style.top = y+"px";
		la1.style.left = x+"px";
		x -= 40;
		y -= 100;
		obj.appendChild(la1);
	}
	
}

function Ball_motion (){
	c = obj.children;
	var m = 0;
	if(ball.style.top == c[c.length-1].style.top && ball.style.left == c[c.length-1].style.left ){
		game_panel_show_win();
		game_over = true;
		rot_counter = 0;
	}
	else if(parseInt(ball.style.top) == parseInt(c[c.length-1].style.top)+40 && parseInt(ball.style.left) == parseInt(c[c.length-1].style.left) ){
		game_panel_show_win();
		game_over = true;
		rot_counter = 0;
	}
	if( dir_change && !game_over){
		for(m = 1 , n  = 0 ; m < c.length; m++){
			if( m%2 != 0){
			
				if( ball.style.top == c[m].style.top && ball.style.left  == c[m].style.left ){
				//right
					n=1;
				}
				else if( ball.style.top == c[m].style.top && parseInt(ball.style.left) == parseInt(c[m].style.left) + 100 ){
				//left
					n = 1;
				}
				else if( parseInt(ball.style.top) + 15  == parseInt(c[m].style.top) && ball.style.left == c[m].style.left ){
				//down
					n=1;
				}
				else if( parseInt(ball.style.top) - 95  == parseInt(c[m].style.top) && ball.style.left == c[m].style.left ){
				//top
					n=1;
				}
				else{
					//game_over = true;
				}
			}
		}
	}
	
	if(n > 0){
		//game_over = false;
		dir_change = false;
	}else{
		//game_over = true;
		dir_change =  true;
	}
	
	if(!mov_rot && !game_over && !ignore){
		if(ball_dir == 0){
			ball.style.transform = "translate("+bx+"px,"+by+"px)";
			left_temp++;
			//ball.style.left = left_temp + "px";
			bx++;
		}
		else if( ball_dir == 1){
			ball.style.transform = "translate("+bx+"px,"+by+"px)";
			top_temp++;
			//ball.style.top = top_temp + "px";
			by++;
		}
		else if( ball_dir == 2){
			ball.style.transform = "translate("+bx+"px,"+by+"px)";
			left_temp--;
			//ball.style.left = left_temp  + "px";
			bx--;
		}
		else if( ball_dir == 3){
			ball.style.transform = "translate("+bx+"px,"+by+"px)";
			top_temp--;
			//ball.style.top = top_temp  + "px";
			by--;
		}
		
	}
	else { // else if(!game_over)
		if(rot_toggle == 0){
		if(rot > 360){ rot = rot - 360;}
			ball.style.transform = "rotate("+ rot + "deg)";
			rot += rot_speed;
			rot_counter += rot_speed;
			//rot_toggle = 1;
		}
		else if(rot_toggle == 1){
			if(rot < 0){ rot = 360 + rot;}
			ball.style.transform = "rotate("+ rot + "deg)";
			rot -= rot_speed;
			rot_counter += rot_speed;
			//rot_toggle = 0;
		}
		if(rot > 360){
			rot = rot-360;
		}
		else if(rot < 0){
			rot = rot+360;
		}
		document.getElementById("angleShow").innerHTML = rot_counter;
		if(rot_counter > 360){
			game_over = true;
			rot_counter = rot_counter - 360;
			game_panel_show();
		}
	}
	if(!ignore){
	if( bx == 100){
		//left_temp += bx ;
		ball.style.left = left_temp+"px";
		bx = 0;
		rot=0;
		mov_rot = true;
		rot_toggle++;
		if(rot_toggle > 1){
			rot_toggle = 0;
		}
		rot_counter = 0;
		rot_speed += 1;
	}
	if( by == 100){
		top_temp += by - 45;
		left_temp += -40;
		ball.style.left = left_temp +"px";
		ball.style.top = top_temp +"px";
		by = 0;
		mov_rot = true;
		rot= 90;
		rot_toggle++;
		if(rot_toggle > 1){
			rot_toggle = 0;
		}
		rot_speed += 1;
		rot_counter = 0;
	}
	
	if( bx == -100){
		left_temp += bx ;
		//top_temp += 2;
		ball.style.left = left_temp + "px";
		//ball.style.top = top_temp +"px";
		bx = 0;
		mov_rot = true;
		rot = 180;
		rot_toggle++;
		if(rot_toggle > 1){
			rot_toggle = 0;
		}
		rot_counter = 0;
		rot_speed += 1;
	}
	if( by == -100){
		top_temp += by + 45;
		left_temp += -40;
		ball.style.left = left_temp +"px";
		ball.style.top = top_temp +"px";
		by = 0;
		mov_rot = true;
		rot= 270;
		rot_toggle++;
		if(rot_toggle > 1){
			rot_toggle = 0;
		}
		rot_counter = 0;
		rot_speed += 1;
	}
	}
	
}

function start_loop(){
	//c = obj.children;
	if(!game_over){
		loop = setInterval ( Ball_motion , speed);
		//skip_step =false;
	}
}

function on_click_ball_motion(){
c= obj.children;
if(mov_rot && !ignore ){
if( rot < 0 ){rot = 360 + rot;}	
	if( rot > 135 && rot <= 225){
	//alert(ball.style.top+","+ball.style.left);
	var m= 0;
			for( m = 1  ;  m < c.length; m++){
				if( parseInt(ball.style.top)  == parseInt(c[m].style.top) && parseInt(ball.style.left) +100 == parseInt(c[m].style.left) ){
					left_temp += 100;
		//top_temp += 2;
		ball.style.left = left_temp +"px";
		//ball.style.top = top_temp +"px";
		rot = 0;
		mov_rot = false;
		ball_dir = 0;
		dir_change = true;
		break;
				}
		}
		//right
	}
	else if( rot > 225 && rot <= 315 ){
		//down
		for(m = 1  ;  m < c.length; m++){
			
				if( parseInt(ball.style.top) + 60 == parseInt(c[m].style.top) && parseInt(ball.style.left)+40  == parseInt(c[m].style.left) ){
		top_temp += 45;
		left_temp += 40;
		ball.style.top = top_temp +"px";
		ball.style.left = left_temp +"px";
		rot = 0;
		mov_rot = false;
		ball_dir =1;
		dir_change = true;
		break;
		}
		}
	}
	else if( rot > 315 || rot <= 45 ){
		//left
		//top_temp += 2;
		//left_temp -= 40;
		//ball.style.top = top_temp +"px";
		//ball.style.left = left_temp +"px";
		
		for(m = 1  ; m < c.length; m++){
		if( parseInt(ball.style.top)  == parseInt(c[m].style.top) && parseInt(ball.style.left) -100  == parseInt(c[m].style.left) ){
		rot = 0;
		mov_rot = false;
		ball_dir =2;
		dir_change = true;
		break;
		}
		}
	}else if( rot > 45 && rot <= 135 ){
		//top
		for(m = 1  ;  m < c.length; m++){
				if( parseInt(ball.style.top) -140 == parseInt(c[m].style.top) && parseInt(ball.style.left)+40   == parseInt(c[m].style.left) ){
		top_temp -= 45;
		left_temp += 40;
		ball.style.top = top_temp +"px";
		ball.style.left = left_temp +"px";
		rot = 0;
		mov_rot = false;
		ball_dir =3;
		dir_change = true;
		break;
		}
		}
	}
	else{
	}
}
}

function rules_hide(){
	 var panel = document.getElementById("rulespanel");
	 panel.style.display = "none";
}

function rules_show(){
	 var panel = document.getElementById("rulespanel");
	 panel.style.display = "block";
}

function start_game(){
	var start_menu = document.getElementById("menu");
	start_menu.style.display = "none";
	start_loop();
}

function game_panel_show(){
	var main = document.getElementById("main_panel_lost");
	main.style.display = "block";
}

function try_again(){
	var main = document.getElementById("main_panel_lost");
	main.style.display = "none";
	clearInterval(loop);
	reset_values();
	while(obj.firstChild){
		obj.removeChild(obj.firstChild);
	}
	create_system();
	start_loop();
}

function game_panel_show_win(){
	var main = document.getElementById("main_panel_win");
	main.style.display = "block";
}

function next_lvl(){
	var main = document.getElementById("main_panel_win");
	main.style.display = "none";
	clearInterval(loop);
	reset_values();
	while(obj.firstChild){
		obj.removeChild(obj.firstChild);
	}
	create_system();
	start_loop();
}





window.onload = create_system;