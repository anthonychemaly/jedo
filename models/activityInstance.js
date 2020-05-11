var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activityInstanceSchema = new Schema({
    activityId:String,
    date:Date,
    nbAdults:Number,
    nbTeens:Number,
    nbKids:Number,
    guest : [{
        name:String,
        group:String
      }]
});

var activityInstance = mongoose.model('activityInstance', activityInstanceSchema);

module.exports = activityInstance;