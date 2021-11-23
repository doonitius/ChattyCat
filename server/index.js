const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const {
    userJoin,
    getCurrentUser,
    userLeave
} = require('./middleware/users.js');
const {
    saveNewMessage
} = require('./function.socket/saveMessage');
const newChatMessage = require('./model/newMessage');


require("dotenv").config();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

require("./apiServer");

app.get('/check', (req, res) => {
    res.status(200).send("You are now accessing Chat API");
})

var clients = {};

// check first if ChatID exist, if not, create. 
// if exist backend send old chat, frontend send parameter 
// call this from localhost:3000/?username=username&room=room (await this when creating chat room)
io.on('connection', (socket) => {
    console.log("connected to socket.io");
    console.log("socket_id: ", socket.id, "has joined");
    // console.log(socket.handshake.query.username);
    // console.log(socket.handshake.query.room);

    async function newGetMessage(c, count, room) {
        var element;
        if (count - c == 0) 
        {
            element = count - 50; 
            num = Number(element); 
            const message = await newChatMessage.find({chatID: room}).sort({"_id": 1}).skip(num).limit(50);
            for (var i = 0; i < message.length; i++)
            {
                socket.emit("loadUniqueChat", message[i]);
                console.log(message[i]);
            }
            c = c - 50;
            return c;
        }
        else if (c > 50)
        {
            element = c - 50;
            num = Number(element);
            const message = await newChatMessage.find({chatID: room}).sort({"_id": 1}).skip(num).limit(50);
            for (var i = 0; i < message.length; i++)
            {
                socket.emit("loadUniqueChat", message[i]);
                console.log(message[i]);
            }
            c = c - 50;
            return c;
        }
        else 
        {
            element = c;
            num = Number(element);
            const message = await chatMessage.findOne({chatID: room}).sort({"_id": 1}).limit(num);
            for (var i = 0; i < message.length; i++)
            {
                socket.emit("loadUniqueChat", message[i]);
                console.log(message[i]);
            }
            c = 0;
            return c;
        }
    }
    
    async function newPastMessage (user, c) {
        console.log("-------Function------");
        console.log(user);
        const messageChat = await newChatMessage.find({chatID: user.room}, {"_id": 0, "__v": 0}).sort({"_id": 1});
        var message;
        var room = user.room;
        if(!messageChat)
            return message = "start conversation";
        var count = messageChat.length;
        // if (c == -1)
        //     c = count;
        // if (count > 50) 
        // {
        //     c = newGetMessage(c, count,room);
        //     return c;
        // }
        // else 
        // {
            c = 0;
            for (var i = 0; i < messageChat.length; i++) 
            {
                socket.emit("loadUniqueChat", messageChat[i]);
                console.log(messageChat[i]);
            }
            return c;
        // }
    }

    // var username = socket.handshake.query.username;
    // var room = socket.handshake.query.room;

    // this one work good good now ok  
    // have to be json when test post man okokokkok
    socket.on("signin", (id, targetId, count) => {
        console.log("ID:" + id);
        clients[id] = socket;
        // console.log(clients);
        const user = userJoin(socket.id, id, targetId);
        socket.join(user.room);
        newPastMessage(user, count).then((c) => {
            //socket.emit('message', 'Hi user ' + user.username);
            console.log("---------")
            console.log(c);
            // messageJSON = Object.assign({}, message);
            io.to(user.room).emit('pastMessage', c);
            socket.broadcast.to(user.room).emit('message', user.username + ' has joined')
        })

        // pastMessage(user, count).then((message) => {
        //         //socket.emit('message', 'Hi user ' + user.username);
        //         console.log("---------")
        //         console.log(message);
        //         // messageJSON = Object.assign({}, message);
        //         io.to(user.room).emit('pastMessage', message);
        //         socket.broadcast.to(user.room).emit('message', user.username + ' has joined')
        //     })

            // console.log(user);
    });

    // socket.on("message", (msg) => {
    //     console.log(msg);
    //     let targetId = msg.targetId;
    //     if (clients[targetId]) clients[targetId].emit("message", msg);
    // });

    // socket.on('joinRoom', () => {
    //     const user = userJoin(socket.id, username, room);
    //     console.log(user);
    //     socket.join(user.room);
    //     pastMessage(user).then((message) => {
    //     //socket.emit('message', 'Hi user ' + user.username);
    //     console.log("---------")
    //     console.log(message)
    //     socket.emit('message', message)
    //     socket.broadcast.to(user.room).emit('message', user.username + ' has joined')
    //     })
    // });
    //console.log('user connected');

    socket.on('chat message', (msg) => {
        const user = getCurrentUser(socket.id);
        console.log(user);
        console.log("message " + msg.message);
        saveNewMessage(user, msg.message).then((mes) => {
            console.log("-V-V-V-V-V-V-V-");
            console.log(mes);
            // io.to(user.room).emit('chat message', mes);
            let targetId = msg.targetId;
            if (clients[targetId]) clients[targetId].emit("chat message", msg);
        })
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log("disconnected");
        // io.to(user.room).emit('message', user.username + ' disconnected');
    });
});

mongoose.connect(
    process.env.DB_CLUSTER, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () =>
    console.log('socket chat connected to DB')
);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Chat Server is running on port ' + port)
    console.log('go to http://localhost:' + port + "/check");
    console.log("_____________________________________");

});