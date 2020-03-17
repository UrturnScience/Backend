const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const admin = require("firebase-admin");

const UserSchema = new Schema({
  firebaseId: {
    type: String,
    required: true,
    max: 128,
    unique: true,
    index: true
  }
});

UserSchema.methods.getFirebaseUser = function() {
  return admin.auth().getUser(this.firebaseId);
};

module.exports = mongoose.model("User", UserSchema);
