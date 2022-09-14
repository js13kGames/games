var ac = new AudioContext();
var tempo = 120;
var soundOn = true;

var simon = {
    health: 10,

    octave: 3,
    moves: [],
    
    isPresenting: false,

    timeouts: [],

    blue: document.getElementById("blue"),
    red: document.getElementById("red"),
    green: document.getElementById("green"),
    yellow: document.getElementById("yellow"),
    centerCircle: document.getElementById("circle"),


    init: function()
    {
        this.blue.onclick = padClicked;
        this.red.onclick = padClicked;
        this.green.onclick = padClicked;
        this.yellow.onclick = padClicked;
    },

    intro: function()
    {
        /*
        deg = 100;
        div = document.getElementById("simon");
        div.style.webkitTransform = 'rotate('+deg+'deg)'; 
        div.style.mozTransform    = 'rotate('+deg+'deg)'; 
        div.style.msTransform     = 'rotate('+deg+'deg)'; 
        div.style.oTransform      = 'rotate('+deg+'deg)'; 
        div.style.transform       = 'rotate('+deg+'deg)'; */

        this.isPresenting = true;
        if (soundOn == true)
        {
            var sequence = new Sequence(ac, tempo, ['E4 q', 'A4 q', 'E3 q', 'C#4 q']);
            sequence.loop = false;
            sequence.play();
        }
        that = this;
        this.lightPad(this.blue);
        setTimeout(function()
        {
            that.clearPads();
            that.lightPad(that.red);
            setTimeout(function()
            {
                that.clearPads();
                that.lightPad(that.green);
                setTimeout(function()
                {
                    that.clearPads();
                    that.lightPad(that.yellow);
                    setTimeout(function()
                    {
                        that.clearPads();
                        that.isPresenting = false;
                    }, 400);
                }, 400);
            }, 400);
        }, 400);



        playNote('E', '3', 'w', .2);
        playNote('A', '3', 'w', .2);
        playNote('E', '2', 'w', .2);
        playNote('C#', '3', 'w', .2);
    },

    newMove: function()
    {
        var potentialMoves = ["blue", "red", "green", "yellow"];
        this.moves.push(potentialMoves[Math.floor(Math.random() * 4)]);
    },

    presentMoves: function()
    {
        player.currentMove = 0;
        var i = 0;
        var that = this;
        this.isPresenting = true;
        var interval = setInterval(function()
        {
            if (i >= that.moves.length)
            {
                clearInterval(interval);
                that.clearPads()
                that.isPresenting = false;
            }
            that.clearPads();

            switch (that.moves[i])
            {
                case "blue":
                    playNote('E', that.octave, 'q');
                    that.lightPad(that.blue);
                    break;
                case "red":
                    playNote('A', that.octave, 'q');
                    that.lightPad(that.red);
                    break;
                case "green":
                    playNote('E', that.octave - 1, 'q');
                    that.lightPad(that.green);
                    break;
                case "yellow":
                    playNote('C#', that.octave, 'q');
                    that.lightPad(that.yellow);
                    break;
            }
            i++;

        }, 500);

    },
    clearPads: function()
    {
        this.blue.className = "tile";
        this.red.className = "tile";
        this.green.className = "tile";
        this.yellow.className = "tile";
    },

    lightPad: function(pad)
    {
        pad.className = pad.className + " lit";
    }


}

var player = {
    currentMove: 0,
    goingReverse: false,
    lives: 3,
    livesDiv: document.getElementById("lives"),

}

function padClicked(event)
{
    if (simon.isPresenting == false)
    {
        padClicked = event.target.id;
        simon.clearPads();
        if (player.currentMove == 0)
        {
            if (simon.moves[simon.moves.length - 1] == padClicked)
            {
                player.goingReverse = true;
            }
            else
            {
                player.goingReverse = false;
            }
        }
        if ((simon.moves[player.currentMove] == padClicked && player.goingReverse == false) || (simon.moves[simon.moves.length - player.currentMove - 1] == padClicked && player.goingReverse == true))
        {

            switch (padClicked)
            {
                case "blue":
                    playNote('E', simon.octave, 'q');
                    simon.lightPad(simon.blue);
                    break;
                case "red":
                    playNote('A', simon.octave, 'q');
                    simon.lightPad(simon.red);
                    break;
                case "green":
                    playNote('E', simon.octave - 1, 'q');
                    simon.lightPad(simon.green);
                    break;
                case "yellow":
                    playNote('C#', simon.octave, 'q');
                    simon.lightPad(simon.yellow);
                    break;
            }
            player.currentMove++;

            if (player.currentMove >= simon.moves.length)
            {
                setTimeout(function()
                {
                    if (player.goingReverse)
                    {
                        simon.health -= simon.moves.length;
                        if (simon.health <= 0)
                        {
                            winStateInit()
                            newGame();
                        }
                    }
                    updateUI();
                    simon.newMove();
                    simon.presentMoves();

                }, 200);
            }
        }
        else
        {
            simon.moves = [];
            player.currentMove = 0;
            player.lives -= 1;
            updateUI();
            playNote("F#", "1", 'q');
            if (player.lives < 0)
            {
                failStateInit();
            }
            else
            {
                setTimeout(function()
                {
                    simon.newMove();
                    simon.presentMoves();

                }, 400);
            }
        }
    }

}

