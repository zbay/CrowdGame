const mongoose = require('mongoose');
const Group = mongoose.model('Group');
const User = mongoose.model('User');

let self = module.exports = {
  newGroup: function(req, res){
    Group.find({name: req.body.name}).exec(function(err, groups){
        if(err){
            return res.status(500).json(err);
        }
        if(groups.length > 0){
            return res.status(403).json({error: "The group must have a unique name!"});
        }
        let newGroup = new Group(req.body);
        newGroup.members = [req.body.jwt_user_id];
        newGroup.admins = [req.body.jwt_user_id];
        newGroup.save(function(error, savedGroup){
            if(error){
                return res.status(500).json(error);
            }
            return res.json({savedGroup: savedGroup});
        });
    });
  },
  deleteGroup: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedDeletion = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedDeletion){
            Group.remove({_id: req.body.groupID}).exec(function(error, msg){
                if(error){
                    return res.status(500).json(error);
                }
                return res.json({success: "Successful group deletion!"});
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to delete this group!"});
        }
    });
  },
  editGroup: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedEdit = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedEdit){
            group.name = req.body.name;
            group.description = req.body.description;
            group.public = req.body.public;
            group.save(function(error, msg){
                if(error){
                    return res.status(500).json(error);
                }
                return res.json({success: "Successful group edit!"});
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to edit this group!"});
        }
    });
  },
  addAdmin: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedEdit = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedEdit){
            User.findOne({email: req.body.email}).exec(function(error, user){
                if(error){
                    return res.status(500).json(error);
                }           
                if(!user || !user._id){
                    return res.status(500).json({error: "No user with that email exists!"});
                }
                Group.findByIdAndUpdate(req.body.groupID, {$push: {admins: user._id}}, (updateErr, msg) => {
                    if(error){
                        return res.status(500).json(error);
                    }     
                    return res.json({success: "Successfully added admin!"});
                });     
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to edit this group!"});
        }
    });    
  },
  addUser: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedEdit = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedEdit){
            User.findOne({email: req.body.email}).exec(function(error, user){
                if(error){
                    return res.status(500).json(error);
                }           
                if(!user || !user._id){
                    return res.status(500).json({error: "No user with that email exists!"});
                }
                Group.findByIdAndUpdate(req.body.groupID, {$push: {members: user._id}}, (updateErr, msg) => {
                    if(error){
                        return res.status(500).json(error);
                    }     
                    return res.json({success: "Successfully added group member!"});
                });     
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to edit this group!"});
        }
    });    
  },
  addRequester: function(req, res){ // a user submits a request for admission to the group
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        Group.findByIdAndUpdate(req.body.groupID, {$push: {requesters: req.body.jwt_user_id}}, (updateErr, msg) => {
            if(error){
                return res.status(500).json(error);
            }     
            return res.json({success: "Successfully requested group membership!"});
        });     
    });    
  },
  removeAdmin: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedEdit = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedEdit){
            User.findOne({email: req.body.email}).exec(function(error, user){
                if(error){
                    return res.status(500).json(error);
                }           
                if(!user || !user._id){
                    return res.status(500).json({error: "No user with that email exists!"});
                }
                Group.findByIdAndUpdate(req.body.groupID, {$pull: {admins: user._id}}, (updateErr, msg) => {
                    if(error){
                        return res.status(500).json(error);
                    }     
                    return res.json({success: "Successfully removed admin!"});
                });     
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to edit this group!"});
        }
    });   
  },
  removeUser: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedEdit = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedEdit){
            User.findOne({email: req.body.email}).exec(function(error, user){
                if(error){
                    return res.status(500).json(error);
                }           
                if(!user || !user._id){
                    return res.status(500).json({error: "No user with that email exists!"});
                }
                Group.findByIdAndUpdate(req.body.groupID, {$pull: {members: user._id}}, (updateErr, msg) => {
                    if(error){
                        return res.status(500).json(error);
                    }     
                    return res.json({success: "Successfully removed group member!"});
                });     
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to edit this group!"});
        }
    });    
  },
  removeRequester: function(req, res){
    Group.findById(req.body.groupID).exec(function(err, group){
        if(err){
            return res.status(500).json(err);
        }
        let authorizedEdit = verifyAdmin(group.admins, req.body.jwt_user_id);
        if(authorizedEdit){
            User.findOne({email: req.body.email}).exec(function(error, user){
                if(error){
                    return res.status(500).json(error);
                }           
                if(!user || !user._id){
                    return res.status(500).json({error: "No user with that email exists!"});
                }
                Group.findByIdAndUpdate(req.body.groupID, {$pull: {requesters: user._id}}, (updateErr, msg) => {
                    if(error){
                        return res.status(500).json(error);
                    }     
                    return res.json({success: "Successfully denied join request!"});
                });     
            });
        }
        else{
            return res.status(403).json({error: "You are not authorized to edit this group!"});
        }
    });    
  },
  verifyAdmin: function(admins, user_id){
    let authorized = false;
    for(let i = 0; i < admins.length; i++){
        if(admins[i] == user_id){
            authorizedDeletion = true;
        }
    }
    return authorized;
  }
  }