p=0;
function l(a,b){console.log(Date.now()+":"+a+":"+JSON.stringify(b));}
async function x(s,m){let a,i;a=(await storage.get("a"))||[0,0,0,0,0,0,0,0,0,0,0,0];for(i=0;i<m.length;i++){a[i]+=m[i];}await storage.set("a",a);l("a",a);l("b",m);s.emit("d",a);}
module.exports={io:(s)=>{s.on("disconnect",()=>{p--;l("e",p);});s.on("b",(m)=>x(s,m));p++;l("d",p);}};