'use strict'

const messages = {
  intro: 'starship has crashed on a strange planet',
  intro2: 'all systems are offline',
  resources: 'not enough resources',
  dead: 'explorer is lost - be careful in this hostile world',
}

const base = {
  y: 21,
  x: 46,
  symbol: 'S',
  energy: 0,
  metals: 0,
  rare: 0,
  droids: { idle: 0, reactor: 0, extractor: 0 },
}
const explorer = {
  alive: false,
  y: 21,
  x: 46,
  symbol: '@',
  active: false,
  energy: 0,
  energyMax: 15,
  rare: 0,
  metals: 0,
  shield: 0,
  shieldMax: 0,
  droids: 0,
  droidsMax: 2,
  cargo: 0,
  cargoMax: 20,
  health: 10,
  healthMax: 10,
  weapon: 2,
  weaponSpeed: 200,
  weaponIcon: '·',
  distanceFromBase: 0,
  displayShield() {
    if (explorer.shield > 0 && explorer.shield <= 5) {
      return ' |'
    }
    if (explorer.shield > 0 && explorer.shield <= 10) {
      return ' ||'
    }
    if (explorer.shield > 0 && explorer.shield <= 15) {
      return ' |||'
    }
    return ''
  },

  chargeShield() {
    if (explorer.shield < explorer.shieldMax) {
      explorer.energy -= 1
      explorer.shield = ((explorer.shieldMax - explorer.shield) < 10) ? explorer.shieldMax
        : explorer.shield + 10
    }
    updateAllPanels()
    explorer.displayShield()
  },

  setDistance() {
    explorer.distanceFromBase = Math.abs(explorer.x-base.x) + Math.abs(explorer.y-base.y)
  },
}
const markers = {
  S: [[base.y, base.x]],
  H: [[32, 33], [27, 34], [25, 36], [20, 62], [22, 64], [26, 61], [21, 68],
    [16, 70], [26, 69], [26, 76], [29, 76], [22, 78], [28, 81], [26, 85],
    [33, 88], [36, 90], [39, 92], [37, 94], [38, 100], [38, 103], [33, 106],
    [29, 108], [27, 110], [24, 114], [28, 117], [39, 110], [26, 105], [23, 104],
    [18, 75], [42, 107], [55, 120], [53, 70], [51, 74], [44, 78], [39, 64],
    [36, 57], [32, 58], [31, 26], [35, 29], [39, 33], [39, 41], [54, 43], [30, 21],
    [27, 17], [47, 34], [56, 35], [58, 40]],
  E: [[19, 51], [28, 24], [15, 61], [21,43]],
  M: [[27, 47], [11, 44], [26, 21], [47, 37]],
  B: [[7, 47], [33, 24], [38, 70]],
}

const game = {
  on: true,
  over: false,
  pause() {
    game.on = false
    explorer.active = false
  },

  resume() {
    game.on = true
    explorer.active = true
  },
}

function max4messages() {
  const messagesInContainer = getById('message-container').childNodes
  if (messagesInContainer.length === 4) {
    getById('message-container').removeChild(messagesInContainer[0])
  }
}

let messageStack = []
let callbackStack = []

function typist(message, callback = () => {}) {
  if (!game.over) {
    max4messages()
  }
  if (!messageStack.includes(message)) {
    messageStack.unshift(message)
    callbackStack.unshift(callback)
  }
  if (!typeWritter.inUse) {
    typeWritter.inUse = true
    typeWritter(messageStack.pop(), callbackStack.pop())
  }
  else {
    setTimeout(typist, 100, message)
  }
}

function typeWritter(txt, callback = null, t = 0) {
  let tw = t
  let messages = (game.over) ? document.getElementById('messages')
    : document.getElementById('message-container')
  if (tw === 0) {
    let p = document.createElement('p')
    messages.appendChild(p)
  }
  if (tw < txt.length) {
    messages.lastChild.textContent += txt.charAt(tw)
    tw += 1
    setTimeout(typeWritter, 50, txt, callback, tw)
  } else {
    typeWritter.inUse = false
    if (callback) {
      callback()
    }
  }
}
typeWritter.inUse = false

