const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const app = require("../util/app");
const create_models = require("../util/create_models");
const PreferenceChecker = require("../util/preference_checker");
const { clearUsers, setupFirebaseClient } = require("../util/firebase");
const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const RoomUser = require("../../src/models/room_user.model");
const User = require("../../src/models/user.model");
const Room = require("../../src/models/room.model");
const Preference = require("../../src/models/preference.model");

test.before((t) => {
  setupFirebaseClient();
});

test.after(async (t) => {
  await dropDatabase();
  await clearUsers();
});

test.beforeEach(async (t) => {
  await clearDatabase();
});

test.afterEach(async (t) => {
  await clearDatabase();
});

test.serial("POST /roomuser/add/:rid/:uid", async (t) => {
  const room = await create_models.create_room();

  const chore1 = await create_models.create_chore(
    room.id,
    "Dishes",
    5,
    true,
    true,
    false
  );
  const chore2 = await create_models.create_chore(
    room.id,
    "Laundry",
    5,
    true,
    true,
    false
  );
  const chore3 = await create_models.create_chore(
    room.id,
    "Dog",
    5,
    true,
    (upcoming = false),
    false
  );

  const user = await create_models.create_user("123");

  //Attach user to room
  const req = await request(app)
    .post("/roomuser/add/" + room.id + "/" + user.id)
    .expect(200);
  const roomUsers = await RoomUser.find({});

  //Check that the user was indeed added to the room
  t.truthy(roomUsers.length == 1);

  //Want to check that the preferences were properly added for the user
  const preferences = await Preference.find({ userId: user.id });
  t.truthy(preferences.length == 3);
  t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room.id));
  t.truthy((await PreferenceChecker.getNumberOfUpcomingChores(room.id)) == 2);
});

test.serial("DELETE /roomuser/delete/:uid", async (t) => {
  const room = await create_models.create_room();
  const user = await create_models.create_user("123");
  await create_models.create_room_user(room.id, user.id);

  //Since we want to delete all preferences and assignments associated with that user too
  const chore1 = await create_models.create_chore(room.id, "Dishes", 5);
  const chore2 = await create_models.create_chore(room.id, "Lawn", 10);

  const preference1 = await create_models.create_preference(
    chore1.id,
    user.id,
    0
  );
  const preference2 = await create_models.create_preference(
    chore2.id,
    user.id,
    1
  );

  const assignment1 = await create_models.create_assignment(chore1.id, user.id);
  const assignment2 = await create_models.create_assignment(chore2.id, user.id);

  //Attach user to room
  const req = await request(app)
    .delete("/roomuser/delete/" + user.id)
    .expect(200);
  const users = await User.find({});
  const rooms = await Room.find({});
  const roomUsers = await RoomUser.find({});
  const preferences = await Preference.find({});
  const assignments = await Assignment.find({});
  const chores = await Chore.find({});

  t.truthy(users.length == 1);
  t.truthy(rooms.length == 1);
  t.truthy(roomUsers.length == 0);
  t.truthy(preferences.length == 0);
  t.truthy(assignments.length == 0);
  t.truthy(chores.length == 2);
});
