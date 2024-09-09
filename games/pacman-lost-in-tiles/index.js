play_again = localStorage.getItem('play_again');
if(play_again==1){
	document.getElementById('play-again').style.display = "block";
	document.getElementById('score').innerHTML=localStorage.getItem('tile');
	localStorage.setItem("play_again", 0);
	localStorage.setItem("tile",0);
}
else{
	document.getElementById('start').style.display="block";
	localStorage.setItem("play_again", 0);

}