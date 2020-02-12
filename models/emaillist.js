// Had to change name as Heroku could not find file

const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const LegitEmailSchema = new Schema({
  uniqueId: String,
  emailPopulated : String,
  status: String, 
}, {
  timestamps: true
});

const LegitEmail = mongoose.model("legit-emails", LegitEmailSchema);

module.exports = LegitEmail;