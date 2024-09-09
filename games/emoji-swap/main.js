"use strict"

window.ginttochar = (num) =>
{
	if(num<100000)
		return String.fromCharCode(num)
	var offset = num - 0x10000,
		lead = 0xd800 + (offset >> 10),
		trail = 0xdc00 + (offset & 0x3ff)
	return String.fromCharCode(lead, trail)
}


const gstateinput = 1,
	gstateblinking = 2,
	gstatefalling = 3,
	gstatebattle = 4,
	gstateover = 5
	
var gmapsize = 6,
	gfontsize,
	gtilesize,
	gtilesize2,
	gmap = [],
	gtiles = [],
	gtilekinds = [],
	w = window,
	d = document,
	ggamesizex,
	ggamesizey,
	gboardx,
	gboardy,
	gswapam=0,
	gswapaddx,
	gswapaddy,
	gswapaddloops,
	gdraw,
	gdragtile,
	gdragtile2,
	gdragfar,
	gmousex,
	gmousey,
	gmousestartx,
	gmousestarty,
	gstate=gstateinput,
	gloops=999,
	gstateloops=0,
	gtilekindtower,
	gtilekindwall,
	gtilekindcannon,
	gtilekindballista,
	gtilekindchest,
	gshots = [],
	ghp = 4,
	ghploops = 0,
	gswaps = 4,
	gday = 1,
	gfps = 0,
	gfpstime = 0,
	gfpsframes = 0,
	genemys = [],
	genemysize,
	gshotballimage = ginttochar(128167),
	gshotarrowimage = ginttochar(127925),
	gshotboltimage = ginttochar(128395),
	gheart = ginttochar(10084),
	gswapimage = ginttochar(128259),
	genemyimage = ginttochar(128126),
	asdf



gtilekindtower = {name: 128266, offsety: 6, shotimage: gshotarrowimage, reload: 10}
gtilekinds.push(gtilekindtower)

gtilekindwall = {name: 128376}
gtilekinds.push(gtilekindwall)

gtilekindcannon = {name: 128299, shotimage: gshotballimage, reload: 20}
gtilekinds.push(gtilekindcannon)

gtilekindballista = {name: 127993, shotimage: gshotboltimage, reload: 40}
gtilekinds.push(gtilekindballista)

gtilekinds.push({name: 127897, upgrade: gtilekindtower})
gtilekinds.push(gtilekindchest = {name: 128142})
gtilekinds.push({name: 128375, upgrade: gtilekindwall})
//gtilekinds.push({name: 128167, upgrade: gtilekindcannon})
gtilekinds.push({name: 128166, upgrade: gtilekindcannon})
gtilekinds.push({name: 127919, offsety: 7, upgrade: gtilekindballista})

for(var k of gtilekinds)
{
	k.image = ginttochar(k.name)
	k.offsety = k.offsety || 0
}

