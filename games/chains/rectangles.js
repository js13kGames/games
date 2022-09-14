	 
	 function PointInsideRectangles(x,y){
	    for (i=0; i<shapes.length; i++)
		  if( x > shapes[i].ct_x - shapes[i].width/2 && x <  shapes[i].ct_x + shapes[i].width/2 && y > shapes[i].ct_y - shapes[i].height/2 && y < shapes[i].ct_y + shapes[i].height/2 )
		      return i;
	    return -1;
	 }

	 function RectangleInsideCanvas(rect,canvas){
	   if(rect.ct_x-rect.width/2 < 0 || rect.ct_x+rect.width/2>canvas.width 
  	   || rect.ct_y-rect.height/2 < 0 || rect.ct_y+rect.height/2 >canvas.height)
		   return false;
		return true
	 }
	 function RectanglesIntersect(rect){		 
	    for(var i=0; i<shapes.length; i++)
		{		
	        if(RectanglesTouch(rect, shapes[i]))
	           return true;
		}
	   return false;	  
	 }
	 function RectanglesTouch(rect1, rect2)
	 {	
   
	    if(rect1.ct_x-rect1.width/2  > rect2.ct_x+rect2.width/2  || rect2.ct_x-rect2.width/2  > rect1.ct_x+rect1.width/2 )
			return false;
		if(rect1.ct_y+rect1.height/2  < rect2.ct_y-rect2.height/2  || rect2.ct_y+rect2.height/2  < rect1.ct_y-rect1.height/2 )
			return false;		
	    return true;	  
	 }
	 function DrawMistakeRectangle(rect)
	 {	   
	   var dotsPerShortSide=6;
	   
       var interval=Math.min(rect.width, rect.height)/dotsPerShortSide; 	

       for (var i=0; i<=rect.width; i+=interval)
	   {
		    var x= rect.ct_x-rect.width/2 +i;
			var y= rect.ct_y-rect.height/2;
			
		    context.beginPath();
            context.arc(x,y,1,0,Math.PI*2);
			context.arc(x,y+rect.height,1,0,Math.PI*2);
            context.closePath();
			context.fillStyle="#000000";
            context.fill();		   
	   }
	   for (var i=0; i<=rect.height; i+=interval)
	   {
		    var x= rect.ct_x-rect.width/2 ;
			var y= rect.ct_y-rect.height/2 +i;
			
		    context.beginPath();
            context.arc(x,y,.8,0,Math.PI*2);
			context.arc(x+rect.width,y,.8,0,Math.PI*2);
            context.closePath();
			context.fillStyle="white";
            context.fill();		   
	   }
	 }
	 
	 function DrawRectangle(r)
	 {
		context.beginPath();
        context.rect( r.ct_x - r.width/2, r.ct_y-r.height/2, r.width, r.height );
		if(r.chain==0)
			context.fillStyle = r.clr;
		else
			context.fillStyle = chains[r.chain-1].clr;
        context.fill();
        context.closePath();
		
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.rect( r.ct_x - r.width/2+8, r.ct_y-r.height/2+8, r.width-16, r.height-16 );
        context.fillStyle = "black";
	    context.fill();
		context.closePath();
		context.globalCompositeOperation = 'source-over'; 
	 }


   
