


vec3 neutral = vec3(0.827,0.788,0.89);

vec3 frontCol_00 = vec3(1.0, 0.898, 0.804);

vec3 frontCol_01 = vec3(1.0, 0.733, 0.486);

vec3 frontCol_02 = vec3(1.50, 0.50, 0.60);


varying vec2 vUvs;
uniform vec2 resolution;
uniform float time;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://iquilezles.org/
//
// https://www.shadertoy.com/view/Xsl3Dl
vec3 hash( vec3 p ) 
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
  float amplitude = 1.0;
  float frequency = 1.0;
  float total = 0.0;
  float normalization = 0.0;

  for (int i = 0; i < octaves; ++i) {
    float noiseValue = noise(p * frequency);
    total += noiseValue * amplitude;
    normalization += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  total /= normalization;
  total = smoothstep(-1.0, 1.0, total);

  return total;
}

vec3 GenerateSky() {
  vec3 colour1 = vec3(0.827,0.788,0.95);//bottom
  vec3 colour2 = vec3(0.827,0.788,0.89);//top  //scene background color
  return mix(
      colour1, colour2, smoothstep(0.5, 1.0, vUvs.y)
      );
}

vec3 DrawMountains(

  vec3 background, vec3 mountainColour, vec2 pixelCoords, float depth) {
  float y = fbm(
  vec3(depth + pixelCoords.x / 256.0, 1.432, 3.643), 6, 0.5, 2.0) * 256.0 * 4.0;

  vec3 fogColour = vec3(0.8, 0.7, 1.0);
  float fogFactor = smoothstep(0.0, 8000.0, depth) * 0.5;

  float heightFactor = smoothstep(256.0, -512.00, pixelCoords.y);
  heightFactor *= heightFactor;
  fogFactor = mix(heightFactor, fogFactor, fogFactor);

  mountainColour = mix(mountainColour, fogColour, fogFactor);

  float sdfMountain = pixelCoords.y - y;

  float blur = 1.0 + smoothstep(200.0, 6000.0, depth) * 128.0 + smoothstep(200.0, -1400.0, depth) * 128.0;
  vec3 colour = mix(
      mountainColour,
      background,
      smoothstep(0.0, blur, sdfMountain));

  return colour;

}

void main() {
  vec2 pixelCoords = (vUvs - 0.5) * 500.0;
  vec3 colour = GenerateSky();

  vec2 mountainCoords = (pixelCoords - vec2(0.0, 80.0)) * 8.0 ;
  colour = DrawMountains(colour, frontCol_00, mountainCoords, 6000.0);

  mountainCoords = (pixelCoords - vec2(0.0, -75.0)) * 4.0 ;
  colour = DrawMountains(colour, frontCol_01, mountainCoords, 3200.0);

  mountainCoords = (pixelCoords - vec2(0.0, -300.0)) * 2.0;
  colour = DrawMountains(colour, frontCol_02, mountainCoords, 800.0);

  //hide seam
  float distFromEdge = length(abs(vUvs.x  - 0.5) );
  float alpha =   1.0 - (distFromEdge * 1.8 );
  alpha = smoothstep(0.2, 0.5, alpha);

  gl_FragColor = vec4(colour, alpha);
}





