function handshake(){

let peer,channel,stream=null;
let lastbarcode=null;
let lastscanned="";

const box=element("div");
box.style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;background:black;gap:10px;padding:10px;overflow:auto";

const canvas=element("canvas",box);
canvas.style.width="90vw";
canvas.style.maxWidth="400px";
canvas.style.height="auto";
const ctx=canvas.getContext("2d");

const video=element("video");
video.style="display:none";
video.autoplay=video.muted=video.playsInline=true;

const overlay=element("div");
overlay.style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;font:20px sans-serif;color:white;background:rgba(0,128,0,0.8);z-index:999;opacity:0;transition:opacity 0.3s";
overlay.textContent="SCAN OK!";










//camera
navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(async s=>{
stream=video.srcObject=s;
await video.play();
const detector=new window.BarcodeDetector({formats:["data_matrix"]});
const loop=async ()=>{
  canvas.width=video.videoWidth;
  canvas.height=video.videoHeight;
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  let w=200,h=200,x=(canvas.width-w)/2,y=(canvas.height-h)/2;
  ctx.strokeStyle="#0f0";ctx.lineWidth=4;ctx.strokeRect(x,y,w,h);
  try{
    const codes=await detector.detect(canvas);
    if(codes.length)await processbarcode(codes[0].rawValue);
  }catch{}
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
});










//initial barcode
(async function(){
  peer = new RTCPeerConnection();
  channel = peer.createDataChannel("x");
  channel.onopen = () => launchgame("a");
  await peer.setLocalDescription(await peer.createOffer());
  await new Promise(resolve => { peer.onicecandidate = e => { if (e.candidate) resolve(); }; });
  displaybarcode(SDP(peer.localDescription.sdp));
})();











async function processbarcode(sdp){
  if(sdp===lastscanned)return;
  lastscanned=sdp;
  if(sdp.length<10)return;
  overlay.style.opacity=1;
  setTimeout(()=>overlay.style.opacity=0,1000);
  const type = sdp.split('|')[0];
  if(type==="offer"){
    canvas.style.display = "none";
    peer = new RTCPeerConnection();
    peer.ondatachannel=e=>{
      channel=e.channel;
      channel.onopen=()=>launchgame("b");
    };
    await peer.setRemoteDescription({type:"offer",sdp:SDP(sdp)});
    await peer.setLocalDescription(await peer.createAnswer());
    await new Promise(resolve => { peer.onicecandidate = e => { if (e.candidate) resolve(); }; });
    displaybarcode(SDP(peer.localDescription.sdp));
  }else if(type==="answer"){
    await peer.setRemoteDescription({type:"answer",sdp:SDP(sdp)});
  }
}











function SDP(s){
if(s.includes("\n")){//strip
  const g=r=>(s.match(r)||[])[1];
  const lines=s.split("\n").map(l=>l.trim());
  const setup=lines.find(l=>l.startsWith("a=setup:"))||"";
  const type=setup.includes("active")?"answer":setup.includes("actpass")?"offer":"";
  const fp=g(new RegExp("^a=fingerprint:sha-256 (.+)","m"))?.replace(/:/g,"");
  const cand=(lines.find(l=>l.startsWith("a=candidate:"))||"").slice(12).trim().replace(/\s+/g," ");
  const sessionId=g(new RegExp("^o=- (\\d+)","m"));
  const ufrag=g(new RegExp("^a=ice-ufrag:(.+)","m"));
  const pwd=g(new RegExp("^a=ice-pwd:(.+)","m"));
  if(!type||!sessionId||!ufrag||!pwd||!fp||!cand)throw"Invalid SDP";
  return [type,sessionId,ufrag,pwd,fp,cand].join("|");
}else{//unstrip
  const [type,sessionId,ufrag,pwd,fp,cand]=s.split("|");
  const setup=type==="offer"?"actpass":"active";
  return [
    "v=0",
    "o=- "+sessionId+" 2 IN IP4 0.0.0.0",
    "s=-",
    "t=0 0",
    "m=application 9 UDP/DTLS/SCTP webrtc-datachannel",
    "a=ice-ufrag:"+ufrag,
    "a=ice-pwd:"+pwd,
    "a=fingerprint:sha-256 "+fp.match(/.{2}/g).join(":"),
    "a=setup:"+setup,
    "a=candidate:"+cand,
    "a=end-of-candidates"
  ].join("\r\n")+"\r\n";
}
}











function displaybarcode(text){
if(lastbarcode)lastbarcode.remove();
let d=(Math.min(screen.width,screen.height)<600)
  ?Math.round(window.innerWidth*0.7)
  :Math.round(2*96*window.devicePixelRatio);
let [a,size]=datamatrix(text);
let pad=2,w=size+pad*2;
let c=document.createElement("canvas");
c.width=c.height=d;
let ctx=c.getContext("2d");
let scale=d/w;
ctx.fillStyle="white";
ctx.fillRect(0,0,d,d);
ctx.fillStyle="black";
for(let j=0;j<size;j++){
  for(let i=0;i<size;i++){
    if(a[j][i]){
      ctx.fillRect((i+pad)*scale,(j+pad)*scale,scale,scale);
}}}
box.insertBefore(lastbarcode=c,canvas);
}











function launchgame(side){
if(stream)for(const track of stream.getTracks())track.stop(); stream=null;
for(const el of [...document.body.children])if(el.tagName!=="SCRIPT")el.remove();
game(channel,side);
}











function datamatrix(text){
let grid=[];
let on=(i,j)=>(grid[j]??=[])[i]=1;
let data=[],raw=new TextEncoder().encode(text),len=raw.length;
for(let i=0;i<len;i++){
  let a=raw[i],b=(i+1<len)?raw[i+1]:0;
  if(a>47&&a<58&&b>47&&b<58){data.push((a-48)*10+b+82);i++;}
  else data.push(a+1);
}
let dl=data.length,s=6,i=-1,z,blocks=1,sc=1,cell,t=2;
let rsPoly=[5,7,10,12,14,18,20,24,28,36,42,48,56,68,84,112,144,192,224,272,336,408,496,620];
let rs=Array(70),chk=Array(70),log=Array(256),exp=Array(255);
do{if(++i===rsPoly.length)return;if(s>11*t)t=4+t&12;s+=t;len=s*s>>3;}while(len-rsPoly[i]<dl);
if(s>27)sc=2*(s/54|0)+2;if(len>255)blocks=2*(len>>9)+2;
z=rsPoly[i];cell=s/sc;
if(dl<len-z)data[dl++]=129;
while(dl<len-z)data[dl++]=((149*dl)%253+130)%254;
z/=blocks;
for(i=1,t=0;t<255;t++){exp[t]=i;log[i]=t;i+=i;if(i>255)i^=301;}
rs[z]=0;
for(t=1;t<=z;t++){for(i=z-t,rs[i]=1;i<z;i++)rs[i]=rs[i+1]^exp[(log[rs[i]]+t)%255];}
for(let blk=0;blk<blocks;blk++){
  for(t=0;t<=z;t++)chk[t]=0;
  for(t=blk;t<dl;t+=blocks){
    let x=chk[0]^data[t];
    for(i=0;i<z;i++)chk[i]=chk[i+1]^(x?exp[(log[rs[i]]+log[x])%255]:0);
  }
  for(t=0;t<z;t++)data[dl+blk+t*blocks]=chk[t];
}
for(t=0;t<s+2*sc;t+=cell+2)
  for(i=0;i<s+2*sc;i++)on(i,t+cell+1),(i&1)===0&&on(i,t);
for(t=0;t<s+2*sc;t+=cell+2)
  for(i=0;i<s;i++)on(t,i+(i/cell|0)*2+1),(i&1)&&on(t+cell+1,i+(i/cell|0)*2);
z=2;let cx=0,cy=4,pat=[0,0,-1,0,-2,0,0,-1,-1,-1,-2,-1,-1,-2,-2,-2];t=0;
while(t<len){
  if(cy===s-3&&cx===-1)rs=[s,6-s,s,5-s,s,4-s,s,3-s,s-1,3-s,3,2,2,2,1,2];
  else if(cy===s+1&&cx===1&&(s&7)===0&&(s&7)===6)
    rs=[s-2,-s,s-3,-s,s-4,-s,s-2,-1-s,s-3,-1-s,s-4,-1-s,s-2,-2,-1,-2];
  else{
    if(cy===0&&cx===s-2&&(s&3)){t++;continue;}
    if(cy<0||cx>=s||cy>=s||cx<0){
      z=-z;cy+=2+z/2;cx+=2-z/2;
      while(cy<0||cx>=s||cy>=s||cx<0)cy-=z,cx+=z;
    }
    if(cy===s-2&&cx===0&&(s&3))
      rs=[s-1,3-s,s-1,2-s,s-2,2-s,s-3,2-s,s-4,2-s,0,1,0,0,0,-1];
    else if(cy===s-2&&cx===0&&(s&7)===4)
      rs=[s-1,5-s,s-1,4-s,s-1,3-s,s-1,2-s,s-2,2-s,0,1,0,0,0,-1];
    else if(cy===1&&cx===s-1&&(s&7)===0&&(s&7)===6){t++;continue;}
    else rs=pat;
  }
  let byte=data[t++];
  for(i=0;byte>0;i+=2,byte>>=1)if(byte&1){
    let px=cx+rs[i],py=cy+rs[i+1];
    if(px<0)px+=s,py+=4-((s+4)&7);
    if(py<0)py+=s,px+=4-((s+4)&7);
    on(px+2*(px/cell|0)+1,py+2*(py/cell|0)+1);
  }
  cy-=z;cx+=z;
}
for(t=s;t&3;t--)on(t,t);
return [grid,s+2*sc];
}











}//handshake
