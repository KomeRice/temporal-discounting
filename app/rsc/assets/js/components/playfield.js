class PlayField {
    constructor(canvasElement, tdGame, framerate, height, width, nbRow, nbCol, cellSize, top) {
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

        this.gameInst = tdGame
        this.canvasElement = canvasElement
        this.canvasElement.height = this.height
        this.canvasElement.width = this.width

        this.canvasElement.style.top = top + "px"
        this.context = this.canvasElement.getContext("2d")
        this.context.lineWidth = this.stroke
    }

    gridX(col) {
        return this.cellSize * (col + 1) + this.cellSize / 3
    }

    gridY(row) {
        return this.margin + this.cellSize * row
    }

    shapeHighlighted(event) {
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

    // TODO: Fill this to fit game logic
    selectShape(event) {
        for (let row of this.gameInst.currShapeGrid) {
            for (let shape of row) {
                shape.highlight = false
            }
        }
    }
}