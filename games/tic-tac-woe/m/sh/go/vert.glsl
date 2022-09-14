attribute float index;
attribute vec2 offset;
attribute vec2 size;
attribute vec3 color;

varying vec2 vUv;
varying vec3 vColor;

uniform float uTime;

void main() {

  vUv = uv;

  vColor = color;

  vec4 mvPos = modelViewMatrix * vec4(position, 1.);

  float anim = sin((uTime * 2. + index * 100.) / 1000.) * .5 + .5;

  mvPos.xy += offset * vec2(size.x * 0.25, size.y*0.25) * anim;

  gl_Position = projectionMatrix * mvPos;

}