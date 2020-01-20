const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const mturkUsedSchema = new Schema({
  uniqueId: String,
  redemCode: String,
  status: String,
  windowWidth: Number,
  windowHeight: Number,
  browser: String, 
}, {
  timestamps: true
});

const Mturkused = mongoose.model("redem-codes-used", mturkUsedSchema);

module.exports = Mturkused;