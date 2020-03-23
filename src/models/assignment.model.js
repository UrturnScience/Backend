const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AssignmentSchema = new Schema({
  active: { type: Boolean, default: true }, //used to determine if current assignment, or finished
  successful: {type: Boolean, default: false}, //used to track the history of a user's successful chores
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  choreId: {
    type: Schema.Types.ObjectId,
    ref: "Chore",
    index: true
  }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
