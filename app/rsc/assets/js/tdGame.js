import gameSettings from "./gameSettings.js";
import Triangle from "./shapes/triangle.js"
import Circle from "./shapes/circle.js";
import Square from "./shapes/square.js";
import Cross from "./shapes/cross.js";

class TDGame {
    constructor(triWeight, cirWeight, squWeight, croWeight, targetMin, targetMax,
                timeLearning, nbSliders, nbLocks, gridWidth, gridHeight,
                shapeNames = ["Triangle", "Circle", "Square", "Cross"],
                showTimeline = true, easyMode = false) {
        this.settings = new gameSettings([triWeight, cirWeight, squWeight, croWeight],
            triWeight, cirWeight, squWeight, croWeight, targetMin, targetMax,
            timeLearning, nbSliders, nbLocks, gridWidth, gridHeight, shapeNames,
            showTimeline, easyMode)
        this.playfield = null
        this.timeline = null
        this.learningPanel = null
        this.targetCanvas = null

        this.totalClicks = 0
        this.currStep = 0
        this.currSelected = 0

        this.currShape = ""
        this.currShapeGrid = []
        this.gridBacklog = []
        this.shapeBacklog = []
        this.lockStates = []
        for(let i = 0; i < shapeNames.length; i++){
            this.lockStates.push(0)
        }
    }

    removeLock(shape){
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlocked: " + shape)
            return false
        }

        if(!this.isShapeUnlocked(shape)){
            this.lockStates[index]--
        }
    }

    shapeUnlockOne(shape = this.currShape){
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlockOne: " + shape)
            return false
        }

        if(!this.isShapeUnlocked(shape)){
            this.lockStates[index]++
        }
    }

    isShapeUnlocked(shape){
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlocked: " + shape)
            return false
        }
        return this.lockStates[index] === this.settings.nbLocks
    }

    shapeUnlock(){

    }

    bindPlayfield(playfield){
        this.playfield = playfield
        this.playfield.gameInst = this
    }

    bindTimeline(timeline){
        this.timeline = timeline
        this.timeline.gameInst = this
    }

    bindLearningPanel(learningPanel){
        this.learningPanel = learningPanel
        this.learningPanel.gameInst = this
    }

    bindTargetCanvas(targetCanvas){
        this.targetCanvas = targetCanvas
        this.targetCanvas.gameInst = this
    }

    bindComponents(playfield, timeline, learningPanel, targetCanvas){
        this.bindPlayfield(playfield)
        this.bindTimeline(timeline)
        this.bindLearningPanel(learningPanel)
        this.bindTargetCanvas(targetCanvas)
    }

    initNewStep(){
        if(this.playfield === null){
            console.log("Playfield must be bound before initialising game step")
            return
        }
        if(this.gridBacklog.length === 0){
            this.generateBlock()
        }

        this.currShape = this.shapeBacklog.shift()
        this.currShapeGrid = this.gridBacklog.shift()

        this.targetCanvas.newStepProcess()

        this.currSelected = 0
        this.currStep++
    }

    generateBlock(){
        let newBlockShapes = []
        for(let i = 0; i < this.settings.weights.length; i++){
            for(let j = 0; j < this.settings.weights[i]; j++){
                newBlockShapes.push(this.settings.shapeNames[i])
            }
        }

        newBlockShapes = shuffle(newBlockShapes)
        this.shapeBacklog = newBlockShapes

        for(let shapeName in this.shapeBacklog){
            this.gridBacklog.push(this.generateGrid(shapeName))
        }
    }

    generateGrid(targetShape){
        if(this.playfield === null){
            console.log("Playfield must be bound before generating a grid")
            return
        }

        // String list containing shape names to place on playfield
        let shapeList = []

        // Add nbTargets * targetShape to list
        for(let i = 0; i < this.settings.nbTargets; i++){
            shapeList.push(targetShape)
        }

        // Define filler shapes
        let fillerShapes = []
        for(let i in this.settings.shapeNames){
            if(i !== targetShape)
                fillerShapes.push(i)
        }

        // Add filler shapes to shape list
        for(let i = 0; i < this.settings.gridWidth * this.settings.gridHeight - this.settings.shapeNames; i++){
            let choice = Math.floor(Math.random() * fillerShapes.length);
            shapeList.push(fillerShapes[choice])
        }

        // Shuffle list of shape names
        shapeList = shuffle(shapeList)

        let newGrid = []
        for(let i = 0; i < this.settings.gridHeight; i++) {
            newGrid.push([])
            for(let j = 0; j < this.settings.gridWidth; j++){
                let newShapeName = shapeList.pop()
                // TODO: Give grid to playfield
                let newShape = TDGame.shapeFromName(newShapeName, this.playfield.gridX(j), this.playfield.gridY(i),
                    this.playfield.cellSize, newShapeName === targetShape, this.playfield.context)
                newGrid[i].push(newShape)
            }
        }

        if(shapeList.length() !== 0){
            console.log("generateGrid(): Shape list has an overflow of " + String(shapeList.length()))
        }

        return newGrid
    }

    addClick(){
        this.totalClicks++
    }

    sumWeight(){
        return this.settings.triWeight + this.settings.cirWeight + this.settings.squWeight + this.settings.croWeight
    }

    pickNewShape(){
        let rand = Math.floor(Math.random() * this.sumWeight())
        let s = 0
        for(let i = 0; this.settings.shapeNames.length; i++) {
            s += this.settings.weights[i]
            if(rand < s)
                return this.settings.shapeNames[i]
        }
        return this.settings.shapeNames[this.settings.shapeNames.length - 1]
    }

    selectShape(row, col){
        // TODO: Make nextbutton appear
        if(this.currShapeGrid[row][col].getShapeName() === this.currShape){
            if(this.isShapeUnlocked(this.currShape)){
                for(let i = 0; i < this.settings.gridHeight; i++) {
                    for(let j = 0; j < this.settings.gridWidth; j++){
                        if(this.currShapeGrid[i][j].getShapeName() === this.currShape){
                            this.currShapeGrid.selected = true
                        }
                    }
                }
                this.allSelected()
            }
            else{
                this.currShapeGrid[row][col].selected = true
                this.currSelected++
                if(this.currSelected === this.settings.nbTargets){
                    this.allSelected()
                }
            }
        }
        else{
            this.currShapeGrid[row][col].vibrate = true
        }
    }

    allSelected(){
        // TODO: all is selected, what do
        // log stuff
        // reset
        this.targetCanvas.unlockButtonClickable = true

    }

    static shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    static shapeFromName(shapeName, x, y, minSize, selectable, context){
        switch(shapeName){
            case "Triangle":
                return new Triangle(x, y, minSize, selectable, context)
            case "Circle":
                return new Circle(x, y, minSize, selectable, context)
            case "Square":
                return new Square(x, y, minSize, selectable, context)
            case "Cross":
                return new Cross(x, y, minSize, selectable, context)
            default:
                console.log('Unknown shape specified: ' + shapeName)
        }
    }
}

export default TDGame
