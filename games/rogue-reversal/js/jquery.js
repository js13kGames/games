;(function () {
'use strict';

var animations = []

function Fn (selector) {
  if (selector instanceof Fn) {
    return selector
  }

  this.element = selector

  if (typeof selector === 'string') {
    if (selector.indexOf('#') === 0) {
      this.element = document.getElementById(selector.slice(1))
    }
  }

  return this
}

Fn.prototype.left = function (value) {
  if (this.element) {
    if (value === undefined) {
      return parseInt(this.element.style.left, 10)
    }
    this.element.style.left = value + 'px'
  }
  return this
}

Fn.prototype.top = function (value) {
  if (this.element) {
    if (value === undefined) {
      return parseInt(this.element.style.top, 10)
    }
    this.element.style.top = value + 'px'
  }
  return this
}

Fn.prototype.html = function (value) {
  if (this.element) {
    if (value === undefined) {
      return this.element.innerHTML;
    }
    this.element.innerHTML = value
  }
  return this
}

Fn.prototype.add = function (klass) {
  if (this.element) {
    this.element.classList.add(klass)
  }
  return this
}

Fn.prototype.remove = function (klass) {
  if (this.element) {
    this.element.classList.remove(klass)
  }
  return this
}

Fn.prototype.toggle = function (klass) {
  if (this.element) {
    this.element.classList.toggle(klass)
  }
  return this
}

Fn.prototype.touch = function (start, end) {
  var self = this
  if (this.element) {
    if ('ontouchstart' in document.documentElement === false) {
      this.element.onmousedown = function (event) {
        if (start) {
          start(self, event)
        }
        document.onmousemove = function (event) {
          event.preventDefault()
        }
        document.onmouseup = function (event) {
          if (end) {
            end(self, event)
          }
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    } else {
      this.element.ontouchstart = function (event) {
        if (start) {
          start(self, event)
        }
        document.ontouchmove = function (event) {
          event.preventDefault()
        }
        document.ontouchend = function (event) {
          if (end) {
            end(self, event)
          }
          document.ontouchmove = null
          document.ontouchend = null
        }
      }
    }
  }
  return this
}

Fn.prototype.on = function (message, callback) {
  if (this.element) {
    this.element.addEventListener(message, callback, false)
  }
  return this
}

Fn.prototype.off = function (message, callback) {
  if (this.element) {
    this.element.removeEventListener(message, callback, false)
  }
  return this
}

Fn.prototype.animate = function (klass, callback) {
  var self = this

  function onTransitionEnd () {
    var i = 0
      , temp = []

    for (i = 0; i < animations.length; i += 1) {
      if (animations[i].element !== self &&
          animations[i].callback !== onTransitionEnd &&
          animations[i].klass !== klass) {
        temp.push(animations[i])
      }
    }
    animations = temp

    self.off('webkitAnimationEnd', onTransitionEnd)
    self.off('oanimationend', onTransitionEnd)
    self.off('animationend', onTransitionEnd)
    self.remove(klass)
    if (callback) {
      callback()
    }
  }

  if (this.element) {
    animations.push({ element: self, callback: onTransitionEnd, klass: klass })
    this.on('webkitAnimationEnd', onTransitionEnd)
    this.on('oanimationend', onTransitionEnd)
    this.on('animationend', onTransitionEnd)
    this.add(klass)
  }

  return this
}

Fn.prototype.box = function () {
  var doc = null
    , box = null
    , win = null
    , elm = null
    , x = 0
    , y = 0
    , op = null

  if (this.element) {
    box = this.element.getBoundingClientRect()
    if (box.width || box.height) {
      x = box.left
      y = box.top
      op = this.element.offsetParent
      while (op) {
        x -= op.offsetLeft
        y -= op.offsetTop
        op = op.offsetParent
      }
    }
    return { top: y, left: x, width: box.width, height: box.height, right: x + box.width, bottom: y + box.height }
  }

  return null
}

Fn.prototype.unwrap = function () {
  return this.element
}

function root (selector) {
  return new Fn(selector)
}

window.jQuery = root
})()
