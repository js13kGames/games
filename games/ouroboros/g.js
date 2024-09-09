// < >
var DEBUG=0;
//costant
var TO_RADIANS = Math.PI/180; 
var borderSize=5;
var defaultWidth=1200;
var defaultHeight=800;

//global variables
var canvas;
var canvasW=1200;
var canvasH=800;
var ctx;
var activeTask;
var dragging=false;
var Kpressed=[];
var pointer=new Object();
var startPointer=new Object();
startPointer.z=0;
var endPointer=new Object();
endPointer.z=0;

//game variables
var level;
var snakeHead;
var snakeSize=20;
var snakeSpeed=5;
var snakeColor="#0F0";
var tailColor="#0A0";
var borderColor="#00F";
var snakeGrowing=0;
var foods=[];
var newFoodCooldown=0;
var gameOverCoooldown=0;
var titlePosition=0;

function setup()
{
    //setup
    canvas = document.getElementById("g");
    ctx = canvas.getContext("2d");
    canvasW=canvas.width  = defaultWidth;//window.innerWidth;
    canvasH=canvas.height = defaultHeight;//window.innerHeight;
    level=-1;

    //controls
    window.addEventListener('keydown',keyDown,false);
    window.addEventListener('keyup',keyUp,false);

    generateLevel();
    activeTask=setInterval(run, 33);

    //Controls
    canvas.addEventListener("mousedown",cliccatoMouse);
    canvas.addEventListener("mouseup",rilasciatoMouse);
    canvas.addEventListener("touchstart", cliccatoTap);
    canvas.addEventListener("touchmove", mossoTap);
    canvas.addEventListener("touchend", rilasciatoTap);
}
function generateLevel()
{
    snakeHead=new Object();
    snakeHead.x=canvasW/2;
    snakeHead.y=canvasH/2;
    snakeHead.z=0;
    snakeHead.meat=40;
    snakeHead.direction=2*rand(1,4);
    snakeHead.next=null;
    snakeHead.growth=0;
    snakeGrowing=0;
    foods=[]
    newFoodCooldown=0;
}
function gameOver()
{
    level=2;
    for(i=0;i<foods.length;i++)
        foods[i].growth=2;
    var tmp=snakeHead;
    while(tmp!=null)
    {
        tmp.growth=2;
        tmp=tmp.next;
    }
    gameOverCoooldown=300;
}

