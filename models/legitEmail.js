const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const legitEmailSchema = new Schema({
  uniqueId: String,
  emailPopulated : String,
  status: String, 
}, {
  timestamps: true
});

const LegitEmail = mongoose.model("legit-emails", legitEmailSchema);

module.exports = LegitEmail;