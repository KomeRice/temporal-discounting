import tdGame from "../tdGame";

class learningPanel{
    constructor(canvasElement, cellSize, maxLockCount, shapeNames, top, left, stroke) {
        this.cellSize = cellSize
        this.imgWidth = 4 * cellSize / 12
        this.imgHeight = 5 * cellSize / 12
        this.imgMargin = cellSize / 2
        this.canvMargin = cellSize
        this.height = cellSize * (shapeNames.length + 1) + this.canvMargin / 2
        this.width = 3 / 2 * cellSize + maxLockCount + 1 * (this.imgWidth + this.imgMargin / 3)

        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width
        this.canvasElement.style.top = String(top) + "px"
        this.canvasElement.style.left = String(left) + "px"

        this.colorBoard = "gainsboro"
        this.colorBorder = "grey"
        this.colorSelect = "white"

        this.context = this.canvasElement.getContext("2d")
        // TODO: Fill this
        this.stroke = stroke
        this.context.lineWidth = stroke

        this.gameInst = null

        this.shapeDisplay = []

        this.imgLock = new Image()
        this.imgLock.src = 'rsc/img/lock.png'

        this.imgUnlock = new Image()
        this.imgUnlock.src = 'rsc/img/unlock.png'

        for(let i = 0; i < shapeNames.length(); i++){
            this.shapeDisplay.push(tdGame.shapeFromName(shapeNames[i],
                this.getDrawX(), this.getDrawY(i), this.cellSize, false, this.context))
        }
    }

    getDrawX() {
        return 3 / 4 * this.cellSize
    }

    getDrawY(row){
        return this.canvMargin + this.cellSize * row
    }

    getImgX(col){
        return 3 / 2 * this.cellSize + col * this.imgMargin - this.imgWidth / 2
    }

    getImgY(row){
        return this.canvMargin + this.cellSize * row - this.imgHeight / 2
    }

    draw(){
        this.context.fillStyle = this.colorBoard
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeStyle(this.stroke / 2, this.stroke / 2,
            this.width - this.stroke, this.height - this.stroke)

        for(let shape in this.shapeDisplay){
            shape.draw()
        }

        for(let i = 0; i < this.gameInst.settings.shapeNames.length; i++){
            let shapeLockState = this.gameInst.lockStates[i]
            for(let j = 0; j < this.gameInst.settings.nbLocks; j++){
                let lockImg = this.imgLock
                if(j < shapeLockState){
                    lockImg = this.imgUnlock
                }
                this.context.drawImage(lockImg, this.getImgX(j), this.getImgY(i),
                    this.imgWidth, this.imgHeight)
            }
        }
    }
}
