const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomUserSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true, ref: "Room"},
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User"}
});

RoomUserSchema.index({roomId: 1, userId: 1}, {unique: true}); //compound unique index

RoomUserSchema.statics.findByRoomId = async function(roomId){
    return await this.find({roomId: roomId});
}

RoomUserSchema.statics.findByUserId = async function(userId){
  return await this.find({userId: userId});
}


module.exports = mongoose.model("RoomUser", RoomUserSchema);
