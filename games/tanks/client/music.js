// sound length formula
// 12000 data at 8000 sampleRate = 1.25s
//
// sine equation
// Since the equation of a sin wave is A*sin(2*pi*f*x)



// laser sound effect
var sine = []; for (var i=0; i<10000; i++) sine[i] = 128+Math.round(127*Math.sin(i/8));
var wave2 = new RIFFWAVE(sine);
var audio2 = new Audio(wave2.dataURI);
audio2.play(); // some noise

// spawn sound effect
var sine = [];
for (var i = 0; i < 7500; i++) {
	// sine[i] = 64 + Math.round(32 * (Math.sin(i * i / 8000)))
	sine[i] = 64+Math.round(32*(Math.sin(i*i/8000))+255*Math.random());
}

var wave2 = new RIFFWAVE(sine);
var audio2 = new Audio(wave2.dataURI);
audio2.play(); // some noise

// fade
for(var i = 100;i>-1;i--) {
	a*(i/100)
}