typist(messages.intro, () => {
  getById('actions').classList.remove('hidden')
})
typist(messages.intro2)

function getById(Element) {
  return document.getElementById(Element)
}

function showBtn(btnId) {
  if (typeof btnId === 'object') {
    btnId.forEach((btn) => {
      getById(btn).className = 'btn active'
    })
  } else {
    getById(btnId).className = 'btn active'
  }
}

const rrBtn = getById('restart-reactor')
const reBtn = getById('restart-extractor')
const dfBtn = getById('droid-factory')
const wrBtn = getById('work-reactor')
const weBtn = getById('work-extractor')
const bdBtn = getById('work-droid')
const drBtn = getById('droid-reactor')
const deBtn = getById('droid-extractor')
const ubBtn = getById('upgrade-battery')
const usBtn = getById('upgrade-shield')
const uwBtn = getById('upgrade-weapon')
const beBtn = getById('build-explorer')
const deployBtn = getById('deploy')
const eexBtn = getById('load-energy')
const dexBtn = getById('load-droids')

reBtn.costs = { energy: 1 }
dfBtn.costs = { energy: 1, metals: 1 }
bdBtn.costs = { energy: 1, metals: 1 }
beBtn.costs = { energy: 1, metals: 1 }
ubBtn.costs = { energy: 5, metals: 15, rare: 5 }
usBtn.costs = { energy: 5, metals: 15, rare: 5 }
uwBtn.costs = { energy: 5, metals: 15, rare: 5 }

function addTooltip(btn) {
  btn.addEventListener('mouseenter', (e) => {
    if (btn.className === 'btn active') {
      let tooltip = document.createElement('div')
      tooltip.setAttribute('class', 'tooltip')
      tooltip.setAttribute('id', 'tooltip')
      Object.entries(btn.costs).forEach(([key, entry]) => {
        const p = document.createElement('p')
        p.textContent = `${key}: ${entry}`
        tooltip.appendChild(p)
      })
      btn.appendChild(tooltip)
    }
  })


  btn.addEventListener('mouseleave', (e) => {
    const obj = getById('tooltip') || null
    if (obj) {
      btn.removeChild(obj)
    }
  })
}
addTooltip(reBtn)
addTooltip(dfBtn)
addTooltip(bdBtn)
addTooltip(ubBtn)
addTooltip(usBtn)
addTooltip(uwBtn)
addTooltip(beBtn)

const planet = getById('planet-x')
const map = []

for (let i = 0; i < planetRLE.length; i += 1) {
  /* eslint-disable no-undef */
  map.push([])
  let flag = false
  let index = 0
  planetRLE[i].unshift(0)
  planetRLE[i].push(135)
  for (let j = 0; j < planetRLE[i][planetRLE[i].length - 1]; j += 1) {
    if (planetRLE[i][index] === j) {
      flag = !flag
      index += 1
    }
    map[i].push((flag) ? { symbol: '\u00A0' } : { symbol: '·' })
    map[i][j].y = i
    map[i][j].x = j
    map[i][j].connected = false
    map[i][j].visible = false
  }
}
function insertMarkers() {
  Object.entries(markers).forEach((entry) => {
    const key = entry[0]
    const coords = entry[1]
    coords.forEach((coord) => {
      map[coord[0]][coord[1]].symbol = key
    })
  })
}
insertMarkers()

function validY(y) {
  return (y >= map.length || y < 0) ? false : y
}
function validX(x) {
  if (x >= map[0].length) {
    return x - map[0].length
  }
  if (x < 0) {
    return x + map[0].length - 1
  }
  return x
}
function drawMap() {
  for (let lat = 0; lat < map.length; lat += 1) {
    const row = document.createElement('p')
    row.setAttribute('class', 'latitude')
    row.setAttribute('id', lat)
    for (let lon = 0; lon < map[0].length; lon += 1) {
      row.innerHTML += map[lat][lon].symbol
    }
    planet.appendChild(row)
  }
}

