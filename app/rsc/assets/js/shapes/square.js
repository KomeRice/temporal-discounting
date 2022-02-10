const shape = require('shape.js')

class Square extends Shape{
    constructor(x, y, width, height, selectable, context) {
        super(x, y, width, height, selectable, context);
        this.bottom = y + height / 2;
        this.top = y - height / 2;
        this.right = x + width / 2;
        this.left = x - width / 2;
        this.colorUnlit = "crimson";
        this.colorLit = "lightpink";
    }

    draw() {
        if (this.vibrate) {
            if (this.vibrateAnimationStep <= 0) {
                this.vibrateAnimationStep = VIBRATION_STEP + 1; //cst shoulb be put
                this.vibrate = false;
                this.vibrateX = 0;
            } else if (this.vibrateAnimationStep <= VIBRATION_STEP / 4) {
                this.vibrateX -= 2;
            } else if (this.vibrateAnimationStep <= 3 * VIBRATION_STEP / 4) {
                this.vibrateX += 2;
            } else {
                this.vibrateX -= 2
            }
            this.vibrateAnimationStep--;
        }
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.fillRect(this.left - this.width * this.marginFactor, this.top - this.height * this.marginFactor,
                this.width + this.width * this.marginFactor, this.height + this.height * this.marginFactor);
            this.ctx.fillStyle = this.colorLit;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.fillRect(this.left + this.vibrateX, this.top, this.w, this.h);
    }

    contains(x, y) {
        return this.left < x < this.right && this.top < y < this.bottom;
    }
}