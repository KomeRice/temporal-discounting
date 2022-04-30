/*
* This is the main JS file
* CAUTION : DO NOT EDIT THE EXPRESS SERVER INITIALIZATION !
*/

//BEGIN EXPRESS SERVER INITIALIZATION
var init = require('./myexpress-init/server.js');
app = init();
//END EXPRESS SERVER INITIALIZATION

const Datastore = require('nedb');
const nodemailer = require("nodemailer");

let fs = require('fs')
let lockDecider = Math.floor(Math.random() * 100)



app.get('/', function(req, res) {
	res.sendFile(__dirname + '/tutorial.html');
});
const express = require('./myexpress-init/node_modules/express')
app.use(express.static(__dirname + '/'));
app.use(express.json( /*{limit:'1mb'} */ ));

const database = new Datastore({ filename: './rsc/data/database.db', autoload: true });

//database.remove({}, { multi: true }, function(err, numRemoved) {
//   database.loadDatabase(function(err) {});
//});


const gameParameters = new Datastore({ filename: './rsc/data/gameParameters.db', autoload: true });
const betweenElementIndexMemory = [];

app.get('/api', (request, response) => {
	console.log(database);
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.get('/lockDecider', (request, response) => {
    console.log('Served lock decider ' + lockDecider)
    response.json({value: lockDecider})
    lockDecider++
})

app.post('/logdata', (request, response) => {
    let path = 'rsc/data/gameData.csv'
    let data = request.body.value
    let success = false

    let header = 'date, user_ip, trial_id, block_id, n_trials, n_block, block_size,' +
        ' target_shape, target_id, target_freq, target_n, timeLearning, setting_used, n_locks,' +
        'lock_duration, unlock_action, lock_state, occurrence, time, time_selected, time_next,' +
        'slider_display_span, n_opened_locker, first_unlock_occurrence, first_unlock_trial, nb_total_click,' +
        'exp_total_time, mode_used\n'

    fs.writeFile(path, header, { flag: 'wx' }, function (err) {
        if (err)
            console.log('File does not exist and failed to be created');
        console.log("File created successfully");
    });

    fs.appendFile(path, data + '\n', function(err) {
        if(err) {
            console.log(path + ' : error while accessing')
        }
        console.log('Data saved successfully')
        success = true
    })
    let status = 'failure'
    if(success)
        status = 'success'
    response.json({
        status: status,
    })
})

app.post('/api', (request, response) => {
    console.log('I got a request to log data');
    const data = request.body;
    database.insert(data);
    console.log(data);

    betweenElementIndexMemory[data.betweenElementIndex] += 1;
    response.json({
        status: 'success',
        data: data
    });
});

app.get('/gameParameters' /*getData*/ , (request, response) => {
    gameParameters.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }

        if (betweenElementIndexMemory.length !== data[0]["betweenElements"].length) {
            betweenElementIndexMemory.length = data[0]["betweenElements"].length;
            betweenElementIndexMemory.fill(0);
        }
        let currentBetweenElement = argMin(betweenElementIndexMemory);
        const currentBetweenJson = data[0]["betweenElements"][currentBetweenElement];

        data[0]['nbLock'] = currentBetweenJson['nbLock'];
        data[0]['nbSlidesToUnlock'] = currentBetweenJson['nbSlides'];
        data[0]['timeBeforeSliderDisappear'] = currentBetweenJson['timeSlider'];
        data[0]['betweenElementIndex'] = currentBetweenElement;

        console.log(data);
        response.json(data);
    });
});

app.get('/settings', (request, response) => {
    console.log('I got a request to send game parameters from settings page');

    gameParameters.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        console.log(data);
        response.json(data);
    });
});

app.post('/settings', (request, response) => {
    console.log('I got a request to update settings');

    const data = request.body;
    //change database of the game parameters :
    gameParameters.remove({}, { multi: true }, function(err, numRemoved) {
        gameParameters.loadDatabase(function(err) {
            // done
        });
    });
    gameParameters.insert(data);

    /* repondre au post */
    response.json({
        status: 'success',
        data: data
    });
});

app.get('/password' /*getData*/ , (request, response) => {
    response.json({
        status: 'success',
        password: 'gilles'
    });
});

//prepare mail :
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "ihmexpert2020@gmail.com",
        pass: "Gilles2020",
    },
});

app.post('/mail', (request, response) => {
    console.log('I got a request to send mail');
    const mail = request.body;

    // send mail with defined transport object
    //let info = await 
/*     transporter.sendMail({
        from: '"IHM expert" <ihmexpert2020@gmail.com>', // sender address
        to: "gilles.bailly@sorbonne-universite.fr", // list of receivers
        subject: "Comment", // Subject line
        //text: "Hello world?", // plain text body
        html: mail.content, // html body
    }); */

    //console.log("Message sent: %s", info.messageId);

    /* repondre au post */
    response.json({
        status: 'success',
        message: 'sent',
    });
});

function argMin(array) {
    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}