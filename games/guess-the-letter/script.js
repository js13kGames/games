import { playWonTune, playLooseTune, playBeep, playBeepBeep, mute, unmute } from './sound.js'

const ui = {
  startScreen: document.querySelector('.start-screen'),
  startButton: document.querySelector('.start-btn'),
  clearScore: document.querySelector('.clear-score'),
  clearMaxScore: document.querySelector('.clear-max-score'),
  playScreen: document.querySelector('.play-screen'),
  score: document.querySelector('.score'),
  maxScore: document.querySelector('.max-score'),
  progress: document.querySelector('progress'),
  char: document.querySelector('#char'),
  input: document.querySelector('input'),
  pause: document.querySelector('.pause-btn'),
  mute: document.querySelector('.mute-btn'),
  level: document.querySelector('.level span'),
  statsBtn: document.querySelector('.stats-btn'),
  stats: {
    modal: document.querySelector('dialog'),
    rounds: document.querySelector('#rounds'),
    right: document.querySelector('#right'),
    wrong: document.querySelector('#wrong'),
    avgTime: document.querySelector('#avg-time'),
    maxTime: document.querySelector('#max-time'),
    minTime: document.querySelector('#min-time'),
    graph: document.querySelector('#graph'),
  }
}

const MAX_SCORE = 'guess-the-letter-max-score'
const NUMBER_OF_LETTERS = 26

const state = {
  score: 0,
  char: '',
  interval: undefined,
  time: undefined,
  maxScore: Number(localStorage.getItem(MAX_SCORE)),
  muted: false,
  intervalDuration: 1000,
  rounds: 0,
  level: 1,
  maxTime: 5,
}

const stats = {
  ok: [],
  ko: [],
}

const startInterval = () => {
  state.interval = setInterval(async () => {
    state.time--
    state.rounds++
    if (state.level < 5 && state.rounds % 60 === 0) {
      state.level++
      ui.level.innerText = state.level
      state.intervalDuration -= 100
      document.documentElement.style.setProperty('--duration-blur-animation', state.intervalDuration * 6)
      clearInterval(state.interval)
      startInterval()
    }
    ui.progress.value = state.time
    playBeep()
    if (state.time === 0) {
        ui.char.className = 'no-blur'
        await playBeepBeep()
        setTimeout(startRound, 100)
    }
  }, state.intervalDuration)
}

const startTime = () => {
  clearInterval(state.interval)
  
  state.time = state.maxTime
  ui.progress.value = state.time
  
  startInterval()
}

const startRound = () => {
  const letterCode = Math.round(Math.random()*(NUMBER_OF_LETTERS -1)) + 65
  state.char = String.fromCharCode(letterCode)
  ui.char.textContent = state.char
  
  ui.char.className = ''
  window.requestAnimationFrame(() => {
    ui.char.className = 'animate-blur'
  })
  
  ui.input.value = ''
  
  ui.input.focus()
  
  startTime()
}

ui.startButton.addEventListener('click', () => {
  ui.startScreen.classList.add('slide-out')
  setMaxScore(state.maxScore)
  startRound()
})

ui.playScreen.addEventListener('animationend', () => {
  ui.playScreen.classList.remove('animate-success', 'animate-error')
})

ui.input.addEventListener('keydown', () => {
  ui.playScreen.classList.remove('animate-success', 'animate-error')
})

const setScore = (newScore) => {
  state.score = newScore
  ui.score.innerText = newScore
}

const setMaxScore = (newMaxScore) => {
  state.maxScore = newMaxScore
  localStorage.setItem(MAX_SCORE, newMaxScore)
  ui.maxScore.innerText = newMaxScore
}

const updatePoints = (guessed) => {
  const {char, time, level, intervalDuration} = state
  if (guessed) {
    stats.ok.push({
      char, 
      time, 
      level, 
      intervalDuration,
    })
    ui.playScreen.classList.add('animate-success')
    
    setScore(state.score + state.time)
    
    if (state.score > state.maxScore) {
      setMaxScore(state.score)
    }
    return playWonTune()
  } else {
    stats.ko.push({
      char, 
      time, 
      level, 
      intervalDuration,
    })
    ui.playScreen.classList.add('animate-error')
    
    setScore(state.score - (state.maxTime - state.time))
    
    return playLooseTune()
  }
}

