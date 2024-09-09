// utils
var randomMinMax = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
var randomPick = arr => arr[randomMinMax(0, arr.length-1)]

var collisionCheck = (c1, c2) => {
  let dx = c1.x - c2.x
  let dy = c1.y - c2.y
  let dist = Math.sqrt(dx * dx + dy * dy)
  return dist < ((c1.r || EMOJIR) + (c2.r || EMOJIR))
}

// init 
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = 700
canvas.height = 450

var msgel = document.getElementById('msgel')

// create emojis
var IMGS = {}
var EMOJID = 54
var EMOJIR = EMOJID/2

var imgsLabels = ['enemy', 'cow', 'fire', 'tree0', 'tree1', 'meat', 'dog', 'droplet', 'sunflower']
'👹 🐮 🔥 🌲 🌳 🍖 🐶 💧 🌻'.split(' ').map((emoji, i) => {
  let imgCanvas = document.createElement('canvas')
  imgCanvas.width = EMOJID
  imgCanvas.height = EMOJID
  let introTargetEl = document.getElementById('intro_'+imgsLabels[i])
  if (introTargetEl) introTargetEl.appendChild(imgCanvas)
  let ctx = imgCanvas.getContext('2d')
  ctx.font = '50px serif'
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle'
  
  ctx.fillText(emoji, imgCanvas.width / 2, imgCanvas.height / 2 + 4)
  var dataURL = imgCanvas.toDataURL()
  var img = new Image()
  img.src = dataURL
  IMGS[imgsLabels[i]] = img
})

var DOGSPEED = 1

var dog

// state
var WORLD = []

var initWorld = () => {
  dog = {
    type: 'dog',
    x: undefined,
    y: undefined,
    xdir: 0,
    ydir: 0,
    speed: DOGSPEED,
    life: Infinity,
    hasDroplet: null
  }

  dog.x = randomMinMax(0, canvas.width-EMOJID)
  dog.y = randomMinMax(0, canvas.height-EMOJID)


  let enemyCnt = parseFloat(document.getElementById('enemyCnt').value)
  let fireCnt = parseFloat(document.getElementById('fireCnt').value)
  let cowCnt = parseFloat(document.getElementById('cowCnt').value)

  WORLD = [dog]

  // add some enemy
  new Array(Math.max(1, enemyCnt)).fill(0).forEach(item => {
    WORLD.push(
      Object({
        type: 'enemy',
        x: randomMinMax(0, canvas.width-EMOJID),
        y: randomMinMax(0, canvas.height-EMOJID),
        lastTurn: -Infinity,
        xdir: 0,
        ydir: 0,
        speed: 1,
        life: 10
      })
    )
  })
  
  // add some fire
  new Array(Math.max(1, fireCnt)).fill(0).forEach(item => {
    WORLD.push(
      Object({
        type: 'fire',
        x: randomMinMax(0, canvas.width-EMOJID),
        y: randomMinMax(0, canvas.height-EMOJID),
        life: 30
      })
    )
  })

  // add some cows
  new Array(cowCnt).fill(0).forEach(item => {
    WORLD.push(
      Object({
        type: 'cow',
        x: randomMinMax(0, canvas.width-EMOJID),
        y: randomMinMax(0, canvas.height-EMOJID),
        xdir: 0,
        ydir: 0,
        speed: 1,
        life: 100
      })
    )
  })

  // and some trees
  new Array(15).fill(0).forEach((item, i) => {
    WORLD.push(
      Object({
        type: 'tree'+(i%2),
        x: randomMinMax(0, canvas.width-EMOJID),
        y: randomMinMax(0, canvas.height-EMOJID),
        life: 100
      })
    )
  })

  // and some sunflowers
  new Array(2).fill(0).forEach((item, i) => {
    WORLD.push(
      Object({
        type: 'sunflower',
        x: randomMinMax(0, canvas.width-EMOJID),
        y: randomMinMax(0, canvas.height-EMOJID),
        life: 100
      })
    )
  })


  YOUWIN = false
}


const paingOrder = ['meat', 'cow', 'tree0', 'sunflower', 'tree1', 'fire', 'enemy', 'dog', 'droplet']

const drawItem = item => {
  let img = IMGS[item.type]
  ctx.drawImage(img, item.x, item.y, img.width, img.height)
}

// render all, in order
const render = () => {
  if (!YOUWIN) ctx.clearRect(0, 0, canvas.width, canvas.height)

  // draw items back of dog
  paingOrder.forEach(imgLabel => WORLD
    .filter(x => x.type === imgLabel && !x.toFront).forEach(drawItem))
    
  // draw items in on front of dog
  paingOrder.forEach(imgLabel => WORLD
    .filter(x => x.type === imgLabel && x.toFront).forEach(drawItem))

  if (YOUWIN) {
    ctx.font = '50px Verdana'
    ctx.textAlign = 'center';
    ctx.fillStyle = "#3f51b5";
    ctx.strokeStyle = 'black';

    ctx.textBaseline = 'middle'
    ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2)
    ctx.fillText('Bozo is defeated!', canvas.width / 2, canvas.height / 2 + 50)

    ctx.strokeText('YOU WIN!', canvas.width / 2, canvas.height / 2)
    ctx.strokeText('Bozo is defeated!', canvas.width / 2, canvas.height / 2 + 50)


    ctx.stroke();

  }
}

