
class Title {
	constructor(){
		
	}
	init(){
		
	}
	update(){
		
	}
	draw(){
        ctx.font = "50px Courier";
        ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
        ctx.fillText("SLIP", canvas.width*0.5, canvas.height*0.5);
		
        ctx.font = "20px Courier";
        ctx.fillText((mobileCheck() ? "TAP" : "CLICK") + " TO START", canvas.width*0.5, canvas.height*0.9);
	}
	onPointerDown(e){
		changeScene(new Games());
	}
	onPointerUp(e){
	}
	end(){
		
	}
}