w.gloop = () =>
{
	gloops++
	
	gdraw.fillStyle = '#68B'
	gdraw.fillRect(0, 0, ggamesizex, ggamesizey)
	
	var statedone = 1
	
	gdraw.translate(gboardx, gboardy)
	var addx = (ggamesizex/gtilesize - gmapsize >> 1) + 1
	addx=0
	for(var pass=0; pass<2; pass++)
	{
		var odd = 0
		for(var y=-1; y<gmapsize; y++)
		{
			for(var x=-addx; x<gmapsize+addx; x++)
			{
				odd = !odd
				if(odd && pass == 1)
				{
					gdraw.fillStyle = '#473'
					gdraw.fillRect(x*gtilesize, y*gtilesize, gtilesize, gtilesize)
				}
				if(!odd && pass == 0)
				{
					gdraw.fillStyle = '#584'
					gdraw.fillRect(x*gtilesize, y*gtilesize, gtilesize, gtilesize)
				}
			}
			odd = !odd
		}
	}
	
	gdraw.fillStyle = '#000'
	if(gstate == gstateinput && gswaps < 1)
	{
		gstate = gstatebattle
		gstateloops = gloops
		var am = gday*3
		for(var i=0; i<am; i++)
		{
			var e = {
				hp: 3,
				gridy: gmapsize+1,
				gridx: Math.random()*gmapsize | 0
			}
			e.x = (e.gridx+.3) + (Math.random()-.5)*.12
			e.y = e.gridy + i*.12
			genemys.push(e)
		}
	}
	
	gdraw.textAlign = "center"
	gdraw.textBaseline = "middle"
	gfontsizeset(gtilesize*2)
	var x=0
	if(gloops-ghploops < 10)
		x = Math.sin(gloops-ghploops)*gtilesize*.1
	gtextdraw(ginttochar(127984), gtilesize*3+x, -gtilesize*1.2)
	if(gloops-ghploops == 10)
	{
		if(ghp < 1)
		{
			gstate = gstateover
		}
	}
	
	for(var y=0; y<gmapsize; y++)
	{
		for(var tile of gtiles)
		{
			if(tile.gridy == y)
			{
				gfontsizeset(gtilesize*.7)
				gdraw.save()
				if(tile.matched)
				{
					galphaset(Math.sin(gloops/2)/3+.6)
				}
				if(gstate == gstatefalling)
				{
					if(tile.jointile && tile.jointile!=tile)
					{
						if(Math.abs(tile.x-tile.jointile.x) > .18)
						{
							tile.x += Math.sign(tile.jointile.x - tile.x)*.18
							statedone = 0
						}
						else if(Math.abs(tile.y-tile.jointile.y) > .18)
						{
							tile.y += Math.sign(tile.jointile.y - tile.y)*.18
							statedone = 0
						}
						else
						{
							tile.x = tile.jointile.x
							tile.y = tile.jointile.y
							if(!tile.jointile.upgraded)
							{
								gtileupgrade(tile.jointile)
							}
							
							if(gmap[tile.gridx][tile.gridy] == tile)debugger
							gtiles.k(tile)
							tile.jointile = 0
						}
					}
					else
					{
						if(tile.y < tile.gridy+.5)
						{
							tile.y += .12
							statedone = 0
						}
					}
				}
				
				tile.addx*=.9
				tile.addy*=.9
				gdraw.translate((tile.x+tile.addx)*gtilesize, (tile.y+tile.addy)*gtilesize)
				if(tile.kind == gtilekindballista)
				{
					tile.a = 2.35
				}
				if(tile.go > 0)
				{
					tile.a = Math.sin(gloops/8)*.15
					tile.go -= .2
				}
				gdraw.rotate(tile.a)
				gtextdraw(tile.kind.image, 0, 0, tile.f)
				gdraw.restore()
				
				if(tile.level > 1)
				{
					gfontsizeset(gtilesize*.4)
					gdraw.fillStyle='#000'
					gtextdraw("x"+tile.level, (tile.x+0)*gtilesize+1, (tile.y+0)*gtilesize+1)
					gdraw.fillStyle='#FF0'
					gtextdraw("x"+tile.level, (tile.x+0)*gtilesize, (tile.y+0)*gtilesize)
				}
				
				if(gstate == gstatebattle)
				{
					if(tile.kind.shotimage && gloops-tile.shottime > tile.kind.reload / Math.pow(2,tile.level-1))
					{
						for(var e of genemys)
						{
							if(gshoot(tile,e))
								break
						}
					}
				}
			}
		}
	}
	
	for(var s of gshots)
	{
		s.x += s.spx
		s.y += s.spy
		gfontsizeset(s.sz*gtilesize)
		gdraw.save()
		gdraw.translate(s.x*gtilesize, s.y*gtilesize)
		gdraw.rotate(s.a)
		gtextdraw(s.image, 0, 0)
		gdraw.restore()
		
		if(s.image == gshotarrowimage && (Math.abs(s.x - s.startx) > 1.5 || Math.abs(s.y - s.starty) > 1.5))
		{
			gshots.k(s)
			continue
		}
		if(s.x<0 || s.y<-1 || s.x>gmapsize || s.y >gmapsize+1)
		{
			gshots.k(s)
			continue
		}
		
		for(var e of genemys)
		{
			if(s.x > e.x && s.x < e.x+genemysize && s.y>e.y && s.y<e.y+genemysize)
			{
				gshots.k(s)
				e.hp -= s.hp
				var a = Math.atan2(s.spy, s.spx)
				e.x += Math.cos(a)*.05
				e.y += Math.sin(a)*.05
				e.hl = gloops
			}
		}
	}
	
	if(gstate == gstatebattle)
	{
		gfontsizeset(genemysize*gtilesize)
		for(var e of genemys)
		{
			var t = gmapget(e.gridx, e.gridy)
			var v = 0
			if(t && t.kind == gtilekindwall)
			{
				v = t.level
				t.go = 1
			}
			e.y -= .03 / (v+1)
			e.gridx = e.x | 0
			e.gridy = e.y | 0
			
			if(gloops-e.hl < 5)galphaset((gloops-e.hl) / 5)
				
			gtextdraw(genemyimage, e.x*gtilesize, e.y*gtilesize)
			
			galphaset()
			if(e.hp < 1)
			{
				genemys.k(e)
			}
			else if(e.y < -.5)
			{
				genemys.k(e)
				ghp--
				ghploops = gloops
			}
		}
		if(!genemys.length)
		{
			gstate = gstateinput
			gstateloops = gloops
			gswaps = 4
			gday++
		}
	}
	
	gdraw.translate(-gboardx, -gboardy)
	
	if(gstate == gstatefalling && statedone)
	{
		for(var i=0;i<gtiles.length;i++)
		{
			var tile = gtiles[i]
			tile.upgraded = 0
			if(tile.jointile)
			{
				if(tile.jointile != tile)
				{
					gtiles.splice(i, 1)
					i--
					if(gmap[tile.gridx][tile.gridy] == tile)debugger
				}
				tile.jointile = 0
			}
		}
		
		for(var tile of gtiles)
			if(gmap[tile.gridx][tile.gridy]!=tile)
			{
				debugger
				gtiles.k(tile)
			}
		
		gmatchcheck()
		if(gstate != gstateblinking)
			gstate = gstateinput
	}
	
	if(gstate == gstateblinking && gloops-gstateloops > 12)
	{
		gmatchesremove()
		gstate = gstatefalling
	}
	
	if(gdragtile)
	{
		var distx = gmousex - gmousestartx
		var disty = gmousey - gmousestarty
		
		gtilexyset(gdragtile)
		if(gdragtile2)gtilexyset(gdragtile2)
		
		if(Math.abs(distx) > Math.abs(disty))
		{
			var a = gclamp(distx/gtilesize, 1)
			gdragtile.x += a
			gdragtile2 = gmapget(gdragtile.gridx + gsign(distx), gdragtile.gridy)
			if(gdragtile2)gdragtile2.x -= a
		}
		else
		{
			var a = gclamp(disty/gtilesize, 1)
			gdragtile.y += a
			gdragtile2 = gmapget(gdragtile.gridx, gdragtile.gridy + gsign(disty))
			if(gdragtile2)gdragtile2.y -= a
		}
		gdragfar = Math.abs(a)
		
	}
	
	var l = gloops-gstateloops
	if(gstate == gstatebattle || (gstate == gstateinput && l<10))
	{
		galphaset(.4)
		if(l < 10)
			galphaset(l/10*.4)
		if(gstate == gstateinput)
			galphaset((1-l/10)*.4)
		
		gdraw.fillStyle = '#000'
		gdraw.fillRect(0, 0, ggamesizex, ggamesizey)
		galphaset()
	}
	
	if(gstate == gstateover)
	{
		galphaset(.6)
		gdraw.fillStyle = '#000'
		gdraw.fillRect(0, ggamesizey*.35, ggamesizex, ggamesizey*.2)
		galphaset()
		
		gfontsizeset(gtilesize*.35)
		gdraw.fillStyle = "#FFF"
		gtextdraw(ginttochar(128541)+" Game Over! "+ginttochar(128541), ggamesizex/2, ggamesizey*.4)
		gtextdraw("You reached "+ginttochar(127774)+" day "+gday+" "+ginttochar(127774), ggamesizex/2, ggamesizey*.5)
	}
	
	
	gfontsizeset(gtilesize*.5)
	for(var i=0; i<ghp; i++)gtextdraw(gheart, ggamesizex/2 - (i-ghp/2+.4)*gtilesize*.4, gtilesize*.3)
		
	gfontsizeset(gtilesize*.5)
	for(var i=0;i<gswaps-gswapam;i++)
		gtextdraw(gswapimage, gboardx + gtilesize*.35 + i*gtilesize*.15, gtilesize*.4+gswaps-i)
	
	if(gswapam)
	{
		var l = gloops - gswapaddloops
		if(l < 10)
		{
			gswapaddy -= .03*gtilesize
		}
		else if(l < 30)
		{
			gswapaddx += (gtilesize*.35 + gswaps*gtilesize*.15-gswapaddx)/12
			gswapaddy += (-gboardy+gtilesize*.4-gswapaddy)/12
		}
		else
		{
			galphaset(1-(l-30)/5)
		}
		gfontsizeset(gtilesize*.5)
		for(var i=0;i<gswapam;i++)
			gtextdraw(gswapimage, gboardx+gswapaddx+gtilesize*.2*i, gboardy+gswapaddy)
		galphaset()
		if(l>34)gswapam = 0
	}
	
	/*
	gfpsframes++
	if(Date.now() > gfpstime+1000)
	{
		gfpstime = Date.now()
		gfps = gfpsframes
		gfpsframes = 0
	}
	gtextdraw(gfps, 0, 0)
	*/
	gtextdraw(ginttochar(0x1F31E)+gday, gboardx + gtilesize*gmapsize - gfontsize*2, gtilesize*.3)
}

