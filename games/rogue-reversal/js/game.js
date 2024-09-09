var Quest = (function () {
'use strict';

var $ = window.jQuery
  , quest = {}
  , element = $('#quest')
  , marker = 0
  , text = []
  , dirty = false

text = [
  "Heal the bat with the potion."
, "Put the bow in the chest."
, "Hide the key among the rocks."
, "Wash your hair in the fountain."
, "Leave the ruins via the stairs."
, "A brave hero enters a strange land&hellip;"
]

quest.reset = function () {
  marker = 0
  dirty = true
}

quest.render = function () {
  if (dirty) {
    element.html(text[marker])
    dirty = false
  }
}

quest.complete = function (name) {
  if (name === 'monster' && marker === 0) {
    marker = 1
  } else if (name === 'chest' && marker === 1) {
    marker = 2
  } else if (name === 'rock' && marker === 2) {
    marker = 3
  } else if (name === 'fountain' && marker === 3) {
    marker = 4
  } else if (name === 'stairs' && marker === 4) {
    marker = 5
  }
  dirty = true
}

quest.current = function () {
  switch (marker) {
    case 0: return 'monster'
    case 1: return 'chest'
    case 2: return 'rock'
    case 3: return 'fountain'
    case 4: return 'stairs'
    case 5: return 'restart'
    default: return null
  }
}

return quest
}())

var Score = (function () {
'use strict';

var $ = window.jQuery
  , score = {}
  , element = $('#score')
  , total = 0
  , dirty = true

score.reset = function () {
  total = 0
  dirty = true
}

score.render = function () {
  if (dirty) {
    element.html(total)
    dirty = false
  }
}

score.increment = function (amount) {
  amount = parseInt(amount, 10)
  if (isNaN(amount)) {
    amount = 1
  }
  total += amount
  dirty = true
}

score.total = function () {
  return total
}

return score
}())

var Emote = (function () {
'use strict';

var $ = window.jQuery
  , emote = {}
  , element = $('#emote')
  , text = ''
  , dirty = 0

emote.reset = function () {
  text = "Are you okay?"
  dirty = 1 | 2
}

emote.render = function () {
  if (dirty & 1) {
    element.html(text).remove('fade')
    dirty &= ~1
    return
  }
  if (dirty & 2) {
    element.add('fade')
    dirty &= ~2
    return
  }
}

emote.say = function (html) {
  text = html
  dirty = 1 | 2
}

return emote
}())

var Room = (function () {
'use strict';

var r = {}
  , $ = window.jQuery
  , rocks = [$('#rocks1')]
  , num_rows = 6
  , num_cols = 10
  , tile_width = 32
  , tile_height = 32
  , last_row = num_rows - 3
  , last_col = num_cols - 1

function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

r.is_last_row = function (row) {
  return row === last_row
}

r.clamp_row = function (row) {
  if (row < 0) {
    return 0
  }
  if (row > last_row) {
    return last_row
  }
  return row
}

r.clamp_col = function (col) {
  if (col < 0) {
    return 0
  }
  if (col > last_col) {
    return last_col
  }
  return col
}

r.move_row = function (row) {
  return (num_rows - row - 1) * tile_height
}

r.move_col = function (col) {
  return (col * tile_width)
}

r.random_tile = function (box) {
  var row = getRandomIntInclusive(0, last_row)
    , col = getRandomIntInclusive(0, last_col)
    , x = this.move_col(col)
    , y = this.move_row(row)
  return { top: y, left: x, width: box.width, height: box.height, right: x + box.width, bottom: y + box.height }
}

r.intersect = function (box1, box2) {
  return !(box2.left >= box1.right ||
           box2.right <= box1.left ||
           box2.top >= box1.bottom ||
           box2.bottom <= box1.top)
}

r.reset = function () {
  var i = 0
    , tile = null

  for (i = 0; i < rocks.length; i += 1) {
    tile = this.random_tile({ width: 32, height: 32 })
    rocks[i].top(tile.top)
    rocks[i].left(tile.left)
  }
}

return r
}())


var Key = (function () {
'use strict';

var $ = window.jQuery
  , k = {}
  , element = $('#pickup-key')
  , position = { top: 0, left: 0 }
  , held = true
  , dirty = false

k.render = function () {
  if (dirty) {
    if (held) {
      element.add('hidden')
    } else {
      element.top(position.top)
      element.left(position.left)
      element.remove('hidden')
    }
    dirty = false
  }
}

k.pickup = function (offset) {
  if (!held && Room.intersect(offset, position)) {
    Items.pickup('key')
    held = true
    dirty = true
  }
  return this
}

k.discard = function () {
  if (held) {
    Items.discard('key')
    held = false
    position = Room.random_tile({ width: 32, height: 32 })
    dirty = true
  }
  return this
}

k.held = function () {
  return held
}

return k
}())

