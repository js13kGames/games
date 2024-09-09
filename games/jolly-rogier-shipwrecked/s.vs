@ vec3 aVN;
@ vec2 aTex;
@ vec3 aV;
@ vec4 aVTn;

€ mat4 uMV;
€ mat4 uP;
€ mat3 uN;
€ mat4 uM;

€ float uT;
€ float uS;
€ vec3 uA;
€ vec3 uL;
€ vec3 uD;
€ vec3 uE;

$ vec2 vT;
$ vec3 vL;
$ vec4 vA;
$ vec4 vD;
$ vec3 vN;
$ vec3 vV;
$ vec3 vG;
$ vec3 vB;
$ float vX;

void main(void){gl_Position=uP*uMV*vec4(aV,1.0);vT=aTex;vN=normalize(uN*aVN);vL=uL;vA=vec4(uA.rgb,1.);vD=vec4(uD.rgb,1.);vG=normalize(uN*aVTn.xyz);vec3 a=cross(aVN,aVTn.xyz)*aVTn.w;vB=normalize(uN*a);vX=uT;vec4 b=uM*vec4(aV,1.0);vV=normalize(vec4(uE,1.0)-b).xyz;}