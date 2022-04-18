import tdGame from "../tdGame";

class Timeline {
    constructor(timelineElement, size, indexer, step = 8) {
        this.size = size
        this.margin = 20
        this.index_size = (size / 2) + 3
        this.height = size + 2 * this.margin
        this.width = size * step

        this.font = "bold 18px arial"
        this.fontColor = "darkgrey"
        this.indexColor = "darkgrey"
        this.timelineBoardColor = "white"

        this.timelineElement = timelineElement
        this.timelineElement.height = this.height
        this.timelineElement.width = this.width
        this.context = this.timelineElement.getContext("2d")
        this.shapeTimeline = []
        this.indexer = indexer
        this.gameInst = null
    }

    appendTimeline(shape){
        this.shapeTimeline.push(shape)
    }

    refreshTimeline(){
        this.shapeTimeline = []
        for(let i = 0; i < this.gameInst.shapeBacklog.length; i++){
            this.shapeTimeline.push(tdGame.shapeFromName(this.gameInst.shapeBacklog[i],
                this.getDrawX(i), this.getDrawY(),
                this.size, false, this.context))
        }
    }

    getDrawX(col) {
        return this.size * (col + 1 / 2);
    }

    getDrawY() {
        //only one line so no need for argument
        return this.margin + this.size / 2 + 18; // 18 is the size of the font
    }

    drawStep(){
        // Magic numbers
        let textX = 2
        let textY = 23
        this.context.fillStyle = this.fontColor
        this.context.fillText("Step " + (this.gameInst.currStep + 1), textX, textY)
        for(let shape of this.shapeTimeline){
            shape.draw()
        }
        this.indexer.draw()
    }

    drawBoard(){
        this.context.fillStyle = this.timelineBoardColor
        this.context.fillRect(0, 0, this.width, this.height);
    }
}

export default Timeline