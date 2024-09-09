socket = io(document.location.href);

var player = 0;
var level;

socket.on('srv-msg', function(data) {
	if(parseInt(data[0]) == player)
	{	
		switch(data[1])
		{
			case 'p':
				player = parseInt(data[2]);
			break;

			case 'a':
				document.getElementById('info').innerHTML = data.substring(2);
			break;

			default:
				level = data;
				update();
			break;

		}
	}
	else //Everybody can spectate
	{
		level = data;
		update();
	}
});

function send(data) {
	socket.emit('cli-msg', data);
}

function move(dir)
{
	send('m' + player + dir);
}

function update ()
{
	var game = document.getElementById("game");
	var ctx = game.getContext("2d");

	ctx.clearRect(0, 0, game.width, game.height);

	ctx.fillStyle = "#AAAAAA";
	ctx.fillRect(0, 0, game.width, game.height);

	ctx.fillStyle = "#303030";

	for(var a = 0; a < level.length; a++)
	{
		for(var b = 0; b < level[a].length; b++)
		{
			if(level[b][a] == "1")
			{
				ctx.fillRect(a*25,b*25,25,25);
			}

			else if (level[b][a] == "2")
			{
				ctx.fillStyle = "#505050";
				ctx.fillRect(a*25,b*25,25,25);
				ctx.fillStyle = "#303030";
			}

			else if (level[b][a] == "3")
			{
				ctx.fillStyle = "#808080";
				ctx.fillRect(a*25,b*25,25,25);
				ctx.fillStyle = "#303030";
			}

			else if (level[b][a] == "4")
			{
				ctx.fillStyle = "#404040";
				ctx.fillRect(a*25,b*25,25,25);
				ctx.fillStyle = "#303030";
			}
		}
	}
}

send('c');