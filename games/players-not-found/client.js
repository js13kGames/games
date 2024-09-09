"use strict";

const MENU =0;
const HIDING = 1;
const CHASING = 2;
const SCORE = 3;

const waitDuration = 1000*20;

let socket; //Socket.IO client
let gMap=[];
let players=[];
let deadPlayers=[];
let id;
let sprites=[];
let outlineSprites = [];
let cGame,ctx,tintC,tintCtx,nIn,cBtn,hBtn,sBtn,eMsg,iMsg,sDiv,cDiv,cIn,mX,mY,state=MENU;
let cTarget,ctxTarget;
let speed =5;
let animLastFrame= 0;
let animDurFrame = 75;
let outlineC = "#eee";
let ctd;
let txtToDraw;
const TargetRadius =10;
let hats = [];
let waitTimeout;
let chatMsgs=[];

let keys={};
onkeydown=onkeyup=function(e){
    keys[e.which] = e.type[5];
}


function loadSprites(i) {
    let ss = getE("i"), c,cO,c2,c3;
    for (i=0;i<spriteStartID+spriteColors.length+1;i++) {
        c = can(SpriteW,SpriteH);
        c.ctx.drawImage(ss, SpriteW*i,0,SpriteW,SpriteH,0,0,SpriteW,SpriteH);
        cO = can(SpriteW,SpriteH);

        //outlines
        cO.ctx.drawImage(c.c,-1,0);cO.ctx.drawImage(c.c,1,0);cO.ctx.drawImage(c.c,0,-1);
        cO.ctx.globalCompositeOperation = "destination-out";
        cO.ctx.drawImage(c.c,0,0);

        sprites.push(c.c);
        outlineSprites.push(cO.c);
    }
    document.body.removeChild(ss);

    // hats
    cO.ctx.globalCompositeOperation = "source-atop";
    cO.ctx.fillStyle=outlineC;
    cO.ctx.fillRect(0,0,SpriteW,SpriteH);
    for (i=0;i<4;i++) {
        c2 = can(SpriteW,SpriteH);
        c2.ctx.fillStyle = "#"+spriteColors[i];
        c2.ctx.fillRect(0,0,SpriteW,SpriteH/4);
        c2.ctx.globalCompositeOperation = "destination-in";
        c2.ctx.drawImage(c.c, 0,SpriteH/4*i,SpriteW,SpriteH/4,0,0,SpriteW,SpriteH/4);

        c3 = can(SpriteW,SpriteH);
        c3.ctx.drawImage(cO.c, 0,SpriteH/4*i,SpriteW,SpriteH/4,0,0,SpriteW,SpriteH/4);

        hats.push([c2.c,c3.c]);
    }

    c = can(SpriteW,SpriteH);
    tintC = c.c;
    tintCtx = c.ctx;
}

function bind() {

    socket.on("map", (m,n) => {
        if(state==MENU && n) return;
        gMap = m;
        getE("m").style.display = "none";
        setState(HIDING);
        if(n) info("New map!<br>you have 10 seconds to hide!");
        anim();
    });

    socket.on("newMap10", (m) => {
        info("New map in 10 seconds!");
    });

    socket.on("player", function (p) {
        console.log("player",p);
        players = [p];
        nIn.style.color = p.c;
        id = p.id;
        if(state!=MENU) {
            setState(MENU);
            info("You have been disconnected");
        }
        draw();
    });

    socket.on("players", function(ps,oldP,p){
        oldP = getP();
        players = ps.filter(function(el){return el.alive||el.id==id});
        deadPlayers = ps.filter(function(el){return !el.alive&&el.id!=id});
        p = getP();
        p.x = oldP.x;
        p.y = oldP.y;
        sortP();
        if(state==SCORE) displayScore();

        if(waitTimeout && (players.length+deadPlayers.length)>1) {
            clearTimeout(waitTimeout);
            waitTimeout = null;
        }
    });

    socket.on("chasing", function(p){
        info('You caught <span style="color:'+p.c+'">'+p.n+"</span>");
        //setState(SCORE);
    });

    socket.on("chased", function(p){
        info('You have been caught by <span style="color:'+p.c+'">'+p.n+"</span>");
        setState(SCORE);
    });

    socket.on("msg", (msg,el) => {
        el = document.createElement("div");
        el.innerHTML = msg;
        cDiv.append(el);
        chatMsgs.push(el);
        if(chatMsgs.length>4) {
            cDiv.removeChild(chatMsgs.shift());
        }
    });

    socket.on("end", function () {
        
    });

    socket.on("connect", function () {
        
    });

    socket.on("disconnect", function () {
        console.log("Connection lost!");
    });

    socket.on("error", function () {
        console.log("Connection error!");
    });

    cBtn.onclick = function() {
        socket.emit("color");
    };

    hBtn.onclick = function() {
        if(document.monetization && document.monetization.state === 'started') {
            let p = getP();
            p.hat = (p.hat+1)%(hats.length+1);
            draw();
            socket.emit("hat",p.hat);
        }
        else eMsg.textContent = "Only the coil members have access to the great camouflage hats...";
    };

    sBtn.onclick = function() {
        if (nIn.value.trim()) socket.emit("name",nIn.value.trim(),getP().hat);
        else eMsg.textContent = "You have to choose a name !";
    }

    cGame.onmousemove = function(e){
        mX = (e.clientX -cGame.offsetLeft+cGame.offsetWidth/2)/cGame.offsetWidth*MapW;
        mY = (e.clientY - cGame.offsetTop+cGame.offsetHeight/2)/cGame.offsetHeight*MapH;

    };
    cGame.onclick = chase;

    cIn.onkeydown = function(e,p) {
        if(e.which==13 && cIn.value.trim()) {
            p = getP()||{c:"black"};
            if(!p.n) p.n = nIn.value.trim() || "unknown";

            console.log({m:cIn.value.trim(),c:p.c,n:p.n});
            socket.emit("msg",{m:cIn.value.trim(),c:p.c,n:p.n});
            cIn.value = "";
        }
    }
}


