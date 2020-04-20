const admin = require("firebase-admin");
const firebase = require("firebase");
const firebaseConfig = require("../../firebaseConfig.json");
const User = require("../../src/models/user.model");

function setupFirebaseClient() {
  firebase.initializeApp(firebaseConfig);
}

async function setupCurrentUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  const user = new User({
    firebaseId: firebase.auth().currentUser.uid
  });
  await user.save();

  return user;
}

async function clearUsers() {
  const { users } = await admin.auth().listUsers();
  await Promise.all(users.map(user => admin.auth().deleteUser(user.uid)));
}

async function createUser(email, password) {}

module.exports = {
  setupCurrentUser,
  setupFirebaseClient,
  clearUsers
};
