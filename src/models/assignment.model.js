const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AssignmentSchema = new Schema({
  completed: { type: Boolean, required: true, default: false },
  time: { type: Number, required: true },
  userId: {type: Schema.Types.ObjectId, ref: "User"},
  choreId: {type: Schema.Types.ObjectId, ref: "Chore"}
});


module.exports = mongoose.model("Assignment", AssignmentSchema);
