const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/admin');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/upload_image', function (req, res) {
  var options = {
    validation: {
      'allowedExts': ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob'],
      'allowedMimeTypes': ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml']
    }
  }
 
  FroalaEditor.Image.upload(req, '/uploads/', options, function(err, data) {
 
    if (err) {
      return res.send(JSON.stringify(err));
    }
    res.send(data);
  });
});


router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
    if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

router.get('/usersList', function(req, res) {
  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);  
  });
});
router.get('/User/:id',function(req,res){
  User.findOne({_id:req.params.id},function(err,data){
     res.json(data);
  })
})
router.delete('/User/:id',function(req,reqs)
{
  User.remove({_id:req.params.id},function(err){
res.json({result:err ? 'error':'ok'});
  });
  
});

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({user:req.user});
  });


    module.exports =router;
