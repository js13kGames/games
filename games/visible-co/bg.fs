precision mediump float;

uniform vec2 resolution;
uniform vec2 aspect;
uniform float time;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = ( gl_FragCoord.xy / resolution );
    float maxDist = 0.0;
    int seed = int( floor( time ) );
    float initSeed = float( seed );

    for ( int j = 0; j < 4; j += 2 ) {
        for ( int i = 0; i < 10; i += 1 ) {
            vec2 point = vec2( rand( vec2( seed, j ) ), rand( vec2( seed, 1 + j ) ) );
            float lineDist = time + float(i) - initSeed;

            float dist = clamp( -abs( length( point - uv ) - ( lineDist * 0.2 ) ) + 0.005, 0.0, 1.0 ) * 100.0 * clamp( ( 4.0 - lineDist ) / 3.0, 0.0, 1.0 );
            maxDist = max( dist, maxDist );

            seed -= 1;
        }
    }

    maxDist = maxDist * maxDist;
    gl_FragColor = vec4( maxDist * vec3( 0, sin( time * 0.0001 + uv.x ) * 0.1 + 0.7, sin( time * 0.0002 + uv.y ) * 0.1 + 0.6 ), 1.0 );
}
