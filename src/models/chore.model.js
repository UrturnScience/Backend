const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ChoreSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room",
    index: true,
  },
  name: { type: String, required: true, max: 50 },
  time: { type: Number, required: true, default: 0 },
  recurring: { type: Boolean, required: true, default: false }, //used to determine if should use chore on a weekly basis
  upcoming: { type: Boolean, default: true }, //used to determine if chore is to be used in the next week(should be in preferences list)
  active: { type: Boolean, default: false }, //used to determine if chore is currently being used in an active assignment
});

ChoreSchema.statics.getChoreIdsByRoomId = async function (roomId) {
  const choreIds = await this.find({ roomId: roomId }).distinct("_id");

  return choreIds;
};

module.exports = mongoose.model("Chore", ChoreSchema);
