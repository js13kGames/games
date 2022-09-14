	
	var Keys = function () {

		this.key = {
			space: false,
		};

		window.onkeydown = this.keydown.bind(this);
		window.onkeyup = this.keyup.bind(this);

	};
	
	Keys.prototype.keydown = function (e) {

		e.preventDefault();

		var _this = this;

		switch (e.keyCode) {
		case 32:
			_this.key.space = true;
			break;
		}

	};

	Keys.prototype.keyup = function (e) {

		e.preventDefault();

		var _this = this;
		
		switch (e.keyCode) {
		case 32:
			_this.key.space = false;
			break;
		}

	};

	var Keyboard = new Keys();

	var myStorage = localStorage;

	var windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		pixelRatio = window.devicePixelRatio || 1;

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

		canvas.width = windowWidth * pixelRatio;
		canvas.height = windowHeight * pixelRatio;

		canvas.style.width = windowWidth + 'px';
		canvas.style.height = windowHeight + 'px';	
	
	function PixelRatio(){ 
	
			windowWidth = window.innerWidth;
			windowHeight = window.innerHeight;
			pixelRatio = window.devicePixelRatio || 1;
			
			pixelRatio /= Bonus.pixelRatiodev; 

			canvas.width = windowWidth * pixelRatio;
			canvas.height = windowHeight * pixelRatio;
	
			canvas.style.width = windowWidth + 'px';
			canvas.style.height = windowHeight + 'px';
	
			var Height = windowHeight* pixelRatio , Width = windowWidth* pixelRatio;
	
			if(Math.floor((windowHeight / (windowWidth + windowHeight)) * 100) > 36)
				for (;Math.floor((windowHeight / (windowWidth + windowHeight)) * 100) != 36;)
					windowHeight = Math.round(36 * ((windowWidth + windowHeight) / 100));
	
			if (Math.floor((windowWidth / (windowWidth + windowHeight)) * 100) > 64)
				for (;Math.floor((windowWidth / (windowWidth + windowHeight)) * 100) != 64;)
					windowWidth = Math.round(64 * ((windowWidth + windowHeight) / 100));
	
			MainData.PxW = ((windowWidth * pixelRatio) / 1920);
			MainData.PxH = ((windowHeight * pixelRatio) / 1080);
	
			MainData.DiffY = ((Height - windowHeight* pixelRatio)) / 2;
			MainData.DiffX = ((Width - windowWidth* pixelRatio)) / 2;
		
		MainData.Width = 1920*MainData.PxW;
		MainData.Height = 1080*MainData.PxH;

	}

	function TextDraw(TData,SText){ 
	
		for(var h = 0; h < TData.Num; h++) {
			
			var TextF = TData[h].Data, 
				Data = TextData[TextF.Data]; 

			if(TData[h].SText) {
				
				var TN = SText; 
				
				for (var x = 0; x < TN.length; x++) 
				FontDraw(String(TN[x]),TextF,Data,x);
			
			} else {
				
				var TN = Text[TData[h].Text]; 
				
				for (var x = 0; x < TN.length; x++) 
				FontDraw(TN[x],TextF,Data,x);
				
			}

		}
	
	}
	
	function FontDraw(TN,TextF,Data,Enter){
		
		ctx.save();	

		if(Enter > 0)
		var PY = TextF.PY+((Data.Size+Data.Enter)*Enter);
		else var PY = TextF.PY;

		ctx.font = Data.Spec+" "+(Data.Size*MainData.PxW)+"px "+Data.Font;
		ctx.textAlign = TextF.Align;

		if(Data.SColor){
		
			ctx.lineWidth = Data.LWidth*MainData.PxW;
			ctx.strokeStyle = Data.SColor;
			ctx.lineJoin = Data.LineJoin;
			ctx.strokeText(TN, TextF.PX*MainData.PxW, (PY+Data.SPY)*MainData.PxH);

		}

		if(Data.ShadowColor){
		
			ctx.shadowOffsetX = Data.OffsetX;
			ctx.shadowOffsetY = Data.OffsetY;
			ctx.shadowColor = Data.ShadowColor;
			ctx.shadowBlur = Data.ShadowBlur;
	
		}

		ctx.fillStyle = Data.Color;
		ctx.fillText(TN, TextF.PX*MainData.PxW, PY*MainData.PxH);

		ctx.restore();

	}
	
	function CreateWorld(){
		
		for (var z = 0; z < 17; z++) {
			
			World.push([]);
			
			for (var y = 0; y < 14; y++){

				World[z].push([
					
					Random(10),
					Random(4),
					30*z-50,
					
				]);

			}
			
		}
		
		for (var y = 0; y < 14; y++) BuildAdd(100-(Random(5)+RenderObjects.SpawnD[y]),y);
		for (var y = 0; y < 14; y++) BuildAdd(300+(Random(5)+RenderObjects.SpawnD[y]),y);
	
		MakeGraphics();

	}

	function MainBlocksAdd(){

		var Xspawn = [
			[true,null,true],
			[null,true,true],
			[true,true,null],
			[null,true,null],
			[true,null,null],
			[null,null,true],
		];

		for (var x = 0; x < 12; x++) {
			
			var Ran = Xspawn[Random(6)];

				RenderObjects.BlockList.push([])

				RenderObjects.List.push({

					"Height": 85/2,
					"Width": 69+60,
		
					"PX": 157-60,
					"PY": -(650*x),
		
				});	
		
				if(Ran[0] == null) 
				RenderObjects.List[RenderObjects.List.length-1].PX = 900;

				RenderObjects.BlockList[x].push(RenderObjects.List[RenderObjects.List.length-1]);

				RenderObjects.List.push({
		
					"Height": 85/2,
					"Width": 42,
		
					"PX": 222,
					"PY": -(650*x),
		
				});	
				
				if(Ran[1] == null) 
				RenderObjects.List[RenderObjects.List.length-1].PX = 900;

				RenderObjects.BlockList[x].push(RenderObjects.List[RenderObjects.List.length-1]);

				RenderObjects.List.push({
		
					"Height": 85/2,
					"Width": 69+60,
		
					"PX": 260,
					"PY": -(650*x),
		
				});	
		
				if(Ran[2] == null) 
				RenderObjects.List[RenderObjects.List.length-1].PX = 900;

				RenderObjects.BlockList[x].push(RenderObjects.List[RenderObjects.List.length-1]);

		}
	
	}

	function BlockMove(){

		var Xpos = [157-60,222,260],
			Xspawn = [
				[true,null,true],
				[true,null,true],
				[true,null,true],
				[null,true,null],
				[true,null,null],
				[true,null,true],
				[null,null,true],
				[true,null,true],
			];
	
		for(var x = 0; x < RenderObjects.BlockList.length; x++) {

			if(RenderObjects.BlockList[x][0].PY > 900){

				var Val = 10000;

					for(var z = 0; z < RenderObjects.BlockList.length; z++)
					Val = Math.min(RenderObjects.BlockList[z][0].PY, Val);
	
				if(x == RenderObjects.BlockList.length-1)
				if(RenderObjects.Yspawn > 400) RenderObjects.Yspawn -= 50;
				else if(RenderObjects.Yspawn > 300) RenderObjects.Yspawn -= 10;
				else if(RenderObjects.Yspawn > 250) RenderObjects.Yspawn -= 5;

					RenderObjects.BlockList[x][0].PY = Val-RenderObjects.Yspawn;
	
				var Ran = Xspawn[Random(8)],
					Rand = Random(60)-30;

					if(Ran[0]) RenderObjects.BlockList[x][0].PX = Xpos[0]+Rand;
					else RenderObjects.BlockList[x][0].PX = 900;

					if(Ran[1]) RenderObjects.BlockList[x][1].PX = Xpos[1]+Rand;
					else RenderObjects.BlockList[x][1].PX = 900;

					if(Ran[2]) RenderObjects.BlockList[x][2].PX = Xpos[2]+Rand;
					else RenderObjects.BlockList[x][2].PX = 900;
		
			}

			RenderObjects.BlockList[x][0].PY += Wposition.Blockmove/Wposition.MoveSlow;
			RenderObjects.BlockList[x][1].PY = RenderObjects.BlockList[x][0].PY;
			RenderObjects.BlockList[x][2].PY = RenderObjects.BlockList[x][0].PY;

			for(var y = 0; y < RenderObjects.BlockList[x].length; y++){
				
				var Obj = RenderObjects.BlockList[x][y];
				
				if(Camera3D.cX+Mouse.MouseXY_2[0] <= Obj.PX+Obj.Width && Camera3D.cY <= Obj.PY+Obj.Height){
					
					if(Camera3D.cX+Mouse.MouseXY_2[0] >= Obj.PX && Camera3D.cY >= Obj.PY){

						Check = true;

						RenderObjects.Live = Math.floor(RenderObjects.Live-(5/Wposition.MoveSlow));
						
						if(RenderObjects.Live <= 0){
							
							var List = [];
	
							for (let v = 0; v < 28; v++)
							List.push(RenderObjects.List[v]);
							
							RenderObjects.List = List;
	
							RenderObjects.BlockList = [];
							Wposition.MoveSlow = 1;
							RenderObjects.Start = false;
							RenderObjects.Live = 100;
							
							Mouse.MouseXY = [0,0];
							Mouse.MouseXY_2 = [0,0];
							
							RenderObjects.Yspawn = 650;
	
							RenderObjects.Rekord = Math.floor(RenderObjects.Meters*RenderObjects.Bonus);
	
							if(RenderObjects.Rekord > RenderObjects.OldRekord){
	
								RenderObjects.TOldRekord = ["NEW HIGH SCORE"];
								RenderObjects.OldRekord = RenderObjects.Rekord;
	
								localStorage.setItem('Rekord',RenderObjects.OldRekord);
							
							} else {
	
								RenderObjects.TOldRekord = ["HIGH SCORE "+RenderObjects.OldRekord];
							
							}
	
							RenderObjects.TRekord = [RenderObjects.Meters + "  x "+(Math.floor(RenderObjects.Bonus * 100) / 100)+" = "+RenderObjects.Rekord+" pkt"];
	
							RenderObjects.Meters = 0;
							RenderObjects.Bonus = 1;
							
							return;
	
						}
	
					}

				}

			}
			
		}
	
		if(RenderObjects.Start){

			RenderObjects.Meters += Wposition.Blockmove/Wposition.MoveSlow;

			if(Wposition.MoveSlow < 1)
			RenderObjects.Bonus += 0.01;
			else if(Wposition.MoveSlow > 1 && RenderObjects.Bonus > 1)
			RenderObjects.Bonus -= 0.01;
			else if(RenderObjects.Bonus < 1)
			RenderObjects.Bonus = 1;
			
		}

	}

	function BuildAdd(Xval,y){

		RenderObjects.List.push({

			"TMX_": y,

			"Height": 85,
			"Width": 85,

			"PX": Xval,
			"PY": 85*y,

		});	

		RenderObjects.ListC.push(RenderObjects.List[RenderObjects.List.length-1]);

	}

	function DrawWorld(){

			DrawRect(-100-Mouse.MouseXY[0],-200-Mouse.MouseXY[1],1920+200,800,"#160546");

			DrawRect(-100-Mouse.MouseXY[0],600-Mouse.MouseXY[1],1920+200,480+200,"#3c3c3c");

				for (var z = 0; z < 17; z++){

					ctx.save();
					ctx.translate((-18-(Mouse.MouseXY[0]))* MainData.PxW,(35-Mouse.MouseXY[1]+Wposition.Y)* MainData.PxH); 
					
					ctx.drawImage(
						Images["Black"], 3, 4, 5, 3,
						( (1920/2) + (45-(z*2)) - (15*(45-(z*2)))/2 ) * MainData.PxW, 
						((1050 - (42*z))+(z*10)) * MainData.PxH, 
						(15*(45-(z*2))) * MainData.PxW, 
						42 * MainData.PxH
					);

					ctx.restore();

				} 
				
				for (var z = World.length-1; z > 0 ; z--) {

					ctx.save();

					ctx.beginPath();
			
					ctx.translate(-(Mouse.MouseXY[0]),-20-Mouse.MouseXY[1]); 
				
					for (var y = 0; y < World[z].length; y++) {
					
						if(World[z][y][0] > 8){
						
							ctx.save();

							ctx.drawImage(
								Images["Black2"], (7*World[z][y][1]), 0, 7, 6,
								( (1920/2) + ((70-(z*3))*y) - (World[z].length*(70-(z*3)))/2 )*MainData.PxW, 
								(World[z][y][2]-(z*10))*MainData.PxH, 
								(50-(z*3))*MainData.PxW, 
								(60-(z*3))*MainData.PxH
							);

							ctx.restore();

						}
						
					}

					ctx.closePath();
				
					ctx.restore();

				}

			DrawRect(0-Mouse.MouseXY[0],490-Mouse.MouseXY[1],1920,110,"#110338");

			ctx.save();

			ctx.beginPath();
			
				ctx.translate(0, (1080/2-Mouse.MouseXY[1])*MainData.PxH);
				
					for (var y = 0; y < Camera3D.Rays.length; y++)
					for (var x = Camera3D.Rays[y].length-1; x > -1; x--)
					{

						if(Camera3D.Rays[y][x].File)
						ctx.drawImage(Images["Black"], 0, 0, 1, 7,
							(y*1920/Camera3D.Quality)* MainData.PxW, Camera3D.Rays[y][x].Start * MainData.PxH, 
							(1+1920/Camera3D.Quality) * MainData.PxW, (Camera3D.Rays[y][x].End-Camera3D.Rays[y][x].Start) * MainData.PxH);

					}

			ctx.closePath();
		
			ctx.restore();
			
			ctx.save();
			ctx.translate(((-2+Random(4))/Wposition.MoveSlow)* MainData.PxW, ((-2+Random(4))/Wposition.MoveSlow)* MainData.PxH);

				DrawGraphics(0);

			ctx.restore();

			ctx.save();
			ctx.translate(((-1+Random(2))/Wposition.MoveSlow)* MainData.PxW, ((-1+Random(2))/Wposition.MoveSlow)* MainData.PxH);

				DrawGraphics(1);

				ctx.save();
				ctx.translate(1350* MainData.PxW, 930* MainData.PxH);
				ctx.rotate(2.3);

					DrawRect(0,0,60,180,"Black");

					ctx.globalAlpha = 1-(RenderObjects.Live/100);

					DrawRect(0,0,60,180,"Red");

				ctx.restore();

				ctx.save();
				ctx.translate(1250* MainData.PxW, 900* MainData.PxH);
				ctx.rotate(0.75);

					TextDraw(TextData.Live,[RenderObjects.Live]);

				ctx.restore();

				ctx.save();
				ctx.translate(698* MainData.PxW, 808* MainData.PxH);
				ctx.rotate(0.8);

					DrawRect(0,0,60,180,"Black");

				ctx.restore();

				ctx.save();

					ctx.globalAlpha = 0.4;

					ctx.beginPath();
						
						ctx.save();
						ctx.beginPath();

						ctx.translate(690* MainData.PxW, 790* MainData.PxH);

						ctx.rotate(0.8);

						ctx.scale(0.2,0.2);
						
							ctx.strokeStyle = "yellow";

							for (var y = 0; y < Camera3D.Rays.length; y++) {
								
								ctx.lineWidth = 18;
								ctx.moveTo(Camera3D.Rays[y][0].SPX* MainData.PxW, Camera3D.Rays[y][0].SPY* MainData.PxH);
								ctx.lineTo(Camera3D.Rays[y][0].EPX* MainData.PxW, Camera3D.Rays[y][0].EPY* MainData.PxH);

							}

						ctx.stroke();
						ctx.restore();

					ctx.closePath();

				ctx.restore();
		
			ctx.restore();

			DrawRect(0, 0, 1920,-600,"Black");
			DrawRect(0, 1080 ,1920,600,"Black");

			DrawRect(0, 0, -400,1080+1200,"Black");
			DrawRect(1920, 0 , 400,1800+1200,"Black");

		Rays();
		
		if(!RenderObjects.Start){
				
			DrawGraphics(2);

				ctx.save();

					ctx.globalAlpha = 0.4;

					DrawRect(530, 420 ,870,200,"#7a65e6");

				ctx.restore();
		
			DrawGraphics(3); 

			DrawGraphics(4); 
			DrawGraphics(5); 

			TextDraw(TextData.StartText);

			TextDraw(TextData.SpecText_2,RenderObjects.TOldRekord);
			TextDraw(TextData.Rekord,RenderObjects.TRekord);

		}

		if(Wposition.Y < Wposition.Ycounter)
		Wposition.Y += Wposition.Yplus/Wposition.MoveSlow; else Wposition.Y = 0;
			
		if(Wposition.Counter < Wposition.Countermove)
		Wposition.Counter += 1/Wposition.MoveSlow; else 
		{
			
			Wposition.Counter = 0;
			
			var List = [];

			for (var z = 1; z < World.length; z++) 
			List.push(World[z]);
				
			List.push([]);

			for (var y = 0; y < World[0].length; y++)
			List[List.length-1].push([
				
				Random(10),
				Random(4),
				null,
			
			]);

			for (var z = 0; z < List.length; z++) 
			for (var y = 0; y < World[0].length; y++)
			List[z][y][2] = 40*z-50;

			World = List;

		}

		for(var x = 0; x < RenderObjects.ListC.length/2; x++)
		RenderObjects.ListC[x].PY += Wposition.Blockmove/Wposition.MoveSlow;

		for(var y = 0; y < RenderObjects.ListC.length/2; y++) 
		if(RenderObjects.ListC[y].PY > 1000){
			
			var Val = 10000;

			for(var x = 0; x < RenderObjects.ListC.length/2; x++)
			Val = Math.min(RenderObjects.ListC[x].PY, Val);

			RenderObjects.ListC[y].PY = Val-85;

			RenderObjects.ListC[y].PX = 100-(Random(5)+RenderObjects.SpawnD[y]);
			RenderObjects.ListC[y+RenderObjects.ListC.length/2].PX = 300+(Random(5)+RenderObjects.SpawnD[y]);

		}
	
		for(var x = RenderObjects.ListC.length/2; x < RenderObjects.ListC.length; x++)
		RenderObjects.ListC[x].PY = RenderObjects.ListC[x-RenderObjects.ListC.length/2].PY;
	
		BlockMove();

		if(RenderObjects.Start)
		MouseMove();

	}

	function DrawRect(PX,PY,Width,Height,fillStyle){

		ctx.save();

			ctx.beginPath();

				ctx.fillStyle = fillStyle;

				ctx.rect(
					PX*MainData.PxW, 
					PY*MainData.PxH, 
					Width*MainData.PxW, 
					Height*MainData.PxH, 
				);
					
				ctx.fill();

			ctx.closePath();
		
		ctx.restore();

	}

	function MouseMove(){

		if(Keyboard.key.space){
			
			if(RenderObjects.SpeedType)
			Wposition.MoveSlow = 0.5;
			else Wposition.MoveSlow = 2;

		} else Wposition.MoveSlow = 1;

		Mouse.MouseXY[0] = Math.floor(((MainData.TouchX-(MainData.Width/2)) / (MainData.Width/2)) * 40);
		Mouse.MouseXY_2[0] = Math.floor(((MainData.TouchX-(MainData.Width/2)) / (MainData.Width/2)) * 160);

		Mouse.MouseXY[1] = Math.floor(((MainData.TouchY-(MainData.Height/2)) / (MainData.Height/2)) * 50);

		if(Mouse.MouseXY[0] > 40) Mouse.MouseXY[0] = 40;
		else if(Mouse.MouseXY[0] < -40) Mouse.MouseXY[0] = -40;

		if(Mouse.MouseXY_2[0] > 45) Mouse.MouseXY_2[0] = 45;
		else if(Mouse.MouseXY_2[0] < -60) Mouse.MouseXY_2[0] = -60;

		if(Mouse.MouseXY[1] > 50) Mouse.MouseXY[1] = 50;
		else if(Mouse.MouseXY[1] < -50) Mouse.MouseXY[1] = -50;

	}

	function DrawGraphics(Num){

		for (var x = 0; x < Graphics[Num].length; x++) {
		
			var GH = Graphics[Num],
				MGH = MGraphics[Num];
			
			for (var y = 0; y < GH[x].length; y++)
			if(GH[x][y] != null){

				var Cl = "Black";

				ctx.save();

					ctx.beginPath();

						switch (GH[x][y]) {
							case 1:
								Cl = "#333333"
								break;
							case 2:
								Cl = "Green"
								break;
							case 3:
								Cl = "Gray"
								break;
							case 4:
								Cl = "#7a65e6"
								break;
							case 5:
								Cl = "#1e6f80"
								break;
							case 9:
								Cl = "Yellow"
								break;
							default:
								break;
						}

						ctx.fillStyle = Cl;

						ctx.rect(
							(MGH.X+MGH.W*y-2)*MainData.PxW, (MGH.Y+MGH.H*x-2)*MainData.PxH, 
							4+MGH.W*MainData.PxW, 4+MGH.H*MainData.PxH, 
						);
							
						ctx.fill();

					ctx.closePath();
				
				ctx.restore();
	
			}
			
		}

	}

	function MakeGraphics(){
		
		for (var z = 0; z < MGraphics.le; z++) {
			
			var MGH = MGraphics[z].List2;
			
			var NewTab = [],
				Val = 0,
				Val_1 = 0;

			for (var x = 0; x < MGraphics[z].HY; x++){

				NewTab.push([]);

				for (var y = 0; y < MGraphics[z].WX; y++){
					
					var Color = 0;

					switch (MGH[Val]) {
						case -1:
							Color = 0;
							break;
						case 0:
							Color = 0;
							break;
						case 1:
							Color = 1;
							break;
						case 2:
							Color = 2;
							break;
						case 3:
							Color = 3;
							break;
						case 4:
							Color = 4;
							break;
						case 5:
							Color = 5;
							break;
						case 7:
							Color = 7;
							break;
						case 9:
							Color = 9;
							break;
						default:
							break;
					}

					if(y == 0){
						
						if(MGH[Val] == -1)
						NewTab[x].push([0,1,0]);

						if(MGH[Val] == 0)
						NewTab[x].push([1,1,0]);

						if(MGH[Val] == 1)
						NewTab[x].push([1,1,1]);

						if(MGH[Val] == 2)
						NewTab[x].push([1,1,2]);

						if(MGH[Val] == 3)
						NewTab[x].push([1,1,3]);

						if(MGH[Val] == 4)
						NewTab[x].push([1,1,4]);

						if(MGH[Val] == 5)
						NewTab[x].push([1,1,5]);

						if(MGH[Val] == 7)
						NewTab[x].push([1,1,7]);
						
						if(MGH[Val] == 9)
						NewTab[x].push([1,1,9]);

					} else if(
								(NewTab[x][Val_1][0] == 0 && MGH[Val] == 1) || 
								(NewTab[x][Val_1][0] == 1 && MGH[Val] == -1)
							){

						if(MGH[Val] == -1)
						NewTab[x].push([0,1,0]);

						if(MGH[Val] == 0)
						NewTab[x].push([1,1,0]);

						if(MGH[Val] == 1)
						NewTab[x].push([1,1,1]);

						if(MGH[Val] == 2)
						NewTab[x].push([1,1,2]);

						if(MGH[Val] == 3)
						NewTab[x].push([1,1,3]);

						if(MGH[Val] == 4)
						NewTab[x].push([1,1,4]);

						if(MGH[Val] == 5)
						NewTab[x].push([1,1,5]);

						if(MGH[Val] == 7)
						NewTab[x].push([1,1,7]);

						Val_1++;

					} else if(NewTab[x][Val_1][2] != Color) {

						if(MGH[Val] == -1)
						NewTab[x].push([0,1,0]);

						if(MGH[Val] == 0)
						NewTab[x].push([1,1,0]);

						if(MGH[Val] == 1)
						NewTab[x].push([1,1,1]);

						if(MGH[Val] == 2)
						NewTab[x].push([1,1,2]);

						if(MGH[Val] == 3)
						NewTab[x].push([1,1,3]);

						if(MGH[Val] == 4)
						NewTab[x].push([1,1,4]);

						if(MGH[Val] == 5)
						NewTab[x].push([1,1,5]);

						if(MGH[Val] == 7)
						NewTab[x].push([1,1,7]);

						if(MGH[Val] == 9)
						NewTab[x].push([1,1,9]);

						Val_1++;

					} 
					
					else NewTab[x][Val_1][1] ++; 

					Val++;

				}
				
				Val_1 = 0;

			}
			
			MGraphics[z].List = NewTab;

		}

		for (var z = 0; z < MGraphics.le; z++){
			
			var MGH = MGraphics[z].List;
			
			Graphics.push([]);

			for (var x = 0; x < MGH.length; x++) {
		
				Graphics[z].push([]);

				for (var y = 0; y < MGH[x].length; y++) 
				for (var g = 0; g < MGH[x][y][1]; g++)
				if(MGH[x][y][0]) Graphics[z][x].push(MGH[x][y][2]);
				else Graphics[z][x].push(null);

			}

		}
		
	}

	function Rays(){
		
		var X = Camera3D.cX+Mouse.MouseXY[0],
			Y = 100;

		Camera3D.Rays = [];

		var EpX = Camera3D.cX+Mouse.MouseXY_2[0], 
			EpY = Camera3D.cY,
			Check = true,
			Degree = 90+(Camera3D.Degree/2),
			AddDegre = Camera3D.Degree/Camera3D.Quality;
		
		for (var y = 0; y < Camera3D.Quality; y++) {
			
			Camera3D.Rays.push([]);

			var MathDegree = RotateVector([X-EpX,Y-EpY], Degree),
				Angle = -Math.atan2(MathDegree[0], MathDegree[1]),
				XMove = Math.round(((1 * Math.cos(Angle)) + Number.EPSILON) * 100) / 100,
				YMove = Math.round(((1 * Math.sin(Angle)) + Number.EPSILON) * 100) / 100;
				
			for(var x = 0; x < 800 && Check == true; x++){
	
				if(x == 800-1 && Check){

					Check = false;
					
					Camera3D.Rays[Camera3D.Rays.length-1].push({

						File: false,

						SPX: Camera3D.cX, 
						SPY: Camera3D.cY,
						EPX: EpX,
						EPY: EpY,
						
					});
					
				} else {

					var Wall = WallCheck(EpX-XMove,EpY-YMove);

					if(!Wall){

						EpX -= XMove;
						EpY -= YMove;
						
					} else {
						
						EpX = Wall[0];
						EpY = Wall[1];
						
						Check = false;

					var Distance = 500/LineWidth(EpX,EpY,Camera3D.cX,Camera3D.cY);

						Camera3D.Rays[Camera3D.Rays.length-1].push({

							File: true,

							SPX: Camera3D.cX, 
							SPY: Camera3D.cY,
							EPX: EpX,
							EPY: EpY,
							
							Start: -Distance*100,
							End: Distance*100,
							
						});	
						
					}

				}

				if(!Check){

					EpX = Camera3D.cX+Mouse.MouseXY_2[0];
					EpY = Camera3D.cY;

				}

			}
			
			Degree -= AddDegre;

			Check = true;
			
		}

	}

	function WallCheck(Xm,Ym){
	

		for(var y = 0; y < RenderObjects.List.length; y++){
			
			var Obj = RenderObjects.List[y];

			if( Obj != null && Xm >= Obj.PX && Ym >= Obj.PY && Xm <= Obj.PX+Obj.Width && Ym <= Obj.PY+Obj.Height)
			return [Xm,Ym]; 
			
		}	
		
		return false;

	}

	function RotateVector(vec,ang){

		ang = -ang * (Math.PI/180);
		var cos = Math.cos(ang);
		var sin = Math.sin(ang);
		return new Array(Math.round(10000*(vec[0] * cos - vec[1] * sin))/10000, Math.round(10000*(vec[0] * sin + vec[1] * cos))/10000);

	}

	function LineWidth(x,y,x0,y0){

		return Math.sqrt( ( x -= x0 ) * x + ( y -= y0 ) * y );

	}

	function Random(Num){ 
		
		return Math.floor(Math.random() * Num); 
	
	}
