const mongoose = require("mongoose");

function setupDB() {
  const options = {
    autoIndex: true,
    autoCreate: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  };

  if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
    options.auth = {
      user: process.env.MONGODB_USERNAME,
      pass: process.env.MONGODB_PASSWORD
    };
  }

  if (process.env.MONGODB_CONNECT_STRING) {
    return mongoose.connect(process.env.MONGODB_CONNECT_STRING, options);
  } else {
    return mongoose.connect(
      `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}`,
      options
    );
  }
}

module.exports = { setupDB };