var ColorWheel = (function () {
'use strict';

var colors = {}
  , wheel = []
  , cw = {}

/* http://colllor.com/ */
/* 0 Hues are pure color. */
/* 1 Tints are hue plus white. */
/* 2 Tones are hue plus gray. */
/* 4 Shades are hue plus black. */
colors = {
    'yellow':        ['#fff400','#fff75c','#f2e70d','#b8ae00']
  , 'yellow-orange': ['#ffd300','#ffe047','#f2cc0d','#b89900']
  , 'orange':        ['#fda500','#ffb833','#f2a20d','#b87700']
  , 'red-orange':    ['#f58351','#f79e78','#dc6938','#c1420b']
  , 'red':           ['#ed2324','#f2674a','#bb191a','#aa0e0e']
  , 'red-violet':    ['#8c288f','#9f5da6','#791a7e','#4e1650']
  , 'violet':        ['#5a2e91','#7756a5','#4f237f','#30184e']
  , 'blue-violet':   ['#3e3997','#645dab','#2f2978','#242259']
  , 'blue':          ['#0450a5','#6379bc','#013f85','#022650']
  , 'blue-green':    ['#00ab85','#00cca0','#09a583','#006650']
  , 'green':         ['#14a049','#16b653','#248f4d','#0b5b2a']
  , 'yellow-green':  ['#90c841','#a2d161','#8db654','#648e29']
}

wheel = [
  'yellow','yellow-orange','orange','red-orange',
  'red','red-violet','violet','blue-violet',
  'blue','blue-green','green','yellow-green'
]

cw.hue = function (color) {
  return colors[color][0] + 'ff'
}

cw.tint = function (color) {
  return colors[color][1] + 'ff'
}

cw.tone = function (color) {
  return colors[color][2] + 'ff'
}

cw.shade = function (color) {
  return colors[color][3] + 'ff'
}

cw.left = function (color, amount) {
  var index = wheel.indexOf(color)
  for (; amount > 0; amount -= 1) {
    index += 1
    if (index >= wheel.length) {
      index = 0
    }
  }
  return wheel[index]
}

cw.right = function (color, amount) {
  var index = wheel.indexOf(color)
  amount = amount || 0
  for (; amount > 0; amount -= 1) {
    index -= 1
    if (index < 0) {
      index = wheel.length - 1
    }
  }
  return wheel[index]
}

return cw
}())

