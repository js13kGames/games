// < >
//constant
const fg="#F9F9F9"; //it stands for foreground color
const bg="#070707"; //it stands for background color
//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var dragging=false;
var mousex=-100;
var mousey=-100;
var level=0;
var drawable=[];
var dt;
var currentt=Date.now();
var slowMoFactor=1;
var fontSize=50;
var paused=false;
var betbutton=new Object();
var endlessButton;
var nextLevel=0;
var endlessMode;
var groupCaptions;
var groupColors
var groupCodes;

//TODO DEBUG
level=0;
//setTimeout(function(e) { paused=false; },1)
//TODO DEBUG

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = window.innerWidth;
canvasH=canvas.height = window.innerHeight;
ctx.textBaseline = "middle";
betbutton.type="betbutton";
betbutton.clickable=true;
betbutton.x=canvasW/2-100;
betbutton.y=canvasH/20*18;
betbutton.width=200;
betbutton.height=100;

//controls
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);

setup();
run(); //at the end of run(), we call itself again. Then calculate the timing for object movements.

//setup all the objects
function setup()
{
    drawable=[];
    endlessMode=false;
    if(level==0)
    {
        betbutton.clickable=true;
        betbutton.members=null;
        betbutton.opacity=1;
        betbutton.click=function(e) { startTimer(); this.clickable=false; this.opacity=0.2; };
        drawable.push(betbutton);   
        nextLevel=rand(1,6);
        paused=false;    
        slowMoFactor=1;

        var yinyang=new Object();
        yinyang.type="levelCard";
        yinyang.x=canvasW/5-50;
        yinyang.y=canvasH/10*4;
        yinyang.width=100;
        yinyang.height=100;
        yinyang.color="#000";
        yinyang.fontSize=100;
        yinyang.caption="☯";
        yinyang.nWon=localStorage.getItem("decidophobia.1.won");
        if(!yinyang.nWon)
            yinyang.nWon=0;
        yinyang.clickable=true;
        yinyang.click=function(e) { drawable.filter(el => el.type === "levelCard").forEach(el => { el.chosen=false; }); yinyang.chosen=true;  nextLevel=1;}
        drawable.push(yinyang);

        var rps=new Object();
        rps.type="levelCard";
        rps.x=canvasW/5*2-50;
        rps.y=canvasH/10*4;
        rps.width=100;
        rps.height=100;
        rps.color="#000";
        rps.fontSize=40;
        rps.caption="👊✋\n✌️"
        rps.nWon=localStorage.getItem("decidophobia.2.won");
        if(!rps.nWon)
            rps.nWon=0;
        rps.clickable=true;
        rps.click=function(e) { drawable.filter(el => el.type === "levelCard").forEach(el => { el.chosen=false; }); rps.chosen=true;  nextLevel=2;}
        drawable.push(rps);

        var cgte=new Object();
        cgte.type="levelCard";
        cgte.x=canvasW/5*3-50;
        cgte.y=canvasH/10*4;
        cgte.width=100;
        cgte.height=100;
        cgte.color="#000";
        cgte.fontSize=40;
        cgte.caption="🐱🐶\n🐭🐘"
        cgte.nWon=localStorage.getItem("decidophobia.3.won");
        if(!cgte.nWon)
            cgte.nWon=0;
        cgte.clickable=true;
        cgte.click=function(e) { drawable.filter(el => el.type === "levelCard").forEach(el => { el.chosen=false; }); cgte.chosen=true;  nextLevel=3;}
        drawable.push(cgte);

        var zrscu=new Object();
        zrscu.type="levelCard";
        zrscu.x=canvasW/5*4-50;
        zrscu.y=canvasH/10*4;
        zrscu.width=100;
        zrscu.height=100;
        zrscu.color="#000";
        zrscu.fontSize=30;
        zrscu.caption="🐸🐍\n🦟\n🐶🧑"
        zrscu.nWon=localStorage.getItem("decidophobia.4.won");
        if(!zrscu.nWon)
            zrscu.nWon=0;
        zrscu.clickable=true;
        zrscu.click=function(e) { drawable.filter(el => el.type === "levelCard").forEach(el => { el.chosen=false; }); zrscu.chosen=true;  nextLevel=4;}
        drawable.push(zrscu);

        var hvr=new Object();
        hvr.type="levelCard";
        hvr.x=canvasW/5*2-50;
        hvr.y=canvasH/10*6;
        hvr.width=100;
        hvr.height=100;
        hvr.color="#000";
        hvr.fontSize=30;
        hvr.caption="👨👩\n\n🐇"
        hvr.nWon=localStorage.getItem("decidophobia.5.won");
        if(!hvr.nWon)
            hvr.nWon=0;
        hvr.clickable=true;
        hvr.click=function(e) { drawable.filter(el => el.type === "levelCard").forEach(el => { el.chosen=false; }); hvr.chosen=true;  nextLevel=5;}
        drawable.push(hvr);

        var sumN=new Object();
        sumN.type="levelCard";
        sumN.x=canvasW/5*3-50;
        sumN.y=canvasH/10*6;
        sumN.width=100;
        sumN.height=100;
        sumN.color="#000";
        sumN.fontSize=30;
        sumN.caption="01234\n+\n56789"
        sumN.nWon=localStorage.getItem("decidophobia.5.won");
        if(!sumN.nWon)
            sumN.nWon=0;
        sumN.clickable=true;
        sumN.click=function(e) { drawable.filter(el => el.type === "levelCard").forEach(el => { el.chosen=false; }); sumN.chosen=true;  nextLevel=6;}
        drawable.push(sumN);
    }
    //yin-yang
    else if(level==1)
    {
        paused=true;
        var force=500;
        var size=Math.min(canvasH,canvasW)*0.02;
        var yin=new Object();
        yin.x=canvasW/2;
        yin.y=canvasH/2-Math.min(canvasH,canvasW)*0.2;
        var yang=new Object();
        yang.x=canvasW/2;
        yang.y=canvasH/2+Math.min(canvasH,canvasW)*0.2;

        for(var x=0;x<canvasW;x+=size)
            for(var y=0;y<canvasH;y+=size)
                if(distanceFrom(x,y,canvasW/2,canvasH/2)<Math.min(canvasH,canvasW)*0.4)
                {
                    var tmp=new Object();
                    tmp.type="square";
                    if(y<canvasH/2 && (x<canvasW/2 || distanceFrom(x,y,yin.x,yin.y)<Math.min(canvasH,canvasW)*0.2))
                        tmp.color="#000";
                    else if(x<canvasW/2 && distanceFrom(x,y,yang.x,yang.y)>Math.min(canvasH,canvasW)*0.2)
                        tmp.color="#000";
                    else
                        tmp.color="#FFF";
                    tmp.x=x;
                    tmp.y=y;
                    tmp.size=size;
                    drawable.push(tmp);
                }
        for(i=0;i<5;i++)
        {
            if(i!=0)
            {
                offsetX=size*(i%2)-size/2;
                offsetY=size*Math.floor(i%4/2)-size/2;
            }
            else
            {
                offsetX=0;
                offsetY=0;
            }
            var tmp=new Object();
            tmp.x=yin.x+offsetX;
            tmp.y=yin.y+offsetY;
            tmp.type="circle";
            tmp.color="#FFF";
            tmp.radius=size/2;
            tmp.force=force;
            tmp.direction=Math.random()*Math.PI*2;
            tmp.dx=tmp.force*Math.sin(tmp.direction);
            tmp.dy=tmp.force*Math.cos(tmp.direction);
            drawable.push(tmp);
            var tmp=new Object();
            tmp.x=yang.x+offsetX;
            tmp.y=yang.y+offsetY;
            tmp.type="circle";
            tmp.color="#000";
            tmp.radius=size/2;
            tmp.force=force;
            tmp.direction=Math.random()*Math.PI*2;
            tmp.dx=tmp.force*Math.sin(tmp.direction);
            tmp.dy=tmp.force*Math.cos(tmp.direction);
            drawable.push(tmp);
        }
        betbutton.clickable=true; 
        betbutton.opacity=1;
        betbutton.members=[];
        var tmp=new Object();
        tmp.color="#EEE";
        tmp.caption="White";
        tmp.count=0;
        tmp.selected=false;
        tmp.chosen=false;
        tmp.clickable=true;
        drawable.push(tmp);
        betbutton.members['white']=tmp;
        var tmp2=new Object();
        tmp2.color="#333";
        tmp2.caption="Black";
        tmp2.count=0;
        tmp2.selected=false;
        tmp2.chosen=false;
        tmp2.clickable=true;
        drawable.push(tmp2);     
        betbutton.members['black']=tmp2;

        tmp.click=function(e) { tmp.chosen=true; tmp2.chosen=false; betbutton.clickable=true; betbutton.opacity=1; };
        tmp2.click=function(e) { tmp2.chosen=true; tmp.chosen=false; betbutton.clickable=true; betbutton.opacity=1; };
        betbutton.click=function(e) { paused=false; slowMoFactor=-0.3; this.clickable=false; this.opacity=0.2; tmp.clickable=false; tmp2.clickable=false; drawable.includes(endlessButton) && drawable.splice(drawable.indexOf(endlessButton), 1); };
        betbutton.clickable=false; 
        betbutton.opacity=0.2;
        drawable.push(betbutton); 

        var timer=new Object();
        timer.type="timer";
        timer.x=canvasW/2-50;
        timer.y=canvasH/20*18+50;
        timer.seconds=0;
        timer.limit=13;
        timer.fontSize=fontSize;
        timer.expired=function(e) { checkWinner(); };
        drawable.push(timer);

        //endless button
        if(localStorage.getItem("decidophobia."+level+".won")>2)
        {
            endlessButton=new Object();
            endlessButton.type="rectangle";
            endlessButton.x=canvasW/10;
            endlessButton.y=canvasH/10*9+25;
            endlessButton.width=200;
            endlessButton.height=50;
            endlessButton.color="#00F";
            endlessButton.fontSize=40;
            endlessButton.caption="ENDLESS";
            endlessButton.clickable=true;
            endlessButton.click=function(e) { drawable.splice(drawable.indexOf(this),1); drawable.splice(drawable.indexOf(betbutton),1); drawable.splice(drawable.indexOf(timer),1); paused=false; slowMoFactor=1; endlessMode=true; }
            drawable.push(endlessButton);
        }
    }
    //evolutive chain
    else if(level==2 || level==3 || level==4 || level==5 || level==6)
    {
        var radius=30;
        var nGroups=0;
        var totalnumber=0;
        var ballFontSize=40;

        //rockpaperscissors
        if(level==2)
        {
            nGroups=3;
            groupCodes=["rock","paper","scissor"];
            groupCaptions=["👊","✋","✌️"];
            groupColors=["#E77","#7E7","#77E"];
            totalnumber=15;
        }
        //canegattopoelefante
        else if(level==3)
        {
            nGroups=4;
            groupCodes=["elephant","mouse","cat","dog"];
            groupCaptions=["🐘","🐭","🐱","🐶"];
            groupColors=["#C33149","#00FFCD","#F3D9B1","#A8C256"];
            totalnumber=16;
        }
        //gruppo da 5
        else if(level==4)
        {
            nGroups=5;
            groupCodes=["mosquito","frog","snake","dog","man"];
            groupCaptions=["🦟","🐸","🐍","🐶","🧑"];
            groupColors = ["#8B5E3C", "#6FAF8F", "#7A89C2", "#C47F96", "#D6C37A"];
            totalnumber=15;
        }
        //uomini vs conigli
        else if(level==5)
        {
            nGroups=4;
            radius=20;
            ballFontSize=25;
            groupCodes=["man","woman","rabbit","rabbit"];
            groupCaptions=["👨","👩","🐇","🐇"];
            groupColors=["#4281ED","#FF70FD","#BF6119","#BF6119"];
            totalnumber=15;
        }
        //numeri e somme!
        else if(level==6)
        {
            nGroups=10;
            radius=15;
            ballFontSize=20;
            groupCodes=["zero","one","two","three","four","five","six","seven","eight","nine"];
            groupCaptions=["0","1","2","3","4","5","6","7","8","9"];
            groupColors = ["#FFFFFF","#EDEDED","#DBDBDB","#C9C9C9","#B7B7B7","#A5A5A5","#939393","#818181","#8A8A8A","#888888"];
            totalnumber=30;
        }
        for(i=0;i<totalnumber;i++)
        {
            var tmp=new Object();
            tmp.x=rand(canvasW/20+radius*1.1,canvasW/20*19-radius*1.1);
            tmp.y=rand(canvasH/20+radius*1.1,canvasH/20*16-radius*1.1);
            //we avoid early overlapping
            if(level==6)
            {
                var collide=true;
                while(collide)
                {
                    tmp.x=rand(canvasW/20+radius*1.1,canvasW/20*19-radius*1.1);
                    tmp.y=rand(canvasH/20+radius*1.1,canvasH/20*16-radius*1.1);
                    collide=false;
                    drawable.filter(el => el.type === "circle").forEach(ball => { if(distanceFrom(tmp.x,tmp.y,ball.x,ball.y)<radius*2) collide=true; });
                }
            }
            tmp.type="circle";
            tmp.color="#FFF";
            tmp.caption=groupCaptions[i%nGroups];
            tmp.color=groupColors[i%nGroups],
            tmp.code=groupCodes[i%nGroups];
            tmp.winover=groupCodes[(i-1+nGroups)%nGroups];//win over the previous element
            tmp.radius=radius;
            tmp.fontSize=ballFontSize;
            tmp.force=200;
            tmp.direction=Math.random()*Math.PI*2;
            tmp.dx=tmp.force*Math.sin(tmp.direction);
            tmp.dy=tmp.force*Math.cos(tmp.direction);
            drawable.push(tmp);
        }

        betbutton.clickable=true; 
        betbutton.opacity=1;
        betbutton.members=[];
        //this has different betting groups
        if(level==5)
        {
            groupCodes=["human","rabbit"];
            groupColors=["#FF7AC8","#F5DFD5"];
            nGroups=2
        }
        for(i=0;i<nGroups;i++)
        {
            //on level 6, you can't bet on on odd numbers
            if(level==6 && i%2)
                continue;
            var tmp=new Object();
            tmp.color=groupColors[i];
            tmp.caption=groupCodes[i].charAt(0).toUpperCase() + groupCodes[i].slice(1);
            tmp.count=0;
            tmp.selected=false;
            tmp.chosen=false;
            tmp.clickable=true;
            drawable.push(tmp);
            betbutton.members[groupCodes[i]]=tmp;
            tmp.click=function(e) { Object.values(betbutton.members).forEach(member => member.chosen = false); this.chosen=true; betbutton.clickable=true; betbutton.opacity=1; };
        }
        betbutton.click=function(e) { paused=false; this.clickable=false; this.opacity=0.2; Object.values(betbutton.members).forEach(member => member.clickable = false);};

        drawable.push(betbutton);  
        betbutton.clickable=false;
        betbutton.opacity=0.2;  
        paused=true;

        var timer=new Object();
        timer.type="timer";
        timer.x=canvasW/2-50;
        timer.y=canvasH/20*18+50;
        timer.seconds=0;
        timer.limit=13;
        timer.fontSize=fontSize;
        timer.expired=function(e) { checkWinner(); };
        drawable.push(timer);

        //endless button
        if(localStorage.getItem("decidophobia."+level+".won")>2)
        {
            var endlessButton=new Object();
            endlessButton.type="rectangle";
            endlessButton.x=canvasW/10;
            endlessButton.y=canvasH/10*9+25;
            endlessButton.width=200;
            endlessButton.height=50;
            endlessButton.color="#00F";
            endlessButton.fontSize=40;
            endlessButton.caption="ENDLESS";
            endlessButton.clickable=true;
            endlessButton.click=function(e) { drawable.splice(drawable.indexOf(this),1); drawable.splice(drawable.indexOf(betbutton),1); drawable.splice(drawable.indexOf(timer),1); paused=false; slowMoFactor=1; endlessMode=true; }
            drawable.push(endlessButton);            
        }
    }

}
function startTimer()
{
    var tmp=new Object();
    tmp.type="timer";
    tmp.x=canvasW/2-50;
    tmp.y=canvasH/20*18+50;
    tmp.seconds=0;
    tmp.limit=13;
    tmp.fontSize=50;
    tmp.expired=function(e) { level=nextLevel; setup(); };
    drawable.push(tmp);
}
function drawPieChart(ctx, raggio, x, y, valori, colori) {
  const totale = valori.reduce((a, b) => a + b, 0);
  let angoloInizio = 0;

  valori.forEach((valore, i) => {
    const angolo = (valore / totale) * 2 * Math.PI;
    ctx.fillStyle = colori[i];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, raggio, angoloInizio, angoloInizio + angolo);
    ctx.closePath();
    ctx.fill();

    // Calcola la percentuale e la dimensione del testo
    const percentuale = ((valore / totale) * 100).toFixed(1) + '%';
    const dimensioneTesto = Math.max(10, (angolo / (2 * Math.PI)) * raggio / 2); 
    ctx.font = `${dimensioneTesto}px Georgia, serif`;
    ctx.fillStyle = "#000";
    
    // Posiziona il testo al centro della fetta
    const angoloTesto = angoloInizio + angolo / 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(percentuale, x + Math.cos(angoloTesto) * raggio / 2, y + Math.sin(angoloTesto) * raggio / 2);
    
    angoloInizio += angolo;
  });
}
//draw a single object
function draw(obj)
{
    ctx.save();
    if(obj.opacity)
        ctx.globalAlpha=obj.opacity;
    if(obj.cooldown)
        ctx.globalAlpha=1-obj.cooldown;
    if(obj.type=="circle")
    {
        ctx.fillStyle=obj.color;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
        if(obj.caption)
        {
            ctx.fillStyle="#000";
            ctx.font = obj.fontSize+"px Georgia, serif";
            ctx.textAlign="center";
            ctx.fillText(obj.caption,obj.x,obj.y);
        }
    }
    else if(obj.type=="square")
    {
        ctx.fillStyle=obj.color;
        ctx.fillRect(obj.x-obj.size/2,obj.y-obj.size/2,obj.size,obj.size);
    }
    else if(obj.type=="levelCard")
    {
        if(obj.chosen)
            ctx.fillStyle="yellow";
        else
            ctx.fillStyle="#555";
        ctx.globalAlpha=0.7;
        ctx.fillRect(obj.x-5,obj.y-5,obj.width+10,obj.height+10);
        ctx.globalAlpha=1;
        ctx.fillStyle=fg;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        if(obj.caption)
        {
            ctx.fillStyle=obj.color;
            ctx.font = obj.fontSize+"px Georgia, serif";
            ctx.textAlign="center";
            //this is bad, sorry.
            if(obj.caption.includes("\n") && obj.caption.split("\n").length==2)
            {
                ctx.fillText(obj.caption.split("\n")[0],obj.x+obj.width/2,obj.y+obj.height-obj.fontSize*1.8);
                ctx.fillText(obj.caption.split("\n")[1],obj.x+obj.width/2,obj.y+obj.height-obj.fontSize/1.5);
            }
            else if(obj.caption.includes("\n") && obj.caption.split("\n").length==3)
            {
                ctx.fillText(obj.caption.split("\n")[0],obj.x+obj.width/2,obj.y+obj.height-obj.fontSize*2.6);
                ctx.fillText(obj.caption.split("\n")[1],obj.x+obj.width/2,obj.y+obj.height-obj.fontSize*1.6);
                ctx.fillText(obj.caption.split("\n")[2],obj.x+obj.width/2,obj.y+obj.height-obj.fontSize/1.6);
            }
            else
                ctx.fillText(obj.caption,obj.x+obj.width/2,obj.y+obj.height-obj.fontSize/2);
        }
        ctx.fillStyle="#FFF";
        ctx.font = "15px Georgia, serif";
        ctx.fillText("Won: "+obj.nWon,obj.x+obj.width/2,obj.y+obj.height+20);
    }
    else if(obj.type=="rectangle")
    {
        if(obj.caption)
        {
            ctx.fillStyle="#000";
            ctx.globalAlpha=0.5;
            ctx.fillRect(obj.x-5,obj.y-5,obj.width+10,obj.height+10);
            ctx.globalAlpha=1;
        }
        ctx.fillStyle=fg;
        ctx.fillRect(obj.x,obj.y,obj.width,obj.height);
        if(obj.caption)
        {
            ctx.fillStyle=obj.color;
            ctx.font = obj.fontSize+"px Georgia, serif";
            ctx.textAlign="center";
            ctx.fillText(obj.caption,obj.x+obj.width/2,obj.y+obj.height-obj.fontSize/2);
        }
    }
    else if(obj.type=="timer")
    {
        if(!obj.seconds) return;
        ctx.fillStyle=fg;
        if(obj.limit && obj.limit-obj.seconds<1)
            ctx.fillStyle="#F00";
        ctx.font = obj.fontSize+"px Georgia, serif";
        ctx.textAlign="left";
        ctx.fillText(Math.round(obj.seconds*100)/100,obj.x,obj.y);
    }
    else if(obj.type=="betbutton")
    {
        ctx.fillStyle=fg;
        ctx.fillRect(canvasW/2-100,canvasH/20*18,200,100);
        ctx.fillStyle=bg;
        ctx.font = fontSize*2+"px Georgia, serif";
        ctx.textAlign="center";
        ctx.fillText("Bet",canvasW/2,canvasH/20*18+100-fontSize);
        if(obj.members)
        {
            ctx.fillStyle=fg;
            ctx.font = fontSize/2+"px Georgia, serif";
            ctx.fillText("on",canvasW/2+125,canvasH/20*18+100-fontSize);
            ctx.globalAlpha=1;
            ctx.textAlign="left";
            var nMembers=Reflect.ownKeys(obj.members).length-1;
            var memberCount=1;
            if(nMembers>5)
                ctx.font = fontSize/5+"px Georgia, serif";
            else
                ctx.font = fontSize/2+"px Georgia, serif";

            Reflect.ownKeys(obj.members).forEach(el => {
                if(el=="length") return;
                ctx.fillStyle=obj.members[el].color;
                ctx.fillText(obj.members[el].caption+": "+obj.members[el].count,canvasW/2+150,canvasH/20*18 + (memberCount*100/nMembers)-50/nMembers );
                if(obj.members[el].selected)
                    ctx.fillText("____",canvasW/2+150,canvasH/20*18 + (memberCount*100/nMembers)-50/nMembers );
                if(obj.members[el].chosen)
                    ctx.fillText("➼",canvasW/2+130,canvasH/20*18 + (memberCount*100/nMembers)-50/nMembers );
                obj.members[el].x=canvasW/2+150;
                obj.members[el].y=canvasH/20*18 + (memberCount*100/nMembers)-50/nMembers-10;
                obj.members[el].width=70;
                obj.members[el].height=20;
                memberCount++;
            });
        }
    }
    else if(obj.type=="fulltext")
    {
        ctx.textAlign = "center";
        let fontSize = 9999;
        ctx.font = fontSize + "px Georgia, serif";
        let textWidth = ctx.measureText(obj.caption).width;
        while (textWidth > canvasW) {
            fontSize--;  // Diminuisci la dimensione del font
            ctx.font = fontSize + "px Georgia, serif";
            textWidth = ctx.measureText(obj.caption).width;
        }
        ctx.fillStyle = "#000";
        ctx.globalAlpha=0.8;
        ctx.fillRect(0,canvasH/2-fontSize/2,canvasW,fontSize);

        ctx.globalAlpha=1;
        ctx.fillStyle = obj.color;
        ctx.fillText(obj.caption, canvasW / 2, canvasH / 2);
    }
    ctx.restore();
}
function move(obj)
{
    if(paused) return;
    if(obj.type=="timer")
    {   
        //manage slowmotion
        if(level==1)
        {
            if(obj.limit-obj.seconds<1 && slowMoFactor>0.06)
                slowMoFactor*=0.98;
            else if(slowMoFactor<1)
                slowMoFactor+=0.01;    
        }
        obj.seconds+=dt;
        if(Math.round(obj.seconds*100)/100>=obj.limit-dt)//we ENSURE we don't see 13
        {
            obj.expired();
        }
    }

    if(obj.dx==null || obj.dy==null) return;
    obj.x+=obj.dx*dt;
    obj.y+=obj.dy*dt;
    if(obj.cooldown)
        obj.cooldown-=dt;
}
function checkWinner()
{
    var maxValue=-1;
    var winner=null;
    var chosen=null;
    paused=true;
    Reflect.ownKeys(betbutton.members).forEach(el => {
        if(el=="length") return;
        if(maxValue<=betbutton.members[el].count)
        {
            maxValue=betbutton.members[el].count;
            winner=el;
        }
        if(betbutton.members[el].chosen)
            chosen=el;
    });
    //handle ties
    if(chosen!=null && betbutton.members[chosen].count==betbutton.members[winner].count)
        winner=chosen;
    if(endlessMode)
    {
        var tmp=new Object();
        tmp.type="fulltext";
        tmp.color="#FFF";
        tmp.caption="It's done.";
        drawable.push(tmp);
    }
    else if(betbutton.members[winner].chosen)
    {
        var tmp=new Object();
        tmp.type="fulltext";
        tmp.color="#7F7";
        tmp.caption="You won!";
        drawable.push(tmp);
        var nWon=localStorage.getItem("decidophobia."+level+".won");
        if(!nWon)
            nWon=0;
        localStorage.setItem("decidophobia."+level+".won", Number(nWon)+1);
    }
    else
    {
        var tmp=new Object();
        tmp.type="fulltext";
        tmp.color="#F77";
        tmp.caption="FAILED!";
        drawable.push(tmp);
    }
    var backbutton=new Object();
    backbutton.type="rectangle";
    backbutton.color="#222";
    backbutton.fontSize=80;
    backbutton.caption="Back";
    backbutton.clickable=true;
    backbutton.x=canvasW/2-100;
    backbutton.y=canvasH/20*15;
    backbutton.width=200;
    backbutton.height=100;
    backbutton.click=function(e) { level=0; setup();};
    drawable.push(backbutton);
    
}
//main loop that draw the screen and perform the game logic
function run()
{
    //how much is passed since last time?
    dt=(Date.now()-currentt)/1000 * slowMoFactor;
    currentt=Date.now();

    //draw stuff
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle=bg;
    ctx.fillRect(0,0,canvasW,canvasH);
    if(level==0)
    {
        //title
        const title="DECIDOPHOBIA"
        ctx.fillStyle=fg;
        ctx.textAlign = "center";
        let fontSize = 999;
        ctx.font = fontSize + "px Georgia, serif";
        let textWidth = ctx.measureText(title).width;
        while (textWidth > canvasW) {
            fontSize--;  // Diminuisci la dimensione del font
            ctx.font = fontSize + "px Georgia, serif";
            textWidth = ctx.measureText(title).width;
        }
        for(i=0;i<50;i++)
        {
            ctx.fillText(title,rand(0,i)/10+i/2+canvasW/2,50+fontSize/2-i);
            ctx.globalAlpha=1/i;
        }        
        ctx.globalAlpha=1;
        //which scenario will load? Choose your prediction (don't worry, you have time to change your mind.)
        ctx.font = "50px Georgia, serif";
        ctx.fillText("Which scenario will load?",canvasW/2,canvasH/10*8);
        ctx.fillText("Choose your prediction.",canvasW/2,canvasH/10*8+50);
        ctx.font = "20px Georgia, serif";
        ctx.fillText("(don't worry, you have time to change your mind.)",canvasW/2,canvasH/10*8+100);

    }
    else if(level==2 || level==3 || level==4 || level==5 || level==6)
    {
        ctx.fillStyle=fg;
        ctx.fillRect(canvasW/20-5,canvasH/20-5,canvasW/20*18+10,canvasH/20*15+10);
        ctx.fillStyle=bg;
        ctx.fillRect(canvasW/20,canvasH/20,canvasW/20*18,canvasH/20*15);
    }
    drawable.forEach(el => { move(el); draw(el); } );

    canvas.style.cursor="default";
    drawable.forEach(el => { 
        el.selected=isSelected(el);
        if(el.clickable && el.selected) 
        { 
            canvas.style.cursor="pointer"; 
            if(dragging)
            {
                el.click();
            }
        } 
    });

    if(level==1)
    {
        //bounce
        if(!paused)
        drawable.filter(el => el.type === "circle").forEach(el => {
            //borders
            if(distanceFrom(el.x,el.y,canvasW/2,canvasH/2)>Math.min(canvasH,canvasW)*0.4-el.radius)
            {
                el.direction = Math.atan2((canvasH / 2) - el.y, (canvasW / 2) - el.x);
                el.direction+=rand(-1,1)/2;
                el.dx=el.force*Math.cos(el.direction);
                el.dy=el.force*Math.sin(el.direction);
            }
            //hit squares
            drawable.filter(el => el.type === "square").forEach(block => {
                if(el.color==block.color && distanceFrom(el.x,el.y,block.x,block.y)<el.radius+block.size/2)
                {
                    el.direction=Math.atan2(block.y - el.y, block.x - el.x);
                    if(Math.abs(el.x-block.x)<Math.abs(el.y-block.y))
                        el.direction+=Math.PI;
                    else if(Math.abs(el.x-block.x)>Math.abs(el.y-block.y))
                        el.direction-=Math.PI;
                    el.dx=el.force*Math.cos(el.direction);
                    el.dy=el.force*Math.sin(el.direction);
                    if(block.color=="#000")
                        block.color="#FFF";
                    else if(block.color=="#FFF")
                        block.color="#000";
                }
            });
        });
        //count black and whites
        nBlack=0;
        nWhite=0;
        drawable.filter(el => el.type === "square").forEach(block => { if(block.color=="#FFF") nWhite++; else if(block.color=="#000") nBlack++; });
        drawPieChart(ctx, Math.min(canvasH,canvasW)/10, canvasW/20*17, canvasH/20*17, [nBlack,nWhite], ["#333","#EEE"]);
        betbutton.members['black'].count=nBlack;
        betbutton.members['white'].count=nWhite;
    }
    else if(level==2 || level==3 || level==4 || level==5 || level==6)
    {
        //bounce logic
        if(!paused)
        drawable.filter(el => el.type === "circle").forEach(el => {
            // Borders
            if (el.x - el.radius < canvasW / 20) {
                el.x = canvasW / 20 + el.radius;  
                el.dx *= -1;            } 
            else if (el.x + el.radius > canvasW / 20 * 19) {
                el.x = canvasW / 20 * 19 - el.radius;       
                el.dx *= -1;
            }

            if (el.y - el.radius < canvasH / 20) {
                el.y = canvasH / 20 + el.radius;  
                el.dy *= -1;
            } 
            else if (el.y + el.radius > canvasH / 20 * 16) {
                el.y = canvasH / 20 * 16 - el.radius;       
                el.dy *= -1;
            }

            //bounce between them
            drawable.filter(el => el.type === "circle").forEach(ball => {
                if(ball===el) return;
                let dx = ball.x - el.x;
                let dy = ball.y - el.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Controlla la collisione
                if (distance < (el.radius + ball.radius)) {
                    // Normale unitaria
                    let nx = dx / distance;
                    let ny = dy / distance;

                    // Correzione di posizione per evitare compenetrazione
                    let overlap = (el.radius + ball.radius) - distance;
                    let correction = overlap / 2;
                    
                    // Sposta indietro gli oggetti in modo che si tocchino appena
                    el.x -= correction * nx;
                    el.y -= correction * ny;
                    ball.x += correction * nx;
                    ball.y += correction * ny;

                    // Calcola il fattore di impulso per le nuove velocità
                    let p = 2 * (el.dx * nx + el.dy * ny - ball.dx * nx - ball.dy * ny) / 2;

                    // Aggiorna le velocità
                    el.dx -= p * nx;
                    el.dy -= p * ny;
                    ball.dx += p * nx;
                    ball.dy += p * ny;

                    //check if generate childern
                    if(level==5)
                    {
                        if(el.cooldown>0 || ball.cooldown>0)
                        {
                            //do nothing
                        }
                        else if(el.code=="rabbit" && ball.code=="rabbit")
                        {
                            var tmp=new Object();
                            tmp.x=(el.x+ball.x)/2;
                            tmp.y=(el.y+ball.y)/2;
                            tmp.type="circle";
                            tmp.color="#FFF";
                            tmp.caption="🐇";
                            tmp.color="#BF6119",
                            tmp.code="rabbit";
                            tmp.radius=20;
                            tmp.fontSize=25;
                            tmp.force=200;
                            tmp.direction=Math.random()*Math.PI*2;
                            tmp.dx=tmp.force*Math.sin(tmp.direction);
                            tmp.dy=tmp.force*Math.cos(tmp.direction);
                            drawable.push(tmp);
                            tmp.cooldown=1;
                            ball.cooldown=0.5;
                            el.cooldown=0.5;
                        }  
                        else if( (el.code=="man" && ball.code=="woman") || (el.code=="woman" && ball.code=="man") )
                        {
                            if(rand(0,1))
                            {
                                genderCode="man";
                                genderColor="#4281ED";
                                genderCaption="👨";
                            }
                            else
                            {
                                genderCode="woman";
                                genderColor="#FF70FD";
                                genderCaption="👩";
                            }
                            var tmp=new Object();
                            tmp.x=(el.x+ball.x)/2;
                            tmp.y=(el.y+ball.y)/2;
                            tmp.type="circle";
                            tmp.color="#FFF";
                            tmp.caption=genderCaption;
                            tmp.color=genderColor,
                            tmp.code=genderCode;
                            tmp.radius=20;
                            tmp.fontSize=25;
                            tmp.force=200;
                            tmp.direction=Math.random()*Math.PI*2;
                            tmp.dx=tmp.force*Math.sin(tmp.direction);
                            tmp.dy=tmp.force*Math.cos(tmp.direction);
                            drawable.push(tmp);
                            tmp.cooldown=1;
                            ball.cooldown=0.5;
                            el.cooldown=0.5;
                        }
                    }
                    //we sum them
                    else if(level==6)
                    {
                        var somma=""+Number(Number(ball.caption)+Number(el.caption))%10;
                        ball.caption=somma;
                        el.caption=somma;
                        el.code=groupCodes[groupCaptions.indexOf(somma)];
                        ball.code=groupCodes[groupCaptions.indexOf(somma)];
                        el.color=groupColors[groupCaptions.indexOf(somma)];
                        ball.color=groupColors[groupCaptions.indexOf(somma)];
                    }
                    else
                    {
                        //se sono diversi, scegli il vincitore
                        if(el.winover==ball.code)
                        {
                            ball.code=el.code;
                            ball.color=el.color;
                            ball.caption=el.caption;
                            ball.winover=el.winover;
                        }
                        else if(ball.winover==el.code)
                        {
                            el.code=ball.code;
                            el.color=ball.color;
                            el.caption=ball.caption;
                            el.winover=ball.winover;
                        }
                    }
                }
            });
        });
        nGroups=groupCodes.length;
        (groupCounts = []).length = nGroups; 
        groupCounts.fill(0);
        if(level==5)
            drawable.filter(el => el.type === "circle").forEach(ball => { groupCounts[groupCodes.indexOf((ball.code=="rabbit"?"rabbit":"human"))]++; });
        else
            drawable.filter(el => el.type === "circle").forEach(ball => { groupCounts[groupCodes.indexOf(ball.code)]++; });
        if(!paused && groupCounts.filter(n => n === 0).length >= Math.ceil(groupCounts.length / 2))
            checkWinner();
        else if(drawable.length>1999)//too much population
            checkWinner();
        else 
            drawPieChart(ctx, canvasH/20*1.2, canvasW/30*26, canvasH/20*18, groupCounts, groupColors);
        for(i=0;i<nGroups;i++)
        {
            if(betbutton.members[groupCodes[i]])
                betbutton.members[groupCodes[i]].count=groupCounts[i];
        }
    }

    //border
    ctx.fillStyle=fg;
    ctx.fillRect(0,0,canvasW,1);
    ctx.fillRect(0,canvasH-1,canvasW,1);
    ctx.fillRect(0,0,1,canvasH);
    ctx.fillRect(canvasW-1,0,1,canvasH);

    if(paused)
        setTimeout(run,10);
    else
        setTimeout(run);
}

/*#############
    Funzioni Utili
##############*/
//check if mouse is inside obj
function isSelected(obj)
{
    tx=mousex;
    ty=mousey;
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