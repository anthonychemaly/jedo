var express = require('express');
var router = express.Router();
var Activity = require('../models/activity');

// GET ALL ACTIVITIES //
router.get('/', ( req , res)=>{
    Activity.find({},(err,data)=>{
        if (err) res.json({
            success:false,
            error:err
        });
        res.send({
            success:true,
            data:data,
            message:'All Activities'
        });
    });
});

// GET ACTIVITIES BY ID //
router.get('/:id', (req,res)=>{
    Activity.findById(req.params.id, (err,data) => {
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:"One Activity"
        });
    });
});

// ADD NEW ACTIVITY
router.post('/',(req, res) =>{
    var activity = new Activity({
        title:req.body.title,
        categoryId:req.body.categoryId,
        mainLocation:req.body.mainLocation,
        nbAdults:req.body.nbAdults,
        nbTeens:req.body.nbTeens,    
        nbKids:req.body.nbKids,
        lowestPrice:req.body.lowestPrice,    
        highestPrice:req.body.highestPrice,             
        trail:[],
        activityStats:[],
        options:[],
        notices:[],
        images:[],
        schedules:[],
        created_at: new Date()
    })
    activity.save()     
    .then((data)=>{
        res.send({
            success:true,
            data:data,
            message:"Activity created"
        });
    }).catch((err)=>{
        res.send({
            success:false,
            error:err
        })
    })
})

//ADD NEW TRAIL//
router.post('/:id/trail',(req, res)=>{

    var data = {
      description:req.body.description,
      longitude:req.body.longitude,
      latitude:req.body.latitude,
      created_at: new Date()
    }

    Activity.findById(req.params.id, (err, activity) => {
        activity.trail.push(data);
        activity.save((err, data)=>{
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

//GET SPECIFIC TRAIL// 

router.get('/:id/trail/:trailid',(req, res)=>{
    Activity.findById(req.params.id , (err, activity)=>{
        if(err) res.send(err);
      var sub = activity.trail.id(req.params.trailid);
      res.send(sub);
    })
  })


//DELETE TRAIL// 
router.delete('/:id/trail/:trailid',(req, res)=>{
    Activity.findById(req.params.id,(err, activity)=>{
        activity.trail.remove(req.params.trailid);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Trail Deleted",
            })
        })
    })
});

// UPDATE TRAIL //
router.put('/trail/:trailid',(req, res)=>{
    Activity.update({'trail._id': req.params.trailid}, {'$set': {
        'trail.$.description':req.body.description,
        'trail.$.longitude':req.body.longitude,
        'trail.$.latitude':req.body.latitude
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});

router.post('/', function(req, res, next) {
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
                if (err) throw err;
                console.log(result);
                user.token = token;
                user.save(function(err) {
                    if (err) throw err;
                    res.send({success:true, id: result._id})            
                  });
            }); 
          }   
        })
      }
    });
  });  

//DELETE ACTIVITY//
router.delete('/:id',(req, res)=>{
    Activity.findByIdAndDelete(req.params.id,(err, data)=>{
        if(err) res.send(err);
        res.send({
            success:true,
            data:data,
            message:'Activity deleted successfuly'
        })
    })
});

//UPDATE ACTIVITY FIELDS//
router.put('/:id', (req, res)=>{
    Activity.findByIdAndUpdate(req.params.id,req.body,(err, data)=>{
        if(err) res.send(data);
        res.send({
            success:true,
            data:data,
            message:'Activity updated successfuly'
        });
    })
});

//ADD NEW NOTICE//
router.post('/:id/notices',(req, res)=>{

    var data = {
      description:req.body.description,
      icon:req.body.icon,
      title:req.body.title,
      created_at: new Date()
    }

    Activity.findById(req.params.id, (err, activity) => {
        activity.notices.push(data);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Notice added",
            })
        })
    })
});

//GET SPECIFIC NOTICE// 

router.get('/:id/notices/:noticeid',(req, res)=>{
    Activity.findById(req.params.id , (err, activity)=>{
        if(err) res.send(err);
      var sub = activity.notices.id(req.params.noticeid);
      res.send(sub);
    })
  })


//DELETE NOTICE// 
router.delete('/:id/notices/:noticeid',(req, res)=>{
    Activity.findById(req.params.id,(err, activity)=>{
        activity.notices.remove(req.params.noticeid);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Notice Deleted",
            })
        })
    })
});

// UPDATE NOTICE //
router.put('/notices/:noticeid',(req, res)=>{
    Activity.update({'notices._id': req.params.noticeid}, {'$set': {
        'notices.$.description':req.body.description,
        'notices.$.icon':req.body.icon,
        'notices.$.title':req.body.title
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});

//ADD NEW OPTION//
router.post('/:id/options',(req, res)=>{

    var data = {
      description:req.body.description,
      price:req.body.price,
      created_at: new Date()
    }

    Activity.findById(req.params.id, (err, activity) => {
        activity.options.push(data);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Option added",
            })
        })
    })
});

