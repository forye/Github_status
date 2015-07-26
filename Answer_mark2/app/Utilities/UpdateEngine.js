//http://stackoverflow.com/questions/8011962/schedule-node-js-job-every-five-minutes
var fs = require('fs');
var http = require('http');
//var request = require('request');
   // sys = require('sys');

var myHttp = require('./HttpGet.js');
var Message = require('../models/Message.js');


var mongoose = require('mongoose');
var database = require('../../config/database.js'); 			// load the database config

//var Message = require('./models/Message');



/**
 * Created by Idan on 7/24/2015.
 *
 *for an interval asks for the last message. if its equal to to the last message do non nothing
 *(or return the last N messages saved)
 *
 *
 */
var REC_LIMIT = 20;
var minutes = 15, T_interval = minutes  * 1000 ;//*60;

////here!! connect to the DB!
//mongoose.connect(database.url);
//var last_message ={}; <- from DB??

var Local_last_mesassge = new Message({
        status : "",
        body : "",
        created_on : ""
});

var last_created = ""

//RequestAndWrite(host,'/api.json',path,i);
//TEST the APi for changes ! initinig the requests or a change in api (UpdateApi)

var result = 'lastMessages';
var path ='./'+result+'.txt';
var host = 'status.github.com';
var request = '/api.json';
//    var summery_request = "https://status.github.com/api/daily-summary.json";
var status_request ='/api/status.json';
var last_message_request =  '/api/last-message.json';
var messages_request = '/api/messages.json';

//start!!
//console.log("start!");
//myHttp(host, status_request,function(data,err) {
//    if (err) console.log("ERROR" + err.message);
////        if (!data) return null; no collapse!
//
//    var apiLastMessage =JSON.parse(data);// JSON.stringify(data);
//    if (Local_last_meassge.created_on != apiLastMessage.last_updated)
//    // if it is not updated! quarry the github api for last messags and update
//    {
//        Local_last_meassge = myHttp(host, last_message_request,toMessage)
//        myHttp(host, messages_request,UpdateDBWithLastMessages);
//    }
//});

//console.log("serialized reached end");
//do each 'minutes' minuts

setInterval(function() {
    console.log("updateing the file each 15 minutes");
    myHttp(host, status_request,function(data,err) {
        if (err) console.log("ERROR" + err.message);
//        if (!data) return null; no collapse!

        var apiLastMessage =JSON.parse(data);// JSON.stringify(data);
        if (last_created != apiLastMessage.last_updated)
        // if it is not updated! quarry the github api for last messags and update
        {
            last_created = apiLastMessage.last_updated;
            Local_last_mesassge = myHttp(host, last_message_request,toMessage)
            myHttp(host, messages_request,UpdateDBWithLastMessages);
        }else{
            console.log("already updated: " + last_created +" ==  "+ apiLastMessage.last_updated)
        }
    } )
    //});

}, T_interval);


function UpdateDBWithLastMessages(data, err) {
    if (err) console.log("ERROR! " + err);
    //var MessagesList = [];
    //here starts the work with db!
    //JSON.stringify(data)
    JSON.parse(data).forEach(function (raw) {//// check if really iitterates on the data
    //var raw = JSON.parse(data)[0];
        //var raw = JSON.stringify(rawMessage.body);
        console.log("enteredForEach)");
        //update db with message
        Message.count({'created_on' : raw.created_on},//)//.select( 'created_on')
            //.exec(
            function(err,foundMessages)
        {// catch errors??!?!
            if (err) console.log(" Error finding "  + err);
            if (!foundMessages )
            {
                console.log("found messages");

                new Message({
                    status: raw.status,
                    body : raw.body,
                    created_on : raw.created_on
                    }).save(

                //message.save(
                    function (err, message) {
                    if (err) console.error("error saveing" + err);
                    console.log("message saved, type : " + message.status);
                });
            }else{
                console.log("message already exists: " + raw.created_on)
            }
        });

        }//,callback()

    );
            //MessagesList.push(message);
   // });///
}

function toMessage(data,err){
        if (err) console.log("Error! ");
        if (data){
            var raw = JSON.parse(data);
            return new Message({
                status : raw.status,
                body : raw.body,
                created_on : raw.created_on
            });
        }
        return null;
}


