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

function Game() {
    let framerate = 30
    let cellSize = 80
    let stroke = 1.6
    let playfieldtop = 60

    // Hide experiment prompt
    document.getElementById('explainGame').style.display='none'

    let settings = gameSettings.loadFromJson("testSettings/testSettings.json")

    let tdGame = new TDGame(settings)
    let playField = new PlayField(document.getElementById("formsBoardCanvas"),
        framerate, 510, 495, settings.gridWidth, settings.gridHeight,
        cellSize, playfieldtop, stroke)
    let learningPanel = new LearningPanel(document.getElementById("learningCanvas"),
        cellSize, settings.nbLocks, settings.shapeNames, 200, 670, stroke)
    let timeline = new Timeline(document.getElementById("timelineCanvas"), 20)
    let targetCanvas = new TargetCanvas(document.getElementById("targetCanvas"),
        160, 160, 50, cellSize, 33, 2/3 * 160,
        10, 160/2, 130, 60, 500, stroke)
    tdGame.bindComponents(playField, timeline, learningPanel, targetCanvas)

    tdGame.initNewStep()


    function tick(){
        tdGame.playfield.draw()
        tdGame.timeline.draw()
        tdGame.targetCanvas.draw()
        tdGame.learningPanel.draw()
    }
    setInterval(tick, 1000 / framerate);
}
