var clubs = [0.5,0.5,0.15,0.225,0.5,0.075,0.85,0.225,0.5,0.5,0.775,0.15,0.925,0.5,0.775,0.85,0.5,0.5,0.55,0.525,0.575,0.9,0.5,0.925,0.425,0.9,0.45,0.525,0.5,0.5,0.225,0.85,0.075,0.5,0.225,0.15];
var diamonds = [0.075,0.5,0.3,0.725,0.5,0.925,0.725,0.7,0.925,0.5,0.7,0.275,0.5,0.075,0.275,0.3];
var hearts = [0.15,0.5,0,0.275,0.15,0.125,0.425,0,0.5,0.25,0.55,0,0.85,0.125,1,0.275,0.85,0.5,0.7,0.775,0.5,0.925,0.3,0.775];
var spades = [0.85,0.675,1,0.5,0.5,0.075,0,0.5,0.15,0.675,0.25,0.775,0.475,0.7,0.475,0.825,0.45,0.925,0.5,0.95,0.55,0.925,0.525,0.825,0.525,0.7,0.75,0.775];
var chipSize = [ 1, 5, 25, 100, 500, 1000, 5000, 25000, 100000 ];

function roundRect(ctx, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
}

var cardLayout = [
  /* 2 */ [-1,  0.5, 0.0,  0.5, 1.0 ],
  /* 3 */ [ 0,  0.5, 0.5  ],
  /* 4 */ [-1,  0.0, 0.0,  1.0, 0.0,  0.0, 1.0,  1.0, 1.0 ],
  /* 5 */ [ 2,  0.5, 0.5 ],
  /* 6 */ [ 2,  0.0, 0.5,  1.0, 0.5 ],
  /* 7 */ [ 4,  0.5, 0.25 ],
  /* 8 */ [ 5,  0.5, 0.75 ],
  /* 9 */ [ 3,  0.0, 0.33,  1.0, 0.33,  0.0, 0.66,  1.0, 0.66 ],
  /* T */ [ 2,  0.0, 0.33,  1.0, 0.33,  0.0, 0.66,  1.0, 0.66,  0.5, 0.165,  0.5, 0.835 ],
  /* J */ [ -1,  0.5, 0.75 ],
  /* Q */ [ 9 ],
  /* K */ [ 9 ],
  /* A */ [ 9 ],
];

var labels = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"];

