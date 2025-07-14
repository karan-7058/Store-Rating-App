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
 
// middleware for delete store when store owner is deleted
userSchema.post('deleteOne', { document: true, query: false }, async function (next) {
  

  if (this.role === 'storeowner') {
    const Store = require('./Store');
    const deleted = await Store.deleteMany({ owner: this._id });
    
  }

});


module.exports = mongoose.model("User", userSchema);
