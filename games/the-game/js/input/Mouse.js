"use strict";var Mouse={pos:{x:0,y:0},leftDown:!1,leftClick:!1,rightDown:!1,rightClick:!1,middleDown:!1,middleClick:!1,};Mouse.init=function(canvasName){window.addEventListener("mousemove",handleMouseMove);window.addEventListener("mouseup",handleKeyUp);window.addEventListener("mousedown",handleKeyDown);var that=this;var canvas=document.getElementById(canvasName);function handleKeyUp(evt){if(evt.which==1){that.leftDown=!1}
if(evt.which==2){that.middleDown=!1}
if(evt.which==3){that.rightDown=!1}}
function handleKeyDown(evt){if(evt.which==1){if(!that.leftDown){that.leftClick=!0}
that.leftDown=!0}
if(evt.which==2){if(!that.middleDown){that.middleClick=!0}
that.middleDown=!0}
if(evt.which==3){if(!that.rightDown){that.rightClick=!0}
that.rightDown=!0}}
function handleMouseMove(evt){var canvasPos=canvas.getBoundingClientRect();Mouse.pos={x:evt.pageX-canvasPos.left,y:evt.pageY-canvasPos.top}}};Mouse.update=function(){};Mouse.reset=function(){var that=this;that.leftClick=!1;that.rightClick=!1;that.middleClick=!1}