//GET SPECIFIC OPTION// 

router.get('/:id/options/:optionid',(req, res)=>{
    Activity.findById(req.params.id , (err, activity)=>{
        if(err) res.send(err);
      var sub = activity.options.id(req.params.optionid);
      res.send(sub);
    });
  });


//DELETE OPTION// 
router.delete('/:id/options/:optionid',(req, res)=>{
    Activity.findById(req.params.id,(err, activity)=>{
        activity.options.remove(req.params.optionid);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Option Deleted",
            })
        })
    })
});

// UPDATE OPTION //
router.put('/options/:optionid',(req, res)=>{
    Activity.update({'options._id': req.params.optionid}, {'$set': {
        'options.$.description':req.body.description,
        'options.$.price':req.body.price
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});

//ADD NEW ACTIVITYSTAT//
router.post('/:id/activityStat',(req, res)=>{

    var data = {
        statId:req.body.statId,
        score:req.body.score,
      created_at: new Date()
    }

    Activity.findById(req.params.id, (err, activity) => {
        activity.activityStats.push(data);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Activity Stat added",
            })
        })
    })
});

//GET SPECIFIC activityStat// 

router.get('/:id/activityStat/:activityStatid',(req, res)=>{
    Activity.findById(req.params.id , (err, activity)=>{
        if(err) res.send(err);
      var sub = activity.activityStats.id(req.params.activityStatid);
      res.send(sub);
    })
  })


//DELETE activityStat// 
router.delete('/:id/activityStat/:activityStatid',(req, res)=>{
    Activity.findById(req.params.id,(err, activity)=>{
        activity.activityStats.remove(req.params.activityStatid);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"activityStat Deleted",
            })
        })
    })
});

// UPDATE activityStat //
router.put('/activityStat/:activityStatid',(req, res)=>{
    Activity.update({'activityStats._id': req.params.activityStatid}, {'$set': {
        'activityStats.$.score':req.body.score,
        'activityStats.$.statId':req.body.statId
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});


//ADD NEW SCHEDULE//
router.post('/:id/schedules',(req, res)=>{

    var data = {
        time:req.body.time,
        title:req.body.title,
        transport:req.body.transport,
        description:req.body.description,
      created_at: new Date()
    }

    Activity.findById(req.params.id, (err, activity) => {
        activity.schedules.push(data);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Schedule added",
            })
        })
    })
});


//GET SPECIFIC SCHEDULE// 

router.get('/:id/schedules/:scheduleid',(req, res)=>{
    Activity.findById(req.params.id , (err, activity)=>{
        if(err)  res.send(err);
      var sub = activity.schedules.id(req.params.scheduleid);
      res.send(sub);
    })
  })


//DELETE SCHEDULE// 
router.delete('/:id/schedules/:scheduleid',(req, res)=>{
    Activity.findById(req.params.id,(err, activity)=>{
        activity.schedules.remove(req.params.scheduleid);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Schedule Deleted",
            })
        })
    })
});

// UPDATE SCHEDULE //
router.put('/schedules/:scheduleid',(req, res)=>{
    Activity.update({'schedules._id': req.params.scheduleid}, {'$set': {
        'schedules.$.description':req.body.description,
        'schedules.$.time':req.body.time,
        'schedules.$.title':req.body.title,
        'schedules.$.transport':req.body.transport
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});

//ADD NEW IMAGE//
router.post('/:id/images',(req, res)=>{

    var data = {
        scheduleId:req.body.scheduleId,
        image:req.body.image,
        location:req.body.location,
        created_at: new Date()
    }

    Activity.findById(req.params.id, (err, activity) => {
        activity.images.push(data);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Image added",
            })
        })
    })
});


//GET SPECIFIC IMAGE// 

router.get('/:id/images/:imageid',(req, res)=>{
    Activity.findById(req.params.id , (err, activity)=>{
        if(err)  res.send(err);
      var sub = activity.images.id(req.params.imageid);
      res.send(sub);
    })
  })


//DELETE IMAGE// 
router.delete('/:id/images/:imageid',(req, res)=>{
    Activity.findById(req.params.id,(err, activity)=>{
        activity.images.remove(req.params.imageid);
        activity.save((err, data)=>{
            if(err) res.send({
                success:false,
                error:err
            })
            res.send({
                success:true,
                data:data,
                message:"Image Deleted",
            })
        })
    })
});

// UPDATE SCHEDULE //
router.put('/images/:imageid',(req, res)=>{
    Activity.update({'images._id': req.params.imageid}, {'$set': {
        'images.$.scheduleId':req.body.scheduleId,
        'images.$.image':req.body.image,
        'images.$.location':req.body.location
    }},(err, data)=>{
        if(err) res.send(err);
        res.send(data)
    })
});

module.exports = router;