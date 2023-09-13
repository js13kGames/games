function createDrawing(ctx)
{
    return {
        fillText: (text, x, y, { font = "24px Arial", fillStyle = "white", textAlign = "left" } = {}) => {
            ctx.font = font;      
            ctx.textAlign = textAlign;  
            ctx.fillStyle = fillStyle;
            ctx.fillText(text, x, y);
        },
        fillRect: (x, y, w, h, fillStyle) => {
            ctx.fillStyle = fillStyle;
            ctx.fillRect(x, y, w, h);
        },
        circle: (x, y, r, strokeStyle, lineWidth) => {
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.beginPath();
            context.arc(x, y, r, 0, 2 * Math.PI);
            context.stroke();
        }
    }
} 