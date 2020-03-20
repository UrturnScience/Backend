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

test.serial("PUT /preference/update/:id/:weight", async t => {
  const user = await create_models.create_user("123");
  const room = await create_models.create_room();
  const chore = await create_models.create_chore(room.id, "Dishes", 5);
  const preference = await create_models.create_preference(chore.id, user.id, 3);

  const res= await request(app).put("/preference/update/" + preference.id + "/" + 5).expect(200);

  const updatedPreference = await Preference.findOne({_id: preference.id});
  t.truthy(updatedPreference.weight == 5);
});
