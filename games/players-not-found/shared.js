"use strict";

const SpriteW = 32;
const SpriteH = 64;
const MapW = 1000;
const MapH = 400;
const spriteStartID = 8; // where non player sprites started
const spriteColors = ["161"/*,"233"*/,"234","453","555","eb2","632","052"]; // colors of non player sprites

function rand(nb) {
    return Math.random()*nb|0;
}
