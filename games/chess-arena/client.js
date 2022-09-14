"use strict";

const chars = {}

chars[PAWN] = "♟";
chars[PAWN|WHITE] = "♙";
chars[KING] = "♚"
chars[KING|WHITE] = "♔";
chars[KNIGHT] = "♞";
chars[KNIGHT|WHITE] = "♘";
chars[ROOK] = "♜";
chars[ROOK|WHITE] = "♖";
chars[BISHOP] = "♝";
chars[BISHOP|WHITE] = "♗";
chars[QUEEN] = "♛";
chars[QUEEN|WHITE] = "♕";
chars[0] = "&nbsp;";

const clks = ["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛"];


let gId = (e)=>document.getElementById(e+"");

let div = gId("m");
let inf = gId("i");
let clk = gId("clk");

let prompt = gId("p");
let i,j,t="";
let selected;
let sck;
let W = [];
let U,pseudo,user = {};
let ofT = 0;
let cl;
let WIN =0;

let clkFn = ()=>{
    clk.textContent = clks[0];
    clks.push(clks.shift());
    if(user.nextM && user.nextM<Date.now()+ofT) {
        display();
        user.nextM = 0;
    }
}
setInterval(clkFn,500);

for(i=0;i<8;i++) {
    t+="<p>";
    for(j=0;j<8;j++) {
        t += '<span id="'+(1+j+20+i*10)+'" class="c"> </span>';
    }
    t+="</p>";
}

div.innerHTML = t;

let display = (t,i,c,cc)=>{
    rClass('s');
    rClass('f');

    for(i=0;i<B.length;i++) {
        c = B[i];
        if(c||c===0) gId(i).innerHTML = chars[c&~NO_MOVE_OR_PROMOTED];
    }

    if(user.c) {
        c = gId(user.c);
        c.classList.add('f');
        c.appendChild(clk);
        if(user.nextM>Date.now()+ofT) {
            rClass('h');
        } else {
            clk.classList.add('h');
            cc = getM(user.c);
            for (let i=0;i<cc.length;i++) {
                gId(cc[i]).classList.add("s");
            }
        }
        
    } else if(user.p) {
        for(i=0;i<startB.length;i++) {
            c = startB[i];
            if(c==user.p && (B[i]===0 || B[i]&WHITE ^ user.p&WHITE)) gId(i).classList.add('s');
        }
    }
}

let form = (txt)=>{
    inf.innerHTML = (txt||'')+'<p>CHESS ARENA</p><p>Each player move one piece. There is no turn, it\'s realtime!</p><p>BUT you have to wait until each move, few time for pawns, more time for rooks, bishops and knights, even more time for queens.</p><p>Coil members have to wait for half a second less. It\'s not much, but it can be decisive! </p><label>Choose a name : </label> <input type="text" id="pseudo" maxlength="8">'
    let p = gId("pseudo");
    p.addEventListener("keydown",(e,n)=>{
        n = p.value.trim();
        if(e.key=="Enter") {
            sck.emit("name", n);
        }
    });
}

let iOn = ()=>{
    inf.style.visibility = "";
}

let iOff = ()=>{
    inf.style.visibility = "hidden";
}

let rClass=(c)=>{
    [...document.querySelectorAll('.'+c)].map(x => x.classList.remove(c));
}


window.addEventListener("load", 
    ()=> {
        sck = io();

        div.onclick = (e)=>{
            let t = e.target;
            if(t.classList.contains("s")){
                //setM(selected, parseInt(t.id));
                //display();
                sck.emit("move",parseInt(t.id))
                return;
            }
        
            // display();
            // selected = parseInt(t.id);
            // let cc = getM(t.id);
            // for (let i=0;i<cc.length;i++) {
            //     gId(cc[i]).classList.add("s")
            // }
        }

        sck.on("name", (n) => {
            pseudo = n;
        });

        sck.on("board", (b) => {
            B = b.B;
            W = b.W;

            if(b.T) ofT = Date.now() - b.T;

            display();
        });

        sck.on("users", (u,i) => {
            U = u;

            for(i=0;i<U.length;i++) if(U[i].n==pseudo) user = U[i];

            display();
        });

        sck.on("msg", (m,p) => {
            p = document.createElement("p");
            p.textContent = m;
            prompt.appendChild(p);
        });

        sck.on("choose", (_cl)=>{
            cl = _cl;
            selPiece();
        });

        sck.on("promote", (_cl)=>{
            selPiece(1);
        });

        sck.on("win",(m)=>{
            iOn();
            inf.innerHTML = "<p>"+m+"</p>";
            inf.onclick = ()=>{selPiece(0,WIN);};
        });

        sck.on("new",()=>{
            WIN =0;
        })

        if (document.monetization) {
            document.monetization.addEventListener('monetizationstart',()=>{ sck.emit("monetization"); });
        }

        sck.on("disconnect",()=>{
            form("<p>Oh no, you have been disconnected!</p>");
        })

        display();
        form();

}, false);

let selPiece = (pr,w,ps,i,p,t,l)=>{
    iOn();
    t = "<p>"+(pr?'Promotion':"You are "+(cl?  "WHITE" : "BLACK"))+', choose a piece :</p><p id="choose">';

    ps = getFreeP(cl);
    if(pr||w){
        ps = Object.assign({},PIECES);
        if(pr) ps[PAWN] = 0;
    }
    ps[KING] =0;

    for (i in ps) {
        if(ps[i]) {
            t += '<span id="'+i+'"'+(pr?' data-pr="1"':'')+'>'+chars[i|cl]+"</span>";
        }
    }

    inf.innerHTML = t+'</p>';

    inf.onclick=(e,t)=>{
        t = e.target;
        if(t.tagName =="SPAN") {
            if('pr' in t.dataset) sck.emit("promote",parseInt(t.id));
            else sck.emit("piece",parseInt(t.id));

            iOff();
            inf.onclick = ()=>{};
        }
    }
}