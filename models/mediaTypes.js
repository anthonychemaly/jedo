var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var typesSchema = new Schema({
    created_at:Date,  
    type:String
});

var mediaTypes = mongoose.model('mediaTypes', typesSchema);

module.exports = mediaTypes;