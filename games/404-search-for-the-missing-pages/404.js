const key = k => `SearchForThePage.${k}`; //prefix for local storage
let textNumber = 0; //which dialog the player is on
const dialogs = ["Perhaps you can solve that little puzzle, but a greater challenge is coming...","I have searched for pages across all the World Wide Web...","World Wide!","Now it is your turn...","Lift me from my burden!","This time...","You find your page!","Find 404 pages!","That's too much for you?","Fine then!","I shall leave it at eight.","Eight pages, that's all you have to do."]; //dialogs to show to user
const pages = ["TOR2A","TOR2B","TOR2D","COM3B","RNG2B","RNG1C","ERR5G","SCR3A"]; //areas where pages are
const K = value => () => value; //constant function for button values
const req = (value, require) => () => areas[require].page? "" : value; //function that requires a page to be collected before value appears

let Area = "-----"; //which area the player is in

let areas =  { //all areas in the game, buttons are stored by their location
	"TOR1A": {"text":"You are in a dark place...  The Dark Web!  That can't be good. There must be many layers of encryption around here. Well, where do you want to go? Sorry about the cryptic names, but you'll have to live with ","buttons":[K("TOR2A") , K("TOR1C")],"page":false},
	"TOR2A": {"text":"Oh, no! Our connection to the previous node has disconnencted. We have to take another root. The page you found is not useful until you exit the Dark Web, as it is very encrypted.","buttons":[K("TOR1C") , K("TOR3C")],"page":true},
	"TOR1C": {"text":"This is an exit node of the Dark Web, we are getting out soon!","buttons":[K("TOR2C")],"page":false},
	"TOR2C": {"text":"We are escaping the Dark Web! The next connenction is finally a normal place!","buttons":[K("COM2A")],"page":false},
	"TOR3C": {"text":"This node is pretty boring, but a Dark Web node can be any computer that downloads the software so you can't judge.","buttons":[K("TOR2C")],"page":false},
	"TOR1B": {"text":"We are in an entry to the Dark Web. If you go further in this way, this path will close, so you will have to find another way out.","buttons":[K("COM1B") , K("COM2B") , K("TOR2B") , req("TOR1D","TOR2B")],"page":false},
	"TOR2B": {"text":"Your page will not be useful unless you get out of the Dark Web. The next connenction is where you started so it should be familiar.","buttons":[K("TOR1A")],"page":true},
	"TOR1D": {"text":"I am not sure where we are...","buttons":[K("TOR1B") , K("TOR2D") , K("TOR3D")] , "page":false},
	"TOR2D": {"text":"Again, it's in the Dark Web so you'll need to get out first.","buttons":[K("TOR1D")],"page":true},
	"TOR3D": {"text":"This appears to be a dead end.","buttons":[K("TOR1D")],"page":false},
	"COM1A": {"text":"This seems to be a central server for the company... but there are no pages here.","buttons":[K("COM1B") , K("COM2B") , K("COM3B") , K("COM2A")],"page":false},
	"COM2A": {"text":"I think we are in a smaller server for some company, there are two exits.","buttons":[K("COM1A") , K("COM2B") , req("SCR1A","RNG2B")],"page":false},
	"COM1B": {"text":"This is a computer, it's part of the company.","buttons":[K("COM2B") , K("TOR1B")],"page":false},
	"COM2B": {"text":"It looks like we are in a switch or router, with many paths connected.","buttons":[K("COM1A") , K("COM2A") , K("COM1B") , K("TOR1B") , K("RNG1A")],"page":false},
	"COM3B": {"text":"We're in a web server for the company, probably why there is a page here.","buttons":[K("COM1A")],"page":true},
	"RNG1A": {"text":"A very uninteresting node.","buttons":[K("RNG2A") , K("RNG1B") , K("COM2B")],"page":false},
	"RNG2A": {"text":"Another computer with nothing to say about.","buttons":[K("RNG1A") , K("RNG3A")],"page":false},
	"RNG3A": {"text":"I wonder what RNG stands for? Perhaps boRiNG. Because thats what this is.","buttons":[K("RNG2A") , K("RNG3B")],"page":false},
	"RNG1B": {"text":"I have nothing to say about the node itself, but surrounding there seems to be some interesting things in the neighbooring computers...","buttons":[K("RNG1A") , K("RNG2B") , K("ERR1A")],"page":false},
	"RNG2B": {"text":"The fact that a page is here... it seems too good to be true...","buttons":[K("RNG1B") , K("RNG3B") , req("RNG1C","SCR3A")],"page":true},
	"RNG3B": {"text":"Yet another boring node. Why are we looking here?","buttons":[K("RNG3A") , K("RNG2B")],"page":false},
	"RNG1C": {"text":"I was not expecting to find a secret like this...","buttons":[K("RNG2B")],"page":true},
	"SCR1A": {"text":"The last time we checked this was not here...","buttons":[K("COM2A") , K("SCR2A") , K("SCR3A") , K("SCR1B")],"":false},
	"SCR2A": {"text":"This is really freaking me out...","buttons":[K("SCR1A") , K("SCR3A")],"page":false},
	"SCR3A": {"text":"No wonder this is hid so well! Of course there is a page here.","buttons":[K("SCR1A") , K("SCR2A")],"page":true},
	"SCR1B": {"text":"Just a dead end.","buttons":[K("SCR1A")],"page":false},
	"ERR1A": {"text":"Error","buttons":[K("ERR6Z") , K("RNG1B")],"page":false},
	"ERR6Z": {"text":"Error","buttons":[K("ERR5G") , K("ERR1A")],"page":false},
	"ERR5G": {"text":"Error","buttons":[K("ERR6Z")],"page":true}
};
let buttons = []; //the ids of each button on screen so they can be deleted

