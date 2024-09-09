var keylist={mouse:0,KeyC:0,KeyX:0,KeyR:0,KeyP:0,KeyN:0,KeyB:0};
var downqueue=[];
function clearkey(){
	for(var i1 in keylist){
		keylist[i1]=0;
	}
	downqueue=[];
	return;
}
function handledown(x){
	if(keylist[x]===undefined)return;
	// console.log(x);
	keylist[x]=1;
	downqueue.push(x);
}
function handleup(x){
	if(keylist[x]===undefined)return;
	// console.log(x);
	keylist[x]=0;
}
function keydownlisten(e){
	// console.log(e.code);
	handledown(e.code);
}
function keyuplisten(e){
	// console.log(e);
	handleup(e.code);
}
document.addEventListener("keydown",keydownlisten);
document.addEventListener("keyup",keyuplisten);
function msdownlisten(e){
	// console.log(e);
	if(e.button===0)handledown("mouse");
}
function msuplisten(e){
	// console.log(e);
	if(e.button===0)handleup("mouse");
}
document.addEventListener("mousedown",msdownlisten);
document.addEventListener("mouseup",msuplisten);
var msx=0,msy=0,msmoved=false;
function msmovelisten(e){
	msx=e.pageX-canva.offsetLeft;
	msy=canva.offsetTop+cvh-e.pageY;
	msmoved=true;
}
document.addEventListener("mousemove",msmovelisten);

//dom
var titlediv=document.getElementById("title");
var levelsdiv=document.getElementById("levels");
var instr='<div style="font-size:64px;">Levels</div>';
for(var i=1;i<=5;++i){
	instr+='<div id="levdiv'+i+'" style="margin:60px 80px;cursor:pointer;display:inline-block;" onclick="playlevel'+i+'();">'+i+'</div>';
}
levelsdiv.innerHTML=instr;

function showcanvas(){
	canva.style.display=null;
	levelsdiv.style.display="none";
	titlediv.style.display="none";
	pausediv.style.display="none";
}
function showlevels(){
	canva.style.display="none";
	levelsdiv.style.display="inline-block";
	titlediv.style.display="none";
	pausediv.style.display="none";
}
function showtitle(){
	canva.style.display="none";
	levelsdiv.style.display="none";
	titlediv.style.display=null;
	pausediv.style.display="none";
}
showtitle();
function startclick(){
	showlevels();
}
// playlevel1();
// playlevel3();