w.galphaset = (a) =>
{
	if(a === undefined)a=1
	gdraw.globalAlpha = a
}

w.gtextdraw = (s, x, y, f, a) =>
{
	if(a)
	{
		gdraw.save()
		gdraw.translate(x-gfontsize*.012+gfontsize/2, y-gfontsize*.016+gfontsize/2)
		gdraw.rotate(a)
		gdraw.fillText(s, -gfontsize/2, -gfontsize/2)
		gdraw.restore()
		return
	}
	
	if(f)gdraw.scale(-1,1)
	gdraw.fillText(s, x-gfontsize*.012, y-gfontsize*.016)
	if(f)gdraw.scale(-1,1)
}

w.gfontsizeset = (z) =>
{
	gfontsize = z
	gdraw.font = z+"px Segoe UI Emoji"
}

w.gshoot = (t,e) =>
{
	var s = {spx:0, spy:0, x:t.x, y:t.y, image:t.kind.shotimage, sz:.32, hp:1}
	if(t.kind == gtilekindtower)
	{
		if(Math.abs(e.gridx-t.gridx) > 1 || Math.abs(e.gridy-t.gridy) > 1)return;
		t.a = s.a = Math.atan2(e.y-s.y, e.x-s.x)
		s.spx = Math.cos(s.a)*.12
		s.spy = Math.sin(s.a)*.12
		s.startx = s.x
		s.starty = s.y
		t.addx = -s.spx
		t.addy = -s.spy
	}
	if(t.kind == gtilekindcannon)
	{
		if(e.gridy != t.gridy)return;
		s.a = -1.57
		s.spx = .18
		s.sz *= 1.5
		t.f = 1
		t.addx = .24
		if(e.x < s.x)
		{
			s.spx *= -1
			s.a *= -1
			t.f = 0
		}
	}
	if(t.kind == gtilekindballista)
	{
		if(e.gridx != t.gridx)return;
		s.a = -.78
		s.spy = .12
		s.sz *= 1.8
		t.addy = -.24
		if(e.y < s.y)
		{
			s.spy *= -1
			s.a += 3.14
		}
	}
	
	gshots.push(s)
	t.shottime = gloops
	return 1
}

