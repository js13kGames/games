"use strict"
const gPathMax = 9999,
	gStateWin='win',
	gStateWin2='win2',
	gStateTitle='title',
	gStateTitleGo='titleGo',
	gStateGo='go',
	gStateInput='input',
	gStateDraw='draw',
	gStateRetry='retry',
	gStateDrawFail='drawFail'
let gLog=console.log.bind(console),
	gAudioContext = new AudioContext(),
	gMuted,
	gLoops=0,
	gLevel=1,
	gCamX=0,
	gCamY=-2,
	gPageX=0,
	gPageY=0,
	gGems=[],
	gHintShowing,
	gStateLoops,
	gMouseX,
	gMouseY,
	gMouseOldX,
	gMouseOldY,
	gMouseDown,
	gMouseHit,
	gClicked,
	gMouseStartX,
	gMouseStartY,
	gCloudSizeY,
	gGameX,
	gGameSizeX,
	gGameSizeY,
	gPen,
	gState,
	gPathX,
	gPathY,
	gPathX2,
	gPathY2,
	gPathI,
	gPathEndI,
	gGoalPathI,
	gPaths=new Uint8Array(gPathMax),
	gRainbowColors='F47,FA0,FE0,7D8,7BF,C7F,F8C'.split(','),
	u

let gRandomFake = (seed) => {
	return Math.abs(Math.sin(seed*seed))*1e8%1
}

let gStateSet = (state) => {
	gLog("gStateSet from",gState,'to',state)
	gState = state
	gStateLoops = 0
}

let gGameUpdate = () => {
	setTimeout(gGameUpdate, 20)
	gLoops++
	gStateLoops++
	gCursorSet('auto')

	if(gState == gStateWin) {
		if(gGemsDone()) {
			gLevelWinDone()
		}
	}
	
	gGameDraw()
	gClicked = gMouseHit = 0
}

let gLevelWinDone = () => {
	gLevel++
	if(gLevel > 11) {
		gStateSet(gStateTitle)
		gPathI = gPathEndI = 0
		gCamX = 0
		gCamY = -2
		return
	}
	gPathI = gPathEndI = 0
	gStateSet(gStateWin2)
	gSoundPlay(gWinSound)
	gLevelSetup()
}

let gGemsDone = () => {
	for(var gem of gGems) {
		if(!(gem.pathI < 0)) {
			return
		}
	}
	return 1
}

let gScaleX = num => {
	return (num+gPageX-gCamX)*gGameSizeX
}
let gScaleY = num => {
	return (num+gPageY-gCamY)*gGameSizeX
}
let gScale = num => {
	return num*gGameSizeX | 0
}

let gLineDraw = (x1,y1,x2,y2,thickness,color) => {
	if(color) {
		gPen.strokeStyle = color
	}
	x1 = gScaleX(x1)
	y1 = gScaleY(y1)
	x2 = gScaleX(x2)
	y2 = gScaleY(y2)
	thickness = gScale(thickness)
	
	gPen.beginPath()
	gPen.lineWidth = thickness||1
	gPen.moveTo(x1,y1)
	gPen.lineTo(x2,y2)
	gPen.stroke()
}

let gCircleDraw = (x, y, r, color, strokeSize, start, end) => {
	if(color) {
		gPen.fillStyle = color
	}
	x = gScaleX(x)
	y = gScaleY(y)
	r = gScale(r)
	gPen.beginPath()
	gPen.arc(x, y, r, (start||0)*2*Math.PI, (end||1)*2*Math.PI)
	if(strokeSize) {
		gPen.lineWidth = gScale(strokeSize)
		if(color) {
			gPen.strokeStyle = color
		}
		gPen.stroke()
	} else {
		gPen.fill()
	}
}

let gPathStringDraw = (x, y, pathString, mult, color, strokeSize, strokeColor) => {
	if(color) {
		gPen.fillStyle = gPen.strokeStyle = color
	}
	if(strokeColor) {
		gPen.strokeStyle = strokeColor
	}
	x = gScaleX(x-mult/2)
	y = gScaleY(y-mult/2)
	mult /= 64
	//M27,51Q0,59 7,49Q25,26 31,4Q34,0 37,4Q43,27 60,49Q63,56 41,51Q41,57 34,57Q27,57 27,51
	pathString = pathString.replace(/[0-9]+\,/g, v => (x+parseInt(v)*gGameSizeX*mult|0)+',')
	pathString = (pathString+' ').replace(/[0-9]+ /g, v => (y+parseInt(v)*gGameSizeX*mult|0)+' ')
	pathString = pathString.replace(/[0-9]+L/g, v => (y+parseInt(v)*gGameSizeX*mult|0)+'L')
	pathString = pathString.replace(/[0-9]+Q/g, v => (y+parseInt(v)*gGameSizeX*mult|0)+'Q')
	var path = new Path2D(pathString)
	gPen.fill(path)

	if(strokeSize) {
		gPen.lineWidth = gScale(strokeSize)
		gPen.stroke(path)
	}
}

let gOvalDraw = (x,y,rX,rY,color,angle) => {
	if(color) {
		gPen.fillStyle = color
	}
	x = gScaleX(x)
	y = gScaleY(y)
	rX = gScale(rX)
	rY = gScale(rY)
	gPen.beginPath()
	if(angle) {
		gPen.save()
		gPen.translate(x,y)
		gPen.rotate(angle)
		gPen.ellipse(0, 0, rX, rY, 0, 0, 2*Math.PI)
		gPen.restore()
	} else {
		gPen.ellipse(x, y, rX, rY, 0, 0, 2*Math.PI)
	}
	gPen.fill()
}

let gRectDraw = (x, y, sizeX, sizeY, color) => {
	if(color) {
		gPen.fillStyle = color
	}
	x = gScaleX(x)
	y = gScaleY(y)
	sizeX = gScale(sizeX)
	sizeY = gScale(sizeY)
	gPen.fillRect(x,y,sizeX,sizeY)
}

let gTextDraw = (text, x, y, size, color) => {
	if(size) {
		size = gScale(size)
		gPen.font = '900 '+size+'px comic sans ms, arial'
	}
	if(color) {
		gPen.fillStyle = color
	}
	x = gScaleX(x)
	y = gScaleY(y)
	gPen.fillText(text,x,y)
}

let gAlphaSet = (a) => {
	gPen.globalAlpha = a===u?1:a
}

