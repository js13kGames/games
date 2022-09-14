/*
scusa se stai leggendo questo codice.
c'era il trasloco, a mia discolpa
*/
// < >

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var level;
var particles=[];
var gridOffsetX=100;
var gridOffsetY=500;

//mobile controls
var mousex=-100;
var mousey=-100;
var dragging=false;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = 1080;//window.innerWidth;
canvasH=canvas.height = 1920;//window.innerHeight;
var tileSize=100;
var possibleValues=[0,1,2,3];
var possibleColors=["#C00","#777","#F60","#6C0","#CF0"];
var progresses=[0,0,0,0];
//var possibleValues=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var grid=[[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{},{}]];

//pictures
covid = new Image();
covid.src = "pic/covid.png";
toilet = new Image();
toilet.src = "pic/toilet.png";
mask = new Image();
mask.src = "pic/mask.png";
sanitizer = new Image();
sanitizer.src = "pic/sanitizer.png";
var possiblePictures=[covid,toilet,mask,sanitizer];

/*toilet1 = new Image();
toilet1.src = "pic/toilet1.png";
toilet2 = new Image();
toilet2.src = "pic/toilet2.png";
toilet3 = new Image();
toilet3.src = "pic/toilet3.png";*/
toilet4 = new Image();
toilet4.src = "pic/toilet4.png";
/*mask1 = new Image();
mask1.src = "pic/mask1.png";
mask2 = new Image();
mask2.src = "pic/mask2.png";
mask3 = new Image();
mask3.src = "pic/mask3.png";*/
mask4 = new Image();
mask4.src = "pic/mask4.png";
sanitizer4 = new Image();
sanitizer4.src = "pic/sanitizer4.png";
covid4 = new Image();
covid4.src = "pic/covid4.png";
//var barPictures=[[covid4,covid4,covid4,covid4],[toilet1,toilet2,toilet3,toilet4],[mask1,mask2,mask3,mask4],[sanitizer4,sanitizer4,sanitizer4,sanitizer4]];
var barPictures=[[covid4,covid4,covid4,covid4],[toilet4,toilet4,toilet4,toilet4],[mask4,mask4,mask4,mask4],[sanitizer4,sanitizer4,sanitizer4,sanitizer4]];

//controls
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);
canvas.addEventListener("touchstart", cliccatoTap);
canvas.addEventListener("touchmove", mossoTap);
canvas.addEventListener("touchend", rilasciatoTap);

level=-1;//TODO change level here (menu is -1)
var tutorial=" Tap on a group of 4to rotate. Form an  identical  set of 4 to collect          Defeat the CoVid-19! ";
/*
"
 Tap on a
group of 4
to rotate.
 Form an
identical
 set of 4  
to collect

Defeat the
CoVid-19!
"
*/

generateLevel();
setInterval(run, 33);

