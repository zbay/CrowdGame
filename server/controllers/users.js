const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');
const createToken = require('../util/token');

let self = module.exports = {
  newUser: function(req, res) {
      let is_admin = false;
      User.find({}).exec(function(firstError, users){
        if(firstError){
            return res.status(500).json(err);
        }
        if(users.length === 0){
            is_admin = true; // make user an admin if they're the first user
        }
        User.find({email: req.body.email}).exec(function(error, user){
            if(user.length > 0){
                return res.status(403).json({error: "The email you last submitted is already in the system."});
            }
            if(error){
              return res.status(500).json(err);
            }
            else{  
                req.body.is_admin = is_admin;
                let newUser = new User(req.body);
                newUser.save(function saveUser(err, savedUser){
                    if(err || (req.body.password !== req.body.passwordConfirmation)){
                        if((req.body.password !== req.body.passwordConfirmation) || req.body.password.length < 8){
                            return res.status(403).json({error: "Password error! Make sure they're long enough and that they match!"});
                        }
                        else{
                          console.log(err);
                          return res.status(403).json({error: "Failed to save new user to database! Try again!"});
                        }
                    }
                    else{
                        return res.json({token: createToken(savedUser)});
                    }
                });
            }
          });
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
                            user.strikes = 0;
                            user.save((error, msg) => {
                                return res.json({token: createToken(user)});
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
    User.findOne({_id: req.body.jwt_user_id}).exec((err, user) => {
        if(err || !user || !user.firstName){
            return res.status(500).json({error: "Server error. Could not retrieve user"});
        }
        else{
            let trimmedUser = {firstName: user.firstName, lastName: user.lastName, email: user.email, imgURL: user.imgURL};
            res.json({user: trimmedUser});
        }
    });
  },
  editMe: function(req, res){
    User.find({_id: req.body.jwt_user_id}).exec((err, users) => {
        if(err){
            return res.status(500).json({error: "Server error. Could not query database for user!"});
        }
        if(users.length === 0){
            return res.status(403).json({error: "Could not find this user to edit!"});
        }
        let user = users[0];
        bcrypt.compare(req.body.currentPassword, user.password, function(err2, matched){
            if(err2){
                return res.status(500).json({error: "Server error. Could not check password!"});
            }
            if(matched){
                user.email = req.body.email;
                user.imgURL = req.body.imgURL;
                if(req.body.newPassword && req.body.newPassword.length > 0){
                    user.password = req.body.newPassword;
                }
                user.save((error, msg) => {
                    if(error){
                        return res.status(403).json({error: "Failed to save changes! Try again."});
                    }
                    res.json({success: "Saved profile changes!"});
                });
            }
            else{
                return res.status(403).json({error: "Incorrect password! Could not save changes!"});
            }
        });
    });
  },
  requestFriend: function(req, res){
    User.findByIdAndUpdate(req.body.pendingFriendID, {$push: {friend_requesters: req.body.jwt_user_id}}, (updateErr, msg) => {
        if(updateErr){
            return res.status(500).json(updateErr);
        }     
        return res.json({success: "Successfully submitted friend request!"});
    });
  },
  cancelFriendRequest: function(req, res){
    User.findByIdAndUpdate(req.body.pendingFriendID, {$pull: {friend_requesters: req.body.jwt_user_id}}, (updateErr, msg) => {
        if(updateErr){
            return res.status(500).json(updateErr);
        }     
        return res.json({success: "Successfully submitted friend request!"});
    });
  },
  denyFriend: function(req, res){
    User.findByIdAndUpdate(req.body.jwt_user_id, {$pull: {friend_requesters: req.body.pendingFriendID}}, (updateErr, msg) => {
        if(updateErr){
            return res.status(500).json(updateErr);
        }     
        return res.json({success: "Successfully deleted friend request!"});
    });
  },
  approveFriend: function(req, res){
    User.findByIdAndUpdate(req.body.jwt_user_id, {$pull: {friend_requesters: req.body.pendingFriendID}, $push: {friends: req.body.pendingFriendID}}, (updateErr, msg) => {
        if(updateErr){
            console.log(updateErr);
            return res.status(500).json(updateErr);
        }     
        return res.json({success: "Successfully submitted friend request!"});
    });
  },
  deleteFriend: function(req, res){
    User.findByIdAndUpdate(req.body.jwt_user_id, {$pull: {friends: req.body.friendID}}, (updateErr, msg) => {
        if(updateErr){
            return res.status(500).json(updateErr);
        }     
        return res.json({success: "Successfully submitted friend request!"});
    });
  },
  getFriendInfo: function(req, res){
    User.findById(req.body.jwt_user_id).populate("friends").exec((err, user) => {
        if(err){
            return res.status(500).json(err); 
        }
        return res.json({friends: user.friends});
    });
  },
  getAllUsers: function(req, res){
    let perPage = 3;
    let skipNum = (parseInt(req.body.pageNum)-1)*perPage;
    req.body.filterOut.push(req.body.jwt_user_id);
    console.log(req.body.searchTerm);
    let searchObj = {_id: {$nin: req.body.filterOut}};
    if(req.body.searchTerm && req.body.searchTerm.length > 0){
        searchObj.$text = {$search: req.body.searchTerm};
    }
    User.find(searchObj).limit(perPage).skip(skipNum).exec((err, users) => { // filter out certain users (friends and friend requesters, for instance)
        if(err){
            console.log(err);
            return res.status(500).json(err);
        }
        return res.json({users: users});
    });
  },
  getRequestedFriends: function(req, res){ // get friends who've requested you as a friend
    User.findById(req.body.jwt_user_id).populate("friend_requesters").exec((err, user) => {
        if(err){
            return res.status(500).json(err); 
        }
        return res.json({friend_requesters: user.friend_requesters});
    });
  },
  getRequesteeFriends: function(req, res){ // get friends who you've requested as a friend
    User.find({friend_requesters: {$in: [req.body.jwt_user_id]}}).exec((err, users) => {
        if(err){
            return res.status(500).json(err); 
        }
        return res.json({requestees: users});
    });
  },
  verifyFriendship: function(req, res){
    User.findById(req.body.jwt_user_id, (err, user) => {
        if(err){
            return res.status(500).json(err); 
        }
        let areFriends = false;
        for(let i = 0; i < user.friends.length; i++){
            if(user.friends[i] == req.body.hostID){
                areFriends = true;
            }
        }
        return res.json({areFriends: areFriends});
    });
  }
  }