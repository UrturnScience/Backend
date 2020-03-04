require("dotenv").config();
require("express-async-errors")

const express = require("express");
const mongoose = require("mongoose");
const errorMiddleware = require("./src/errorHandling");
const bodyParser = require("body-parser");

const { setupDB } = require("./src/services/dbSetup");
const roomRoutes = require("./src/routes/room.route");
const userRoutes = require("./src/routes/user.route");

const app = express();
const port = 3000;

setupDB().then(() => {
  console.log("Connected to Database");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/room", roomRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(errorMiddleware.handleExpressError);
