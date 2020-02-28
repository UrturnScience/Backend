require("dotenv").config();

const { setupDB } = require("./src/services/dbSetup");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

setupDB().then(() => {
  console.log("Connected to Database");
});

app.get("/", (req, res) =>
  res.send("Hello World! This app was deployed automatically.")
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
