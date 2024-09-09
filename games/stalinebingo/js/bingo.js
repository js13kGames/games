/**
 * Bingo Object : initialize the game
 */
var Bingo = {
    
    container : null,
    
    itemPerCollum : 4,
    
    itemPerRow : 4,
    
    json : null,
    
    socket : null,
    
    ui : null,
    
    wrapper : null,
    
    join : null,
    
    create : null,
    
    hasTerms : false,
    
    server : 'http://ic.adfab.fr:8888/', // local home
    //server : 'http://ic.adfab.fr:88/' // server IC
    
    isConnected : false,
    
    getElement : function ()
    {
    	Bingo.wrapper = document.querySelector('.wrapper');
    	Bingo.ui = document.querySelector('.ui');
    	Bingo.join = document.getElementById('join');
    	Bingo.create = document.getElementById('create');
    	Bingo.popin = document.getElementById('popin');
    },
    
    /**
     * 
     */
    init : function ()
    {
        setTimeout(function(){
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 100);
        
    	if(typeof Bingo.wrapper === "undefined" || Bingo.wrapper === null) Bingo.getElement();
    	Bingo.ui.style.display = 'block';
    	Bingo.wrapper.style.display = 'none';
    	var newRoom = function (e)
    	{
			/*Bingo.join.removeEventListener('click', newRoom);*/
			/*Bingo.create.removeEventListener('click', newRoom);
			var roomName = prompt("Name of the room", "room name");*/
			var roomName = Bingo.create.value;
			if (roomName != null) {
				Bingo.roomName = roomName;
				Bingo.play(roomName);
			}
    	};
    	Bingo.join.addEventListener('click', newRoom);
    	/*Bingo.create.addEventListener('change', newRoom);*/
    	
        window.addEventListener('VICTORY', function ()
        {
            
            Grid.removeBox();
        	Bingo.hasTerms = false;
        	Bingo.socket.emit('victory', {});
        	
            /*Bingo.socket.emit('leave', { room : Bingo.roomName });
            Bingo.isConnected = false;
            Bingo.socket.disconnect();*/
           
        	//this.removeEventListener('click', arguments.callee);
            
            /*var confirmation = confirm('VICTORY ! play again ?');
            if(confirmation) Bingo.reload();*/
            
            document.getElementById('popin-msg').innerHTML = 'You Win !';
            Bingo.popin.style.display ='block';
            Bingo.ui.style.display = 'none';
        });
    },
    
    play : function (roomToConnect)
    {
    	if(typeof Bingo.socket !== "undefined" && Bingo.socket !== null && !Bingo.socket.socket.connected){
            Bingo.socket.socket.reconnect();
    	}
    	else{
	    	Bingo.socket = io.connect(Bingo.server);
    	}
    	
	    Bingo.socket.on('connect', function ()
	    {
	    	if(Bingo.isConnected) return;
	    	Bingo.isConnected = true;
	        Bingo.socket.emit('room', { room : roomToConnect });
	    });
	    
	    Bingo.socket.on('disconnect', function ()
        {
            Bingo.isConnected = false;
        });

	    Bingo.socket.on('terms', function (json)
	    {
	    	if(Bingo.hasTerms) return;
	    	Bingo.ui.style.display = 'none';
	    	Bingo.wrapper.style.display = 'block';
	    	Bingo.json = json;
    		Grid.init(Bingo.json);
	    	Bingo.hasTerms = true;
	    });
	    Bingo.socket.on('end', function ()
	    {
            
            Grid.removeBox();
	    	Bingo.hasTerms = false;
	    	Bingo.isConnected = false;
	    	//Bingo.socket.emit('leave', { room : roomToConnect });
	    	Bingo.socket.disconnect();
            Bingo.socket.socket.connected = null;
            document.getElementById('popin-msg').innerHTML = 'You Lose !';
            Bingo.popin.style.display = 'block';
            Bingo.ui.style.display = 'none';
	    	Bingo.reload();
	    });
    },
    
    reload: function() {
        if(typeof Bingo.wrapper === "undefined" || Bingo.wrapper === null) Bingo.getElement();
        //Bingo.ui.style.display = 'block';
        Bingo.wrapper.style.display = 'none';
        
        /*Bingo.create.addEventListener('change', newRoom);*/
        //Bingo.join.addEventListener('click', newRoom);
        
        
    }
};

if(document.loaded) Bingo.init();
else {
    if (window.addEventListener) window.addEventListener('load', Bingo.init, false);
    else window.attachEvent('onload', Bingo.init);
}
