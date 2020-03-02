require("dotenv").config();

const { setupDB } = require("./src/services/dbSetup");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const roomRoutes = require("./src/routes/room.route");
const userRoutes = require("./src/routes/user.route");

const app = express();
const port = 3000;

setupDB().then(() => {
  console.log("Connected to Database");
});

app.get("/", (req, res) =>
  res.send("Hello World! This app was deployed automatically.")
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/room", roomRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
