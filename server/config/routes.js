const users = require('../controllers/users');
const path = require('path');
// need to add a route for searching by title
module.exports = function(app) {
    app.post("/api/user", (req, res) => { // add a new user
        users.newUser(req, res);
    });
    app.post("/api/login", (req, res) => { // login attempt
        users.login(req, res);
    });
    app.get("/api/logout", (req, res) => { // log out
        users.logout(req, res);
    });
    app.post("/api/settings", (req, res) => {
        users.editMe(req, res);
    });
    app.get("/api/me", (req, res) => {
        users.getMe(req, res);
    });
    app.post("/api/profilePic", (req, res) => {
        users.addProfPic(req, res);
    });
    app.all("*", (req, res, next) => { // front-end views
        res.sendFile(path.resolve("./public/dist/index.html"))
    });
}