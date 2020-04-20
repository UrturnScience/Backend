const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const { setupFirebaseClient } = require("../util/firebase");
const app = require("../util/app");
const create_models = require("../util/create_models");
const PreferenceChecker = require("../util/preference_checker");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");

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

test.serial("GET advanced gets for assignment/chore/preferences", async (t) => {
  //Create initial db entries
  const user1 = await create_models.create_user("1");
  const user2 = await create_models.create_user("2");
  const user3 = await create_models.create_user("3");

  const room1 = await create_models.create_room();

  const ru1 = await create_models.create_room_user(room1.id, user1.id);
  const ru2 = await create_models.create_room_user(room1.id, user2.id);
  const ru3 = await create_models.create_room_user(room1.id, user3.id);

  //4 upcoming, 1 non upcoming
  const chore1 = await create_models.create_chore(
    room1.id,
    "Dishes",
    5,
    (recurring = true),
    (upcoming = true)
  );
  const chore2 = await create_models.create_chore(
    room1.id,
    "Laundry",
    3,
    (recurring = false),
    (upcoming = true)
  );
  const chore3 = await create_models.create_chore(
    room1.id,
    "Mow",
    8,
    (recurring = false),
    (upcoming = true)
  );
  const chore4 = await create_models.create_chore(
    room1.id,
    "Clean House",
    13,
    (recurring = true),
    (upcoming = true)
  );
  const chore5 = await create_models.create_chore(
    room1.id,
    "Scrub",
    15,
    (recurring = true),
    (upcoming = false)
  );

  const preference11 = await create_models.create_preference(
    chore1.id,
    user1.id,
    0
  );
  const preference12 = await create_models.create_preference(
    chore1.id,
    user2.id,
    3
  );
  const preference13 = await create_models.create_preference(
    chore1.id,
    user3.id,
    1
  );

  const preference21 = await create_models.create_preference(
    chore2.id,
    user1.id,
    1
  );
  const preference22 = await create_models.create_preference(
    chore2.id,
    user2.id,
    2
  );
  const preference23 = await create_models.create_preference(
    chore2.id,
    user3.id,
    3
  );

  const preference31 = await create_models.create_preference(
    chore3.id,
    user1.id,
    3
  );
  const preference32 = await create_models.create_preference(
    chore3.id,
    user2.id,
    1
  );
  const preference33 = await create_models.create_preference(
    chore3.id,
    user3.id,
    2
  );

  const preference41 = await create_models.create_preference(
    chore4.id,
    user1.id,
    2
  );
  const preference42 = await create_models.create_preference(
    chore4.id,
    user2.id,
    0
  );
  const preference43 = await create_models.create_preference(
    chore4.id,
    user3.id,
    0
  );

  const preference51 = await create_models.create_preference(
    chore5.id,
    user1.id,
    2
  );
  const preference52 = await create_models.create_preference(
    chore5.id,
    user2.id,
    0
  );
  const preference53 = await create_models.create_preference(
    chore5.id,
    user3.id,
    0
  );

  //Ensures that preferences are in the correct order
  t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room1.id));

  //Check get routes
  const res_upcomingChores1 = await request(app)
    .get("/chore/upcoming/" + room1.id)
    .expect(200);
  const res_activeChores1 = await request(app)
    .get("/chore/active/" + room1.id)
    .expect(200);
  const res_inactiveAssignments11 = await request(app)
    .get("/assignment/inactive/" + user1.id)
    .expect(200);
  const res_activeAssignments11 = await request(app)
    .get("/assignment/active/" + user1.id)
    .expect(200);
  const res_inactiveAssignments12 = await request(app)
    .get("/assignment/inactive/" + user2.id)
    .expect(200);
  const res_activeAssignments12 = await request(app)
    .get("/assignment/active/" + user2.id)
    .expect(200);
  const res_preferences11 = await request(app)
    .get("/preference/upcoming/" + user1.id)
    .expect(200);

  t.is(res_upcomingChores1.body.chores.length, 4);
  t.is(res_activeChores1.body.chores.length, 0);
  t.is(res_inactiveAssignments11.body.assignments.length, 0);
  t.is(res_activeAssignments11.body.assignments.length, 0);
  t.is(res_inactiveAssignments12.body.assignments.length, 0);
  t.is(res_activeAssignments12.body.assignments.length, 0);
  t.is(res_preferences11.body.preferences.length, 4);

  const res1 = await request(app)
    .post("/assignment/createAssignments")
    .expect(200);

  //Should have 4 assignments, 5 chores, 4 active, 2 upcoming,
  const assignments1 = await Assignment.find({});
  const activeAssignments1 = await Assignment.find({ active: true });
  const chores1 = await Chore.find({});
  const upcomingChores1 = await Chore.find({ upcoming: true });
  const activeChores1 = await Chore.find({ active: true });

  //Check to make sure that assignment creator works
  t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room1.id));
  t.truthy(assignments1.length == 4);
  t.truthy(activeAssignments1.length == 4);
  t.truthy(chores1.length == 5);
  t.truthy(upcomingChores1.length == 2);
  t.truthy(activeChores1.length == 4);

  //Check get routes again
  const res_upcomingChores2 = await request(app)
    .get("/chore/upcoming/" + room1.id)
    .expect(200);
  const res_activeChores2 = await request(app)
    .get("/chore/active/" + room1.id)
    .expect(200);
  const res_inactiveAssignments21 = await request(app)
    .get("/assignment/inactive/" + user1.id)
    .expect(200);
  const res_activeAssignments21 = await request(app)
    .get("/assignment/active/" + user1.id)
    .expect(200);
  const res_inactiveAssignments22 = await request(app)
    .get("/assignment/inactive/" + user2.id)
    .expect(200);
  const res_activeAssignments22 = await request(app)
    .get("/assignment/active/" + user2.id)
    .expect(200);
  const res_preferences21 = await request(app)
    .get("/preference/upcoming/" + user1.id)
    .expect(200);

  t.is(res_upcomingChores2.body.chores.length, 2);
  t.is(res_activeChores2.body.chores.length, 4);
  t.truthy(res_inactiveAssignments21.body.assignments.length == 0);
  t.truthy(res_activeAssignments21.body.assignments.length >= 1);
  t.truthy(res_inactiveAssignments22.body.assignments.length == 0);
  t.truthy(res_activeAssignments22.body.assignments.length >= 1);
  t.is(res_preferences21.body.preferences.length, 2);

  ///Retiring assignments
  const res2 = await request(app)
    .put("/assignment/retireAssignments")
    .expect(200);

  //should have 4 assignments, 4 inactive assignments, 4 nonsuccesful, 5 chores, 5 inactive chores, 2 upcoming
  const assignments2 = await Assignment.find({});
  const inactiveAssignments2 = await Assignment.find({ active: false });
  const nonsuccessAssignments2 = await Assignment.find({ successful: false });
  const chores2 = await Chore.find({});
  const inactiveChores2 = await Chore.find({ active: false });
  const upcomingChores2 = await Chore.find({ upcoming: true });

  t.truthy(assignments2.length == 4);
  t.truthy(inactiveAssignments2.length == 4);
  t.truthy(nonsuccessAssignments2.length == 4);
  t.truthy(chores2.length == 5);
  t.truthy(inactiveChores2.length == 5);
  t.truthy(upcomingChores2.length == 2);
  t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room1.id));

  //Check get routes again
  const res_upcomingChores3 = await request(app)
    .get("/chore/upcoming/" + room1.id)
    .expect(200);
  const res_activeChores3 = await request(app)
    .get("/chore/active/" + room1.id)
    .expect(200);
  const res_inactiveAssignments31 = await request(app)
    .get("/assignment/inactive/" + user1.id)
    .expect(200);
  const res_activeAssignments31 = await request(app)
    .get("/assignment/active/" + user1.id)
    .expect(200);
  const res_inactiveAssignments32 = await request(app)
    .get("/assignment/inactive/" + user2.id)
    .expect(200);
  const res_activeAssignments32 = await request(app)
    .get("/assignment/active/" + user2.id)
    .expect(200);
  const res_preferences31 = await request(app)
    .get("/preference/upcoming/" + user1.id)
    .expect(200);

  t.is(res_upcomingChores3.body.chores.length, 2);
  t.is(res_activeChores3.body.chores.length, 0);
  t.truthy(res_inactiveAssignments31.body.assignments.length >= 1);
  t.truthy(res_activeAssignments31.body.assignments.length == 0);
  t.truthy(res_inactiveAssignments32.body.assignments.length >= 1);
  t.truthy(res_activeAssignments32.body.assignments.length == 0);
  t.is(res_preferences31.body.preferences.length, 2);
});
