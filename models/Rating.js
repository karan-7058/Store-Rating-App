const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  value: Number
});

module.exports = mongoose.model("Rating", ratingSchema);
