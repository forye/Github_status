var Message = require('./models/Message');
var Engine = require('./Utilities/UpdateEngine')

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all messages
	app.get('/api/messages', function(req, res) {

		res.json(Engine.GetUpdatedListOfMessages());

		// use mongoose to get all messages in the database
		//Message.find(function(err, messages) {
        //
		//	// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		//	if (err)
		//		res.send(err)
        //
		//	res.json(messages); // return all messages in JSON format
		//});
	});

	// create todo and send back all messages after creation
	app.post('/api/messages', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Message.create({
			status : req.body.status ,
			body : req.body.body,
			created_on : req.body.created_on
		}, function(err, message) {
			if (err)
				res.send(err);

			// get and return all the messages after you create another
			Message.find(function(err, messages) {
				if (err)
					res.send(err)
				res.json(messages);
			});
		});

	});

	// delete a todo
	app.delete('/api/messages/:message_id', function(req, res) {
		Message.remove({
			_id : req.params.message_id
		}, function(err, message ){
			if (err)
				res.send(err);

			// get and return all the messages after you create another
			Message.find(function(err, messages) {
				if (err)
					res.send(err)
				res.json(messages);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.get('/api/messages/updated', function(req, res) {
		//res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
		//res.json(Engine.GetUpdatedListOfMessages());

		Engine.GetUpdatedListOfMessages();

		Message.find(function(err, messages) {
			if (err)
				res.send(err)
			res.json(messages);
		});

	});


	////Engine.
	//app.get()
};