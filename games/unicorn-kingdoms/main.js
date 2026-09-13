/* main.js */

const content = document.getElementById('content')
const hud = document.getElementById('hud')
const fade = document.getElementById('fade')

const SAVE_KEY = 'unicorn-kingdoms'

const state = {
  name: 'START',
  player: { x: 0, y: 0 },
  completed: 0,
  kingdom: 1,
  rainbows: 0,
  totalRainbows: 0,
  activePoi: -1,
  activeEncounter: null,
  selected: -1,
  busy: false,
  seconds: 0,
  board: [],
  matching: [],
  removing: [],
  unicornsCleared: 0,
  rainbowsCollected: 0,
  hint: [],
  timer: 0,
}

const settings = {
  sound: true,
  music: true,
  hints: true,
  soundVolume: .7,
  musicVolume: .35,
}

const WIDTH = 7
const HEIGHT = 7

const terrainTemplate = [
  ['🌲', '🌲', '·', '·', '🌲', '🌲', '⛰️'],
  ['🌲', '·', '·', '🌾', '·', '·', '⛰️'],
  ['🌊', '🌊', '·', '🌾', '·', '🌾', '·'],
  ['🌊', '·', '·', '🌾', '·', '·', '·'],
  ['🌊', '·', '🌾', '🌾', '·', '🌲', '🌲'],
  ['·', '·', '·', '🌾', '·', '·', '🌲'],
  ['·', '⛰️', '·', '·', '·', '·', '·']
]

let terrain = terrainTemplate.map(row => row.slice())

let pois = [
  { x: 2, y: 1, name: 'Whispering Woods', target: 3, icon: '🌳', rainbows: 0 },
  { x: 5, y: 3, name: 'Moonlit Vale', target: 6, icon: '🌙', rainbows: 0 },
  { x: 2, y: 5, name: 'Unicorn Citadel', target: 10, icon: '🏰', rainbows: 0 }
]

const encounters = [
  { name: 'Wandering Sorcerer', icon: '🧙', target: 3 },
  { name: 'Bog Goblin', icon: '👹', target: 3 },
  { name: 'Traveling Trickster', icon: '🦹', target: 3 }
]

const MATCH_SECONDS = 60,
      BOARD_SIZE = 6,
      gems = ['🔴', '🔵', '🟢', '🟣', '🟡', '🦄', '🌈']

let audio,
    musicTimer = 0,
    musicStep = 0

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1,
      state: {
        player: state.player,
        completed: state.completed,
        totalRainbows: state.totalRainbows,
        kingdom: state.kingdom,
      },
      terrain,
      pois,
      settings,
    }))

  } catch (_) {}
}

function loadGame() {
  try {
    const save = JSON.parse(localStorage.getItem(SAVE_KEY))
    if (!save || save.version !== 1) return
    
    Object.assign(state, save.state || {})
    
    if (save.terrain) terrain = save.terrain
    if (save.pois) pois = save.pois

    Object.assign(settings, save.settings || {})
  } catch (e) {}
}

function resetGame() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch (e) {}

  location.reload()
}

function hasSave() {
  try {
    const save = JSON.parse(localStorage.getItem(SAVE_KEY))
    return !!(save && save.version === 1)

  } catch (e) {
    return false
  }
}

function startNewGame(render = true) {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch (e) {}
  
  terrain = terrainTemplate.map(row => row.slice())

  pois = [
    { x: 2, y: 1, name: 'Whispering Woods', target: 3, icon: '🌳', rainbows: 0 },
    { x: 5, y: 3, name: 'Moonlit Vale', target: 6, icon: '🌙', rainbows: 0 },
    { x: 2, y: 5, name: 'Unicorn Citadel', target: 10, icon: '🏰', rainbows: 0 },
  ]

  Object.assign(state, {
    player: { x: 1, y: 1 },
    completed: 0,
    totalRainbows: 0,
    kingdom: 1,
    board: [],
    selected: -1,
    matching: [],
    removing: [],
    activePoi: -1,
    activeEncounter: null,
  })

  if (render) renderOverworld()
}

