const test = require("ava");
const request = require("supertest");
const firebase = require("firebase");
const {
  clearUsers,
  setupCurrentUser,
  setupFirebaseClient
} = require("../util/firebase");
const { dropDatabase } = require("../util/database");
const User = require("../../src/models/user.model");
const app = require("../util/app");

test.before(t => {
  setupFirebaseClient();
});

test.after(async t => {
  await dropDatabase();
});

test.beforeEach(async t => {
  await clearUsers();
});

test.afterEach(async t => {
  await clearUsers();
});

test.serial(
  "POST /user/login should provide session credentials on successful login",
  async t => {
    await setupCurrentUser("test@test.com", "password");
    const token = await firebase.auth().currentUser.getIdToken();

    const res = await request(app)
      .post("/user/login")
      .set("Authorization", token)
      .expect(200);

    t.truthy(res.header["set-cookie"]);
  }
);

test.serial(
  "POST /user/login should create a user record with firebaseId if one doesn't exist",
  async t => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword("test@test.com", "password");
    const token = await firebase.auth().currentUser.getIdToken();

    const res = await request(app)
      .post("/user/login")
      .set("Authorization", token)
      .expect(200);

    const user = await User.findOne({
      firebaseId: firebase.auth().currentUser.uid
    });

    t.truthy(user);
    t.is(user.firebaseId, firebase.auth().currentUser.uid);
  }
);

test.serial("DELETE /user/logout", async t => {
  await setupCurrentUser("test@test.com", "password");
  const token = await firebase.auth().currentUser.getIdToken();
  const agent = request.agent(app);

  await agent.post("/user/login").set("Authorization", token);

  await agent.delete("/user/logout").expect(200);

  t.pass();
});
