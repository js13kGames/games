// A pseudo random number generator based on Alexander Klimov and
// Adi Shamer's paper "A New Class of Invertible Mappings".
var PRNG = (function () {
'use strict';

var rng = {}
  , max = Math.pow(2, 32)
  , state = undefined

// Call seed with "null" to start in a random state.
rng.seed = function (value) {
  if (value !== undefined) {
    state = parseInt(value, 10)
  }
  if (isNaN(state)) {
    state = Math.floor(Math.random() * max)
  }
  return state
}

rng.random = function () {
  state += (state * state) | 5
  return (state >>> 32) / max
}

rng.shuffle = function (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(this.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

return rng
}())

var Power = (function () {
'use strict';

var power = {}
  , $ = window.jQuery
  , mode = false
  , klass = 'led off'
  , start = 0
  , dirty = 0

power.reset = function () {
  $('#power').reset('button off')
  $('#power-led').reset('led off')

  mode = false
  klass = 'led off'
  start = 0

  dirty = 0
}

// If the button's held for more than N seconds, make the LED blink.
power.render = function () {
  if (dirty & 1) {
    if (start > 0) {
      $('#power-led').remove('off').remove('blink').add('on')
      if (Date.now() - start >= 1500) {
        $('#power-led').remove('off').add('on').add('blink')
        mode = !mode
        dirty = 0
      }
      // Don't clear dirty flag. We want to check elapsed time on the next pass.
    } else {
      $('#power-led').reset(klass)
      dirty = 0
    }
  }
}

power.start = function () {
  start = Date.now()
  klass = $('#power-led').unwrap().className
  dirty |= 1
}

power.stop = function () {
  start = 0
  dirty |= 1
}

power.cbm = function () {
  return mode
}

return power
}())

function makeSocketHTML () {
  var html = ''

  html += '<div class="trace">'
  html += '<div class="pads">'
  html += '<span class="pad"></span>'
  html += '<span class="pad"></span>'
  html += '<span class="pad"></span>'
  html += '<span class="pad"></span>'
  html += '</div>'
  html += '<span class="cutout"></span>'
  html += '<div class="pads">'
  html += '<span class="pad"></span>'
  html += '<span class="pad"></span>'
  html += '<span class="pad"></span>'
  html += '<span class="pad"></span>'
  html += '</div>'
  html += '</div>'

  return html
}

function makeChipHTML (chip) {
  var html = ''

  html += '<div class="dip">'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '<div class="chip'+(chip.glitched ? ' glitched' : '')+'">'
  html += '<span class="led '+(Power.cbm() ? 'cbm ' : '')+chip.suit1+'"></span>'
  html += (chip.glitched ? 'x.x' : chip.percent)
  html += '<span class="led '+(Power.cbm() ? 'cbm ' : '')+chip.suit2+'"></span>'
  html += '</div>'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '</div>'

  return html
}

function makeScoreHTML (value) {
  var html = ''

  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '<div class="chip">'
  html += '<div class="inset">'
  html += value
  html += '</div>'
  html += '</div>'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'

  return html
}

function makeButtonHTML (name) {
  var html = ''

  html += '<div class="dip">'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '<div class="chip">'
  html += '<div class="knob">'
  html += '<span class="dimple"></san>'
  html += '</div>'
  html += '</div>'
  html += '<div class="pins">'
  html += '<span class="pin"></span>'
  html += '</div>'
  html += '<span id="'+name+'-led" class="led on"></span>'
  html += '</div>'
  html += '<div class="caption">'
  html += name
  html += '</div>'

  return html
}

var Sockets = (function () {
'use strict';

var sockets = {}
  , chipped = {}
  , powered = {}
  , dirty = 0
  , picked = null
  , shout = ''

sockets.reset = function () {
  var $ = window.jQuery
    , i = 0
    , j = 0
    , x = ''
    , y = ''
    , temp = ''
    , id = null
    , ids = []

  // Remove chips from any sockets
  for (i = 0; i < 4; i += 1) {
    for (j = 0; j < 4; j += 1) {
      id = 'socket'+i+''+j
      ids.push(id)
      $('#'+id).html(makeSocketHTML()).reset('socket')
    }
  }

  // Turn off all the jumpers
  for (i = 0; i < ids.length; i += 1) {
    for (j = 0; j < ids.length; j += 1) {
      x = ids[i]
      y = ids[j]

      if (x > y) {
        temp = y; y = x; x = temp
      }

      $('#jumper1-'+x+'-'+y).reset('jumper')
      $('#jumper2-'+x+'-'+y).reset('jumper')
    }
  }

  // Turn off the chip counter
  for (i = 8; i >= 1; i /= 2) {
    $('#count-'+i).reset('led off')
  }

  // Hide the finals
  $('#finals').reset('unselectable tray hidden')

  // Clear the shout text
  shout = ''
  $('#shout').html('').remove('fade')

  chipped = {}
  dirty |= 1

  picked = null
  dirty |= 2

  powered = {}
  dirty |= 4
}

sockets.render = function () {
  var $ = window.jQuery
    , x = 0
    , y = 0
    , i = 0
    , j = 0
    , temp = null
    , html = ''
    , jumper1 = null
    , jumper2 = null
    , chip = ''
    , id = ''
    , adjacent = []

  if (dirty & 1) {
    Object.keys(chipped).forEach(function (id) {
      $('#'+id).html(makeChipHTML(chipped[id])).add('chipped')
    })

    x = Object.keys(chipped).length
    for (y = 8; y >= 1; y /= 2) {
      if (x >= y) {
        x -= y
        $('#count-'+y).remove('off').add('on')
      } else {
        $('#count-'+y).remove('on').add('off')
      }
    }
  }

  if (dirty & 2) {
    for (x = 0; x < 4; x += 1) {
      for (y = 0; y < 4; y += 1) {
        if ('socket'+x+''+y !== picked) {
          $('#socket'+x+''+y).remove('picked')
        } else {
          $('#socket'+x+''+y).add('picked')
        }
      }
    }
  }

  if (dirty & 4) {
    Object.keys(powered).forEach(function (id) {
      $('#'+id).add('powered')
    })
  }

  if ((dirty & 1) || (dirty & 4)) {
    for (id in powered) {
      chip = powered[id]

      adjacent = collectAdjacent(chip.suit1, chip.id)
      for (i = adjacent.length - 1; i > 0; i -= 1) {
        for (j = i-1; j >= 0; j -= 1) {
          x = adjacent[i]
          y = adjacent[j]

          if (x > y) {
            temp = y; y = x; x = temp
          }

          jumper1 = $('#jumper1-'+x+'-'+y)
          jumper2 = $('#jumper2-'+x+'-'+y)

          if (chipped[x].suit1 === chipped[x].suit2 || chipped[y].suit1 === chipped[y].suit2) {
            jumper1.add(chip.suit1).add('on')
            jumper2.add(chip.suit1).add('on')
          } else if (!jumper1.has(chip.suit1) && !jumper2.has(chip.suit1)) {
            if (!jumper1.has('on')) {
              jumper1.add(chip.suit1).add('on')
            } else if (!jumper2.has('on')) {
              jumper2.add(chip.suit1).add('on')
            }
          }
        }
      }

      adjacent = collectAdjacent(chip.suit2, chip.id)
      for (i = adjacent.length - 1; i > 0; i -= 1) {
        for (j = i-1; j >= 0; j -= 1) {
          x = adjacent[i]
          y = adjacent[j]

          if (x > y) {
            temp = y; y = x; x = temp
          }

          jumper1 = $('#jumper1-'+x+'-'+y)
          jumper2 = $('#jumper2-'+x+'-'+y)

          if (chipped[x].suit1 === chipped[x].suit2 || chipped[y].suit1 === chipped[y].suit2) {
            jumper1.add(chip.suit2).add('on')
            jumper2.add(chip.suit2).add('on')
          } else if (!jumper1.has(chip.suit2) && !jumper2.has(chip.suit2)) {
            if (!jumper2.has('on')) {
              jumper2.add(chip.suit2).add('on')
            } else if (!jumper1.has('on')) {
              jumper1.add(chip.suit2).add('on')
            }
          }
        }
      }
    }

    // Show the finals once all chips are powered and the last chip is played
    if (Object.keys(powered).length >= 4 && Object.keys(chipped).length >= 16) {
      $('#finals').remove('hidden')
    }
  }

  // Remove the fade every render so the shout's ready to display when the text changes
  // #9c4d90 is a good test game for this; just play the first chip over and over
  if (dirty > 0) {
    $('#shout').html(shout).remove('fade')
    if (shout !== '') {
      shout = ''
      $('#shout').add('fade')
    }
  }

  dirty = 0
}

sockets.pick = function (id) {
  if (!(id in chipped)) {
    picked = (picked !== id) ? id : null
    dirty |= 2
  }
}

sockets.needsPower = function () {
  var chipped_count = Object.keys(chipped).length
    , powered_count = Object.keys(powered).length
    , needs_more_power = false
    , i = 0

  for (i = 1; !needs_more_power && i <= 4; i += 1) {
    if (powered_count < i && chipped_count >= i * 4) {
      needs_more_power = true
    }
  }

  return needs_more_power
}

sockets.canInsert = function () {
  return picked && !(picked in chipped)
}

sockets.canPower = function () {
  return picked && (picked in chipped) && !(picked in powered) && Object.keys(powered).length < 4
}

sockets.canReset = function () {
  return Object.keys(chipped).length >= 16 && Object.keys(powered).length >= 4
}

sockets.insert = function (chip, glitch) {
  if (glitch.value >= chip.value &&
      chip.value > 1 && chip.value < 10 &&
      glitch.value > 1 && glitch.value < 10)
  {
    glitch.percent = chip.percent
    chip = glitch
    chip.glitched = true
  }

  chipped[picked] = chip
  chipped[picked].id = picked
  chipped[picked].order = Object.keys(chipped).length
  dirty |= 1

  // Glitched chips trigger an animation
  if (chipped[picked].glitched) {
    this.shout()
  }

  // Every fourth chip is automatically powered
  if (chipped[picked].order % 4 === 0) {
    this.power()
  }

  this.pick(null)
}

sockets.power = function () {
  powered[picked] = chipped[picked]
  powered[picked].id = picked
  dirty |= 4

  this.pick(null)
}

// Collect a list of adjacent sockets with the same suit
function collectAdjacent (suit, socket) {
  var x = 0
    , y = 0
    , seen = []
    , possible = []
    , collected = []

  possible.push(socket)

  while (possible.length > 0) {
    socket = possible.pop()

    if (seen.indexOf(socket) < 0) {
      seen.push(socket)

      if (socket in chipped) {
        if (chipped[socket].suit1 === suit || chipped[socket].suit2 === suit) {
          collected.push(socket)

          x = parseInt(socket.slice(6)[0], 10)
          y = parseInt(socket.slice(6)[1], 10)

          if (x-1 >= 0) { possible.push('socket'+(x-1)+''+y) }
          if (x+1 <= 3) { possible.push('socket'+(x+1)+''+y) }
          if (y-1 >= 0) { possible.push('socket'+x+''+(y-1)) }
          if (y+1 <= 3) { possible.push('socket'+x+''+(y+1)) }
        }
      }
    }
  }

  return collected
}

sockets.base = function () {
  var id = null
    , chip = null
    , totals = {}
    , adjacent = []
    , score = 0

  for (id in powered) {
    chip = powered[id]

    adjacent = collectAdjacent(chip.suit1, chip.id)
    totals[chip.suit1+':'+adjacent.sort().join('')] = adjacent.length

    adjacent = collectAdjacent(chip.suit2, chip.id)
    totals[chip.suit2+':'+adjacent.sort().join('')] = adjacent.length
  }

  for (id in totals) {
    score += totals[id]
  }

  return score
}

sockets.bonus = function () {
  var id = null
    , chip = null
    , score = 0

  for (id in chipped) {
    chip = chipped[id]

    if (chip.glitched) {
      score += 1
    }
  }

  return score
}

sockets.multiplier = function () {
  var id = null
    , chip = null
    , starters = []

  // Figure out what the starting four chips are...
  for (id in chipped) {
    chip = chipped[id]

    if (chip.order <= 4) {
      starters.push(id)
    }
  }

  // Starting in the four corners gets 2x points
  if (starters.indexOf('socket00') >= 0 &&
      starters.indexOf('socket03') >= 0 &&
      starters.indexOf('socket30') >= 0 &&
      starters.indexOf('socket33') >= 0)
  {
    return 2;
  }

  // Starting on either diagonal gets 1.5x points
  if ((starters.indexOf('socket00') >= 0 &&
       starters.indexOf('socket11') >= 0 &&
       starters.indexOf('socket22') >= 0 &&
       starters.indexOf('socket33') >= 0) ||
      (starters.indexOf('socket03') >= 0 &&
       starters.indexOf('socket12') >= 0 &&
       starters.indexOf('socket21') >= 0 &&
       starters.indexOf('socket30') >= 0))
  {
    return 1.5;
  }


  return 1;
}

sockets.cbm = function () {
  dirty |= 1
}

sockets.shout = function () {
  var text = 'Glitch!'
    , count = 0
    , id = null

  for (id in chipped) {
    if (chipped[id].glitched) {
      count += 1
    }
  }

  if (count > 1) {
    switch (count) {
      case 2: text = 'Double '+text; break;
      case 3: text = 'Triple '+text; break;
      case 4: text = 'Multi '+text; break;
      case 5: text = 'Mega '+text; break;
      case 6: text = 'Ultra '+text; break;
      case 7: text = 'Monster '+text; break;
      case 8: text = 'Ludicrous '+text; break;
      case 9: text = '&#220;ber '+text; break;
      case 10: text = 'Epic '+text; break;
      case 11: text = 'Perfect '+text; break;
      case 12: text = 'Inconceivable!'; break;
      default: break;
    }
  }

  shout = text.trim()
  dirty |= 8
}

return sockets
}())

var Chips = (function () {
'use strict';

var chips = {}
  , stack = []
  , grip = []
  , dirty = 0
  , picked = null

chips.reset = function () {
  var $ = window.jQuery
    , i = 0
    , j = 0
    , suit = null
    , suits = ['moons', 'suns', 'waves', 'leaves', 'wyrms', 'knots']

  // Reset and suffle the stack
  stack = []

  for (i = suits.length - 1; i >= 0; i -= 1) {
    stack.push({suit1: suits[i], suit2: suits[i], value: 1})
    stack.push({suit1: suits[i], suit2: suits[i], value: 10})
  }

  stack.push({suit1: 'moons', suit2: 'knots', value: 2})
  stack.push({suit1: 'waves', suit2: 'leaves', value: 2})
  stack.push({suit1: 'suns', suit2: 'wyrms', value: 2})

  stack.push({suit1: 'moons', suit2: 'waves', value: 3})
  stack.push({suit1: 'suns', suit2: 'knots', value: 3})
  stack.push({suit1: 'leaves', suit2: 'wyrms', value: 3})

  stack.push({suit1: 'moons', suit2: 'suns', value: 4})
  stack.push({suit1: 'waves', suit2: 'leaves', value: 4})
  stack.push({suit1: 'wyrms', suit2: 'knots', value: 4})

  stack.push({suit1: 'moons', suit2: 'leaves', value: 5})
  stack.push({suit1: 'suns', suit2: 'waves', value: 5})
  stack.push({suit1: 'wyrms', suit2: 'knots', value: 5})

  stack.push({suit1: 'moons', suit2: 'waves', value: 6})
  stack.push({suit1: 'suns', suit2: 'wyrms', value: 6})
  stack.push({suit1: 'leaves', suit2: 'knots', value: 6})

  stack.push({suit1: 'moons', suit2: 'leaves', value: 7})
  stack.push({suit1: 'suns', suit2: 'knots', value: 7})
  stack.push({suit1: 'waves', suit2: 'wyrms', value: 7})

  stack.push({suit1: 'moons', suit2: 'suns', value: 8})
  stack.push({suit1: 'waves', suit2: 'leaves', value: 8})
  stack.push({suit1: 'wyrms', suit2: 'knots', value: 8})

  stack.push({suit1: 'moons', suit2: 'suns', value: 9})
  stack.push({suit1: 'leaves', suit2: 'knots', value: 9})
  stack.push({suit1: 'waves', suit2: 'wyrms', value: 9})

  PRNG.shuffle(stack)

  // Top three chips on the stack form the grip
  grip = []

  grip.push(stack.pop())
  grip.push(stack.pop())
  grip.push(stack.pop())

  this.compute()

  // Show off the tray of chips
  $('#tray').reset('unselectable tray')

  picked = null
  dirty |= 2
}

chips.compute = function () {
  var i = 0
    , j = 0
    , possible = 0

  for (i = 0; i < grip.length; i += 1) {
    if (grip[i].value > 1 && grip[i].value < 10) {
      possible = 0
      for (j = 0; j < stack.length; j += 1) {
        if (stack[j].value < grip[i].value) {
          possible += 1
        }
      }
      grip[i].percent = (possible / stack.length).toFixed(1)
    } else {
      grip[i].percent = (1.0).toFixed(1)
    }
  }

  dirty |= 1
}

chips.cycle = function () {
  var index = null

  if (picked) {
    index = parseInt(picked.slice(4), 10)
    grip[index] = stack.pop()

    this.compute()
    this.pick(null)
  }
}

chips.render = function () {
  var $ = window.jQuery
    , i = 0
    , html = ''

  if (dirty & 1) {
    for (i = 0; i < 3; i += 1) {
      $('#chip'+i).html(makeChipHTML(grip[i]))
    }

    // Hide the chips when all the sockets are filled
    if (stack.length <= 1) {
      $('#tray').add('hidden')
    }
  }

  dirty = 0
}

chips.pick = function (id) {
  if (picked !== id) {
    picked = id
  }
}

chips.pop = function () {
  return stack.pop()
}

chips.get = function () {
  var index = 0

  if (picked) {
    index = parseInt(picked.slice(4), 10)
    return grip[index]
  }

  return null
}

chips.cbm = function () {
  dirty |= 1
}

return chips
}())

var Score = (function () {
'use strict';

var score = {}
  , base = 0
  , bonus = 0
  , multiplier = 1
  , dirty = 0

score.reset = function () {
  base = 0
  bonus = 0
  multiplier = 1
  dirty |= 1
}

score.render = function () {
  var $ = window.jQuery
    , total = this.last()

  if (dirty & 1) {
    total = (total < 10) ? '0'+total : total
    $('#score').html(makeScoreHTML(total))
  }

  dirty = 0
}

score.compute = function () {
  var new_base = Sockets.base()
    , new_bonus = Sockets.bonus()
    , new_multiplier = Sockets.multiplier()

  if (base !== new_base) {
    base = new_base
    dirty |= 1
  }

  if (bonus !== new_bonus) {
    bonus = new_bonus
    dirty |= 1
  }

  if (multiplier !== new_multiplier) {
    multiplier = new_multiplier
    dirty |= 1
  }
}

score.last = function () {
  return Math.ceil((base + bonus) * multiplier)
}

return score
}())

var Reset = (function () {
'use strict';

var reset = {}
  , $ = window.jQuery
  , dirty = 0
  , start = 0
  , restartable = false

reset.reset = function () {
  $('#reset').reset('button off')
  $('#reset-led').reset('led off')

  start = 0
  restartable = false

  dirty = 0
}

// If the button's held for more than N seconds, make the LED blink.
reset.render = function () {
  if (dirty & 1) {
    if (start > 0) {
      $('#reset-led').remove('off').remove('blink').add('on')
      if (Date.now() - start >= 1500) {
        $('#reset-led').remove('off').add('on').add('blink')
        restartable = true
        dirty = 0
      }
      // Don't clear dirty flag. We want to check elapsed time on the next pass.
    } else {
      $('#reset-led').remove('on').remove('blink').add('off')
      dirty = 0
    }
  }
}

reset.start = function () {
  start = Date.now()
  restartable = false
  dirty |= 1
}

reset.stop = function () {
  start = 0
  restartable = false
  dirty |= 1
}

reset.canReset = function () {
  return restartable
}

return reset
}())

;(function (Game) {
'use strict';

var color = undefined

function onSocket (target, e) {
  Sockets.pick(target.unwrap().id)
}

function offSocket (target, e) {
}

function onPower (target, e) {
  target.add('on')
  Power.start()
}

function offPower (target, e) {
  target.remove('on')
  Power.stop()

  // Rrerender chips and sockets in case color blind mode changed.
  Chips.cbm()
  Sockets.cbm()
}

function onChip (target, e) {
  if (Sockets.canInsert()) {
    Chips.pick(target.unwrap().id)
  }
}

function offChip (target, e) {
  var chip = Chips.get()

  if (Sockets.canInsert()) {
    Sockets.insert(chip, Chips.pop())
    Chips.cycle()
    Score.compute()
  }
}

function render () {
  requestAnimationFrame(render)

  Power.render()
  Reset.render()
  Sockets.render()
  Chips.render()
  Score.render()
}

// Pick a random color out of the RGB color space.
// Don't use the PRNG, since it will be seeded with the color.
function newColor () {
  var hash = color

  do {
    hash = Math.floor(Math.random() * 16777216)
    hash = ('000000' + hash.toString(16)).substr(-6)
  } while (hash === color)

  color = hash
}

function resetGame () {
  Power.reset()
  Reset.reset()
  Sockets.reset()
  Chips.reset()
  Score.reset()
}

function onReset (target, e) {
  Reset.start()
  target.add('on')
}

function offReset (target, e) {
  if (Reset.canReset()) {
    newColor()
    window.location.hash = color
  }

  Reset.stop()
  target.remove('on')
}

function onTweet (target, e) {
  var twitter = 'https://twitter.com/intent/tweet'
    , text = encodeURIComponent('I glitched '+Score.last()+ " chips in flip-flop for @js13kGames. How'd you do?")
    , url = encodeURIComponent(window.location.href)

  // Note to self: Adblock Plus breaks this link!
  target.unwrap().href = twitter + '?text='+text + '&url='+url
}

function onHashChange () {
  var hash = window.location.hash.substring(1)
  if (/^[0-9A-F]{6}$/i.test(hash)) {
    color = hash
    PRNG.seed(parseInt(color, 16))
  }
  resetGame()
}

function startGame (callback) {
  var hash = window.location.hash.substring(1)
    , reloaded = false

  if (/^[0-9A-F]{6}$/i.test(hash)) {
    if (color === hash) {
      // Continuing saved game...
      reloaded = true
    } else {
      // Replaying a linked game...
      color = hash
      PRNG.seed(parseInt(color, 16))
    }
  } else {
    // Playing a new game...
    newColor()
    PRNG.seed(parseInt(color, 16))
  }

  if (window.location.hash.substring(1) !== color) {
    window.location.hash = color
  } else if (!reloaded) {
    resetGame()
  }

  requestAnimationFrame(callback)
}

Game.play = function () {
  var $ = window.jQuery
    , html = ''
    , x = 0
    , y = 0

  for (x = 0; x < 4; x += 1) {
    html += '<div class="sockets" id="sockets'+x+'">'
    for (y = 0; y < 4; y += 1) {
      if (x < 3) {
        html += '<div class="jumpers">'
      }
      html += '<div id="socket'+x+''+y+'" class="socket">'
      html += makeSocketHTML()
      html += '</div>'
      if (x < 3) {
        html += '<div class="vjumpers">'
        html += '<span id="jumper1-socket'+x+''+y+'-socket'+(x+1)+''+y+'" class="jumper"></span>'
        html += '<span id="jumper2-socket'+x+''+y+'-socket'+(x+1)+''+y+'" class="jumper"></span>'
        html += '</div>'
        html += '</div>'
      }
      if (y < 3) {
        html += '<div class="hjumpers">'
        html += '<span id="jumper1-socket'+x+''+y+'-socket'+x+''+(y+1)+'" class="jumper"></span>'
        html += '<span id="jumper2-socket'+x+''+y+'-socket'+x+''+(y+1)+'" class="jumper"></span>'
        html += '</div>'
      }
    }
    html += '</div>'
  }
  $('#fab').html(html)

  for (x = 0; x < 4; x += 1) {
    for (y = 0; y < 4; y += 1) {
      $('#socket'+x+''+y).touch(onSocket, offSocket)
    }
  }

  $('#power').html(makeButtonHTML('power'))
  $('#power').touch(onPower, offPower)

  $('#reset').html(makeButtonHTML('reset'))
  $('#reset').touch(onReset, offReset)

  $('#tweetGame').touch(onTweet)

  for (x = 0; x < 3; x += 1) {
    $('#chip'+x).touch(onChip, offChip)
  }

  $(window).on('hashchange', onHashChange)

  startGame(render)
}

})(window.Game = window.Game || {})

Game.play()
