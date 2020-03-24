const test = require("ava");
const request = require("supertest");
const firebase = require("firebase");
const WebSocket = require('ws')

const {
  clearUsers,
  setupCurrentUser,
  setupFirebaseClient
} = require("../util/firebase");
const { dropDatabase } = require("../util/database");
const app = require("../util/app");

test.before(t => {
  setupFirebaseClient();
});

test.after(async t => {
  await dropDatabase();
});

test.beforeEach(async t => {
  await clearUsers();
});

test.afterEach(async t => {
  await clearUsers();
});

test.serial(
  "Authenticate with websocket and send message",
  async t => {
    await setupCurrentUser("test@test.com", "password");
    const token = await firebase.auth().currentUser.getIdToken();
    const agent = request.agent(app);

    await agent.post("/user/login").set("Authorization", token);
    const ws = new WebSocket("ws://localhost:" + process.env.NODE_PORT);

    const msgData = await new Promise((resolve, reject)=>{
      ws.on('open', function(){
        console.log('openned')
      })

      ws.on('message', function(data){
        resolve(data)
      })
    })
    console.log(msgData)
  }
);
