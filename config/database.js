const mongoose = require("mongoose");

const database = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Database connected: ${conn.connection.host}`);
  });
};

module.exports = database;
