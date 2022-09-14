(function(){
  let count=[],
  event=[]

  window.on={
    count(n,fn){
      count.push({c:n,n:n/2|0,fn})
    },
    event(con,fn){
      event.push({con,fn})
    }
  }
  window.tick=function(){
    let run=[]
    event=event.filter(v=>{

    })
    count=count.filter(v=>{
      if(--v.c==0){
        if(r(3)){
          v.c=v.n
          v.n=++v.n/2|0
        }
        else{
          run.push(v.fn)
          return false
        }
      }
      return true
    })
    run.map(v=>v())
  }
})()
