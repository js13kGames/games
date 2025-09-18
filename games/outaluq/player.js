/**
 * Create a player
 * @type {Player}
 *
 * @author Jarred Mack, Steve Kane
 */
var Player = function () {
  var canvas, ctx;

  function cls(x, y, colour, id, direction, screenName, playerLuck, params) {
    //@todo fix the params
    var self = this;

    //Global to Player
    canvas = params.canvas || document.getElementById('canvas1');
    ctx = canvas.getContext('2d');

    this.x = x;
    this.y = y;
    this.h = triangleSideLength;
    this.direction = direction;
    this.colour = colour;
    this.username = screenName;
    this.lastX = x;
    this.lastY = y;
    this.lastDirection = direction;
    this.mapX = x;
    this.mapY = y;
    this.luck = playerLuck;
    this.socketId = id;
    this.activePlayer = params.activePlayer || false;
    this.dead = false;
    // this.playerSound = gs.get('shipSound').vol((id == socketId) ? 0.0 : 0.0 ).start();
    this.player = new Ship({
      colour: this.colour,
      size: 20
    });
    this.luckBar = new Shape({
      edges: 4,
      fill: true,
      offsetX: 20,
      offsetY: 10,
      width: 5,
      offsetRotation: -45
    });
    this.orb = new Shape({
      edges: 30,
      fill: true,
      offsetX: 60,
      width: 5,
      length: 5
    });
    this.rotationOffset = 0;

    /**
     * Check the pixel data under the player to determine collision
     */
    this.checkCollision = function () {
      // have I been hit?
      var p = ctx.getImageData(self.x, self.y, 1, 1).data; //@todo tolerance?

      var collidedObject = findObjectICollidedWith(p); //@todo localise

      if (collidedObject !== false) {
        // we hit something... let's return that object to cody
        playerEvent({ type: 'hit', data: collidedObject }); //@todo localise
      }
    }

    /**
     * Draw the player and any other required objects
     */
    this.draw = function () {
      self.rotationOffset += 3;
      //@todo localise mapOffsetX, and implement self.activePlayer
      self.player.draw(self.x + (self.socketId != socketId ? mapOffsetX : 0), self.y + (self.socketId != socketId ? mapOffsetY : 0), self.direction);
      //gs.playerPosition(self.x,self.y);
      //self.playerSound.at(self.x,self.y);
      //            self.orb.draw(self.x, self.y, (self.rotationOffset % 360));
      //            self.orb.draw(self.x, self.y, (self.rotationOffset + 120 % 360));
      //            self.orb.draw(self.x, self.y, (self.rotationOffset + 240 % 360));
      self.luckBar.setColour(getHealthColour(luck)) //@todo localise
        .setLength(luck / 2)
        .draw(self.x + (self.socketId != socketId ? mapOffsetX : 0), self.y + (self.socketId != socketId ? mapOffsetY : 0), self.direction);
    };

    /**
     * Kill the player, and display their final score
     */
    this.kill = function () {
      //@todo final score, move to game class
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText('You dedboi! you got: ' + globalScoreThatJarredWillNeedToRefactor, canvas.width / 2, canvas.height / 2);
      ctx.font = '20px Lucida Console';
      ctx.closePath();
      self.dead = true;
    };
    this.updateCoords = function (x, y, direction) {
      //@todo camera/viewport class?
      if (!self.dead) {
        var yMovement;
        if (typeof direction === 'undefined') {
          yMovement = x;
          direction = y;
        }
        if (socketId == this.socketId) {
          if (yMovement) {
            // reset the move rate so it only moves when a key is pressed
            moveRate = 0;
            // move viewport x axis
            if (this.x > canvas.width - (Math.floor(canvas.width / 4)) && Math.abs(mapOffsetX) < map.width - canvas.width) {
              // right hand side
              if (yMovement < 0) {
                if (this.direction > 0 && this.direction < 180) {
                  if (mapOffsetX > canvas.width - map.width) {
                    if (moveX(this.x, this.y, yMovement, direction, this.h / 2, -1) != 0) {
                      mapOffsetX += moveSteps * Math.sin(direction * Math.PI / 180);
                    }
                  } else {
                    mapOffsetX = canvas.width - map.width;
                  }
                } else {
                  //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, -1);
                }
              } else {
                // I'm not allowing for players to reverse into the boundaries for the scrolling viewport... *sigh*
                if (this.direction < 360 && this.direction > 180) {
                  if (mapOffsetX > canvas.width - map.width) {
                    if (moveX(this.x, this.y, yMovement, direction, this.h / 2, 1) != 0) {
                      mapOffsetX += moveSteps * Math.sin(direction * Math.PI / 180);
                    }
                  } else {
                    mapOffsetX = canvas.width - map.width;
                  }
                } else {
                  //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, 1);
                }
              }
            } else if (this.x < 0 + Math.floor((canvas.width / 4)) && mapOffsetX < 0) {
              // left hand side
              if (yMovement < 0) {
                if (this.direction < 360 && this.direction > 180) {
                  if (mapOffsetX < 0) {
                    if (moveX(this.x, this.y, yMovement, direction, this.h / 2, 1) != 0) {
                      mapOffsetX -= moveSteps * Math.abs(Math.sin(direction * Math.PI / 180));
                    }
                  } else {
                    mapOffsetX = 0;
                  }
                } else {
                  //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, 1);
                }
              } else {
                if (this.direction > 0 && this.direction < 180) {
                  if (mapOffsetX < 0) {
                    if (moveX(this.x, this.y, yMovement, direction, this.h / 2, -1) != 0) {
                      mapOffsetX += moveSteps * Math.abs(Math.sin(direction * Math.PI / 180));
                    }
                  } else {
                    mapOffsetX = 0;
                  }
                } else {
                  //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, -1);
                }
              }
            } else if (this.x < this.h / 2) {
              // if going forward
              if (yMovement < 0) {
                if (this.direction < 360 && this.direction > 180) {
                  // we've reached the bounds of the map to the left and we don't want to go any further
                } else {
                  // change the x position based on the movement and angle
                  // this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, 1);
                }
              } else {
                // backward
                if (this.direction > 0 && this.direction < 180) {
                  // we've reached the bounds of the map to the left and we don't want to go any further
                } else {
                  // change the x position based on the movement and angle
                  //this.x += yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, -1);
                }
              }
            } else if (this.x > canvas.width - this.h / 2) {
              if (yMovement < 0) {
                if (this.direction > 0 && this.direction < 180) {
                  // we've reached the bounds of the map to the right and we don't want to go any further
                } else {
                  // change the x position based on the movement and angle
                  //this.x -= yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, -1);
                }
              } else {
                if (this.direction < 360 && this.direction > 180) {
                  // we've reached the bounds of the map to the right and we don't want to go any further
                } else {
                  // change the x position based on the movement and angle
                  // this.x += yMovement * Math.sin(direction * Math.PI / 180);
                  this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, 1);

                }
              }
            } else {
              if (this.direction < 360 && this.direction > 180) {
                this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, 1);
              } else {
                this.x -= moveX(this.x, this.y, yMovement, direction, this.h / 2, -1);
              }
            }
            // viewport move y axis
            // bottom
            if (this.y > canvas.height - (Math.floor(canvas.height / 4)) && Math.abs(mapOffsetY) < map.height - canvas.height) {
              if (yMovement < 0) {
                if (this.direction > 90 && this.direction < 270) {
                  if (mapOffsetY > canvas.height - map.height) {
                    if (moveY(this.x, this.y, yMovement, direction, this.h / 2, 1) != 0) {
                      mapOffsetY += moveSteps * Math.abs(Math.cos(direction * Math.PI / 180));
                    }
                  } else {
                    mapOffsetY = canvas.height - map.height;
                  }

                } else {
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              } else {
                if (this.direction < 90 || this.direction > 270) {
                  if (mapOffsetY > canvas.height - map.height) {
                    if (moveY(this.x, this.y, yMovement, direction, this.h / 2, -1) != 0) {
                      mapOffsetY -= moveSteps * Math.abs(Math.cos(direction * Math.PI / 180));
                    }
                  } else {
                    mapOffsetY = canvas.height - map.height;
                  }
                } else {
                  this.y -= yMovement * Math.cos(direction * Math.PI / 180);
                }
              }
            } else if (this.y < 0 + Math.floor((canvas.height / 4)) && mapOffsetY < 0) {
              if (yMovement < 0) {
                if (this.direction < 90 || this.direction > 270) {
                  if (mapOffsetY < 0) {
                    if (moveY(this.x, this.y, yMovement, direction, this.h / 2, -1) != 0) {
                      mapOffsetY -= moveSteps * Math.cos(direction * Math.PI / 180);
                    }
                  } else {
                    mapOffsetY = 0;
                  }
                } else {
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              } else {
                if (this.direction > 90 && this.direction < 270) {
                  if (mapOffsetY < 0) {
                    if (moveY(this.x, this.y, yMovement, direction, this.h / 2, 1) != 0) {
                      mapOffsetY -= moveSteps * Math.cos(direction * Math.PI / 180);
                    }
                  } else {
                    mapOffsetY = 0;
                  }
                } else {
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              }
            } else if (this.y < this.h / 2) {
              if (yMovement < 0) {
                if (this.direction < 90 || this.direction > 270) {
                  // we've reached the bounds of the map to the top and we don't want to go any further
                } else {
                  // change the y position based on the movement and angle
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              } else {
                if (this.direction > 90 && this.direction < 270) {
                  // we've reached the bounds of the map to the top and we don't want to go any further
                } else {
                  // change the y position based on the movement and angle
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              }
            } else if (this.y > canvas.height - this.h / 2) {
              if (yMovement < 0) {
                if (this.direction > 90 && this.direction < 270) {
                  // we've reached the bounds of the map to the bottom and we don't want to go any further
                } else {
                  // change the y position based on the movement and angle
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              } else {
                if (this.direction < 90 || this.direction > 270) {
                  // we've reached the bounds of the map to the bottom and we don't want to go any further
                } else {
                  // change the y position based on the movement and angle
                  this.y += yMovement * Math.cos(direction * Math.PI / 180);
                }
              }
            } else {
              if (this.direction > 90 && this.direction < 270) {
                this.y += moveY(this.x, this.y, yMovement, direction, this.h / 2, 1);
              } else {
                this.y += moveY(this.x, this.y, yMovement, direction, this.h / 2, -1);
              }
            }
          }
        } else {
          this.x = x;
          this.y = y;
        }
        this.direction = direction;
      }
    };
    this.update = function () {
      self.checkCollision();
      self.draw();
      if (!self.dead && socketId == self.socketId) {
        if (self.lastX == self.x && self.lastY == self.y && self.lastDirection == self.direction) {
          return;
        }
        self.lastDirection = self.direction;
        self.lastX = self.x;
        self.lastY = self.y;
        self.mapY = self.y + Math.abs(mapOffsetY); //@todo localise
        self.mapX = self.x + Math.abs(mapOffsetX);

        socket.emit('playerMoved', {
          coords: {
            x: self.mapX,
            y: self.mapY,
            vpx: mapOffsetX, //@todo localise
            vpy: mapOffsetY
          },
          direction: self.direction
        });

        //                            gameSounds.ac.listener.setPosition(this.mapX, this.mapY, 0);
      }

    };
    this.updatePlayerState = function (data, isMe) {
      switch (data.type) {
        case 'luckUpdate':
          if (isMe) {
            luck = data.data; //@todo localise
          } else {
            this.luck = data.data;
          }
          break;
        case 'itemsUpdate':
          items = data.data; //@todo localise
          break;
        // and so on and so forth
      }

    };
  }

  /**
   * Generate health bar colour on a green -> red scale
   * @param luck
   * @returns {string}
   */
  function getHealthColour(luck) {
    var r = 255 - (255 * (luck / 100));
    var g = 255 * (luck / 100);
    var b = 0;
    return 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ',0.9)';
  }
  return cls;
} ();