(()=>{let _e=e=>e*Math.PI/180,v=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),Bt=(e,t,r,a,n,o)=>new Float32Array([2/(t-e),0,0,0,0,2/(a-r),0,0,0,0,2/(n-o),0,(e+t)/(e-t),(r+a)/(r-a),(n+o)/(n-o),1]),st=(e,t)=>{let r,a,n,o,s;for(r=0;r<4;r++)a=e[r],n=e[r+4],o=e[r+8],s=e[r+12],e[r]=a*t[0]+n*t[1]+o*t[2]+s*t[3],e[r+4]=a*t[4]+n*t[5]+o*t[6]+s*t[7],e[r+8]=a*t[8]+n*t[9]+o*t[10]+s*t[11],e[r+12]=a*t[12]+n*t[13]+o*t[14]+s*t[15];return e},g=(e,t)=>{let r=t.x||0,a=t.y||0,n=t.z||0,o=t.sx||1,s=t.sy||1,u=t.sz||1,c=t.rx,d=t.ry,b=t.rz;return(r||a||n)&&(e[12]+=e[0]*r+e[4]*a+e[8]*n,e[13]+=e[1]*r+e[5]*a+e[9]*n,e[14]+=e[2]*r+e[6]*a+e[10]*n,e[15]+=e[3]*r+e[7]*a+e[11]*n),c&&st(e,new Float32Array([1,0,0,0,0,Math.cos(c),Math.sin(c),0,0,-Math.sin(c),Math.cos(c),0,0,0,0,1])),d&&st(e,new Float32Array([Math.cos(d),0,-Math.sin(d),0,0,1,0,0,Math.sin(d),0,Math.cos(d),0,0,0,0,1])),b&&st(e,new Float32Array([Math.cos(b),Math.sin(b),0,0,-Math.sin(b),Math.cos(b),0,0,0,0,1,0,0,0,0,1])),o!==1&&(e[0]*=o,e[1]*=o,e[2]*=o,e[3]*=o),s!==1&&(e[4]*=s,e[5]*=s,e[6]*=s,e[7]*=s),u!==1&&(e[8]*=u,e[9]*=u,e[10]*=u,e[11]*=u),e};let K=v(),ve=(e,t)=>{K=v(),K=Bt(0,e,t,0,2e3,-2e3)},Ve=(e,t)=>{g(K,{x:e,y:t})};let l={up:!1,right:!1,down:!1,left:!1,esc:!1,space:!1,mouse:{down:!1,x:0,y:0}},mt={left:37,right:39,up:38,down:40,space:32};onkeydown=e=>{let t=e.keyCode,r=()=>e.preventDefault&&e.preventDefault();(t==38||t==90||t==87)&&(l.up=!0,r()),(t==39||t==68)&&(l.right=!0,r()),(t==40||t==83)&&(l.down=!0,r()),(t==37||t==65||t==81)&&(l.left=!0,r()),t==27&&(l.esc=!0,r()),t==32&&(l.space=!0,r())};onkeyup=e=>{let t=e.keyCode;(t==38||t==90||t==87)&&(l.up=!1),(t==39||t==68)&&(l.right=!1),(t==40||t==83)&&(l.down=!1),(t==37||t==65||t==81)&&(l.left=!1),t==27&&(l.esc=!1),t==32&&(l.space=!1)};let ut=document.getElementById("app"),pt=0,ft=0;ut.onpointerdown=e=>{l.mouse.down=!0,pt=e.offsetX,ft=e.offsetY};ut.onpointerup=()=>{l.mouse.down=!1,l.mouse.x=l.mouse.y=0};ut.onpointermove=e=>{l.mouse.x=l.mouse.y=0,l.mouse.down&&(l.mouse.x=e.offsetX-pt,l.mouse.y=e.offsetY-ft,pt=e.offsetX,ft=e.offsetY)};let B=(e,t,r)=>{let a=e.createShader(e.VERTEX_SHADER);e.shaderSource(a,t),e.compileShader(a);let n=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(n,r),e.compileShader(n);let o=e.createProgram();return e.attachShader(o,a),e.attachShader(o,n),e.linkProgram(o),{program:o,use:()=>e.useProgram(o),attribs:{vertex:e.getAttribLocation(o,"aVertexPosition"),normal:e.getAttribLocation(o,"aNormal")},uniforms:{modelMatrix:e.getUniformLocation(o,"uModelViewMatrix"),parentTransform:e.getUniformLocation(o,"uParentTransform"),projectionMatrix:e.getUniformLocation(o,"uProjectionMatrix"),lightDir:e.getUniformLocation(o,"uLightDir"),jump:e.getUniformLocation(o,"uJump"),color:e.getUniformLocation(o,"uColor"),color2:e.getUniformLocation(o,"uColor2"),backdrop:e.getUniformLocation(o,"uBackdrop"),time:e.getUniformLocation(o,"uTime")}}},V=(e,t,r)=>{let a=e.createBuffer();return e.bindBuffer(t,a),e.bufferData(t,new Float32Array(r),e.STATIC_DRAW),{bind:(n,o)=>{e.bindBuffer(t,a),e.vertexAttribPointer(o,n,e.FLOAT,!1,0,0),e.enableVertexAttribArray(o)}}};let He=(e,t)=>[e,0,0,0,0,0,0,e,0,e,0,0,0,e,0,e,e,0,e,e,0,0,e,0,0,e,t,e,e,0,0,e,t,e,e,t,0,e,0,0,0,0,0,0,t,0,e,0,0,0,t,0,e,t],Ye=()=>[0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0];let je=[-.5,.8,-1],Ot={x:[.061,.581,.821],b:[.939,.131,.125],c:[.502,.847,.412],d:[.91,.82,.14]},Ut=[.44,.525,.627],ct=[.583,.644,.752],Ae=e=>{ct=e};let F=10,y=50,Or=900,ge=1e3,H,Ur=`attribute vec4 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;
varying float vDepth;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
  vNormal = aNormal;
  vDepth = aVertexPosition.z/900.;
}`,_r=`precision mediump float;
uniform vec3 uLightDir;
uniform vec3 uColor;
uniform vec3 uBackdrop;

varying vec3 vNormal;
varying float vDepth;

void main() {
  float light = dot(normalize(vNormal), uLightDir);
  gl_FragColor = mix(vec4(uColor,1.), vec4(uBackdrop, 1.), vDepth);
  gl_FragColor.xyz *= light;
}`,_t=e=>{H=B(e,Ur,_r),vertexBuffer=V(e,e.ARRAY_BUFFER,He(y,Or)),normalBuffer=V(e,e.ARRAY_BUFFER,Ye())},O=(e,t,r,a=!1)=>{switch(r){case"a":return{type:r,zpos:ge,modelView:v()};case"x":case"a":case"b":case"c":return{type:r,zpos:ge,modelView:g(v(),{x:e*y+F*e,y:t*y+F*t,z:a?0:ge})};case"d":return{type:r,steps:1,oSteps:1,zpos:ge,modelView:g(v(),{x:e*y+F*e,y:t*y+F*t,z:a?0:ge})};default:return null}},Vt=()=>m.hasCoil?["x","a","b","c","d"]:["x","a","b","c"],Ht=(e,t)=>{if(!e||e.zpos===0)return;switch(e.type){case"x":case"a":case"b":case"c":case"d":let r=e.zpos<0?-e.zpos:-7-(t+1);g(e.modelView,{z:r}),e.zpos+=r}},Yt=e=>{if(!e)return 2;switch(e.type){case"c":return 1;case"a":return 2;case"d":if(e.steps)e.steps--;else if(e.zpos>0)return 2;default:return 0}},jt=(e,t)=>{if(!e)return;e.type==="d"&&(!t&&!e.steps&&(e.zpos+=20,g(e.modelView,{z:20}),e.zpos>=ge&&(e.type="a")))},Xt=e=>{if(!e)return;e.oSteps&&(e.type="d",e.steps=e.oSteps,g(e.modelView,{z:-e.zpos}),e.zpos=0)},Xe=(e,t)=>{H.use(),vertexBuffer.bind(3,H.attribs.vertex),normalBuffer.bind(3,H.attribs.normal),e.uniformMatrix4fv(H.uniforms.parentTransform,!1,t),e.uniformMatrix4fv(H.uniforms.projectionMatrix,!1,K),e.uniform3fv(H.uniforms.lightDir,je),e.uniform3fv(H.uniforms.backdrop,ct)},Ge=(e,t)=>{if(!t||t.type==="a")return;e.uniform3fv(H.uniforms.color,Ot[t.type]),e.uniformMatrix4fv(H.uniforms.modelMatrix,!1,t.modelView),e.drawArrays(e.TRIANGLES,0,18)};let We=(...e)=>{let t=dt.createBufferSource(),r=dt.createBuffer(e.length,e[0].length,L);return e.map((a,n)=>r.getChannelData(n).set(a)),t.buffer=r,t.connect(dt.destination),t.start(),t},ht=(e=1,t=.05,r=220,a=0,n=0,o=.1,s=0,u=1,c=0,d=0,b=0,X=0,G=0,me=0,Se=0,he=0,S=0,te=1,re=0,Ce=0)=>{let C=2*Math.PI,Le=c*=500*C/L**2,ze=(0<Se?1:-1)*C/4,xe=r*=(1+2*t*Math.random()-t)*C/L,ue=[],R=0,ke=0,x=0,W=1,lt=0,Br=0,ae=0,Pe,be;for(a=99+L*a,re*=L,n*=L,o*=L,S*=L,d*=500*C/L**3,Se*=C/L,b*=C/L,X*=L,G=L*G|0,be=a+re+n+o+S|0;x<be;ue[x++]=ae)++Br%(100*he|0)||(ae=s?1<s?2<s?3<s?Math.sin((R%C)**3):Math.max(Math.min(Math.tan(R),1),-1):1-(2*R/C%2+2)%2:1-4*Math.abs(Math.round(R/C)-R/C):Math.sin(R),ae=(G?1-Ce+Ce*Math.sin(2*Math.PI*x/G):1)*(0<ae?1:-1)*Math.abs(ae)**u*e*Vr*(x<a?x/a:x<a+re?1-(x-a)/re*(1-te):x<a+re+n?te:x<be-S?(be-x-S)/o*te:0),ae=S?ae/2+(S>x?0:(x<be-S?1:(be-x)/S)*ue[x-S|0]/2):ae),Pe=(r+=c+=d)*Math.sin(ke*Se-ze),R+=Pe-Pe*me*(1-1e9*(Math.sin(x)+1)%2),ke+=Pe-Pe*me*(1-1e9*(Math.sin(x)**2+1)%2),W&&++W>X&&(r+=b,xe+=b,W=0),!G||++lt%G||(r=xe,c=Le,W=W||1);return ue},Vr=.3,L=44100,dt=new(top.AudioContext||webkitAudioContext)();let Y=(e,t,r,a=125)=>{let n,o,s,u,c,d,b,X,G,me,Se,he,S,te,re,Ce=0,C=[],Le=[],ze=[],xe=0,ue=0,R=1,ke={},x=L/a*60>>2;for(;R;xe++)C=[R=X=Se=S=0],r.map((W,lt)=>{for(b=t[W][xe]||[0,0,0],R|=!!t[W][xe],re=S+(t[W][0].length-2-!X)*x,te=lt==r.length-1,o=2,u=S;o<b.length+te;X=++o){for(c=b[o],G=o==b.length+te-1&&te||me!=(b[0]||0)|c|0,s=0;s<x&&X;s++>x-99&&G?he+=(he<1)/99:0)d=(1-he)*C[Ce++]/2||0,Le[u]=(Le[u]||0)-d*ue+d,ze[u]=(ze[u++]||0)+d*ue+d;c&&(he=c%1,ue=b[1]||0,(c|=0)&&(C=ke[[me=b[Ce=0]||0,c]]=ke[[me,c]]||(n=[...e[me]],n[2]*=2**((c-12)/12),c>0?ht(...n):[])))}S=re});return[Le,ze]};let Hr=ht(void 0,0,void 0,.05,void 0,.5),Z=[.5,0,190,,.08,.5,3],Yr=[[Y([Z],[[[,,5,,,,,]]],[0]),Y([Z],[[[,,6,,,,,]]],[0]),Y([Z],[[[,,8,,,,,]]],[0]),Y([Z],[[[,,17,,,,,]]],[0])],[Y([Z],[[[,,3,,,,,]]],[0]),Y([Z],[[[,,5,,,,,]]],[0]),Y([Z],[[[,,6,,,,,]]],[0]),Y([Z],[[[,,15,,,,,]]],[0])]],xt=0,jr=Y([Z],[[[,,2,3,7,20,,,,,]]],[0]),Gt=()=>{We(Hr)},Wt=e=>{We(...Yr[xt][e]),e===3&&(xt=Number(!xt))},Kt=()=>{We(...jr)};let Xr=`attribute vec4 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;
varying float vHeight;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
  vNormal = aNormal;
  vHeight = (1.-aVertexPosition.z/40.0);
}`,Gr=`precision mediump float;
uniform vec3 uLightDir;
uniform vec3 uColor;
uniform float uJump;

varying vec3 vNormal;
varying float vHeight;

void main() {
  float light = dot(normalize(vNormal), uLightDir);
  float glow = step(vHeight, uJump);
  gl_FragColor = mix(vec4(0.5, 0.5, 0.5, 1.0), vec4(0.9,1.,0.9,1.), glow);
  gl_FragColor.xyz *= light;
}`,Zt,bt=10,qt=40,oe=.09,T=[0,0],z=[0,0],pe=0,ye=0,De=v(),q=0,J=0,fe=0,Jt=e=>{program=B(e,Xr,Gr),Zt=V(e,e.ARRAY_BUFFER,He(bt,qt)),normalBuffer=V(e,e.ARRAY_BUFFER,Ye())},vt=e=>{switch(fe){case 0:g(De,{z:-1}),pe--,pe<=-qt&&(fe=4,pe=0);break;case 1:if(l.up||l.down||l.left||l.right){let a=1;Wt(ye),ye++>2&&(a=2,ye=0),fe=2,l.up?T[1]-=a:l.down?T[1]+=a:l.left?T[0]-=a:l.right&&(T[0]+=a)}break;case 2:let t=0,r=0;z[0]!==T[0]?(z[0]<T[0]?(z[0]+=oe,t+=oe):(z[0]-=oe,t-=oe),Math.abs(z[0]-T[0])<.05&&(z[0]=T[0])):z[1]!==T[1]?(z[1]<T[1]?(z[1]+=oe,r+=oe):(z[1]-=oe,r-=oe),Math.abs(z[1]-T[1])<.05&&(z[1]=T[1])):(q=T[0],J=T[1],fe=4),g(De,{x:t*(y+F),y:r*(y+F)});break;case 3:if(g(De,{z:pe++}),pe>50)return pe=0,1;break;case 4:l.up||l.down||l.left||l.right||(fe=1)}},Ke=()=>(fe=3,ye=0),Qt=(e,t)=>{program.use(),Zt.bind(3,program.attribs.vertex),normalBuffer.bind(3,program.attribs.normal),e.uniformMatrix4fv(program.uniforms.parentTransform,!1,t),e.uniformMatrix4fv(program.uniforms.projectionMatrix,!1,K),e.uniform3fv(program.uniforms.lightDir,je),e.uniform3fv(program.uniforms.color,Ut),e.uniform1f(program.uniforms.jump,ye/3)},$t=e=>{e.uniformMatrix4fv(program.uniforms.modelMatrix,!1,De),e.drawArrays(e.TRIANGLES,0,18)},Ze=(e,t)=>{q=T[0]=z[0]=e,J=T[1]=z[1]=t,fe=pe=ye=0,De=g(v(),{x:q*y+F*q+y/2-bt/2,y:J*y+F*J+y/2-bt/2,z:0})};let k,gt=v(),ce=0,yt=!1,Te=[0,0],Tt,Et,ie=[],er=(e,t,r)=>{Tt=t,Et=r,_t(e),Jt(e)},tr=e=>{switch(ce){case 0:return ie.forEach((t,r)=>{Ht(t,r)}),ie[0].zpos===0&&(ce=1,Ze(Te[0],Te[1])),1;case 1:if(vt(e),q<0||J<0||q>=k||J>=k)Ke(),ce=2;else{let t=Yt(ie[q+k*J]);t===2&&(Ke(),ce=2),t===1&&(Ke(),ce=2,yt=!0)}return ie.forEach((t,r)=>jt(t,r===q+k*J)),1;case 2:return vt()&&(Ze(Te[0],Te[1]),ie.forEach(t=>Xt(t)),ce=1,yt)?0:1}},rr=e=>{Xe(e,gt),ie.forEach(t=>Ge(e,t)),Qt(e,gt),$t(e)},ar=e=>{if(ve(Tt,Et),Ze(-10,-10),[k,tiles]=e.split(":"),k=Number(k),ce=0,yt=!1,!e||!k||k<0)return 0;gt=g(v(),{x:Tt/3,y:Et*2/3,rx:-_e(30),rz:-.5}),(parsedTiles=[]).length=k*k,parsedTiles.fill("a");for(let t=0,r=0;t<tiles.length;t++){let a=tiles.charAt(t);if(Number(a)){let n=Number(a);parsedTiles.fill(tiles.charAt(++t),r,r+n),r+=n}else parsedTiles[r++]=a}(ie=[]).length=0;for(let t=0;t<k;t++)for(let r=0;r<k;r++){let a=parsedTiles[r+t*k];a==="x"&&(Te[0]=r,Te[1]=t),ie.push(O(r,t,a))}return 1};let or,wt,ir,nr,lr,ne,qe=`attribute vec2 aVertexPosition;
varying vec2 vST;

void main() {
  gl_Position = vec4(aVertexPosition.xy, .9, 1.);
  vST = (aVertexPosition+1.)/2.;
}`,Je=`precision mediump float;
varying vec2 vST;
uniform float uTime;`,Mt=`
float hash(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float newrand(vec2 p, float num) {
  return fract(hash(p) * num);
}`,Wr=`
float circle(vec2 p, float r) {
  return distance(vST,p)-r;
}`,St=`
  mat2 scale(vec2 _s) {
  return mat2(_s.x,0.,0.,_s.y);
}`,Ct=`
  mat2 rot(float r) {
  return mat2(cos(r), -sin(r), sin(r), cos(r));
}`,Kr=Je+Wr+Mt+`
void main() {
  vec3 col = vec3(.58,.64,.75);
  float light = 1.-circle(vec2(.8,.9),.1);
  float mnt1 = step(vST.y, abs( sin(vST.x * 8. + uTime) ) / 4. + .3) / 3.;
  float mnt2 = step(vST.y, abs( cos(vST.x * 6. - uTime) ) / 4. + .1) / 2.;
  vec3 back = mix(vec3(light+max(mnt1,mnt2)), col, .7);
  gl_FragColor = vec4(vec3(back), 1.0);
}`,Zr=Je+Mt+St+Ct+`
float star(vec2 p, float r) {
  return smoothstep(.01, 1., r/length(p));
}
vec3 layer(vec2 u) {
  vec2 grid = fract(u) - .5;
  vec2 id = floor(u) / 8.;
  float size = newrand(id, 1.)/40.; 
  float stars = star(grid + vec2((newrand(id, 10.)-.5)/2., (newrand(id, 20.)-.5)/2.), size);
  vec3 col = sin(vec3(newrand(id, 35.),newrand(id, 66.),newrand(id,93.))*2.+uTime) / 2. + .5;
  col *= vec3(.8,.7,.9);
  col += .5;
  return stars * col;
}
void main() {
  vec3 col = vec3(0.);
  for(float i=0.; i<1.; i+=.2) {
    float depth = fract(uTime/16. + i);
    float scale = mix(20., .5, depth);
    col += layer(vST * rot(uTime/8.) * scale + i*32.) * depth;
  }
  gl_FragColor = vec4(col, 1.0);
}`,qr=Je+St+Ct+`
void main() {
  vec3 col = vec3(0.8, .06, .9);
  vec3 sun = vec3(.3, .13, .2);
  vec2 st = vST * scale(vec2(vST.y + .5, -vST.y*2.)) - vec2(-uTime/8., uTime/8.);
  st += vec2(.5,.0);
  st *= rot(.01);
  vec2 lines = step(vec2(.05), fract(st*16.));
  float grid = 1.-(lines.x*lines.y);
  float faded = min(grid, 0.6-vST.y);
  float light = .2/length(vST - vec2(.95));
  vec3 final = mix(vec3(faded), col, .3);
  final = mix(final, sun, mix(vec3(light), vec3(1.,0.,0.),vST.y));
  gl_FragColor = vec4(final, 1.0);
}`,Jr=Je+Mt+St+Ct+`
void main() {
  float y = vST.y * 8.;
  float x = vST.x * 8. + uTime;
  float curve = y + vST.x - sin(x)/2. + sin(uTime);
  float lines = step(.01, fract(curve));
  vec2 id = vec2(floor(curve));
  vec3 col = vec3(newrand(id, 83.), newrand(id, 23.), newrand(id, 65.));
  col = mix(col, vec3(curve, .9-vST.x, vST.y), .4);
  gl_FragColor = vec4(vec3(lines-col), 1.0);
}`,sr=e=>{wt=B(e,qe,Kr),ir=B(e,qe,Zr),nr=B(e,qe,qr),lr=B(e,qe,Jr),ne=wt,or=V(e,e.ARRAY_BUFFER,[-1,1,-1,-1,1,1,1,-1])},mr=e=>{switch(e){case 0:Ae([.58,.64,.75]),ne=wt;break;case 1:Ae([0,0,0]),ne=ir;break;case 2:Ae([1,.16,1]),ne=nr;break;case 3:Ae([1,1,1]),ne=lr;break}},Qe=(e,t)=>{ne.use(),or.bind(2,ne.attribs.vertex),e.uniform1f(ne.uniforms.time,t/1e4),e.drawArrays(e.TRIANGLE_STRIP,0,4)};let Lt=!1,ur=(e,t,r)=>{sr(e),er(e,t,r)},$e=ar,pr=()=>Lt=!0,fr=()=>l.esc||Lt?(Lt=!1,2):(l.mouse.down&&(Ve(l.mouse.x,l.mouse.y),l.mouse.x=l.mouse.y=0),tr()),cr=(e,t)=>{Qe(e,t),rr(e)};let P=0,A=0,zt=v(),et=0,le=.1,D=[0,0],E=[0,0],Ee,dr,hr=()=>{et=0,zt=v(),platforms=[],P=0,A=0,D=[0,0],E=[0,0]},Ne=(e,t)=>{P=e,A=t,D=[e,t],E=[e,t]},Qr=`attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uParentTransform;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uParentTransform * uModelViewMatrix * aVertexPosition;
}`,$r=`precision mediump float;
void main() {
  gl_FragColor = vec4(1.,1.,1.,1.);
}`,xr=e=>{Ee=B(e,Qr,$r),dr=V(e,e.ARRAY_BUFFER,[0,0,y,0,y,y,0,y])},br=()=>{switch(et){case 0:(l.up||l.down||l.left||l.right)&&(et=1,l.up?E[1]--:l.down?E[1]++:l.left?E[0]--:l.right&&E[0]++);break;case 1:let e=0,t=0;D[0]!==E[0]?(D[0]<E[0]?(D[0]+=le,e+=le):(D[0]-=le,e-=le),Math.abs(D[0]-E[0])<.01&&(D[0]=E[0])):D[1]!==E[1]?(D[1]<E[1]?(D[1]+=le,t+=le):(D[1]-=le,t-=le),Math.abs(D[1]-E[1])<.01&&(D[1]=E[1])):(P=E[0],A=E[1],et=0),g(zt,{x:e*(y+F),y:t*(y+F)})}},vr=(e,t)=>{Ee.use(),dr.bind(2,Ee.attribs.vertex),e.uniformMatrix4fv(Ee.uniforms.parentTransform,!1,t),e.uniformMatrix4fv(Ee.uniforms.projectionMatrix,!1,K),e.uniformMatrix4fv(Ee.uniforms.modelMatrix,!1,zt),e.drawArrays(e.LINE_LOOP,0,4)};let h=1,tt=0,kt=v(),w=[],U=[],Pt,At,Dt=!1,Q=1,$=1,rt=()=>{tt=0,ve(Pt,At),kt=g(v(),{x:Pt/3,y:At*2/3,rx:-_e(30),rz:-.5}),Q=$=h=1,hr(),w=[["x"]],U=[[O(0,0,"x",!0)]]},gr=(e,t,r)=>{Pt=t,At=r,xr(e)},Nt=()=>Dt=!0,yr=()=>{let e=[];for(let t=0;t<h;t++){let r=w[t],a=r[0],n="",o=0;for(let s=1;s<=h;s++){let u=r[s];u!==a?(n+=o<1?a:o+1+a,a=u,o=0):o===8?(n+=o+1+a,a=u,o=0):o++}e.push(n)}for(rowLength=0;e[rowLength++]===h+"a";)e.shift();for(rowLength=h-1;e[rowLength--]===h+"a";)e.pop();return h+":"+e.reduce((t,r)=>t+r,"")},Tr=()=>{if(l.esc||Dt)return Dt=!1,2;l.mouse.down&&(Ve(l.mouse.x,l.mouse.y),l.mouse.x=l.mouse.y=0);switch(tt){case 0:if(br(),(P<0||A<0||P>=h||A>=h)&&(P<0&&(w.map((e,t)=>{w[t].unshift("a"),U[t].unshift(O(-Q,t+1-$,"a",!0))}),Q++,w.push(at()),U.push(Ft()),Ne(0,A)),P>=h&&(w.map((e,t)=>{w[t].push("a"),U[t].push(O(h+1-Q,t+1-$,"a",!0))}),w.push(at()),U.push(Ft()),Ne(h,A)),A<0&&(w.map((e,t)=>{w[t].push("a"),U[t].push(O(h+1-Q,t+1-$,"a",!0))}),w.unshift(at()),U.unshift(ta()),Ne(P,0),$++),A>=h&&(w.map((e,t)=>{w[t].push("a"),U[t].push(O(h+1-Q,t+1-$,"a",!0))}),w.push(at()),U.push(Ft()),Ne(P,h)),h++),l.space){let e=w[A][P],t=ea(e);w[A][P]=t,U[A][P]=O(P+1-Q,A+1-$,t,!0),tt=1}break;case 1:l.space||(tt=0)}return 3},Er=(e,t)=>{vr(e,kt),Xe(e,kt),U.forEach(r=>r.forEach(a=>Ge(e,a))),Qe(e,t)},ea=e=>{let t=Vt(),r=t.indexOf(e);return r===t.length-1?t[0]:t[r+1]},at=()=>{let e=[];return e.length=h+1,e.fill("a"),e},ta=()=>{let e=[];for(i=0;i<h+1;i++)e[i]=O(i+1-Q,-$,"a",!0);return e},Ft=()=>{let e=[];for(i=0;i<h+1;i++)e[i]=O(i+1-Q,h+1-$,"a",!0);return e};let m={hasCoil:!1,editedLevel:!1,touchControls:!1,state:0,level:0},wr=()=>{m.hasCoil||document.monetization&&document.monetization.addEventListener("monetizationstart",function(){m.hasCoil=!0})},f,Mr=()=>f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),Sr=(e,t,r)=>{f=e.getContext("webgl"),ve(t,r),ur(f,t,r),gr(f,t,r),f.viewport(0,0,f.drawingBufferWidth,f.drawingBufferHeight),f.clearColor(.1,.1,.1,1),f.clearDepth(1),f.enable(f.DEPTH_TEST),f.enable(f.CULL_FACE),f.enable(f.LEQUAL)},Cr=(e,t)=>(f.viewport(0,0,f.canvas.width,f.canvas.height),m.state=fr(e),Mr(),cr(f,t),m.state===1),Lr=(e,t)=>(f.viewport(0,0,f.canvas.width,f.canvas.height),m.state=Tr(e),Mr(),Er(f,t),m.state===3);let Fe=document.getElementById("ui"),de=document.getElementById("hud"),I="centered fadein",j="centered fadeout",It="visible",Ie="hidden",Rt="",zr="js13k-20-fourfold",ee=500,se=(e,t,r)=>{let a=document.createElement(e);return a.id=t,a.innerText=r||"",a},M=(e,t)=>se("div",t,e),p=(e,t,r)=>{let a=M(e,t);return a.onclick=n=>{Gt(),r(n)},a},N=e=>{Fe.style.visibility=It,de.style.visibility=Ie,Fe.innerHTML=Rt,Fe.append(e),wr()},ot=()=>Number(localStorage.getItem(zr))||0,kr=e=>localStorage.setItem(zr,e);let Pr=["7:5bca6ba6ba6bax5ba","6:x3bab5ab5ab5ab6a5ac","7:5babx4bab5bac","8:cab5a2aba2b2axb6aa2ba2b2a","7:bab3acbab3abbab3abxababab4abab","10:2bab6a3ab6a2bacabx3a4a2b4aa2b7aaba2b5","9:2baxbab2a6ab2ac2a2b4ab5ab2a3a2bab2a","5:3bacb4axb3a2b3a","7:2ac4a2ab4a7aa2b4abx2b3a","6:x3b2a6a2a2bac","6:x2babaa2baba3a2ba3abac","9:3aba4bxbab5a3a2b2aba5acaba","6:abab2aaba2baxb2abaaba2ba6a3ac2a","6:b3dadxb2dadb3dac","6:2acb2adx4aababda4abadbdada","6:dbac2aad4axadb2abdbd2a6adbd3a","10:8aca3adad4a3adada2babx2dad4a3adadabda3adad4a8ac","8:xbdbadacbdbdab2adbdbad2abdbd2aba","7:5aca3adb2ax2dadba2db2d2a","9:2adbdb3a9ab2d2a2d2ax2d2a2dac9a2adbdb3a"];let Ar=(e,t)=>{let r=0,a=function(n){let o=n-r;r=n,o>500&&(o=500),e(o/1e3,n)?requestAnimationFrame(a):t()};requestAnimationFrame(a)};let it=p("☐ TOUCH CONTROLS","button",e=>{m.touchControls?(m.touchControls=!1,e.target.innerText="☐ TOUCH CONTROLS"):(m.touchControls=!0,e.target.innerText="☑ TOUCH CONTROLS")}),Re=(e,t,r="")=>{let a=M(r,e);return a.onpointerdown=n=>{onkeydown({keyCode:mt[t]}),n.preventDefault()},a.onpointerup=n=>{onkeyup({keyCode:mt[t]}),n.preventDefault()},a},ra=Re("b0","up"),aa=Re("b1","right"),oa=Re("b2","left"),ia=Re("b3","down"),Dr=Re("button","space","⮤⮧");Dr.className="b4";let na=e=>{let t=document.createElement("div");return t.id="controls",t.append(ra,aa,oa,ia),e&&t.append(Dr),t},Nr=e=>{de.style.visibility=It,fadeOut=()=>de.style.visibility=Ie;let t=p("II","pausebutton",()=>{fadeOut(),e?Nt():pr()}),r=document.createElement("div");if(r.id="hudmenu",r.append(t),e){let a=p("✓","pausebutton",()=>{fadeOut(),Nt(),m.editedLevel=!0}),n=p("↺","pausebutton",rt);r.append(a,n)}de.innerHTML=Rt,de.append(r),m.touchControls&&de.append(na(e))};let Fr=e=>{let t=se("div","pausemenu");t.className=I;let r=()=>t.className=j,a=se("div","dropdown"),n=m.hasCoil?["morning","night","retrowave","abstract"]:["morning","night"];a.append(...n.map((d,b)=>{let X=p(d,"dropitem",()=>mr(b));return X}));let o=se("div","button","THEME ▾");o.className="themebtn",o.append(a),t.onclick=d=>a.style.visibility=d.target.matches(".themebtn")?"visible":"hidden";let s=M("PAUSED","title"),u=p("RESUME","button",()=>{r(),e()}),c=p("MAIN MENU","button",()=>{r(),setTimeout(_,500)});t.append(s,u,o,it,c),N(t)},Ir=()=>{let e=document.createElement("div");e.id="pausemenu",e.className=I;let t=()=>e.className=j,r=M("LEVEL CREATED","subtitle"),a=document.createElement("input");a.value=yr(),a.readOnly=!0;let n=se("a","button","SHARE 🐦");n.href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fjs13kgames.com%2Fentries%2Ffourfold&text=Checkout%20this%20custom%20level%20I%20made%20in%20Fourfold%3A%20%22"+a.value.replace(":","%3A")+"%22",n.target="_blank";let o=p("MAIN MENU","button",()=>{t(),setTimeout(_,500)});setTimeout(()=>{a.focus(),a.select()},50),e.append(r,a,n,o),N(e)};let la=()=>{let e=document.createElement("div");e.id="mainmenu",e.className=I;let t=()=>e.className=j,r=p("←","backbutton",()=>{t(),setTimeout(Me,ee)}),a=M("ENTER LEVEL DATA","subtitle"),n=document.createElement("input"),o=p("START","button",()=>{$e(n.value)?(t(),m.level=0,setTimeout(we,ee,!1)):n.className="wrong"});e.append(r,a,n,o),N(e)},Me=()=>{let e=document.createElement("div");e.id="mainmenu",e.className=I;let t=()=>e.className=j,r=M("CUSTOM LEVELS","subtitle"),a=p("←","backbutton",()=>{t(),setTimeout(_,ee)}),n=p("LOAD LEVEL","button",()=>{t(),setTimeout(la,ee)}),o=p("CREATE LEVEL","button",()=>{t(),rt(),setTimeout(we,ee,!0)});e.append(a,r,n,o),N(e)};let sa=e=>{let t=document.createElement("div");t.id="pausemenu",t.className=I;let r=()=>t.className=j,a=M("COMPLETED!","subtitle"),n=p("CONTINUE","button",()=>{r(),setTimeout(e?Me:nt,500)}),o=p("MAIN MENU","button",()=>{r(),setTimeout(_,500)});if(Kt(),e||ot()<m.level&&kr(m.level),m.level===20){let s=se("p","","You have completed all the levels. Now go create your own!"),u=p("CUSTOM LEVELS","button",()=>{r(),setTimeout(Me,500)});t.append(a,s,u,o)}else t.append(a,n,o);N(t)},we=e=>{N(),Fe.style.visibility=Ie,Nr(e),Ar(e?Lr:Cr,()=>{m.state?e&&m.editedLevel?(m.editedLevel=!1,Ir()):Fr(()=>we(e)):sa(m.level<1)})};let nt=()=>{let e=document.createElement("div");e.id="mainmenu",e.className=I;let t=()=>e.className=j,r=p("←","backbutton",()=>{t(),setTimeout(_,ee)}),a=M("SELECT LEVEL","subtitle"),n=document.createElement("div");n.id="levelsgrid";let o=ot();n.append(r),n.append(...Pr.map((s,u)=>{let c=()=>{m.level=u+1,t(),$e(s),setTimeout(we,ee,!1)},d=p(u+1,"level",u<=o?c:()=>{});return d.className=u<o?"completed":u>o?"blocked":"active",d})),e.append(r,a,n),N(e)};let _=()=>{let e=document.createElement("div");e.id="mainmenu",e.className=I;let t=()=>e.className="centered zoomin",r=M("FOURFOLD","title"),a=p("START","button",()=>{t(),setTimeout(nt,500)}),n=p("CUSTOM LEVELS","button",()=>{t(),setTimeout(Me,500)});e.append(r,a,n,it),N(e)};let Be=document.getElementById("app"),Oe=1280,Ue=720,Rr=Oe/Ue;Be.width=Oe;Be.height=Ue;Sr(Be,Oe,Ue);onresize=()=>{Be.height=Math.min(innerHeight,innerWidth<Oe?Math.floor(innerWidth/Rr):Ue),Be.width=Math.min(innerWidth,innerHeight<Ue?Math.floor(innerHeight*Rr):Oe)};onresize();_();})();
//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
