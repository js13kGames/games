import { ctx, canvas, centerText } from './common.js';
class StartScreen {
    constructor() {
        this.#textY = canvas.height / 2;
    }
    #textY;
    render() {
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 4;
        ctx?.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px monospace';
        centerText('Find an EXIT', this.#textY);
        ctx.font = '24px monospace';
        centerText('press Enter to begin', this.#textY + 30);
        ctx.font = '18px monospace';
        centerText('Find the exit before you run out of health', this.#textY + 80);
    }
}
export default StartScreen;
