const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  familyName: String,
  email: String,
  password: String
}, {
  timestamps: true
});

const User = mongoose.model("user-info", userSchema);

module.exports = User;