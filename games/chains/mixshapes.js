
	  var best=localStorage.getItem("best-chains");
	  if(!best)
		  best=0;

	  document.getElementById('best-container').innerHTML=best;

	 function StartGame()
	 {			  
      var len=shapes.length;
	  for(var i=0; i<len; i++)
		  shapes.pop();

	  score=0;
	  longest_score=0;
	  document.getElementById('best-container').innerHTML=best;
	  document.getElementById('score-container').innerHTML=0;
	  Start=true;	
	  context.clearRect(0, 0, canvas.width, canvas.height);		
	}

	
	  function draw()
	  {
         var growing = false;
         for (var i=0; i<shapes.length; i++)
    	 {
          if(shapes[i].growing)
		  {
			 if(!ShapeInsideCanvas(shapes[i],canvas))
    		    shapes[i].growing=false;
    		 for (var j=0; j<shapes.length; j++ )
			 {
    		     if(i!=j && ShapesIntersect(shapes[i],shapes[j]))  //chain 
				 {    
    			        shapes[i].growing=shapes[j].growing=false;
					if(shapes[i].type!=shapes[j].type )
					{
						if(shapes[i].chain==0 && shapes[j].chain==0 )
						{
							var ch=new chain(shapes[i], shapes[j]);
							var len = chains.push(ch);
							shapes[i].chain=len;    //index to find chain in chains will be shape[i].chain-1
							shapes[j].chain=len;
							DrawShape(shapes[i]);
							DrawShape(shapes[j]);
							score=2;
						}
						else if(shapes[i].chain==0 && shapes[j].chain!=0)
						{
							 console.log("1");
							 chains[shapes[j].chain-1].shapes.push(shapes[i]);
							 shapes[i].chain =  shapes[j].chain;
							 DrawShape(shapes[i]);
							 score=chains[shapes[j].chain-1].shapes.length;
						}
						else if(shapes[i].chain!=0 && shapes[j].chain==0)
					    {
							console.log("2");
							chains[shapes[i].chain-1].shapes.push(shapes[j]);
							shapes[j].chain =  shapes[i].chain;
							DrawShape(shapes[j]);
							score=chains[shapes[i].chain-1].shapes.length;
						}
						else if(shapes[i].chain!=0 && shapes[j].chain!=0 && shapes[i].chain != shapes[j].chain )
						{
							console.log("3");
							var shapes_j=chains[shapes[j].chain-1].shapes;
							for(var k=0; k<shapes_j.length;k++)
							{
								console.log("k=",k);
								chains[shapes[i].chain-1].shapes.push(shapes_j[k]);
								shapes_j[k].chain= shapes[i].chain;
								DrawShape(shapes_j[k]);
							}
							score=chains[shapes[i].chain-1].shapes.length;
						}							
					}
    			//	 break;  //contiue to search other shapes that touch shape i
    			 }
    			}
    		 if(shapes[i].growing)
			 {
				 if(shapes[i].type=="rectangle")
				 {
			       shapes[i].width*=1.03;
				   shapes[i].height*=1.03;
				 }
				 else
				   shapes[i].r=shapes[i].r+1;
    		    growing =true;
			 }
             DrawShape(shapes[i]);
    	   }
    	  }
         if (growing==false)
    	      clearInterval(interv); 
		  
       if(score>longest_score)
			longest_score=score;
	   document.getElementById('score-container').innerHTML=longest_score;
	   if(longest_score > best)
	   {
	     best=longest_score;
	     document.getElementById('best-container').innerHTML= best;
		 window.localStorage.setItem("best-chains", best)
		}		  
     }
	 
	  function StartShape(event){
	   if(!Start)
	      return;
	   
	   var rect = canvas.getBoundingClientRect();
       var x=(event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
       var y= (event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
	   
	   var type=["circle","rectangle"];
	   var ind=Math.floor(Math.random() * 2);
	   var s=new shape(x, y, type[ind]);
       	   
       if (!ShapeInsideCanvas(s,canvas) || ShapeIntersects(s) )
	   {
		    DrawMistake(s);		
		    return;
	    }
					
	   redraw();
	   shapes.push(s);
	   clearInterval(interv);
	   interv=setInterval(draw, 1000/30);
	 }
	 
		 
	function ShapeInsideCanvas(shape,canvas){	
	  if(shape.type=="rectangle")
		  return RectangleInsideCanvas(shape,canvas);
	  else
		  return CircleInsideCanvas(shape,canvas)
	 }
	 
	 
	 function ShapeIntersects(sh){		 
	    for(var i=0; i<shapes.length; i++)
		{		
	        if(ShapesIntersect(sh, shapes[i]))
	           return true;
		}
	   return false;	  
	 }
	 
	 function ShapesIntersect(shape1, shape2)
	 {	
	    if(shape1.type==shape2.type )
		{
		  if(shape1.type=="circle")
		     return CirclesTouch(shape1, shape2)
		  else
		     return RectanglesTouch(shape1, shape2);
		}
	  
	  var circle=shape1.type=="circle"?shape1:shape2;
	  var rect=shape1.type=="circle"?shape2:shape1;
	  
	  var Distance_x = Math.abs(circle.ct_x - rect.ct_x);
      var Distance_y = Math.abs(circle.ct_y - rect.ct_y);

    if (Distance_x > rect.width/2 + circle.r +0.4)  return false; 
	console.log("int 1");
    if (Distance_y > rect.height/2 + circle.r+0.4)  return false; 
	console.log("int 2");
    if (Distance_x <= rect.width/2+.4)	return true;
	console.log("int 3");
  	if (Distance_y <= rect.height/2 +0.4)  return true; 
	console.log("int 4");
    var cornerDistance_sq = Math.pow(Distance_x - rect.width/2, 2) + Math.pow(Distance_y - rect.height/2, 2);

    return cornerDistance_sq -.4 <= Math.pow(circle.r, 2);	  	  
}
	 
	 function DrawMistake(shape)
	 {	   
	   	 if(shape.type=="rectangle")
			 DrawMistakeRectangle(shape);
		 else
			 DrawMistakeCircle(shape);
	 }
	 
function PointInsideShapes(x,y){
	    for (i=0; i<shapes.length; i++)
		if(shapes[i].type=="rectangle")
		{
		  if( x > shapes[i].ct_x - shapes[i].width/2 && x <  shapes[i].ct_x + shapes[i].width/2 && y > shapes[i].ct_y - shapes[i].height/2 && y < shapes[i].ct_y + shapes[i].height/2 )
		      return i;
		}
		else{
			if( (x-shapes[i].ct_x)*(x-shapes[i].ct_x)+ (y-shapes[i].ct_y)*(y-shapes[i].ct_y) <  (shapes[i].r+3)*(shapes[i].r+3))
		      return i;
		}
		
	    return -1;
	 }	

function DrawShape(shape){
	if(shape.type=="rectangle")
			 DrawRectangle(shape);
		 else
			 DrawCircle(shape);
}   