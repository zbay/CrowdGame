const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');

module.exports = {
    newGame: function(req, res){
        User.find({_id: req.session.user_id}).exec(function(err, users){
            if(err){
                return res.status(500).json({error: "Server error! Could not save the game."});
            }
            if(users.length === 0){
                return res.status(403).json({error: "Not logged in! Cannot create a game."});
            }
            console.log(users);
            let userObj = {"_id": users[0]._id, "firstName": users[0].firstName, "lastName": users[0].lastName};
            req.body.creator = userObj;
            req.body.members = [req.session.user_id];
            let newGame = new Game(req.body);
            newGame.save((err2, msg) => {
                if(err2){
                    return res.status(500).json({error: "Server error! Could not save the game."});
                }
                else{
                    res.json({success: "Game created!"});
                }
            });
        });
    },
    deleteGame: function(req, res){
        Game.findOneAndRemove({_id: req.params.gameID, creator: req.session.user_id}, (error, msg) => {
            if(error){
                return res.status(500).json({error: "Server error. Could not delete this game!"});
            }
            res.json({success: "Game deleted!"});
        });
    },
    getOpenGames: function(req, res){
        Game.find({open: true}).exec((err, games) => {
            if(err){
                return res.status(500).json({error: "Could not load games. Try again later!"});
            }
            res.json({games: games});
        });
    },
    getMyGames: function(req, res){
        Game.find({creator: req.session.user_id}).sort({open: -1, created_at: -1}).exec((err, games) => {
            if(err){
                return res.status(500).json({error: "Could not load games."});
            }
            res.json({games: games});
        });
    },
    closeGame: (req, res) => {
        Game.findOneAndUpdate({_id: req.body.gameID, creator: req.session.user_id}, {$set: {open: false}}, (error, msg) => {
            if(error){
                return res.status(500).json({error: "Server error. Could not close this game!"});
            }
            res.json({success: "Game closed!"});
        });
    },
    editGame: function(req, res){
        let game = req.body;
        Game.findOneAndUpdate({_id: req.body.gameID, creator: req.session.user_id}, 
            {$set: 
                {name: game.name, details: game.details, size: game.size, location: game.location, 
                open: game.open}}, 
            (error, msg) => {
                if(error){
                    return res.status(500).json({error: "Server error. Could not edit this game!"});
                }
                res.json({success: "Game edits saved!"});
            });
    },
    joinGame: function(req, res){
        Game.findOneAndUpdate({_id: req.body.gameID, open: true}, {$push: {members: req.session.user_id}}, {upsert: true}, (err, msg) => {
            if(err){
                return res.status(500).json("Server error. Could not join the game!");
            }
            res.json({success: "Game join processed!"});
        });
    },
    getGame: function(req, res){
        Game.findById(req.params.id).exec(function(err, game){
            if(err){
                return res.status(500).json("Server error. Could not load this game!");
            }
            res.json({game: game});
        });
    }
}