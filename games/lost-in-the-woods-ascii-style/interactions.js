portals={
  '0,0':p=>{loc=[0,-1],pos=[p[0],4]},
  '0,-1':p=>{loc=[0,0],pos=[3,4]},
  'cave':p=>{loc=[0,1],pos=[3,1]},
  '0,1':p=>{loc=entranceLoc,pos=[3,4]}
}

function luck(min,max){
  return r(10)<Math.min(min+(state.luck/2|0),max)
}

function growTree(t,x){
  return _=>{
    t[0][x]='│'
    t[1][x]='│'
    t[2][x]='│'
  }
}

function genCritter(t,x){
  return _=>{
    t[x]=R(['◙','♣','δ','¶','s','░','░','░','░'])
    if(t[x]=='░')on.count(30,genCritter(t,x))
  }
}

function combat(l,x,e,health,att,mDef,rDef,name,attName,curio,food){
  let w=(e.join('').match(/t|d/i)||[''])[0],
  h
  ,a=r(att)+(/t/i.test(w)?2:1)
  stamina(a)
  say(`The ${name} ${attName} stealing ${a} stamina`)

  if(!w){
    say(`Having no weapons you kick at the ${name} ineffectually.`)
    return
  }

  if(/t/i.test(w))h=1+r(mDef)*(w=='T'?2:1)
  if(/d/i.test(w))h=1+r(rDef)*(w=='T'?2:1)
  health-=h
  if(health<1){
    l[x]=(l[1])?'░':' '
    on.count(30,genCritter(l,x))
    addItem('c',1)
    if(food){
      stamina(-3)
      say(`${food} are great from stamina.`)
    }
    say(`You have collected a rare ${curio} curio.`)
  }
  else if(health==1){
    l[x]=(l[1])?'░':' '
    on.count(30,genCritter(l,x))
    say(R([
      `You have scared off the ${name}.`,
      `Your singing seems to have scared it off.`,
      `Either you attack or your stench has scared off the ${name}`
    ]))
  }
  else{
    say(R([
      `Your attack failed to make much of an impression.`,
      `The ${name} has seen scarier marshmallows.`,
    ]))
  }

}
firstTime=7
INTER={
  '|':{
    m:1,
    d:'border',
  },
  '╨':{
    m:0,
    d:'pillar',
    i:(l,[x,y],e)=>{
      let t=map[l]
      if(state.inventory['c']>1){
        if(t[0][x]!=' ')t[0][x]=' '
        else if(t[1][x]!=' ')t[1][x]=' '
        else if(t[2][x]!=' ')t[2][x]=' '
        else if(t[3][x]!=' ')t[3][x]='∩'
        delItem('c',3)
      }
      else{
        say('You\'ll need curios to get though this.')
      }
    }
  },
  '│':{
    m:0,
    d:'tree',
  },
  '&':{
    m:0,
    i(){
      say('Welcome to the never ending forest. Many lost travelers come through here looking for a way out.')
      say('It is said the gates of freedom are buried deep underground, but to find a cave you\'ll have to travel the right way.')
      if(firstTime){
        say('Here is some gold to get you started.')
        state.gold+=7
        render()
        firstTime=0
      }
    },
    d:'old man'
  },
  '#':{
    m:0,
    d:'wall',
  },
  'O':{
    m:1,
    M:(l,p)=>portals[l](p),
    d:'open door',
  },
  '∩':{
    m:1,
    M:_=>portals['cave'](),
    d:'cave opening'
  },
  '‼':{
    m:1,
    M:_=>{
      say('You have found the gates to freedom.')
      setTimeout(_=>{
        say('Or not.')
        setTimeout(_=>window.location.reload(false),2e3)
      },1e3)
    },
    d:'gates'
  },
  '@':{
    m:0,
    i:(l,p)=>map[l][p[1]][p[0]]='O',
    d:'locked door',
  },
  '░':{
    m:1,
    d:'path',
  },
  '▓':{
    m:0,
    d:'earth',
    i(l,[x,y],e){
      if(/b/i.test(e)){
        map[l][y][x]='▒'
      }
      else{
        say(R([
          'You break a fingernail clawing at the earth.',
          'Pounding furiously does nothing to the soil.',
          'Staring intently doesn\'t seem to do anything'
        ]))
      }
    }
  },
  '█':{
    m:0,
    d:'stone',
    i(l,[x,y],e){
      if(e.indexOf('B')+1){
        map[l][y][x]=' '
      }
      else{
        say(R([
          'You break a to kicking the rock.',
          'Tears don\'t actually melt stone.',
          'Pretty sure your tools are inferior for this.'
        ]))
      }
    }
  },
  '▒':{
    m:0,
    d:'loose earth',
    i(l,[x,y],e){
      if(/h/.test(e)){
        if(state.inventory['w']){
          delItem('w',1)
          map[l][y][x]='░'
        }
        else{
          say(R([
            'Wood seems useful for this task.',
            'Grit and determination only get you so far.',
            'Ever tried holding up a tunnel with air?'
          ]))
        }
      }
      else{
        say(R([
          'A tool seems helpful in this endeavour.',
          'Your fists aren\'t made for this.',
        ]))
      }
    }
  },
  '?':{
    m:0,
    d:'chest',
    i(l,[x,y]){
      let t=map[l][y]
      if(luck(5,6)){
        R([
          _=>{
            say('You\'ve found a gemstone.')
            addItem('♦',1)
            t[x]=' '
          },
          _=>{
            say('You\'ve found a gemstone.')
            addItem('♦',1)
            t[x]=' '
          },
          _=>{
            say('You\'ve been blessed with better luck.')
            state.luck++
            t[x]=' '
          }
        ])()
      }
      else{
        R([
          _=>{
            say('A giant spider crawls out.')
            t[x]='*'
          },
          _=>{
            say('A bloodsucking bat flutters out.')
            t[x]='^'
          },
          _=>{
            say('A poisonous air patch reduces your stamina.')
            stamina(25)
            t[x]=' '
          }
        ])()
      }
      on.count(50,_=>{t[x]='?'})
    }
  },
  '┴':{
    m:0,
    d:'stump',
    i:(l,[x,y],e)=>{
      let t=map[l],w
      if(e.indexOf('A')+1){
        t[0][x]=' '
        t[1][x]=' '
        t[2][x]=' '
        w=3
        on.count(50,growTree(t,x))
      }
      else if(e.indexOf('a')+1){
        if(t[0][x]=='│')t[0][x]=' '
        else if(t[1][x]=='│')t[1][x]=' '
        else if(t[2][x]=='│'){
          t[2][x]=' '
          on.count(50,growTree(t,x))
        }
        else{
          say(R([
            'Batter batter swing.',
            'I\'ts a swing and a miss.',
            'You do realize there is nothing there but a stump right?',
            'Ever heard of tilting and windmills?'
          ]))
          return
        }
        w=1
      }
      else{
        say(R([
          'You stare quizzically at the tree.',
          'You hop on one foot about after futilely kicking the tree.',
          'The tree is impressed with your intimidating glare.'
        ]))
        return
      }
      addItem('w',w+luck(1,4)?w:0)
    }
  },
  ' ':{
    m:1,
    d:'space',
  },
  '≈':{
    m:0,
    d:'water',
    i:(l,[x,y],e)=>{
      let t=map[l]
      if(e.indexOf('h')+1){
        if(t[pos[1]][pos[0]]!='='){
          if(delItem('w',2)){
            t[y][x]='='
          }
        }
      }
    }
  },
  '=':{
    m:1,
    d:'bridge',
  },
  //items
  d:{
    m:1,
    d:'common bow',
    M:_=>say('Common Bow: good for shooting b(3) s(2)'),
    b:3,
    s:2
  },
  D:{
    m:1,
    d:'greater bow',
    M:_=>say('Greater Bow: good for shooting b(20) s(15)'),
    b:20,
    s:15
  },
  a:{
    m:1,
    d:'common axe',
    M:_=>say('Common Axe: good for cutting trees b(3) s(2)'),
    b:3,
    s:2
  },
  A:{
    m:1,
    d:'greater axe',
    M:_=>say('Greater Axe: good for cutting trees b(20) s(15)'),
    b:20,
    s:15
  },
  b:{
    m:1,
    d:'common shovel',
    M:_=>say('Common Shovel: good for digging b(3) s(2)'),
    b:3,
    s:2
  },
  B:{
    m:1,
    d:'greater shovel',
    M:_=>say('Greater Shovel: good for digging b(20) s(15)'),
    b:20,
    s:15
  },
  t:{
    m:1,
    d:'common sword',
    M:_=>say('Common Sword: good for attacking b(3) s(2)'),
    b:3,
    s:2
  },
  T:{
    m:1,
    d:'greater sword',
    M:_=>say('Greater Sword: good for attacking b(20) s(15)'),
    b:20,
    s:15
  },
  h:{
    m:1,
    d:'hammer',
    M:_=>say('Hammer: good for building things b(10) s(8)'),
    b:10,
    s:8
  },
  f:{
    m:1,
    d:'food',
    M:_=>say('20 Food: good for gaining stamina b(2)'),
    b:2,
  },
  w:{
    m:1,
    d:'wood',
    M:_=>say('Wood: good for building and making money b(2) s(1)'),
    b:2,
    s:1
  },
  '♦':{
    m:1,
    d:'gemstone',
    M:_=>say('Gemstone: looks pretty s(50)'),
    s:50
  },
  //Critters combat(l,x,e,health,att,mDef,rDef,name,attkName,curio,stamina)
  '^':{
    m:0,
    d:'bat',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,5,5,0,5,'bloodsucking bat','bites','bat wing'),
  },
  '*':{
    m:0,
    d:'giant spider',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,5,5,5,0,'giant spider','poisons','spider eye'),
  },
  's':{
    m:0,
    d:'sinster serpent',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,3,2,3,0,'sinster serpent','strikes','forked tongue','Snake steak'),
  },
  '¶':{
    m:0,
    d:'crazed crow',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,3,2,0,3,'crazed crow','dive bombs','crow beak','Pickled crow feet'),
  },
  'δ':{
    m:0,
    d:'mad coyote',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,4,4,3,3,'mad coyote','bites','hide','Coyote steak'),
  },
  '♣':{
    m:0,
    d:'poisonous plant',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,4,4,3,3,'poisonous plant','stings','Berry','Roots'),
  },
  '◙':{
    m:0,
    d:'vicious box turtle',
    i:(l,[x,y],e)=>combat(map[l][y],x,e,3,2,2,0,'vicious box turtle','snaps','shell','Mock turtle soup'),
  }
}
