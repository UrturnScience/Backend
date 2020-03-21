const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const app = require("../util/app");
const create_models = require("../util/create_models");

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
  //Test deleting for chores:
  //If chore has existing assignments for it, just retire it(since we need to have the chore to back reference)
  //If chore doesn't have any existing assignments, can erase it and its preferences since nothing references it

  //Create users,room,add users to room
  const user1 = await create_models.create_user("123");
  const user2 = await create_models.create_user("345");
  const room = await create_models.create_room();
  await create_models.create_room_user(room.id, user1.id);
  await create_models.create_room_user(room.id, user2.id);

  //Create chore1
  const body1 = {
    roomId: room.id,
    name: "Dishes",
    time: 5
  }
  const res1 = await request(app).post("/chore/create").send(body1).expect(200);

  //Create chore2
  const body2 = {
    roomId: room.id,
    name: "Lawn",
    time: 10
  }
  const res2 = await request(app).post("/chore/create").send(body2).expect(200);

  //Check that chore1 and chore 2 were made, and that preferences were populated for them for each user
  let chores = await Chore.find({});
  let preferences = await Preference.find({});
  //Check that preferences and chore was made
  t.truthy(chores.length == 2);
  t.truthy(preferences.length == 4);


  //Want to test that when deleting, wont delete any chores if assignments exist for that chore
  //Get a chore and make an assignment out of it
  chores = await Chore.find({});
  const assignment1 = await create_models.create_assignment(chores[0].id, user1.id);
  
  //Try to delete the chore that already has an assignment for it, so just retire it
  const res3 = await request(app).delete("/chore/delete/" + chores[0].id).expect(200);
  chores = await Chore.find({});
  preferences = await Preference.find({});
  t.truthy(chores.length == 2);
  t.truthy(preferences.length == 4);


  //Want to delete the other chore made that doesn't have an assignment for it, so should actually delete it and its preferences
  chores = await Chore.find({});
  const res4 = await request(app).delete("/chore/delete/" + chores[1].id).expect(200);
  chores = await Chore.find({});
  preferences = await Preference.find({});
  t.truthy(chores.length == 1);
  t.truthy(preferences.length == 2);
});
