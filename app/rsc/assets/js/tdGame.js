class TDGame {
    constructor(triWeight, cirWeight, squWeight, croWeight, targetMin, targetMax,
                timeLearning, nbSliders, nbLocks,
                shapeNames = ["Triangle", "Circle", "Square", "Cross"],
                showTimeline = true) {
        this.totalClicks = 0
        this.triWeight = triWeight
        this.cirWeight = cirWeight
        this.squWeight = squWeight
        this.croWeight = croWeight
        // While an overload is set up for this parameter, using it is not recommended
        this.shapeNames = shapeNames
        this.targetMin = targetMin
        this.targetMax = targetMax
        this.showTimeline = showTimeline
        this.nbSliders = nbSliders
        this.nbLocks = nbLocks
        this.timeLearning = timeLearning
        this.currStep = 0

        this.currShapeGrid = []
    }

    addClick(){
        this.totalClicks++
    }

    sumWeight(){
        return this.triWeight + this.cirWeight + this.squWeight + this.croWeight
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


}

export default TDGame
