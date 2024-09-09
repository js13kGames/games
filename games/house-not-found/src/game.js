document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 256;
canvas.width = 800;

const player = {
  sprite: [playerSprite, playerSpriteWalk, playerSprite, playerSpriteWalk2],
  frame: 0,
  animation: 0,
  x: canvas.width - 72,
  y: canvas.height - (playerSprite.length * 10),
  spriteIndexSize: 10,
  jumping: false,
  face: "right",
  color: "white",
  speed: 2,
};

function draw() {
  ctx.fillStyle = "#d8ccc5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (level == 1 && dog && !showDialog) {
    ctx.fillStyle = "white"
    ctx.fillRect(canvas.width - 148, canvas.height / 2 - 16, 64, 64)
    drawSprite(dogSprite[0], canvas.width - 128, canvas.height / 2, 2, 2);
    drawText("Lost Dog", canvas.width - 148, canvas.height / 2 + 40, 16, "black")
  }

  if (room404) {
    drawSprite(playerSprite,570,player.y,player.spriteIndexSize,player.spriteIndexSize);
    drawSprite(playerSprite,620,player.y,player.spriteIndexSize,player.spriteIndexSize);
    drawSprite(playerSprite,280,player.y,player.spriteIndexSize,player.spriteIndexSize);
    drawSprite(playerSprite,340,player.y,player.spriteIndexSize,player.spriteIndexSize);

    drawSprite(doorSprite, 123, 138, 8, 8);

    ctx.fillStyle="white"
    ctx.fillRect(400, canvas.height / 2 - 80, 165, 50)
    drawText('Congratulations', 410, canvas.height / 2 - 50, 20, "black");
    drawText('Surprise!', 20, 32, 20, "white");
    drawSprite(cake, 450, 142, 4, 4);
    drawSprite(desk, 400, 194, 8, 8);

  } else if (room202) {
    drawSprite(closet, 400, 138, 8, 8);
    drawSprite(desk, 200, 194, 8, 8);
    drawSprite(doorSprite, 123, 138, 8, 8);
    drawSprite(doorSprite, 560, 138, 8, 8);
  } else if (room501) {
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    drawSprite(doorSprite, 100, 138, 8, 8);
    drawSprite(airductSprite, 416, canvas.height - 30, 2, 2);

    drawSprite(closetSprite, 500, 128, 8,8)
    drawSprite(closetSprite, 500, 176, 8,8)
    drawSprite(closetSprite, 620, 128, 8,8)
    drawSprite(closetSprite, 620, 176, 8,8)
    drawSprite(boxesSprite, 620, canvas.height - 4 * boxesSprite.length, 4,4)
    drawSprite(boxesSprite1, 560, canvas.height - 4 * boxesSprite.length, 4,4)
    drawSprite(broomSprite, 732, canvas.height - 4 * broomSprite.length, 4,4)  
  } else if (room405) {
    ctx.fillStyle = "pink";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    

    drawSprite(doorSprite, 100, 138, 8, 8);
    
    drawSprite(holeSprite, 560, canvas.height/2 - 32, 8, 8);
  } else if (showDialog) {
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 62, 62, 125, 125);
    for (let i = 1; i <= 5; i++) {
      if (level === i) {
        ctx.fillStyle = "blue";
        ctx.fillRect(canvas.width / 2 - 62, 62 + (i - 1) * 25, 125, 25);
      }
      let cl = level != i ? "black" : "white";
      drawText(
        i,
        canvas.width / 2 - ctx.measureText(i).width / 2,
        80 + 25 * (i - 1),
        20,
        cl
      );
    }
    drawText("To select the floor use Z", canvas.width / 2 - 80, canvas.height - 32, 16, 'black')
  } else if (asked) {
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 64, 64, 128, 128);

    ctx.fillStyle = "blue";
    let customHeight = !response ? 50 : 30;
    ctx.fillRect(canvas.width / 2 - 64, 64 + customHeight, 128, 22);

    drawText(
      question,
      canvas.width / 2 - ctx.measureText(question).width / 2 + 32,
      86,
      12,
      "black"
    );
    drawText(
      "yes",
      canvas.width / 2 - ctx.measureText("yes").width / 2 - 8,
      108,
      20,
      response ? "white" : "black"
    );
    drawText(
      "no",
      canvas.width / 2 - ctx.measureText("no").width / 2 - 8,
      130,
      20,
      response ? "black" : "white"
    );
  } else {
    doors.forEach((x, i) => {
      if (level === 1 && i > 2) {
      } else {
        drawText(`${level}0${i + 1}`, x + 19, 120, 20, "white");
      }
      if (level === 4 && i === 3) {
      } else if (level === 1 && i > 2) {
      } else drawSprite(doorSprite, x, 138, 8, 8);
    });
    drawSprite(elevator, 0, 120, 8, 140);
  }
  if (!showDialog && !asked) {
    drawSprite(
      player.sprite[player.frame],
      player.x,
      player.y,
      player.spriteIndexSize,
      player.spriteIndexSize
    );

    if (dog) {
      if (player.x - dogSprite[dogFrame].length - 64 < 0) drawSprite(dogSprite[dogFrame], player.x + 64, canvas.height - dogSprite[dogFrame].length * 3, 3, 3);
      else drawSprite(dogSprite[dogFrame], player.x - 64, canvas.height - dogSprite[dogFrame].length * 3, 3, 3);
    }
  }

  if (dialog && !showDialog && !asked) {
    ctx.fillStyle = "darkgrey"
    ctx.fillRect(player.x + 10, canvas.height / 2, 40, 40)
    ctx.beginPath();
    ctx.moveTo(player.x + 10, canvas.height / 2);
    ctx.lineTo(player.x + 10, canvas.height / 2 + 40);
    ctx.moveTo(player.x + 10, canvas.height / 2 + 40);
    ctx.lineTo(player.x + 50, canvas.height / 2 + 40);
    ctx.moveTo(player.x + 50, canvas.height / 2 + 40);
    ctx.lineTo(player.x + 50, canvas.height / 2);
    ctx.moveTo(player.x + 50, canvas.height / 2);
    ctx.lineTo(player.x + 10, canvas.height / 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
    //drawText('Z', player.x + 22, player.y - 24, 20, "black")
    ctx.beginPath();
    ctx.moveTo(player.x + 30, canvas.height / 2 + 12);
    ctx.lineTo(player.x + 20, canvas.height / 2 + 26);
    ctx.moveTo(player.x + 20, canvas.height / 2 + 26);
    ctx.lineTo(player.x + 40, canvas.height / 2 + 26);
    ctx.moveTo(player.x + 40, canvas.height / 2 + 26);
    ctx.lineTo(player.x + 30, canvas.height / 2 + 12);
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  drawText(dialog, 20, 32, 20, "white");
  if (money) drawSprite(moneySprite, canvas.width - 64, 10, 2, 2);
  if (screwdriver) drawSprite(screwdriverSprite, canvas.width - 64, 10, 2, 2);
  if (password) drawSprite(passwordSprite, canvas.width - 64, 10, 2, 2);
  if (keys) drawSprite(keySprite, canvas.width - 64, 10, 2, 2);
}

function update() {
  if (showDialog) {
    if (keyUp) {
      elevatorSoundPlay()
      keyUp = false;
      level--;
      if (level < 1) {
        level = 5;
      }
    }
    if (keyDown) {
      elevatorSoundPlay()
      keyDown = false;
      level++;
      if (level > 5) {
        level = 1;
      }
    }
    if (keyEnter || keyZ) {
      selectSoundPlay()
      keyEnter = keyZ = false;
      showDialog = false;
    }
    if (keyEscape) {
      keyEscape = false;
      level = levelBefore;
      showDialog = false;
    }
  } else if (asked) {
    if (keyUp || keyDown) {
      elevatorSoundPlay()
      keyUp = false;
      keyDown = false;
      response = !response;
    }
    if (keyEnter || keyZ) {
      selectSoundPlay()
      if (response) {
        player.x = 100;
        if (level == 2) {
          room202 = true;
          dog = true;
          asked = false;
          question = "";
        } else if (level == 4 && door == 2) {
          money = false;
          password = true;
          asked = false;
          question = "";
        } else if (level == 4 && door == 1) {
          screwdriver = true;
          password = false;
          asked = false;
          question = "";
        } else if (level == 4 && door == 5) {
          key = false;
          asked = false;
          room405 = true;
          question = "";
        } else if (level == 5 && door == 1) {
          room501 = true;
          asked = false;
          question = "";
        }
      } else {
        asked = false;
        question = "";
      }
    }
  } else {
    if (dialog == "ELEVATOR" && keyUp) {
      elevatorSoundPlay()
      showDialog = true;
      levelBefore = level;
      keyUp = false;
    } else if (dialog.split(" ")[0] == "Open" && keyUp) {
      knockSoundPlay()
      gameLogic();
      keyUp = false;
    } else if (dialog.split(" ")[0] == "Take" && keyUp) {
      elevatorSoundPlay()
      closet[6][14] = "A";
      money = true;
      keyUp = false;
    } else if (dialog == "Leave" && (room202 || room501) && keyUp) {
      elevatorSoundPlay()
      room202 = false;
      room501 = false;
      keyUp = false;
    } else if (dialog[0] == "E" && (room405) && keyUp) {
      elevatorSoundPlay()
      playFinalSound()
      room405 = false;
      room404 = true;
      keyUp = false;
    } else if (dialog[0] == "U" && room501 && keyUp) {
      elevatorSoundPlay()
      player.x = 100
      keys = true;
      airductSprite = airductSpriteOpen
      screwdriver = false;
      keyUp = false;
    } else {
      if (keyRight) {
        if (player.x + player.spriteIndexSize*8 > canvas.width) player.x = canvas.width - player.spriteIndexSize * 8
        player.x += player.speed;
        player.animation++
        if (player.animation > 16) {
          walkSoundPlay()
          player.frame++
          if (player.frame == 4) player.frame = 0
          player.animation = 0
        }
      }
      if (keyLeft) {
        if (player.x<0) player.x = 0
        player.x -= player.speed;
        player.animation++
        if (player.animation > 16) {
          walkSoundPlay()
          player.frame++
          if (player.frame == 4) player.frame = 0
          player.animation = 0
        }
      }

      if (dog) {
        dogAnimation++
        if (dogAnimation > 32) {
          dogFrame++
          dogAnimation = 0
          if (dogFrame == 2) {
            dogFrame = 0
          }
        }
      }

      if (timer == -1) {
        checkPlayerCollision();
      }

      if (room404) {
        keyLeft = false
        keyRight = false
      }

      if (changeDirection != player.face) {
        if (player.face == "left") player.sprite = [playerSpriteR, playerSpriteWalkR, playerSpriteR, playerSpriteWalk2R]
        else player.sprite = [playerSprite, playerSpriteWalk, playerSprite, playerSpriteWalk2]
        player.face = changeDirection
      }
    }
  }
}

function checkPlayerCollision() {
  if (room202) {
    if (player.x + 56 > 123 && player.x < 192) dialog = "Leave";
    else if (player.x + 56 > 560 && player.x < 632)
      dialog = "I'm taking a shower, I leave in a minute";
    else if (player.x + 56 > 500 && player.x < 572 && closet[6][14] === "G")
      dialog = "Take the money";
    else dialog = "";
  } else if(room404) {
    player.x = 100
    dialog = ""
  } else if (room405) {
    if (player.x + 56 > 560 && player.x < 632) {
      dialog = "Enter the hole?"
    }
  }else if (room501) {
    if (player.x + 56 > 100 && player.x < 172) dialog = "Leave";
    else if (player.x + 56 > 416 && player.x < 488) {
      dialog = screwdriver ? "Use Screwdriver" : "";
    } else dialog = "";
  } else {
    if (player.x + 56 > 100 && player.x < 172) {
      door = 1;
      dialog = `Open door ${level}0${door}`;
    } else if (player.x + 56 > 250 && player.x < 322) {
      door = 2;
      dialog = `Open door ${level}0${door}`;
    } else if (player.x + 56 > 400 && player.x < 472) {
      door = 3;
      dialog = `Open door ${level}0${door}`;
    } else if (player.x + 56 > 550 && player.x < 622) {
      if (level !== 1) {
        door = 4;
        dialog = `Open door ${level}0${door}`;
      }
    } else if (player.x + 56 > 700 && player.x < 722) {
      if (level !== 1) {
        door = 5;
        dialog = `Open door ${level}0${door}`;
      }
    } else if (player.x <= 24) {
      dialog = "ELEVATOR";
    } else {
      dialog = "";
      timer = -1;
    }
  }
}

function keyDownHandler(event) {
  switch (event.keyCode) {
    case KEYS.right:
      keyRight = true;
      changeDirection = 'right'
      break;
    case KEYS.left:
      if (player.x > 0) {
        keyLeft = true;
        changeDirection = 'left'
      }
      break;
    case KEYS.up:
      keyUp = true;
      break;
    case KEYS.down:
      keyDown = true;
      break;
    case KEYS.z:
      keyZ = true;
      break;
    case KEYS.enter:
      keyEnter = true;
      break;
    case KEYS.escape:
      keyEscape = true;
      break;
  }
}
function keyUpHandler(event) {
  switch (event.keyCode) {
    case KEYS.right:
      keyRight = false;
      player.frame = 0;
      player.animation = 0;
      break;
    case KEYS.left:
      keyLeft = false;
      player.frame = 0;
      player.animation = 0;
      break;
    case KEYS.up:
      keyUp = false;
      break;
    case KEYS.down:
      keyDown = false;
      break;
    case KEYS.enter:
      keyEnter = false;
      break;
    case KEYS.z:
      keyZ = false;
      break;
    case KEYS.escape:
      keyEscape = false;
      break;
  }
}

function handleHint() {
  if (currentHint == 0) {currentHint = 1; return "Knock my door anytime you need a hint...";}
  else if (currentHint == 1) return "In the half of your home you can find what you need";
  if (money) { currentHint = 2; return "Money buys any information";}
  else if (password) return "With the right password you got screw";
  else if (screwdriver) return "Let the air flow";
  else if (keys) return "Help thy neighbour";
  else return "Don't be scared";
}

function gameLogic() {
  const txt = {
    "11": "Sorry I'm packing...",
    "12": "I can ask someone if you want to...",
    "13": handleHint(),
    "21": "Sorry I'm packing...",
    "22": "Come on in...",
    "23": "I can't say anything",
    "24": "Nobody lives here",
    "25": "Buy I new home ",
    "31": "This guy moved out...",
    "32": "Come back latter",
    "33": "Maybe someone else can help you...",
    "34": "I didn't see anything diferent",
    "35": "Maybe you need a secure ",
    "41": `What it's the password?...${password ? "ok...you can take this" : "...no"}`,
    "42": "How much can you pay?",
    "43": "I can't talk to you",
    "44": "Where is my door?",
    "45": "Sorry, I can't open the door",
    "51": "This is the janitor Room",
    "52": "Maybe the room 505 could help you",
    "53": "ZZZZzzzZZZZzzZZ",
    "54": "...",
    "55": "אני לא מדבר אנגלית",
  };
  const actions = {
    "22": { asked: true, question: "Enter the room?" },
    "41": { asked: password, question: "Take?" },
    "42": { asked: money, question: "Give money?" },
    "45": { asked: keys, question: "Open the door?" },
    "51": { asked: true, question: "Enter the room?" },
  };
  let id = `${level}${door}`;
  dialog = txt[id];
  if (id == "22" || id == "41" || id == "42" || id == "45" || id == "51") {
    asked = actions[id].asked;
    question = actions[id].question;
  }
  timerStart();
}

const timerStart = (time = 2 * 60) => (timer = time);

function drawSprite(sprite, x, y, w, h) {
  sprite.forEach((r, rI) => {
    r.forEach((c, cI) => {
      ctx.fillStyle = colors[c];
      ctx.fillRect(x + cI * w, y + rI * h, w, h);
    });
  });
}

function drawText(t, x, y, s, c) {
  ctx.font = `${s}px Georgia`;
  ctx.fillStyle = c;
  ctx.fillText(t, x, y);
}

setInterval(function () {
  if (timer > -1) {
    timer--;
    if (timer == -1) {}//timeOut();
  }

  update();
  draw();
}, 1000 / 60);
