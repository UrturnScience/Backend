const test = require("ava");
const express = require("express");
const request = require("supertest");
const admin = require("firebase-admin");
const firebase = require("firebase");
const firebaseConfig = require("../../firebaseConfig.json");
const {
  clearUsers,
  setupCurrentUser,
  setupFirebaseClient
} = require("../util/firebase");
const app = require("../../index");

test.before(async t => {
  setupFirebaseClient();
});

test.beforeEach(async t => {
  await clearUsers();
});

test.afterEach(async t => {
  await clearUsers();
});

test.serial("POST user/login should provide session credentials on successful login", async t => {
  await setupCurrentUser("test@test.com", "password");
  const token = await firebase.auth().currentUser.getIdToken();

  const res = await request(app)
    .post("/user/login")
    .set("Authorization", token)
    .expect(200);

  t.truthy(res.header['set-cookie']);
});
