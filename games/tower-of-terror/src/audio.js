let pl_synth_init=t=>{let e=44100,l=4096,r=4095,a=new Float32Array(16384),n=3639956645,o=(t,e,o,f,h=0,g=0,i=0,u=0,M=0,w=0,y=0,p=0,s=0,A=0,C=0,D=0,c=0,F=0,B=0,_=0,d=0,m=0,b=0,j=0,k=0,q=0,v=0,x=0,z=0,E=0,G=0,H=0,I=0,J=0)=>{let K=1/255,L=J*l,N=y*l,O=c*l,P=Math.pow(2,x-8)/t,Q=z/512,R=I/512,S=Math.pow(2,H-8)/t*l,T=0,U=0,V=k*K,W=4.6566e-10*F,X=0,Y=0,Z=0,$=1/B,tt=1/d,et=.00390625*Math.pow(1.059463094,e+12*(g-8)+i-128)*(1+8e-4*u),lt=.00390625*Math.pow(1.059463094,e+12*(p-8)+s-128)*(1+8e-4*A);for(let t=B+_+d-1;t>=0;--t){let e,g=t+h,i=a[L+(g*S&r)]*R+.5,u=0,y=j,p=1;t<B?p=t*$:t>=B+_&&(p-=(t-B-_)*tt),e=et,E&&(e*=i),M&&(e*=p*p),T+=e,u+=a[N+(T*l&r)]*w,e=lt,C&&(e*=p*p),U+=e,u+=a[O+(U*l&r)]*D,F&&(n^=n<<13,n^=n>>17,n^=n<<5,u+=n*W*p),u*=p*K,b&&(G&&(y*=i),y=1.5*a[.046439909297052155*y&r],X+=y*Y,Z=V*(u-Y)-X,Y+=y*Z,u=[u,Z,X,Y,X+Z][b]),e=a[g*P*l&r]*Q+.5,u*=.00238*m,o[g]+=u*(1-e),f[g]+=u*e}},f=t=>{for(let e=0;e<t.length;e++)t[e]=Array.isArray(t[e])?f(t[e]):t[e]??0;return t},h=(t,e)=>{let l=t[20]*e>>1,r=t[21]/255,a=Math.ceil(Math.log(.1)/Math.log(r));return t[13]+t[14]+t[15]+a*l},g=(t,e,l,r,a)=>{if(!a[21])return;let n=a[20]*r>>1,o=a[21]/255,f=t.length-n;for(let r=l,a=l+n;r<f;r++,a++)t[a]+=e[r]*o,e[a]+=t[r]*o};for(let t=0;t<l;t++)a[t]=Math.sin(6.283184*t/l),a[t+l]=a[t]<0?-1:1,a[t+8192]=t/l-.5,a[t+12288]=t<2048?t/1024-1:3-t/1024;return{sound:(l,r=147,a=5513)=>{l=f(l);let n=h(l,a),i=t.createBuffer(2,n,e),u=i.getChannelData(0),M=i.getChannelData(1);return o(a,r,u,M,0,...l),g(u,M,0,a,l),i},song:l=>{let r=(l=f(l))[0],a=l[1],n=0;for(let t of a){let e=t[1].length*r*32+h(t[0],r);e>n&&(n=e)}let i=t.createBuffer(2,n,e),u=i.getChannelData(0),M=i.getChannelData(1),w=new Float32Array(n),y=new Float32Array(n);for(let t of a){let e=t[0],l=t[1],a=0,f=n;w.fill(0),y.fill(0);for(let n of l)for(let l=0;l<32;l++){let h=t[2][n-1]?.[l];h&&(f=Math.min(f,a),o(r,h,w,y,a,...e)),a+=r}g(w,y,f,r,e);for(let t=f;t<n;t++)u[t]+=w[t],M[t]+=y[t]}return i}}};

// https://phoboslab.org/synth

let audioContext = new AudioContext();
let synth;
let badLuckSound;
let goodLuckSound;
let portalSound;
let levelWonSound;
let levelLostSound;
let escapedSound;
let songBuffer;

function initSound() {
    synth = pl_synth_init(audioContext);
    badLuckSound = synth.sound([7,3,140,1,232,3,8,,9,1,139,3,,4611,1403,34215,256,4,1316,255,,,,1,,1,7,255]);
    goodLuckSound = synth.sound([7,3,140,1,232,3,8,,9,1,139,3,,4611,1403,34215,256,4,1316,255,,,,1,,1,7,255]);
    portalSound = synth.sound([7,3,140,1,232,3,8,,9,1,139,3,,4611,1403,34215,256,4,1316,255,,,,1,,1,7,255]);
    levelWonSound = synth.sound([7,3,140,1,232,3,8,,9,1,139,3,,4611,1403,34215,256,4,1316,255,,,,1,,1,7,255]);
    levelLostSound = synth.sound([7,3,140,1,232,3,8,,9,1,139,3,,4611,1403,34215,256,4,1316,255,,,,1,,1,7,255]);
    escapedSound = synth.sound([7,3,140,1,232,3,8,,9,1,139,3,,4611,1403,34215,256,4,1316,255,,,,1,,1,7,255]);
    songBuffer = synth.song([5513,[[[7,0,0,0,255,2,8,0,18,0,255,2,0,100000,56363,100000,199,2,200,254,8,24],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[[139,0,0,0,0,0,0,0,140,0,0,0,0,0,0,0,142,0,0,0,0,0,0,0,144]]],[[7,0,0,0,255,2,8,0,18,0,255,2,0,100000,56363,100000,199,2,200,254,8,24],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[[149]]],[[7,0,0,1,255,0,7,0,0,1,255,0,0,50,150,4800,200,2,600,254],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[[144,144,144,144,144,0,144,0,144,144,144,144,144,0,144,0,144,0,144,0,144,0,144,0,144,144,144,144,144,0,144]]]]]);
}

function play(sound, loop = false) {
    if (sound) {
        let source = audioContext.createBufferSource();
        source.buffer = sound;
        source.loop = loop;
        source.connect(audioContext.destination);
        source.start();
        return source;
    }
}
