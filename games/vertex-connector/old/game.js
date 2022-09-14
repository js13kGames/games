/*jslint plusplus: true, eqeq: true, es5: true, regexp: true, bitwise: true  */
/*globals Game, console */
'use strict';

var LOG = true;
  
function log() {
    if (LOG) {      
        console.log(arguments.length < 2 ? arguments[0] : arguments);
    }
} 

/**
 * Vertex Connector 1.0
 * Connect the vertices of the solid. Try to surround the polygons to get extra points. Avoid your vertices becoming isolated.
 * 
 * Thanks to Viktor Kovacs for platonic and archimedean solid generation code!
 * 
 * Code needs a cleanup, but no time left unitl JS13kgames deadline 13:00 ....
 * 
 */    
var Game = function(canvas, menu) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.font = "30px arial";
    this.menu = menu;
    this.wireframe = true;
    this.player = 1;
    this.rSpeed = 0.005;   
    this.r = 0;
    this.solidType = 0; 
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0; 
    this.aiDepth = 3;
    this.level = 1;
};  


Game.FACE_VALUE = 10;
Game.CONN_VALUE = 10;
Game.ISOLATED_VALUE = -1;
Game.DEFAULT_DELAY = 500;


Game.prototype.init = function() {
    
    var self = this,
        canvas = this.canvas,
        w = canvas.width,
        h = canvas.height,
        size = [w, h],
        eyeDistance =  Math.sqrt (27), // eye is [3, 3, 3]
        eyeDirection = 3 / eyeDistance,
        dirWithAspect = eyeDirection * 2 / w * h,
        matrix = [ // projection matrix * model view matrix
            -dirWithAspect, -2 / 3, eyeDirection, -eyeDirection,
            dirWithAspect, -2 / 3, eyeDirection, -eyeDirection,
            0, 4 / 3, eyeDirection, -eyeDirection,
            0, 0, -eyeDistance, eyeDistance
        ],
        val = 0.5 + Math.sqrt (5) / 2,
        vertexTable = [0, 1, -1, val, -val, 1 / val, -1 / val], // vertex coordinate values
        verticesPool = '111221212122300400030040003004013014023024130140230240301302401402112121211222053054063064530540630640305405306406', // indices to vertexTable
        shapes = [ // indices to vertices
            '013021032123', // tetrahedron
            '468479487496569578586597', // octahedron
            ':<B:>@:@D:B>:D<;=E;>C;@>;C=;E@<?B<A?<DA=?A=AE=C?>BC@ED?CBADE', // icosahedron
            '0F2H0G3F0H1GF3I2G1I3H2I1', // hexahedron
            '0JLGR0RTFN0NPHJFK2PNFT3MKGL1QOGO3TRHP2USHS1LJ3OQIM2KMIU1SUIQ' // dodecahedron
        ],
        activeShape = shapes[this.s],
        shape, x, y, z, hash, lastHash, activeShapeIdx, vertexIdx,
        vertices = {}, // use as hashmap
        polygons = [],
        polygonVertexCnt = this.s < 3 ? 3 : this.s + 1,
        i, j, vertexId, tmpPolygon, nId, solidObj, item;  
     
     if (this.cmdQueueTimer) {
         window.clearTimeout(this.cmdQueueTimer);
     }   
    
    // TODO code can be cleanuped, platonic solids no longer needed    
    for (activeShapeIdx in activeShape) {
        vertexIdx = 3*activeShape.charCodeAt (activeShapeIdx) - 144;
        x = vertexTable[verticesPool[vertexIdx]];
        y = vertexTable[verticesPool[vertexIdx+1]];
        z = vertexTable[verticesPool[vertexIdx+2]];
        hash = 1000000*x + 1000*y + z;        
        vertices[hash] = {x: x, y: y, z: z, px: null, py: null, active: 0, neighbours: {}, polygons: []};  
        if (activeShapeIdx % polygonVertexCnt === 0) {
            tmpPolygon = [];
            polygons.push(tmpPolygon);    
        }       
        tmpPolygon.push(hash);
    } 
    
    // build solid object
    if (this.solidType === 0) {
        solidObj = Game.generateTruncatedOctahedron();    
    } else if (this.solidType === 1) {
        solidObj = Game.generateRhombicuboctahedron();    
    } else if (this.solidType === 2) {
        solidObj = Game.generateSnubCube();    
    } else if (this.solidType === 3) {
        solidObj = Game.generateIcosidodecahedron();    
    } else if (this.solidType === 4) {
        solidObj = Game.generateTruncatedIcosahedron();    
    } else if (this.solidType === 5) {
        solidObj = Game.generateTruncatedIcosahedron();    
    } else {
        solidObj = Game.generateTruncatedIcosahedron();     
    }
    
    vertices = solidObj.vertices;
    polygons = solidObj.polygons; 
      
    
    // build neighbour maps and polygon backrefs
    i = polygons.length;
    while (i--) {
        polygonVertexCnt = polygons[i].length;
        j = polygonVertexCnt + 1;
        while (j--) {
            vertexId = polygons[i][j % polygonVertexCnt];
            nId = polygons[i][(j+1) % polygonVertexCnt];
            vertices[vertexId].neighbours[nId] = vertices[nId]; 
            if (j != 0) {
                vertices[vertexId].polygons.push(polygons[i]);   
            }        
        }          
    }
   
    // load saved level
    if(typeof localStorage !== "undefined") {
        item = localStorage.getItem("vcLevel");
        if (item) {
            this.level = +item; // int conv.    
        }
    }
       
    
    this.vertices = vertices; 
    this.polygons = polygons;
    this.matrix = matrix;
    this.size = size;
    this.w = w;
    this.h = h; 
    this.moveStack = [];  
    this.cmdQueue = [];
    this.cmdQueueDelay = Game.DEFAULT_DELAY;
    this.cmdQueueRunning = false;
    this.demoLoop = false;
    this.player = 1;
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0; 
    this.winText = null;  

    canvas.ondblclick = function () {
        self.s = ++self.s % 5;
        self.activeVertex = [];
        self.init();
    };    
    
    canvas.onmousemove = function (event) {
        var rect = self.canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            vertices = self.vertices, 
            v, vIdx;
        
        for (vIdx in vertices) {
            v = vertices[vIdx];
            if (self.eqTolerance(v.px, x) && self.eqTolerance(v.py, y) && v.active === 0) {
                self.hoveredVertex = v;
                break;    
            } else {
                self.hoveredVertex = null;   
            }
        }
        
        if (x > 650) {
            self.rSpeed = 0.009;    
        } else if (x < 150) {
            self.rSpeed = -0.009;     
        } else {
            self.rSpeed = 0.001;    
        }
    };
    
    canvas.onmouseup = function(event) {
        var rect = self.canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            vertices = self.vertices, 
            v, vIdx, winDiff;
        
        for (vIdx in vertices) {
            v = vertices[vIdx];
            if (self.eqTolerance(v.px, x) && self.eqTolerance(v.py, y) && v.active === 0) {
                
                self.doMove(self.player, v);                
                self.player *= -1;
                
                log(self.aiMove(self.player, self.level-1));
                self.player *= -1;
                
                // win check
                if (self.movesLeft() === 0) {
                    winDiff = self.scorePlayer1 - self.scorePlayer2;
                    if (winDiff > 0) {
                        self.winText = 'Congratulations! You reached the next level!'; 
                        self.level++; 
                        if (typeof localStorage !== "undefined") {
                            localStorage.setItem("vcLevel", self.level);
                        } 
                        
                    } else if (winDiff < 0) {
                        self.winText = 'Computer wins!';   
                    } else {
                        self.winText = 'Game ends in a draw!';    
                    }
                }
                
                //log('HIT ON ', x, y);  
                break; 
            }
         }
    };
      
}; 


