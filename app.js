const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { monitorEventLoopDelay } = require("perf_hooks");
const app = express();
const port = process.env.PORT


app.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
    console.log("Connectyed to database");
})

app.listen(port, ()=> {
    console.log(`The server is listening ${port}`)
});


