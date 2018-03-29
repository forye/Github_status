/**
 * Created by Idan on 7/26/2015.
 */
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var request = require('request');

var Message = require('./app/models/messageModel.js');
var database = require('./app/config/database.js');
var cfg = require('./app/config/appConfig.js');
var git = require('./app/config/githubApi.js');

var minutesPerMesssagesItteration =  cfg.minutesPerMesssagesItteration*60*10;
var statusUpdateInterval =  cfg.minutesPerStatusItteration*60*10;
var debug =  cfg.debug;
var globalStatus;
var globalMessages;
var muteMessages = false;
var muteStatus = false;
mongoose.connect(database.url);
app.use(express.static(__dirname + '/public'));
app.listen(cfg.ListenToPort);


app.get('/api/messages', function(req, res) {
    if (!globalMessages) UpdateMessages();
        try {
        if (debug) console.log("got messages get request")
        Message.find()
            .sort({created_on : 'descending'})
            .limit(cfg.maxRecordsToSend)
            .select('status body created_on')
            .exec(function (err, messages) {
                if (err)
                    res.send(err)
                globalMessages = messages;
                res.send(messages)
            });
    } catch(ex)
    {
        HandleException(ex);
        res.send(new Error("Error getting messages"))
    }
});


app.get('/api/status', function(req, res) {
    if (debug) console.log("got status get request")
    if (!globalStatus) {
        getStatus( function(){
            res.send(globalStatus);
        });
    }
    else res.send(globalStatus);
});


//in case I'm way off, here a simple realization
app.get('/api/simplemessages', function(req, res) {
    request(git.messages, function (error, response, body) {
        if (!error && response.statusCode == 200)
            res.send(body);
        else  {
            console.log("error getting messages from GtiHub API" + error)
            res.send(error);
        }
    });
});

console.log(new Date().toISOString() + ": App listening on port 8080");
Run();

//global variable allows prevention of a situation where many equal 'get' request will be sent
function getStatus(callback){
    if (muteStatus) return;
    muteStatus = true;
    request(git.status, function (error, response, body){
        if(!error && response.statusCode==200)
        {
            globalStatus = JSON.parse(body);
            if (debug) console.log("Status updated")
            muteStatus = false;
            if (typeof callback === 'function') callback(globalStatus);
        }else
        {
            console.log(new Date().toISOString() + "didn't get Status reply from Github API")
            muteStatus = false;
            if (typeof callback === 'function') callback(error);
        }
    });
}

function getLastMessage(callback){
    if (muteSt) return;
    muteStatus = true;
    request(git.status, function (error, response, body){
        if(!error && response.statusCode==200)
        {
            globalStatus = JSON.parse(body);
            if (debug) console.log("Status updated")
            muteStatus = false;
            if (typeof callback === 'function') callback(globalStatus);
        }else
        {
            console.log(new Date().toISOString() + "didn't get Status reply from Github API")
            muteStatus = false;
            if (typeof callback === 'function') callback(error);
        }
    });
}



// if the messages list is upto date, dont bother
function UpdateMessages() {
    if (muteMessages) return;
    muteMessages = true;
    request(git.last_message, function (error, response, body) {
        if (!error && response.statusCode == 200)
        {
            if (globalMessages && globalMessages.length >0 && globalMessages[0].created_on == JSON.parse(body).created_on) {
                muteMessages = false;
                return;
            }
            if (debug) console.log("updating messages");
            request(git.messages, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    globalMessages = JSON.parse(body);
                    UpdateMessagesToDB(globalMessages);
                } else {
                    console.log("Got Error From GitHub Api for sending Messages request :" + error)
                }
                muteMessages = false;
            });
        }
    });
}


function UpdateMessagesToDB(messagesFrompi){
    messagesFrompi.forEach(function (messageFromApi)
    {
        try {
            Message.findOne(
                {'created_on': messageFromApi.created_on},
                function (err, foundMessage) {
                    if (err)
                        console.log(" Error finding message in db" + err);
                    if (!foundMessage) {
                        new Message({
                            status: messageFromApi.status,
                            body: messageFromApi.body,
                            created_on: messageFromApi.created_on
                        }).save(
                            function (err, message) {
                                if (err) console.error("error saving message :" + err);
                                if (debug) console.log("message saved: " + message.created_on);
                            });
                    } else if (debug)
                        console.log("message already exists: " + messageFromApi.created_on);
                });
        }catch(ex){
            HandleException(ex);
        }
    });
}
// note: I haven't checked if the messages are later then the status last updated date, for a case that
// older messages will be sent for some reason or the messages list will not be sent in order


function HandleException(ex)
{
    console.log( new Date().toISOString() + "caught exception" + ex);
}

function Run(){
    //initialize
    getStatus();
    UpdateMessages();
    //refreshes the global variables with configurable frequencies
    setInterval(getStatus,statusUpdateInterval);
    setInterval(UpdateMessages,minutesPerMesssagesItteration);
}