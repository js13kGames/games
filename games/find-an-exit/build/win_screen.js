import { ctx, canvas, centerText } from './common.js';
class WinScreen {
    constructor() {
        this.#textY = canvas.height / 2;
    }
    #textY;
    render() {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx?.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000000';
        ctx.font = '48px monospace';
        centerText('YOU WIN!', this.#textY);
        ctx.fillStyle = '#000000';
        ctx.font = '24px monospace';
        centerText('This is a prototype, more to come', this.#textY + 30);
    }
}
export default WinScreen;
