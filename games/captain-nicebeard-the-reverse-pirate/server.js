! function(a) {
  function b(a, b, c) {
    this.x = a, this.y = b, this.z = c
  }

  function c(a) {
    return a * a * a * (a * (6 * a - 15) + 10)
  }

  function d(a, b, c) {
    return (1 - c) * a + c * b
  }
  var module = a.noise = {};
  b.prototype.Xa = function(a, b) {
    return this.x * a + this.y * b
  };
  var e = [new b(1, 1, 0), new b(-1, 1, 0), new b(1, -1, 0), new b(-1, -1, 0), new b(1, 0, 1), new b(-1, 0, 1), new b(1, 0, -1), new b(-1, 0, -1), new b(0, 1, 1), new b(0, -1, 1), new b(0, 1, -1), new b(0, -1, -1)],
    f = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
    g = new Array(512),
    h = new Array(512);
  module.seed = function(a) {
    a > 0 && 1 > a && (a *= 65536), a = Math.floor(a), 256 > a && (a |= a << 8);
    for (var b = 0; 256 > b; b++) {
      var c;
      c = 1 & b ? f[b] ^ 255 & a : f[b] ^ a >> 8 & 255, g[b] = g[b + 256] = c, h[b] = h[b + 256] = e[c % 12]
    }
  }, module.seed(0), module.perlin2 = function(a, b) {
    var e = Math.floor(a),
      f = Math.floor(b);
    a -= e, b -= f, e = 255 & e, f = 255 & f;
    var i = h[e + g[f]].Xa(a, b),
      j = h[e + g[f + 1]].Xa(a, b - 1),
      k = h[e + 1 + g[f]].Xa(a - 1, b),
      l = h[e + 1 + g[f + 1]].Xa(a - 1, b - 1),
      m = c(a);
    return d(d(i, k, m), d(j, l, m), c(b))
  }
}(this), "undefined" != typeof module && (module.exports = this.noise);
function getNewWorld(a){var b=new World(a);return b.Oa(7,15),b}function startServer(){for(var a=0;6>=a;a++)worlds.push(getNewWorld(a));io.on("connection",function(a){var b=new Player;b.Pa(a),a.on("new-game",function(c){b.Pa(a)}),a.on("tank-state",function(a,c){b.Qa(a),c(!0)}),a.on("disconnect",function(){b.da=null,b=null})})}function Player(){this.Ra=nextPlayerId,nextPlayerId++,this.level=0,this.A=[],this.Sa=!0,this.oa=""}function Tank(a,b){this.M=nextTankId,nextTankId++,this.Wa=a,this.A={wa:[],xa:[]}}function Token(a,b){this.O=a,this.R=b,this.id=nextTokenId,nextTokenId++}function World(a){this.G=3e5,this.height=2e3+400*a,this.width=3e3+400*a,this.A=[],this.Ta=[],this.tokens=[],this.I=[],this.p=7*a,this.J=Math.floor(1e4*Math.random()),this.level=a}var worlds=[],nextTankId=1,nextTokenId=1,nextPlayerId=1,players=[],maxPlayersPerLevel=20;Player.prototype.Pa=function(a){var b=worlds[this.level];b.Ta.length>maxPlayersPerLevel&&(b.Ua(),worlds[this.level]=getNewWorld(this.level),b=worlds[this.level],this.Sa=!0),this.da=new Tank(0,this);var c={L:this.da.Ja(),pa:b.Ja(),Sa:this.Sa};a.emit("receive-game",c)},Player.prototype.Qa=function(a){var b=worlds[this.level];b.Va(this.da),b.Oa(3,8),this.Sa=!1,a.Na&&(this.level++,this.Sa=!0),this.level>6&&(this.level=0,this.Sa=!0),a.L.oa&&(this.oa=a.L.oa,this.da.oa=a.L.oa),this.da.B(a.Ma.L)},Tank.prototype.Ja=function(){return{M:this.M,A:this.A,oa:this.oa}},Tank.prototype.B=function(a){this.A.wa.push.apply(this.A.wa,a.wa),this.A.xa.push.apply(this.A.xa,a.xa)},Token.prototype.Ja=function(){return{O:this.O,R:this.R,id:this.id}},World.prototype.Oa=function(a,b){noise.seed(this.J);for(var c=0,d=0;a>c||b>d;){var e=Math.floor(Math.random()*this.width),f=Math.floor(Math.random()*this.height),g=Math.abs(noise.perlin2(e/600,f/600));g*=256,g=Math.min(256,g+this.p),g>68&&79>g&&a>c&&(this.tokens.push(new Token(e,f)),c++),g<40+this.p&&b>d&&(this.I.push(new Token(e,f)),d++)}},World.prototype.Ua=function(){this.Ta=[],this.tokens=[],this.I=[]},World.prototype.Va=function(a){this.Ta.push(a)},World.prototype.B=function(a){this.A.push.apply(this.A,a.L)},World.prototype.Ja=function(){var a={p:this.p,level:this.level,G:this.G,height:this.height,width:this.width,J:this.J,players:this.Ta.map(function(a){return a.Ja()}),tokens:this.tokens.map(function(a){return a.Ja()}),I:this.I.map(function(a){return a.Ja()})};return a},startServer();