function generateLevel()
{
    if(level==-1)
    {
        tileSize=80;
        gridOffsetX=190;
        gridOffsetY=500;
        for(var i=0;i<10;i++)
            for(var j=0;j<10;j++)
            {
                grid[j][i].val=tutorial[i*10+j];
                grid[j][i].animationX=rand(-4000,4000);
                grid[j][i].animationY=rand(-4000,4000);
            }
    }
    else if(level==0)
    {
        tileSize=100;
        gridOffsetX=100;
        gridOffsetY=500;
        for(var i=0;i<10;i++)
            for(var j=0;j<10;j++)
            {
                grid[i][j].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i][j].animationX=0;
                grid[i][j].animationY=-2000;
            }
    }
}
function run()
{
    /*
    if(inputDelay>0)
    {
        inputDelay--;
        dragging=false;
    }
    */
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);

    ctx.fillStyle="#FFF";
    ctx.fillRect(0,0,canvasW,1);
    ctx.fillRect(0,canvasH-1,canvasW,1);
    ctx.fillRect(0,0,1,canvasH);
    ctx.fillRect(canvasW-1,0,1,canvasH);

    //menu
    if(level==-1)
    {
        ctx.fillStyle="#EEE";
        ctx.font = "120px Monospace";
        four="";
        if(rand(0,3))
            four+="F";
        else
            four+="f";
        if(rand(0,3))
            four+="O";
        else
            four+="o";
        if(rand(0,3))
            four+="U";
        else
            four+="u";
        if(rand(0,3))
            four+="R";
        else
            four+="r";
        text="Four or "+four;
        ctx.textAlign = "center";
        ctx.fillText(text,550,120);
        ctx.textAlign = "left";

        //altra griglia?
        var animatingObjects=0;
        var selectedList=[];
        for(var i=0;i<10;i++)
            for(var j=0;j<10;j++)
            {
                 //controlla se il mouse l'ha selezionato
                if(distanceFrom(mousex,mousey,i*tileSize+gridOffsetX,j*tileSize+gridOffsetY)<tileSize)
                {
                    var tmp=new Object();
                    tmp.r=i;
                    tmp.c=j;
                    selectedList.push(tmp);
                    selectedOffsetX=rand(-1,1);
                    selectedOffsetY=rand(-1,1);
                }
                else
                {
                    selectedOffsetX=0;
                    selectedOffsetY=0;
                }

                //disegna il testo
                ctx.font = "80px Monospace";
                ctx.fillStyle="#666";
                ctx.fillText(grid[i][j].val,gridOffsetX+i*tileSize+grid[i][j].animationX+selectedOffsetX-tileSize/2,gridOffsetY+j*tileSize+grid[i][j].animationY+selectedOffsetY);
                ctx.strokeStyle="#FFF";
                ctx.lineWidth = "1";
                ctx.beginPath();
                ctx.rect(gridOffsetX+i*tileSize+grid[i][j].animationX+selectedOffsetX-tileSize/2,gridOffsetY+j*tileSize+grid[i][j].animationY+selectedOffsetY-tileSize+10,tileSize,tileSize);
                ctx.stroke();
                
                //gestisci le animazioni
                if(Math.abs(grid[i][j].animationX)>1)
                {
                    grid[i][j].animationX*=0.8
                    animatingObjects++;
                }                    
                else
                {
                    grid[i][j].animationX=0;
                }
                if(Math.abs(grid[i][j].animationY)>1)
                {
                    grid[i][j].animationY*=0.8;
                    animatingObjects++;
                }
                else
                {
                    grid[i][j].animationY=0;
                }                    
                
            }
        //sta cliccando, ed è in mezzo a 4 oggetti
        if(dragging && selectedList.length>=3)
        {
            dragging=false;
            rotateTiles(selectedList);
        }
        
        //Play button
        ctx.font = "180px Monospace";
        ctx.fillStyle="#6C0";
        ctx.fillText("PL",canvasW/2-100,canvasH-300);
        ctx.fillText("AY",canvasW/2-100,canvasH-150);
        if(dragging && distanceFrom(mousex,mousey,canvasW/2,canvasH-300)<150)
        {
            level=0;
            generateLevel();
        }


        ctx.fillStyle="#FFF";
        ctx.font = "12px Arial";
        ctx.fillText("By Infernet89",canvasW-75,canvasH-5);
        ctx.fillText("Made for JS13k Competition",5,canvasH-5);
    }
    else if(level==0)
    {
        var animatingObjects=0;
        var selectedList=[];

        ctx.fillStyle="#FFF";
        ctx.font = "80px Arial";
        //griglia
        for(var i=0;i<10;i++)
            for(var j=0;j<10;j++)
            {
                 //controlla se il mouse l'ha selezionato
                if(distanceFrom(mousex,mousey,i*tileSize+gridOffsetX,j*tileSize+gridOffsetY)<tileSize)
                {
                    var tmp=new Object();
                    tmp.r=i;
                    tmp.c=j;
                    selectedList.push(tmp);
                    //ctx.fillStyle="#F00";
                    selectedOffsetX=rand(-1,1);
                    selectedOffsetY=rand(-1,1);
                }
                else
                {
                    //ctx.fillStyle="#0F0";
                    selectedOffsetX=0;
                    selectedOffsetY=0;
                }
                //ctx.fillRect(i*tileSize+gridOffsetX,j*tileSize+gridOffsetY,10,10);

                //disegna l'icona
                ctx.fillStyle=possibleColors[grid[i][j].val];
                ctx.drawImage(possiblePictures[grid[i][j].val], 0,0,tileSize,tileSize,gridOffsetX+i*tileSize+grid[i][j].animationX+selectedOffsetX-tileSize/2,gridOffsetY+j*tileSize+grid[i][j].animationY+selectedOffsetY-tileSize/2,tileSize,tileSize);
                
                //gestisci le animazioni
                if(Math.abs(grid[i][j].animationX)>1)
                {
                    grid[i][j].animationX*=0.8
                    animatingObjects++;
                }                    
                else
                {
                    grid[i][j].animationX=0;
                }
                if(Math.abs(grid[i][j].animationY)>1)
                {
                    grid[i][j].animationY*=0.8;
                    animatingObjects++;
                }
                else
                {
                    grid[i][j].animationY=0;
                }                    
                
            }
        //sta cliccando, ed è in mezzo a 4 oggetti
        if(dragging && selectedList.length>=3)
        {
            dragging=false;
            rotateTiles(selectedList);
        }
        //le animazioni sono finite
        else if(animatingObjects==0)
            checkForFour();
        drawParticles();
        drawBars();
    }
}
function gameOver()
{
    for(var i=0;i<10;i++)
        for(var j=0;j<10;j++)
            grid[i][j].val=0;
    possibleValues=[0];
}
function drawBars()
{
    if(possibleValues.length==1)
    {
        ctx.font = "120px Arial";
        ctx.fillStyle=possibleColors[0];
        ctx.fillText("YOU LOST.",250,1700);
        return;
    }
    var lvl;
    var maxedBars=0;
    //barre di scoreboard
    ctx.strokeStyle="#FFF";
    ctx.font = "30px Arial";
    ctx.lineWidth = "3";
    for(var i=1;i<possibleValues.length;i++)
    {
        lvl=Math.floor(progresses[i]/800);
        if(lvl>3)
            lvl=3;
        //icon
        ctx.save();
        ctx.translate(50,1880-i*90);
        ctx.drawImage(barPictures[i][lvl], 0, -25);
        ctx.restore();

        ctx.beginPath();
        ctx.rect(150,1870-i*90,800,20);
        ctx.stroke();
        ctx.fillStyle=possibleColors[i];
        if(progresses[i]>800*4)
        {
            ctx.fillRect(150,1870-i*90,800,20);
            ctx.fillStyle="#FFF";
            ctx.fillText("Lv. ∞",1000,1890-i*90);
            maxedBars++;
        }
        else
        {
            ctx.fillRect(150,1870-i*90,progresses[i]%800,20);
            ctx.fillStyle="#FFF";
            ctx.fillText("Lv. "+(lvl+1),1000,1890-i*90);
        }
        //le risorse si consumano overtime
        if(progresses[i]>1 && progresses[i]<=800*4) progresses[i]-=0.1;
    }
    //you won
    if(maxedBars>=3)
    {
        possiblePictures[0]=sanitizer;
        ctx.font = "120px Arial";
        ctx.fillStyle=possibleColors[3];
        ctx.fillText("YOU WON.",250,300);
    }
    else
    {
        ctx.drawImage(covid4, 0,0,150,150,450,100,150,150);//TODO gestisci livelli multipli di coviddi
        //big Covid bar
        ctx.beginPath();
        ctx.rect(100,250,802,50);
        ctx.stroke();
        ctx.fillStyle=possibleColors[0];
        ctx.fillRect(102,252,progresses[0]%800,46);
        ctx.fillStyle="#FFF";
        ctx.font = "45px Arial";
        ctx.fillText("Lv. "+(Math.floor(progresses[0]/800)+1),950,290);
        progresses[0]+=0.2;
        if(progresses[0]>800*4)
            gameOver();
    }
}
function checkForFour()
{
    for(var i=0;i<10 -1;i++)
        for(var j=0;j<10 -1;j++)
        {
            if(grid[i][j].val==grid[i+1][j].val && grid[i][j].val==grid[i][j+1].val && grid[i][j].val==grid[i+1][j+1].val)
            {
                //effetto esplosione
                explosionParticles(gridOffsetX+(i+0.5)*tileSize,gridOffsetY+(j+0.5)*tileSize,possibleColors[grid[i][j].val],grid[i][j].val);
                //sposta in giù di 2 (gravità)
                for(var k=j+1;k>1;k--)
                {
                    grid[i][k].val=grid[i][k-2].val;
                    grid[i][k].animationY=-200;
                    grid[i+1][k].val=grid[i+1][k-2].val;
                    grid[i+1][k].animationY=-200;
                }
                //fai apparire 4 blocchi sopra
                grid[i][0].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i+1][0].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i][1].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i+1][1].val=possibleValues[rand(0,possibleValues.length-1)];
                grid[i][0].animationY=-800;
                grid[i+1][0].animationY=-800;
                grid[i][1].animationY=-800;
                grid[i+1][1].animationY=-800;
            }
        }
}
function rotateTiles(selectedList)
{
    var Or=99;
    var Oc=99;
    for(var i=0;i<selectedList.length;i++)
    {
        if(selectedList[i].r<Or)
            Or=selectedList[i].r;
        if(selectedList[i].c<Oc)
            Oc=selectedList[i].c;
    }
    var tmp=grid[Or][Oc];
    grid[Or][Oc]=grid[Or][Oc+1];    
    grid[Or][Oc+1]=grid[Or+1][Oc+1];
    grid[Or+1][Oc+1]=grid[Or+1][Oc];
    grid[Or+1][Oc]=tmp;

    grid[Or][Oc].animationY=tileSize;
    grid[Or][Oc+1].animationX=tileSize;
    grid[Or+1][Oc+1].animationY=-tileSize;
    grid[Or+1][Oc].animationX=-tileSize;
}
function explosionParticles(x,y,color,value)
{
    var nOfParticles=rand(30,50);
    for(ip=0;ip<nOfParticles;ip++)
    {
        t=new Object();
        t.px=x+rand(-5,5);
        t.py=y+rand(-5,5);
        t.dx=rand(-6,6);
        t.dy=rand(-9,6);
        t.color=color;
        t.value=value;
        t.ttl=rand(5,90);
        particles.push(t);
    }
}
function drawParticles()
{
    ctx.save();
    for(ipd=0;ipd<particles.length;ipd++)
    {
        ctx.fillStyle=particles[ipd].color;
        ctx.fillRect(particles[ipd].px,particles[ipd].py,5,5);
        particles[ipd].px+=particles[ipd].dx;
        particles[ipd].py+=particles[ipd].dy;
        if(t.value==0)
            particles[ipd].dy-=0.8;//gravity    
        else particles[ipd].dy+=0.8;//gravity
        particles[ipd].ttl--;
        if(particles[ipd].ttl<=0)
        {
            progresses[particles[ipd].value]+=5;//dimensione della particle
            particles.splice(ipd,1);
            ipd=ipd-1;
        }
    }
    ctx.restore();
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
//controlli mobile
function cliccatoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    var rect = canvas.getBoundingClientRect();
    mousex = (evt.targetTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey = (evt.targetTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function mossoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    var rect = canvas.getBoundingClientRect();
    mousex = (evt.targetTouches[0].pageX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey = (evt.targetTouches[0].pageY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function rilasciatoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    setTimeout(function(){ mousey=-100;  mousex=-100; }, 100);

;}
//uindows
function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
//< >
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
