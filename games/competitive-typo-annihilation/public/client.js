"use strict";

var socket = io(), blaster = document.querySelector("#mega"), ldr = document.querySelector("#leaderboard ol"), msgs = document.querySelector("#messages ul")
socket.on("newWord", function (word) {
  blaster.placeholder = word
  blaster.value = word
  blaster.focus()
  blaster.setSelectionRange(word.length, word.length)
})
function overflow(lstslctr, lmt) {
  while (document.querySelectorAll(lstslctr+" > li").length > lmt) document.querySelector(lstslctr+" > li").remove()
}
socket.on("message", function (msg) {
  let msgli = document.createElement("li")
  msgli.textContent = msg
  msgs.appendChild(msgli)
  overflow("#messages ul", 10)
})
socket.on("leaderboard", function (scores) {
  while (ldr.firstChild) ldr.removeChild(ldr.firstChild)
  for (let score of scores) {
    let scoreli = document.createElement("li")
    scoreli.textContent = score[0] + ": " + score[1]
    ldr.appendChild(scoreli)
  }
})
blaster.addEventListener("input", function() {
  socket.emit("try", blaster.value)
})
socket.emit("register", prompt("Choose your username", ""))
