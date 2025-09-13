
const gl = c.getContext("webgl2");

function createShader(t, s) {
  const shader = gl.createShader(t);
  gl.shaderSource(shader, s);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
  }
  return shader;
}

function createProgram(v, f) {
  const program = gl.createProgram();
  gl.attachShader(program, v);
  gl.attachShader(program, f);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
  }
  return program;
}

function createBuffer(b, s, u) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(b, buffer);
  gl.bufferData(b, s, u);
  return buffer;
}

const program = createProgram(
  createShader(
    gl.VERTEX_SHADER,
    `#version 300 es
in vec2 a_xy;
in vec2 a_uv;
in vec4 a_tint;

out vec2 v_uv;
out vec4 v_tint;

uniform mat4 u_mat;

void main() {
  gl_Position = vec4(u_mat * vec4(a_xy, 1.0, 1.0)); // remove .0 test
  v_uv = a_uv;
  v_tint = a_tint;
}
`),
  createShader(
    gl.FRAGMENT_SHADER,
    `#version 300 es
precision highp float;
in vec2 v_uv;
in vec4 v_tint;

uniform sampler2D u_image;
out vec4 outColor;

void main() {
  outColor = texture(u_image, v_uv);
}
`));

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, png);

// x, y, u, v, rgba
const VERTEX_SIZE = 4 * 2 + 4 * 2 + 4;
const MAX_BATCH = 10922;
const MAX_STACK = 100;
const MAT_SIZE = 6;
const VERTS_PER_QUAD = 6;
const MAT_STACK_SIZE = MAX_STACK * MAT_SIZE;
const VERTS_DATA_SIZE = VERTEX_SIZE * MAX_BATCH * 4;
const INDEX_DATA_SIZE = MAX_BATCH * (2 * VERTS_PER_QUAD);
const w = c.width;
const h = c.height;

// stores positions, uv, tint
const vd = new ArrayBuffer(VERTS_DATA_SIZE);
const vpd = new Float32Array(vd);
const vid = new Uint16Array(INDEX_DATA_SIZE);
const ibo = createBuffer(gl.ELEMENT_ARRAY_BUFFER, vid.byteLength, gl.STATIC_DRAW);
const vbo = createBuffer(gl.ARRAY_BUFFER, vd.byteLength, gl.DYNAMIC_DRAW);

let count = 0; // verticies

// prettier-ignore
let mat = new Float32Array([
  1, 0,
  0, 1,
  0, 0,
]);
let stack = new Float32Array(100);
let stackPointer = 0;
var {round,cos,sin,abs,floor,ceil,random,min,max} = Math;

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);

gl.useProgram(program);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
const MAX_VERTS = MAX_BATCH * VERTS_PER_QUAD;
for (let i = (j = 0); i < MAX_VERTS; i += VERTS_PER_QUAD, j += 4) {
  vid[i + 0] = j;
  vid[i + 1] = j + 1;
  vid[i + 2] = j + 2;
  vid[i + 3] = j;
  vid[i + 4] = j + 3;
  vid[i + 5] = j + 1;
}

gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, vid);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

const pal = gl.getAttribLocation(program, "a_xy");
const txal = gl.getAttribLocation(program, "a_uv");
const tnal = gl.getAttribLocation(program, "a_tint");
gl.enableVertexAttribArray(pal);
gl.vertexAttribPointer(pal, 2, gl.FLOAT, 0, VERTEX_SIZE, 0);
gl.enableVertexAttribArray(txal);
gl.vertexAttribPointer(txal, 2, gl.FLOAT, 0, VERTEX_SIZE, 8);
gl.enableVertexAttribArray(tnal);
gl.vertexAttribPointer(tnal, 4, gl.UNSIGNED_BYTE, 1, VERTEX_SIZE, 16);

const rx = 2 / w;
const ry = -2 / h;
gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_mat"), 0, new Float32Array([rx,0,0,0,0,ry,0,0,0,0,1,1,-1,1,0,0]));
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

