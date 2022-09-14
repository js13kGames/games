let bolas = [];
const tabuleiro = [];
let ferramentaAtual;

for (let y=0; y<51; y++) {
  tabuleiro[y] = [];
  for (let x=0; x<51; x++) {
    const square = document.createElement("div");
    square.classList.add("quadradinho");
    campo.appendChild(square);
    square.x = x;
    square.y = y;
    square.onclick = squareClick;
    tabuleiro[y][x] = square;
  }
}

function addEmoji(x,y,tag,emoji) {
  let elemento = document.createElement(tag);
  tabuleiro[y][x].appendChild(elemento);
  elemento.x = x;
  elemento.y = y;
  elemento.innerText = emoji;
  return elemento;
}

const construcoes = ["🏡","🏘️","🏢","🏦"];

for (let y=45; y<51; y++){
  for (let x=45; x<51; x++){
    let construcao = construcoes[Math.floor(Math.random()*construcoes.length)];
    if (x != 50 || y != 50) addEmoji(x,y,"c",construcao);
  }
}

const natureza = ["⛰️","🌲","🌳","🌴"];

for (let y=0; y<51; y++){
  for (let x=0; x<51; x++){
    let coisa = natureza[Math.floor(Math.random()*natureza.length)];
    if (x > 20 && x < 26 && y >= 0 && y < 30) addEmoji(x,y,"o",coisa);
    if (x > 30 && x < 36 && y > 20 && y < 51) addEmoji(x,y,"o",coisa);
  }
}


addEmoji(50,50,"c","🏰").className = "big";

function squareClick(ev) {
  console.log("você clicou em",this.x, this.y);
  if (this.firstChild){
    return alert("this square already have an element");
  }
  let obstaculo = addEmoji(this.x,this.y,"o",ferramentaAtual);
  tabuleiro.push(obstaculo);
}

function tic() {
  bolas.forEach(bola => {
    bola.x += 1;
    if (bola.x > 50) return bola.morre();
    tabuleiro[bola.y][bola.x].appendChild(bola);
  })
}

function randomSpawn() {
  const rand = Math.floor(Math.random()* 51);
  const bola = addEmoji(0,rand,"b","👽");
  bola.morre = () => {
    bolas = bolas.filter(b => b != bola);
    bola.remove();
  }
  bolas.push(bola);
}

function buttonClick(ev){
  ferramentaAtual = this.innerText;
  console.log(ferramentaAtual);
}

botao1.onclick = buttonClick;
botao2.onclick = buttonClick;
botao3.onclick = buttonClick;
botao4.onclick = buttonClick;
botao5.onclick = buttonClick;

setInterval(randomSpawn, 2000);
console.log(randomSpawn());
setInterval(tic,100);