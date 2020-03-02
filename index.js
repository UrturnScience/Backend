require("dotenv").config();

const express = require("express");
const errorMiddleware = require("./src/errorMiddleware");
const app = express();
const port = 3000;

app.use(errorMiddleware);

app.get("/", (req, res) =>
  res.send("Hello World! This app was deployed automatically.")
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
