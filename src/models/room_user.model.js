const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomUserSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true},
  userId: { type: Schema.Types.ObjectId, required: true}
});

RoomUserSchema.index({room_id: 1, user_id: 1}, {unique: true});

RoomUserSchema.statics.findByRoom = async function(roomId){
    return await this.model.find({roomId: roomId});
}


module.exports = mongoose.model("User", UserSchema);
