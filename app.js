const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT


app.use(bodyParser.json());
app.listen(port, ()=> `The server is listening ${port}`);

