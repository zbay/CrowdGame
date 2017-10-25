const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

//create a cors middleware
app.use(function(req, res, next) {
    //set headers to allow cross origin request.
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
});
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/dist')));
app.use(session({secret: 'jfdlsaflksaj', resave: true, saveUninitialized: true}));

require('./server/config/mongoose.js');

const routes_setter = require('./server/config/routes.js');
routes_setter(app);

app.listen(7654, function(){
    console.log("listening on port 7654");
});