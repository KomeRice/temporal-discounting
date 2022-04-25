class PlayField {
    constructor(canvasElement, framerate, height, width, nbRow, nbCol, cellSize, top) {
        this.framerate = framerate
        this.height = height
        this.width = width
        this.nbRow = nbRow
        this.nbCol = nbCol
        this.cellSize = cellSize

        this.stroke = cellSize / 12
        this.margin = 3 / 2 * cellSize
        this.selectMargin = cellSize / 8

        this.colorBoard = "gainsboro"
        this.colorBorder = "grey"
        this.colorSelect = "white"

        this.gameInst = null
        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width

        this.grid = []
        this.canvasElement.style.top = String(top) + "px"
        this.context = this.canvasElement.getContext("2d")
        this.context.lineWidth = this.stroke

        this.canvasElement.addEventListener("mousmove", this.highlightShape)
        this.canvasElement.addEventListener("mousedown", this.selectShape)
    }

    gridX(col) {
        return this.cellSize * (col + 1) + this.cellSize / 3
    }

    gridY(row) {
        return this.margin + this.cellSize * row
    }

    highlightShape(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        document.body.style.cursor = "auto";
        for (let row of this.gameInst.currShapeGrid) {
            for (let shape of row) {
                shape.highlight = false
            }
        }

        for (let row of this.gameInst.currShapeGrid) {
            for (let shape of row) {
                if (shape.contains(x, y) && !shape.selected) {
                    shape.highlight = true
                    document.body.style.cursor = "pointer";
                    return
                }
            }
        }
    }

    selectShape(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        for (let row = 0; row < this.gameInst.currShapeGrid.length; row++) {
            for (let col = 0; col < this.gameInst.currShapeGrid[row].length; col++) {
                let shape = this.gameInst.currShapeGrid[row][col]
                if(shape.contains(x, y) && !shape.selected){
                    this.gameInst.selectShape(x, y)
                }
            }
        }
    }

    drawBoard(){
        this.context.fillStyle = this.colorBoard
        this.context.strokeStyle = this.colorBorder
        this.context.fillRect(0, 0, this.width, this.height)
        this.context.strokeRect(this.stroke / 2, this.stroke / 2,
            this.width - this.stroke, this.height - this.stroke)
    }

    drawShapes(){
        for(let row of this.gameInst.currShapeGrid){
            for(let shape of row){
                shape.draw()
            }
        }
    }
}

export default PlayField