let gButtonDrawDownY=0,gButtonDrawHit
let gButtonDraw = (x,y, sizeX,sizeY, text, invisible) => {
	gButtonDrawDownY=gButtonDrawHit=0
	if(gPointInRect(gMouseX+(-gPageX+gCamX)*gGameSizeX,gMouseY+(-gPageY+gCamY)*gGameSizeX,x*gGameSizeX,y*gGameSizeX,sizeX*gGameSizeX,sizeY*gGameSizeX)) {
		gCursorSet('pointer')
		if(gMouseDown) {
			gButtonDrawDownY = .008
		}
		if(gMouseHit) {
			gSoundPlay(gClickDownSound)
		}
		if(gClicked) {
			gButtonDrawHit = 1
			gSoundPlay(gClickSound)
		}
	}
	/*
	for(var layer=0; layer<3; layer++) {
		for(var i=0; i<8; i++) {
			var a = i*.81
			gCircleDraw(
				x+sizeX/2+Math.cos(a)*sizeX*.3,
				y+sizeY*(.96-layer*.2)+Math.sin(a)*sizeX*(a<4?.05:.3) + (layer*gButtonDrawDownY)+gButtonDrawDownY,
				sizeX*(.23-.05*Math.abs(Math.cos(a))),
				!layer?'#0002':(layer>1?'#FFF':'#DEF')
			)
		}
	}
		*/
	if(!invisible) {
		gPen.save()
		var addX = Math.cos(gLoops*.1)*sizeX*.05
		var addY = Math.sin(gLoops*.1)*sizeY*.04
		gPen.scale(1+addX, 1+addY)
		for(var layer=0; layer<4; layer++) {
			gPathStringDraw(
				x-addX/2+sizeX/2,
				y-addY/2+sizeY/2+sizeX*.1-sizeX*[.05,.09-gButtonDrawDownY*2,.16-gButtonDrawDownY*5,.15-gButtonDrawDownY*5][layer],
				"M4,33Q5,25 11,25Q11,14 24,16Q26,12 32,12Q38,12 40,17Q50,15 50,25Q55,26 55,33Q54,39 49,40Q48,47 40,47Q38,50 30,50Q20,50 20,47Q11,49 9,41Q4,39 4,33",
				sizeX*[1.35,1.28,1.21,1.2][layer],
				['#0002','#DEF','#BBB','#FFF'][layer]
			)
		}
		
		//gRectDraw(x,y+.01,sizeX,sizeY,'#531')
		//gRectDraw(x,y+gButtonDrawDownY,sizeX,sizeY,'#B75')
		gTextDraw(text, x-addX/2+sizeX/2, y-addY/2+sizeY/2+.01+gButtonDrawDownY, sizeX*.28,'#87D')
		gPen.restore()
	}
	return gButtonDrawHit
}

let gCursor='auto'
let gCursorSet = (cursor) => {
	if(gCursor != cursor) {
		gCursor = cursor
		document.body.style.cursor = cursor
	}
}

var gEaseGet = (num,start,end,min,max,linear) => {
	var percent = gPercentGet(num, start, end)
	if(percent < .5)
		percent = percent*percent*2
	else
		percent =  1 - (1-percent)*(1-percent) * 2
	
	if(min === u)return percent
	
	return gFarGet(percent, min, max)
}

// Returns a percentage of how far num has gone from start to end
var gPercentGet = (num,start,end) => {
	if(start < end)
		num = gClamp(num,start,end)
	else
		num = gClamp(num,end,start)
	
	return (num - start)/(end - start)
}

var gFarGet = (percent, min, max) => {
	return min + percent*(max-min)
}

var gClamp = (v, lo, hi) => {
	if(hi===u) {
		hi = lo
		lo = -lo
	}
	return Math.min(hi, Math.max(v, lo))
}

let gOr2 = (v,a,b) => {
	return v==a || v==b
}

let gOr3 = (v,a,b,c) => {
	return v==a || v==b | v==c
}

let gGemKindGoal = {emoji:'🦄'}
let gGemKindGem = {emoji:'💎'}
let gGemMake = (kind,x,y,size) => {
	x += gLevel-1
	var gem = {kind,x,y,size}
	gGems.push(gem)
}

let gYouArrowDraw = () => {
	if(gState==gStateDraw && gMouseDown && gPathI) {
		var x = gPathX
		var y = gPathY
		if(x!=gPathX2 || y!=gPathY2) {
			var angle = Math.atan2(gPathY2-y, gPathX2-x)
			gLog(angle)
			x /= gGameSizeX
			y /= gGameSizeX
			x += gCamX
			y += gCamY
			var far = .4
			var x2 = x+Math.cos(angle)*far
			var y2 = y+Math.sin(angle)*far
			gLineDraw(x, y, x2, y2, .02, '#AAA')
			var angle2 = angle+Math.PI*.8
			var far = .16
			gLineDraw(x2, y2, x2+Math.cos(angle2)*far, y2+Math.sin(angle2)*far, .02)
			var angle2 = angle-Math.PI*.8
			gLineDraw(x2, y2, x2+Math.cos(angle2)*far, y2+Math.sin(angle2)*far, .02)
		}
	}
}