var ImageCache = (function () {
'use strict';

var $ = window.jQuery
  , canvas = $('#gfx').unwrap()
  , ctx = canvas.getContext('2d')
  , images = Object.create(null)
  , ic = Object.create(null)

images['floor'] = {"width":12,"height":12,"data":"3a7b5a3b4a1b1a6b5a1b5a1b5a1b5a1b5a1b5a1b5a1b5a7b4a1b4a7b5a3b3a1b5a1b5a1b5a1b5a1b5a1b2a","values":{"a":"#969696ff","b":"#737373ff"}}
images['hero'] = {"width":32,"height":18,"data":"38a4b12a4b11a1b4c1b10a1b1c2d1c1b9a1b6c1b8a1b1c4d1c1b8a1b1c4d1c1b8a1b1c4d1c1b8a3b2d3b8a1b2c2d2c1b8a1b1e1f2d1f1e1b8a1b6c1b7a1g1a1b1c2d1c1b1a1g8a1b4c1b7a2h1g1h1b2c1b1h1g2h4a2h1g1h4i1h1g2h3a2g1h1i1g1h2i1h1g1i1h2g2a2g2h1g1h2i1h1g2h2g4a1g1h2g2h2g1h1g6a1g1h2g2h2g1h1g5a1g1h2g1i2g1i2g1h1g4a1g1h2g1h2g1h2g1h1g3a1b1d1c1g1h1g2h1g1h1g1c1d1b2a1b1d1c1g1h1g2h1g1h1g1c1d1b2a1b2d1c1g1h2g1h1g1c2d1b2a1b2c2g1h2g1h2g2c1b3a2b1a1g1i2h1i1g1a2b4a2b2g1h2i1h2g2b7a1g4h1g10a1g1h2g1h1g9a1g1i1h2g1h1i1g8a1g2h2g2h1g36a","values":{"a":"#00000000","b":"#4a2717ff","c":"#de9362ff","d":"#f7d5a4ff","e":"#fefefeff","f":"#313962ff","g":"#120c12ff","h":"#444444ff","i":"#808080ff"}}
images['sprites'] = {"width":80,"height":16,"data":"10a6b11a2c7a8d46a1b1e2f1d1c10a1c2f1c4a2d1f3e1d3e2d44a1b1e2f1d1c9a1c3f1b1c2a1d1e1f1d3f1d3f1d1e1d4a10c6a10c9a5b1e2f1d1c9a1c1b2f2b1c1d3f8c3f1d2a1c1g8h1g1c4a1c2g7h1g1c8a1b1e2f1b1e2f1d1c3a3c3a1c2b1f2b1c1d2f10c2f1d1a1c12g1c2a1c1g10h1g1c7a1b1e2f1b1e2f1d1c2a1c2f1b1c3a1c1f2b1c1a3d10c3d1a6c2i6c2a1c1g2h6g2h1g1c3a5b1e2f1b1e2f1d1c1a1c3f2b1c8a1d2f10c2f1d1a1c1h4j2c4j1h1c2a1c12g1c3a1b1e2f1b1e2f3b3c1a1c2b1f2b1c8a1d2f1e8c1e2f1d1a1c1h10j1h1c2a1c1g1h8g1h1g1c3a1b1e2f1b1e2f1c3d1b1c2a1c4b1c1a5c2a1b1d1f1d3e1d3e1d2f1d1b1a1c1g10i1g1c2a1c1g10i1g1c3a1b1e2f1b1e2f1c3d1b1c7a2c4f1b1c1a1b2d1b3f1d4f1b2d1b1a14c2a6c2h6c3a1b1e2f4b1c2d2b1c6a1c6f2b1c2b1d1b3d1b4d1b1d2b1a1c5h2c5h1c2a1c4h1c2i1c4h1c3a1b1e2f1c7d1b1c5a1c2f4b1f2b1c1b1d2b3d1b4d2b1d1b1a1c1h10g1h1c2a1c1h4g2c4g1h1c3a1b1e2f1c7d1b1c5a1c6b1f2b2c1d1b1d8b1d1b1d1c1a1c12g1c2a1c12g1c3a4b1c2d3b1d2b1c1a2c3a1c3b2f2b1c2a1c1b2d1b3d1b3d1b1c3a12c4a12c4a1c7d1b3d1b2c2f1c14a2c1d1b3d1b2d2c36a15c1f1b1c16a8c36a","values":{"a":"#00000000","b":"#4e4a4eff","c":"#432434ff","d":"#757162ff","e":"#6dc2caff","f":"#8694a0ff","g":"#d17c2cff","h":"#854d31ff","i":"#dbd45fff","j":"#140b1dff"}}
images['hair-backward'] = {"width":256,"height":18,"data":"5a1b4c1b6a1b3a6b57a1b1a1c1a2b1a1b9a1b1c2d1c1b10a1b1c2d1c1b9a1b1c4d1c1b9a1b4c1b10a1b4c1b13a1d2c41a1b1c4d1c1b9a1b1c2d1c1b9a1b1d1c1d3c1b5a1b1c2b1d1c1d3c1b9a1b1c2d1c1b23a2b1a1b1c2d1c1b1a2b4a1b1a1c1b1d2b1d1a1b8a2c1d1c2d2c8a1c2d1c2d2c7a1b1c6d1c1b7a2b1c2d2c1b8a1b1c1d2c1d1c1b12a1d1c8a1c2a1b4c1b2a1c7a1b4c1b8a1b1d6c1d1b7a1c6d1c8a1c4d1c1d1c6a1b2c4d1c1d1c1b7a1b1c4d1c1b21a1b2d1b1c4d1c1b2d1b4a1b1c1b1d1b1c1d1b1c3b4a1b1c2d1c3d1c1b6a1b1c1d2c4d1b6a1c2d1c2d1c2d1c6a1b1d1c4d2c1b6a1b1c6d1c1b10a1d1c8a1c1d3c4d3c1d1c5a2c4d2c7a2d1c4d1c2d6a1b1c2d1c4d1b6a1b8d1b6a1b8d1b7a1c2d1c1d1c1d1c21a1b1d1c1b6d1b1c1d1b2a3b1c2d1c4d1c1b3a1b1a1c3d2c3d1b1a1b4a1b1d4c3d1b5a1b1c1d1c2d1c1d1c1d1c1b5a1b3d2c1d1c1d1b6a1b1c6d1c1b19a1c2d1b1c2d1c3d1c1b2d1c3a1b1c2d1c3d1c1b5a1b2c2d1c3d2c1b5a1b3d1c4d1b6a1b2d1c5d1b5a2b1c1d1c1d1c1d1c1d1b6a1b1c1d1c2d3c1b7a1c6a1c6a2b1c3d1c2d1c2b4a1b2c6d1c1b4a1b1d1c2d3c4d1c1b3a1b1c1d5c1d1c1b5a1b10c1b5a1b1c1d2c1b2c1d1b6a1c3d2c3d1c19a1c1d3c1d2c1d1c1d3c1d1c3a1c2d2c1d1c1d2c5a1b1d2c1d1c3d1c1d1b5a1c1d1c1d2c1d1c1d1b6a1c3d1c2d1c1d1c4a1b1a2b2c1d3c1d1b6a1b1c4d1c1d1c1b6a1b2c4a2c1b6a1b1d1c2d1c1d1c1d1b6a1b2c1d1c1d1c1d1c5a1b2d6c2d2c1b3a10c1b4a1b1c1b1c1b4c1b1c1b1c1b4a1b1c1b1c2b1c1b1c1b5a1b3d4c3d1b18a1c1d1a1b1d6c1d1b1a1d1c3a1b1d6c1d1b5a1b1d2c1d1c2d2c1d1b5a6c1d2c1b6a2d1c1d2c1d1c2d7a1b6c1b7a1c1d1c2d2c2d1c6a1c1a1b1c2a1c1b1a1c6a1b1d2c1d3c1d1b5a3b6c1b6a11c1b5a1b1c1b4c1b1c1b5a2b1c1b4c1b1c2b5a1e8b1e5a1b3d1c2b1c3d1b19a1c1a1b8c1b1a1c4a1b8c1b5a1c1d1b1c1d2c1d1c1b1d1c6a1c1b4c1b1c1b5a1b1d1c2b2c2b1c1d1b6a2b4c2b6a1b1c1d2c1d2c2d1c1b6a1c1a1b2c1b1a1c8a8c9a1b4c1b8a1b8c2b6a2b5c1b5a2b1c3b2c3b1c2b5a1e6b1e7a1b1d1c1b2d1b1c1d1b23a1b6c1b8a1b6c1b7a1c2b4c2b1c7a2b5c1b6a1b1c3a1c4a1c1b9a1b1a1b8a1b2d1c2a1c1a1c2d1b9a2b12a1b4c1b11a1c2a1c10a2b4c2b2a1b7a1b2c1b28a1e2b1e11a2b2d2b27a1b2c1b12a1b2c1b12a1b2c1b12a1b2c1b8a1b10a1b20a1b1d1c3a1c2a1c1d1b24a4b93a2b2135a","values":{"a":"#00000000","b":"#0e1b57ff","c":"#5c41a0ff","d":"#de98e0ff","e":"#011640ff"}}
images['hair-forward'] = {"width":256,"height":18,"data":"5a1b4c1b6a1b3a6b57a1b1a1c1a2b1a1b9a1b1c2d1c1b10a1b1c2d1c1b9a1b1c4d1c1b9a1b4c1b10a1b4c1b13a1d2c41a1b1c4d1c1b9a1b1c2d1c1b9a1b2c1d3c1b5a1b1c2b2c1d3c1b9a1b1c2d1c1b23a2b1a1b1c2d1c1b1a2b4a1b1a1c1b1d2b1d1a1b8a1c2d1b2d2c8a1c2d1b2d2c7a1b1c6d1c1b7a1c1b2c1d2c1b8a1b1c1d2c1d1c1b12a1d1c8a1c2a1b4c1b2a1c7a1b4c1b8a1b1d6c1d1b7a1c5d2c8a2c3d1c1d1c6a1b3c3d1c1d1c1b7a1b1c4d1c1b21a1b2d1b1c4d1c1b2d1b4a1b1c1b1d1b1c1d1b1c3b4a1b1c1d1c1b4d1b6a1b1c1d1c1b4d1b6a1c1e1f4d1f1e1c6a1b2c1d1c2d2c1b6a1b1c6d1c1b10a1d1c8a1c1d3c4d3c1d1c5a2c4d2c7a2d1c4d1c2d6a1b1c1d1c1b1d1c2d1b6a1b1c2d1b4d1b6a1b1c2d1b4d1b7a1c2d1c1d1c1d1c21a1b1d1c1b2d1c1d1c1d1b1c1d1b2a3b1c2d1c4d1c1b3a1b1a1c1d1c2b1c3d1b1a1b4a1b1d1c2b1c3d1b5a1b1d1f6d1f1d1b5a1b1c2d1b1c1d1b1d1b6a1b1c1d4b1d1c1b19a1c2d1b1c2d1c3d1c1b2d1c3a1b1c2d1c3d1c1b5a1b2c2d2c2d2c1b5a1b1d1c2b1d1c2d1b6a1b1d1b1d2b1d1b1d1b5a2b1d1b1d2b1d1b1d1b6a1b1c1d1c1a1d3c1b7a1c6a1c6a3b1d4c1d3b4a1b2c1d2b1c1b1d1c1b4a1b2c1d1b2a2b1d3c1b3a1b1c1d1b2a2b1d1c1b5a1b3d1c2d1c3d1b5a1c1b1d5b1d1c6a1c1d1b4a1b1d1c19a1c1d1c1b2d2c1d1c2d1b1c1d1c3a1c2d2c1d1c1d2c5a1b1d1b1d1c2a1c1d1b1d1b5a1c1d1b1a1b1c1b1d1c1b6a1c1d6a1d1c4a1b1a1b1d6a1d1b6a1b1c3a1d2a1c1b6a1b1c6a1c1b6a1b1d6a1d1b6a1b1c1b4a1b1c5a1b2c1b5a1b3c1b3a2c1b5a3b4a1b1c1b1d6a1d1b1c1b4a1c1b6a1b1c5a1b1d1b6a1b1d1b18a1c1d1a1c1d2c1a3c1d1c1a1d1c3a1b1d2c1a3c1d1b5a1b1d1c6a1c1d1b5a1c1b3a1b2a1b7a1d1c6a1c1d7a1c6a1c7a1c1d6a1d1c6a1c8a1c6a1b1d6a1d1b5a3b6a1b6a1c1b7a1b1c1b5a1b7a2b5a2b1d6a1d2b5a2b6a2b5a1b1d1b6a1b1d1b19a1c2a1c6a1c2a1c4a1b1c6a1c1b5a1c1d1c6a1c1d1c6a1b13a1b2d6a2d1b6a1b6a1b6a1b1c1d6a1d1c1b6a1b6a1b8a1c6a1c23a1b7a3b19a2b1c1b6a1b1c2b5a1b6a1b7a1b1c6a1c1b9a1d2a1d10a1b6a1b8a1b6a1b7a2c6a2c21a1b1d8a1d1b20a1b1d8a1d1b22a1b6a1b34a1b70a1c4d1c71a1b10a1b20a1b1d8a1d1b136a1c2d1c252a1c2d1c253a1c1d255a1d1351a","values":{"a":"#00000000","b":"#0e1b57ff","c":"#5c41a0ff","d":"#de98e0ff","e":"#5193b8ff","f":"#132e81ff"}}
images['monster'] = {"width":64,"height":16,"data":"132a2b4a2b24a2b4a2b23a1b1c1b4a1b1c1b7a2b4a2b7a1b1c1b4a1b1c1b21a1b1c1d1c1b2a1b1c1d1c1b4a2b2c1b2a1b2c2b4a1b1c1d1c1b2a1b1c1d1c1b14a4b2a1b2d1c4b1c2d1b2a2b1c3d4b3d1c2b2a1b2d1c4b1c2d1b12a2b2c1b3a2b1d1b1d2c1d1b1d2b3a3b1c1b1d2c1d1b1c3b3a2b1d1b1d2c1d1b1d2b10a2b2c2d1b3a1b1a2b1e2c1e2b1a1b5a1b1d1b1e2c1e1b1d1b5a1b1a2b1e2c1e2b1a1b11a1b1c2d1b7a1b4d1b9a2b4d2b9a1b4d1b14a1b1d1c1d1b8a4b12a4b12a4b6a5b3a1b1c2d1c1b51a1b2c1d4b1c2d1b52a1b2d1b2d1e1d1b1d2b9a4c12a4c12a4c8a1b1d1b1d2c1d2b1c1b1c7a6c10a6c10a6c6a1c1b1d1b1e1c2d1b6c6a4c12a4c12a4c6a3c1b1d4b5c52a1c2b6c5a","values":{"a":"#00000000","b":"#140c1bff","c":"#757161ff","d":"#432432ff","e":"#d04646ff"}}
images['items'] = {"width":176,"height":16,"data":"116a1b1c4d1c1b106a4d26a4d27a1c8d1c42a2d40a3d1a2d14a1d1e2b1e1d24a1d4b6d20a1c10d1c11a3d7a10d9a1d2b1d39a1d1e1b1d2b2d12a1d4e1d23a1d1b3e1b1c5e1d18a1c1d1c1b1c4d1c1b1c1d1c2a1d6a1d1c2e1c2d2a3d2b4e2b3d7a1d2e1d13a2d11a2d4a2d6a5d2b1d11a1d4b1d16a3d4a1d2b3e1c1b4e1d5a8d4a1b2d1c8e1c2d1b1a1b1d4a1d1c4e2c1d1a1d3e1b4e1b3e1d7a4d12a4d10a3d2a3d7a1d1b2a2d1b1d11a4d16a1d3b1d3a1d1e1b1d3e4c2d4a1d8e1d3a1c2d1c8e1c2d1c1a1c1e2d2a1d6e1d3a1d2e6b2e1d8a1d1c1b1d11a6d10a6d9a1d1b3a1d1b1d10a1d2c1d7a10d1b1d1b1d2a2d2e1d1b2e1b4e1d4a1d8e1d3a3d10e3d1a1d3e3d5e1d5a1d1b6e1b1d9a1d1c1b1d10a3d2a3d10a4d11a1d1b3a1d1b1d8a1d2c1e1c1d6a1d1b8e1b1d1b1d2a1d1c2e3d1e1b4e1d4a1d8e1d3a3d10e3d1a1c11e1d5a1d1b6d1b1d8a1d2c1e1c1d9a2d1a2d1a2d8a2d1a2d1a2d10a1d1b2a1d1b1d7a1d3b2e1b1d5a1d1b1e1d1e5d1b1d1b1d2a1d1b2e1c3d4c2d4a1d1e1d1e1d1e1d2e1d3a3d10e3d1a1d1b10e1d5a1d1b2c2d2c1b1d8a1d1c1b1e1c1d11a4d10a3d2a3d11a1d1b2a1d1b1d5a1d4b3e1b1d4a1d1b1e1d1e1d3a1d3b1d2a1d3e2c2d1b3e1b1d4a1d8e1d3a3d1b8e1b3d2a1d2c7e1c1d5a1d1b2e2d2e1b1d7a1d1c2b2e1c1d9a6d10a6d13a1d1b1a1d1b1d4a1d1c5b2e1b1c1d3a3d1a2d4a3d3a1d1b1e1b1c1b1d1c1b3e1b1d5a3d2e3d4a1c3d1b6e1b3d1c2a1d1b7e1c1d6a1d2b1e2d1e2b1d7a1d3b2e1b1d8a3d2a3d10a4d15a1d1b2d5a1d1c8b1c1d19a1d4e1b1d4c3d7a1d1e1d7a1b1d1e1c1d1b4e1b4d1b3a1d1c5e1c1d7a1d2b1e2d1e2b1d7a1d6b1d8a2d4a2d11a2d17a2d1b1d4a1d2c4b1e1b2c1d19a1d4e2b1d1b2e1b1d8a2d9a1c1d1e1c1d4e4d1c4a1d1c4e1c1d8a1d2b1e2d1e2b1d7a1d1c2b1e1b1c1d47a1d1e1d5a1d8c1d20a2d1b1e3b1d1b2e1b1d20a1c1d6e3d1c2a2d1b1c4e1c1d9a1d2b1e2d1e2b1d7a1d6c1d48a2d6a8d22a11d22a1c2d4e2d1c5a7d11a8d9a6d121a2b4e2b52a","values":{"a":"#00000000","b":"#bdbdbdff","c":"#737373ff","d":"#242424ff","e":"#f0f0f0ff"}}

function hexToRgba (hex) {
  var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[4], 16),
  } : null
}

