/**
 * Created by Idan on 7/24/2015.
 */

//http://olalonde.mit-license.org/
var http = require('follow-redirects').http;// handles redirection of github api
var https = require('follow-redirects').https;

if (false) {
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
    //host: 'www.random.org',
    host: 'status.github.com',//'status.github.com',
    //path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    path: '/api/messages.json',
    //path: '/api/last-message.json',
    //path: '/api/status.json',
    method: 'GET'
    //headers: {
    //    'Content-Type': 'application/json'
    //}
};


    var req = http.get(options, function (res) {
       // console.log('STATUS: ' + res.statusCode);
       /// console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function (chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
            // console.log("\ngot data\n")
        }).on('end', function () {
            var i =0;
            i= i+1;
            var responceBody = JSON.parse(Buffer.concat(bodyChunks).toString())
            responceBody.forEach(  function(item,i){
                // callbacks each object
                console.log("item #" +i + JSON.stringify(item) +" \n");

            });
            //var bodyObject = Buffer.concat(bodyChunks);
            //var body = Buffer.concat(bodyChunks).toString();
            //var bodyObject = JSON.parse(body);


            // while (body.containsNode("},{")) {
            //   body = body.forEach(body.replace("},{", "},\n{"));
            //    }
           // console.log('\n \n item: ' + body);


            // ...and/or process the entire body here.
        })
    });

    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}

//exports.MyHttpGet


//var MyHttpGet
module.exports= function(host, path, callback)
{
    var options = {
        host: host,
        //'status.github.com',
        path : path,
        //path: '/api/messages.json',
        //path: '/api/last-message.json',
        //path: '/api/status.json',
        method: 'GET'
    };
   // res(options,function(res){console.log(res);})


    http.get(options, function(res) {
       // console.log('STATUS: ' + res.statusCode);
       // console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
            // console.log("\ngot data\n")
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks).toString();
            // ...and/or process the entire body here.

            //console.log('\n \n item: ' + body);

            callback(body);
        })
    }).on('error', function(e) {
                 console.log('ERROR: ' + e.message);
    });

};


//module.exports  = MyHttpGet;
