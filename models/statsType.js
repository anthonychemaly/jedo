var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statsSchema = new Schema({
  description:String,
  unit:String,
  Icon:String,
  created_at:Date,
});

var statsType = mongoose.model('statsType', statsSchema);

module.exports = statsType;