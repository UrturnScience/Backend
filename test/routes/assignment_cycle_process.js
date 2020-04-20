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

test.serial("POST /assignment/retireAssignments", async (t) => {
  const user1 = await create_models.create_user("1");
  const user2 = await create_models.create_user("2");
  const user3 = await create_models.create_user("3");

  const room1 = await create_models.create_room();

  const ru1 = await create_models.create_room_user(room1.id, user1.id);
  const ru2 = await create_models.create_room_user(room1.id, user2.id);
  const ru3 = await create_models.create_room_user(room1.id, user3.id);

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

  t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room1.id));

  const res1 = await request(app)
    .post("/assignment/assignmentCycle")
    .expect(200);

  //Should have 4 assignments, 5 chores, 4 active, 2 upcoming,
  const assignments1 = await Assignment.find({});
  const activeAssignments1 = await Assignment.find({ active: true });
  const chores1 = await Chore.find({});
  const upcomingChores1 = await Chore.find({ upcoming: true });
  const activeChores1 = await Chore.find({ active: true });

  t.true(await PreferenceChecker.validateUserPreferencesByRoomId(room1.id));
  t.is(assignments1.length, 4);
  t.is(activeAssignments1.length, 4);
  t.is(chores1.length, 5);
  t.is(upcomingChores1.length, 2);
  t.is(activeChores1.length, 4);

  //PART 2

  const chore6 = await create_models.create_chore(room1.id, "CUPS"); //Upcoming, non recurring
  const preference61 = await create_models.create_preference(
    chore6.id,
    user1.id,
    53
  ); //Test preference checking/fixing
  const preference62 = await create_models.create_preference(
    chore6.id,
    user2.id,
    32
  );
  const preference63 = await create_models.create_preference(
    chore6.id,
    user3.id,
    23
  );

  const res2 = await request(app)
    .post("/assignment/assignmentCycle")
    .expect(200);

  //should have 7 assignments in total, 3 active, 7 nonsuccess, 6 chores, 2 upcoming, 3 inactive(2 upcoming are recurring)
  const assignments2 = await Assignment.find({});
  const inactiveAssignments2 = await Assignment.find({ active: false });
  const nonsuccessAssignments2 = await Assignment.find({ successful: false });
  const chores2 = await Chore.find({});
  const inactiveChores2 = await Chore.find({ active: false });
  const upcomingChores2 = await Chore.find({ upcoming: true });

  t.is(assignments2.length, 7);
  t.is(inactiveAssignments2.length, 4); //4 retired from last iteration
  t.is(nonsuccessAssignments2.length, 7); //6 nonsuccessful(default state)
  t.is(chores2.length, 6);
  t.is(inactiveChores2.length, 3);
  t.is(upcomingChores2.length, 2);
  t.true(await PreferenceChecker.validateUserPreferencesByRoomId(room1.id));
});
