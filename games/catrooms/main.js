const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");

cv.width = 800;
cv.height = 800;

 function computeProximityGrid(grid,threshold,maxVal){
    const h=grid.length,w=h?grid[0].length:0;
    const INF=1e9,dist=Array.from({length:h},()=>Array(w).fill(INF)),q=[];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(grid[y][x]==='a'){dist[y][x]=0;q.push([x,y]);}
    for(let i=0;i<q.length;i++){
      const [cx,cy]=q[i],d=dist[cy][cx]+1;
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
        const nx=cx+dx,ny=cy+dy;
        if(nx>=0&&nx<w&&ny>=0&&ny<h&&dist[ny][nx]>d){dist[ny][nx]=d;q.push([nx,ny]);}
      });
    }
    const prox=Array.from({length:h},()=>Array(w).fill(0));
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const d=dist[y][x];
      prox[y][x]= grid[y][x]==='a'? maxVal : (d<=threshold? maxVal*(1-d/threshold):0);
    }
    return prox;
  }
  
// Simple binary heap
class MinHeap {
    constructor() { this.data = []; }
    push(f, node) {
      this.data.push({ f, node });
      let i = this.data.length - 1;
      while (i > 0) {
        let p = (i - 1) >> 1;
        if (this.data[p].f <= this.data[i].f) break;
        [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
        i = p;
      }
    }
    pop() {
      if (this.data.length === 0) return null;
      const top = this.data[0].node;
      const end = this.data.pop();
      if (this.data.length > 0) {
        this.data[0] = end;
        let i = 0;
        while (true) {
          let l = 2 * i + 1, r = 2 * i + 2, smallest = i;
          if (l < this.data.length && this.data[l].f < this.data[smallest].f) smallest = l;
          if (r < this.data.length && this.data[r].f < this.data[smallest].f) smallest = r;
          if (smallest === i) break;
          [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
          i = smallest;
        }
      }
      return top;
    }
    isEmpty() { return this.data.length === 0; }
  }
  
  // Optimized weighted A* pathfinding
  function findWeightedPath(grid, prox, start, goal, weightFactor, maxVal) {
    const h = grid.length, w = h ? grid[0].length : 0;
    if (!h || !w) return null;
  
    function inBounds(x, y) { return x >= 0 && x < w && y >= 0 && y < h; }
    function isPassable(x, y) { return grid[y][x] !== 'a'; }
    function heuristic(ax, ay, bx, by) { return Math.hypot(bx - ax, by - ay); }
  
    if (!inBounds(start.x, start.y) || !inBounds(goal.x, goal.y)) return null;
    if (!isPassable(start.x, start.y) || !isPassable(goal.x, goal.y)) return null;
  
    const cameFrom = Array.from({ length: h }, () => Array(w).fill(null));
    const gScore = Array.from({ length: h }, () => Array(w).fill(Infinity));
    gScore[start.y][start.x] = 0;
  
    const openHeap = new MinHeap();
    openHeap.push(heuristic(start.x, start.y, goal.x, goal.y), start);
  
    const neighbors = [
      { dx: 1, dy: 0, cost: 1 }, { dx: -1, dy: 0, cost: 1 },
      { dx: 0, dy: 1, cost: 1 }, { dx: 0, dy: -1, cost: 1 },
      { dx: 1, dy: 1, cost: Math.SQRT2 }, { dx: 1, dy: -1, cost: Math.SQRT2 },
      { dx: -1, dy: 1, cost: Math.SQRT2 }, { dx: -1, dy: -1, cost: Math.SQRT2 }
    ];
  
    while (!openHeap.isEmpty()) {
      const current = openHeap.pop();
      if (current.x === goal.x && current.y === goal.y) {
        const path = [];
        let c = current;
        while (c) {
          path.push({ x: c.x, y: c.y });
          c = cameFrom[c.y][c.x];
        }
        return path.reverse();
      }
  
      for (const n of neighbors) {
        const nx = current.x + n.dx;
        const ny = current.y + n.dy;
        if (!inBounds(nx, ny) || !isPassable(nx, ny)) continue;
  
        const proxValue = prox[ny][nx] || 0;
        const moveCost = n.cost * (1 + (proxValue / maxVal) * weightFactor);
        const tentativeG = gScore[current.y][current.x] + moveCost;
  
        if (tentativeG < gScore[ny][nx]) {
          gScore[ny][nx] = tentativeG;
          cameFrom[ny][nx] = current;
          const f = tentativeG + heuristic(nx, ny, goal.x, goal.y);
          openHeap.push(f, { x: nx, y: ny });
        }
      }
    }
  
    return null; // no path
  }

let rotate=(v,a)=>{let c=Math.cos(a),s=Math.sin(a);return vec(v.x*c-v.y*s,v.x*s+v.y*c)}
let spaceToCanvas=(p,cam)=>rotate(p.sub(cam.pos),-cam.rot).mul(cam.zoom).add(vec(cv.width/2,cv.height/2))
let canvasToSpace=(p,cam)=>rotate(p.sub(vec(cv.width/2,cv.height/2)).mul(1/cam.zoom),cam.rot).add(cam.pos)
let lerpDtCoef = (dt, p, t)=>1-Math.pow(1-p, dt/t)
let lerpDt = (a, b, dt, p, t)=>a.add(b.sub(a).mul(lerpDtCoef(dt, p, t)))
let arVec = (a, r) => vec(Math.cos(a), Math.sin(a)).mul(r)

function resolveCollisions(pos, radius, grid){
    let col = false;
    let gx = Math.floor(pos.x / blockSize),
        gy = Math.floor(pos.y / blockSize);

    for(let y = gy - 1; y <= gy + 1; y++){
        for(let x = gx - 1; x <= gx + 1; x++){
            if (
                y >= 0 && y < grid.length &&
                x >= 0 && x < grid[y].length &&
                grid[y][x] !== ' '
            ){
                let minX = x * blockSize,
                    maxX = (x + 1) * blockSize,
                    minY = y * blockSize,
                    maxY = (y + 1) * blockSize;
                let nearest = vec(
                    Math.max(minX, Math.min(pos.x, maxX)),
                    Math.max(minY, Math.min(pos.y, maxY))
                );

                let delta = pos.sub(nearest);
                let dist2 = delta.dot(delta);

                if(dist2 < radius * radius){
                    let dist = Math.sqrt(dist2) || 0.0001;
                    let push = delta.mul((radius - dist) / dist);
                    pos = pos.add(push);
                    col = true;
                }
            }
        }
    }
    return [col, pos];
}

function continuousCollisions(a, b, radius, grid){
    let t;
    let d = b.sub(a);
    let it = Math.floor(d.length()/radius)+1;
    for(let i = 1; i <= it; i++){
        p = a.add(d.mul(i/it));
        t = resolveCollisions(p, radius, grid);
        if(t[0]) break;
    }
    return t[1];
}

const keyList = [];
window.addEventListener('keydown',function(event){
    keyList[event.code] = true;
    if(["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
});
window.addEventListener('keyup',function(event){
    keyList[event.code] = false;
});

function Mouse(world, pos){
    this.world = world;
    this.pos = pos;
    this.vel = vec();
    this.rot = 0;
    this.rotVel = 0;
    this.radius = 0.25;

    this.hit = 0;
    this.life = 1;
}

Mouse.prototype.update = function(dt){
    let aliv = this.life > -.5;
    let velTarget = aliv ? (arVec(this.rot, (keyList["ArrowUp"]?15:0)-(keyList["ArrowDown"]?5:0))) : vec();
    let rotVelTarget = aliv ? ((keyList["ArrowRight"]?1:0)-(keyList["ArrowLeft"]?1:0))*.06 : 0;
    this.rotVel += (rotVelTarget-this.rotVel)*lerpDtCoef(dt, .9, .2)
    this.rot += this.rotVel;
    this.vel = lerpDt(this.vel, velTarget, dt, .9, .2);
    let lastPos = this.pos.copy();
    for(let paw of this.world.cat.paws){
        let d = this.pos.sub(paw);
        let dd = this.radius+this.world.cat.pawR;
        if(aliv && d.length() < dd && this.hit < 0){
            this.pos = paw.add(d.normalize().mul(dd+this.radius*.2));
            //this.vel = this.vel.add(d.normalize().mul(10));
            this.hit = .2;
            this.life -= .2;
            console.log(this.life);
        }
    }

    for(let i = this.world.cheese.length-1; i >= 0; i--){
        if(this.world.cheese[i].sub(this.pos).length() < this.radius+this.world.cheeseR){
            this.world.cheese.splice(i,1);
        }
    }
    let pos2 = this.pos.add(this.vel.mul(dt));
    this.pos = continuousCollisions(lastPos, pos2, this.radius, this.world.grid);
    this.vel = this.pos.sub(lastPos).mul(1/dt);

    this.hit-=dt;
    if(aliv) this.life = Math.min(this.life+dt*.05,1);
    //console.log(this.life);
}

Mouse.prototype.draw = function(cam){
    ctx.globalAlpha = this.life > .2?this.life:0.2*(this.life+.5)/.7;
    //console.log(ctx.globalAlpha);
    ctx.fillStyle = this.hit > 0 ? "white" : "rgb(185, 185, 185)";
    ctx.beginPath();
    let cvPos = spaceToCanvas(this.pos, cam);
    ctx.arc(cvPos.x, cvPos.y, this.radius*cam.zoom, this.rot-cam.rot+Math.PI/2, this.rot-cam.rot+3*Math.PI/2);
    let r = this.radius*1.2;
    let noseP = spaceToCanvas(this.pos.add(arVec(this.rot, r)), cam);
    ctx.lineTo(noseP.x, noseP.y);
    ctx.closePath();
    ctx.fill();
}

function Cat(world, pos){
    this.world = world;
    this.pos = pos;
    this.vel = vec(0);
    let dy = 5;
    let dx = 2;
    this.head = this.pos;
    this.pawsOffset = [vec(1, -dx),vec(dy, -dx),vec(dy,dx),vec(1,dx)];
    this.paws = [];
    this.pawsTargets = [];
    for(let i = 0; i < 4; i++){
        this.paws[i] = this.pos.add(this.pawsOffset[i]);
        this.pawsTargets[i] = this.paws[i];
    }
    this.headR = 1;
    this.pawR = 0.6;
    this.bodyR = 1.3;
    this.legL = 5;
    this.dead = false;
    this.path = null;
    this.pathTimer = 0;
}

Cat.prototype.update = function(dt){
    let h = this.world.hole;
    if(this.world.cheese.length == 0 && this.pos.sub(h).length() < this.bodyR) this.dead = true;
    if(this.dead){
        this.head = lerpDt(this.head, h, dt, .9, .4);
        this.pos = lerpDt(this.pos, h, dt, .9, .4);
        for(let i = 0; i < 4; i++) this.paws[i] = lerpDt(this.paws[i], h, dt, .9, .4);
        return
    }
    this.pathTimer -= dt;
    if(this.path == null || this.pathTimer < 0){
        let start = vec(Math.floor(this.pos.x/blockSize), Math.floor(this.pos.y/blockSize))
        let end = {x:Math.floor(this.world.mouse.pos.x/blockSize), y:Math.floor(this.world.mouse.pos.y/blockSize)}
        this.path = findWeightedPath(this.world.grid, this.world.weightedGrid, start, end, 10, 10);
        this.pathTimer = Math.min(this.path.length/5, 3);
        //console.log(this.pathTimer)
        //console.log(this.path)
        //console.log("new path!")
    }
    let d = this.world.mouse.pos.sub(this.pos);
    let moveDir = d
    if(this.path.length > 2){
        let d0 = vec(this.path[0].x,this.path[0].y).mul(blockSize).sub(this.pos);
        if(d0.length() < this.bodyR+blockSize){
            this.path.splice(0, 1);
        }
        moveDir = d0;
        //console.log(this.path.length)
    }
    // if(this.path.length >= 3){
    //     moveDir = vec(this.path[2].x,this.path[2].y).mul(blockSize).sub(this.pos);
    // }
    let velTarget = moveDir.normalize().mul(12);
    this.vel = lerpDt(this.vel, velTarget, dt, .9, .5)
    this.pos = continuousCollisions(this.pos, this.pos.add(this.vel.mul(dt)), this.bodyR, this.world.grid);

    let headTarget = this.pos.add(this.vel.normalize().mul(6))
    //this.head = lerpDt(this.head, headTarget, dt, .8, .5);
    this.head = continuousCollisions(this.head,lerpDt(this.head, headTarget, dt, .8, .5), this.headR, this.world.grid)
    if(this.head.sub(headTarget).length() > 2*this.legL) this.head = headTarget;

    for(let i = 0; i < 4; i++){
        let target = this.pos.add(rotate(this.pawsOffset[i], Math.atan2(this.vel.y, this.vel.x)));
        if(this.paws[i].sub(target).length() > this.legL){
            this.pawsTargets[i] = ((i == 1 || i == 2) && d.length() < this.legL*1.5) ? this.world.mouse.pos : target;
        }
        this.paws[i] = continuousCollisions(this.paws[i], lerpDt(this.paws[i], this.pawsTargets[i], dt, .8, .1), this.pawR, this.world.grid);
        if(this.paws[i].sub(this.pawsTargets[i]).length() > 2*this.legL) this.paws[i] = this.pawsTargets[i];
        //this.paws[i] = lerpDt(this.paws[i], this.pawsTargets[i], dt, .8, .1), this.pawR, this.world.grid;
    }
}

Cat.prototype.draw = function(cam, shadow){
    if(shadow){
        ctx.globalAlpha /= 2;
        cam.pos.x += shadow;
    }
    ctx.fillStyle = "black";
    ctx.beginPath();
    let headP = spaceToCanvas(this.head, cam);
    ctx.arc(headP.x, headP.y, this.headR*cam.zoom, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    let bodyP = spaceToCanvas(this.pos, cam);
    ctx.arc(bodyP.x, bodyP.y, this.bodyR*cam.zoom, 0, Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(headP.x, headP.y);
    ctx.lineTo(bodyP.x, bodyP.y);
    ctx.stroke();

    let n = this.vel.normalize();
    let o = vec(-n.y, n.x);
    ctx.lineWidth = 0.6*cam.zoom;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(bodyP.x, bodyP.y);
    for(let i = 0; i < 10; i++){
        let p = spaceToCanvas(this.pos.sub(n.mul(this.bodyR+i*.25)).add(o.mul(0.1*i*Math.sin(i*.5+this.world.time*2))), cam);
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    if(shadow) cam.pos.x -= shadow;
    for(let pa of this.paws){
        ctx.beginPath();
        let p = spaceToCanvas(pa, cam);
        ctx.arc(p.x, p.y, this.pawR*cam.zoom, 0, Math.PI*2);
        ctx.fill();
        ctx.lineWidth = cam.zoom*.6;
        ctx.beginPath();
        ctx.moveTo(bodyP.x, bodyP.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    }
    if(shadow){
        ctx.globalAlpha *= 2;
    }
}
const parseGrid = (str) => str.trim().split("\n").map(row => [...row]);

function World(){
    this.time = 0;
    this.cam = {pos: vec(), rot: 0, zoom: 20};
    this.cheese = [];
    this.grid = parseGrid(mapstr);
    let cp;
    let mp;
    for(let i = 0; i < this.grid.length; i++){
        for(let j = 0; j < this.grid[i].length; j++){
            let c = this.grid[i][j]
            let center = vec(j+.5, i+.5).mul(blockSize);
            if(c == 'c'){
                this.cheese.push(center)
                this.grid[i][j] = ' '
            }
            if(c == 'h'){
                this.hole = center
                this.grid[i][j] = ' '
            }
            if(c == 'b'){
                cp = center
                this.grid[i][j] = ' '
            }
            if(c == 'm'){
                mp = center
                this.grid[i][j] = ' '
            }
        }
    }
    this.weightedGrid = computeProximityGrid(this.grid, 5, 10);
    console.log(this.weightedGrid);
    this.mouse = new Mouse(this, mp);
    this.cat = new Cat(this, cp);
    this.objects = [this.mouse, this.cat];
    this.cheeseR = 0.6;
    this.holeR = 2;
}

World.prototype.update = function(dt){
    this.cam.rot += ((this.mouse.rot+Math.PI/2)-this.cam.rot)*lerpDtCoef(dt, .95, .8)
    this.cam.pos = lerpDt(this.cam.pos, this.mouse.pos.add(arVec(this.mouse.rot, 1)), dt, 1, .5)
    for(object of this.objects){
        if(object.update !== undefined){
            object.update(dt);
        }
    }
    this.time += dt;
}

World.prototype.draw = function(){
    ctx.fillStyle = "rgb(62, 52, 40)";
    ctx.fillRect(0, 0, cv.width, cv.height);
    this.drawGrid(true);
    ctx.fillStyle = this.cheese.length > 0?"rgb(85, 85, 85)":"black"
    ctx.beginPath();
    let p = spaceToCanvas(this.hole, this.cam);
    ctx.arc(p.x, p.y, this.cam.zoom*this.holeR, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "rgb(245, 233, 104)"
    for(let c of this.cheese){
        ctx.beginPath();
        p = spaceToCanvas(c, this.cam);
        ctx.arc(p.x, p.y, this.cam.zoom*this.cheeseR, 0, Math.PI*2);
        ctx.fill();
    }

    this.cat.draw(this.cam, .6);
    for(object of this.objects){
        if(object.draw !== undefined){
            object.draw(this.cam);
        }
    }
    let z = this.cam.zoom;
    for(let d = 1; d < 30; d++){
        this.cam.zoom = z*(1+d*.03);
        this.drawGrid(false);
    }
    this.cam.zoom = z;
}

World.prototype.drawGrid = function(drawFloor){
    for(let i = 0; i < this.grid.length; i++){
        for(let j = 0; j < this.grid[i].length; j++){
            let c = this.grid[i][j];
            if(c != ' ' || drawFloor){
                ctx.fillStyle = c != ' ' ? "rgb(62, 52, 40)" : ((i+j)%2==0?"rgb(125, 118, 100)":"rgb(145, 137, 116)");
                ctx.beginPath();
                let corners = [[0,0], [0,1], [1,1], [1,0]];
                for(let ind = 0; ind < corners.length; ind++){
                    let cornerPos = vec(j, i).add(vec(corners[ind][0], corners[ind][1]))
                    let cvc = spaceToCanvas(cornerPos.mul(blockSize), this.cam);
                    if(ind == 0){
                        ctx.moveTo(cvc.x, cvc.y);
                    } else {
                        ctx.lineTo(cvc.x, cvc.y);
                    }
                }
                ctx.fill();
            }
        }
    }
}

function Game(){
    this.world = new World();
    this.lastUpdateTime = null;
}

Game.prototype.loop = function(){
    const now = Date.now();
    const dtInMilliseconds = this.lastUpdateTime == null ? 1000/60 : now-this.lastUpdateTime;
    this.lastUpdateTime = now;
    const dtInSeconds = Math.min(0.1, dtInMilliseconds/1000);
    this.world.update(dtInSeconds);
    this.world.draw();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"
    ctx.font = "30px Verdana";
    let l = this.world.cheese.length;
    if(!this.world.cat.dead) ctx.fillText(l > 0?l+" cheese left":"Guide Cat into hole", cv.width/2, 100);
    if(this.world.time < 3) ctx.fillText("Use Arrow Keys", cv.width/2, 300);
    if(this.world.mouse.life < -.5){
        ctx.fillText("R to restart", cv.width/2, cv.height/2+30);
        ctx.font = "60px Verdana";
        ctx.fillText("Game Over", cv.width/2, cv.height/2-40);
        if(keyList["KeyR"]){
            this.world = new World();
        }

    } else if(this.world.cat.dead){
        ctx.font = "60px Verdana";
        ctx.fillText("You Win!!!", cv.width/2, cv.height/2-40);
    }
    requestAnimationFrame(this.loop.bind(this))
}

let game = new Game();
requestAnimationFrame(game.loop.bind(game))
