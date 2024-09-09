;(function () {
  var lastTime = 0
    , vendor = ["ms", "mos", "webkit", "o"]
    , i = 0

  while (i < vendor.length && !window.requestAnimationFrame) {
    window.requestAnimationFrame = window[vendor[i]+"RequestAnimationFrame"]
    window.cancelAnimationFrame = window[vendor[i]+"CancelAnimationFrame"] || window[vendor[i]+"RequestCancelAnimationFrame"]
    i += 1
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime()
        , timeToCall = Math.max(0, 16 - (currTime - lastTime))
        , timerId = setTimeout(function () {
            callback(currTime + timeToCall)
        }, timeToCall)
      lastTime = currTime + timeToCall
      return timerId
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())

;(function () {
  function exists () {
    try {
      return 'localStorage' in window && window['localStorage'] !== null
    } catch (e) {
      return false
    }
  }

  function canRoundTrip () {
    try {
      localStorage.setItem('version', 1)
      return 1 === parseInt(localStorage.getItem('version'), 10)
    } catch (e) {
      return false
    }
  }

  if (!exists() || !canRoundTrip()) {
    function create () {
      var store = {}
      store.setItem = function (id, value) {
        return store[id] = String(value)
      }
      store.getItem = function (id) {
        return store.hasOwnProperty(id) ? String(store[id]) : undefined
      }
      store.removeItem = function (id) {
        return delete store[id]
      }
      store.clear = function () {
        create()
      }
      window.fakeLocalStorage = store
    }
    create()
  }
}())
