require('dotenv').config(); 

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT ;

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://dormatana101:Dormatana054@postcomments.berhw.mongodb.net/?retryWrites=true&w=majority&appName=PostComments");
const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connected to database");
});

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});
