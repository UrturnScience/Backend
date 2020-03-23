const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomUserSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true, ref: "Room", index: true},
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true
  }
});

RoomUserSchema.statics.getUserIdsByRoomId = async function(roomId){
  return await this.find({roomId: roomId}).distinct("userId");
}

module.exports = mongoose.model("RoomUser", RoomUserSchema);