function run()
{
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);

    ctx.fillStyle=borderColor;
    ctx.fillRect(0,0,canvasW,borderSize);
    ctx.fillRect(0,canvasH-borderSize,canvasW,borderSize);
    ctx.fillRect(0,0,borderSize,canvasH);
    ctx.fillRect(canvasW-borderSize,0,borderSize,canvasH);
    //MENU
    if(level==-1)
    {
        ctx.fillStyle="#EEE";
        ctx.font = "80px Courier New";
        ctx.fillText("OUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROSOUROBOROS",
            titlePosition-=2,200);
        if(titlePosition<-10000)
            titlePosition=0;
        ctx.font = "25px Courier New";
        if(-titlePosition%30<20)
            ctx.fillText("Press any key to continue",canvasW/2-200,canvasH-100);
        //credits
        ctx.font = "12px Courier New";
        ctx.fillText("Made for JS13KGames competition",12,canvasH-12);
        ctx.fillText("by Infernet89",canvasW-100,canvasH-12);

        for(i=0;i<100;i++)
            if(Kpressed[i])
            {
                dragging=true;
                Kpressed[i]=false;
            }
                
        if(dragging)
        {
            level=0;
            generateLevel();
        }
    }
    //Actual game
    else if(level==0)
    {
        if(snakeHead.growth<1)
            snakeHead.growth+=0.1;
        for(i=0;i<foods.length;i++)
        {
            if(distanceFrom(snakeHead,foods[i])<snakeSize/2+foods[i].size/2)
            {
                snakeGrowing=foods[i].nutriment;
                foods.splice(i,1);
                i=i-1;
                //non mi piace più molto.. invertSnake();
            }
            else
            {
                drawApple(foods[i]);
                //animazione di crescita
                if(foods[i].growth<=1)
                    foods[i].growth+=0.1;
            }
        }
        drawSnake(snakeHead);
        moveSnake(snakeHead);
        changeDirection();
        if(checkCollisions(snakeHead))
        {
            gameOver();
        }

        if(newFoodCooldown--<0)
        {
            generateApple();
            newFoodCooldown=rand(20,200);
        }
    }
    //GameOver
    else if(level==2)
    {
        for(i=0;i<foods.length;i++)
        {
            drawApple(foods[i]);
            if(foods[i].growth>0)
                foods[i].growth-=0.05;
        }
        drawSnake(snakeHead);
        var tmp=snakeHead;
        while(tmp!=null)
        {
            if(tmp.growth>0)
                tmp.growth-=0.05;
            tmp=tmp.next;
        }
        if(gameOverCoooldown--<0)
        {
            level=0;
            generateLevel();
        }
        else if(gameOverCoooldown<200)
        {
            ctx.fillStyle="#EEE";
            ctx.font = "100px Courier New";
            if(gameOverCoooldown%30<15)
                ctx.fillText("GAME OVER",canvasW/2-250,250);
        }
    }
    
}
//controlla in Kpressed se cambiare direction
function changeDirection()
{
    newDirection=-1;
    if(Kpressed[38] || Kpressed[87])
    {
        newDirection=8;
    }
    else if(Kpressed[40] || Kpressed[83])
    {
        newDirection=2;
    }
    else if(Kpressed[37] || Kpressed[65])
    {
        newDirection=4;
    }
    else if(Kpressed[39] || Kpressed[68])
    {
        newDirection=6;
    }
    //change direction cooldown
    if(snakeHead.meat<snakeSize)
        newDirection=-1;
    //not allowed changes (if you do, the snake inverts?)
    if( (snakeHead.direction==2 && newDirection==8) ||
        (snakeHead.direction==8 && newDirection==2) ||
        (snakeHead.direction==4 && newDirection==6) ||
        (snakeHead.direction==6 && newDirection==4) )
        {
            newDirection=-1;
            invertSnake();
                for(i=0;i<100;i++)
                Kpressed[i]=false;
        }

    //he changed direction
    if(newDirection!=-1 && snakeHead.direction!=newDirection)
    {
        oldHead=snakeHead;
        snakeHead=new Object();
        snakeHead.x=oldHead.x;
        snakeHead.y=oldHead.y;
        snakeHead.z=oldHead.z;
        snakeHead.direction=newDirection;
        snakeHead.meat=0;
        snakeHead.growth=1;
        snakeHead.next=oldHead;
        for(i=0;i<100;i++)
            Kpressed[i]=false;
    }
}
function drawSnake(piece)
{
    //ricorsivamente, per disegnare la testa per ultima
    if(piece.next!=null)
        drawSnake(piece.next);

    //la testa del serpente
    if(piece==snakeHead)
        ctx.fillStyle=snakeColor;
    else
        ctx.fillStyle=tailColor;
    var size=piece.growth*(snakeSize+1);
    ctx.fillRect(piece.x-size/2,piece.y-size/2,size,size);
    //il resto del pezzo, in base alla direzione
    if(piece.meat>0)
    {
        ctx.fillStyle=tailColor;
        var rect=getSnakePieceRect(piece);
        ctx.fillRect(rect.x,rect.y,rect.width,rect.height);
    }  
}
function drawApple(a)
{
    ctx.fillStyle=a.color;
    var size=(a.size/2)*a.growth;
    ctx.fillRect(a.x-size,a.y-size,size,size);
}
function generateApple()
{
    var apple=new Object();
    apple.nutriment=rand(50,400);
    apple.size=rand(snakeSize*0.5,snakeSize*1.5);
    apple.color="#A00";
    apple.growth=0;
    
    apple.x=rand(snakeSize,canvasW-snakeSize);
    apple.y=rand(snakeSize,canvasH-snakeSize);
    apple.z=0;

    foods.push(apple);
}

