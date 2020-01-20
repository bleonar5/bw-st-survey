const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const mturkSchema = new Schema({
  uniqueId: String,
  redemCode: String,
  status: String,
  windowWidth: Number,
  windowHeight: Number,
  browser: String, 
}, {
  timestamps: true
});

const Mturk = mongoose.model("redem-codes", mturkSchema);

module.exports = Mturk;