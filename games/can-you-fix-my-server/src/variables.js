const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let isMenu = true
    let grid = canvas.width / 6

    let infiniteMode = true
    let chooseLevel = false

    let selected = false
    let nextDot = {}
    let dotSelected = {x: 0, y: 0, color: ""}
    let mouseX = mouseY = 0
    let mX = mY = 0
    let message = ""
    let description = []
    let level = 0
    let highScore = 0
    let level1 = level2 = level3 = level4 = level5 = level6 = level7 = level8 = level9 = false

    let dot = function() {
      return {
        x: Math.floor(Math.random() * (canvas.width - 10) + 10),
        y: Math.floor(Math.random() * (canvas.height - 10) + 10),
        color: "#fadda2",
        radius: 10,
        flag: false
      }
    }

    let obstacle = function(x, y, w, h) {
      return {
        x: x,
        y: y,
        color: "#6b61ff",
        width: w,
        height: h,
        flag: false
      }
    }
    let dots = []
    let lines = []