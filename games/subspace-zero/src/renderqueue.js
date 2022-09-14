let rQ={ui:[],bg:[],sp:[]};function addRQUI(obj){rQ.ui.push({obj})}
function addRQBG(obj){rQ.bg.push({obj})}
function addRQSP(obj){rQ.sp.push({obj})}
function clearRenderQ(){rQ.ui.length=0;rQ.ui=[];rQ.bg.length=0;rQ.bg=[];rQ.sp.length=0;rQ.sp=[]}
function clearRenderQSpt(){rQ.sp.length=0;rQ.sp=[]}