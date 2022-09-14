var Grid = {
    
    container : '.wrapper',
    
    $container : null,
    
    dataJson : null,
    
    arrayBox : [],
    
    arrayChecked : [],
    
    /**
     * Init the grid with data 
     */
    init : function (dataJson)
    {
        this.dataJson = dataJson;
        this.$container = document.querySelectorAll(this.container);
        this.generateBox();
    },
    
    /**
     * Generate grid made of boxes 
     */
    generateBox : function ()
    {
        var _this =this;
        this.arrayBox = [];
        this.arrayChecked = [];
        for (var i = 0; i < this.dataJson.length; i++) {
            _this.arrayChecked[i] = [];
            for (var j = 0; j < this.dataJson[i].length; j++) {
                _this.arrayChecked[i][j] = 0;
                var box = new Box(this.$container, this.dataJson[i][j].term, this.dataJson[i][j].id, { i : i, j : j });
                this.arrayBox.push(box);
                
                box.create();
                
                box.$el.addEventListener('BOX_SELECTED', function (e) // Listen for Box select event
                {
                    _this.checkForVictory(e.target.position);
                });
            }
        };
    },
    
    /**
     * Generate grid made of boxes 
     */
    removeBox: function() {
        var _this = this;
        
        for (var i = 0; i < _this.arrayBox.length; i++) {
            _this.arrayBox[i].destroy();
            _this.arrayBox[i].$el.removeEventListener('BOX_SELECTED');
        }
    },
    
    /**
     * Will loop through two dimentionnal array to check horizontally, vertically, diagonally
     * @param {Object} position, with two value -> i & j
     */
    checkForVictory : function (position)
    {
        this.arrayChecked[position.i][position.j] = 1;
        
         var counter = 0, i, j;
        
        /* CHECK HORIZONTALLY */
        for (i = 0; i < this.arrayChecked.length; i++) {
            for (j = 0; j < this.arrayChecked[i].length; j++) {
                counter += this.arrayChecked[i][j];
            };
            if(counter === this.arrayChecked.length) {
                this.victory();
                break;
                return;
            }
            counter = 0;
        };
        
        /* CHECK VERTICALY */
        counter = 0;
        for (i = 0; i < this.arrayChecked[0].length; i++) {
            for (j = 0; j < this.arrayChecked.length; j++) {
                counter += this.arrayChecked[j][i];
            };
            if(counter === this.arrayChecked[0].length) {
                this.victory();
                break;
                return;
            }
            counter = 0;
        };
        
        /* CHECK DIAGONAL LEFT TO RIGHT */
        counter = 0;
        for (i = 0; i < this.arrayChecked.length; i++) {
            counter += this.arrayChecked[i][i];
            if(counter === this.arrayChecked.length) {
                this.victory();
                break;
                return;
            }
        };
        
        /* CHECK DIAGONAL RIGHT TO LEFT */
        counter = 0;
        j = 0;
        for (i = (this.arrayChecked.length - 1); i >= 0; i--) {
            counter += this.arrayChecked[i][j++];
            if(counter === this.arrayChecked.length) {
                this.victory();
                break;
                return;
            }
        };
    },
    
    /**
     * Generate grid made of boxes 
     */
    victory : function ()
    {
        //setTimeout( function() {
            
            event = document.createEvent("HTMLEvents");
            event.initEvent("VICTORY", true, true);
            window.dispatchEvent(event);
        //}, 600);
    }
    
};
