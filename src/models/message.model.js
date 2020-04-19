const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    data: {
      type: String,
      required: true
    },
    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true
    },
    newMessageCount:{
      type: Number,
      required: true

    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mesage", MessageSchema);
