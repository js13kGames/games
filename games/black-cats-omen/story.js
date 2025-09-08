// story.js (replace current file)
var momEl = document.getElementById("mom");

// make newlines show as line breaks
momEl.style.whiteSpace = "pre-wrap";

let conversation = [
  "Shaurya: Mom I am going out for my girlfriends birthday.\n",
  "Mom: Wait Shaurya A black cat just crossed your path. You are not going anywhere.\n",
  "Shaurya: But Mom it is only a cat nothing will happen.\n",
  "Mom: No it is a bad omen. Something unfortunate might happen.\n",
  "Shaurya: Mom that is just superstition. Nothing will happen.\n",
  "Mom: Why do you never listen to me Shaurya You always ignore what I say.",
  "Mom: Enough I said no You will stay inside and listen to me.\n",
  "Shaurya: Please Mom this is important to me.\n",
  "Mom: Important?!..",
  "Mom: Do not argue with me I know what is right for you. Sit down and do not take another step out of this house."
];

var count = -1;

// typing state
var isTyping = false;
var typingInterval = null;
var currentText = "";
var currentCharIndex = 0;
var typingSpeed = 30; // ms per character (lower = faster)

function typeText(text, callback) {
  // Convert any <br> (if present) to \n so we use textContent safely
  text = text.replace(/<br\s*\/?>/gi, "\n");

  currentText = text;
  currentCharIndex = 0;
  isTyping = true;

  // add a blank line before new dialogue if something already written
  if (momEl.textContent.length > 0) momEl.textContent += "\n";

  typingInterval = setInterval(() => {
    momEl.textContent += currentText.charAt(currentCharIndex);
    currentCharIndex++;
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
    // If currently typing: finish the line immediately
    clearInterval(typingInterval);
    momEl.textContent += currentText.slice(currentCharIndex);
    isTyping = false;
    return; // do not advance to next line on the same keypress
  }

  // Not typing: go to the next line
  count++;
  if (count < conversation.length) {
        if(count === 4){
            momEl.textContent = "";
        }
    typeText(conversation[count]);
  } else if (count === conversation.length) {
    momEl.textContent = "";
    typeText(
`Shaurya is angry.
He has decided to catch all the black cats in the same night and punish them, ignoring his mothers warning about superstition.
(No this is not the beginning of his racist self, he is just an immature guy in love.)

But what Shaurya does not know is that his girlfriend Kash absolutely loves cats.

So... a mishap might be waiting to happen.`
    );
    
  }else if (count === conversation.length + 1) {
    momEl.textContent = "";
    typeText("If the player jumps from a crazy height, they’ll scream (I mean, wouldn’t you?).\nThat scream makes the noise bar shoot up!\nWhen they stomp the ground on landing, the noise bar climbs again.\nAnd the closer they get to the cat, the louder the noise gets");
;
    
  } else if (count === conversation.length + 2) {
    momEl.textContent = "";
    typeText("use arrows key for movement.\nIf you make noise, cat will run away!\n\n[press enter to start the game...]");
  } 
  else if (count === conversation.length + 3) {
    window.location.href = "game.html";
  }
});