function drawChip(color, number, button) {
  var can = document.createElement("canvas");
  var ctx = can.getContext("2d");
  can.width = 18;
  can.height = can.width + 2;
  var radius = can.width / 2;
  ctx.beginPath();
  ctx.arc(radius, 2 + radius, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  if (!button) {
    ctx.beginPath();
    ctx.moveTo(radius/4, radius/4);
    ctx.lineTo(can.width-radius/4, can.width-radius/4);
    ctx.moveTo(can.width-radius/4, radius/4);
    ctx.lineTo(radius/4, can.width-radius/4);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#444";
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.lineWidth = 1;
  }
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 3, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#444";
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.font = "bold 6pt Arial";
  ctx.textAlign = 'center';
  ctx.fillStyle = button ? '#fff' : '#ff0';
  ctx.strokeStyle = button ? '#000' : '#4d0103';
  ctx.strokeText(number, radius, radius + 3); 
  ctx.fillText(number, radius, radius + 3); 
  return can;
}

function drawChips(ctx, sprites, num, x, y) {
  var data = greed(num);
  var m = 0;
  var n = 0;
  for(var i = 0, j = 0; i < data.length; i++) {
    if (data[i]) {
      m++;
    }
  }
  for(i = 0, j = 0; i < data.length; i++) {
    if (data[i]) {
      for (n = 0; n < data[i]; n++) {
        context.drawImage(
          sprites[chipSize[i]],
          (-m/2 + j - 1) * 19 + x,
          -n * 2 + y
        );
      }
      j++;
    }
  }
}

function greed(n) {
  var out = new Array(chipSize.length);
  for (var i = chipSize.length - 1; i >= 0; i--) {
    out[i] = n / chipSize[i] | 0;
    n -= out[i] * chipSize[i];
    if (out[i] && i < chipSize.length - 1) {
      var m = out[i+1] * chipSize[i+1];
      var k = Math.floor(m / chipSize[i]);
      if (out[i] % 25 + k <= 25) {
        out[i] += k;
        out[i+1] = 0;
        n += m - k * chipSize[i];
      }
    }
  }
  return out;
}

function drawTable(ctx, x, y, width, height) {
  
  var border = Math.min(50, Math.max(Math.floor(width / 10), 5));
  var radius = (Math.min(height * 2, width) - border) / 2;
  
  var grd = ctx.createRadialGradient(x + width/2, y + radius, radius/2, x + width/2, y + radius, radius);
  grd.addColorStop(0,"#35a531");
  grd.addColorStop(1,"#216421");
  
  ctx.scale(1, 0.5);

  ctx.beginPath();
  ctx.arc(x + width/2, y + height + border/3, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#38231e';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x + width/2, y + height - border/3, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.lineWidth = border/3;
  ctx.strokeStyle = '#7a2d18';
  ctx.stroke();

  ctx.lineWidth = 1;

  ctx.scale(1, 2);

  return radius;
}


function draw(ctx, shape, size) {
  ctx.translate(-size/2, -size/2);
  ctx.beginPath();
  ctx.moveTo(shape[0] * size, shape[1] * size);
  for (var i = 2; i < shape.length + 2; i += 4) {
    ctx.quadraticCurveTo(
      shape[i] * size, 
      shape[i+1] * size, 
      shape[(i+2) % shape.length] * size, 
      shape[(i+3) % shape.length] * size
    );
  }
  //ctx.scale(size,size);
  ctx.fill();
  //ctx.scale(1/size, 1/size);
  ctx.translate(size/2, size/2);
}

var suits = {
  C: clubs, 
  H: hearts, 
  S: spades, 
  D: diamonds
};
var hexcolors = {
  C: "#000", 
  H: "#f00", 
  S: "#000", 
  D: "#f00"
};

var width = 60;
var height = width * 85 / 60;

var can = document.createElement("canvas");
var ctx = can.getContext("2d");

var grd = ctx.createLinearGradient(0, 0, width, height);
grd.addColorStop(0, "rgba(0,0,0,0)");
grd.addColorStop(0.5, "rgba(0,0,0,0)");
grd.addColorStop(1, "rgba(25,25,25,0.25)");

function updateCardSize(w) {
  width = w;
  height = w * 85 / 60 | 0;

  grd = ctx.createLinearGradient(0, 0, width, height);
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(0.5, "rgba(0,0,0,0)");
  grd.addColorStop(1, "rgba(25,25,25,0.25)");
}


function drawCover() {

  var can = document.createElement("canvas");
  var ctx = can.getContext("2d");

  can.width = width;
  can.height = height;
  
  roundRect(ctx, width, height, Math.min(width / 10, 5));

  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.fillStyle = grd;
  ctx.fill();
  
  var can2 = document.createElement("canvas");
  var ctx2 = can2.getContext("2d");
  
  can2.width = 5;
  can2.height = 5;
  
  ctx2.fillStyle = "rgba(255,0,0,0.85)";
  ctx2.fillRect(0,0,4,4);
  
  ctx.fillStyle = ctx.createPattern(can2, "repeat");
  ctx.fillRect(5,5,can.width-10,can.height-10);
  
  return can;
}

function drawCard(rank, suit) {
  var shape = suits[suit];

  var points = cardLayout[rank - 2].slice(0);
  while (points[0] != -1) {
    points = cardLayout[points.shift()].concat(points);
  }
  points.shift();

  var can = document.createElement("canvas");
  var ctx = can.getContext("2d");

  can.width = width;
  can.height = height;

  ctx.lineWidth = 0;

  ctx.translate(ctx.lineWidth, ctx.lineWidth);

  roundRect(ctx, width - 2 * ctx.lineWidth, height - 2 * ctx.lineWidth, Math.min(width / 10, 5));

  ctx.translate(-ctx.lineWidth, -ctx.lineWidth);

  ctx.strokeStyle = "#000";

  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.fillStyle = grd;
  ctx.fill();
  //ctx.stroke();
        
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";

  ctx.beginPath();
  ctx.moveTo((width * 0.3 | 0) + 0.5, (height * 0.15 | 0) + 0.5);
  ctx.lineTo((width * 0.92 | 0) + 0.5, (height * 0.15 | 0) + 0.5);
  ctx.lineTo((width * 0.92 | 0) + 0.5, (height * 0.95 | 0) + 0.5);
  ctx.lineTo((width * 0.3 | 0) + 0.5, (height * 0.95 | 0) + 0.5);
  ctx.lineTo((width * 0.3 | 0) + 0.5, (height * 0.15 | 0) + 0.5);
  ctx.stroke();
        
  var cw = 0.35 * width;
  var ch = 0.55 * height;

  ctx.translate(width * 0.45, height * (rank < 6 ? 0.29 : 0.3));
  ctx.fillStyle = hexcolors[suit];
  for (var k = 0; k < points.length; k += 2) {
    ctx.translate(cw * points[k], ch * points[k+1]);
    draw(ctx, suits[suit], rank >= 11 ? cw : (cw / (rank < 4 ? 1.75 : 2) | 0));
    ctx.translate(-cw * points[k], -ch * points[k+1]);
  }
  if (rank >= 11) {
    ctx.font = "bold " + Math.round(cw) + "pt Arial";
    ctx.textAlign = 'center';
    ctx.fillText(labels[rank-2], cw * 0.5, ch * 0.33);
  }
  ctx.translate(-width * 0.45, -height * (rank < 4 ? 0.29 : 0.3));

  var size = Math.round(20 / 100 * width);
  ctx.font = "bold " + Math.round(20 / 100 * width) + "pt Arial";
  ctx.textAlign = 'center';
  ctx.fillText(labels[rank-2], 15 / 100 * width, size * 1.5);
  ctx.translate(15 / 100 * width, size * 2);
  draw(ctx, suits[suit], size);
  ctx.translate(-15 / 100 * width, -size * 2);

  return can;
}