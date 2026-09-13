const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.font='24px Arial';
var cc='#b7f',bg='#eef';
var music_on=0;
var bs=10, cd=0;
var px,py,cx,cy,oy,ufl,udv;
var bgc,aiming;
var rbc=[],bls=[],bolts=[];
var goal,paused,t1,t2;
var jt=0;
var my=1;
var bx=0,by=0,bmy;
var rot=0;
var clrb=bg,clrm='#fab';
var aim=[0,0];
var stage=1;
var level=0;
var points=[[-40,-40],[-120,0],[-160,-40],[-96,-104],[-140,-160],[-88,-112],[-60,-140],[-48,-140],[-48,-180],[-28,-140],[-8,-140],[60,-60],[160,-60],[200,-20],[200,160],[180,160],[180,60],[20,60],[20,160],[0,160],[0,60],[0,0]];
var point=0;
var first_time=1;
var music_note = 0;
const music_sheet = [1,0,3,5,3,0,1,0,6,5,3,0,2,0,4,5,4,0,2,5,4,6,4,0];
const node = [0,261.63,293.66,329.63,349.23,392,440,493.88];
var audioCtx;//=new(window.AudioContext || window.webkitAudioContext)();
document.addEventListener('click',upd_click,true);
document.addEventListener('dblclick',upd_d_click,true);
document.addEventListener('mousemove',upd_move,true);
init();

function play_song(){
play_note(node[music_sheet[music_note]], 50);
music_note=music_note+1;
if (music_note>=music_sheet.length){music_note=0;}
}

function play_note(frequency, duration){
let osc = audioCtx.createOscillator();
let gain = audioCtx.createGain();
gain.gain.value = 0.1;
osc.type = 'square';
osc.frequency.value = frequency;
osc.connect(gain);
gain.connect(audioCtx.destination);
osc.start(duration);
setTimeout(function(){osc.stop();},duration);
}

function init(){
if (level==0){
upd_move();
}
else{
start();
if (first_time){
first_time=0;
t1=setInterval(process,10);
t2=setInterval(play_song,200);
}
}
}

function start(){
oy=0;
ufl=0;
udv=1;
jt=0;
rot=0;
aiming=0;
px=150;
py=300;
cx=-1;
cy=-1;
bmy=0;
if (level==1){
bgc=[[100,100],[230,150],[370,180],[510,200]];
rbc=[];
bls=[];
bolts=[];
goal=[585,450];
}else if(level==2){
py=350;
bgc=[[100,100],[370,150],[550,250],[350,380],[200,500],[450,650],[340,850]];
goal=[450,1150];
}else if(level==3){
aiming=1;
py=150;
bgc=[];
rbc=[[150,150],[250,380],[600,400],[600,400],[700,600],[500,770]];
goal=[450,1150];
}else if(level==4){
bgc=[[100,100],[250,150],[400,180],[300,600],[400,750]];
rbc=[[250,450],[600,400],[700,800]];
goal=[450,1150];
}else if(level==5){
bgc=[[100,100],[580,100],[600,320],[90,580],[70,800],[470,900],[570,1120]];
rbc=[[600,540],[400,1240]];
goal=[50,1595];
}else if(level==6){
bgc=[[100,100],[350,200],[600,320],[50,620],[650,720],[600,920],[460,1100],[650,1250],[200,1350]];
rbc=[[450,450],[150,790]];
bls=[];
bolts=[[300,-200],[550,600]];
goal=[550,1600];
}else if(level==7){
bgc=[];
rbc=[];
bls=[];
bolts=[];
goal=[550,1600];
}
}

function process(){
if (level==0||paused){return;}
oy=oy+.2;
if (check_goal()){
level_up();
paused=1;
if (level==7){
draw_game_completed();
}else{
start();
draw_victory();
}
return;}
if (py-oy<0){
start();
}
draw();
move();
if (aiming==1){
spinning_unicorn(px,pxy(py));
}else{
unicorn(px,pxy(py));
}
draw_bolts();
}