function init(c) {
    nIn = getE("n");
    cBtn = getE("c");
    hBtn = getE("h");
    sBtn = getE("s");
    eMsg = getE("e");
    iMsg = getE("inf");
    sDiv = getE("score");
    cDiv = getE("chat");
    cIn = getE("chatI");
    socket = io({ upgrade: false, transports: ["websocket"] });
    loadSprites();
    
    c = can(MapW,MapH);
    cGame = c.c;
    document.body.append(cGame);
    ctx = c.ctx;
    ctx.font = '36px Courier';
    ctx.lineWidth = 2;
    ctx.fillStyle = ctx.strokeStyle = outlineC;
    

    c = can(MapW,MapH);
    cTarget = c.c;
    ctxTarget = c.ctx;
    bind();
}

function setState(st) {
    state = st;
    if(st==MENU) {
        getE("m").style.display = "block";
        gMap = [];
    }
    if(st==HIDING) {
        info("you have 10 seconds to hide!<br>(keyboard arrows)");
        ctd = Date.now();
    }
    if(st==CHASING) {
        info("Find the others before they find you!<br>(mouse)");
    } 
    
    if(st == SCORE) displayScore();
    else sDiv.innerHTML = "";
}

function getE(n){
    return document.getElementById(n);
}

function can(w,h,c,ctx) {
    c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return {c:c,ctx:ctx};
}

function draw(objs,pId,p,pl) {
    ctx.clearRect(0,0,MapW,MapH);
    ctxTarget.clearRect(0,0,MapW,MapH);

    pId=0;
    pl = getP();
    drawObj(pl,0,1); // player must be behind other on target

    gMap.forEach(function(e){
        while(p=players[pId]) {
            if(p.y<e.y){
                pId++;
                if(state==HIDING && p!=pl) continue;
                drawObj(p,0,p!=pl);
                drawObj(p,1);
            } else break;
        }
        drawObj(e);drawObj(e,1);
    });

    while(p=players[pId]) {
        pId++;
        if(state==HIDING && p!=pl) continue;
        drawObj(p,0,p!=pl);
        drawObj(p,1);
    }

    if(state == HIDING) {
        // ctx.globalAlpha = 0.1;
        // drawObj(pl);
        ctx.globalAlpha = 1;
        drawObj(pl,1);
        //ctx.drawImage(outlineSprites[p.s],0,0,SpriteW,SpriteH,p.x-p.w/2,p.y-p.h,p.w,p.h);
    }

    if(txtToDraw) ctx.fillText(txtToDraw, 10, 36);

}

function drawObj(o,ol,t,ofs,s) {
    if(!o)return;
    tintCtx.globalCompositeOperation = "source-over";
    tintCtx.fillStyle = (ol)? outlineC : o.c;
    tintCtx.fillRect(0,0,SpriteW,SpriteH);

    tintCtx.globalCompositeOperation = "destination-in";
    tintCtx.drawImage((ol)? outlineSprites[o.s] : sprites[o.s],0,0);

    if(o.hat) {
        ofs = 9+([3,5,7].indexOf(o.s)!=-1);
        s = hats[o.hat-1][(ol)?1:0]
        ctx.drawImage(s,0,0,SpriteW,SpriteH,o.x-o.w/2,o.y-o.h-ofs,o.w,o.h);
        ctxTarget.drawImage(s,0,0,SpriteW,SpriteH,o.x-o.w/2,o.y-o.h-ofs,o.w,o.h);
        tintCtx.globalCompositeOperation = "destination-out";
        tintCtx.drawImage(hats[o.hat-1][0],0,-ofs);
    }

    if(o.invert) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(tintC,0,0,SpriteW,SpriteH,-o.x-o.w/2,o.y-o.h,o.w,o.h);
        ctx.restore();
    } else ctx.drawImage(tintC,0,0,SpriteW,SpriteH,o.x-o.w/2,o.y-o.h,o.w,o.h);
    if(t) ctxTarget.drawImage(tintC,0,0,SpriteW,SpriteH,o.x-o.w/2,o.y-o.h,o.w,o.h);
}


