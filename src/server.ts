require("dotenv").config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoute from "./routes/posts";
import commentsRoute from "./routes/comments";
import authRoutes from "./routes/auth_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
const app = express();
app.use(bodyParser.json());
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/auth", authRoutes);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dor Vladi REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:"+process.env.PORT, },],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


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
