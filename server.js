const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/dist')));
app.use(session({secret: 'jfdlsaflksaj', resave: true, saveUninitialized: true}));

require('./server/config/mongoose.js');

const routes_setter = require('./server/config/routes.js');
routes_setter(app);

app.listen(7654, function(){
    console.log("listening on port 7654");
});