const center = { x: 33, y: 33 }
function display(dx = 0) {
  const radius = 33 // 37
  const lats = planet.getElementsByTagName('p')
  for (let i = 0; i < map.length; i += 1) {
    let rowHTML = ''
    for (let j = 0; j < map.length; j += 1) {
      if (((i - center.x) ** 2) + ((j - center.y) ** 2) <= radius ** 2) {
        let x = explorer.x + dx - center.x + j
        let y = i
        x = validX(x)
        y = validY(y)
        let symbol = (map[y][x].visible) ? map[y][x].symbol : String.fromCharCode(178)
        // let symbol = (true) ? map[y][x].symbol : String.fromCharCode(178)
        symbol = (map[y][x].exp) ? explorer.symbol : symbol
        rowHTML += symbol
      } else {
        rowHTML += '\u00A0'
      }
    }
    lats[i].innerHTML = `${rowHTML}</span>`
  }
}

function reveal(long, lat, icon) {
  map[lat][long].visible = true
  for (let i = 0; i < 3; i += 1) {
    if (lat + i + 1 < map.length - 1 && lat - i - 1 >= 0) {
      map[lat + i + 1][long].visible = true
      map[lat - i - 1][long].visible = true
    }

    for (let j = 0; j < 3; j += 1) {
      let x = validX(long + j)
      map[lat - i][x].visible = true
      map[lat + i][x].visible = true

      x = validX(long - j)
      map[lat + i][x].visible = true
      map[lat - i][x].visible = true

      x = validX(long + j + 1)
      map[lat][x].visible = true

      x = validX(long - j - 1)
      map[lat][x].visible = true
    }
  }
  display()
}

function explorerUpdate() {
  getById('explorer-energy').innerHTML = `energy: ${explorer.energy}/${explorer.energyMax}`
  getById('explorer-droids').innerHTML = `droids: ${explorer.droids}/${explorer.droidsMax}`
}
function canMove() {
  if (explorer.energy > 0) {
    return true
  }
  return false
}
function initExplorer() {
  explorer.x = base.x
  explorer.y = base.y
  explorer.health = explorer.healthMax
  explorer.energy = 0
  explorer.droids = 0
  explorer.torpedos = 0
  explorer.rare = 0
  explorer.metals = 0
  explorer.active = false
}

function playerDead() {
  getById('build-explorer').className = 'btn active'
  map[explorer.y][explorer.x].exp = false
  planet.classList.toggle('fade')
  typist(messages.dead)
  initExplorer()
  updateAllPanels()
}

const network = { [`${base.y} ${base.x}`]: base }

function addToNetwork(tile) {
  network[`${tile.y} ${tile.x}`] = tile
}
function getNearestHub(tile) {
  let smallestDist
  let nearest = ''
  const keys = Object.keys(network)
  keys.forEach((key) => {
    if (network.hasOwnProperty(key)) {
      const dist = Math.sqrt(((network[key].x - tile.x) ** 2) + ((network[key].y - tile.y) ** 2))
      if (!smallestDist) {
        smallestDist = dist
        nearest = key
      } else {
        if (dist < smallestDist) {
          smallestDist = dist
          nearest = key
        }
      }
    }
  })
  return nearest
}
function connectToBase(tile, hub) {
  if ((tile.y === hub.y && tile.x === hub.x) || tile.symbol === '-'
    || tile.symbol === '|') {
    return true
  }
  if (tile.y < hub.y) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '|' : tile.symbol
    return connectToBase(map[tile.y + 1][tile.x], hub)
  }
  if (tile.y > hub.y) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '|' : tile.symbol
    return connectToBase(map[tile.y - 1][tile.x], hub)
  }
  if (tile.x < hub.x) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '-' : tile.symbol
    return connectToBase(map[tile.y][tile.x + 1], hub)
  }
  if (tile.x > hub.x) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '-' : tile.symbol
    return connectToBase(map[tile.y][tile.x - 1], hub)
  }
}
function energyMineEstablished(tile) {
  const hub = network[getNearestHub(tile)]
  connectToBase(tile, hub)
  addToNetwork(tile)
  display()
}
function energyMine(tile) {
  if (getById('load-droids').className === 'btn hidden') {
    getById('load-droids').className = 'btn active'
  }
  explorer.energy += 1
  if (!tile.connected) {
    eventMan.establishMine(tile, explorer, 'Energy', energyMineEstablished)
  }
}
function metalsMineEstablished(tile) {
  const hub = network[getNearestHub(tile)]
  connectToBase(tile, hub)
  addToNetwork(tile)
  display()
}
function metalsMine(tile) {
  explorer.energy += 1
  if (getById('load-droids').className === 'btn hidden') {
    getById('load-droids').className = 'btn active'
  }
  if (!tile.connected) {
    eventMan.establishMine(tile, explorer, 'Metals', metalsMineEstablished)
  }
}
function revealMap() {
  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[i].length; j += 1) {
      map[i][j].visible = true
    }
  }
  display()
}

