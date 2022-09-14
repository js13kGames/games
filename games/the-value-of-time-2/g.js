// < >

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var dragging=false;
var mousex=-100;
var mousey=-100;
var oldmousex,oldmousey;
var level=0;
var drawable=[];
var start;
var startCountries=[];
var end;
var reset;
var playMode=false;
var timeLeft=0;
var trail=[];
var agingSpeed=3;
var activeCountry=start;
var startTime;
var cooldown=false;
var allTrails=[];
var readyToPlay=false;

//TODO DEBUG
level=0;
//TODO DEBUG

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = 1280;//window.innerWidth;
canvasH=canvas.height = 800;//window.innerHeight;

//controls
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);

setup();
setInterval(run, 33);

//win the level
function win()
{
    playMode=false;
    cooldown=true;
    canvas.style.cursor = "default";
    var tmp=new Object();
    tmp.type="big_message";
    tmp.color="#090";
    tmp.x=canvasW/2;
    tmp.y=400;
    tmp.text="You got it!";
    if(activeCountry)
    {
        activeCountry.won=true;
        activeCountry.x=mousex;
        activeCountry.y=mousey;
        var nDone=startCountries.filter(c => c.won).length;
        tmp.text+="\n"+nDone+"/"+startCountries.length;
    }
    drawable.push(tmp);
    setTimeout(function(){
        if(activeCountry)
        {
            activeCountry.won=true;
            var levelCompleted=true
            startCountries.forEach(el => { if(!el.won) levelCompleted=false; });
            if(levelCompleted)
            {
                levelUp();
            }
            else
            {
                activeCountry.trail=[...trail];
                activeCountry=null;
                setup();
                reset.disabled=false;
            }
        }
        else
            levelUp();
    },2000);
}
function fail()
{
    if(activeCountry)
    {
        activeCountry.trail=[...trail];
        activeCountry.won=false;
    }
    playMode=false;
    cooldown=true;
    timeLeft=-1;
    canvas.style.cursor="none";

    var tmp=new Object();
    tmp.type="big_message";
    tmp.color="#ab0a08";
    tmp.x=canvasW/2;
    tmp.y=400;
    tmp.text="YOU DIED";
    drawable.push(tmp); 

    tmp=new Object();
    tmp.type="tomb";
    tmp.x=mousex;
    tmp.y=mousey;
    drawable.push(tmp); 
    //ending
    if(level==89)
    {
        tmp=new Object();
        tmp.type="commentary";
        tmp.color="#ab0a08";
        tmp.x=480;
        tmp.y=500;
        tmp.text="and then, there will be nothing.";
        drawable.push(tmp);
        setTimeout(function(){  
            level=99;
            canvas.style.cursor="none";
            setup();
        },6000);
    }
    else
    {
        setTimeout(function(){  
            canvas.style.cursor="default";
            setup();
            reset.disabled=false;
        },2000);   
    }       
}
function levelUp()
{
    setTimeout(function() {        
        oldmousex=-100;
        oldmousey=-100;
        trail=[];
        startCountries=[];
        level++;
        if(level>=9)
            level=89;
        setup();
    },33);
}
//setup all the objects
function setup()
{
    drawable=[];
    if(trail.length>0)
        allTrails.push([...trail]); //save all trails, for the big ending
    trail=[];
    activeCountry=null;
    playMode=false;
    cooldown=false;
    timeLeft=0;

    start=new Object()
    start.type="start";
    start.x=canvasW-200;
    start.y=canvasH-100;
    start.width=200;
    start.height=100;
    start.bgcolor="#666";
    start.color="#FFF";
    drawable.push(start);

    end=new Object()
    end.type="end";
    end.x=50;
    end.y=30;
    end.width=125;
    end.height=125;
    end.bgcolor="#003a00";
    end.color="#FFF";
    end.disabled=true;
    drawable.push(end);

    reset=new Object()
    reset.type="reset";
    reset.x=1220;
    reset.y=2;
    reset.width=58;
    reset.height=20;
    reset.color="#FFF";
    reset.disabled=true;
    drawable.push(reset);

    if(level==0)
    {
        start.disabled=true;
    }
    else if(level==1)
    {
        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=250;
        tmp.width=900;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=600;
        tmp.y=550;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);
    }
    else if(level==2)
    {
        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=250;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=canvasW-200;
        tmp.y=350;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=100;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=450;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=100;
        tmp.y=550;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=10;
        drawable.push(tmp);
    }    
    else if(level==3)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            tmp.color='#0777d6';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="AFRICA";
            tmp.age=51;
            tmp.type="country";
            tmp.color='#643906';
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }
        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=1000;
        tmp.y=2;
        tmp.width=50;
        tmp.height=600;
        tmp.color1="#e63300";
        tmp.color2="#770000";
        tmp.color3="#e63300";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=250;
        tmp.width=1000-2;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=canvasW-100;
        tmp.y=100;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=850;
        tmp.y=100;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);
    }
    else if(level==4)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            tmp.color='#fc1e49';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            tmp.color='#0777d6';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="ICELAND";
            tmp.age=82;
            tmp.type="country";
            tmp.color='#1ffff5';
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=500;
        tmp.width=750-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=750;
        tmp.y=2;
        tmp.width=50;
        tmp.height=550-2;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=950;
        tmp.y=650;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=999;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=300;
        tmp.width=350-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=350;
        tmp.y=2;
        tmp.width=50;
        tmp.height=350-2;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=550;
        tmp.y=400;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=30;
        drawable.push(tmp);
    }
    else if(level==5)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            tmp.color='#fc1e49';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            tmp.color='#0777d6';
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=500;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=1000;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=800;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=600;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=400;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=200;
        tmp.y=620;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        tmp.missingTime=55;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=250;
        tmp.width=canvasW-tmp.x-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=300;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=500;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=700;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=900;
        tmp.y=370;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=5;
        drawable.push(tmp);
    }   
    else if(level==8)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            tmp.color='#fc1e49';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="AFRICA";
            tmp.age=51;
            tmp.type="country";
            tmp.color='#643906';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="ICELAND";
            tmp.age=82;
            tmp.type="country";
            tmp.color='#1ffff5';
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=200;
        tmp.y=200;
        tmp.width=50;
        tmp.height=400;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=600;
        tmp.y=200;
        tmp.width=50;
        tmp.height=400;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=800;
        tmp.y=200;
        tmp.width=50;
        tmp.height=400;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=200;
        tmp.y=2;
        tmp.width=50;
        tmp.height=200;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=600;
        tmp.y=150;
        tmp.width=250;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click"
        tmp.x=100;
        tmp.y=250;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingClick=6;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover"
        tmp.x=725;
        tmp.y=250;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        tmp.missingTime=330;
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=300;
        tmp.width=198;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=650;
        tmp.y=300;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=425;
        tmp.y=325;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=550;
        tmp.width=198;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=650;
        tmp.y=550;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=425;
        tmp.y=575;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=425;
        tmp.width=198;
        tmp.height=50;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.color3="#0db3a9";
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=725;
        tmp.y=450;
        tmp.radius=30;
        tmp.color1="#0db3a9";
        tmp.color2="#000";
        tmp.key="cyan";
        drawable.push(tmp);
    }
    else if(level==7)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="SHANGRI-LA";
            tmp.age=400;
            tmp.type="country";
            tmp.color='#fc1e49';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="ATLANTIS";
            tmp.age=300;
            tmp.type="country";
            tmp.color='#1ffff5';
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=200;
        tmp.width=1000;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=200;
        tmp.y=600;
        tmp.width=1080-2;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=200;
        tmp.y=350;
        tmp.width=50;
        tmp.height=300;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=450;
        tmp.y=250;
        tmp.width=50;
        tmp.height=275;
        tmp.color1="#770000"
        tmp.color2="#e63300"
        tmp.color3="#770000"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=750;
        tmp.y=350;
        tmp.width=50;
        tmp.height=250;
        tmp.color1="#770000"
        tmp.color2="#e63300"
        tmp.color3="#770000"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=1000;
        tmp.y=200;
        tmp.width=50;
        tmp.height=325;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=600;
        tmp.width=200-2;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=475;
        tmp.width=200-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=2;
        tmp.y=350;
        tmp.width=200-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=250;
        tmp.y=350;
        tmp.width=200;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=250;
        tmp.y=475;
        tmp.width=200;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=500;
        tmp.y=350;
        tmp.width=250;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=500;
        tmp.y=475;
        tmp.width=250;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=800;
        tmp.y=350;
        tmp.width=200;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=800;
        tmp.y=475;
        tmp.width=200;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=1050;
        tmp.y=200;
        tmp.width=227;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=1050;
        tmp.y=350;
        tmp.width=227;
        tmp.height=50;
        tmp.color1="#0e1cff";
        tmp.color2="#000883";
        tmp.color3="#0e1cff";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=1050;
        tmp.y=475;
        tmp.width=227;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=475;
        tmp.y=725;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=625;
        tmp.y=725;
        tmp.radius=30;
        tmp.color1="#37ff2b";
        tmp.color2="#000";
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=775;
        tmp.y=725;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#000"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=475;
        tmp.y=125;
        tmp.radius=30;
        tmp.color1="#0e1cff";
        tmp.color2="#000";
        tmp.key="blue";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold";
        tmp.x=625;
        tmp.y=125;
        tmp.radius=30;
        tmp.color1="#37ff2b";
        tmp.color2="#000";
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=775;
        tmp.y=125;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#000"
        tmp.key="yellow";
        drawable.push(tmp);
    }
    else if(level==6)
    {
        if(startCountries.length==0)
        {
            var tmp=new Object();
            tmp.label="USA";
            tmp.age=79;
            tmp.type="country";
            tmp.color='#fc1e49';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="EUROPE";
            tmp.age=80;
            tmp.type="country";
            tmp.color='#0777d6';
            startCountries.push(tmp);

            var tmp=new Object();
            tmp.label="CHINA";
            tmp.age=75;
            tmp.type="country";
            tmp.color='#ffcd1f';
            startCountries.push(tmp);
        }
        else
        {
            startCountries.forEach(el => { el.disabled=false; });
        }

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=150;
        tmp.y=600;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=700;
        tmp.y=600;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=150;
        tmp.y=450;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=700;
        tmp.y=450;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=150;
        tmp.y=300;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=700;
        tmp.y=300;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=150;
        tmp.width=550-2;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=700;
        tmp.y=150;
        tmp.width=400;
        tmp.height=50;
        tmp.color1="#e63300"
        tmp.color2="#770000"
        tmp.color3="#e63300"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=550;
        tmp.y=150;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.color3="#0db3a9";
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=550;
        tmp.y=300;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.color3="#0db3a9";
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=550;
        tmp.y=450;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.color3="#0db3a9";
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle";
        tmp.x=550;
        tmp.y=600;
        tmp.width=150;
        tmp.height=50;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.color3="#0db3a9";
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hover";
        tmp.x=620;
        tmp.y=720;
        tmp.radius=30;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.missingTime=500;
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_click";
        tmp.x=620;
        tmp.y=80;
        tmp.radius=30;
        tmp.color1="#0db3a9";
        tmp.color2="#0a5550";
        tmp.missingClick=1;
        tmp.key="cyan";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=1100;
        tmp.y=600;
        tmp.width=180-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=450;
        tmp.width=150-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=1100;
        tmp.y=300;
        tmp.width=180-2;
        tmp.height=50;
        tmp.color1="#088300"
        tmp.color2="#37ff2b"
        tmp.color3="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=80;
        tmp.y=550;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=1190;
        tmp.y=400;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=80;
        tmp.y=250;
        tmp.radius=30;
        tmp.color1="#37ff2b"
        tmp.color2="#088300"
        tmp.key="green";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=1100;
        tmp.y=450;
        tmp.width=180-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=2;
        tmp.y=300;
        tmp.width=150-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="obstacle"
        tmp.x=1100;
        tmp.y=150;
        tmp.width=180-2;
        tmp.height=50;
        tmp.color1="#a18700"
        tmp.color2="#ffdc2b"
        tmp.color3="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=80;
        tmp.y=400;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=1190;
        tmp.y=550;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="button_hold"
        tmp.x=1190;
        tmp.y=250;
        tmp.radius=30;
        tmp.color1="#ffdc2b"
        tmp.color2="#a18700"
        tmp.key="yellow";
        drawable.push(tmp);
    }
    //almost over
    else if(level==89)
    {
        for(i=drawable.length-1;i>=0;i--)
            if(drawable[i]==end || drawable[i]==reset || drawable[i]==start)
            {
                drawable.splice(i,1);
                i++;
            }
    }

    //commentary
    if(level==1)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=100;
        tmp.y=400;
        tmp.text="During our lifespan,\nwe all try to reach our goal"
        drawable.push(tmp);
    }
    else if(level==2)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=140;
        tmp.y=380;
        tmp.text="Sometimes it is easy.\nMost of the time it is not.\n"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=180;
        tmp.y=550;
        tmp.text="But you have enough time\nto overcome all obstacles\nthat are in between!"
        drawable.push(tmp);
    }
    else if(level==3)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=150;
        tmp.text="With some help, you can reach goals\nthat you thought were impossible!"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=450;
        tmp.text="But remember to help other as well!"
        drawable.push(tmp);        
    }
    else if(level==4)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=70;
        tmp.y=450;
        tmp.text="A lifetime can seem like a lot of time.."
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=70;
        tmp.y=650;
        tmp.text="But if you not focus,\nit will slips away without achieving anything.."
        drawable.push(tmp);
    }
    else if(level==5)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=150;
        tmp.text="Some goals are harder to reach than others."
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=450;
        tmp.text="Luckily, you can get help in the process!"
        drawable.push(tmp);
    }
    else if(level==6)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=250;
        tmp.text="The key of working together is coordination!"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=400;
        tmp.text="If everyone does his part, we can all win!"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=300;
        tmp.y=550;
        tmp.text="Even if someone will have easier task than others.."
        drawable.push(tmp);
    }
    else if(level==7)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=350;
        tmp.y=50;
        tmp.text="Someone may have more time than others.."
        drawable.push(tmp);
    }
    else if(level==8)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=950;
        tmp.y=250;
        tmp.text="“Each of us needs of all of us\nand \nall of us needs each of us”"
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=950;
        tmp.y=450;
        tmp.text="Using all the time\nthat we have.."
        drawable.push(tmp);
    }
    else if(level==89)
    {
        var tmp=new Object();
        tmp.type="big_message";
        tmp.x=canvasW/2;
        tmp.y=250;
        tmp.text="Death is not the enemy.\nIt's the ultimate motivator."
        tmp.color="#FFF";
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=400
        tmp.y=400;
        tmp.text="Without it, nobody will ever try\nto find a purpose.\nTo achieve a goal."
        drawable.push(tmp);

        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=900
        tmp.y=730;
        tmp.text="Never forget it"
        drawable.push(tmp);
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=900
        tmp.y=755;
        tmp.text="and thanks\nfor playing!"
        tmp.disabled=true;
        drawable.push(tmp);

        drawable.push(start);
    }
    else if(level==0)
    {
        var tmp=new Object();
        tmp.type="commentary";
        tmp.x=400
        tmp.y=700;
        tmp.text="We don't stop playing because we grow old\nwe grow old because we stop playing."
        drawable.push(tmp);
    }

    //calculate countries properties
    for(i=0;i<startCountries.length;i++)
    {
        var el=startCountries[i];
        el.x=start.x+3+100*Math.floor(i/3);
        el.y=start.y+3+(i%3)*30;
        el.width=4+10*el.label.length;
        el.height=24;
        drawable.push(el);
    }
    //disable all buttons (in order to reenable that on start)
    drawable.forEach(el => { if(el.type.startsWith("button")) el.disabled=true; });
}
function clickedReset(obj)
{
    setTimeout(function() {        
        oldmousex=-100;
        oldmousey=-100;
        trail=[];
        startCountries=[];
        setup();
    },33);
}
function clickedStart(obj)
{
    playMode=true;
    start.disabled=true;
    end.disabled=false;
    drawable.forEach(el => { if(el.type=="commentary") el.disabled=true; });
    drawable.forEach(el => { if(el.type.startsWith("button")) el.disabled=false; });
    canvas.style.cursor = "default";
    if(!obj || obj==start)
    {
        timeLeft=726;
    }
    else
    {
        startCountries.forEach(el => { el.disabled=(el!=obj); });
        timeLeft=obj.age*10;
        obj.trail=[];
        activeCountry=obj;
    }
    startTime=Date.now();
}
//check if mouse is inside obj
function isSelected(obj,tx,ty)
{
    if(tx==null)
    {
        tx=mousex;
        ty=mousey;
    }
    //circle-based
    if(obj.radius>0 && distanceFrom(tx,ty,obj.x,obj.y) < obj.radius)
        return true;
    else if(obj.radius>0)
        return false;
    //rectangle-based
    if(tx < obj.x) return false;
    if(tx > obj.x + obj.width) return false;
    if(ty < obj.y) return false;
    if(ty > obj.y + obj.height) return false;
    return true;
}
//draw a single object
function draw(obj)
{
    ctx.save();
    ctx.fillStyle=obj.color;
    if(obj.disabled)
        ctx.globalAlpha=0.2;
    if(obj.type=="big_message")
    {
        if(level==89)
            ctx.globalAlpha=0.97;
        else
            ctx.globalAlpha=0.7;
        ctx.fillStyle="#000";
        ctx.fillRect(2,2,canvasW-4,canvasH-4);
        ctx.globalAlpha=1;
        ctx.fillStyle=obj.color;
        ctx.font = "90px sans-serif";
        ctx.textAlign="center";
        var text=obj.text.split("\n");
        for(i=0;i<text.length;i++)
            ctx.fillText(text[i],obj.x,obj.y+i*100);
    }
    if(obj.type=="commentary")
    {
        ctx.fillStyle = "#AAA";
        ctx.font = "25px sans-serif";
        var text=obj.text.split("\n");
        if(obj.disabled)
            ctx.globalAlpha=0.05;
        for(i=0;i<text.length;i++)
            ctx.fillText(text[i],obj.x,obj.y+i*25);
    }
    if(obj.type=="cursor")
    {
        ctx.strokeStyle = "#000";
        if(obj.color)
        {
            ctx.fillStyle = obj.color;
        }
        else
        {
            ctx.fillStyle = "#FFF";
        }
        var cursor=new Path2D("M"+obj.x+" "+obj.y+" l 0 17 l 4 -2 l 2 5 l 2 0 l -2 -5 l 4 -2 Z");
        ctx.stroke(cursor);
        ctx.fill(cursor);        
    }
    if(obj.type=="tomb")
    {
        ctx.fillStyle = "#EEE";
        ctx.font = "30px sans-serif";
        ctx.fillText("☠",obj.x-15,obj.y+15);     
    }
    if(obj.type=="reset")
    {
        ctx.fillStyle = "#FFF";
        ctx.font = "15px sans-serif";
        ctx.fillText("Reset ♻",obj.x,obj.y+15);        
    }
    if(obj.type=="start")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        ctx.fillStyle=obj.color;
        ctx.font = "150px sans-serif";
        ctx.fillText("🗺",obj.x,obj.y+100);
    }
    if(obj.type=="country")
    {
        if(obj.selected)
        {
            ctx.font = "16px monospace";
            ctx.fillStyle="#999";
        }
        else
        {
            ctx.font = "15px monospace";
            ctx.fillStyle="#000";
        }
        
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        if(obj.won)
            ctx.fillStyle="#9F9";
        else
            ctx.fillStyle="#FFF";
        ctx.fillRect(obj.x+2,obj.y+2,obj.width-4,obj.height-4);
        ctx.fillStyle="#000";
        ctx.fillText(obj.label,obj.x+5,obj.y+16);
    }
    if(obj.type=="end")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        ctx.fillStyle=obj.color;
        ctx.font = "100px sans-serif";
        ctx.fillText("🏁",obj.x,obj.y+100);
    }
    if(obj.type=="circle")
    {
        ctx.fillStyle=obj.bgcolor;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle=obj.color;
        ctx.stroke();
    }
    if(obj.type=="button_click")
    {
        ctx.fillStyle=obj.color2;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //inner circle
        if(obj.clicked)
            ctx.fillStyle=obj.color2;
        else    
            ctx.fillStyle=obj.color1;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius*0.8, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //text
        if(obj.missingClick>0)
        {
            ctx.fillStyle="#000";
            ctx.font = "18px sans-serif";
            ctx.textAlign="center";
            ctx.fillText(obj.missingClick,obj.x,obj.y+5);
        }        
    }
    if(obj.type=="button_hover")
    {
        //bug on Firefox: https://stackoverflow.com/questions/58807793/firefox-canvas-with-radial-gradient-and-globalalpha-0-1-not-working-on-two-machi
        if(obj.disabled)
        {
            ctx.fillStyle = obj.color1;
        }
        else
        {
            const gradient = ctx.createRadialGradient(obj.x, obj.y, obj.radius*0.5, obj.x, obj.y, obj.radius);
            if(obj.selected)
                gradient.addColorStop(0, obj.color2);
            else
                gradient.addColorStop(0, obj.color1);
            gradient.addColorStop(1, obj.color2);
            ctx.fillStyle = gradient;
        }
        
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //clock markers
        for (var i = 0; i < 12; i++) {
            angle = (i - 3) * (Math.PI * 2) / 12;
            ctx.lineWidth = 1;
            ctx.beginPath();
            var x1 = obj.x + Math.cos(angle) * (obj.radius*0.7);
            var y1 = obj.y + Math.sin(angle) * (obj.radius*0.8);
            var x2 = obj.x + Math.cos(angle) * (obj.radius);
            var y2 = obj.y + Math.sin(angle) * (obj.radius);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
        //text
        if(obj.missingTime>0)
        {
            ctx.fillStyle="#000";
            ctx.font = "18px sans-serif";
            ctx.textAlign="center";
            ctx.fillText((obj.missingTime/10).toFixed(1),obj.x,obj.y+5);
        }        
    }
    if(obj.type=="button_hold")
    {
        //bug on Firefox: https://stackoverflow.com/questions/58807793/firefox-canvas-with-radial-gradient-and-globalalpha-0-1-not-working-on-two-machi
        if(obj.disabled)
        {
            ctx.fillStyle = obj.color1;
        }
        else
        {
            const gradient = ctx.createRadialGradient(obj.x, obj.y, obj.radius*0.1, obj.x, obj.y, obj.radius);
            if(obj.selected)
                gradient.addColorStop(0, obj.color2);
            else
            {
                gradient.addColorStop(0, obj.color1);
                gradient.addColorStop(0.1, obj.color2);
                gradient.addColorStop(0.2, obj.color1);
                gradient.addColorStop(0.3, obj.color2);
                gradient.addColorStop(0.4, obj.color1);
                gradient.addColorStop(0.5, obj.color2);
                gradient.addColorStop(0.6, obj.color1);
                gradient.addColorStop(0.7, obj.color2);
                gradient.addColorStop(0.8, obj.color1);
                gradient.addColorStop(0.9, obj.color2);
            }                
            gradient.addColorStop(1, obj.color1);
            ctx.fillStyle = gradient;
        }
        
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle="#000";
        ctx.stroke();
        //text
        if(obj.missingTime>0)
        {
            ctx.fillStyle="#000";
            ctx.font = "18px sans-serif";
            ctx.fillText((obj.missingTime/10).toFixed(1),obj.x-15,obj.y+5);
        }        
    }
    if(obj.type=="obstacle")
    {
        const gradient = ctx.createLinearGradient(obj.x,obj.y,obj.x+obj.width,obj.y+obj.height);
        gradient.addColorStop(0, obj.color1);
        gradient.addColorStop(.5, obj.color2);
        gradient.addColorStop(1, obj.color3);
        ctx.fillStyle = gradient;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
    }
    ctx.restore();
}
function drawLinks()
{
    var keys=[];
    //scorri dravable e enumera i key
    drawable.forEach(el => {
        if(el.key && !keys.includes(el.key))
            keys.push(el.key);
    });
    ctx.globalAlpha=0.2;
    //per ogni key
    keys.forEach(k =>
    {
        //per ogni button
        drawable.filter(b => b.type.startsWith("button")).filter(b => b.key && b.key==k).forEach(b =>
        {
            //per ogni obstacle non disattivato
            drawable.filter(o => o.type.startsWith("obstacle")).filter(o => !o.disabled).filter(o => o.key && o.key==k).forEach(o =>
            {
                //trova il punto centrale di entrambi, e traccia una line che fa angolo
                var ox=o.x+o.width/2;
                var oy=o.y+o.height/2;
                ctx.strokeStyle=o.color1;
                ctx.beginPath();
                ctx.moveTo(b.x, b.y);
                if(Math.abs(b.x-ox)<Math.abs(b.y-oy))
                    ctx.lineTo(ox,b.y);
                else
                    ctx.lineTo(b.x,oy);
                ctx.lineTo(ox,oy);
                ctx.stroke();
            });
                
        });
    });
    ctx.globalAlpha=1;
}
//main loop that draw the screen
function run()
{
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);
    //real end
    if(level==99)
        return;
    //border
    ctx.fillStyle="#FFF";
    ctx.fillRect(0,0,canvasW,1);
    ctx.fillRect(0,canvasH-1,canvasW,1);
    ctx.fillRect(0,0,1,canvasH);
    ctx.fillRect(canvasW-1,0,1,canvasH);

    if(level > 0 && level < 89)
    {
        //current level
        ctx.font = "10px sans-serif";
        ctx.fillText("Level "+level,5,10);    
    }
    //MENU
    else if(level != 89)
    {
        ctx.fillStyle="#FFF";
        ctx.font = "12px sans-serif";
        ctx.fillText("Made for JS13KGames - By Infernet89 ",3,canvasH-5);   

        const gradient = ctx.createLinearGradient(0,0,0,200);
        gradient.addColorStop(0, "#EEE");
        gradient.addColorStop(1, "#222");
        ctx.fillStyle = gradient;
        ctx.font = "120px sans-serif";
        ctx.textAlign="center";
        ctx.fillText("The Value of Time 2",canvasW/2,140);

        ctx.font = "300px sans-serif";
        ctx.fillText("⏳",canvasW/2,500);
        ctx.textAlign="left";

        if(!readyToPlay)
        {
            ctx.fillStyle="#FFF";
            ctx.font = "50px sans-serif";
            ctx.fillText("PLAY",1120,770);  
        }

        if(!readyToPlay && start.selected)
        {
            canvas.style.cursor="pointer";
            if(dragging)
            {
                readyToPlay=true;
                canvas.style.cursor="default";
                for(i=drawable.length-1;i>=0;i--)
                    if(drawable[i]==end || drawable[i]==start)
                    {
                        drawable.splice(i,1);
                        i++;
                    }
            }
        }
        else if(timeLeft > agingSpeed)
            canvas.style.cursor="default";

        //move cursor
        drawable.filter(el => el.type=="cursor").forEach(el => {
            el.dx*=0.99;
            el.dy+=1;
            el.x+=el.dx; 
            el.y+=el.dy; 
        });
        timeLeft-=agingSpeed;
        if(timeLeft > agingSpeed)
        {
            //aging cursors
            ctx.fillStyle="#FFF";
            ctx.font = "10px sans-serif";
            ctx.fillText((timeLeft/10)+" years",mousex,mousey);
        }       
        if(timeLeft <= agingSpeed && timeLeft > 0)
        {
            var tmp=new Object();
            tmp.type="cursor";
            tmp.x=mousex;
            tmp.y=mousey;
            tmp.color="#CCC";
            tmp.dx=mousex-oldmousex;
            tmp.dy=mousey-oldmousey;
            drawable.push(tmp);//ok, on the long run is a memory leak. But we'll clean memory on start so NVM.
            canvas.style.cursor="none";
        }
        else if(timeLeft < -30 && !readyToPlay)
        {
            canvas.style.cursor="default";
            if(!readyToPlay)
                timeLeft=726;
        }
        else if(readyToPlay && timeLeft < -100)
        {
            level++;
            setup();
            return;
        }

            
    }   

    drawLinks();    
    drawable.forEach(el => draw(el));
    drawable.forEach(el => { el.selected=isSelected(el); });

    if(cooldown) return;

    if(!playMode && level> 0)
    {
        //draw older trails
        startCountries.filter(el => el.trail && el.trail.length>0).forEach( el => { drawTrail(el.trail);});

        if(start.selected)
        {
            if(startCountries.length>0)
            {
                canvas.style.cursor = "default";
                startCountries.forEach(el => {
                    if(el.selected)
                    {
                        canvas.style.cursor = "pointer";
                        if(dragging)
                        {
                            clickedStart(el);
                        }
                    }
                });
            }
            else
            {
                canvas.style.cursor = "pointer";
                if(dragging)
                {
                    clickedStart();
                }
            }            
        }
        //reset
        else if(reset.selected && !reset.disabled)
        {
            canvas.style.cursor = "pointer";
            if(dragging)
            {
                clickedReset();
            }
        }
        else if(timeLeft!=-1)
        {
            canvas.style.cursor = "default";
        }
    }
    //we are playing
    else if(level > 0)
    {
        if(end.selected)
        {
            canvas.style.cursor = "pointer";
            if(dragging)
                win();
        }
        else
        {
            canvas.style.cursor = "default";
        }
        ctx.fillStyle="#FFF";
        ctx.font = "10px sans-serif";
        if(level==89)
        {
            size=20-Math.round(timeLeft/100);
            ctx.font = size+"px sans-serif";
        }
        ctx.fillText((timeLeft/10)+" years",mousex,mousey);
        timeLeft-=agingSpeed;
        if(playMode && (timeLeft <=0 || checkCollisions()))
        {
            fail();
        }
        else if (playMode)
        {
            var tick=Date.now()-startTime;
            trail.push(mousex+"_"+mousey+"_"+dragging+"_"+tick);
            drawTrail(trail);
            startCountries.forEach(el => { 
                if(el.trail && el.trail.length>0)
                {
                    drawTrail(el.trail,tick,el.color);
                    handleGhost(el.trail,tick);
                }                                 
            });
        }
        //ending
        if(level==89)
        {
            allTrails.forEach(el =>drawTrail(el,tick));
        }
    }


    //log trail
    oldmousex=mousex;
    oldmousey=mousey;
}
function handleGhost(obj,limit)
{
    if(obj.length<1) return;
    if(obj[0].length<4) return;
    for(var i=0;i<obj.length;i++)
    {
        var tick=obj[i].split("_")[3];
        if(tick>limit) break;
    }
    if(i>=obj.length) return;
    var x=obj[i].split("_")[0];
    var y=obj[i].split("_")[1];
    var drag=(obj[i].split("_")[2])=="true"?true:false;
    obj.x=x;
    obj.y=y;
    obj.drag=drag;
    //prima i release
    drawable.forEach(el => { 
        //facciamo la release SOLO se non c'è il player sopra
        if(el.type.startsWith("button_") && el.holding && !isSelected(el))
        {
            //check if someone else is here
            var toRelease=true;
            startCountries.forEach(c => { 
                if(c.trail && c.trail.x>0 && !isSelected(el,c.trail.x,c.trail.y))
                {
                    toRelease=false;
                }                                 
            });
            if(toRelease)
            {
                releaseButton(el);
                unclickButton(el);
            }
                
        }
    });
    //poi controlliamo se fare hover
    drawable.forEach(el => { 
        if(el.type.startsWith("button_"))
        {
            if(isSelected(el,x,y))
            {
                hoverButton(el);
                if(drag)
                {
                    clickButton(el);
                }
                else
                {
                    unclickButton(el);
                }
            }
        }
    });
}
function drawTrail(obj,limit=9999999,color=null)
{
    if(obj.length<1) return;
    if(obj[0].length<4) return;
    ctx.strokeStyle = "#010";
    var oldx=obj[0].split("_")[0];
    var oldy=obj[0].split("_")[1];
    for(var i=0;i<obj.length;i++)
    {
        var x=obj[i].split("_")[0];
        if(x<0) continue;
        var y=obj[i].split("_")[1];
        var tick=obj[i].split("_")[3];
        if(tick>limit) break;
        ctx.beginPath();
        ctx.moveTo(oldx, oldy);
        ctx.lineTo(x, y);
        ctx.stroke(); 
        ctx.closePath();
        oldx=x;
        oldy=y;
    }
    if(limit<9999999)
    {
        var tmp=new Object();
        tmp.type="cursor";
        tmp.x=oldx;
        tmp.y=oldy;
        tmp.color=color;
        draw(tmp);
    }
}
//return true if it has collided with something (obstacle)
function checkCollisions()
{
    var res=false;
    if(mousex<0) return true;
    if(mousex>canvasW) return true;
    if(mousey<0) return true;
    if(mousey>canvasH) return true;
    //check obstacles
    drawable.forEach(el => { 
        //obstacles
        if(el.type=="obstacle" && !el.disabled)
        {
            //mouse over
            if(isSelected(el))
                res=true;
            //passed by
            else if(lineRect(oldmousex,oldmousey,mousex,mousey,el.x,el.y,el.width,el.height))
                res=true;
        } 
        //handle buttons
        if(el.type.startsWith("button") && !el.disabled)
        {
            if(isSelected(el))
            {
                hoverButton(el);
                if(dragging)
                {
                    clickButton(el);
                }
                else
                {
                    unclickButton(el);
                }
            }
            else
            {
                releaseButton(el);
            }
        }
    });
    return res;
}
function clickButton(obj)
{
    if(obj.type=="button_click" && !obj.clicked)
    {
        obj.missingClick--;
        obj.clicked=true;
        if(obj.missingClick<=0)
        {
            obj.disabled=true;
            var allDone=true;
            drawable.forEach(el => { 
                if(el.type.startsWith("button_") && !el.disabled && el.key==obj.key)
                {
                    allDone=false;
                }
            });
            if(allDone)
            {
                drawable.forEach(el => { 
                    if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
                    {
                        el.disabled=true;
                    } 
                });
            }
        }
    }    
}
function unclickButton(obj)
{
    if(obj.type=="button_click" && obj.clicked)
    {
        obj.clicked=false;
    }
}
function hoverButton(obj)
{
    if(obj.type=="button_hold")
    {
        holdButton(obj);
    }
    if(obj.type=="button_hover")
    {
        obj.missingTime-=agingSpeed;
        if(obj.missingTime<=0)
        {
            obj.disabled=true;
            var allDone=true;
            drawable.forEach(el => { 
                if(el.type.startsWith("button_") && !el.disabled && el.key==obj.key)
                {
                    allDone=false;
                }
            });
            if(allDone)
            {
                drawable.forEach(el => { 
                    if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
                    {
                        el.disabled=true;
                    } 
                });
            }
        }
    }
}
function holdButton(obj)
{
    if(obj.type=="button_hold" && !obj.holding)
    {
        obj.holding=true;
        drawable.forEach(el => { 
            if(el.type=="obstacle" && !el.disabled && el.key==obj.key)
            {
                el.disabled=true;
            } 
        });
    }    
}
function releaseButton(obj)
{
    if(obj.type=="button_hold" && obj.holding)
    {
        obj.holding=false;
        drawable.forEach(el => { 
            if(el.type=="obstacle" && el.disabled && el.key==obj.key)
            {
                el.disabled=false;
            } 
        });
    }
}

