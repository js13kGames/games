var gameData = {};
var renderBoard = [];
var constants={
	cell:{width:16,height:16},
	renderBoard:{columns:32,rows:32},
	screen:{width:512,height:512},
	keys:{left:37,up:38,right:39,down:40},
	counts:{gold:64,blocks:32,death:64,protection:9},
	increments:{gold:64,blocks:8,death:64,protection:-0.25},
	maximums:{gold:64,blocks:128,death:512,protection:8}
};
var gameController = {
	initRenderBoard:function(){
		renderBoard=[];
		while(renderBoard.length<constants.renderBoard.columns){
			var column=[];
			while(column.length<constants.renderBoard.rows){
				var cell={
					column:renderBoard.length,
					row:column.length,
					x:renderBoard.length * constants.cell.width,
					y:column.length * constants.cell.height,
					width:constants.cell.width,
					height:constants.cell.height,
					fillStyle:"#CCCCFF",
					dirty:true
				};
				column.push(cell);
			}
			renderBoard.push(column);
		}
	},
	random:function(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	},
	clearBoard:function(){
		for(var column=0;column<constants.renderBoard.columns;++column){
			for(var row=0;row<constants.renderBoard.rows;++row){
				renderBoard[column][row].fillStyle="#CCCCFF";
				renderBoard[column][row].dirty=true;
			}
		}
	},
	initLevel:function(){
		this.clearBoard();
		renderBoard[gameData.player.column][gameData.player.row].fillStyle="#00FF00";
		renderBoard[gameData.player.column][gameData.player.row].dirty=true;
		var level = gameData.player.level;
		var count=Math.min(Math.floor(constants.counts.gold+level*constants.increments.gold),constants.maximums.gold);
		while(count>0){
			var column=this.random(0,constants.renderBoard.columns-1);
			var row=this.random(0,constants.renderBoard.rows-1);
			if(renderBoard[column][row].fillStyle=="#CCCCFF"){
				renderBoard[column][row].fillStyle="#CCCC00";
				renderBoard[column][row].dirty=true;
				count--;
				gameData.player.goldLeft++;
			}
		}
		count=Math.min(Math.floor(constants.counts.blocks+level*constants.increments.blocks),constants.maximums.blocks);
		while(count>0){
			var column=this.random(0,constants.renderBoard.columns-1);
			var row=this.random(0,constants.renderBoard.rows-1);
			if(renderBoard[column][row].fillStyle=="#CCCCFF"){
				renderBoard[column][row].fillStyle="#808080";
				renderBoard[column][row].dirty=true;
				count--;
			}
		}
		count=Math.min(Math.floor(constants.counts.death+level*constants.increments.death),constants.maximums.death);
		while(count>0){
			var column=this.random(0,constants.renderBoard.columns-1);
			var row=this.random(0,constants.renderBoard.rows-1);
			if(renderBoard[column][row].fillStyle=="#CCCCFF"){
				renderBoard[column][row].fillStyle="#FF0000";
				renderBoard[column][row].dirty=true;
				count--;
			}
		}
		count=Math.min(Math.floor(constants.counts.protection+level*constants.increments.protection),constants.maximums.protection);
		while(count>0){
			var column=this.random(0,constants.renderBoard.columns-1);
			var row=this.random(0,constants.renderBoard.rows-1);
			if(renderBoard[column][row].fillStyle=="#CCCCFF"){
				renderBoard[column][row].fillStyle="#0000FF";
				renderBoard[column][row].dirty=true;
				count--;
			}
		}
		this.draw();
		this.updatePlayerStats();
	},
	init:function(){
		gameData={};
		this.initRenderBoard();
		gameData.player={column:this.random(0,constants.renderBoard.columns-1),row:this.random(0,constants.renderBoard.rows-1),alive:true,score:0,protection:0,moves:0,level:0,goldLeft:0};
		this.initLevel();
	},
	draw:function(){
		var context = document.getElementById("myCanvas").getContext('2d');
		for(var column=0;column<renderBoard.length;++column){
			for(var row=0;row<renderBoard[column].length;++row){
				var cell=renderBoard[column][row];
				if(cell.dirty){
					context.fillStyle=cell.fillStyle;
					context.fillRect(cell.x,cell.y,cell.width,cell.height);
					cell.dirty=false;
				}
			}
		}
	},
	updatePlayerStats:function(){
		if(gameData.player.alive){
			document.getElementById("status").innerHTML="alive";
		}else{
			document.getElementById("status").innerHTML="dead";
		}
		document.getElementById("score").innerHTML=gameData.player.score;
		document.getElementById("protection").innerHTML=gameData.player.protection;
		document.getElementById("moves").innerHTML=gameData.player.moves;
		var ppm=Math.round(gameData.player.score*100/gameData.player.moves)/100;
		document.getElementById("ppm").innerHTML=ppm;
	},
	movePlayer:function(deltaX,deltaY){
		var nextX=gameData.player.column+deltaX;
		var nextY=gameData.player.row+deltaY;
		if(nextX<0 || nextY<0 || nextX>=constants.renderBoard.columns || nextY>=constants.renderBoard.rows){
			return;
		}
		var nextCell = renderBoard[nextX][nextY];
		if(nextCell.fillStyle=="#CCCC00"){
			gameData.player.score++;
			gameData.player.goldLeft--;
			if(gameData.player.goldLeft==0){
				gameData.player.level++;
				gameData.player.column=nextX;
				gameData.player.row=nextY;
				this.initLevel();
				return;
			}
		}else if(nextCell.fillStyle=="#FF0000"){
			if(gameData.player.protection>0){
				gameData.player.protection--;
			}else{
				gameData.player.alive=false;
			}
		}else if(nextCell.fillStyle=="#0000FF"){
			gameData.player.protection++;
		}else if(nextCell.fillStyle=="#808080"){
			return;
		}
		renderBoard[gameData.player.column][gameData.player.row].fillStyle="#FF0000";
		renderBoard[gameData.player.column][gameData.player.row].dirty=true;
		gameData.player.column=nextX;
		gameData.player.row=nextY;
		renderBoard[gameData.player.column][gameData.player.row].fillStyle="#00FF00";
		renderBoard[gameData.player.column][gameData.player.row].dirty=true;
		gameData.player.moves++;
	},
	handleKey:function(key){
		var result=false;
		if(gameData.player.alive){
			if(key==constants.keys.left){
				this.movePlayer(-1,0);
				result=true;
			}else if(key==constants.keys.right){
				this.movePlayer(1,0);
				result=true;
			}else if(key==constants.keys.up){
				this.movePlayer(0,-1);
				result=true;
			}else if(key==constants.keys.down){
				this.movePlayer(0,1);
				result=true;
			}
			this.draw();
			this.updatePlayerStats();
		}
		return result;
	}
};
function handleKey(e){
	if(gameController.handleKey(e.which)){
		e.preventDefault();
	}
}
function main(){
	document.body.onkeydown=handleKey;
	gameController.init();
}
