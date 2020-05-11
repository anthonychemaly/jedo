var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


var userSchema = new Schema({
  email:{unique:true,required:true,type:String},
  password:{type:String},
  name:{type:String, required:true},
  picture:{type:String},    
  status:{type:String},
  cards:[{
    cardholderName:String,
    cardNumber:Number,
    cvv:Number,
    expMonth: Number ,
    expYear: Number
  }],
  userStats:[{ 
    statId:String,
    score:String}],
  auth_provider:String
});
userSchema.plugin(mongoosePaginate);



userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
var User = mongoose.model('User', userSchema);


module.exports = User;
