/*global CPlayer*/

var playSound;

(function () {
    
    "use strict";
    
    var player = new CPlayer(),
        audio = document.createElement("audio"),
        tracks = [
        
            // clock-tamper
            {songData:[{i:[3,194,128,0,2,198,128,6,0,0,12,12,33,0,0,0,61,4,1,2,109,86,7,32,112,3,67,2],p:[1],c:[{n:[135,135,135],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1},
            
            // wall-slide
            {songData:[{i:[2,192,128,0,2,192,140,18,0,0,158,59,123,0,0,0,0,0,0,2,5,0,0,32,0,0,24,5],p:[1],c:[{n:[111],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1},
            
            // rack-on
            {songData:[{i:[2,192,128,0,2,192,140,18,0,0,158,93,64,0,0,0,0,0,0,2,5,0,0,32,0,0,24,8],p:[1],c:[{n:[135,,,,,,139,,,,,,142,,,,,,147],f:[]}]}],rowLen:11025,patternLen:32,endPattern:0,numChannels:1},
 
            // complete
            {songData:[{i:[2,138,116,0,2,138,128,4,0,0,47,48,107,124,3,0,139,4,1,3,64,160,3,32,147,4,121,5],p:[1],c:[{n:[135,,,,,,142,,,,,,147],f:[]}]}],rowLen:11025,patternLen:32,endPattern:0,numChannels:1},
 
            // song
            {songData:[{i:[2,138,116,0,2,138,128,4,0,0,47,48,107,124,3,0,139,4,1,3,64,160,3,32,147,4,121,5],p:[1,1,1,1,1,1,1],c:[{n:[135,,,,,,,,142,,,,,,,,147],f:[]}]},{i:[0,255,116,1,0,255,116,0,1,0,4,6,35,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],p:[,,1,1,1],c:[{n:[135,,,,,,,135,135,,135,,,,,,135,,,,,,135,,135],f:[]}]},{i:[0,221,128,1,0,210,128,0,1,255,4,6,62,0,0,0,64,7,1,3,255,15,0,32,20,0,24,6],p:[,,1,1,1],c:[{n:[,,,,135,,,,,,,,135,,,,,,,,135,,,,,,,,135],f:[]}]},{i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,
0,0,0,1,193,171,0,29,39,3,88,3],p:[,,,1,1],c:[{n:[,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}]},{i:[2,130,128,0,3,191,128,0,0,0,0,6,29,0,0,0,195,4,1,3,50,184,119,244,147,6,84,6],p:[,1,1,1,1,1],c:[{n:[111,,111,,111,,111,,111,,111,,111,,111,,111,,111,,111,,111,,111,,111,,111,,111],f:[]}]}],rowLen:9450,patternLen:32,endPattern:6,numChannels:5},
            
            // out-of-time
            {songData:[{i:[2,138,116,0,2,138,128,4,0,0,47,48,75,124,3,0,68,4,1,3,64,109,3,32,147,4,79,2],p:[1],c:[{n:[118,,,,117,,,,116,,,,115,,,,114,,,,113,,,,113],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1},
            
            // locker
            {songData:[{i:[3,0,128,0,3,68,128,0,1,218,4,4,36,0,0,1,55,4,1,2,67,115,124,190,67,6,39,1],p:[1],c:[{n:[123],f:[]}]}],rowLen:5513,patternLen:32,endPattern:0,numChannels:1}

        ];
    
    playSound = function (sound) {
        
        var done = false;
        
        if (sound === "clock-tamper") {
            player.init(tracks[0]);
        } else if (sound === "wall-slide") {
            player.init(tracks[1]);
        } else if (sound === "rack-on") {
            player.init(tracks[2]);
        } else if (sound === "complete") {
            player.init(tracks[3]);
        } else if (sound === "song") {
            player.init(tracks[4]);
        } else if (sound === "out-of-time") {
            player.init(tracks[5]);
        } else if (sound === "locker") {
            player.init(tracks[6]);
        }
        
        window.setInterval(function () {
            
            var wave;
            
            if (done) {
              return;
            }

            done = player.generate() >= 1;

            if (done) {
                wave = player.createWave();
                audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
                audio.play();
            }

        }, 0);
        
    };

}());
