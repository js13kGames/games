var width=360;
var height=540;
var size=60;
var turns=0;
var countM=new Array(9);
var pcolorM=new Array(9);
var gameover=false;
var canvas=document.getElementById("canvas");
var board = canvas.getContext("2d");
var turnind=document.getElementById("turn");
canvas.addEventListener("click", game);
var timer;
var counter=0;
initializeM();
initialize();

function initialize()
{
	gameover = false;
	Minitial();
	drawboard();
	turns=0;
	counter=0;
	timer=setInterval(update, 400);
}

function initializeM()
{
	for(var i=0;i< 9;i++)
	{
		countM[i]=new Array(6);
		pcolorM[i]=new Array(6);
	}
}

function Minitial()
{
	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 6; j++)
		{
			pcolorM[i][j] = "";
			countM[i][j] = 0;	
			}
	}
}

function drawboard()
{
	board.clearRect(0, 0, width, height);
	if(turns% 2 == 0){
		board.strokeStyle = "red";
		turnind.style.backgroundColor="red";
		canvas.style.border="1px solid red";
	}

	else{
		board.strokeStyle = "green";
		turnind.style.backgroundColor="green";
		canvas.style.border="1px solid green";
	
	}
		for(var i=0;i<6;i++){
		for(var j=0;j<9;j++){
			board.strokeRect(i*60,j*60,60,60);
		}}
	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 6; j++)
		{
			if(countM[i][j] == 0)
				continue;
			if(countM[i][j] == 1)
				Circle1(i, j, pcolorM[i][j]);
			else if(countM[i][j] == 2)
				Circle2(i, j, pcolorM[i][j]);
			else
				Circle3(i, j, pcolorM[i][j]);
		}
	}
}

function game(event)
{
	var rect=canvas.getBoundingClientRect();
	var x=event.clientX-rect.left;
	var y=event.clientY-rect.top;
	var row = Math.floor(x/60);
	var column = Math.floor(y/60);

	if(!gameover)
	{
		if(turns%2==0 && (pcolorM[column][row]=="" || pcolorM[column][row]=="red"))
		{
			countM[column][row]++;
			pcolorM[column][row] = "red";
			turns++;
			}
		if(turns%2==1 && (pcolorM[column][row]=="" || pcolorM[column][row]=="green"))
		{
			countM[column][row]++;
			pcolorM[column][row]="green";
			turns++;
		}
	}
}

function fillcorner(i, j){
	countM[i][j]-=2;
	countM[i==8 ? i-1 : i+1 ][j]++;
	countM[i][ j==5 ? j-1 : j+1 ]++;
	pcolorM[ i == 8 ? i-1 : i+1 ][j]=pcolorM[i][j];
	pcolorM[i][ j==5 ? j-1 : j+1 ]=pcolorM[i][j];
	if(countM[i][j]==0)
		pcolorM[i][j] = "";
}

function filledgesy(i, j){
	countM[i][j]-=3;
	countM[i-1][j]++;
	countM[i+1][j]++;
	countM[i][ j==0 ? j+1 : j-1 ]++;
	pcolorM[i][ j==0 ? j+1 : j-1 ]=pcolorM[i][j];
	pcolorM[i-1][j]=pcolorM[i][j];
	pcolorM[i+1][j]=pcolorM[i][j];
	if(countM[i][j]==0)
		pcolorM[i][j]="";
}
function filledgesx(i, j) {
	countM[i][j]-=3;
	countM[ i==0 ? i+1 : i-1 ][j]++;
	countM[i][j-1]++;
	countM[i][j+1]++;
	pcolorM[ i==0 ? i+1 : i-1 ][j]=pcolorM[i][j];
	pcolorM[i][j-1]=pcolorM[i][j];
	pcolorM[i][j+1]=pcolorM[i][j];
	if(countM[i][j]==0)
		pcolorM[i][j] = "";
}
function update()
{

	counter++;

	drawboard();
	var cornerCord = [[0,0], [8,0], [8,5], [0,5]];

	while(unset()){
		if(countM[0][0]>=2){
			fillcorner(0,0);
			break;
		}
		if(countM[8][0]>=2){
			fillcorner(8,0);
			break;
		}		
		if(countM[8][5]>=2){
			fillcorner(8,5);
			break;
		}		
		if(countM[0][5]>=2){
			fillcorner(0,5);
			break;
		}

		for(var i=1;i<8;i++){
			if(countM[i][0]>=3)
				{ 
					filledgesy(i,0); 
					break; 
				}
			if(countM[i][5]>=3){ 
				filledgesy(i, 5);
				break; 
			}
		}
		for(var i = 1; i < 5; i++){
			if(countM[0][i]>=3)
				{ filledgesx(0, i); 
					break;
				 }
			if(countM[8][i]>=3)

				{ filledgesx(8, i);
				 break; }
		}

		for(var i = 1; i < 8; i++){
			for(var j = 1; j < 5; j++){
				if(countM[i][j] >= 4){
					countM[i][j] -= 4;
					countM[i-1][j]++;
					countM[i+1][j]++;
					countM[i][j-1]++;
					countM[i][j+1]++;
					pcolorM[i-1][j]=pcolorM[i][j];
					pcolorM[i+1][j]=pcolorM[i][j];
					pcolorM[i][j-1]=pcolorM[i][j];
					pcolorM[i][j+1]=pcolorM[i][j];
					if(countM[i][j]==0)
						pcolorM[i][j]="";
					break;
				}
			}
		}
		break;
	}
	check();

}

