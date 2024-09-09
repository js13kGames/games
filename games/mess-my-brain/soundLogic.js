var songGen = new sonantx.MusicGenerator(jsonSong);
var audioCtx =  new AudioContext();
var song;
ctx.font = '40px Impact, Charcoal, sans-serif';
ctx.fillStyle = color1;
ctx.fillText('Loading...' , 100 , 100);
songGen.createAudio(function(audio) {
    console.log('heyheyhey')
    song = audio;
    song.play();
    ctx.clearRect(0, 0 , canvas.width , canvas.height);
    drawDocumentBorders();
    drawPhotoFrame();
    drawPlayerPortrer([canvas.width/2 -175 , 100]);

    drawText();
    document.addEventListener("keydown", spaceHandler, false);
});

setInterval(playSong , 50000);

function playSong() {
  console.log('hey');
  song.pause();
  song.currentTime = 0;
  song.play();
}
