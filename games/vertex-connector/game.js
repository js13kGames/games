/*jslint plusplus: true, eqeq: true, es5: true, regexp: true, bitwise: true  */
/*globals Game, console */

(function(window){
    
'use strict';

var Game = null, 
    LOG = false;
  
function log() {
    if (LOG) {      
        console.log(arguments.length < 2 ? arguments[0] : arguments);
    }
} 

/**
 * Vertex Connector 
 * 
 * A mini JS 3D Game written for the js13kGames competition 2015 (condition: zipped size &lt; 13 kb).
 * Connect the vertices of the solid! Connect polygons to win extra points. Avoid your vertices becoming isolated.
 * 
 * My special thanks goes to Viktor Kovacs http://kovacsv.hu 
 * for platonic/archimedean solid generation and projection code!
 * 
 * @author Oliver Güther
 * @version 1.1
 * 
 */    
Game = function(canvas, menu) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.font = "30px arial";
    this.menu = menu;
    this.player = 1;    
    this.alpha = 0;
    this.beta = 0;
    this.alphaSpeed = 0.005; 
    this.betaSpeed = 0.0;
    this.solidType = 0; 
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0; 
    this.aiDepth = 3;
    this.level = 1;
    this.frameCnt = 0;
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
        
        vertices = {}, // use as hashmap
        polygons = [],
        polygonVertexCnt,
        i, j, vertexId, tmpPolygon, nId, solidObj, item;  
     
     // clear timeouts if running
     if (this.cmdQueueTimer) {
         window.clearTimeout(this.cmdQueueTimer);
     }  
     if (self.aiMoveTimer) {
        window.clearTimeout(this.aiMoveTimer);    
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
    
    
    canvas.onmousemove = function (event) {
        var rect = self.canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            vertices = self.vertices, 
            v, vKey;
        
        for (vKey in vertices) {
            v = vertices[vKey];
            if (self.eqTolerance(v.px, x) && self.eqTolerance(v.py, y) && v.active === 0) {
                self.hoveredVertex = v;
                //self.canvas.style.cursor = 'pointer';
                break;    
            } else {
                self.hoveredVertex = null;  
                //self.canvas.style.cursor = 'default'; 
            }
        }
        
        if (x > 600) {
            self.alphaSpeed = +(x-600) /6000;    
        } else if (x < 200) {
            self.alphaSpeed = +(x-200) /6000;     
        } else {
            self.alphaSpeed = 0.0005;    
        }
        /*
        if (y > 520) {
            self.betaSpeed = -0.009;    
        } else if (y < 100) {
            self.betaSpeed = +0.009;     
        } else {
            self.betaSpeed = 0.000;    
        }*/
    };
    
    canvas.onmouseup = function(event) {
        var rect = self.canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top,
            vertices = self.vertices, 
            v, vKey;
           
        // after win - click to play next level    
        if (self.winText) {
            self.newGame();
            return;   
        }    
        
        for (vKey in vertices) {
            v = vertices[vKey];
            if (self.eqTolerance(v.px, x) && self.eqTolerance(v.py, y) && v.active === 0) {
                
                self.doMove(self.player, v); 
                self.winCheck();  // (needed if solid vertices count is odd)               
                               
                self.aiMoveTimer = window.setTimeout(function(){

                    self.player *= -1;                                  
                    log(self.aiMove(self.player, self.level-1));
                    self.winCheck(); 
                    self.player *= -1;                                            
                }, 350);                             
                
                //log('HIT ON ', x, y);  
                break; 
            }
         }
    };
      
}; 

Game.prototype.winCheck = function() {
    var self = this, winDiff;
    if (self.movesLeft() === 0) {
        winDiff = self.scorePlayer1 - self.scorePlayer2;
        if (winDiff > 0) {
            self.winText = 'Congratulations! Next level!'; 
            self.level++; 
            if (typeof localStorage !== "undefined") {
                localStorage.setItem("vcLevel", self.level);
            } 
            
        } else if (winDiff < 0) {
            self.winText = 'Computer wins!';   
        } else {
            self.winText = 'Game ends in a draw!';    
        }
        //window.setTimeout(function(){self.showMenu();}, 2000);
    }
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
    window.setTimeout(function() { self.menu.style.opacity = 0.9; }, 100);
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
    
    this.lastMoveMarkRadius = 48;     
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
        alpha = this.alpha,
        beta = this.beta,
        ctx = this.ctx,
        vertices = this.vertices,
        polygons = this.polygons, 
        polygonVertexCnt,
        sinA = Math.sin(alpha),
        cosA = Math.cos(alpha),
        sinB = Math.sin(beta),
        cosB = Math.cos(beta),     
        matrix = this.matrix,
        size = this.size,
        i, j, k, l, m, n, x1, y1, z1, x2, y2, z2, y3, z3, x4, y4, z4,
        vertex, transVertex, projected, projectedCoords,
        vertexKey, hue, transp, w, lastVertex, polygonPlayerCnt;
            
    // clear canvas  
    ctx.clearRect (0, 0, this.w, this.h);
    ctx.lineWidth = 1.0;
    
    // draw score
    ctx.fillStyle = 'hsla(' + this.getPlayerHue(1) + ',99%, 50%, 1.0)';
    ctx.textAlign = "left";
    ctx.fillText(this.scorePlayer1, 30, 50);
    ctx.fillStyle = 'hsla(' + this.getPlayerHue(-1) + ',99%, 50%, 1.0)';
    ctx.textAlign = "right";
    ctx.fillText(this.scorePlayer2, 770, 50);
    
    ctx.fillStyle = '#333';
    ctx.textAlign = "center";
    ctx.fillText('Level ' + this.level, 400, 50);
    
    // draw connection lines
    i = polygons.length;
    while (i--) {             
        polygonVertexCnt = polygons[i].length;        
        j = polygonVertexCnt + 1;
        lastVertex = null;
        polygonPlayerCnt = 0;
        while (j--) {           
            vertexKey = polygons[i][j % polygonVertexCnt];
            vertex = vertices[vertexKey];
            // calculate projected vertex once per frame
            if (vertex.pRdy4Frame != this.frameCnt) {
                x1 = vertex.x; 
                y1 = vertex.y;
                z1 = vertex.z;  
                // rotate z axis 
                x2 = x1 * cosA - y1 * sinA;
                y2 = x1 * sinA + y1 * cosA;
                // rotate x axis
                y3 = y2 * cosB - z1 * sinB;
                z3 = y2 * sinB + z1 * cosB;
                vertex.translated = [x2, y3, z3, 1];
                //x4 = x2 * cosA - z3 * sinA;
                //z4 = x2 * sinA + z3 * cosA;
                //vertex.translated = [x4, y3, z4, 1];                               
                
                // calculate projected coordinate
                projected = [0, 0, 0, 0];
                for (k in matrix) { // matrix has 16 elements
                    projected[~~(k / 4)] += vertex.translated[k % 4] * matrix[~~(k / 4) + k % 4 * 4];
                }
                for (k in size) { // size has 2 elements
                    projected[k] = (projected[k] / projected[3] / 2 + 0.5) * size[k];
                }
                
                vertex.px = projected[0];
                vertex.py =  this.h - projected[1];
                vertex.pRdy4Frame = this.frameCnt;                             
            }
            
            transp = 0.7 + (vertex.translated[0] + vertex.translated[1])/6;    
            ctx.strokeStyle = 'hsla(0, 0%, 30%, ' + transp +')';  
            ctx.beginPath();    
            if (lastVertex) {
                //transp = 0.7 + (vertex.translated[0] + vertex.translated[1] + lastVertex.translated[0] + lastVertex.translated[1])/8;  
                ctx.lineTo(lastVertex.px, lastVertex.py);  
                if (vertex.active != 0 && lastVertex.active === vertex.active) {
                    hue =  this.getPlayerHue(vertex.active);
                    
                    ctx.strokeStyle = 'hsla(' + hue + ',99%, 50%, ' + transp +')';
                } 
                polygonPlayerCnt += vertex.active;
            } 
            

            ctx.lineTo(vertex.px, vertex.py);
            ctx.stroke();
            
            lastVertex = vertex;
        } // ~while (j--) 
        
        // fill polygon, if it was conquered by one player
        if (Math.abs(polygonPlayerCnt) === polygonVertexCnt) {         
            ctx.beginPath();
            j = polygonVertexCnt + 1;
            while (j--) { 
                vertexKey = polygons[i][j % polygonVertexCnt];
                vertex = vertices[vertexKey]; 
                ctx.lineTo(vertex.px, vertex.py); 
            }
            hue = this.getPlayerHue(vertex.active);
            ctx.fillStyle = 'hsla(' + hue + ',99%, 50%, ' + 0.1 +')'; 
            ctx.fill();    
        }      
        
    } // ~while (i--)
    
    // draw vertices
    i = polygons.length;
    while (i--) {
        polygonVertexCnt = polygons[i].length;
        j = polygonVertexCnt + 1;
        while (j--) {
            // calculate rotated vertex
            vertexKey = polygons[i][j % polygonVertexCnt];
            vertex = vertices[vertexKey];
            if (vertex.rendered4Frame != this.frameCnt) {
                hue =  this.getPlayerHue(vertex.active);
                transp = 0.9 + (vertex.translated[0] + vertex.translated[1])/6; 
                ctx.fillStyle = 'hsla(0, 0%, 30%, ' + transp +')';
                if (vertex.active != 0) {
                    ctx.fillStyle = 'hsla(' + hue + ',99%, 50%, ' + transp +')';    
                }
                
                ctx.beginPath();
                ctx.arc(vertex.px, vertex.py, 3, 0, 2 * Math.PI, true);
                ctx.fill();
                
                if (this.lastMoveMarkRadius && this.moveStack.length > 0 && vertex === this.moveStack[this.moveStack.length-1].vertex) {
                    this.lastMoveMarkRadius--;
                    ctx.beginPath();
                    ctx.arc(vertex.px, vertex.py, this.lastMoveMarkRadius/8, 0, 2 * Math.PI, true);
                    ctx.fill();
                }
                
                vertex.rendered4Frame = this.frameCnt;
            }
        }
    }
    
    if (this.winText) {
        ctx.fillStyle = '#333'; 
        ctx.font = "60px arial";
        ctx.fillText(this.winText, 400, 300); 
        ctx.font = "20px arial";
        ctx.fillText('Click to continue...', 400, 350);
        ctx.font = "30px arial";    
    }
    
    if (this.hoveredVertex) {
        hue =  this.getPlayerHue(this.player);
        ctx.fillStyle = 'hsla(' + hue + ',99%, 50%, 1.0)';
        ctx.beginPath();
        ctx.arc(this.hoveredVertex.px, this.hoveredVertex.py, 3, 0, 2 * Math.PI, true);
        ctx.fill();
    }
   
    this.alpha += this.alphaSpeed;
    this.beta += this.betaSpeed;
    
    this.frameCnt++;
    window.requestAnimationFrame(function() { self.render();});   
};    
    

Game.prototype.eqTolerance = function(val1, val2, tolerance) {
    if (tolerance == null) {
        tolerance = 8;    
    }        
    return (Math.abs(val1 - val2) <= tolerance);
};


Game.prototype.getPlayerColor = function(player) {
    return player === 0 ? 'transparent' : player > 0 ? 'red' : 'blue';
};


Game.prototype.getPlayerHue = function(player) {
    return player === 0 ? 100 : player > 0 ? 0 : 200;
};


window.Game = Game;

}(window));

