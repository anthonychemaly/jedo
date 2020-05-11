var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
    userId: String,
    activityInstanceId: String,
    nbAdultsReserved: Number,
    nbTeensReserved: Number,
    nbKidsReserved: Number,
    amount : Number ,
    paymentMethod: String,
    created_at:Date,
    guests:[{
      name:String,
      group:String
    }]
});

var Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
