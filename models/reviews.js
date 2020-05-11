var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    activityId:String,
    userId:String,
    feeling:String,
    emotions:String,
    review:String
});

var Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;