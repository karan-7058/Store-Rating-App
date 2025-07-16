const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true
   },
  email:{
    type: String,
    required: true,
    unique: true
  } ,
  password:{ 
    type: String,
    required: true
  },
  address: { 
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user", "storeowner"],
    default: "user",
    required: true
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
