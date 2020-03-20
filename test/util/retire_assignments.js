const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("./database");
const app = require("./app");
const create_models = require("./create_models");

const Assignment = require("../../src/models/assignment.model");
const Chore = require("../../src/models/chore.model");

test.before(t => {
  ;
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
  "POST /assignment/retireAssignments",
  async t => {
    const user1 = await create_models.create_user("1");
    const user2 = await create_models.create_user("2");
    const user3 = await create_models.create_user("3");

    const room1 = await create_models.create_room();

    const ru1 = await create_models.create_room_user(room1.id, user1.id);
    const ru2 = await create_models.create_room_user(room1.id, user2.id);
    const ru3 = await create_models.create_room_user(room1.id, user3.id);

    const chore1 = await create_models.create_chore(room1.id, "Dishes", 5, recurring = true, upcoming = true, active= true);
    const chore2 = await create_models.create_chore(room1.id, "Laundry", 3, recurring = false, upcoming = false, active = true);
    const chore3 = await create_models.create_chore(room1.id, "Mow", 8, recurring = false, upcoming = false, active = true);
    const chore4 = await create_models.create_chore(room1.id, "Clean House", 13, recurring = true,  upcoming = true, active = true);
    const chore5 = await create_models.create_chore(room1.id, "Scrub", 15, recurring = true, upcoming = false, active = true);
    const chore6 = await create_models.create_chore(room1.id, "Inactive", 12, recurring = false, upcoming = true, active = false);

    const assignment1 = await create_models.create_assignment(chore1.id, user1.id);
    assignment1.successful = true;
    assignment1.save();
    const assignment2 = await create_models.create_assignment(chore2.id, user1.id);
    const assignment3 = await create_models.create_assignment(chore3.id, user2.id);
    const assignment4 = await create_models.create_assignment(chore4.id, user3.id);
    const assignment5 = await create_models.create_assignment(chore5.id, user3.id);

    const res = await request(app)
      .put("/assignment/retireAssignments")
      .expect(200);

    //Should have 5 assignments, 5 inactive assignments, 4 nonsuccessful assignments, 1 successful assignment,  6 chores, 6 inactive chores
    const assignments = await Assignment.find({});
    const inactiveAssignments = await Assignment.find({active: false});
    const nonsuccessAssignments = await Assignment.find({successful: false});
    const chores = await Chore.find({});
    const inactiveChores = await Chore.find({active: false});

    t.truthy(assignments.length == 5);
    t.truthy(inactiveAssignments.length == 5);
    t.truthy(nonsuccessAssignments.length == 4);
    t.truthy(chores.length == 6);
    t.truthy(inactiveChores.length == 6);
  }
);
