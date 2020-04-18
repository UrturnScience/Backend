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
    index: true,
  },
  // TODO: limit size of push tokens
  expoPushTokens: [String], 
});

UserSchema.methods.getFirebaseUser = function () {
  return admin.auth().getUser(this.firebaseId);
};

UserSchema.methods.getRoommateIds = async function () {
  const roomId = await this.getRoomId();
  const userIds = await RoomUser.getUserIdsByRoomId(roomId);

  return userIds;
};

UserSchema.methods.getRoomId = async function () {
  const roomUser = await RoomUser.findOne({ userId: this._id });
  return roomUser.roomId;
};

UserSchema.statics.getWebSocket = function (uid) {
  return usersSocket.get(uid.toString());
};

UserSchema.statics.setWebSocket = function (uid, ws) {
  usersSocket.set(uid.toString(), ws);
};

UserSchema.statics.destroyWebSocket = function (uid) {
  const ws = usersSocket.get(uid.toString());
  if (ws) {
    ws.close();
    usersSocket.delete(uid.toString());
  }
};

module.exports = mongoose.model("User", UserSchema);
