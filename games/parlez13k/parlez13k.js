// @author zmertens
// @brief A message passing game for js13k game jam 2018
// @link http://js13kgames.com/
// The trick in the game is to get the computer to
// want to go out with you.
// Basically, just keep asking it questions and eventually
// you'll land on "ok lets go out"
// @ref https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_todo

// https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
}

let responses = [
    // first index is the winning index
    '!!! OK LETS GO OUT !!!',
    '               nop', 
    'black sabbath and megadeth',
    'i like llamas',
    '(╯°□°）╯︵ ┻━┻',
    'gnerd',
    'ooo barracuda',
    'inner rage @_@',
    'treading water x_x',
    ' <_<',
    ' brb git stashing all your weed',
    ' afk porn',
    ' jupiter, our sports bike will take us there',
    'my mixtape is slciker then you too can to',
    'only on the big rock candy mountain',
    'https://out.reddit.com/t3_9fdd09?url=https%3A%2F%2Fi.imgur.com%2FQpShZf1.gifv&to \
        ken=AQAAT-aZW9d-hjNBuXnBYt6Gu-agWZ7QWZzWmlyXLf16unMz07jI&app_name=desktop2x',
    'Exception in thread "main" java.lang.NullPointerException \
        at ClienteDB.incluir(ClienteDB.java:30) \
        at ClienteInterface.main(ClienteInterface.java:16)',
    'CCGAAA-GTAG----GAGGGG-A-TT-------------------------TACTCGAACGGCTTTAAAGGC--- \
        ---------------------------------------ATGATA-GTACTAAC-CAA-------GCTAA-GTTA \
        G-CTATA-TGT-GGATCTA-AGAAGCTCCCCGTCCAGCAAGAGCGATATTGGGGTTC',
    'Over analyzing \
        Separates the body from the mind. \
        Withering my intuition \
        Missing opportunities and I must \
        Feed my will to feel my moment',
    'no u'];

// document.getElementsByClassName("sendBtn").addEvent

// Create a name next to message
// append a close button
// var myNodelist = document.getElementsByTagName("LI");
// var i;
// for (i = 0; i < myNodelist.length; i++) {
//   var span = document.createElement("SPAN");
//   var txt = document.createTextNode("\u00D7");
//   span.className = "close";
//   span.appendChild(txt);
//   myNodelist[i].appendChild(span);
// }

// // Click on a close button to hide the current list item
// var close = document.getElementsByClassName("close");
// var i;
// for (i = 0; i < close.length; i++) {
//   close[i].onclick = function() {
//     var div = this.parentElement;
//     div.style.display = "none";
//   }
// }

// Add a "checked" symbol when clicking on a list item
// var list = document.querySelector('ul');
// list.addEventListener('click', function(ev) {
//   if (ev.target.tagName === 'LI') {
//     ev.target.classList.toggle('checked');
//   }
// }, false);

// Create a new list item when clicking on the "Send" button
// Add an automatic response from the computer
function newElement() {
    let messageSuccess = false;
  let li = document.createElement("li");
  let inputValue = document.getElementById("myInput").value;
  let t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    // add user's response
    document.getElementById("myUL").appendChild(li);
    messageSuccess = true;
  }
  document.getElementById("myInput").value = "";

  if (messageSuccess === true) {
    let li = document.createElement("li");
    // add computer's response automatically
    let autoResponse = responses.randomElement();
    // remove that response
    var index = responses.indexOf(autoResponse);
    if (index !== -1 && index != 0) {
        responses.splice(index, 1);
    }
    if (checkForSuccess(autoResponse) === true) {
        alert("You won! You get to go out with the computer. \
            Refresh your browser to restart the game.");
    }

    t = document.createTextNode(autoResponse);
    li.appendChild(t);
    document.getElementById("myUL").appendChild(li);
    messageSuccess = false;
  }
} // newElement

function checkForSuccess(str) {
    if (str === responses[0]) {
        return true;
    } else {
        return false;
    }
}