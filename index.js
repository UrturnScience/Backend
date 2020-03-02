require("dotenv").config();

const { setupDB } = require("./src/services/dbSetup");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

setupDB().then(() => {
  console.log("Connected to Database");
});

app.get("/", (req, res) =>
  res.send("Hello World! This app was deployed automatically.")
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var userRoutes = require("./routes/user.route");
app.use("/user", userRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