function youWin() {
  // reveal map
  game.pause()
  game.over = true
  revealMap()
  setInterval(() => {
    explorer.x = validX(explorer.x - 1)
    for (let i = 0; i < map.length; i += 1) {
      if (map[i][explorer.x].symbol === 'H') {
        const tile = map[i][explorer.x]
        tile.symbol = '\u00A0'
        setTimeout(() => {
          tile.symbol = 'X'
          display(0)
        }, 50, tile)
      }
    }
    display(0)
  }, 500)
  eventMan.gameOver()
}
const beaconIndex = []
function initBeacon(tile) {
  const beaconNumber = beaconIndex.length
  if (beaconNumber === 1) {
    typist('first beacon in place, two more to go')
  } else if (beaconNumber === 2) {
    typist('second beacon in place, this will soon be over')
  }
  if (beaconNumber <= 2) {
    typist('beacon in place, this will soon be over')
    const beacon = document.getElementById(`beacon${beaconNumber + 1}`)
    beacon.textContent = 'online'
    beacon.classList.add('active')
    beaconIndex.push(beacon)
    connectToBase(tile, base)
    tile.symbol = 'O'
    display()
  }
  if (beaconNumber === 2) {
    game.on = false
    game.over = true
    youWin()
  }
}
function hiveFight(tile) {
  eventMan.loadEnemy(enemyHive, tile)
  eventMan.fight(tile, explorer)
  eventMan.enemy.interval = setInterval(eventMan.enemyAttack, eventMan.enemy.delay)
}
function randomFightSmall(tile) {
  eventMan.loadEnemy(enemySmall, tile)
  eventMan.fight(tile, explorer)
  eventMan.enemy.interval = setInterval(eventMan.enemyAttack, eventMan.enemy.delay)
}
function randomFightBig(tile) {
  eventMan.loadEnemy(enemyBig, tile)
  eventMan.fight(tile, explorer)
  eventMan.enemy.interval = setInterval(eventMan.enemyAttack, eventMan.enemy.delay)
}

function outpost(tile) {
  eventMan.loadEnemy(outpostEvent, tile)
  eventMan.displayLoot()
}

function unloadCargo() {
  base.rare = (explorer.rare) ? base.rare + explorer.rare : base.rare
  base.metals = (explorer.metals) ? base.metals + explorer.metals : base.metals
  explorer.cargo = 0
}

function tileAction(tile) {
  if (canMove()) {
    reveal(tile.x, tile.y, explorer.symbol)
    explorer.setDistance()
    explorer.energy -= 1
    explorerUpdate()
    switch (tile.symbol) {
      case 'S':
        explorer.active = false
        getById('deploy').className = 'btn active'
        map[base.y][base.x].symbol = base.symbol
        map[explorer.y][explorer.x].exp = false
        explorer.health = explorer.healthMax
        explorer.shield = explorer.shieldMax
        planet.classList.toggle('fade')
        unloadCargo()
        break
      case 'H':
        hiveFight(tile)
        break
      case 'E':
        energyMine(tile)
        break
      case 'M':
        metalsMine(tile)
        break
      case '-':
        explorer.energy += 1
        break
      case '|':
        explorer.energy += 1
        break
      case 'B':
        initBeacon(tile)
        break
      case 'X':
        outpost(tile)
        break
      default:
        if (Math.random() > 0.9 && explorer.distanceFromBase > 2) {
          if (explorer.distanceFromBase < 10) {
            randomFightSmall(tile)
          } else if (getById('upgrade-battery').className !== 'btn hidden') {
            randomFightBig(tile)
          }
        }
        break
    }
  } else {
    typist('explorer ran out of energy')
    playerDead()
  }
}

