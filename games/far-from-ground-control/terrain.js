const terrainIndex = (() => {
    const D = 32
    const W = D, H = 2*D + 2
    const index = []
    for (let y=0; y<H; y++) {
        for (let x=0; x<W; x++) {
            const i = x + y * W
            if ((x < W - 1) && (y < H - 1))
            index.push(i, i + 1, i + W, i + 1, i + W + 1, i + W)
        }
    }
    return index
})()

const grid = (z, START) => {
    const D = 32
    const W = D, H = 2*D + 2
    const HSTART = START * D
    const zs = z.slice(HSTART * W, (HSTART + 2*D + 2) * W)
    const vertex = []
    for (let y=0; y<H; y++) {
        for (let x=0; x<W; x++) {
            const i = x + y * W
            vertex.push(x - W/2, y - H/2, 0.8 * zs[i])
        }
    }
    return {vertex, index: terrainIndex}
}