function setHud() {
  if (state.name === 'MATCH') {
    const match = state.activeEncounter || pois[state.activePoi]
    const prefix = state.activeEncounter ? '⚔️ Encounter' : '🦄 Location'
    hud.innerHTML = `<span>${prefix}: ${match.name} · Clear <strong>${match.target} unicorns</strong></span><span>TIME <strong>${state.seconds}s</strong> · 🦄 <strong>${state.unicornsCleared}/${match.target}</strong> · 🌈 <strong>${state.rainbowsCollected}</strong></span>`

  } else if (state.name === 'OVERWORLD') {
    const next = nextPoi()

    hud.innerHTML = `<span>🗺️  Kingdom <strong>${state.kingdom}</strong> · 🌈 Total: <strong>${state.totalRainbows}</strong></span>
      <span>${next ? `Next: <strong>${next.name}</strong> (${next.target} 🦄)` : '<strong>Kingdom complete! 🎉</strong>'}</span>`

  } else {
    hud.innerHTML = ''
  }

  hud.classList.toggle('hidden', !['MATCH', 'OVERWORLD'].includes(state.name))
}


function panel(title, text, buttons, className = '') {
  content.innerHTML = `
    <div id="screen" class="title-screen ${className}">
      <h1><span>${title}</span></h1>
      <p>${text}</p>
      <div class="button-row">
        ${buttons.map(button => `
          <button class="action" data-action="${button.action}">
            ${button.label}
          </button>`).join('')}
      </div>
    </div>`

  content.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => { wakeAudio(); sound('click'); handleAction(button.dataset.action) })
  })
}

function showStart() {
  state.name = 'START'

  panel('🦄 UNICORN KINGDOMS', 'Restore the 5 Kingdoms by visiting each named location, saving Unicorns and collecting rainbows.', [
    { action: 'MENU', label: 'Continue' }
  ], 'start-screen')

  setHud()
}

function showMenu() {
  state.name = 'MENU'
  
  const buttons = [
    { action: 'START-GAME', label: 'Start Game' },
  ]

  if (hasSave()) buttons.push({ action: 'CONTINUE-GAME', label: 'Continue Game' })

  buttons.push(
    { action: 'ABOUT', label: 'About' },
    { action: 'SETTINGS', label: 'Settings' },
  )

  
  panel('🦄 UNICORN KINGDOMS', 'Choose your adventure and save the Kingdoms!', buttons, 'menu-screen')
  setHud()
}

function showSettings() {
  state.name = 'SETTINGS'

  content.innerHTML = `<div id="screen" class="title-screen settings-screen">
    <h1><span>🦄 UNICORN KINGDOMS</span></h1>
    <h2>SETTINGS</h2>
    <p>Adjust sound, music, and match hints.</p>
    <p><label><input id="hint-toggle" type="checkbox" ${settings.hints ? 'checked' : ''}> Show hints</label></p>
    <p><label><input id="sound-toggle" type="checkbox" ${settings.sound ? 'checked' : ''}> Sound effects</label><input id="sound-volume" type="range" min="0" max="100" value="${settings.soundVolume * 100}"></p>
    <p><label><input id="music-toggle" type="checkbox" ${settings.music ? 'checked' : ''}> Music</label><input id="music-volume" type="range" min="0" max="100" value="${settings.musicVolume * 100}"></p>
    <div class="button-row">
      <button class="action" data-action="MENU">Back to Menu</button>
      <button class="action" data-action="CLEAR-SAVE">Clear Save Data</button>
    </div>
  </div>`
  
  setTimeout(() => {
    ['hint-toggle','sound-toggle','music-toggle','sound-volume','music-volume'].forEach(
      id => content.querySelector('#' + id).onchange =
      content.querySelector('#' + id).oninput =
      event => {
        const key = id === 'hint-toggle' ? 'hints' : id.replace('-toggle','').replace('-volume','Volume')
        settings[key] = id.includes('volume') ? event.target.value / 100 : event.target.checked
        saveGame()
      }
    )
  }, 0)

  content.querySelector('[data-action="MENU"]').onclick = showMenu
  content.querySelector('[data-action="CLEAR-SAVE"]').onclick = resetGame
  setHud()
}