document.addEventListener('keydown', (e) => {
  if (explorer.active) {
    map[explorer.y][explorer.x].exp = false
    let dx = 0
    switch (e.keyCode) {
      case 38:
        explorer.y = validY(explorer.y - 1) || explorer.y
        break
      case 40:
        explorer.y = validY(explorer.y + 1) || explorer.y
        break
      case 37:
        explorer.x = validX(explorer.x - 1)
        dx -= 1
        break
      case 39:
        explorer.x = validX(explorer.x + 1)
        dx += 1
        break
      default:
        break
    }
    map[explorer.y][explorer.x].exp = true
    tileAction(map[explorer.y][explorer.x])
    display(dx)
  }
})

function updateAllPanels() {
  if (!game.over) {
    getById('resource-droids').innerHTML = `available droids: ${base.droids.idle}`
    getById('resource-metals').innerHTML = `metals: ${base.metals}`
    getById('resource-energy').innerHTML = `energy: ${base.energy}`
    getById('resource-rare').innerHTML = `rare metals: ${base.rare}`
    getById('explorer-droids').innerHTML = `droids: ${explorer.droids}/${explorer.droidsMax}`
    getById('explorer-energy').innerHTML = `energy: ${explorer.energy}/${explorer.energyMax}`
    getById('explorer-cargo').innerHTML = `cargo: ${explorer.metals
      + explorer.rare}/${explorer.cargoMax}`
  }
}

function offbase() {
  Object.keys(network).forEach((key) => {
    if (network[key].symbol === 'E') {
      base.energy += 1
    } else if (network[key].symbol === 'R') {
      base.rare += 1
    } else if (network[key].symbol === 'M') {
      base.metals += 1
    }
  })
  updateAllPanels()
}
updateAllPanels()
setInterval(() => {
  offbase()
}, 5000)
setInterval(() => {
  if (game.on) {
    if (base.droids.reactor) { wrBtn.click() }
    if (base.droids.extractor) { weBtn.click() }
  }
}, 10)

function cooldown(time, button, btnText, callback) {
  /* eslint-disable no-param-reassign, no-shadow, consistent-return */
  const fullTime = time;
  (function recursive(time, fullTime, button, btnText, callback) {
    if (time <= 0) {
      button.textContent = btnText
      const percentage = 0
      const linearGradient = `linear-gradient(to right, gray, gray ${percentage}%, transparent ${percentage}%)`

      button.style.backgroundImage = linearGradient
      button.style.opacity = '1'
      callback[0](...callback.slice(1))
      return time
    }
    const percentage = (time / fullTime) * 100
    const linearGradient = `linear-gradient(to right, rgba(0, 0, 0, 0.35) ${percentage}%, rgba(0, 0, 0, 0) ${percentage}%)`
    button.style.backgroundImage = linearGradient
    button.style.opacity = '0.5'
    setTimeout(() => recursive(time - 10, fullTime, button, btnText, callback), 10)
  }(time, fullTime, button, btnText, callback))
}

function buy(costs) {
  Object.keys(costs).forEach((key) => {
    base[key] -= costs[key]
    updateAllPanels()
  })
}

function canBuy(costs, droid = false) {
  let returnVal = true
  Object.keys(costs).forEach((key) => {
    if (costs[key] > base[key]) {
      returnVal = false
    }
  })
  if (returnVal) {
    buy(costs)
    return returnVal
  }
  typist('not enough resources')
  return returnVal
}

