window.onload = function() {
	
/***Getting all elements needed with DOM****/
    var que = document.getElementsByClassName("q");
    var ans = document.getElementsByClassName("a");
    var letCont = document.getElementById("letters");
    var germat = [];//all letters in an array
    var output = document.getElementById("whatsin");
    var del = document.getElementById("del");
    var corr = document.getElementById("corr");
    var pot = document.getElementById("pot");
    var youwon = document.getElementById("youwon");
    var score = document.getElementById("score");
    var next = document.getElementById("next");
    var goon = document.getElementsByClassName("goon");
    var firstPage = document.getElementById("firstpage");
    var playground = document.getElementById("playground");
    var puf = document.getElementsByClassName("fishek");
    var pika = document.getElementById("pika");
	var hl = document.getElementById("hl");
    
/****************OTHER VARIABLES************/
    var brLine;
    var gInd = 0;
    var shuff = [];
    var undo = [];
    var teSakta = 0;
    var addColor = "";
    var totalLets = 0;
    var chosen;
    var paint;
    var it = 0;
	var hintLeft = 4;
	var actual;
	var noHint = [];
	var free;
	var heve = false;
	
/***********SHUFFLE LEVELS FUNC*************/
    function shuffleLevels(arr) {
        var shuffled = [];
        shuffled.length = arr.length;
        for(var ij = 0; ij<arr.length; ij++) {
    //choose a random kl
            var kl = Math.floor(Math.random()*arr.length);
    //create shuffled elem equal with a[kl]
            shuffled[ij] = arr[kl];
    //careful if a[kl] is undefined because of delete and reprocess random process
            while(arr[kl] == undefined) {
                kl = Math.floor(Math.random()*arr.length);
                shuffled[ij] = arr[kl];
            }
    //delete chosen element so not to be repeated
            delete arr[kl];
        }
        return shuffled;
    }
/**************Random Function**************/
    function rand(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }
    
/***********Generate random gradient********/
    var hexa = "123456789ABCDEF";
    hexa = hexa.split("");
    function randColor() { 
        return "#" + rand(hexa) + rand(hexa) + rand(hexa);
    }
/************Winning message****************/
    function plas() {
        paint = randColor();
        pika.style.animation = "ngrihu 2s infinite";
        for(var c = 0; c<8; c++) {
            puf[c].style.animation = "plas 2s infinite";
            puf[c].style.backgroundColor = paint;
            puf[c].style.boxShadow = "2px 2px 5px " + paint + ",-2px 2px 5px " + paint + ",2px -2px 5px " + paint + ",-2px -2px 5px " + paint;
        }
    }

/*******Creating blueprint for levels*******/
    function level(quest, letters, correct) {
        this.quest = quest;
        this.letters = letters;
        this.correct = correct;
        
    //Method to print data in playground
        this.addData = function() {
          for(var i=0; i<quest.length; i++) {
                que[i].innerHTML = i+1 + ". " + this.quest[i];//add question
                ans[i].innerHTML = this.correct[i].length + " letters";//addlength
                for(var j = 0; j<germat.length; j++) {   
                   germat[j].style.display = "inline-block";
                   germat[j].style.background = "linear-gradient(" + randColor() + ", " + randColor() + ")";//color letters
                }
            }
        };//addData method end
                        
    //Shuffling answers method
        this.shuffle = function shuffle() {
            for(var k = 0; k<15; k++) {
                shuff[k] = rand(this.letters);
                while(shuff[k] == shuff[k-1] || shuff[k] == shuff[k-2] || shuff[k] == shuff[k-3] || shuff[k] == shuff[k-4] || shuff[k] == shuff[k-5] || shuff[k] == shuff[k-6] || shuff[k] == shuff[k-7] || shuff[k] == shuff[k-8] || shuff[k] == shuff[k-9] || shuff[k] == shuff[k-10] || shuff[k] == shuff[k-11] || shuff[k] == shuff[k-12] || shuff[k] == shuff[k-13] || shuff[k] == shuff[k-14]) {
                     shuff[k] = rand(this.letters);
                }                
                germat[k].innerHTML = shuff[k];                
            }
        };//end of shuffle method
	
    //Check if correct answer method
        this.check = function check() {
            corr.onclick = function() {
                for(var m = 0; m<correct.length; m++) {
                    if(output.innerHTML == correct[m].toUpperCase()) {
                        alert("You got one!");
                        ans[m].innerHTML = output.innerHTML;
                        teSakta++;
						noHint.push(correct[m]);
                        totalLets += output.innerHTML.length;
                        score.innerHTML = totalLets;
                        output.innerHTML = "";
                        undo = [];
                        addColor += "," +  randColor();
                        pot.style.background = "linear-gradient(white " + (6-teSakta)*100/6 + "% " + addColor + ")";
                        break;
                    } else {
                        if(m == correct.length-1)
                        alert("Not a correct word!");
                    }
                }
            //won level
                if(teSakta == 6) {
                    alert("You won!");
                    pot.style.background = "linear-gradient(white, white)";
                    youwon.style.display = "block";
                    teSakta = 0;
					hintLeft++;
					hl.innerHTML = hintLeft;
                    addColor = "";
                    var fire = setInterval(plas, 2000);
                }
            };
        };
		
		/**************WORKING WITH HINT METHOD***********/
	    this.hintMethod = function hintMethod() {
			if(noHint.length == 0) {
				actual = rand(this.correct);
			} else {
				free = false;
				while(!free) {
					actual = rand(this.correct);
					for(var p = 0; p<noHint.length; p++) {
						if(actual == noHint[p]) {
							actual = rand(this.correct);
							free = false;
							break;
						} else {
							free = true;
						}
					}
				}
			}
		};
        
        
    }//object initializer end
        
    
    
/*********Structure letters container*******/
    for(var i = 1; i<20; i++) {
        if(i%4 == 0) {
            brLine = document.createElement("br");
            letCont.appendChild(brLine);
        } else {
            germat[gInd] = document.createElement("span");
            letCont.appendChild(germat[gInd]);
            gInd++;
        }
    }

/************Select as part of answer*******/
    for(var l = 0; l<germat.length; l++) {
        germat[l].onclick = function() {
            if(output.innerHTML.length > 8) {
                alert("The length cannot be more than 10 letters!");
            } else {
                output.innerHTML += this.innerHTML;
                undo.push(this);
                this.style.display = "none";
            }
        }
    }
/**************Empty answer*****************/
    del.onclick = function() {
        output.innerHTML = "";
        for(var n = 0; n<undo.length; n++) {
            undo[n].style.display = "inline-block";
        }
        undo = [];
    }
	
/************Creating levels****************/
    var levels = [
		new level(["Component of a plant...", "Component of human body...", "Component of a cell...", "Component of a computer...", "Component of a detergent...", "Component of a dessert..."], ["XY", "LEM", "KID", "NE", "YS", "RIB", "OS", "OME", "MO", "USE", "EN", "ZY", "ME", "FL", "OUR"], ["Xylem", "Kidneys", "Ribosome", "Mouse", "Enzyme", "Flour"]),
		new level(["Is used while studying...", "Is used while cleaning...","Is used while writing...","Is used while fighting...","Is used while having shower...","Is used while eating..."], ["BO", "OK", "CLE", "AN", "ER", "PA", "PER", "PI", "LL", "OW", "SH", "AMP", "OO", "SP", "OON"], ["Book", "Cleaner", "Paper", "Pillow", "Shampoo", "Spoon"]),
		new level(["Works in a computer...", "Works in a classroom...", "Works in a hospital...", "Works up in the air...", "Works in a restaurant...", "Works in an office..."], ["PRO", "GRA", "MM", "ER", "TE", "AC", "HER", "NU", "RSE", "PI", "LOT", "CHI", "EF", "BO", "SS"], ["Programmer", "Teacher", "Nurse", "Pilot", "Chief", "Boss"]),
		new level(["Country in Asia...", "Country in Africa...","Country in North America...","Country in Latin America...","Country in Oceania...","Country in Europe..."], ["QA", "TAR", "SEN", "EG", "AL", "CAN", "ADA", "CO", "LOM", "BIA", "NA", "URU", "SLO", "VEN", "IA"], ["Qatar", "Senegal", "Canada", "Colombia", "Nauru", "Slovenia"]),
		new level(["Red vegetable...", "Green vegetable...", "Yellow vegetable...", "Violet vegetable...", "White vegetable...", "Orange vegetable..."], ["RAD", "ISH", "LET", "TU", "CE", "PEP", "PER", "EGG", "PLA", "NT", "GAR", "LIC", "PU", "MP", "KIN"], ["Radish", "Lettuce", "Pepper", "Eggplant", "Garlic", "Pumpkin"]),
		new level(["Memory Transporter...", "Metallic Transporter...", "Living Transporter...", "Goods Transporter...", "Food Transporter...", "Electron Transporter..."], ["DI", "SK", "PL", "ANE", "DO", "NK", "EY", "TR", "AIN", "DE", "LIV", "ERY", "CU", "RR", "ENT"], ["Disk", "Plane", "Donkey", "Train", "Delivery", "Current"]),
		new level(["A type of dog...", "A type of cat...", "A type of snake...", "A type of bear...", "A type of bird...", "A type of fish..."], ["AK", "IDA", "SI", "AME", "SE", "PYT", "HON", "GRI", "ZZ", "LY", "PEA", "CO", "CK", "CLO", "WN"], ["Akida", "Siamese", "Python", "Grizzly", "Peacock", "Clown"]),
		new level(["Men clothes...", "Women clothes...", "Winter clothes...", "Summer clothes...", "Party clothes...", "Serious clothes..."], ["JA", "CK", "ET", "SKI", "RT", "CO", "AT", "SH", "OR", "TS", "DR", "ESS", "TU", "XE", "DO"], ["Jacket", "Skirt", "Coat", "Shorts", "Dress", "Tuxedo"]),
		new level(["A mammal...", "A bird...", "A reptile...", "An amphibian...", "A fish...", "An archaea..."], ["LI", "ON", "EA", "GLE", "SN", "AKE", "SA", "LA", "MAN", "DRA", "SH", "ARK", "BAC", "TER", "IA"], ["Lion", "Eagle", "Snake", "Salamandra", "Shark", "Bacteria"]),
		new level(["Word used in Mathematics...", "Word used in Physics...", "Word used in Chemistry...", "Word used in Biology...", "Word used in Musics...", "Word used in Basketball..."], ["DER", "IVA", "TE", "SP", "EED", "REA", "CTI", "ON", "ANA", "TO", "MY", "TEM", "PO", "ASS", "IST"], ["Derivate", "Speed", "Reaction", "Anatomy", "Tempo", "Assist"]),
		new level(["Synonim of permitted...", "Synonim of make up for...", "Synonim of stare...", "Synonim of appear...", "Synonim of deliver...", "Synonim of giant..."], ["AL", "LOW", "ED", "CO", "MPE", "NS", "ATE", "GA", "ZE", "SH", "OW", "SPR", "EAD", "HU", "GE"], ["Allowed", "Compensate", "Gaze", "Show", "Spread", "Huge"]),
	    new level(["Opposite of fat...", "Opposite of slim...", "Opposite of interesting...", "Opposite of liar...", "Opposite of progress...", "Opposite of cheap..."], ["SL", "IM", "FAT", "BOR", "ING", "HO", "NE", "ST", "REG", "RE", "SS", "EX", "PEN", "SI", "VE"], ["Slim", "Fat", "Boring", "Honest", "Regress", "Expensive"])
	];
    
    levels = shuffleLevels(levels);
	
/****************Executing******************/
    for(var o = 0; o<goon.length; o++) {
        goon[o].onclick = function() {
            if(it >= levels.length) {
                alert("You managed to prepare every recipe! Congratulations!");
                firstPage.style.display = "block";
                playground.style.display =" none";
                youwon.style.display = "none";
                it = 0;
            } else {				
                firstPage.style.display = "none";
                youwon.style.display = "none";
                playground.style.display = "block";
                for(var c = 0; c<8; c++) {
                    puf[c].style.animation = "pls 2s infinite";
                }
                pika.style.animation = "ngriu 2s infinite";
                
                chosen = levels[it];
                chosen.addData();
                chosen.shuffle();
				chosen.check();                
                it++;
				/************HINTS************************/
				if(!heve) {
				    pot.addEventListener("click", useHint);
					heve = true;
				}
				function useHint() {
					if(hintLeft <= 0) {
						alert("No more hints left.\nTry to win a level so you can get some more...");
						pot.removeEventListener("click", useHint);
					} else {
						chosen.hintMethod();
						alert(actual);
						hintLeft--;
						hl.innerHTML = hintLeft;
					}
				}
			}
		}
    }
}