"use strict";(()=>{function He(e,t){let o;switch(t){case 0:return o=[[0,-1],[1,0],[0,1],[-1,0]].map(([r,a])=>a*e+r),[o,o];case 4:return o=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]].map(([r,a])=>a*e+r),[o,o];case 1:return[[[0,-1],[1,0],[0,1],[-1,1],[-1,0],[-1,-1]],[[1,-1],[1,0],[1,1],[0,1],[-1,0],[0,-1]]].map(r=>r.map(([a,s])=>s*e+a));case 2:return o=[[1,-1],[2,0],[1,1],[-1,1],[-2,0],[-1,-1]].map(([r,a])=>a*e+r),[o,o];case 3:return o=[[0,-1],[1,0],[1,1],[0,1],[-1,0],[-1,-1]].map(([r,a])=>a*e+r),[o,o]}}function ue(e,t,o){return e*(1-o)+t*o}function I(e,t,o){return o<e?e:o>t?t:o}function Ie(e){for(let t of[0,1,2])e[t]=I(0,255,e[t])}var K=6;function oe(e,t){return((e[0]-t[0])**2+(e[1]-t[1])**2)**.5}function Be(e,t,o){return[ue(e[0],t[0],o),ue(e[1],t[1],o)]}function w(){let e=Math.sin(K)*1e4;return K=(K+Math.E)%1e8,e-Math.floor(e)}function X([e,t],o=R.width){return~~e+~~t*o}function te(e){return e.getContext("2d")}function Q(e,t){let o=document.createElement("canvas");o.width=e,o.height=t,o.style.width=`${o.width*devicePixelRatio}px`,o.style.height=`${o.height*devicePixelRatio}px`;let r=te(o);return{canvas:o,ctx:r}}function re(e){let r=te(e).getImageData(0,0,e.width,e.height).data,a=new Float32Array(r.length/4);for(let s=0;s<r.length;s++)a[s]=r[s*4+3]/255;return a}function pt(e,t,o=5e3,r=100,a=.01,s=!0){let{canvas:i,ctx:l}=Q(e,t);if(s){let p=l.createRadialGradient(0,0,0,0,0,1);p.addColorStop(0,`rgba(255, 255, 255, ${a})`),p.addColorStop(1,"rgba(255, 255, 255, 0)"),l.fillStyle=p}else l.fillStyle=`rgba(255, 255, 255, ${a})`;for(let p=0;p<o;p++){let f=[...Array(3)].map(()=>w()),[c,m]=[f[0]*e,f[1]*t],g=Math.pow(f[2],2)*r;l.save(),l.translate(c,m),l.rotate(w()*Math.PI),l.scale(g*(.5+w()),g*(.5+w())),l.beginPath(),l.arc(0,0,1,0,Math.PI*2),l.fill(),l.restore()}return i}function je(e,t){let{canvas:o,ctx:r}=Q(e.width,e.height);return r.filter=t,r.drawImage(e,0,0),o}function We(e,t=.5,o=1e3){if(!e)debugger;let r=e.length,a=[...Array(o)].map(()=>e[Math.floor(w()*r)]);return a=a.sort(),a[Math.floor(t*a.length)]}function mt(e,t=1e3){let o=e.length,r=[...Array(t)].map(()=>e[Math.floor(w()*o)]),a=0;for(let s of r)s>a&&(a=s);return e.map(s=>s/a)}var ee=({width:e,height:t},o,r,a,s)=>re(je(pt(e,t,r,Math.sqrt(e*e+t*t)*a,s),`blur(${o}px)`));function ct(e){let{width:t,height:o,seed:r,noiseSmoothness:a,tectonicSmoothness:s,noiseFactor:i,crustFactor:l,tectonicFactor:p,pangaea:f}=e;K=r;let c=t*o;console.time("noise");let m=ee(e,a,3e3,.15,.03),g=ee(e,s,2e3,.15,.03),h=ee(e,s,2e3,.15,.03);console.timeEnd("noise"),console.time("main");let b=We(g,.5),y=g.map((M,v)=>(.2/(Math.abs(b-M)+.1)-.95)*(h[v]-.2)*2),u=g.map((M,v)=>5+m[v]*i+g[v]*l+y[v]*p+-f*(Math.abs(v/c-.5)+Math.abs(v%t/t-.5)));console.timeEnd("main"),console.time("normalize");for(let M=4;M--;)for(let v=t;v<u.length;v++)for(let F of[-2,2,-t*2,t*2])u[v]+=((u[v+F]||0)-u[v])*.15;let x=mt(u);return console.timeEnd("normalize"),{dryElevation:x,tectonic:y,p:e}}function de(e,t){console.time("generateMap"),t??=ct(e);let o=ut(e,t);return console.timeEnd("generateMap"),o}function ut(e,t){let{width:o,height:r,averageTemperature:a,erosion:s,riversShown:i,randomiseHumidity:l,noiseSmoothness:p,seaRatio:f,flatness:c,noiseSeed:m,elevationCold:g}=e;K=m;let h=ee(e,p,3e3,.15,.01),{dryElevation:b,tectonic:y}=t,u=o*r,x=We(b,f),M=b.map((S,O)=>S<x?-Math.pow(1-S/x,.35):Math.pow((S-x)*(.5+y[O]*.5)/(1-x),1+2*c)),v=M.map((S,O)=>Math.cos((Math.abs(.5-O/u)*4+.85)*Math.PI)/(S<0?1:1+5*S*S));console.time("windSmoothing"),v=re(je(ne(v,o,S=>[0,0,0,127*(S+1)]),"blur(3px)")).map(S=>S*2-1),console.timeEnd("windSmoothing");let F=bt({width:o,height:r,elevation:M,tectonic:y,erosion:s,riversShown:i}),C=ht({width:o,elevation:M,wind:v,steps:400});l&&(C=C.map((S,O)=>Math.max(0,S+Math.sin(h[O]*50)/10-M[O]*.2)));let G=M.map((S,O)=>a+25-100*Math.abs(.5-O/u)/(.7+.6*C[O])-Math.max(0,S)*g),P={tectonic:y,dryElevation:b,elevation:M,noise:h,rivers:F,wind:v,temperature:G,humidity:C,p:e,poi:[]};return P.biome=dt(P),P.photo=ft(P),P}function dt(e){console.time("biome");let t=e.temperature.map((o,r)=>{if(e.elevation[r]<-0)return ae;if(e.rivers[r])return J;let s=1+e.p.biomeScrambling*Math.sin(e.noise[r]*100),i=ze[~~I(0,5,e.humidity[r]*4.5*s)][~~I(0,3,o*s/10+1)];return e.elevation[r]>.4&&(i=fe),i});return console.timeEnd("biome"),t}function ft(e){let{humidity:t,elevation:o,temperature:r,tectonic:a,noise:s,rivers:i,biome:l}=e,{width:p,shading:f}=e.p,c=[...t],m=[...t],g;console.time("photo");let h;function b(y,u){if(y)for(let x of[0,1,2])h[x]=ue(h[x],y[x],u)}return g=[...t].map((y,u)=>{let x=o[u];if(x<0)return[-(x**2)*1e3+100,-(x**2)*500+150,-(x**2)*300+150,255];{h=[r[u]*15-y*700,150-y*150,r[u]*8-y*500,255],Ie(h);let M=(x+a[u])*2-1;M>0&&b([64,0,0,255],Math.min(1.5,M**2));let v=(1+Math.sin((s[u]*3+a[u])*100))*(1+w());v=(Math.sin(s[u]*100)+.5)*v**2*.05,b([32,32,32],v),c[u]=0,i[u]&&(h=[0,100,150+50*i[u],255]);for(let F of[1,2,3])for(let C of[1,p,-1,-p,0])b(Ue[l[u+C*F]],.05);if(r[u]<0&&b([500,500,500],-r[u]*.03),Ie(h),f){let F=0;for(let G=-2;G<=2;G++)for(let P=-2;P<=2;P++)F+=o[u+G+p*P]*(Math.sign(G)+Math.sign(P));let C=o[u+1+p]+o[u+p]+o[u+1]-x-o[u-p]-o[u-1]+F*.05;i[u]==0&&i[u+p]!=0&&(C-=.1),b([500,500,260],-C),m[u]=C}return h}}),console.timeEnd("photo"),g}function Ne(e,t,o=20){let r=e.length/t,a=ne(e,t,(l,p)=>[0,0,0,l<=0?100:0]),s=Q(t,r),i=s.ctx;return i.beginPath(),i.lineWidth=t/8,i.rect(0,0,t,r),i.stroke(),i.filter=`blur(${o}px)`,i.filter="opacity(50%)",i.drawImage(a,0,0),{humidityImage:a,wetness:s.canvas}}function ht({width:e,elevation:t,wind:o,steps:r}){console.time("humidity");let a=t.length/e,s=Math.sqrt(e*e+a*a),{humidityImage:i,wetness:l}=Ne(t,e,10),p=s/10;for(let c=0;c<r;c++){let m=[c%100/100*e,c%10/10*a],g=o[X(m)],h=[m[0]+g*.3*e/8,m[1]+Math.abs(g)*.5*a/12];l.getContext("2d")?.drawImage(l,m[0],m[1],p,p,h[0],h[1],p,p)}te(i).filter="blur(30px)",te(i).drawImage(l,0,0,e,a,0,0,e,a);let f=re(i);return console.timeEnd("humidity"),f}function bt({width:e,height:t,elevation:o,erosion:r,riversShown:a}){console.time("rivers");let{wetness:s}=Ne(o,e,100),i=re(s),l=o.map((c,m)=>1-c-i[m]*.3),p=new Float32Array(e*t),f=He(e,4)[0];for(let c=0;c<r+a;c++){let m=c*12345%o.length,g=[],h=1e3;for(;o[m]>-.1&&h-- >0;){c>r&&(p[m]+=1);let b=l[m],y=0,u=1e6;for(let x of f)l[m+x]<=u&&(y=m+x,u=l[y]);if(u<b){let x=(l[m]-u)*.01;for(let M of[0,0,-1,1,-e,e])o[m+M]-=x,l[m+M]-=x}else l[m]=u+.05;g.push(m),m=y}}for(let c in o)o[c]>-.2&&o[c]<0&&(o[c]=o[c]>-.1?.01:o[c]*2+.2),o[c]>0&&(o[c]*=1+w()*.1);return console.timeEnd("rivers"),p}function De(e){let t=[];for(let o in e)t[o]=e[o];return t}function Ge(e){let t=parseInt(e,16);return[Math.floor(t/256)*16,Math.floor(t/16)%16*16,t%16*16,256]}function ne(e,t,o,r){let a=e.length/t,{canvas:s,ctx:i}=Q(t,a),l=i.createImageData(t,a);if(!l.data||!e)debugger;for(let p=0;p<e.length;p++){let f=0,c=o?o(e[p],p)??0:[0,0,0,e[p]];l.data.set(c,p*4)}return i.putImageData(l,0,0),s}function Xe(e,t,o){let{canvas:r,ctx:a}=Q(t,o);return a.drawImage(e,0,0,e.width,e.height,0,0,t,o),r}function gt(e,t,o,r){let a={};for(let s of r??Object.keys(e)){a[s]=new Float32Array(e[s].length);let i=e[s],l=t[s];for(let p in i)a[s][p]=i[p]*(1-o)+l[p]*o}return a}function Ye(e,t,o){console.time("blend");let r=gt(e,t,o,["dryElevation","tectonic"]);console.timeEnd("blend"),console.time("blendGen");let a=e.p.averageTemperature+Math.sin(o*Math.PI*2)*20,s=de({...e.p,averageTemperature:a},r);return console.timeEnd("blendGen"),s}var H={},d={pw:.5,sw:.05,lrm:.1,abw:.02,rpb:.1,rpbf:1,popspd:.01,psz:1e3,blnd:13,pois:300,rspd:.3,amrt:.003,famrt:5,rcst:[100,100,300,1e3,3e3],wpy:169,dm:.1,d:`=DEP
🏔️ Ores|Metal source
⬛ Coal
🛢️ Oil
💧 Oasis|Small arable land
🗿 Relic|Knowledge of civilization lost to Calamities
=PLN
🌿 Grasslans|Best for farming and herding
🌲 Taiga
🌳 Forest
🌴 Jungles
=ANM
🐏 ram
🐂 Yak|Can be domesticated (as cattle)
🐎 Mustang|Can be tamed
🐪 Camel|Can be tamed (as horses)
🐺 Wolves|Can be tamed (as dogs)
🐗 Hogs|Can be domesticated (as cattle)
🐅 Tigers|Can betamed (as cats)
🐠 Fish
🐋 Whale
=RES
👖 Fabric|To sew things or replace sails
🪵 Wood|The simplest building materials
🍎 Food|Meat, fish,fruits and crops
⛽ Fuel|Coal, oil or even firewood
📙 Book|Have them to advance research
=TLS
🛠️ Tools|Crafting instruments
⛺ Housing|Things to live in
🛷 Wagons|Can be converted to travel on land or sea
🐴 Horses|Pull wagons
⚙️ Engines|Can be used on wagons or machines
🏹 Weapons
=BNS
💕 Happiness bonus
🥄 Food consumption bonuse (less is better)
🔭 Visibility range bonus
🗑️ Food spoilage speed (less is better)
🍲 Food happiness bonus
🎯 Hunting bonus
⚗️ Research focus|Press ⚗️ on topic to keep researching it with 📙
=WLD
🐾 Animals|Can be hunted or caught
🍃 Plants|Can be harvested
🌾 Crops|Result of Farming. Converted to 🍎Food
=MOV
🏃 Land movement
⚓ Sea movement
=CAL
👹 Goblin|Appear often on 13th month and on 13th year
☣️ Taint|Appear often on 13th month and on 13th year
🌋 Fracture|Appear often on 13th month and on 13th year
=MSC
💗 Happiness|increases from having various stuff in stock, grows population
📅 Week|1/13 of a month, 1/169 of a year
👨‍👩‍👦‍👦 Pop|Do work, eat food
🏋 Weight|Slows you down. Each item in store weight 1/10 of pop
`,st:"Foraging;Walking;Sticks",aka:{"🌾":"🍎"},rr:`=Land travel method
0Walk:>1🏃
0Ride:1🐴1🛷>4🏃0🐎0🐪
0Drive:1⚙️1⛽1🛷>10🏃
=Sea travel method
0Swim:>0.1⚓
0Sail:0.1👖1🛷>3⚓
0Boat:1⚙️1⛽1🛷>10⚓
=Jobs
0Forage:1🍃>1🍎
0Pick Sticks:1🍃>1🪵
1Axe:1🍃1🛠️.1🪨>3🪵
2Herd:10🍃>10🌾!0🐂0🐏0🐗0🌿
2Farm:3🍃>5🌾0🌿
2Plantation:3🍃>3👖
0Hunt:1🐾>1🍎1👖!0🐾
1Bow:3🐾1🏹>3🍎3👖!0🐾0🏹
1Trap:2🐾2🛠️>2🍎2👖0.5🐴!0🐾0🛠️
0Fish:1🐠>3🍎!0🐠
1Fishing nets:1🛠️1🐠>5🍎!0🐠
3Whaling:1⚓1🛠️1🐋>10🍎!0🐋
1Tools:1🪵>1🛠️
1Sharp Sticks:1🪵>.3🏹
1Wheel:1🪵>0.3🛷
1Wigwam:1🪵3👖>1⛺
1Dig:1🛠️1🏔️>1🪨
3Mine:1⚙️1⛽1🏔️>10⛽
3Firewood:1🪵>1⛽
3Coal:1⚙️1⛽1⬛>10⛽
4Oil:1⚙️1⛽1🛢️>20⛽
1Write:>.1📙0👖0🪵
2Parchment:2👖>.2📙
3Paper:1🪵1🛠️>.4📙
4Print:1🪵2🛠️>1📙
4Archeology:1🗿1🛠️>3📙
1Horses:3🍃>1🐴!0🐎0🐪0🐴
2Metal Working:1🪵1🪨>5🛠️
4Rifles:1⚙️1⛽1🪨>3🏹
4Engines:3🛠️3🪨>1⚙️
3Alloys:1⚙️1⛽1🪨>3⛺
4Cars:1⚙️1⛽1🪨>1🛷
4Greenhouse:1⛺1⛽>5🍎
=Calamities
4Kill goblins:1🏹1👹>1📙
4Burn taint:1🛠️1⛽1☣️>1📙
4Close fracture:1⚙️1⛽1🌋>1📙
=Permanent bonuses
1Tame Dogs:.05🥄.2🎯.05💕0🐺
1Tame Cats:.03🥄-.2🗑️.05💕0🐅
1Pottery:-.2🗑️0🍎
2Conservation:-.3🗑️0🍎
1Cooking:-.1🗑️-.1🥄.5🍲0🍎
1Mapmaking:.2🔭0🏃
2Astronomy:.2🔭0🏃
3Compass:.2🔭0🏃
4Optics:.2🔭0🏃
1Science:1⚗️0📙`,atc:"🐏,🐂,🐂,🐎,🐪,🐏,🐺,🐗,🐗,🐅",sm:{"🐏":.3,"💧":.3,"🗿":.3},m:{"🐾":`🐏:1🍎3👖
🐂:3🍎1👖0🐴
🐎:2🍎1👖0.5🐴
🐪:1🍎1👖0.3🐴
🐺:1🍎1👖0🐴
🐗:4🍎1👖0🐴
🐅:1🍎2👖0🐴
`,"🍃":`🌿:2.5🍎0.5🪵1🌾1🐴1👖
🌲:1🍎2🪵0.3🌾0.35🐴0.3👖
🌳:2🍎1🪵0.5🌾0.5🐴0.3👖
🌴:1.5🍎1.5🪵0.3🌾0.3🐴0.3👖
💧:1🍎0.3🪵0.5🌾0.5🐴1👖`}},Ke=1,he=2,be=3,ge=4,ye=5,xe=6,V=7,ve=8,Qe=9,yt=10,Me=11,Je=12,ie=13,fe=14,xt=15,J=16,ae=17,ze=[[be,Je,ge,Ke],[be,ye,he,ge],[Me,ye,he,ve],[Me,ie,ve,V],[xe,ie,V,V],[xe,ie,V,Qe]],Ue=De({[Ke]:"fa0",[he]:"4f4",[ge]:"ff8",[be]:"cca",[ye]:"ad4",[xe]:"064",[V]:"0a0",[ve]:"060",[Qe]:"084",[yt]:"880",[Me]:"fff",[Je]:"caa",[ie]:"0a6",[fe]:"884",[xt]:"ff0"}).map(Ge);var N,E,Se={},Y=[],z;function j(e){return Math.max(0,~~(e.size*d.psz*Math.sin(I(0,1,e.age)*3.14)-e.taken))}function qe(e,t,o){let r=[~~(w()*e.p.width),~~(w()*e.p.height)],a=w();for(let m of t)if(oe(m.at,r)<10)return;let s=X(r),i=e.biome[s],l,p=!1,f=1+w();if(i==J||i==ae)l="🐠",i==J?f+=1:l="🐋";else{let m=e.noise[s+500]%.1,g=n.date%1>=12/13||n.date%13>=12;if(m<(g?.01:.001)*n.date){let h=Object.keys(H.CAL);l=h[~~(w()*h.length)],p=!0}else{let h=e.noise[s+1e3]%.1;if(h<.01)l="🏔️";else if(h<.02)l=h%.01<.005?"⬛":"🛢️";else{let b=e.temperature[s]*.8+e.noise[s]*5+12,y=e.humidity[s]*10+e.noise[s]*5-5;h<.045?l=d.atc.split(",")[(y>0?5:0)+~~I(0,4,b/10)]:l=y<-.5?h%.01<.003&&b>0?"💧":"🗿":y<.3?"🌿":"🌲,🌲,🌳,🌳,🌴".split(",")[~~I(0,4,b/15)]}}d.sm[l]&&(f*=d.sm[l])}let c={id:a,at:r,kind:l,size:f,taken:0,age:w(),temp:e.temperature[s],ageByWeek:(w()+.5)*d.abw*(p?1/n.date:1)};return t.push(c),c}function vt(e){let t=e.split(/([\d.-]+)/).filter(r=>r),o={};for(let r=0;r<t.length;r+=2)o[t[r+1]]=t[r];return o}var Ae={};function Ve(e,t=!1){let o;return Object.fromEntries(e.split(`
`).map(r=>{if(r[0]=="=")return o=r.slice(1),null;let a=Number(r[0]),s={},[i,...l]=r.slice(a>=0?1:0).split(/[:>\!]/);if(o&&(Ae[i]=o,o=void 0),!l)debugger;let[p,f,c]=l.map(vt).map((m,g)=>{let h=l.length<=2||g==2;for(let b in m){if(!H.BNS[b]&&h)if(d.aka[b])s[d.aka[b]]=1;else if(d.m[b])for(let y in Se[b])s[y]=1;else s[b]=1;m[b]==0&&delete m[b]}return m}).filter(m=>m);return t?[i,p]:[i,{from:p,to:f,t:r,name:i,cost:a,research:s,isBonus:!f}]}).filter(r=>r))}function Ze(){let e;N=Object.fromEntries(d.d.split(`
`).map(t=>{if(t[0]=="=")e=t.slice(1),H[e]={};else{let[o,...r]=t.split(" ");return H[e][o]=1,[o,r.join(" ")]}}).filter(t=>t));for(let t in d.m)Se[t]=Ve(d.m[t],!0);E=Ve(d.rr),console.log(N)}function Mt(){return Object.keys(N).filter(e=>H.RES[e]||H.TLS[e])}function et(e){let t={pop:100,store:Object.fromEntries(Mt().map(o=>[o,0])),bonus:Object.fromEntries(Object.keys(H.BNS).map(o=>[o,0])),sel:{Walk:1,Swim:1},"🏃":"Walk","⚓":"Swim",date:0,seed:e,tech:{},research:{}};t.poi=[];for(let o in E)t.tech[o]=E[o].cost==0?1:0,t.research[o]=0;return t}function Re(){let t=n.store["🍎"]>0?0:-n.pop;for(let o in n.store){let a=n.store[o]**.75;o=="🍎"&&(a=2*se(t,"🍲")),t+=a}return t=se(t,"💕"),t}function se(e,t){return nt(n.bonus[t])*e}function tt(e){delete n.store[n.deposit];let t=n.home;if(n.home=e,n.deposit=e.kind,n.store[e.kind]=j(e),t){let o=q(k,e,t),r=o.w;delete o.w;for(let a in o)n.store[a]-=o[a];pe(r)}Pe()}function ke(e){ce(U(n.date)),console.time("populate");let t=d.pois-e.length;for(let o=0;o<t*4;o++)qe(k,e);wt(k,e),n.home&&(n.store[n.home.kind]=j(n.home)),console.timeEnd("populate")}function wt(e,t){let o=new Set(t.map(a=>a.kind)),r=[];for(let a of o){let s=t.filter(i=>i.kind==a);for(let i of[...s])for(let l of[...s])n&&(n.home==i||n.home==l)||i!=l&&l.size&&i.size&&oe(i.at,l.at)<40&&(i.size+=l.size,i.age=(i.age+l.age)/2,i.ageByWeek=(i.ageByWeek+l.ageByWeek)/2,l.size=0);r.push(...s.filter(i=>i.size))}return t.splice(0,1e9,...r)}function _(e,t){let o=1e12;if(t!=null){let r=Object.values(e.to)[0];o=t/r}for(let r in e.from)o=Math.min(n.store[r]/e.from[r],o);return o}function Tt({used:e,made:t}){W(B(e)+"🡢"+B(t));for(let o in e)n.deposit==o&&n.home?(n.home.taken+=e[o],n.store[o]=j(n.home)):n.store[o]-=e[o];for(let o in t)n.store[o]=(n.store[o]||0)+t[o]}function St(e){for(let t in{...e})e[t]||delete e[t];return e}function Te(e,t){let o={},r={};for(let a in e.from){let s=e.from[a]*t,i=H.TLS[a]?.1:1;o[a]=s*i}for(let a in e.to){let s=e.to[a]*t,i=d.aka[a]??a;r[i]=s}return{used:o,made:r}}function Le(){let e=JSON.parse(JSON.stringify(E));for(let t of Object.values(e)){let o=Object.keys(d.m).find(r=>t.from[r]);if(o&&n.home){let r=Se[o][n.home.kind];if(r){let a=1;o=="🐾"&&(a=se(1,"🎯"));for(let s in t.to)r[s]&&(t.to[s]=t.to[s]*r[s]*a);t.from[n.home.kind]=t.from[o],delete t.from[o]}}for(let r in t.to){let a=1;n.tech[t.name]>0&&(a*=1+.1*(n.tech[t.name]-1)),t.to[r]*=a}}z=e}var At=["⚓","🏃"];function ot(e){if(!e||!n.tech[e])return;let t=z[e];if(!t.to)return;for(let r of At)if(t.to[r]){let a=n[r];delete n.sel[a],n.sel[t.name]=1,n[r]=t.name;return}let o=_(t);if(o>0){o=Math.min(o,n.pop);let r=Te(t,o);Tt(r),pe(o/n.pop)}}function le(){return~~(n.date*d.wpy)}function pe(e=1){let t=le();for(n.date+=e/d.wpy;t<le();)t++,Rt();$(),window.save(0)}function Rt(){let e=n.pop*(1+n.bonus["🥄"])*.1;if(n.store["🍎"]-=e,n.store["🍎"]<0){let s=n.store["🍎"]*.1;n.pop+=s,n.store["🍎"]=0,W(`<red>🍎hungry! ${me(s)}👨‍👩‍👦‍👦</red>`)}let t=d.popspd,o=I(-n.pop*t,n.pop*t,(Re()-n.pop)*t);console.log({dHappiness:o}),n.pop+=o;for(let s in n.store){let i=Object.values(z).filter(p=>p.research[s]),l=n.store[s]**.8/i.length*d.rspd;s==n.deposit&&(l*=d.lrm);for(let p of i)we(p.name,l);if(s!=n.deposit){let p=d.amrt;s=="🍎"&&(p=d.famrt*se(p,"🗑️")),n.store[s]*=1-p}}let r=n.bonus["⚗️"],a=n.store["📙"]**.9*Math.max(1,r);for(let s in E)we(s,a*d.rpb);n.focus&&we(n.focus,a*d.rpbf*r);for(let s of[...n.poi])if(s.age+=s.ageByWeek,(s.age>1||j(s)<=0)&&n.home?.id!=s.id){n.poi.splice(n.poi.indexOf(s),1);let i;do i=qe(k,n.poi,n.date);while(!i)}Ee(),ke(n.poi)}function Ee(){for(let e in n.bonus)n.bonus[e]=0;for(let e of Object.values(E))if(!e.to&&n.tech[e.name]>0)for(let t in e.from)n.bonus[t]+=e.from[t]*(.9+.1*n.tech[e.name])}function we(e,t){n.research[e]+=t;let o=$e(e);if(n.research[e]>o){n.tech[e]++,n.research[e]=0;let r=n.tech[e];W(r>1?`${e} advanced to level ${r}`:`${e} researched`)}}function $e(e){return d.rcst[E[e].cost]*2**n.tech[e]}function rt(e){let t=z[e];return _(t)>0}function kt(e,t,o){if(!o)return[0,0];let r=oe(t.at,o.at),a=0,s=0;for(let i=0;i<r;i++){let l=Be(t.at,o.at,i/r),p=X(l);e.elevation[p]<0?a+=d.dm:s+=d.dm}return{"🏃":s,"⚓":a}}function _e(e,t){return Object.fromEntries(Object.keys({...e,...t}).map(o=>[o,(e[o]||0)+(t[o]||0)]))}function Ce(){let e=n.pop*d.pw;for(let t in n.store)n.deposit!=t&&(e+=n.store[t]*d.sw);return e}function q(e,t,o){let r=Ce(),a=kt(e,t,o),s=a["🏃"],i=a["⚓"],[l,p]=[E[n["🏃"]],E[n["⚓"]]];for(let b of[l,p])if(_(b)<r)return{fail:1};s*=r,i*=r;let[f,c]=[_(l,s),_(p,i)],m=Te(l,f),g=Te(p,c),h=_e(m.made,g.made);if(h["🏃"]>=s-.1&&h["⚓"]>=i-.1){let b=_e(m.used,g.used);return b.w=(f+c)/n.pop,St(b)}else return{fail:2}}function nt(e){return e>0?1+e:1/(1-e)}console.log("SM",nt(.5));var k;var A=[0,0],at,Fe,T=1,D,n,Z=[];function W(e){Z.push(e)}var Lt=["unknown","desert","grassland","tundra","savanna","shrubland","taiga","tropical forest","temperate forest","rain forest","swamp","snow","steppe","coniferous forest","mountain shrubland","beach","lake","ocean"],R={seed:1,width:700,height:700,scale:1,noiseFactor:11.5,crustFactor:5.5,tectonicFactor:2.9,noiseSmoothness:1,tectonicSmoothness:8.5,pangaea:0,seaRatio:.55,flatness:.09,randomiseHumidity:0,averageTemperature:19,erosion:1e4,riversShown:150,biomeScrambling:.24,terrainTypeColoring:0,discreteHeights:0,hillRatio:.12,mountainRatio:.04,gameMapRivers:15e3,gameMapScale:2,generatePhoto:1,squareGrid:0,generateTileMap:0,noiseSeed:1,elevationCold:53,shading:1};function Et(){Ze(),n=et(R.seed),Ee(),ke(n.poi),Oe(),$()}document.onkeydown=e=>{function t(){return n.date+=1/13,ce(U(n.date)),new Promise(o=>setTimeout(o,50))}if(e.shiftKey){if(e.code=="KeyW"&&(n.poi=[],A[0]=0,A[1]=0,T=0),e.code=="KeyS"&&t(),e.code=="KeyA"){let o=async()=>{t().then(o)};o()}Oe()}};window.onload=Et;Object.assign(window,{rec:e=>{ot(e),$()},give:e=>{n.store[Object.keys(n.store)[e]]+=100,$()},foc:e=>{n.focus!=e&&(n.focus=e,pe())},save:e=>{if(e!=0&&!confirm(`Save to ${e}?`))return;let t=JSON.stringify({...n,home:n.poi.indexOf(n.home),seed:R.seed},null,2);localStorage.setItem("temo"+e,t),e!=0&&W("Saved"),$()},load:e=>{let t=localStorage.getItem("temo"+e);t&&(n=JSON.parse(t),n.seed!=null&&(R.seed=n.seed),n.home=n.poi[n.home],ce(U(n.date)),Pe(),$(),W("Loaded"))}});var it={};var L;function $t(e,t,o,r=1/4,a){L=ne(e,R.width,o,a);let i=Xe(L,L.width*r,L.height*r).getContext("2d");return i.font="14px Verdana",i.fillStyle="#fff",i.strokeText(t,5,15),i.fillText(t,4,14),main.appendChild(L),main.style.width=`${R.width*devicePixelRatio}px`,main.style.height=`${R.height*devicePixelRatio}px`,L=L,L}function st(e){return`<span class=icon>${e}</span>`}function B(e,t){return e?.fail?e.fail==1?"🏋🏻":"🚳":`<span class=rtt>${e?Object.keys(e).map(r=>`<span style="white-space: nowrap;"><span data-red='${n.store[r]<.1}'>${me(e[r])}</span>${st(r)}</span>`).join(t?"<br/>":" "):""}</span>`}function Ct(e,t){let o=X(e);if(tooltip.style.left=`${Math.min(window.innerWidth-300,Fe[0]+20)}`,tooltip.style.top=`${Math.min(window.innerHeight-300,Fe[1]+20)}`,t&&t.classList.contains("icon")&&N[t.innerHTML]){tooltip.style.display="flex";let r=(N[t.innerHTML]||"").split("|");tooltip.innerHTML=`<h4>${r[0]}</h4>${r.slice(1).join("<br/>")}`}else if(tooltip.style.display="grid",tooltip.innerHTML=Object.keys(k).map(r=>{let a=k[r][o];return`<div>${r}</div><div>${r=="photo"?a?.map(s=>~~s):r=="biome"?a+" "+Lt[a]?.toUpperCase():~~(a*1e6)/1e6}</div>`}).join(""),D){tooltip.style.display="block";let r=D.kind,a=(N[r]||"").split("|"),s=q(k,D,n.home);B(s,!0);let i=D==n.home||!n.home?"":`<p>${B(s,!0)} ${["","Not enough transport for everyone","Not enough resources for entire journey","&nbsp;travel duration"][s.fail??3]}</p>`;tooltip.innerHTML=`
      <h4>${r}${a[0]}</h4><p>${a.slice(1).join("<br/>")}</p>
      <p>Remaining:${~~j(D)}</p>${i}
      `}}document.onmousemove=e=>{let t=[e.movementX,e.movementY];Fe=[e.pageX,e.pageY],e.target==L&&e.buttons&&(A[0]+=t[0]*devicePixelRatio,A[1]+=t[1]*devicePixelRatio,$());let o=e.target,r=o.tagName=="CANVAS",a=o.id;r||o.classList.contains("icon")||o.classList.contains("poi")?(at=[e.offsetX/o.width*R.width/devicePixelRatio,e.offsetY/o.height*R.height/devicePixelRatio],Ct(at,e.target)):it[a]?tooltip.innerHTML=it[a]:tooltip.style.display="none"};main.onwheel=e=>{let t=T;T+=(e.deltaY>0?-1:1)*1/8,T=T<0?0:T,console.log(T,A);let o=R.width/2;A[0]=(A[0]-o)*2**(T-t)+o,A[1]=(A[1]-o)*2**(T-t)+o,e.preventDefault(),e.stopPropagation(),$()};function Pt(e){let t=n.poi[e],o=q(k,t,n.home);return`<div class=poi id=poi${e}>
<div class=pmain>${t.kind}<center>${~~j(t)}
</center></div>
<center style=margin:0.2rem >${!n.home||t==n.home?"":B(o,!0)}<center>
</div>`}function Oe(){console.time("draw"),L&&main.removeChild(L),$t(k.photo,"photo",e=>e,void 0,e=>Math.max(1,~~(k.elevation[e]*20)*2)),console.timeEnd("draw"),$()}window.poiOver=e=>{console.log(e)};function me(e){return parseFloat(Number(e).toFixed(2))}function Pe(){let e=R.width/2;n.home&&(T=2.25/(1+n.bonus["🔭"]),A[0]=(-n.home.at[0]*2**T+e)*devicePixelRatio,A[1]=(-n.home.at[1]*2**T+e)*devicePixelRatio)}function $(){if(!n)return;Le(),L.style.transform=`translate(${A[0]}px, ${A[1]}px) scale(${2**T})`;let e="";for(let i in n.poi)e+=Pt(i);ps.innerHTML=e;let t=R.width/2;for(let i in n.poi){let l=n.poi[i],p=document.querySelector(`#poi${i}`);if(p){let f=((j(l)/1e3)**.5*3+4)*2**T;p.style.left=`${l.at[0]*devicePixelRatio*2**T+A[0]-f/2}px`,p.style.top=`${l.at[1]*devicePixelRatio*2**T+A[1]-f/2}px`,p.style.fontSize=`${f}px`,p.dataset.cur=l==n.home,p.onmouseover=()=>{D=l},p.onmouseleave=()=>{D=void 0},p.onmousedown=()=>{if(n.home&&q(k,l,n.home).fail){W("Unreachable");return}tt(l),$()}}}Le();let o=[{"👨‍👩‍👦‍👦":n.pop,"💗":Re(),"🏋":Ce(),"📅":le(),...n.bonus},{...n.store}],r,a="";for(r=1;localStorage.getItem("temo"+r);r++)a+=`<button onmousedown=save(${r})>Save ${r}</button><button onmousedown=load(${r})>Load ${r}</button>`;a+=`<button onmousedown=save(${r})>Save ${r}</button>`;let s=o.map(i=>"<div class=res>"+Object.keys(i).map(l=>[st(l),i[l]>10?~~i[l]:me(i[l])]).map((l,p)=>`<div onmousedown="give(${p})">${l.join("<br/>")}</div>`).join("")+"</div>").join("")+Object.values(z).map(i=>{let l=B(i.to),p=Ae[i.name],f=n.tech[i.name]>0,c=(i.from?Object.keys(i.from).length:0)+(i.to?Object.keys(i.to).length:0);return(p?`<div>${p}</div>`:"")+`<button data-sel=${n.sel[i.name]} data-rec onmousedown="rec('${i.name}')" data-use="${f&&(rt(i.name)||E[i.name].isBonus)}" >
${n.bonus["⚗️"]?`<div class=foc data-foc="${n.focus==i.name}" onmousedown=foc('${i.name}')>⚗️</div>`:""}
${f?"":"<div class=un>UNKNOWN</div>"}
${`<div class=r><div>${i.name} ${n.tech[i.name]||""}</div>
<div>${~~($e(i.name)-n.research[i.name])}<span class=resl>⚗️↩${Object.keys(i.research).join("")}</span></div></div>
<span class=rec style="${c>4?"font-size:80%":""}">${B(i.from)}${l?"🡢 "+l:""}</span>`}
</button>`}).join("")+"<br/>"+a+`<button data-fls=${n?.date==0&&Ft} onmousedown=load(0)>Load autosave</button><p class=log>`+Z.slice(Z.length-20).join(" ✦ ")+"</p>";console.log("<p class=log>"+Z.slice(Z.length-20).join(" ✦ ")+"</p>"),recdiv.innerHTML=s}var Ft=!!localStorage.getItem("temo0");function ce(e){return k=e,Oe(),k}function U(e=n.date){let t=~~e;if(t!=e&&(e=t+~~(e%1*d.blnd)/d.blnd),Y[e])return Y[e];if(t==e)return Y[e]=de({...R,seed:n.seed+e}),Y[e];console.time("blend");let[o,r]=[U(t),U(t+1)],a=Ye(o,r,e-t);return W("map updated"),Y[e]=a,console.timeEnd("blend"),a}})();