ui.input.addEventListener('input', async (ev) => {
  const value = ev.data.toUpperCase()
  
  if (value.length > 1 || value < 'A' || value > 'Z') {
    ui.input.value = ''
    return
  } 
  
  ui.char.className = 'no-blur'

  clearInterval(state.interval)
  
  ui.input.value = value

  ui.input.disabled = true
  await updatePoints(value === state.char)
  ui.input.disabled = false
  
  startRound()
})

ui.clearMaxScore.addEventListener('click', () => {
  setMaxScore(0)
})

ui.clearScore.addEventListener('click', () => {
  setScore(0)
})

const pause = () => {
  if (state.interval) {
    clearInterval(state.interval)
    state.interval = undefined
    ui.pause.classList.add('active')
    ui.char.classList.add('paused')
  } else {
    startRound()
    ui.char.classList.remove('paused')
    ui.pause.classList.remove('active')
  }
}

ui.pause.addEventListener('click', pause)

ui.mute.addEventListener('click', () => {
  if (state.muted) {
    unmute()
    state.muted = false
    ui.mute.classList.remove('active')
  } else {
    mute()
    state.muted = true
    ui.mute.classList.add('active')
  }
})

const calculateStats = () => {
  const rounds = stats.ok.length + stats.ko.length
  const right = stats.ok.length
  const wrong = stats.ko.length
  const okAndKo = stats.ok.concat(stats.ko)
  const times = okAndKo.map((item) => (state.maxTime - item.time) * item.intervalDuration)
  const totalTime = times.reduce((tot, time) => tot + time, 0) 
  const avgTime = totalTime > 0 ? Math.round(totalTime / rounds) : 0
  const maxTime = times.length ? Math.max(...times) : '-'
  const minTime = times.length ? Math.min(...times) : '-'
  const chars = new Array(NUMBER_OF_LETTERS).fill(undefined).map((_, index) => String.fromCharCode(65 + index))
  const charsStats = chars.map(char => ({
    char,
    shown: okAndKo.filter(item => item.char === char).length,
    guessed: stats.ok.filter(item => item.char === char).length,
    notGuessed: stats.ko.filter(item => item.char === char).length,
  })).map(stats => ({
    ...stats, 
    guessRate: stats.shown > 0 ? stats.guessed / stats.shown * 100 : -1,
  }))//.sort((a, b) => b.guessRate - a.guessRate)

  ui.stats.rounds.innerText = rounds
  ui.stats.right.innerText = right
  ui.stats.wrong.innerText = wrong
  ui.stats.avgTime.innerText = avgTime
  ui.stats.maxTime.innerText = maxTime
  ui.stats.minTime.innerText = minTime

  const charsStatsToShow = charsStats//.filter(({guessRate}) => guessRate > -1)
  
  ui.stats.graph.innerHTML = charsStatsToShow.map(({char}) => `
    <div class="char-stat">
      <div class="char-stat_bar">
        <div class="char-stat_bar_ok"></div>
        <div class="char-stat_bar_ko"></div>
      </div>
      <div class="char-stat_label">${char}</div>
    </div>
  `).join('')

   window.requestAnimationFrame(() => {
    Array.from(document.querySelectorAll('.char-stat_bar')).forEach((bar, index) => {
      const okBar = bar.querySelector('.char-stat_bar_ok')
      const koBar = bar.querySelector('.char-stat_bar_ko')
      const {guessRate} = charsStatsToShow[index]
      const okPerc = guessRate > -1 ? guessRate : 0
      const koPerc = guessRate > -1 ? 100 - guessRate : 0
      okBar.style.flex = `${okPerc}%`
      koBar.style.flex = `${koPerc}%`
      if (okPerc === 0) {
        okBar.style.display = 'none'
      }
      if (koPerc === 0) {
        koBar.style.display = 'none'
      }
    })
  })
}

ui.statsBtn.addEventListener('click', () => {
  pause()
  calculateStats()
  ui.stats.modal.showModal()
})
