require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const errorMiddleware = require("./src/errorHandling");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

require("./src/services/firebaseSetup");
const { setupDB } = require("./src/services/dbSetup");
const roomRoutes = require("./src/routes/room.route");
const userRoutes = require("./src/routes/user.route");
const roomUserRoutes = require("./src/routes/room_user.route");
const choreRoutes = require("./src/routes/chore.route");
const assignmentRoutes = require("./src/routes/assignment.route");
const preferenceRoutes = require("./src/routes/preference.route");

const app = express();
const port = 8080;

setupDB().then(() => {
  console.log(
    `Connected to DB! (user: ${mongoose.connection.user}, host: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name})`
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/chore", choreRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/roomuser", roomUserRoutes);
app.use("/preference", preferenceRoutes);
app.use("/roomuser", roomUserRoutes);

app.get("/ping", (req, res) => {
  res.status(200).send("Pong");
});

app.get("/authPing", async (req, res) => {
  const decodedToken = await admin
    .auth()
    .verifyIdToken(req.headers.authorization);
  const user = await admin.auth().getUser(decodedToken.uid);
  res.status(200).send(user.email + " just made authenticated ping request!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(errorMiddleware.handleExpressError);
