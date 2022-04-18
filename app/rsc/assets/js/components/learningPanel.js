import Square from "../shapes/square";
import Circle from "../shapes/circle";
import Triangle from "../shapes/triangle";
import Cross from "../shapes/cross";

class learningPanel{
    constructor(canvasElement, playfield, cellSize, maxLockCount, shapeNames, top) {
        this.cellSize = cellSize
        this.imgWidth = 4 * cellSize / 12
        this.imgWidth = 5 * cellSize / 12
        this.imgMargin = cellSize / 2
        this.canvMargin = cellSize
        this.height = cellSize * (shapeNames.length + 1) + this.canvMargin / 2
        this.width = 3 / 2 * cellSize + maxLockCount + 1 * (this.imgWidth + this.imgMargin / 3)


        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width
        this.canvasElement.style.top = String(top) + "px"
        // TODO: Fill this
        this.canvasElement.style.left = "200px"

        this.context = this.canvasElement.getContext("2d")
        // TODO: Fill this
        this.context.lineWidth = "2px"

        this.playfield = playfield

        this.shapeDisplay = []

        this.imgLock = new Image()
        this.imgLock.src = 'rsc/img/lock.png'

        this.imgUnlock = new Image()
        this.imgUnlock.src = 'rsc/img/unlock.png'

        for(let i = 0; i < shapeNames.length(); i++){
            switch(shapeNames[i]){
                case "Square":
                    this.shapeDisplay.push(new Square(0, i, this.cellSize, false, this.context))
                    break;
                case "Circle":
                    this.shapeDisplay.push(new Circle(0, i, this.cellSize, false, this.context))
                    break;
                case "Triangle":
                    this.shapeDisplay.push(new Triangle(0, i, this.cellSize, false, this.context))
                    break;
                case "Cross":
                    this.shapeDisplay.push(new Cross(0, i, this.cellSize, false, this.context))
                    break;
            }
        }
    }

    draw(){
        this.context.fillRect(0, 0, this.width, this.height)
        // TODO: LearningPanel draw
        // this.context.strokeRect(this.stroke)
        for(let shape in this.shapeDisplay){
            shape.draw()
        }
    }
}