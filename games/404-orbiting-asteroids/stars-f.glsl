precision mediump float;

uniform vec2 iResolution;
uniform vec3 viewerPosition;
uniform float zoom;

#define STARDUST_DEPTHS 10.
#define STARDUST_DEPTH_SPEED .001
#define STARFIELD_QUANT 160. // Lower = more
#define HOT_COLOR_MULT 1.2
#define STARDUST_ZOOM_MAX 50. // the highest zoom that shows stardust

#define STAR_DEPTHS 5.
#define STAR_DEPTH_SPEED 0.00005

vec3 nrand3(vec2 n) {
	vec3 a = fract( cos( n.x*8.3e-3 + n.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( n.x*0.3e-3 + n.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}

float Hash21(vec2 p, float s1, float s2, float s3) {
	p = fract(p * vec2(s1, s2));
	p += dot(p, p + s3);
	return fract(p.x * p.y);	
}

vec3 starfieldRand(in vec2 uvs, in float depthLevel, in float spd) {
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.); // ?
	p += viewerPosition.xyz * (depthLevel * spd);
	vec2 seed = p.xy * 2.0 + depthLevel;	
	seed = floor(seed * iResolution.x);
	return nrand3(seed);
}

vec3 HotColor(float size, float rand) {
	float hotnessRand = fract(rand * 56787.23);
	float colorRand = fract(rand * 12354.3);
	float hotness = hotnessRand * .5 + size * .5;

	vec3 color;
	if (hotness < .6) {
		color = vec3(1., hotness/.6 , hotness*.9);
	} else {
		float rg = 1. - (hotness - .6)/.4;
		color = vec3(rg,rg,1.);
	}
	color = clamp(color * HOT_COLOR_MULT, 0., 1.);
	return color;
}

vec4 Starfield(in float randNum) {
	vec4 starColor = vec4(pow(randNum, STARFIELD_QUANT));
	return starColor;
}

vec4 Stardust(in vec2 uvs) {
	vec4 c = vec4(0);
	for(float i=0.; i<1.; i +=1./STARDUST_DEPTHS) {
		vec3 r = starfieldRand(uvs, i, STARDUST_DEPTH_SPEED);
		c += Starfield(r.y);
	}
	// Fade out stardust when zoomed out
	c.a *= smoothstep(STARDUST_ZOOM_MAX, 1., zoom);
	return c;
}

vec4 Stars(in vec2 uvs) {
	vec4 c = vec4(0);
	for(float i=0.; i<1.; i +=1./STAR_DEPTHS) {
		vec3 r = starfieldRand(uvs, i, STAR_DEPTH_SPEED);
		c += Starfield(r.y);
		c *= vec4(HotColor(1., r.y), 1.);
	}
	return c;
}

void main() {
	vec2 fragCoord = gl_FragCoord.xy;
	vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;

	gl_FragColor += Stars(uv);
	gl_FragColor += Stardust(uv);

	if (gl_FragColor.a < .1 || (gl_FragColor.r < .1 && gl_FragColor.g < .1 && gl_FragColor.b < .1)) {
		discard;
	}
}