const render = {
  gl,
  c,
  color: 0xffffffff, //white (argb)
  bkg(r, g, b) {
    gl.clearColor(r / 255, g / 255, b / 255, 1);
  },
  clear() {
    gl.clear(gl.COLOR_BUFFER_BIT);
  },
  translate(x, y) {
    mat[4] = (mat[0] * x) + (mat[2] * y) + mat[4];
    mat[5] = (mat[1] * x) + (mat[3] * y) + mat[5];
  },
  scale(x, y) {
    mat[0] *= x;
    mat[1] *= x;
    mat[2] *= y;
    mat[3] *= y;
  },
  rotate(r) {
    const a = mat[0];
    const b = mat[1];
    const c = mat[2];
    const d = mat[3];
    const sr = sin(r);
    const cr = cos(r);
    mat[0] = a * cr + c * sr;
    mat[1] = b * cr + d * sr;
    mat[2] = a * -sr + c * cr;
    mat[3] = b * -sr + d * cr;
  },
  push() {
    stack[stackPointer + 0] = mat[0];
    stack[stackPointer + 1] = mat[1];
    stack[stackPointer + 2] = mat[2];
    stack[stackPointer + 3] = mat[3];
    stack[stackPointer + 4] = mat[4];
    stack[stackPointer + 5] = mat[5];
    stackPointer += 6;
  },
  pop() {
    stackPointer -= 6;
    mat[0] = stack[stackPointer + 0];
    mat[1] = stack[stackPointer + 1];
    mat[2] = stack[stackPointer + 2];
    mat[3] = stack[stackPointer + 3];
    mat[4] = stack[stackPointer + 4];
    mat[5] = stack[stackPointer + 5];
  },
  quad(x, y, w, h, u, v, uw = w, uh = h) {
    const x0 = x;
    const y0 = y;
    const x1 = x + w;
    const y1 = y + h;
    const x2 = x;
    const y2 = y + h;
    const x3 = x + w;
    const y3 = y;

    const u0 = u / png.width;
    const v0 = v / png.height;
    const u1 = (u + uw) / png.width;
    const v1 = (v + uh) / png.height;

    const [a, b, c, d, e, f] = mat;
    const argb = render.color;
    let offset = 0;

    if (count + 1 >= MAX_BATCH) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vd);
      gl.drawElements(gl.TRIANGLES, count * VERTS_PER_QUAD, gl.UNSIGNED_SHORT, 0);
      count = 0;
    }

    offset = count * VERTEX_SIZE;
    // Vertex Order XY|UV|ARGB
    // Vertex 1
    vpd[offset++] = x0 * a + y0 * c + e;
    vpd[offset++] = x0 * b + y0 * d + f;
    vpd[offset++] = u0;
    vpd[offset++] = v0;
    vpd[offset++] = 0xffffffff;

    vpd[offset++] = x1 * a + y1 * c + e;
    vpd[offset++] = x1 * b + y1 * d + f;
    vpd[offset++] = u1;
    vpd[offset++] = v1;
    vpd[offset++] = 0xffffffff;

    vpd[offset++] = x2 * a + y2 * c + e;
    vpd[offset++] = x2 * b + y2 * d + f;
    vpd[offset++] = u0;
    vpd[offset++] = v1;
    vpd[offset++] = 0xffffffff;

    vpd[offset++] = x3 * a + y3 * c + e;
    vpd[offset++] = x3 * b + y3 * d + f;
    vpd[offset++] = u1;
    vpd[offset++] = v0;
    vpd[offset++] = 0xffffffff;

    if (++count >= MAX_BATCH) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vd);
      gl.drawElements(gl.TRIANGLES, count * VERTS_PER_QUAD, gl.UNSIGNED_SHORT, 0);
      count = 0;
    }
  },
  flush() {
    if (count == 0) return;
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vpd.subarray(0, count * VERTEX_SIZE));
    gl.drawElements(gl.TRIANGLES, count * VERTS_PER_QUAD, gl.UNSIGNED_SHORT, 0);
    count = 0;
  },
};

window["render"] = render;