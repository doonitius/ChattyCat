const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

require("dotenv").config();

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/view.html')
})

app.use('/api/', require('./test'))

io.on('connection', (socket) => {
    //console.log('user connected');
    socket.broadcast.emit('hi user');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });
});

require('./routes/loginRegis')(app);

mongoose.connect(process.env.dbConnection, 
    { useNewUrlParser: true, 
        useUnifiedTopology: true }, () =>
    console.log('connected to DB')
    );

server.listen(port, () => {
    console.log('Server is running on port ' + port)});

module.exports = app;