Array.prototype.k = function(o){this.splice(this.indexOf(o), 1)}

w.gtilekindget = () =>
{
	var k
	while(1)
	{
		k = gtilekinds[Math.random() * gtilekinds.length | 0]
		if(k.upgrade || k == gtilekindchest)return k
	}
}

w.gtilemake = (x,y) =>
{
	var t = {
		kind: gtilekindget(),
		shottime: 0,
		gridx: x,
		gridy: y,
		addx: 0,
		addy: 0,
		level: 0,
		a: 0
	}
	gtilexyset(t)
	gtiles.push(t)
	return (gmap[x][y] = t)
}

w.onload = () =>
{
	w.onresize()
	
	for(var x=0; x<gmapsize; x++)
	{
		gmap[x] = []
		for(var y=0; y<gmapsize; y++)
		{
			gtilemake(x,y)
		}
	}
	
	gmatchcheck()
	
	setInterval(gloop, 33)
}

w.onresize = () =>
{
	gdraw = canvas.getContext('2d')
	gdraw.imageSmoothingEnabled = 0
	
	ggamesizex = innerWidth
	ggamesizey = innerHeight
	
	canvas.setAttribute('width', ggamesizex)
	canvas.setAttribute('height', ggamesizey)
	canvas.style.width = ggamesizex
	canvas.style.height = ggamesizey
	gtilesize = Math.min(ggamesizey / (gmapsize+2), ggamesizex / gmapsize) | 0
	genemysize = .5
	gtilesize2 = gtilesize/2
	
	gboardx = (ggamesizex - gtilesize*gmapsize)/2
	gboardy = gtilesize
}

