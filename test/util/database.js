const mongoose = require("mongoose");

function dropDatabase() {
  return mongoose.connection.db.dropDatabase();
}

module.exports = {
  dropDatabase
};