function pxy(y){
return 600-y;
}

function draw() {
ctx.clearRect(0,0,800,600);
bp();
ctx.rect(0, 0, 800, 600);
ctx.stroke();
draw_goal();
bp();
ctx.moveTo(0,goal+600-oy);
ctx.lineTo(800,goal+600-oy);
r_n('#000');
run_list(cloud,bgc);
bp();
run_list(balloon,bls);
run_list(rainbow,rbc);
tips();
}

function move() {
if (bolt_col()){
py-=2;
aiming==0;
my=1;
jt=1;
}else{
if (aiming==0){
let i=0;
while (i<bgc.length){
if (jt<=0&&((!ufl&&detect_square([bgc[i][0]-10,bgc[i][1]+50],100,150))||(ufl&&detect_square([bgc[i][0]-40,bgc[i][1]+50],100,150)))){
udv=0;
jt=130;
bx=bgc[i][0];
by=pxy(bgc[i][1])+oy;
}
i++;}
if (udv==4&&jt>0){
px+=10;
}else if (udv==3&&jt>0){
px-=10;
}else if (udv>2){
udv=1;
}else{
if (jt>85){
bounce(bx,by);}
if (jt>0){
my=-1;
}else if (jt<=0){my=1;}
py-=my;
if (cx>0){if (cx<px){px--;ufl=1;} else if (cx>px) {px++;ufl=0;} else {cx=-1;};
}}
jt--;
i=0;
while (i<rbc.length){
if (detect_circle(rbc[i],70)){
aiming=1;
px=rbc[i][0];
py=rbc[i][1];
}
i++;}
}
else if (aiming==1){
spin();}
else if (aiming==2){
px=px+(aim[0]*5/pyt_c(aim[0],aim[1]));
my=-Math.abs(aim[1]*5/pyt_c(aim[0],aim[1]));
py-=my;
jt-=1;
if (jt==0){
aiming=0;
py=Math.floor(py);
px=Math.floor(px);
}
}
}
}

function run_list(func,arr){
let i=0;
while (i<arr.length){
func(arr[i][0],pxy(arr[i][1])+oy);
i+=1;}
}

function draw_goal(){
bp();
cloud_base(goal[0]-10,pxy(goal[1])+150+oy, 20,10);
cloud_base(goal[0]+190,pxy(goal[1])+150+oy, 20,10);
r_n(cc);
ctx.rect(goal[0],pxy(goal[1])+oy,200,100);
ctx.fillStyle='#dad';
ctx.lineTo(goal[0],pxy(goal[1])+150+oy);
ctx.moveTo(goal[0]+200,pxy(goal[1])+100+oy);
ctx.lineTo(goal[0]+200,pxy(goal[1])+150+oy);
ctx.stroke();
cf();
bp();
}

function check_goal(){
return detect_square(goal,150,200);
}

function unicorn(x,y){
let arr = [[-10,-10],[-30,0],[-35,-5],[-40,-10],[-24,-26],[-35,-40],[-22,-28],[-20,-30],[-15,-35],[-12,-35],[-12,-45],[-7,-35],[-5,-35]];
if (0>my) {arr=arr.concat([[15,-15],[40,20],[40,70],[35,70],[35,50],[5,15],[5,40],[0,40],[0,20]]);}else{arr=arr.concat([[5,-25],[30,-40],[40,-40],[40,20],[35,20],[35,-5],[5,15],[5,40],[0,40],[0,20]]);}
draw_offset_u(x,y+oy,arr,clrb);
ctx.stroke();
ctx.closePath();
bp();
let mane;
if (0>my){
mane=[[-10,0],[-10,10],[20,35],[20,25],[5,15]];
}else{
mane=[[-10,0],[-10,10],[10,20],[15,5],[15,-10],[20,-10]];
}
draw_offset_u(x,y+oy-40,mane,clrm);
ctx.stroke();
ctx.closePath();
bp();
let tail;
let t_y=y+oy;
if (0>my){
tail=[[0,-5],[15,20],[15,35],[0,0]];
t_y+=25;
}else{
tail=[[0,-5],[10,-35],[15,-35],[15,-25],[5,0]];
t_y-=35;
}
draw_offset_u(x-40+80*ufl,t_y,tail,clrm);
ctx.stroke();
ctx.closePath();
bp();
if (udv>2){
ctx.arc(x+35-(ufl*70),y-40+oy,5,0,2*Math.PI);
r_n("#ff06");
ctx.arc(x+35-(ufl*70),y-40+oy,10,0,2*Math.PI);
r_n("#ff04");}
}

