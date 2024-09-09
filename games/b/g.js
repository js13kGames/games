// < >
//constant
const fg="#ed419a"; //it stands for foreground color
const bg="#070707"; //it stands for background color
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
var cooldown=0;
var mainPg;
var cooldown=0;
var cooldownTreshold=30;
var snakeGrow=0;
var tail;
var enemy;
var lastBall;
var blowStep=0;

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

//setup all the objects
function setup()
{
    if(level==0)
    {
        drawable=[];
        var tmp=new Object();
        tmp.type="circle";
        tmp.x=canvasW/2;
        tmp.y=canvasH/3*2;
        tmp.radius=30;
        tmp.clickable=true;
        tmp.click=function(e) { levelUp();};
        drawable.push(tmp);        
    }
    else if(level==2)
    {
        drawable=[];
        mainPg=new Object();
        mainPg.type="circle";
        mainPg.radius=20;
        mainPg.x=mousex;
        mainPg.y=mousey;
        for(var i=0;i<20;i++)
        {
            var tmp=new Object();
            tmp.type="circle";
            tmp.radius=10;
            regenerateBall(tmp); 
            drawable.push(tmp);
        }
        canvas.style.cursor="none";
    }
    else if(level==3)
    {
        drawable=[];
        var tmp=new Object();
        tmp.type="circle";
        tmp.radius=canvasH/2;
        tmp.x=canvasW/2;
        tmp.y=canvasH/2;
        tmp.dx=0;
        tmp.dy=0;
        tmp.damage=0;
        drawable.push(tmp);
        
        mainPg=new Object();
        mainPg.type="ship";
        mainPg.size=20;
        mainPg.angle=90;
        mainPg.x=-20;
        mainPg.y=-20;
        drawable.push(mainPg);

        canvas.style.cursor="default";       
    }
    else if(level==4)
    {
        //guarda la posizione dell'ultimo circle e di mainPg, per posizione Head e Egg
        mainPg.x=mainPg.x-mainPg.x%32;
        mainPg.y=mainPg.y-mainPg.y%32;
        mainPg.dx=0;
        mainPg.dy=0;
        mainPg.angle=mainPg.angle-mainPg.angle%90;
        drawable.filter(el => el.type=="circle").forEach(ball =>
        {
            ball.x=ball.x-ball.x%32;
            if(ball.x<=0)
                ball.x=32;
            if(ball.x>=canvasW)
                ball.x=canvasW-32;
            if(ball.y<=0)
                ball.y=32;
            if(ball.y>=canvasH)
                ball.y=canvasH-32;
            ball.y=ball.y-ball.y%32;
            ball.radius=12;
            ball.dx=0;
            ball.dy=0;
        });
        
        //mainPg=new Object();//TODO DEBUG
        mainPg.type="head";
        mainPg.eaten=0;
        mainPg.size=32;
        /*/TODO <DEBUG>
        mainPg.x=128*8;
        mainPg.y=128;
        mainPg.angle=270;
        drawable.push(mainPg);
        var tmp=new Object();
        tmp.type="circle";
        tmp.radius=12;
        tmp.x=32*28;
        tmp.y=32*4;
        tmp.dx=0;
        tmp.dy=0;
        drawable.push(tmp);
        //TODO </DEBUG>*/
        var dx;
        var dy;
        if(mainPg.angle==0)
        {
            dx=0;
            dy=32;
        }
        else if(mainPg.angle==90)
        {
            dx=-32;
            dy=0;
        }
        else if(mainPg.angle==180)
        {
            dx=0;
            dy=-32;
        }
        else if(mainPg.angle==270)
        {
            dx=32;
            dy=0;
        }
        tail=mainPg;
        snakeGrow=3;
        cooldownTreshold=8;
        drawable=drawable.filter(el => el.type=="circle" || el.type=="head");
    }
    else if(level==5)
    {
        /*/TODO <DEBUG>
        mainPg=new Object();
        drawable.push(mainPg);
        for(var i=0;i<10;i++)
        {
            var tmp=new Object();
            tmp.type="circle";
            tmp.radius=12;
            tmp.x=100;
            tmp.y=100;
            tmp.speed=10;
            tmp.angle=rand(0,360)/180*Math.PI;
            tmp.dx=tmp.speed*Math.sin(tmp.angle);
            tmp.dy=tmp.speed*Math.cos(tmp.angle);
            drawable.push(tmp);

            tmp=new Object();
            tmp.type="body";
            tmp.size=32;
            tmp.x=rand(0,canvasW);
            tmp.y=rand(0,canvasH);
            tmp.x=tmp.x-tmp.x%32;
            tmp.y=tmp.y-tmp.y%32;
            drawable.push(tmp);
        }        
        //TODO </DEBUG>*/
        mainPg.type="bar";
        mainPg.x=100;
        mainPg.y=canvasH-50;
        mainPg.dy=0;
        mainPg.dx=0;
        mainPg.size=100;
        mainPg.angle=0;
        //convert snake body in bricks
        drawable.filter(el => el.type=="body").forEach(el =>
        {
            el.type="block"
            el.dx=0;
            el.dy=0;
            tmp=new Object();
            tmp.type="block";
            tmp.size=32;
            tmp.x=el.x;
            tmp.y=el.y+16;
            tmp.dx=0;
            tmp.dy=0;
            tmp.angle=0;
            drawable.push(tmp);
            //put bricks inside screen
            while(tmp.x<32) tmp.x+=32;
            while(tmp.x>canvasW-32) tmp.x-=32;
            while(tmp.y<32) tmp.y+=32;
            while(tmp.y>canvasH-32) tmp.y-=32;
            while(el.x<32) el.x+=32;
            while(el.x>canvasW-32) el.x-=32;
            while(el.y<32) el.y+=32;
            while(el.y>canvasH-32) el.y-=32;
        });
        //make the balls move
        drawable.filter(el => el.type=="circle").forEach(el =>
        {
            el.speed=10;
            el.angle=rand(0,360)/180*Math.PI;
            el.dx=el.speed*Math.sin(el.angle);
            el.dy=el.speed*Math.cos(el.angle);
        });
    }
    else if(level==6)
    {
        enemy=new Object();
        enemy.type="bar";
        enemy.x=100;
        enemy.y=30;
        enemy.dy=0;
        enemy.dx=0;
        enemy.size=100;
        enemy.speed=9;
        drawable.push(enemy);
        
        //eleggi una palla a "lastBall". La più vicina al centro.
        var minDist=999999;
        drawable.filter(el => el.type=="circle").forEach(el =>
        {
            var dist=distanceFrom(canvasW/2,canvasH/2,el.x,el.y);
            if(dist<minDist)
            {
                minDist=dist;
                lastBall=el;
            }
        });
        /*/TODO <DEBUG>
        lastBall=new Object();
        lastBall.type="circle";
        lastBall.radius=12;
        lastBall.x=100;
        lastBall.y=100;
        lastBall.speed=10;
        lastBall.angle=rand(0,360)/180*Math.PI;
        lastBall.dx=lastBall.speed*Math.sin(lastBall.angle);
        lastBall.dy=lastBall.speed*Math.cos(lastBall.angle);
        drawable.push(lastBall);
        mainPg=new Object();
        mainPg.type="bar";
        mainPg.x=100;
        mainPg.y=canvasH-50;
        mainPg.dy=0;
        mainPg.dx=0;
        mainPg.size=100;
        mainPg.angle=0;
        drawable.push(mainPg);
        enemy.speed=6;//TODO DEBUG
        //TODO </DEBUG>*/
    }
    else if(level==7)
    {//blow the lastBall
        canvas.style.cursor="none";
        blowStep=0;
        for(var i=0;i<300;i++)
        {
            var tmp=new Object();
            tmp.type="particle";
            tmp.x=lastBall.x;
            tmp.y=lastBall.y;
            tmp.speed=rand(5,50);
            tmp.angle=rand(280,440)/180*Math.PI;
            tmp.dx=tmp.speed*Math.sin(tmp.angle);
            tmp.dy=tmp.speed*Math.cos(tmp.angle);
            drawable.push(tmp);
        }
        drawable=drawable.filter(el => el !== lastBall);
        delete lastBall;
        enemy.dx=0;
        mainPg.dx=0;
        cooldown=50;
    }
    else if(level==8)
    {//clean everything
        mainPg=new Object();
        mainPg.type="blackhole";
        mainPg.x=mousex;
        mainPg.y=mousey;
        mainPg.radius=1;
        drawable.push(mainPg);
    }
    else if(level==9)
    {//ending title
        cooldown=0;
        drawable=[];
    }
}
//level up!
function levelUp()
{
    dragging=false;
    level++;
    /*
        1 - clickCircle
        2 - absorbeCircles
        3 - Asteroid
        4 - Snake
        5 - arkanoid
        6 - Pong
    */
    setup();
    //console.log("Level up!",level);//TODO DEBUG
}
//draw a single object
function draw(obj)
{
    ctx.save();
    if(obj.type=="circle")
    {
        ctx.fillStyle=fg;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
    }
    else if(obj.type=="ship")
    {
        ctx.translate(obj.x,obj.y);
        ctx.rotate((obj.angle* Math.PI) / 180);
        for(i=0;i<obj.size;i++)
        {
            if(i%2)
                ctx.fillStyle=fg;
            else
                ctx.fillStyle=bg;
            ctx.fillRect(-i/2,i,3,3);
            ctx.fillRect(+i/2,i,3,3);
        }
    }
    else if(obj.type=="projectile")
    {
        ctx.translate(obj.x,obj.y);
        ctx.rotate((obj.angle* Math.PI) / 180);
        ctx.fillStyle=fg;
        for(i=0;i<obj.size;i++)
        {
            ctx.fillRect(-i*2,0,2,1);
        }
    }
    else if(obj.type=="head")
    {
        ctx.translate(obj.x,obj.y);
        ctx.rotate((obj.angle* Math.PI) / 180);
        ctx.translate(-obj.size/2,-obj.size/2);
        ctx.translate(obj.size/2-2,0);
        ctx.fillStyle=bg;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(obj.size/2, obj.size);
        ctx.lineTo(-obj.size/2, obj.size);
        ctx.fill();
        for(i=0;i<obj.size;i++)
        {
            if(i%2)
                ctx.fillStyle=fg;
            else
                ctx.fillStyle=bg;
            ctx.fillRect(-i/2,i,3,3);
            ctx.fillRect(+i/2,i,3,3);
        }
        //eyes
        ctx.fillStyle=fg;
        ctx.beginPath();
        ctx.arc(-3, 25, 2, 0, 2 * Math.PI);
        ctx.arc(5, 25, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle=bg; 
        ctx.beginPath();
        ctx.arc(-3, 25, 1, 0, 2 * Math.PI);
        ctx.arc(5, 25, 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle="#F00";
    }
    else if(obj.type=="body" && obj.eaten!=1)
    {
        ctx.translate(obj.x,obj.y);
        ctx.rotate((obj.angle* Math.PI) / 180);
        ctx.translate(-obj.size/2,-obj.size/2);
        ctx.fillStyle=fg;
        ctx.fillRect(0,0,32,32);
        ctx.fillStyle=bg;
        ctx.fillRect(2,5,20,5);
        ctx.fillRect(10,20,20,5);
    }
    else if(obj.type=="bar")
    {
        ctx.fillStyle=fg;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y+10, 10, 0, 2 * Math.PI);
        ctx.arc(obj.x+obj.size, obj.y+10, 10, 0, 2 * Math.PI);
        ctx.fill(); 
        ctx.fillRect(obj.x,obj.y,obj.size,20);
        ctx.fillStyle=bg;
        if(obj==enemy)
            ctx.fillRect(obj.x+10,obj.y+16,obj.size-20,2);
        else
            ctx.fillRect(obj.x+10,obj.y+2,obj.size-20,2);
    }
    else if(obj.type=="block")
    {
        ctx.fillStyle=fg;
        ctx.fillRect(obj.x,obj.y,obj.size,16);
        ctx.fillStyle=bg;
        ctx.fillRect(obj.x+2,obj.y+2,18,4);
        ctx.fillRect(obj.x+22,obj.y+2,8,4);
        ctx.fillRect(obj.x+2,obj.y+9,8,4);
        ctx.fillRect(obj.x+12,obj.y+9,18,4);
    }
    else if(obj.type=="particle")
    {
        ctx.fillStyle=fg;
        ctx.fillRect(obj.x,obj.y,2,2);
    }
    else if(obj.type=="blackhole")
    {
        ctx.fillStyle="#000";
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        ctx.fill(); 
    }
    ctx.restore();
}
function move(obj)
{
    if(obj.dx==null || obj.dy==null) return;
    obj.x+=obj.dx;
    obj.y+=obj.dy;
    if(level==2)
    {
        //we absorbe the ball
        if(distanceFrom(mainPg.x,mainPg.y,obj.x,obj.y) < obj.radius+mainPg.radius)
        {
            mainPg.radius+=2;
            obj.x=-999;
        }
        //we regenerate the one offscreen
        if(obj.x < -200 || obj.x > canvasW+200 || obj.y < -200 || obj.y > canvasH+200)
        {
            regenerateBall(obj);              
        }
        //ending conditions
        if(mainPg.radius>=canvasH/2)
        {
            mainPg.radius=canvasH/2;
            if(mainPg.x>canvasW/2-10 && mainPg.x<canvasW/2+10)
                levelUp();
        }
    }
}
//main loop that draw the screen and perform the game logic
function run()
{
    ctx.clearRect(0, 0, canvasW, canvasH);
    if(level<9)
        ctx.fillStyle=bg;
    else
        ctx.fillStyle="#000";
    ctx.fillRect(0,0,canvasW,canvasH);
    if(level==0)
    {
        ctx.fillStyle=fg;
        ctx.font = "300px Brush Script MT";
        ctx.textAlign="center";
        ctx.fillText("B",canvasW/2,canvasH/3);
        canvas.style.cursor="default";
    }
    else if(level==1)
    {
        cooldown--;
        if(cooldown<0)
        {
            drawable=[];
            cooldown=100;
        }
        else if(cooldown==30)
        {
            var tmp=new Object();
            tmp.type="circle";
            tmp.x=rand(20,canvasW-20);
            tmp.y=rand(20,canvasH-20);
            tmp.radius=20;
            tmp.clickable=true;
            tmp.click=function(e) { levelUp();};
            drawable.push(tmp);
        }
        canvas.style.cursor="default";
    }
    else if(level==2)
    {
        mainPg.x=mousex;
        if(mainPg.x-mainPg.radius<0)
        {
            mainPg.x=mainPg.radius;
        }
        else if(mainPg.x+mainPg.radius>canvasW)
        {
            mainPg.x=canvasW-mainPg.radius;
        }
        mainPg.y=mousey;
        if(mainPg.y-mainPg.radius<0)
        {
            mainPg.y=mainPg.radius;
        }
        else if(mainPg.y+mainPg.radius>canvasH)
        {
            mainPg.y=canvasH-mainPg.radius;
        }
        draw(mainPg);
    }
    else if(level==3)
    {
        //make the main pg follow the mouse
        const speed=4;
        const bulletSpeed=15;
        const dx=mousex - mainPg.x;
        const dy=mousey - mainPg.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        mainPg.angle=(Math.atan2(mainPg.y - mousey, mainPg.x - mousex) * (180 / Math.PI) + 360 - 90) % 360; //thanks, chatGPT.
        if(dragging || length<5)
        {
            mainPg.dx=0;
            mainPg.dy=0;
        }
        else
        {
            mainPg.dx=dx/length*speed;
            mainPg.dy=dy/length*speed;
        }

        //shoot a projectile
        if(cooldown--<0)
        {
            var tmp=new Object();
            tmp.type="projectile";
            tmp.x=mainPg.x;
            tmp.y=mainPg.y;
            tmp.size=10;
            tmp.angle=(mainPg.angle+270)%360;
            tmp.dx=dx/length*bulletSpeed;
            tmp.dy=dy/length*bulletSpeed;
            drawable.push(tmp);

            cooldown=cooldownTreshold;
        }
        //rimuove da drawable ciò che non è più applicabile
        var liveBalls=0;
        for (var i = drawable.length - 1; i >= 0; i--)
        {
            if( (drawable[i].type == "projectile") &&
            (drawable[i].x<0 || drawable[i].y<0 || drawable[i].x> canvasW || drawable[i].y>canvasH) )
                drawable.splice(i, 1);
            else if(drawable[i].type == "circle" && drawable[i].radius<20)
                drawable.splice(i, 1);
            else if(drawable[i].type == "circle" && drawable[i].radius>24)
            {
                liveBalls++;
            }
        }
        //controlla le collisioni tra palle e tutto il resto 
        drawable.filter(el => el.type=="circle").forEach(ball => 
        { 
            //colpito da proiettile
            drawable.filter(el => el.type=="projectile").forEach(el =>
            {
                if(distanceFrom(el.x,el.y,ball.x,ball.y)<ball.radius+el.size)
                {
                    el.x=-100;
                    cooldown=5;
                    ball.dx+=el.dx/ball.radius*10;
                    ball.dy+=el.dy/ball.radius*10;
                    ball.radius-=8;
                    //split the ball after 10 hit
                    if(ball.damage++>8)
                    {                        
                        cooldownTreshold-=3;
                        var tmp=new Object();
                        tmp.type="circle";
                        tmp.radius=ball.radius/2;
                        tmp.x=ball.x+tmp.radius;
                        tmp.y=ball.y-tmp.radius;
                        tmp.dx=ball.dx;
                        tmp.dy=ball.dy;
                        tmp.damage=0;
                        drawable.push(tmp);
                        var tmp=new Object();
                        tmp.type="circle";
                        tmp.radius=ball.radius/2;
                        tmp.x=ball.x+tmp.radius;
                        tmp.y=ball.y+tmp.radius;
                        tmp.dx=ball.dx;
                        tmp.dy=ball.dy;
                        tmp.damage=0;
                        drawable.push(tmp);
                        var tmp=new Object();
                        tmp.type="circle";
                        tmp.radius=ball.radius/2;
                        tmp.x=ball.x-tmp.radius;
                        tmp.y=ball.y+tmp.radius;
                        tmp.dx=ball.dx;
                        tmp.dy=ball.dy;
                        tmp.damage=0;
                        drawable.push(tmp);
                        
                        ball.radius=ball.radius/2;
                        ball.x-=ball.radius;
                        ball.y-=ball.radius;
                        ball.damage=0;
                    }
                    
                }
            } );
            //bounce from other balls
            drawable.filter(el => el.type=="circle" && el!=ball).forEach(b2 => 
            {
                if(distanceFrom(ball.x,ball.y,b2.x,b2.y)<=ball.radius+b2.radius)
                {
                    var tmp=ball.dx;
                    ball.dx=b2.dx/ball.radius*b2.radius;
                    b2.dx=tmp/b2.radius*ball.radius;

                    tmp=ball.dy;
                    ball.dy=b2.dy/ball.radius*b2.radius;
                    b2.dy=tmp/b2.radius*ball.radius;
                    //se sono già compenetranti, le separo a forza
                    while(distanceFrom(ball.x+ball.dx,ball.y+ball.dy,b2.x+b2.dx,b2.y+b2.dy)<ball.radius+b2.radius)
                    {
                        if(ball.x<b2.x)
                        {
                            ball.dx--;
                            b2.dx++;
                        }
                        else
                        {
                            ball.dx++;
                            b2.dx--;
                        }
                        if(ball.y<b2.y)
                        {
                            ball.dy--;
                            b2.dy++;
                        }
                        else
                        {
                            ball.dy++;
                            b2.dy--;
                        }
                    }
                }
            });
            //bounce from borders
            if(ball.x<=ball.radius && ball.dx<0)
                ball.dx*=-1;
            if(ball.y<=ball.radius && ball.dy<0)
                ball.dy*=-1;
            if(ball.x>=canvasW-ball.radius && ball.dx>0)
                ball.dx*=-1;
            if(ball.y>=canvasH-ball.radius && ball.dy>0)
                ball.dy*=-1;
            //force exit from borders
            if(ball.x+ball.dx<ball.radius)
                ball.dx++;
            if(ball.y+ball.dy<ball.radius)
                ball.dy++;
            if(ball.x+ball.dx>canvasW-ball.radius)
                ball.dx--;
            if(ball.y+ball.dy>canvasH-ball.radius)
                ball.dy--;
            //la palla si muove con un po' di attrito.
            if(Math.abs(ball.dx*=0.97)<0.1 || Math.abs(ball.dx)>30)
                ball.dx=0;
            if(Math.abs(ball.dy*=0.97)<0.1 || Math.abs(ball.dy)>30)
                ball.dy=0;
        } );
        if(liveBalls==0)
            levelUp();
    }
    else if(level==4)
    {
        if(!dragging && --cooldown<0)
        {
            //turn head
            var dx=mainPg.x-mousex;
            var dy=mainPg.y-mousey;
            //forbidden directions
            if(mainPg.angle==0 && dy<0)
                dy=0;
            if(mainPg.angle==90 && dx>0)
                dx=0;
            if(mainPg.angle==180 && dy>0)
                dy=0;
            if(mainPg.angle==270 && dx<0)
                dx=0;
            //top
            if(Math.abs(dy)>Math.abs(dx) && dy>32 && mainPg.angle!=180)
                mainPg.angle=0;
            //left
            else if(Math.abs(dy)<Math.abs(dx) && dx>32 && mainPg.angle!=90)
                mainPg.angle=270;
            //bottom
            else if(Math.abs(dy)>Math.abs(dx) && dy<-32 && mainPg.angle!=0)
                mainPg.angle=180;
            //right
            else if(Math.abs(dy)<Math.abs(dx) && dx<-32 && mainPg.angle!=270)
                mainPg.angle=90;

            //move
            drawable.filter(el => el.type=="head" || el.type=="body").forEach(el => {
                if(el.angle==0)
                {
                    el.dx=0;
                    el.dy=-32;
                }
                else if(el.angle==90)
                {
                    el.dx=32;
                    el.dy=0;
                }
                else if(el.angle==180)
                {
                    el.dx=0;
                    el.dy=32;
                }
                else if(el.angle==270)
                {
                    el.dx=-32;
                    el.dy=0;
                }
                //warp
                if(el.angle==0 && el.y<32)
                    el.y=canvasH;
                else if(el.angle==90 && el.x>canvasW-32)
                    el.x=0;
                else if(el.angle==180 && el.y>canvasH-32)
                    el.y=0;
                else if(el.angle==270 && el.x<32)
                    el.x=canvasW;
            });
            //grow
            if(snakeGrow-- > 0)
            {
                var tmp=new Object();
                tmp.type="body";
                tmp.size=32;
                tmp.x=tail.x;
                tmp.y=tail.y;
                tmp.angle=tail.angle;
                tmp.prev=tail;
                tmp.eaten=0;
                drawable.push(tmp);
                tail=tmp;
            }
            else snakeGrow=0;
            //follow
            var snakeLength=0;
            tmp=tail;
            while(tmp.prev!=null)
            {
                tmp.angle=tmp.prev.angle;
                tmp.eaten=tmp.prev.eaten;
                tmp=tmp.prev;
                snakeLength++;
            }
            //eat
            for (var i = drawable.length - 1; i >= 0; i--)
            {
                if(drawable[i].type == "circle" && distanceFrom(mainPg.x,mainPg.y,drawable[i].x,drawable[i].y)<16)
                {
                    snakeGrow+=3;
                    drawable.splice(i, 1);
                }
                else
                {
                    //eat a piece of himself
                    if(drawable[i].type == "body" && distanceFrom(mainPg.x,mainPg.y,drawable[i].x+drawable[i].dx,drawable[i].y+drawable[i].dy)<16 && drawable[i].prev!=mainPg)
                        drawable[i].eaten=1;
                    if(drawable[i].eaten==1 && drawable[i]==tail)
                    {
                        tail=drawable[i].prev;
                        drawable.splice(i, 1);
                    }
                }
            }                
            if(snakeLength>80)
                levelUp();
            cooldown=cooldownTreshold;
        }
        else
        {
            var nEggs=0;
            drawable.filter(el => el.type=="head" || el.type=="body" || el.type=="circle").forEach(el => {
                el.dx=0;
                el.dy=0;
                if(el.type=="circle")
                {
                    nEggs++;
                    //vibration
                    el.x=Math.round(el.x/32)*32+rand(-0.1,0.1);
                    el.y=Math.round(el.y/32)*32+rand(-0.1,0.1);
                }
                //warp
                if(el.y<32)
                {
                    var tmp=new Object();
                    tmp.type=el.type;
                    tmp.size=el.size;
                    tmp.angle=el.angle;
                    tmp.x=el.x;
                    tmp.y=canvasH;
                    draw(tmp);
                    delete tmp;
                }
                if(el.x>canvasW-32)
                {
                    var tmp=new Object();
                    tmp.type=el.type;
                    tmp.size=el.size;
                    tmp.angle=el.angle;
                    tmp.x=0;
                    tmp.y=el.y;
                    draw(tmp);
                    delete tmp;
                }
                if(el.y>canvasH-32)
                {
                    var tmp=new Object();
                    tmp.type=el.type;
                    tmp.size=el.size;
                    tmp.angle=el.angle;
                    tmp.x=el.x;
                    tmp.y=0;
                    draw(tmp);
                    delete tmp;
                }
                if(el.x<32)
                {
                    var tmp=new Object();
                    tmp.type=el.type;
                    tmp.size=el.size;
                    tmp.angle=el.angle;
                    tmp.x=canvasW;
                    tmp.y=el.y;
                    draw(tmp);
                    delete tmp;
                }
            });
            //maybe spawn an egg?
            if(rand(0,1000)>970+nEggs*3)
            {
                var tmp=new Object();
                tmp.type="circle";
                tmp.radius=12;
                tmp.x=mainPg.x;
                tmp.y=mainPg.y;
                tmp.dx=0;
                tmp.dy=0;
                var isLegit=false;
                while(!isLegit)
                {
                    tmp.x=rand(1,canvasW/32-1)*32;
                    tmp.y=rand(1,canvasH/32-1)*32;
                    isLegit=true;
                    drawable.filter(el => el.type=="head" || el.type=="body" || el.type=="circle").forEach(el =>
                    {
                        if(distanceFrom(tmp.x,tmp.y,el.x,el.y)<32)
                            isLegit=false;
                    });
                }
                drawable.push(tmp);
            }
        }
    }
    else if(level==5)
    {
        //move main character
        const speed=10;
        mainPg.dy=0;
        if(mousex<mainPg.x+mainPg.size/2-speed)
            mainPg.dx=-speed;
        else if(mousex>mainPg.x+mainPg.size/2+speed)
            mainPg.dx=speed;
        else
            mainPg.dx=0;
        //balls bounce
        drawable.filter(el => el.type=="circle").forEach(ball =>
        {
            //bounce with bar
            if(ball.y+ball.dy+ball.radius>mainPg.y && ball.x>=mainPg.x && ball.x<=mainPg.x+mainPg.size)
            {
                if(dragging)
                {
                    ball.x=mainPg.x+mainPg.size/2;
                    ball.y=mainPg.y+5;
                    ball.dx=0;
                    ball.dy=0;
                }
                else
                {
                    //rimbalza bene, in base a dove colpisci la bar, rispettando la forza
                    angle = Math.PI+Math.PI*(ball.x-mainPg.x+2)/(mainPg.size+5);
                    ball.dx=ball.speed*Math.cos(angle);
                    ball.dy=ball.speed*Math.sin(angle);
                }                
            }
            //bounce from borders
            if(ball.x<=ball.radius && ball.dx<0)
                ball.dx*=-1;
            if(ball.y<=ball.radius && ball.dy<0)
                ball.dy*=-1;
            if(ball.x>=canvasW-ball.radius && ball.dx>0)
                ball.dx*=-1;
            if(ball.y>=canvasH-ball.radius && ball.dy>0)
                ball.dy*=-1;
            //hit blocks
            for (var i = drawable.length - 1; i >= 0; i--)
            {
                if(drawable[i].type!="block") continue;
                var block=drawable[i];
                if(ball.x+ball.radius>=block.x && ball.x-ball.radius<=block.x+block.size
                && ball.y+ball.radius>=block.y && ball.y-ball.radius<=block.y+16)
                {
                    //bounce ball (dx or dy, it depends)
                    var dx=Math.abs(ball.x-block.x+block.size/2);
                    var dy=Math.abs(ball.y-block.y+8);
                    if(dx<dy)
                        ball.dx*=-1;
                    else
                        ball.dy*=-1;
                    drawable.splice(i, 1);
                    delete block;
                }
            }
        });
        //ending condition
        if(drawable.filter(el => el.type=="block").length<=0)
            levelUp();
    }
    else if(level==6)
    {
        //move main character
        const speed=10;
        mainPg.dy=0;
        if(dragging)
            mainPg.dx=0;
        else if(mousex<mainPg.x+mainPg.size/2-speed)
            mainPg.dx=-speed;
        else if(mousex>mainPg.x+mainPg.size/2+speed)
            mainPg.dx=speed;
        else
            mainPg.dx=0;
        //also move the enemy
        if(lastBall.x<enemy.x+enemy.size/2-speed)
            enemy.dx=-enemy.speed;
        else if(lastBall.x>enemy.x+enemy.size/2+speed)
            enemy.dx=enemy.speed;
        else
            enemy.dx=0;
        //bounce with bar
        if(lastBall.y+lastBall.dy+lastBall.radius>mainPg.y && lastBall.x>=mainPg.x && lastBall.x<=mainPg.x+mainPg.size)
        {
            //rimbalza bene, in base a dove colpisci la bar, rispettando la forza
            angle = Math.PI+Math.PI*(lastBall.x-mainPg.x+2)/(mainPg.size+5);
            lastBall.dx=lastBall.speed*Math.cos(angle);
            lastBall.dy=lastBall.speed*Math.sin(angle);
        }
        //bounce from borders
        if(lastBall.x<=lastBall.radius && lastBall.dx<0)
            lastBall.dx*=-1;
        if(lastBall.x>=canvasW-lastBall.radius && lastBall.dx>0)
            lastBall.dx*=-1;
        if(lastBall.y>=canvasH-lastBall.radius && lastBall.dy>0)
            lastBall.dy*=-1;
        //bounce to enemy
        if(lastBall.y>0 && lastBall.y+lastBall.dy+lastBall.radius<enemy.y+40 && lastBall.x>=enemy.x && lastBall.x<=enemy.x+enemy.size)
        {
            //rimbalza bene, in base a dove colpisci la bar, rispettando la forza
            angle = Math.PI*(lastBall.x-enemy.x+2)/(enemy.size+5);
            lastBall.dx=lastBall.speed*Math.cos(angle);
            lastBall.dy=lastBall.speed*Math.sin(angle);
            enemy.speed-=0.3;
            //generate a single particle
            var tmp=new Object();
            tmp.type="particle";
            tmp.x=lastBall.x+rand(0,5);
            tmp.y=lastBall.y+rand(0,5);
            tmp.dx=0;
            tmp.dy=0;
            drawable.push(tmp);
            //and another, on the bar
            var tmp=new Object();
            tmp.type="particle";
            tmp.x=enemy.x+rand(0,enemy.size);
            tmp.y=enemy.y+rand(0,20);
            tmp.dx=0;
            tmp.dy=0;
            drawable.push(tmp);
        }
        //exiting from the top (ending condition)
        if(lastBall.y<-20 && lastBall.dy<0)
            levelUp();
    }
    else if(level==7)
    {
        enemy.dx=0;
        drawable.filter(el => el.type=="particle").forEach(el => 
        {
            el.dx*=0.8;
            el.dy*=0.8;
            if(Math.abs(el.dx)<0.2)
                el.dx=0;
            if(Math.abs(el.dy)<0.2)
                el.dy=0;
        });
        if(--cooldown<=0)
        {
            blowStep++;
            //blow the enemy
            if(blowStep==2)
            {
                for(var i=0;i<300;i++)
                {
                    var tmp=new Object();
                    tmp.type="particle";
                    tmp.x=enemy.x+i%enemy.size;
                    tmp.y=enemy.y+(i/enemy.size)%30;
                    tmp.speed=rand(5,20);
                    tmp.angle=rand(0,360)/180*Math.PI;
                    tmp.dx=tmp.speed*Math.sin(tmp.angle);
                    tmp.dy=tmp.speed*Math.cos(tmp.angle);
                    drawable.push(tmp);
                }
                drawable=drawable.filter(el => el !== enemy);        
            }
            //the mainPg
            else if(blowStep==3)
            {
                for(var i=0;i<300;i++)
                {
                    var tmp=new Object();
                    tmp.type="particle";
                    tmp.x=mainPg.x+i%mainPg.size;
                    tmp.y=mainPg.y+(i/mainPg.size)%30;
                    tmp.speed=rand(5,20);
                    tmp.angle=rand(0,360)/180*Math.PI;
                    tmp.dx=tmp.speed*Math.sin(tmp.angle);
                    tmp.dy=tmp.speed*Math.cos(tmp.angle);
                    drawable.push(tmp);
                }
                drawable=drawable.filter(el => el !== mainPg);  
            }
            //the left border
            else if(blowStep==4)
            {
                for(var i=0;i<canvasH;i++)
                {
                    var tmp=new Object();
                    tmp.type="particle";
                    tmp.x=0;
                    tmp.y=i%canvasH;
                    tmp.speed=rand(2,90);
                    tmp.angle=rand(70,120)/180*Math.PI;
                    tmp.dx=tmp.speed*Math.sin(tmp.angle);
                    tmp.dy=tmp.speed*Math.cos(tmp.angle);
                    drawable.push(tmp);
                }
                cooldown=-30;
            }
            //the right border
            else if(blowStep==5)
            {
                for(var i=0;i<canvasH;i++)
                {
                    var tmp=new Object();
                    tmp.type="particle";
                    tmp.x=canvasW-1;
                    tmp.y=i%canvasH;
                    tmp.speed=rand(2,100);
                    tmp.angle=rand(250,290)/180*Math.PI;
                    tmp.dx=tmp.speed*Math.sin(tmp.angle);
                    tmp.dy=tmp.speed*Math.cos(tmp.angle);
                    drawable.push(tmp);
                }
                cooldown=-40;
            }
            //the bottom border
            else if(blowStep==6)
            {
                for(var i=0;i<canvasW;i++)
                {
                    var tmp=new Object();
                    tmp.type="particle";
                    tmp.x=i%canvasW;
                    tmp.y=canvasH-1;
                    tmp.speed=rand(2,140);
                    tmp.angle=rand(160,200)/180*Math.PI;
                    tmp.dx=tmp.speed*Math.sin(tmp.angle);
                    tmp.dy=tmp.speed*Math.cos(tmp.angle);
                    drawable.push(tmp);
                }
                cooldown=30;
            }
            else if(blowStep==7)
                levelUp();
            cooldown+=60;
        }
    }
    else if(level==8)
    {
        mainPg.x=mousex;
        mainPg.y=mousey;
        //swallow everyting
        for (var i = drawable.length - 1; i >= 0; i--)
        {
            if(drawable[i].type!="particle") continue;
            var dist=distanceFrom(mainPg.x,mainPg.y,drawable[i].x,drawable[i].y);
            if(dist<mainPg.radius)
            {
                drawable.splice(i, 1);
                mainPg.radius+=0.07;
            }
            else if(dist<mainPg.radius*3)
            {
                //get sucked in
                drawable[i].dx=(mainPg.x-drawable[i].x)/30*(mainPg.radius/dist);
                drawable[i].dy=(mainPg.y-drawable[i].y)/30*(mainPg.radius/dist);
            }
            else
            {
                drawable[i].dx*=0.8;
                drawable[i].dy*=0.8;
            }
        }
        if(drawable.length<100)
            mainPg.radius+=10;
        if(mainPg.radius<20)
            mainPg.radius+=0.1;
        else if(mainPg.radius>canvasW)
            levelUp();
    }
    else if(level==9)
    {
        cooldown++;
        var alpha=cooldown/300;
        if(alpha>1)
        {
            alpha=2-alpha;
        }
        if(alpha<0.7)
            alpha*=0.7;
        else if(alpha<0.6)
            alpha*=0.6;
        else if(alpha<0.5)
            alpha*=0.5;
        else if(alpha<0.4)
            alpha*=0.4;
        else if(alpha<0.3)
            alpha*=0.3;
        ctx.globalAlpha=alpha;
        ctx.fillStyle=fg;
        ctx.font = "300px Brush Script MT";
        ctx.textAlign="center";
        ctx.fillText("B",canvasW/2,canvasH/2);
        ctx.globalAlpha=1;
        if(cooldown>=600)
        {
            level=-1;
            drawable=[];
            levelUp();
        }        
    }

    //draw, move and check object collisions
    drawable.forEach(el => { move(el); draw(el); } );
    if(level==3 || level==4)
    {
        draw(mainPg);
    }
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

    //log gesture
    oldmousex=mousex;
    oldmousey=mousey;
    //border
    ctx.fillStyle=fg;
    if(level<6)
        ctx.fillRect(0,0,canvasW,1);
    if(blowStep<6)
        ctx.fillRect(0,canvasH-1,canvasW,1);
    if(blowStep<4)
        ctx.fillRect(0,0,1,canvasH);
    if(blowStep<5)
        ctx.fillRect(canvasW-1,0,1,canvasH);
}
function regenerateBall(obj)
{
    obj.x=100;
    obj.y=100;
    while(obj.x > -10 && obj.x < canvasW+10 && obj.y > -10 && obj.y < canvasH+10) 
    {
        obj.x=rand(-200,canvasW+200);
        obj.y=rand(-200,canvasH+200);
    }
    while(!obj.dx || !obj.dy)
    {
        obj.dx=rand(-10,10);
        obj.dy=rand(-10,10);
    } 
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