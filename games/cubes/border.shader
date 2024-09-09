#ifdef GL_ES
precision highp float;
#endif

uniform mat4 uModelviewprojection; 

#ifdef VERTEX
attribute vec3 aVertex;

void main() {
	gl_Position = uModelviewprojection * vec4(aVertex, 1.0);  
}
#endif

#ifdef FRAGMENT
void main() {
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); 
}
#endif