Game.prototype.newGame = function() {
    this.init();
    this.hideMenu();
};


Game.prototype.hideMenu = function() {
    var self = this;
    this.menu.style.opacity = 0;
    window.setTimeout(function() { self.menu.style.display = 'none'; }, 500);
};


Game.prototype.showMenu = function() {
    var self = this;  
    self.menu.style.display = 'block';
    window.setTimeout(function() { self.menu.style.opacity = 0.8; }, 100);
};


Game.prototype.toggleMenu = function() {
    if (this.menu.style.display === 'none') {
        this.showMenu();
    } else {
        this.hideMenu();   
    }  
};


Game.prototype.changeSolid = function() {
    var self = this;
    this.solidType = ++this.solidType % 5;
    this.init();
    this.demo(0,2);
};


Game.prototype.resetLevel = function() {
    if(typeof localStorage !== "undefined") {
        localStorage.removeItem("vcLevel");
    } 
    
    this.level = 1;   
};


Game.prototype.progressCmdQueue = function(queueIdx, rdyCallback) {
    var self = this, cmd;

    if (!self.cmdQueueRunning) {
        //self.cmdQueue = [];
        return;
    }
    if (self.cmdQueue.length <= queueIdx) {
        self.cmdQueue = [];
        self.cmdQueueRunning = false;
        rdyCallback.call(self);
        return;
    }
    
    cmd = self.cmdQueue[queueIdx];
    this.cmdQueueTimer = window.setTimeout(function() {
        if (self.cmdQueueRunning) {
            cmd.fn.apply(cmd.context, cmd.args);
            self.progressCmdQueue(queueIdx+1, rdyCallback);    
        }        
    }, self.cmdQueueDelay); 
};


