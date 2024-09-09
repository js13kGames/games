
// Controller between graphengine (View) and mapmodel (Model)

function MapController( boardModel ) {
	this.board = boardModel;
	
	this.addElement = function(element, x, y) {
		this.board.activeBoard[x][y] = element;
	}


	this.checkValid = function ( x, y, element ) {
		square_type = this.board.activeBoard[x][y];
		//block elements have b as first character. Need to be removed before comparison.
		if( this.checkAdjacentSquares(x, y, element) ){
			if( (square_type === undefined && x > -1 && y > -1) || square_type == "optional" || square_type == element.substr(2)){
				return true;
			} else {
				if(square_type !== undefined && square_type.substr(0,2) == "b_"){
					graph.printFeedBack("Can't put a block on top of another block!");
				} else if(square_type == "blank"){
					graph.printFeedBack("Blank squares must be left empty!");
				}	else if(square_type !== undefined && square_type != element.substr(0,2) && square_type != "disabled"){
					graph.printFeedBack("Cannot put "+ element.substr(2) +" on square requiring "+ square_type +"!");
				}	else{
					graph.printFeedBack("Block must be completely inside game area!");
				}
				return false;
			}
		}
		else{
			return false;
		}
	}
	this.checkAdjacentSquares = function ( x, y, element){
			adjacent_square_types = [];
		
			//find all adjacent elements to this square
			if( x != 0 ){
				adjacent_square_types.push(this.board.activeBoard[x-1][y]);
			}
			if( this.board.activeBoard.length > x+1 ){
				adjacent_square_types.push(this.board.activeBoard[x+1][y]);
			}
			if( y != 0 ){
				adjacent_square_types.push(this.board.activeBoard[x][y-1]);
			}
			if( this.board.activeBoard[x].length > y+1 ){
				adjacent_square_types.push(this.board.activeBoard[x][y+1]);
			}
			//remove type undefined elements
			adjacent_square_types = adjacent_square_types.filter(function(n){ return n != undefined });
			
			adjacent_ok = true;
			switch (element) {
				case 'b_fire' :
					if(adjacent_square_types.indexOf("water") > -1 || adjacent_square_types.indexOf("b_water") > -1){
						graph.printFeedBack("fire can't be next to water!");
						adjacent_ok = false;
					}
					else if(adjacent_square_types.indexOf("earth") > -1 || adjacent_square_types.indexOf("b_earth") > -1){
						graph.printFeedBack("fire can't be next to earth!");
						adjacent_ok = false;
					}
					break;
				case 'b_water' :
					if(adjacent_square_types.indexOf("fire") > -1 || adjacent_square_types.indexOf("b_fire") > -1){
						graph.printFeedBack("water can't be next to fire!");
						adjacent_ok = false;
					}
					else if(adjacent_square_types.indexOf("earth") > -1 || adjacent_square_types.indexOf("b_earth") > -1){
						graph.printFeedBack("water can't be next to earth!");
						adjacent_ok = false;
					}
					break;
				case 'b_earth' :
					if(adjacent_square_types.indexOf("water") > -1 || adjacent_square_types.indexOf("b_water") > -1){
						graph.printFeedBack("earth can't be next to water!");
						adjacent_ok = false;
					}
					else if(adjacent_square_types.indexOf("fire") > -1 || adjacent_square_types.indexOf("b_fire") > -1){
						graph.printFeedBack("earth can't be next to fire!");
						adjacent_ok = false;
					}
					break;
				default :
					break;
			}
			return adjacent_ok;
			
	}
	
	this.checkSuccess = function ( ){
		var x_max = this.board.size.x;
		var y_max = this.board.size.y;
		var elements = ["fire","water","air","earth"];
		var success = true;

		for ( y = 0; y < y_max; y++ ){
			for ( x = 0; x < x_max; x++ ){
				var square_type = this.board.activeBoard[x][y];
				if (square_type === undefined || elements.indexOf(square_type) > -1 ){
					success = false;
				}
			}
		}
		
		if ( success && map.lookup[parseInt(map.id)+1] !== undefined) {
			// Show next button
			var nextBtn = document.getElementById("NextLevelBtn");
			nextBtn.style.visibility = "visible";
		}
		else if(success){
			graph.printFeedBack("No more levels. Congratulations! You have passed all levels! ")
		}
		return success;
 	}
	
	this.addBlockToModel = function( element, x1, y1, x2, y2, x3, y3, x4, y4 )  {
		// Check that block can be placed 
		if (  this.checkValid(x1, y1, element)  &&
			this.checkValid(x2, y2, element)  &&
			this.checkValid(x3, y3, element) &&
			this.checkValid(x4, y4, element)) {
			this.board.activeBoard[x1][y1] = element;
			this.board.activeBoard[x2][y2] = element;
			this.board.activeBoard[x3][y3] = element;
			this.board.activeBoard[x4][y4] = element;
			return true;
		}
		return false;
	}
	
	this.addBlock = function(  element, type, x, y, orientation, flipped )  {
		var result = false;
		
		switch ( type ) {
			case 's':
				if ( !flipped ) {
					if ( orientation == 0 || orientation == 2 ) {
						result = this.addBlockToModel( element, x, y, x + 1, y, x + 1, y + 1, x + 2, y + 1 );
					} else {
						result = this.addBlockToModel( element, x + 1, y, x, y + 1, x + 1, y + 1, x, y + 2 );
					}
				} else {
					if ( orientation == 0 || orientation == 2 ) {
						result = this.addBlockToModel( element, x, y + 1, x + 1, y, x + 1, y + 1, x + 2, y );
					} else {
						result = this.addBlockToModel( element, x, y, x, y + 1, x + 1, y + 1, x + 1, y + 2 );
					}
				}
				break;
			case 'sq':
				result = this.addBlockToModel( element, x, y, x + 1, y, x , y  + 1, x + 1, y + 1 );
				break;
			case 'l':
				if ( !flipped ) {
					switch ( orientation ) {
						case 0:
							result = this.addBlockToModel( element, x, y, x + 1, y, x + 2, y, x, y + 1 );
							break;
						case 1:
							result = this.addBlockToModel( element, x, y, x + 1, y, x + 1, y + 1, x + 1, y + 2 );
							break;
						case 2:
							result = this.addBlockToModel( element, x, y + 1, x + 1, y + 1, x + 2, y + 1, x + 2, y );
							break;
						case 3:
							result = this.addBlockToModel( element, x, y, x, y + 1, x, y + 2, x + 1, y + 2 );
							break;
					}
				} else {
					if ( orientation == 0 || orientation == 2 ) {
						if ( orientation == 0 ) {
							result = this.addBlockToModel(  element, x, y, x, y + 1, x + 1, y + 1, x + 2, y + 1 );
						} else {
							result = this.addBlockToModel(  element, x, y, x + 1, y, x + 2, y, x + 2, y + 1 );
						}
					} else {
						if ( orientation == 1 ) {
							result = this.addBlockToModel(  element, x, y + 2, x + 1, y, x + 1, y + 1, x + 1, y + 2 );
						} else {
							result = this.addBlockToModel(  element, x, y, x + 1, y, x, y + 1, x, y + 2 );
						}
					}					
				}
				break;
			case 't':
				if ( orientation == 0 || orientation == 2 ) {
					if (  orientation == 0 ) {
						result = this.addBlockToModel( element, x, y, x + 1, y, x + 2, y, x + 1, y + 1 );
					} else {
						result = this.addBlockToModel( element, x, y + 1, x + 1, y + 1, x + 2, y + 1, x + 1, y );
					}
				} else {
					if ( orientation == 1 ) {
						result = this.addBlockToModel( element, x + 1, y, x + 1, y + 1, x + 1, y + 2, x, y + 1 );
					} else {
						result = this.addBlockToModel( element, x, y, x, y + 1, x, y + 2, x + 1, y + 1 );
					}
				}
				break;
			case 'i':
				if ( orientation == 0 || orientation == 2 ) {
					result = this.addBlockToModel( element, x, y, x + 1, y, x + 2, y, x + 3, y );
				} else {
					result = this.addBlockToModel( element, x, y, x , y + 1, x, y + 2, x, y + 3 );
				}
				break;
		}
		
		// remove added block from map model's available blocks
		if ( result ) {
			this.board.blocks[element][type]--;
		};
		return result;
	}
}