d.addEventListener("touchend", (e) =>
{
	var t = e.changedTouches[0]
	gclickend()
	e.preventDefault()
	return !1
}, {passive:false})

w.gclickend = () =>
{
	if(gdragtile)
	{
		if(gdragtile2 && gdragfar > .5)
		{
			gswaps--
			
			var t = gdragtile.gridx
			gdragtile.gridx = gdragtile2.gridx
			gdragtile2.gridx = t
			
			t = gdragtile.gridy
			gdragtile.gridy = gdragtile2.gridy
			gdragtile2.gridy = t
			
			gmap[gdragtile.gridx][gdragtile.gridy] = gdragtile
			gmap[gdragtile2.gridx][gdragtile2.gridy] = gdragtile2
			
			gmatchcheck()
		}
		gtilexyset(gdragtile)
		gdragtile = 0
		if(gdragtile2)
		{
			gtilexyset(gdragtile2)
			gdragtile2 = 0
		}
	}
}

d.onmouseup = gclickend

d.onmousemove = (e) =>
{
	gmousex = e.pageX - gboardx
	gmousey = e.pageY - gboardy
}

d.addEventListener("touchmove", (e) =>
{
	var t = e.changedTouches[0]
	gmousex = t.clientX - gboardx
	gmousey = t.clientY - gboardy
	e.preventDefault()
	return !1
}, {passive:false})

d.addEventListener("touchstart", (e) =>
{
	var t = e.changedTouches[0]
	gclickstart(t.clientX, t.clientY)
	e.preventDefault()
	return !1
}, {passive:false})

d.onmousedown = (e) =>
{
	gclickstart(e.pageX, e.pageY)
}