function restartReactor() {
  if (rrBtn.className === 'btn active') {
    rrBtn.classList.remove('active')
    cooldown(2000, rrBtn, 'reactor (online)', [showBtn, ['work-reactor', 'restart-extractor']])
    setTimeout(() => {
      messageStack = []
      callbackStack = []
      typist('reactor is online')
    }, 2000)
  }
}
function restartExtractor() {
  if (reBtn.className === 'btn active' && canBuy(reBtn.costs)) {
    reBtn.classList.remove('active')
    typist('extractor is online')
    cooldown(2000, reBtn, 'extractor (online)', [showBtn, ['work-extractor', 'droid-factory']])
  }
}
function restartFactory() {
  if (dfBtn.className === 'btn active' && canBuy(dfBtn.costs)) {
    dfBtn.classList.remove('active')
    typist('droid factory is online')
    cooldown(2000, dfBtn, 'factory (online)', [showBtn, 'work-droid'])
  }
}
function reactivate(btn) {
  btn.classList.add('active')
}
function workReactor() {
  if (getById('resources').className === "hideit hidden") {
    getById('resources').className = "hideit"
  }
  if (wrBtn.className === 'btn active') {
    wrBtn.classList.remove('active')
    cooldown(5000, wrBtn, 'work reactor', [reactivate, wrBtn])
    setTimeout(() => {
      base.energy += 1
      updateAllPanels()
    }, 5000)
  }
}
function workExtractor() {
  if (getById('resources').className === "hideit hidden") {
    getById('resources').className = "hideit"
  }
  if (weBtn.className === 'btn active') {
    weBtn.className = 'btn'
    cooldown(5000, weBtn, 'extract metals', [reactivate, weBtn])
    setTimeout(() => {
      base.metals += 1
      updateAllPanels()
    }, 5000)
  }
}
function buildDroid() {
  if (getById('droid-reactor').className === 'btn hidden') {
    getById('droid-reactor').className = 'btn active'
    getById('droid-extractor').className = 'btn active'
  }
  if (bdBtn.className === 'btn active' && canBuy(bdBtn.costs)) {
    bdBtn.className = 'btn'
    cooldown(10000, bdBtn, 'build droid', [reactivate, bdBtn])
    setTimeout(() => {
      base.droids.idle += 1
      updateAllPanels()
    }, 10000)
  }
}
function droidReactor() {
  if (deBtn.className === 'btn') {
    getById('explorer').classList.remove('hidden')
  }
  if (drBtn.className === 'btn active') {
    if (base.droids.idle) {
      drBtn.className = 'btn'
      base.droids.reactor = 1
      base.droids.idle -= 1
      updateAllPanels()
    } else {
      typist('need to build droids')
    }
  }
}
function droidExtractor() {
  if (drBtn.className === 'btn') {
    getById('explorer').classList.remove('hidden')
  }
  if (deBtn.className === 'btn active') {
    if (base.droids.idle) {
      deBtn.className = 'btn'
      base.droids.extractor = 1
      base.droids.idle -= 1
      updateAllPanels()
    } else {
      typist('need to build droids')
    }
  }
}
function buildExplorer() {
  if (getById('build-explorer').className === 'btn active') {
    getById('build-explorer').className = 'btn'
    cooldown(10000, beBtn, 'build explorer', [showBtn, ['deploy', 'load-energy']])
    explorer.alive = true
    getById('explorer-resources').classList.remove('hidden')
  }
}

