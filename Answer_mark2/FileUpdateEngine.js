//http://stackoverflow.com/questions/8011962/schedule-node-js-job-every-five-minutes
var fs = require('fs');
var http = require('http');
var request = require('request');
   // sys = require('sys');

var myHttp = require('./HttpGet.js');



/**
 * Created by Idan on 7/24/2015.
 *
 *for an interval asks for the last message. if its equal to to the last message do non nothing
 *(or return the last N messages saved)
 *
 *
 */
var minutes = 15, the_interval = minutes  * 1000 *60;
var i=0;

setInterval(function() {
    console.log("updateing the file each 15 minutes");

    var result = 'lastMessages';
    var path ='./'+result+'.txt';
    var host = 'status.github.com';
    //var request ='/api/status.json';
    var request = '/api.json';


    i= i+1;
    //writeToFile(path,'"[');
    RequestAndWrite(host,'/api.json',path,i);
    RequestAndWrite(host,'/api/status.json',path,i);
    RequestAndWrite(host,'/api/last-message.json',path,i);
    RequestAndWrite(host,'/api/messages.json',path,i);
    var summery_request = "https://status.github.com/api/daily-summary.json";
   // RequestAndWrite(host,summery_request,path,i);


    //writeToFile(path,']"');
}, the_interval);


function RequestAndWrite(host,request,path,i){

    myHttp(host, request, function(data,error){///risky! can wirte reaccurently ?!? also want to update one by oone
        //var what ="\"{\"request\": \""+request+" #"+i+"\",\n" +JSON.stringify( data) +"\"}";
        var printout = "\n \"{\"request\": \""+request+"\",\n" +JSON.stringify( data) +"\"}";

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
    if (fs.existsSync(path)) fs.appendFile(path, printout, encoding='utf8',function(er){if(er)console.log("Error!!" + er.message)});
    else fs.writeFile(path,printout, encoding='utf8',function(er){if(er) console.log("Error!!\n\n\n\n\!!!!!!!!!!" + er.message)});
}
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