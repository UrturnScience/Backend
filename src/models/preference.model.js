const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Chore = require("../models/chore.model");

let PreferenceSchema = new Schema({
  choreId: { type: Schema.Types.ObjectId, required: true, ref: "Chore" },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  weight: { type: Number, required: true, default: 1000 }
});

PreferenceSchema.index({ choreId: 1, userId: 1 }, { unique: true }); //compound unique index

PreferenceSchema.statics.findByRoomId = async function(roomId) {
  const chores = await Chore.find({ roomId: roomId });
  let choreIds = []; //get the userIds contained within the room
  for (var i = 0; i < chores.length; i++) {
    choreIds.push(chores[i].get("_id"));
  }

  return this.find({
    choreId: {
      $in: choreIds
    }
  });
};

module.exports = mongoose.model("Preference", PreferenceSchema);
