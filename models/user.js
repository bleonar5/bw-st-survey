const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  familyName: String,
  email: String,
  password: String
}, {
  timestamps: true
});

const User = mongoose.model("user-info", UserSchema);

module.exports = User;