const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const { setupFirebaseClient } = require("../util/firebase");
const app = require("../util/app");
const create_models = require("../util/create_models");

const Assignment = require("../../src/models/assignment.model");

test.before((t) => {
  setupFirebaseClient();
});

test.after(async (t) => {
  await dropDatabase();
});

test.beforeEach(async (t) => {
  await clearDatabase();
});

test.afterEach(async (t) => {
  await clearDatabase();
});

test.serial("PUT /assignment/successful/:id", async (t) => {
  const user = await create_models.create_user("123");
  const room = await create_models.create_room();
  const chore = await create_models.create_chore(room.id, "Hello", 5);

  let assignment1 = await create_models.create_assignment(chore.id, user.id);
  assignment1.successful = true;
  assignment1.save(); //active = false

  let assignment2 = await create_models.create_assignment(chore.id, user.id); //successful == false

  const res1 = await request(app)
    .put("/assignment/successful/" + assignment1.id)
    .expect(200);

  const res2 = await request(app)
    .put("/assignment/successful/" + assignment2.id)
    .expect(200);

  //Can't use previous model objects, since not in sync with db
  assignment1 = await Assignment.findOne({ _id: assignment1.id });
  assignment2 = await Assignment.findOne({ _id: assignment2.id });

  t.is(assignment1.successful, false);
  t.is(assignment2.successful, true);
});

test.serial("POST /assignment/report/:id", async (t) => {
  const user = await create_models.create_user("123");
  const room = await create_models.create_room();
  const roomUser = await create_models.create_room_user(room._id, user._id);
  const chore = await create_models.create_chore(room.id, "Hello", 5);

  let assignment1 = await create_models.create_assignment(chore.id, user.id);
  assignment1.successful = true;
  assignment1.save(); //active = false

  const res1 = await request(app)
    .post("/assignment/report/" + assignment1.id)
    .send({ status: "late" })
    .expect(200);
  const res2 = await request(app)
    .post("/assignment/report/" + assignment1.id)
    .send({ status: "wrong" })
    .expect(200);

  t.pass();
});
