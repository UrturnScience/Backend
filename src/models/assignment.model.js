const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AssignmentSchema = new Schema({
  completed: { type: Boolean, required: true, default: false },
  userId: {type: Schema.Types.ObjectId, ref: "User"},
  choreId: {type: Schema.Types.ObjectId, ref: "Chore"}
});

AssignmentSchema.index({ choreId: 1, userId: 1 }, { unique: true }); //compound unique index

module.exports = mongoose.model("Assignment", AssignmentSchema);
