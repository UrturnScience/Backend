const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PreferenceSchema = new Schema({
  choreId: { type: Schema.Types.ObjectId, required: true, ref: "Chore" },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  weight: { type: Number, required: true, default: 0 }
});

PreferenceSchema.index({ choreId: 1, userId: 1 }, { unique: true }); //compound unique index

module.exports = mongoose.model("Preference", PreferenceSchema);