function showAbout() {
  state.name = 'ABOUT'

  content.innerHTML = `<div id="screen" class="title-screen about-screen">
    <h1><span>🦄 UNICORN KINGDOMS</span></h1>
    <h2>ABOUT</h2>
    <p>Unicorn Kingdoms is a js13k 2026 entry.</p>
    <h2 style="margin-top: 1rem;">HOW TO PLAY</h2>
    <p>Move with the arrow keys, WASD, or click neighbouring locations. Visit the glowing locations in order and clear their match-3 challenges. In a match, select two adjacent gems to swap them and make lines of three or more. Clear unicorns to complete the location; rainbows add to your haul, and matches can add time. If time runs out or there are no moves left, try again. Optional hints show an available move after a short pause.</p><br><p>Save 5 Kingdoms to beat the game!</p>
    <div class="button-row">
      <button class="action" data-action="MENU">Back to Menu</button>
    </div>
  </div>`

  content.querySelector('[data-action="MENU"]').addEventListener('click', showMenu)
  setHud()
}

function showGameOver() {
  state.name = 'GAMEOVER'
  state.busy = false

  panel('🏆 KINGDOMS SAVED!', 'You have saved the five Unicorn Kingdoms!', [
    { action: 'RETURN-MENU', label: 'Return to Main Menu' }
  ], 'gameover-screen')

  setHud()
}

function handleAction(action) {
  if (action === 'MENU') showMenu()
  if (action === 'ABOUT') showAbout()
  if (action === 'SETTINGS') showSettings()
  if (action === 'START-GAME') {
    state.name = 'OVERWORLD'
    state.player.x = 0
    state.player.y = 0
    state.completed = 0
    state.rainbows = 0
    renderOverworld()
  }
  if (action === 'CONTINUE-GAME') renderOverworld()
  if (action === 'RETURN-MENU') {
    try {
      localStorage.removeItem(SAVE_KEY)
    } catch (e) {}

    startNewGame(false)
    showMenu()
  }
}

function nextPoi() {
  return state.completed < pois.length ? pois[state.completed] : null
}

function poiAt(x, y) {
  return pois.findIndex(poi => poi.x === x && poi.y === y)
}

function isBlocked(x, y) {
  return terrain[y][x] === '🌊' || terrain[y][x] === '⛰️'
}

function newTerrain() {
  const tiles = terrainTemplate.flat()
 
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ; // TODO: re-check prevent j use before assignment
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
 
  const safe = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]
  safe.forEach(([x, y]) => { tiles[y * WIDTH + x] = '·' })
 
  terrain = Array.from({ length: HEIGHT }, (_, y) => tiles.slice(y * WIDTH, (y + 1) * WIDTH))
}

function newKingdom() {
  const names = [['Dawnreach', '🌅'], ['Starfall', '🌠'], ['Cloudmere', '☁️'], ['Sunspire', '☀️'], ['Dreamvale', '💫']]
 
  newTerrain()
 
  const pool = []
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (!isBlocked(x, y) && (x !== 1 || y !== 1)) {
        pool.push([x, y])
      }
    }
  }

  pool.sort(() => Math.random() - .5)
  
  const [realm, realmIcon] = names[(state.kingdom - 1) % names.length]
  const icons = ['🌳', '🌙', '🏰']
  const difficulty = (state.kingdom - 1) * 3

  pois = [3, 6, 10].map((target, index) => ({
    x: pool[index][0],
    y: pool[index][1],
    name: `${realm} ${['Grove', 'Vale', 'Citadel'][index]}`,
    target: target + difficulty,
    icon: index === 2 ? '🏰' : icons[index],
    rainbows: 0
  }))

  state.completed = 0
  state.player.x = 1
  state.player.y = 1

  return `${realmIcon} Kingdom ${state.kingdom}: ${realm} has appeared!`
}

function move(direction) {
  if (state.name !== 'OVERWORLD') return

  const delta = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  }[direction]

  moveTo(`${state.player.x + delta[0]},${state.player.y + delta[1]}`)
  wakeAudio()
  sound('click')
}