Game.prototype.demo = function(depth1, depth2) {
    var self = this, 
        i = Object.keys(this.vertices).length, 
        depth;
        
    self.init();
    self.cmdQueue = [];
    while(i--) {
        depth = self.player > 0 ? depth1 : depth2;
        //self.aiMove(self.player, depth);
        self.cmdQueue.push({context: self, fn: self.aiMove, args: [self.player, depth]});
        self.player *= -1;  
    } 
    
    self.cmdQueueRunning = true; 
    self.progressCmdQueue(0, function(){       
        window.setTimeout(function(){
            if (self.demoLoop) {
                self.demo(depth1, depth2);     
            }               
        }, 3000);                  
    });
};


Game.prototype.aiMove = function(player, depth) {
    var start = new Date().getTime(), val;
    val = this.aiMoveR(player, depth, true); 
    log(new Date().getTime() - start + ' ms');
    return val;   
};


Game.prototype.aiMoveR = function(player, depth, doMove) {
    var vKey, nKey, ignoreVertex, vertex, rating, 
        maxRating = -1e4,
        noValidMoveLeft = true, maxVertex = null, 
        vertices = this.vertices;

    for (vKey in vertices) {
        vertex = vertices[vKey];
        if (vertex.active === 0) {
            noValidMoveLeft = false;
            
            // Perf.-Opt.: ignore solitary vertex           
            if (maxVertex === null) {
                maxVertex = vertex;
            }
            
            ignoreVertex = true;
            for (nKey in vertex.neighbours) {
                if (vertex.neighbours[nKey].active != 0) {
                    ignoreVertex = false;
                    break;
                }
            }
            if (ignoreVertex) {
                continue;
            } 
            // end of Perf.-Opt.
            
            this.doMove(player, vertex);
            rating = player * (this.scorePlayer1 - this.scorePlayer2); 
            if (depth > 0 && this.movesLeft() > 0) {
                rating -= this.aiMoveR(-player, depth-1, false);   
            }     
            if (rating > maxRating) {
                maxRating = rating; 
                maxVertex = vertex;   
            }
            this.undoMove(player);  
        }              
     } 
     
     if (doMove && !noValidMoveLeft) {
        this.doMove(player, maxVertex);   
     }
           
     return noValidMoveLeft ? (player * (this.scorePlayer1 - this.scorePlayer2)) : maxRating;       
};


