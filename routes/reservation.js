var express = require('express');
var router = express.Router();
var Reservation = require('../models/reservations');

// GET ALL RESERVATIONS //
router.get('/', ( req , res)=>{
    Reservation.find({},(err,data)=>{
        if (err) res.json({
            success:false,
            error:err
        });
        res.send({
            success:true,
            data:data,
            message:'All Reservations'
        });
    });
});

// GET RESERVATION BY ID //
router.get('/:id', (req,res)=>{
    Reservation.findById(req.params.id, (err,data) => {
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:"One Reservation"
        });
    });
});


// ADD NEW RESERVATION
router.post('/',(req, res) =>{
    var reservation = new Reservation({
        userId:req.body.userId,
        activityInstanceId:req.body.activityInstanceId,
        nbAdultsReserved:req.body.nbAdultsReserved,
        nbTeensReserved:req.body.nbTeensReserved,
        nbKidsReserved:req.body.nbKidsReserved,    
        amount:req.body.amount,
        paymentMethod:req.body.paymentMethod,                 
        guests:[],
        created_at: new Date()
    })
    reservation.save()     
    .then((data)=>{
        res.send({
            success:true,
            data:data,
            message:"Reservation created"
        });
    }).catch((err)=>{
        res.send({
            success:false,
            error:err
        })
    })
});

//DELETE RESERVATION//
router.delete('/:id',(req, res)=>{
    Reservation.findByIdAndDelete(req.params.id,(err, data)=>{
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:'Reservation deleted successfully'
        })
    })
});

//UPDATE RESERVATION FIELDS//
router.put('/:id', (req, res)=>{
    Reservation.findByIdAndUpdate(req.params.id,req.body,(err, data)=>{
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:'Reservation updated successfully'
        });
    })
});


// ADD NEW GUEST //
router.post('/:id/guest',(req, res)=>{
    var data = {
        name:req.body.name,
        group:req.body.group,
        created_at: new Date()
      }
  
      Reservation.findById(req.params.id, (err, reservation) => {
          reservation.guests.push(data);
          reservation.save((err, data)=>{
              if(err) res.send({
                  success:false,
                  error:err
              })
              res.send({
                  success:true,
                  data:data,
                  message:"Guest added",
              })
          })
      })
});

//GET SPECIFIC GUEST// 

router.get('/:id/guest/:guestid',(req, res)=>{
    Reservation.findById(req.params.id , (err, reservation)=>{
        if(err)  res.send(err);
      var sub = reservation.guests.id(req.params.guestid);
      res.send(sub);
    })
  })


//DELETE GUEST// 
router.delete('/:id/guest/:guestid',(req, res)=>{
    Reservation.findById(req.params.id,(err, reservation)=>{
        reservation.guests.remove(req.params.guestid);
        reservation.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Guest Deleted",
            })
        })
    })
});

// UPDATE GUEST //
router.put('/guest/:guestid',(req, res)=>{
    Reservation.update({'guests._id': req.params.guestid}, {'$set': {
        'guests.$.name':req.body.name,
        'guests.$.group':req.body.group
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});


module.exports = router;
