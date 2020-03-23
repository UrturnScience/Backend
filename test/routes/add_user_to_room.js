const test = require("ava");
const request = require("supertest");
const { dropDatabase, clearDatabase } = require("../util/database");
const app = require("../util/app");
const create_models = require("../util/create_models");

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

test.serial("POST /roomuser/add/:rid/:uid", async t => {
    const room = await create_models.create_room();
    const user = await create_models.create_user("123");

    //Attach user to room
    const req = await request(app).post("/roomuser/add/" + room.id + "/" + user.id).expect(200);
    const roomUsers = await RoomUser.find({});
    
    t.truthy(roomUsers.length == 1);
});
