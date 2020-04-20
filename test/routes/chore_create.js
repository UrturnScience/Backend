const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const { setupFirebaseClient } = require("../util/firebase");
const app = require("../util/app");
const create_models = require("../util/create_models");
const PreferenceChecker = require("../util/preference_checker");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");

test.before(t => {
  setupFirebaseClient();
});

test.after(async t => {
  await dropDatabase();
});

test.beforeEach(async t => {
  await clearDatabase();
});

test.afterEach(async t => {
  await clearDatabase();
});

test.serial("POST /chore/create", async t => {
  const user1 = await create_models.create_user("123");
  const user2 = await create_models.create_user("345");

  const room = await create_models.create_room();

  await create_models.create_room_user(room.id, user1.id);
  await create_models.create_room_user(room.id, user2.id);

  let body = {
    roomId: room.id,
    name: "Dishes",
    time: 5
  }
  const res1 = await request(app).post("/chore/create").send(body).expect(200);

  body = {
    roomId: room.id,
    name: "Laundry",
    time: 4
  }
  const res2 = await request(app).post("/chore/create").send(body).expect(200);

  //Can't use previous model objects, since not in sync with db
  const chores = await Chore.find({});
  const preferences = await Preference.find({});

  t.truthy(chores.length == 2);
  t.truthy(preferences.length == 4);
  t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room.id));
});
