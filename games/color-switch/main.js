document.onreadystatechange = function(){
if(true)
{
	
	var game_ele =  Game();
	var ring = game_ele['ring'];
	var hero = game_ele['hero'];
	var score = game_ele['score'];
	var speed = game_ele['speed'];
	var game = game_ele['game'];
	var colors = ["yellow","red","blue","green"];
	var checks = false;
	var signal=false;//for hit enter to start the game
	var speed_signal = false;
	var start =false;

	var x=document.getElementById("countdown");//for ready steady go
	ring.draw();
	hero.draw(speed.spd);


	//keeps track of spacebar hit
	var $body = document.body;
	$body.onkeypress = function(key){
	  
	};



	$body.onkeydown = function(key){
	   	if(key.which===98){
		speed.spd++;
		
		}
	};




	$body.onkeydown = function(key){
	   	if(key.which===104){
		speed.spd--;
		}
	};


	$body.onkeydown = function(key){
	   	if(key.which===27){
		if(signal)
			signal=false;
		else
			signal=true;
		}
	};




	//keeps track of enter hit (also for countdown)




	$body.onkeypress = function(key){
		    
		    if(key.which===32){
				hero.sense = -hero.sense;
				if(game.start == true)
				check(hero.curr_track_col);
				score.val++;
			}
		    
			if(key.which===13 && game.level != null){
				document.getElementById("start").style.display = "none";
				document.getElementById("Rules").style.display = "none";
				document.getElementById("myCanvas").style.display = "block";

				setTimeout(function(){ x.innerHTML="READY" }, 0);
		     	setTimeout(function(){ x.innerHTML="STEADY",x.style.color="#F9F908" }, 1000);
	    		setTimeout(function(){ x.innerHTML="GO",x.style.color="#23D62B" }, 2000);
	    		setTimeout(function(){ x.style.display="none"}, 3000);
	    		setTimeout(function(){ document.getElementById("score").style.display="block"}, 3000);
	    		setTimeout(function(){ signal=true; }, 3000);
	    		setTimeout(function(){ speed_signal=true; }, 3000);
	    		game.start = true;

			}
		};


	//repeatOften function---------------------------------------------------------------

	function repeatOften(){
		if(signal) {
			difference = ((simplify_angle(simplify_angle(hero.theta)-simplify_angle(ring.st_point))));
			hero.curr_track_col = cal_col(difference);
			if(hero.color == hero.curr_track_col)
				checks = true;

			if(checks==true){
			
				
				if(lost(hero.curr_track_col)){
				
					alert('lost');

					restart();
				}	
			}

			hero.move();
			ring.move(multiplier);
		    ctx.clearRect(0,0,600,600);}

		    if(speed_signal){
		    ctx.clearRect(400,0,200,60);
				speed.draw();
								}


			if (signal){

		    ring.draw();
		    hero.draw();
			score.draw();


			flag++;
			if(flag>160){
				flag=0;
				sign=-sign;
			}
		}
		requestAnimationFrame(repeatOften);

	}

		repeatOften();

	//--------------------------------------------------------------------------------


	function check(col) { 

		if(hero.color != col){
			game.start = false;
			alert("lost");
			restart();
		}
	  
		else{
			var randi=Math.floor(Math.random()*4)%4;
			if(hero.color==colors[randi])
				randi=(randi+1)%4;
			
			hero.color=colors[randi];
			goal_col = hero.color;
			checks = false;
		}

	}

	function simplify_angle(theta) {
		if(theta<0)
		{
		theta = theta*-1;
		theta = theta%( 2*Math.PI);
		theta = 2*Math.PI - theta;
		}
		else
		{
			theta = theta % (2*Math.PI);
		}
		return theta;
	}

	function lost(col) {    

	   if(col != hero.color)
	   	{
	   		checks=false;
	   		return true;
	   	}	
	   else
			return false;
	   
		
	}

	function restart(){

	    location.reload();
	}
	function cal_col(theta_diff) {
		col = (Math.floor(((2*theta_diff)/Math.PI)))%4;
		return colors[col];

	}	

	window.prepare_level = function(ele) {
		var	 level = ele.value;
		game.set_level(level);
		game.level = level;
		
	}

}
}
