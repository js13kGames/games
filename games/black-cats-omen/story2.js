// story.js
var momEl = document.getElementById("mom");
var container = momEl.parentElement; // the div containing #mom

// make newlines show as line breaks
momEl.style.whiteSpace = "pre-wrap";

let conversations = [
  "Kash: Shaurya! What are you doing?! Why are you hitting the cats?!\n",
  "Shaurya: I… I'm just… clearing the street to avoid bad luck!\n",
  "Kash: Clearing the street? By hurting cats?!\n",
  "Shaurya: I… I'm just avoiding misfortune! My mom always said that black cats bring bad luck,\nso I thought clearing them from the street would prevent any trouble in the future…\n",
  "Kash: Wait… you actually believe in superstitions?!\n",
  "Shaurya: I… well… I mean, it's just to be safe! I didn't want anything bad to happen…\n",
  "Shaurya: I… I didn't know this would be so wrong… I thought it would prevent misfortune…\n",
  "Kash: Seriously, Shaurya? Hurting innocent cats won't stop anything!\n",
  "Shaurya: I didn't think it would hurt anyone… I just wanted to prevent misfortune…\n",
  "Kash: Shaurya! I can't believe this! You can't just go around hurting animals!\n",
  "Shaurya: I'm really sorry! I didn't mean to…\n",
  "Kash: Shaurya! I can't believe this… My friend was right—you are such a reckless idiot!\n",
  "Shaurya: Wait… Kash… I—\n",
  "Kash: No! I can't trust someone who hurts innocent cats.\nWhat if you hurt me someday because of some stupid superstition?\nI don’t want to be with you.\n"
];

var count = -1;
var isTyping = false;
var typingInterval = null;
var currentText = "";
var currentCharIndex = 0;
var typingSpeed = 30; // ms per character (lower = faster)

function typeText(text, callback) {
  text = text.replace(/<br\s*\/?>/gi, "\n");

  currentText = text;
  currentCharIndex = 0;
  isTyping = true;

  if (momEl.textContent.length > 0) momEl.textContent += "\n";

  typingInterval = setInterval(() => {
    momEl.textContent += currentText.charAt(currentCharIndex);
    currentCharIndex++;

    // scroll container down as text is added
    container.scrollTop = container.scrollHeight;

    if (currentCharIndex >= currentText.length) {
      clearInterval(typingInterval);
      isTyping = false;
      if (callback) callback();
    }
  }, typingSpeed);
}

document.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  if (isTyping) {
    clearInterval(typingInterval);
    momEl.textContent += currentText.slice(currentCharIndex);
    isTyping = false;
    container.scrollTop = container.scrollHeight; // scroll to bottom
    return;
  }

  count++;
  if (count < conversations.length) {
        if(count === 8){
            momEl.textContent = "";
        }
    typeText(conversations[count]);
  }
  
  
  else if(count >= conversations.length){
     momEl.textContent = "Thanx for playing...";
    typeText();
  }
});
