require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to database");
});

const postsRoutes = require("./routes/posts");

app.use("/posts", postsRoutes);

app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