function moveTo(value) {
  if (state.name !== 'OVERWORLD') return

  const [x, y] = value.split(',').map(Number)
  if (Math.abs(x - state.player.x) + Math.abs(y - state.player.y) !== 1) return
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT || isBlocked(x, y)) return
  
  state.player.x = x
  state.player.y = y

  saveGame()

  const index = poiAt(x, y)
  if (index === state.completed) {
    console.log(`START MATCH AT ${pois[index].name}`)
    beginMatch(index)

  } else if (index < 0 && Math.random() < .18) {
    console.log(`START ENCOUNTER WITH ${ encounters[Math.floor(Math.random() * encounters.length)].name }`)
    beginEncounter()

  } else {
    renderOverworld()
  }
}

function selectCell(index) {
  if (state.name !== 'MATCH' || state.busy) return
 
  resetHintTimer()
 
  if (state.selected < 0) {
    state.selected = index
    renderMatch()
    return
  }
 
  const a = state.selected,
        ax = a % BOARD_SIZE,
        ay = Math.floor(a / BOARD_SIZE),
        bx = index % BOARD_SIZE,
        by = Math.floor(index / BOARD_SIZE)
 
  if (Math.abs(ax - bx) + Math.abs(ay - by) !== 1) {
    state.selected = index
    renderMatch()
    return
  }
 
  // swap gems
  [state.board[a], state.board[index]] = [state.board[index], state.board[a]]
  state.selected = -1
   
  if (!findMatches(state.board).size) {
    [state.board[a], state.board[index]] = [state.board[index], state.board[a]]
   
    if (!hasValidMove()) {
      finishMatch(false, 'NO MOVES!')

    } else {
      renderMatch('That swap made no match. Try another pair.')
    }

    return
  }

  state.busy = true
  renderMatch()
  resolveBoardAnimated().then(() => {
    if (state.name !== 'MATCH') return

    state.matching = []
    state.removing = []

    const target = (state.activeEncounter || pois[state.activePoi]).target

    if (state.unicornsCleared >= target) {
      finishMatch(true)

    } else {
      state.busy = false
      renderMatch(`Progress: ${state.unicornsCleared} / ${target} unicorns`)
    }

    if (state.name === 'MATCH' && !state.busy && !hasValidMove()) {
      finishMatch(false, 'NO MOVES!')
    }
  })
}

function finishMatch(success, failure = 'MISSED!') {
  stopTimer()
  stopHintTimer()
  stopMusic()

  state.busy = true
  
  sound(success ? 'success' : 'failure')
  
  const poi = pois[state.activePoi]
  const encounter = state.activeEncounter
  
  let message = success ?
                  encounter ? `ENCOUNTER CLEARED! ${state.rainbowsCollected} 🌈 added to your haul.`
                            : `CLEARED! ${state.rainbowsCollected} 🌈 collected. The next location is unlocked.`
                        : `${failure} Try this ${encounter ? 'encounter' : 'location'} again.`
  
  if (success) {
    if (encounter) {
      state.totalRainbows += state.rainbowsCollected

    } else {
      state.completed = Math.max(state.completed, state.activePoi + 1)
      poi.rainbows = state.rainbowsCollected
      state.totalRainbows += state.rainbowsCollected

      if (state.completed === pois.length) {
        state.kingdom++

        if (state.kingdom > 5) {
          showGameOver()
          return
        }

        message = newKingdom()
      }
    }

    saveGame()
  }
  
  state.name = 'RESULT'
  content.innerHTML = `<div id="screen" class="result-${success ? 'success' : 'failure'}">
    <h1>${success ? '✨ CLEARED! ✨' : `💨 ${failure}`}</h1>
    <p>${message}</p>
  </div>`
  
  setTimeout(() => transitionToOverworld(message), 1200)
}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function resolveBoardAnimated() {
  let matches

  while ((matches = findMatches(state.board)).size) {
    const indexes = [...matches]

    addMatchTime(matches)
    sound(indexes.some(index => state.board[index] === '🦄') ? 'unicorn' : indexes.some(index => state.board[index] === '🌈') ? 'rainbow' : 'match')
    
    indexes.forEach(index => {
      if (state.board[index] === '🦄') {
        state.unicornsCleared++
      }
      
      if (state.board[index] === '🌈') {
        state.rainbowsCollected++
      }
    })

    state.matching = indexes
    renderMatch(`Match! 🦄 ${state.unicornsCleared}`)
    await wait(180)

    if (state.name !== 'MATCH') return
    state.removing = indexes
    state.matching = []
    renderMatch(`Clearing! 🦄 ${state.unicornsCleared}`)
    await wait(180)

    if (state.name !== 'MATCH') return
    indexes.forEach(index => {
      state.board[index] = null
    })

    for (let x = 0; x < BOARD_SIZE; x++) {
      const column = []

      for (let y = BOARD_SIZE - 1; y >= 0; y--) {
        if (state.board[y * BOARD_SIZE + x]) column.push(state.board[y * BOARD_SIZE + x])
      }

      for (let y = BOARD_SIZE - 1; y >= 0; y--) {
        state.board[y * BOARD_SIZE + x] = column[BOARD_SIZE - 1 - y] || randomGem()
      }
    }

    state.removing = []
    renderMatch(`Progress: ${state.unicornsCleared}`)
    await wait(120)
  }
}

