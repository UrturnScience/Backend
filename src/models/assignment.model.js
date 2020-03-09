const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AssignmentSchema = new Schema({
  completed: { type: Boolean, required: true, default: false },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  choreId: {
    type: Schema.Types.ObjectId,
    ref: "Chore",
    unique: true,
    index: true
  }
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
