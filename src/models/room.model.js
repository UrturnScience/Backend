const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RoomSchema = new Schema({
  active: { type: Boolean, required: true, default: true },
  users: [{type: Schema.Types.ObjectId, ref: "User"}]
});

RoomSchema.methods.addUser = async function(userId){
    if (this.users.includes(userId) == false){
      await this.users.push(userId);
      await this.save();
    }
}

RoomSchema.methods.removeUser = async function(userId){
  await this.users.remove(userId);
  await this.save();
}

module.exports = mongoose.model("Room", RoomSchema);