function spinning_unicorn(x,y){
let arr = [r_v(0,0),r_v(-10,-10),r_v(-30,0),r_v(-35,-5),r_v(-40,-10),r_v(-24,-26),r_v(-35,-40),r_v(-22,-28),r_v(-20,-30),r_v(-15,-35),r_v(-12,-35),r_v(-12,-45),r_v(-7,-35),r_v(-5,-35),r_v(15,-20),r_v(20,-10)];
draw_spinner(x,y+oy,arr,clrb,1);
ctx.stroke();
aim=arr[6];
bp();
ctx.arc(x+arr[6][0],y-Math.abs(arr[6][1])+oy,5,0,2*Math.PI);
r_n("#ff06");
ctx.arc(x+arr[6][0],y-Math.abs(arr[6][1])+oy,10,0,2*Math.PI);
r_n("#ff04");
bp();
let mane;
if (0>arr[1][1]){
mane=[arr[12],arr[14],r_v(15,-25),r_v(-7,-40),arr[12]];
}else{
mane=[r_v(-7,-35),r_v(15,-15),r_v(15,-20),r_v(0,-35),r_v(-5,-35)];
}
draw_spinner(x,y+oy,mane,clrm,0);
ctx.stroke();
ctx.closePath();
bp();
ctx.rect(x-55,y+oy,110,40);
r_n(cc);
}

function rainbow(x,y){
let s=10;
cloud_base(x-6*s,y-2.5*s,12*s,6*s);
bp();
ctx.arc(x,y,s*7,Math.PI,0);
r_n("#f00");
ctx.arc(x,y,s*6,Math.PI,0);
r_n("#f80");
ctx.arc(x,y,s*5,Math.PI,0);
r_n("#ff0");
ctx.arc(x,y,s*4,Math.PI,0);
r_n("#0f0");
ctx.arc(x,y,s*3,Math.PI,0);
r_n("#00f");
ctx.arc(x,y,s*2,Math.PI,0);
r_n("#408");
ctx.arc(x,y,s,Math.PI,0);
r_n("#90d");
bp();
}

function r_v(x,y){
return [x*Math.cos(rot-(Math.PI/4))-y*Math.sin(rot-(Math.PI/4)),x*Math.sin(rot-(Math.PI/4))+y*Math.cos(rot-(Math.PI/4))];
}

function spin(){
rot=(rot-(Math.PI/180))%(2*Math.PI);
}

function bounce(x,y){
bp();
let s=10;
ctx.rect(x+40,y-20,20,20);
ctx.arc(x+50,y-s*12,s*13,Math.PI*0.32,Math.PI*0.68);
r_n(bg);
ctx.arc(x+30,y+s,s,Math.PI,0);
r_n(cc);
ctx.arc(x+50,y+2*s,2*s,Math.PI,0);
r_n(cc);
ctx.arc(x+90,y+s,s,Math.PI,0);
r_n(cc);
}

function cf(){
ctx.fill();
}

function bp(){
ctx.beginPath();
}

function r_n(c) {
ctx.fillStyle = c;
cf();
bp();}