//check if a line intersect a rectangle
function lineRect(x1,y1,x2,y2,rx,ry,rw,rh)
{
    //console.log("Checking ",x1+","+y1,x2+","+y2,"on rectangle",rx+","+ry,rw,rh);
    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    var left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
    var right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    var top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    var bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
        return true;
    }
    return false;
}
//check if two lines intersect
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4)
{
  // calculate the direction of the lines
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }
  return false;
}
/*#############
    Funzioni Utili
##############*/
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}
function distanceFrom(ax,ay,bx,by)
{
    return Math.sqrt((ax-bx)*(ax-bx)+(ay-by)*(ay-by));
}
//uindows
function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function mossoMouse(evt)
{
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function rilasciatoMouse(evt)
{
    dragging=false;    
}
window.AutoScaler = function(element, initialWidth, initialHeight, skewAllowance){
    var self = this;
    
    this.viewportWidth  = 0;
    this.viewportHeight = 0;
    
    if (typeof element === "string")
        element = document.getElementById(element);
    
    this.element = element;
    this.gameAspect = initialWidth/initialHeight;
    this.skewAllowance = skewAllowance || 0;
    
    this.checkRescale = function() {
        if (window.innerWidth == self.viewportWidth && 
            window.innerHeight == self.viewportHeight) return;
        
        var w = window.innerWidth;
        var h = window.innerHeight;
        
        var windowAspect = w/h;
        var targetW = 0;
        var targetH = 0;
        
        targetW = w;
        targetH = h;
        
        if (Math.abs(windowAspect - self.gameAspect) > self.skewAllowance) {
            if (windowAspect < self.gameAspect)
                targetH = w / self.gameAspect;
            else
                targetW = h * self.gameAspect;
        }
        
        self.element.style.width  = targetW + "px";
        self.element.style.height = targetH + "px";
    
        self.element.style.marginLeft = ((w - targetW)/2) + "px";
        self.element.style.marginTop  = ((h - targetH)/2) + "px";
    
        self.viewportWidth  = w;
        self.viewportHeight = h;
        
    }
    
    // Ensure our element is going to behave:
    self.element.style.display = 'block';
    self.element.style.margin  = '0';
    self.element.style.padding = '0';
    
    // Add event listeners and timer based rescale checks:
    window.addEventListener('resize', this.checkRescale);
    rescalercheck=setInterval(this.checkRescale, 1500);
};