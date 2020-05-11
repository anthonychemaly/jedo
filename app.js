var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://admin:admin@cluster0-kqy1z.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var activityRouter = require('./routes/activity');
var reservationRouter = require('./routes/reservation');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// USER LOGIN //
app.post('/login', function(req, res, next) {
  //Find The User
  User.findOne({
   email: req.body.email
  }).then(function(user,err){
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });  
    }else if (user) {
      bcrypt.compare(req.body.password, user.password, function(err, compRes){
        if(!compRes){
          res.json({success:false,message:"Wrong Password"});
        }else{
          var payload = { id: user._id };        
          var token = jwt.sign(payload,config.secret);
  
          User.findById(user._id, function(err, result) {
            res.send({success:true, id: result._id, token:token})            
          }); 
        }   
      })
    }
  });
});  

// app.use(function(req, res, next){
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];

//   if(token != null){
//     req.token = token;
//     jwt.verify(token, config.secret, function(err, decoded){
//       if(err) {
//         err.message = 'unverified token';
//         return res.send({success: false, message: 'unverified token'});
//       }
//       req.decoded = decoded;
//       console.log(decoded);
//       next();
//     });
//   }else{
//     res.send('Unauthorized');
    
//   }
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/activity', activityRouter);
app.use('/reservation', reservationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
