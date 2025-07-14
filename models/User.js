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
 

userSchema.post('deleteOne', { document: true, query: false }, async function(doc, next) {
  if (doc.role === 'storeowner') {
    const Store = require('./Store');
    await Store.deleteMany({ owner: doc._id });
    console.log(`Deleted stores for storeowner: ${doc.name}`);
  }
  next();
});


module.exports = mongoose.model("User", userSchema);
