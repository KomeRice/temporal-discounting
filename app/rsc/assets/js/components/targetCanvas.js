import Button from "../shapes/button";

class TargetCanvas {
    constructor(canvasElement, height, width, topMargin, cellSize,
                unlockHeight, unlockWidth, unlockRadius, unlockX, unlockY,
                top, left, stroke) {
        this.height = height
        this.width = width

        this.cellSize = cellSize
        this.topMargin = topMargin

        this.top = top
        this.left = left

        this.targetColorFont = "red"
        this.targetColorFontUnlocked = "#4CAF50"
        this.unlockButtonColorUnlit = "white";
        this.unlockButtonColorLit = "gray";
        this.unlockButtonColorStroke = "darkgrey";

        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width

        this.canvasElement.style.top = String(this.topMargin + top) + "px"
        this.canvasElement.style.left = String(left + stroke) + "px"

        this.context = this.canvasElement.getContext("2d")
        this.context.lineWidth = stroke

        this.displayUnlockButton = true
        this.unlockButtonClickable = false
        this.unlockHeight = unlockHeight
        this.unlockWidth = unlockWidth
        this.unlockX = unlockX
        this.unlockY = unlockY
        this.unlockRadius = unlockRadius
        this.unlockButton = new Button(this.unlockX, this.unlockY,
            this.unlockWidth, this.unlockHeight, this.unlockRadius, this.context)


        this.canvasElement.addEventListener("mousemove", this.highlightButton)
        this.canvasElement.addEventListener("mousedown", this.unlockClick)

        this.timerComplete = false

        this.slider = null
        this.gameInst = null
    }

    highlightButton(event){
        if(!this.displayUnlockButton)
            return
        let x = event.offsetX
        let y = event.offsetY

        this.unlockButton.highlight = false

        if(this.unlockButton.contains(x, y)){
            if(this.unlockButtonClickable){
                this.unlockButton.highlight = true;
                document.body.style.cursor = "pointer"
            }
            else{
                document.body.style.cursor = "not-allowed"
            }
        }
    }

    unlockClick(event){
        if(!this.displayUnlockButton)
            return
        let x = event.offsetX
        let y = event.offsetY

        if(this.unlockButton.contains(x, y)){
            this.slider = new Slider(this)
            this.displayUnlockButton = false
        }
    }
}

class Slider {
    constructor(parent, top, left, width, slideDuration = 1000) {
        this.parent = parent

        this.display = false
        this.startTime = null
        this.slideDuration = slideDuration

        this.done = false
        this.canvasElement = document.createElement('input')
        this.canvasElement.id = 'slider'
        this.canvasElement.type = 'range'
        this.canvasElement.style.top = top
        this.canvasElement.style.left = left
        this.canvasElement.style.position = 'absolute'
        this.canvasElement.style.width = width
        this.canvasElement.onmouseover = this.setCursorStyleGrab
        this.canvasElement.onmousedown = this.mouseDown
        this.canvasElement.onmouseup = this.setCursorStyleGrab
        this.canvasElement.style.background = "darkorange"
        this.canvasElement.oninput = this.onInput

        this.sliderDirection = 'right'

        document.body.appendChild(this.canvasElement)

        this.oldValue = 0
        this.nbSlide = 0
    }

    onInput(event){
        if(Date.now() - this.startTime + 300 > this.slideDuration){
            this.done = true
        }

        let newValue = parseInt(this.canvasElement['target'].value)
        if(this.sliderDirection === 'right'){
            if(newValue >= this.oldValue){
                this.oldValue = newValue
            }
            else{
                this.oldValue = newValue
                this.sliderDirection = 'left'
                this.nbSlide++
            }
        }
        else{
            if (newValue <= this.oldValue) {
                this.oldValue = newValue;
            } else {
                this.oldValue = newValue;
                this.sliderDirection = 'right';
                this.nbSlide++;
            }
        }

        if (this.nbSlide > NB_SLIDES) {
            this.done = true;
        }
    }

    setColor(color){
        this.canvasElement.style.background = color
    }

    setCursorStyleGrab(){
        this.canvasElement.style.cursor = 'grab'
    }

    mouseDown(){
        this.canvasElement.style.cursor = 'grabbing';
        this.startTime = Date.now()
    }

    killSlider(){
        try{
            this.parent.gameInst.shapeUnlock()
            document.getElementById('slider').remove()
        } catch {
            console.log('slider already killed')
        }
    }
}