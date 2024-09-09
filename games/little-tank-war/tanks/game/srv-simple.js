var io = require('sandbox-io');
var nbrPlayers = 0;
var games = [];

var levels = [
	[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
		[1,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,1],
		[1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,1],
		[1,2,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,2,1],
		[1,2,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,2,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,2,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,2,1],
		[1,2,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,2,1],
		[1,2,0,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,2,1],
		[1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,1],
		[1,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,1],
		[1,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	],
	[
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,4,0,4,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,4,4,4,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,4,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,2,2,2,2,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,2,2,2,2,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,2,2,2,2,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,2,2,2,2,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,1],
		[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	]
];

var level;

var tankPositionsP1 = [[15,10]]; //Y; X
var tankPositionsP2 = [[8,16]];
var tankPosP1 = tankPositionsP1[0];
var tankPosP2 = tankPositionsP1[0];
var tankRotP1; //Rotation (-1,0 = up; 0,1 = right; 1,0 = down; 0,-1 = left)
var tankRotP2;

io.on('connection', function(socket) {
  log.debug('New connection', socket.id);
  socket.emit('srv-msg', { message: 'Welcome!' });
  socket.on('cli-msg', receiveClientMessage.bind(socket));
});

function receiveClientMessage(data) {
	switch(data[0])
	{
		case 'c':
			nbrPlayers++;
			
			if(nbrPlayers<=2)
			{
				this.emit('srv-msg', {
				  data: data,
				  msg: '0p' + nbrPlayers;
				});
			}
			else
			{
				this.emit('srv-msg', {
				  data: data,
				  msg: '0aThere is already a game running. Please check back later.';
				});
			}
			
			if(nbrPlayers==2)
			{
				start();
			}
			else
			{
				this.emit('srv-msg', {
				  data: data,
				  msg: '1aWaiting for other player...';
				});
			}
		break;

		case 'm':
			if(data[1]<='2')
			move(parseInt(data[1]+2), parseInt(data[2]))
		break;

		case 'u':
			this.emit('srv-msg', {
			  data: data,
			  msg: level;
			});
		break;

		case 'a':
			this.emit('srv-msg', {
			  data: data,
			  msg: data;
			});
		break;
	} 
}

function start()
{
	var nextLevel = Math.floor(Math.random()*3)+1;
	level = levels[nextLevel];	
}

function move(p, rot)
{

  if(p == 3)
  {
    var y = tankPosP1[0];
    var x = tankPosP1[1];
  }
  else if(p == 4)
  {
    var y = tankPosP2[0];
    var x = tankPosP2[1];
  }

  var tankPos;
  var tankRot;

  switch(rot)
  {
    case 1:
      if(level[y-2][x]!=0 || level[y-2][x-1]!=0 || level[y-2][x+1]!=0) return;
      tankRot = [-1,0];
      y--;
      clearC();
      level[y][x-1] = level[y][x] = level[y][x+1] = level[y+1][x-1] = level[y+1][x+1] = level[y-1][x] = p;
    break;

    case 2:
      if(level[y][x+2]!=0 || level[y-1][x+2]!=0 || level[y+1][x+2]!=0) return;
      tankRot = [0,1];
      x++;
      clearC();
      level[y][x+1] = level[y][x] = level[y+1][x] = level[y+1][x-1] = level[y-1][x] = level[y-1][x-1] = p;
    break;

    case 3:
      if(level[y+2][x]!=0 || level[y+2][x-1]!=0 || level[y+2][x+1]!=0) return;
      tankRot = [1,0];
      y++;
      clearC();
      level[y][x-1] = level[y][x] = level[y][x+1] = level[y-1][x-1] = level[y-1][x+1] = level[y+1][x] = p;
    break;

    case 4:
      if(level[y][x-2]!=0 || level[y+1][x-2]!=0 || level[y-1][x-2]!=0) return;
      tankRot = [0,-1];
      x--;
      clearC();
      level[y][x-1] = level[y][x] = level[y+1][x] = level[y+1][x+1] = level[y-1][x] = level[y-1][x+1] = p;
    break;

    case 5:
    	shoot()
    break;
  }

  if(p == 3)
  {
    tankPosP1[0] = y;
    tankPosP1[1] = x;
    tankRotP1 = tankRot;
  }
  else if(p == 4)
  {
    tankPosP2[0] = y;
    tankPosP2[1] = x;
    tankRotP2 = tankRot;
  }

  update();
}

function shoot(p)
{
	if(p == 3)
	{
	  var tankPos = tankPosP1;
	  var tankRot = tankRotP1;
	}
	else if(p == 4)
	{
	  var tankPos = tankPosP2;
	  var tankRot = tankRotP2;
	}

	var bullet = [tankPos[0],tankPos[1]];

	do
	{
	  bullet[0] += tankRot[0];
	  bullet[1] += tankRot[1];

	  if(level[bullet[0]][bullet[1]] == 1) return;
	  else if(level[bullet[0]][bullet[1]] == 2) 
	  {
	    level[bullet[0]][bullet[1]] = 0;
	    update();
	    return;
	  }
	  else if(level[bullet[0]][bullet[1]] == 3) 
	  {
	    receiveClientMessage('a1You lost!');
	    receiveClientMessage('a2You won!');
	    return;
	  }
	  else if(level[bullet[0]][bullet[1]] == 4) 
	  {
	    receiveClientMessage('a2You lost');
	    receiveClientMessage('a1You won!');
	    return;
	  }
	}
	while(bullet[0] > 0 && bullet[0] < 19 && bullet[1] > 0 && bullet[1] < 19)
}

function update()
{
	receiveClientMessage('u');
}