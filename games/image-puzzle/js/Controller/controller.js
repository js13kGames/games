/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){
	
	s.c.sliderSize = 4;
	
	s.c.isMovelLegal = function(x, y){
		var retValue = {"isLegal" : false};
		if(s.m.emptyRef["x"]===x && s.m.emptyRef["y"]!==y){
			retValue = {"isLegal" : true , "direction" : "y" , "displacement" : s.m.emptyRef["y"]-y};
		}else if(s.m.emptyRef["y"]===y && s.m.emptyRef["x"]!==x){
			retValue = {"isLegal" : true , "direction" : "x" , "displacement" : s.m.emptyRef["x"]-x};
		}
		return retValue;
	};
	
	s.c.swap = function(source, direction , displacement){
		var noOfIterations,previousEmptyRef;
		noOfIterations = (displacement<0) ? displacement * -1  : displacement;
		previousEmptyRef = {"x" : s.m.emptyRef["x"] , "y" : s.m.emptyRef["y"]};
			
		for(var i = 0 , x = tempx = s.m.emptyRef["x"] , y = tempy = s.m.emptyRef["y"] ; i <= noOfIterations ; i++){
			s.m.state[tempx][tempy] = s.m.state[x][y];
			tempx = x;
			tempy = y;
			if(direction==="y"){
				y = (displacement<0) ? y +1  : y -1; 
			}else{
				x = (displacement<0) ? x +1  : x -1;
			}
		}
		// Updating game state in model
		s.m.emptyRef["x"] = source["x"];
		s.m.emptyRef["y"] = source["y"];
		s.m.state[source["x"]][source["y"]] = s.m.emptyTile;
		
		// Swap the tiles in the UI
		s.v.puzzle.swapTiles(previousEmptyRef ,direction , displacement);
	
		(s.m.state.join()===s.m.solution.join()) && alert("Great!! You won the game and the elapsed time is "+s.timerDiv.innerHTML);
		
	};
	
	
})(window,slider);