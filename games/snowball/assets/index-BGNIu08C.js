(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&t(c)}).observe(document,{childList:!0,subtree:!0});function l(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(n){if(n.ep)return;n.ep=!0;const r=l(n);fetch(n.href,r)}})();const v=window.devicePixelRatio||1,a=document.getElementById("gameCanvas"),i=a.getContext("2d"),W=()=>{if(!a)throw new Error("Canvas element not found");if(!i)throw new Error("2D context not available");a.width=a.clientWidth*v,a.height=a.clientHeight*v,i.setTransform(v,0,0,v,0,0),a.setAttribute("tabindex","0"),a.focus()},X=512,p=e=>e/X*a.width/v,h={wall:"#",road:" ",streetlamp:"O",switchOff:"S",hero:"H",enemy:"E",exit:"X",gap:"L"},O={[h.wall]:"#888",[h.road]:"#444",[h.streetlamp]:"#FFEA00",[h.hero]:"#00F",[h.enemy]:"#F00",[h.exit]:"#0F0",[h.gap]:"#0000FF",[h.switchOff]:"#F00"},u=e=>e.split(`
`).slice(1,-1).map(o=>o.split("")),F=e=>{const l=m.indexOf(e)+1;return m[l]},m=[{name:"Level 1: easy peasy",map:u(`
###########
#         #
#         #
#         #
#  H O    #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#        X#
###########
`)},{name:"Level 2: a-maze-ing",map:u(`
###########
#         #
#         #
#         #
#  H O    #
#         #
#         #
#         #
########  #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#  ########
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#        X#
###########
`)},{name:"Level 3: hello darkness",map:u(`
###########
#         #
#         #
#    H    #
#         #
#######   #
#         #
#         #
#   #######
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
####   ####
#         #
#         #
#######   #
#         #
#         #
#   #######
#         #
#        X#
###########
`)},{name:"Level 4: don't get wet now",map:u(`
###########
#         #
# H       #
#         #
#         #
#    O    #
# LL      #
#LLLLLL   #
#         #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#  ########
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#        X#
###########
`)},{name:"Level 5: you can run and you can hide",map:u(`
###########
#         #
#    H    #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#    O    #
#         #
#    E    #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#        X#
###########
`)},{name:"Level 6: slow and steady",map:u(`
###########
#         #
# H       #
#         #
#         #
#######   #
#         #
#         #
# O       #
#         #
#   E     #
#         #
#         #
#    ######
#         #
#    E    #
#         #
#    O    #
#         #
#         #
#         #
#       # #
#       # #
#   ##### #
#   #X    #
###########
`)},{name:"Level 7: when the lights go out",map:u(`
###########
#         #
# H       #
#         #
#         #
#######   #
#     #   #
#     #   #
#     #   #
#     #   #
#     #  S#
#     #   #
#     #   #
#     #   #
#     #   #
#       E #
#         #
#      O  #
#         #
#         #
#         #
#         #
#         #
#         #
#   X     #
###########
`)},{name:"Level 8: choose wisely",map:u(`
###########
#         #
# H       #
#         #
#    S    #
#         #
#  #  LLLL#
#  #  L X #
#  #  L   #
# O#  L O #
#  #  L   #
# E#  L E #
#  #  L   #
#  #  L   #
#  #  L   #
#  #  L   #
#     L   #
#  LLLL   #
#         #
#         #
#         #
#         #
#         #
#       S #
#         #
###########
`)}],_=e=>{const o=a.clientWidth/e[0].length,l=a.clientHeight/e.length;i.fillStyle="black",i.fillRect(0,0,a.clientWidth,a.clientHeight);for(let t=0;t<e.length;t++)for(let n=0;n<e[t].length;n++){const r=e[t][n];Y(i,r,n*o,t*l,o,l)}},z=(e,o,l)=>{e.fillStyle="black";const t=p(70);e.beginPath(),e.arc(o,l,t*.3,0,Math.PI*2),e.fill(),e.beginPath(),e.moveTo(o-t*.3,l-t*.1),e.lineTo(o-t*.3,l-t*.4),e.lineTo(o-t*.1,l-t*.3),e.closePath(),e.fill(),e.beginPath(),e.moveTo(o+t*.3,l-t*.1),e.lineTo(o+t*.3,l-t*.4),e.lineTo(o+t*.1,l-t*.3),e.closePath(),e.fill(),e.fillStyle="white",e.beginPath(),e.arc(o-t*.1,l-t*.05,t*.05,0,Math.PI*2),e.arc(o+t*.1,l-t*.05,t*.05,0,Math.PI*2),e.fill(),e.fillStyle="black",e.beginPath(),e.arc(o-t*.1,l-t*.05,t*.02,0,Math.PI*2),e.arc(o+t*.1,l-t*.05,t*.02,0,Math.PI*2),e.fill(),e.fillStyle="pink",e.beginPath(),e.moveTo(o,l),e.lineTo(o-t*.03,l+t*.05),e.lineTo(o+t*.03,l+t*.05),e.closePath(),e.fill()},Y=(e,o,l,t,n,r)=>{switch(o){case h.wall:e.fillStyle=O[h.wall],e.fillRect(l,t,n,r);break;case h.road:break;case h.streetlamp:break;case h.hero:break;case h.enemy:break;case h.exit:q(e,l,t,n,r);break;case h.gap:U(e,l,t,n,r);break;default:const c=O[o]||"magenta";e.fillStyle=c,e.fillRect(l,t,n,r);break}},N=(e,o,l)=>{e.fillStyle="white";const t=p(60);e.beginPath(),e.arc(o,l-t*.1,t*.25,Math.PI,0);const n=Math.floor(Date.now()/500)%2===1;e.lineTo(o+t*.25,l+t*.25);const r=9,c=t*.5/r;for(let f=0;f<r;f++){const w=o+t*.25-f*c,E=f%2===0===n,g=l+t*.25+(E?t*.05:-t*.05);e.lineTo(w,g)}e.lineTo(o-t*.25,l+t*.25),e.closePath(),e.fill(),e.fillStyle="black",e.beginPath(),e.arc(o-t*.07,l-t*.05,t*.05,0,Math.PI*2),e.arc(o+t*.07,l-t*.05,t*.05,0,Math.PI*2),e.fill()},q=(e,o,l,t,n)=>{e.fillStyle="brown",e.fillRect(o+t*.2,l-n*.2,t*.6,n),e.strokeStyle="white",e.lineWidth=2,e.strokeRect(o+t*.2,l-n*.2,t*.6,n),e.fillStyle="gold",e.beginPath(),e.arc(o+t*.7,l+n/3,t*.05,0,Math.PI*2),e.fill()},U=(e,o,l,t,n)=>{e.fillStyle="blue",e.fillRect(o,l,t,n)},B=(e,o,l)=>{const t=p(60),n=p(13),r=p(I),c="#000",f="#FFEA00";if(i.fillStyle=f,i.beginPath(),i.moveTo(e-n,o),i.lineTo(e+n,o),i.lineTo(e+n*1.5,o-t*.6),i.lineTo(e-n*1.5,o-t*.6),i.closePath(),i.fill(),l){const w=i.createRadialGradient(e,o-t/2,n*.5,e,o,r);w.addColorStop(0,"rgba(255, 234, 0, 0.6)"),w.addColorStop(1,"rgba(255, 234, 0, 0)"),i.fillStyle=w,i.beginPath(),i.arc(e,o,r,0,Math.PI*2),i.fill()}i.fillStyle=c,i.fillRect(e-n/2,o,n,t/2),i.strokeStyle="#000",i.lineWidth=2,i.beginPath(),i.moveTo(e-n,o),i.lineTo(e+n,o),i.lineTo(e+n*1.5,o-t*.6),i.lineTo(e-n*1.5,o-t*.6),i.closePath(),i.stroke(),i.fillStyle="#000",i.beginPath(),i.moveTo(e-n*1.5,o-t*.6),i.lineTo(e+n*1.5,o-t*.6),i.lineTo(e+n*1.2,o-t*.8),i.lineTo(e-n*1.2,o-t*.8),i.closePath(),i.fill(),i.beginPath(),i.moveTo(e-n/2,o),i.lineTo(e-n/2,o-t*.6),i.moveTo(e+n/2,o),i.lineTo(e+n/2,o-t*.6),i.stroke(),i.fillStyle=c,i.fillRect(e-n,o+t/2,n*2,n)},d={pointer:{x:0,y:0,isDown:!1},keysPressed:{ArrowUp:!1,ArrowDown:!1,ArrowLeft:!1,ArrowRight:!1}},G=()=>{window.addEventListener("pointerdown",e=>{e.preventDefault(),d.pointer={x:e.clientX,y:e.clientY,isDown:!0}},{passive:!1}),window.addEventListener("pointerup",e=>{e.preventDefault(),d.pointer.isDown=!1}),window.addEventListener("pointermove",e=>{e.preventDefault(),d.pointer.isDown&&(d.pointer={x:e.clientX,y:e.clientY,isDown:!0})},{passive:!1}),window.addEventListener("touchstart",e=>{e.preventDefault(),d.pointer={x:e.touches[0].clientX,y:e.touches[0].clientY,isDown:!0}},{passive:!1}),window.addEventListener("touchmove",e=>{e.preventDefault(),d.pointer.isDown&&(d.pointer={x:e.touches[0].clientX,y:e.touches[0].clientY,isDown:!0})},{passive:!1}),window.addEventListener("touchend",e=>{e.preventDefault(),d.pointer.isDown=!1},{passive:!1}),window.addEventListener("keydown",e=>{e.key in d.keysPressed&&(d.keysPressed[e.key]=!0)}),window.addEventListener("keyup",e=>{e.key in d.keysPressed&&(d.keysPressed[e.key]=!1)})},T=0,D=9,A=2.5,$=3,V=5e3;let P=!1;const I=130,M=I-10,s={hero:{x:100,y:100,size:30,speed:A,lives:D},streetlamps:[],ennemies:[],level:m[T]},K=(e,o)=>{let l=e.x,t=e.y;if(d.keysPressed.ArrowUp&&(t-=o),d.keysPressed.ArrowDown&&(t+=o),d.keysPressed.ArrowLeft&&(l-=o),d.keysPressed.ArrowRight&&(l+=o),d.pointer.isDown){const n=a.getBoundingClientRect(),r=(d.pointer.x-n.left)*(a.clientWidth/n.width),c=(d.pointer.y-n.top)*(a.clientHeight/n.height),f=Math.atan2(c-s.hero.y,r-s.hero.x);l+=Math.cos(f)*s.hero.speed,t+=Math.sin(f)*s.hero.speed}return{x:l,y:t}},C=()=>{s.level=m[T],s.hero.speed=p(A),G(),L(),window.requestAnimationFrame(R)},L=()=>{s.ennemies=[],s.streetlamps=[];const e=a.clientWidth/s.level.map[0].length,o=a.clientHeight/s.level.map.length;for(let l=0;l<s.level.map.length;l++)for(let t=0;t<s.level.map[l].length;t++)switch(s.level.map[l][t]){case h.hero:s.hero.x=t*e+e/2,s.hero.y=l*o+o/2;break;case h.streetlamp:s.streetlamps.push({x:t*e+e/2,y:l*o+o/2,size:50,isOn:!0});break;case h.enemy:s.ennemies.push({x:t*e+e/2,y:l*o+o/2,size:30,speed:p($),direction:Math.random()*2*Math.PI,isChasing:!1});break}},j=()=>{i.clearRect(0,0,a.width,a.height)},J=()=>{i.fillStyle="white",i.font=`${p(20)}px Arial`,i.fillText(s.level.name,p(10),p(25)),i.fillText(`Lives: ${s.hero.lives}`,a.clientWidth-p(100),p(25))},Q=()=>{const{x:e,y:o}=K({x:s.hero.x,y:s.hero.y},s.hero.speed),l=s.level.map,t=a.clientWidth/l[0].length,n=a.clientHeight/l.length,r=Math.floor(e/t),c=Math.floor(o/n);c>=0&&c<l.length&&r>=0&&r<l[0].length&&l[c][r]!==h.wall&&(s.hero.x=e,s.hero.y=o)},H=()=>{s.hero.lives-=1,s.hero.lives<=0&&(s.hero.lives=D,s.level=m[T]),L()},Z=e=>{const o=F(s.level);if(o)s.level=o,L();else{console.log("won"),P=!0,i.fillStyle="yellow",i.font="34px Arial",L(),i.fillText(`You won! Time: ${Math.floor(e/1e3)} s`,50,a.clientHeight/2),i.fillText("click to restart",50,a.clientHeight/2+34);const l=()=>{window.removeEventListener("pointerdown",l),P=!1,C()};window.addEventListener("pointerdown",l)}},x=e=>{const o=s.level.map,l=a.clientWidth/o[0].length,t=a.clientHeight/o.length,n=Math.floor(s.hero.x/l),r=Math.floor(s.hero.y/t);if(r>=0&&r<o.length&&n>=0&&n<o[0].length)switch(o[r][n]){case h.gap:H();break;case h.exit:Z(e);break;case h.switchOff:s.streetlamps.filter(f=>f.isOn).forEach(f=>{f.isOn=!1,setTimeout(()=>f.isOn=!0,V)});break}s.ennemies.forEach(c=>{s.streetlamps.filter(g=>g.isOn).forEach(g=>{const b=c.x-g.x,y=c.y-g.y;if(Math.sqrt(b*b+y*y)<p(M)){const S=s.hero.x-g.x,k=s.hero.y-g.y;Math.sqrt(S*S+k*k)<p(M)&&(c.isChasing=!0)}});const f=c.x-s.hero.x,w=c.y-s.hero.y;Math.sqrt(f*f+w*w)<(s.hero.size+c.size)/2&&H()})},ee=()=>{Q(),s.ennemies.filter(e=>e.isChasing).forEach(e=>{const o=Math.atan2(s.hero.y-e.y,s.hero.x-e.x);e.direction=o,e.x+=Math.cos(e.direction)*e.speed,e.y+=Math.sin(e.direction)*e.speed})},R=e=>{ee(),x(e),!P&&(j(),_(s.level.map),s.streetlamps.forEach(o=>B(o.x,o.y,o.isOn)),z(i,s.hero.x,s.hero.y),s.ennemies.forEach(o=>{N(i,o.x,o.y)}),J(),window.requestAnimationFrame(R))};window.addEventListener("load",()=>{W(),C()});
