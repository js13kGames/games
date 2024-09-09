const fixtures = function(x) {
	if (x == "i") return [
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
		[1, 0, 1]
	]
	
	if (x == "ii") return [
		[1, 0, 1],
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0]
	]
	
	if (x == "iii") return [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	]
}


const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d')

const width = window.innerWidth
const height = window.innerHeight

const backingStores = ['webkitBackingStorePixelRatio', 'mozBackingStorePixelRatio', 'msBackingStorePixelRatio', 'oBackingStorePixelRatio', 'backingStorePixelRatio']
const deviceRatio = window.devicePixelRatio

const backingRatio = backingStores.reduce(function(prev, curr) {
    return (Object.prototype.hasOwnProperty.call(context, curr) ? context[curr] : 1)
})

const ratio = deviceRatio / backingRatio

canvas.width = Math.round(width * ratio)
canvas.height = Math.round(height * ratio)
canvas.style.width = width + 'px'
canvas.style.height = height + 'px'
context.setTransform(ratio, 0, 0, ratio, 0, 0)

const time = {m: 0, s: 0}

const vector = function(x, y) {
	this.x = x || 0
	this.y = y || 0
}

vector.prototype.add = function (vec) {
	this.x += vec.x
	this.y += vec.y
}

const player = function(x, y, vx, vy) {
	this.fixture = fixtures("i")
	
	this.position = new vector(x, y)
	this.velocity = new vector(vx, vy)
	
	this.score = 0
	
	this.update = function() {
		
	}
	
	this.render = function() {
		drawMatrix(this.fixture, this.position)
	}
}

const enemy = function(x, y, vx, vy) {
	this.fixture = fixtures("ii")
	this.position = new vector(3 * "0123"[4 * Math.random() | 0], y)
	this.velocity = new vector(vx, vy)
	
	
	this.update = function() {
		this.position.add(this.velocity)
		
		const fixture = fixtures("ii")
		
		if(this.position.y > 12 + 4)
		this.fixture = fixture.splice(0, (((Math.floor((this.position.y - 12) - 4) - 4) * -1) - 1))
		
		if(this.position.y > 12 + 8) {
		f1.player.score++
		this.position.y = 0
		this.position.x = 3 * "0123"[4 * Math.random() | 0]
		this.fixture = fixtures("ii")
		}
	}
	
	this.render = function() {
		drawMatrix(this.fixture, this.position)
	}
}


function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


function collide(arena, player) {
    const m = player.fixture;
    const o = player.position;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(arena, player) {
    player.fixture.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + Math.floor(player.position.y)][x + Math.floor(player.position.x)] = value;
            }
        });
    });
}


function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.beginPath()
                context.fillStyle = 'rgba(67,77,67, 0.75)'
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
                                 context.closePath()
            } else {
		        context.beginPath()
		        context.fillStyle = 'rgba(67,77,67, 0.01)'
		        context.fillRect(x + offset.x,
						        y + offset.y,
						        1, 1);
						        context.closePath()
            }
        });
    });
}


const game = function() {
	this.map = fixtures("iii")
	this.entities = []
	this.player = this.addEntity(new player(4, 16))
	this.highscore = 0
	document.addEventListener("touchmove", (point) => {
	const {player} = this
	
	
	const {
		clientX: pageX,
		clientY: pageY
	} = point.touches[0]
	
	const i = {
		x: pageX,
		y: pageY
	}
	
	const ii = {
		x: player.position.x * 20 + width / 4,
		y: player.position.y * 20 + height / 6
	}
	
	const dy = ii.y - i.y
	const dx = ii.x - i.x
	
	const ay = Math.abs(dy)
	const ax = Math.abs(dx)
	
	if (ay > ax) {
		((dy > 0) ? (-1) : (1))
	} else {
		((dx > 0) ? player.position.x += player.position.x <= 0 ? 0 : (-1) : player.position.x += player.position.x >= 12 - 3? 0 : (1))
	}
	})
	
	document.addEventListener('keydown', event => {
		if (event.keyCode === 37) {
			player.position.x += player.position.x <= 0 ? 0 : (-1)
		} else if (event.keyCode === 39) {
			player.position.x += player.position.x >= 12 - 3? 0 : (1)
	}})
	
	const run = () => {
		this.update()
		this.render()
		
		time.s+= 1/60
		if (time.s == 60) {
			time.m++
			time.s -= 60
		}
		requestAnimationFrame(run)
	}
	
	const running = run()
}

game.prototype.addEntity = function(entity) {
	this.entities.push(entity)
	return entity
}

game.prototype.removeEntity = function(entity) {
	return this.entities = this.entities.filter(e => e !== entity)
}

game.prototype.update = function () {
	const enemies = this.entities.filter(e => e !== this.player)
	
	if(enemies.length < 2)
	this.addEntity(new enemy(0, 0, 0, (Math.random() * 0.3) / 2 + 0.1))
	
	let enemiesmap = new fixtures("iii")
	enemies
	.map(e => merge(enemiesmap, e))
	
	const isColliding = collide(enemiesmap, this.player)
	if (isColliding) {
		if (navigator.vibrate) navigator.vibrate([100, 10, 100]);
		this.highscore = Math.max(this.player.score, this.highscore)
		this.player.score = 0;
		enemies.map(e => this.removeEntity(e))
	}
	
	this.entities.map(entity => entity.update())
}

game.prototype.render = function () {
	context.fillStyle = "#acbeac"
	context.fillRect(0, 0, canvas.width, canvas.height)
	
	context.save()
	context.beginPath()
	context.font = '0.80em'
	context.fillStyle = 'rgba(67,77,67, 1)'
	context.fillText('Hi-score: ' + this.highscore, (5), (height / 6) + 9)
	context.fillText('Score: ' + this.player.score, (5), (height / 6) + 27)
	context.fillText('Time: ' + Math.floor(time.m) + ":" + (Math.floor(time.s) > 9 ? Math.floor(time.s) : "0"+Math.floor(time.s)), (5), (height / 6) + 9 + 36)
	context.closePath()
	context.restore()
	
	context.save()
	const scale = (width / 2) / 12
	context.translate(width / 4, height / 6)
	context.scale(scale, scale)
	context.strokeStyle = 'rgba(67,77,67, 1)'
	context.lineWidth = 0.0625
	context.strokeRect(0, 0, 12, 20)
	context.lineWidth = 1
	
	drawMatrix(this.map, {x: 0, y: 0})
	this.entities.map(entity => entity.render())
	
	context.restore()
}

window.onload = () => f1 = new game()