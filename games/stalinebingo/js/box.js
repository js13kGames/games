;(function ()
{
    /**
     * 
     */
    this.Box = (function ()
    {
        
        /**
         * Constructor
         * @param {Object} daddy
         * @param {String} term
         * @param {int} id
         * @param {Object} position
         */
        function Box (daddy, term, id, position)
        {
            this.daddy = daddy;
            this.term = term;
            this.id = id;
            this.position = position;
            this.$el = null;
            
        }
        
        /**
         * Create a box html object
         */
        Box.prototype.create = function ()
        {
            var _this = this;
            this.$el = addElement('div', 'box box-' + this.id, '', this.daddy);
            this.$el.innerHTML = '<span>'+ this.term + '</span>';
            this.$el.position = this.position;
            this.$el.addEventListener('click', function ()
            { // Tell that this box has been selected by bingo user, must listen to it to know it
                event = document.createEvent("HTMLEvents");
                event.initEvent("BOX_SELECTED", true, true);
                _this.$el.className += ' active';
                _this.$el.innerHTML = '<span>&#9773;</span>';
                _this.$el.dispatchEvent(event);
                
                // TODO : to remove later when merging file with real skin
                _this.$el.style.color = 'red';
            });
        };
        
        /**
         * destroy box
         */
        Box.prototype.destroy = function ()
        {
            this.$el.removeEventListener('click');
            this.$el.parentNode.removeChild(this.$el);
        };
        
        return Box;

    })();

}).call(this);