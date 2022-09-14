const shakeDuration=500;let shakeStartTime=-1;let preShake=()=>{if(shakeStartTime==-1)return;let dt=Date.now()-shakeStartTime;if(dt>shakeDuration){shakeStartTime=-1;return}
let easingCoef=dt/shakeDuration;let easing=Math.pow(easingCoef-1,3)+1;kontra.context.save();let dx=easing*(Math.cos(dt*0.1)+Math.cos(dt*0.3115))*5;let dy=easing*(Math.sin(dt*0.05)+Math.sin(dt*0.057113))*5;kontra.context.translate(dx,dy)}
let postShake=()=>{if(shakeStartTime==-1)return;kontra.context.restore()}
let startShake=()=>{shakeStartTime=Date.now()}
let drawThings=()=>{kontra.context.fillStyle='#F00';kontra.context.fillRect(10,10,50,30);kontra.context.fillStyle='#0F0';kontra.context.fillRect(140,30,90,110);kontra.context.fillStyle='#00F';kontra.context.fillRect(80,70,60,40)}
const degreesToRadians=(degrees)=>{return degrees*Math.PI/180}