function cloud(x,y){
let w=100;
let h=50;
cloud_base(x,y,w,h);
ctx.arc(x+(w*.3),y,h*.27,Math.PI,0);
ctx.arc(x+(w*.6),y,h*.32,Math.PI,0);
ctx.arc(x+(w*.7),y,h*.2,Math.PI,0);
ctx.arc(x+(w*.85),y,h*.21,Math.PI,0);
cf();
}

function cloud_base(x,y,w,h){
bp();
ctx.fillStyle = cc;
ctx.rect(x,y,w,h);
ctx.arc(x,y+h*.55,h*.3,0,2*Math.PI); 
ctx.arc(x,y+h*.1,h*.3,0,2*Math.PI);
cf();
ctx.arc(x+w,y+h*.2,h*.3,0,2*Math.PI);
ctx.arc(x+w,y+(h*.3),h*.3,1.5*Math.PI,Math.PI*.5);
ctx.arc(x+w,y+(h*.7),h*.2,1.5*Math.PI,Math.PI*.5);
cf();
ctx.arc(x+(w*.9),y+h,h*.3,0,2*Math.PI);
ctx.arc(x+(w*.4),y+h,h*.37,0,Math.PI);
ctx.arc(x+(w*.7),y+h,h*.3,0,Math.PI);
ctx.arc(x+(w*.1),y+h,h*.3,0,2*Math.PI);
cf();
}

function balloon(x,y){
let s=10;
ctx.arc(x,y,s,2*Math.PI,0);
ctx.stroke();
r_n('#f33');
bp();
ctx.moveTo(x,y+s);
ctx.lineTo(x,y+s*3);
ctx.stroke();
bp();
}

function color_selector(){
stage++;
ctx.clearRect(1,1,800-2,600-2);
draw_offset(350,280,points,clrb,1);
ctx.stroke();
if (stage<4){color_bars();}
else{
draw_offset(358,120,[[-30,0],[-40,10],[-40,30],[70,130],[70,90],[20,50]],clrm,1);
ctx.stroke();
draw_offset(550,260,[[-40,-40],[5,-20],[60,80],[60,140],[0,0]],clrm,1);
ctx.stroke();
bp();
ctx.rect(50,500,350,100);
r_n('#0f0');
ctx.rect(400,500,350,100);
r_n('#f00');
}
tips();
}

function upd_click(e){
if (!music_on){
music_on=true;
audioCtx = new(window.AudioContext || window.webkitAudioContext)();
}
if (level==7){
level_up();
return;}
if (paused){
paused=0;
return;
}
let x=e.clientX;
let y=e.clientY;
if (level<1){
if (stage==1){click_circle([x,y]);}
else if(stage==2){
let n=color_pick(x,y);
if (n>0){
clrb=cnv(n);
color_selector();
}
}else if(stage==3){
let n=color_pick(x,y);
if (n>0){
clrm=cnv(n);
color_selector();
}
}else if(stage==4){
let n=color_pick(x,y);
if(n>7){
clrb=bg;
stage=1;
color_selector();
}else if (n>0){
level=1;
init();
}}
}else{
if (aiming==1){
aiming=2;
cx=-1;
jt=50;
ufl=aim[0]<0;
udv=0;
}
else{
cx=e.clientX;
cy=e.clientY;
}}}

function upd_d_click(e){
cx=e.clientX;
cy=e.clientY;
if (udv==0){
jt=20;
if (cx>px+1){udv=4;} else if (cx<px-1){udv=3;} else {udv=2;}
}
}

function draw_spinner(x,y,a,c,b){
bp();
if (b){ctx.moveTo(x+a[0][0],y);}else if (a[0][1]<0){ctx.moveTo(x+a[0][0],y+a[0][1]);}else{ctx.moveTo(x+a[0][0],y-a[0][1]);}
let i=1;
while (i < a.length) {
if (0>a[1][1]) {ctx.lineTo(x+a[i][0],y+a[i][1]);} else {ctx.lineTo(x+a[i][0],y-a[i][1]);}
i++;
}
if (b){
if (a[1][1]<0){
ctx.lineTo(x+40,y+20);
ctx.lineTo(x,y+30);
}else{
ctx.lineTo(x-40,y+20);
ctx.lineTo(x,y+30);
}
}
ctx.closePath();
ctx.fillStyle = c;
ctx.fill();
}

