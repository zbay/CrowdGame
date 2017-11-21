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

const server = app.listen(7654, function(){
    console.log("listening on port 7654");
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('joinRoom', function(room) {
        console.log("joining room: " + room);
        socket.join(room);
    });
    socket.on('leaveRoom', function(room){
        console.log("leaving room: " + room);
        socket.leave(room);
    });
    socket.on('newMessage', function (message, room) {
        io.to(room).emit("newMessage", message);
    });
});