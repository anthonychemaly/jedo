var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user');
var config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var Cards = require('../models/user');
var nodemailer = require('nodemailer');

// GET ALL USERS //
router.get('/', async (req, res, next)=>{
    try {
        const options = {
            limit: 8
        }
        const users = await User.paginate({}, options);
        return res.json(users);
    } catch(err){
        res.status(500).send(err);
    };

  });

  // GET ALL CARDS //
router.get('/cards', (req, res, next)=>{
    Cards.find({},(err, cards)=>{
      res.send(cards);
    })
  });
  
// GET USERS BY ID //
router.get('/:id', (req,res)=>{
    User.findById(req.params.id, (data,err) => {
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:"User Found"
        });
    }).populate('Cards').exec(function (err) {
        if (err) throw err
    })
});

// ADD NEW USERS // SIGN UP //
router.post('/',(req, res) =>{
    var user = new User({
        _id : mongoose.Types.ObjectId(),
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        name:req.body.name,
        picture:req.body.picture,    
        status:req.body.status,
        cards:req.body.cardId,
        userStats:[],
        reservations:[],
        created_at: new Date(),
        auth_provider:req.body.provider
    })
    user.save()     
    .then((data)=>{
        res.send({
            success:true,
            data:data,
            message:"User created"
        });
    }).catch((err)=>{
        res.send({
            success:false,
            error:err
        })
    })
})

// ADD NEW CARD //
router.post('/:id/cards',(req, res)=>{
    var data = {
        cardholderName:req.body.cardholderName,
        cardNumber:req.body.cardNumber,
        cvv:req.body.cvv,
        expMonth:req.body.expMonth,
        expYear:req.body.expYear,
        created_at: new Date()
      }
  
      User.findById(req.params.id, (err, user) => {
          user.cards.push(data);
          user.save((err, data)=>{
              if(err) res.send({
                  success:false,
                  error:err
              })
              res.send({
                  success:true,
                  data:data,
                  message:"Trail added",
              })
          })
      })
});

//GET SPECIFIC CARD// 

router.get('/:id/cards/:cardid',(req, res)=>{
    User.findById(req.params.id , (err, user)=>{
        if(err)  res.send(err);
      var sub = user.cards.id(req.params.cardid);
      res.send(sub);
    })
  })


//DELETE CARD// 
router.delete('/:id/cards/:cardid',(req, res)=>{
    User.findById(req.params.id,(err, user)=>{
        user.cards.remove(req.params.cardid);
        user.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Card Deleted",
            })
        })
    })
});

// UPDATE CARD //
router.put('/cards/:cardid',(req, res)=>{
    User.update({'cards._id': req.params.cardid}, {'$set': {
        'cards.$.cardholderName':req.body.cardholderName,
        'cards.$.cardNumber':req.body.cardNumber,
        'cards.$.cvv':req.body.cvv,
        'cards.$.expMonth':req.body.expMonth,
        'cards.$.expYear':req.body.expYear,
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});

//ADD userSTATS//
router.post('/:id/stats',(req, res)=>{
    var data = {
        statId:req.body.statId,
        score:req.body.score,
        created_at: new Date()
      }
  
      User.findById(req.params.id, (err, user) => {
          user.userStats.push(data);
          user.save((err, data)=>{
              if(err) res.send({
                  success:false,
                  error:err
              })
              res.send({
                  success:true,
                  data:data,
                  message:"Stat added",
              })
          })
      })
});

//GET SPECIFIC userSTAT// 

router.get('/:id/stats/:userStatid',(req, res)=>{
    User.findById(req.params.id , (err, user)=>{
        if(err)  res.send(err);
      var sub = user.userStats.id(req.params.userStatid);
      res.send(sub);
    })
  });

//DELETE userStat// 
router.delete('/:id/stats/:userStatid',(req, res)=>{
    User.findById(req.params.id,(err, user)=>{
        user.userStats.remove(req.params.userStatid);
        user.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Card Deleted",
            })
        })
    })
});

// UPDATE userStat //
router.put('/stats/:userStatid',(req, res)=>{
    User.update({'userStats._id': req.params.userStatid}, {'$set': {
        'userStats.$.statId':req.body.statId,
        'userStats.$.score':req.body.score
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});


// ADD NEW GUEST //
router.post('/:id/reservation/:reservationid/guest',(req, res)=>{
    var data = {
        name:req.body.name,
        group:req.body.group,
        created_at: new Date()
    }
  
      User.findById(req.params.id, (err, user) => {
        var sub = user.reservations.id(req.params.reservationid);
        sub.guests.push(data);
              user.save((err,data)=>{
                  if (err) res.send({
                    success:false,
                    error:err
                });
                res.send({
                    success:true,
                    data:data,
                    message:"Guest added",
                });
              });
          });
         
});

//GET SPECIFIC GUEST// 

router.get('/:id/reservation/:reservationid/guest/:guestid',(req, res)=>{
    User.findById(req.params.id , (err, user)=>{
        if(err)  res.send(err);
        var guest = user.reservations.id(req.params.reservationid).guests.id(req.params.guestid);
      res.send(guest);
    })
  });


//DELETE GUEST// 
router.delete('/:id/reservation/:reservationid/guest/:guestid',(req, res)=>{
    User.findById(req.params.id,(err, user)=>{
        var guest = user.reservations.id(req.params.reservationid).guests.id(req.params.guestid);
        guest.remove();
        user.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Reservation Deleted",
            })
        })
    })
});

/* // UPDATE GUEST //
router.put('/:id/reservation/:reservationid/guest/:guestid',(req, res)=>{
    User.findById(req.params.id, (err, user) => {
    var sub = user.reservations.id(req.params.reservationid);
    sub.update({'guests._id': req.params.guestid}, {'$set': {
        'guests.$.name':req.body.name,
        'guests.$.group':req.body.group,
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});
});  */

//DELETE USER//
router.delete('/:id',(req, res)=>{
    User.findByIdAndDelete(req.params.id,(err, data)=>{
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:'User deleted successfully'
        })
    })
});

//UPDATE USER FIELDS//
router.put('/:id', (req, res)=>{
    User.findByIdAndUpdate(req.params.id,req.body,(err, data)=>{
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:'User updated successfully'
        });
    })
});

//change password
router.get('/password/reset', (req, res)=>{
    let transporter = nodemailer.createTransport({
        host: "mail.jedo.app",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'team@jedo.app', // generated ethereal user
          pass: 'Jedoapp123!' // generated ethereal password
        }
      },(err,data)=>{
          res.send(err);
      });
    
      let info =  transporter.sendMail({
        from: '"Jedo" <team@jedo.app', // sender address
        to: "elmirnicolas@gmail.com", // list of receivers
        subject: "Password rescue", // Subject line
        text: "Here's your reset password link", // plain text bodyss
      },(err,data)=>{
          res.send(data);
      });
})


module.exports = router;