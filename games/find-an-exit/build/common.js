import { TILE_SIZE, CANVAS_HEIGHT_IN_TILES, CANVAS_WIDTH_IN_TILES } from './constants.js';
export const canvas = document.getElementById('canvas');
canvas.height = TILE_SIZE * CANVAS_HEIGHT_IN_TILES;
canvas.width = TILE_SIZE * CANVAS_WIDTH_IN_TILES;
export const ctx = canvas.getContext('2d');
export const clr = () => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
};
export const resize = () => {
    ctx.canvas.height = window.innerHeight / 2;
    ctx.canvas.width = window.innerWidth / 2;
};
export function centerText(text, y) {
    var measurement = ctx?.measureText(text);
    var x = (canvas.width - measurement.width) / 2;
    ctx?.fillText(text, x, y);
}
