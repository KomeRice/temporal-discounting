class TargetCanvas {
    constructor(canvasElement, height, width, topMargin, cellSize,
                unlockHeight, unlockWidth, unlockRadius, unlockX, unlockY,
                top, left, stroke) {
        this.height = height
        this.width = width

        this.cellSize = cellSize
        this.topMargin = topMargin

        this.unlockHeight = unlockHeight
        this.unlockWidth = unlockWidth
        this.unlockX = unlockX
        this.unlockY = unlockY
        this.unlockRadius = unlockRadius

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

        this.timerComplete = false



        this.gameInst = null
    }
}