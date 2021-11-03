const express = require('express');
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);

require("./routes/loginRegis")(app);
// require("./routes/authRoute")(app);
require("./routes/profile.route")(app);
require("./routes/home")(app);
require("./routes/chat")(app);
//require("./routes/groupChat")(app);

app.get("/check", (req, res) => {
    res.status(200).send("You are now accessing HTTP API");
});

mongoose.connect(
    process.env.DB_CLUSTER,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.log("HTTP: connected to DB")
);

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log("_____________________________________");
    console.log("API Server is running on port " + port);
    console.log("go to http://localhost:" + port + "/check");
    console.log("_____________________________________");
});