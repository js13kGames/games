//Model object of the game map. Initialized by reading from json from text file.
function MapModel( canvas ) {
	
	this.lookup = {};
	this.pointsMultiplier = 0;
	this.disabled_squares = 0;
	this.no_multiplier;
	this.no_timer;
	
	// Initialization function
	this.init = function( id ) {
		for (var i = 0, len = jsonstr.length; i < len; i++) {
			this.lookup[jsonstr[i].id] = jsonstr[i]; 
		}
		
		// Load current data
		this.id = id;
		this.name = this.lookup[id].name;
		this.specials = this.lookup[id].special_squares;
		this.size = this.lookup[id].size;
		this.blocks = this.lookup[id].blocks;
		this.no_multiplier = this.lookup[id].no_multiplier || ["disabled"]
		this.no_timer = this.lookup[id].no_timer || ["disabled"]
		
		// Init board & data
		this.activeBoard = new Array( this.size.x );
		for ( var i = 0; i < this.size.x; i++ ) {
			this.activeBoard[i] = new Array( this.size.y );
		}
		this.initBoard();
		this.countDisabled();
		
	}
	
	this.initBoard = function() {
		for ( var element in this.specials ) {
			for ( var block in this.specials[ element ] ) {
				var position = (this.specials[ element ])[ block ].split(",") ;
				var xArr = [parseInt(position[0]),parseInt(position[2]) || parseInt(position[0])].sort(sortNumber);
				var yArr = [parseInt(position[1]),parseInt(position[3]) || parseInt(position[1])].sort(sortNumber);
				
				if(xArr[ 0 ] == xArr[ 1 ]){
					x = xArr[0];
					for(y = yArr[ 0 ]; y <= yArr[ 1 ]; y++){
						this.activeBoard[ x ][ y ] = element;
						this.countMultiplier(element);
					}
				}
				else if(yArr[ 0 ] == yArr[ 1 ]){
					y = yArr[0];
					for(x = xArr[ 0 ]; x <= xArr[ 1 ]; x++){
						this.activeBoard[ x ][ y ] = element;
						this.countMultiplier(element);
					}
				}
				else{
					for(x = xArr[ 0 ]; x <= xArr[ 1 ]; x++){
						for(y = yArr[ 0 ]; y <= yArr[ 1 ]; y++){
							this.activeBoard[ x ][ y ] = element;
							this.countMultiplier(element);

						}
					}
				}
			}
		}
	}

	
	function sortNumber(a,b) {
		return a - b;
	}
	this.countMultiplier = function( element ) {
		if(element == 'optional'){
			this.pointsMultiplier--;
		}
		else if(element == "disabled" || this.no_multiplier.indexOf(element) > -1){
		
		}
		else{
			this.pointsMultiplier++;
		}
	}
	
	this.countDisabled = function( ) {
	
		for( var row in this.activeBoard ) {
			for ( var column = 0; column < this.activeBoard[row].length; column++ ) {
				element = this.activeBoard[row][column];
				if( element == 'disabled' || this.no_timer.indexOf(element) > -1){
					this.disabled_squares++;
				}
			}
		}
	
		
	}
}
