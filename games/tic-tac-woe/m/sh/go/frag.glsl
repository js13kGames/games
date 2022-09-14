precision mediump float;

varying vec2 vUv;
varying vec3 vColor;

void main() {

  vec4 difColor = vec4(vColor, 1.);

  vec2 p = vUv * 2. - 1.;

  difColor.a = 1. - smoothstep(length(p), 0., .05);

  difColor.a = clamp(difColor.a, 0., 1.);

  gl_FragColor = difColor;

}