let gGameDraw = () => {
	gPen.fillStyle = '#ABF'
	gPen.fillRect(0,0,1e4,1e4)

	if(gState == gStateTitle || gState == gStateTitleGo) {

		gPageY = -2
		
		gTextDraw("🌞", .1, .1, .2)
		if(gState == gStateTitleGo) {
			gCamY = gEaseGet(gStateLoops,0,30,-2,0)
		}
		
		var y = .16
		for(var x=0; x<16; x++) {
			gCircleDraw(x/15, y+Math.sin(x)*.01, .04, '#FFF')
		}
		gRectDraw(0,y,1,2,'#FFF')

		for(var line=0; line<2; line++) {
			var text=line?"⭐RESCUE!⭐":"RAINBOW"
			var len = text.length
			gPen.font = '900 '+gScale(line?.12:.18)+'px arial'
			var angle=4
			for(var i=0; i<len; i++) {
				var letter = text[i]
				//angle=3.14+i/(len-1)*3.14
				//gLog(i,angle)
				gPen.save()
				gPen.translate(
					gScaleX(.5+Math.cos(angle)*.5) + Math.sin(gLoops/7+1+i)*(2-line),
					gScaleY(.86+line*.2+Math.sin(angle)*.5) + Math.sin(gLoops/7+i)*(2-line)
				)
				gPen.rotate(angle+Math.PI/2)
				gPen.fillStyle = '#'+(line?'97E':gRainbowColors[i])
				gPen.fillText(letter,0,gScaleY(.01))
				gPen.fillStyle = '#0005'
				gPen.fillText(letter,0,gScaleY(.01))
				gPen.fillStyle = '#'+(line?'97E':gRainbowColors[i])
				gPen.fillText(letter,0,0)
				gPen.restore()
				//gTextDraw("Rainbow"[i], .5+(i-3)*.1, .8+Math.sin(a)*.05, .2, '#F0F')
				angle+=line?.18:.25
				if(letter=='I' || text[i+1]=='I' || text[i+1]=='!')angle-=.06
				if(letter=='⭐')angle+=.06
			}
		}
		//gTextDraw("Rainbow Rescue", .5, .8, .1, '#F0F')
		gTextDraw("Unicorns need your help!", .5, .85, .05, '#F0F')
		gTextDraw("You must send rainbows down", .5, .9, .05, '#F0F')
		gTextDraw("from the clouds to reach them", .5, .95, .05, '#F0F')
		gTextDraw("to give them magic flying powers.", .5, 1, .05, '#F0F')

		var sizeX = .38
		if(gButtonDraw(.5-sizeX/2, 1.14, sizeX, .23, "PLAY")) {
			gStateSet(gStateTitleGo)
			gLevel = 1
			gLevelSetup()
			gFooter.style.display = 'none'
		}

		if(gState == gStateTitleGo) {
			gAlphaSet(gEaseGet(gStateLoops,0,10,1,0))
		}
		gUniDraw(.19,2.35,.18)
		gAlphaSet()
		
		if(gState == gStateTitleGo) {
			if(gStateLoops>29) {
				gStateSet(gStateInput)
			}
		}
	}
	
	gPageX = gLevel-1
	gPageY = 0
	gRectDraw(-1,0,2,gCloudSizeY/gGameSizeX,'#FFF')

	
	if(gState==gStateWin2) {
		gCamX = gEaseGet(gStateLoops,0,33,gLevel-2,gLevel-1)
		if(gStateLoops > 33) {
			gStateSet(gStateInput)
			gSongMake(gBattleSong, 2)
		}
	}
	
	var y = gCloudSizeY
	var x1 = gState==gStateWin2?-30:0
	for(var layer=0; layer<2; layer++) {
		for(var x=x1; x<gLevel*16+16; x++) {
			gCircleDraw(x/15-gPageX, y/gGameSizeX+Math.sin(x)*.01-layer*.03, .05-layer*.01, layer?'#FFF':'#DDF')
		}
	}

	gLevelDraw()
	gPageX = 0
	if(gState != gStateTitleGo) {
		gTextDraw("Level "+gLevel,gCamX+.07,.022,.03,'#000')
	}

	var x = gCamX+.01
	var y = gCamY+1.89
	var sizeX = .1
	var sizeY = .1
	if(gButtonDraw(x,y,sizeX,sizeY,'',1)) {
		gMuted = !gMuted
	}
	gTextDraw(gMuted?'🔈':'🔊', x+sizeX/2, y+sizeY/2+gButtonDrawDownY, sizeX*.6)
	//gRectDraw(x,y,sizeX,sizeY)
	
	if(gLevel > 2 && !gHintShowing && gState == gStateInput) {
		if(gButtonDraw(gCamX+.7, 1.8, .25, .15, "HINT")) {
			gHintShowing = gLoops
		}
	}

	/*
	var size = gGoalSize*1.3
	if(gPointInRect(gMouseX,gMouseY,gGoalX-size/2,gGoalY-size*.6,size,size)) {
		gCursorSet('help')
	}
	*/
	
	gYouArrowDraw()

	gPathDraw()

	
	if(gState == gStateDrawFail) {
		gTextDraw('You touched the sky ☹', gCamX+.5, .1, .08, '#000')
		gTextDraw('Draw in the clouds only!', gCamX+.5, .18, .07, '#000')
		gAlphaSet(Math.abs(Math.sin(gStateLoops/4)))
		gTextDraw('❌', gPathX2/gGameSizeX, gPathY2/gGameSizeX, .1)
		gAlphaSet()
		if(gButtonDraw(gCamX+.5-.26/2, .28, .26, .15, "OKAY")) {
			gStateSet(gStateInput)
			gPathI = gPathEndI = 0
		}
	} else {
		if(gLevel == 1) {
			if(gOr2(gState,gStateInput,gStateTitleGo)) {
				if(gState == gStateTitleGo) {
					gAlphaSet(gEaseGet(gStateLoops,20,30,0,1))
				}
				gTextDraw('Draw a rainbow.', .5, .1, .1, '#000')
				gTextDraw('Draw on the cloud only.', .5, .17, .07, '#000')
				gTextDraw('Point it downward to reach the unicorn.', .5, .225, .045, '#000')
				var addY = (gStateLoops%40)/40*.2
				var x = .5
				var y = .35
				gLineDraw(x-.01,y,x-.01,y+addY,.02,'#F0F')
				gTextDraw('👆', x, y+addY, .1)
				gAlphaSet()
			}
		}
	}
	
	for(var gem of gGems) {
		var gotLoop = gLoops-gem.gotLoop
		var size = gem.size
		if(gem.gotLoop && gotLoop < 5) {
			size += Math.sin(gotLoop/5*3.14)*.02
			gLog(size, gLoops,gem.gotLoop)
		}
		//gTextDraw(gem.kind.emoji, gem.x, gem.y, size, '#FFF')
		gUniDraw(gem.x, gem.y, size*.17)
	}
	
	if(gState == gStateRetry) {
		var sizeX = .41
		if(gButtonDraw(gCamX+.5-sizeX/2, .3, sizeX, .23, "RETRY")) {
			gStateSet(gStateInput)
			gLevelSetup()
		}
	}
	
}

