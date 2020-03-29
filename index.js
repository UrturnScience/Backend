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
const { setupSocket } = require("./src/services/socket");
const userRoutes = require("./src/routes/user.route");
const roomUserRoutes = require("./src/routes/room_user.route");
const choreRoutes = require("./src/routes/chore.route");
const assignmentRoutes = require("./src/routes/assignment.route");
const preferenceRoutes = require("./src/routes/preference.route");
const messageRoutes = require("./src/routes/message.route");

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('yamljs').load('./swagger.yaml')

const app = express();
const sessionParser = session({
  secret: "keyboard cat", // TODO, this secret will probably be handled by Google KMS
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
  // cookie: {secure: true}, // TODO, must enable https first
});
app.use(express.static("public"));
app.use(sessionParser);

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
app.use("/message", messageRoutes);

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

// Swagger routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const server = app.listen(process.env.NODE_PORT, () =>
  console.log(`Example app listening on port ${process.env.NODE_PORT}!`)
);

app.use(errorMiddleware.handleExpressError);

setupSocket(server, sessionParser);

module.exports = app;
