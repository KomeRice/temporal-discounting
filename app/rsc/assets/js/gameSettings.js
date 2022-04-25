class gameSettings{
    constructor(weights, triWeight, cirWeight, squWeight, croWeight, nbTargets,
                timeLearning, nbSliders, nbLocks, gridWidth, gridHeight,
                shapeNames = ["Triangle", "Circle", "Square", "Cross"],
                showTimeline = true, easyMode = false) {

        // Shape generation
        // TODO: Generify weights
        this.weights = [triWeight, cirWeight, squWeight, croWeight]
        this.triWeight = triWeight
        this.cirWeight = cirWeight
        this.squWeight = squWeight
        this.croWeight = croWeight
        // Overloading this argument is not recommended
        this.shapeNames = shapeNames

        // Number of targets to show on the grid
        this.nbTargets = nbTargets

        this.gridWidth = gridWidth
        this.gridHeight = gridHeight


        this.nbSliders = nbSliders
        this.nbLocks = nbLocks

        this.showTimeline = showTimeline
        this.timeLearning = timeLearning
        this.easyMode = easyMode
    }
}

export default gameSettings