function anim(p,newS) {
    if(state== MENU) {
        p= getP();
        if(p) drawObj(p);
        return;
    }
    if(state==HIDING) {
        p = getP();
        p.invert = false;
        if(keys[37]) {
            p.x -= speed;
            newS = (p.s+1)%4||1;
            p.invert = true;
        }
        else if(keys[39]) {
            p.x += speed;
            newS = (p.s+1)%4||1;
            
        }
        else if(keys[40]) {
            p.y += speed;
            newS = 4+(p.s+1)%4;
            sortP();
        }
        else if(keys[38]) {
            p.y -= speed;
            newS = 4+(p.s+1)%4;
            sortP();
        } else newS = 0;

        if(newS==0) {
            p.s =0;
            animLastFrame=0;
        } else if(Date.now()>animLastFrame+animDurFrame) {
            p.s = newS;
            animLastFrame=Date.now();
        }

        txtToDraw = 10-((Date.now()-ctd)/1000)|0;
        
        if(txtToDraw<1) {
            socket.emit("hiding",p);
            setState(CHASING);
            p.s = 0;
            if((players.length+deadPlayers.length)<2) waitTimeout = setTimeout(nobody,waitDuration);
        }
    }

    draw();

    if(state==CHASING) {
        ctxTarget.globalCompositeOperation = "destination-in";

        ctxTarget.beginPath();
        ctxTarget.arc(mX, mY, TargetRadius, 0, 2*Math.PI);
        ctxTarget.fill();

        

        ctxTarget.globalCompositeOperation = "source-over";

        ctx.drawImage(cTarget,0,0);
        ctx.beginPath();
        ctx.arc(mX, mY, TargetRadius, 0, 2*Math.PI);
        ctx.moveTo(mX-TargetRadius*1.5,mY);
        ctx.lineTo(mX-TargetRadius*0.5,mY);
        ctx.moveTo(mX+TargetRadius*1.5,mY);
        ctx.lineTo(mX+TargetRadius*0.5,mY);
        ctx.moveTo(mX,mY-TargetRadius*1.5);
        ctx.lineTo(mX,mY-TargetRadius*0.5);
        ctx.moveTo(mX,mY+TargetRadius*1.5);
        ctx.lineTo(mX,mY+TargetRadius*0.5);
        ctx.stroke();
        
        txtToDraw = (players.length-1)+" left";
    }

    requestAnimationFrame(anim);

}

function getP() {
    for(var i=0;i<players.length;i++) {
        if(players[i].id == id) return players[i];  
    }

    for(var i=0;i<deadPlayers.length;i++) {
        if(deadPlayers[i].id == id) return deadPlayers[i];  
    }
}

function chase (p,c) {
    if(state==CHASING) {
        let pixData = ctxTarget.getImageData(mX, mY, 1, 1).data;
        console.log(pixData);
        for (var i=0;i<players.length;i++) {
            p=players[i];
            c=p.cs;
            if(c[0]==pixData[0]&&c[1]==pixData[1]&&c[2]==pixData[2]) {
                if(p.id==id) info("It's You!");
                else socket.emit("chasing",p);
            }
        }
    }
}

function nobody(){
    waitTimeout = null;
    if((players.length+deadPlayers.length)<2 ) info("Oh no!<br>It seems that there's no one to play with you, even though it's a multiplayer game!<br>Invite your friends!")
}

function displayScore(r,s,d){
    d ="</div><div>";
    r="<div>Name"+d+'Win'+d+'Lose'+d+'Score'+'</div>'+"<div>"+d+d+d+'</div>';
    s = players.concat(deadPlayers);
    s.sort(function(e1,e2){
        return (e2.score-e2.fail)-(e1.score-e1.fail);
    })

    s.forEach(function(el){
        if(el.n) r+= '<div><span style="color:'+el.c+'">'+el.n+'</span>'+d+el.score+d+el.fail+d+(el.score-el.fail)+'</div>';
    });

    sDiv.innerHTML = r+"<div>"+d+d+d+'</div><button onclick="setState(HIDING)" style="grid-column-start: 1; grid-column-end: 5;width:100%;">Restart</button>';
}

function sortP() {
    players.sort(function(e1,e2){return e1.y-e2.y});
}

function info(t) {
    iMsg.innerHTML = t;
    document.body.removeChild(iMsg);
    document.body.append(iMsg);
}
window.addEventListener("load", init, false);
