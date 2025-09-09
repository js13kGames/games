// position inside canvas
const getInsidePosition = () => {
  const x = Math.random() * WIDTH;
  const y = Math.random() * HEIGHT;

  return { x, y };
};

// position outside canvas
const getOutsidePosition = () => {
  const xR = Math.random() * 200 + 100;
  const yR = Math.random() * 200 + 100;
  const x = Math.random() > 0.5 ? WIDTH + xR : -xR;
  const y = Math.random() > 0.5 ? HEIGHT + yR : -yR;

  return { x, y };
};

// angle from current to destination
const getRadius = ({ cX, cY, dX, dY }, cR = 0) => {
  let r = Math.atan((cY - dY) / (cX - dX));
  if (cX > dX) {
    r -= Math.PI;
  }

  // normalize angle to prevent big jumps
  while (cR - r > Math.PI) {
    r += 2 * Math.PI;
  }

  while (r - cR > Math.PI) {
    r -= 2 * Math.PI;
  }

  return r;
};

// clamp min max
const clampMM = (val, min, max) => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
};

// clamp from current to destination
const clampCD = (val, c, d) => {
  const o = c - d;
  const [min, max] = o < 0 ? [o, -o] : [-o, o];

  return clampMM(val, min, max);
};

// check if point is inside box
const inBox = (lX, x, rX, tY, y, bY) => {
  return lX <= x && x <= rX && tY <= y && y <= bY;
};
