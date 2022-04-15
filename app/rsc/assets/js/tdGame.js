class TDGame {
    constructor(triWeight, cirWeight, squWeight, croWeight, targetMin, targetMax,
                timeLearning, nbSliders, nbLocks, gridWidth, gridHeight,
                shapeNames = ["Triangle", "Circle", "Square", "Cross"],
                showTimeline = true, easyMode = false) {
        this.totalClicks = 0

        this.weights = [triWeight, cirWeight, squWeight, croWeight]
        this.triWeight = triWeight
        this.cirWeight = cirWeight
        this.squWeight = squWeight
        this.croWeight = croWeight
        // While an overload is set up for this parameter, using it is not recommended
        this.shapeNames = shapeNames
        this.targetMin = targetMin
        this.targetMax = targetMax
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight
        this.showTimeline = showTimeline
        this.nbSliders = nbSliders
        this.nbLocks = nbLocks
        this.timeLearning = timeLearning
        this.currStep = 0
        this.easyMode = easyMode

        this.currNbTargets = -1
        this.currShape = ""
        this.currShapeGrid = []

    }

    initFirstStep(){
        this.currShape = this.pickNewShape()
    }

    generateGrid(){
        let shapeList = []
        this.currNbTargets = Math.floor(Math.random() * (this.targetMax - this.targetMin) + this.targetMin)
        for(let i = 0; i < this.currNbTargets; i++){
            shapeList.push(this.currShape)
        }

        let fillerShapes = []
        for(let i in this.shapeNames){
            if(i !== this.currShape)
                fillerShapes.push(i)
        }

        for(let i = 0; i < this.gridWidth * this.gridHeight - this.currNbTargets; i++){
            let choice = Math.floor(Math.random() * fillerShapes.length);
            shapeList.push(fillerShapes[choice])
        }
        shapeList = shuffle(shapeList)

        let newGrid = []
        for(let i = 0; i < this.gridHeight; i++) {
            newGrid.push([])
            for(let j = 0; j < this.gridWidth; i++){
                newGrid[i].push(shapeList.pop())
            }
        }

        return newGrid
    }

    addClick(){
        this.totalClicks++
    }

    sumWeight(){
        return this.triWeight + this.cirWeight + this.squWeight + this.croWeight
    }

    pickNewShape(){
        let rand = Math.floor(Math.random() * this.sumWeight())
        let s = 0
        for(let i = 0; this.shapeNames.length; i++) {
            s += this.weights[i]
            if(rand < s)
                return this.shapeNames[i]
        }
        return this.shapeNames[this.shapeNames.length - 1]
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
