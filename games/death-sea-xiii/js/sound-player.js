"use strict";var CPlayer=function(){function z(r){return Math.sin(6.283184*r)}function E(r){return.003959503758*2**((r-128)/12)}var F,G,H,J,K,N=[z,function(r){return r%1<.5?1:-1},function(r){return r%1*2-1},function(r){r=r%1*4;return r<2?r-1:3-r}];this.init=function(r){G=(F=r).endPattern,H=0,J=r.rowLen*r.patternLen*(G+1)*2,K=new Int32Array(J)},this.generate=function(){for(var r,n,i,t,e,a,f,o=new Int32Array(J),u=F.songData[H],c=F.rowLen,h=F.patternLen,v=0,s=0,w=!1,g=[],l=0;l<=G;++l)for(i=u.p[l],r=0;r<h;++r){for(var y=i?u.c[i-1].f[r]:0,A=(y&&(u.i[y-1]=u.c[i-1].f[r+h]||0,y<17)&&(g=[]),N[u.i[16]]),M=u.i[17]/512,L=2**(u.i[18]-9)/c,d=u.i[19],p=u.i[20],C=43.23529*u.i[21]*3.141592/44100,D=1-u.i[22]/255,I=1e-5*u.i[23],m=u.i[24]/32,B=u.i[25]/512,P=6.283184*2**(u.i[26]-9)/c,U=u.i[27]/255,W=u.i[28]*c&-2,b=(l*h+r)*c,j=0;j<4;++j)if(n=i?u.c[i-1].n[r+j*h]:0){g[n]||(g[n]=function(r,n,i){for(var t,e,a,f,o=N[r.i[0]],u=r.i[1],c=r.i[3]/32,h=N[r.i[4]],v=r.i[5],s=r.i[8]/32,w=r.i[9],g=r.i[10]*r.i[10]*4,l=r.i[11]*r.i[11]*4,y=r.i[12]*r.i[12]*4,A=1/y,M=-r.i[13]/16,L=r.i[14],d=i*2**(2-r.i[15]),p=new Int32Array(g+l+y),C=0,D=0,I=0,m=0;I<g+l+y;I++,m++)0<=m&&(m-=d,a=E(n+(15&(L=L>>8|(255&L)<<4))+r.i[2]-128),f=E(n+(15&L)+r.i[6]-128)*(1+8e-4*r.i[7])),t=1,I<g?t=I/g:g+l<=I&&(t=(1-(t=(I-g-l)*A))*3**(M*t)),e=o(C+=a*t**c)*u,e+=h(D+=f*t**s)*v,w&&(e+=(2*Math.random()-1)*w),p[I]=80*e*t|0;return p}(u,n,c));for(var k=g[n],q=0,x=2*b;q<k.length;q++,x+=2)o[x]+=k[q]}for(q=0;q<c;q++)(e=o[t=2*(b+q)])||w?(a=C,d&&(a*=A(L*t)*M+.5),s+=(a=1.5*Math.sin(a))*(a=D*(e-s)-(v+=a*s)),e=3==p?s:1==p?a:v,I&&(e=(e*=I)<1?-1<e?z(.25*e):-1:1,e/=I),w=1e-5<(e*=m)*e,f=e*(1-(a=Math.sin(P*t)*B+.5)),e*=a):f=0,W<=t&&(f+=o[t-W+1]*U,e+=o[t-W]*U),o[t]=0|f,o[1+t]=0|e,K[t]+=0|f,K[1+t]+=0|e}return++H/F.numChannels},this.createAudioBuffer=function(r){for(var n=r.createBuffer(2,J/2,44100),i=0;i<2;i++)for(var t=n.getChannelData(i),e=i;e<J;e+=2)t[e>>1]=K[e]/65536;return n},this.createWave=function(){var r=44+2*J-8,n=r-36,i=new Uint8Array(44+2*J);i.set([82,73,70,70,255&r,r>>8&255,r>>16&255,r>>24&255,87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,255&n,n>>8&255,n>>16&255,n>>24&255]);for(var t=0,e=44;t<J;++t){var a=K[t];i[e++]=255&(a=a<-32767?-32767:32767<a?32767:a),i[e++]=a>>8&255}return i},this.getData=function(r,n){for(var i=2*Math.floor(44100*r),t=new Array(n),e=0;e<2*n;e+=1){var a=i+e;t[e]=0<r&&a<K.length?K[a]/32768:0}return t}};