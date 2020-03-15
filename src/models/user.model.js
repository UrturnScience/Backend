const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, max: 100, unique: true },
  firebaseId: {
    type: String,
    required: true,
    max: 128,
    unique: true,
    index: true
  }
});

module.exports = mongoose.model("User", UserSchema);
