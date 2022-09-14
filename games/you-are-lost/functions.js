const reset = onresize = () => {
  scale = Math.min(innerWidth / width, innerHeight / height);
  canvas.width = scale * width;
  canvas.height = scale * height;

  offsetX = (innerWidth - scale * width) / 2;
  canvas.style.left = offsetX + 'px';
  offsetY = (innerHeight - scale * height) / 2;
  canvas.style.top = offsetY + 'px';

  ctx.scale(scale, scale);
  ctx.translate(width / 2, height / 2);

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fd9';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.font = '30px Bookman Old Style, serif';

  ctx.shadowColor = 'rgba(0,0,0,.5)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = ctx.shadowOffsetY = 2;

  screens[currentScreen].render();
};

const drawLine = (x, y, parts) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(parts[0], parts[1]);
      for (var i = 2; i < parts.length; i += 2) {
        ctx.lineTo(parts[i], parts[i + 1]);
      }
      ctx.stroke();
      ctx.restore();
};

const drawPolygon = (x, y, parts) => {
    const last = parts.length - 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(parts[last - 1], parts[last]);
    for (var i = 0; i < last; i += 2) {
      ctx.lineTo(parts[i], parts[i + 1]);
    }
    ctx.stroke();
    ctx.restore();
};

const fillPolygon = (x, y, parts) => {
    const last = parts.length - 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(parts[last - 1], parts[last]);
    for (var i = 0; i < last; i += 2) {
      ctx.lineTo(parts[i], parts[i + 1]);
    }
    ctx.fill();
    ctx.restore();
};

const drawTriangle = (x, y) => {
  drawPolygon(x, y, [-12, -14, -12, 14, 12, 0]);
};

const drawText = (text, align, x, y) => {
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

const drawEllipse = (x, y, rx, ry=rx) => {
  ctx.beginPath();
  ctx.save();
  ctx.scale(rx / ry, 1);
  ctx.arc(x, y, ry, 0, 7, 0);
  ctx.fill();
  ctx.restore();
};

const drawRing = (x, y, r) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 7, 0);
  ctx.stroke();
};

const drawMessage = text => {
  ctx.fillStyle = '#000';
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = '18px Bookman Old Style, serif';
  drawText(text, 'center', 0, 0);

  const w = Math.max(100, ctx.measureText(text).width);
  ctx.strokeStyle = '#999';
  ctx.strokeRect(-w / 2 - 20, -30, w + 40, 50);
  drawLine(-w / 2 - 25, -35, [w / 3, 0, -10, 0, -10, -10, 0, -10, 0, 20]);
  drawLine(w / 2 + 25, -35, [-w / 3, 0, 10, 0, 10, -10, 0, -10, 0, 20]);
  drawLine(-w / 2 - 25, 25, [w / 3, 0, -10, 0, -10, 10, 0, 10, 0, -20]);
  drawLine(w / 2 + 25, 25, [-w / 3, 0, 10, 0, 10, 10, 0, 10, 0, -20]);
};

const getScreenPos = e => {
  return {
    x: (e.pageX - offsetX) / scale - width / 2,
    y: (e.pageY - offsetY) / scale - height / 2
  };
};

const clamp = pos => {
  pos.x = Math.min(-20 + width / 2, Math.max(20 - width / 2, pos.x));
  pos.y = Math.min(-20 + height / 2, Math.max(20 - height / 2, pos.y));
}

const wait = async (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

const transition = async () => {
  transitioning = 1;
  draggables = [];
  dragging = false;

  curtain.classList.toggle('black');
  await wait(1000);

  ++currentScreen;
  screens[currentScreen].init();
  transitioning = 0;
  reset();

  curtain.classList.toggle('black');
  await wait(1000);
  document.location.hash = '#' + currentScreen;
};

const hasHitCircle = (e, a, b, r) => {
    const {x, y} = getScreenPos(e);
    const distance = Math.hypot(a - x, b - y);
    return distance <= r;
};
