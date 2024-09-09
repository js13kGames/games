window.onload = function() {
    init();
}

var canvas;
var context;
var testImage;
var spriteSheet;
var playerSprite;
var treeGenerator;
var chunkMap;
var objects;
var inputHandler;
var colisionResolver;
var stepCount;
var goalReached;
var signPostSpawnChance;
const SPRITESHEET_DIMENSIONS = { width: 128, height: 128 };
const SPRITESHEET_FRAME_DIMENSIONS = { width: 16, height: 16 };
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const GOAL_DIST_WIDTH_RANGE = { max: 3, min: 2 }
const GOAL_DIST_HEIGHT_RANGE = { max: 3, min: 2 }
const STEP_COUNT_FACTOR = .1;
const SIGNPOST_RATE = .4;

var init = function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;

    stepCount = 0;
    goalReached = false;
    signPostSpawnChance = 0;

    testImage = new Image();
    testImage.src = 'testasset.png';
    spriteSheet = new SpriteSheet(testImage, SPRITESHEET_DIMENSIONS, SPRITESHEET_FRAME_DIMENSIONS);
    playerSprite = new Sprite(spriteSheet, 2, true);

    inputHandler = new InputHandler()
    collisionResolver = new CollisionResolver();

    treeGenerator = new TreeGenerator(new Sprite(spriteSheet, 1));    
    chunkMap = new ChunkMap();
}

var update = function(delta, objects) {
    var seconds = delta / 1000;

    // handle user inputs
    // process velocity & game logic changes on objects
    chunkMap.update(seconds);
    playerSprite.update(seconds);

    chunkMap.updateChunks(playerSprite.position);
}

var render = function (objects) {
    context.fillStyle = '#83c168';
    context.fillRect(0, 0, 500, 500);

    chunkMap.render(context);

    if (goalReached) {
        context.fillStyle = 'white';
        context.font = "22px Arial";
        context.fillText("It took you " + Math.floor(stepCount) + " steps to find your tent.", 20, 50);
    }
}

var now = Date.now();

var tick = function() {
    var delta = Date.now() - now;

    update(delta, objects);
    
    render(objects);

    now = Date.now();
}

var interval = 1000 / 60;

setInterval(tick, interval);

var Sprite = function(spriteSheet, frame, movable) {
    this.spriteSheet = spriteSheet;
    this.frame = frame;
    this.position = {
        x: 0,
        y: 0
    }
    this.velocity = {
        x: 0,
        y: 0
    };
    this.speed = 150;
    this.body = new Body(this.position, SPRITESHEET_FRAME_DIMENSIONS, movable);  
    this.id = GetGUID();      

    this.update = function(delta) {
        if (this.body.movable) {
            handleInputs(inputHandler.keys, this.velocity, this.speed);
            
            this.position.x += this.velocity.x * delta;
            this.position.y += this.velocity.y * delta;
            if (!goalReached) {
                stepCount += STEP_COUNT_FACTOR;
            }
        }
    }

    this.render = function(context) {
        // this needs to take the true position of the sprite in the game world and
        // render it relative to the current chunk instead
        // render everything relative to player?
        if (this.id === playerSprite.id) {
            this.spriteSheet.drawFrame(context, this.frame, Math.floor(CANVAS_WIDTH / 2), Math.floor(CANVAS_HEIGHT/ 2));            
        } else {
            this.spriteSheet.drawFrame(
                context, 
                this.frame, 
                this.position.x - playerSprite.position.x + Math.floor(CANVAS_WIDTH / 2), 
                this.position.y - playerSprite.position.y + Math.floor(CANVAS_HEIGHT / 2)
            );            
        }
    }

    var handleInputs = function(keys, velocity, speed) {
        // handle the 4 diagonals differently, they're faster now
        // if both left & right or up & down, character should stop moving?
        if (keys.left.isDown) {
            velocity.x = -speed;
        } else if (keys.right.isDown) {
            velocity.x = speed;
        } else {
            velocity.x = 0;            
        }

        if (keys.up.isDown) {
            velocity.y = -speed;
        } else if (keys.down.isDown) {
            velocity.y = speed;
        } else {
            velocity.y = 0;            
        }
    }
}