Game.prototype.doMove = function(player, vertex) {
    var nKey, nVertex, nKey2, nVertex2, isolatedOpp, isolated,
        pKey, vKey, polygon, polygonActive,
        score = player > 0 ? this.scorePlayer1 : this.scorePlayer2, connCnt = 0;
    
    if (vertex.active != 0) {
        return;
    }
    
    this.moveStack.push({
        scorePlayer1: this.scorePlayer1,
        scorePlayer2: this.scorePlayer2,
        vertex: vertex,     
    });
    
    vertex.active = player;
    isolated = true;
    for (nKey in vertex.neighbours) {
        nVertex = vertex.neighbours[nKey];
        if (nVertex.active === player) {
            connCnt++;
             
        }
        if (nVertex.active != -player) {
            isolated = false; 
        }
        // check if opp vertex is isolated
        
        if (nVertex.active === -player) {
            isolatedOpp = true; 
            for (nKey2 in nVertex.neighbours) {
                nVertex2 = nVertex.neighbours[nKey2];
                if (nVertex2.active != player) {
                    isolatedOpp = false; 
                }
            }
            if (isolatedOpp) {
                player > 0 ? this.scorePlayer2+=Game.ISOLATED_VALUE : this.scorePlayer1+=Game.ISOLATED_VALUE; 
            }
        } 
    }
    player > 0 ? this.scorePlayer1+=connCnt*Game.CONN_VALUE  : this.scorePlayer2+=connCnt*Game.CONN_VALUE;  
    
    if (isolated) {
        player > 0 ? this.scorePlayer1+=Game.ISOLATED_VALUE : this.scorePlayer2+=Game.ISOLATED_VALUE; 
    }
    
    // polygon extra bonus
    for (pKey in vertex.polygons) {
        polygon = vertex.polygons[pKey]; 
        polygonActive = true;
        for (vKey in polygon) {
            if (this.vertices[polygon[vKey]].active != player) {
                polygonActive = false;
                break;    
            }  
        }
        if (polygonActive) {
            player > 0 ? this.scorePlayer1+=polygon.length*Game.FACE_VALUE : this.scorePlayer2+=polygon.length*Game.FACE_VALUE;     
        }
    }
            
};


Game.prototype.undoMove = function(player, vertex) {
    var  state;
    state = this.moveStack.pop();
    this.scorePlayer1 = state.scorePlayer1;
    this.scorePlayer2 = state.scorePlayer2;    
    state.vertex.active = 0;            
};


