var image = document.getElementById("image"); //reference to the image
var score = document.getElementById("score"); //reference to the score
image.style.display = "none";
var color = ["black", "white"]; //stores the image colors
var i = 0;
var timer;// Stores the timeout for the change in dot's color to red
var inter;// Stores the timeout for gameover
var time = 5;// Stores the remaining time
var z = 0;// Stores the present color
var t; // Stores whether left click or right click is placed
var counter;// Stores the time interval for timer

// Disables context menu on right click
document.oncontextmenu = function() {
  return false;
};

// Initializes the game
function start() {

  var n = confirm("Do you want to start the game ?");
  if (n == true) {
    var x = Math.floor(17.99 * Math.random());
    var y = Math.floor(13.99 * Math.random());
    x = 6.25 + 4.5 * x;
    y = 9.3 + 6.25 * y;
    z = Math.round(Math.random());
    z++;
    if (z == 1)
      t = 0;
    else
      t = 2;

    timer = setTimeout(red, 4950);
    inter = setTimeout(gameover, 5010);
    image.style.fill = color[z - 1];
    image.setAttribute("cx", x + "%");
    image.setAttribute("cy", y + "%");
    image.style.display = "block";
    changetimer(time);

    counter = setInterval(changetimer, 1000);
  } else {
    window.close();
  }
}


// Handles left and right clicks on the dots
function handleMouseDown(e) {

  if (e.button == t) {

    if (i < 10)
      time = 5;
    else if (i >= 10 && i < 25)
      time = 4;
    else if (i >= 25 && i < 50)
      time = 3;
    else
      time = 2;

    clearInterval(counter);
    clearTimeout(inter);
    clearTimeout(timer);
    changetimer(time);
    var x = Math.floor(17.99 * Math.random());
    var y = Math.floor(13.99 * Math.random());
    x = 6.25 + 4.5 * x;
    y = 9.3 + 6.25 * y;
    z = Math.round(Math.random());
    z++;
    if (z == 1)
      t = 0;
    else
      t = 2;
    alpha = (time + 1) * 1000 - 150;
    beta = (time + 1) * 1000 + 130;

    timer = setTimeout(red, alpha);
    inter = setTimeout(gameover, beta);
    counter = setInterval(changetimer, 1000);
    image.style.fill = color[z - 1];
    image.setAttribute("cx", x + "%");
    image.setAttribute("cy", y + "%");
    i++;
    score.innerHTML = i;
  } else {
    red();
    setTimeout(gameover, 100);
  }

}

image.addEventListener('mousedown', handleMouseDown);

// Ends the game
function gameover() {
  clearTimeout(timer);
  clearTimeout(inter);
  alert("Your final score is " + i);
  x = confirm("Do you want to play again ?");
  if (x == true)
    location.reload();
  else
    window.close();

}

// Changes the dot color to red after game ends
function red() {
  image.style.fill = "red";
}

// Resets the timer on correct input
function changetimer() {
  if (time >= 0) {
    document.getElementById('time').innerHTML = time;
    time--;
  } else {
    clearInterval(counter);

  }

}
