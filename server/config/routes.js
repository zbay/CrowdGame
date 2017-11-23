const users = require('../controllers/users');
const games = require('../controllers/games');
const path = require('path');
const jwt = require('jsonwebtoken');

// lightweight middleware function to protect certain routes by JWT
const hasJWT = function (req, res, next) {
    let token = req.headers.authorization.substring(7);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // substring gets rid of 'Bearer '
        if(err){
            return res.status(403).json({error: "JWT authentication is required to access this route!"});
        }
        req.body.jwt_user_id = jwt.decode(token).sub; // save id for server side operations
        return next();
    });
}

// need to add a route for searching by title
module.exports = function(app) {
    app.post("/api/user", (req, res) => { // add a new user
        users.newUser(req, res);
    });
    app.post("/api/login", (req, res) => { // login attempt
        users.login(req, res);
    });
    app.post("/api/settings", hasJWT, (req, res) => { // edit user profile
        users.editMe(req, res);
    });
    app.get("/api/me", hasJWT, (req, res) => { // get your own data
        users.getMe(req, res);
    });
    app.post("/api/openGames", hasJWT, (req, res) => { // get all open games
        games.getOpenGames(req, res);
    });
    app.post("/api/newGame", hasJWT, (req, res) => { // post a new game
        games.newGame(req, res);
    });
    app.get("/api/myGames", hasJWT, (req, res) => { // get all games that the user is involved in
        games.getMyGames(req, res);
    });
    app.get("/api/game/:id", hasJWT, (req, res) => { // get a game by id
        games.getGame(req, res);
    });
    app.delete("/api/game/:gameID", hasJWT, (req, res) => { // delete a game
        games.deleteGame(req, res);
    });
    app.post("/api/editGame/:gameID", hasJWT, (req, res) => { // save changes to a game
        console.log("editing game?");
        games.editGame(req, res);
    });
    app.post("/api/close/:gameID", hasJWT, (req, res) => { // close game
        games.closeGame(req, res);
    });
    app.post("/api/open/:gameID", hasJWT, (req, res) => { // open game
        games.openGame(req, res);
    });
    app.post("/api/join", hasJWT, (req, res) => { // join a gmae
        games.joinGame(req, res);
    });
    app.post("/api/leave", hasJWT, (req, res) => { // leave a gmae
        games.leaveGame(req, res);
    });
    app.post("/api/game/:gameID/comment", hasJWT, (req, res) => { // post a comment
        games.saveComment(req, res);
    });
    app.all("*", (req, res, next) => { // defer to front-end routing
        res.sendFile(path.resolve("./public/dist/index.html"))
    });
}