function getSnakePieceRect(piece)
{
    var res=new Object();
    var size=snakeSize*piece.growth;
    if(piece.direction==8)//top
    {
        res.x=piece.x-size/2;
        res.y=piece.y+size/2;
        res.z=piece.z;
        res.width=size;
        res.height=piece.meat;
        res.depth=size;
    }
    else if(piece.direction==2)//bottom
    {
        res.x=piece.x-size/2;
        res.y=piece.y-size/2-piece.meat;
        res.z=piece.z;
        res.width=size;
        res.height=piece.meat;
        res.depth=size;
    }
    else if(piece.direction==4)//left
    {
        res.x=piece.x+size/2;
        res.y=piece.y-size/2;
        res.z=piece.z;
        res.width=piece.meat;
        res.height=size;
        res.depth=size;
    }
    else if(piece.direction==6)//right
    {
        res.x=piece.x-size/2-piece.meat;
        res.y=piece.y-size/2;
        res.z=piece.z;
        res.width=piece.meat;
        res.height=size;
        res.depth=size;
    }
    return res;
}
function moveSnake(piece)
{
    if(piece.direction==8)//top
    {
        piece.y-=snakeSpeed;
    }
    else if(piece.direction==2)//bottom
    {
        piece.y+=snakeSpeed;
    }
    else if(piece.direction==4)//left
    {
        piece.x-=snakeSpeed;
    }
    else if(piece.direction==6)//right
    {
        piece.x+=snakeSpeed;
    }    
    //crescita
    piece.meat+=snakeSpeed;
    while(piece.next!=null)
    {
        if(piece.next.meat<=0)
            piece.next=null;
        else piece=piece.next;
    }
        
    //l'ultimo della coda, cresce o si sposta
    if(snakeGrowing>snakeSpeed)
        snakeGrowing-=snakeSpeed;
    else piece.meat-=snakeSpeed;
    //sarebbe dovuto crescere di un pochino
    if(snakeGrowing<0)
    {
        piece.meat+=snakeGrowing;
        snakeGrowing=0;
    }        
}
function checkCollisions(piece)
{
    var res=false;
    if(piece.x-snakeSize/2<0)
        res=true;
    else if(piece.x+snakeSize/2>canvasW)
        res=true;
    else if(piece.y+snakeSize/2>canvasH)
        res=true;
    else if(piece.y-snakeSize/2<0)
        res=true;
    var tmp=piece.next;
    var r=null;
    while(tmp!=null)// && !res)
    {
        r=getSnakePieceRect(tmp);
        //console.log("DEBUG: ",r.x,"<",piece.x,"<",r.x+r.width," __ ",piece.y,">",r.y," && ",piece.y,"<",r.y+r.height);
        if (piece.x+snakeSize/2>r.x && piece.x-snakeSize/2<r.x+r.width && 
            piece.y+snakeSize/2>r.y && piece.y-snakeSize/2<r.y+r.height &&
            piece.z+snakeSize/2>r.z && piece.z-snakeSize/2<r.z+r.depth)
            {
                res=true;
            }
        tmp=tmp.next;
    }
    return res;
}
function invertSnake()
{
    var tmp=snakeHead;
    var prev=null;
    var next=null;
    while(tmp!=null)
    {
        //invert direction
        if(tmp.direction==2)
        {
            tmp.direction=8;
            tmp.y-=tmp.meat;
        }
        else if(tmp.direction==8)
        {
            tmp.direction=2;
            tmp.y+=tmp.meat;
        }
        else if(tmp.direction==4)
        {
            tmp.direction=6;
            tmp.x+=tmp.meat;
        }
        else if(tmp.direction==6)
        {
            tmp.direction=4;
            tmp.x-=tmp.meat;
        }
        next=tmp.next;
        tmp.next=prev;
        prev=tmp;
        tmp=next;
    }
    snakeHead=prev;
}
function translateControls(startPoint, endPoint)
{
    var dx=Math.abs(startPoint.x-endPoint.x);
    var dy=Math.abs(startPoint.y-endPoint.y);
    var dz=Math.abs(startPoint.z-endPoint.z);

    //lo spostamento sull'asse X è il maggiore
    if(dx>dy && dx>dz)
    {
        //verso sinistra
        if(startPoint.x>endPoint.x)
            Kpressed[37]=true;
        //verso destra
        else Kpressed[39]=true;
    }
    //spostamento sull'asse Y
    else if(dy>dx && dy>dz)
    {
        if(startPoint.y>endPoint.y)
            Kpressed[38]=true;
        else
            Kpressed[40]=true;
    }
    //asse Z
    else if(dz>dx && dz>dy)
    {
        //TODO definisci prima i comandi
    }
}
//CONTROLS
function cliccatoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    pointer.x = evt.targetTouches[0].pageX,
    pointer.y = evt.targetTouches[0].pageY;
    startPointer.x = pointer.x;
    startPointer.y = pointer.y;
}
function mossoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    pointer.x = evt.targetTouches[0].pageX,
    pointer.y = evt.targetTouches[0].pageY;
}
function rilasciatoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    endPointer.x = pointer.x;
    endPointer.y = pointer.y;
    translateControls(startPointer,endPointer);
}

function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    pointer.x=(evt.clientX-rect.left)/(rect.right-rect.left)*window.innerWidth;
    pointer.y=(evt.clientY-rect.top)/(rect.bottom-rect.top)*window.innerHeight;
}
function rilasciatoMouse(evt)
{
    dragging=false;
    var rect = canvas.getBoundingClientRect();
    startPointer.x = pointer.x;
    startPointer.y = pointer.y;
    endPointer.x = (evt.clientX-rect.left)/(rect.right-rect.left)*window.innerWidth;
    endPointer.y = (evt.clientY-rect.top)/(rect.bottom-rect.top)*window.innerHeight; 
    translateControls(startPointer,endPointer);
}
function keyDown(e) {
    Kpressed[e.keyCode]=true;
}
function keyUp(e) {
    Kpressed[e.keyCode]=false;
    if(DEBUG)
    {
        console.log(e.keyCode);
        if(e.keyCode==32)
            gameOver();
    }
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
function distanceFrom(a,b)
{
    return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)+(a.z-b.z)*(a.z-b.z));
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