function newButton(name,id,onClick) {  //create a new butto
	let buttons = document.getElementById("buttons");
	let Button = document.createElement("button");
	Button.textContent = name;
	Button.id = id;
	Button.setAttribute("onclick",onClick);
	buttons.append(Button);
}

function delButton(id) { //delete a button
	let Button = document.getElementById(id);
	Button.parentNode.removeChild(Button);
}
function clearButtons() {
	for(i=0;i<buttons.length;i++) { //delete all buttons left from last time
		delButton(buttons[i]);
	}
	buttons = [];
}
function setText(value) { //set the value of the paragraph used for dialog
	document.getElementById("text").textContent = value;
}

function next() { //next text
	if(textNumber < dialogs.length) {
		setText("Web Browser: "+dialogs[textNumber]);
		textNumber++;
	} else if (textNumber == dialogs.length) {
		game();
	}
}

function setArea(value) { //set area
	document.getElementById("page").textContent = ""; //clear page text
	Area = value; //store area
	localStorage.setItem(key("area"),value);
	let Area2 = areas[Area]; //prevent having to load this multiple time
	clearButtons();
	setText(Area + ": " + Area2["text"]); //load the text
	for(i=0;i<Area2.buttons.length;i++) { //load the buttons
		let x = Area2.buttons[i]();
		if(x != "") {
			newButton(x,x,`setArea("${x}")`);
			buttons.push(x);
		}
	}
	if(Area2.page){ //check if the user found a page
		Area2.page = false;
		document.getElementById("page").textContent = "You found a page!"; //tell user that they found a page
		localStorage.setItem(key(Area),false); //save the page to local storage
	}
}

function game() { //start game
	setText("");
	delButton("next");
	if(localStorage.getItem(key("area")) != "undefined") { //set area to saved if there is one else TOR1A
		setArea(localStorage.getItem(key("area")));
	} else {
		setArea("TOR1A");
	}
}

function Reset() { //reset game
	setText("Web Browser: You won't give up, will you?");
	try {
		delButton("next");
	}
	catch(error) {}
	clearButtons();
	for(i=0;i<pages.length;i++) { //clear localStorage information
		areas[pages[i]].page = true;
		localStorage.setItem(key(pages[i]),undefined);
	}
	localStorage.setItem(key("area"),undefined);
	newButton("Next","next","next()"); //create the next button shown when page is first opened
	textNumber = 0;
}
newButton("Next","next","next()"); //create the next button shown when page is first opened
for(i=0;i<pages.length;i++) { //load localStorage
	storedValue = localStorage.getItem(key(pages[i]));
	areas[pages[i]].page = storedValue == "undefined"; //if it is equal the value should automatically be default (true), if it is set it will always be set to false so no need to add "? true : false" at the end.
}
function hint() { //function for hints
	let hints = ["Remember where you previously were before you move, then make sure you don't accidentally go back to that place.","There are secrets in this game, if you collect a page a new path might pop up on the other side of the world...","Drawing out a graph of each node might help you form a graph of the world letting you understand where you actually are.","Nodes begining with the same 3 letter are generally near each other. For example, RNG1A and RNG3A have only one computer between them, while ERR5G and COM2A have five computers between them.","Some places, especially in the Dark Web have one way only connections. For example, if you go from TOR2B to TOR1A, you have to find another way around.","A secret connection may or may not open at COM2A when one collects a possibly existing page as RNG2B.","Do not always believe the word \"Error\".","You don't deserve a hint.","I don't want to give you a hint","Stop asing for hints!"]; //hints
	let choice = Math.floor(Math.random() * hints.length); //generate random number between 0 and the amount of hints
	document.getElementById("hint").textContent = hints[choice]; //show hint
}
setInterval(function() {
	for(i=0;i<pages.length;i++) {
		if(areas[pages[i]].page) {
			return; //stop the function if a page has not been collected
		}
	}
	if(Area.slice(0,3) == "TOR") {
		return; //user must be outside of the Dark Web as stated in TOR2A, TOR2B and TOR2D
	}
	Reset(); //reset game if you win
	delButton("next");
	clearButtons(); //if the function reaches here, the player has collected all the pages
	setText("Web Browser: So you found the pages. I suppose that means I leave you now. But, remember me. I may come back.");
	document.getElementById("page").textContent = "";
},1000); //check if player has won