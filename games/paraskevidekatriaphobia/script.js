const VERTEX_SHADER = 'attribute vec3 vertex_position;\nattribute vec3 vertex_normal;\n\nuniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n\nuniform vec3 color;\n\nvarying vec3 pos;\nvarying vec3 normal;\n\nvec4 qtransform(vec4 q, vec4 v) {\n    return vec4(v.xyz + 2.0 * cross(cross(v.xyz, q.xyz) + q.w * v.xyz, q.xyz), 1.0);\n}\n\nvoid main(void) {\n    pos = (model * vec4(vertex_position, 1)).xyz;\n    gl_Position = projection * view * vec4(pos, 1);\n    normal = normalize(model * vec4(vertex_normal, 0)).xyz;\n}\n';
const FRAGMENT_SHADER = 'uniform highp vec3 color;\n\nvarying highp vec3 pos;\nvarying highp vec3 normal;\n\nvoid main(void) {\n    highp vec3 normal = normalize(normal);\n    highp vec3 sun = vec3(.5, .5, .6);\n    highp float brightness = max(.3, 1.3 * dot(sun, normal));\n    gl_FragColor = vec4(color.rgb * brightness, 1);\n}\n';
const QUADS_VS = 'attribute vec2 vertex_position;\nattribute vec2 uv;\n\nuniform mat4 model;\nuniform mat4 view;\nuniform mat4 projection;\n\nuniform vec3 pivot;\nuniform vec2 ratio;\n\nvarying vec2 coord;\n\nvoid main(void) {\n    coord = uv / vec2(1, 64);\n    vec4 ws_pivot = projection * view * model * vec4(pivot, 1);\n    ws_pivot /= ws_pivot.w;\n     gl_Position = ws_pivot + vec4(vertex_position / ratio / vec2(30, 15), 0, 0);\n\tgl_Position.z = -.99;\n}\n';
const QUADS_FS = 'varying highp vec2 coord;\nuniform sampler2D sdf;\n\nvoid main(void) {\n    highp float distance = texture2D(sdf, coord).a;\n    highp float color = (1. - distance / .07) * 2.0;\n    gl_FragColor = vec4(color, color, color, 1);\n    if (distance > .08) discard;\n}\n';
let sin = Math.sin;
let cos = Math.cos;
let FPS = 0;
let frame = 0;
let averageFPS = 0;
let counterFPS = 0;
let x = 0;
let y = 0;
let dx = 0;
let dy = 0;
let inputs = [0, 0, 0, 0, 0];
let gl, w, h, canvas;
let carriedObject;
let eventTriggers = [];
let engineerMessage = null;
initializeWebGL();
const MESHES = parseMeshes(await(await(await fetch("models.bin")).blob()).arrayBuffer());
const FONT_SDF = generateFontSDF(await(await(await fetch("font.bin")).blob()).arrayBuffer());
const LEGS = Array.from(Array(8), _ => [0, 0]);
const ENTITIES = [
{ name: "the cool engineer", mesh: [0, 1, 2, 3], x: -4, y: 0 },
{ name: "printer the pink one", mesh: [7], x: 10, y: 10 },
{ name: "freshly printed chicken Peppa", mesh: [6], x: 1e9, y: 5 },
{ name: "the orange portal", mesh: [8], x: 10, y: 15 },
{ name: "the blue portal", mesh: [12], x: 15, y: 13 },
{ name: "mystic box", mesh: [11], x: 5, y: 5, psi: 1 },
{ name: "printer the gray one", mesh: [13], x: 11, y: 7, psi: 2 },
];
const STATICS = [
{ name: "basement", mesh: [9], x: -8, y: 4 },
{ name: "drill", mesh: [10], x: -8, y: 4 },
];
const RANDOM_THOUGHTS = [
"I love fibonacci numbers,\nespecialy the thirteenth one!",
"I want lasagna...",
"I thought I was sad,\nbut now I just realized that\nI just didn't get enough sleep.",
"I thought I was sad,\nbut now I just realized that\nI just didn't get enough sleep.",
"I want to sleep,\nbut if I go to sleep,\nthen tomorrow will come\n",
"I don't have time to sleep,\nI must build the thing by friday the thirteenth!",
"I don't have time to sleep,\nI must build the thing by friday the thirteenth!",
"Hey, you, lazy robot,\nwhy do you do not work?",
"I even gave you a bunch of legs to move,\nwhy do you not move",
"you have eight legs by the way\nthat is a lot of legs by the way",
"eight is a fibonacci number by the way",
"I was thinking about something\nand then I started to think about thirteen\nand now I think thirteen is a cool number",
"I was thinking about something\nand then I started to think about thirteen\nand now I think thirteen is a cool number",
"thirteen is the only number\nthat is equal to the sum of its remainders\nfrom dividing it by all smaller primes",
"thirteen is the only number\nthat is equal to the sum of its remainders\nfrom dividing it by all smaller primes",
"thirteen is the only number\nthat is equal to the sum of its remainders\nfrom dividing it by all smaller primes",
"thirteen is also a fibonacci number by the way",
"but you don't have thirteen legs,\nyou have only eight legs",
"I think eight is absolutely okay number of legs,\nthirteen legs would be too much",
"I know a few spiders,\nthey all have eight legs",
"I think spiders are cool\nby the way",
"I have only two legs,\nand I think two is good enough",
"I would like to be taller,\nbut I don't know why",
"I think frogs are cool as fuck",
"I will just sleep until you're ready",
"I will just sleep until you're ready",
"I will just sleep until you're ready",
"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
];
let engineer = ENTITIES[0];
let printer = ENTITIES[1];
let chicken = ENTITIES[2];
let portal1 = ENTITIES[3];
let portal2 = ENTITIES[4];
let debug_object; {
let { faces, vertices, normals } = shadeFlat({
vertices: [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, -.25],
faces: [0, 1, 2, 1, 3, 2],
});
debug_object = {
length: faces.length,
faces: createWebGLElementArrayBuffer(faces),
vertices: createWebGLArrayBuffer(vertices),
normals: createWebGLArrayBuffer(normals),
color: [.25, .25, 1],
};
}
const shaderProgram = initShaderProgram(VERTEX_SHADER, FRAGMENT_SHADER);
const quadsShaderProgram = initShaderProgram(QUADS_VS, QUADS_FS);
let land = generateLandGeometry();
function initializeWebGL() {
canvas = document.querySelector("canvas");
gl = canvas.getContext("webgl", { alpha: false })
|| canvas.getContext("experimental-webgl", { alpha: false });
if (!gl) {
let errorMessage =
"Failed to get WebGL context.\n"
+ "Your browser or device may not support WebGL.";
alert(errorMessage);
console.error(errorMessage);
return null;
}
console.log("WebGL:", gl);
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
}
function resizeCanvas() {
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
}
async function plotline() {
await trigger(_ => dx != 0 || dy != 0);
engineerMessage = "Hey, you are finally awake.\nI was already starting to think that\nI put expired batteries in you...";
await new Promise(r => setTimeout(r, 10000));
engineerMessage = "I need to print a few chickens.\nPlease, bring me a printer,\nthe pink one...";
await trigger(_ => dist(printer) < 5);
kill(printer);
STATICS.push({ mesh: printer.mesh, x: -8, y: 0, psi: 1.57 });
engineerMessage = "thanks";
await new Promise(r => setTimeout(r, 1000));
STATICS.push(chicken);
engineerMessage = "I am a graduate space engineer,\nand I am going to build my graduation\nproject by friday the thirteenth.\nIn order to speed up things,\nI have assembled an assistant.\nI have assembled you.";
await new Promise(r => setTimeout(r, 10000));
STATICS.pop();
chicken.x = chicken.y = -2;
await new Promise(r => setTimeout(r, 5000));
engineerMessage = "Hey! It looks like\nmy freshly printed chicken ran away.\nPlease, go catch it\nIf I don't finish the project by friday the thirteen\nI will be sad!";
await trigger(_ => carriedObject == chicken);
engineerMessage = "Please, bring it to me";
await trigger(_ => dist(chicken) < 5);
STATICS.push(chicken);
kill(chicken);
engineerMessage = "thanks";
await new Promise(r => setTimeout(r, 1000));
STATICS.push(chicken);
engineerMessage = "by the way\nI am building a lasagna factory\nbecause I love lasagna!\n"
await new Promise(r => setTimeout(r, 2000));
STATICS.push(chicken);
engineerMessage = "by the way\nI am building a lasagna factory\nbecause I love lasagna!\nPlease, bring me the orange portal";
await trigger(_ => dist(portal1) < 5);
kill(portal1);
STATICS.push(chicken);
engineerMessage = "thanks";
await new Promise(r => setTimeout(r, 1000));
STATICS.push(chicken);
engineerMessage = "okay, I forgot how it works";
await new Promise(r => setTimeout(r, 2000));
STATICS.push(chicken);
engineerMessage = "I think I'll just press this button\nand we'll see what happens";
await new Promise(r => setTimeout(r, 3000));
STATICS.push(chicken);
engineerMessage = "I will press the button in three...";
await new Promise(r => setTimeout(r, 1000));
engineerMessage = "I will press the button in two...  ";
await new Promise(r => setTimeout(r, 1000));
STATICS.push(chicken);
engineerMessage = "I will press the button in one...  ";
await new Promise(r => setTimeout(r, 1000));
engineer.x = portal2.x + 2;
engineer.y = portal2.y;
engineerMessage = "I don't like portals anymore...";
await trigger(_ => dist(engineer) < .1);
await new Promise(r => setTimeout(r, 2500));
engineerMessage = "However I need both portals to\nbuild a nuclear pasta generator";
await new Promise(r => setTimeout(r, 5000));
STATICS.push(chicken);
engineerMessage = "Please, bring me the blue portal";
await trigger(_ => carriedObject == portal2 && dist({ x, y }) < 5);
carriedObject = null;
STATICS.push(chicken);
portal2.ai = processPortalAI;
engineerMessage = "oh no!\nIt is running away!\nPlease, catch it!";
await new Promise(r => setTimeout(r, 2000));
STATICS.push(chicken);
await trigger(_ => carriedObject == portal2);
engineerMessage = "gimme that thing";
await trigger(_ => dist(portal2) < 5);
STATICS.push(chicken);
kill(portal2);
engineerMessage = "thanks";
await new Promise(r => setTimeout(r, 1000));
STATICS.push(chicken);
engineerMessage = "It looks like my lasagna generator is almost ready\ndid you know that this planet receives light\nfrom an artificial sun that I made myself?\nI will turn it off in a few seconds...\nbecause I feel like the generator will look better at night";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 20000));
engineerMessage = "It looks like my lasagna generator is almost ready\ndid you know that this planet receives light\nfrom an artificial sun that I made myself?\nI will turn it off in three seconds...\nbecause I feel like the generator will look better at night";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 1000));
engineerMessage = "It looks like my lasagna generator is almost ready\ndid you know that this planet receives light\nfrom an artificial sun that I made myself?\nI will turn it off in two seconds...  \nbecause I feel like the generator will look better at night";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 1000));
engineerMessage = "It looks like my lasagna generator is almost ready\ndid you know that this planet receives light\nfrom an artificial sun that I made myself?\nI will turn it off right now          \nbecause I feel like the generator will look better at night";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 1000));
engineerMessage = "";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 5000));
engineerMessage = "...";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 2500));
engineerMessage = "...\n...";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 1500));
engineerMessage = "...\n...\nheh";
STATICS.push(chicken);
await new Promise(r => setTimeout(r, 500));
engineerMessage = "I forgot which button turns off the sun\n";
await new Promise(r => setTimeout(r, 2500));
engineerMessage = "I forgot which button turns off the sun\nmaybe that one?";
await new Promise(r => setTimeout(r, 1000));
x = y = 300;
await new Promise(r => setTimeout(r, 15000));
engineer.ai = processEngineerAI;
engineer.y = y - 40; engineer.x = x;
engineerMessage = "Here you are!\nI have been looking for you everywhere!\n";
await trigger(_ => dist({ x, y }, engineer) < 10);
await new Promise(r => setTimeout(r, 4000));
engineerMessage = "I accidentally teleported you, sorry.";
await new Promise(r => setTimeout(r, 3000));
engineerMessage = "However, lasagna is ready.\nlet's go eat lasagna!\n! ! !! !!! !!!!! !!!!!!!!";
await new Promise(r => setTimeout(r, 5000));
speed = 0;
engineer.x = x + 5;
engineer.y = y - 5;
engineerMessage = (
"lasag  l   a  lasag      lasag  g   n  lasa \n" +
"  a    a   l  a          a      aa  g  a   g\n" +
"  g    sagna  sagna      sagna  s g a  s   n\n" +
"  n    a   s  a          a      a  ns  a   a\n" +
"  a    g   a  gnala      gnala  l   a  gnal \n" +
"\n\nthank you for making lasagna with me\nbye!"
);
engineer.mesh = [];
}
async function trigger(f) {
await new Promise(r => eventTriggers.push(_ => f() ? r() : 0));
}
function kill(object) {
if (object == carriedObject)
carriedObject = null;
object.x = 1e9;
object.ai = null;
}
function dist(point1, point2 = { x: -4, y: 0 }) {
return ((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2) ** .5;
}
let previousFrameTime = 0;
let lastPickupTime = 0;
let lastMoveTime = 0;
let dt = 0;
let speed = 8;
let currentTime = 0;
function update(currentTimeNew) {
currentTime = currentTimeNew / 1000;
dt = currentTime - previousFrameTime;
previousFrameTime = currentTime;
if (currentTime - lastPickupTime > .2 && carriedObject != null && inputs[4] == 1) {
lastPickupTime = currentTime;
if (carriedObject != engineer) {
carriedObject.x += 1;
carriedObject.y -= 1;
}
carriedObject = null;
}
dx = -inputs[0] - inputs[1] + inputs[2] + inputs[3];
dy = +inputs[0] - inputs[1] - inputs[2] + inputs[3];
if (dx != 0 || dy != 0) {
let angle = Math.atan2(dy, dx);
dx = cos(angle) * dt * speed;
dy = sin(angle) * dt * speed;
}
x += dx; y += dy;
if (dx != 0 || dy != 0) lastMoveTime = currentTime;
processChikenAI(currentTime);
processPortalAI(currentTime);
processEngineerAI(currentTime);
if (carriedObject) {
carriedObject.x = x;
carriedObject.y = y;
if (dy != 0 || dx != 0)
carriedObject.psi = Math.atan2(dy, dx);
}
for (let trigger of eventTriggers)
trigger();
FPS = 1 / dt;
averageFPS = (FPS + counterFPS * averageFPS) / (counterFPS + 1);
counterFPS += 1;
if (counterFPS % 300 == 0) {
console.log(
" size =", gl.drawingBufferWidth, gl.drawingBufferHeight,
" FPS =", Math.round(averageFPS)
);
counterFPS = 0;
averageFPS = 0;
}
resizeCanvas();
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
drawScene(currentTime);
requestAnimationFrame(update);
}
function processChikenAI(currentTime) {
let dx, dy;
if (dist({ x, y }, chicken) < 30 && currentTime - lastMoveTime < .5) {
let angle = Math.atan2(chicken.y - y, chicken.x - x);
dx = 2 * speed * dt * cos(angle);
dy = 2 * speed * dt * sin(angle);
} else {
let angle = Math.atan2(10 * sin(currentTime / 2) - chicken.y, 10 * cos(currentTime / 2) - chicken.x);
dx = .5 * speed * dt * cos(angle);
dy = .5 * speed * dt * sin(angle);
}
chicken.x += dx;
chicken.y += dy;
chicken.psi = Math.atan2(dy, dx);
}
function processPortalAI(currentTime) {
if (portal2.ai == null) return;
if (dist({ x, y }, portal2) < 30) {
let angle = Math.atan2(portal2.y - y, portal2.x - x);
let portalSpeed = speed * Math.min(1, 3375 / dist(portal2) ** 3);
portal2.x += portalSpeed * dt * cos(angle);
portal2.y += portalSpeed * dt * sin(angle);
portal2.psi = angle;
}
}
let engineerGoesToPlayer = false;
function processEngineerAI(currentTime) {
let angle = Math.atan2(y - engineer.y, x - engineer.x);
if (y != engineer.y || x != engineer.x)
engineer.psi = angle;
if (engineer.ai == null) return;
if (dist({ x, y }, engineer) > 20)
engineerGoesToPlayer = true;
if (dist({ x, y }, engineer) > 8 && engineerGoesToPlayer) {
engineer.x += 2 * speed * dt * cos(angle);
engineer.y += 2 * speed * dt * sin(angle);
} else
engineerGoesToPlayer = false;
}
function drawScene(t) {
frame++;
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clearDepth(1.0);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
const viewMatrix = new Float32Array([0.7071067690849304, -0.5, 0.5, 0, 0.7071067690849304, 0.5, -0.5, 0, 0, 0.7071067690849304, 0.7071067690849304, 0, 0, 0, 0, 1]);
for (let i = 0; i < 4; i++)
viewMatrix[12 + i] -= viewMatrix[i] * (x + 10) + viewMatrix[4 + i] * (y - 10) + viewMatrix[8 + i] * 14;
const projectionMatrix = perspective(0.78539, w / h, .1, 100);
gl.useProgram(shaderProgram);
let { vertices, normals, faces } = land;
gl.uniform3f(gl.getUniformLocation(shaderProgram, "color"), .5, .5, 0);
gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "view"), 0, viewMatrix);
gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "projection"), 0, projectionMatrix);
gl.bindBuffer(gl.ARRAY_BUFFER, (vertices));
gl.vertexAttribPointer(0, 3, gl.FLOAT, 0, 0, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, (normals));
gl.vertexAttribPointer(1, 3, gl.FLOAT, 0, 0, 0);
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, (faces));
for (let landX = (x / 74 | 0) - 1; landX <= (x / 74 | 0) + 1; landX++)
for (let landY = (y / 74 | 0) - 1; landY <= (y / 74 | 0) + 1; landY++) {
land.color = landY + landX < 3 ? [0, .3, 0] : [.1, .0, 0];
draw(land, landX * 74, landY * 74, 0, 1.57);
}
const modelMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "model"), 0, modelMatrix);
draw(MESHES[4], x + (dx != 0 ? Math.random() - .5 : 0) * .3, y, 1, (dy != 0 || dx != 0) ? Math.atan2(dy, dx) : -0.785);
for (let i = 0; i < 8; i++) {
let alpha = i / 4 * Math.PI + .5;
draw(MESHES[5], ...LEGS[i], 0, alpha);
if (dx == 0 && dy == 0) continue;
alpha += (Math.random() - .5) / 2;
if (frame / 2 % 4 == i % 4)
LEGS[i] = [x + 8 * dx * Math.random() + 2 * cos(alpha), y + 8 * dy * Math.random() + 2 * sin(alpha)];
}
let minDist = 1e9;
let object;
for (let entity of ENTITIES) {
for (let meshId of entity.mesh)
draw(MESHES[meshId], entity.x, entity.y, (entity.z ?? 0) + (entity == carriedObject) * 3, entity.psi ?? 0);
let dist = (entity.x - x) ** 2 + (entity.y - y) ** 2;
if (dist < minDist) {
minDist = dist;
object = entity;
}
}
for (let i = 0; i < STATICS.length; i++) {
let entity = STATICS[i];
let x = i < 3 ? entity.x : -8 + 5 * cos(4 * currentTime + i ** 2);
let y = i < 3 ? entity.y : 4 + 5 * sin(4 * currentTime + i ** 2);
let z = i < 3 ? (i == 1) ? -1.5 - 1.5 * sin((4 + 2 * cos(currentTime / 5)) * currentTime) : 0 : 5 + 2 * sin(i);
let psi = i < 3 ? (entity.psi ?? 0) : (5 * currentTime * i);
for (let meshId of entity.mesh)
draw(MESHES[meshId], x, y, z, psi);
}
gl.useProgram(quadsShaderProgram);
gl.uniformMatrix4fv(gl.getUniformLocation(quadsShaderProgram, "model"), 0, modelMatrix);
gl.uniformMatrix4fv(gl.getUniformLocation(quadsShaderProgram, "view"), 0, viewMatrix);
gl.uniformMatrix4fv(gl.getUniformLocation(quadsShaderProgram, "projection"), 0, projectionMatrix);
gl.uniform3f(gl.getUniformLocation(quadsShaderProgram, "pivot"), engineer.x, engineer.y, (engineer.z ?? 0) + 2);
gl.uniform2f(gl.getUniformLocation(quadsShaderProgram, "ratio"), 16 / 9, 1);
if (engineer.ai == null)
if ((engineer.x + 4) ** 2 + (engineer.y) ** 2 > 16) {
if (engineer == carriedObject)
print("take me to the construction site");
else
print("I am smol\nplease carry me");
} else {
if (engineer == carriedObject) {
print("put me down on the ground!");
} else {
print(engineerMessage ?? RANDOM_THOUGHTS[currentTime / 5 % RANDOM_THOUGHTS.length | 0]);
engineer.x = -4; engineer.y = 0;
}
}
else
print(engineerMessage);
if (minDist ** .5 < 7) {
gl.uniform3f(gl.getUniformLocation(quadsShaderProgram, "pivot"), object.x, object.y, 2);
if (carriedObject != object && object != engineer)
print(object.name);
if (t - lastPickupTime > .2 && carriedObject == null && inputs[4] == 1) {
lastPickupTime = t;
carriedObject = object;
}
}
}
function perspective(fovy, aspect, near, far) {
return new Float32Array([1.0 / Math.tan(fovy / 2) / aspect, 0, 0, 0, 0, 1.0 / Math.tan(fovy / 2), 0, 0, 0, 0, (near + far) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]);
}
function draw(object, x, y, z, psi) {
const modelMatrix = new Float32Array([cos(-psi - 1.57), -sin(-psi - 1.57), 0, 0, sin(-psi - 1.57), cos(-psi - 1.57), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
modelMatrix[12] += x, modelMatrix[13] += y, modelMatrix[14] += z;
gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "model"), 0, modelMatrix);
gl.uniform3fv(gl.getUniformLocation(shaderProgram, "color"), object.color);
gl.bindBuffer(gl.ARRAY_BUFFER, object.vertices);
gl.vertexAttribPointer(0, 3, gl.FLOAT, 0, 0, 0);
gl.enableVertexAttribArray(0);
gl.bindBuffer(gl.ARRAY_BUFFER, object.normals);
gl.vertexAttribPointer(1, 3, gl.FLOAT, 0, 0, 0);
gl.enableVertexAttribArray(1);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.faces);
gl.drawElements(gl.TRIANGLES, object.length, gl.UNSIGNED_SHORT, 0);
}
function print(text) {
let lines = text.split("\n").reverse();
let vertices = [];
let uvs = [];
for (let y = 0; y < lines.length; y++) {
let line = lines[y];
let x0 = -line.length / 2;
for (let i = 0; i < line.length; i++) {
let x = x0 + i;
let z = " abcdefghijklmnopqrstuvwxyz.!HI,P'".indexOf(line[i]);
vertices.push(x, y, x + 1, y, x + 1, y + 1, x + 1, y + 1, x, y + 1, x, y);
uvs.push(0, z, 1, z, 1, z + 1, 1, z + 1, 0, z + 1, 0, z);
}
}
gl.bindBuffer(gl.ARRAY_BUFFER, createWebGLArrayBuffer(vertices));
gl.vertexAttribPointer(0, 2, gl.FLOAT, 0, 0, 0);
gl.enableVertexAttribArray(0);
gl.bindBuffer(gl.ARRAY_BUFFER, createWebGLArrayBuffer(uvs));
gl.vertexAttribPointer(1, 2, gl.FLOAT, 0, 0, 0);
gl.enableVertexAttribArray(1);
gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}
function createWebGLArrayBuffer(array) {
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
return buffer;
}
function createWebGLElementArrayBuffer(array) {
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), gl.STATIC_DRAW);
return buffer;
}
function initShaderProgram(vsSource, fsSource) {
const vs = loadShader(gl.VERTEX_SHADER, vsSource);
const fs = loadShader(gl.FRAGMENT_SHADER, fsSource);
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vs);
gl.attachShader(shaderProgram, fs);
gl.bindAttribLocation(shaderProgram, 0, "vertex_position");
gl.bindAttribLocation(shaderProgram, 1, "vertex_normal");
gl.bindAttribLocation(shaderProgram, 1, "uv");
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
alert(`GPU program error: ${gl.getProgramInfoLog(shaderProgram)}`);
return shaderProgram;
}
function loadShader(type, source) {
const shader = gl.createShader(type);
gl.shaderSource(shader, source);
gl.compileShader(shader);
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
alert(`Shader error: ${gl.getShaderInfoLog(shader)}`);
return shader;
}
function generateLandGeometry() {
let size = 250;
let scale = .3;
let faces = [];
let vertices = [];
for (let i = 0; i < size * size; i++) {
vertices.push(i % size * scale - size * scale / 2, Math.floor(i / size) * scale - size * scale / 2, Math.random() * scale);
}
for (let y = 0; y < size - 1; y++)
for (let x = 0; x < size - 1; x++) {
faces.push(y * size + x, y * size + x + 1, y * size + size + x + 1);
faces.push(y * size + x, y * size + size + x + 1, y * size + size + x);
}
return createWebGLMesh(shadeSmooth({ faces, vertices }));
}
function shadeSmooth(mesh) {
let { faces, vertices } = mesh;
let normals = vertices.map(_ => 0);
for (let face = 0; face < mesh.faces.length; face += 3) {
let [i, j, k] = mesh.faces.slice(face, face + 3).map(i => 3 * i);
let u = mesh.vertices.slice(i, i + 3);
let v = mesh.vertices.slice(j, j + 3);
let w = mesh.vertices.slice(k, k + 3);
let uv = sub(v, u);
let uw = sub(w, u);
let normal = cross(uv, uw);
normals[i] += normal[0];
normals[i + 1] += normal[1];
normals[i + 2] += normal[2];
normals[j] += normal[0];
normals[j + 1] += normal[1];
normals[j + 2] += normal[2];
normals[k] += normal[0];
normals[k + 1] += normal[1];
normals[k + 2] += normal[2];
}
return { faces, vertices, normals };
}
function shadeFlat(mesh) {
let faces = [];
let vertices = [];
let normals = [];
for (let face = 0; face < mesh.faces.length; face += 3) {
let [i, j, k] = mesh.faces.slice(face, face + 3).map(i => 3 * i);
let u = mesh.vertices.slice(i, i + 3);
let v = mesh.vertices.slice(j, j + 3);
let w = mesh.vertices.slice(k, k + 3);
vertices.push(...u, ...v, ...w);
faces.push(face, face + 1, face + 2);
let uv = sub(v, u);
let uw = sub(w, u);
let normal = cross(uv, uw);
normals.push(...normal, ...normal, ...normal);
}
return { faces, vertices, normals };
}
function parseMeshes(blob) {
let i = 0;
let bytes = new Uint8Array(blob);
let meshes = [];
while (i != bytes.length) {
let color = [...bytes.slice(i, i += 3)].map(x => (x / 255) ** 2);
let smooth = bytes[i++] == 1;
let scale = .9 ** bytes[i++];
let faces = [];
let vertices = Array.from(Array(3 * bytes[i++]), () => (bytes[i++] - 128) * scale);
let facesCount = bytes[i++];
for (let j = 0; j < facesCount; j++) {
let u = bytes[i++];
let v = bytes[i++];
let q = bytes[i++];
let w = bytes[i++];
faces.push(u, v, q, q, w, u);
}
meshes.push(createWebGLMesh(smooth ? shadeSmooth({ faces, vertices }) : shadeFlat({ faces, vertices }), color));
}
meshes.push({ ...meshes[8] });
meshes.push({ ...meshes[7] });
meshes[12].color = [0.5, 0.5, 1];
meshes[13].color = [0.5, 0.5, 0.5];
return meshes;
}
function createWebGLMesh(geometry, color) {
let { faces, vertices, normals } = geometry;
return {
length: faces.length,
faces: createWebGLElementArrayBuffer(faces),
vertices: createWebGLArrayBuffer(vertices),
normals: createWebGLArrayBuffer(normals),
color: color,
};
}
function generateFontSDF(blob) {
let i = 0;
let bytes = new Uint8Array(blob);
let texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
let pixels = new Uint8Array(1 << 17).map(_ => 255);
for (let z = 1; z < 64; z++) {
let points = [];
[0, 1, 2].map(_ => {
let p = [0, 1, 2].map(_ => [1 / 6 + (bytes[i] / 16 | 0) / 14 / 1.5, .25 + bytes[i++] % 16 / 15 * 1.5]);
for (let t = 0; t <= 1; t += 1 / 32)
points.push([0, 1].map(i =>
(1 - t) * ((1 - t) * p[0][i] + t * p[1][i]) + t * ((1 - t) * p[1][i] + t * p[2][i])
));
});
for (let y = 0; y < 64; y++)
for (let x = 0; x < 32; x++)
pixels[2048 * z + 32 * y + x] = Math.min(...points.map(p => ((x / 32 - p[0]) ** 2 + (y / 32 - p[1]) ** 2) ** .5)) * 128;
}
gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, 32, 64 * 64, 0, gl.ALPHA, gl.UNSIGNED_BYTE, pixels);
return texture;
}
function sub(u, v) {
return u.map((x, i) => x - v[i]);
}
function cross(u, v) {
return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
}
document.addEventListener('keydown', event =>
inputs["WASDc".indexOf(event.code[3])] = 1
);
document.addEventListener("keyup", event =>
inputs["WASDc".indexOf(event.code[3])] = 0
);
requestAnimationFrame(update);
plotline();
