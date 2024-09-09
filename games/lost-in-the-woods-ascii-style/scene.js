F=s=>Array(8).fill(s)

landing=[
  F('#'),
  F('#'),
  ['#','#','#','@','@','#','#','#'],
  ['#','#','#','@','@','#','#','#'],
  F('░')
],
store=[
  ['d','t',' ',' ',' ',' ',' ','♦'],
  ['a','h','b',' ',' ',' ',' ',' '],
  ['f','w',' ',' ',' ',' ','D','T'],
  [' ',' ',' ','&',' ',' ','A','B'],
  ['O',' ',' ',' ',' ',' ',' ',' '],
],
left=[
  F('│'),
  F('│'),
  F('│'),
  F('┴'),
  F('░')
].map(v=>(v[0]='≈',v)),
right=[
  F('│'),
  F('│'),
  F('│'),
  F('┴'),
  F('░')
].map(v=>(v[7]='≈',v)),
entrance=[
  ['│','│','│','╥','│','│','│','│'],
  ['│','│','│','╫','│','│','│','│'],
  ['│','│','│','╫','│','│','│','│'],
  ['┴','┴','┴','╨','┴','┴','┴','┴'],
  F('░')
],
entranceLoc=[r(3)+3,0],
exitLoc=[(r(2)+2)*(r(2)*2-1),r(4)+3]
map={
  '0,0':landing,
  '0,-1':store,
  '-1,0':left,
  '1,0':right,
}
genCave([0,1])
genCave(exitLoc)
map['0,1'][0][3]='O'
map['0,1'][1][3]=' '
map[exitLoc][2][3]='‼'
map[entranceLoc]=entrance

function genTrees(l){
  let f=[
    F('│'),
    F('│'),
    F('│'),
    F('┴'),
    F('░')
  ],
  x=r(6)+1

  map[l]=f
  if(!r(5)){
    f.map(v=>(v[x]='≈',v))
  }
  else{
    f[4][x]=R(['◙','♣','δ','¶','s','░','░','░'])
    if(f[4][x]=='░')on.count(30,genCritter(map[l][4],x))
  }

}

function genCave(l){
  let o=['▓','▓','▓','█','█'],
      i=['▓','▓','▓','█','█','?'],
  cave=[
    [R(o),R(o),R(o),R(o),R(o),R(o),R(o),R(o)],
    [R(o),R(i),R(i),R(i),R(i),R(i),R(i),R(o)],
    [R(o),R(i),R(i),R(i),R(i),R(i),R(i),R(o)],
    [R(o),R(i),R(i),R(i),R(i),R(i),R(i),R(o)],
    [R(o),R(o),R(o),R(o),R(o),R(o),R(o),R(o)]
  ]
  if(l[1]==1)cave[0]=F('#')
  map[l]=cave
}

function scene(loc){
  if(!map[loc]){
    if(loc[1]){
      genCave(loc)
    }
    else{
      genTrees(loc)
    }
  }
  return map[loc]
}