module.exports = function GetUpdatedListOfMessages(){
    return myHttp(host, status_request,function(data,err) {
                if (err) console.log("ERROR" + err.message);
        //        if (!data) return null; no collapse!
                var apiLastMessage = JSON.stringify(data);
                if (last_created != apiLastMessage.created_on)
                {
                    last_created = apiLastMessage.created_on;
                    Local_last_mesassge = myHttp(host, last_message_request,toMessage)
                    myHttp(host, messages_request,UpdateDBWithLastMessages);
                    //I shoudl add a promise here before the return!!
                }
                getLastMessagesFromDb();
    });

}


function getLastMessagesFromDb(){
    return Message.find()
            .sort('-created_on')//.sort('+created_on')
            .limit(REC_LIMIT)
            .select('status body created_on')
            .exec(handleMessage);
}

function handleMessage(err, messages){
    if (err) console.log("Error" +err);
       // res.send(err)
    res.json(messages); // return all messages in JSON format
}




function RequestAndWrite(host,request,path,i){

    myHttp(host, request, function(data,error){///risky! can wirte reaccurently ?!? also want to update one by oone
        //var what ="\"{\"request\": \""+request+" #"+i+"\",\n" +JSON.stringify( data) +"\"}";
        if (error) console.log(error);
        //var printout = "\n \"{\"request\": \""+request+"\",\n" +JSON.stringify( data) +"\"}";

        var what = '"{" request" : "' + request +'" , "cycle" : "' + i + '" , "reply" : "'
            + JSON.stringify( data) + '"}",'

        writeToFile(path,what)
        // if (fs.existsSync(path)) fs.appendFile(path, printout, encoding='utf8',function(er){if(er)console.log("Error!!" + er.message)});
        // else fs.writeFile(path,printout, encoding='utf8',function(er){if(er) console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message)});

    });
}

function writeToFile(path,what)
{
    printout = '\n'+what+'\n';

    if (fs.existsSync(path))  {
        fs.appendFile(path, printout, encoding='utf8',function(er){
            if(er)
                console.log("Error!!" + er.message);
        });
    }

    else {

        fs.writeFile(path,printout, encoding='utf8',function(er){
            if(er)
                console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message);
        });
    }
}

//function (data, err) {
//    if (err) console.log("ERROR! " + err);
//    //var MessagesList = [];
//
//    //here starts the work with db!
//    data.forEach(function (rawMessage) {//// check if really iitterates on the data
//        var raw = JSON.stringify(rawMessage.body);
//        var message = new Massage({
//            status: raw.status,
//            body : raw.body,
//            created_on : raw.created_on
//        });
//
//        //MessagesList.push(message);
//        Message.find({'created_on' : message.created_on}, 'created_on', function(err,foundMessages)
//        {
//            if (!foundMessages  || foundMessages == {} ) message.save(function (err, message) {
//                if (err) return console.error(err);
//                console.log("message saved :" + message.status);
//            });
//        });
//    });
//    //do somthing with MessageList?!?!?
//    //mongoose.close();
//});


//messsage.status = raw.status;
                    //messsage.body = raw.body;
                    //messsage.created_on = raw.created_on;



//                    Message.findOne({ 'created_on': message.created_on},'status body created_on ', function (err, message) {
//                        if (err) console.log("ERROR!! " + err.message);
//                        //if (messages)
////                            Local_last_meassge = messages;
//                        if(!message)
//                            Message.create({
//                                status : message.status ,
//                                body : message.body,
//                                created_on : message.created_on
//                                }, function(error, results){if (!error) return  results;});
//                    });





//// find each person with a last name matching 'Ghost'
//var query = Person.findOne({ 'name.last': 'Ghost' });
//
//// selecting the `name` and `occupation` fields
//query.select('name occupation');
//
//// execute the query at a later time
//query.exec(function (err, person) {
//    if (err) return handleError(err);
//    console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
//})


//http://mongoosejs.com/docs/queries.html


// With a JSON doc
//Person.
//    find({
//        occupation: /host/,
//        'name.last': 'Ghost',
//        age: { $gt: 17, $lt: 66 },
//        likes: { $in: ['vaporizing', 'talking'] }
//    }).
//    limit(10).
//    sort({ occupation: -1 }).
//    select({ name: 1, occupation: 1 }).
//    exec(callback);
//
//// Using query builder
//Person.
//    find({ occupation: /host/ }).
//    where('name.last').equals('Ghost').
//    where('age').gt(17).lt(66).
//    where('likes').in(['vaporizing', 'talking']).
//    limit(10).
//    sort('-occupation').
//    select('name occupation').
//    exec(callback);




