const test = require("ava");
const request = require("supertest");
const firebase = require("firebase");
const {
  clearUsers,
  setupCurrentUser,
  setupFirebaseClient
} = require("./firebase");
const { dropDatabase } = require("./database");
const app = require("./app");

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

test.serial("DELETE /user/logout", async t => {
  await setupCurrentUser("test@test.com", "password");
  const token = await firebase.auth().currentUser.getIdToken();
  const agent = request.agent(app);

  await agent.post("/user/login").set("Authorization", token);

  await agent.delete("/user/logout").expect(200);

  t.pass();
});
