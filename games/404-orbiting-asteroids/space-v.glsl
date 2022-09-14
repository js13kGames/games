attribute vec3 position;
uniform vec3 viewerPosition;
uniform float zoom;
attribute vec4 color;
varying vec4 v_color;
void main() {
	// gl_Position = vec4((position + translation) * zoom, 1.0);
	gl_Position = vec4(position - viewerPosition, zoom);
	v_color = color;
}
