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

    //TODO: Fix load function (currently hardcoded settings)
    static loadFromJson(path) {
        let json = fetch(path).then(data => {
            return data.json()
        })

        /*return new gameSettings(
            [], json.triWeight, json.cirWeight, json.squWeight,
            json.croWeight, json.nbTargets,
            json.timeLearning, json.nbSliders,
            json.nbLocks, json.gridWidth, json.gridHeight,
            json.shapeNames, json.showTimeline, json.easyMode)*/
        return new gameSettings(5, 5, 5, 5, 5, 5,
            2000, 2, 4, 4, 4,
            ["Triangle", "Circle", "Square", "Cross"], true, true)
    }
}

export default gameSettings