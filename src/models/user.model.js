const mongoose = require("mongoose");
const admin = require("firebase-admin");
const RoomUser = require("./room_user.model");
const Schema = mongoose.Schema;
const usersSocket = new Map(); // key is UID, value is websocket instance

const UserSchema = new Schema({
  firebaseId: {
    type: String,
    required: true,
    max: 128,
    unique: true,
    index: true
  }
});

UserSchema.methods.getFirebaseUser = function() {
  return admin.auth().getUser(this.firebaseId);
};

UserSchema.methods.getRoommateIds = async function() {
  const userId = this._id;
  const roomUser = await RoomUser.findOne({ userId });
  const userIds = await RoomUser.getUserIdsByRoomId(roomUser.roomId);
  return userIds.filter(id => id.toString() !== userId.toString());
};

UserSchema.statics.getWebSocket = function(uid) {
  return usersSocket.get(uid.toString());
};

UserSchema.statics.setWebSocket = function(uid, ws) {
  usersSocket.set(uid.toString(), ws);
};

module.exports = mongoose.model("User", UserSchema);
