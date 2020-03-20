const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("./database");
const app = require("./app");
const create_models = require("./create_models");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");

test.before(t => {});

test.after(async t => {
  await dropDatabase();
});

test.beforeEach(async t => {
  await clearDatabase();
});

test.afterEach(async t => {
  await clearDatabase();
});

test.serial("DELETE /chore/delete/:id", async t => {
  const user1 = await create_models.create_user("123");
  const user2 = await create_models.create_user("345");

  const room = await create_models.create_room();

  await create_models.create_room_user(room.id, user1.id);
  await create_models.create_room_user(room.id, user2.id);

  const body = {
    roomId: room.id,
    name: "Dishes",
    time: 5
  }
  const res1 = await request(app).post("/chore/create").send(body).expect(200);

  //Can't use previous model objects, since not in sync with db
  let chores = await Chore.find({});
  let preferences = await Preference.find({});
  t.truthy(chores.length == 1);
  t.truthy(preferences.length == 2);

  const chore = chores[0];
  const res2 = await request(app).delete("/chore/delete/" + chore.id).expect(200);

  chores = await Chore.find({});
  preferences = await Preference.find({});
  t.truthy(chores.length == 0);
  t.truthy(preferences.length == 0);
});
