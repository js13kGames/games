const noise = (w, h, a) => [...Array(w*h)].map(() => a * Math.random())

const subdiv = (z, n) => {
    const d = (z.length / 5) ** 0.5
    const hd = n * d
    const high = (i) => [i % hd, Math.floor(i / hd)].map(u => u / n)
    const lxs = z.map((z, j) => j % d)
    const lys = z.map((z, j) => Math.floor(j / d))
    return [...Array(5 * hd**2).keys()].map( i => {
        const [hx, hy] = high(i)
        return z.map((z, j) => {
            const lx = lxs[j]
            const ly = lys[j]
            const r2 = (lx - hx) ** 2 + (ly - hy) ** 2
            const f =  r2 > 5 ? 0 : z * Math.exp(-1 * r2)
            return f
        }).reduce((u, v) => u + v)
    })
}

const elevation = (tile) => {
    const surface = []
    for(let e=2; e<5; e++) {
        const t = tile[e-2]
        const s = subdiv(t, 2**(5-e))
        surface.push(s)
    }    
    const z = surface.reduce((s1, s2) => s1.map((p,i) => p + s2[i]))
    return z
}


const tile = []
for(let e=2; e<5; e++) {
    const t = noise(2 ** e, 5 * 2 ** e, e-1)
    tile.push(t)
}

const elev = elevation(tile)

postMessage({text:"init", elev});

onmessage = function(e) {
    for(let e=2; e<5; e++) {
        const t = noise(2 ** e, 2 * 2 ** e, e-1)
        tile[e-2] = tile[e-2].slice(t.length)
        tile[e-2].push(...t)
    }
    const elev = elevation(tile)
    postMessage({text: "update" + e.data, elev});
}