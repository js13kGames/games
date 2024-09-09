    
    window.addEventListener("load", function(){ 
        
		PixelRatio();

        CreateWorld();

		RenderObjects.OldRekord = Number(localStorage.getItem('Rekord'));
        RenderObjects.TRekord = [RenderObjects.OldRekord];

        window.addEventListener('blur', onPause);
        window.addEventListener('focus', onResume);
        
        window.addEventListener('mousemove', function(e){
            
            MainData.TouchX = e.clientX * pixelRatio;
            MainData.TouchY = e.clientY * pixelRatio;
            
        }, false)

        document.addEventListener('contextmenu', event => event.preventDefault());

        window.addEventListener('mousedown', function(e){
            
            if(e.button == 2)
            if(!RenderObjects.Start){

                MainBlocksAdd();
                RenderObjects.Start = true;

            }

		    if(RenderObjects.Start)
            if(e.button == 0)
            if(!RenderObjects.SpeedType)
            RenderObjects.SpeedType = true;
            else RenderObjects.SpeedType = false;

        }, false)

		TimeInter.UpdateScreen = requestAnimationFrame(UpdateScreen);

    });

    window.addEventListener("resize", function (event) {

        clearTimeout(Resize);
		Resize = setTimeout(PixelRatio, 500);

    });

	function UpdateScreen(){  
       
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();	
           
            ctx.translate(MainData.DiffX,MainData.DiffY); 
        
            DrawWorld();

        ctx.restore();
        
        TimeInter.UpdateScreen = requestAnimationFrame(UpdateScreen);

	}

    function onPause() {
		
        cancelAnimationFrame(TimeInter.UpdateScreen);
       
    }

    function onResume() {
	
        cancelAnimationFrame(TimeInter.UpdateScreen);
        TimeInter.UpdateScreen = requestAnimationFrame(UpdateScreen);
      
	}
