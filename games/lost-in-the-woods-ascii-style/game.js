function say(msg){
  let div=document.createElement('div')
  div.innerHTML+=msg
  if(q('text').children.length=='5')q('text').removeChild(q('text').firstChild)
  q('text').appendChild(div)
}

function stamina(amount){
  if(amount){
    state.stamina-=amount
  }
  else{
    tick()
    state.stamina--
  }
  if(state.stamina<1&&!state.zombie){
    say('You\'ve died.')
    setTimeout(_=>window.location.reload(false),1e3)
  }
}

function addItem(type,count){
  if(state.inventory[type]){
    state.inventory[type]+=count
  }
  else{
    state.inventory[type]=count
  }
}

function delItem(type,count){
  if(state.inventory[type]&&state.inventory[type]>=count){
    state.inventory[type]-=count
    if(!state.inventory[type]){
      delete state.inventory[type]
    }
    return true
  }
  return false
}

function render(){
  if(typeof scn=='function'){

  }
  else{
    q('gameS').innerHTML=scn.map(r=>r.join('').replace(/\s/g,'&nbsp;')).join('<br>')
    q('gameC').innerHTML='<br>'.repeat(pos[1])+'&nbsp;'.repeat(pos[0])+`<i>${['◄','▲','►','▼'][dir]}</i>`+'&nbsp;'.repeat(7-pos[0])
  }
  q('inventory').innerHTML='<div class="title">INVENTORY</div>'+
  Object.entries(state.inventory).map((v,i)=>`
    <div class="${state.equipped.indexOf(v[0])+1?'active':''}">
      <div>${v[1]}</div>
      <div>${v[0]}</div>
    </div>
  `).join('')
  q('status').innerHTML=`<div>
    <div>Stamina: ${state.stamina}</div>
    <div>Gold: ${state.gold}</div>
    <div>Luck: ${state.luck}</div>
    <div id="zombie" onclick=zombie()>Zombie: ${state.zombie}</div>
  </div>`
}

getPos=d=>[pos[0]+(d%2?0:d-1),pos[1]+(d%2?d-2:0)]
getTile=l=>scn[l[1]][l[0]]

function move(d){
  dir=d-=37
  let posNew=getPos(d),
  inter,
  out=false,
  [x,y]=posNew

  if(x<0||x>7||y<0||y>4){
    if(loc[1]<0)return
    if(x<0){
      loc[0]--
      posNew[0]=7
    }
    else if(x>7){
      loc[0]++
      posNew[0]=0
    }
    else if(loc[1]){
      if(y>4){
        loc[1]++
        posNew[1]=0
      }
      else if(y<0){
        loc[1]--
        posNew[1]=4
      }
    }
    else{
      return
    }
    pos=posNew
    stamina()
  }
  else{
    inter=INTER[getTile(posNew)]
    if(inter.m)pos=posNew
    else say(R([
      'I\'ts not moving.',
      'Walking into hard things hurts.',
      'Do you normally walk through walls?'
    ]))
    if(inter.M)inter.M(loc,pos)
    if(loc[1]!=-1)stamina()
  }
}

function interact(){
  let facing=getPos(dir)
  if(INTER[getTile(facing)]&&INTER[getTile(facing)].i)INTER[getTile(facing)].i(loc,facing,state.equipped)
  if(loc[1]!=-1)stamina()
}

function buy(){
  let t=getTile(pos),i=INTER[t]
  if(i.b){
    if(state.gold-i.b>=0){
      state.gold-=i.b;
      if(t=='f'){
        state.stamina+=20
      }
      else{
        addItem(t,1)
      }
    }
  }
}
function sell(){
  let t=getTile(pos),i=INTER[t]
  if(delItem(t,1)){
    state.gold+=i.s
  }
}

function action(k){//console.log(k)
  let type={
    37:move,
    38:move,
    39:move,
    40:move,
    32:interact,
    66:buy,
    83:sell,
  }
  if(type[k])type[k](k)

  scn=scene(loc)

  render()
}


loc=[0,0]
pos=[3,4]
dir=1
scn=scene(loc)
state={
  inventory:{},
  gold:0,
  stamina:5,
  luck:1,
  equipped:[],
  zombie:false
}

render()

onkeydown=c=>action(c.which)

q('inventory').onclick=e=>{
  let i=e.target.innerHTML
  e=state.equipped
  if(i.length==1&&e.indexOf(i)==-1){
    if((i.toLowerCase()=='t'||i.toLowerCase()=='d')&&/t|d/i.test(e)){
      say('Cannot equip two weapons at once.')
      return
    }
    if(e.length>1)e.shift()
    e.push(i)
    render()
  }
}
function zombie(){
  state.zombie=!state.zombie
  render()
}
//http://www.chexed.com/ComputerTips/asciicodes.php
