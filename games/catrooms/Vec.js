function Vec(x, y){this.x = x;this.y = y;}
Vec.prototype.copy = function(){
    return new Vec(this.x, this.y);
}
Vec.prototype.equals = function(v){
    return this.x == v.x && this.y == v.y;
}
Vec.prototype.add = function(v){
    return vec(this.x+v.x, this.y+v.y);
}
Vec.prototype.sub = function(v){
    return vec(this.x-v.x, this.y-v.y);
}
Vec.prototype.mul = function(l){
    return new Vec(this.x*l, this.y*l);
}
Vec.prototype.dot = function(v){
    return this.x*v.x+this.y*v.y;
}
Vec.prototype.length = function(){
    if(this.l === undefined) this.l = Math.sqrt(this.x*this.x+this.y*this.y);
    return this.l;
}
Vec.prototype.normalize = function(){
    if(this.n === undefined){
        let l = this.length();
        if(l == 0) return this.copy();
        this.n = this.mul(1/l);
    }
    return this.n;
}
Vec.prototype.reflection = function(n){
    return this.add(n.mult(-2*this.dot(n)));
}
function vec(x, y){
    if(x === undefined) return new Vec(0, 0);
    return new Vec(x, y !== undefined ? y : x);
}