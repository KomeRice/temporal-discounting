const shape = require('shape.js')

class Square extends Shape{
    constructor(x, y, minSize, selectable, context) {
        let size = minSize / 2
        super(x, y, size, size, selectable, context);
        this.bottom = y + size / 2;
        this.top = y - size / 2;
        this.right = x + size / 2;
        this.left = x - size / 2;
        this.colorUnlit = "crimson";
        this.colorLit = "lightpink";
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.fillRect(this.left - this.width * this.marginFactor,
                this.top - this.height * this.marginFactor,
                this.width + this.width * this.marginFactor,
                this.height + this.height * this.marginFactor);
            this.ctx.fillStyle = this.colorLit;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.fillRect(this.left + this.vibrateX, this.top, this.width, this.height);
    }

    contains(x, y) {
        return this.left < x < this.right && this.top < y < this.bottom;
    }
}