w.gclickstart = (x, y) =>
{
	gmousex = x - gboardx
	gmousey = y - gboardy
	gmousestartx = gmousex
	gmousestarty = gmousey
	
	if(gstate == gstateinput)
		gdragtile = gpixeltotile(gmousex, gmousey)
	if(gstate == gstateover)
		window.location.reload()
}

w.gpixeltotile = (x, y) =>
{
	x = x/gtilesize | 0
	y = y/gtilesize | 0
	return gmapget(x,y)
}

w.gmapget = (x,y) =>
{
	return x >= 0 && y >= 0 && x < gmapsize && y < gmapsize && gmap[x][y]
}

w.gtilexyset = (tile) =>
{
	tile.x = (tile.gridx+.5)
	tile.y = (tile.gridy+.5)
}

w.gtileupgrade = (tile) =>
{
	tile.upgraded = 1
	if(tile.kind.upgrade)
	{
		tile.kind = tile.kind.upgrade
	}
	tile.level++
	tile.jointile = 0
	tile.matched = 0
}

w.gmatchesremove = () =>
{
	for(var y=0; y<gmapsize; y++)
	{
		for(var x=0; x<gmapsize; x++)
		{
			var tile = gmap[x][y]
			if(tile.matched)
			{
				if(tile.jointile != tile)
					gtileremove(tile)
			}
		}
	}
}

w.gtileremove = (t) =>
{
	for(var y = t.gridy; y>0; y--)
	{
		var t2 = gmap[t.gridx][y-1]
		gmap[t.gridx][y] = t2
		t2.gridy = y
	}
	
	t2 = gtilemake(t.gridx, 0)
	t2.y = -1
	
	if(gmap[t.gridx][1].y < 0)
		t2.y = gmap[t.gridx][1].y - 1
	
	if(t.kind == gtilekindchest)
	{
		gtiles.k(t)
	}
}

w.gmatchcheck = () =>
{
	for(var way=0;way<2;way++)
	{
		for(var y=gmapsize-1; y>=0; y--)
		{
			for(var x=0; x<gmapsize; x++)
			{
				var kind = gmap[x][y].kind
				var level = gmap[x][y].level
				var founds = 0
				var foundtiles = []
				var x2 = x, y2 = y
				var jointile = 0
				while(1)
				{
					var tile = gmap[x2][y2]
					if(tile.kind != kind)break
					if(tile.level != level)break
					
					foundtiles.push(tile)
					
					if(way == 0)
					{
						x2++
						if(x2 >= gmapsize)break
					}
					else
					{
						y2--
						if(y2 < 0)break
					}
					
				}
				
				if(foundtiles.length > 2)
				{
					var jointile = foundtiles[0]
					for(var tile of foundtiles)
					{
						if(tile == gdragtile)
						{
							jointile = tile
						}
					}
					for(var tile of foundtiles)
					{
						if(tile.jointile)
						{
							jointile = tile.jointile
						}
					}
					
					for(var tile of foundtiles)
					{
						tile.matched = 1
						tile.jointile = jointile
						if(tile.jointile.jointile == tile && tile.jointile!=tile)debugger
					}
					
					gstate = gstateblinking
					gstateloops = gloops
				}
			}
		}
	}
	
	for(tile of gtiles)
	{
		if(tile.matched)
		{
			var am = -3 + (tile.kind == gtilekindchest)
			for(var tile2 of gtiles)
			{
				if(tile2.jointile == tile)
				{
					am++
				}
			}
			if(am > 0)
			{
				gswaps += am
				gswapam = am
				gswapaddx = tile.x*gtilesize
				gswapaddy = tile.y*gtilesize
				gswapaddloops = gloops
			}
		}
	}
	
	for(tile of gtiles)
		if(tile.kind == gtilekindchest)
			tile.jointile = 0
}

w.gclamp = (v, mx) =>
{
	return Math.min(mx, Math.max(v,-mx))
}

w.gsign = (v) =>
{
	return v>0 ? 1 : -1
}
