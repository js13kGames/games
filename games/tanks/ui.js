var ui=function(e,n){function t(e){return n.createElement(e)}function a(e,n,t){if(t)e.setAttribute(n,t)
else for(var a=0;a<n.length;a+=2)e.setAttribute(n[a],n[a+1])}function o(e){return n.getElementById(e)}function r(e){n.addEventListener("DOMContentLoaded",e)}function l(e){return c(e,"localId")}function s(e){return c(e,"remoteId")}function c(e,t){return n.querySelector("li[data-"+t+'="'+e+'"]')}function d(e,n,t,a){p(e,n,t,a,"canon",100,"localPlayers")}function i(e,n){p(-1,-1,e,n,"canon",100,"remotePlayers")}function p(e,n,t,a,r,c,d){var i=!1,p=["remoteId",t,"ping",a,"weapon",r,"health",c]
if(-1===e?i=s(t):(p.push("controllerId",n),i=l(e)),i)m(i,p)
else{var p=f(I,{localId:e,controllerId:n,remoteId:t,weapon:r,health:c,x:0,y:0,ping:a}),u=o(d)
u.innerHTML+=p}}function u(e){null!==e&&e.parentNode.removeChild(e)}function m(e,n,t){function a(n,t){"remoteId"===n&&e.dataset.remoteid!==t&&(e.dataset.remoteid=t)}if(null!==e)if(void 0!==t){a(n,t)
var o=e.querySelector('span[class="'+n+'"]')
o.textContent!==t&&(o.textContent=t)}else for(var r=0;r<n.length;r+=2){a(n[r],n[r+1])
var o=e.querySelector('span[class="'+n[r]+'"]')
o&&o.textContent!==n[r+1]&&(o.textContent=n[r+1])}}function f(e,n){var t=e
for(var a in n)t=t.replace(RegExp("{{"+a+"}}","g"),n[a])
return t}var I='<li data-localId="{{localId}}" data-remoteId="{{remoteId}}">Player ID: <span class="localId">{{localId}}</span> | Controller Id: <span class="controllerId">{{controllerId}}</span> | Remote Id: <span class="remoteId">{{remoteId}}</span> | Ping: <span class="ping">{{ping}}</span> | Name: <span class="name">{{name}}</span> | Weapon: <span class="weapon">{{weapon}}</span> | Health: <span class="health">{{health}}</span> | Points: <span class="points">{{points}}</span></li>'
return{createElement:t,setAttribute:a,getLocalPlayer:l,getRemotePlayer:s,addLocalPlayer:d,addRemotePlayer:i,addPlayer:p,changePlayer:m,remove:u,get:o,ready:r}}(window,document)
