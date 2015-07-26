var mongoose = require('mongoose');

module.exports = mongoose.model('Message', {
	status : String,
	body : String,
	created_on : String
});