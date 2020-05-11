var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var interestSchema = new Schema({
description:String
});

var Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;