import gameSettings from "./gameSettings.js";

class TDGame {
    constructor(triWeight, cirWeight, squWeight, croWeight, targetMin, targetMax,
                timeLearning, nbSliders, nbLocks, gridWidth, gridHeight,
                shapeNames = ["Triangle", "Circle", "Square", "Cross"],
                showTimeline = true, easyMode = false) {
        this.settings = new gameSettings([triWeight, cirWeight, squWeight, croWeight],
            triWeight, cirWeight, squWeight, croWeight, targetMin, targetMax,
            timeLearning, nbSliders, nbLocks, gridWidth, gridHeight, shapeNames,
            showTimeline, easyMode)

        this.totalClicks = 0
        this.currStep = 0

        this.currNbTargets = -1
        this.currShape = ""
        this.currShapeGrid = []
        this.gridBacklog = []
    }

    initNewStep(){
        if(this.gridBacklog.length === 0){
            this.gridBacklog = this.generateBlock()
        }
        this.currShapeGrid = this.gridBacklog.pop()
    }

    generateBlock(){
        let newBlock = []
        for(let i = 0; i < this.settings.weights.length; i++){
            for(let j = 0; j < this.settings.weights[i]; j++){
                newBlock.push(this.generateGrid(this.settings.shapeNames[i]))
            }
        }
        newBlock = shuffle(newBlock)
        return newBlock
    }

    generateGrid(shape){
        let shapeList = []
        this.currNbTargets = Math.floor(Math.random() * (this.settings.targetMax -
            this.settings.targetMin) + this.settings.targetMin)
        for(let i = 0; i < this.currNbTargets; i++){
            shapeList.push(shape)
        }

        let fillerShapes = []
        for(let i in this.settings.shapeNames){
            if(i !== shape)
                fillerShapes.push(i)
        }

        for(let i = 0; i < this.settings.gridWidth * this.settings.gridHeight - this.currNbTargets; i++){
            let choice = Math.floor(Math.random() * fillerShapes.length);
            shapeList.push(fillerShapes[choice])
        }
        shapeList = shuffle(shapeList)

        let newGrid = []
        for(let i = 0; i < this.settings.gridHeight; i++) {
            newGrid.push([])
            for(let j = 0; j < this.settings.gridWidth; i++){
                newGrid[i].push(shapeList.pop())
            }
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

    shapeSelected(row, col){
        if(this.currShapeGrid[row][col].selectable){
            this.currShapeGrid[row][col].selected = true
        }
        else{
            this.currShapeGrid[row][col].vibrate = true
        }

    }

    async endGamePOST(ipAdress, NB_LOCKS){
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {}
        }

        const timestamp = Date.now();

        options.body = JSON.stringify({
            initDate: initDate,
            ipUser: ipAdress,
            nbTrials: STEP,
            lockSettings: NB_LOCKS,
            sliderTimeBeforeDisappear: TIME_SLIDER,
            nbFormsByBlock: nbFormsByBlock,
            formNameTimeline: formNameTimeline,
            listTryUnlock: listTryUnlock,
            listLockState: listLockState,
            listTimeToUnlock: listTimeToUnlock,
            listSliderDisplaySpan: listSliderDisplaySpan,
            listNbFormToSelect: listNbFormToSelect,
            blockFormFrequence: blockFormFrequence,
            listNbClick: listNbClick,
            listNbUnusefulClick: listNbUnusefulClick,
            listNbLockOpened: listNbLockOpened, //new
            firstUnlockOccurence: firstUnlockOccurence,
            firstUnlockTrial: firstUnlockTrial,
            lastUnlockOccurence: lastUnlockOccurence,
            lastUnlockTrial: lastUnlockTrial,
            listOccurence: listOccurence,
            listDuration: listDuration,
            totalDuration: timestamp - new Date(initDate).getTime(),
            betweenElementIndex: BETWEEN_ELEMENT_INDEX
        });
        const response = await fetch('/api', options);
        const data = await response.json();
        console.log(data);
    }

    static shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}

export default TDGame
