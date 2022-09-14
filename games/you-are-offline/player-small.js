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
var CPlayer=function(){var N=function(a){return Math.sin(6.283184*a)},G=[N,function(a){return.5>a%1?1:-1},function(a){return a%1*2-1},function(a){a=a%1*4;return 2>a?a-1:3-a}],w,H,A,t,l;this.init=function(a){w=a;H=a.endPattern;A=0;t=a.rowLen*a.patternLen*(H+1)*2;l=new Int32Array(t)};this.generate=function(){var a,f,g,b,h,k=new Int32Array(t),d=w.songData[A],u=w.rowLen,B=w.patternLen,I=0,C=0,m;var n=!1;var D=[];for(f=0;f<=H;++f){var x=d.p[f];for(g=0;g<B;++g){if(h=x?d.c[x-1].f[g]:0)d.i[h-1]=d.c[x-1].f[g+
B]||0,16>h&&(D=[]);var W=G[d.i[15]],X=d.i[16]/512,Y=Math.pow(2,d.i[17]-9)/u,Z=d.i[18],O=d.i[19],aa=135.82764118168*d.i[20]/44100,ba=1-d.i[21]/255,J=1E-5*d.i[22],ca=d.i[23]/32,da=d.i[24]/512,ea=6.283184*Math.pow(2,d.i[25]-9)/u,P=d.i[26]/255,K=d.i[27]*u&-2;h=(f*B+g)*u;for(b=0;4>b;++b)if(a=x?d.c[x-1].n[g+b*B]:0){if(!D[a]){var c=D;var q=a;var Q=m=void 0,E,p,e=d,R=a,fa=G[e.i[0]],ha=e.i[1],ia=e.i[3],ja=G[e.i[4]],ka=e.i[5],la=e.i[8],S=e.i[9],v=e.i[10]*e.i[10]*4,F=e.i[11]*e.i[11]*4,L=e.i[12]*e.i[12]*4,ma=
1/L,y=e.i[13],na=u*Math.pow(2,2-e.i[14]),T=new Int32Array(v+F+L),U=0,V=0;for(E=p=0;p<v+F+L;p++,E++){0<=E&&(y=y>>8|(y&255)<<4,E-=na,Q=.003959503758*Math.pow(2,(R+(y&15)+e.i[2]-128-128)/12),m=.003959503758*Math.pow(2,(R+(y&15)+e.i[6]-128-128)/12)*(1+8E-4*e.i[7]));var r=1;p<v?r=p/v:p>=v+F&&(r-=(p-v-F)*ma);var z=Q;ia&&(z*=r*r);U+=z;var M=fa(U)*ha;z=m;la&&(z*=r*r);V+=z;M+=ja(V)*ka;S&&(M+=(2*Math.random()-1)*S);T[p]=80*M*r|0}c[q]=T}q=D[a];a=0;for(c=2*h;a<q.length;a++,c+=2)k[c]+=q[a]}for(a=0;a<u;a++)b=2*
(h+a),(c=k[b])||n?(n=aa,Z&&(n*=W(Y*b)*X+.5),n=1.5*Math.sin(n),I+=n*C,c=ba*(c-C)-I,C+=n*c,c=3==O?C:1==O?c:I,J&&(c*=J,c=1>c?-1<c?N(.25*c):-1:1,c/=J),c*=ca,n=1E-5<c*c,q=Math.sin(ea*b)*da+.5,m=c*(1-q),c*=q):m=0,b>=K&&(m+=k[b-K+1]*P,c+=k[b-K]*P),k[b]=m|0,k[b+1]=c|0,l[b]+=m|0,l[b+1]+=c|0}}A++;return A/w.numChannels};this.createWave=function(){var a=44+2*t-8,f=a-36,g=new Uint8Array(44+2*t);g.set([82,73,70,70,a&255,a>>8&255,a>>16&255,a>>24&255,87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,68,172,0,0,16,177,
2,0,4,0,16,0,100,97,116,97,f&255,f>>8&255,f>>16&255,f>>24&255]);a=0;for(f=44;a<t;++a){var b=l[a];b=-32767>b?-32767:32767<b?32767:b;g[f++]=b&255;g[f++]=b>>8&255}return g};this.getData=function(a,f){for(var g=2*Math.floor(44100*a),b=Array(f),h=0;h<2*f;h+=1){var k=g+h;b[h]=0<a&&k<l.length?l[k]/32768:0}return b}};