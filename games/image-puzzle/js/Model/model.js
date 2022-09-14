/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
;(function(w,s){

	s.m.emptyTile = "tile33";
	s.m.tileSize = 125;

	s.m.emptyRef = {"x" : 1 , "y" : 0};
	s.m.state =	[["tile11","tile02","tile21","tile32"],
	               ["tile33","tile13","tile12","tile30"],
	               ["tile31","tile10","tile23","tile03"],
	               ["tile22","tile20","tile01","tile00"]];
	
	s.m.solution = [["tile00","tile01","tile02","tile03"],
		               ["tile10","tile11","tile12","tile13"],
		               ["tile20","tile21","tile22","tile23"],
		               ["tile30","tile31","tile32","tile33"]];
	
	s.m.timeElapsed = 0; // Time in seconds
	
})(window,slider);