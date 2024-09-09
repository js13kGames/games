/**
 * Create a canvas shape
 * @type {Shape}
 * @param params
 *      - colour {string}
 *      - fill {boolean}
 *      - length {number}
 *      - width {number}
 *      - edges {number}
 *      - offsetX {number}
 *      - offsetY {number}
 *      - offsetRotation {number}
 *      - border {number} - Border thickness
 *      - point {number} - Size of point
 *
 * @author Jarred Mack, Steve Kane
 */
var Shape = function() {
    var canvas, ctx;

    function cls(params) {
        var self = this;

        //Global to shape
        canvas = params.canvas || document.getElementById('canvas1');
        ctx = canvas.getContext('2d');

        //Shape parameters
        this.data = {
            colour: params.colour || '255, 255, 255',
            fill: params.fill || false,
            length: params.length || 20,
            width: params.width || 20,
            edges: params.edges || 4,
            offsetX: params.offsetX || 0,
            offsetY: params.offsetY || 0,
            offsetRotation: params.offsetRotation || 0,
            border: params.border || 0,
            point: params.point || 0
        }

        /**
         * Calculate the vertices to be drawn
         */
        this.calculateVertices = function() {
            self.data.vertices = [];
            for(var i = 1; i <= self.data.edges; i++) {
                self.data.vertices.push({
                    x: self.data.width/2 * Math.cos((2 * Math.PI * (i / self.data.edges) - ((90 + self.data.offsetRotation) * Math.PI / 180))) + self.data.offsetX,
                    y: self.data.length/2 * Math.sin((2 * Math.PI * (i / self.data.edges) - ((90 + self.data.offsetRotation) * Math.PI / 180))) + self.data.offsetY
                });
            }
        }

        /**
         * Set the object colour
         * @param {string} colour
         * @returns {Shape}
         */
        this.setColour = function(colour) {
            self.data.colour = colour;
            return this;
        }

        /**
         * Set the object length
         * @param {number} length
         * @returns {Shape}
         */
        this.setLength = function(length) {
            self.data.length = length;
            self.calculateVertices();
            return this;
        }

        /**
         * Draw the shape
         * @param {number} x
         * @param {number} y
         * @param {number} rotation
         */
        this.draw = function(x, y, rotation) {
            //Save canvas state
            ctx.save();

            //Translate canvas to the point to draw
            ctx.translate(x, y);

            //Rotate shape
            ctx.rotate(Math.PI / 180 * ((rotation || 0)));

            //Start shape
            ctx.beginPath();

            //Draw the edges
            self.data.vertices.forEach(function(vertex) {
                ctx.lineTo(vertex.x, vertex.y);
            });

            //Set the colour
            ctx.fillStyle = 'rgb(' + self.data.colour + ')';

            //Fill shape
            if(self.data.fill) {
                ctx.fill();
            }

            //End shape
            ctx.closePath();

            //Add border
            if(self.data.border) {
                ctx.strokeStyle = 'rgb(' + invert(self.data.colour) + ')';
                ctx.lineWidth = self.data.border;
                ctx.stroke();
            }

            //Add a circle to the front of the shape
            if(self.data.point) {
                ctx.beginPath();
                ctx.arc(0 + self.data.offsetX, -self.data.length/2, self.data.point, 0, Math.PI*2, false);
                ctx.fillStyle = 'rgb(' + self.data.colour + ')';
                ctx.fill();
                ctx.closePath();
            }

            //Restore canvas state
            ctx.restore();
        }

        //Initialise
        self.calculateVertices();
    }

    /**
     * Invert a colour
     * @param {string} colour
     * @returns {string}
     */
    function invert(colour) {
        var colourString = colour.split(',');
        colourString[0] = 255 - colourString[0];
        colourString[1] = 255 - colourString[1];
        colourString[2] = 255 - colourString[2];
        return colourString.join(',');
    }
    return cls;
}();