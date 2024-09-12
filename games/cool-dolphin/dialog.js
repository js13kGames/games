var dialog = ["I'm a cool dolphin, one, two, three! [Press E]", "I'm a cool DOLPHIN, I'm a cool DOLPHIN, I'm a cool DOLPHIN, one, two, three! [Press E]", "Ha! You're not a cool dolphin. [Press E]", "Real cool dolphins can count to 20, not just to 3.", "I can do it!", "One, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve...", "Th...", `Ha! You can't say "thirteen"!`, 'Everyone in our sea can say "thirteen"!', "I’ll find another sea!", "A no-thirteen-sea doesn’t exist!", "I’ll find it!"];
/*var dialog = ["I'm cool doolphin one two three, [Press E]",
"I'm cool DOLPHIN I'm cool DOLPHIN I'm cool DOLPHIN one two three. [Press E]",
"Ha! You're not a cool dolphin.",
"Really cool dolphins can count to twenty, not three",
"I can!",
"One, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, th...",
"Th...",
`Ha! You can't say "thirteen"!`,
'Everyone in our sea can say "thirteen"!',
"I'l find other sea",
"There is no place-without-thirteen!",
"I'll find a place like this!"];*/
var left = [0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 2, 0];
var currentPhrase = 0;
document.onkeydown = function(e) {
	pressed[e.key] = true;
	if (e.keyCode != 69) {
		return;
	}
	currentPhrase++;
	//console.log(currentPhrase, currentPhrase < dialog.length);
	if (currentPhrase < dialog.length + 1) {
		dialogH1.innerHTML = dialog[currentPhrase - 1];
		dialogH1.style.textAlign = left[currentPhrase - 1] == 2 ? "end" : !left[currentPhrase - 1] ? "left" : "center";
		dialogH1.style.left = left[currentPhrase - 1] ? "0" : "5%";
	} else if (alive) {
		dialogH1.innerHTML = "";
		//clicked = true;
	} else {
		dialogH1.innerHTML = "";
		frame = 0;
		foam = [];
		ices = [];
		geysers = [];
		mines = [];
		mountains = [];
		dashCharge = 1;
		lastDashUse = 0;
		hints = [
			[window.innerWidth, "Let's restart."],
			[window.innerWidth + 1000, "Press UP and DOWN to swing dolphin"],
			[window.innerWidth + 2000, "Press SPACE to use dash"],
			[window.innerWidth + 3000, "You bounce from ice planes"],
			[window.innerWidth + 4000, "You rise by geysers"],
			[window.innerWidth + 5000, "You die when touch mountains or mines"]];
		player = {
			x: 0,
			y: 100 + ~~(canvas.height / 2),
			dx: 10,
			dy: 0
		}
		alive = true;
	}
}