function addMatchTime(matches) {
  let bonus = 5

  if ([...matches].some(index => state.board[index] === '🌈')) bonus = 10
  if ([...matches].some(index => state.board[index] === '🦄')) bonus = 15

  state.seconds += bonus
}

function hasValidMove() {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const index = y * BOARD_SIZE + x

      for (const other of [index + 1, index + BOARD_SIZE]) {
        if (other >= state.board.length ||
            (other === index + 1 && x === BOARD_SIZE - 1)) {
          continue
        }

        const first = state.board[index]
        state.board[index] = state.board[other]
        state.board[other] = first

        const valid = findMatches(state.board).size > 0

        const second = state.board[index]
        state.board[index] = state.board[other]
        state.board[other] = second

        if (valid) return true
      }
    }
  }

  return false
}

function findHint() {
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const index = y * BOARD_SIZE + x;
      
      for (const other of [index + 1, index + BOARD_SIZE]) {
        if (other >= state.board.length || (other === index + 1 && x === BOARD_SIZE - 1)) continue
        
        [state.board[index], state.board[other]] = [state.board[other], state.board[index]]
        
        const valid = findMatches(state.board).size > 0
        ;
        
        [state.board[index], state.board[other]] = [state.board[other], state.board[index]]

        if (valid) return [index, other]
      }
    }
  }

  return []
}

function resetHintTimer() {
  if (state.hintTimer) clearTimeout(state.hintTimer)
  state.hintTimer = 0
  state.hint = []

  if (state.name === 'MATCH' && settings.hints && !state.busy) state.hintTimer = setTimeout(showHint, 15000)
}

function showHint() {
  state.hintTimer = 0
  if (state.name !== 'MATCH' || state.busy || !settings.hints) return
  
  state.hint = findHint()
  renderMatch('Hint: try the glowing pair.')

  setTimeout(() => {
    state.hint = []
    if (state.name === 'MATCH') renderMatch()
    resetHintTimer()
  }, 2200)
}

function stopHintTimer() {
  if (state.hintTimer) clearTimeout(state.hintTimer)
  state.hintTimer = 0
  state.hint = []
}


function randomGem() {
  return gems[Math.floor(Math.random() * gems.length)]
}

function findMatches(board) {
  const matched = new Set()

  for (let y = 0; y < BOARD_SIZE; y++) {
    let start = 0

    for (let x = 1; x <= BOARD_SIZE; x++) {
      if (x === BOARD_SIZE || board[y * BOARD_SIZE + x] !== board[y * BOARD_SIZE + start]) {
        if (x - start >= 3) for (let i = start; i < x; i++) matched.add(y * BOARD_SIZE + i)
        start = x
      }
    }
  }
  for (let x = 0; x < BOARD_SIZE; x++) {
    let start = 0

    for (let y = 1; y <= BOARD_SIZE; y++) {
      if (y === BOARD_SIZE || board[y * BOARD_SIZE + x] !== board[start * BOARD_SIZE + x]) {
        if (y - start >= 3) for (let i = start; i < y; i++) matched.add(i * BOARD_SIZE + x)
        start = y
      }
    }
  }
  return matched
}


