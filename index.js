require("express-async-errors");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
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
<<<<<<< HEAD
const port = 8080;
=======
app.use(
  session({
    secret: "keyboard cat", // TODO, this secret will probably be handled by Google KMS
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // cookie: {secure: true}, // TODO, must enable https first
  })
);
>>>>>>> c22413a10435f8164317048d9ec96aba946a88df

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
app.use("/preference", preferenceRoutes);

<<<<<<< HEAD
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
=======
app.listen(process.env.NODE_PORT, () => console.log(`Example app listening on port ${process.env.NODE_PORT}!`));
>>>>>>> c22413a10435f8164317048d9ec96aba946a88df
app.use(errorMiddleware.handleExpressError);

module.exports = app;
