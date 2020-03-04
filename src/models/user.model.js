const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 25 },
  rooms: [{type: Schema.Types.ObjectId, ref: "Room", unique:true}]
});

UserSchema.methods.addRoom = async function(roomId){
  await this.rooms.push(roomId);
  await this.save();
}

module.exports = mongoose.model("User", UserSchema);
