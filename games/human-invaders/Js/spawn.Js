const spawn = document.querySelector(".campo");
const spawnastro = document.createElement("div");
spawnastro.classList.add("astronalta");
spawn.insertAdjacentElement("beforeend", spawnastro);


let elspawnastro = document.querySelector(".astronalta");
let el = elspawnastro.getBoundingClientRect();

console.log(el);