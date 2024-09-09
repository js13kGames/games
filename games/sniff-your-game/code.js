    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        pixelRatio = window.devicePixelRatio || 1;

    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d");

        canvas.width = windowWidth * pixelRatio;
        canvas.height = windowHeight * pixelRatio;

        canvas.style.width = windowWidth + 'px';
        canvas.style.height = windowHeight + 'px';	
        
        var Keys = function () {

            this.key = {
                left: false,
                right: false,
                up: false,
                down: false
            };
    
            window.onkeydown = this.keydown.bind(this);
            window.onkeyup = this.keyup.bind(this);

        };
        
            Keys.prototype.keydown = function (e) {

                var _this = this;

                KonamiCode(e.keyCode);

                switch (e.keyCode) {
                case 37:
                    _this.key.left = true;
                    break;
                case 38:
                    _this.key.up = true;
                    break;
                case 39:
                    _this.key.right = true;
                    break;
                case 40:
                    _this.key.down = true;
                    break;
                case 68:
                    DogWoof();   
                    break;
                case 83:
                    DogSniff();   
                    break;

                }

            };

            Keys.prototype.keyup = function (e) {

                var _this = this;

                switch (e.keyCode) {
                case 37:
                    _this.key.left = false;
                    break;
                case 38:
                    _this.key.up = false;
                    break;
                case 39:
                    _this.key.right = false;
                    break;
                case 40:
                    _this.key.down = false;
                    break;
                }

            };
            
        var M = {},
            Mi = { // Unlocki
                "Num":1,
                1: false, // * - Animations
                2: false, // * - Flora
                3: false, // * - Dialogues (dogs texts)
                4: false, // * - Colors
                5: false, // * - Bug Fixes
                6: false, // Sounds
                7: false, // * - AI NPC
                8: false, // * - Better Resolution
                9: false, // * - Easter Egg
                10: false, // * - Interface (Number of Dogs)
                11: false, // * - Sorting
                12: false, // * - Microtransactions
            },
            Ti = {// Dialogues
                1: "Hey",
                2: "Do you like trees?",
                3: "It's nice to talk to someone",
                4: "I can see a rainbow",
                5: "psst .. tomorrow 80GB patch",
                6: "Woof?",
                7: "Always better in the group",
                8: "So this is what the new generation looks like",
                9: "ps. Start = Enter",
                10: "OK ...",
                11: "Somehow Better",
                12: "Do you want horse armor?",
            },
            Ts = {
                1: "Animations",
                2: "Flora",
                3: "Dialogues",
                4: "Colors",
                5: "Bug Fix",
                6: "Sound",
                7: "NPC AI",
                8: "FULL HD",
                9: "K.C",
                10: "Interface",
                11: "Sorting",
                12: "Microtransactions?",
            },
            KCode = [],
            KCodeDone = [38,38,40,40,37,39,37,39,66,65,13],
            Resize,
            NLi = [],
            Arrows = [],
            SortList = [],
            Chunks = [],
            Map = [],
            NPCAnim_,
            US_,
            Arrows = [],
            game = new Keys(),
            data = {

                0:{
                    "File": "Dog_Lay_Down",
                    "Height": 90,
                    "Width": 115,
    
                },

            },
            DogAi = {
    
                0:{ 
    
                    "File": 4, // MoveS
                    "Speed": 3,
                    "Counter": 200,
                    "AnX": 1,
    
                },
    
                1:{
    
                    "File": 2, // Lay
                    "Speed": 0,
                    "Counter": 200,
                    "AnX": 1,
    
                },
    
                2:{
    
                    "File": 0, // MoveF
                    "Speed": 8,
                    "Counter": 200,
                    "AnX": 1,
    
                },
    
                3:{

                    "File": 0, // MoveF
                    "Speed": null,
                    "Counter": 200,
                    "AnX": 1,
    
                },
    
            },
            Files = {

                "false": "000000ffffffffffffffffffffffffffffffffffff",
                "true": "000000831b1b535f1614c23111551ed7e32b07692d",

                0:{ "Height": 300, "Width": 300, "M": 30, "S": 10, "F": { 0:"@xG@@_[k@@_[k@@_[k@@hmE@@@o@@@@o@@@@o@@@@o@@@@o@@" } }, // Drzewo
                1:{ "Height": 40, "Width": 40, "M": 4, "S": 5, "F": { 0:"@F@vF@F@HC@A@" } }, // Kwiatek
                2:{ "Height": 7*4, "Width": 7*4, "M": 4, "S": 7, "F": { 0:"@@@@@@@@Ce@c]D\l\E\[C@]E@" } }, // Krzak
                4:{ "Height": 60, "Width": 60, "M": 6, "S": 10, "F": { 0:"@@@@@@@@@@@@@@@|@@@gLG@xaLy@Oa`IID@LIa@@`ID@@@d@@" } }, // Strzałka
                5:{ "Height": 14*4, "Width": 14*4, "M": 4, "S": 14, "F": { 0:"@@@@@@@@HA@@@@@aLII@AHddddILHdddddL@addIaI@HddadL@HddIaL@HdddaA@addIaAHdddddLHddddLA@aLIIA@@HA@@@@" } }, // kosc pod
                
                "D":{ // Dog

                    0:{ "Height": 5*18, "Width": 5*18, "M": 5, "S": 18, "F": { 
                        0:"@H@A@@@A@@QIJ@@@A@HRRRIIH@@HJRRRRA@@QRRRRRJ@@IQRRRRJ@@QRRRRRRA@HQRRRRRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 
                        1:"@@@@@@@@@@H@A@@@A@@QIJ@@@A@HRRRIIH@@HJRRRRA@@QRRRRRJ@@IQRRRRJ@@QRRRRRRA@HQRRRRRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"} }, // Dog_MoveF_Down
                    1:{ "Height": 5*18, "Width": 5*18, "M": 5, "S": 18, "F": { 
                        0:"@H@A@@H@@@QIJ@@H@@HRRRIAA@@HRRRRJA@@QRRRRRJ@@QRRRJJJ@@QRRRRQRA@HRRRJJRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 
                        1:"@@@@@@@@@@H@A@@H@@@QIJ@@H@@HRRRIAA@@HRRRRJA@@QRRRRRJ@@QRRRJJJ@@QRRRRQRA@HRRRJJRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" } }, // Dog_MoveF_Up
                    2:{ "Height": 5*18, "Width": 5*18, "M": 5, "S": 18, "F": { 
                        0:"@@@@@@@@@@@@@@@@@@@H@A@@@@@@QIJ@@@@@HRRRI@@@@HJRRRA@@@QRRRRJ@@@IQRRRRA@@QRRRRRA@@HQRRRRJ@@HRRRRRJ@@@QRRRRRAI@QQRRRRI@@QQRRRRA@@IHRQRRA@@AHIHIIA@@@@@@@@@@@@@@@@@@@", 
                        1:"@@@@@@@@@@@@@@@@@@@H@A@@@@@@QIJ@@@@@HRRRA@@@@HJRRJ@@@@QRRRRA@@@IQRRRJ@@@QRRRRRA@@HQRRRRA@@HRRRRRJ@@@QRRRRJ@@@QQRRRRAI@QQRRRRI@@IHRQRRA@@AHIHIIA@@@@@@@@@@@@@@@@@@@" } }, // Dog_Lay_Down
                    3:{ "Height": 5*18, "Width": 5*18, "M": 5, "S": 18, "F": { 
                        0:"@@@@@@@@@@@@@@@@@@@H@A@@@@@@QIJA@@@@HRRRJ@@@@HRRRRA@@@QRRRRJ@@@QRRRRRA@@QRRRRRA@@HRRRRRJ@@HRRRRRJ@@@QRRRRJ@@@QQRRQQA@@QQRRRRA@@IHRQRRA@@AHIHIIA@@@@@@@@@@@@@@@@@@@", 
                        1:"@@@@@@@@@@@@@@@@@@@H@A@@@@@@QIJ@@@@@HRRRA@@@@HRRRJ@@@@QRRRRA@@@QRRRRJ@@@QRRRRRA@@HRRRRRA@@HRRRRRJ@@@QRRRRJ@@@QQRRRRA@@QQRRQQA@@IHRQRRA@@AHIHIIA@@@@@@@@@@@@@@@@@@@" } }, // Dog_Lay_Up
                    4:{ "Height": 5*18, "Width": 5*18, "M": 5, "S": 18, "F": { 
                        0:"@H@A@@@A@@QIJ@@@A@HRRRIIH@@HJRRRRA@@QRRRRRJ@@IQRRRRJ@@QRRRRRRA@HQRRRRRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 
                        1:"@@@@@@@@@@H@A@@@A@@QIJ@@@A@HRRRIIH@@HJRRRRA@@QRRRRRJ@@IQRRRRJ@@QRRRRRRA@HQRRRRRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" } }, // Dog_MoveS_Down
                    5:{ "Height": 5*18, "Width": 5*18, "M": 5, "S": 18, "F": { 
                        0:"@H@A@@H@@@QIJ@@H@@HRRRIAA@@HRRRRJA@@QRRRRRJ@@QRRRJJJ@@QRRRRQRA@HRRRJJRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", 
                        1:"@@@@@@@@@@H@A@@H@@@QIJ@@H@@HRRRIAA@@HRRRRJA@@QRRRRRJ@@QRRRJJJ@@QRRRRQRA@HRRRJJRA@HRRRRRRA@@QJRRRRA@@QAQRQJ@@@QAQIHJ@@@I@I@HA@@@A@A@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" } }, // Dog_MoveS_Up
      
                }

            },
            DialogSystem = {
                
                0:"It's probably everyone",
                1:"Why the game didn't start",
                2:"Maybe some bone was damaged",
                3:"ummm .... I think it needs a restart",
                
            };

            Start = document.createElement("img");
            Start.src = "Start.png";

            Bon = document.createElement("img");
            Bon.src = "Bon.png";

        // Draw

        function US(){  
            
            ctx.save();	

            if(Mi[5]) ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            ctx.translate(M.DiffX,M.DiffY); 
                ctx.beginPath();

                    if(Mi[5]){ ctx.rect(0, 0,  M.Width, M.Height); ctx.clip();}
                    else ctx.clearRect(0, 0, M.Width, M.Height);

                    if(!NLi[0].Follow) ctx.drawImage(Start, 0, 0, 240, 135, 0, 0, M.Width, M.Height);
                      
                    WorldDraw();
                    
                    if(Mi[10]) Text(Mi.Num+"/13",M.Width/2,100*M.PxH,60* M.PxW,'black');
                    
                ctx.closePath();
        
            ctx.restore();
    
            US_ = requestAnimationFrame(US);

        }

        function WorldDraw(){

            if(Mi[11])
            SortList.sort(function(a, b){
                return (a.PY+a.Data.Height/2) - (b.PY+b.Data.Height/2);
            }); 

            ctx.save();
            
            if(Mi[4]) ctx.fillStyle = '#5b8d2a';
            else ctx.fillStyle = 'white';
            
            if(NLi[0].Follow) ctx.fillRect(0, 0,  M.Width,  M.Height);

            ctx.translate(-M.PX*M.PxW, -M.PY*M.PxH);
            
                for (var x = 0; x < SortList.length; x++) {
                    
                    var Data = SortList[x];

                    ctx.save();

                    ctx.translate(Data.PX * M.PxW, Data.PY * M.PxH);
                    ctx.scale(Data.Scale, 1);
		            ctx.rotate(Data.Route*Math.PI/180);
                        
                    ctx.translate(-(Data.Data.Width/2)* M.PxW, -(Data.Data.Height/2)* M.PxH);

                    PixelDraw(Data.Data,Data.AnX);
                    
                    ctx.restore();
                    
                    if(Data.Num && !Mi[Data.Num]) {
                        
                        ctx.drawImage(Bon, 0, 0, 300, 100,(Data.PX-120) * M.PxW, (Data.PY+20) * M.PxH, 230* M.PxH, 60* M.PxW);
                        Text(Ts[Data.Num],Data.PX * M.PxW, (Data.PY+60) * M.PxH,25* M.PxW,'black');
                        
                    }

                    if(Data.Fun && M.Reset && M.NumD == Data.Num) 
                    Text(M.Reset,Data.PX * M.PxW, (Data.PY-50) * M.PxH,40* M.PxW,'white');
                    
                    if(Data.Num == 0 && Data.Spec)
                    Text(Data.Spec,Data.PX * M.PxW, (Data.PY-50) * M.PxH,40* M.PxW,'black');
                    
 
                }
               
                for (var y = 0; y < Arrows.length; y++) {

                    if(!NLi[y+1].Follow){

                        ctx.save();

                        ctx.translate(Arrows[y].PX * M.PxW, Arrows[y].PY * M.PxH);
                        
                        ctx.rotate(Math.atan2(Arrows[y].PX - NLi[0].PX, Arrows[y].PY - NLi[0].PY) * -1);
                    
                        ctx.translate(-(Files[4].Width/2)* M.PxW, -(Files[4].Height/2)* M.PxH);
    
                        PixelDraw(Files[4],0);
                        
                        ctx.restore();
                        
                    }
                   
                }

                if(M.Tx && Mi[3]) Text(Ti[M.Tx],NLi[M.Tx].PX * M.PxW, (NLi[M.Tx].PY-40) * M.PxH,30* M.PxW,'black');
 
            ctx.restore();

            for (var x = 0; x < NLi.length; x++) NLi[x].Fun();
                
            CameraMove();

        }

        function PixelDraw(Data,AnX){

            var px=[], P=Data.F[AnX].replace(/./g,a=>{z=a.charCodeAt();px.push(z&7);px.push((z>>3)&7);});
            for(j=0;j<Data.S;j++) for(i=0;i<Data.S;i++)
            if(px[j*Data.S+i]){
                ctx.fillStyle="#"+Files[Mi[4]].substr(6*(px[j*Data.S+i]-1),6);
                ctx.fillRect((i*Data.M-0.5)* M.PxW,(j*Data.M-0.5)* M.PxH,(Data.M+1) * M.PxW, (Data.M+1)* M.PxH);//+2
            }

        }

        function Text(T,X,Y,S,Color){
            
            ctx.save();
            
            ctx.fillStyle = Color;
            ctx.font = S+"px Arial";
            ctx.textAlign = "center";
            ctx.fillText(T,X,Y);

            ctx.restore();

        }

        // Other

        function CreateWorld(){
            
            for (var x = 0; x < 12; x++){
                Map.push([]);	
                for (var y = 0; y < 12; y++)
                Map[x].push((12*x)+y);	
            }

            NLi.push({
                    
                Fun: function (){ DogsMove(this); },
                Data: Files.D[0],
                Num: 0,
                Follow: false,
                Draw: true,
                AnX: 0,
                MAnX: 1,
                PX: 6480.1, 
                PY: 6480.1,
                ZeroX: 6480.1,
                ZeroY: 6480.1,
                SPX: 6480.1,
                SPY: 6480.1,
                Route: 0,
                Counter: -1,

            });	

            SortList.push(NLi[0]);

            for (var x = 1; x < 13; x++){
                
                var X = Math.floor((Math.random() * 12000)),
                    Y = Math.floor((Math.random() * 12000));

                NLi.push({
                    
                    Fun: function (){ DogsMove(this); },
                    Data: Files.D[0],
                    Num: x,
                    Follow: false,
                    Draw: true,
                    AnX: 0,
                    MAnX: 1,
                    PX: X, 
                    PY: Y,
                    ZeroX: X,
                    ZeroY: Y,
                    SPX: X,
                    SPY: Y,
                    Route: 0,
                    Counter: -1,

                });	

                SortList.push(NLi[x]);	

            }

            for (var x = 0; x < 144; x++){

                Chunks.push([]);

                for (var y = 0; y < 20; y++){
                
                    var X = Math.floor((Math.random() * 1080)),
                        Y = Math.floor((Math.random() * 1080));

                    if(Math.floor((Math.random() * 6)) > 0)
                    var D = Files[Math.floor((Math.random() * 2)+1)];
                    else var D = Files[0];

                    Chunks[x].push({
                        
                        Chunk: x,
                        Data: D,
                        Scale: 1,
                        AnX: 0,
                        MAnX: 0,
                        Route: Math.floor((Math.random() * 5)-2),
                        PX: X, 
                        PY: Y,
                        Spec: false

                    });	

                }

            }

            Chunks[66].push({
                        
                Chunk: 66,
                Data: Files[5],
                Scale: 1,
                AnX: 0,
                MAnX: 0,
                Route: 70,
                PX: 100, 
                PY: 1100,
                Spec: true

            });	

            CameraMove();

        }

        function PixelRatio(){ 
            
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
            
            pixelRatio = window.devicePixelRatio || 1;
            
            var K = 0;
            if(!Mi[8]) pixelRatio /= 2; 
            if(!Mi[5]) K = 30;

            var Height = (windowHeight* pixelRatio)+K , Width = (windowWidth* pixelRatio)+K ;
               
            canvas.style.width = windowWidth + 'px';
            canvas.style.height = windowHeight + 'px';
    
            canvas.width = Width;
            canvas.height = Height;
    
            if(Math.floor((windowHeight / (windowWidth + windowHeight)) * 100) > 36)
                for (;Math.floor((windowHeight / (windowWidth + windowHeight)) * 100) != 36;)
                    windowHeight = Math.round(36 * ((windowWidth + windowHeight) / 100));
    
            if (Math.floor((windowWidth / (windowWidth + windowHeight)) * 100) > 64)
                for (;Math.floor((windowWidth / (windowWidth + windowHeight)) * 100) != 64;)
                    windowWidth = Math.round(64 * ((windowWidth + windowHeight) / 100));
    
            M.PxW = (windowWidth * pixelRatio) / 1920;
            M.PxH = (windowHeight * pixelRatio) / 1080;
    
            M.DiffY = (Height - windowHeight* pixelRatio) / 2;
            M.DiffX = (Width - windowWidth* pixelRatio) / 2;
            
            M.Width = 1920*M.PxW;
            M.Height = 1080*M.PxH;
        
        }

        function KonamiCode(Key){

            KCode.push(Key);
            
            for (var x = 0; x < KCode.length; x++) 
            if(KCodeDone[x] != KCode[x]) KCode = [];
           
            if(KCodeDone.length == KCode.length){
               
                for (var x = 0; x < NLi.length; x++)
                NLi[x].Route += 180;


                for (var x = 0; x < 144; x++)
                for (var y = 0; y < 20; y++)
                Chunks[x][y].Route += 180;
               
                ChangeObjects();

            }

        }

        function DogWoof(){

            NLi[0].Follow = true;
            if(!NLi[0].Stop){

                var Speed = 2000;

                var N = NLi[0];
                
                var s = new Audio('woof.mp3');
                if(Mi[6]) s.play();
                    
                NLi[0].Spec = "Woof!";

                for(var x = 1; x < NLi.length; x++){
    
                    var NPC = NLi[x];
        
                    if( N.PX > NPC.PX-200 && N.PY > NPC.PY-200 && N.PX < NPC.PX+200 && N.PY < NPC.PY+200 && !NPC.Follow){
                        
                        var Check = true;
                        
                        M.Tx = x;
                        Mi.Num++;
                        Mi[x] = true;
                        NPC.Follow = true;
                        DogAISet(NPC,1);

                        if(!Mi[3]) Speed = 200;

                        if(x == 2) ChangeObjects();
                        if(x == 6) s.play();
                        if(x == 8 || x == 5) PixelRatio();
        
                        if(Mi.Num == 13){
                            
                            M.DialogNum = 0;
                            M.Reset = DialogSystem[M.DialogNum];
                            M.NumD = Math.floor((Math.random() * 13));
                            
                            setTimeout(DialogSet,1500);

                        }

                    } 
                    
                }

                if(Check){

                    DogAISet(N,1);
                    setTimeout(function() { NLi[0].Stop = false; M.Tx = 0; NLi[0].Spec = null;  },Speed);
                    NLi[0].Stop = true;
                    
                } else setTimeout(function() { NLi[0].Spec = null;  },100);
                
            }
            
        }

        function DogSniff(){
            
            NLi[0].Follow = true;
            if(!NLi[0].Stop && Arrows.length == 0){

                NLi[0].Spec = "Sniff";
                DogAISet(NLi[0],1);

                for (var x = 0; x < 12; x++){
                
                    Arrows.push({

                        PX: NLi[0].PX,
                        PY: NLi[0].PY,
                        XEnd: NLi[x+1].PX,
                        YEnd: NLi[x+1].PY,
                        XMove: 0,
                        YMove: 0,
                        Counter: 0,

                    });

                    var Mon = Arrows[x],

                        dx = Mon.PX-Mon.XEnd,
                        dy = Mon.PY-Mon.YEnd,
                        angle = Math.atan2(dy, dx);
				
					Mon.XMove = Math.round(((15 * Math.cos(angle)) + Number.EPSILON) * 100) / 100;
					Mon.YMove = Math.round(((15 * Math.sin(angle)) + Number.EPSILON) * 100) / 100;
					
					if(Mon.XMove)
					Mon.Counter = Math.round(Math.abs((Mon.PX-Mon.XEnd)/Mon.XMove));
					else Mon.Counter = Math.round(Math.abs((Mon.PY-Mon.YEnd)/Mon.YMove));

                }
                
                for (var x = 0; x < 20; x++)
                for (var y = 0; y < 12; y++){
                
                    if(Arrows[y].Counter > 0){

                        Arrows[y].PX -= Arrows[y].XMove;
                        Arrows[y].PY -= Arrows[y].YMove;
                        Arrows[y].Counter --;

                    }
                    
                }

                setTimeout(function() { NLi[0].Stop = false; Arrows = []; NLi[0].Spec = null; },700);
                NLi[0].Stop = true;

            }
           
        }

        function DialogSet(){

            M.DialogNum ++;
            M.Reset = DialogSystem[M.DialogNum];

            if(M.DialogNum != 3){
              
                M.NumD = Math.floor((Math.random() * 13));
                setTimeout(DialogSet,1500);
                
            } else M.NumD = 0;

        }

        // Camera

        function CameraMove(){

            var Y = 0, X = 0 , NX = NLi[0].PX, NY = NLi[0].PY;

            if(game.key.down) Y = 20;
            if(game.key.up) Y = -20;
            if(game.key.right) X = 20;
            if(game.key.left) X = -20;
            
            if((X != 0 || Y != 0) && !NLi[0].Stop){

                NLi[0].Follow = true;
                DogAISet(NLi[0],2,NX+X,NY+Y);
                NLi[0].SPX = NX+X; 
                NLi[0].SPY = NY+Y;
                
                if(Mi[7])
                for(var x = 1; x < NLi.length; x++) if(NLi[x].Follow) 
                DogAISet(NLi[x],3,NX,NY);
    
            }

            CameraBlock(NX-960,NY-540);
            CameraCheck();

        }

        function CameraBlock(Xm,Ym){

            if(Xm >= 0 && Xm <= (12*1080)-1920)
            M.PX = Xm; else if(Xm <= 0) M.PX = 0; 
            else M.PX = (12*1080)-1920;
            
            if(Ym >= 0 && Ym <= (12-1)*1080)
            M.PY = Ym; else if(Ym <= 0) M.PY = 0; 
            else M.PY = (12-1)*1080;
            
        }

        function CameraCheck(){

            if(M.InChX != null)
            var CHx = JSON.parse(JSON.stringify(M.InChX)), 
                CHy = JSON.parse(JSON.stringify(M.InChY));

            for(var x = 0; x < 12; x++) for(var y = 0; y < 12; y++){
                
                if( M.PX+960 > 1080*x && M.PX+960 < 1080+1080*x) M.InChX = x;
                if( M.PY+540 > 1080*y && M.PY+540 < 1080+1080*y) M.InChY = y;
        
            }

            if(CHx != M.InChX || CHy != M.InChY)
            ChangeObjects();

        }

        function ChangeObjects(){
            
            var NewList = [];

            for (var x = 0; x < SortList.length; x++) 
            if(SortList[x].Fun) NewList.push(SortList[x]);
            
            
            for(var x = -1; x < 2; x++) for(var y = -1; y < 2; y++)
            if(M.InChY+y > -1 && M.InChX+x > -1 && M.InChY+y < 12 && M.InChX+x < 12) 
            for (var z = 0; z < Chunks[Map[M.InChY+y][M.InChX+x]].length; z++){

                var Obj = JSON.parse(JSON.stringify(Chunks[Map[M.InChY+y][M.InChX+x]][z]));

                Obj.PX += (1080*M.InChX)+(1080*x);
                Obj.PY += (1080*M.InChY)+(1080*y);
                
                if(Mi[2] && !Obj.Spec)
                NewList.push(Obj);

                if(Obj.Spec)
                NewList.push(Obj);

            }
            
            SortList = NewList;
        
        }

        function ChunkCheck(NPC){
            
            var Chunk = null;

            for(var x = -1; x < 2; x++) for(var y = -1; y < 2; y++)
            if(M.InChY+y > -1 && M.InChX+x > -1 && M.InChY+y < 12 && M.InChX+x < 12)
            if( NPC.PX > ((1080*M.InChX)+(1080*x)) && NPC.PX < ((1080*M.InChX)+(1080*x))+1080 && NPC.PY > ((1080*M.InChY)+(1080*y)) && NPC.PY < ((1080*M.InChY)+(1080*y))+1080)
            Chunk = true;

            if(Chunk != null) {
                
                if( NPC.Draw == null ){ 
                    
                    NPC.Draw = true;

                    SortList.push(NPC);
        
                    return
                    
                }

            } else {

                if(NPC.Draw != null){
                    
                    NPC.Draw = null;

                    var NewList = [];

                    for (var x = 0; x < SortList.length; x++) 
                    if(SortList[x].Draw != null || !SortList[x].Fun) NewList.push(SortList[x]);
                    
                    SortList = NewList;
                
                }

            }

        }

        // NPC 

        function DogAISet(Dogi,Mode,X,Y){
          
            if(!Dogi.Stop){
              
                Dogi.Mode = Mode;

                var Data = DogAi[Dogi.Mode];
                
                Dogi.Speed = Data.Speed;
               
                if(Data.Speed == null)
                Dogi.Speed = Math.floor((Math.random() * 5)+5);
                
                if(Dogi.Speed) SetPath(Dogi,X,Y);
                else {
    
                    if(!Math.floor((Math.random() * 2))) 
                    Dogi.Scale = -1; else Dogi.Scale = 1;
                    
                    Dogi.ZeroY+= 5;
    
                }
    
                if(Dogi.ZeroY >= Dogi.PY) var Dir = 0; 
                else var Dir = 1;
                
                Dogi.Data = Files.D[Data.File+Dir];
                Dogi.Counter = Math.floor((Math.random() * Data.Counter)+100);
    
            }

        }

        function DogsMove(NPC){

            if(NPC.Speed && !NPC.Stop) {

                NPC.PX -= NPC.MoveX;
                NPC.PY -= NPC.MoveY;

                NPC.MCounter --;

                if(NPC.MCounter <= 0)
                DogAISet(NPC,1);
                
            } else if(NPC.Counter < 0) { 
                
                if(Mi[7]){

                    if(!NPC.Num && NPC.Follow) DogAISet(NPC,0); 
                    else if(!NPC.Follow) DogAISet(NPC,1);
                    else DogAISet(NPC,0,NLi[0].SPX,NLi[0].SPY);
    
                } else DogAISet(NPC,1);
                
            } else NPC.Counter -= 1;

            ChunkCheck(NPC);

        }

        function SetPath(Data,X,Y){
            
            if(!X && !Data.Num){

                var X = Data.SPX+Math.floor((Math.random() * 200)-100), 
                    Y = Data.SPY+Math.floor((Math.random() * 200)-100);
               
            } else if(Data.Num){
               
                if(Data.Mode != 3){

                    X += Math.floor((Math.random() * 800)-400); 
                    Y += Math.floor((Math.random() * 800)-400);
    
                } else if(!X){

                    var X = NLi[0].SPX+Math.floor((Math.random() * 200)-100), 
                        Y = NLi[0].SPY+Math.floor((Math.random() * 200)-100);
                   
                }
                
            } 

            var t = NPCBlock(X,Y);

            Data.ZeroX = t[0];
            Data.ZeroY = t[1];

            var dx = Data.PX-Data.ZeroX,
                dy = Data.PY-Data.ZeroY,
                angle = Math.atan2(dy, dx);

                Data.MoveX = Math.round(((Data.Speed * Math.cos(angle)) + Number.EPSILON) * 100) / 100;
                Data.MoveY = Math.round(((Data.Speed * Math.sin(angle)) + Number.EPSILON) * 100) / 100;
                
                if(Data.MoveX)
                Data.MCounter = Math.round(Math.abs(dx/Data.MoveX));
                else Data.MCounter = Math.round(Math.abs(dy/Data.MoveY));

            if(Data.Route < 150){
                
                if(Data.MoveX <= 0) 
                Data.Scale = -1; else Data.Scale = 1;
               
            } else {
              
                if(Data.MoveX > 0) 
                Data.Scale = -1; else Data.Scale = 1;
               
            }
           
        }

        function NPCBlock(X,Y){

            if(X > 10 && X < 12*1080-10)
            X = X; else if(X <= 10) X = 10; 
            else X = 12*1080-10;
            
            if(Y > 10 && Y < 12*1080-10)
            Y = Y; else if(Y <= 10) Y = 10; 
            else Y = 12*1080-10;
            
            return [X,Y];

        }

        function NPCAnim(){

            for (var x = 0; x < SortList.length; x++) 
            if (SortList[x].AnX >= SortList[x].MAnX) SortList[x].AnX = 0;
            else if(Mi[1]) SortList[x].AnX++; 
            
        }

        // Events

        window.addEventListener("load", function(){ 
        
            CreateWorld();
            PixelRatio();
            NPCAnim_ = setInterval(NPCAnim,150);
            US_ = requestAnimationFrame(US);

        });

        window.addEventListener("resize", function (event) {
    
            clearTimeout(Resize);
            Resize = setTimeout(PixelRatio, 100);
    
        });

        window.addEventListener('blur', onPause);
        window.addEventListener('focus', onResume);

        function onPause() {
		
            clearInterval(NPCAnim_);
            cancelAnimationFrame(US_);
    
        }
    
        function onResume() {
        
            NPCAnim_ = setInterval(NPCAnim,150);	
            US_ = requestAnimationFrame(US);
    
        }
    