/**
 * 
 * @param {Object} image - image to be used as a spritesheet
 * @param {Object} imageSize - width and height of image
 * @param {number} imageSize.width - width in pixels
 * @param {number} imageSize.height - height in pixels
 * @param {Object} frameSize - width and height of each frame in the sprite sheet
 * @param {number} frameSize.width - width in pixels
 * @param {number} frameSize.height - height in pixels
 */
var SpriteSheet = function(image, imageSize, frameSize) {
    this.image = image;
    this.imageSize = imageSize;
    this.frameSize = frameSize;
    var framesInRow = this.imageSize.width / this.frameSize.width;
    var framesInCol = this.imageSize.height / this.frameSize.height;
    const PADDING = 1;

    this.drawFrame = function(context, frameIndex, x, y) {
        var col = frameIndex % framesInRow;
        var row = Math.floor(frameIndex / framesInCol);
        context.drawImage(
            this.image, 
            col * (this.frameSize.width + PADDING), 
            row * (this.frameSize.height + PADDING),
            this.frameSize.width,
            this.frameSize.height,
            x,
            y,
            this.frameSize.width * 2,
            this.frameSize.height * 2
        )
    }
}

var ChunkMap = function() {
    var currentChunks = {};
    var chunkSize = {height: CANVAS_HEIGHT, width: CANVAS_WIDTH}
    var currentChunkPosition = {x: 0, y: 0};
    var seed = {}; //don't want to use space to implement seeded rng, so passing info through seed instead
    seed.goalChunkPosition = {
        x: Math.floor(Math.random() * (GOAL_DIST_WIDTH_RANGE.max - GOAL_DIST_WIDTH_RANGE.min) + GOAL_DIST_WIDTH_RANGE.min), 
        y: Math.floor(Math.random() * (GOAL_DIST_HEIGHT_RANGE.max - GOAL_DIST_HEIGHT_RANGE.min) + GOAL_DIST_HEIGHT_RANGE.min)
    }

    addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y - 1});
    addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y - 1});
    addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y - 1});
    addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y});
    addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y + 1});
    addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y + 1});
    addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y + 1});
    addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y});
    addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y});
    addObjectToChunk(currentChunkPosition, playerSprite);

    this.updateChunks = function(playerPosition) {
        // find which chunk the player has moved into
        var newChunkPosition = {
            x: Math.floor(playerPosition.x / chunkSize.width),
            y: Math.floor(playerPosition.y / chunkSize.height)
        }
        const DISPLACEMENT = {
            x: newChunkPosition.x - currentChunkPosition.x,
            y: newChunkPosition.y - currentChunkPosition.y
        }

        if (newChunkPosition.x !== currentChunkPosition.x || newChunkPosition.y !== currentChunkPosition.y) {
            // remove player from chunk (0,0)
            var player = removeObjectFromChunk(currentChunkPosition, playerSprite.id);
        
            loadChunks(DISPLACEMENT, newChunkPosition);

            // out of time to fix! :-(
            // if (player !== null && Math.random() < signPostSpawnChance) {
            //     var signPost;
            //     // spawn sign post
            //     if (seed.goalChunkPosition.y > newChunkPosition.y) {
            //         // down
            //         signPost = new Sprite(spriteSheet, 7, false);
            //     } else if (seed.goalChunkPosition.y < newChunkPosition.y) {
            //         // up
            //         signPost = new Sprite(spriteSheet, 6, false);
            //     } else {
            //         // lateral
            //         signPost = new Sprite(spriteSheet, 5, false);
            //     }
            //     if (seed.goalChunkPosition.x > newChunkPosition.x) {
            //         // flip sprite direction, goal is to the left
            //     }
            //     signPost.position.x = player.position.x + 25;
            //     signPost.position.y = player.position.y + 25;
            //     addObjectToChunk(newChunkPosition, signPost);
            //     // reset chance to zero
            //     signPostSpawnChance = 0;
            //     console.log('spawned a post');
            // } else {
            //     //increase spawn chance
            //     signPostSpawnChance += SIGNPOST_RATE;
            // }

            if (player !== null) {
                // add player to new chunk
                addObjectToChunk(newChunkPosition, player);
            }
        }
    }

    function removeObjectFromChunk(chunkPosition, id) {
        var removedObject = currentChunks[[chunkPosition.x, chunkPosition.y]].removeObject(id);
        return removedObject;
    }

    function addObjectToChunk(chunkPosition, object) {
        currentChunks[[chunkPosition.x, chunkPosition.y]].addObject(object);
    }

    function loadChunks(DISPLACEMENT, newChunkPosition) {
        // load new chunks based on new chunk player moved into
        if (DISPLACEMENT.x == -1 && DISPLACEMENT.y == -1) {
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y + 1]]; 
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y - 1});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y - 2});
        } else if (DISPLACEMENT.x == 0 && DISPLACEMENT.y == -1) {
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y + 1]];
            addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y - 2});
        } else if (DISPLACEMENT.x == 1 && DISPLACEMENT.y == -1) {
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y + 1]]; 
            addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y - 2});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y - 1});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y});
        } else if (DISPLACEMENT.x == 1 && DISPLACEMENT.y == 0) {
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y + 1]];
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y - 1});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y + 1});
        } else if (DISPLACEMENT.x == 1 && DISPLACEMENT.y == 1) {
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y + 1]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]]; 
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y + 1});
            addChunk(seed, {x: currentChunkPosition.x + 2, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y + 2});
        } else if (DISPLACEMENT.x == 0 && DISPLACEMENT.y == 1) {
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y - 1]];
            addChunk(seed, {x: currentChunkPosition.x + 1, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y + 2});
        } else if (DISPLACEMENT.x == -1 && DISPLACEMENT.y == 1) {
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x - 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y + 1]]; 
            addChunk(seed, {x: currentChunkPosition.x, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x - 1, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y + 2});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y + 1});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y});
        } else if (DISPLACEMENT.x == -1 && DISPLACEMENT.y == 0) {
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y - 1]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y]];
            delete currentChunks[[currentChunkPosition.x + 1, currentChunkPosition.y + 1]];
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y - 1});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y});
            addChunk(seed, {x: currentChunkPosition.x - 2, y: currentChunkPosition.y + 1});
        }
        currentChunkPosition = newChunkPosition;
        // if (DISPLACEMENT.x !== 0 || DISPLACEMENT.y !== 0) {
        //     console.log(currentChunkPosition);
        //     console.log(currentChunks);
        // } 
    }

    function addChunk(seed, chunkPosition) {
        currentChunks[[chunkPosition.x, chunkPosition.y]] = new Chunk(seed, chunkPosition);               
    }

    this.update = function(delta) {
        for (var chunkKey in currentChunks) {
            if (currentChunks.hasOwnProperty(chunkKey)) {
                currentChunks[chunkKey].update(delta);
            }
        }
    }

    this.render = function(context) {
        for (var chunkKey in currentChunks) {
            if (currentChunks.hasOwnProperty(chunkKey)) {
                currentChunks[chunkKey].render(context);
            }
        }
    }
}

