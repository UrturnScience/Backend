const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const app = require("../util/app");
const create_models = require("../util/create_models");

const User = require("../../src/models/user.model");
const Room = require("../../src/models/room.model");
const RoomUser = require("../../src/models/room_user.model");
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

test.serial("DELETE /room/delete/:id", async t => {
    const room = await create_models.create_room();
    const user1 = await create_models.create_user("123");
    const user2 = await create_models.create_user("324");
    await create_models.create_room_user(room.id, user1.id);
    await create_models.create_room_user(room.id, user2.id);

    //Since we want to delete all preferences and assignments associated with that user too
    const chore1 = await create_models.create_chore(room.id, "Dishes", 5);
    const chore2 = await create_models.create_chore(room.id, "Lawn", 10);

    const preference11 = await create_models.create_preference(chore1.id, user1.id, 5);
    const preference12 = await create_models.create_preference(chore2.id, user1.id, 3);

    const preference21 = await create_models.create_preference(chore1.id, user2.id, 5);
    const preference22 = await create_models.create_preference(chore2.id, user2.id, 3);

    const assignment1 = await create_models.create_assignment(chore1.id, user1.id);
    const assignment2 = await create_models.create_assignment(chore2.id, user2.id);

    let users = await User.find({});
    let rooms = await Room.find({});
    let roomUsers = await RoomUser.find({});
    let preferences = await Preference.find({});
    let assignments = await Assignment.find({});
    let chores = await Chore.find({});
    
    t.truthy(users.length == 2);
    t.truthy(rooms.length == 1);
    t.truthy(roomUsers.length == 2);
    t.truthy(preferences.length == 4);
    t.truthy(assignments.length == 2);
    t.truthy(chores.length == 2);


    //Attach user to room
    const req = await request(app).delete("/room/delete/" + room.id).expect(200);
    users = await User.find({});
    rooms = await Room.find({});
    roomUsers = await RoomUser.find({});
    preferences = await Preference.find({});
    assignments = await Assignment.find({});
    chores = await Chore.find({});
    
    t.truthy(users.length == 2);
    t.truthy(rooms.length == 0);
    t.truthy(roomUsers.length == 0);
    t.truthy(preferences.length == 0);
    t.truthy(assignments.length == 0);
    t.truthy(chores.length == 0);
});