// check if entity is going out of canvas
var outOfCanvas = (item) => {
  let xyFix = [false, false]
  if(item.x < 0) xyFix[0] = 1
  if(item.x+EMOJID > canvas.width) xyFix[0] = -1
  if(item.y < 0) xyFix[1] = 1
  if(item.y+EMOJID > canvas.height) xyFix[1] = -1
  return (xyFix[0] || xyFix[1]) ? xyFix : false
}

var YOUWIN = false
// last t
var lt
var lastDroplett = 0
// simulate
const update = (t) => {
  let dt = t - (lt || t)
  lt = t

  if (YOUWIN) return

  WORLD = WORLD.filter(item => item.life > 0)

  if ((t - lastDroplett > 10000) || !lastDroplett) {
    lastDroplett = t
    WORLD.push({
      type: 'droplet',
      x: randomMinMax(EMOJID, canvas.width-EMOJID),
      y: randomMinMax(EMOJID, canvas.height-EMOJID),
      life: 800
    })  
  } 
  var fires = WORLD.filter(x => x.type === 'fire')
  var droplets = WORLD.filter(x => x.type === 'droplet')

  // achieve a simple perspective effect
  var perspectiveFixItems = WORLD
    .filter(x => ['cow', 'tree0', 'tree1', 'sunflower'].indexOf(x.type) !== -1)
    .forEach(item => {
      if (collisionCheck(item, dog)) {
        if (item.y > (dog.y - EMOJIR/5)) {
          item.toFront = true
        } else {
          item.toFront = false
        }
      }
    })
  
  if (fires.length === 0) YOUWIN = true
  
  WORLD.forEach(item => {

    if (['enemy', 'dog'].indexOf(item.type) !== -1) {
      let outOfCanvasFix = outOfCanvas(item)
      if (outOfCanvasFix) {
        item.xdir += item.speed*outOfCanvasFix[0]
        item.ydir += item.speed*outOfCanvasFix[1]
        if (item.type === 'dog') item.speed = DOGSPEED
      } else {
        if ((t - item.lastTurn > 1000) && (item.type === 'enemy')) {
          item.lastTurn = t
          item.xdir = item.speed*randomPick([-1, 1])
          item.ydir = item.speed*randomPick([-1, 1])
        }
      }

      if ((1 > Math.random()*100) && (item.type === 'enemy')) {
        WORLD.push({
          type: 'fire',
          x: item.x,
          y: item.y,
          life: 30
        })
      }
      item.x += item.speed*item.xdir
      item.y += item.speed*item.ydir
    }


    if (item.type === 'droplet') {
      fires.forEach(fire => {
        if (collisionCheck(item, fire)) {
          fire.life = Math.max(0, fire.life-0.1*dt)
          item.life = Math.max(0, item.life-0.1*dt)
          if (item.life <= 0) msgel.innerText = "I need more water!"
        }
      })
    }

    if (item.type === 'dog') {
      if (item.hasDroplet) {
        item.hasDroplet.x = item.x
        item.hasDroplet.y = item.y+10
      } else {
        droplets.forEach(droplet => {
          if (collisionCheck(item, droplet)) {
            msgel.innerText = "let's extinguish some fire!"
            droplet.x = item.x
            droplet.y = item.y
            item.hasDroplet = droplet
          }
        })
      }

      if (item.hasDroplet) {
        if (item.hasDroplet.life <= 0) item.hasDroplet = null
      } else {
        fires.forEach(fire => {
          if (collisionCheck(item, fire)) {
            msgel.innerText = "I can't pass through the fire!"
            item.xdir = 0
            item.ydir = 0

            if (randomPick([0, 1]) === 1) {
              if (fire.x < item.x) {
                item.xdir = 1
              } else {
                item.xdir = -1
              }            
            } else {
              if (fire.y < item.y) {
                item.ydir = 1
              } else {
                item.ydir = -1
              }              
            }
          }
        })
      }

      WORLD.filter(x => x.type === 'meat').forEach(meat => {
        if (collisionCheck(item, meat)) {
          meat.life = 0
          item.speed = DOGSPEED/3
          msgel.innerText = "I fell full of food... Will be good on a whistle."
          item.greedy = true
        }
      })
    }

    if (item.type === 'cow') {
      fires.forEach(fire => {
        if(collisionCheck(item, fire)) {
          item.life = item.life - dt*0.02

          if (item.life <= 0) {
            item.type = 'meat'
            item.life = Infinity
          } else {
            item.x += randomMinMax(-1, 1)
            item.y += randomMinMax(-1, 1)
          }
        }
      })
    }
  })
}

document.getElementById('newGameBtn').addEventListener('click', initWorld)

document.getElementById('introSkip').addEventListener('click', () => {
  initAudio()
  document.getElementById('intro').style.display = 'none'
  document.getElementById('main').style = ''

  window.addEventListener('keydown', (evt) => {
    dog.xdir = 0
    dog.ydir = 0

    if (!dog.greedy) dog.speed = DOGSPEED
    
    if (evt.code === 'KeyA' || evt.code === 'ArrowLeft') dog.xdir = -1
    if (evt.code === 'KeyD' || evt.code === 'ArrowRight') dog.xdir = 1
    if (evt.code === 'KeyW' || evt.code === 'ArrowUp') dog.ydir = -1
    if (evt.code === 'KeyS' || evt.code === 'ArrowDown') dog.ydir = 1
  })

  initWorld()
  // game loop
  ;(function () {
    function main( tFrame ) {
      window.requestAnimationFrame( main );
      update( tFrame )
      render()
    }
    main()
  })()
})
