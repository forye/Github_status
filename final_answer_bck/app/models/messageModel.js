/**
 * Created by Idan on 7/26/2015.
 */
var mongoose = require('mongoose');
module.exports = mongoose.model('Message', {
    status : String,
    body : String ,
    created_on : {type: Date, required: true}
});