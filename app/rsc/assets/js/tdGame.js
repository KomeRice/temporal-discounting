import Triangle from "./shapes/triangle.js"
import Circle from "./shapes/circle.js";
import Square from "./shapes/square.js";
import Cross from "./shapes/cross.js";
import GameLog from "./gameLog.js";

class TDGame {
    constructor(settings, ipAddress = null) {
        this.settings = settings
        this.playfield = null
        this.timeline = null
        this.learningPanel = null
        this.targetCanvas = null
        this.nextButton = false

        this.sliderDuration = Math.max(0, this.settings.timeLearning / this.settings.nbLocks - this.settings.noviceTime)
        this.currStep = 0
        this.currSelected = 0

        this.currShape = ""
        this.currShapeGrid = []
        this.gridBacklog = []
        this.shapeBacklog = []
        this.lockStates = []
        for(let i = 0; i < this.settings.shapeNames.length; i++){
            this.lockStates.push(0)
        }
        this.userIp = ipAddress

        this.gameEnded = false
        this.startTime = Date.now()
        this.startStepTime = Date.now()
        this.allShapesSelectedTime = null

        this.stepClicks = 0
        this.stepMode = "novice"

        this.gameLog = new GameLog(this.startTime, this.sliderDuration, this.sumWeight(),
            this.settings.shapeNames, this.settings.nbLocks, this.settings.nbTargets,
            this.settings.triWeight, this.settings.cirWeight, this.settings.squWeight,
            this.settings.croWeight, this.settings.timeLearning, this.userIp)


        document.body.addEventListener("mousedown", () => this.addClick())
    }

    tick() {
        // TODO: 20% interval pauses / 2-3mins - Display percentage of timer?
        // TODO: Remove timer
        // TODO: Cycle locks
        let gameLength = Date.now() - this.startTime
        if(gameLength > this.settings.maxTimer && this.settings.maxTimer !== -1 && !this.gameEnded) {
            this.endGame()
        }
    }

    nextStep() {
        let timeTakenStep = Date.now() - this.startStepTime
        this.logData(timeTakenStep)

        if(this.currStep > this.settings.maxStep - 1 && this.settings.maxStep !== -1 && !this.gameEnded)
            this.endGame()

        this.stepClicks = 0
        this.stepMode = "novice"
        this.startStepTime = Date.now()
        this.nextButton.disabled = true
        this.initNewStep()
    }

    endGame() {
        this.gameEnded = true
        this.gameLog.registerEnd(this.currStep, Date.now() - this.startTime)
        document.getElementById("endGame").style.display = "flex"
        this.targetCanvas.gameEndHandle()

        let data = this.gameLog.exportAsString()
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value: data})
        }

        fetch('/logdata', options).then(r => function (r) {
            console.log('Log status: ' + r)
        })
    }

    startBreak() {
        document.getElementById("breakTime").style.display = "flex"
    }

    logData(timeTakenStep) {
        let sliderApparition = this.targetCanvas.getSliderLifetime()

        this.gameLog.registerStep(this.getCurrStep(), this.currShape,
            this.getLockState(this.currShape), timeTakenStep, this.allShapesSelectedTime
            , this.stepClicks, this.stepMode, sliderApparition)
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
            this.stepMode = "learning"
            this.lockStates[index]++
        }
    }

    getLockState(shape) {
        let index = this.settings.shapeNames.indexOf(shape)
        if(index === -1){
            console.log("Attempted to access unknown shape in shapeUnlocked: " + shape)
            return -1
        }
        return this.lockStates[index]
    }

    isShapeUnlocked(shape = this.currShape){
        return this.getLockState(shape) === this.settings.nbLocks
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

    bindComponents(playfield, timeline, learningPanel, targetCanvas, nextButton){
        this.bindPlayfield(playfield)
        this.bindTimeline(timeline)
        this.bindLearningPanel(learningPanel)
        this.bindTargetCanvas(targetCanvas)
        this.nextButton = nextButton
        this.nextButton.addEventListener('click', () => this.nextStep())
    }

    initNewStep(){
        if(this.playfield === null){
            console.log("Playfield must be bound before initialising game step")
            return
        }

        if(this.gridBacklog.length < this.sumWeight()){
            this.generateBlock()
            this.generateBlock()
        }

        this.timeline.refreshTimeline()
        this.currShape = this.shapeBacklog.shift()
        this.currShapeGrid = this.gridBacklog.shift()

        this.targetCanvas.newStepProcess()

        this.currSelected = 0
        this.currStep++
    }

    generateBlock() {
        let newBlockShapes = []
        for(let i = 0; i < this.settings.weights.length; i++){
            for(let j = 0; j < this.settings.weights[i]; j++){
                let newShape = this.settings.shapeNames[i]
                newBlockShapes.push(newShape)
            }
        }

        newBlockShapes = TDGame.shuffle(newBlockShapes)
        this.shapeBacklog = this.shapeBacklog.concat(newBlockShapes)

        for(let shapeName in newBlockShapes){
            this.gridBacklog.push(this.generateGrid(newBlockShapes[shapeName]))
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
            if(this.settings.shapeNames[i] !== targetShape)
                fillerShapes.push(this.settings.shapeNames[i])
        }

        // Add filler shapes to shape list
        for(let i = 0; i < this.settings.gridWidth * this.settings.gridHeight - this.settings.nbTargets; i++){
            let choice = Math.floor(Math.random() * fillerShapes.length);
            shapeList.push(fillerShapes[choice])
        }

        // Shuffle list of shape names
        shapeList = TDGame.shuffle(shapeList)

        let newGrid = []
        for(let i = 0; i < this.settings.gridHeight; i++) {
            newGrid.push([])
            for(let j = 0; j < this.settings.gridWidth; j++){
                let newShapeName = shapeList.pop()
                let newShape = TDGame.shapeFromName(newShapeName, this.playfield.gridX(j), this.playfield.gridY(i),
                    this.playfield.cellSize, newShapeName === targetShape, this.playfield.context)
                newGrid[i].push(newShape)
            }
        }

        if(shapeList.length !== 0){
            console.log("generateGrid(): Shape list has an overflow of " + String(shapeList.length))
        }

        return newGrid
    }

    addClick(){
        this.stepClicks++
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
        if(this.currShapeGrid[row][col].getShapeName() === this.currShape){
            if(this.isShapeUnlocked(this.currShape)){
                for(let i = 0; i < this.settings.gridHeight; i++) {
                    for(let j = 0; j < this.settings.gridWidth; j++){
                        if(this.currShapeGrid[i][j].getShapeName() === this.currShape){
                            this.currShapeGrid[i][j].selected = true
                        }
                    }
                }
                this.stepMode = "expert"
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
            this.currShapeGrid[row][col].doVibrate = true
        }
    }

    allSelected(){
        this.allShapesSelectedTime = Date.now() - this.startStepTime
        this.targetCanvas.unlockButtonClickable = true
        this.nextButton.disabled = false
    }

    getCurrTime() {
        if(this.gameEnded)
            return this.settings.maxTimer
        return Date.now() - this.startTime
    }

    getCurrStep(){
        if(this.currStep > this.settings.maxStep && this.settings.maxStep !== -1)
            return this.settings.maxStep
        return this.currStep
    }

    getMaxTime() {
        return this.settings.maxTimer
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
