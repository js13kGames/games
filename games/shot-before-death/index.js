var time=30;
var score=0;
var name="__";
var power=6;

function start(){

    name = prompt("Rules : You have a wrong pistal in which 1st bullets are fired by left click and 2nd by right click and then by left and so on. Your bullet can have at max 6 bullets. Initially it is fully loaded. And you can reload it any time after giving shot on white mark at the center of screen by correct shot button and it will reduce your 3 sec. Before that enter your name:", "Ikan");
    if(name == null || name == "" || name=="null")
    {
        location.reload();
    }
    else
    {
        document.getElementById("name").innerHTML=name;
        changetimer(time);
        zzz=setInterval(changetimer,1000);
        document.getElementById("power").innerHTML=power;
    }
}

function bul_l() {
    if (power>0 && power%2==0) {
        power=6;
        document.getElementById("power").innerHTML=power;
        time-=3;
    }
    else {
        lose();
    }
}
function bul_r() {
    if (power>0 && power%2==1) {
        power=6;
        document.getElementById("power").innerHTML=power;
        time-=3;
    }
    else {
        lose();
    }
}

function left() {
    if(power%2==0 && power>0) {
        score+=1;
        power-=1;
        document.getElementById("score").innerHTML=score;
        document.getElementById("power").innerHTML=power;
    }
    else {
        lose();
    }
}
function right() {
    if(power%2==1 && power>0) {
        score+=1;
        power-=1;
        document.getElementById("score").innerHTML=score;
        document.getElementById("power").innerHTML=power;
    }
    else {
        lose();
    }
}

function lose() {
    document.getElementById("bullet").setAttribute("src", "images/3.jpg");
    alert("Your Name = "+name+" and Score = "+score);
    location.reload()
}

function changetimer()
{ 
  if(time>=0)
    {
    document.getElementById('time').innerHTML= time;
    time--;
}
    else
     {   
        clearInterval(zzz);
        lose();
     }

}