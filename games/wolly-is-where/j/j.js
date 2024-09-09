window.onload = function(){

	document.getElementById("button-start").onclick = function() {
		document.getElementById("intro").style["display"] = "none";
		document.getElementById("wolly").style["display"] = "block";
        return false;
    };

	document.getElementById("wolly").onclick = function() {
		document.getElementById("wolly").style["display"] = "none";
		document.getElementById("win").style["display"] = "block";
        return false;
    };

	document.getElementById("button-no").onclick = function() {
		document.getElementById("intro").style["display"] = "none";
		document.getElementById("okay").style["display"] = "block";
        return false;
    };

};