//
                    //if(false){//if not fount in db, put!! or create!!
                    //    Message.update({
                    //            status:messsage.status,
                    //            body : messsage.body,
                    //            created_on : messsage.created_on
                    //        },function(){
                    //            console.log("updated data base with" + message.created_on);
                    //        }
                    //    );
                    //    //Message.findOneAndUpdate({created_on : message.created_on }, message
                    //    ////.findOneAndUpdate({name:req.params.name}, req.body, function (err, place) {
                    //    //    res.send(place);
                    //    //});
                    //    //var quarry =
                    //        Message.findOne({created_on : messsage.created_on} ).exec(
                    //        function(item){
                    //            console.log(item);
                    //        }
                    //    );
                    //
                    //}





        //if (lastMessage)

        //    .{
        //    status : data.body.status,
        //        body : data.body.body,
        //        created_on : data.body.created_on
        //
        //
        //}


 //   }

    //if (lastMessage != api/last-message.json)
    //  request all last messages
    // each  replied message that dont exists in db, insert it
    // return the last messages in the db



    //i= i+1;
    ////writeToFile(path,'"[');
    //
    //
    //
    //RequestAndWrite(host,'/api/status.json',path,i);
    //RequestAndWrite(host,'/api/last-message.json',path,i);
    //RequestAndWrite(host,'/api/messages.json',path,i);
    ////RequestAndWrite(host,summery_request,path,i);

    //writeToFile(path,']"');





    //myHttp(host, request, function(data,error){///risky! can wirte reaccurently ?!? also want to update one by oone
    //    var printout = "\n\n\n request: "+request+" #"+i+"\n" +JSON.stringify( data);
    //    if (fs.existsSync(path)) fs.appendFile(path, printout, encoding='utf8',function(er){if(er)console.log("Error!!" + er.message)});
    //    else fs.writeFile(path,printout, encoding='utf8',function(er){if(er) console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message)});
    //});

    //myHttp(host, request, function(data,error){///risky! can wirte reaccurently ?!? also want to update one by oone
    //    var printout = "\n request: "+request+" #"+i+"\n" +JSON.stringify( data);
    //    if (fs.existsSync(path)) fs.appendFile(path, printout, encoding='utf8',function(er){if(er)console.log("Error!!" + er.message)});
    //    else fs.writeFile(path,printout, encoding='utf8',function(er){if(er) console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message)});
    //});


    //myHttp(host, request, function(data,error){///risky! can wirte reaccurently ?!? also want to update one by oone
    //    var printout = "\n  request: "+request+" #"+"\n" +JSON.stringify( data);
    //    if (fs.existsSync(path)) fs.appendFile(path, printout, encoding='utf8',function(er){if(er)console.log("Error!!" + er.message)});
    //    else fs.writeFile(path,printout, encoding='utf8',function(er){if(er) console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message)});
    //});

    //myHttp(host, request, function(data,error){///risky! can wirte reaccurently ?!? also want to update one by oone
    //    var printout = "\n request: "+request+" #"+i+"\n\n\n" +JSON.stringify( data);
    //    if (fs.existsSync(path)) fs.appendFile(path, printout, encoding='utf8',function(er){if(er)console.log("Error!!" + er.message)});
    //    else fs.writeFile(path,printout, encoding='utf8',function(er){if(er) console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message)});
    //});



    // do your stuff here

//
//var reqType = '/api/last-message.json'; // get!
//request({ uri:reqType }, function (error, response, body) {
//    if (error && response.statusCode !== 200) {
//        console.log('Error when contacting google.com')
//    }
//
//    // Print the google web page.
//    sys.puts(body);
//});
//
//


//var options = {
    //    host: url,
    //    port: 80,
    //    path: '/resource?id=foo&bar=baz',
    //    method: 'POST'
    //};

    //http.request(options, function(res) {
    //    console.log('STATUS: ' + res.statusCode);
    //    console.log('HEADERS: ' + JSON.stringify(res.headers));
    //    res.setEncoding('utf8');
    //    res.on('data', function (chunk) {
    //        console.log('BODY: ' + chunk);
    //    });
    //}).end();








//
//fs.appendFile('message.txt', 'data to append', function (err) {
//
//});