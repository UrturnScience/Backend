const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomUserSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User", unique: true }
});


RoomUserSchema.statics.findByRoomId = function(roomId){
  return this.find({ roomId: roomId })
};

RoomUserSchema.statics.findByUserId = function(userId) {
  return this.find({ userId: userId });
};

module.exports = mongoose.model("RoomUser", RoomUserSchema);
