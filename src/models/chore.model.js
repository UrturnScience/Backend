const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let ChoreSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true, ref: "Room" },
  name: { type: String, required: true, max: 50 },
  time: { type: Number, required: true },
  recurring: { type: Boolean, required: true, default: false }
});




module.exports = mongoose.model("Chore", ChoreSchema);
