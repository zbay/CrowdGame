const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');
const crypto = require('crypto');
const mime = require('mime');
//const moment = require('moment');
const multer = require('multer');
var storage = multer.diskStorage({ // this is the mechanism for randomly naming the file and preserving the file extension
    destination: function (req, file, cb) {
      cb(null, "public/src/assets/uploads")
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
          let extension = "";
          if(file.mimetype === "image/jpeg"){
            extension = "jpg";
          }
          else if(file.mimetype === "image/png"){
            extension = "png";
          }
          else if(file.mimetype === "image/gif"){
            extension = "gif";
          }
          else{
              throw new Error("Improper file type!");
          }
        cb(null, raw.toString('hex') + Date.now() + '.' + extension);
      });
    }
  });
var upload = multer({storage: storage}).single('photo');

let self = module.exports = {
  newUser: function(req, res) {
      User.find({email: req.body.email}).exec(function(error, user){
        if(user.length > 0){
            return res.status(403).json({error: "The email you last submitted is already in the system."});
        }
        if(error){
          return res.status(500).json(err);
        }
        else{  
            let newUser = new User(req.body);
            newUser.save(function saveUser(err, user){
                if(err || (req.body.password !== req.body.passwordConfirmation)){
                    if((req.body.password !== req.body.passwordConfirmation) || req.body.password.length < 8){
                        return res.status(403).json({error: "Password error! Make sure they're long enough and that they match!"});
                    }
                    else{
                      return res.status(403).json({error: "Failed to save new user to database! Try again!"});
                    }
                }
                else{
                    req.session.user_id = user.id;
                    res.json({success: "You saved a new user!"});
                }
            });
        }
      });
  },
  login: function(req, res){
    User.find({email: req.body.email}).exec(function(err, users){
        if(err){
          return res.status(403).json({error: "Incorrect email or password!"});
        }
        else{
            if(users.length < 1){
                return res.status(403).json({error: "Incorrect email or password!"});
            }
            else{
                let currentTime = Math.floor((new Date()).getTime()/60000); // number of minutes since 1/1/1970
                let user = users[0];
                if(user.last_login_attempt && (currentTime - user.last_login_attempt) < 60){
                    user.strikes += 1;
                }
                else{
                    user.strikes = 1;
                }
                user.last_login_attempt = currentTime;
                if(user.strikes >= 5){
                    console.log("too many login attempts!");
                    return res.status(403).json({error: "Too many login attempts! Try again in an hour."});
                }
                else{
                    bcrypt.compare(req.body.password, user.password, function(err, matched){
                        if(matched){
                            req.session.user_id = user._id;
                            user.strikes = 0;
                            user.save((error, msg) => {
                                res.json({success: "Logged in correctly!"});
                            });
                        }
                        else{
                            user.save((error, msg) => {
                              return res.status(403).json({error: "Incorrect email or password!"});
                            });
                        }
                    });
                }
            }
        }
    });
  },
  getMe: function(req, res){
    User.findOne({_id: req.session.user_id}).exec((err, user) => {
        if(err){
            return res.status(500).json({error: "Server error. Could not retrieve user"});
        }
        else{
            res.json({user: user});
        }
    });
  },
  editMe: function(req, res){
    User.findOne({_id: req.session.user_id}).exec((err, user) => {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = req.body.password;
        //user.imgURL = req.body.imgURL;
        user.save((err, newUser) => {
            if(err){
                return res.status(500).json({error: "Server error. Could not retrieve user"});
            }
            else{
                res.json({user: newUser});
            }
        });
    });
  },
  addProfPic: function(req, res){
    console.log(upload);
    upload(req, res, function (err) {
        //console.log(req);
        console.log(req.file);
        if(err){
          console.log(err);
          return res.status(422).send("an Error occured")
        }  
        let path = req.file.path;;
        console.log(path);
        return res.json({success: "Upload Completed for "+ path}); 
    });     
  },
  logout: function(req, res){
    self.reset_session(req);
    res.json({success: "Logged out!"});
  },
  reset_session: function(req){
    req.session.user_id = false;
  }
  }