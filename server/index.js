const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

app.get('/index', (req, res) => {
    res.send("index at " + port);
})

server.listen(port, () => {
    console.log('Server is running on port ' + port)});

module.exports = app;