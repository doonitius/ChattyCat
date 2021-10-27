const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./middleware/users.js');

require("dotenv").config();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

require("./routes/loginRegis")(app);
// require("./routes/authRoute")(app);
require("./routes/profile.route")(app);
require("./routes/home")(app);
//require("./routes/groupChat")(app);

const auth = require("./middleware/auth");

app.post('/main', auth, (req, res) => {
    res.status(200).send("logged in");
})

app.get('/', (req, res) => {
    res.status(200).send("You are now accessing Chatki API");
})

// app.use(express.static(path.join(__dirname, 'view')));

// app.use('/api/', require('./test'))

var clients = {};

// check first if ChatID exist, if not, create. 
// if exist backend send old chat, frontend send parameter 
// call this from localhost:3000/?username=username&room=room (await this when creating chat room)
io.on('connection', (socket) => {
    console.log("connected to socket");
    console.log(socket.id, "has joined");
    console.log(socket.handshake.query.username);
    console.log(socket.handshake.query.room);

    var username = socket.handshake.query.username;
    var room = socket.handshake.query.room;


    socket.on("signin", (id, targetId) => {
        console.log("ID:" + id);
        clients[id] = socket;
        console.log(clients);
        const user = userJoin(socket.id, id, targetId);
        socket.join(user.room);
        console.log(user);
    });

    socket.on("message", (msg) => {
        console.log(msg);
        let targetId = msg.targetId;
        if (clients[targetId]) clients[targetId].emit("message", msg);
    });

    socket.on('joinRoom', () => {
        const user = userJoin(socket.id, username, room);
        console.log(user);
        socket.join(user.room);
        socket.emit('message', 'Hi user ' + user.username);
        socket.broadcast.to(user.room).emit('message', user.username + ' has joined');

    });

    //console.log('user connected');
    socket.on('chat message', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user);
        console.log("message" + msg);
        // save message to database here
        // save msg, sender: user.username
        io.to(user.room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {

        const user = userLeave(socket.id);
        console.log("disconnected");
        io.to(user.room).emit('message', user.username + ' disconnected');
    });
});



mongoose.connect(process.env.dbConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () =>
    console.log('connected to DB')
);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server is running on port ' + port)
    console.log('goto http://localhost:' + port);
});