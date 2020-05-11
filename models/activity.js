var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
title: String,
category: String,
mainLocation: String,
trail: [{
    description: String,
    longitude: Number,
    latitude: Number
}],
nbAdults: Number,
nbTeens: Number,
nbKids: Number,
lowestPrice: Number,
highestPrice: Number,
images:[{
    scheduleId: String,
    image: String,
    location: String
}],
notices:[{
    icon: String,
    title: String,
    description: String
}],
options:[{ 
    description: String,
    price: Number,
}],
activityStats:[{
    statId:String,
    score:String
}],
schedules:[{
    time:Date,
    title:String,
    description:String,
    transport:String,}],
});

var Activity = mongoose.model('Activity',activitySchema );


module.exports = Activity;