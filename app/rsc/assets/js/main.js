import TDGame from "./tdGame.js";
import LearningPanel from "./components/learningPanel.js"
import PlayField from "./components/playfield.js";
import Timeline from "./components/timeline.js";
import TargetCanvas from "./components/targetCanvas.js";
import gameSettings from "./gameSettings.js";


//-----------------------------------------------------------------------------------
//                            GAME PARAMETERS
//-----------------------------------------------------------------------------------


function updateIntroMsg(nTask, formsList) {
    document.getElementById("nTask").innerHTML = nTask + " tasks";
    document.getElementById("shapeList").innerHTML = "(" + formsList + ")";
}


//--------------------------------------------------------------------------------
//                  GAME variables to post in the database
//--------------------------------------------------------------------------------

let infoButton = document.querySelector(".infoButton")
infoButton.addEventListener('click', Game)

async function Game() {
    let framerate = 30
    let cellSize = 80
    let stroke = 1.6
    let playfieldtop = 60

    // Hide experiment prompt
    document.getElementById('explainGame').style.display='none'

    let path = "testSettings/testSettings.json"

    fetch(path).then(response => response.json()).then(json => {
        let settings = new gameSettings(
            [], json.triWeight, json.cirWeight, json.squWeight,
            json.croWeight, json.nbTargets,
            json.timeLearning, json.nbSliders,
            json.nbLocks, json.gridWidth, json.gridHeight,
            json.shapeNames, json.showTimeline, json.easyMode)

        let tdGame = new TDGame(settings)
        let playField = new PlayField(document.getElementById("formsBoardCanvas"),
            framerate, 510, 495, settings.gridWidth, settings.gridHeight,
            cellSize, playfieldtop, stroke)
        let learningPanel = new LearningPanel(document.getElementById("learningCanvas"),
            cellSize, settings.nbLocks, settings.shapeNames, playfieldtop, 670, stroke)
        let timeline = new Timeline(document.getElementById("timelineCanvas"), 20)
        let targetCanvas = new TargetCanvas(document.getElementById("targetCanvas"),
            160, 160, 50, cellSize, 33, 2/3 * 160,
            10, 160/2, 130, 60, 500, stroke)
        tdGame.bindComponents(playField, timeline, learningPanel, targetCanvas)

        tdGame.initNewStep()

        function tick() {
            tdGame.playfield.draw()
            tdGame.timeline.draw()
            tdGame.targetCanvas.draw()
            tdGame.learningPanel.draw()
        }

        setInterval(tick, 1000 / framerate)
    })
}
