"use strict"
const canvas = document.createElement('canvas')
const ctx    = canvas.getContext("2d")
const width  = canvas.width  = window.innerWidth
const height = canvas.height = window.innerHeight
let   mouseX,
      mouseY

// canvas.onmousemove = (e) => {
//     mouseX = e.clientX
//     mouseY = e.clientY
// }


function randomInt(min,max)
{
    return ~~(Math.random() * (max-min)) + min
}

function rgba(r,g,b,a)
{
    return `rgba(${r}, ${g}, ${b}, ${a})`
}


window.onload = () => {
    main()
}


function main()
{
    menu()
}