var Chunk = function(seed, position) {
    var position = position;
    var seed = seed;
    var objects = [];
    var playerIndex = -1;
    generate(seed);
    function generate(seed) {
        objects = objects.concat(
            treeGenerator.plantTrees(
                35, 
                {
                    min: position.x * CANVAS_WIDTH, 
                    max: position.x * CANVAS_WIDTH + CANVAS_WIDTH
                }, 
                {
                    min: position.y * CANVAS_HEIGHT, 
                    max: position.y * CANVAS_HEIGHT + CANVAS_HEIGHT
                }
            )
        );
        if (position.x === seed.goalChunkPosition.x && position.y === seed.goalChunkPosition.y) {
            var goalSprite = new Sprite(spriteSheet, 4, false);
            goalSprite.position.x = position.x * CANVAS_WIDTH;
            goalSprite.position.y = position.y * CANVAS_HEIGHT;
            objects = objects.concat(goalSprite); 
        }
    }
    this.removeObject = function(id) {
        var removedObject = null;
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].id === id) {
                removedObject = objects.splice(i, 1);
                break;
            }
        }
        return removedObject[0];
    }
    this.addObject = function(object) {
        objects.push(object);
    }
    this.update = function(seconds) {
        objects.forEach(function(object) {                
            object.update(seconds);
        }, this);

        var collisions = [];
        // are any objects colliding now?
        objects.forEach(function(object) {
            if (playerSprite.body.collide(object.body) && playerSprite.id !== object.id) {
                collisions.push(object);
            }
        }, this);
    
        // fix positions of colliding objects (and adjust velocities?)
        collisions.forEach(function(other) {
            // is the player colliding with the goal?
            if (other.frame === 4) {
                goalReached = true;
            }
            const PLAYER_CENTER = {
                x: playerSprite.body.position.x + Math.floor(playerSprite.body.size.width / 2),
                y: playerSprite.body.position.y + Math.floor(playerSprite.body.size.height / 2)
            }
            const OTHER_CENTER = {
                x: other.body.position.x + Math.floor(other.body.size.width / 2),
                y: other.body.position.y + Math.floor(other.body.size.height / 2)
            }
            const DISPLACEMENT = {
                x: PLAYER_CENTER.x - OTHER_CENTER.x,
                y: PLAYER_CENTER.y - OTHER_CENTER.y
            }
            
            // up diagonals
            if (inputHandler.keys.left.isDown & inputHandler.keys.up.isDown) {
                if (DISPLACEMENT.x < 0 && DISPLACEMENT.y > 0) {
                    // bottom left quadrant
                    collisionResolver.resolveUp(playerSprite, other);
                } else if (DISPLACEMENT.x > 0 && DISPLACEMENT.y < 0) {
                    // top right quadrant
                    collisionResolver.resolveLeft(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) < Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveLeft(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) > Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveUp(playerSprite, other);
                }
            } else if (inputHandler.keys.right.isDown & inputHandler.keys.up.isDown) {
                if (DISPLACEMENT.x < 0 && DISPLACEMENT.y < 0) {
                    // top left quadrant
                    collisionResolver.resolveRight(playerSprite, other);
                } else if (DISPLACEMENT.x > 0 && DISPLACEMENT.y > 0) {
                    // bottom right quadrant
                    collisionResolver.resolveUp(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) < Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveRight(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) > Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveUp(playerSprite, other);
                }
            } else if (inputHandler.keys.left.isDown & inputHandler.keys.down.isDown) {
                if (DISPLACEMENT.x < 0 && DISPLACEMENT.y < 0) {
                    // top left quadrant
                    collisionResolver.resolveDown(playerSprite, other);
                } else if (DISPLACEMENT.x > 0 && DISPLACEMENT.y > 0) {
                    // bottom right quadrant
                    collisionResolver.resolveLeft(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) < Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveLeft(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) > Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveDown(playerSprite, other);
                }
            } else if (inputHandler.keys.right.isDown & inputHandler.keys.down.isDown) {
                if (DISPLACEMENT.x > 0 && DISPLACEMENT.y < 0) {
                    // top left quadrant
                    collisionResolver.resolveDown(playerSprite, other);
                } else if (DISPLACEMENT.x < 0 && DISPLACEMENT.y > 0) {
                    // bottom right quadrant
                    collisionResolver.resolveRight(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) < Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveRight(playerSprite, other);
                } else if (Math.abs(DISPLACEMENT.y) > Math.abs(DISPLACEMENT.x)) {
                    // these can't be combined above because quadrant checking needs to happen before absolute value checking
                    collisionResolver.resolveDown(playerSprite, other);
                }
            } else {
                // left & right only
                if (inputHandler.keys.left.isDown) {
                    collisionResolver.resolveLeft(playerSprite, other);
                } else if (inputHandler.keys.right.isDown) {
                    collisionResolver.resolveRight(playerSprite, other);
                }
    
                // up & down only
                if (inputHandler.keys.up.isDown) {
                    collisionResolver.resolveUp(playerSprite, other);
                } else if (inputHandler.keys.down.isDown) {
                    collisionResolver.resolveDown(playerSprite, other);
                } 
            }
        }, this);
    
        // depth sort all objects in the game
        objects.sort(function (a, b) {
            return a.position.y - b.position.y;
        });
    }
    this.render = function(context) {
        objects.forEach(function(object) {
            object.render(context);
        }, this);
    }
}

