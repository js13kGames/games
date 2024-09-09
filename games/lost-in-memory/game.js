function gameload(e) {
	var ui = document.getElementById("coma").value
	var out = document.getElementById("game")
	if (ui == "start" && e.keyCode == 13) {
		var text = document.createTextNode("You are a student learning at Harvard.\nOne day, you found yourself lost in the forest.\nYou think that you sleepwalked here.\nWhat will you do?\ngo north\ngo east\n");
		out.appendChild(text);
	} else if (ui == "go north" && e.keyCode == 13) {
		var text = document.createTextNode("You decide to go north. But, you didn't\nnoticed that the forest was really dense.\nThen, you see an axe on the ground.\nWhat will you do?\nuse axe\nkill yourself\n")
		out.appendChild(text);
	} else if (ui == "go east" && e.keyCode == 13) {
		var text = document.createTextNode("You decide to go east. But, you didn't\nnoticed that the forest was really dense.\nThen, you see an axe on the ground.\nWhat will you do?\nuse axe\nkill yourself\n")
		out.appendChild(text);
	} else if (ui == "use axe" && e.keyCode == 13) {
		var text = document.createTextNode("You are going to use the axe to cut the trees\nthat are in your way. Then, you see a light\ncoming from the horizon.  'It's the Sun!', You Said.\nYou also see a mountain bike beside the tree.\nWhat will you do?\nride bike\nkeep cutting\n")
		out.appendChild(text);
	} else if (ui == "kill yourself" && e.keyCode == 13) {
		var text = document.createTextNode("You decided to kill yourself.\nYou have failed to do your job.\n")
		out.appendChild(text);
	} else if (ui == "ride bike" && e.keyCode == 13) {
		var text = document.createTextNode("You chose to ride the bike and you hit a tree.\nThe tree suddenly fell down\nand almost hit you. You ran away and fell into the ravine. You Died.\nThank you for playing Lost\n")
		out.appendChild(text);
	} else if (ui == "keep cutting" && e.keyCode == 13) {
		var text = document.createTextNode("You keep cutting the tree and you got to cut a few.\nSuddenly, the last tree that you chopped fell on you.\nYou Died\nThank you for playing Lost\n")
	} else if (e.keyCode == 13) {
		var text = document.createTextNode("I Do Not Understand!")
		out.appendChild(text)
	}
}
document.onkeydown = gameload;