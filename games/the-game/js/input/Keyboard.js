var Keys={left:37,up:38,right:39,down:40,space:32,enter:13,};var Keyboard={};Keyboard.init=function(){var that=this;document.onkeydown=handleKeyDown;document.onkeyup=handleKeyUp;function handleKeyDown(evt){if(evt.keyCode==Keys.left){that.leftPressed=!0}
if(evt.keyCode==Keys.right){that.rightPressed=!0}
if(evt.keyCode==Keys.up){that.upPressed=!0}
if(evt.keyCode==Keys.down){that.downPressed=!0}
if(evt.keyCode==Keys.space){if(!that.spacePressed){that.spaceClicked=!0}
that.spacePressed=!0}}
function handleKeyUp(evt){if(evt.keyCode==Keys.left){that.leftPressed=!1}
if(evt.keyCode==Keys.right){that.rightPressed=!1}
if(evt.keyCode==Keys.up){that.upPressed=!1}
if(evt.keyCode==Keys.down){that.downPressed=!1}
if(evt.keyCode==Keys.space){that.spacePressed=!1}}};Keyboard.update=function(){};Keyboard.reset=function(){var that=this;that.spaceClicked=!1}