ic.getDataURL = function (name, options) {
  var data = images[name]
    , image = ctx.createImageData(data.width * 2, data.height * 2)
    , i = 0
    , j = 0
    , x = 0
    , y = 0
    , offset = 0
    , color = null
    , value = ''
    , number = ''

  if (name.indexOf('hair') > -1) {
    options = options || Object.create(null)
    if (options['color'] !== undefined) {
      switch (options['color']) {
        case 0:
          data.values['b'] = '#781707ff'
          data.values['c'] = '#b83827ff'
          data.values['d'] = '#c88078ff'
          break
        case 1:
          data.values['b'] = '#313962ff'
          data.values['c'] = '#38529cff'
          data.values['d'] = '#628ce6ff'
          break
        case 2:
          data.values['b'] = '#005218ff'
          data.values['c'] = '#52731fff'
          data.values['d'] = '#accd52ff'
          break
        case 3:
          data.values['b'] = '#9c5a17ff'
          data.values['c'] = '#d5ac39ff'
          data.values['d'] = '#fef67bff'
          break
        case 4:
          data.values['b'] = '#4a2717ff'
          data.values['c'] = '#9c5a29ff'
          data.values['d'] = '#de9362ff'
          break
        case 5:
          data.values['b'] = '#a45a07ff'
          data.values['c'] = '#d58307ff'
          data.values['d'] = '#fedd00ff'
          break
        case 6:
          data.values['b'] = '#10286aff'
          data.values['c'] = '#7058b0ff'
          data.values['d'] = '#e6ace6ff'
          break
        case 7:
          data.values['b'] = '#af3e70ff'
          data.values['c'] = '#df80a0ff'
          data.values['d'] = '#f8c8d8ff'
          break
        case 8:
          data.values['b'] = '#444444ff'
          data.values['c'] = '#606060ff'
          data.values['d'] = '#b0b1afff'
          break
        case 9:
          data.values['b'] = '#808080ff'
          data.values['c'] = '#cdcdcdff'
          data.values['d'] = '#fefefeff'
          break
        default:
          break
      }
    }
  }

  canvas.width = data.width * 2
  canvas.height = data.height * 2

  for (i = 0; i < data.data.length; i += 1) {
    value = data.data[i]
    if (value.charCodeAt() >= 'a'.charCodeAt() && value.charCodeAt() <= 'z'.charCodeAt()) {
      number = parseInt(number, 10)
      color = hexToRgba(data.values[value])
      for (j = 0; j < number; j += 1) {
        offset = ((y+0)*(image.width*4)) + ((x+0)*4)
        image.data[offset + 0] = color.r
        image.data[offset + 1] = color.g
        image.data[offset + 2] = color.b
        image.data[offset + 3] = color.a

        offset = ((y+0)*(image.width*4)) + ((x+1)*4)
        image.data[offset + 0] = color.r
        image.data[offset + 1] = color.g
        image.data[offset + 2] = color.b
        image.data[offset + 3] = color.a

        offset = ((y+1)*(image.width*4)) + ((x+0)*4)
        image.data[offset + 0] = color.r
        image.data[offset + 1] = color.g
        image.data[offset + 2] = color.b
        image.data[offset + 3] = color.a

        offset = ((y+1)*(image.width*4)) + ((x+1)*4)
        image.data[offset + 0] = color.r
        image.data[offset + 1] = color.g
        image.data[offset + 2] = color.b
        image.data[offset + 3] = color.a

        x += 2
        if (x >= image.width) {
          x = 0
          y += 2
        }
        if (y >= image.height) {
          y = 0
        }
      }
      number = ''
    } else {
      number += value
    }
  }


  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL()
}

