function gameObject(){
    
    //Game Dimensions in Game Units. I think of them as meters, but this is what you will do all of your position updating in. 
    this.gameWidth = 200 ;
    this.gameHeight = this.gameWidth * 3.0/4.0; 
    
    var RabbitLand = {"Background":"#000000", "Ship":"#00FF00", "Enemy":"#CEF5FB", "Bomb":"#343A3B", "Well":"#8AAAAF"};    
    
    this.colors = RabbitLand;
    
    //Canvas Context for easy referencing
    this.Canvas = document.getElementById('gameCanvas');
    this.ctx = this.Canvas.getContext("2d"); 
    
    this.isMobile = function(){         
    if( navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
         ){
            return true;
            }
         else {
            return false;
          }
    }        
    
    //Physics Variables
    //this.gravity = 10;
    this.gravity = 0;
    
    //Game Settings
    this.level = 0;
    this.score = 0;
    
    //Set up game object arrays here
    this.clicks = [];
    this.keys = [];
    this.buttons = [];
    this.meters = [];
    
    this.players = [];
    this.carrots = [];
    this.carrotTimer = 15;
    this.coordinates = [];
    
    this.level = 1;
    this.carrotsFound = 0;
    this.drawType = "player";
    
    this.yumTimer = 0;
    this.brambleTimer = 0;
    this.legTimer = .2;
    //Timers
    
    //Game Objects            
    this.meterTypes = {"Level":0};        
    
    this.init = function(){
        //Add a player        
        this.players.push(new player(0, 0));       
        
        for(var x = 0; x < 200; x++){
            var carrotX = Math.random()*(2000)-1000;
            var carrotY = Math.random()*(2000)-1000;
            
            this.carrots.push(new coordinate(carrotX, carrotY));

        }

        for(var x = 0; x < 500; x++){
            var bushX = Math.random()*(2000)-1000;
            var bushY = Math.random()*(2000)-1000;
                        
            this.coordinates.push(new coordinate(bushX, bushY));            
        }

        //this.followBots.push(new followBot(10, 10));

        //Add Meters         
        this.meters.push(new meter(this.gameWidth/2, this.gameHeight - 17.5, this.meterTypes.Level));
        

        //Time Stuff
        this.lastTime = Date.now();
        this.nowTime = this.lastTime;
    }

    this.addCarrots = function(){  
                for(var x = 0; x < 50*game.level; x++){
            var carrotX = Math.random()*(2000)-1000;
            var carrotY = Math.random()*(2000)-1000;
            
            this.carrots.push(new coordinate(carrotX, carrotY));  
            if(this.carrots.length > 2000)
                break;
            

       
        }               

    }
    /*
        game.generators.push(new shipGenerator(game.gameWidth/2 + Math.random()*game.gameWidth/2-game.gameWidth/4,game.gameHeight/2 + Math.random()*game.gameHeight/2-game.gameHeight/4 , 3, 3, 5, this.weapons.Bomb));
        game.generators.push(new shipGenerator(game.gameWidth/2 + Math.random()*game.gameWidth/2-game.gameWidth/4,game.gameHeight/2 + Math.random()*game.gameHeight/2-game.gameHeight/4 , 3, 3, 5, this.weapons.Well));
        */
         
        
}