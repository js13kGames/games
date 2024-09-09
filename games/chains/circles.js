	 
	 function PointInsideCircles(x,y){
	    for (i=0; i<shapes.length; i++)
		  if( (x-shapes[i].ct_x)*(x-shapes[i].ct_x)+ (y-shapes[i].ct_y)*(y-shapes[i].ct_y) <  (shapes[i].r+3)*(shapes[i].r+3))
		      return i;
	    return -1;
	 }

	 function CircleInsideCanvas(circle,canvas){
	   if(circle.ct_x-circle.r < 0 || circle.ct_x+circle.r >canvas.width 
  	   || circle.ct_y-circle.r < 0 || circle.ct_y+circle.r >canvas.height)
		   return false;
		return true
	 }
	 function CirclesIntersect(circle){	 
	    for(var i=0; i<shapes.length; i++)		
	        if(Math.pow(circle.ct_x-shapes[i].ct_x,2)+ Math.pow(circle.ct_y-shapes[i].ct_y,2)<Math.pow(circle.r+shapes[i].r,2))
	           return true;
	   return false;	  
	 }
	 function CirclesTouch(circle1, circle2){	 		
	    if(Math.pow(circle1.ct_x-circle2.ct_x,2)+ Math.pow(circle1.ct_y-circle2.ct_y,2)<=Math.pow(circle1.r+circle2.r,2))
	         return true;
	 return false;	  
	 }
	 function DrawMistakeCircle(circle)
	 {	   
	   var dotsPerCircle=20;

       var interval=(Math.PI*2)/dotsPerCircle;   
       
       var centerX=circle.ct_x;
       var centerY=circle.ct_y;
       var radius=circle.r;
       
       for(var i=0;i<dotsPerCircle;i++)
	   {
       
           desiredRadianAngleOnCircle = interval*i;
           
           var x = centerX+radius*Math.cos(desiredRadianAngleOnCircle);
           var y = centerY+radius*Math.sin(desiredRadianAngleOnCircle);
       
            context.beginPath();
            context.arc(x,y,1,0,Math.PI*2);
            context.closePath();
			context.fillStyle="white";
            context.fill();
           
       }   	   	 
	 }
	 
	 function DrawCircle(c){
		context.beginPath();
        context.arc(c.ct_x, c.ct_y, c.r, 0, 2 * Math.PI, false);
		if(c.chain==0)
			context.fillStyle = c.clr;
		else
			context.fillStyle = chains[c.chain-1].clr;
					
        context.fill();
        context.closePath();
		
		context.globalCompositeOperation = 'destination-out';
		context.beginPath();
		context.arc(c.ct_x, c.ct_y, c.r-10, 0, 2 * Math.PI, false);
    	context.fillStyle = "black";						
        context.fill(); 
		context.closePath();
		context.globalCompositeOperation = 'source-over'; 
	 }
	 	