function check()
{
	if(pwin()==1 || pwin()== 2)
	{
		gameover=true;
		drawboard();
		setTimeout(resultscreen.bind(null,pwin()),2500);
		clearInterval(timer);
		setTimeout(initialize,5000);
	}
}
function unset()
{
	var notset=false;
	if(countM[0][0]>=2||countM[8][5]>=2||countM[8][0]>=2||countM[0][5]>=2)
		notset=true;
	for(var i = 1;i < 8;i++)
if(countM[i][0] >= 3 ||countM[i][5]>=3)
			notset= true;
	for(var i = 1; i < 5; i++)
		if(countM[0][i] >= 3||countM[8][i] >= 3)
			notset= true;
	for(var i = 1; i < 8; i++)
for(var j =1; j< 8; j++)
			if(countM[i][j]>=4)
				notset= true;
	return notset;
}

function pwin()
{
	var redcount=0;
	var greencount=0;
	for(var i=0; i<9; i++)
	{
		for(var j=0;j<6;j++)
		{
			if(pcolorM[i][j]=="red") redcount++;
			if(pcolorM[i][j]=="green") greencount++;
		}
	}
	if(turns>1)
	{
		if(redcount==0)
		{
		return 2;
		}
		if(greencount==0)
		{
		return 1;
		}
	}
}
function resultscreen(player)
{
	if(player==1)
	{
		board.clearRect(0,0,width,height);
		board.fillStyle="green";
		board.fillRect(0,0,width,height);
		board.fillStyle="red";
		board.font = "32px Sans";
		board.fillText("RED wins!", width/2-100, height/2-50);
	    turnind.style.backgroundColor="red";
	}
	else
	{
		board.clearRect(0,0,width, height);
		board.fillStyle="red";
		board.fillRect(0,0,width,height);
		board.fillStyle="green";
		board.font = "32px Sans";
		board.fillText("GREEN wins!", width/2-100, height/2-50);
	    turnind.style.backgroundColor="green";
	}
}

function Circle1(row, column, color)
{
	board.beginPath();
	board.arc(column*60+30,row*60+30,10,0,2*Math.PI);
	board.fillStyle=color;
	board.fill();
	if((countM[0][0]==1 && row==0 && column==0) || (countM[8][0]==1 && row==8 && column==0) || (countM[0][5]==1 && row==0 && column==5) || (countM[8][5]==1 && row==8 && column==5))
    {
    	if(counter%2==0)
    		board.strokeStyle="black";
    	else
    		board.strokeStyle=color;

    }
    else
    board.strokeStyle = "black";
	board.lineWidth=2;
	board.stroke();
	board.closePath();
	board.lineWidth=1;
}
function Circle2(row, column, color)
{
	board.beginPath();
	board.arc(column*60+20,row*60+30,10,0,2*Math.PI);
	board.fillStyle=color;
	board.fill();
	if(((row==0 || row==8) && (column<5 && column>=1)) || ((column==0 || column==5) && (row<8 && row>=1)))
    {
    	if(counter%2==0)
    		board.strokeStyle="black";
    	else
    		board.strokeStyle=color;

    }
    else
    board.strokeStyle = "black";
	board.lineWidth=2;
	board.stroke();
	board.closePath();
	board.lineWidth = 1;
	board.beginPath();
	board.arc(column*60+40,row*60+30,10,0,2*Math.PI);
	board.fillStyle = color;
	board.fill();
	if(((row==0 || row==8) && (column<5 && column>=1)) || ((column==0 || column==5) && (row<8 && row>=1)))
    {
    	if(counter%2==0)
    		board.strokeStyle="black";
    	else
    		board.strokeStyle=color;

    }
    else
    board.strokeStyle = "black";
	board.lineWidth=2;
	board.stroke();
	board.closePath();
	board.lineWidth=1;
}
function Circle3(row, column, color)
{
	board.beginPath();
	board.arc(column*60+20,row*60+15,10,0,2*Math.PI);
	board.fillStyle = color;
	board.fill();
	if(counter%2==0)
    		board.strokeStyle="black";
    else
    		board.strokeStyle=color;
        board.lineWidth=2;
	board.stroke();
	board.closePath();
	board.lineWidth=1;

	board.beginPath();
	board.arc(column*60+20,row*60+45,10,0,2*Math.PI);
	board.fillStyle=color;
	board.fill();
    if(counter%2==0)
    		board.strokeStyle="black";
    else
    		board.strokeStyle=color;
    board.lineWidth=2;
	board.stroke();
	board.closePath();
	board.lineWidth = 1;

	board.beginPath();
	board.arc(column*60+40,row*60+30,10,0,2*Math.PI);
	board.fillStyle = color;
	board.fill();
	if(counter%2==0)
    		board.strokeStyle="black";
    else
    		board.strokeStyle=color;
    board.lineWidth=2;
	board.stroke();
	board.closePath();
	board.lineWidth=1;
}