function deploy() {
  if (getById('planet').className === 'planet hidden') {
    getById('planet').classList.remove('hidden')
    reveal(base.x, base.y, explorer.icon)
  }
  if (getById('deploy').className === 'btn active') {
    planet.classList.toggle('fade')
    explorer.active = true
    getById('deploy').classList.remove('active')
  }
}
function upgBattery() {
  if (ubBtn.className === 'btn active' && canBuy(ubBtn.costs)) {
    Object.keys(ubBtn.costs).forEach((key) => {
      ubBtn.costs[key] = Math.round((ubBtn.costs[key] ** 1.5) / 10) * 10
    })
    const value = [20, 50, 100]
    const cooldowns = [10000, 25000, 60000]
    const lvlRoman = ['II', 'III', '(max)']
    cooldown(cooldowns[upgBattery.level], ubBtn, `battery ${lvlRoman[upgBattery.level]}`, [() => {
      explorer.energyMax = value[upgBattery.level]
      upgBattery.level += 1
      updateAllPanels()
      ubBtn.classList.remove('active')
    }, ubBtn])
  }
}
upgBattery.level = 0

function upgShield() {
  if (usBtn.className === 'btn active' && canBuy(usBtn.costs)) {
    Object.keys(usBtn.costs).forEach((key) => {
      usBtn.costs[key] = Math.round((usBtn.costs[key] ** 1.2) / 10) * 10
    })
    const value = [5, 10, 15]
    const cooldowns = [10000, 25000, 60000]
    const lvlRoman = ['II', 'III', '(max)']
    cooldown(cooldowns[upgShield.level], usBtn, `shield ${lvlRoman[upgShield.level]}`, [() => {
      explorer.shieldMax = value[upgShield.level]
      explorer.shield = explorer.shieldMax
      upgShield.level += 1
      updateAllPanels()
      usBtn.classList.remove('active')
    }, usBtn])
  }
}
upgShield.level = 0

function upgWeapon() {
  if (uwBtn.className === 'btn active' && canBuy(uwBtn.costs)) {
    Object.keys(uwBtn.costs).forEach((key) => {
      uwBtn.costs[key] = Math.round((uwBtn.costs[key] ** 1.5) / 10) * 10
    })
    const cooldowns = [10000, 25000, 60000]
    const lvlRoman = ['II', 'III', '(max)']
    cooldown(cooldowns[upgWeapon.level], uwBtn, `weapon ${lvlRoman[upgWeapon.level]}`, [() => {
      upgWeapon.level += 1
      if (upgWeapon.level === 1) {
        explorer.slowdown = 'slow'
        explorer.slowdownSpeed = 1000
        explorer.slowdownIcon = '¤'
        uwBtn.classList.remove('active')
      } else if (upgWeapon.level === 2) {
        explorer.plasma = 10
        explorer.plasmaSpeed = 400
        explorer.plasmaIcon = 'o'
        uwBtn.classList.remove('active')
      } else if (upgWeapon.level === 3) {
        explorer.blocker = 'block'
        explorer.blockerSpeed = 2000
        explorer.blockerIcon = ')'
        uwBtn.classList.remove('active')
      }
    }, uwBtn])
  }
}
upgWeapon.level = 0

function energyExplorer() {
  if (base.energy && explorer.energy < explorer.energyMax
      && map[explorer.y][explorer.x].symbol === 'S') {
    const transferEnergy = Math.min((explorer.energyMax - explorer.energy), base.energy)
    explorer.energy += transferEnergy
    base.energy -= transferEnergy
  }
  updateAllPanels()
}
function droidsExplorer() {
  if ((base.droids.idle) && (explorer.droids < explorer.droidsMax)) {
    explorer.droids += 1
    base.droids.idle -= 1
  }
  updateAllPanels()
}

rrBtn.addEventListener('click', restartReactor)
reBtn.addEventListener('click', restartExtractor)
dfBtn.addEventListener('click', restartFactory)
wrBtn.addEventListener('click', workReactor)
weBtn.addEventListener('click', workExtractor)
bdBtn.addEventListener('click', buildDroid)
drBtn.addEventListener('click', droidReactor)
deBtn.addEventListener('click', droidExtractor)
beBtn.addEventListener('click', buildExplorer)
ubBtn.addEventListener('click', upgBattery)
usBtn.addEventListener('click', upgShield)
uwBtn.addEventListener('click', upgWeapon)
deployBtn.addEventListener('click', deploy)
eexBtn.addEventListener('click', energyExplorer)
dexBtn.addEventListener('click', droidsExplorer)

drawMap()
display()
