require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const app = express();



const initApp = ()=> {
 return new Promise((resolve,reject)=>{
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Connected to database");
  });

  mongoose.connect(process.env.DB_CONNECT).then(() => {
    app.use(bodyParser.json());
    app.use("/posts", postsRoutes);
    app.use("/comments", commentsRoutes);
    resolve(app); 
  });
});
}







module.exports = initApp; 
