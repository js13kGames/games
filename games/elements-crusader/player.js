/* -*- mode: javascript; tab-width: 4; indent-tabs-mode: nil; -*-
*
* Copyright (c) 2011-2013 Marcus Geelnard
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
*
* 3. This notice may not be removed or altered from any source
*    distribution.
*
*/
var CPlayer=function(){var M=function(a){return Math.sin(6.283184*a)},G=[M,function(a){return.5>a%1?1:-1},function(a){return a%1*2-1},function(a){a=a%1*4;return 2>a?a-1:3-a}],A,H,B,t,m;this.init=function(a){A=a;H=a.endPattern-2;B=0;t=a.rowLen*a.patternLen*(H+1)*2;m=new Int32Array(t)};this.generate=function(){var a,b,g,f,c,k,n,u,h,s=new Int32Array(t),d=A.songData[B],y=A.rowLen,C=A.patternLen,D=0,z=0,p;h=!1;var E=[];for(g=0;g<=H;++g)for(k=d.p[g],f=0;f<C;++f){if(u=k?d.c[k-1].f[f]:0)d.i[u-1]=d.c[k-1].f[f+ C]||0,14>u&&(E=[]);var R=G[d.i[13]],S=d.i[14]/512,T=Math.pow(2,d.i[15]-9)/y,U=d.i[16],N=d.i[17],V=135.82764118168*d.i[18]/44100,W=1-d.i[19]/255,I=1E-5*d.i[20],X=d.i[21]/32,Y=d.i[22]/512,Z=6.283184*Math.pow(2,d.i[23]-9)/y,O=d.i[24]/255,J=d.i[25]*y;u=(g*C+f)*y;for(c=0;4>c;++c)if(b=k?d.c[k-1].n[f+c*C]:0){if(!E[b]){a=E;n=b;var e=d,v=b;p=G[e.i[0]];for(var $=e.i[1],aa=e.i[3],ba=G[e.i[4]],ca=e.i[5],da=e.i[8],P=e.i[9],w=e.i[10]*e.i[10]*4,F=e.i[11]*e.i[11]*4,K=e.i[12]*e.i[12]*4,ea=1/K,Q=new Int32Array(w+F+ K),fa=.003959503758*Math.pow(2,(v+e.i[2]-128-128)/12),e=.003959503758*Math.pow(2,(v+e.i[6]-128-128)/12)*(1+8E-4*e.i[7]),L=v=0,q=void 0,l=void 0,r=void 0,x=void 0,q=0;q<w+F+K;q++)l=1,q<w?l=q/w:q>=w+F&&(l-=(q-w-F)*ea),r=fa,aa&&(r=r*l*l),v+=r,x=p(v)*$,r=e,da&&(r=r*l*l),L+=r,x+=ba(L)*ca,P&&(x+=(2*Math.random()-1)*P),Q[q]=80*x*l|0;a[n]=Q}n=E[b];b=0;for(a=2*u;b<n.length;b++,a+=2)s[a]+=n[b]}for(b=0;b<y;b++)c=2*(u+b),(a=s[c])||h?(h=V,U&&(h*=R(T*c)*S+.5),h=1.5*Math.sin(h),D+=h*z,a=W*(a-z)-D,z+=h*a,a=3==N? z:1==N?a:D,I&&(a*=I,a=1>a?-1<a?M(.25*a):-1:1,a/=I),a*=X,h=1E-5<a*a,n=Math.sin(Z*c)*Y+.5,p=a*(1-n),a*=n):p=0,c>=J&&(p+=s[c-J+1]*O,a+=s[c-J]*O),s[c]=p|0,s[c+1]=a|0,m[c]+=p|0,m[c+1]+=a|0}B++;return B/8};this.createWave=function(){var a=2*t-8,b=a-36,g=new Uint8Array(44+2*t);g.set([82,73,70,70,a&255,a>>8&255,a>>16&255,a>>24&255,87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,b&255,b>>8&255,b>>16&255,b>>24&255]);a=0;for(b=44;a<t;++a){var f=m[a],f=-32767>f?-32767: 32767<f?32767:f;g[b++]=f&255;g[b++]=f>>8&255}return g};this.getData=function(a,b){for(var g=2*Math.floor(44100*a),f=Array(b),c=0;c<2*b;c+=1){var k=g+c;f[c]=0<a&&k<m.length?m[k]/32768:0}return f}};