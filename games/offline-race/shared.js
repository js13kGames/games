function allowMove(from,to,lMove){
  let allow = (Math.abs(to.x - from.x) <= 1 && Math.abs(to.y - from.y) <=1) && !(lMove != null && (to.x == lMove.x && to.y == lMove.y));
  return allow;
}