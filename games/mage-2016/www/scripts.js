var x = 7, y = 5;
var isGame = false;
var map = 0;
var go = false;
var hp = 100;
var mp = 100;
var pts = 0;
var ded = false;

var player = new Image();
player.src = "www/player.png";

var mob1 = new Image();
mob1.src = "www/mob1.png";
var mob2 = new Image();
mob2.src = "www/mob2.png";
var mob3 = new Image();
mob3.src = "www/mob3.png";
var potion = new Image();
potion.src = "www/potion.png";



var grass = new Image();
grass.src = "www/grass.png"

var fire = new Image();
fire.src = "www/att.png"

var game;
var ctx = null;

var mob = [[]];
var pot = [[]];

var isAttack = false;

function rand(min, max)
{
    min = parseInt(min, 10);
    max = parseInt(max, 10);

    if (min > max)
	{
        var tmp = min;
        min = max;
        max = tmp;
    }

    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

function start()
{
	game = document.getElementById("game");
	ctx = game.getContext("2d");
	setInterval(gameLoop, 1000/60);
	setInterval(mobsMove, 500);
	setInterval(mobsAttack, 350);
	setInterval(fillMana, 300);
	setInterval(randMob, 250);
	setInterval(randPot, 3500);
}

window.onload = setTimeout(start, 100);

function gameLoop()
{
	document.addEventListener("keydown", keyDown, false);
	
	if(!isGame)
	{
		for(var yy = 0; yy < 11; yy++)
			for(var xx = 0; xx < 15; xx++)
				ctx.drawImage(grass, xx*64, yy*64);
			
		ctx.font = "30px Courier New";
		ctx.fillStyle  = "lightblue";
		ctx.fillText("ARROWS to move, SPACE to attack", 198, 600);
		ctx.fillText("Press ESC to play", 318, 630);
		ctx.fillStyle  = "lightyellow";
		ctx.font = "50px Courier New";
		ctx.fillText("MAGE 2016", 340, 90);
		if(ded == true)
		{
			ctx.fillStyle  = "#ee22aa";
			ctx.font = "40px Courier New";
			ctx.fillText("You died...", 340, 320);
			ctx.fillStyle  = "#ee22aa";
			ctx.font = "40px Courier New";
			ctx.fillText("Points: "+pts, 340, 360);
		}
	}
	else
	{
		for(var yy = 0; yy < 11; yy++)
			for(var xx = 0; xx < 15; xx++)
				ctx.drawImage(grass, xx*64, yy*64);
		
		
		ctx.drawImage(player, x*64, y*64);
		
		ctx.fillStyle  = "lightblue";
		ctx.font = "20px Courier New";
		ctx.fillText("Points: "+pts, 10, 20);
		
		if(isAttack)
		{
			ctx.drawImage(fire, (x-1)*64, (y-1)*64);
			ctx.drawImage(fire, (x-1)*64, y*64);
			ctx.drawImage(fire, x*64, (y-1)*64);
			ctx.drawImage(fire, (x+1)*64, y*64);
			ctx.drawImage(fire, (x+1)*64, (y+1)*64);
			ctx.drawImage(fire, x*64, (y+1)*64);
			ctx.drawImage(fire, (x-1)*64, (y+1)*64);
			ctx.drawImage(fire, (x+1)*64, (y-1)*64);
		}
		
		ctx.fillStyle="#FF0000";
		ctx.fillRect(x*64,  y*64-27,(hp/100)*64,10);
		ctx.fillStyle="#0000FF";
		ctx.fillRect(x*64,  y*64-15,(mp/100)*64,10);
		
		for(var i = 0; i < mob.length; i++)
		{
			if(mob[i][2] == 1) ctx.drawImage(mob1, mob[i][0]*64,  mob[i][1]*64);
			else if(mob[i][2] == 2) ctx.drawImage(mob2, mob[i][0]*64,  mob[i][1]*64);
			else ctx.drawImage(mob3, mob[i][0]*64,  mob[i][1]*64);
		}
		
		for(var i = 0; i < pot.length; i++)
		{
			ctx.drawImage(potion, pot[i][0]*64,  pot[i][1]*64);
		}
		
		for(var i = 0; i <pot.length; i++)
			collPot(i);
		
		if(hp <= 0){ ded = true; isGame = false; }
	}
}

function keyDown(e)
{
	if(isGame && !go)
	{
		switch(e.keyCode)
		{
			case 37: if(x > 0){ x -= 1; go = true; setTimeout(function(){go=false;},250); } break;
			case 38: if(y > 0){ y -= 1; go = true; setTimeout(function(){go=false;},250); } break;
			case 39: if(x < 14){ x += 1; go = true; setTimeout(function(){go=false;},250); } break;
			case 40: if(y < 10){ y += 1; go = true; setTimeout(function(){go=false;},250); } break;
			case 32:
			if(mp >= 10)
			{
				isAttack = true;
				setTimeout(function(){isAttack = false;},500);
				for(var i = 0; i < mob.length; i++)
				{
					if(coll(i))
					{
						mob[i][3] -= 100;
						if(mob[i][3] <= 0) deleteMob(i);
					}
				}
				mp-=10;
			}
			break;
		}
	}
	else if(e.keyCode == 27)
	{
		addMob(0,0,1);
		isGame = true;
		if(ded)
		{
			pts = 0;
			x = 7;
			y = 5;
			mob.splice(0, mob.length);
			hp = 100;
			mp = 100;
		}
	}
}

function mobsMove()
{
	for(var i = 0; i < mob.length; i++)
		mobMove(i);
}

function mobMove(id)
{
	if(rand(0, 1) == 0)
	{
		if(mob[id][0] - 1 > x) mob[id][0]--;
		else if(mob[id][0] < x - 1) mob[id][0]++;
	}
	else
	{
		if(mob[id][1] - 1 > y) mob[id][1]--;
		else if(mob[id][1] < y - 1) mob[id][1]++;
	}
	if(mob[id][0] == x && mob[id][1] == y) mob[id][0] --;
}

function addMob(xxxx, yyyy, id)
{
	mob[mob.length] = [xxxx, yyyy, id, 100];
}

function deleteMob(id)
{
	mob.splice(id, 1);
	pts++;
}

function coll(id)
{
	if(mob[id][0] == x - 1 && mob[id][1] == y - 1) return true;
	else if(mob[id][0] == x - 1 && mob[id][1] == y + 1) return true;
	else if(mob[id][0] == x + 1 && mob[id][1] == y - 1) return true;
	else if(mob[id][0] == x + 1 && mob[id][1] == y + 1) return true;
	else if(mob[id][0] == x - 1 && mob[id][1] == y) return true;
	else if(mob[id][0] == x && mob[id][1] == y - 1) return true;
	else if(mob[id][0] == x + 1 && mob[id][1] == y) return true;
	else if(mob[id][0] == x && mob[id][1] == y + 1) return true;
	else return false;
}

function mobsAttack()
{
	for(var i = 0; i < mob.length; i++)
		{
			if(coll(i))
			{
				hp-=2;
			}
		}
}

function fillMana()
{
	if(mp < 100) mp++;
}

function randMob()
{
	var ch = rand(0, 9);
	if(ch < 3)
	{
		var where = rand(0, 3);
		var mobb = rand(1, 3);
		if(where == 0) addMob(0, 0, mobb);
		else if(where == 1) addMob(14, 10, mobb);
		else if(where == 2) addMob(14, 0, mobb);
		else addMob(0, 10, mobb);
	}	
}


function randPot()
{
	var ch = rand(0, 1);
	if(ch == 0)
	{
		var xxx = rand(0, 10);
		var yyy = rand(0, 14);
		pot[pot.length] = [xxx, yyy];
	}	
}

function collPot(id)
{
	if(x == pot[id][0] && y == pot[id][1])
	{
		if(hp <= 90) hp+=10;
		else hp = 100;
		pot.splice(id, 1);
	}
}