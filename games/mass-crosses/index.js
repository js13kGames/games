//import 'regenerator-runtime/runtime'
import mkEl from './mkel.js'
//import { initContract, login, logout } from './utils'
//import getConfig from './config'

const doc = document
const body = doc.body
const $ = (sel)=> doc.querySelector(sel)

const {PI, sin, cos, round, sign, min, max, sqrt, abs, atan2} = Math
const PI2 = PI * 2
const rnd = (lim1=1, lim2=null)=> {
  if ( lim2 === null ) [lim1, lim2] = [0, lim1]
  return Math.random() * (lim2-lim1) + lim1
}

function mapFor(from, to, inc, mapper) {
  const result = []
  for (let i=from; i<=to; i+=inc) result.push(i)
  return result.map(mapper)
}

// If there is no game ID on url, Create a new one!
const gameId = (
                 doc.location.search.substr(1).split('&')
                    .find(s=>s.indexOf('game=')==0) || ''
               ).substr(5)
if (!gameId) doc.location.href = doc.location.href + '?game='
                               + Math.random().toString(16).split('.')[1]

let updateGameInterval, gameData = {}
const gameset = mkEl.extend($('gameset'))

//const { networkId } = getConfig(process.env.NODE_ENV || 'development')

gameset.boxes = []

gameset.mkChild('span', { text: ' ' })
gameset.mkChild('span', { text: '1' })
gameset.mkChild('span', { text: '2' })
gameset.mkChild('span', { text: '3' })
gameset.mkChild('span', { text: ' ' })
for (let y=0; y<3; y++) {
  gameset.mkChild('span', { text: 'ABC'[y], class: 'line' })
  gameset.boxes[y] = []
  for (let x=0; x<3; x++) {
    gameset.boxes[y][x] = gameset.mkChild('div', { class: `pos-${x}-${y} empty` })
  }
  gameset.mkChild('span', { text: 'ABC'[y], class: 'line' })
}
gameset.mkChild('span', { text: ' ' })
gameset.mkChild('span', { text: '1' })
gameset.mkChild('span', { text: '2' })
gameset.mkChild('span', { text: '3' })
gameset.mkChild('span', { text: ' ' })

async function addPiece(x,y, kind) {
  if (gameData.turn != window.accountId) return alert('It is not your turn.')
  if (gameData.status != 'RUNNING') alert('The game was not started')
  if (gameData.set[y][x] >= kind) return alert('You can not place this piece here.')
}

let ticCounter = 0
function fetchGameUpdate() {
  ticCounter++
  gameData = {
    players: [ window.accountId, 'Someone' ],
    board: [
      [
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 1 },
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 2 },
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 3 },
      ],
      [
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 4 },
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 5 },
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 6 },
      ],
      [
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 7 },
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 8 },
        { owner: ticCounter%2==0 ? window.accountId : 'Someone', mass: 9 },
      ]
    ]
  }
  // contract.getOrInitGame({gameId})
  // .then(data => {
  //   console.log('GOT GAME!', data)
  //   gameData = data
    for (let y=0; y<3; y++) for (let x=0; x<3; x++) {
      let boxData = gameData.board[y][x]
      if (boxData) {
        let boxEl = gameset.boxes[y][x]
        boxEl.classList.remove('empty')
        let player = gameData.players.findIndex(p => p == boxData.owner)
        while(boxEl.firstChild) boxEl.firstChild.remove()
        boxEl.mkChild('p', { class: `kind-${boxData.mass} player-${player}` })
      }
    }
  // })
  // .catch(err => {
  //   console.log('Fail to fetch game update.', err)
  //   alert('Fail to fetch game update.\n See console for more details.')
  // })
}

// document.querySelector('#sign-in-button').onclick = login
// document.querySelector('#sign-out-button').onclick = logout

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  })

  updateGameInterval = setInterval(fetchGameUpdate, 3000)
}

signedInFlow()
// `nearInitPromise` gets called on page load
// window.nearInitPromise = initContract()
//   .then(() => {
//     if (window.walletConnection.isSignedIn()) signedInFlow()
//     else signedOutFlow()
//   })
//   .catch(err => {
//     alert('Init contract fail!\nSee console for details.')
//     console.error('Init contract fail:', err)
//   })

// Create galaxy style
mkEl('style', {
  parent: doc.head,
  text: `
  .kind-9::before {
    top: 7rem;
    left: 7rem;
    width: .5rem;
    height: .5rem;
    border-radius: .3rem;
    background: #FFF;
    box-shadow:
    ${
      mapFor(0, 80*PI, PI2/4.95, (a)=> {
        let i = (1.1 - a/(80*PI)) * 2
        let cor = `hsl(var(--hue) 80% ${rnd(80,100)}%)`
        return `${sin(a)*a/25+rnd(-i,i)}rem ${cos(a)*a/25+rnd(-i,i)}rem 0 ${cor}`
      }).join(',\n')
    };
  }
  .kind-9::after {
    top: 7rem;
    left: 7rem;
    width: .3rem;
    height: .3rem;
    border-radius: .2rem;
    background: #FFF;
    box-shadow: ${
      mapFor(0,220*PI,PI2/4.98, (a)=>{
        let cor = `hsl(var(--hue) 80% ${rnd(80,100)}%)`
        return `${sin(a)*a/60+rnd(-1,1)}rem ${cos(a)*a/60+rnd(-1,1)}rem 0 ${cor}`
      }).join(',\n')
    };
  }
  `
})
