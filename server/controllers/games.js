const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');
const Comment = mongoose.model('Comment');
const Group = mongoose.model('Group');
const perPage = 3;

module.exports = {
    newGame: function(req, res){
        User.find({_id: req.body.jwt_user_id}).exec(function(err, users){
            if(err){
                console.log(err.message);
                return res.status(500).json({error: "Server error! Could not save the game."});
            }
            if(users.length === 0){
                return res.status(403).json({error: "Not logged in! Cannot create a game."});
            }
            let userObj = {"_id": users[0]._id, "firstName": users[0].firstName, "lastName": users[0].lastName, "imgURL": users[0].imgURL};
            req.body.creator = userObj;
            req.body.players = [req.body.jwt_user_id];
            let newGame = new Game(req.body);
            newGame.save((err2, msg) => {
                if(err2){
                    console.log(err2.message);
                    return res.status(500).json({error: err2.message});
                }
                else{
                    res.json({success: "Game created!"});
                }
            });
        });
    },
    deleteGame: function(req, res){
        Game.findById(req.params.gameID, (error, game) => {
            if(error || game.creator._id != req.body.jwt_user_id){
                return res.status(500).json({error: "Server error. Could not delete this game!"});
            }
            else{
                Game.findByIdAndRemove(req.params.gameID, (err, msg) => {
                    if(err){
                        return res.status(500).json({error: "Server error. Could not delete this game!"});
                    }
                    res.json({success: "Game deleted!"});
                });
            }
        });
    },
    getGames: function(req, res){
        let skipNum = (parseInt(req.body.pageNum)-1)*perPage;
        let searchObj = {open: true};
        let sortObj = {datetime: 1};
        if(req.body.searchTerm && req.body.searchTerm.length > 0){
            searchObj.$text = {$search: req.body.searchTerm};
        }
        if(req.body.category && req.body.category !== "Any"){
            searchObj.category = req.body.category;
        }
        if(req.body.justMine){
            searchObj.$or = [{creator: req.body.jwt_user_id}, {players: {$in: [req.body.jwt_user_id]}}]; // user created the game or is in game
            delete searchObj.open;
            sortObj = {created_at: -1};
        }
        else{
            searchObj.datetime = {$gte: new Date()}; // restrict to future games, unless they're your games
        }
        Game.find(searchObj)
        .sort(sortObj) // get earliest games first (if browsing all), or most recently created games first (if browsing mine)
        .limit(perPage).skip(skipNum)
        .exec((err, games) => {
            if(err){
                console.log(err.message);
                return res.status(500).json({error: "Could not load games. Try again later!"});
            }
            res.json({games: games});
        });
    },
    getMyGames: function(req, res){
        Game.find({creator: req.body.jwt_user_id}).sort({open: -1, created_at: -1}).exec((err, games) => {
            if(err){
                return res.status(500).json({error: "Could not load games."});
            }
            res.json({games: games});
        });
    },
    saveComment: function(req, res){
        // no jwt auth requirement?
        let newComment = new Comment(req.body.comment);
        newComment.save((err, comment) => {
            if(err){
                return res.status(500).json({error: "Could not save comment!"});
            }
            Game.findOneAndUpdate({_id: req.params.gameID}, {$push: {comments: comment._id}}, (error, msg) => {
                if(error){
                    return res.status(500).json({error: "Could not save comment!"});
                }
                res.json(comment);
            });       
        });
    },
    closeGame: (req, res) => {
        Game.findById(req.params.gameID, (error, game) => {
            if(error || game.creator._id != req.body.jwt_user_id){
                return res.status(500).json({error: "Server error. Could not close this game!"});
            }
            else{
                Game.findOneAndUpdate({_id: req.params.gameID}, {$set: {open: false}}, (err, msg) => {
                    if(err){
                        return res.status(500).json({error: "Server error. Could not close this game!"});
                    }
                    res.json({success: "Game closed!"});
                });
            }
        });
    },
    openGame: (req, res) => {
        Game.findById(req.params.gameID, (error, game) => {
            if(error || game.creator._id != req.body.jwt_user_id){
                return res.status(500).json({error: "Server error. Could not open this game!"});
            }
            else{
                Game.findOneAndUpdate({_id: req.params.gameID}, {$set: {open: true}}, (err, msg) => {
                    if(err){
                        return res.status(500).json({error: "Server error. Could not open this game!"});
                    }
                    res.json({success: "Game opened!"});
                });
            }
        });       
    },
    editGame: function(req, res){
        let game = req.body.game;
        Game.findById(req.params.gameID, (error, msg) => {
            if(error || (game.creator._id != req.body.jwt_user_id)){
                return res.status(500).json({error: "Server error. Could not edit this game!"});
            }
            Game.findOneAndUpdate({_id: req.params.gameID}, 
                {$set: 
                    {name: game.name, details: game.details, time: game.time, size: parseInt(game.size),
                         location: game.location, datetime: game.datetime, date: game.date, time: game.time}}, 
                    {runValidators: true},
                (err, msg) => {
                    if(err){
                        console.log(err.message);
                        return res.status(500).json({error: "Server error. Could not edit this game!"});
                    }
                    res.json({success: "Game edits saved!"});
                });
        });
    },
    joinGame: function(req, res){
        Game.findOneAndUpdate({_id: req.body.gameID, open: true}, {$push: {players: req.body.jwt_user_id}}, {upsert: true}, (err, msg) => {
            if(err){
                return res.status(500).json("Server error. Could not join the game!");
            }
            res.json({success: "Game join processed!"});
        });
    },
    leaveGame: function(req, res){
        Game.findByIdAndUpdate({_id: req.body.gameID}, {$pull: {players: req.body.jwt_user_id}}, (err, msg) => {
            if(err){
                return res.status(500).json("Server error. Could not leave the game!");
            }
            res.json({success: "Game departure processed!"});           
        });
    },
    getGame: function(req, res){
        Game.findById(req.params.id).populate("comments").exec(function(err, game){
            if(err){
                return res.status(500).json("Server error. Could not load this game!");
            }
            res.json({game: game});
        });
    },
    getFriendGames: function(req, res){
        User.findById(req.body.jwt_user_id, (err, user) => { // step 1: get the logged-in user
            if(err){
                return res.status(500).json("Server error. Could not load the user!");
            }
            if(user.friends.length === 0){
                return res.json({games: []});
            }
            User.find({_id: {$in: user.friends}}, (error, users) => { // step 2: get the user's friends
            if(error){
                return res.status(500).json("Server error. Could not load user friends!!");
            }         
            let friendIDs = [];
            for(let i = 0; i < users.length; i++){
                friendIDs.push(users[i]._id);
            }
            Game.find({"creator._id": {$in: friendIDs}}, (gameError, games) => {
                if(gameError){
                    return res.status(500).json("Server error. Could not load friend games!!");
                }      
                return res.json({games: games});
            });
            }); 
        }); 
    }
}