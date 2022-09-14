var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var multiplier=1;
var flag=0;
var sign=1;
//var speed_hero=40;
var speed_ring=70;
var level3;
//-------------------------------------------------------------------------------------------------



//contains property of ring
function Ring() {
    this.center = {
        'x': 300,
        'y': 300
    };
    this.radius = 200;
    this.inner_radius = 180;
    this.segments = 4;
    this.colors = ["red", "blue", "green", "yellow"];
    this.st_point = 0;
    this.draw = function(data) {
  
        var end_point = this.st_point + 0.5 * Math.PI;

        for (var i = 0; i < 4; i++) {

            ctx.beginPath();
            ctx.arc(this.center['x'], this.center['y'], this.radius, this.st_point, end_point);
            ctx.stroke();
            ctx.lineTo(this.center['x'], this.center['y']);
            ctx.fillStyle = this.colors[i];
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.center['x'], this.center['y'], this.inner_radius, this.st_point, end_point);
            ctx.stroke();
            ctx.lineTo(this.center['x'], this.center['y']);
            ctx.fillStyle = "white";
            ctx.fill();
            this.st_point = end_point;
            end_point = end_point + 0.5 * Math.PI;

        }
    this.move = function(para){
    	var dthetaR = para*(-Math.PI /speed_ring);
        if(level3)
    	this.st_point = this.st_point + sign*dthetaR;
        else
        this.st_point = this.st_point + dthetaR;

    }    
    };
}


//----------------------------------------------------------------------------------------------



//properties of hero


function Hero(params) {

    this.radius = 20;
    this.curr_track_col = 'yellow';
    this.theta = params['theta'];
    this.sense = 1;
    this.color = params['color'];
    this.center = {
        'x': 300 + Math.sin(this.theta),
        'y': 80 + (1 - Math.cos(this.theta))
    }
    this.draw = function() {
        ctx.beginPath();
        ctx.beginPath();
        ctx.arc(this.center['x'], this.center['y'], this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    this.move = function() {
        
        var dtheta = Math.PI / speed.spd;
        dtheta = dtheta * this.sense;
        this.center['x'] = 300 + (this.radius + ring.radius) * Math.sin(this.theta + dtheta);
        this.center['y'] = 80 + (this.radius + ring.radius) * (1 - Math.cos(this.theta + dtheta));
        this.theta = this.theta + dtheta;

    }

}


//-------------------------------------------------------------------------------------


//score function

function Score(value) {
	this.val = value ;
    this.draw = function() {
        ctx.font = "30px Arial";
        ctx.fillText("score :" + this.val, 10, 50);
    }
}

//---------------------------------------------------------------------------------------

function Speed(spd){
    this.spd = spd;
    this.draw = function(){
        ctx.font = "30px Arial";
        ctx.fillText("speed :" + (100-this.spd), 450, 40);
    }
}

//game function send ring and hero object and score to msin .js
function Game() {
    theta = 0;
    this.level;
    this.start = false;
    this.ring = new Ring();
    this.hero = new Hero({
        'color': "blue",
        'theta': 3*Math.PI/2
    });
    this.score = new Score(0);
    this.speed = new Speed(40);
    this.set_level = function(level) {
        document.getElementById("levels").style.display = "none";
        document.getElementById("start").style.display = "block";
        document.getElementById("Rules").style.display = "block";
        if(level==1){
            multiplier = 0;
            speed_ring = 50;
        }
        else
        {
            multiplier = 1;
            speed_ring = 70;

        }
        if(level == 3)
            level3=true;
    };
    return {
        'ring': this.ring,
        'hero': this.hero,
        'score': this.score,
        'speed': this.speed,
        'game' : this
    };



}
//-------------------------------------------------------------------------------------------