const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  role: {
    type: String,
    enum: ["admin", "user", "storeowner"],
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);
