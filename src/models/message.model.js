const mongoose = require("mongoose");

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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mesage", MessageSchema);
