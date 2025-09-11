(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const r of l)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(l){const r={};return l.integrity&&(r.integrity=l.integrity),l.referrerPolicy&&(r.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?r.credentials="include":l.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(l){if(l.ep)return;l.ep=!0;const r=s(l);fetch(l.href,r)}})();const B=window,qe=document,$=e=>qe.getElementById(e),ee=(e,t)=>{(e.length?$(e):e).innerHTML=t},v=(e,t,s)=>e.classList.toggle(t,s),ue=(e,t)=>{$(e).style.display=t?"block":"none"},Te=(e="div")=>qe.createElement(e),Ce="xyz".split(""),u=0,h=1,P=2,_=!0,m=!1,ze=void 0,We=B.addEventListener,g={},de={},{random:St,floor:Ye,ceil:De,round:Oe,min:Pt,max:Z,abs:fe,PI:vt,cos:Tt,sin:Ze}=Math,Fe=vt*2,Ot=(e,t)=>".".repeat(e).split("").map(t),K=e=>parseInt(e,10),x=(e=1,t=0)=>t+St()*(e-t),b=(e,t)=>Ye(x(e,t)),k=e=>e[b(e.length)],F=(e,t=0,s=1)=>Pt(Z(e,t),s),Rt=(e,t,s)=>fe(t-e)<.1?t:e+(t-e)*s,j=(e,t)=>((e[u]-t[u])**2+(e[h]-t[h])**2)**.5,Lt=(e,t)=>fe(e[u]-t[u])+fe(e[h]+t[h]),Nt=(e,t)=>e[u]*t[u]+e[h]*t[h]+(e[P]||0*t[P]||0),Ke=e=>Math.sqrt(Nt(e,e)),Mt=(e,t)=>[e[u]+t[u],e[h]+t[h]],Xe=(e,t)=>[e[u]*t,e[h]*t],_t=e=>Xe(e,1/Ke(e)),he=(e,t)=>[t[u]-e[u],t[h]-e[h]],Ge=(e,t)=>[e*Tt(t),e*Ze(t)],At=e=>e.map((t,s)=>({...t,id:s})),S=(e,t,s,o,l,r,n="")=>`<line x1=${e} y1=${t} x2=${s} y2=${o} ${r?`stroke=${r}`:""} stroke-width=${l} class="${n}" />`,q=(e,t=100,s=100)=>`<svg width=${t} height=${s} version="1.1" viewBox="0 0 ${t} ${s}" xmlns="http://www.w3.org/2000/svg">${e}</svg>`,Qe=(e="#665f57",t="#665f57")=>{let s="",o=95,l=50,r=1;const n=[];for(;n.length<=5&&o>0;){const c=n.length*.3;r+=x()>c?0:b(2,4),l+=b(-5,5),o-=b(8,15);const d=9-n.length*1.5,i=Ot(r,()=>l+b(-5*r,5*r));n.push([i,o,d])}return n.forEach(([c,d,i],L)=>{const[N=[50],f=95]=n[L-1]||[];c.forEach(p=>{let E=1/0,C=0;N.forEach(Ae=>{const He=fe(Ae-p);He<E&&(C=Ae,E=He)});const oe=c.length>1?e:t;s+=S(C,f,p,d+b(-3,3),i,oe)})}),q(`<g fill=none stroke-linecap=round>${s}</g>`)},Je=e=>{const t=Te();ee(t,e);const s=new XMLSerializer().serializeToString(t.firstElementChild),o=new Blob([s],{type:"image/svg+xml;charset=utf-8"});return URL.createObjectURL(o)},Ht=e=>{const t=new Image;return t.src=Je(e),t.outerHTML},Ue=(...e)=>Je(Qe(...e)),Dt=e=>Ht(Qe(e)),Ft=()=>{const e="#0b0d0a",t="#d4ea92";return q(`
			<g stroke-linecap="round">
				${S(43,75,43,90,10,e,"foot")}
				${S(57,75,57,90,10,e,"foot")}
				${S(75,75,75,90,10,e,"foot")}
				${S(87,75,87,90,10,e,"foot")}
			</g>
			<g stroke-linecap="round" stroke="#0b0d0a" fill="transparent">
				<line x1=50 y1=55 x2=80 y2=65 stroke-width="30" />
				<line x1=50 y1=40 x2=50 y2=60 stroke-width="35" />
				<line x1=45 y1=40 x2=55 y2=40 stroke-width="35" />
				  <path
    				d="M 90 60 C 90 60, 100 30, 80 10"
    				stroke-width="6"  />
			</g>
			<g stroke-linecap="round" stroke-width="4" stroke="#0b0d0a" fill="#665f57">
				<polygon points="33,28 45,25 36,12" />
				<polygon points="55,25 67,28 64,12" />
			<g>
			<g class="face">
				<g>
					${S(40,40,45,40,3,t)}
					${S(55,40,60,40,3,t)}
				</g>
				<g stroke="#383730" stroke-width=10 >
					<line x1=42 y1=50 x2=45 y2=50 />
					<line x1=55 y1=50 x2=58 y2=50 />
				</g>
				<polygon points="46,45 54,45 50,50" fill="#477a5a" stroke-width="0" />
			</g>
		`)},Gt=()=>"<b class=info id=cTip>craft potions [c]</b>"+q(`<g fill="#0b0d0a" stroke-linecap="round">
			<ellipse cx=28 cy=80 rx=7 ry=20 />
			<ellipse cx=72 cy=80 rx=7 ry=20 />
			<ellipse cx=50 cy=60 rx=40 ry=30 />
			<ellipse cx=60 cy=60 rx=28 ry=26 fill="#111" />
			<ellipse cx=62 cy=60 rx=24 ry=22 fill="#222" />
			<ellipse cx=50 cy=30 rx=40 ry=12 />
			<ellipse cx=50 cy=30 rx=34 ry=6 fill="transparent" stroke="#222" stroke-width="5" />
			<ellipse cx=50 cy=29 rx=30 ry=6 fill="#0b0d0a" />
			<g fill="#477a5a">
			<ellipse cx=50 cy=31 rx=28 ry=3 />
			${S(20,10,36,30,4,"#66403c")}
			<circle cx=40 cy=28 r=5.5 class="bub1" />
			<circle cx=50 cy=28 class="bub2" />
			<circle cx=36 cy=29 class="bub2" style="animation-delay: 1s"  />
			<circle cx=70 cy=28 class="bub2" style="animation-delay: 2s"  />
			</g>`),Ut=()=>q(`
				<g fill="#30191f">
					<circle cx="40" cy="44" r="20" />
					<circle cx="60" cy="44" r="20" />
				</g>
				<g stroke="#5a7b85" stroke-width="10" stroke-linecap="round">
					<line x1="43" y1="75" x2="43" y2="90" class=foot />
					<line x1="57" y1="75" x2="57" y2="90" class=foot />
				</g>

				<g stroke="#0b0d0a" stroke-width="1" fill="#0b0d0a" stroke-linecap="round">
					<polygon points="50,50  60,50 65,56 67,70 80,84  50,82  20,84 33,70 35,56 40,50" />
					
					<line x1="45" y1="40" x2="55" y2="40" stroke-width="35" stroke="#81ba78" />
					<polygon points="10,30 90,30 80,23 70,23 54,10 60,0 46,10 30,23 20,23" />
					<!-- face -->
					<circle cx="35" cy=47 r="4" fill="#61aa68" stroke-width="0" />
					<circle cx="65" cy=47 r="4" fill="#61aa68" stroke-width="0" />
					<ellipse cx="39" cy="40" rx=4 ry=6 class=eye />
					<ellipse cx="61" cy="40" rx=4 ry=6 class=eye />
					<g fill="#fff" stroke-width=0>
						<circle cx="38" cy="38" r="1" />
						<circle cx="60" cy="38" r="1" />
					</g>
					<polygon points="44,48 57,47 50,50" />
					<polygon points="46,45 54,45 50,41" fill="#477a5a" stroke-width="0" />
				</g>
				<!-- arms -->
				<g stroke="#81ba78" stroke-width="6" stroke-linecap="round" class=arms>
					<line x1="34" y1=60 x2="20" y2="65" />
					<line x1="66" y1=60 x2="80" y2="65" />
					<circle cx="20" cy="67" r="1.4" />
					<circle cx="80" cy="67" r="1.4" />
					<path
						d="M 5 50 a 10 13 0 1 1 14 14 l 5 8 l -2 2 l -7 -10 a 8 11 0 1 0 -9 -13 z" 
						fill="#b1b8a9" stroke-width=0 class=sickle />
				</g>`),me=()=>{const e=k(["#66403c","#665f57","#b59766"]);return q(`
				<g fill="${e}">
					<circle cx="40" cy="44" r="20" />
					<circle cx="60" cy="44" r="20" />
					<circle cx="50" cy="34" r="25" />
				</g>
				<g stroke="#665f57" stroke-width="10" stroke-linecap="round">
					<line x1="43" y1="75" x2="43" y2="90" class=foot />
					<line x1="57" y1="75" x2="57" y2="90" class=foot />
				</g>
				<polygon points="50,40  60,40 75,56 70,70 80,84  50,82  20,84 30,70 25,56 40,40" fill="#8f5450" />
				<g stroke="#0b0d0a" stroke-width="1" fill="#0b0d0a" stroke-linecap="round">
					
					<line x1="45" y1="40" x2="55" y2="40" stroke-width="35" stroke="#b1b8a9" />
					<!-- face -->
					<ellipse cx=35 cy=40 rx=4 ry=4 class=eye />
					<ellipse cx=65 cy=40 rx=4 ry=4 class=eye />
					<path d="M 35 32 l 7 7 m 17 0 l 7 -7" stroke-width=3 stroke="${e}" />
					<polygon points="43,48 57,48 50,46" />
					<polygon points="46,43 54,43 50,39" fill="#82857b" stroke-width="0" />
				</g>
				<g stroke="#b1b8a9" stroke-width="9" stroke-linecap="round">
					<line x1="28" y1="60" x2="20" y2="65" />
					<line x1="72" y1="60" x2="80" y2="65" />
				</g>`)},xe=()=>{const e=k(["#8f5450","#665f57"]),t=k(["#8f5450","#5a7b85"]);return q(`
				<g fill="#82857b">
					<circle cx="40" cy=34 r=16 />
					<circle cx="60" cy=34 r=16 />
				</g>
				<g stroke="#0b0d0a" stroke-width="10" stroke-linecap="round">
					<line x1="43" y1="75" x2="43" y2="90" class=foot />
					<line x1="57" y1="75" x2="57" y2="90" class=foot />
				</g>

				<g fill="${e}" stroke-linecap="round">
					<polygon points="50,30  60,40 75,46 67,70 60,84  50,82  40,84 33,70 25,46 40,40" />
					<path d="M 35 70 h 30" stroke="#0b0d0a" stroke-width="3" />
				</g>
				<g stroke="#0b0d0a" stroke-width="3" fill="#0b0d0a" stroke-linecap="round">
					<path d="M 50 10 l -20 10 v 20 l 10 10 h 20 l 10 -10 v-20" fill="#b1b8a9" stroke-width="0" />
					<!-- face -->
					<g stroke-width=1>
						<ellipse cx=37 cy=30 rx=4 ry=4 class=eye />
						<ellipse cx=63 cy=30 rx=4 ry=4 class=eye />
					</g>
					<path d="M 37 22 l 7 7 m 13 0 l 7 -7" stroke="#383730" />
					<polygon points="50,42 55,40 57,43 50,41 43,43 45,40" />
					<polygon points="46,35 54,35 50,31" fill="${e}" stroke-width="0" />
				</g>
				<path fill="${t}" d="M 50 0 l -10 5 l -5 7 h -10 l 2 5 h 45 l 2 -5 h -10 l -5 -7" />
				<!-- arms -->
				<g stroke="#b1b8a9" stroke-width="7" stroke-linecap="round">
					<line x1="28" y1="50" x2="20" y2="55" />
					<line x1="72" y1="50" x2="80" y2="55" />
					<circle cx="18" cy="53" r="1.4" />
					<circle cx="82" cy="53" r="1.4" />
				</g>
				${S(84,20,80,90,4,"#5f3430")}
				`)},A=[[11,13,10],[56,55,48],[102,95,87],[130,133,123],[],[],[],[],[],[71,122,90],[],[],[],[],[],[64,41,47]],R=1e4,be=R/9,T=R/2,jt=R/160,Vt=R/160,et=1400,tt=500,st=100,ot=400,rt=150,lt=tt+st+ot+rt,je=1,Bt=.03,qt=1,re=At([{color:A[0],plants:[0],veg:0,sink:.5,weight:.7},{color:A[1],plants:[0,1],veg:1,weight:1.2},{color:A[2],plants:[0,1,2,3],veg:.1,civ:1},{color:A[9],plants:[0,3],veg:1},{color:A[15],plants:[1,2],veg:1},{color:A[3],plants:[0,1,2,3],veg:.1}]),G=[],z=()=>[b(-T,T),b(-T,T)],U=(e,t=10)=>[e[u]+b(-t,t),e[h]+b(-t,t)],X=(e=[0,0],t=m,s=m)=>{let o,l=1/0;return G.forEach(r=>{const n=(t?Lt(e,r.pos):j(e,r.pos))/(r.weight||1);n<l&&(s?s(r):_)&&(l=n,o=r)}),o},zt=(e,t=10)=>{const s=X(e,m,o=>o.civ);return s.pos?U(s.pos,t):e},Wt=(e=.5)=>{const t=Te("canvas"),s=t.getContext("2d"),o=R*e;s.imageSmoothingEnabled=m,t.width=o,t.height=o;const l=s.getImageData(0,0,t.width,t.height);for(let r=0;r<l.data.length;r+=4){const n=r/4,c=n%t.width,d=Ye(n/t.height),i=X([c/e-T,d/e-T],m);l.data.set(i.color,r),l.data[r+3]=b(100,200)}s.putImageData(l,0,0),$("ground").style.backgroundImage=`url(${t.toDataURL()})`},Yt=()=>{const e=$("ground");["g-w","g-h"].forEach(s=>Y(e,s,`${R}px`)),G.push({pos:[0,0],...re[1],weight:1.5});let t;for(t=0;t<20;t++)G.push({...re[3],pos:Ge(T,x(Fe))});for(t=0;t<20;t++)G.push({...re[2],pos:Ge(R/4,x(Fe)),weight:.7});for(t=0;t<20;t++)G.push({...k(re),pos:z()});Wt(Bt)};let H=0,we=0,ke=0,nt,it,Q=m,Ee=_,I=1;const Re=10,le=T*Re,$e=61,Zt=1e4,at=[0,0,0,0,0,0,0,0,0,2,10,0,et+1,0],w=at.length,Le=[["G",["#477a5a","#81ba78"],["Toe of Frog","Sage","Thyme"]],["Y",["#b59766","#dee6b8"],["Catnip","Cattail","Eye of Newt"]],["R",["#8f5450","#40292f"],["Toadstool","Nightshade","Hemlock"]],["B",["#5a7b85","#95bdb2"],["Mugwort","Houndstongue","Rosemary","Bat Wings"]],["W",["#0b0d0a","#383730","#665f57","#66403c"],["Wood"]]],V=[],Ie=Le.map(()=>[]),te=[["Cat",[1,1],"🐈‍⬛",60],["Reaper",[0,0],"🪓",50],["Regrow",[0,1],"🌱",5],["Wind Walker",[1,2],"💨",40],["Double Harvest",[0,0,0],"🍃",30],["Alter Roots",[0,2],"🌿",20],["Feline Plague",[0,1,2,3],"☣️",60],["Detox",[0,3],"🌊",2],["Feather",[3,3],"☁️",30]],Kt=[["Cat"],["x3 Sickle Dmg."],["Regrow Aura"],["Fast"],["Double Harvest"],["Alteration Aura"],["Cat-Contagious"],["Cleanse"],["Float"]],Ne=10,ae=160,ct=[1],ne={},y=new Int32Array(lt*w),a=[],ie=[0,0,0],W=[0,0,250],ce=["Collect materials from plants [e]..","Craft potions at the cauldron...","Get rid of all the hostile villagers to win."],pe=e=>{ce.push(e),ce.splice(0,Z(ce.length-5,0)),bt()},dt=(e,t,s)=>{const o={...e};return te[t][1].map(l=>{const n=Object.keys(o).filter(i=>V[i].classId===l&&o[i]>=Ne),c=n[0],d=n.length&&c;return d&&(s&&s(c),delete o[c]),d})},ft=(e,t)=>{const s={...a[e].mats};return dt(s,t)},pt=e=>e.reduce((t,s)=>t+(s?0:1),0),Xt=e=>{ge(e),a[e].elt.remove()},Me=e=>e/Re,Qt=e=>e*Re,M=(e=0,t=[0,0])=>{y.set(t.map(Qt),e*w)},ge=(e,t=0)=>{y[e*w+9]=t},_e=e=>y[e*w+9],Jt=e=>y.subarray(e*w,e*w+2),ye=e=>Jt(e).map(Me),O=(e,t)=>{var s;return(((s=a[e].fx)==null?void 0:s[t])||0)>0},gt=e=>y[e*w+P]<=0,Se=(e,t=1)=>{const s=e*w;gt(e)&&(y[s+P]+=1,y[s+5]+=280*(O(e,3)?1.5:1)*t)},es=(e,t,s)=>{const{items:o}=a[0],l=o.findIndex(r=>r&&r[0]===e&&r[1]===t);l===-1?o.push([e,t,"#fff",s,1]):o[l][4]+=1},ts=(e,t)=>{const s=a[e];if(s.cooldown>0)return;const o=a[t];if(o.hp<=0||o.typeId===ze)return;s.cooldown=800;const l=b(50)*(O(e,1)?3:1);o.hp-=l;let r=Z(1,Oe(l/10));Se(t),Se(0,.6),o.hp<=0&&(Xt(t),r+=2),r*=O(e,4)?2:1,s.mats[o.typeId]=(s.mats[o.typeId]||0)+r,se(),pe("Harvested "+r+" "+V[o.typeId].name)},ss=e=>{const t=K(e),s=ft(0,t);if(pt(s))return;const{mats:o}=a[0];dt(o,t,r=>{o[r]-=Ne});const l=te[t];ct[t]=1,es(0,t,l[0]+" potion"),se()},os=(e,t)=>{e.fx[t]=(e.fx[t]||0)+te[t][3]*1e3,t===0?ve(0,_):t===7&&Object.keys(e.fx).forEach(s=>{const o=K(s);o!==7&&(e.fx[o]=0)})},rs=e=>{const{items:t}=a[0],s=t[e];if(!s)return;const[o,l,r,n,c]=s;s[4]-=1,s[4]<=0&&(t[e]=null),o===0&&(os(a[0],l),pe(`You drink the ${n}`)),se()},yt=(e,t=[0,0],s=0)=>{const o=e*w,l=y.subarray(o+6,o+9),r=Mt(l,Xe(_t(t),s));r.push(l[P]),y.set(r,o+6)},Ve=(e,t=[0,0],s=0)=>{let o=s?a[e].sprintSpeed:a[e].walkSpeed;O(e,3)&&(o=5),yt(e,t,o)},D=(e,t={})=>{y.set(at,e*w);const{classes:s=[],html:o,src:l,alt:r}=t,n=Te(l?"img":"div");n.id=`e${e}`,l&&(n.src=l),r&&(n.title=r),n.className=[...s,"thing"].join(" "),o&&ee(n,o),$("scene").appendChild(n);const c={...t,i:e,elt:n,cooldown:0,hp:100,maxHp:100,rot:0};a.push(c)},Pe=e=>{a[e].feet=[...a[e].elt.querySelectorAll(".foot")]},ut=(e,t)=>{a[e].lastHtml=a[e].html,ee(a[e].elt,t),Pe(e)},ls=e=>{ut(e,a[e].lastHtml)},ve=(e,t)=>{a[e].isCat=t,t?ut(e,Ft()):ls(e)},Be=(e,t=1)=>{a[e].ill=t,v(a[e].elt,"ill",a[e].ill)},Y=(e,t,s,o)=>{ht(e,`--${t}`,s,o)},ht=(e,t,s,o)=>{const l=o||e.id;if(!l)throw new Error("no uid");ne[l]||(ne[l]={}),ne[l][t]!==s&&(e.style.setProperty(t,s),ne[l][t]=s)},ns=e=>{const t=[];for(let s=a.length-1;s>=0;s--)_e(s)===0&&(!e||e(s))&&t.push(s);return t},is=e=>{const t=X(e),s=k(t.plants);return k(Ie[s])},mt=(e,t)=>{a[e].isPlant&&(a[e].src=t.src,a[e].typeId=t.index,a[e].elt.src=t.src)},as=e=>{if(x()>.03)return;const t=ns(l=>a[l].isPlant);if(!t.length)return;const s=t[0];M(s,U(e,200)),ge(s,2),a[s].hp=a[s].maxHp;const o=is(e);mt(s,o)},cs=e=>{if(x()>.1)return;const t=a.filter((o,l)=>!o.isPlant||!_e(l)?m:j(ye(l),e)<200);if(!t.length)return;const s=k(t);s.hp=s.maxHp,mt(s.i,k(V))},ds=(e,t)=>{const s=e*w,o=y.subarray(s,s+w),l=t/15;o[0]+=o[3]*l,o[1]+=o[4]*l,o[2]=F(o[2]+o[5]*l,0,5e3),o[3]=F((o[3]+o[6]*l)*.9,-200,200),o[4]=F((o[4]+o[7]*l)*.9,-200,200),o[5]=F((o[5]+o[8]*l)*.9,-200,200),o[0]>le||o[0]<-le||o[1]>le||o[1]<-le?(o[6]=-o[0],o[7]=-o[1]):(o[6]=0,o[7]=0),o[8]=o[2]>=0?-10:0,O(e,8)&&(o[8]*=.1),o[13]=Ke(o.subarray(3,6)),y.set(o,s)},xt=()=>{const e=performance.now(),t=we?e-we:0;we=e;let s=[0,0];if((g.a||g.arrowleft)&&(s[u]-=1),(g.d||g.arrowright)&&(s[u]+=1),(g.w||g.arrowup)&&(s[h]-=1),(g.s||g.arrowdown)&&(s[h]+=1),Ve(0,s,g.shift),g[" "]&&Se(0),g.c&&($t(),g.c=m),g.tab&&(Ct(),g.tab=m),g.enter){I=(I+1)%4,v($("body"),"splash",I),v($("dialog"),"on",I>1),ue("splash",I===1),ue("d1",I===2),ue("d2",I===3);const f="[Enter] to "+(I===2?"Advance Dialog":"Start");ee("next",f),g.enter=m}const o=a[0],l=gt(0),r=O(0,6),n=ye(0);let c,d,i,L=1/0,N;for(let f=a.length-1;f>=0;f--){if(i=a[f],i.cooldown>0&&(i.cooldown=Z(i.cooldown-t,0)),c=ye(f),d=j(c,n),d<L&&f>0&&(L=d,N=f),y[f*w+12]=d,f>0&&d<$e){const{maxRot:p=80}=i;i.rot=Oe((1-d/$e)*(c[u]<n[u]?-p:p))}if(ds(f,t),i.fx){const{fx:p}=i;O(f,2)&&as(c),O(f,5)&&cs(c),Object.keys(i.fx).forEach(E=>{const C=K(E);p[C]<=0||(p[C]=Z(p[C]-t,0),p[C]<=0&&(C===0||C===7)&&ve(f,m))})}if(i.target&&(j(c,i.target)>5?Ve(f,he(c,i.target)):i.target=m),i.push&&d<i.push&&l&&!o.isCat&&!i.isCat&&(s=x()<.3?he(c,n):he(n,[0,0]),yt(0,s,2)),r&&d<Vt&&i.ill===0&&!i.isCat)Be(f);else if(i.ill>Zt){ve(f,_),Be(f,0);let p=0;const E=a.reduce((C,oe)=>(oe.isVillager&&p++,C+(oe.isCat?1:0)),0);pe(`${E} / ${p} villagers turned into cats!`),E>=p&&pe("🐈‍⬛😻 You win! 😸🐈‍⬛")}else i.ill>0&&(i.ill+=t);if(typeof i.planCooldown=="number"&&(i.planCooldown<=0?(i.planCooldown=1e3+b(4e3),i.isCat?x()<.5&&(i.target=x()<.1?U(n,50):U(c,be)):i.sight&&d<i.sight&&!a[0].inCircle&&!o.isCat?(i.target=U(n,50),i.planCooldown=800):x()<.5&&(i.target=x()<.5?U(c,be):zt(c,be/2))):i.planCooldown-=t),i.inCircle!==ze){const p=j(c,[0,0])<ae,E=p&&!i.inCircle||!p&&i.inCircle;i.inCircle=p,p||(Q=m),f===0&&E&&se()}}(g.e||de.down)&&L<$e?(ts(0,N),v(o.elt,"harvesting",_)):(s[0]!==0||s[1]!==0)&&v(o.elt,"harvesting",m),setTimeout(xt,16)},J=(e,t,s)=>{ee(e,t.map(s).join(""))},bt=()=>J("news",ce,e=>`<b>${e}</b>`),wt=()=>{v($("inv"),"open",Ee),J("items",a[0].items,(e,t)=>{if(!e)return"";const[s,o,l,r,n]=e||[],c=te[o];return`<b class=item data-itemid="${t}">${r} x${n} ${c[2]}</b>`}),J("mats",Object.entries(a[0].mats),([e,t])=>{const s=V[e];return`<b style="color: ${s.color}">${t} ${s.name}</b>`})},kt=()=>{v($("cTip"),"open",a[0].inCircle&&!Q),v($("craft"),"open",a[0].inCircle&&Q),J("cList",te,([e,t],s)=>{const o=ft(0,s),l=pt(o);return`<b data-potionid="${s}" class="recipe ${l?"un":""}filled">
				${t.map((r,n)=>{const[c,d]=Le[r];return`<span class="req req${o[n]?"F":"Unf"}illed" style="background-color: ${d[0]}">${Ne} ${c}</span>`}).join(" + ")}
				&rarr; <i class=rName>${ct[s]?e:"????"}</i></b>`})},$t=()=>{Q=!Q,kt()},Ct=()=>{Ee=!Ee,wt()},Et=()=>{J("fx",Object.entries(a[0].fx),([e,t])=>{if(t<=0)return"";const[s]=Kt[e];return`<b>
				${s}
				<b>${De(t/1e3)} sec</b>
				<b class=bar><b style="height: ${F(De(t/600),0,100)}%"></b></b>
				</b>`})},se=()=>{wt(),kt(),Et()},fs=(e,t)=>{const s=e*w;if(!_e(e))return;const{elt:o,rot:l,feet:r,fx:n}=a[e];for(ht(o,"display",y[s+12]>et?"none":"block"),H=0;H<3;H++)Y(o,Ce[H],`${Me(y[s+H])}px`,`${e}-${Ce[H]}`);if(Y(o,"rot-z",`${l}deg`,`${e}-rot-z`),r){const c=y[s+13],d=Ze(t*(c/2e3)),i=[d*2,d*-2];r.forEach((L,N)=>Y(L,"step",i[N%2],e+"-"+N+"step"))}n&&Et()},It=e=>{ke<lt&&(ke+=60);for(let s=0;s<ke;s++)fs(s,e);const t=s=>{W[s]=-Oe(Me(y[s])/je)*je};I||(t(u),t(h));for(let s=0;s<3;s++)ie[s]!==W[s]&&(ie[s]=Rt(ie[s],W[s],qt),Y(s===P?nt:it,(s===P?"cam-":"scene-")+Ce[s],`${ie[s]}px`));requestAnimationFrame(It)},ps=()=>{nt=$("camera"),it=$("scene"),Yt();let e=0;D(e++,{classes:["witch"],html:Ut(),items:[],mats:{},fx:{},inCircle:0,walkSpeed:2,sprintSpeed:3}),M(0,[ae/2.5,ae/2.5]),Pe(0),D(e++,{classes:["cauldron"],html:Gt(),maxRot:10}),M(1,[0,0]);let t=0;Le.forEach((r,n)=>r[2].forEach(c=>V.push({index:t++,name:c,html:Dt(r[1][0]),src:Ue(r[1][0]),classId:n,color:r[1][0]}))),V.forEach(r=>Ie[r.classId].push(r));const s=r=>{const n=ye(r),c=X(n);return(j(n,[0,0])<ae||!c.veg||x()>c.veg)&&ge(r,0),c};for(;e<tt;e++){const r=z(),n=X(r),c=k(n.plants),d=k(Ie[c]);D(e,{alt:"plant",classes:["plant"],src:d.src,typeId:d.index,isPlant:_}),M(e,r),(!n.veg||x()>n.veg)&&ge(e,0),s(e)}const o=[me(),me(),me(),xe(),xe(),xe()];for(let r=0;r<st;r++)D(e,{alt:"villager",classes:["villager"],html:k(o),isVillager:_,target:null,planCooldown:b(1e4),sight:R/40,push:jt,walkSpeed:3,sprintSpeed:3,ill:0}),M(e,z()),Pe(e),e++;for(let r=0;r<ot;r++){D(e,{alt:"grass",classes:["grass"],html:"",isGrass:!0}),M(e,z());const n=s(e);x()<.5&&(a[e].elt.style.backgroundColor=`rgb(${n.color.join(",")})`),e++}const l=["#0b0d0a","#383730","#665f57","#66403c"].map(r=>Ue(r,r));for(let r=0;r<rt;r++)D(e,{alt:"tree",classes:["tree"],src:k(l)}),M(e,z()),s(e),e++;onkeydown=onkeyup=r=>{g[r.key.toLowerCase()]=r.type[3]=="d",r.key==="Tab"&&r.preventDefault()},onclick=r=>{const n=r.target.closest(".recipe"),c=r.target.closest(".item");r.target.closest("#iTitle")?Ct():r.target.closest(".cauldron")?$t():n?ss(K(n.dataset.potionid)):c&&rs(K(c.dataset.itemid))},onmousedown=()=>{de.down=1},onmouseup=()=>{de.down=0},We("wheel",r=>{W[P]=F(W[P]-r.deltaY/4,-2e3,350)}),xt(),It(0),se(),bt()};We("DOMContentLoaded",ps);B.biomePoints=G;B.pEnts=y;B.ents=a;B.keys=g;B.mouse=de;
