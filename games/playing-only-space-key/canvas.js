var canvas = document.getElementById("canvas_01");
var ctx = canvas.getContext("2d");

var scale = window.devicePixelRatio;

ctx.beginPath();
ctx.rect( 100, 200, 75, 75 );
ctx.strokeStyle = "#fff";
ctx.lineWidth = 5;
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = "#fff";
ctx.fillText('   count space', 100, 300);
ctx.fill();
ctx.closePath();

// 人
ctx.beginPath();
ctx.arc(55, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = "#fff";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(50, 160, 30, 0, Math.PI*2, false);
ctx.lineWidth = 5;
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.arc(50, 180, 30, 0, Math.PI, false);
ctx.lineWidth = 5
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(20,180);
ctx.lineTo(20,280);
ctx.lineWidth = 5;
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(80,180);
ctx.lineTo(80,280);
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(0,180);
ctx.lineTo(20,180);
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(0,280);
ctx.lineTo(20,280);
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.rect(20, 280, 48, 10);
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.rect(70, 280, 25, 10);
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

// 宇宙人

// 頭
ctx.beginPath();
ctx.ellipse(370, 160, 60, 30, 0, 0, Math.PI * 2);
ctx.fillStyle = "#fff";
ctx.fill();
ctx.closePath();

// 宇宙服
ctx.beginPath();
ctx.ellipse(370, 150, 80, 50, 0, 0, Math.PI * 2);
ctx.lineWidth = 1;
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();

ctx.beginPath();
// まっすぐの足右
ctx.moveTo(350, 160);
ctx.lineTo(350, 290);
ctx.lineWidth = 8
ctx.strokeStyle = "#fff";
ctx.stroke();

// まっすぐの足真ん中
ctx.moveTo(370, 160);
ctx.lineTo(370, 290);
ctx.stroke();

// まっすぐの足左
ctx.moveTo(390, 160);
ctx.lineTo(390, 290);
ctx.stroke();

// 曲がってる足右
ctx.moveTo(410, 170);
ctx.quadraticCurveTo(410, 290, 440, 240);
ctx.stroke();

// 曲がってる足左
ctx.moveTo(330, 170);
ctx.quadraticCurveTo(330, 290, 300, 240);
ctx.stroke();
ctx.closePath();

// 四角吹き出し
ctx.beginPath();
ctx.rect(10, 10, 460, 100);
ctx.lineWidth = 5
ctx.strokeStyle = "#fff";
ctx.stroke();
ctx.closePath();