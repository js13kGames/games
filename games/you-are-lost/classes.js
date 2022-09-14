let draggables = [];
let dragging = false;

onmousedown = e => {
  if (transitioning || screens[currentScreen].s) return;
  draggables.some(draggable => {
    if (!draggable.s && draggable.isHit(e)) {
      dragging = draggable;
      return true;
    }
  });
};

onmousemove = e => {
  if (!dragging) {
    if (!transitioning && !screens[currentScreen].s && screens[currentScreen].onmousemove) {
      screens[currentScreen].onmousemove(e);
    }

    return;
  }
  if (!dragging.s) dragging.move(getScreenPos(e));
};

onmouseup = onmouseout = onmouseleave = e => {
  dragging = false;
};

class Draggable {
  constructor(x, y, methods) {
    this.x = x;
    this.y = y;
    for (const i in methods) {
      this[i] = methods[i];
    }
    if (this.init) this.init();
    draggables.push(this);
  }
}

for (const event of ['onclick', 'onkeydown', 'onmouseup']) {
  window[event] = e => {
    if (!transitioning && !screens[currentScreen].s && screens[currentScreen][event]) {
      screens[currentScreen][event](e);
    }
  };
}

class Screen {
  constructor(methods) {
    for (const i in methods) {
      this[i] = methods[i];
    }
    this.init = this.init || (() => {});
  }
}