let gUniDraw = (x,y,size) => {
	//tail
	var s = "M17,32Q21,32 22,28Q28,2 47,8Q52,10 56,17L53,23Q42,19 40,40Q38,55 25,54Q14,51 11,41L16,43Q8,34 12,27Q13,32 17,32"
	gPathStringDraw(x-size*3.3,y-size*.05, s, size*3.5,'#f9e',size*.17,'#74c')

	//body back layer
	s = "M7,38L7,16L40,16L47,40L38,41L34,23L22,23Q22,25 18,29L18,39L7,38"
	gPathStringDraw(x+size*.25,y+size*1.5, s,size*5,'#DCF',size*.15,'#AAA')
	gUniHoofDraw(x-size*1.3, y+size*1.7, size*1.4, .02)
	gUniHoofDraw(x+size*1.18, y+size*1.8, size*1.4, -.3, 1)
	
	//body
	s = "M11,60L2,57L5,47Q6,46 7,46Q8,45 7,44Q4,37 9,32Q12,30 18,29L29,24L30,12L35,9L39,8Q37,4 41,0Q44,2 44,7L50,19Q55,19 53,25Q51,31 39,29Q41,40 36,44L40,55L33,59L28,48Q24,49 17,48Q16,50 13,51L11,60"
	gPathStringDraw(x+size*1,y-size*1, s,size*8,'#FFF',size*.15,'#AAA')

	//hoof
	gUniHoofDraw(x-size*2.1, y+size*1.8, size*1.6, .2)
	gUniHoofDraw(x+size*1.48, y+size*1.8, size*1.45, -.4, 1)

	// hair
	s = "M15,52Q8,49 7,44Q6,42 7,41Q11,42 12,41Q3,41 7,31Q8,33 10,34Q15,36 14,29Q17,19 26,19Q30,20 32,18Q39,11 47,19Q51,26 54,21Q59,27 55,30Q47,35 41,26Q41,29 36,28L37,26Q36,24 32,26L30,27Q26,35 29,38Q30,42 29,42L27,40Q29,45 23,50Q20,53 15,52"
	gPathStringDraw(x+size*1.4,y-size*2.9, s,size*6,'#f9e',size*.17,'#74c')

	// ear
	s = "M35,49Q22,39 28,22Q39,29 43,41L35,49"
	gPathStringDraw(x+size*1.1, y-size*4, s, size*3.5,'#FFF',size*.15,'#AAA')
	gPathStringDraw(x+size*1.14, y-size*3.9, s, size*2,'#FBF')
	gLineDraw(x+size*1.23, y-size*3.1, x+size*1.6, y-size*3.45, size*.22, '#FFF')

	// horn
	s = "M18,46Q13,39 13,36L43,7Q49,3 48,10L25,49Q21,51 18,46"
	gPathStringDraw(x+size*3, y-size*4.1, s, size*2,'#fe7',size*.1,'#e92')
	gLineDraw(x+size*2.55, y-size*4.1, x+size*3, y-size*4, size*.1,'#e92')
	gLineDraw(x+size*2.87, y-size*4.4, x+size*3.2, y-size*4.34, size*.1,'#e92')
	gLineDraw(x+size*3.18, y-size*4.7, x+size*3.38, y-size*4.65, size*.1,'#e92')
	
	//nostril
	gCircleDraw(x+size*3.2, y-size*2.2, size*.11, '#FAC')

	//eye
	gCircleDraw(x+size*2.1, y-size*2.6, size*.33, '#000', size*.15, .5, 0)
	
	//mouth
	gCircleDraw(x+size*3.05, y-size*1.96, size*.33, '#a7b', size*.14, .25, .45)
	
	//cheek
	gCircleDraw(x+size*1.8, y-size*2.2, size*.3, '#FDF')

	s = "M17,11Q28,8 32,19Q39,7 49,12Q63,22 32,50Q0,21 17,11"
	gPathStringDraw(x-size*1.5,y-size*.21, s,size*1,'#fac')
	

	//gRectDraw(x,y,.01,.01,'#F0F')
}

let gUniHoofDraw = (x,y,size,angle,right) => {
	var s = "M30,62Q9,62 9,56L10,40Q32,47 54,41L54,56Q52,62 30,62"
	if(right)s="M33,58Q14,62 12,56L10,40Q35,42 51,29L57,46Q56,54 33,58"
	//gPen.save()
	//gPen.translate(gScaleX(x+size/2)+gCamX*gGameSizeX,gScaleY(y+size/2))
	//gPen.rotate(angle)
	gPathStringDraw(x, y-size*.02, s, size*1.15,'#74c')
	gPathStringDraw(x, y, s, size,'#c8f')
	//gPen.restore()
}

let gLevelSetup = () => {
	gGems = []
	if(gLevel == 1) {
		gGemMake(gGemKindGoal, .5, 1.75, .16)
	}
	if(gLevel == 2) {
		gGemMake(gGemKindGoal, .72, 1.8-.1/2, .14)
	}
	if(gLevel == 3) {
		gGemMake(gGemKindGoal, .13, 1.8-.1/2, .14)
	}
	if(gLevel == 4) {
		gGemMake(gGemKindGoal, .27, 1, .14)
		gGemMake(gGemKindGoal, .4, 1.75, .14)
	}
	if(gLevel == 5) {
		gGemMake(gGemKindGoal, .4, 1.29, .14)
		gGemMake(gGemKindGoal, .6, 1.29, .14)
	}
	if(gLevel == 6) {
		gGemMake(gGemKindGoal, .45, .95, .14)
		gGemMake(gGemKindGoal, .42, 1.35, .14)
	}
	if(gLevel == 7) {
		gGemMake(gGemKindGoal, .88, 1.32, .17)
	}
	if(gLevel == 8) {
		gGemMake(gGemKindGoal, .3, .997, .14)
		gGemMake(gGemKindGoal, .3, 1.34, .14)
		gGemMake(gGemKindGoal, .3, 1.707, .14)
	}
	if(gLevel == 9) {
		gGemMake(gGemKindGoal, .68, 1.4, .17)
	}
	if(gLevel == 10) {
		gGemMake(gGemKindGoal, .2, 1.5, .18)
		gGemMake(gGemKindGoal, .8, 1.5, .18)
	}
	if(gLevel == 11) {
		var poss = [
			0,0,
			2,0,
			0,1,
			2,1,
			1,2,
			1,3,

			5,1,
			4,2,
			6,2,
			5,3,
			
			8,1,
			10,1,
			8,2,
			10,2,
			9,3,

			0,5,
			0,6,
			2,5,
			2,6,
			4,5,
			4,6,
			4,7,
			0,7,
			2,7,
			1,8,
			3,8,
			
			6,5,
			6,7,
			6,8,
			
			8,6,
			9,6,
			10,6,
			8,7,
			10,7,
			8,8,
			10,8,
		]
		for(var i=0; i<poss.length; i+=2) {
			gGemMake(gGemKindGoal, .08+poss[i]*.085, .8+poss[i+1]*.09, .1)
		}
	}
}

