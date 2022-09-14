precision mediump float;
varying vec3 v_uv;

uniform sampler2D atlas;

void main() {
    gl_FragColor = texture2D( atlas, v_uv.xy );
    gl_FragColor = vec4( gl_FragColor.xyz, gl_FragColor.a * v_uv.z );
}
