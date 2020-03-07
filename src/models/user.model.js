const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true, max: 100, unique: true },
  password: { type: String, required: true, max: 25 }
});


module.exports = mongoose.model("User", UserSchema);