let gLevelDraw = () => {
	gPageX = gLevel-(gState==gStateWin2?2:1)
	gPageX = 0
	if(gState==gStateTitle)return

	var hintLoops = gLoops - gHintShowing
	
	if(Math.abs(gLevel-1)<2) {
		gGrassDraw(0, 1.8, 1.01, .61)
		gFlowerDraw(.1, 1.8, .03)
		gFlowerDraw(.9, 1.8, .03)
	}
	
	if(Math.abs(gLevel-2)<2) {
		gPageX = 1
		gGrassDraw(0, 1.8, 1.01, .61)
		gFlowerDraw(.84, 1.8, .03)
	}
	
	if(Math.abs(gLevel-3)<2) {
		gPageX = 2
		gGrassDraw(0, 1.8, 1.01, .61)
		gFlowerDraw(.8, 1.8, .03)
		gFlowerDraw(.7, 1.8, .03)
		gFlowerDraw(.6, 1.8, .03)
		gFlowerDraw(.5, 1.8, .03)
		if(gHintShowing) {
			for(var i=0; i<=50; i++) {
				var far=i/50
				var x = .79-far*.1
				var y = .25+far*.25
				gCircleDraw(x,y,.01,'#A0F')
				if(i == hintLoops%63 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}

	//Draw level 2 tree after level 3 grass. because you can see this tree on level 2.
	if(Math.abs(gLevel-2)<2 || (gLevel==4 && gState==gStateWin2)) {
		gPageX = 1
		gTreeDraw(.9, 1.1, .14, .72)
	}
	
	if(Math.abs(gLevel-4)<2) {
		gPageX = 3
		gGrassDraw(0, 1.8, 1.01, .61)
		gFlowerDraw(.15, 1.8, .03)
		gFlowerDraw(.96, 1.8, .03)
		if(gHintShowing) {
			for(var i=0; i<=50; i++) {
				var far=i/50
				var x = .15+far*.06
				var y = .25+far*.25
				gCircleDraw(x,y,.01,'#A0F')
				if(i == hintLoops%63 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}

	if(Math.abs(gLevel-3)<2 || (gLevel==5 && gState==gStateWin2)) {
		gPageX = 2
		gTreeDraw(.9, 1.3, .14, .52)
	}
	
	if(Math.abs(gLevel-5)<2) {
		gPageX = 4
		gGrassDraw(0, 1.33, 1.01, .7)
		if(gHintShowing) {
			for(var i=0; i<=50; i++) {
				var far=i/50
				var a = (far-.5)*3.14
				var x = .4+Math.cos(a)*.2
				var y = .5+Math.sin(a)*.05
				gCircleDraw(x,y,.01,'#A0F')
				if(i == hintLoops%63 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}
	
	if(Math.abs(gLevel-6)<2) {
		gPageX = 5
		gGrassDraw(0, 1.4, 1.01, .61)
		gTreePineDraw(.2, 1.14, .12, .28)
		gFlowerDraw(.16, 1.4, .03)
		gFlowerDraw(.92, 1.4, .03)
		//gTreeDraw(.7, 1.3, .14, .52)
		
		if(gHintShowing) {
			var radius = .19
			var centerX = .44
			var centerY = .37
			for(var loop=0; loop<100; loop++) {
				var angle = Math.PI/2*3.01+ loop/100*Math.PI
				var x = centerX + Math.cos(angle) * radius * 1.5
				var y = centerY + Math.sin(angle) * radius
				gCircleDraw(x,y,.01,'#A0F')
				if(loop == hintLoops%133 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}
	
	if(Math.abs(gLevel-7)<2) {
		gPageX = 6
		gGrassDraw(0, 1.38, 1.01, .63)
		//gGrassDraw(.9, .9, .2, 1)
		gGrassDraw(.65, .65, .402, .4)
		gGrassDraw(.5, .65, .91, .2)
		gGrassDraw(0, 1.15, .78, .5)
		gGrassDraw(0, .95, .55, .4)
		gFlowerDraw(.08, .95, .03)
		if(gHintShowing) {
			for(var i=0; i<=50; i++) {
				var far=i/50
				var x = .12
				var y = .29+Math.min(far,.5)*.41
				if(far>.5) {
					x+=(far-.5)*.34
				}
				gCircleDraw(x,y,.01,'#A0F')
				if(i == hintLoops%63 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}

	if(Math.abs(gLevel-8)<2) {
		gPageX = 7
		gGrassDraw(0, 1.04, .41, .17)
		gFlowerDraw(.12, 1.04, .03)
		gGrassDraw(0, 1.38, .41, .17)
		gGrassDraw(0, 1.75, 1.01, .26)
		gTreePineDraw(.9, 1.39, .12, .38)
		if(gHintShowing) {
			var radius = .19
			var centerX = .32
			var centerY = .37
			for(var loop=0; loop<100; loop++) {
				var angle = Math.PI/2*3.01+ loop/100*Math.PI
				var x = centerX + Math.cos(angle) * radius * 1.5
				var y = centerY + Math.sin(angle) * radius
				gCircleDraw(x,y,.01,'#A0F')
				if(loop == hintLoops%133 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}
	
	if(Math.abs(gLevel-9)<2) {
		gPageX = 8
		gGrassDraw(0, 1.75, 1.01, .26)
		gFlowerDraw(.18, 1.75, .03)
		gFlowerDraw(.29, 1.75, .03)
		
		gGrassDraw(.8, 1.1, .202, .8)
		gLineDraw(.55, 1.16, .55, 1.44, .1, '#643')
		gCircleDraw(.55, 1.15, .05, '#8b4')
		gCircleDraw(.55, 1.15+.005, .05, '#ac5')
		//gGrassDraw(.5, 1.1, .1, .35)
		gGrassDraw(.55, 1.1, .302, .2)
		
		//gTreePineDraw(.7, 1.37, .2, .4)
		gLineDraw(.535, 1.163, .62, 1.16, .07, '#694')
		gLineDraw(.525, 1.17, .525, 1.192+.02, .05, '#0003')
		gLineDraw(.525, 1.17, .525, 1.192, .05, '#694')
		if(gHintShowing) {
			var radius = .25
			var centerX = .46
			var centerY = .3
			for(var loop=0; loop<120; loop++) {
				var angle = -Math.PI/2+ Math.min(loop,100)/100*Math.PI*1.1
				var x = centerX - Math.cos(angle) * radius
				var y = centerY + Math.sin(angle) * radius
				if(loop>100) {
					y -= (Math.min(loop,110)-100)*.01
					if(loop>110) {
						y += (loop-110)*.01
					}
				}
				gCircleDraw(x,y,.01,'#A0F')
				if(loop == hintLoops%133 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}

	if(Math.abs(gLevel-10)<2) {
		gPageX = 9
		gGrassDraw(0, 1.55, 1.01, .5)
		gFlowerDraw(.5, 1.55, .03)
		
		gGrassDraw(0, 1.1, .4, .2)
		gGrassDraw(.6, 1.1, .402, .2)
		if(gHintShowing) {
			var x = .5
			var y = .04
			var speedX = .001
			for(var loop=0; loop<100; loop++) {
				if(loop < 20) {
					y += .0185
				} else if(loop < 40) {
					x -= speedX
					speedX += .0015
					y += .005
				} else if(loop < 60) {
					speedX -= .0015
					x += speedX
					y -= .005
				} else if(loop < 80) {
					x += speedX
					speedX += .0015
					y += .005
				} else if(loop < 100) {
					speedX -= .0015
					x -= speedX
				}
				gCircleDraw(x,y,.01,'#A0F')
				if(loop == hintLoops%133 && gState==gStateInput) {
					gCircleDraw(x,y,.028,'#0FF')
				}
			}
		}
	}
	
	if(Math.abs(gLevel-10)<2) {
		gPageX = 10
		gGrassDraw(0, 1.55, 1.01, .5)
	}

}

let gTreePineDraw = (x, y, sizeX, sizeY) => {
	gRectDraw(x, y, sizeX, sizeY, '#754')
	gOvalDraw(x+sizeX*.2, y+sizeX*.9, sizeX*.05, sizeX*.4, '#865')
	gOvalDraw(x+sizeX*.5, y+sizeX*1.3, sizeX*.05, sizeX*.6, '#865')
	gOvalDraw(x+sizeX*.8, y+sizeX*1.1, sizeX*.05, sizeX*.6, '#865', -.02)
	var y2 = y-sizeX*1
	var x2 = x+sizeX/2

	var s = 'M27,37Q0,45 7,35Q25,12 31,4Q34,0 37,4Q43,13 60,35Q63,42 41,37Q41,43 34,43Q27,43 27,37'
	gPathStringDraw(x2-sizeX*.16, y2+sizeX*1.1, s, sizeX*5, '#374')
	gPathStringDraw(x2-sizeX*.16, y2, s, sizeX*5, '#485')
}

let gTreeDraw = (x, y, sizeX, sizeY) => {
	x+=.01
	for(var layer=0; layer<3; layer++) {
		for(var a=0; a<(layer>1?6.28:3.14); a+=.6-layer*.13) {
			gCircleDraw(
				x+sizeX/2+Math.cos(a)*sizeX*1.7,
				y + sizeX*.35 + Math.sin(a)*(a<3.14?(layer?-.04:.02):.3) - layer**2*sizeX*.14,
				sizeX*.5 + gRandomFake(x+y*3+a)*(.02+.03*Math.max(0, -Math.sin(a))),
				!layer?'#364':(layer>1?'#485':'#474')
			)
		}
		if(!layer) {
			gRectDraw(x, y, sizeX, sizeY, '#543')
			gRectDraw(x+sizeX*.4, y+sizeX*1.14, sizeX*.6, sizeY-sizeX*1.14, '#754')
			gCircleDraw(x+sizeX*.7, y+sizeX*1.14, sizeX*.3, '#754')
			gRectDraw(x+sizeX*.7, y+sizeX*1.14-sizeX*.3, sizeX*.3, sizeX*.3,'#754')
			gOvalDraw(x+sizeX*.46, y+sizeY*.6+gRandomFake(x+y*5+a)*.05, .01, .1, '#543', .1)
			gOvalDraw(x+sizeX*.45, y+sizeY*.75+gRandomFake(x+y*6+a)*.05, .01, .05, '#543', -.05)
			gOvalDraw(x+sizeX*.65, y+sizeY*.5+gRandomFake(x+y*7+a)*.05, .006, .07, '#543')
		}
	}
	
	gRectDraw(x-sizeX*.8, y-sizeX*1.85, sizeX*2.7, sizeX*1.28, '#485')
}

let gGrassDraw = (x,y,sizeX,sizeY) => {
	//dirt
	gRectDraw(x,y,sizeX,sizeY,'#643')
	
	var total = sizeX*10*sizeY*10 * .2
	var pad = .03
	var spaceX = sizeX-pad
	var spaceY = sizeY-pad-.16
	for(var i=0; i<total; i++) {
		var rad = .01+gRandomFake(gPageX+i*11)*.02
		gOvalDraw(
			x+pad+gRandomFake(gPageX+x+i*5)*spaceX,
			y+.12+pad+gRandomFake(gPageX+x*2+i*3)*spaceY,
			rad+gRandomFake(gPageX+x*3+i*7)*.02,
			rad*.6+gRandomFake(gPageX+x*4+i*9)*.01,
			'#532'
		)
	}
	
	//dark side grass
	gRectDraw(x-.002,y,sizeX+.004,.09,'#694')
	var rad = .03
	var total = sizeX/rad/1.7-(sizeX<1)
	for(var layer=0; layer<3; layer++) {
		for(var i=0; i<total; i++) {
			gOvalDraw(
				x+i*rad*1.8+(x>0)*.028,
				y+.11-gRandomFake(y+x*3+i)*.01-(layer==1)*.026-(layer==2)*.03,
				rad,
				rad*1.2+gRandomFake(x+i)*.009,
				layer==2?'#694':(layer==1?'#472':'#0003')
			)
			if(i%3==1 && layer==2) {
				for(var i2=0; i2<3; i2++) {
					gOvalDraw(
						x+i*rad*1.8+i2*.02-.03,
						y+.035,
						rad*.4+gRandomFake(x+i*3)*.0009,
						rad*.4*1.5+gRandomFake(x+i*5)*.0009,
						'#8b4',
						-(i2-1)*.8
					)
				}
			}
		}
	}
	//bright top grass
	gRectDraw(x-.002,y,sizeX+.004,.025,'#ac5')
	//1px blur bottom of bright
	gRectDraw(x,y+.023,sizeX+.001,.005,'#8b4')
	//1px outline top
	gRectDraw(x,y,sizeX+.001,.005,'#8b4')
}

let gFlowerDraw = (x,y,size) => {
	var rad=size
	gRectDraw(
		x-rad*.2,
		y-.06,
		rad*.4,
		.07,
		'#6A4'
	)
	for(var i2=0; i2<2; i2++) {
		gOvalDraw(
			x-rad*.7+i2*rad*1.3,
			y-.02,
			rad*.9,
			rad*.3,
			'#6A4',
			.4+i2*2.4
		)
	}

	//petals
	for(var i2=0; i2<5; i2++) {
		var angle = i2/5*6.14-.2
		gOvalDraw(
			x + Math.cos(angle)*.02,
			y-.06 + Math.sin(angle)*.02,
			rad*.48,
			rad*.48*1.2,
			'#FFF',
			angle+1.4
		)
	}
	gCircleDraw(
		x,
		y-.06,
		rad*.4,
		'#FD5'
	)
}

let gPathDraw = () => {
	var max = gPathI
	if(gOr3(gState, 'input', 'win', 'retry')) {
		max = gPathEndI
	}
	if(gState == gStateDraw) {
		max = gPathI
	}
	if(gState==gStateGo) {
		max = gPathI+gStateLoops*12
	}
	
	if(gState == gStateGo) {
		if(gStateLoops>1) {
			var x = gPathX2
			var y = gPathY2
			if(!gPointInRect(x,y,0,0,gGameSizeX,gGameSizeY)) {
				gPathGoDone(max)
			} else if(y>gCloudSizeY+55) {
				var pixel = gPen.getImageData(x,y,1,1)
				if(!pixel) {
					debugger
				} else {
					var rgba = pixel.data
					if(rgba[0]!=0xAA) {
						gPathGoDone(max)
					} else {
						for(var gem of gGems) {
							var size = gem.size
							if(gPointInRect(gCamX+x/gGameSizeX, y/gGameSizeX, gem.x-size/2, gem.y-size*.6, size, size)) {
								if(!gem.pathI) {
									//gGems.splice(gGems.indexOf(gem),1)
									var found=0
									for(var gem2 of gGems) {
										if(gem2.pathI) {
											found=1
										}
									}
									gem.pathI = max
									gSoundPlay(found?gGemGet2Sound:gGemGetSound)
									gem.gotLoop = gLoops
								}
							}
						}
					}
				}
			}
		}
	}
	
	var x = gPathX
	var y = gPathY
	if(max) {
		for(var i=0; i<=max; i++) {
			var way = gPaths[i%gPathI]
			x += (way==0) - (way==2)
			y += (way==1) - (way==3)
			for(var c=0; c<7; c++) {
				gPen.fillStyle = '#'+gRainbowColors[c]
				gPen.fillRect(x-6+c*2, y, 2, 1)
			}
	
			for(var gem of gGems) {
				if(gem.pathI == i) {
					gem.x = gCamX+x/gGameSizeX
					gem.y = gCamY+y/gGameSizeX
					gem.pathI-=12
				}
			}
		}
	}
	gPathX2 = x
	gPathY2 = y
}

let gPathGoDone = (max) => {
	if(gGemsGotAll()) {
		gStateSet(gStateWin)
		gSongMake(gWinSong,2)
	} else {
		gSoundPlay(gDigSound)
		gStateSet(gStateInput)
		for(var gem2 of gGems) {
			if(gem2.pathI) {
				gStateSet(gStateRetry)
			}
		}
	}
	gPathEndI = max
}

let gGemsGotAll = () => {
	for(var gem2 of gGems) {
		if(!gem2.pathI) {
			return
		}
	}
	return 1
}

let gPointInRect = (px,py,x,y,sx,sy) => px>=x && py>=y && px<x+sx && py<y+sy

let gPixelLine = (mouseX, mouseY) => {
	var distX = mouseX - gMouseOldX
	var distY = mouseY - gMouseOldY
	if(!distX && !distY) {
		return
	}
	
	var wayX = distX > 0 ? 0 : 2
	var wayY = distY > 0 ? 1 : 3
	if(Math.abs(distX) > Math.abs(distY)) {
		var speed = distY / Math.abs(distX)
		var y = 0
		for(var total=0; total<Math.abs(distX); total++) {
			gPaths[gPathI++] = wayX
			var y0 = y
			y += speed
			if(~~y != ~~y0) {
				gPaths[gPathI++] = wayY
			}
		}
	} else {
		var speed = distX / Math.abs(distY)
		var x = 0
		for(var total=0; total<Math.abs(distY); total++) {
				gPaths[gPathI++] = wayY
			var x0 = x
			x += speed
			if(~~x != ~~x0) {
				gPaths[gPathI++] = wayX
			}
		}
	}
}

let gMouseSet = e => {
	gMouseX = (e.pageX-gGameX)///gGameSizeX
	gMouseY = e.pageY///gGameSizeX
}

let gMouseMove = (e) => {
	gMouseSet(e)
	
	if(gState == gStateDraw) {
		if(gMouseY > gCloudSizeY) {
			gStateSet(gStateDrawFail)
			gSoundPlay(gDigSound)
		} else {
			if(gMouseOldX >= 0) {
				gPixelLine(gMouseX, gMouseY)
			}
			gMouseOldX = gMouseX
			gMouseOldY = gMouseY
		}
	}
}

let gClickEnd = (e) => {
	gMouseSet(e)
	gMouseDown = 0
	gClicked = 1
	
	if(gState == gStateDraw) {
		gHintShowing = 0
		if(gPathI < 5) {
			gPathI = 0
			gStateSet(gStateInput)
		} else {
			gStateSet(gStateGo)
		}
	}
}

let gClickStart = (e) => {
	gMouseSet(e)
	gMouseDown = 1
	gMouseHit = 1
	gMouseStartX = gMouseX
	gMouseStartY = gMouseY
	
	if(gState == gStateInput) {
		gMouseOldX = -1
		gMouseOldY = -1
		if(gMouseY < gCloudSizeY) {
			gStateSet(gStateDraw)
			gLevelSetup()
			gPathX = gMouseX
			gPathY = gMouseY
			gPathI = 0
		}
	}
	
	if(!gAudioContexts[0]){
		for(var i=11;i--;){
			gAudioContexts[i] = new AudioContext
		}
		gSongMake(gBattleSong, 2)
		//if(gStorageGet('mute')!=1)gMute()
	}
	
	for(var c of gAudioContexts) {
		if(c.state == 'suspended') {
			c.resume()
		}
	}
}

let gSoundMake = (func, len) => {
	var buffer = gAudioContext.createBuffer(1, len, gAudioContext.sampleRate)
	var bytes = buffer.getChannelData(0)
	for(var i=0; i<len; i++) {
		bytes[i] = func(i, len)
	}
	return buffer
}

let gSoundPlay = (buffer) => {
	var source = gAudioContext.createBufferSource()
	source.buffer = buffer
	source.connect(gAudioContext.destination)
	source.start()
}

let gSin = (i,d) => Math.sin(d ? i/d/100 : i)
let t=(i,n)=>(n-i)/n
let gTuneGet = (notes, i, max) => {
  	var id = (notes.length*i)/max | 0
  	var note = notes[id]
  	var r = Math.pow(2, note/12)*.8
  	var q = t((i*notes.length)%max, max)*.1
  	i*=r
  	return (Math.sin(i/20) + 0.3*Math.sin(i*.03)) * Math.sin(q*3.14)*2
}

var gClickDownSound = gSoundMake((i, len) => Math.sin(i/66) * (1-i/len) * Math.sin(i*4/len) * .5, 2e3)

var gClickSound = gSoundMake((i, len) => gSin(i/9) * gSin(i/len*3.14), 220)
var gDigSound = gSoundMake(i => gSin(i / 50 + 5 * gSin(i,10)) * Math.exp(-i/6e3), 60000)
var gGemGetSound = gSoundMake(function(i, len) {
	i+=3000
	return (gSin(i*.02) + .5*gSin(i*.03) + .25*gSin(i*.06)) * Math.exp(-i/8e3)
}, 44000)
var gGemGet2Sound = gSoundMake(function(i, len) {
	i+=3000
	return (gSin(i*.02) + .5*gSin(i*.03) + .25*gSin(i*.08)) * Math.exp(-i/8e3)
}, 44000)
var gWinSound = gSoundMake(function(i, len) {
	return gTuneGet([0,4,7,12], i, 15e3)
}, 35000)


var gBattleSong3 =[
  16,,16,,17,,19,,19,,17,,16,,14,,12,,12,,14,,16,,16,,,14,14,,,,
  16,,16,,17,,19,,19,,17,,16,,14,,12,,12,,14,,16,,14,,,12,12,,,,
  14,,14,,16,,12,,14,,16,17,16,,12,,14,,16,17,16,,14,,12,,14,,7,,,,
]

var gWinSong = [

  // Spiral downward
  24,21,18,15, 23,20,17,14,
  22,19,16,13, 21,18,15,12,
  20,17,14,11, 19,16,13,10,
  18,15,12,9, 17,14,11,8,

  // Chaotic final drop
  24,23,22,21,20,19,18,17,
  16,15,14,13,12,11,10,9,
  8,7,6,5,4,3,2,1,0,

  // "Where did I land?"
  , , ,
  12, , 8, , 5, , 1, ,
  0, , , , , ,
]
	
var gBattleSong = [
  // pickup
  9, ,

  // A section
  12, , , , 14, , 16, , , 17, 16, ,
  14, , , , 11, , 7, , , 9, 11, ,
  12, , , , 9, , 9, , , 8, 9, ,
  11, , , , 8, , 4, , , , 9, ,

  12, , , , 14, , 16, , , 17, 16, ,
  14, , , , 11, , 7, , , 9, 11, ,
  12, , , 11, 9, , 8, , , 5, 7, ,
  9, , , , , , 9, , , , , ,

  // B section / chorus
  19, , , , , , 19, , , 17, 16, ,
  14, , , , 11, , 7, , , 9, 11, ,
  12, , , , 9, , 9, , , 8, 9, ,
  11, , , , 8, , 4, , , , , ,

  19, , , , , , 19, , , 17, 16, ,
  14, , , , 11, , 7, , , 9, 11, ,
  12, , , 11, 9, , 8, , , 5, 7, ,
  9, , , , , , 9, , , ,
],

	gNoteBuffers=[],
	gSongI = 0,
	gBuiltSong,
	gSongInterval = setInterval(_ => {
		if(gBuiltSong && !gMuted) {
			//console.log("song interval", gSongI)
			if(gSongI >= gBuiltSong.length){
				//console.log("song reached end")
				gSongI = 0
			}else{
				gNotePlay(gSongI)
				gSongI++;
			}
		}
	}, 140),
	gBuiltSong,
	gAudioContexts = [],
	gSongMake = (song, len) => {
		if(gAudioContexts[0]) {
			gBuiltSong = []
			gSongI = 0
			for(var i=0;i<song.length;i++) {
				if(song[i]===u) {
					gBuiltSong.push(0)
				} else {
					var buffer = gNoteBuffers[song[i]]
					if(!buffer) {
						buffer = gNoteBuffers[song[i]] = gGetD(song[i], len)
					}
					gBuiltSong.push(gAudioContexts[i%10].createBuffer(1, 1e6, 44100))
					gBuiltSong[i].getChannelData(0).set(buffer)
				}
			}
		}
	},
	gNotePlay = note => {
		if(gBuiltSong[note]) {
			var j = note%10
			var source = gAudioContexts[j].createBufferSource()
			source.buffer = gBuiltSong[note]
			source.connect(gAudioContexts[j].destination)
			source.start()
		}
	},
	gGetD = (note, len) => {
		note = 130.81 * 1.06 ** note
		for(

			// V: note length in seconds
			var V = len,
			
			// Temp vars for guitar synthesis
			vv = [],
			pp = 0, ch = 0,
			
			// Modulation
			// This function generates the i'th sample of a sinusoidal signal with a specific frequency and amplitude
			b = (note, tt, aa, tick) => Math.sin(note / tt * 6.28 * aa + tick)*0,
			
			// Instrument synthesis
			w = (note, tt) =>
			
			  // Piano
			  Math.sin(note / 44100 * tt * 6.28 + b(note, 44100, tt, 0) ** 2 + .75 * b(note, 44100, tt, .25) + .1 * b(note, 44100, tt, .5)) * .1
			,
			// Sound samples
			D = [],
			
			// Loop on all the samples
			tick = 0;
			tick < 44100 * V;
			tick++
			){
			
			// Fill the samples array
			D[tick] =
			
			  // The first 88 samples represent the note's attack
			  tick < 88 
			  ? tick / 88.2 * w(tick, note)
			  
			  // The other samples represent the rest of the note
			  : (1 - (tick - 88.2) / (44100 * (V - .002))) ** ((.5 * Math.log(1e4 * note / 44100)) ** 2) * w(tick, note);
			}
			return D;
	}



onload = _ => {
	gPen = gCanvas.getContext('2d', {alpha:false,willReadFrequently:true})
	
	onresize = _ => {
		gGameSizeX = innerHeight>innerWidth*2 ? innerWidth:innerHeight>>1
		gGameSizeY = gGameSizeX*2
		gCanvas.setAttribute('width', gGameSizeX)
		gCanvas.setAttribute('height', gGameSizeY)
		gCanvas.style.width = gGameSizeX+'px'
		gCanvas.style.height = gGameSizeY+'px'
		gGameX = (innerWidth-gGameSizeX)>>1
		gCloudSizeY = gGameSizeY*.3
		gPen.textBaseline = 'middle'
		gPen.textAlign = 'center'
		gPen.lineCap = 'round'
	}
	onresize()
	
	gStateSet(gStateTitle)

	//LEVEL HACK
	//LEVEL HACK
	//LEVEL HACK
	//LEVEL HACK
	//LEVEL HACK
	//LEVEL HACK
	//LEVEL HACK
	//LEVEL HACK
	//gStateSet(gStateInput);gLevel=10;gCamX=gLevel-1;gCamY=0;gLevelSetup()
	gGameUpdate()
	
	addEventListener("mousedown", e => {
		gClickStart(e)
	})
	addEventListener("mouseup", e => {
		gClickEnd(e)
	})
	addEventListener("mousemove", e => {
		gMouseMove(e)
	})
	document.addEventListener("touchmove", e => {
		gMouseMove(e.changedTouches[0])
		e.preventDefault()
		return false
	})
	document.addEventListener("touchend", e => {
		gClickEnd(e.changedTouches[0])
		e.preventDefault()
		return false
	})
	document.addEventListener("touchstart", e => {
		gClickStart(e.changedTouches[0])
		e.preventDefault()
		return false
	}, {passive:false})

}

