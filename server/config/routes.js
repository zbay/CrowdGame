const users = require('../controllers/users');
const games = require('../controllers/games');
const path = require('path');
// need to add a route for searching by title
module.exports = function(app) {
    app.post("/api/user", (req, res) => { // add a new user
        users.newUser(req, res);
    });
    app.post("/api/login", (req, res) => { // login attempt
        users.login(req, res);
    });
    app.post("/api/settings", (req, res) => { // edit user profile
        users.editMe(req, res);
    });
    app.get("/api/me", (req, res) => { // get your own data
        users.getMe(req, res);
    });
    app.get("/api/openGames", (req, res) => { // get all open games
        games.getOpenGames(req, res);
    });
    app.post("/api/newGame", (req, res) => { // post a new game
        games.newGame(req, res);
    });
    app.get("/api/myGames", (req, res) => { // get all games that the user is involved in
        games.getMyGames(req, res);
    });
    app.get("/api/game/:id", (req, res) => {
        games.getGame(req, res);
    });
    app.delete("/api/game/:id", (req, res) => { // delete a game
        games.deleteGame(req, res);
    });
    app.post("/api/editGame", (req, res) => { // save changes to a game
        games.editGame(req, res);
    });
    app.post("/api/close/:id", (req, res) => { // close game
        games.closeGame(req, res);
    });
    app.post("/api/join", (req, res) => { // join a gmae
        games.joinGame(req, res);
    });
    app.all("*", (req, res, next) => { // front-end routing
        res.sendFile(path.resolve("./public/dist/index.html"))
    });
}