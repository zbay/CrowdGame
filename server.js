const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/dist')));

require('./server/config/mongoose.js');

const routes_setter = require('./server/config/routes.js');
routes_setter(app);

app.listen(7654, function(){
    console.log("listening on port 7654");
});