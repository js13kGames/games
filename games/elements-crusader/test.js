var isMobile = (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/IEMobile/i)) ? 1 : 0;

var text = document.getElementById('t').getContext('2d');

text.imageSmoothingEnabled = false;
text.webkitImageSmoothingEnabled = false;
text.mozImageSmoothingEnabled = false;
text.fillStyle = '#fff';
text.strokeStyle = '#fff';
text.textAlign = 'center';
text.font = '30px Arial';
text.lineCap = 'square';
text.lineCap = 'square';

var stage = 0;

function intro(){
	//stars_draw();
	text.font = (25-(stage/120))+'px Arial';
	text.clearRect(0, 0, 640, 360);
	text.fillText("Dobi", 320, 200-stage);
	text.font = (24-(stage/120))+'px Arial';
	text.fillText("ringlets.pl", 320, 250-stage);
	text.font = (23-(stage/120))+'px Arial';
	text.fillText("prezents", 320, 350-stage);
	text.font = (22-(stage/120))+'px Arial';
	text.fillText("Elements .-. Crusader", 320, 520-stage);
	text.font = (20-(stage/120))+'px Arial';
	if(isMobile) text.fillText("tap and tilt screen", 320, 560-stage);
	else text.fillText("use arrows and spacebar", 320, 560-stage);
	text.font = '30px Arial';
	if(stage<600) window.requestAnimationFrame(intro);
	else start();
	stage++;
}

intro();