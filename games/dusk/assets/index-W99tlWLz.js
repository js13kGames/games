(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function i(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=i(t);fetch(t.href,o)}})();const Me=(e,n)=>{let i=structuredClone(e),s=!1;const t=()=>structuredClone(i),o=l=>{n(l),i=l};return s===!1&&(n(e),s=!0),{get:t,set:o}},L=e=>new Promise(n=>setTimeout(n,e)),pe=e=>{for(let n=e.length-1;n>0;n--){const i=Math.floor(Math.random()*(n+1));[e[n],e[i]]=[e[i],e[n]]}return e},fe=e=>e[Math.floor(Math.random()*e.length)],Se=e=>Math.floor(Math.random()*e)+1,xe=(e,n,i={})=>{var v,P;const s=e.getAttribute("d");if(!s)throw new Error(`Element "${id}" has no 'd' attribute`);const t=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi,o=(v=s.match(t))==null?void 0:v.map(Number),l=(P=n.match(t))==null?void 0:P.map(Number);if(!o||!l||o.length!==l.length)throw new Error("Start and target paths must have identical command structure and number count.");const c=i.easing||(x=>.5-.5*Math.cos(Math.PI*x)),f=Math.max(1,i.duration||800);return new Promise(x=>{const M=(T,A,I)=>T+(A-T)*I;let E;function R(T){E??(E=T);const A=Math.min(1,(T-E)/f),I=c(A),d=o.map((h,z)=>M(h,l[z],I)),g=s.replace(t,()=>{const h=d.shift();return Math.abs(h)<1e-6?"0":h.toFixed(3).replace(/\.?0+$/,"")});e.setAttribute("d",g),A<1?requestAnimationFrame(R):x()}requestAnimationFrame(R)})},ce=(e,n)=>{const i=document.querySelectorAll(".upper-brow"),s=e?600:600+Se(200),t=`m-6,0l649,0l0,${n||s}c-119.17,-95.85 -41.92,-306.25 -163.12,-392.89c-104.61,-77.09 -381.27,-13.02 -485.88,-90.11z`;for(let o=0;o<i.length;o++)xe(i[o],t,{duration:200+s*3})},ye=e=>{const n=document.querySelectorAll(".iris"),i=e?"m345.22,45c-188.76,49.98 -199.63,117.3 -216.1,197.88c2.69,140.76 156.4,202.98 220.35,210.12c2.13,0 200.44,-22.44 196.5,-210.12c-5.14,-149.94 -200.76,-197.88 -200.76,-197.88z":"m330.55,45c-23.96,49.98 -25.34,117.3 -27.43,197.88c0.34,140.76 19.85,202.98 27.97,210.12c0.27,0 25.44,-22.44 24.94,-210.12c-0.65,-149.94 -25.48,-197.88 -25.48,-197.88z";for(let s=0;s<n.length;s++)setTimeout(()=>{xe(n[s],i,{duration:500})},2200)},m=(e,n)=>e.filter(i=>i.zone===n).sort((i,s)=>i.zoneOrder-s.zoneOrder).reverse(),G=(e,{size:n=180,cell:i=14,jitter:s=.85}={})=>{const t=n,o=d=>Math.max(0,Math.min(t-1,d)),l=document.createElement("canvas");l.width=l.height=t;const c=l.getContext("2d",{willReadFrequently:!0});function f(d,g){c.clearRect(0,0,t,t);const h=window.devicePixelRatio||1;(c.canvas.width!==t*h||c.canvas.height!==t*h)&&(c.canvas.width=t*h,c.canvas.height=t*h,c.canvas.style.width=t+"px",c.canvas.style.height=t+"px"),c.setTransform(h,0,0,h,0,0),c.font=`${t}px ${g}`,c.textAlign="center",c.textBaseline="alphabetic",c.fillStyle="#000";const z=c.measureText(d);let O=z.actualBoundingBoxAscent,C=z.actualBoundingBoxDescent;O>0||C>0||(O=z.fontBoundingBoxAscent??0,C=z.fontBoundingBoxDescent??0),O>0||C>0||(O=.8*t,C=.2*t);const U=t/2,Q=t/2+(O-C)/2;c.fillText(d,U,Q)}function v(){const d=c.getImageData(0,0,t,t).data;for(let g=3;g<d.length;g+=4)if(d[g]!==0)return!0;return!1}const P=['"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif','"Segoe UI Emoji","Noto Color Emoji","Apple Color Emoji",sans-serif',"sans-serif"];let x=!1,M=e;for(let d=0;d<3&&!x;d++)f(M,P[d]),x=v(),!x&&d===0&&!/\uFE0F/.test(M)&&(M=e+"️",d--);x||(c.clearRect(0,0,t,t),c.fillStyle="#000",c.fillRect(t,t,t,t));const E=[],R=i*s*.5;for(let d=0;d<=t;d+=i){const g=[];for(let h=0;h<=t;h+=i){const z=h>0&&h<t?(Math.random()*2-1)*R:0,O=d>0&&d<t?(Math.random()*2-1)*R:0;g.push([o(h+z),o(d+O)])}E.push(g)}const T=document.createElement("canvas");T.width=t,T.height=t+20;const A=T.getContext("2d");function I(d,g,h){const z=o((d[0]+g[0]+h[0])/3|0),O=o((d[1]+g[1]+h[1])/3|0),C=c.getImageData(z,O,1,1).data;C[3]<1||(A.beginPath(),A.moveTo(d[0],d[1]),A.lineTo(g[0],g[1]),A.lineTo(h[0],h[1]),A.closePath(),A.fillStyle=`rgba(${C[0]},${C[1]},${C[2]},${(C[3]/255).toFixed(3)})`,A.fill())}for(let d=0;d<E.length-1;d++)for(let g=0;g<E[d].length-1;g++){const h=E[d][g],z=E[d][g+1],O=E[d+1][g],C=E[d+1][g+1];Math.random()<.5?(I(h,z,C),I(h,C,O)):(I(h,z,O),I(z,C,O))}return T.toDataURL("image/png")},$=(e,...n)=>e.reduce((i,s,t)=>i+s+(n[t]??""),""),me=(e,n)=>e.map(n).join(""),N=(e,n,i)=>m(e,n).map(i).join(""),Ae=(e,n)=>{e.innerHTML=n()},le=["c","c","c","c","c","c","c","c","c","u","u","u","u","r"],Re=["rift","echo","omen"],se=["🦀","🔥","🥩","🧣"],ne=["🫐","🦋","🌀","❄️"],oe=["🪙","⚙️","🪞","📓"],ve=(e,n)=>{let i=oe[3];return e==="rift"&&(i=se[3]),e==="echo"&&(i=ne[3]),{name:`${String(e).charAt(0).toUpperCase()+String(e).slice(1)} Goal Card`,types:[e],zone:n+"Goal",abilityFunct:[],abilityRule:[`At the end of your turn if you have 7 or more other ${e} cards in your play area you win.`],cardArt:G(i,{size:100,cell:10})}},X={blank:{name:"Eclipse Void",types:["rift","echo","omen"],abilityFunct:[],abilityRule:[],cardArt:G("🎭",{size:100,cell:10})},cRift:{name:"Stellar Crypt",types:["rift"],abilityFunct:["floodOpponent$Time:2"],abilityRule:["Flood your opponent 2 times."],cardArt:G(se[0],{size:100,cell:10})},uRift:{name:"Grave Haunt",types:["rift"],abilityFunct:["floodOpponent$Time:3"],abilityRule:["Flood your opponent 3 times."],cardArt:G(se[1],{size:100,cell:10})},rRift:{name:"Chasm Infernal",types:["rift"],abilityFunct:["floodAllPlayers$Time:2"],abilityRule:["Flood all players 2 times."],cardArt:G(se[2],{size:100,cell:10})},cEcho:{name:"Ethereal Nebula",types:["echo"],abilityFunct:["return$Time:1"],abilityRule:["Return a card 1 time."],cardArt:G(ne[0],{size:100,cell:10})},uEcho:{name:"Cosmic Lunar",types:["echo"],abilityFunct:["returnAllExhaustedCards"],abilityRule:["Return all your exhuasted cards."],cardArt:G(ne[1],{size:100,cell:10})},rEcho:{name:"Umbral Aster",types:["echo"],abilityFunct:["unexhaustAllYourExhaustedCards"],abilityRule:["Unexhaust all your exhuasted cards."],cardArt:G(ne[2],{size:100,cell:10})},cOmen:{name:"Orbit Crypt",types:["omen"],abilityFunct:["remianingCardsInPileGoToYourPlayArea"],abilityRule:["The remaining cards in this pile go to your play area."],cardArt:G(oe[0],{size:100,cell:10})},uOmen:{name:"Nebula Specter",types:["omen"],abilityFunct:["exhaust$OfYourOpponentsUnexhaustedCardsAtRandom:2"],abilityRule:["Exhaust 2 random unexhausted cards in your opponents play area."],cardArt:G(oe[1],{size:100,cell:10})},rOmen:{name:"Shadow Singularity",types:["omen"],abilityFunct:["exhaust$OfYourOpponentsUnexhaustedCardsAtRandom:4"],abilityRule:["Exhaust 4 random unexhausted cards in your opponents play area."],cardArt:G(oe[2],{size:100,cell:10})}},ee=(e,n,i)=>({id:n,zoneOrder:0,zone:"deck",isSelected:!1,isActive:!1,isExhausted:!1,rarity:i,...e}),Ie=()=>{const e=[];for(let s=0;s<5;s++){const t=X.blank;e.push(ee(t,e.length+1,"U"))}const n=pe(Re);return e.push(ve(n[0],"player")),e.push(ve(n[1],"opponent")),le.forEach(s=>{const t=X[s+"Rift"];e.push(ee(t,e.length+1,s))}),le.forEach(s=>{const t=X[s+"Echo"];e.push(ee(t,e.length+1,s))}),le.forEach(s=>{const t=X[s+"Omen"];e.push(ee(t,e.length+1,s))}),pe(e).map((s,t)=>(s.zoneOrder=t,s))},$e=["deal","take","end"],Z=["deck","opponentPlay","opponentGoal","pile1","pile2","pile3"],H=["takeModal","playerPlay","active","playerGoal"],Fe=Ie(),Le=()=>new Promise(e=>{e({isIntroSkipped:!1,isUiHidden:!0,storyIndex:0,isStarted:!1,isPhaseButtonDisabled:!0,isPileToPlay:"deck",winner:void 0,activePlayer:"player",currentPhase:void 0,phases:$e,isModalOpen:!1,ui:{},cards:[...Fe],selectedPile:"pile1",pile1:[],pile2:[],pile3:[],player:{id:1,hand:[],play:[],isComputer:!1},opponent:{id:2,hand:[],play:[],isComputer:!0}})}),he=["","Well, well, well. Look what we have here?","A small flicker of light at dusk.","Delicious. I so rarely get guests","I so rarely get any guests... guests.","It's all so terrIBLY BORING I JUST WANT...","...I'm sorry I forget myself, forgot myself.","Welcome, you who stands at the edge twilight.","Come, sit with me and play a game.","It tastes like cards, and you wager yourself.","The night is almost here... you get the first play."],te=new Map,ae=new Map;function Ge({containerSelector:e=".card-container",faceUpClass:n="face-up",faceDownClass:i="face-down"}={}){return{startFlip(s){te.clear(),document.querySelectorAll("[data-flip]").forEach(t=>{const o=t.getAttribute("data-flip");if(!o)return;const l=t.getBoundingClientRect();te.set(o,l)})},endFlip(s=200,t){return new Promise(o=>{const l=[];document.querySelectorAll("[data-flip]").forEach(c=>{const f=c.getAttribute("data-flip");if(!f)return;const v=te.get(f);if(!v)return;const P=c.getBoundingClientRect(),x=v.left-P.left,M=v.top-P.top;(x||M)&&(c.style.transform=`translate(${x}px, ${M}px)`,l.push(c));const E=t.cards.find(I=>I.id===parseInt(f,10)),R=E==null?void 0:E.zone,T=ae.get(f),A=c.querySelector(e);A&&(Z.includes(T)&&H.includes(R)?(A.classList.remove(i),A.classList.add(n)):H.includes(T)&&Z.includes(R)&&(A.classList.remove(n),A.classList.add(i))),ae.set(f,R)}),document.querySelectorAll("[data-face]").forEach(c=>{var x;const f=c.getAttribute("data-face");if(!f)return;const v=(x=t.cards.find(M=>M.id===parseInt(f,10)))==null?void 0:x.zone,P=ae.get(f);P&&(v!==P&&(Z.includes(P)&&H.includes(v)&&(c.classList.remove(i),c.classList.add(n)),H.includes(P)&&Z.includes(v)&&(c.classList.remove(n),c.classList.add(i))),ae.set(f,v))}),requestAnimationFrame(()=>{l.forEach(c=>{c.style.transition=`transform ${s}ms ease`,c.style.transform=""}),setTimeout(()=>{l.forEach(c=>{c.style.transition=""}),te.clear(),o()},s)})})}}}const je=G("🌌",{size:500,cell:15}),ge=new Map;function D(e,n,i=!1,s){var v,P,x;let t=e.types[0];(e.zone==="playerGoal"||e.zone==="opponentGoal"||e.types.length>1)&&(t="multi");const o=ge.get(e.id),l=e.zone;let c="face-down";o&&l&&(H.includes(o)&&H.includes(l)?c="face-up":Z.includes(o)&&Z.includes(l)&&(c="face-down")),i===!0&&(c="face-up"),ge.set(e.id,l);const f=e!=null&&e.rarity?((v=e==null?void 0:e.rarity)==null?void 0:v.toUpperCase())+" - ":"";return $`
    <div class="card-wrapper ${e.zone==="active"?"active-card":""} ${e.isExhausted?"played":""}" ${n?"":"data-flip="+e.id}>
      <div class="card-container ${c}" data-face="${e.id}">
        <div class="card ${s?"pulse-border":""}">
          <div class="card-face front ${t}">
            <div class="card-inner-front">
              <div class="card-name">${e.name}</div>
              <img class="card-image" src="${e.cardArt}">
              ${e.isExhausted?"":$`<div class="card-type">${f+((P=e.types)==null?void 0:P.join(" - "))}</div>`}
              <div class="card-rules">${(x=e.abilityRule)==null?void 0:x.join(`
`)}</div>
            </div>

          </div>

          <div class="card-face back">
          <img class="back-pattern" src="${je}" />
          </div>
        </div>
      </div>
    </div>
  `}function qe(e){return $`
        <div class="dialog">
            <div class="game-rules-wrapper">
                <div class="flex-col">
                    <div>Quick Rules</div>
                        <div>
                        <div>Win: End your turn with Goal card's goal met.</div>
                        <div>Lose: End your turn with 15+ cards in your Play Area.</div>
                        <div>(Win checked before Loss)</div>
                        </div>

                        <div>
                        Setup: Shuffle deck. Each player takes 1 secret Goal Card.
                        </div>

                        <div>
                            Turn:
                            <ol>
                                <li>Deal 1 card to each Pile.</li>
                                <li>Choose 1 Pile. Order its cards.</li>
                                <li>Resolve all cards → bottom of deck (unless stated).</li>
                                <li>Check Goals (Win → Lose).</li>
                            </ol>
                        </div>

                        <div>
                            Terms:
                            <ul>
                                <li>Play Area - hidden set of drawn cards.</li>
                                <li>Exhausted - counts for Loss, not Goal</li>
                                <li>Flood - Opponent draws 1 into Play Area.</li>
                                <li>Return - Send back exhausted first, then oldest</li>
                            </ul>
                        </div>
                        <div>m Key: Turn on music</div>
                    <div><button class="jagged" onclick="methods.cancelPlayModal()">Start the Game</button></div>
                    <div><button class="jagged" onclick="methods.skipIntro()">Start & Skip Intro</button></div>
                </div>
            </div>
        </div>
  `}function Be(e){return $`
        <div class="dialog">
            <div>
                <div>Select this pile of cards by clicking the take button. Cards resolve in numerical order.</div>
                <div>Played cards go to the bottom of the deck after resolving.</div>
            </div>
            <div class="flex-column">
                <div class="flex-cards">
                ${N(e.cards,"takeModal",(n,i)=>{var s;return $`
                        <div>
                            <div class="deck-card-wrapper">${D(n,!0,!1,!1)}</div>
                        ${((s=m(e.cards,"takeModal"))==null?void 0:s.length)>1?$`<div class="number-buttons-wrapper"><button class="jagged" onclick="methods.orderCards(${n.id}, false)">⬅</button><div class="number">${i+1}</div><button class="jagged" onclick="methods.orderCards(${n.id}, true)">⮕</button></div>`:""}
                        </div>`})}
                </div>

            </div>
            <div class="flex-row dialog-ui">
                <button class="jagged" onclick="methods.cancelTakeModal()">Close</button>
                <button class="jagged" onclick="methods.submitTakeModal()">Play & Pass</button>
            </div>
        </div>
  `}function Ne(e){const n=$e[e.currentPhase],s=(e.currentPhase?["play","end"]:["take","end"]).includes(n)?e.activePlayer==="player"?"opponent":"player":e.activePlayer;return $`
    <div class="${e.isStarted?"hidden":""}" id="story-wrapper">
        ${me(he,(t,o)=>o>e.storyIndex?null:o===e.storyIndex?$`<div class="last-line">${t}</div>`:$`<div>${t}</div>`)}
    </div>
    <div class="${e.isStarted?"":"ui-wrapper"}">
        <div>
            <div class="phases-wrapper ${s!=="player"?"void-phase jagged":""}">
                ${s==="player"?"YOUR TURN: ":"VOID'S TURN: "}
                ${me(e.phases,(t,o)=>$`<div class="phase-wrapper ${e.currentPhase===o?"active":""}">${t.toUpperCase()}</div>`)}
            </div>
            <div class="game-area-wrapper">
                <div class="deck-dealt-wrapper">
                    <div class="deck-wrapper">${N(e.cards,"deck",(t,o)=>$`<div class="deck-card-wrapper" style="${"bottom:"+Math.floor(o/3)+"px;right:"+Math.floor(o/6)+"px"}">${D(t,!1,!1,!1)}</div>`)}</div>
                    <div class="pile-wrapper pile-1-wrapper">${N(e.cards,"pile1",(t,o)=>$`<div onclick="methods.viewPile('pile1')" class="pile" style="${"bottom:"+o*2+"px;right:"+o*2+"px"}">${D(t,!1,!1,!0)}</div>`)}</div>
                    <div class="pile-wrapper pile-2-wrapper">${N(e.cards,"pile2",(t,o)=>$`<div onclick="methods.viewPile('pile2')" class="pile" style="${"bottom:"+o*2+"px;right:"+o*2+"px"}">${D(t,!1,!1,!0)}</div>`)}</div>
                    <div class="pile-wrapper pile-3-wrapper">${N(e.cards,"pile3",(t,o)=>$`<div onclick="methods.viewPile('pile3')" class="pile" style="${"bottom:"+o*2+"px;right:"+o*2+"px"}">${D(t,!1,!1,!0)}</div>`)}</div>
                </div>
                
            </div>

        </div>
        <div class="flex-row-top">
            <div class="play-area-wrapper area-wrappers play-area-min-height">
                <div class="play-area-header">⚪ YOUR PLAY AREA (${m(e.cards,"playerPlay").length})</div>
                <div class="flex-cards">
                ${N(e.cards,"playerGoal",(t,o)=>$`<div>${D(t,!0,!0)}</div>`)}
                ${N(e.cards,"playerPlay",(t,o)=>$`<div>${D(t,!1,!1,!1)}</div>`)}
                </div>
            </div>

            <div class="play-area-wrapper area-wrappers play-area-min-height">
                <div class="play-area-header">⚫ THE VOIDS'S PLAY AREA (${m(e.cards,"opponentPlay").length})</div>
                <div class="flex-cards">
                    ${N(e.cards,"opponentGoal",(t,o)=>$`<div>${D(t,!0,!!e.winner)}</div>`)}
                    ${N(e.cards,"opponentPlay",(t,o)=>$`<div class="pile">${D(t,!1,!!e.winner,!1)}</div>`)}
                </div>
            </div>    
        
        </div>
        </div>  
        <div class="dialog-wrapper ${e.isModalOpen||e.storyIndex===0?"":"hidden"}">
            ${e.storyIndex===0?qe():null}
            ${e.currentPhase===1&&e.isStarted===!0?Be(e):null}
        </div>
        <div class="active-card-wrapper flex-row">
            ${N(e.cards,"active",(t,o)=>$`<div class="pile">${D(t,!1,!1,!1)}</div>`)}
        </div>
 
  `}const De=G("😶",{size:500,cell:20}),we=e=>$`
        <div class="eye-wrapper" ${e?"style='transform: scaleX(-1)'":""}>
            <img class="eye-background" src="${De}">
            <svg class="eye-layer" viewBox="0 0 622 500" preserveAspectRatio="xMaxYMin">
                <g class="layer">
                <path class="upper-brow" d="m-6,0l649,0l0,890c-119.17,-95.85 -41.92,-306.25 -163.12,-392.89c-104.61,-77.09 -381.27,-13.02 -485.88,-90.11z" fill="#000000" id="svg_16" stroke="#000000" stroke-width="0"/>
                <path d="m-3,-1c0.68,161 1.35,322 2.03,483l642.97,0c-94.8,-70.22 -336.89,9.59 -431.69,-60.63c-120.2,-90.78 -93.11,-331.59 -213.31,-422.37z" fill="#000000" id="svg_17" stroke="#000000" stroke-width="0"/>
                <path class="iris" d="m330.55,45c-23.96,49.98 -25.34,117.3 -27.43,197.88c0.34,140.76 19.85,202.98 27.97,210.12c0.27,0 25.44,-22.44 24.94,-210.12c-0.65,-149.94 -25.48,-197.88 -25.48,-197.88z" fill="#000000" stroke="#000000" stroke-width="0"/>
                </g>
            </svg>
        </div>
    `,Ye=()=>$`
        <div class="eyes-wrapper">
            ${we(!1)}
            ${we(!0)}
        </div>
    `,Ce=(e,n)=>{if(typeof n!="number"||n<=0){const i=e.get(),s=i.activePlayer==="player"?"player":"opponent";let t=0;for(let o=0;o<i[s].play.length;o++)i[s].play[o].types.includes(n)&&i[s].play[o].isExhausted===!1&&t++;return t}return n},Ee=async(e,n)=>{for(let i=0;i<e&&await n(i)!==!1;i++);};async function de(e,n,i){const s=Ce(e,i);await Ee(s,async()=>{const t=e.get(),o=m(t.cards,"deck"),l=o[o.length-1];if(!l)return!1;l.zone=`${n}Play`,e.set(t),await L(1e3)})}async function Ue(e,n,i){const s=Ce(e,i);await Ee(s,async()=>{const t=e.get(),o=`${n}Play`,l=m(t.cards,o);if(!l.length)return!1;const f=l.find(P=>P.isExhausted)??l[l.length-1];if(!f||f.zone==="playerGoal"||f.zone==="opponentGoal")return!1;const v=m(t.cards,"deck");f.zone="deck",f.zoneOrder=v[v.length-1].zoneOrder+1,f.isExhausted=!1,e.set(t),await L(1e3)})}const be={floodOpponent$Time:async(e,n,i)=>{await de(e,n==="player"?"opponent":"player",i)},floodAllPlayers$Time:async(e,n,i)=>{await de(e,"player",i),await de(e,"opponent",i)},return$Time:async(e,n,i)=>{await Ue(e,n,i)},returnAllExhaustedCards:async(e,n,i)=>{await L(1e3);const s=e.get();let t=s.activePlayer==="player"?m(s.cards,"playerPlay"):m(s.cards,"opponentPlay");const o=m(s.cards,"deck");for(let l=0;l<t.length;l++){const c=t[l];c.isExhausted&&(c.zone=o,c.zoneOrder=o[o.length-1].zoneOrder+1)}e.set(s)},unexhaustAllYourExhaustedCards:async(e,n,i)=>{await L(1e3);const s=e.get();let t=s.activePlayer==="player"?m(s.cards,"playerPlay"):m(s.cards,"opponentPlay");for(let o=0;o<t.length;o++){const l=t[o];l.isExhausted&&(l.isExhausted=!1)}e.set(s)},remianingCardsInPileGoToYourPlayArea:async(e,n,i)=>{await L(1e3);const s=e.get();s.isPileToPlay="next",e.set(s)},exhaust$OfYourOpponentsUnexhaustedCardsAtRandom:async(e,n,i)=>{await L(1e3);const s=e.get();let o=s.activePlayer==="opponent"?m(s.cards,"playerPlay"):m(s.cards,"opponentPlay");const l=o.map(v=>v.id),c=pe(l);let f=0;for(let v=0;v<c.length;v++){const P=o.find(x=>x.id===c[v]);if(!P.isExhausted&&(P.zone!=="playerGoal"||P.zone!=="opponentGoal")&&(P.isExhausted=!0,f++),f>=i)break}e.set(s)}},Ve=(e,n,i)=>{const s=typeof n=="object"&&n?n:{wave:typeof n=="string"?n:"sine",musicLength:void 0},t=s.wave||"sine",o=s.musicLength??.1,l=s.transposeOctaves??-2,c=s.transposeSemitones??0,f=s.baseHz??440,v=s.baseCharCode??105,P=s.filterCutoff??450,x=s.filterQ??10,M=s.subLevel??.35,E=s.subOctaves??1,R=s.gain??.45,T=s.attack??.01,A=s.decay??.12,I=s.sustain??.2,d=s.release??.3,g=s.vibratoRate??5,h=s.vibratoDepth??12,z=s.delayTime??.23,O=s.delayFeedback??.33,C=s.delayWet??.25,U={5:.4,4:.3,3:.2,2:.1,1:.05},Q=[...Object.keys(U),"-"];window.AudioContext=window.AudioContext||window.webkitAudioContext;const a=new AudioContext,r=a.createGain();r.gain.value=.9,r.connect(a.destination);const u=a.createDelay(1.5);u.delayTime.value=z;const p=a.createGain();p.gain.value=O;const w=a.createGain();w.gain.value=C,u.connect(p),p.connect(u),u.connect(w),w.connect(r);for(let y=0;y<e.length;y++){const S=e[y],j=e[y+1],F=isNaN(j)?o:U[j];if(!S||Q.includes(S))continue;const b=a.currentTime+y*F+.3,k=b+F,q=e.charCodeAt(y)-v+l*12+c,B=f*Math.pow(2,q/12),V=a.createOscillator();V.type=t,V.frequency.setValueAtTime(B,b);const _=a.createOscillator();_.type=t==="square"?"sine":t;const Te=B/Math.pow(2,E);_.frequency.setValueAtTime(Te,b);const ie=a.createGain();ie.gain.value=M;const W=a.createBiquadFilter();W.type="lowpass",W.frequency.setValueAtTime(P,b),W.Q.setValueAtTime(x,b);const Y=a.createGain();if(Y.gain.setValueAtTime(1e-4,b),Y.gain.linearRampToValueAtTime(R,b+T),Y.gain.linearRampToValueAtTime(R*I,b+T+A),Y.gain.setTargetAtTime(1e-4,Math.max(b,k-d),.15),h>0){const J=a.createOscillator(),re=a.createGain();J.frequency.setValueAtTime(g,b);const ze=Oe=>Oe*(Math.pow(2,h/1200)-1);re.gain.value=ze(B),J.connect(re),re.connect(V.frequency),J.start(b),J.stop(k+.1)}V.connect(W),_.connect(ie),ie.connect(W),W.connect(Y),Y.connect(r),Y.connect(u),V.start(b),_.start(b),V.stop(k+.05),_.stop(k+.05)}},We=()=>{const e=["m5","k5","h5","o5","g5","k3","h3","m3","k2","h2","m4"],n=["-m5-k5-h5-m5-","-m5-k5-h5-k5-","-o5-m5-k5-h5-","-h5-g5-k5-h5--","-k3-h3-m5--k3-h3-m5--","-m5-m5-k5-h5-m5--","-a5-h5-g5-d5-c5-a5-a5-","-a5-h5-g5-d5-c5-k25-k25-","-o5-j5-k5-g5-h5-h5-c5-","-m5-g5-j5-c5-h3"];let i="";for(let s=0;s<200;s++){const t=Math.random()>.7?"---":"--",o=Math.random()>.9?fe(e):fe(n);i+=o+t}Ve(i,{wave:"sawtooth",musicLength:.4,transposeOctaves:-3,filterCutoff:320,filterQ:14,subLevel:.45,subOctaves:2,attack:.03,decay:.2,sustain:.35,release:.6,vibratoRate:4,vibratoDepth:14,delayTime:.38,delayFeedback:.38,delayWet:.22,gain:.2})},Pe=Ge();let ke=!1,K=0,ue=!1;const Ze=(e,n)=>n.length>1?e[n[0]][n[1]]:e[n[0]],He=document.querySelector("#app"),Qe=document.querySelector("#eyes"),_e=async e=>{Pe.startFlip(e),Ae(He,()=>Ne(e)),Pe.endFlip(500,e)};setTimeout(()=>{Ke()},200);async function Ke(){const e=()=>{K++},n=()=>{K=Math.max(0,K-1),K===0&&ue&&(ue=!1,x())},i=async()=>{if(K>0){ue=!0;return}await x()};if(ke)return;ke=!0;const s=await Le(),t=Me(s,_e);Je(),Ae(Qe,()=>Ye());const o=()=>{const a=t.get();return a.phases[a.currentPhase??0]},l=a=>o()===a,c=a=>{const r=t.get(),p=m(r.cards,"deck")[0].zoneOrder,w=r.cards.find(y=>y.id===a);if(r.isPileToPlay==="play"){const y=r.activePlayer==="player"?"playerPlay":"opponentPlay";w.zone=y}else w.zone="deck",w.zoneOrder=p+1;r.isPileToPlay==="next"&&(r.isPileToPlay="play"),t.set(r)},f=async()=>{for(let a=1;a<=3;a++){const r=t.get(),u=m(r.cards,"deck"),p=u[u.length-1];if(!p)break;p.zone=`pile${a}`,t.set(r)}},v=async(a,r,u)=>{if(!a||!Array.isArray(a.abilityFunct))return;e();for(let S=0;S<a.abilityFunct.length;S++){const j=a.abilityFunct[S],[F,b]=String(j).split(":");let k=b?parseInt(b,10):0;Number.isNaN(k)&&(k=b),be[F]&&await be[F](t,r,k)}const p=t.get();let w;u.length>1?w=p[u[0]][u[1]]:w=p[u[0]];const y=w.find(S=>S.id===a.id);if(y){const S=m(p.cards,"deck");y.zone="deck",y.zoneOrder=S[S.length-1].zoneOrder+1,t.set(p)}n()},P=()=>{const a=t.get(),r=a.currentPhase===void 0||a.currentPhase+1>=a.phases.length?0:a.currentPhase+1;return a.currentPhase=r,t.set(a),a.phases[r]};async function x(){const a=t.get();if(a.winner){alert(a.winner);return}const r=P();a.activePlayer==="player"?await E(r):await R(r)}const M=a=>{const r=t.get();r.isPhaseButtonDisabled=a,t.set(r)};async function E(a){M(!0),a==="deal"&&(ce(!0),await await f(),await L(500),await i()),a!=="take"&&a==="end"&&(O(),await i())}async function R(a){M(!0),a==="deal"&&(ye(!0),await f(),await L(500),await i()),a==="take"&&(await T(),await L(3e3),M(!1)),a==="end"&&(ye(!1),O(),await i())}async function T(){e(),ce();const a=t.get(),r=m(a.cards,"opponentPlay"),u=m(a.cards,"pile1"),p=b(u),w=m(a.cards,"pile2"),y=b(w),S=m(a.cards,"pile3"),j=b(S);if(a.selectedPile=fe(["pile1","pile2","pile3"]),r.length>=13)F("echo")&&(a.selectedPile=F("echo"));else if(r.length<=7)F("rift")&&(a.selectedPile=F("rift"));else if(F("omen")){const k=F("omen");a.selectedPile=k,m(a.cards,k).forEach(B=>{B.abilityFunct[0]==="remianingCardsInPileGoToYourPlayArea"&&(B.zoneOrder=100)})}t.set(a),await L(200),await A(),n(),await i();function F(k){if(p[k]>y[k]&&p[k]>j[k])return"pile1";if(y[k]>p[k]&&y[k]>j[k])return"pile2";if(j[k]>p[k]&&j[k]>y[k])return"pile3"}function b(k){const q={rift:0,echo:0,omen:0};return k.forEach(B=>{B.types.includes("rift")&&(q.rift=q.rift+1),B.types.includes("echo")&&(q.echo=q.echo+1),B.types.includes("omen")&&(q.omen=q.omen+1)}),q}}async function A(){for(;;){const r=t.get(),u=m(r.cards,r.selectedPile).reverse();if(!Array.isArray(u)||u.length===0)break;const p=u[u.length-1];if(!p)break;p.isFaceUp=!0,p.zone="active",t.set(r),await L(2e3),await v({...p},r.activePlayer,[r.selectedPile]),c(p.id),await L(1e3)}const a=t.get();a.isPileToPlay="deck",a.player.play=a.player.play.sort(r=>r.isExhausted),a.opponent.play=a.opponent.play.sort(r=>r.isExhausted),t.set(a)}const I=()=>{ce(!1,750);const a=t.get();a.isModalOpen=!1,t.set(a),g()},d=()=>{const a=t.get();a.isModalOpen=!1,a.isStarted=!0,a.storyIndex=he.length,t.set(a),window.methods.advancePhase()};function g(){var r;const a=t.get();a.storyIndex>=he.length-1?(a.isModalOpen=!1,a.isStarted=!0,t.set(a),window.methods.advancePhase()):(a.storyIndex=a.storyIndex+1,t.set(a),setTimeout(g,3e3),(r=document.querySelector(".last-line"))==null||r.classList.add("visible"))}const h=async()=>{const a=t.get();a.isModalOpen=!1,m(a.cards,"takeModal").forEach(u=>u.zone=a.selectedPile),t.set(a),e(),await L(500),await A(),await L(500),n(),await i()},z=()=>{if(!l("take"))return;const a=t.get();if(a.activePlayer==="opponent")return;const r=m(a.cards,"takeModal");a.isModalOpen=!1,r.forEach(u=>{u.zone=a.selectedPile}),t.set(a)};function O(){const a=t.get(),r=m(a.cards,"playerPlay"),u=m(a.cards,"opponentPlay"),p=m(a.cards,"playerGoal"),w=m(a.cards,"opponentGoal"),y=p[0].types[0],S=w[0].types[0],j=r.filter(b=>b.isExhausted===!1&&b.types.includes(y)),F=u.filter(b=>b.isExhausted===!1&&b.types.includes(S));a.activePlayer==="opponent"&&F.length>7?a.winner="You lost because your opponent completed their goal card!":a.activePlayer==="player"&&j.length>7?a.winner="You won for completeing your goal card!":a.activePlayer==="player"&&r.length>=15?a.winner="You lost because you had 15 or more cards in your play area!":a.activePlayer==="opponent"&&u.length>=15&&(a.winner="You won because your opponent had 15 or more cards in their play area!"),a.activePlayer=a.activePlayer==="player"?"opponent":"player",t.set(a)}const C=a=>{if(!l("take"))return;const r=t.get();if(r.activePlayer==="opponent")return;const u=m(r.cards,a);r.selectedPile=a,r.isModalOpen=!0,u.forEach(p=>{p.zone="takeModal"}),t.set(r)},U=(a,r)=>{const u=t.get(),p=Ze(u,a),w=p==null?void 0:p.find(y=>y.id===r);w&&(w.isSelected=!w.isSelected,t.set(u))},Q=(a,r)=>{const u=t.get(),p=m(u.cards,"takeModal");p.forEach((w,y)=>{w.id===a?w.zoneOrder=r?y+1.5:y-1.5:w.zoneOrder=y}),p.sort((w,y)=>w.zoneOrder-y.zoneOrder).reverse().forEach((w,y)=>{w.zoneOrder=y+1}),t.set(u)};window.methods={advancePhase:x,submitTakeModal:h,cancelTakeModal:z,cancelPlayModal:I,setSelected:U,viewPile:C,orderCards:Q,skipIntro:d}}function Je(){document.addEventListener("keydown",e=>{e.key.toLowerCase()==="m"&&We()})}
