require("dotenv").config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoute from "./routes/posts";
import commentsRoute from "./routes/comments";
import authRoutes from "./routes/auth_route";

const app = express();

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (process.env.DB_CONNECT === undefined) {
      console.error("DB_CONNECT is not defined");
      reject("DB_CONNECT is not defined");
      return;
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          console.log("Connected to database");

          app.use(bodyParser.json());
          app.use("/posts", postsRoute);
          app.use("/comments", commentsRoute);
          app.use("/auth", authRoutes);

          resolve(app);
        })
        .catch((err) => {
          console.error("Database connection error:", err);
          reject(err);
        });
    }
  });
};

export default initApp;
