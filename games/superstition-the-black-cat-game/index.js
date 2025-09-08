import { playWooshSound, playWonTune, playLooseTune, playBeepBeep } from './audio.js'

let MIN_DURATION = 1800
const ANIMATION_DURATION = 125
const THRESHOLD = 0.20
const LIVES_PER_LEVEL = 7
const DELTA_LEVEL_DURATION = 200
const DELTA_LEVEL_INTERVAL = 20
let MIN_INTERVAL = 50
let duration
let interval
let lives
let screamed
let level
let selectedCat
let waitSound = Promise.resolve()

const sides = ['left', 'top-left', 'top-right', 'right', 'bottom-left', 'bottom-right']
const cats = ['black', 'black', 'black', 'black', 'black', 'white', 'striped', 'spotted', 'red', 'grey', 'grey-striped', 'purple']

const selectRandom = arr => arr[Math.round(Math.random() * (arr.length - 1))]

const queue = (duration, fn) => new Promise((res) => { setTimeout(() => res(fn()), duration) })

const showCat = (delay = ANIMATION_DURATION + interval) => {
    catWrapperEl.querySelector('svg')?.classList.remove('in')

    queue(delay, async () => {
        if (selectedCat === 'black' && !screamed) {
            lives--
            await Promise.all([playLooseTune(), checkPoint()])
        } else {
            await waitSound
        }
        screamed = false

        if (lives > 0) {
            catWrapperEl.innerHTML = '';

            selectedCat = selectRandom(cats)

            const clone = template.content.cloneNode(true);
            catWrapperEl.classList = selectRandom(sides)
            clone.querySelector('svg').classList = `cat ${selectedCat}`;

            catWrapperEl.appendChild(clone);

            await queue(0, () => {
                catWrapperEl.querySelector('svg').classList.add('in')
                playWooshSound(ANIMATION_DURATION * 2 / 1000)
            })

            const wait = Math.max(0, MIN_DURATION, Math.random() * duration)
            await queue(wait, showCat)
        }
    })
}

const listenUser = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new AudioContext()
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream)
    const analyserNode = audioContext.createAnalyser()
    mediaStreamAudioSourceNode.connect(analyserNode)

    const onFrame = () => {
        const pcmData = new Float32Array(analyserNode.fftSize)
        analyserNode.getFloatTimeDomainData(pcmData)
        let sumSquares = 0.0;
        for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
        const value = Math.sqrt(sumSquares / pcmData.length)
        if (lives > 0 && value > THRESHOLD && !screamed && document.body.classList.contains('play')) {
            if (selectedCat === 'black') {
                lives++
                waitSound = Promise.all([playWonTune(), checkPoint()])
            } else {
                lives--
                waitSound = Promise.all([playLooseTune(), checkPoint()])
            }
            screamed = true
        }
        window.requestAnimationFrame(onFrame)
    };
    window.requestAnimationFrame(onFrame)
}

const announceNextLevel = async () => {
    playBeepBeep()

    document.body.classList = 'introLevel'
    catWrapperEl.innerHTML = '';

    levelAlertEl.innerHTML = `<div class="levelAnnouncement">level ${level}</div>`

    await queue(1000, () => {
        levelAlertEl.querySelector('.levelAnnouncement').classList.add('hinge')
        document.body.classList.add('play')
    })

    await queue(2000, () => {
        document.body.classList.remove('introLevel')
    })
}

const updatePoints = () => pointsEl.innerHTML = `<span>${new Array(Math.max(0, lives)).fill('🤘').join('')}</span><span style="opacity: 0.25">${new Array(Math.max(0, LIVES_PER_LEVEL - lives)).fill('🤘').join('')}</span>`

const checkPoint = async () => {
    if (lives > 0) {
        if (lives === LIVES_PER_LEVEL) {
            level++
            levelEl.textContent = level
            lives = 3
            updatePoints()

            MIN_INTERVAL = Math.max(0, MIN_INTERVAL - DELTA_LEVEL_INTERVAL)
            MIN_DURATION = Math.max(0, MIN_DURATION - DELTA_LEVEL_DURATION)

            interval = Math.max(0, interval - DELTA_LEVEL_INTERVAL)
            duration = Math.max(0, duration - DELTA_LEVEL_DURATION)

            await announceNextLevel()
        }
    } else {
        dialogEl.showModal()
    }
    updatePoints()
}

const start = () => {
    dialogEl.close()

    duration = 2500
    interval = 250
    lives = 3
    screamed = false
    level = 1
    selectedCat = ''
    waitSound = Promise.resolve()

    levelEl.textContent = level

    listenUser()
    checkPoint()
    announceNextLevel()
    showCat(1000)
}

startBtnEl.addEventListener('click', start)
restartEl.addEventListener('click', start)

const clone = template.content.cloneNode(true);
clone.querySelector('svg').classList = 'cat black';
instructionsEl.appendChild(clone);