function bolt_col(){
let i=0;
while (i<bolts.length){
let x=bolts[i][0];
let y=(bolts[i][1]+12*oy)%1200;
if (px-55+ufl*15<x&&px+55-ufl*15>x&&pxy(py)+oy-30<y&&pxy(py)+oy+30>y){
if (my<0&&y<pxy(py)+oy){
if (!ufl&&px<x&&x-px>pxy(py)-y){return 1;}
if (ufl&&px>x&&x-px>pxy(py)-y){return 1;}
}else{return 1;}
}
i++;
}
return 0;
}

function draw_bolts(){
let i = 0;
while (i<bolts.length){
draw_offset(bolts[i][0],(bolts[i][1]+12*oy)%1200,[[4,-20],[-10,-20],[0,-45],[10,-45],[4,-30],[15,-30],[0,0]],'#ee2',1);
ctx.stroke();
i++;
}
}

function draw_offset_u(x,y,a,c){
draw_offset(x,y,a,c,ufl);
}

function draw_offset(x,y,a,c,b){
bp();
ctx.moveTo(x,y);
let i=0;
while (i<a.length-1) {
if (b){ctx.lineTo(x+a[i][0],y+a[i][1]);}else{ctx.lineTo(x-a[i][0],y+a[i][1]);}
i++;
}
ctx.closePath();
ctx.fillStyle = c;
ctx.fill();
}

