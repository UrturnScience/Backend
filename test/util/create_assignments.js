const test = require("ava");
const request = require("supertest");
const admin = require("firebase-admin");
const firebase = require("firebase");
const firebaseConfig = require("../../firebaseConfig.json");
const {
  clearUsers,
  setupCurrentUser,
  setupFirebaseClient
} = require("./firebase");
const { dropDatabase, clearDatabase } = require("./database");
const app = require("./app");
const create_models = require("./create_models");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");
const Preference = require("../../src/models/preference.model");
const RoomUser = require("../../src/models/room_user.model");
const Room = require("../../src/models/room.model");
const User = require("../../src/models/user.model");

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

test.serial(
  "POST /assignment/createAssignments",
  async t => {
    const user1 = await create_models.create_user("1");
    const user2 = await create_models.create_user("2");
    const user3 = await create_models.create_user("3");

    const room1 = await create_models.create_room();

    const ru1 = await create_models.create_room_user(room1.id, user1.id);
    const ru2 = await create_models.create_room_user(room1.id, user2.id);
    const ru3 = await create_models.create_room_user(room1.id, user3.id);

    const chore1 = await create_models.create_chore(room1.id, "Dishes", 5, recurring = true, upcoming = true, active= true);
    const chore2 = await create_models.create_chore(room1.id, "Laundry", 3, recurring = false);
    const chore3 = await create_models.create_chore(room1.id, "Mow", 8, recurring = false);
    const chore4 = await create_models.create_chore(room1.id, "Clean House", 13, recurring = true,  upcoming = true, active = false);
    //Doesn't need preferences, since it should be ignored since "not upcoming"
    const chore5 = await create_models.create_chore(room1.id, "Scrub", 15, recurring = true, upcoming = false, active = false);

    const preference11 = await create_models.create_preference(chore1.id, user1.id, 5);
    const preference12 = await create_models.create_preference(chore1.id, user2.id, 4);
    const preference13 = await create_models.create_preference(chore1.id, user3.id, 3);
    
    const preference21 = await create_models.create_preference(chore2.id, user1.id, 1);
    const preference22 = await create_models.create_preference(chore2.id, user2.id, 4);
    const preference23 = await create_models.create_preference(chore2.id, user3.id, 2);

    const preference31 = await create_models.create_preference(chore3.id, user1.id, 3);
    const preference32 = await create_models.create_preference(chore3.id, user2.id, 1);
    const preference33 = await create_models.create_preference(chore3.id, user3.id, 4);

    const preference41 = await create_models.create_preference(chore4.id, user1.id, 1);
    const preference42 = await create_models.create_preference(chore4.id, user2.id, 1);
    const preference43 = await create_models.create_preference(chore4.id, user3.id, 2);

    const res = await request(app)
      .post("/assignment/createAssignments")
      .expect(200);

    //Should have 4 assignments, 4 active chores, 2 upcoming chores, 3 not upcoming chores(retired)
    const assignments = await Assignment.find({});
    const activeChores = await Chore.find({active: true});
    const upcomingChores = await Chore.find({upcoming: true});
    const retiredChores = await Chore.find({upcoming: false});

    t.truthy(assignments.length == 4);
    t.truthy(activeChores.length == 4);
    t.truthy(upcomingChores.length == 2);
    t.truthy(retiredChores.length == 3);
  }
);

