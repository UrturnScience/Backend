const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: "string",
});

module.exports = mongoose.model("User", schema);
