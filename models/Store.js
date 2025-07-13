const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Store", storeSchema);
