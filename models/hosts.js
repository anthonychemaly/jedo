var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hostSchema = new Schema({
   userId:String,
   bio:String,
   message:String,
   media:[{
      typeId:String,
      fileName:String,
      URL:String
   }],
   created_at:Date, 
   hostsInterests:[{
      interestId:String
   }] 
});

var Hosts = mongoose.model('Hosts', hostSchema);


module.exports = Hosts;