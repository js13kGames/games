var Robot = {
	stroke:`351,-53/337,117/331,119/331,128/315,133/315,226/432,252/463,237/461,262/462,275/470,281/480,280/485,266/493,269/500,268/503,259/492,225/504,219/506,179/517,175/517,172/523,174/527,180/533,185/540,185/548,177/549,164/545,139/533,109/526,69/530,34/542,-26/552,-53/548,-52/538,-22/532,9/524,57/524,68/527,90/530,110/541,138/546,164/546,175/540,181/535,182/531,178/525,171/522,170/518,170/516,168/506,169/506,134/468,128/483,-53/478,-53/462,126/390,116/348,126/348,116/343,117/357,-53
467,235/465,265/466,274/472,279/478,278/483,266/478,260/477,257/477,230/467,235
481,229/481,258/485,263/486,257/483,228/481,229
490,225/500,258/497,266/489,264/490,262/487,227/490,225`,
	fill:`427,164/426,236/333,216/331,196/330,176/331,171/332,161/333,156/334,149/427,164`};
var Human = {
	stroke:`79,430/73,406/71,399/70,376/75,354/76,345/85,310/85,302/91,281/108,257/113,255/121,253/128,244/128,239/128,233/132,230/131,227/130,218/124,217/124,203/127,202/128,190/134,178/142,167/157,160/170,158/183,163/193,170/203,181/207,192/207,202/212,203/212,216/206,217/206,224/204,227/208,233/208,237/207,243/214,249/227,252/240,265/246,282/256,299/258,315/262,330/267,347/271,362/274,395/272,399/271,413/267,430/79,430`,
	fill:`136,201/137,190/143,181/155,176/168,174/179,176/188,180/197,187/200,192/201,207/198,214/191,221/176,225/167,225/158,225/147,223/138,218/137,213/136,201
126,247/126,286/131,295/129,306/147,304/174,304/195,306/208,307/205,281/206,260/208,244/216,250/218,281/219,301/222,314/225,332/228,345/229,364/229,377/226,384/222,399/212,418/205,430/194,430/200,418/207,407/214,393/216,382/217,373/212,338/209,322/189,319/167,319/150,319/135,319/128,321/125,339/123,354/120,373/120,381/128,407/139,422/147,430/131,430/125,423/120,410/116,396/112,385/111,368/115,347/119,324/118,307/119,281/119,266/119,254/126,247`
};

parsePoints(Robot);
parsePoints(Human);

function parsePoints(el) {
	for (var key in el) {
		el[key] = el[key].split("\n").map((shape)=>{
                return {x:0,y:0,
                	pts:shape.split("/").map((el)=>{
	                    return el.split(",").reduce((res,pt,id)=>{
	                        if(id%2) res.y = parseInt(pt);
	                        else res.x=parseInt(pt);
	                        return res;
	                    },{})
	                })
                };
            });
	}
}

// line starting with # : Robot sentence
// line starting with > : Human sentence
// / : line break
var Intro = `
Somewhere in the middle of nowhere/that we usually call "SPACE"…
#Ding dong!/It's time to wake up!
>Wow, what a sleep!/I am completely rested!/How long have I been asleep?
#Exactly?/68 years, 19 days, 3 hours,/14 minutes and 6 seconds.
>What?!/I said I wanted to TAKE A/NAP in the crygenics module!
#I didn't know how long a nap lasted,/so I decided to choose …
#a random number of seconds between/0  and  2 147 483 647.
>Oh boy!/I hope nothing serious has happened/during that time …
#Except for the theft of our engine by/pirates, nothing at all …
>What?!/how we are going to move around?
#Don't worry, I have the solution:/I modified our cannon to produce a recoil/strong enough to push us.
#If you avoid always shooting in the same/direction with the X button,/everything should go well …
>What a mess!/Does the emergency button at least/still work?
#Yes, it's the C button.
> …
#By the way, one more thing:
#You haven't paid your bills for over/68 years so there is a bounty on your/head, dead or alive …
#It's possible we'll meet some bounty/hunters …
> Wonderful …
`;

Intro = Intro.split(/\n/m).filter((e)=>e!="");