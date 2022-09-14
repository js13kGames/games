const fitBayes = function(groups) {
  const dataLen = groups.reduce((a, c) => a + c.length, 0)
  const rowCalc = (arr) => {
    const n = arr.length
    const m = arr.reduce((a, b) => a + b) / n
    const s = Math.sqrt(arr.map(x => Math.pow(x - m, 2)).reduce((a, b) => a + b) / (n-1))
    return {m: m, s: s}
  }
  return groups.map(matrix => {
    let calc = matrix[0].map((_, i) => {
      let row = matrix.map(item => item[i])
      return rowCalc(row)
    })
    return {priorProbability: matrix.length/dataLen, calc: calc}
  })
}
const predictBayes = function(arrIn, model) {
  const argMax = arr => [].map.call(arr, (x, i) => [x, i]).reduce((a, c) => (c[0] > a[0] ? c : a))[1]
  const scores = model.map(groupObj => {
    const groupCalc = groupObj.calc
    let p = arrIn.reduce((a, x, i) => {
      let std = groupCalc[i].s
      if (std === 0) return a
      let mean = groupCalc[i].m
      let L = Math.exp(-0.5 * Math.log(2 * Math.PI) -
        Math.log(std) - Math.pow(x - mean, 2) / (2 * std * std))
      return a + Math.log(L)
    }, Math.log(groupObj.priorProbability))
    return p
  })
  let bindex = argMax(scores)
  return [bindex, scores[bindex]]
}