return ic
}())

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

rng.randomInclusive = function (min, max) {
  return Math.floor(this.random() * (max - min + 1)) + min;
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

var Ruins = (function () {
'use strict';

var ruins = {}
  , positions = {}
  , quadrants = []

ruins.reset = function () {
  positions = []
  quadrants = []
}

// Tiles can start in one of four quadrants NE, SE, SW or NW.
// Two tiles are not allowed to occupy the same quadrant.
ruins.loc = function (name) {
  var row = 0
    , col = 0
    , quad = null

  if (!positions.hasOwnProperty(name)) {
    if (quadrants.length <= 0) {
      quadrants = ['NE','SE','SW','NW']
      PRNG.shuffle(quadrants)
    }

    row = PRNG.randomInclusive(1, 2)
    col = PRNG.randomInclusive(0, 2)
    quad = quadrants.pop()
    if (quad.indexOf('E') > -1) {
      col += 6
    }
    if (quad.indexOf('S') > -1) {
      row += 4
    }

    positions[name] = { row: row, col: col }
  }

  return positions[name]
}

return ruins
}())


var Inventory = (function () {
'use strict';

var $ = window.jQuery
  , o = {}
  , picked = 'sword'
  , inventory = {}
  , usable = []
  , visible = []
  , possible = ['forward','hair','restart','backward','color','bow','hands','github','potion','key','done','twitter']
  , dirty = false

function showItem (item) {
  var index = visible.indexOf(item)
  if (index < 0) {
    visible.push(item)
    dirty = true
  }
}

function hideItem (item) {
  var index = visible.indexOf(item)
  if (index > -1) {
    visible.splice(index, 1)
    dirty = true
  }
}

function equipItem (item) {
  var index = usable.indexOf(item)
  if (index < 0) {
    usable.push(item)
    dirty = true
  }
}

function unequipItem (item) {
  var index = usable.indexOf(item)
  if (index > -1) {
    usable.splice(index, 1)
    dirty = true
  }
}

function isVisible (item) {
  return visible.indexOf(item) > -1
}

o.reset = function () {
  this.loadout('hero')
}

o.render = function () {
  var i = 0
    , key = ''

  if (dirty) {
    for (i = 0; i < possible.length; i += 1) {
      key = possible[i]
      if (!inventory.hasOwnProperty(key)) {
        inventory[key] = $('#'+key)
      }
      inventory[key].remove('picked')

      if (this.usable(key)) {
        inventory[key].remove('used')
      } else {
        inventory[key].add('used')
      }

      if (isVisible(key)) {
        inventory[key].remove('hidden')
      } else {
        inventory[key].add('hidden')
      }
    }
    inventory[picked].add('picked')

    dirty = false
  }
}

o.loadout = function (name) {
  if (name === 'hero') {
    picked = 'forward'
    usable = ['forward','backward','bow','potion']
    visible = ['forward','backward','bow','potion']
  } else if (name === 'fountain') {
    picked = 'hands'
    usable = ['hair','color','done']
    visible = ['hair','color','hands','done']
  } else if (name === 'stairs') {
    picked = 'key'
    usable = ['forward','backward','hands']
    visible = ['forward','backward','hands','key']
  } else if (name === 'restart') {
    picked = 'backward'
    usable = ['restart','github','twitter']
    visible = ['restart','backward','github','twitter']
  }
  dirty = true
}

o.pick = function (item) {
  if (picked !== item) {
    picked = item
    dirty = true
  }
}

o.equipped = function () {
  return picked
}

o.pickup = function (item) {
  equipItem(item)
  showItem(item)
  this.pick(item)
}

o.use = function (item) {
  unequipItem(item)

  if (item === 'bow') {
    hideItem('potion')
    this.pickup('key')
    hideItem('bow')
    this.pickup('hands')
  }
}

o.usable = function (item) {
  return usable.indexOf(item) > -1
}

o.items = function () {
  return possible
}

return o
}())


var Fountain = (function () {
'use strict';

var $ = window.jQuery
  , f = {}
  , element = $('#fountain')
  , row = 0
  , col = 0
  , dirty = false

f.reset = function () {
  var loc = Ruins.loc('fountain')
  row = loc.row
  col = loc.col
  dirty = true
}

f.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

f.row = function () {
  return row
}

f.col = function () {
  return col
}

return f
}())

var Stairs = (function () {
'use strict';

var $ = window.jQuery
  , stairs = {}
  , element = $('#stairs')
  , row = 0
  , col = 0
  , dirty = false

stairs.reset = function () {
  var loc = Ruins.loc('stairs')
  row = loc.row
  col = loc.col
  dirty = true
}

stairs.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

stairs.row = function () {
  return row
}

stairs.col = function () {
  return col
}

return stairs
}())

var Rock = (function () {
'use strict';

var $ = window.jQuery
  , rock = {}
  , element = $('#rock')
  , row = 0
  , col = 0
  , dirty = false

rock.reset = function () {
  var loc = Ruins.loc('rock')
  row = loc.row
  col = loc.col
  dirty = true
}

rock.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

rock.row = function () {
  return row
}

rock.col = function () {
  return col
}

return rock
}())

var Chest = (function () {
'use strict';

var $ = window.jQuery
  , c = {}
  , element = $('#chest')
  , row = 0
  , col = 0
  , locked = false
  , dirty = 0

c.reset = function () {
  var loc = Ruins.loc('chest')
  row = loc.row
  col = loc.col
  locked = false
  dirty = 1 | 2
}

c.render = function () {
  if (dirty & 1) {
    element.top(row * 32)
    element.left(col * 32)
    dirty &= ~1
  }
  if (dirty & 2) {
    if (locked) {
      element.add('locked')
    } else {
      element.remove('locked')
    }
    dirty &= ~2
  }
}

c.row = function () {
  return row
}

c.col = function () {
  return col
}

c.lock = function () {
  locked = true
  dirty |= 2
}

return c
}())


var Monster = (function () {
'use strict';

var $ = window.jQuery
  , m = {}
  , element = $('#monster')
  , row = 0
  , col = 0
  , alive = false
  , dirty = 0

m.reset = function () {
  row = 0
  col = 4
  alive = false
  dirty = 1 | 2
}

m.render = function () {
  if (dirty & 1) {
    element.top(row * 32)
    element.left(col * 32)
    dirty &= ~1
  }
  if (dirty & 2) {
    if (alive) {
      element.add('fast').remove('dead')
    } else {
      element.remove('fast').add('dead')
    }
    dirty &= ~2
  }
}

m.box = function () {
  return element.box()
}

m.row = function (value) {
  if (undefined !== value && row !== value) {
    row = value
    dirty |= 1
  }
  return row
}

m.col = function (value) {
  if (undefined !== value && col !== value) {
    col = value
    dirty |= 1
  }
  return col
}

m.heal = function () {
  if (!alive) {
    alive = true
    dirty |= 2
  }
}

m.dead = function () {
  return !alive
}

return m
}())

var Hair = (function () {
'use strict';

var $ = window.jQuery
  , hair = {}
  , element = $('#hero-hair')
  , style = 0
  , styles = 16
  , color = 0
  , colors = 10
  , direction = 'backward'
  , dirty = 0

hair.reset = function () {
  style = PRNG.randomInclusive(0, styles - 1)
  color  = PRNG.randomInclusive(0, colors - 1)
  direction = 'backward'
  dirty = 1 | 2 | 4
}

hair.render = function () {
  if (dirty & 1) {
    element.unwrap().style.backgroundPosition = '-'+(style * 32)+'px'
    dirty &= ~1
  }
  if (dirty & 2) {
    element.unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('hair-'+direction, {'color':color})+')'
    dirty &= ~2
  }
}

hair.style = function () {
  style += 1
  style %= styles
  dirty |= 1
}

hair.color = function () {
  color += 1
  color %= colors
  dirty |= 2
}

hair.complete = function (quest) {
  if (quest === 'stairs') {
    direction = 'forward'
    dirty |= 2
  }
}

return hair
}())

var Hero = (function () {
'use strict';

var $ = window.jQuery
  , h = {}
  , element = $('#hero')
  , row = 0
  , col = 0
  , dirty = 0

h.reset = function () {
  row = 1
  col = 4
  dirty = 1
}

h.render = function () {
  if (dirty & 2) {
    element.remove('turn')
    dirty &= ~2
    return
  }
  if (dirty & 1) {
    element.remove('turn')
    element.top((row * 32) - 4)
    element.left(col * 32)
    dirty &= ~1
    return
  }
  if (dirty & 4) {
    element.add('turn')
    dirty &= ~4
    return
  }
}

h.box = function () {
  return element.box()
}

h.row = function () {
  return row
}

h.col = function () {
  return col
}

h.move = function (direction) {
  if (direction === 'forward') {
    row -= 1
    dirty |= (1 | 2)
  }
  else if (direction === 'backward') {
    row += 1
    dirty |= (1 | 2)
  }
  else if (direction === 'left') {
    col -= 1
    dirty |= (1 | 2)
  }
  else if (direction === 'right') {
    col += 1
    dirty |= (1 | 2)
  }
  if (row < 1) {
    row = 1
  }
  else if (row > 6) {
    row = 6
  }
  if (col < 0) {
    col = 0
  }
  else if (col > 8) {
    col = 8
  }
}

h.complete = function (quest) {
  if (quest === 'stairs') {
    dirty |= 4
  }
}

return h
}())


;(function (Game) {
'use strict';

var color = undefined

function onUse (target, e) {
  var item = null
    , hbox = null
    , mbox = null
    , hx = 0
    , mx = 0
    , dx = 0
    , quest = null

  item = Inventory.equipped()
  if (!Inventory.usable(item)) {
    return
  }

  hbox = Hero.box()
  mbox = Monster.box()
  hx = hbox.left + (hbox.width / 2)
  mx = mbox.left + (mbox.width / 2)
  dx = Math.abs(hx - mx)

  quest = Quest.current()

  if (item === 'forward') {
    if (dx < 28) {
      Hero.move('forward')
    } else if (hx < mx) {
      Hero.move('left')
      Monster.col(Hero.col())
    } else {
      Hero.move('right')
      Monster.col(Hero.col())
    }
    Score.increment()
  }


  if (item === 'backward') {
    if (dx < 28) {
      Hero.move('backward')
    } else if (hx < mx) {
      Hero.move('right')
      Monster.col(Hero.col())
    } else {
      Hero.move('left')
      Monster.col(Hero.col())
    }
    Score.increment()
  }

  if (item === 'forward' || item === 'backward') {
    if (quest === 'monster' && Monster.dead() && Hero.col() === Monster.col() && Hero.row() - Monster.row() === 1) {
      Emote.say("Are you okay?")
    }
    else if (quest === 'monster' && Monster.dead() && Hero.col() === Monster.col() && Hero.row() - Monster.row() === 2) {
      Emote.say("You don't look good.")
    }
  }

  if (item === 'bow') {
    if (quest === 'chest' && Hero.col() === Chest.col() && Hero.row() === Chest.row()) {
      Inventory.pickup('key')
      Inventory.use('bow')
      Chest.lock()
      Quest.complete('chest')
      Emote.say("Safe and sound.")
    }
  }

  if (item === 'hands') {
    if (quest === 'fountain' && Hero.col() === Fountain.col() && Hero.row() === Fountain.row()) {
      Inventory.loadout('fountain')
      Emote.say("Caves are so filthy.")
    }
  }


  if (item === 'potion') {
    if (quest === 'monster' && Monster.dead() && Hero.col() === Monster.col() && Hero.row() - Monster.row() === 1) {
      Inventory.use('potion')
      Monster.heal()
      Quest.complete('monster')
      Emote.say("You should drink this.")
    } else {
      Emote.say("I need to get closer.")
    }
  }

  if (item === 'key') {
    if (quest === 'rock' && Hero.col() === Rock.col() && Hero.row() === Rock.row()) {
      Inventory.use('key')
      Quest.complete('rock')
      Emote.say("No one will find you.")
    }
  }


  if (item === 'hair') {
    if (quest === 'fountain' && Hero.col() === Fountain.col() && Hero.row() === Fountain.row()) {
      Hair.style()
    }
  }

  if (item === 'color') {
    if (quest === 'fountain' && Hero.col() === Fountain.col() && Hero.row() === Fountain.row()) {
      Hair.color()
    }
  }

  if (item === 'done') {
    if (quest === 'fountain' && Hero.col() === Fountain.col() && Hero.row() === Fountain.row()) {
      Quest.complete('fountain')
      Inventory.loadout('stairs')
      Emote.say("That feels better.")
    }
  }

  if (item === 'restart') {
    newColor()
    window.location.hash = color
  }


  if (quest  === 'stairs' && Hero.col() === Stairs.col() && Hero.row() === Stairs.row()) {
    Quest.complete('stairs')
    Hero.complete('stairs')
    Hair.complete('stairs')
    Inventory.loadout('restart')
    Emote.say("Here we go.")
  }
}

function onTweetScore (target, e) {
  var twitter = 'https://twitter.com/intent/tweet'
    , text = encodeURIComponent("I made it through Rogue Reversal in "+Score.total()+ " steps for @js13kGames. How'd you do?")
    , url = encodeURIComponent(window.location.href)
  target.unwrap().href = twitter + '?text='+text + '&url='+url
}

function onBrowseSource (target, e) {
  var github = 'https://github.com/onefrankguy/rogue-reversal'
  target.unwrap().href = github
}

function onItem (target, e) {
  Inventory.pick(target.unwrap().id)
  onUse(target, e)
}

function render () {
  requestAnimationFrame(render)

  Quest.render()
  Score.render()
  Inventory.render()
  Stairs.render()
  Fountain.render()
  Rock.render()
  Chest.render()
  Monster.render()
  Hero.render()
  Hair.render()
  Emote.render()
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
  Ruins.reset()
  Quest.reset()
  Score.reset()
  Inventory.reset()
  Stairs.reset()
  Fountain.reset()
  Rock.reset()
  Chest.reset()
  Monster.reset()
  Hero.reset()
  Hair.reset()
  Emote.reset()
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
      // Continuing a saved game...
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
    , items = Inventory.items()
    , name = ''
    , i = 0

  for (i = 0; i < items.length; i += 1) {
    html += '<a id="klass" class="klass item"><span id="klass-fx" class="fx"></span></a>'.replace(/klass/g, items[i])
  }

  $('#items').html(html)

  $('#ruins').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('floor')+')'
  $('#monster-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('monster')+')'
  $('#hero-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('hero')+')'
  $('#hero-hair').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('hair-backward')+')'
  $('#stairs-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('sprites')+')'
  $('#rock-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('sprites')+')'
  $('#chest-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('sprites')+')'
  $('#fountain-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('sprites')+')'

  for (i = 0; i < items.length; i += 1) {
    name = items[i]
    if (name  === 'twitter') {
      $('#'+name).touch(onTweetScore)
    } else if (name  === 'github') {
      $('#'+name).touch(onBrowseSource)
    } else {
      $('#'+name).touch(onItem)
    }
    $('#'+items[i]+'-fx').unwrap().style.backgroundImage = 'url('+ImageCache.getDataURL('items')+')'
  }

  $('#room').touch(onUse)
  $(window).on('hashchange', onHashChange)

  startGame(render)
}

})(window.Game = window.Game || {})

Game.play()
