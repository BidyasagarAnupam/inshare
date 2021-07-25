require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  // Database connection 🥳
  console.log(`URL: ${process.env.MONGO_CONNECTION_URL}`);
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("Database Connected🥳🥳🥳");
    })
    .catch((err) => {
      console.log("Connection failed😢😢😢");
    });
}

module.exports = connectDB;
