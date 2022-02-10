class Shape{
    constructor(x, y, width, height, selectable, context){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.selectable = selectable
        this.ctx = context
        this.highlight = false
        this.selected = false
        this.unlocked = false
        this.vibrate = false
        this.vibrateX = 0
        this.vibrateAnimationStep = 8
        this.colorUnlit = "black"
        this.colorLit = "gray"
        this.marginFactor = 0.1
    }
}