function renderMatch(message = '') {
  const match = state.activeEncounter || pois[state.activePoi]
  const prefix = state.activeEncounter ? `${match.icon} Encounter: ` : `${match.icon} `

  let cells = ''

  state.board.forEach((gem, index) => {
    const hint = state.hint.includes(index) ? ' hint' : '', matching = state.matching.includes(index) ? ' matching' : '',
    removing = state.removing.includes(index) ? ' removing' : ''
    
    cells += `<button class="gem${state.selected === index ? ' selected' : ''}${hint}${matching}${removing}" data-cell="${index}" ${state.busy ? 'disabled' : ''}>${gem || ''}</button>`
  })

  content.innerHTML = `<div id="match">
    <h2>${prefix}${match.name}</h2>
    <p>Swap adjacent gems to clear <strong>${match.target} unicorns</strong>!</p>
    <div id="board" aria-label="Gem matching board">${cells}</div>
    <div id="status">${message || `🦄 ${state.unicornsCleared} / ${match.target} · 🌈 ${state.rainbowsCollected} this attempt`}</div>
    <button class="action" data-action="LEAVE-MATCH" ${state.busy ? 'disabled' : ''}>Return to Map</button>
  </div>`

  content.querySelectorAll('[data-cell]').forEach(button => button.addEventListener('click', () => {
    wakeAudio()
    sound('click')
    selectCell(Number(button.dataset.cell))
  }))

  content.querySelector('[data-action="LEAVE-MATCH"]').addEventListener('click', () => {
    wakeAudio()
    sound('click')
    transitionToOverworld('You left the match.')
  })

  setHud()
}

function startTimer() {
  stopTimer()

  state.timer = setInterval(() => {
    if (state.name !== 'MATCH') return
    
    state.seconds--
    setHud()

    if (state.seconds <= 0) finishMatch(false)
  }, 1000)
}

function stopTimer() {
  if (state.timer) {
    clearInterval(state.timer)
    state.timer = 0
  }
}

function transition(callback) {
  fade.classList.add('active')

  setTimeout(() => {
    callback()
    setTimeout(() => fade.classList.remove('active'), 40)
  }, 240)
}

function transitionToOverworld(message) {
  stopTimer()
  stopHintTimer()

  state.busy = true
  
  transition(() => {
    state.busy = false
    renderOverworld(message)
    //startMusic()
  })
}

function createCleanBoard() {
  let board

  do {
    board = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, randomGem)
  } while (findMatches(board).size)
  
  return board
}

function beginMatch(index) {
  if (state.busy || index !== state.completed) return

  state.busy = true
  state.activePoi = index
  state.activeEncounter = null
  state.selected = -1
  state.matching = []
  state.removing = []
  state.unicornsCleared = 0
  state.rainbowsCollected = 0

  transition(() => {
    state.board = createCleanBoard()
    state.seconds = MATCH_SECONDS
    state.busy = false
    state.name = 'MATCH'

    renderMatch()
    startTimer()
    resetHintTimer()
  })
}
function beginEncounter() {
  if (state.busy) return
  wakeAudio()
  sound('encounter')
  
  state.busy = true
  state.activePoi = -1
  state.activeEncounter = encounters[Math.floor(Math.random() * encounters.length)]
  state.selected = -1
  state.matching = []
  state.removing = []
  state.unicornsCleared = 0
  state.rainbowsCollected = 0

  transition(() => {
    state.board = createCleanBoard()
    state.seconds = MATCH_SECONDS
    state.busy = false
    state.name = 'MATCH'

    renderMatch()
    startTimer()
    resetHintTimer()
  })
}

