;(function () {
'use strict';

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

Fn.prototype.html = function (value) {
  if (this.element) {
    if (value === undefined) {
      return this.element.innerHTML
    }
    this.element.innerHTML = value
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

Fn.prototype.has = function (klass) {
  if (this.element) {
    return this.element.classList.contains(klass)
  }
  return false
}

Fn.prototype.reset = function (klass) {
  if (this.element) {
    this.element.className = klass
  }
  return this
}

Fn.prototype.touch = function (start, end) {
  var self = this

  if (this.element) {
    if ('ontouchstart' in document.documentElement === false) {
      this.element.onmousedown = function (e) {
        if (start) {
          start(self, e)
        }
        document.onmousemove = function (e) {
          e.preventDefault()
        }
        document.onmouseup = function (e) {
          if (end) {
            end(self, e)
          }
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    } else {
      this.element.ontouchstart = function (e) {
        if (start) {
          start(self, e)
        }
        document.ontouchmove = function (e) {
          e.preventDefault()
        }
        document.ontouchend = function (e) {
          if (end) {
            end(self, e)
          }
          document.ontouchmove = null
          document.ontouchend = null
        }
      }
    }
  }

  return this
}

Fn.prototype.unwrap = function () {
  return this.element
}

function root (selector) {
  return new Fn(selector)
}

window.jQuery = root
})()
