const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomUserSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true, ref: "Room"},
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User"}
});

RoomUserSchema.index({room_id: 1, user_id: 1}, {unique: true}); //compound unique index

RoomUserSchema.statics.findByRoomId = async function(roomId){
    return await this.model.find({roomId: roomId});
}


module.exports = mongoose.model("RoomUser", RoomUserSchema);
