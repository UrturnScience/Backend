const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const app = require("../util/app");
const create_models = require("../util/create_models");
const PreferenceChecker = require("../util/preference_checker");

const RoomUser = require("../../src/models/room_user.model");
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

test.serial("POST /roomuser/add/:rid/:uid", async t => {
    const room = await create_models.create_room();

    const chore1 = await create_models.create_chore(room.id, "Dishes", 5, true, true, false);
    const chore2 = await create_models.create_chore(room.id, "Laundry", 5, true, true, false);
    const chore3 = await create_models.create_chore(room.id, "Dog", 5, true, upcoming = false, false);
    
    const user = await create_models.create_user("123");

    //Attach user to room
    const req = await request(app).post("/roomuser/add/" + room.id + "/" + user.id).expect(200);
    const roomUsers = await RoomUser.find({});
    
    //Check that the user was indeed added to the room
    t.truthy(roomUsers.length == 1);

    //Want to check that the preferences were properly added for the user
    const preferences = await Preference.find({userId: user.id});
    t.truthy(preferences.length == 3);
    t.truthy(await PreferenceChecker.validateUserPreferencesByRoomId(room.id));
    t.truthy(await PreferenceChecker.getNumberOfUpcomingChores(room.id) == 2);
});
