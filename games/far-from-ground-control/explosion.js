class Particle {
    constructor(x, y) {
        this.x = x
        this.y = y
        const alpha = Math.random() * 2 * Math.PI
        const v = 6 * ( 0.1 + 0.5 * Math.random())

        this.s = {
         x: 0,
         y: 0,
         r: 2 * Math.random(),
         c: 20 * Math.random(),
         s: 70 + 30 * Math.random(),
         o: 0.1 + 0.01 * Math.random()}
    
         this.d = {
         x: 0.5 * v * Math.cos(alpha),
         y: 0.5 * v * Math.sin(alpha),
         r: 0.25 * ( 0.2 + 0.8 * Math.random()),
         c: 0.2 *  ( 0.5 + 0.5 * Math.random()),
         s: -3.5  * ( 0.2 + 0.8 * Math.random()),
         o: -0.004 * ( 0.5 + 0.5 * Math.random())}
    }

    draw(c) {
        this.s = Object.fromEntries(Object.keys(this.s).map( k => [k, this.s[k] + this.d[k]] ))
        c.fillStyle = `hsl(${this.s.c},${this.s.s}%,40%,${this.s.o})`
        c.beginPath()
        c.arc(this.x + this.s.x - this.s.r, this.y + this.s.y - this.s.r, 2 * this.s.r, 0, 2*Math.PI)
        c.fill()
    }
}

class Explosion {
    constructor(lifetime=60) {
        this.lifetime = lifetime
        this.time = 0
        this.particles = [...Array(800)].map(() => new Particle(100, 100))
        this.frames = []
        this.oscanvas = document.createElement("canvas")
        this.oscanvas.width = 200
        this.oscanvas.height = 200
        this.oscontext = this.oscanvas.getContext("2d")
        for (let f=0; f<this.lifetime; f++) {
            this.oscontext.clearRect(0,0,200,200)
            this.draw()
            this.frames.push(this.oscontext.getImageData(0, 0, 200, 200))
        }
    }

    draw() {
        if (this.time > this.lifetime) return
        this.time ++
        for (let p of this.particles) p.draw(this.oscontext)
        this.oscontext.fillStyle = "black"
    }
}

class Playback {
    constructor(x, y, frames) {
        this.x = x
        this.y = y
        this.frames = frames
        this.width = frames[0].width
        this.height = frames[0].height
        this.lifetime = frames.length
        this.time = 0
        this.oscanvas = document.createElement("canvas")
        this.oscanvas.width = 200
        this.oscanvas.height = 200
        this.oscontext = this.oscanvas.getContext("2d") 
    }

    draw(context) {
        if (this.time > this.lifetime) return
        this.oscontext.clearRect(0,0,200,200)
        this.oscontext.putImageData(this.frames[this.time], 0, 0)
        context.drawImage(this.oscanvas, this.x - (300 * devicePixelRatio)/2, this.y - (300 * devicePixelRatio)/2, 300 * devicePixelRatio, 300 *devicePixelRatio)
        this.time ++
    }
}