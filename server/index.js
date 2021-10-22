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

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

require("./routes/loginRegis")(app);
// require("./routes/authRoute")(app);
require("./routes/profile.route")(app);
require("./routes/home")(app);

const auth = require("./middleware/auth");

app.post('/main', auth, (req, res) => {
    res.status(200).send("logged in");
})

app.use(express.static(path.join(__dirname, 'view')));

app.use('/api/', require('./test'))

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);
        socket.emit('message', 'Hi user '+ user.username);
        socket.broadcast.to(user.room).emit('message', user.username + ' has joined');

    });
    
    //console.log('user connected');
    socket.on('chat message', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        io.to(user.room).emit('message', user.username + ' disconnected');
    });
});



mongoose.connect(process.env.dbConnection, 
    { useNewUrlParser: true, 
        useUnifiedTopology: true }, () =>
    console.log('connected to DB')
    );

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server is running on port ' + port)});