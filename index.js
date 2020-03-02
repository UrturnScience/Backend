require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const errorMiddleware = require("./src/errorHandling");
const bodyParser = require("body-parser");
const { setupDB } = require("./src/services/dbSetup");
const app = express();
const port = 3000;

setupDB().then(() => {
  console.log("Connected to Database");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var userRoutes = require("./src/routes/user.route");
app.use("/user", userRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(errorMiddleware.handleExpressError);
