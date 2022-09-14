
	  var colors=["white","yellow", "Aqua", "Salmon","Blue", "Fuchsia", "SeaGreen","orange","BlueViolet","Silver", "red","purple","Chartreuse","DeepPink"];
	  var color_ind=0;;
	  var shapes=[];
	  var chains=[];
	  var score=0;
	  var longest_score=0;
	  var canvas = document.getElementById('myCanvas');
	  var context = canvas.getContext('2d');
	  var Start=true;
	  var interv;
	  
	  function shape(ct_x, ct_y,type){
		this.type=type;
		if(type=="rectangle")
		{
	      var measures=[19,24 ];
	      var ind=Math.floor(Math.random() * 2);
	      this.width=measures[ind];
	      switch(ind){
		     case 0: 
		      this.height=measures[1];
		      break;
		     case 1: 
		      this.height=measures[0];
		      break;
		   		   
	       }
	      this.height=ind==0?measures[1]:measures[0]; 
		}
		else if(type=="circle")
			this.r=12;
		
	    this.ct_x=ct_x;
		this.ct_y=ct_y;
	    this.clr=colors[0];
	    this.growing=true;	 
        this.chain=0;		
	  }
	  function chain(link1,link2)
	  {
		this.shapes=[]; 	
		this.shapes.push(link1);
		this.shapes.push(link2);
		this.length=2;
        color_ind=(color_ind+1)%colors.length;
        if(!color_ind)
			color_ind++;			
        this.clr = colors[color_ind];
		console.log(colors[color_ind]);	
	  }
	  
	   function redraw()
	  {
	     context.clearRect(0, 0, canvas.width, canvas.height);
         for (var i=0; i<shapes.length; i++)
    	  {
            context.beginPath();
			if (shapes[i].type=="circle")
		      DrawCircle(shapes[i]);
		   else if (shapes[i].type=="rectangle")
			   DrawRectangle(shapes[i]);
    	   }  
     }
	 