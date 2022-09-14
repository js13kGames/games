var money = 30, tiem = 1000, meta = 1000000;
var Timer = window.setInterval(function(){Time()}, tiem), time = 0;
var nrd = 0, nrdcost = 30, nrdadd = 1, addnrd = 1, upnrd = 0, upnrdcost = 100, moarnrdcost = 50;
var gk = 0, gkcost = 90, gkadd = 3, addgk = 1, upgk = 0, upgkcost = 150, moargkcost = 75;
var hkr = 0, hkrcost = 270, hkradd = 9, addhkr = 1, uphkr = 0, uphkrcost = 200, moarhkrcost = 100;
var scnst = 0, scnstcost = 810, scnstadd = 27, addscnst = 1, upscnst = 0, upscnstcost = 250, moarscnstcost = 200;
function Limit(){
	clearInterval(Timer);
	if (alunts >= meta){
		document.getElementById("finish").innerHTML = "Congrats! You beat the game!";
	} else if (alunts < meta){
		document.getElementById("finish").innerHTML = "Try again! You needed at least " + (meta - alunts) + " more!";
	}
	return tiem;
}
function Print(){
	document.getElementById("nrd").innerHTML = nrd;
	document.getElementById("money").innerHTML = "Money: $" + money;
	document.getElementById("nrdcost").innerHTML = "$" + nrdcost;
	document.getElementById("nrdgains").innerHTML = "$" + nrdadd*nrd;
	document.getElementById("nrdadd").innerHTML = "$" + nrdadd;
	document.getElementById("upnrd").innerHTML = upnrd;
	document.getElementById("upnrdcost").innerHTML = upnrdcost + " nerds";
	document.getElementById("gk").innerHTML = gk;
	document.getElementById("gkgains").innerHTML = "$" + gk*gkadd;
	document.getElementById("moarnrdcost").innerHTML = moarnrdcost + " geeks";
	document.getElementById("gkcost").innerHTML = "$" + gkcost;
	document.getElementById("gkadd").innerHTML = "$" + gkadd;
	document.getElementById("upgk").innerHTML = upgk;
	document.getElementById("upgkcost").innerHTML = upgkcost + " geeks";
	document.getElementById("hkr").innerHTML = hkr;
	document.getElementById("hkrgains").innerHTML = "$" + hkr*hkradd;
	document.getElementById("moargkcost").innerHTML = moargkcost + " hackers";
	document.getElementById("hkrcost").innerHTML = "$" + hkrcost;
	document.getElementById("hkradd").innerHTML = "$" + hkradd;
	document.getElementById("uphkr").innerHTML = uphkr;
	document.getElementById("uphkrcost").innerHTML = uphkrcost + " hackers";
	document.getElementById("scnst").innerHTML = scnst;
	document.getElementById("scnstgains").innerHTML = "$" + scnst*scnstadd;
	document.getElementById("moarhkrcost").innerHTML = moarhkrcost + " scientists";
	document.getElementById("scnstcost").innerHTML = "$" + scnstcost;
	document.getElementById("scnstadd").innerHTML = "$" + scnstadd;
	document.getElementById("upscnst").innerHTML = upscnst;
	document.getElementById("upscnstcost").innerHTML = upscnstcost + " scientists";
	document.getElementById("moarscnstcost").innerHTML = moarscnstcost + " scientists";
	document.getElementById("time").innerHTML = "Time elapsed: " + time + "s";
	document.getElementById("howmanynrds").innerHTML = Math.floor(money/nrdcost);
	document.getElementById("howmanygks").innerHTML = Math.floor(money/gkcost);
	document.getElementById("howmanyhkrs").innerHTML = Math.floor(money/hkrcost);
	document.getElementById("howmanyscnsts").innerHTML = Math.floor(money/scnstcost);
	document.getElementById("alunts").innerHTML = "Units: " + alunts + "/1000000";
}
function Time(){
	time++, alunts = nrd + gk + hkr + scnst;
	money = money + nrd*nrdadd + gk*gkadd + hkr*hkradd + scnst*scnstadd;
	Print();
	if (time >= 3600){
		Limit();
	} else if (alunts >= meta){
		Limit();
	}
}
function Buynrd(){
	if (money >= nrdcost){
		money = money - nrdcost;
		nrd = nrd + addnrd;
		nrdcost = nrdcost + 3;
	}
	Print();
}
function Upnrd(){
	if (nrd >= upnrdcost){
		nrd = nrd - upnrdcost;
		upnrd++;
		nrdadd = nrdadd + 1;
		upnrdcost = upnrdcost + 20;
	}
	Print();
}
function Moarnrds(){
	if (gk >= moarnrdcost){
		gk = gk - moarnrdcost;
		moarnrdcost = moarnrdcost + 10;
		upnrd++;
		addnrd = addnrd + 1;
	}
	Print();
}
function Buygk(){
	if (money >= gkcost){
		money = money - gkcost;
		gk = gk + addgk;
		gkcost = gkcost + 9;
	}
	Print();
}
function Upgk(){
	if (gk >= upgkcost){
		gk = gk - upgkcost;
		upgk++;
		gkadd = gkadd + 3;
		upgkcost = upgkcost + 20;
	}
	Print();
}
function Moargks(){
	if (hkr >= moargkcost){
		hkr = hkr - moargkcost;
		moargkcost = moargkcost + 20;
		upgk++;
		addgk = addgk + 1;
	}
	Print();
}
function Buyhkr(){
	if (money >= hkrcost){
		money = money - hkrcost;
		hkr = hkr + addhkr;
		hkrcost = hkrcost + 27;
	}
	Print();
}
function Uphkr(){
	if (hkr >= uphkrcost){
		hkr = hkr - uphkrcost;
		uphkr++;
		hkradd = hkradd + 9;
		uphkrcost = uphkrcost + 30;
	}
	Print();
}
function Moarhkrs(){
	if (scnst >= moarhkrcost){
		scnst = scnst - moarhkrcost;
		moarhkrcost = moarhkrcost + 30;
		uphkr++;
		addhkr = addhkr + 1;
	}
	Print();
}
function Buyscnst(){
	if (money >= scnstcost){
		money = money - scnstcost;
		scnst = scnst + addscnst;
		scnstcost = scnstcost + 81;
	}
	Print();
}
function Upscnst(){
	if (scnst >= upscnstcost){
		scnst = scnst - upscnstcost;
		upscnst++;
		scnstadd = scnstadd + 27;
		upscnstcost = upscnstcost + 40;
	}
	Print();
}
function Moarscnsts(){
	if (scnst >= moarscnstcost){
		scnst = scnst - moarscnstcost;
		moarscnstcost = moarscnstcost + 40;
		upscnst++;
		addscnst = addscnst + 1;
	}
	Print();
}
