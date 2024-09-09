let update=()=>{
window.width=window.innerWidth;
window.height=window.innerHeight;
let canvas=document.getElementById('canvas');
canvas.width=window.width;
canvas.height=window.height;
canvas.center={
x: window.width/2,
y: window.height/2
};
canvas.unit=window.height/((1+canvas.atlas.size)*Math.sqrt(3));
};
window.addEventListener('resize',(event)=>{
update();
});
window.addEventListener('load',(event)=>{
update();
});