function pyt_c(a,b){
return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

function tip(txt){
bp();
ctx.fillStyle = '#000';
ctx.font='24px Arial';
ctx.fillText(txt,10,550+oy);
ctx.closePath();
}

function tips(){
if (level==0){
oy=-500;
if (stage==1){tip('Connect the dots in order to draw your unicorn.');}
if (stage==2){tip('Select a color for the unicorns body.');}
if (stage==3){tip('Select a color for the unicorns mane.');}
if (stage==4){tip('Click green box to start, or red box to change colors again.');}
}
if (level==1){tip('Click to move horizontally toward the place you clicked.');}
if (level==3){tip('Click to shoot yourself in direction the horn is pointing.');}
if (level==5){tip('Double click to dash left or right. Interact with a cloud to renew your dash.');}
if (level==6){tip('Avoid getting stunned by lightning bolts.');}
}

function draw_victory(){
bp();
ctx.rect(300,200,200,100);
ctx.stroke();
r_n('#fff');
ctx.fillStyle = '#000';
ctx.fillText('Level completed!', 310,240);
ctx.fillText('Click for next level.', 300,280);
}

function draw_game_completed(){
bp();
ctx.clearRect(1,1,800-2,600-2);
draw_offset(350,280,points,clrb,1);
ctx.stroke();
draw_offset(358,120,[[-30,0],[-40,10],[-40,30],[70,130],[70,90],[20,50]],clrm,1);
ctx.stroke();
draw_offset(550,260,[[-40,-40],[5,-20],[60,80],[60,140],[0,0]],clrm,1);
ctx.stroke();
bp();
ctx.fillStyle = '#000';
ctx.font='28px Arial';
ctx.fillText('Your unicorn made the way back home.', 200,40);
ctx.fillText('You have now completed the game.', 220,90);
ctx.fillText('Click anywhere to restart.', 250,500);
}

function detect_square(vec,h,w){
return px>=vec[0]&&px<=vec[0]+w&&py<=vec[1]&&py>=vec[1]-h;
}

function detect_circle(vec,r){
return r>=pyt_c(vec[0]-px,vec[1]-py);
}

function detect_circle_click(vec,vec2,r){
return r>=pyt_c(vec[0]-x_pos(vec2[0]),vec[1]-y_pos(vec2[1]));
}

function draw_circles(){
let i=0;
ctx.fillStyle='#000';
ctx.font='8px Arial';
while (i<points.length){
let x=x_pos(points[i][0]);
let y=y_pos(points[i][1]);
ctx.moveTo(x,y);
ctx.arc(x,y,2,0,2*Math.PI);
ctx.stroke();
ctx.fillText(i+1, x+4,y+2);
if (i&&i<=point){
ctx.lineTo(x_pos(points[i-1][0]),y_pos(points[i-1][1]));
ctx.stroke();
}
i++;}
if (stage>1){
ctx.moveTo(x_pos(points[-1][0]),y_pos(points[-1][1]));
ctx.lineTo(x_pos(points[0][0]),y_pos(points[0][1]));
ctx.stroke();}
}

function x_pos(x){
return x+350;
}

function y_pos(y){
return y+280;
}

function click_circle(vec){
if (cd&&point==points.length-1&&detect_circle_click(vec,points[0],25)){
cd=0;
color_selector();
}else if (point<points.length){
if (!cd&&detect_circle_click(vec,points[point],25)){
cd=1;
cx=x_pos(points[point][0]);
cy=y_pos(points[point][1]);
}else if (cd&&detect_circle_click(vec,points[point+1],25)){
point++;
cx=x_pos(points[point][0]);
cy=y_pos(points[point][1]);
}}}

function color_pick(x,y){
if (y>500&&y<600&&x>50){
if (x<100){return 1;}
if (x<150){return 2;}
if (x<200){return 3;}
if (x<250){return 4;}
if (x<300){return 5;}
if (x<350){return 6;}
if (x<400){return 7;}
if (x<450){return 8;}
if (x<500){return 9;}
if (x<550){return 10;}
if (x<600){return 11;}
if (x<650){return 12;}
if (x<700){return 13;}
if (x<750){return 14;}
} return 0;
}

function color_bars(){
bp();
ctx.rect(50,500,50,100);
r_n(cnv(1));
ctx.rect(100,500,50,100);
r_n(cnv(2));
ctx.rect(150,500,50,100);
r_n(cnv(3));
ctx.rect(200,500,50,100);
r_n(cnv(4));
ctx.rect(250,500,50,100);
r_n(cnv(5));
ctx.rect(300,500,50,100);
r_n(cnv(6));
ctx.rect(350,500,50,100);
r_n(cnv(7));
ctx.rect(400,500,50,100);
r_n(cnv(8));
ctx.rect(450,500,50,100);
r_n(cnv(9));
ctx.rect(500,500,50,100);
r_n(cnv(10));
ctx.rect(550,500,50,100);
r_n(cnv(11));
ctx.rect(600,500,50,100);
r_n(cnv(12));
ctx.rect(650,500,50,100);
r_n(cnv(13));
ctx.rect(700,500,50,100);
r_n(cnv(14));
}

function cnv(n){
if (n==1){return '#fab'};
if (n==2){return '#137'};
if (n==3){return '#cab'};
if (n==4){return '#aaa'};
if (n==5){return '#eee'};
if (n==6){return '#baf'};
if (n==7){return '#2cc'};
if (n==8){return '#567'};
if (n==9){return '#f55'};
if (n==10){return '#3f3'};
if (n==11){return '#624'};
if (n==12){return '#aef'};
if (n==13){return '#ff9'};
if (n==14){return '#c4e'};
}

function upd_move(e){
if (level>0||stage>1){return;}
ctx.clearRect(0,0,800,600);
draw_circles();
ctx.beginPath();
ctx.rect(0,0,800,600);
ctx.stroke();
ctx.closePath();
if (cd){
ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.lineTo(e.clientX,e.clientY);
ctx.closePath();
ctx.stroke();
}
tips();
}

function level_up(){
level++;
if (level==8){
level=0;
stage=1;
color_selector();
}
}