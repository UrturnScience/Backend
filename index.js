require("express-async-errors");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const errorMiddleware = require("./src/errorHandling");
const bodyParser = require("body-parser");

<<<<<<< HEAD
const { setupSocket } = require("./src/services/socket");
=======
require("./src/services/firebaseSetup");
>>>>>>> 181533c1abb2f60fe70587173d83e3e1713cb583
const { setupDB } = require("./src/services/dbSetup");
const roomRoutes = require("./src/routes/room.route");
const userRoutes = require("./src/routes/user.route");
const roomUserRoutes = require("./src/routes/room_user.route");
const choreRoutes = require("./src/routes/chore.route");
const assignmentRoutes = require("./src/routes/assignment.route");
const preferenceRoutes = require("./src/routes/preference.route");

const app = express();
app.use(
  session({
    secret: "keyboard cat", // TODO, this secret will probably be handled by Google KMS
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // cookie: {secure: true}, // TODO, must enable https first
  })
);

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

const server = app.listen(process.env.NODE_PORT, () => console.log(`Example app listening on port ${process.env.NODE_PORT}!`));
app.use(errorMiddleware.handleExpressError);

setupSocket(server);

module.exports = app;