function newGame()
{
    player.lives = 3;
    simon.moves = [];
    simon.health = 80;
    player.currentMove = 0;
    

    updateUI();

    //
    simon.newMove();
    simon.presentMoves();
}

function playNote(note, octave, length, gain)
{
    if (soundOn == true)
    {
        if (gain === undefined)
            gain = 1.0;
        var sequence = new Sequence(ac, tempo, [note + octave + " " + length]);
        sequence.gain.gain.value = gain;
        sequence.loop = false;
        sequence.play();
    }
}

function updateUI()
{
    player.livesDiv.innerHTML = "Player Lives: " + player.lives;
    simon.centerCircle.innerHTML = simon.health;
}


function storyDisplay(i, story, div, divParent)
{


    document.getElementById(div).innerHTML += story.charAt(i);
    i++;
    if (story.length > i && document.getElementById(divParent).style.display != "none")
    {
        delay = Math.floor(Math.random() * 100) + 25;
        if (story.charAt(i - 1) === ".")
        {
            playNote("B", "2", ".1", ".4");
            delay = 200;
        }
        else if (story.charAt(i - 1) === " ")
        {
            delay = 200;
        }
        else
        {
            playNote("C", "2", ".01", ".4");
        }
        setTimeout(storyDisplay, delay, i,story, div, divParent);
    }
}


function playStateInit()
{
    document.getElementById("gameState").style.display = "block";
    document.getElementById("intro").style.display = "none";
    document.getElementById("fail").style.display = "none";
    document.getElementById("win").style.display = "none"; 
    simon.intro();
    setTimeout(function()
    {
        //simon.init();
        newGame();
    }, 2200);
}

function storyStateInit()
{
    document.getElementById("intro").style.display = "bock";
    document.getElementById("gameState").style.display = "none";
    document.getElementById("story").innerHTML = "";
    var story = "Long ago a kids game was introduced onto the human populace.  In 1978 an electronic version of this game was introduced.  What was not known at the time was that this ‘game’ was created to condition humans to do as instructed by an extraterrestrial intelligence known as Simon commanded.   Today Simon has made his presence known and there is only one way to stop it… to beat him at his own game by doing the opposite of what SIMON SAYS. ";
    storyDisplay(0, story, "story", "intro");
    
}

function failStateInit()
{
    document.getElementById("intro").style.display = "none";
    document.getElementById("gameState").style.display = "none";
    document.getElementById("fail").style.display = "block";
    document.getElementById("win").style.display = "none"; 
    document.getElementById("failText").innerHTML = "";
    var story = "You have failed mankind.  Simon the omnipotent being has continued his journey to Earth unstopped. ";
    storyDisplay(0, story, "failText", "fail");
}

function winStateInit()
{
    document.getElementById("intro").style.display = "none";
    document.getElementById("gameState").style.display = "none";
    document.getElementById("fail").style.display = "none";
    document.getElementById("win").style.display = "block"; 
    document.getElementById("winText").innerHTML = "";
    var story = "With the nefarious Simon defeated Earth has been saved.  No longer do we have to look up at the sky and fear the dreaded chord of doom.";
    storyDisplay(0, story, "winText", "win");
}

function toggleSound()
{
    if (soundOn == true)
    {
        soundOn = false;
        document.getElementById("sound").innerHTML = "Sound Off";
    }
    else
    {
        soundOn = true;
        document.getElementById("sound").innerHTML = "Sound On";
    }

    return false;
}
simon.init();
storyStateInit();