function renderOverworld(message = '') {
  state.name = 'OVERWORLD'
 
  let map = ''
 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const index = poiAt(x, y),
            poi = index >= 0 ? pois[index] : null

      let icon = terrain[y][x], classes = 'tile'
  
      if (poi) {
        icon = index < state.completed ? '✅' : index === state.completed ? poi.icon : '🔒'
        classes += ' poi'
      }
  
      if (x === state.player.x && y === state.player.y) {
        icon = '🦄'
        classes += ' player'
      }
  
      if (!isBlocked(x, y)) {
        classes += ' path'
      }

      const blocked = isBlocked(x, y)
      const label = poi ? `${poi.name}${index < state.completed ? ` · ${poi.rainbows} 🌈` : ''}` : blocked ? 'Blocked terrain' : ''
      map += `<button class="${classes}" data-cell="${x},${y}" ${ label != '' ? `title="${label}"` : '' } ${blocked ? 'disabled' : ''}>${icon}</button>`
    }
  }

  const next = nextPoi()
  const records = pois.filter((poi, index) => index < state.completed).map(poi => `${poi.name}: ${poi.rainbows} 🌈`).join(' · ')

  const addControls = false
  const controls = addControls ? `
    <div class="controls" aria-label="Map movement">
      <button class="direction" data-move="up">▲</button>
      <button class="direction" data-move="left">◀</button>
      <button class="direction" data-move="down">▼</button>
      <button class="direction" data-move="right">▶</button>
    </div>` : ''

  content.innerHTML = `<div id="map-wrap">
    <h2>✨ Unicorn Kingdoms ✨</h2>
    <p>${message || (next ? `Travel to ${next.name} ${next.icon} and clear ${next.target} unicorns.` : 'Every kingdom has been restored!')}</p>
    <div id="map">${map}</div>
    ${controls}
    ${records ? `<p>Completed rainbow haul: ${records}</p>` : ''}
    <p>Use Arrow keys, WASD, or click a neighboring cell to travel.</p>
  </div>`

  content.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => {
    wakeAudio()
    sound('click')
    move(button.dataset.move)
  }))

  content.querySelectorAll('[data-cell]').forEach(button => button.addEventListener('click', () => {
    wakeAudio()
    sound('click')
    moveTo(button.dataset.cell)
  }))

  setHud()
}

function wakeAudio() {
  if (!audio) {
    const Audio = window.AudioContext || window.webkitAudioContext
    if (Audio) audio = new Audio()
  }

  if (audio && audio.state === 'suspended') {
    audio.resume()
  }

  if (audio && !musicTimer) {
    startMusic()
  }
}

function tone(frequency, length = .08, delay = 0, wave = 'sine', volume = .035) {
  if (!audio) return

  const start = audio.currentTime + delay,
        oscillator = audio.createOscillator(),
        gain = audio.createGain()

  oscillator.type = wave
  oscillator.frequency.value = frequency
  
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(.001, start + length)

  oscillator.connect(gain).connect(audio.destination)
  
  oscillator.start(start)
  oscillator.stop(start + length)
}

function sound(kind) {
  if (!audio || !settings.sound) return

  const notes = {
    click: [[440, .05]], select: [[620, .06]],
    swap: [[260, .06], [390, .07, .05]],
    match: [[330, .08], [494, .1, .06]],
    rainbow: [[523, .1], [784, .12, .07]],
    unicorn: [[392, .1], [659, .12, .07], [988, .16, .14]],
    encounter: [[180, .12], [240, .14, .1]],
    success: [[523, .12], [659, .12, .1], [784, .2, .2]],
    failure: [[260, .15], [180, .2, .12]],
  }[kind]
  
  if (notes) {
    notes.forEach(note => {
      tone(note[0], note[1], note[2], kind === 'failure' ? 'sawtooth' : 'sine', (kind === 'success' ? .045 : .035) * settings.soundVolume)
    })
  }
}

function startMusic() {
  if (!audio || musicTimer) return;

  const notes = [196, 247, 294, 247, 220, 262, 330, 262];

  musicTimer = setInterval(() => {
    if (state.name !== 'RESULT' && settings.music) {
      tone(notes[musicStep++ % notes.length], .24, 0, 'triangle', .012 * settings.musicVolume)
    }
  }, 700)
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer)
    musicTimer = 0
  }
}


window.addEventListener('keydown', event => {
  if (state.name === 'START') {
    showMenu()
    return
  }
  
  if (state.name !== 'OVERWORLD') return
  
  const key = event.key.toLowerCase(),
        direction = {
          arrowup: 'up',
          w: 'up',
          arrowdown: 'down',
          s: 'down',
          arrowleft: 'left',
          a: 'left',
          arrowright: 'right',
          d: 'right'
        }[key]
      
  if (direction) {
    event.preventDefault()
    move(direction)
  }
})

window.addEventListener('pointerdown', event => {
  if (state.name === 'START' && !event.target.closest('button')) {
    showMenu()
  }
})

window.addEventListener('load', () => {
  loadGame()
  showStart()
})