var TreeGenerator = function(treeSprite) {
    var treeSprite = treeSprite;

    this.plantTrees = function(treeCount, xRange, yRange) {
        var trees = [];
        for (var i = 0; i < treeCount; i++) {
            trees.push(
                plantTree(
                    treeSprite, 
                    Math.floor(Math.random() * (xRange.max - xRange.min) + xRange.min), 
                    Math.floor(Math.random() * (yRange.max - yRange.min) + yRange.min)
                )
            );
        }
        return trees;
    }

    function plantTree(treeSprite, x, y) {
        var treeSprite = new Sprite(spriteSheet, 1, false);
        treeSprite.position.x = x;
        treeSprite.position.y = y;
        return treeSprite;
    }
}

var Body = function(position, size, movable) {
    this.position = position;
    this.size = size;
    this.movable = movable;

    /**
     * @param {Object} other - other body to check for collision against
     * @param {Object} other.position - location point of other body
     * @param {Object} other.size - dimensions of other body
     */
    this.collide = function(other) {
        if (this.position.x < other.position.x + other.size.width &&
            this.position.x + this.size.width > other.position.x &&
            this.position.y < other.position.y + other.size.height &&
            this.size.height + this.position.y > other.position.y) {
             return true;
         }
         return false;
    }
}

var CollisionResolver = function() {
    this.resolveUp = function(player, other) {
        player.position.y -= player.body.position.y - (other.body.position.y + other.body.size.height);    
    }
    this.resolveDown = function(player, other) {
        player.position.y -= player.body.position.y + player.body.size.height - other.body.position.y;
    }
    this.resolveLeft = function(player, other) {
        player.position.x -= player.body.position.x - (other.body.position.x + other.body.size.width);
    }
    this.resolveRight = function(player, other) {
        player.position.x -= player.body.position.x + player.body.size.width - other.body.position.x;
    }
}

var InputHandler = function() {
    this.keys = {
        left: new Key(37),
        up: new Key(38),
        right: new Key(39),
        down: new Key(40)
    }

    document.addEventListener('keydown', function(keyEvent) {
        this.keys = setKeyDown(this.keys, keyEvent.keyCode, true);
    }.bind(this));

    document.addEventListener('keyup', function(keyEvent) {
        this.keys = setKeyDown(this.keys, keyEvent.keyCode, false);
    }.bind(this));

    function setKeyDown(keys, keyCode, isDown) {
        switch (keyCode) {
            case keys.left.CODE:
                keys.left.isDown = isDown;
                break;
            case keys.up.CODE:
                keys.up.isDown = isDown;
                break;
            case keys.right.CODE:
                keys.right.isDown = isDown;
                break;
            case keys.down.CODE:
                keys.down.isDown = isDown;
                break;
            default:
                break;
        }
        return keys;
    }
}

var Key = function(code) {
    this.CODE = code;
    this.isDown = false;
}

var guid = 0;
function GetGUID() {
    return guid++;
}