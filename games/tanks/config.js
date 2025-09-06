var config=function(){function t(t,e){u[t]||(u[t]=new n(e))}function n(t){for(var n=f.indexOf(t),e=0;e<o.length;e++)this[o[e]]=c[e][n]
return this}function e(n,e,r,i){t(i,n),u[i][e]=r}function r(n,e,r){return t(n,f[2]),u[n][r]}function i(n,e){t(n,f[2])
for(var r in u[n])if(u[n][r]===e)return r
return!1}var u={},f=["mouse","keyboard","gamepad"],o=["shoot","left","right","accel","decel","turretLeft","turretRight","spawn"],c=[[1,38,5],[-1,65,-1],[-1,68,-1],[-1,87,-1],[-1,83,-1],[0,37,-1],[2,39,-1],[-1,13,0]]
return{init:t,setKey:e,getKey:r,matchKey:i}}()