Game.prototype.movesLeft = function() {
    return Object.keys(this.vertices).length - this.moveStack.length;            
};
   
    
Game.prototype.render = function() {
    
    var self = this, 
        r = this.r,
        ctx = this.ctx,
        vertices = this.vertices,
        polygons = this.polygons, 
        polygonVertexCnt,
        si = Math.sin (r),
        co = Math.cos (r),    
        matrix = this.matrix,
        size = this.size,
        i, j, k, l, m, n, 
        vertex, transVertex, projected, projectedCoords,
        vertexId, hue, transp, w;
            
    // draw shape    
    ctx.clearRect (0, 0, this.w, this.h);
    ctx.lineWidth = 0.2;
    // draw score
    ctx.fillStyle = 'hsla(' + this.getPlayerHue(1) + ',99%, 60%, 1.0)';
    ctx.textAlign = "left";
    ctx.fillText(this.scorePlayer1, 30, 50);
    ctx.fillStyle = 'hsla(' + this.getPlayerHue(-1) + ',99%, 60%, 1.0)';
    ctx.textAlign = "right";
    ctx.fillText(this.scorePlayer2, 770, 50);
    
    ctx.fillStyle = '#333';
    ctx.textAlign = "center";
    ctx.fillText('Level ' + this.level, 400, 50);

    i = polygons.length;
    while (i--) {
        // draw polygons
        ctx.beginPath ();
        projectedCoords = [];
        polygonVertexCnt = polygons[i].length;
        j = polygonVertexCnt + 1;

        while (j--) {
            // calculate rotated vertex
            vertexId = polygons[i][j % polygonVertexCnt];
            vertex = vertices[vertexId];
            l = vertex.x; 
            m = vertex.y;
            n = vertex.z;   
            transVertex = [l * co - m * si, l * si + m * co, n, 1];
            // calculate projected coordinate
            projectedCoords[j] = projected = [0, 0, 0, 0];
            for (k in matrix) { // matrix has 16 elements
                projected[~~(k / 4)] += transVertex[k % 4] * matrix[~~(k / 4) + k % 4 * 4];
            }
            for (k in size) { // size has 2 elements
                projected[k] = (projected[k] / projected[3] / 2 + 0.5) * size[k];
            }
            vertex.px = projected[0];
            vertex.py = this.h - projected[1];
            vertex.pHash = 100000 * ~~vertex.px + ~~vertex.py;
            
            ctx.lineTo (vertex.px, vertex.py);
            transp = 0.8 + (transVertex[0] + transVertex[1])/4; 
            ctx.lineWidth = 0.3;
            ctx.strokeStyle = 'hsla(0, 0%, 0%, ' + transp +')'; 
            ctx.stroke();
            
            // TODO gfx drawing needs cleanup (no time left until deadline 13:00 omg), draw vertex once (not for every face again)
            if (vertex.active != 0) { 
                hue =  this.getPlayerHue(vertex.active);
                //transp = 0.6 + (transVertex[0] + transVertex[1])/4;  // 0.55 + vertex.active*Math.sin( new Date()/400)/2; //1.1 + si; //transVertex[0] + 1.2;
                ctx.fillStyle = 'hsla(' + hue + ',99%, 60%, ' + transp +')';
                ctx.fillRect(vertex.px-2, vertex.py-2, 4, 4);
                
                for (n in vertex.neighbours) {
                    w = vertices[n];
                    if (vertex.active != 0 && vertex.active === w.active) {
                        //ctx.save();
                        ctx.strokeStyle = ctx.fillStyle; 
                        ctx.lineWidth = 2.0;
                        ctx.beginPath();
                        ctx.lineTo(w.px, w.py); 
                        ctx.lineTo(vertex.px, vertex.py);                       
                        ctx.stroke();
                        //ctx.restore();
                        //break;       
                    }         
                }  
                
            }

        } // while (j--) 
        
        // show only counter clockwise projected polygons
        k = projectedCoords[1];
        l = projectedCoords[2];
        
        //if (this.wireframe || projectedCoords[0][0] * (k[1] - l[1]) + k[0] * l[1] > projectedCoords[0][1] * (k[0] - l[0]) + k[1] * l[0]) {
  
            //ctx.fill();           
            //ctx.stroke();               
        //}
    }
    
    if (this.winText) {
        ctx.fillStyle = '#333'; 
        ctx.fillText(this.winText, 400, 300);    
    }
    
    if (this.hoveredVertex) {
        hue =  this.getPlayerHue(this.player);
        ctx.fillStyle = 'hsla(' + hue + ',99%, 60%, 1.0)';
        ctx.fillRect(this.hoveredVertex.px-2, this.hoveredVertex.py-2, 4, 4);
    }
    
    this.r -= this.rSpeed;
    window.requestAnimationFrame(function() { self.render();});   
};    
    

Game.prototype.eqTolerance = function(val1, val2, tolerance) {
    if (tolerance == null) {
        tolerance = 6;    
    }        
    return (Math.abs(val1 - val2) <= tolerance);
};


Game.prototype.getPlayerColor = function(player) {
    return player === 0 ? 'transparent' : player > 0 ? 'red' : 'blue';
};


Game.prototype.getPlayerHue = function(player) {
    return player === 0 ? 100 : player > 0 ? 0 : 200;
};




