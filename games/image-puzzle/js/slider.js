/**
	@author: Peda Venkateswarlu Pola
	Email : pola.venki@gmail.com
	YIM : pola_venki  Gtalk : pola.venki  Skype : pola.venki
*/
var slider = {};
slider.m = {};
slider.v = {};
slider.c = {};
slider.logLevel = 4;
slider.isIE = (navigator.appName.indexOf("Microsoft") != -1)?true:false;
slider.userAgent = navigator.userAgent.toLowerCase();
if(slider.userAgent.search("iphone") > -1 || slider.userAgent.search("ipad") > -1 || slider.userAgent.search("android") > -1){
	slider.isMobile = true;
}
slider.timerDiv = "";
	


slider.helpclick = function(msg){
	if(slider.v.puzzle) slider.v.puzzle.layoutmanager(msg);
};

slider.log = function(message, type){
	if(typeof(console) == 'undefined' || console == null || !slider.logLevel) return;
	try{
		if(type=="error")
			console.error("slider: "+message);
		else if(type=="warn" && slider.logLevel >= 2)
			console.warn("slider: "+message);
		else if(type=="info" && slider.logLevel >= 3)
			console.info("slider: "+message);
		else if(slider.logLevel >= 4)
			console.log("slider: "+message);
	}catch(e){
	}
};

slider.initGame = function(){
	slider.v.puzzle = new slider.v.Box();
	slider.v.puzzle.paintPuzzle();
};


slider.generateGame = function(){
	var s = slider,
		alltiles = ["tile00","tile01","tile02","tile03",
	                "tile10","tile11","tile12","tile13",
	                "tile20","tile21","tile22","tile23",
	                "tile30","tile31","tile32","tile33"];
	
	for(var i = 0 ; i < s.c.sliderSize ; i++){
		for(var j = 0 ; j < s.c.sliderSize ; j++){
			var index = Math.floor(Math.random()*alltiles.length),
				tile = alltiles[index];
			slider.log("len "+alltiles.length+" - tile="+tile,"info");
			alltiles.splice(index,1);
			s.m.state[i][j] = tile;
			if(tile==s.m.emptyTile){
				s.m.emptyRef["x"] = i; 
				s.m.emptyRef["y"] = j;
			} 
		}
	}
		
		
	
	
};

var initTimer = function(){
	
	setInterval(function(){
		slider.m.timeElapsed++;
		
		 var secs = slider.m.timeElapsed,
		 	hours = Math.floor(secs / (60 * 60)),
		 	divisor_for_minutes = secs % (60 * 60),
		    minutes = Math.floor(divisor_for_minutes / 60),
		    divisor_for_seconds = divisor_for_minutes % 60,
		    seconds = Math.ceil(divisor_for_seconds);
		slider.timerDiv.innerHTML = (hours < 10 ? "0"+hours : hours) + ":" + (minutes < 10 ? "0"+minutes: minutes)  + ":" + (seconds < 10 ? "0"+seconds: seconds);
	},1000);
	
};

slider.readFileAsDataURL = function(file) {
	var reader = new FileReader();
	reader.onload = function (event) {
		slider.log(event.target,"info");
		document.getElementById("source_holder").style.backgroundImage = 'url(' + event.target.result + ')';
		
		 var mysheet=document.styleSheets[0],
		 	myrules =[];
		 
		 if (mysheet.cssRules) myrules = mysheet.cssRules;
		 else if (mysheet.rules) myrules = mysheet.rules;
		 	
		 
	    for (var i=0; i<myrules.length; i++){
	    	
	    	if(myrules[i].selectorText.toLowerCase()==".tile"){
	    		myrules[i].style.backgroundImage ="url('"+event.target.result+"')";
	    		slider.uploadContainer.className = "hide";
	    		document.getElementById("mainContent").className = "";
	    		slider.initGame();
	    		initTimer();
	    		break;
	    	}
	    }
	};
	slider.log(file,"info");
	reader.readAsDataURL(file);
};


slider.attachDragNDrop = function(){

	
	var holder = document.getElementById("dragContainer");
	slider.holder = holder;
	slider.uploadContainer = document.getElementById("uploadContainer");
	
	document.getElementById("imageholder").onchange = function() {
		slider.readFileAsDataURL(this.files[0]);
     };

	if (typeof window.FileReader === 'undefined') {
		slider.uploadContainer.innerHTML = "Your browser is not HTML5  File API compatible, Please use latest version of your browser or other browser.";
	}

	holder.ondragover = function () { this.className = 'hover'; return false; };
	holder.ondragend = function () { this.className = ''; return false; };
	holder.ondrop = function (e) {
		this.className = '';
		e.preventDefault();
		var file = e.dataTransfer.files[0];
		slider.readFileAsDataURL(file);
		return false;
	};

};

