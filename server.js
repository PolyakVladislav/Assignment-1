require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");

const app = express();

const initApp = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DB_CONNECT).then(() => {
      console.log("Connected to database");

      app.use(bodyParser.json());
      app.use("/posts", postsRoutes);
      app.use("/comments", commentsRoutes);

      resolve(app);
    }).catch(err => {
      console.error("Database connection error:", err);
      reject(err);
    });
  });
};

module.exports = initApp;
