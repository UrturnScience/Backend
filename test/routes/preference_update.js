const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const app = require("../util/app");
const create_models = require("../util/create_models");
const PreferenceChecker = require("../util/preference_checker");

const Preference = require("../../src/models/preference.model");
const RoomUser = require("../../src/models/room_user.model");

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
  const chore1 = await create_models.create_chore(room.id, "Dishes", 5);
  const chore2 = await create_models.create_chore(room.id, "Laundry", 5);
  await create_models.create_room_user(room.id, user.id);

  const preference1 = await create_models.create_preference(chore1.id, user.id, 0);
  const preference2 = await create_models.create_preference(chore2.id, user.id, 1);

  const updatedPreferencesList = [];
  updatedPreferencesList.push(preference2.id);
  updatedPreferencesList.push(preference1.id)

  body = {
    preferenceIds: updatedPreferencesList
  }
  const res= await request(app).put("/preference/update/" + user.id).send(body).expect(200);

  const updatedPreference1 = await Preference.findOne({_id: preference1.id});
  const updatedPreference2 = await Preference.findOne({_id: preference2.id});

  t.true(updatedPreference1.weight == 1);
  t.true(updatedPreference2.weight == 0);
  t.true(await PreferenceChecker.validateUserPreferencesByRoomId(room.id));
});
